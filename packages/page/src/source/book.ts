import { BehaviorSubject, Subject } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'
import { electron, book_local_helper } from '@/const'
const ipc = electron().ipcRenderer

/** 获取书目列表 */
export const book_find$ = new Subject<Param | null>()

/** 书目列表 */
export const book_list$ = new BehaviorSubject<book[]>([])

/** 聚焦的书目 */
export const book_focu$ = new BehaviorSubject<null | book>(null)

/**
 * 获取书目列表
 */
book_find$
    .pipe(
        map(() => book_local_helper.load()),
        switchMap((srcs) => {
            return load_book_ipc(srcs)
        }),
        map((parts) => {
            return parts.map(create_book)
        }),
    )
    .subscribe((li) => {
        book_list$.next(li)
    })

/** 创建一本新书 */
export function create_book(part?: Param): book {
    const re = {
        id: new Date().getTime(),
        name: '',
        word_count: 0,
        path: '',
        cover: '',
    }
    Object.assign(re, part)
    return re
}

/** 通过路径列表获取书目列表 */
function load_book_ipc(li: string[]): Promise<Param[]> {
    return new Promise((res) => {
        ipc.send('book-load-srcs', li)
        ipc.once('book-load-srcs', (_, pli: Param[]) => {
            const re = pli.map(create_book)
            res(re)
        })
    })
}
