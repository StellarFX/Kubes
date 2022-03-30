const path = require('path');
const fs = require('fs');
var PropertiesReader = require('properties-reader');

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

                if(data.includes("server.properties") && data.find(element => element.slice(-4) == ".jar") != undefined && data.find(element => element.slice(-4) == ".bat") != undefined){

                    scanDirs.push({"path": path.concat("/" + file), "name": file});
                }
            }
        }); 
    }
    allDirs = scanDirs;
    return allDirs;
}

methods.rename = (data)=>{

    var newPath = data['path'].slice(0, data['path'].length-data['Oldname'].length).concat(data['Newname']);

    for(let i = 0; i < allDirs.length; i++){
        if(allDirs[i]["name"] == data["Oldname"]){
            allDirs[i]["path"] = newPath;
            allDirs[i]["name"] = data["Newname"];
        }
    }
    let renaming = fs.renameSync(data['path'], newPath);
    return "renamed";
}

methods.remove = (path)=>{

    fs.rmdirSync(path, { recursive: true });
} 

methods.readContent = (id)=>{
    let path = "";

    for(let i = 0; i < allDirs.length; i++){
        if(allDirs[i]['name'] == id){
            path = allDirs[i]['path'];
        }
    }

    let properties = "";
    let userList = {};
    let whitelist = {};
    let banned = {};
    let bannedIp = {};
    let ops = {};
    
    fs.readdirSync(path).forEach((file)=>{

        if(file.slice(-11) == ".properties"){
            console.log(Object.entries(PropertiesReader(path.concat("/"+file)).getAllProperties()));
            for(const [key, value] of Object.entries(PropertiesReader(path.concat("/"+file)).getAllProperties())){
                console.log(key)
                properties = properties.concat(key+"="+value+"\n");
            }
        }

        if(file == "usercache.json"){
            userList = JSON.parse(fs.readFileSync(path.concat("/"+file)));
        }

        if(file == "whitelist.json"){
            whitelist = JSON.parse(fs.readFileSync(path.concat("/"+file)));
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

    return {'path': path, 'properties': properties.substring(0, properties.length-2), 'users': userList, 'banned': banned, 'whitelist': whitelist, 'banned-ip': bannedIp, 'ops': ops};
}

module.exports = methods;

