import { ipc } from '@/const'
// 暂时弃用

ipc().on('download-progress', (_, p) => {
	console.log('progress', p)
})
