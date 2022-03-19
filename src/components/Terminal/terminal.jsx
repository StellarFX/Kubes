// TODO : use Xterm.js
// See https://github.com/vterm/vterm/blob/master/src/components/terminal.jsx

// Useref to open terminal
// const terminal = new TERMINAL
// terminal.open(<terminalRef>, true);

import React, { useRef, useEffect } from 'react';
import { Terminal as TERMINAL } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Chalk } from 'chalk';
import 'xterm/css/xterm.css';

const theme = {
    background: '#0c0913'
}

const chalk = new Chalk({ level: 2 });

export default function Terminal() {

    const terminalRef = useRef(null)    

    useEffect(() => {
        
        let terminal = new TERMINAL({ theme: theme});

        const fitAddon = new FitAddon();
        terminal.loadAddon(fitAddon);

        terminal.open(terminalRef.current, true);

        fitAddon.fit();

        window.addEventListener('resize', () => {
            fitAddon.fit();
        });

        function prompt() {
            terminal.write(chalk.hex("#7447ff")(`\r\n$ `));
        }
        
        terminal.write(chalk.bold(chalk.hex("#bf97ff")("┌─ Info ────────────────┐")));
        terminal.write(chalk.bold(chalk.hex("#bf97ff")("\r\n│                       │")));
        terminal.write(chalk.bold(chalk.hex("#bf97ff")("\r\n│   Welcome to Kubes!   │")));
        terminal.write(chalk.bold(chalk.hex("#bf97ff")("\r\n│                       │")));
        terminal.write(chalk.bold(chalk.hex("#bf97ff")("\r\n└───────────────────────┘")));
        terminal.write("\r\n")
        terminal.write("");
        prompt();

        let currentLine = '$ ';
        

        terminal.onKey((key, ev) => {
            if(key.key === '\r') {
                prompt();
                currentLine = '$ ';
            } else if(key.key === '\x7F') {
                if(currentLine !== '$ ') {
                    currentLine = currentLine.slice(0, -1);
                    terminal.write('\b \b');
                }
                              
            } else {
                currentLine += key.key;
                terminal.write(key.key);
            }
            
        })

    }, []);

    return (
        <div id="terminal" ref={terminalRef}></div>
    );
}