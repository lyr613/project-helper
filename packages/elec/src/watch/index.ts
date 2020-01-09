import { watch_app } from './app'
import { watch_app_focu } from './focu_infor'

export function watch() {
    watch_app()
    watch_app_focu()
}
