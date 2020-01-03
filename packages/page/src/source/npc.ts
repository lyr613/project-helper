import { BehaviorSubject, Subject } from 'rxjs'
import { electron } from '@/const'
import { map } from 'rxjs/operators'
import { book_focu$ } from './book'

const ipc = electron().ipcRenderer

/** 查找npc */
export const npc_find$ = new Subject()

export const npc_list$ = new BehaviorSubject<npc[]>([])

export const npc_focu$ = new BehaviorSubject<null | npc>(create_npc())

npc_find$
    .pipe(
        map(() => {
            const src = book_focu$.value?.path
            if (!src) {
                return []
            }
            const li = ipc.sendSync('npc-list', src)
            return li
        }),
    )
    .subscribe((li: npc[]) => {
        npc_list$.next(li)
    })

/**
 * 新建npc
 */
export function create_npc(): npc {
    return {
        id: new Date().getTime(),
        base: {
            name: '',
            gender: '0',
            life: ['1', '1', '1', '1', '1', '1'],
            active: ['1', '1', '1', '1', '1', '1'],
        },
    }
}
