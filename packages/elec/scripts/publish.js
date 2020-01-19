// 71a54223dd3f9bcccafe226f2db7ff5cc9d4f51d
const cp = require('child_process')

const d = cp.exec(` cross-env GH_TOKEN=71a54223dd3f9bcccafe226f2db7ff5cc9d4f51d npx electron-builder `)

const out = d.stdout
out.on('data', (e) => {
    console.log(e)
})
