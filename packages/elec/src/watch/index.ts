import { watch_app } from './app'
import { watch_app_focu } from './focu_infor'
import { watch_iveiw_admin } from './iview-admin'
import { watch_hotkey } from './hot-key'
import { watch_yarn_space } from './yarn-space'

export function watch(win: Electron.BrowserWindow) {
    watch_app()
    watch_app_focu()
    watch_iveiw_admin()
    watch_yarn_space()
    watch_hotkey(win)
}
