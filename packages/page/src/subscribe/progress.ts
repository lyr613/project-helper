import { ipc } from '@/const'

ipc().on('download-progress', (_, p) => {
	console.log('progress', p)
})
