import * as vscode from 'vscode';

export class Logger {
    static channel: vscode.OutputChannel;
    static log(message: any) {
        if (this.channel) {
            this.channel.appendLine(`${message}`);
        }
    }
}