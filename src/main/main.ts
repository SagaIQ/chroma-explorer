import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ChromaDbService } from './chroma-service';
import { ConnectionOptions } from '../shared/chroma-service';
import { Channels } from '../shared/contants';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

export const setup = () => {
  const chromaService = new ChromaDbService();

  ipcMain.handle(Channels.CONNECT, async (_, connectionOptions: ConnectionOptions) => {
    return chromaService.connect(connectionOptions);
  });

  ipcMain.handle(Channels.DISCONNECT, async () => {
    return chromaService.disconnect();
  });

  ipcMain.handle(Channels.HEARTBEAT, async () => {
    return chromaService.heartbeat();
  });

  ipcMain.handle(Channels.GET_COLLECTIONS, async () => {
    return chromaService.listCollections();
  });

  ipcMain.handle(Channels.GET_COLLECTION, async (_, collectionName: string) => {
    return chromaService.getCollection(collectionName);
  }); 

  ipcMain.handle(Channels.GET_DOCUMENT, async (_, collectionName: string, documentName: string) => {
    return chromaService.getDocument(collectionName, documentName);
  }); 

  ipcMain.handle(Channels.SEARCH_COLLECTION, async (_, collectionName: string, searchString: string) => {
    return chromaService.searchCollection(collectionName, searchString);
  }); 
}

setup()

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1440,
    minWidth: 1440,
    height: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
