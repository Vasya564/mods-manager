const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');
const gotTheLock = app.requestSingleInstanceLock()

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './src/assets/icon.ico',
        frame: false,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenu(null)
    mainWindow.setResizable(false)

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile('build/index.html');
    }
    ipcMain.handle('minimize-event', () => {
        mainWindow.minimize()
    })
    ipcMain.handle('close-event', () =>{
        app.quit()
    })
    mainWindow.once('ready-to-show', () =>{
        mainWindow.show();
    })
    if (!gotTheLock) {
        app.quit()
        } else {
        app.on('second-instance', (event, commandLine, workingDirectory) => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
            }
        })
    }
}

app.whenReady().then(() => {
    createWindow()
    autoUpdater.checkForUpdates();
    ipcMain.handle('path-dialog-event', (event) =>{
        dialog.showOpenDialog({
            defaultPath: app.getPath('desktop'),
            properties: ['openDirectory']
        }).then((result)=>{
            if(result.filePaths.length != 0){
                event.sender.send('path-result', result.filePaths)
            }
        });
    })
    ipcMain.handle('cversions-dialog-event', (event) => {
        dialog.showOpenDialog({
            properties: ['multiSelections']
        }).then((result)=>{
            if(result.filePaths.length != 0){
                event.sender.send('cversions-result', result.filePaths)
            }
        });
    })
    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Ok'],
		title: 'Mods Manager Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version is being downloaded.'
	}
	dialog.showMessageBox(dialogOpts, (response) => {

	});
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
	const dialogOpts = {
		type: 'info',
		buttons: ['Restart', 'Later'],
		title: 'Mods Manager Update',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'A new version has been downloaded. Restart the Mods Manager to apply the updates.'
	};
	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall()
	})
});