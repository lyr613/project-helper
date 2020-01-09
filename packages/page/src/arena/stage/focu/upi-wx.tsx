// eslint-disable-next-line
import React, { useState, useEffect } from 'react'
import s from './s.module.scss'
import { useObservable } from 'rxjs-hooks'
import { app_focu$ } from '@/source'
import { ipc } from '@/const'
import { TextField, PrimaryButton } from 'office-ui-fabric-react'

interface page {
	path: string
	style: { navigationBarTitleText: string }
}
/**
 * 解析upi-app的微信小程序
 */
export default function UniWx() {
	// app粗略信息
	const apf = useObservable(() => app_focu$)
	// 新增页面的信息
	const [new_path, set_new_path] = useState('')
	const [new_name, set_new_name] = useState('')
	// 读取的页面
	const [pages, set_pages] = useState<page[]>([])
	useEffect(() => {
		if (!apf) {
			return
		}
		const finfo = ipc().sendSync('uni-app-wx', apf.src)
		if (!finfo) {
			return
		}
		const pages: page[] = finfo.pages
		set_pages(pages)
	}, [apf])
	if (!apf) {
		return null
	}

	return (
		<div className={s.UniWx}>
			<div className={s.page}>页面列表</div>
			{pages.map(page => (
				<div className={s.page} key={page.path}>
					{page.path} - {page.style.navigationBarTitleText}
				</div>
			))}

			<div className={s.addpage}>
				<TextField
					label="文件夹路径, 如 home"
					value={new_path}
					onChange={(_, s) => {
						s = (s || '').replace(/[^a-z]/g, '')
						set_new_path(s)
					}}
				></TextField>
				<TextField
					label="标题"
					value={new_name}
					onChange={(_, s) => {
						s = (s || '').replace(/\s/g, '')
						set_new_name(s)
					}}
				></TextField>
				<PrimaryButton
					onClick={() => {
						if (!new_path || !new_name) {
							return
						}
						if (pages.map(p => p.path).find(p => p.match(new_path))) {
							return
						}
						const b = ipc().sendSync('uni-wx-add-page', apf.src, new_path, new_name)
						if (b) {
							console.log('uni-wx-add-page suc')
							app_focu$.next({ ...apf })
						} else {
							alert('添加失败')
						}
					}}
				>
					添加页面
				</PrimaryButton>
			</div>
		</div>
	)
}
