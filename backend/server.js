const { spawn, exec } = require("child_process");
const fs = require('fs');
const { ipcMain } = require('electron');
var propertiesReader = require('properties-reader');
const methods = require('./manage-servers');
const axios = require('axios');

let server = {};
let servList = {};
let win;

class Server {

    constructor (path, name, ram, api, version){
        this.path = path;
        this.name = name;
        this.ram = ram;
        this.api = api;
        this.version = version;
        this.process;
        this.restart;
        this.status = 0;
    }

    setApi(api){
        this.api = api;
    }

    setVersion(version){
        this.version = version;
    }

    setRam(ram){
        this.ram = ram;
    }

    renameServer(path, name){
        this.path = path;
        this.name = name;
    }

    stopServer(){
        if(this.process){
            if(this.status !== 3){
                this.status = 4;
            }
            
            this.process.stdin.write("stop\n");
            this.process.stdin.end();
        }
    }

    restartServer(){
        if(this.status === 1 && this.process){
            this.restart = true;
            this.status = 3;
            this.stopServer();
        }
    }

    startServer(){
        let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
        let file;
        fs.readdirSync(this.path).forEach((files)=>{
            if(files.slice(-4) === ".jar"){
                file = files;
            }
        });
        exec('echo eula=true>eula.txt', {shell: true,cwd: this.path}, (error, stdout, stderr)=>{
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            console.error(`error: ${error}`);
        });

        if(this.status !== 3){
            this.status = 2;
        }
        if(!dataLast['lastLaunches']){
            dataLast['lastLaunches'] = [];
        }

        let rawCommand = `java -Xms${this.ram}M -Xmx${this.ram}M -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1HeapRegionSize=8M -XX:G1ReservePercent=20 -XX:InitiatingHeapOccupancyPercent=15 -Dusing.aikars.flags=https://mcflags.emc.gs/ -Daikars.new.flags=true -jar "${this.path.concat("/"+file)}" nogui`;
        let command = rawCommand.split(" ");
        this.process = spawn(command[0], command.slice(1,command.length), {spawn: true, shell: true, cwd: this.path});
        const index = dataLast['lastLaunches'].indexOf(this.path);
        if(index !== -1){
            dataLast['lastLaunches'].splice(index, 1);
        }
        dataLast['lastLaunches'].unshift(this.path);
        
        fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2), (err)=>{
            if(err)console.log(err);
        });

        this.process.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            win.webContents.send('error-starting-server', `${data}`);
        });

        this.process.on('close', (code) => {
            try{
                console.log(`child process exited with code ${code}`);
                if(win !== undefined && this.status !== 3){
                    win.webContents.send('closed-server', this.path);
                    this.status = 0;
                }
                if(this.restart){
                    this.restart = false;
                    this.start(this.path);
                }
            } catch (err){
                console.log(err);
            }
        });

        this.process.stdout.on('data', (data) => {
            
            console.log(`stdout: ${data}`);

            if(`stdout: ${data}`.match(/stdout: \[(.*)\] \[Server thread\/INFO\]: Done \((.*)s\)! For help, type "help"/g)){

                if(win !== undefined){
                    win.webContents.send('started-server', this.path);
                    this.status = 1;
                }
                
            }
        });
    }

    createServer(rawCommand, rawSecondCommand, link2, ip, motd, port){
        let command = rawCommand.split(" ");
        let secondCommand = rawSecondCommand.split(" ");
        let init = spawn(command[0], command.slice(1, command.length), {cwd: this.path, spawn: true});
        let errorVers = false;
        init.stdout.on('data', (data) => {
            if(errorVers){
                errorVers = false;
            }
            console.log(`stdout: ${data}`);      
        });

        new Promise((res, rej)=>{

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
                    let properties;
                    
                    try{
                        if(command[command.length-1] !== "%*"){
                            properties = propertiesReader(this.path.concat('/server.properties')).getAllProperties();
                            properties["server-port"] = port;
                            properties["motd"] = motd;
                            properties['server-ip'] = ip;
                            let final = JSON.stringify(properties)
                                            .replaceAll('{',"")
                                            .replaceAll('}', "")
                                            .replaceAll('\"', "")
                                            .replaceAll(',', "\n")
                                            .replaceAll(':',"=");
                            fs.writeFileSync(this.path.concat('/server.properties'), final, { encoding: "utf-8"});
                        }
                        exec('echo eula=true>eula.txt', {shell: true,cwd: this.path}, (error, stdout, stderr)=>{
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
                    }catch(err){
                        rej(err);
                    }
                    res('closed');
                }
                else{
                    console.log(7);
                    rej(`child process exited with code ${code}`);
                }
            });
        }).then(()=>{
            win.webContents.send('launching-server');
            let errorLaunch = false;
            let errorDat = "";
            this.process = spawn(secondCommand[0], secondCommand.slice(1, secondCommand.length), {cwd: this.path, spawn: true});
            this.process.stderr.on('data', (data) => {
                errorLaunch = true;
                errorDat = data;
                console.log(`stderr: ${data}`, "aeaeaeaea", this.path);
            });
            this.process.stdout.on('data', (data) => {
                if(errorLaunch){
                    errorLaunch = false;
                }
                console.log(`stdout: ${data}`);
                if(`${data}`.slice(-3) === "%\r\n"){
                    win.webContents.send('preparing-spawn');
                }
                if(`stdout: ${data}`.match(/stdout: \[(.*)\] \[Server thread\/INFO\]: Done \((.*)s\)! For help, type "help"/g)){
                    let kubes = {
                        "api": this.api.charAt(0).toUpperCase() + this.api.slice(1),
                        "version": this.version,
                        "ram": this.ram
                    }
                    fs.writeFileSync(this.path.concat("/.kubes"), JSON.stringify(kubes, null, 2));
                    if(win !== undefined){
                        let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
                        dataLast['lastLaunches'].unshift(this.path);
            
                        fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2), (err)=>{
                            if(err)console.log(err);
                        });
                        this.status = 1;
                        this.stopServer();
                    }
                }  
            });
            this.process.on('close', async (code) => {
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
                    methods.remove(this.path);
                }
                if(`${code}` === "0"){
                    if(link2){
                        let response = await axios({url: link2, method:'GET',responseType: 'stream'})
                        const writer = fs.createWriteStream(this.path + "/mods/spongeforge.jar");
                        await response.data.pipe(writer);
                    }
                    this.status = 0;
                    win.webContents.send('created-server');
                    win.webContents.send('closed-server', this.path);
                }
                else{
                    win.webContents.send('err-creating-server', `child process exited with code ${code}`);
                    methods.remove(this.path);
                }
            });
        },(error)=>{
            console.log('rej');
            if(error.length <= 200){
                console.log('sends');
                win.webContents.send('err-creating-server', error);
            }
            else{
                win.webContents.send('err-creating-server', "Error: Server closed.");
            }
            methods.remove(this.path);
        }).catch((err)=>console.log(err ,"ayayaya"));
    }

}

