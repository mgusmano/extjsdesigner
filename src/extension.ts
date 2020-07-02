import * as vscode from 'vscode';
import { Logger } from './Logger';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "extjsdesigner" is now active!');
  Logger.channel = vscode.window.createOutputChannel("Ext JS Designer");
  context.subscriptions.push(Logger.channel);
  Logger.log('Ext JS Designer extension is now active!');


	context.subscriptions.push(vscode.commands.registerCommand('extjsdesigner.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from extjsdesigner!');
	}))


}
export function deactivate() {}
