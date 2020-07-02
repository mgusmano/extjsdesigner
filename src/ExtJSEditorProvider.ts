import * as vscode from "vscode";
import { Logger } from "./logger";
import { MessagesFromWebviewAndVSCode } from "./MessagesFromWebviewAndVSCode";

export class ExtJSEditorProvider implements vscode.CustomTextEditorProvider {
  public _context: vscode.ExtensionContext;

  public static register( context: vscode.ExtensionContext ): vscode.Disposable {
    const provider = new ExtJSEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider( 'extjsdesigner.editor', provider );
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    Logger.log(`${Logger.productName}: ExtJSEditorProvider constructor`);
  }

  public async resolveCustomTextEditor( document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken ): Promise<void> {
    webviewPanel.webview.options = { enableScripts: true, enableCommandUris: true, };
    webviewPanel.webview.html = this.getHtmlForWebview( webviewPanel.webview, document );
    //setTimeout(function () {vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");}, 1000);
    new MessagesFromWebviewAndVSCode(document, webviewPanel, this._context);
  }

  private getHtmlForWebview( webview: vscode.Webview, document: vscode.TextDocument ): string {
    var documenttext = document.getText();
    return `
    <!DOCTYPE html>
    <html style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;">
    <head>
    </head>
    <body>
      <pre>
      ${documenttext}
      </pre>
    </body
    </html>
    `
  }

}

