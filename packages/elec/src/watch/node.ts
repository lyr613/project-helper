import { ipcMain } from 'electron'
import path from 'path'
import fs from 'fs'
import * as sio from '@/qv-io'

export function watch_node() {
    /** 新节 */
    ipcMain.on('node-new', (e, chapter_src: string, order: number) => {
        try {
            const src = path.join(chapter_src, `${order}-新节.txt`)
            sio.write_text(src, '')
            e.returnValue = true
        } catch (error) {
            e.returnValue = false
        }
    })
    /** 节重命名 */
    ipcMain.on('node-rename', (e, src: string, newname: string) => {
        try {
            const new_src = path.join(src, '..', newname)
            fs.renameSync(src, new_src)
            e.returnValue = true
        } catch (error) {
            e.returnValue = false
        }
    })
    /** 加载节点的文本 */
    ipcMain.on('node-text-find', (e, src: string) => {
        try {
            const text = sio.read_text(src)
            e.reply('node-text-find', text)
            e.returnValue = text
        } catch (error) {
            const re = '加载失败, ctrl(command) + r重试'
            e.reply('node-text-find', re)
            e.returnValue = re
        }
    })
    /** 储存节点的文本 */
    ipcMain.on('node-text-save', (e, src: string, text: string) => {
        try {
            sio.write_text(src, text)
            e.reply('node-text-save-end', true)
        } catch (error) {}
    })
}
