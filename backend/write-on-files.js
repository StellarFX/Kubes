const Path = require('path');
const fs = require('fs');
const querys = require('querystring');
const languageEncoding = require('detect-file-encoding-and-language');

var writer = {};

writer.changeProperties = (content, path)=>{
    let properties = "";

    fs.readdirSync(path).forEach((file)=>{
        if(file.substring(file.length-11,file.length)==".properties"){
            properties = path.concat("/"+file);
        }
    });

    fs.writeFileSync(properties, content, { encoding: "utf-8"});
}

writer.changeFileContent = (content, path)=>{
    languageEncoding(path).then((fileInfo)=>{
        if(fileInfo.encoding !== undefined){
            fs.writeFileSync(path, content, { encoding: fileInfo.encoding.toLowerCase()});
        }
    })
}


writer.changeStatus = (data)=>{
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

    fs.writeFile(filePath, JSON.stringify(fileContent), (err)=>{
        if(err) throw err;
    });

}

writer.renameFile = (data)=>{

    fs.rename(data["oldPath"], data['newPath'], (err)=>{
        if(err) throw err;
    });

}

module.exports = writer;