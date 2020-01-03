declare namespace Book {
    interface book {
        /** 时间戳 */
        id: number
        /** 书名 */
        name: string
        /** 字数 */
        word_count: number
        /** 存放文件夹 */
        path: string
        /** 封面 */
        cover: string
    }
    /** 章 */
    interface chapter {
        /** 排序 */
        order: number
        /** 存放路径 */
        path: string
        /** 名字, 已去除文件夹前的数字 */
        name: string
        /** 节[] */
        children: node[]
    }

    /** 节 */
    interface node {
        /** 排序 */
        order: number
        /** 存放路径 */
        path: string
        /** 名字, 已去除文件夹前的数字 */
        name: string
    }
}
