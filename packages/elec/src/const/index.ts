import path from 'path'
import { app } from 'electron'

export const CONSTS = {
    env: process.env.NODE_ENV,
    app_path: app.getAppPath(),
}
