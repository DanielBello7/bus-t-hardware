import { app, BrowserWindow, ipcMain } from 'electron';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { execFile } from 'child_process';
import os from 'os';
import path from 'node:path';

const _ = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
    win = new BrowserWindow({
        fullscreen: os.platform() === 'linux' ? true : false,
        icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
        },
    });

    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        );
    });

    if (VITE_DEV_SERVER_URL) {
        win.loadURL(VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(path.join(RENDERER_DIST, 'index.html'));
    }

    ipcMain.on('title', (event, params) => {
        const webContents = event.sender;
        const win = BrowserWindow.fromWebContents(webContents);
        win?.setTitle(params);
    });

    ipcMain.on('close', () => {
        app.quit();
    });

    ipcMain.on('widen', () => {
        win?.setFullScreen(true);
        console.log('jey');
    });

    ipcMain.on('exits', () => {
        win?.setFullScreen(false);
    });

    const script_path = path.join(__dirname, '../run.sh');

    ipcMain.on('start', () => {
        execFile(script_path, (error, stdout, stderr) => {
            if (error) {
                console.error('Error running script:', error);
                return;
            }
            console.log('Script output:', stdout);
            if (stderr) console.error('Script error output:', stderr);
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
        win = null;
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.whenReady().then(createWindow);
