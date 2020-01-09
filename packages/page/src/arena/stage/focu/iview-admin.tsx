// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { ipc } from '@/const'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'

export default function IviewAdmin() {
	return (
		<div className={s.IviewAdmin}>
			<Router />
		</div>
	)
}

function Router() {
	const app = useObservable(() => app_focu$)
	if (!app) {
		return null
	}
	const txt = ipc().sendSync('iveiwadmin-router-find', app.src)
	const rt = parse_router(txt)
	console.log(rt)

	return <div className={s.Router}>{txt}</div>
}

function parse_router(s: string) {
	const lines = s.split('\n')
	const re: rou[] = []
	const buffer: rou[] = []

	let y = 0
	while (lines[y]) {
		const line = lines[y]
		if (line.match('{')) {
			const n = new rou()
			buffer.push(n)
		}
		if (line.match('path')) {
			buffer[buffer.length - 1].path = line.split(':')[1].replace(/[^a-zA-Z-]/, '')
		}
		if (line.match('name')) {
			buffer[buffer.length - 1].name = line.split(':')[1]
		}
		if (line.match('}')) {
			if (buffer.length === 1) {
				re.push(buffer[0])
			} else {
				if (buffer[buffer.length - 1].name) {
					buffer[buffer.length - 2].children.push(buffer[buffer.length - 1])
				}
			}
			buffer.pop()
		}
		y++
	}
	console.log(re)
}

class rou {
	path: string = ''
	name: string = ''
	children: rou[] = []
}
