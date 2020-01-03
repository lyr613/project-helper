import { ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import * as sio from '@/qv-io'

export function watch_chapter() {
    /** 新章 */
    ipcMain.on('chapter-new', (e, book_src: string, order: number) => {
        try {
            const src = path.join(book_src, `${order}-新章`)
            fs.mkdirSync(src)
            e.returnValue = true
        } catch (error) {
            e.returnValue = false
        }
    })
}
