const cp = require('child_process')
const path = require('path')
const fs = require('fs')

const project = 'build-page'

const root = path.resolve('.', '..')
const self = path.resolve('.')
const elec = path.resolve(root, 'elec')
console.log(self)

// if (fs.existsSync(path.join(elec, project))) {
// 	cp.execSync(`cd ${elec} && rm -rf ${project}`)
// }
// fs.renameSync('./build', project)
// cp.execSync(`scp  ${project} ${elec}`)

if (fs.existsSync(path.join(self, project))) {
	try {
		cp.execSync(`cd ${self} && rm -rf ${project}`)
	} catch (error) {
		cp.execSync(`cd ${self} && rmdir /s/q ${project}`)
	}
}
if (fs.existsSync(path.join(elec, project))) {
	try {
		cp.execSync(`cd ${elec} && rm -rf ${project}`)
	} catch (error) {
		cp.execSync(`cd ${elec} && rmdir /s/q ${project}`)
	}
}

fs.renameSync('./build', project)
cp.execSync(`scp -r  ${project} ${elec}`)
