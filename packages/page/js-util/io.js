const fs = require('fs')
const path = require('path')

const io = {
	/**
	 * 安全的创造文件
	 * @param {PathLike} src
	 */
	safe_make_file(src, txt = '') {
		if (fs.existsSync(src)) {
			return false
		}
		fs.writeFileSync(src, txt)
		return true
	},
	/**
	 * 安全的创造文件夹
	 * @param {PathLike} src
	 */
	safe_make_dir(src) {
		if (fs.existsSync(src)) {
			return false
		}
		fs.mkdirSync(src)
		return true
	},
	/**
	 * 安全的重命名
	 */
	safe_rename(old_src, new_src) {
		if (fs.existsSync(old_src) || fs.existsSync(new_src)) {
			return false
		}
		fs.renameSync(old_src, new_src)
		return true
	},
	/**
	 * 安全的读取文档文本内容
	 */
	safe_read(src) {
		if (!fs.existsSync(src)) {
			return false
		}
		const read = fs.readFileSync(src)
		return read.toString('utf-8')
	},
	/**
	 * 安全的写入文档文本内容
	 */
	safe_write(src, txt) {
		if (!fs.existsSync(src)) {
			return false
		}
		fs.writeFileSync(src, txt)
		return true
	},
}

module.exports = io
