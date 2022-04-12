const Path = require('path');
const fs = require('fs');
const querys = require('querystring');
const fastFolderSizeSync = require('fast-folder-size/sync');
var PropertiesReader = require('properties-reader');
const { randomId } = require('@mantine/hooks');

var methods = {}
let allDirs = [];

methods.scan = (dir)=>{

    let scanDirs = [];
    const path = dir.concat("/Servers");

    if(fs.existsSync(path)){
        let files = fs.readdirSync(path);

        files.forEach((file)=>{
            if(fs.lstatSync(path.concat("/" + file)).isDirectory()){
                
                let data =  fs.readdirSync(path.concat("/" + file));
                if(data.filter(element => element.slice(-11) == ".properties" || element.slice(-4) == ".jar").length == 2 && data.includes('eula.txt')){

                    scanDirs.push({"path": path.concat("/" + file), "name": file});
                }
            }
        }); 
    }
    allDirs = scanDirs;
    return allDirs;
}

methods.renameServer = (data)=>{

    var newPath = data['path'].slice(0, data['path'].length-data['Oldname'].length).concat(data['Newname']);

    for(let i = 0; i < allDirs.length; i++){
        if(allDirs[i]["name"] == data["Oldname"]){
            allDirs[i]["path"] = newPath;
            allDirs[i]["name"] = data["Newname"];
        }
    }
    let renaming = fs.renameSync(data['path'], newPath);
}

methods.remove = (path)=>{

    fs.rmSync(path, { recursive: true });
    return "success";
}

methods.create = (data)=>{
    if(!fs.existsSync(data['path'])){
        if(data['type'] === "folder"){
            fs.mkdirSync(data['path']);
        }
        else if(data['type'] === 'file'){
            fs.writeFileSync(data['path'], "");
        }
    }

    return "success";
}

methods.import = async (data)=>{
    console.log(data['destinationPath']);
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
    return 'success';
}

methods.scanProperties = (path)=>{

    let properties = "";
    fs.readdirSync(path).forEach((file)=>{

        if(file.slice(-11) == ".properties"){
            for(const [key, value] of Object.entries(PropertiesReader(path.concat("/"+file)).getAllProperties())){
                if(key != "[]" && key != []){
                    properties = properties.concat(key+"="+value+"\n");
                }
            }
        }

    });

    return properties;
}

methods.scanPlayers = (path)=>{

    let banned = {};
    let bannedIp = {};
    let ops = {};
    let userList = {};

    fs.readdirSync(path).forEach((file)=>{

        if(file == "usercache.json"){
            userList = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

        if(file == "banned-players.json"){
            banned = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

        if(file == "banned-ips.json"){
            bannedIp = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

        if(file == "ops.json"){
            ops = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

    });

    return { 'users': userList, 'banned': banned, 'banned-ip': bannedIp, 'ops': ops}
    
}

methods.scanWhitelist = (path)=>{

    let whitelist = {};
    let userList = {};

    fs.readdirSync(path).forEach((file)=>{

        if(file == "whitelist.json"){
            whitelist = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

        if(file == "usercache.json"){
            userList = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

    });

    return {'whitelist':whitelist, 'userlist':userList};
}

methods.fileManager = (path)=>{
    let files = [];

    if(fs.statSync(path).isDirectory()){
        fs.readdirSync(path).forEach((file)=>{
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
}

module.exports = methods;

