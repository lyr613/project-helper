import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import cp from 'child_process'
import * as sio from '@/qv-io'

export function watch_app() {
    /** 加载顶层 */
    ipcMain.on('app-find', (e) => {
        dialog
            .showOpenDialog({
                properties: ['openDirectory'],
            })
            .then((res) => {
                if (!res.filePaths.length) {
                    e.reply('app-find', [])
                    return false
                }
                const src = res.filePaths[0]
                const app_list = find_list(src).map(map_infor)
                e.reply('app-find', app_list)
            })
    })
    /** 大概是windows专用 */
    ipcMain.on('start-dir-or-file', (_, src: string) => {
        cp.execSync(`start ${src}`)
    })
    /** 进入项目并执行脚本 */
    ipcMain.on('run-script', (_, app: String, script: string) => {
        cp.execSync(`cd ${app} && start ${script}`)
    })
}

function find_list(src: string) {
    const nm_list: string[] = []
    const filters = [
        'System Volume Information',
        'build',
        'react-scripts',
        'Program Files',
        '.asar',
        '.sys',
        'IntelOptaneData',
    ]
    // deep_find(src)
    tower_find()
    return nm_list

    function tower_find() {
        let line = [src]
        while (line.length) {
            const new_line: string[] = []
            line.forEach((dir) => {
                try {
                    const cd_dirs = fs.readdirSync(dir)
                    cd_dirs.forEach((cd_dir) => {
                        const full_src = path.join(dir, cd_dir)
                        if (filters.some((f) => cd_dir.match(f))) {
                            return
                        }
                        if (!sio.be_dir(full_src)) {
                            return
                        }
                        if (cd_dir === 'node_modules') {
                            nm_list.push(dir)
                            return
                        }
                        new_line.push(full_src)
                    })
                } catch (error) {}
            })
            line = new_line
        }
    }
    function deep_find(src: string) {
        const arr = fs.readdirSync(src)
        arr.forEach((p) => {
            const full = path.join(src, p)
            if (filters.some((na) => p.match(na))) {
                return
            }

            if (p === 'node_modules') {
                nm_list.push(src)
                return
            }
            try {
                if (fs.lstatSync(full).isDirectory()) {
                    deep_find(full)
                }
            } catch (error) {}
        })
    }
}

function map_infor(src: string) {
    const dfs = fs.readdirSync(src)
    const re = {
        id: Math.random(),
        src,
        name: find_name(),
        previews: find_preview(),
        scripts: find_scripts(),
    }
    return re
    function find_name() {
        let name
        const readme = dfs.find((na) => na.toLowerCase() === 'readme.md')
        if (readme) {
            const txt = sio.read_text(path.join(src, readme))
            name = txt.split('\n')[0]
        }
        if (!name) {
            name = path.basename(src)
        }
        return name
    }
    function find_preview(): string[] {
        const docdirs = ['doc', 'docs', 'document']
        const docdir = dfs.find((na) => docdirs.includes(na))
        if (!docdir) {
            return []
        }
        const docs = fs.readdirSync(path.join(src, docdir))
        const imgs = docs.filter((na) => /preview\.*.(png|jpg)$/.test(na))
        return imgs.map((img) => path.join(src, docdir, img))
    }
    function find_scripts(): string[] {
        const scdirs = ['script', 'scripts']
        const scdir = dfs.find((na) => scdirs.includes(na))
        if (!scdir) {
            return []
        }
        const fis = fs.readdirSync(path.join(src, scdir))
        const scs = fis.filter((na) => /.js$/.test(na))
        return scs.map((sc) => path.join(src, scdir, sc))
    }
}
