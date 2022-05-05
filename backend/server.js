const { spawn, exec } = require("child_process");
const fs = require('fs');
const { ipcMain , BrowserWindow } = require('electron');
var propertiesReader = require('properties-reader');
const methods = require('./manage-servers');

let server = {};
let servList = {};
let win;
let data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));

server.setWin = (Win)=>{
    win = Win;
}

ipcMain.handle('get-activity', async(e,path)=>{
    if(servList[path] !== undefined){
        return servList[path]['status'];
    }
    else{
        return "0";
    }
});

ipcMain.handle('last-server-launched', ()=>{
    data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    if(!data['lastLaunches']){
        data['lastLaunches'] = [];
    }
    data['lastLaunches'] = data['lastLaunches'].filter((e)=>data['serverList'].some(el=>el['path'] === e));
    fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(data, null, 2));
    for(let i = 0; i < data['lastLaunches'].length; i++){
        if(fs.existsSync(data['lastLaunches'][i])){
            return data['serverList'].filter((e)=>e['path'] === data['lastLaunches'][i])[0];
        }
    }
    return;
});

server.start = (path)=>{
    data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    let file;
    fs.readdirSync(path).forEach((files)=>{
        if(files.slice(-4) === ".jar"){
            file = files;
        }
    });
    exec('echo eula=true>eula.txt', {shell: true,cwd: path}, (error, stdout, stderr)=>{
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
        console.error(`error: ${error}`);
    });

    if(servList[path] === undefined){
        servList[path] = {};
    }
    if(servList[path]['status'] !== 3){
        servList[path]['status'] = 2;
    }
    if(!data['lastLaunches']){
        data['lastLaunches'] = [];
    }

    let kubes = JSON.parse(fs.readFileSync(path + "/.kubes"));

    if(!kubes['ram'] || kubes['ram'] === ""){
        kubes['ram'] = "1024";
        fs.writeFileSync(path + "/.kubes", JSON.stringify(kubes, null ,2));
    }

    let rawCommand = `java -Xms${kubes['ram']}M -Xmx${kubes['ram']}M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:InitiatingHeapOccupancyPercent=15 -Dusing.aikars.flags=https://mcflags.emc.gs/ -Daikars.new.flags=true -jar "${path.concat("/"+file)}" nogui`;
    let command = rawCommand.split(" ");
    servList[path]['process'] = spawn(command[0], command.slice(1,command.length), {spawn: true, shell: true, cwd: path});
    const index = data['lastLaunches'].indexOf(path);
    if(index !== -1){
        data['lastLaunches'].splice(index, 1);
    }
    data['lastLaunches'].unshift(path);
      
    fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(data, null, 2), (err)=>{
        if(err)console.log(err);
    });

    servList[path]['process'].stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
        win.webContents.send('error-starting-server', `${data}`);
    });

    servList[path]['process'].on('close', (code) => {
        try{
            console.log(`child process exited with code ${code}`);
            if(win !== undefined && servList[path]['status'] !== 3){
                win.webContents.send('closed-server', path);
                servList[path]['status'] = 0;
            }
            if(servList[path]['restart']){
                servList[path]['restart'] = false;
                server.start(path);
            }
        } catch (err){
            console.log(err);
        }
    });

    servList[path]['process'].stdout.on('data', (data) => {
        
        console.log(`stdout: ${data}`);
        if(`stdout: ${data}`.slice(-25) === '! For help, type "help"\r\n' || `stdout: ${data}`.slice(-32) === '! For help, type "help" or "?"\r\n' ){
            if(win !== undefined){
                win.webContents.send('started-server', path);
                servList[path]['status'] = 1;
            }
        }        
    });
}

ipcMain.on('start-server', (e,path)=>{
    server.start(path);
});

