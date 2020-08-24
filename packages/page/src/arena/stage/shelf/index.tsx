// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { app_finding$, finding_level$, finding_dir$, app_focu$ } from '@/source/app'
import FindBar from './bar'
import { ActionButton } from 'office-ui-fabric-react'
import ProjectList from './list'
import { debounceTime, throttleTime } from 'rxjs/operators'

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
					<ProjectList />
				</>
			)}
		</div>
	)
}

/** 顶部帮助 */
function Help() {
	const [showd, set_showd] = useState(false)
	return (
		<div className={s.Help}>
			<ActionButton
				iconProps={{ iconName: showd ? 'CaretSolidDown' : 'CaretSolidRight' }}
				onClick={() => {
					set_showd(!showd)
				}}
			>
				帮助
			</ActionButton>

			{showd && (
				<>
					<p className={s.line}>根据含有.git的查找</p>
					<p className={s.line}>
						文件夹名字过滤: 'System', 'build', 'Program Files', 'IntelOptaneData', 'node_modules',
						'Application Support', 'Caches', 'Application Scripts', 'var', 'Volumes', 'Homebrew',
					</p>
					<p className={s.line}>readme.md的第一行读取为项目名</p>
					<p className={s.line}>doc下所有preview.*\.(jpg|png)读取为预览图</p>
					<p className={s.line}>点击项目名打开资源管理器, ctrl点击用vscode打开项目</p>
				</>
			)}
		</div>
	)
}

/** 查找中 */
function Finding() {
	const msg = useObservable(() => finding_level$, '')
	const dir = useObservable(() => finding_dir$.pipe(throttleTime(20)), '')
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
