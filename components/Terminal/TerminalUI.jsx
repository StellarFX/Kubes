import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

export class TerminalUI {

    constructor(socket) {
        this.terminal = new Terminal();
        this.terminal.setOption("theme", {
            background: "#110d1a",
            foreground: "#f4ebff"
        });

        this.__fitAddon = new FitAddon();

        this.terminal.loadAddon(this.__fitAddon);

        this.socket = socket;
    }

    startListening() {
        this.terminal.onData((data) => this.sendInput(data));
        this.socket.on('output', (data) => this.write(data));
    }

    write(text) { this.terminal.write(text); }

    prompt() { this.terminal.write(`\\r\\n$ `); }

    sendInput(input) { this.socket.emit('input', input); }

    attachTo(container) {
        this.terminal.open(container);
        this.__fitAddon.fit();
        this.terminal.write("Terminal Connected!");
        this.terminal.write("");
        this.prompt();
    }

    clear() { this.terminal.clear(); }

}