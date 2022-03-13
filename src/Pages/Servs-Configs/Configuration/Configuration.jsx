import { render } from '@testing-library/react';
import React, { useState, useEffect } from 'react';
import './Configuration.scss';
import { Textarea } from '@mantine/core';
import '../../../public/properties.txt';
import AceEditor from '../../../components/AceEditor/AceEditor';

export default function Configuration(){

    const [fileValue, setFileValue] = useState(

        `#Minecraft server properties
generator-settings=
op-permission-level=4
resource-pack-hash=
allow-nether=true
level-name=world
enable-query=false
allow-flight=false
announce-player-achievements=true
server-port=25565
max-world-size=29999984
level-type=DEFAULT
enable-rcon=false
force-gamemode=false
level-seed=
server-ip=
network-compression-threshold=256
max-build-height=256
debug=false
spawn-npcs=true
white-list=false
spawn-animals=true
snooper-enabled=true
hardcore=false
online-mode=true
resource-pack=
pvp=true
difficulty=1
enable-command-block=true
player-idle-timeout=0
gamemode=0
max-players=20
max-tick-time=60000
spawn-monsters=true
view-distance=10
generate-structures=true
motd=Server built with Kubes!`

    );

    return(

        <div className='configurations-main-container'>
            
            {/* <Textarea spellCheck="false" variant="unstyled" placeholder="Your email" radius="xs" value={fileValue} onChange={(e) => setFile(e.currentTarget.value)}/> */}
            <AceEditor editedFile="server.properties" value={fileValue} onChange={(val) => setFileValue(val)}/>
        </div>

    );

    
}

