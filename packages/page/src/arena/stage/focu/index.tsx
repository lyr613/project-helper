// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'
import { next_router } from '@/function/router'
import { ipc } from '@/const'
import { DefaultButton } from 'office-ui-fabric-react'
import UniWx from './upi-wx'
import IviewAdmin from './iview-admin'

export default function Focu() {
	if (!app_focu$.value) {
		next_router('home')
		return null
	}

	return (
		<div className={s.Focu}>
			<Back />
			<Infor />
		</div>
	)
}

function Back() {
	return (
		<DefaultButton
			onClick={() => {
				next_router('home')
			}}
		>
			返回
		</DefaultButton>
	)
}

function Infor() {
	const apf = useObservable(() => app_focu$)
	if (!apf) {
		return null
	}
	const tp = ipc().sendSync('app-focu-type', apf.src)

	return (
		<section className={s.Infor}>
			<div>{apf.name}</div>
			<div>类型: {tp}</div>
			{tp === 'uni-wx' && <UniWx></UniWx>}
			{tp === 'iview-admin' && <IviewAdmin></IviewAdmin>}
		</section>
	)
}
