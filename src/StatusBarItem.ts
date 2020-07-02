import * as vscode from "vscode";

export class StatusBarItem  {
  public static register(context: vscode.ExtensionContext) {
    const sbiExplorer: vscode.StatusBarItem = vscode.window.createStatusBarItem(1, 0)
    sbiExplorer.text = `Show Explorer`
    sbiExplorer.color = 'white'
    sbiExplorer.tooltip = `Show Explorer`
    sbiExplorer.command = 'workbench.view.explorer'
    sbiExplorer.show()
    return sbiExplorer;
  }
}
