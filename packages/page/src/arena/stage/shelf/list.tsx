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
import { BehaviorSubject } from 'rxjs'
import { Label, ActionButton } from 'office-ui-fabric-react'

type tool = 'open' | 'infor' | 'preview' | 'scripts'
const tool$ = new BehaviorSubject<tool>('open')

interface tool_item {
	value: tool
	text: string
	hand: () => void
}

const tool_list: tool_item[] = [
	{
		value: 'infor',
		text: '信息',
		hand: () => {
			tool$.next('infor')
		},
	},
	{
		value: 'open',
		text: '打开',
		hand: () => {
			tool$.next('open')
		},
	},
	{
		value: 'preview',
		text: '预览',
		hand: () => {
			tool$.next('preview')
		},
	},
	{
		value: 'scripts',
		text: '脚本',
		hand: () => {
			tool$.next('scripts')
		},
	},
]

export default function ProjectList() {
	const list = useObservable(() => list_filtered$, [])
	const boxdom = useRef<null | HTMLDivElement>(null)
	const [one_w, set_one_w] = useState(0)
	useEffect(() => {
		// 动态计算宽度
		const dom = boxdom.current
		if (!dom) {
			return
		}
		const ob = Screen$.pipe(debounceTime(100)).subscribe(sc => {
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
					margin: '10px',
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
	const tool = useObservable(() => tool$, '')
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
			{/* 有图的显示图, 否则地址 */}
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
			{hover ? (
				<div className={s.tools}>
					{tool_list.map(tl => (
						<span
							key={tl.value}
							className={[s.item, tool === tl.value ? s.itemf : ''].join(' ')}
							onClick={tl.hand}
						>
							{tl.text}
						</span>
					))}
					<span
						className={s.item}
						onClick={() => {
							app_focu$.next(app)
							next_router('focu')
						}}
					>
						解析
					</span>
				</div>
			) : (
				<div className={s.name} title={app.name}>
					{app.name.replace(/^[ #]*/, '')}
				</div>
			)}
			{hover && tool === 'infor' && <TheInfor {...p} />}
			{hover && tool === 'open' && <TheOpen {...p} />}
			{hover && tool === 'preview' && <ThePreview {...p} />}
			{hover && tool === 'scripts' && <TheScripts {...p} />}
		</div>
	)
}

/** 项目信息 */
function TheInfor(p: p) {
	return (
		<div className={[s.extend, s.TheInfor].join(' ')}>
			<Label>名</Label>
			<div className={s.line}>{p.app.name}</div>
			<Label>最后修改时间</Label>
			<div className={s.line}>{new Date(p.app.update_time).toLocaleString()}</div>
		</div>
	)
}
/** 打开 */
function TheOpen(p: p) {
	return (
		<div className={[s.extend, s.TheOpen].join(' ')}>
			<ActionButton
				onClick={() => {
					ipc().send('open-project', p.app.src)
				}}
			>
				打开资源管理器
			</ActionButton>
			<br />
			<ActionButton
				onClick={() => {
					ipc().send('code-it', p.app.src)
				}}
			>
				用vscode打开
			</ActionButton>
		</div>
	)
}

/** 预览 */
function ThePreview(p: p) {
	return (
		<div className={[s.extend, s.ThePreview].join(' ')}>
			{p.app.previews.map(img => (
				<img className={s.img} src={img} key={img} alt="" />
			))}
		</div>
	)
}

/** 脚本 */
function TheScripts(p: p) {
	return (
		<div className={[s.extend, s.TheScripts].join(' ')}>
			{p.app.scripts.map(ss => (
				<div key={ss}>
					<ActionButton
						styles={{
							root: {
								height: '26px',
							},
						}}
					>
						{ss.split(/[/\\]/).slice(-1)[0]}
					</ActionButton>
				</div>
			))}
		</div>
	)
}
