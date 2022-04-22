const { spawn } = require("child_process");
const fs = require('fs');
const { ipcMain} = require('electron');

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
    return data['serverList'].filter((e)=>e['path'] === data['lastLaunched'])[0];
});

server.start = (path)=>{
    data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    let file;
    fs.readdirSync(path).forEach((files)=>{
        if(files.slice(-4) === ".jar"){
            file = files;
        }
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

server.stop = (path)=>{
    if(servList[path]){
        try{
            servList[path]['process'].stdin.write("stop\n");
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

    console.log(i, Key);

    return new Promise((res, rej)=>{
        servList[Key]['process'].on('close', () => {
            res('done');
        });
    });
}

module.exports = server;