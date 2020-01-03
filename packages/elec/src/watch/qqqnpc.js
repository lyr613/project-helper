const { ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const sio = require('../../js-util/io')

/** 加载npc */
ipcMain.on('npc-list', (e, src) => {
    const file_src = path.join(src, 'npc.json')
    sio.safe_make_file(file_src, '[]')
    const txt = sio.safe_read(file_src) || '[]'
    try {
        const json = JSON.parse(txt)
        e.returnValue = json
    } catch (error) {
        e.returnValue = []
    }
})

/** 编辑npc */
ipcMain.on('npc-edit', (e, npc, src) => {
    const file_src = path.join(src, 'npc.json')
    const old_txt = sio.safe_read(file_src)
    if (old_txt === false) {
        e.returnValue = '意外的还没有创建此文件, 回到展示页将自动创建'
    }
    try {
        const json = JSON.parse(old_txt) || []
        const fi = json.findIndex((v) => v.id === npc.id)
        if (fi === -1) {
            // 新增
            json.push(npc)
        } else {
            json.splice(fi, 1, npc)
        }
        const new_txt = JSON.stringify(json)
        sio.safe_write(file_src, new_txt)
        e.returnValue = true
    } catch (error) {
        e.returnValue = `原文件解析失败, 删除${file_src}重试`
    }
})

/** 删除npc */
ipcMain.on('npc-del', (e, npc, src) => {
    const file_src = path.join(src, 'npc.json')
    const old_txt = sio.safe_read(file_src)
    if (old_txt === false) {
        e.returnValue = '意外的还没有创建此文件, 回到展示页将自动创建'
    }
    try {
        const json = JSON.parse(old_txt) || []
        const fi = json.findIndex((v) => v.id === npc.id)
        if (fi !== -1) {
            json.splice(fi, 1)
        }
        const new_txt = JSON.stringify(json)
        sio.safe_write(file_src, new_txt)
        e.returnValue = true
    } catch (error) {
        e.returnValue = `原文件解析失败, 删除${file_src}重试`
    }
})
