export interface StorageObjectMetadata {
	size: number
	contentType?: string
	lastModified?: Date
}

export interface StorageStreamOptions {
	start?: number
	end?: number
}
