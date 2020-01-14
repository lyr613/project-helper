import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

export function watch_iveiw_admin() {
    // 读取路由
    ipcMain.on('iveiwadmin-router-find', (e, src) => {
        try {
            const rsrc = path.join(src, 'scripts', 'router-set', 'config')
            const txt0 = sio.read_text(rsrc)
            e.returnValue = txt0
        } catch (error) {
            e.returnValue = null
        }
    })
    // 读取每个路由的index.vue
    ipcMain.on('iview-admin-read-index', (e, app_src, paths) => {
        try {
            const src = path.join(app_src, 'src', 'view', ...paths, 'index.vue')
            console.log(src)

            e.returnValue = fs.readFileSync(src, 'utf-8')
        } catch (error) {
            e.returnValue = '读取失败'
        }
    })
}
