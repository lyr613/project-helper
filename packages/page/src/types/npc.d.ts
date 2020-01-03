declare namespace Npc {
    interface npc {
        /** 时间戳 */
        id: number
        base: {
            name: string
            /**
             * 性别
             * 0: 女, 1: 男, 2: 其他
             */
            gender: '0' | '1' | '2'
            /** 寿命 */
            life: string[]
            /** 活跃时期 */
            active: string[]
        }
    }
}
