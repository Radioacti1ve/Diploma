'use client'

import { Maximize, Pause, Play, RectangleHorizontal } from 'lucide-react'

import { PlayerProgressBar } from './progress-bar/PlayerProgressBar'
import { SelectQuality } from './quality/SelectQuality'
import { useVideoPlayer } from './use-video-player/useVideoPlayer'
import { EnumVideoPlayerQuality } from './video-player.types'
import { getTime } from './video-player.util'
import { VolumeControl } from './volume/VolumeControl'

export function VideoPlayer({
	fileName,
	toggleTheaterMode
}: {
	fileName: string
	toggleTheaterMode: () => void
}) {
	const { fn, playerRef, state } = useVideoPlayer({ fileName })

	return (
		<div className='relative rounded-2xl overflow-hidden mb-5'>
			<video
				ref={playerRef}
				className='aspect-video'
				controls={false}
				src={`/uploads/videos/${EnumVideoPlayerQuality['1080p']}/${fileName}`}
				preload='metadata'
			/>

			<div className='flex items-center justify-between absolute bottom-5 left-5 right-5'>
				<div className='flex items-center gap-4'>
					<button
						onClick={fn.togglePlayPause}
						className='transition-colors hover:text-primary'
					>
						{state.isPlaying ? <Pause /> : <Play />}
					</button>
					<PlayerProgressBar progress={state.progress} />

					<div>
						<span>{getTime(state.videoTime)}</span>
					</div>
				</div>
				<div className='flex items-center gap-5'>
					<VolumeControl
						changeVolume={fn.changeVolume}
						toggleMute={fn.toggleMute}
						value={state.volume}
						isMuted={state.isMuted}
					/>
					<SelectQuality
						currentValue={state.quality}
						onChange={fn.changeQuality}
					/>
					<button
						className='transition-colors hover:text-primary'
						onClick={toggleTheaterMode}
					>
						<RectangleHorizontal />
					</button>
					<button
						onClick={fn.toggleFullScreen}
						className='transition-colors hover:text-primary'
					>
						<Maximize />
					</button>
				</div>
			</div>
		</div>
	)
}
