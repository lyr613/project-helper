import path from 'path'
import url from 'url'
import Electron from 'electron'
import { CONST } from '@/const'

export function create_option() {
    return {
        width: 800,
        height: 600,
        // fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            /** 让网页获取electorn对象 */
            preload: path.resolve(CONST.app_path, 'pre-load.js'),
            /** 查看本地图片 */
            webSecurity: false,
        },
    }
}

/**
 * 创建结束
 */
export function did_create(app: Electron.App, win: Electron.BrowserWindow) {
    win.maximize()
    set_menu(app, win)
    load_page(win)
}

/**
 * 设置菜单快捷键
 */
function set_menu(app: Electron.App, win: Electron.BrowserWindow) {
    const { globalShortcut, Menu } = Electron
    // 打开控制台
    globalShortcut.registerAll(['CmdOrCtrl+I'], () => {
        win.webContents.openDevTools()
    })
    // 重载
    globalShortcut.registerAll(['CmdOrCtrl+R', 'F5'], () => {
        win.reload()
    })
    /** 退出 */
    globalShortcut.register('CmdOrCtrl+Q', () => {
        app.quit()
    })
    /** 全屏 */
    globalShortcut.registerAll(['F10', 'CmdOrCtrl+P'], () => {
        const b = win.isFullScreen()
        win.setFullScreen(!b)
    })

    Menu.setApplicationMenu(null)
}

/**
 * 加载页面
 */
function load_page(win: Electron.BrowserWindow) {
    // console.log(process.env.NODE_ENV)
    if (process.env.NODE_ENV === 'development') {
        // 开发
        win.loadURL('http://localhost:7099')
    } else {
        win.loadURL(
            url.format({
                pathname: path.resolve(CONST.app_path, 'build-page', 'index.html'),
                protocol: 'file:',
                slashes: true,
            }),
        )
    }
}
