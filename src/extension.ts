import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "extjsdesigner" is now active!');
	let disposable = vscode.commands.registerCommand('extjsdesigner.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from extjsdesigner!');
	});

	context.subscriptions.push(disposable);
}
export function deactivate() {}
