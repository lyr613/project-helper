import { watch_app } from './app'
import { watch_app_focu } from './focu_infor'
import { watch_iveiw_admin } from './iview-admin'

export function watch() {
    watch_app()
    watch_app_focu()
    watch_iveiw_admin()
}
