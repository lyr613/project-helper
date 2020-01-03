import { BehaviorSubject, Subject } from 'rxjs'
import { electron } from '@/const'
import { debounceTime, tap } from 'rxjs/operators'
import { book_focu$ } from './book'
import { node_focu$ } from './node'
const ipcRenderer = electron().ipcRenderer
/** 章节列表 */
export const chapter_list$ = new BehaviorSubject<chapter[]>([])

/** 聚焦节的内容 */
export const edit_txt$ = new BehaviorSubject('')

/** 更新章节列表 */
export const chapter_list_find$ = new Subject()

/** 查找章节列表 渲染 -> 主 */
chapter_list_find$.pipe().subscribe(() => {
    const focu = book_focu$.value
    if (focu !== null && focu.path) {
        const src = focu.path
        ipcRenderer.send('chapter-node-list', src)
        ipcRenderer.once('chapter-node-list', (_, cn) => {
            chapter_list$.next(cn)
        })
    } else {
        chapter_list$.next([])
    }
})

/** 更新章节列表 渲染 <- 主 */
ipcRenderer.on('load-chapter-node', (_, msg) => {
    chapter_list$.next(msg)
})

/** 自动更新聚焦节的文本 渲染 <- 主  */
node_focu$
    .pipe(
        tap(() => edit_txt$.next('')),
        debounceTime(500),
        tap((node) => {
            if (node) {
                ipcRenderer.send('load-node', node.path)
            }
        }),
    )
    .subscribe()

/** 自动更新聚焦节的文本 渲染 -> 主  */
ipcRenderer.on('load-node', (_, msg) => {
    edit_txt$.next(msg)
})

/** 保存聚焦节的文本 */
export const txt_saver$ = new Subject<string>()

/** 保存聚焦节的文本 渲染 -> 主 */
txt_saver$.pipe(debounceTime(1000)).subscribe((str) => {
    const node = node_focu$.value
    if (node) {
        ipcRenderer.send('save-node-txt', {
            path: node.path,
            txt: str,
        })
    }
})

/** 创造一个伪节点 */
export function create_node(): node {
    return {
        order: -1,
        path: '',
        name: '',
    }
}
