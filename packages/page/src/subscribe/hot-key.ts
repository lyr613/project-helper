import { fromEvent } from 'rxjs'
import { map, filter } from 'rxjs/operators'

/** 监听键盘按键 */
export const key$ = fromEvent(window, 'keydown').pipe(
	map(ee => {
		const e = ee as KeyboardEvent
		return {
			code: e.keyCode,
			alt: e.altKey || e.metaKey,
			ctrl: e.ctrlKey,
			shift: e.shiftKey,
		}
	}),
	filter(v => {
		// 过滤单独按的ctrl, alt, shift
		const fis = [16, 17, 18, 91, 93]
		return !fis.includes(v.code)
	}),
)
