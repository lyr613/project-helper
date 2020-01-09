import { ipcMain, dialog } from 'electron'
import path from 'path'
import fs from 'fs'
import os from 'os'
import cp from 'child_process'
import * as sio from '@/qv-io'

export function watch_app_focu() {
    // 读取uniapp-wx的页面配置
    ipcMain.on('uni-app-wx', (e, src) => {
        try {
            const page_src = path.join(src, 'src', 'pages.json')
            const txt = sio.read_text(page_src)
            const jsn = JSON.parse(txt)
            e.returnValue = jsn
        } catch (error) {
            e.returnValue = null
        }
    })
    // uniapp-wx的页面配置新增
    ipcMain.on('uni-wx-add-page', (e, src, new_path, new_name) => {
        try {
            const page_src = path.join(src, 'src', 'pages.json')
            const txt = sio.read_text(page_src)
            const jsn = JSON.parse(txt)
            jsn.pages.push({
                path: `pages/${new_path}/${new_path}`,
                style: {
                    navigationBarTitleText: new_name,
                },
            })
            const txt2 = JSON.stringify(jsn)
            fs.mkdirSync(path.join(src, 'src', 'pages', new_path))
            sio.write_text(path.join(src, 'src', 'pages', new_path, `${new_path}.vue`), default_upi_wx_vue())
            sio.write_text(page_src, txt2)
            e.returnValue = true
        } catch (error) {
            e.returnValue = false
        }
    })
}

function default_upi_wx_vue() {
    return `
<template>
    <view class="content">
    </view>
</template>


<script>

export default {
    components: {  },
    data() {
        return {  }
    },
    methods: {  },
}
</script>

<style></style>

    `
}
