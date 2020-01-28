import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

// yarn workspace
export function watch_yarn_space() {
    // 读取路由
    ipcMain.on('yarnspace-packages', (e, src) => {
        try {
            const rsrc = path.join(src, 'packages')
            const pgs = fs.readdirSync(rsrc)

            e.returnValue = pgs
                .filter((na) => /^[^.]/.test(na))
                .map((bn) => {
                    return {
                        basename: bn,
                        full_path: path.join(src, 'packages', bn),
                    }
                })
        } catch (error) {
            e.returnValue = []
        }
    })
}
