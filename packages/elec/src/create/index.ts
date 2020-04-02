import path from 'path'
import url from 'url'
import Electron from 'electron'
import { CONSTS } from '@/const'

export function create_option() {
    return {
        width: 800,
        height: 600,
        // fullscreen: true,
        autoHideMenuBar: true,
        webPreferences: {
            /** 让网页获取electorn对象 */
            preload: path.resolve(CONSTS.app_path, 'pre-load.js'),
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
        win.loadFile(path.resolve(CONSTS.app_path, 'qosft-app-helper-page', 'index.html'))
    }
}
