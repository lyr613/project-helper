const cp = require('child_process')
const path = require('path')
const fs = require('fs-extra')

const project = 'qosft-app-helper-page'

const root = path.resolve(__dirname, '..', '..')
const self = path.resolve(__dirname, '..', project)
const elec = path.resolve(root, 'elec', project)
console.log(self)

if (fs.existsSync(elec)) {
	fs.emptyDirSync(elec)
	fs.removeSync(elec)
}
if (fs.existsSync(self)) {
	fs.emptyDirSync(self)
	fs.removeSync(self)
}

fs.renameSync('./build', project)
cp.execSync(`scp -r ${project} ${elec}`)
