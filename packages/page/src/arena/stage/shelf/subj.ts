import { BehaviorSubject } from 'rxjs'
import { app_list$ } from '@/source/app'
import { map, switchMap } from 'rxjs/operators'

export const filter$ = new BehaviorSubject({
	type: 'all',
	// 搜索路径
	src: '',
	// 名称
	name: '',
})

/** 过滤后的列表 */
export const list_filtered$ = app_list$.pipe(
	switchMap(li => {
		return filter$.pipe(
			map(opt => {
				return li
					.filter(app => {
						if (opt.type !== 'all') {
							return app.type === opt.type
						}
						if (opt.src) {
							const regsrc = new RegExp(opt.src.split('').join('.*'))
							if (!regsrc.test(app.src.toLocaleLowerCase())) {
								return false
							}
						}
						if (opt.name) {
							const regsrc = new RegExp(opt.name.split('').join('.*'))
							if (!regsrc.test(app.name)) {
								return false
							}
						}
						return true
					})
					.sort((a, b) => {
						let re = 0
						re += ((b.update_time - a.update_time) / 10000) | 0

						return re
					})
			}),
		)
	}),
)
