import * as vscode from "vscode";

export class StatusBarItem  {
  public static register(context: vscode.ExtensionContext) {
    const sbiExplorer: vscode.StatusBarItem = vscode.window.createStatusBarItem(1, 0)
    sbiExplorer.text = '$(settings-gear~spin) Ext JS Designer Browser Debug Window $(settings-gear~spin)'
    sbiExplorer.color = 'white'
    sbiExplorer.tooltip = `Ext JS Designer Browser Debug Window`
    sbiExplorer.command = 'workbench.action.webview.openDeveloperTools'
    sbiExplorer.show()
    return sbiExplorer;
  }
}
