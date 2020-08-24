// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'
import { ipc } from '@/const'
import { ActionButton, Label, PrimaryButton, DefaultButton } from 'office-ui-fabric-react'

interface pg {
	basename: string
	full_path: string
}

export default function YarnSpace() {
	const apf = useObservable(() => app_focu$)
	if (!apf) {
		return null
	}
	const pgs: pg[] = ipc().sendSync('yarnspace-packages', apf.src)

	return (
		<div className={s.YarnSpace}>
			<table className={s.table}>
				<tbody>
					{pgs.map(pg => (
						<tr key={pg.basename}>
							<td>{pg.basename}</td>
							<td>
								<PrimaryButton
									onClick={e => {
										e.persist()
										ipc().send('open-project', pg.full_path)
									}}
									className={s.btn}
								>
									打开资源管理器
								</PrimaryButton>
							</td>
							<td>
								<DefaultButton
									onClick={e => {
										e.persist()
										ipc().send('code-it', pg.full_path)
									}}
									className={s.btn}
								>
									vscode打开
								</DefaultButton>
							</td>
							<td>
								<DefaultButton
									onClick={e => {
										e.persist()
										ipc().send('command-line', pg.full_path)
									}}
									className={s.btn}
								>
									打开命令行
								</DefaultButton>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
