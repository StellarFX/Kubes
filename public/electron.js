const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const { JsonInput } = require('@mantine/core');
const methods = require('../backend/manage-servers');
const writer = require('../backend/write-on-files');

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

    if(result.canceled){
        AskDefaultPath(win);
    }

    let resultingPath = result.filePaths[0].replaceAll('\\','/');

    if(resultingPath.slice(-6) != "/Kubes"){
        createDirIfNotExist(resultingPath.concat("/Kubes"));
        createDirIfNotExist(resultingPath.concat("/Kubes/Servers"));
        defaultPath = resultingPath.concat("/Kubes");
    }
    else{
        createDirIfNotExist(resultingPath.concat("/Servers"));
        defaultPath = resultingPath;
    }
    
    infos["initial-path"] = defaultPath;
    infos["initialized"] = true;
    infos["directory"] = defaultPath;
    dir = defaultPath;

    fs.writeFile(require.resolve('./data.json'), JSON.stringify(infos), (err)=>{
        if(err) console.log("error:", err);
    });

}

function createDirIfNotExist(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
        return false;
    }
    else{
        return true;
    }
}

function createWindow() {

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



    if(infos["initialized"] === false){
        AskDefaultPath(win);
    } 

    ipcMain.handle("change-path", async (e, path)=>{
        const result = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
            defaultPath: dir
        });

        if(result.canceled === false){
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

    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
}

ipcMain.handle("scan-servers", async()=>{
    return methods.scan(dir);
});

ipcMain.handle("initialize-path", async ()=>{
    return dir;
});

ipcMain.handle("change-path-input", async (e, path)=>{
    if(fs.existsSync(path)){
        dir = path;
        console.log(path);
        return path;
    }
    else{
        console.log(dir);
        return dir;
    }
})

ipcMain.on('rename-server', (e, data)=>{
    methods.renameServer(data);
});

ipcMain.handle('file-manager', async (e, Path)=>{
    return methods.fileManager(Path);
});

ipcMain.handle("remove", async (e, path)=>{
    return methods.remove(path);
});

ipcMain.handle('create', async (e,data)=>{
    return methods.create(data);
});

ipcMain.handle('import', async (e,data)=>{
    return methods.import(data);
});

ipcMain.handle('readFileContent', async (e,path)=>{
    return methods.readFileContent(path);
});


ipcMain.handle('scan-server-path', async (e, id)=>{
    return dir.concat("/Servers/"+id);
});

ipcMain.handle('scan-players', async (e, path)=>{
    return methods.scanPlayers(path);
});

ipcMain.handle('scan-whitelist', async (e, path)=>{
    return methods.scanWhitelist(path);
});

ipcMain.handle('scan-properties', async (e, path)=>{
    return methods.scanProperties(path);
});



ipcMain.on("change-properties", (e, content, path)=>{
    writer.changeProperties(content, path);
});

ipcMain.on("change-status", (e, data)=>{
    writer.changeStatus(data);
});

ipcMain.handle('rename-file', async (e, data)=>{
    return writer.renameFile(data);
});

ipcMain.on('changeFileContent', (e,content, path)=>{
    writer.changeFileContent(content,path);
});



app.whenReady().then(()=>{
    createWindow();
});

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