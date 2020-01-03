// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { DefaultButton, ActionButton, PrimaryButton, Dropdown } from 'office-ui-fabric-react'
import { useObservable } from 'rxjs-hooks'
import { electron, book_local_helper, ipc } from '@/const'
import { app_list$, app_find$, app_finding$ } from '@/source/app'
import { list_filtered$, filter$ } from './subj'

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
					<Bar />
					<Find />
					<AppList />
				</>
			)}
		</div>
	)
}

function Help() {
	return (
		<div className={s.Help}>
			<p className={s.line}>根据含有node_modules | .mvn的查找</p>
			<p className={s.line}>readme.md的第一行读取为项目名</p>
			<p className={s.line}>doc下所有preview\.*.(jpg|png)读取为预览图</p>
			<p className={s.line}>script下读取脚本.js, 基于app路径运行</p>
			<p className={s.line}>点击路径打开资源管理器, ctrl点击用vscode打开项目</p>
		</div>
	)
}

function Finding() {
	return (
		<div
			className={s.Finding}
			style={{
				fontSize: '16px',
				margin: '10px',
			}}
		>
			查找中
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
	if (!li.length) {
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
				onChange={(_, opt) => {
					const key = (opt?.key as string) ?? 'all'
					const fil = filter$.value
					fil.type = key
					filter$.next(fil)
				}}
			></Dropdown>
		</div>
	)
}

function AppList() {
	const list = useObservable(() => list_filtered$, [])
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
				<div className={s.one} key={app.id}>
					<div className={s.left}>
						<div className={s.line}>
							<span className={s.label}>项目名</span>
							<span>{app.name}</span>
						</div>
						<div className={s.line}>
							<span className={s.label}>地址</span>
							<span
								className={s.canclk}
								onClick={e => {
									e.persist()
									if (e.ctrlKey) {
										ipc().send('code-it', app.src)
									} else {
										ipc().send('start-dir-or-file', app.src)
									}
								}}
							>
								{app.src}
							</span>
						</div>
						<div className={s.line}>
							<span className={s.label}>脚本</span>
							{app.scripts.map(scpt => (
								<span
									key={scpt}
									className={s.canclk}
									onClick={() => {
										ipc().send('run-script', app.src, scpt)
									}}
									style={{
										padding: '0 10px',
									}}
								>
									{scpt.split(/[\\/]/).reverse()[0]}
								</span>
							))}
						</div>
					</div>
					<div className={s.imgbox}>
						{app.previews.map(img => (
							<img src={img} key={img} className={s.img} alt="" />
						))}
					</div>
				</div>
			))}
		</div>
	)
}
