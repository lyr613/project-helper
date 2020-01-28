const fs = require('fs')
const path = require('path')

process.send(`---- vv准备好了`)

process.on('message', (src) => {
    process.send(`${src} 开始查找`)

    find_list(src)
})

function find_list(src) {
    process.send(`${src} 接收到的地址`)

    // 结果
    const nm_list = []
    // 碰到这些过滤
    const filters = [
        'System',
        'build',
        'Program Files',
        'IntelOptaneData',
        'node_modules',
        'Application Support',
        'Caches',
        'Application Scripts',
        'var',
        'Volumes',
        'Homebrew',
    ]
    // 碰到这些添加到结果里
    const find_flags = ['.git']
    // deep_find(src)
    tower_find()
    process.send(Array.from(new Set(nm_list)))
    // 迭代遍历文件夹, 一直到最后一层文件夹数量为0
    function tower_find() {
        let line = [src]
        let level = 0
        while (line.length) {
            level++
            const new_line = []
            line.forEach((dir) => {
                process.send(dir)
                try {
                    const cd_dirs = fs.readdirSync(dir)
                    cd_dirs.forEach((cd_dir) => {
                        const full_src = path.join(dir, cd_dir)
                        // 被过滤
                        if (/\./.test(cd_dir)) {
                            // 找到了
                            if (cd_dir === '.git') {
                                nm_list.push(dir)
                            }
                            return
                        }
                        if (filters.some((f) => cd_dir.match(f))) {
                            return
                        }
                        // 不是文件夹
                        const stat = fs.lstatSync(src)
                        if (!stat.isDirectory()) {
                            return
                        }
                        // 推到下一层
                        new_line.push(full_src)
                    })
                } catch (error) {}
            })
            line = new_line
        }
    }
}
