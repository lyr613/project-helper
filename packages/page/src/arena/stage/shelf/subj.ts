import { BehaviorSubject } from 'rxjs'
import { app_list$ } from '@/source/app'
import { map, switchMap } from 'rxjs/operators'

export const filter$ = new BehaviorSubject({
	type: 'all',
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
						return true
					})
					.sort((a, b) => {
						let re = 0
						re += (b.previews.length - a.previews.length) * 100
						re += ((b.update_time - a.update_time) / (1000 * 60)) | 0

						return re
					})
			}),
		)
	}),
)
