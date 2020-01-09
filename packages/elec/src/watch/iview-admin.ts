import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

export function watch_iveiw_admin() {
    ipcMain.on('iveiwadmin-router-find', (e, src) => {
        try {
            const rsrc = path.join(src, 'src', 'router', 'routers.js')
            const txt0 = sio.read_text(rsrc)
            const txt1 = txt0.split('export default')[1]
            e.returnValue = txt1
        } catch (error) {
            e.returnValue = null
        }
    })
}
