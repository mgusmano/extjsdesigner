import * as vscode from "vscode";
import { Logger } from './Logger';

export class InstructionsEditorProvider implements vscode.CustomTextEditorProvider {
  //private static readonly viewType = "extjsdesign.instructions";
  public _context: vscode.ExtensionContext;

  public static register(context: vscode.ExtensionContext): vscode.Disposable {
    const provider = new InstructionsEditorProvider(context);
    const providerRegistration = vscode.window.registerCustomEditorProvider('extjsdesigner.instructions',provider);
    return providerRegistration;
  }

  constructor(private readonly context: vscode.ExtensionContext) {
    this._context = context;
    Logger.log(`${Logger.productName}: InstructionsEditorProvider constructor`);
  }

  public async resolveCustomTextEditor(document: vscode.TextDocument, webviewPanel: vscode.WebviewPanel, _token: vscode.CancellationToken): Promise<void> {
    webviewPanel.webview.options = {enableScripts: true,enableCommandUris: false};
    webviewPanel.webview.html =  this.getHtmlForWebview(webviewPanel.webview,document);
  }

  private getHtmlForWebview(webview: vscode.Webview, document: vscode.TextDocument): string {
    return `
  <!DOCTYPE html>
  <html style="width:100%;height:100%;margin:0;padding:0;">
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
  ul {margin: 10px 0 10px 0;}
  li {margin-top: 5px;color: rgb(215,186, 125)}
  rgb(215,186, 125)
  </style>
  </head>
  <body style="width:100%;height:100%;margin:0;padding:0;overflow:scroll;background:rgb(6,54,74);color:white;display:flex;flex-direction:column;">
    <div style="padding:10px;font-size:18px;">
      <div style="flex:none;display:flex;justify-content:center;align-items:center;">Sencha Ext JS Designer - a custom Visual Editor for any Ext JS View</div>

<div style="margin-top:20px;font-size:18px;">
In this Hackathon entry, 3 use-case scenarios are enabled:
</div>

<ul style="font-size:18px;">
<li>Use Case 1 - Views created from the '__EXTJS_DESIGNER_PROJECT' in home folder
<li>Use Case 2 - Sencha cmd generated app view (specifically app/view/main/list.js) (see below)
<li>Use Case 3 - Open Tooling app View Packages (see below)
</ul>

<div style="font-size:36px;color:rgb(255,202,40);margin-top:20px;"><< -- (Use Case 1) To get started, click on an SimpleView.js in the Explorer panel on the left</div>

<div style="margin-top:20px;font-size:18px;">
Use Case 2 (Sencha cmd) steps:
</div>

<ul style="font-size:18px;">
<li>open command/terminal window
<li>type: sencha generate app --ext -modern ModernCmd ./ModernCmd
<li>type: cd ModernCmd
<li>type: code .
<li>open file at: app/view/main/list.js
<li>ext-gen app -a -t moderndesktop -n ModernApp
</ul>

<div style="margin-top:20px;font-size:18px;">
Use Case 3 (Open Tools) steps:
</div>

<ul style="font-size:18px;">
<li>open command/terminal window
<li>type: ext-gen app -a -t moderndesktop -n ModernApp
<li>type: cd ModernApp
<li>type: code .
<li>open file at: app/view/main/list.js
</ul>

<div style="margin-top:20px;font-size:18px;">
Key Features implemented in the Ext JS Designer VSCode Extension:
</div>

<ul style="font-size:18px;">
<li>Built as VSCode Custom editor Extension
<li>Integrates with current Sencha VSCode Plugin Extension
<li>Use of AST (NO metadata!!) - see https://astexplorer.net/
<li>Modular design (folder structure, Web Components)
<li>Sencha ExtWebComponents and Custom Web Components for UI elements
<li>Uses Ext JS Documentation output (DOXI) for properties, methods, events and integrated documentation
</ul>

<div style="margin-top:20px;font-size:18px;">
In the Design Editor:
</div>

<ul style="font-size:18px;">
<li>Re-arrange design and code panes
<li>Hover over design pane to identify components
<li>Select a component in design pane to show context areas
<li>Context editing of selected components in design pane
<li>Visual Drag and Drop of Ext JS Components onto design pane
<li>Property editing in Property Editor
<li>Component Tree for currently selected item in design pane
<li>Documentation (DOXI) for each component in ext-tabpanel
</ul>



</div>
      </body>
  </html>
  `
  }

}
