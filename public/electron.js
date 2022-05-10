const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');
const fsextra = require('fs-extra');
const methods = require('../backend/manage-servers');
const setWindow = require('../backend/write-on-files');
const server = require('../backend/server.js');
const axios = require('axios');
var crypto = require('crypto');
const { spawn, exec } = require("child_process");

function getDatas() {

    try {
        return fs.readFileSync(require.resolve('./data.json'));
    } catch (err) {
        fs.writeFileSync(__dirname + "/data.json", JSON.stringify({
            "directory": "",
            "initialized": false,
            "initial-path": ""
        }));

        return fs.readFileSync(require.resolve('./data.json'));
    }

}

var datas = getDatas();
var infos = JSON.parse(datas);
var defaultPath = infos["initial-path"];
let dir = infos["directory"];
let window;

process.on('uncaughtException', (err,source)=>{

    console.error({
        error: err,
        source, source
    });

});

async function AskDefaultPath(win){

    const result = await dialog.showOpenDialog(win, {
        properties: ['openDirectory'],
        defaultPath: "C:/",
        title: 'Select default server path.',
        buttonLabel: 'Select Kubes directory'
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

    fs.writeFile(require.resolve('./data.json'), JSON.stringify(infos, null, 2), (err)=>{
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

    window = win;

    server.setWin(win);
    setWindow(win);

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

    ipcMain.handle('window-stat', ()=>{
        return win.isMaximized();
    });

    if(!infos || infos["initialized"] === false){
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
            fs.writeFile(require.resolve('./data.json'), JSON.stringify(infos, null, 2), (err)=>{
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

ipcMain.handle("scan-servers", async ()=>{
    return await methods.scan(dir);
});

ipcMain.handle('create-server', async (e,data)=>{
    if(fs.existsSync(dir.concat("/Servers/"+data['name']))){
        return true;
    }
    else{
        let api = await (await axios.get(`https://api.kubesmc.ml/apis/${data['api']}/${data['version']}`)).data;
        let samplePath = dir.concat("/Apis/"+data['api']+"/"+data['version']);
        let command = `java -Xmx${data['ram']}M -Xms1024M -jar server.jar nogui`;
        let secondCommand = `java -Xmx${data['ram']}M -Xms1024M -jar server.jar nogui`;

        if(!fs.existsSync(samplePath)){

            createDirIfNotExist(dir.concat("/Apis"));
            createDirIfNotExist(dir.concat("/Apis/"+data['api']));
            createDirIfNotExist(samplePath);
        }
        
        const url = api['build']["link"];
        let fileName = url.split("/").at(-1);
        let serverPath = samplePath+"/"+fileName;
        const response = await axios({url, method:'GET',responseType: 'stream'});
        window.webContents.send('building-jar');
        if(fs.existsSync(samplePath+"/"+fileName) && api['build']['sha256'] !== ""){
                
            let sum = crypto.createHash('sha256');
            sum.update(fs.readFileSync(samplePath+"/"+fileName));
    
            if(sum.digest('hex') !== api['build']['sha256']){
                const writer = fs.createWriteStream(samplePath+"/"+fileName);
                response.data.pipe(writer);
    
                await new Promise((res,rej)=>{
                    writer.on('finish', res);
                    writer.on('error', ()=>{
                        window.webContents.send('err-creating-server', "");
                        rej();
                    });
                });
            }
        }
        if(!fs.existsSync(serverPath)){
            const writer = fs.createWriteStream(samplePath+"/"+fileName);
            window.webContents.send('longer-jar');
            response.data.pipe(writer);
    
            await new Promise((res,rej)=>{
                writer.on('finish', res);
                writer.on('error', ()=>{
                    window.webContents.send('err-creating-server', "");
                    rej();
                });
            });
        }
        fs.mkdirSync(dir.concat("/Servers/" + data['name']));
        if(api['build']['command'] !== ""){
            if(!fs.existsSync(samplePath + `/libraries/net/minecraft/server/${data['version']}/server-${data['version']}.jar`) && !fs.existsSync(samplePath + `/minecraft_server.${data['version']}.jar`)){
                window.webContents.send('longer-jar');
                let command = api['build']['command'].split(" ");
                let installer = spawn(command[0], command.slice(1,command.length), {spawn: true, shell: true, cwd: samplePath});

                installer.stdout.on('data', (data) => {
                    console.log(`stdout: ${data}`);      
                });

                await new Promise((res,rej)=>{
                    installer.stderr.on('data', (data) => {
                        console.log(`stderr: ${data}`);
                        window.webContents.send('err-creating-server', `${data}`);
                        rej();
                    });

                    installer.on('close', (code) => {
                        console.log(`child process exited with code ${code}`);
                        res();
                    });
                });
            }
            let forge;
            let ram;
            if(fs.existsSync(samplePath + `/libraries/net/minecraft/server/${data['version']}/server-${data['version']}.jar`)){
                serverPath = samplePath + `/libraries/net/minecraft/server/${data['version']}/server-${data['version']}.jar`;
                fs.copyFileSync(serverPath, dir.concat("/Servers/" + data['name'] + "/server.jar"));
            }
            else if(fs.existsSync(samplePath + `/minecraft_server.${data['version']}.jar`)){
                fs.readdirSync(samplePath).forEach((file)=>{
                    if(file.includes('forge') && !(file.includes('installer'))){
                        forge = file;
                    }
                });
                serverPath = samplePath + `/minecraft_server.${data['version']}.jar`;
                fs.copyFileSync(serverPath, dir.concat("/Servers/" + data['name'] + "/server.jar"));
                
            }
            fs.readdirSync(samplePath).forEach((file)=>{
                fsextra.copySync(samplePath +"/" + file, dir.concat("/Servers/" + data['name'] + "/" + file));
                if(file.slice(-4) === '.txt'){
                    ram = file;
                }
            });
            if(fs.existsSync(samplePath + "/run.bat")){
                fs.writeFileSync(samplePath + "/" + ram, `-Xmx${data['ram']}`);
                command = fs.readFileSync(samplePath + "/run.bat", "utf-8")
                            .split("\n")
                            .filter((e)=>e.substring(0,3) !== "REM")
                            .at(-3)
                            .slice(0,-3)
                            .concat('nogui %*');

                secondCommand = command;
            }
            else{
                secondCommand = `java -Xmx${data['ram']}M -Xms1024M -jar ${forge} nogui`;
            }
        }
        else{
            fs.copyFileSync(serverPath, dir.concat("/Servers/" + data['name'] + "/server.jar"));
        }
        window.webContents.send('creating-server');
        server.createServ(data, dir.concat("/Servers/" + data['name']), command, secondCommand, api['build']['link2']);
    }
    return false;
});

ipcMain.handle("initialize-path", ()=>{
    return dir;
});

ipcMain.handle("change-path-input", (e, path)=>{
    if(fs.existsSync(path)){
        dir = path;
        return path;
    }
    else{
        return dir;
    }
})

ipcMain.handle('scan-server-path', (e, id)=>{
    return dir.concat("/Servers/"+id);
});

app.whenReady().then(()=>{
    createWindow();
});

app.on('window-all-closed', async () => {
    if (process.platform !== 'darwin') {
        await server.quit();
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});