const Path = require('path');
const fs = require('fs');
const fastFolderSizeSync = require('fast-folder-size/sync');
const { randomId } = require('@mantine/hooks');
const Encoding = require('encoding-japanese');
const { ipcMain} = require('electron');
const _ = require('lodash');
const util = require('minecraft-server-util');

var methods = {}
let allDirs = [];

methods.scan = (dir)=>{
    let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json'), 'utf-8'));
    let scanDirs = [];
    const path = dir.concat("/Servers");

    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    let files = fs.readdirSync(path);

    files.forEach((file)=>{
        if(fs.lstatSync(path.concat("/" + file)).isDirectory()){
            let data =  fs.readdirSync(path.concat("/" + file));
            if(data.includes(".kubes")){
                let kubes = JSON.parse(fs.readFileSync(path.concat("/" + file + "/.kubes")));
                if("api" in kubes && "version" in kubes){
                    let version = kubes['version']!==""&&kubes['version']?kubes['version']:"unknown";
                    let api = kubes['api']?kubes['api']:"";
                    let prop = data.filter((e)=>e === "server.properties");
                    let props = fs.readFileSync(path.concat("/"+file+"/"+prop), 'utf-8')
                                .split("\r\n")
                                .filter((e)=>e.charAt(0)!=="#" && e)
                                .reduce((acc,line)=>{
                                    _.set(acc, ...line.split('='));
                                    return acc;
                                },{});
                    
                    let port = props['server-port'];
                    let maxPlayers = props['max-players'];

                    scanDirs.push({"path": path.concat("/" + file),'api': api.charAt(0).toUpperCase() + api.slice(1), 'version': version, "name": file, 'port': port, 'max-players': maxPlayers});
                }
            }
        }
    }); 
    allDirs = scanDirs;
    dataLast["serverList"] = allDirs;
    fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2));
    return allDirs;
}

ipcMain.handle('online-users', async (e, port)=>{
    let resp = await util.status('localhost', parseInt(port), {enableSRV: true});
    console.log(port, resp['players']);
    return resp['players']['online'];
});

ipcMain.handle('rename-server', (e, data)=>{
    let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    var newPath = data['path'].slice(0, data['path'].length-data['Oldname'].length).concat(data['Newname']);
    if(!fs.existsSync(newPath)){
        for(let i = 0; i < allDirs.length; i++){
            if(allDirs[i]["name"] === data["Oldname"]){
                allDirs[i]["path"] = newPath;
                allDirs[i]["name"] = data["Newname"];
            }
        }
        if(dataLast['lastLaunched'] === data['path']){
            dataLast['lastLaunched'] = newPath;
        }
        dataLast['serverList'] = allDirs;
        fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2));
        fs.renameSync(data['path'], newPath);
        return 'success'
    }
    else{
        return 'exists'
    }
});

methods.remove = (path)=>{
    console.log('bonalols', path);
    let dataLast = JSON.parse(fs.readFileSync(require.resolve('./lastLaunched.json')));
    fs.rmSync(path, { recursive: true });
    let serv = allDirs.filter((e)=>e['path'] === path);
    if(serv.length > 0){
        allDirs.splice(allDirs.indexOf(serv[0]), 1);
        dataLast['serverList'] =  allDirs;
        fs.writeFileSync(require.resolve('./lastLaunched.json'), JSON.stringify(dataLast, null, 2));
    }
    return "success";
}

ipcMain.handle("remove", (e, path)=>{
    return methods.remove(path);
});

ipcMain.handle('create', (e,data)=>{
    let resp = "success";
    if(!fs.existsSync(data['path'])){
        if(data['type'] === "folder"){
            fs.mkdirSync(data['path']);
        }
        else if(data['type'] === 'file'){
            fs.writeFileSync(data['path'], "");
        }
    }
    else{
        resp = "exists";
    }

    return resp;
});

ipcMain.handle('import', (e,data)=>{
    let resp = 'success';
    if(!fs.existsSync(data['destinationPath'])){
        if(fs.lstatSync(data['pathOrigin']).isDirectory()){
            fs.mkdirSync(data['destinationPath']);
            fs.readdirSync(data['pathOrigin']).forEach((file)=>{
                methods.import({
                    'pathOrigin': data['pathOrigin'].concat("/"+file),
                    'destinationPath': data['destinationPath'].concat('/'+file)
                });
            });
        }
        else{
            fs.writeFileSync(data['destinationPath'], fs.readFileSync(data['pathOrigin']));
        }
    }
    else{
        resp = 'exists'
    }
    
    return resp;
});

ipcMain.handle('readFileContent', (e,path)=>{
    let data = fs.readFileSync(path);
    let encoding = Encoding.detect(data); 
    let resp;
    if(encoding){
        if(Path.extname(path) === '.json'){
            resp = JSON.stringify(JSON.parse(fs.readFileSync(path)),null,2);
        }
        else{
            resp = fs.readFileSync(path, encoding);
        }
        
    }
    else{
        resp = "";
    }
    
    return resp;
});

ipcMain.handle('scan-properties', (e, path)=>{
    let properties = "";
    fs.readdirSync(path).forEach((file)=>{

        if(file === "server.properties"){
            properties = fs.readFileSync(path.concat("/"+file), "utf-8");
        }

    });

    return properties;
});

ipcMain.handle('scan-players', (e, path)=>{
    let dict = {'usercache': {}, 'banned-players': {}, 'banned-ips': {}, 'ops': {}}

    for(const [key, value] of Object.entries(dict)){
        if(fs.existsSync(path + "/" + key + ".json")){
            dict[key] = JSON.parse(fs.readFileSync(path + "/" + key + ".json"));
        }
        else{
            fs.writeFileSync(path + "/" + key + ".json", JSON.stringify([]));
            dict[key] = [];
        }
    }

    return dict;
});

ipcMain.handle('scan-whitelist', (e, path)=>{
    let whitelist = {};

    if(fs.existsSync(path + "/whitelist.json")){
        whitelist = JSON.parse(fs.readFileSync(path + "/whitelist.json"));
    }
    else{
        whitelist = [];
        fs.writeFileSync(path + "/whitelist.json", JSON.stringify([]));
    }

    return whitelist;
});

const doNotDisplay = [
    ".kubes"
]

ipcMain.handle('file-manager', (e, path)=>{
    let files = [];

    if(fs.statSync(path).isDirectory()){
        fs.readdirSync(path).forEach((file)=>{
            if(doNotDisplay.includes(file)) return;
            const properties = fs.statSync(path.concat("/"+file));
            let list = {
                'name': file.substring(0, file.length - Path.extname(path.concat("/"+file)).length),
                'created': properties.birthtime,
                'key': randomId()
            }
            if(properties.isDirectory()){
                list['type'] = "folder";
                list['size'] = fastFolderSizeSync(path.concat("/"+file));
            }
            else{
                list['type'] = Path.extname(path.concat("/"+file)).substring(1,Path.extname(path.concat("/"+file)).length);
                list['size'] = properties.size;
            }
            files.push(list);
        });
    }

    return files;
});

module.exports = methods;

