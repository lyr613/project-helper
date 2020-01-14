// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { ipc } from '@/const'
import { useObservable } from 'rxjs-hooks'
import { app_focu$, app_list$ } from '@/source'
import { BehaviorSubject } from 'rxjs'
import { PrimaryButton } from 'office-ui-fabric-react'
import { router_find$, router_list$ } from './subj'

export default function IviewAdmin() {
	return (
		<div className={s.IviewAdmin}>
			<Router />
		</div>
	)
}

// 读取的文件行
function Router() {
	const app = useObservable(() => app_focu$)
	const routers = useObservable(() => router_list$, [])
	useEffect(() => {
		router_find$.next(app?.src)
	}, [app])

	return (
		<div className={s.Router}>
			{routers.map(rt => (
				<div
					className={s.line}
					key={rt.key}
					style={{
						marginLeft: `${rt.level * 20}px`,
					}}
				>
					{rt.title}
				</div>
			))}
		</div>
	)
}
