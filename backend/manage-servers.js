const { app, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');

var methods = {}
let allDirs = [];

methods.scan = (dir)=>{

    const path = dir.concat("/Servers");
    let scanDir = [];
    
    let finished = false;

    if(fs.existsSync(path)){
        let files = fs.readdirSync(path);

        files.forEach((file)=>{
            if(fs.lstatSync(path.concat("/" + file)).isDirectory()){
                let data =  fs.readdirSync(path.concat("/" + file));
                if(data.includes("server.properties") && data.find(element => element.slice(-4) == ".jar") != undefined && data.find(element => element.slice(-4) == ".bat") != undefined){
                    scanDir.push({"path": path.concat("/" + file), "name": file});
                }
            }
        }); 
    }
    allDirs = scanDir;
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

methods.remove = (id)=>{
    for(let i = 0; i < allDirs.length; i++){
        if(allDirs[i]["name"] == id){
            allDirs.splice(i,1);
        }
    }
} 

module.exports = methods;

