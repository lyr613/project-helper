type local = 'book_list'
type session = 'sign_time'
type source = string | boolean | object
/**
 * 读取local
 *
 * book_list书目列表
 * @param key 键
 */
export function load_local<T>(key: local) {
    const source = localStorage.getItem(key)
    return help_load<T>(source)
}
/** 载入session */
export function load_session<T>(key: session) {
    const source = sessionStorage.getItem(key)
    return help_load<T>(source)
}

/** 存入local */
export function save_local(key: local, value: source) {
    const re = help_save(value)
    localStorage.setItem(key, re)
}
/** 存入 sessionS */
export function save_sessiong(key: local, value: source) {
    const re = help_save(value)
    sessionStorage.setItem(key, re)
}

function help_load<T>(source: string | null): T | null
function help_load<T>(source: string | null) {
    if (source === null) {
        return null
    }
    try {
        return JSON.parse(source) as T
    } catch (error) {
        if (source === 'true') {
            return true
        }
        if (source === 'false') {
            return false
        }
        return source
    }
}

function help_save(source: source): string {
    switch (typeof source) {
        case 'string':
            return source
        case 'boolean':
            return source ? 'true' : 'false'
        case 'object':
            try {
                return JSON.stringify(source)
            } catch (error) {
                return ''
            }
        default:
            return ''
    }
}
