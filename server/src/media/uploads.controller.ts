import { StorageService } from '@/storage/storage.service'
import {
	Controller,
	Get,
	HttpStatus,
	NotFoundException,
	Param,
	Req,
	Res
} from '@nestjs/common'
import { Request, Response } from 'express'

@Controller('uploads')
export class UploadsController {
	constructor(private readonly storageService: StorageService) {}

	@Get()
	getAll(@Res() res: Response) {
		res
			.status(HttpStatus.FORBIDDEN)
			.send('Access to this directory is forbidden')
	}

	@Get('index.html')
	getAllByIndexHtml(@Res() res: Response) {
		res
			.status(HttpStatus.FORBIDDEN)
			.send('Access to this directory is forbidden')
	}

	@Get(':folder/:fileName')
	async getFile(
		@Param('folder') folder: string,
		@Param('fileName') fileName: string,
		@Req() req: Request,
		@Res() res: Response
	) {
		return this.streamObject(`${folder}/${fileName}`, req, res)
	}

	@Get(':folder/:resolution/:fileName')
	async getFileByResolution(
		@Param('folder') folder: string,
		@Param('resolution') resolution: string,
		@Param('fileName') fileName: string,
		@Req() req: Request,
		@Res() res: Response
	) {
		return this.streamObject(`${folder}/${resolution}/${fileName}`, req, res)
	}

	private async streamObject(
		objectKey: string,
		req: Request,
		res: Response
	) {
		const metadata = await this.storageService.getObjectMetadata(objectKey)

		if (!metadata) {
			throw new NotFoundException('File not found')
		}

		res.setHeader('Accept-Ranges', 'bytes')
		res.setHeader('Content-Type', metadata.contentType || 'application/octet-stream')

		if (metadata.lastModified) {
			res.setHeader('Last-Modified', metadata.lastModified.toUTCString())
		}

		const range = req.headers.range
		if (range) {
			const parsedRange = this.parseRange(range, metadata.size)
			if (!parsedRange) {
				res.setHeader('Content-Range', `bytes */${metadata.size}`)
				return res.sendStatus(HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE)
			}

			const { start, end } = parsedRange
			const stream = await this.storageService.getObjectStream(objectKey, {
				start,
				end
			})

			res.status(HttpStatus.PARTIAL_CONTENT)
			res.setHeader('Content-Length', end - start + 1)
			res.setHeader('Content-Range', `bytes ${start}-${end}/${metadata.size}`)

			return stream.pipe(res)
		}

		const stream = await this.storageService.getObjectStream(objectKey)
		res.setHeader('Content-Length', metadata.size)
		return stream.pipe(res)
	}

	private parseRange(rangeHeader: string, size: number) {
		const matches = /bytes=(\d*)-(\d*)/.exec(rangeHeader)
		if (!matches) {
			return null
		}

		const [, startValue, endValue] = matches
		let start = startValue ? Number(startValue) : 0
		let end = endValue ? Number(endValue) : size - 1

		if (Number.isNaN(start) || Number.isNaN(end)) {
			return null
		}

		if (!startValue && endValue) {
			start = Math.max(size - Number(endValue), 0)
			end = size - 1
		}

		if (start > end || start >= size) {
			return null
		}

		return {
			start,
			end: Math.min(end, size - 1)
		}
	}
}
