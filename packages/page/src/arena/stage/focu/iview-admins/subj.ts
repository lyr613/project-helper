import { BehaviorSubject, Subject } from 'rxjs'
import { ipc } from '@/const'
import { filter } from 'rxjs/operators'

export const router_list$ = new BehaviorSubject<router[]>([])
export const router_find$ = new Subject<string>()

router_find$.pipe(filter(s => !!s)).subscribe(src => {
	const lines = ipc().sendSync('iveiwadmin-router-find', src)
	const re = parse_router(lines.split('\n'))
	router_list$.next(re)
})

/** 这个解析是非常有局限性的 */
function parse_router(lines: string[]): router[] {
	lines = lines.filter(line => !line.match('#') && !line.match(/^\s*$/))
	if (!lines.length) {
		return []
	}
	lines.unshift('')
	const re: router[] = []
	const path_stack: string[] = []
	for (let i = 1; i < lines.length; i++) {
		const rt = new router()
		const p = parse_line(lines[i])
		const space_diff = space_length(lines[i]) - space_length(lines[i - 1])
		if (space_diff < 0) {
			path_stack.splice(space_diff - 1, 0 - space_diff)
		}
		if (space_diff > 0) {
			path_stack.push(parse_line(lines[i - 1]).path)
		}
		rt.dir_path = [...path_stack, p.path]
		rt.title = p.title
		rt.level = space_length(lines[i])
		re.push(rt)
	}

	return re

	function space_length(line: string) {
		const rest = line.replace(/^\s+/, '')
		return ((line.length - rest.length) / 4) | 0
	}
	function parse_line(line: string) {
		const rest = line.replace(/^\s+/, '')
		const arr = rest.split(/\s+/)
		return {
			title: arr[0],
			path: arr[1],
		}
	}
}

class router {
	key = Math.random()
	dir_path: string[] = []
	title = ''
	level = 0
}
