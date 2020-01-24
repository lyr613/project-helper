import { ipcMain, dialog, remote, shell } from 'electron'
import path from 'path'
import fs from 'fs-extra'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

const platform = os.platform()
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

                const app_list = find_list(src, e).map(map_infor)
                e.reply('app-find', app_list)
            })
    })
    /** 打開項目 */
    ipcMain.on('open-project', (_, src: string) => {
        shell.showItemInFolder(src)
    })
    /**  打开文件(夹) */
    ipcMain.on('start-dir-or-file', (_, src: string) => {
        if (platform === 'win32') {
            cp.exec(`start ${src}`)
        } else {
            cp.exec(`open ${src}`)
        }
    })
    /**
     * 进入项目并执行脚本
     */
    ipcMain.on('run-script', (_, app: string, script: string) => {
        if (platform === 'win32') {
            if (script.match(/.js$/)) {
                cp.exec(`cd ${app} && start cmd /C node ${script} `)
                return
            }
            cp.exec(`cd ${app} && start ${script}`)
        } else {
            if (script.match(/.js$/)) {
                cp.exec(` osascript -e ' tell application "Terminal" to do script "cd ${app} && node ${script}" ' `)
                return
            }
        }
    })
    /** 用vscode打开目录 */
    ipcMain.on('code-it', (_, src: string) => {
        if (platform === 'win32') {
            cp.exec(` code ${src} `)
        } else {
            cp.exec(` osascript -e ' tell application "Terminal" to do script "cd ${src} && code ."  ' `)
        }
    })
    /** 判断项目具体类型 */
    ipcMain.on('app-focu-type', (e, src) => {
        if (check_yarn_workspace()) {
            e.returnValue = 'yarn-workspace'
            return
        }

        // 简单的, 监测某个文件存在
        const arr = [
            [path.join(src, 'src', 'pages.json'), 'uni-wx'], // uni-app小程序
            [path.join(src, 'src', 'index.less'), 'iview-admin'], // ivew后台管理
            [path.join(src, '.mvn'), 'java'],
            [path.join(src, 'node_modules'), 'js'],
        ]
        for (const flag_type of arr) {
            if (fs.existsSync(flag_type[0])) {
                e.returnValue = flag_type[1]
                return
            }
        }
        e.returnValue = '未识别'
        /** 检查是否是yarn workspace */
        function check_yarn_workspace() {
            try {
                const fi = path.join(src, 'package.json')
                const jsn = fs.readJSONSync(fi)
                return Boolean(jsn.workspaces)
            } catch (error) {
                return false
            }
        }
    })
}

function find_list(src: string, e: Electron.IpcMainEvent) {
    // 结果
    const nm_list: string[] = []
    // 碰到这些过滤
    const filters = [
        'System',
        'build',
        'Program Files',
        '.asar',
        '.sys',
        'IntelOptaneData',
        '.vscode',
        '.idea',
        'node_modules',
        '.mvn',
        '.npm',
        '.bash',
        '.app',
    ]
    // 碰到这些添加到结果里
    const find_flags = ['.git']
    // deep_find(src)
    tower_find()
    return Array.from(new Set(nm_list))
    // 迭代遍历文件夹, 一直到最后一层文件夹数量为0
    function tower_find() {
        let line = [src]
        let level = 0
        while (line.length) {
            level++
            e.reply('finding-level', `正在查找第${level}层`)
            const new_line: string[] = []
            line.forEach((dir) => {
                try {
                    const cd_dirs = fs.readdirSync(dir)
                    e.reply('finding-dir', dir)
                    cd_dirs.forEach((cd_dir) => {
                        const full_src = path.join(dir, cd_dir)
                        // 被过滤
                        if (filters.some((f) => cd_dir.match(f))) {
                            return
                        }
                        // 不是文件夹
                        if (!sio.be_dir(full_src)) {
                            return
                        }
                        // 找到了
                        if (find_flags.includes(cd_dir)) {
                            nm_list.push(dir)
                            return
                        }
                        // 推到下一层
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
/** 获取信息 */
function map_infor(src: string) {
    const dfs = fs.readdirSync(src)
    const re = {
        id: Math.random(),
        src,
        name: find_name(),
        previews: find_preview(),
        scripts: find_scripts(),
        type: get_type(), // 粗略类型 js / java
        update_time: get_time(),
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
        const imgs = docs.filter((na) => /preview.*\.(png|jpg)$/.test(na))
        return imgs.map((img) => path.join(src, docdir, img))
    }
    function find_scripts(): string[] {
        const scdirs = ['script', 'scripts']
        const scdir = dfs.find((na) => scdirs.includes(na))
        if (!scdir) {
            return []
        }
        const fis = fs.readdirSync(path.join(src, scdir))
        const scs = fis.filter((na) => /.(js|sh|py)$/.test(na))
        return scs.map((sc) => path.join(src, scdir, sc))
    }
    function get_type() {
        if (dfs.includes('node_modules')) {
            return 'js'
        }
        if (dfs.includes('.mvn')) {
            return 'java'
        }
        return 'unknown'
    }
    function get_time() {
        const info = fs.statSync(src).mtime
        return info.getTime()
    }
}
