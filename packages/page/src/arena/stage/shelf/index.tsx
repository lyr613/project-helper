// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { DefaultButton, ActionButton, PrimaryButton, Dropdown, TextField } from 'office-ui-fabric-react'
import { useObservable } from 'rxjs-hooks'
import { electron, book_local_helper, ipc } from '@/const'
import { app_list$, app_find$, app_finding$, finding_level$, finding_dir$, app_focu$ } from '@/source/app'
import { list_filtered$, filter$ } from './subj'
import { app_type } from '@/source'
import { next_router } from '@/function/router'
import { filter, map } from 'rxjs/operators'
import { Screen$ } from '@/subscribe'

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
					<Find />
					<Bar />
					<AppList />
				</>
			)}
		</div>
	)
}

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

function Find() {
	return (
		<PrimaryButton
			onClick={() => {
				app_find$.next()
			}}
			style={{
				margin: '10px',
			}}
		>
			查找
		</PrimaryButton>
	)
}

function Bar() {
	const li = useObservable(() => app_list$, [])
	const fil = useObservable(() =>
		filter$.pipe(
			filter(v => !!v),
			map(v => ({ ...v })),
		),
	)
	if (!li.length || !fil) {
		return null
	}
	return (
		<div className={s.Bar}>
			<Dropdown
				label="项目类型"
				options={[
					{ key: 'all', text: '所有', selected: true },
					{ key: 'js', text: 'js' },
					{ key: 'java', text: 'java' },
				]}
				selectedKey={fil.type}
				onChange={(_, opt) => {
					const key = (opt?.key as string) ?? 'all'
					const fil = filter$.value
					fil.type = key
					filter$.next(fil)
				}}
				styles={{
					root: {
						marginRight: '10px',
						width: '140px',
					},
				}}
			></Dropdown>
			<TextField
				label="路径搜索"
				placeholder="贪婪匹配路径"
				value={fil.src}
				onChange={(_, str) => {
					fil.src = str || ''
					filter$.next(fil)
				}}
				onFocus={() => {
					fil.src = ''
					filter$.next(fil)
				}}
			></TextField>
		</div>
	)
}

function AppList() {
	const list = useObservable(() => list_filtered$, [])
	const [one_w, set_one_w] = useState(0)
	useEffect(() => {
		// 动态计算宽度
		const ob = Screen$.subscribe(sc => {
			const w = sc.W - 10 - 20
			let i = 1
			let wi = sc.W - 20
			while (wi > 300) {
				i++
				wi = (w / i) | 0
			}
			set_one_w(wi - 10)
		})
		return () => ob.unsubscribe()
	}, [])
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
		<div className={s.AppList}>
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
	const [hover, set_hover] = useState(false)
	return (
		<div
			className={[s.one, s.card, hover ? s.hover : ''].join(' ')}
			key={app.id}
			onMouseEnter={() => set_hover(true)}
			onMouseLeave={() => set_hover(false)}
			style={{
				width: p.w,
			}}
		>
			{app.previews.length ? (
				<div className={s.imgbox}>
					{app.previews.map(img => (
						<img src={img} key={img} className={s.img} alt="" />
					))}
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
				className={s.focu}
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
