// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { DefaultButton, ActionButton, PrimaryButton } from 'office-ui-fabric-react'
import { useObservable } from 'rxjs-hooks'
import { book_list$, create_book, book_focu$, book_find$ } from '@/source'
import { electron, book_local_helper, ipc } from '@/const'
import { next_router } from '@/function/router'
import { app_list$, app_find$, app_finding$ } from '@/source/app'
import path from 'path'

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
					<AppList />
				</>
			)}
		</div>
	)
}

function Help() {
	return (
		<div className={s.Help}>
			<p className={s.line}>根据含有node_modules的查找</p>
			<p className={s.line}>readme.md的第一行读取为项目名</p>
			<p className={s.line}>doc下所有preview\.*.(jpg|png)读取为预览图</p>
			<p className={s.line}>script下读取脚本.js, 基于app路径运行</p>
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

function AppList() {
	const list = useObservable(() => app_list$, [])
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
								onClick={() => {
									ipc().send('start-dir-or-file', app.src)
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
