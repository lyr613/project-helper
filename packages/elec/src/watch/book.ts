import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import * as sio from '@/qv-io'
import { build_tower, be_dir } from '@/qv-io'

export function watch_book() {
    // 选择书目文件夹, 只返回路径, 进入章节时才会读取书目的信息
    ipcMain.on('book-new', (e, properties: ['openDirectory']) => {
        dialog
            .showOpenDialog({
                properties,
            })
            .then((res) => {
                if (!res.filePaths.length) {
                    return false
                }
                const src = res.filePaths[0]
                e.returnValue = load_book(src)
            })
    })
    /** 由路径列表获取书目列表 */
    ipcMain.on('book-load-srcs', (e, srcs) => {
        try {
            const re = srcs.map(load_book)
            e.reply('book-load-srcs', re)
            e.returnValue = re
        } catch (error) {
            e.reply('book-load-srcs', [])
            e.returnValue = []
        }
    })
    /** 由书目路径获取章节列表 */
    ipcMain.on('chapter-node-list', (e, src) => {
        try {
            const tower = build_tower(src)
            tower.shift()
            const cn = (tower[0] || [])
                .filter((dir) => {
                    const name = path.basename(dir.full_path)
                    return /^\d+-\S+$/.test(name) && be_dir(dir.full_path)
                })
                .map((df) => {
                    const dir = df as sio.dir
                    const basename = path.basename(dir.full_path)
                    return {
                        order: /^\d+/.exec(basename)![0],
                        name: basename.replace(/^\d+-/, ''),
                        path: dir.full_path,
                        children: find_node(dir.children),
                    }
                })

            e.reply('chapter-node-list', cn)
            e.returnValue = cn
        } catch (error) {
            e.reply('chapter-node-list', [])
            e.returnValue = []
        }
        function find_node(fis: (sio.file | sio.dir)[]) {
            const re = fis
                .filter((fi) => {
                    if (!sio.be_file(fi.full_path)) {
                        return false
                    }
                    const basename = path.basename(fi.full_path)
                    return /^\d+-\S+.txt/.test(basename)
                })
                .map((df) => {
                    const fi = df as sio.file
                    const basename = path.basename(fi.full_path)
                    return {
                        order: /^\d+/.exec(basename)![0],
                        name: basename.replace(/^\d+-/, '').replace(/.txt$/, ''),
                        path: fi.full_path,
                    }
                })
            return re
        }
    })
}

/**
 * 加载一本书
 * @param src
 */
function load_book(src: string) {
    return {
        id: Math.random(),
        name: path.basename(src),
        path: src,
        cover: find_cover(),
    }
    function find_cover() {
        const files = fs.readdirSync(src)
        const fi = files.find((str) => /^封面.(png|jpg|gif)/.test(str))
        return fi ? path.resolve(src, fi) : ''
    }
}
