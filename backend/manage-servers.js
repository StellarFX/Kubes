const Path = require('path');
const fs = require('fs');
const fastFolderSizeSync = require('fast-folder-size/sync');
const { randomId } = require('@mantine/hooks');
const Encoding = require('encoding-japanese');

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
                if(data.includes(".kubes")){

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
        if(allDirs[i]["name"] === data["Oldname"]){
            allDirs[i]["path"] = newPath;
            allDirs[i]["name"] = data["Newname"];
        }
    }
    fs.renameSync(data['path'], newPath);
}

methods.remove = (path)=>{

    fs.rmSync(path, { recursive: true });
    return "success";
}

methods.create = (data)=>{
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
}

methods.import = async (data)=>{
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
}

methods.readFileContent = async (path)=>{
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
}

methods.scanProperties = (path)=>{

    let properties = "";
    fs.readdirSync(path).forEach((file)=>{

        if(file.slice(-11) === ".properties"){
            properties = fs.readFileSync(path.concat("/"+file), "utf-8");
        }

    });

    return properties;
}

methods.scanPlayers = (path)=>{

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
    
}

methods.scanWhitelist = (path)=>{

    let whitelist = {};

    if(fs.existsSync(path + "/whitelist.json")){
        whitelist = JSON.parse(fs.readFileSync(path + "/whitelist.json"));
    }
    else{
        whitelist = [];
        fs.writeFileSync(path + "/whitelist.json", JSON.stringify([]));
    }

    return whitelist;
}

const doNotDisplay = [
    ".kubes"
]

methods.fileManager = (path)=>{
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
}

module.exports = methods;

