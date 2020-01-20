import React, { useEffect } from 'react'
import Stage from './arena/stage'
import { key$ } from './subscribe'
import { ipc } from './const'

const App: React.FC = () => {
	useEffect(() => {
		const ob = key$.subscribe(e => {
			// alt + r
			if (e.code === 82 && e.alt) {
				ipc().send('key-reload')
			}
			// alt + q
			if (e.code === 81 && e.alt) {
				ipc().send('key-quit')
			}
			// alt + f 全屏
			if (e.code === 70 && e.alt) {
				ipc().send('key-full-screen')
			}
			// alt + i 控制台
			if (e.code === 73 && e.alt) {
				ipc().send('key-devtool')
			}
			// console.log(e)
		})
		return () => ob.unsubscribe()
	}, [])
	return (
		<div id="app">
			<Stage></Stage>
		</div>
	)
}

export default App
