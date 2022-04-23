const { spawn, exec } = require("child_process");
const fs = require('fs');
const { ipcMain} = require('electron');
var propertiesReader = require('properties-reader');

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
    if(fs.existsSync(data['lastLaunched'])){
        return data['serverList'].filter((e)=>e['path'] === data['lastLaunched'])[0];
    }
    else{
        return;
    }
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
    servList[path]['process'] = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', `"${path.concat("/"+file)}"`, 'nogui'], {spawn: true, shell: true, cwd: path});
    data['lastLaunched'] = path;
      
    fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(data, null, 2), (err)=>{
        if(err)console.log(err);
    });

    servList[path]['process'].stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
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
        if(`stdout: ${data}`.slice(-25) === '! For help, type "help"\r\n'){
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
    fs.mkdirSync(path);
    fs.copyFileSync(require.resolve('./serverTemplate/spigot-1.16.4.jar'), path.concat("/server.jar"));
    let init = spawn('java', [`-Xmx${servInfo['ram']}M`, `-Xms1024M`, "-jar","server.jar", "nogui"], {cwd: path, spawn: true});

    init.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
    });

    let done = new Promise((res, rej)=>{
        init.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            exec('echo eula=true>eula.txt', {shell: true,cwd: path}, (error, stdout, stderr)=>{
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                console.error(`error: ${error}`);
            });
            let properties = propertiesReader(path.concat('/server.properties')).getAllProperties();
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
        });
    });

    done.then(()=>{
        servList[path] = {};
        servList[path]['process'] = spawn('java', [`-Xmx${servInfo['ram']}M`, `-Xms1024M`, "-jar","server.jar", "nogui"], {cwd: path, spawn: true});

        servList[path]['process'].stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        servList[path]['process'].stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            if(`stdout: ${data}`.slice(-25) === '! For help, type "help"\r\n'){
                let kubes = {
                    "api": "Spigot",
                    "version": "1.16.4"
                }
                fs.writeFileSync(path.concat("/.kubes"), JSON.stringify(kubes, null, 2));
                if(win !== undefined){
                    dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
                    dataLast['lastLaunched'] = path;
      
                    fs.writeFile(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2), (err)=>{
                        if(err)console.log(err);
                    });
                    win.webContents.send('created-server');
                    win.webContents.send('started-server', path);
                    servList[path]['status'] = 1;
                }
            }  
        });
        servList[path]['process'].on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            win.webContents.send('closed-server', path);
            servList[path]['status'] = 0;
        });
    },()=>{});

    init.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);      
    });

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
    });
}

module.exports = server;