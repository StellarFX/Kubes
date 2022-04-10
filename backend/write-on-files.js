const Path = require('path');
const fs = require('fs');
const querys = require('querystring');
const fastFolderSizeSync = require('fast-folder-size/sync');
var PropertiesReader = require('properties-reader');
const { randomId } = require('@mantine/hooks');

var writer = {};

writer.changeProperties = (content, path)=>{
    let properties = "";

    fs.readdirSync(path).forEach((file)=>{
        if(file.substring(file.length-11,file.length)==".properties"){
            properties = path.concat("/"+file);
        }
    });

    let original = PropertiesReader(require.resolve("./example.properties"), {writer : { saveSections: true}});

    dictedContent = querys.parse(content.replaceAll("\n","&"));

    for(const [key, value] of Object.entries(dictedContent)){
        if(key != "[]" && key != []){
            original.set("."+key, value);
        }
    }

    original.save(properties, (err)=>{
        if(err) console.log(err);
    });
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

    fs.writeFileSync(filePath, JSON.stringify(fileContent));

}

module.exports = writer;