const fs = require('fs');
const Encoding = require('encoding-japanese');
const { ipcMain } = require('electron');
const _ = require('lodash');
const { server } = require('./server.js');

let win;

function setWindow(Win){
    win = Win;
}

ipcMain.on("change-properties", (e, content, path)=>{
    let properties = "";

    fs.readdirSync(path).forEach((file)=>{
        if(file==="server.properties"){
            properties = path.concat("/"+file);
        }
    });

    let props = content.split("\r\n")
                    .filter((e)=>e.charAt(0)!=="#" && e)
                    .reduce((acc,line)=>{
                        _.set(acc, ...line.split('='));
                        return acc;
                    },{});
    let port = props['server-port'];
    let maxPlayers = props['max-players'];

    let data = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    for(let i = 0; i < data['serverList'].length; i++){
        if(data['serverList'][i]['path'] === path){
            data['serverList'][i]['port'] = port;
            data['serverList'][i]['max-players'] = maxPlayers;
        }
    }

    fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(data, null, 2));
    fs.writeFileSync(properties, content, { encoding: "utf-8"});

    win.webContents.send('changed-port', {port: port, maxPlayers: maxPlayers});
});

ipcMain.on('changeFileContent', (e,content, path)=>{
    let data = fs.readFileSync(path);
    let encod = Encoding.detect(data);
    if(path.slice(-17) === "server.properties"){
        let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));

        let props = content.split("\r\n")
                    .filter((e)=>e.charAt(0)!=="#" && e)
                    .reduce((acc,line)=>{
                        _.set(acc, ...line.split('='));
                        return acc;
                    },{});
        let port = props['server-port'];
        let maxPlayers = props['max-players'];

        console.log(path.slice(-18))
        for(let i = 0; i < dataLast['serverList'].length; i++){
            console.log(dataLast['serverList'][i]['path']);
            if(dataLast['serverList'][i]['path'] === path.slice(0,-18)){
                dataLast['serverList'][i]['port'] = port;
                dataLast['serverList'][i]['max-players'] = maxPlayers;
            }
        }
        fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null ,2));
        win.webContents.send('changed-port', {port: port, maxPlayers: maxPlayers});
    }

    fs.writeFileSync(path, content, { encoding: encod ?? "utf-8" });
});

ipcMain.on("change-status", (e, data)=>{
    let filePath = "";

    fs.readdirSync(data['path']).forEach((file)=>{
        if(file === data['type'] + ".json"){
            filePath = data['path'].concat("/"+file);
        }
    });

    var rawFile = fs.readFileSync(filePath);
    let fileContent = JSON.parse(rawFile);

    response = fileContent.some((users)=>{
        if(users["uuid"] === data['user']["uuid"]){
            
            return true;
        }
    });

    if(response != true){
        fileContent.push({"uuid":data['user']['uuid'], 'name': data['user']['name'], "level":4, "bypassesPlayerLimit":false});
    }
    else{
        let index = fileContent.findIndex((element)=>element['uuid'] === data['user']['uuid']);
        if(index != -1){
            fileContent.splice(index, 1);
        }
        
    }

    fs.writeFile(filePath, JSON.stringify(fileContent, null, 2), (err)=>{
        if(err) throw err;
    });
});

ipcMain.handle('rename-file', (e, data)=>{
    let resp = "success";
    if(!fs.existsSync(data['newPath'])){
        fs.rename(data["oldPath"], data['newPath'], (err)=>{
            if(err) throw err;
        });
    }
    else{
        resp = "exists";
    }
    return resp;
});

module.exports = setWindow;