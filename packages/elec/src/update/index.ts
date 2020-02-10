import { create_option } from '../create'
import { app, BrowserWindow, dialog, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'path'
import fs from 'fs'

// const logfile = path.resolve('/Users/liuyiran/Desktop/front/writer', 'a.txt')
/**
 * 检查更新, 因为现在没签名, 所以直接打开release页
 * @param main_window
 */
export function update_check(main_window: BrowserWindow) {
    const down_page = `https://github.com/lyr613/project-helper/releases`
    // fs.writeFileSync(logfile, '开始检查')
    // autoUpdater.checkForUpdates().then((need) => {
    // console.log(need.updateInfo)
    // })
    autoUpdater.checkForUpdates()
    autoUpdater.on('update-available', (up) => {
        // fs.writeFileSync(logfile, JSON.stringify(up))
        dialog
            .showMessageBox(main_window, {
                title: '有更新',
                message: String(up.releaseNotes).replace(/<[a-z/]>/g, ''),
                buttons: ['打开下载窗口', '从系统浏览器打开', '忽略'],
            })
            .then((res) => {
                switch (res.response) {
                    case 0:
                        let win: any = new BrowserWindow(create_option())
                        win.loadURL(down_page)
                        win.on('close', () => (win = null))
                        break
                    case 1:
                        shell.openExternal(down_page)
                        break

                    default:
                        break
                }
            })
    })
    autoUpdater.on('error', (e) => {
        dialog.showMessageBox(main_window, {
            title: '更新错误',
            message: e,
        })
    })
}
