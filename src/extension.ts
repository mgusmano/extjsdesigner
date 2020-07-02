import * as vscode from 'vscode';
import { Logger } from './Logger';
import { CreateTestFolder } from './CreateTestFolder';
import { ExtJSEditorProvider } from './ExtJSEditorProvider';
import { WelcomeDialog } from './WelcomeDialog'

export function activate(context: vscode.ExtensionContext) {
  Logger.channel = vscode.window.createOutputChannel("Ext JS Designer");
  context.subscriptions.push(Logger.channel);
  Logger.log('Ext JS Designer extension is now active!');

  context.subscriptions.push(CreateTestFolder.register());
  context.subscriptions.push(ExtJSEditorProvider.register(context));

  WelcomeDialog.execute()


	// context.subscriptions.push(vscode.commands.registerCommand('extjsdesigner.helloWorld', () => {
	// 	vscode.window.showInformationMessage('Hello World from extjsdesigner!');
	// }))

}
export function deactivate() {}
