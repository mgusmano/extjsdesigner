import * as vscode from "vscode";
import { Logger } from "./logger";
import { MessagesFromWebviewAndVSCode } from "./MessagesFromWebviewAndVSCode";
import { Utilities } from "./Utilities";
import focus from "./html/focus";
import * as esprima from "esprima";
import * as path from "path";

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

  getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text.toLowerCase();
  }

  private getUri(webview, extensionPath, file) {
    return webview.asWebviewUri(vscode.Uri.file(path.join(extensionPath, "assets", file)));
  }

  private getHtmlForWebview( webview: vscode.Webview, document: vscode.TextDocument ): string {
    var cmdStuff = "";
    var npmStuff = "";
    const nonce = this.getNonce();
    const extensionPath = this._context.extensionPath;
    var fileName = document.fileName;
    var documenttext = document.getText();
    var ast = esprima.parse(document.getText());
    var props = ast.body[0].expression.arguments[1].properties;
    var xtypeProp = props.find((o) => o.key.name === "xtype");
    var xtype = xtypeProp.value.value;

    var extendProp = props.find((o) => o.key.name === "extend");
    var extend = extendProp.value.value;

    var last = 0;
    var separator = "";
    if (fileName.lastIndexOf("/") != -1) {
        last = fileName.lastIndexOf("/");
        separator = "/";
    }
    if (fileName.lastIndexOf("\\") != -1) {
        last = fileName.lastIndexOf("\\");
        separator = "\\";
    }
    var begin = fileName.indexOf(
        "app" + separator + "view" + separator + "main"
    );
    if (begin != -1) {
        cmdStuff = Utilities.cmdGenerated( nonce, webview, last, fileName, separator );
    } else {
        npmStuff = Utilities.npmGenerated( nonce, webview, last, fileName );
    }
    var monacoStuff = Utilities.monacoGenerated( nonce, webview, extensionPath );
    var scriptsForHead = Utilities.getScripts( nonce, webview, extensionPath, xtype, documenttext, extend );
    var headercolor = "rgb(0,0,0)";

    return `
<!DOCTYPE html>
<html style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;">
<head>
  <meta http-equiv="Content-Security-Policy" content="script-src 'unsafe-eval' 'unsafe-inline' ${
      webview.cspSource
  } 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=10, user-scalable=yes">
  ${scriptsForHead}
  ${cmdStuff}
  ${npmStuff}
</head>
<body style="width:100%;height:100%;margin:0;padding:0;overflow:hidden;font-family:system-ui;display:flex;flex-direction:column;" class="vbox viewport overall">

<!--wait-->
<div id="wait" style="margin:0;padding:0;overflow:hidden;flex:1;display:flex;justify-content:center;align-items:center;color:white;background:rgb(6,54,74);border:10px solid rgb(51,51,51);">
  <img nonce="${nonce}" src="${this.getUri(webview,extensionPath,"images/logo.svg")}"
    style="margin-top:-0px;height:100%;width:100%;overflow:hidden;"
    alt="An error occured (a known VSCode issue)... closing and re-opening will solve the issue"
    class="lazyloaded"
    data-ll-status="loaded">
</div>
<!--wait-->

<!--main-->
<div id="main" style="flex:1;display:none;flex-direction:row;color:white;border-top:1px solid rgb(51,51,51);border:1px solid gray;">
  <!--left-->
  <div id="leftpane" style="display:flex;width:300px;flex-direction:column;">

    <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <div style="flex:1;"></div>
      <div style="flex:1;">Property Editor</div>
      <div style="flex:1;" id="classname"></div>
      <div style="flex:1;"></div>
    </div>

    <div id="leftpaneprops" style="height:400px;display:flex;border:0px solid gold;overflow:auto;">
      <z-props id="initialconfigs"></z-props>
    </div>

    <div class="resizer" line="true" data-direction="vertical"></div>

    <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;justify-content:center;align-items:center;">
      <div style="display:flex;">Component Tree</div>
    </div>

    <div style="flex: 1;display:flex;border:0px solid gold;">
      <ext-treelist fitToParent id="treelist" onReady="treeReady"></ext-treelist>
    </div>

  </div>
  <!--left-->

  <div class="resizer" data-direction="horizontal"></div>

  <!--center-->
  <div style="display:flex;flex-direction:column;flex: 1 1 0%;">
    <!--toolbar-->
    <div style="flex:none;height:50px;background:${headercolor};display:flex;align-items:center;border-bottom:1px solid rgb(41,41,41);">
      <div style="flex:none;width:10px;"></div>
      <div id="toolbarpanelleft" style="cursor:pointer;">
        <i title="toggle left pane" class="fa fa-bars"></i>
      </div>
      <div style="flex:none;width:10px;"></div>
      <div style="flex:1;display:flex;">
        <div style="flex:1;display:flex;xjustify-content:flex-end;justify-content:center;align-items:center;">
          <z-button id="toolbarsidebysidebutton" style="flex:none;"  text="Left/Right" modal="true"></z-button>
          <z-button id="toolbartoptobottombutton" style="flex:none;" text="Top/Bottom"></z-button>
          <z-button id="toolbarjustdesignbutton" style="flex:none;"  text="Just Design"></z-button>
          <z-button id="toolbarjustcodebutton" style="flex:none;"    text="Just Code"></z-button>
        </div>
      </div>
      <div style="flex:none;width:20px;"></div>
      <div style="display:flex;justify-content:flex-end;">
        <div style="cursor:pointer;" id="toolbarhelp"<i class="fa fa-question-circle"></i></div>
        <div style="flex:none;width:10px;"></div>
        <div id="toolbarpanelright" style="cursor:pointer;" oxnclick="doToolbarPane('rightpane')">
          <i title="toggle right pane" class="fa fa-bars"></i>
        </div>
      </div>
      <div style="flex:none;width:10px;"></div>
    </div>
    <!--toolbar-->
    <!--editors-->
    <div id="mainparent" style="flex:1;display:flex;flex-direction:row;">
      <div id="maindesign" style="width:50%;display:flex;flex-direction:column;xjustify-content:center;xalign-items:center;">
        <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;justify-content:center;align-items:center;">
          <z-button id="toolbarclear" style="flex:none;margin-right:5px;" text="Clear"></z-button>
          <div style="display:flex;">Design Pane</div>
        </div>
        <div class="shadow laptop" style="flex:1;margin:20px;">
          <div style="height:100%;width:100%;border:1px solid gray;" id="content"></div>
        </div>
      </div>
      <div id="mainresizer" class="resizer" data-direction="horizontal"></div>
      <div id="maincode" style="flex: 1 1 0%;display:flex;flex-direction:column;xjustify-content:center;xalign-items:center;border:0px solid blue;">
        <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;justify-content:center;align-items:center;">
          <z-button id="toolbareditorsave" style="flex:none;margin-right:5px;" text="Save"></z-button>
          <div style="display:flex;">Code Pane</div>
        </div>
        <div class="shadow" id="editor" style="flex:1;margin:10px;"></div>
      </div>
    </div>
    <!--editors-->
    <div class="resizer" data-direction="vertical"></div>
    <div class="tabpanel" style="flex:none;height:200px;background:darkgray;display:flex;border-bottom:1px solid rgb(41,41,41);">
      <ext-tabpanel
        flex="1"
        shadow="true"
        height="200px"
        width="100%"
        defaults='{"cls": "card","layout": "center"}'>
        <ext-panel title="Description"  scrollable="y" bodyPadding="0 10px 0 10px">
          <ext-container id="tabdescription" onReady="tabdescriptionReady" html="<br/>description will be shown for an item selected in the design pane"></ext-container>
        </ext-panel>
        <ext-panel title="Properties" scrollable="y" bodyPadding="10px 10px 0 10px">
          <ext-container id="tabproperties" onReady="tabpropertiesReady" html="placeholder for properties"></ext-container>
        </ext-panel>
        <ext-panel title="Methods" scrollable="y" bodyPadding="10px 10px 0 10px">
          <ext-container id="tabmethods" onReady="tabmethodsReady" html="placeholder for methods"></ext-container>
        </ext-panel>
        <ext-panel title="Events" scrollable="y" bodyPadding="10px 10px 0 10px">
          <ext-container id="tabevents" onReady="tabeventsReady" html="placeholder for events"></ext-container>
        </ext-panel>
      </ext-tabpanel>
    </div>
  </div>
  <!--center-->

  <div class="resizer" data-direction="horizontal"></div>

  <!--right-->
  <div id="rightpane" style="display:flex;width:250px;flex-direction:column;">

    <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <div style="flex:1;"></div>
      <div style="flex:1;">Hackathon</div>
      <div style="flex:1;"">Quick Start</div>
      <div style="flex:1;"></div>
    </div>

    <div style="height:400px;display:flex;flex-direction:column;padding:10px 10px 10px 10px;overflow:auto;">
        <div style="color:gold;">Property Editor</div>
        Type 'title' in Filter text box<br/>
        Edit title property and press enter</br/>
        Design view and code view now reflect the change<br/>
        <br/>
        <div style="color:gold;">Hover over design pane</div>
        red selector follows mouse<br/>
        <br/>
        <div style="color:gold;">Click on items in design pane</div>
          selected item is highlighted with green<br/>
          context window is above selected item<br/>
          properties window refreshed<br/>
          description is below design pane<br/>
        <br/>
        <div style="color:gold;">click gear icon to right of selected item</div>
        additional context window appears<br/>
        <br/>
        <div style="color:gold;">click 'Clear Design Pane' in toolbar</div>
        all context clears from design pane<br/>
        <br/>
        <div style="color:gold;">drag/drop from right into design pane</div>
        control is added; code pane updated<br/>
        <br/>
    </div>

    <div class="resizer" line="true" data-direction="vertical"></div>

    <div style="flex:none;height:50px;background:${headercolor};border-bottom:1px solid rgb(41,41,41);color:gold;display:flex;flex-direction:column;justify-content:center;align-items:center;">
      <div style="flex:1;"></div>
      <div style="flex:1;">Components</div>
      <div style="flex:1;"">Drag to Design Pane</div>
      <div style="flex:1;"></div>
    </div>

    <div style="height:300px;display:flex;overflow:scroll;">
      <ext-dataview
        id="dataview"
        cls="dataviewvbox"
        onReady="dataviewReady"
        itemTpl='
        <div class="dragcomp" type="{type}" xtype="{xtype}" draggable="true">
          <div style="width:30px;" class="fa fa-{icon}"></div>
          <div type="{type}" style="flex:1">{xtype} ({type})</div>
        </div>'>
      </ext-dataview>
    </div>

  </div>
  <!--right-->

</div>
<!--main-->
<!--footer-->
<!--
<div style="flex:none;height:25px;display:flex;justify-content:center;align-items:center;color:white;background:${headercolor};border-top:1px solid rgb(41,41,41);">
  Submitted By: Marc Gusmano - mgusmano@yahoo.com
</div>
-->
<!--footer-->
${focus()}
${monacoStuff}
</body>
</html>
`;
    }


  private getHtmlForWebview2( webview: vscode.Webview, document: vscode.TextDocument ): string {
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

