import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

export function watch_iveiw_admin() {
    ipcMain.on('iveiwadmin-router-find', (e, src) => {
        try {
            const rsrc = path.join(src, 'scripts', 'router-set', 'config')
            const txt0 = sio.read_text(rsrc)
            e.returnValue = txt0
        } catch (error) {
            e.returnValue = null
        }
    })
}