server.createServ = (servInfo, path)=>{
    let init = spawn('java', [`-Xmx${servInfo['ram']}M`, `-Xms1M`, "-jar","server.jar", "nogui"], {cwd: path, spawn: true});

    init.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);      
    });

    new Promise((res, rej)=>{

        let errorVers = false;
        let errorDat = "";

        init.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            errorVers = true;
            errorDat = data;
        });

        init.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if(errorVers){
                rej(`${errorDat}`);
            }
            else if(`${code}` === "0"){
                exec('echo eula=true>eula.txt', {shell: true,cwd: path}, (error, stdout, stderr)=>{
                    console.log(`stdout: ${stdout}`);
                    console.log(`stderr: ${stderr}`);
                    console.error(`error: ${error}`);
                    if(stderr){
                        rej(`Error: ${stderr}`);
                    }
                    if(error){
                        rej(`Error: ${error}`);
                    }
                });
                let properties;
                try{
                    properties = propertiesReader(path.concat('/server.properties')).getAllProperties();
                    properties["server-port"] = servInfo['port'];
                    properties["motd"] = servInfo['motd'];
                    properties['server-ip'] = servInfo['ip'];
                    let final = JSON.stringify(properties)
                                    .replaceAll('{',"")
                                    .replaceAll('}', "")
                                    .replaceAll('\"', "")
                                    .replaceAll(',', "\n")
                                    .replaceAll(':',"=");
                    fs.writeFileSync(path.concat('/server.properties'), final, { encoding: "utf-8"});
                    res('closed');
                }catch(err){
                    rej(err);
                }
            }
            else{
                rej(`child process exited with code ${code}`);
            }
        });
    }).then(()=>{
        console.log('res');
        win.webContents.send('launching-server');
        let errorLaunch = false;
        let errorDat = "";
        servList[path] = {};
        servList[path]['process'] = spawn('java', [`-Xmx${servInfo['ram']}M`, `-Xms1024M`, "-jar","server.jar", "nogui"], {cwd: path, spawn: true});
        servList[path]['process'].stderr.on('data', (data) => {
            errorLaunch = true;
            errorDat = data;
            console.log(`stderr: ${data}`, "aeaeaeaea", path);
        });
        servList[path]['process'].stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            if(`${data}`.slice(-3) === "%\r\n"){
                win.webContents.send('preparing-spawn');
            }
            if(`stdout: ${data}`.slice(-25) === '! For help, type "help"\r\n' || `stdout: ${data}`.slice(-32) === '! For help, type "help" or "?"\r\n' ){
                let kubes = {
                    "api": servInfo['api'].charAt(0).toUpperCase() + servInfo['api'].slice(1),
                    "version": servInfo['version'],
                    "ram": servInfo['ram']
                }
                fs.writeFileSync(path.concat("/.kubes"), JSON.stringify(kubes, null, 2));
                if(win !== undefined){
                    dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
                    dataLast['lastLaunches'].unshift(path);
        
                    fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2), (err)=>{
                        if(err)console.log(err);
                    });
                    servList[path]['status'] = 1;
                    win.webContents.send('created-server');
                    win.webContents.send('started-server', path);
                }
            }  
        });
        servList[path]['process'].on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if(errorLaunch){
                if(`${errorDat}`.length <= 200){
                    console.log('error');
                    win.webContents.send('err-creating-server', `${errorDat}`);
                }
                else{
                    console.log('error');
                    win.webContents.send('err-creating-server', "Error: Server closed.");
                }
                methods.remove(path);
            }
            if(`${code}` === "0"){
                win.webContents.send('closed-server', path);
                servList[path]['status'] = 0;
            }
            else{
                if(servList[path]['status'] === 1){
                    win.webContents.send('closed-server', path);
                    servList[path]['status'] = 0;
                }
                else{
                    console.log('error');
                    win.webContents.send('err-creating-server', `child process exited with code ${code}`);
                    methods.remove(path);
                }
            }
        });
    },(error)=>{
        console.log('rej');
        if(error.length <= 200){
            console.log('sends');
            win.webContents.postMessage('err-creating-server', error);
        }
        else{
            win.webContents.send('err-creating-server', "Error: Server closed.");
        }
        methods.remove(path);
    }).catch((err)=>console.log(err ,"ayayaya"));
    
}

server.stop = (path)=>{
    if(servList[path]){
        servList[path]['status'] = 4;
        try{
            servList[path]['process'].stdin.write("stop\n");
        }catch(err){
            console.log(err);
        }
        try{
            servList[path]['process'].stdin.end();
        }catch(err){
            console.log(err);
        }
    }
};

ipcMain.on('stop-server', (e, path)=>{
    server.stop(path);
});

ipcMain.on('restart-server', (e,path)=>{
    if(servList[path] && servList[path]['status'] === 1){
        servList[path]['status'] = 3;
        servList[path]['restart'] = true;
        server.stop(path);
    }
});

server.quit = ()=>{
    let length;
    let y = 0;
    let Key;
    for(let i in Object.entries(servList)){
        length=i;
    }
    for(const [key, value] of Object.entries(servList)){
        if(y === length){
            Key = key;
        }
        servList[key]['process'].stdin.write("stop\n");
        servList[key]['process'].stdin.end();
        y++;
    }

    return new Promise((res, rej)=>{
        if(Key){
            servList[Key]['process'].on('close', () => {
                res('done');
            });
        }
        else{
            res('done');
        }
    });
}

module.exports = server;