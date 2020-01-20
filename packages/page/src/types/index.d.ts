import 'electron'

declare global {
	interface Param {
		[k: string]: any
	}
	interface Window {
		electron: Electron.CommonInterface
	}
}
