// eslint-disable-next-line
import React, { useState, useEffect, useRef } from 'react'
import s from './s.module.scss'
import { DefaultButton, ActionButton, PrimaryButton, Dropdown, TextField } from 'office-ui-fabric-react'
import { useObservable } from 'rxjs-hooks'
import { app_list$, app_find$, app_finding$, finding_level$, finding_dir$, app_focu$ } from '@/source/app'
import { list_filtered$, filter$ } from './subj'
import { filter, map, debounceTime } from 'rxjs/operators'

export default function FindBar() {
	return (
		<div className={s.FindBar}>
			<PrimaryButton
				onClick={() => {
					app_find$.next()
				}}
			>
				查找
			</PrimaryButton>
			<FindParam />
		</div>
	)
}

function FindParam() {
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
		<div className={s.FindParam}>
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
				className={s.item}
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
				className={s.item}
			></TextField>
			<TextField
				label="名称搜索"
				placeholder="项目名称"
				value={fil.name}
				onChange={(_, str) => {
					fil.name = str || ''
					filter$.next(fil)
				}}
				onFocus={() => {
					fil.name = ''
					filter$.next(fil)
				}}
				className={s.item}
			></TextField>
		</div>
	)
}
