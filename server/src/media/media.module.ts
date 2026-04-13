import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'
import { UploadsController } from './uploads.controller'
import { StorageModule } from '@/storage/storage.module'

@Module({
	imports: [StorageModule],
	controllers: [MediaController, UploadsController],
	providers: [MediaService]
})
export class MediaModule {}
