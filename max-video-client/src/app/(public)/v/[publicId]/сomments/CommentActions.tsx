interface Props {}

export function CommentActions({}: Props) {
	return (
		<div className='flex items-center gap-3 mt-3'>
			<button className='text-gray-400 text-sm opacity-90 hover:opacity-100 transition-opacity'>
				Edit
			</button>
			<button className='text-gray-400 text-sm opacity-90 hover:opacity-100 transition-opacity'>
				Delete
			</button>
		</div>
	)
}
