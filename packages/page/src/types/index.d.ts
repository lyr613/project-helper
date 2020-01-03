import './npc'
import 'electron'
import './book'

declare global {
    interface Param {
        [k: string]: any
    }
    interface Window {
        electron: Electron.CommonInterface
    }
    type book = Book.book
    type chapter = Book.chapter
    type node = Book.node
    type npc = Npc.npc
}
