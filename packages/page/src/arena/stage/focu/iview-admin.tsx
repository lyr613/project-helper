// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { ipc } from '@/const'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'
import { BehaviorSubject } from 'rxjs'
import { PrimaryButton } from 'office-ui-fabric-react'

export default function IviewAdmin() {
	return (
		<div className={s.IviewAdmin}>
			<Router />
		</div>
	)
}

const rid$ = new BehaviorSubject(-1)
const endy$ = new BehaviorSubject(-1)
// 读取的文件行
const lines$ = new BehaviorSubject<string[]>([])
function Router() {
	const app = useObservable(() => app_focu$)
	const [rts, set_rts] = useState<router[]>([])

	useEffect(() => {
		if (!app) {
			return
		}
		const txt = ipc().sendSync('iveiwadmin-router-find', app.src)
		lines$.next(txt.split('\n'))
		// console.log(rts)
	}, [app])
	useEffect(() => {
		const ob = lines$.subscribe(ls => {
			set_rts(parse_router(ls))
		})
		return () => {
			ob.unsubscribe()
		}
	}, [])

	return (
		<div className={s.Router}>
			{rts.map(rt => (
				<RouterItem router={rt} key={rt.path} level={0} />
			))}

			<div>
				<PrimaryButton
					onClick={() => {
						const sty = endy$.value + 1
						const ls = [...lines$.value]
						ls.splice(sty, 0, '{', 'path:"6555"', '}')
						console.log(ls)
					}}
				>
					新增
				</PrimaryButton>
			</div>
		</div>
	)
}

function RouterItem(p: { router: router; level: number }) {
	const rt = p.router
	const focu_router = useObservable(() => rid$, -1)
	return (
		<div
			className={s.RouterItem}
			style={{
				marginLeft: `${p.level * 20}px`,
			}}
		>
			<div
				className={s.path}
				onClickCapture={() => {
					rid$.next(rt.key)
					endy$.next(rt.end)
				}}
				style={{
					backgroundColor: focu_router === rt.key ? 'gray' : '',
				}}
			>
				{rt.path} - {rt.meta.title}
			</div>
			{rt.children.map(rtc => (
				<RouterItem router={rtc} key={rtc.path} level={p.level + 1} />
			))}
		</div>
	)
}
/** 这个解析是非常有局限性的 */
function parse_router(lines: string[]): router[] {
	if (!lines.length) {
		return []
	}
	const re: router[] = []
	const buffer: router[] = []

	let y = 0
	while (!lines[y].match('export default')) {
		y++
	}
	while (lines[y]) {
		const line = lines[y]
		if (line.match('{')) {
			if (line.match('meta')) {
				while (!lines[y].match('}')) {
					y++
					const kv = lines[y].split(':')
					if (kv.length === 2) {
						const k = kv[0].replace(/\s/g, '')
						const v = kv[1].replace(/[ ,"']/g, '')
						buffer[0].meta[k] = v
					}
				}
				y++
			} else {
				const n = new router()
				n.start = y
				buffer.unshift(n)
			}
		}
		if (lines[y].match('path')) {
			buffer[0].path = lines[y].split(':')[1].replace(/['", ]/g, '')
		}
		if (lines[y].match('name')) {
			buffer[0].name = lines[y].split(':')[1].replace(/['", ]/g, '')
		}
		if (lines[y].match('component')) {
			buffer[0].component = lines[y].split(':')[1].replace(/[, ]/g, '')
		}
		if (lines[y].match('}')) {
			buffer[0].end = y

			if (buffer.length === 1) {
				re.push(buffer[0])
			} else {
				if (buffer[0].path) {
					buffer[0].paths = [...buffer[1].paths, buffer[1].path]
					buffer[1].children.push(buffer[0])
				}
			}
			buffer.shift()
		}
		y++
	}
	return re
}

class router {
	key = Math.random()
	path: string = ''
	name: string = ''
	component: string = ''
	children: router[] = []
	meta: any = {}
	/** 开始行 */
	start = 0
	/** 结束行 */
	end = 0
	paths: string[] = []
}
