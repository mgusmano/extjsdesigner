import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

export class Utilities {

  private static getUri(webview: vscode.Webview, extensionPath: string, file: string) {
    return webview.asWebviewUri(
        vscode.Uri.file(path.join(extensionPath, "assets", file))
    );
  }

  private static getUriNode(webview: vscode.Webview, extensionPath: string, file: string) {
      return webview.asWebviewUri(
          vscode.Uri.file(path.join(extensionPath, "node_modules", file))
      );
  }

  public static monacoGenerated(nonce: string, webview: vscode.Webview, extensionPath: string): string {
    var e = `
    <script nonce="${nonce}" >var require = { paths: { 'vs': '${Utilities.getUriNode( webview, extensionPath, "monaco-editor/min/vs" )}' } };</script>
    <script nonce="${nonce}" src="${Utilities.getUriNode( webview, extensionPath, "monaco-editor/min/vs/loader.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUriNode( webview, extensionPath, "monaco-editor/min/vs/editor/editor.main.nls.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUriNode( webview, extensionPath, "monaco-editor/min/vs/editor/editor.main.js" )}"></script>
    `
    return e;
  }

  public static npmGenerated(nonce: string, webview: vscode.Webview, last: any, fileName: string): string {
    var storeModelTemplate = ``;
    var storeTemplate = ``;
    var viewModelTemplate = ``;
    var viewControllerTemplate = ``;
    //console.log("Open Tools or something else");
    var Xtype = fileName.substring(last + 1, fileName.length - 3);
    var XtypeFront = Xtype.substring(0, Xtype.length - 4);
    var prefix = fileName.substring(0, last + 1) + XtypeFront;

    var storeModel = prefix + "StoreModel.js";
    try {
      if (fs.existsSync(storeModel)) {
        const storeModelUri = webview.asWebviewUri( vscode.Uri.file(storeModel) );
        storeModelTemplate = `<script nonce="${nonce}" src="${storeModelUri}"></script>`;
      }
    } catch (err) {}

    var store = prefix + "ViewStore.js";
    try {
      if (fs.existsSync(store)) {
        const storeUri = webview.asWebviewUri( vscode.Uri.file(store) );
        storeTemplate = `<script nonce="${nonce}" src="${storeUri}"></script>`;
      }
    } catch (err) {}

    var viewController = prefix + "ViewController.js";
    try {
      if (fs.existsSync(viewController)) {
        const viewControllerUri = webview.asWebviewUri( vscode.Uri.file(viewController) );
        viewControllerTemplate = `<script nonce="${nonce}" src="${viewControllerUri}"></script>`;
      }
    } catch (err) {}

    var viewModel = prefix + "ViewModel.js";
    try {
      if (fs.existsSync(viewModel)) {
        const viewModelUri = webview.asWebviewUri( vscode.Uri.file(viewModel) );
        viewModelTemplate = `<script nonce="${nonce}" src="${viewModelUri}"></script>`;
      }
    } catch (err) {}

    return `
    ${storeModelTemplate}
    ${storeTemplate}
    ${viewModelTemplate}
    ${viewControllerTemplate}
    `
  }

  public static cmdGenerated(nonce: string, webview: vscode.Webview, last: any, fileName: string, separator: string): string {
    var cmdModelBaseTemplate = ``;
    var cmdModelPersonnelTemplate = ``;
    var cmdStorePersonnelTemplate = ``;
    //console.log("Sencha Cmd Generated");

    var prefix = fileName.substring(0, last + 1) + ".." + separator + ".." + separator;
    var cmdModelBase = prefix + "model" + separator + "Base.js";
    try {
      if (fs.existsSync(cmdModelBase)) {
        const u = webview.asWebviewUri( vscode.Uri.file(cmdModelBase) );
        cmdModelBaseTemplate = `<script nonce="${nonce}" src="${u}"></script>`;
      } else {
        console.log("model does NOT exist");
      }
    } catch (err) {}

    var cmdModelPersonnel = prefix + "model" + separator + "Personnel.js";
    try {
      if (fs.existsSync(cmdModelPersonnel)) {
        const u = webview.asWebviewUri( vscode.Uri.file(cmdModelPersonnel) );
        cmdModelPersonnelTemplate = `<script nonce="${nonce}" src="${u}"></script>`;
      }
    } catch (err) {}

    var cmdStorePersonnel = prefix + "store" + separator + "Personnel.js";
    try {
      if (fs.existsSync(cmdStorePersonnel)) {
        const u = webview.asWebviewUri( vscode.Uri.file(cmdStorePersonnel) );
        cmdStorePersonnelTemplate = `<script nonce="${nonce}" src="${u}"></script>`;
      }
    } catch (err) {}
    return `
    ${cmdModelBaseTemplate}
    ${cmdModelPersonnelTemplate}
    ${cmdStorePersonnelTemplate}
    `
  }

  public static getScripts(nonce: string, webview: vscode.Webview, extensionPath: string, xtype: string, documenttext: string, extend: string): string {
    var e = `
    <script nonce="${nonce}" src="${Utilities.getUri(webview,extensionPath,"scripts/eventListenerMessage.js")}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri(webview,extensionPath,"scripts/eventListenerLoad.js")}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/eventListeners.js" )}"></script>
    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      window.extjsdesigner = {}
      window.extjsdesigner.isFirst = true;
      window.extjsdesigner.extend = '${extend}';
      var text = '';
      window.addEventListener('load', (event) => { eventListenerLoad(event, '${nonce}','${xtype}',\`${documenttext}\`) } )
      window.addEventListener('message', event => {eventListenerMessage(event, '${nonce}','${xtype}')})
    </script>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "build/ext/ext.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/styles.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/resizer.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/tabpanel.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/treelist.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/dataview.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/focus.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUri( webview, extensionPath, "css/flex-splitter.css" )}" rel="stylesheet" type="text/css"></link>
    <link   nonce="${nonce}" href="${Utilities.getUriNode( webview, extensionPath, "monaco-editor/min/vs/editor/editor.main.css" )}" rel="stylesheet" type="text/css"></link>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/mouse.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/data.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/resizer.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/toolbar.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/dataview.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/treelist.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/tabpanel.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/focus.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/flex-splitter.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "scripts/allDocs.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "libused/ext-grid.component.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "libused/ext-panel.component.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "libused/ext-formpanel.component.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-button.component.js" )}"    type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-grid.component.js" )}"      type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-dataview.component.js" )}"  type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-treelist.component.js" )}"  type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-container.component.js" )}" type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-tabpanel.component.js" )}"  type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "EWC/ext-panel.component.js" )}"     type="module"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-button.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-panel.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-p.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-splitter.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-tabs.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "webcomponents/z-props.js" )}"></script>
    <script nonce="${nonce}" src="${Utilities.getUri( webview, extensionPath, "build/modern.engine.enterprise.js" )}"></script>
    `
    return e
  }
}