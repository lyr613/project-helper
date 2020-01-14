// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { ipc } from '@/const'
import { useObservable } from 'rxjs-hooks'
import { app_focu$, app_list$ } from '@/source'
import { BehaviorSubject } from 'rxjs'
import { PrimaryButton } from 'office-ui-fabric-react'
import { router_find$, router_list$, router_focu$, txt_preview$ } from './subj'

export default function IviewAdmin() {
	return (
		<div className={s.IviewAdmin}>
			<Router />
			<Preview />
		</div>
	)
}

// 读取的文件行
function Router() {
	const app = useObservable(() => app_focu$)
	const routers = useObservable(() => router_list$, [])
	const focu = useObservable(() => router_focu$)
	useEffect(() => {
		router_find$.next(app?.src)
	}, [app])

	return (
		<div className={s.Router}>
			{routers.map(rt => (
				<div
					className={s.line}
					key={rt.key}
					onClick={() => {
						router_focu$.next(rt)
					}}
					style={{
						marginLeft: `${rt.level * 20}px`,
						backgroundColor: focu?.key === rt.key ? '#72a0d8' : '',
					}}
				>
					{rt.title}
				</div>
			))}
		</div>
	)
}

/**
 * 预览文本
 */
function Preview() {
	const txt = useObservable(() => txt_preview$, '')
	return <div className={s.Preview}>{txt}</div>
}
