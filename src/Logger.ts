import * as vscode from 'vscode';

export class Logger {
  static productName: string = 'Ext JS Designer';
  static channel: vscode.OutputChannel;
  static log(message: any) {
    console.log(`${message}`)
    if (this.channel) {
      this.channel.appendLine(`${message}`);
    }
  }
}