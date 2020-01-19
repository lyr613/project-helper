const cp = require('child_process')

const d = cp.exec(` npx cross-env GH_TOKEN=74b7d6fd025e7aaf84977528d987893d51e01bde npx electron-builder `)

const out = d.stdout
out.on('data', (e) => {
    console.log(e)
})
