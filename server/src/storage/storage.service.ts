import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Client } from 'minio'
import { createReadStream } from 'fs'
import {
	copy,
	ensureDir,
	pathExists,
	readdir,
	stat,
	unlink,
	writeFile
} from 'fs-extra'
import { lookup as getMimeType } from 'mime-types'
import * as path from 'path'
import { path as appRootPath } from 'app-root-path'
import { StorageObjectMetadata, StorageStreamOptions } from './storage.types'

type StorageDriver = 'local' | 'minio'

@Injectable()
export class StorageService implements OnModuleInit {
	private readonly logger = new Logger(StorageService.name)
	private readonly driver: StorageDriver
	private readonly uploadsRoot = path.join(appRootPath, 'uploads')
	private readonly bucketName: string
	private readonly shouldSyncLocalUploads: boolean
	private readonly minioClient?: Client

	constructor(private readonly configService: ConfigService) {
		this.driver = this.configService.get<StorageDriver>('STORAGE_DRIVER', 'local')
		this.bucketName = this.configService.get<string>(
			'MINIO_BUCKET',
			'max-video-media'
		)
		this.shouldSyncLocalUploads = this.configService.get<string>(
			'STORAGE_SYNC_LOCAL_UPLOADS',
			'false'
		) === 'true'

		if (this.driver === 'minio') {
			this.minioClient = new Client({
				endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
				port: Number(this.configService.get<string>('MINIO_PORT', '9000')),
				useSSL:
					this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true',
				accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', ''),
				secretKey: this.configService.get<string>('MINIO_SECRET_KEY', '')
			})
		}
	}

	async onModuleInit() {
		await ensureDir(this.uploadsRoot)

		if (this.driver !== 'minio' || !this.minioClient) {
			return
		}

		const bucketExists = await this.minioClient.bucketExists(this.bucketName)
		if (!bucketExists) {
			await this.minioClient.makeBucket(this.bucketName)
			this.logger.log(`Created MinIO bucket "${this.bucketName}"`)
		}

		if (this.shouldSyncLocalUploads) {
			await this.syncDirectoryToStorage(this.uploadsRoot)
		}
	}

	async saveBuffer(
		objectKey: string,
		buffer: Buffer,
		contentType?: string
	): Promise<void> {
		if (this.driver === 'minio' && this.minioClient) {
			await this.minioClient.putObject(this.bucketName, objectKey, buffer, buffer.length, {
				'Content-Type': contentType || this.resolveContentType(objectKey)
			})
			return
		}

		const targetPath = this.resolveLocalPath(objectKey)
		await ensureDir(path.dirname(targetPath))
		await writeFile(targetPath, buffer)
	}

	async saveFile(
		sourcePath: string,
		objectKey: string,
		contentType?: string
	): Promise<void> {
		if (this.driver === 'minio' && this.minioClient) {
			await this.minioClient.fPutObject(this.bucketName, objectKey, sourcePath, {
				'Content-Type': contentType || this.resolveContentType(objectKey)
			})
			return
		}

		const targetPath = this.resolveLocalPath(objectKey)
		await ensureDir(path.dirname(targetPath))
		await copy(sourcePath, targetPath)
	}

	async getObjectMetadata(objectKey: string): Promise<StorageObjectMetadata | null> {
		if (this.driver === 'minio' && this.minioClient) {
			try {
				const stat = await this.minioClient.statObject(this.bucketName, objectKey)
				return {
					size: stat.size,
					contentType:
						stat.metaData?.['content-type'] || this.resolveContentType(objectKey),
					lastModified: stat.lastModified
				}
			} catch {
				return null
			}
		}

		const targetPath = this.resolveLocalPath(objectKey)
		if (!(await pathExists(targetPath))) {
			return null
		}

		const fileStat = await stat(targetPath)
		return {
			size: fileStat.size,
			contentType: this.resolveContentType(objectKey),
			lastModified: fileStat.mtime
		}
	}

	async getObjectStream(objectKey: string, options?: StorageStreamOptions) {
		if (this.driver === 'minio' && this.minioClient) {
			if (options?.start !== undefined) {
				const length =
					options.end !== undefined ? options.end - options.start + 1 : undefined
				return this.minioClient.getPartialObject(
					this.bucketName,
					objectKey,
					options.start,
					length
				)
			}

			return this.minioClient.getObject(this.bucketName, objectKey)
		}

		return createReadStream(this.resolveLocalPath(objectKey), {
			start: options?.start,
			end: options?.end
		})
	}

	async removeLocalTempFile(filePath: string) {
		if (await pathExists(filePath)) {
			await unlink(filePath)
		}
	}

	private async syncDirectoryToStorage(directory: string, prefix = ''): Promise<void> {
		const entries = await readdir(directory, { withFileTypes: true })

		for (const entry of entries) {
			if (entry.name.startsWith('.')) {
				continue
			}

			const fullPath = path.join(directory, entry.name)
			const objectKey = prefix ? `${prefix}/${entry.name}` : entry.name

			if (entry.isDirectory()) {
				await this.syncDirectoryToStorage(fullPath, objectKey)
				continue
			}

			const exists = await this.getObjectMetadata(objectKey)
			if (exists) {
				continue
			}

			await this.saveFile(fullPath, objectKey)
		}
	}

	private resolveLocalPath(objectKey: string) {
		return path.join(this.uploadsRoot, objectKey)
	}

	private resolveContentType(objectKey: string) {
		return getMimeType(objectKey) || 'application/octet-stream'
	}
}
