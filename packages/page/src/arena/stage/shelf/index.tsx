// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { ipc } from '@/const'
import { app_list$, app_find$, app_finding$, finding_level$, finding_dir$, app_focu$ } from '@/source/app'
import { list_filtered$, filter$ } from './subj'
import { app_type } from '@/source'
import { next_router } from '@/function/router'
import { filter, map, debounceTime } from 'rxjs/operators'
import { Screen$ } from '@/subscribe'
import FindBar from './bar'

/** 项目列表 */
export default function Shelf() {
	const finding = useObservable(() => app_finding$, false)
	return (
		<div className={s.Shelf}>
			<Help />
			{finding ? (
				<Finding />
			) : (
				<>
					<FindBar />
					<AppList />
				</>
			)}
		</div>
	)
}

/** 顶部帮助 */
function Help() {
	return (
		<div className={s.Help}>
			<p className={s.line}>根据含有.git的查找</p>
			<p className={s.line}>readme.md的第一行读取为项目名</p>
			<p className={s.line}>doc下所有preview\.*.(jpg|png)读取为预览图</p>
			<p className={s.line}>点击项目名打开资源管理器, ctrl点击用vscode打开项目</p>
		</div>
	)
}

/** 查找中 */
function Finding() {
	const msg = useObservable(() => finding_level$, '')
	const dir = useObservable(() => finding_dir$, '')
	return (
		<div
			className={s.Finding}
			style={{
				fontSize: '16px',
				margin: '10px',
			}}
		>
			查找中, {msg}
			<p>{dir}</p>
		</div>
	)
}

function AppList() {
	const list = useObservable(() => list_filtered$, [])
	const boxdom = useRef<null | HTMLDivElement>(null)
	const [one_w, set_one_w] = useState(0)
	useEffect(() => {
		// 动态计算宽度
		const dom = boxdom.current
		if (!dom) {
			return
		}
		const ob = Screen$.pipe(debounceTime(500)).subscribe(sc => {
			const w = dom.clientWidth - 10
			let i = 1
			let wi = sc.W - 20
			while (wi > 300) {
				i++
				wi = (w / i) | 0
			}
			set_one_w(wi - 10)
		})
		return () => ob.unsubscribe()
	}, [list])
	if (!list.length) {
		return (
			<div
				style={{
					fontSize: '16px',
				}}
			>
				没有查到项目
			</div>
		)
	}
	return (
		<div className={s.AppList} ref={boxdom}>
			{list.map(app => (
				<Item app={app} key={app.id} w={one_w} />
			))}
		</div>
	)
}

interface p {
	app: app_type
	w: number
}
function Item(p: p) {
	const { app } = p
	// 处于鼠标悬浮
	const [hover, set_hover] = useState(false)
	const [img_i, set_img_i] = useState(0)
	const appfocu = useObservable(() => app_focu$)
	return (
		<div
			className={[s.one, s.card, hover ? s.hover : '', appfocu?.id === app.id ? s.focu : ''].join(' ')}
			key={app.id}
			onMouseEnter={() => set_hover(true)}
			onMouseLeave={() => set_hover(false)}
			onClick={() => {
				app_focu$.next(app)
			}}
			style={{
				width: p.w,
			}}
		>
			{app.previews.length ? (
				<div
					className={s.imgbox}
					onClick={() => {
						set_img_i((img_i + 1) % app.previews.length)
					}}
				>
					<img src={app.previews[img_i]} className={s.img} alt="" />
				</div>
			) : (
				<div className={s.src}>{app.src}</div>
			)}
			<div
				className={s.name}
				title={app.name}
				onClick={e => {
					e.persist()
					if (e.ctrlKey || e.metaKey) {
						ipc().send('code-it', app.src)
					} else {
						ipc().send('start-dir-or-file', app.src)
					}
				}}
			>
				{app.name.replace(/^[ #]*/, '')}
			</div>
			<div
				className={s.parse}
				onClick={() => {
					app_focu$.next(app)
					next_router('focu')
				}}
			>
				解析
			</div>
		</div>
	)
}
