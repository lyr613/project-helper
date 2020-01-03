import { Subject, BehaviorSubject, timer } from 'rxjs'
import { map, filter, switchMap, tap, take } from 'rxjs/operators'
import { ipc } from '@/const'

/** 聚焦的节 */
export const node_focu$ = new BehaviorSubject<null | node>(null)

/** 节点内容 */
export const node_text$ = new BehaviorSubject<string | null>(null)

/** 读取节点内容 */
export const node_text_find$ = new Subject()

/** 读取节点内容 */
node_text_find$
    .pipe(
        tap(() => node_text$.next(null)),
        map(() => node_focu$.value),
        filter((v) => !!v),
        switchMap((node) => {
            const src = node!.path
            return node_text_find(src)
        }),
    )
    .subscribe((text) => {
        node_text$.next(text)
    })

/**
 * 查找节点的文本内容 ipc
 * @param src
 */
function node_text_find(src: string): Promise<string> {
    return new Promise((res) => {
        ipc().send('node-text-find', src)
        ipc().once('node-text-find', (_, text: string) => {
            res(text)
        })
    })
}

class NodeTextHelper {
    can_save = true
    node_text_save$ = new Subject()
    buffer: { src: string; text: string }[] = []
    private auto_saver = setTimeout(() => {}, 0)
    /** 正在储存的src */
    private saveing = new Map<string, boolean>()
    /** 开始自动储存 */
    start_auto_save() {
        this.auto_saver = setInterval(() => {
            this.hand_buffer()
        }, 5000)
    }
    /** 结束自动储存 */
    end_auto_save() {
        clearInterval(this.auto_saver)
        this.auto_saver = setTimeout(() => {}, 0)
        setTimeout(() => {
            this.hand_buffer()
        }, 3000)
    }
    /** 合并buffer并存储 */
    hand_buffer() {
        /** src: text */
        const m = new Map<string, string>()
        this.buffer.forEach((v) => {
            m.set(v.src, v.text)
        })
        this.buffer.length = 0
        m.forEach((text, src) => {
            ipc().send('node-text-save', src, text)
        })
    }
    /** 暂存即将储存 */
    buffer_add(src: string, text: string) {
        this.buffer.push({ src, text })
    }
}
export const node_text_helper = new NodeTextHelper()
