import { BehaviorSubject, Subject } from 'rxjs'
import { ipc } from '@/const'
import { switchMap } from 'rxjs/operators'

interface app {
	id: number
	/** 文件夹路径 */
	src: string
	/** readme第一行 */
	name: string
	/** 预览图 */
	previews: string[]
	/** 脚本路径 */
	scripts: string[]
	/** 项目类型 */
	type: 'java' | 'js'
}
/** 项目列表 */
export const app_list$ = new BehaviorSubject<app[]>([])
/** 查询项目列表 */
export const app_find$ = new Subject()

/** 正在查询项目列表 */
export const app_finding$ = new BehaviorSubject(false)

app_find$.pipe(switchMap(() => find_ipc())).subscribe(li => {
	console.log(li)
	app_list$.next(li)
})

function find_ipc() {
	return new Promise<app[]>(res => {
		app_finding$.next(true)
		ipc().send('app-find')
		ipc().once('app-find', (_, li: app[]) => {
			res(li)
			app_finding$.next(false)
		})
	})
}

function of_app(p?: Param): app {
	const re: app = {
		id: Math.random(),
		src: 'd://xxx/xxx',
		name: '项目123',
		previews: [],
		scripts: ['123', '34qq'],
		type: 'js',
	}
	Object.assign(re, p)
	return re
}
