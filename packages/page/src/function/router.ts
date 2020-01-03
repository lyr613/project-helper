import { createHashHistory } from 'history'

let prev_router = '-1'

export const routers = {
	shelf: '书架',
	chapter: '章节',
	edit: '编写',
	help: '帮助',
	npc: '角色',
}

export type routers = keyof typeof routers

/** 下一个路由 */
export function next_router(router: routers, ...rest: string[]) {
	const p = createHashHistory()
	const full = '/' + router + hand_rest()

	if (full === prev_router) {
		return
	}
	p.push(full)
	prev_router = full

	function hand_rest() {
		if (!rest.length) {
			return ''
		}
		return '/' + rest.join('/')
	}
}