server.setWin = (Win)=>{
    win = Win;
}

server.scannedServer = (path, api, version, name, ram)=>{
    if(!servList[path]){
        servList[path] = new Server(path, name, ram, api, version);
    }
    else{
        servList[path].setRam(ram);
        servList[path].setApi(api);
        servList[path].setVersion(version);
    }
}

server.remove = (path)=>{
    delete servList[path];
}

server.rename = (oldpath, newpath, name)=>{
    servList[newpath] = servList[oldpath];
    servList[newpath].renameServer(newpath, name)
    delete servList[oldpath];
}

ipcMain.handle('get-activity', async(e,path)=>{
    if(servList[path]){
        return servList[path].status;
    }
    else{
        return 0;
    }
});

ipcMain.handle('last-server-launched', ()=>{
    let data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
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

ipcMain.on('start-server', (e,path)=>{
    servList[path].startServer();
});

server.createServ = (servInfo, path, rawCommand, rawSecondCommand, link2)=>{
    servList[path] = new Server(path, servInfo['name'], servInfo['ram'], servInfo['api'], servInfo['version']);
    servList[path].createServer(rawCommand, rawSecondCommand, link2, servInfo['ip'], servInfo['motd'], servInfo['port']);
}

ipcMain.on('stop-server', (e, path)=>{
    servList[path].stopServer();
});

ipcMain.on('restart-server', (e,path)=>{
    servList[path].restartServer();
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
        servList[key].stopServer();
        y++;
    }

    return new Promise((res, rej)=>{
        if(Key){
            servList[Key].process.on('close', () => {
                res('done');
            });
        }
        else{
            res('done');
        }
    });
}

module.exports = {server, Server};