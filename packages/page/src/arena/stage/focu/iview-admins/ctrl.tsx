// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { TextField, Checkbox, Label, ChoiceGroup } from 'office-ui-fabric-react'
import { useObservable } from 'rxjs-hooks'
import { field_set$ } from './subj-field'
import { map } from 'rxjs/operators'

export default function Ctrl() {
	const field_set = useObservable(() => field_set$.pipe(map(v => ({ ...v }))))
	if (!field_set) {
		return null
	}
	return (
		<ul className={[s.Ctrl, s.block].join(' ')}>
			<li>
				<TextField
					label="字段, key, field"
					value={field_set.key}
					onChange={(_, s) => {
						field_set.key = (s || '').replace(/[^a-zA-Z0-9_]/g, '')
						field_set$.next(field_set)
					}}
				></TextField>
			</li>
			<li>
				<Label>在哪里展示</Label>
				<Checkbox
					label="表格"
					checked={field_set.show_in_table}
					onChange={(_, b) => {
						field_set.show_in_table = !!b
						field_set$.next(field_set)
					}}
					styles={{ root: { margin: '10px' } }}
				/>
				<Checkbox
					label="搜索"
					checked={field_set.show_in_search}
					onChange={(_, b) => {
						field_set.show_in_search = !!b
						field_set$.next(field_set)
					}}
					styles={{ root: { margin: '10px' } }}
				/>
				<Checkbox
					label="编辑"
					checked={field_set.show_in_edit}
					onChange={(_, b) => {
						field_set.show_in_edit = !!b
						field_set$.next(field_set)
					}}
					styles={{ root: { margin: '10px' } }}
				/>
			</li>
			{(field_set.show_in_search || field_set.show_in_table || field_set.show_in_edit) && (
				<>
					<li>
						<TextField
							label="标签, label"
							value={field_set.label}
							onChange={(_, s) => {
								field_set.label = (s || '').replace(/[^a-zA-Z0-9_]/g, '')
								field_set$.next(field_set)
							}}
						></TextField>
					</li>
					<li>
						<Label>转换方式</Label>
						<ChoiceGroup
							options={[
								{ key: 'input', text: '输入框' },
								{ key: 'dropdown', text: '下拉框' },
								{ key: 'toggle', text: '开关' },
								{ key: 'date', text: '日期' },
							]}
							styles={{
								root: {
									margin: '0 0 0 10px',
								},
							}}
						></ChoiceGroup>
					</li>
				</>
			)}
			{field_set.show_in_table && (
				<>
					<div className={s.splitline}></div>
					<li>
						<Checkbox
							label="作为扩展信息展示"
							checked={field_set.be_extend}
							onChange={(_, b) => {
								field_set.be_extend = !!b
								field_set$.next(field_set)
							}}
							styles={{ root: { margin: '10px' } }}
						/>
					</li>
				</>
			)}
		</ul>
	)
}
