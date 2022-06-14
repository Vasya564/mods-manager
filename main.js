const {app, BrowserWindow, ipcMain, dialog} = require('electron');
const {autoUpdater} = require('electron-updater');
const isDev = require('electron-is-dev');

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
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
        //mainWindow.webContents.openDevTools();
    }
    ipcMain.handle('minimize-event', () => {
        mainWindow.minimize()
    })
    ipcMain.handle('close-event', () =>{
        app.quit()
    })

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
            defaultPath: app.getPath('desktop'),
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