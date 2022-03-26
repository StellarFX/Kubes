const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const { JsonInput } = require('@mantine/core');

var datas = fs.readFileSync(require.resolve('./data.json'));
var infos = JSON.parse(datas);
var defaultPath = infos["initial-path"];
let dir = infos["directory"];

async function AskDefaultPath(win){

    const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory'],
        defaultPath: "C:/",
        title: 'Select default server path.',
        buttonLabel: 'Select default server path'
    });

    let resultingPath = result.filePaths[0].replaceAll('\\','/');

    console.log(resultingPath.slice(-6));

    if(!fs.existsSync(resultingPath.concat("/Kubes")) && resultingPath.slice(-6) != "/Kubes") {
        fs.mkdirSync(resultingPath.concat("/Kubes"));
        defaultPath = resultingPath.concat("/Kubes");
    }
    if(resultingPath.slice(-6) == "/Kubes"){
        defaultPath = resultingPath;
    }
    else if(fs.existsSync(resultingPath.concat("/Kubes"))){
        defaultPath = resultingPath.concat("/Kubes");
    }
    
    infos["initial-path"] = defaultPath;
    infos["initialized"] = true;
    infos["directory"] = defaultPath;
    dir = defaultPath;

    fs.writeFile(require.resolve('./data.json'), JSON.stringify(infos), (err)=>{
        if(err) console.log("error:", err);
    });

}



function createWindow() {
    // Create the browser window
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        icon: path.join(__dirname, 'Icon-01.png'),
        minHeight: 540,
        minWidth: 960,
        frame: false,
        titleBarStyle: 'hidden',
        transparent: true,
        simpleFullscreen: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
    });

    if(infos["initialized"] == false){
        AskDefaultPath(win);
    }

    ipcMain.handle("initialize-path", async ()=>{
        return dir;
    });

    ipcMain.on("minimize-window", () => {
        win.minimize();
    });    

    ipcMain.handle("maximize-window", () => {
        if(!win.isMaximized()){
            win.maximize();
            win.resizable = false;
            return true;
        }
        else{
            win.unmaximize();
            win.resizable = true;
            return false;
        }
    });

    ipcMain.on("close-window", () => {
        win.close();
    });

    ipcMain.handle("change-path", async (e, path)=>{
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
            defaultPath: dir
        });

        if(result.canceled == false){
            dir = result.filePaths[0].replaceAll('\\', '/');
            infos["directory"] = dir;
            fs.writeFile(require.resolve('./data.json'), JSON.stringify(infos), (err)=>{
                if(err) console.log("error:", err);
            });
            return dir;
        }
        else{
            return path;
        }
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.


app.whenReady().then(()=>{
    createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
