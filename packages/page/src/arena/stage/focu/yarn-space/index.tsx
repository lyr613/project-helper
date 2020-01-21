// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'
import { ipc } from '@/const'
import { ActionButton, Label, PrimaryButton } from 'office-ui-fabric-react'

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
			<Label>子项目列表:</Label>
			{pgs.map(pg => (
				<PrimaryButton
					key={pg.basename}
					onClick={e => {
						e.persist()
						if (e.ctrlKey || e.metaKey) {
							ipc().send('code-it', pg.full_path)
						} else {
							ipc().send('open-project', pg.full_path)
						}
					}}
					className={s.btn}
				>
					{pg.basename}
				</PrimaryButton>
			))}
		</div>
	)
}
