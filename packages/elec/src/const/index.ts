import path from 'path'
import { app } from 'electron'

export const CONST = {
    env: process.env.NODE_ENV,
    app_path: app.getAppPath(),
}
