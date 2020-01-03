/**
 * 本地存的列表是路径[], 然后再根据环境去获取书目[]
 */
class BookLoaclHelper {
    li: string[] = []
    /** local key */
    key = 'book_list'
    /** 获取local的书目是列表 */
    load(): string[] {
        const re = localStorage.getItem(this.key) || '[]'
        try {
            const li = JSON.parse(re)
            if (Array.isArray(li)) {
                this.li = li
            } else {
                this.li = []
            }
        } catch (error) {
            this.li = []
        }
        return this.li
    }
    /** 把列表存到local */
    save() {
        const s = JSON.stringify(this.li)
        localStorage.setItem(this.key, s)
    }
    add(src: string) {
        this.li.push(src)
    }
    /** 列表添加一个, 并存到local */
    add_save(src: string) {
        this.add(src)
        this.save()
    }
}
export const book_local_helper = new BookLoaclHelper()
