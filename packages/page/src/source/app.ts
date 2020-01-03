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
	/** 最后修改时间 */
	update_time: number
}
/** 项目列表 */
export const app_list$ = new BehaviorSubject<app[]>(load_local())
/** 查询项目列表 */
export const app_find$ = new Subject()

/** 正在查询项目列表 */
export const app_finding$ = new BehaviorSubject(false)

app_find$.pipe(switchMap(() => find_ipc())).subscribe(li => {
	console.log(li)
	app_list$.next(li)
	app_finding$.next(false)
	save_local(li)
})

function find_ipc() {
	return new Promise<app[]>(res => {
		app_finding$.next(true)
		app_list$.next([])
		ipc().send('app-find')
		ipc().once('app-find', (_, li: app[]) => {
			res(li)
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
		update_time: 0,
	}
	Object.assign(re, p)
	return re
}

/** 打开时从local读取缓存 */
function load_local(): app[] {
	const str = localStorage.getItem('app-list') || '[]'
	try {
		return JSON.parse(str)
	} catch (error) {
		return []
	}
}

function save_local(arr: app[]) {
	const str = JSON.stringify(arr)
	localStorage.setItem('app-list', str)
}
