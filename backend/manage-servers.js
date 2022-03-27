const { app, dialog } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');

var methods = {}

methods.scan = function scanServers(dir){

    const path = dir.concat("/Servers");

    let allDirs = [];
    let finished = false;


    let files = fs.readdirSync(path);

    files.forEach((file)=>{
        console.log(file);
        if(fs.lstatSync(path.concat("/" + file)).isDirectory()){
            let data =  fs.readdirSync(path.concat("/" + file));
            if(data.includes("server.properties") && data.find(element => element.slice(-4) == ".jar") != undefined && data.find(element => element.slice(-4) == ".bat") != undefined){
                allDirs.push({"path": path.concat("/" + file), "name": file});
            }
        }
    }); 

    return allDirs;
}

methods.rename = function renameServers(data){
    console.log(data['path'].slice(0, data['path'].length-data['Oldname'].length), data['path'].length-data['Oldname'].length);
    console.log(data['path']);
    let renaming = fs.renameSync(data['path'], data['path'].slice(0, data['path'].length-data['Oldname'].length).concat(data['Newname']));
    return "renamed";
}

module.exports = methods;

