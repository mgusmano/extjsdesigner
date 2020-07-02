import * as vscode from "vscode";
//import { Globals } from "./Globals";
import { Logger } from "./logger";
import Eparser from "./Eparser";

export class MessagesFromWebviewAndVSCode {
    public _context: vscode.ExtensionContext;
    public _eparser!: Eparser;

    private updateTextDocument(document: vscode.TextDocument, code: any) {
        const edit = new vscode.WorkspaceEdit();
        edit.replace(
            document.uri,
            new vscode.Range(0, 0, document.lineCount, 0),
            code
        );
        return vscode.workspace.applyEdit(edit);
    }

    constructor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        private readonly context: vscode.ExtensionContext
    ) {
        this._context = context;
        //public _eparser!: Eparser;
        this._eparser = new Eparser(document.getText());
        Logger.log(`${Logger.productName}: MessagesFromWebviewAndVSCode constructor`);

        const changeActiveColorSubscription = vscode.window.onDidChangeActiveColorTheme(
            (e) => {
                console.log("changeActiveColorSubscription");
                webviewPanel.webview.postMessage({
                    type: "extjsdesignerthemechange",
                    text: document.getText(),
                });
            }
        );
        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
            (e) => {
                console.log("onDidChangeTextDocument");
                console.log(e);
                console.log(e.contentChanges);

                if (e.document.uri.toString() === document.uri.toString()) {
                    console.log("post update message to webview");
                    console.log("*** this text");
                    console.log(document.getText());
                    console.log("*** this text");
                    webviewPanel.webview.postMessage({
                        type: "extjsdesignerupdate",
                        text: document.getText(),
                    });
                }
                // if (e.contentChanges.length > 0) {
                //   console.log('post update message - didChange')
                //   console.log(e.contentChanges[0].text)
                //   webviewPanel.webview.postMessage({
                //     type: "update",
                //     text: e.contentChanges[0].text
                //   });
                // }
            }
        );

        webviewPanel.webview.onDidReceiveMessage((message) => {
            console.log(message);
            switch (message.command) {

              case "additems":
                var rc = this._eparser.addItems(message.data.items,message.data.index);
                if (rc == 0) {
                  var _code = this._eparser.generate();
                  this.updateTextDocument(document, _code);
                } else {
                  vscode.window.showErrorMessage( "rc: " + rc );
                }
                break;
              case "addbuttons":
                var rc = this._eparser.addButtons(message.data.items,message.data.index);
                if (rc == 0) {
                  var _code = this._eparser.generate();
                  this.updateTextDocument(document, _code);
                } else {
                  vscode.window.showErrorMessage( "rc: " + rc );
                }
                break;

              case "notimplemented":
                vscode.window.showErrorMessage(message.data.text);
                break;

              case "addcolumn":
                //console.log(message.command);
                //var xtypedroppedon = message.data.xtypedroppedon;
                var rc = this._eparser.addColumn(
                        message.data.field,
                        message.data.field
                    );

                if (rc == 0) {
                    var _code = this._eparser.generate();
                    this.updateTextDocument(document, _code);
                } else {
                    vscode.window.showErrorMessage( "rc: " + rc );
                }
                break;






                // case "itemAdd":
                //     console.log(message.command);
                //     var addItemReturn;

                //     var xtypedroppedon = message.data.xtypedroppedon;
                //     if (message.data.xtype == "column") {
                //         addItemReturn = this._eparser.addColumn(
                //             message.data.field,
                //             message.data.field
                //         );
                //     } else {
                //         addItemReturn = this._eparser.addItem(
                //             message.data.xtype,
                //             message.data.field,
                //             message.data.text,
                //             message.data.index
                //         );
                //     }
                //     if (addItemReturn == 0) {
                //         var _code = this._eparser.generate();
                //         this.updateTextDocument(document, _code);
                //     } else {
                //         vscode.window.showErrorMessage( "addItemReturn: " + addItemReturn );
                //     }
                //     break;



                case "showHelp":
                    vscode.window.showInformationMessage(
                        "Help window would be shown..."
                    );
                    break;

                case "editorSave":
                    console.log(message.command);
                    console.log(message.data.code);
                    this.updateTextDocument(document, message.data.code);
                    //console.log(document.getText())
                    this._eparser = new Eparser(message.data.code);
                    vscode.window.showInformationMessage("Code Pane Saved...");
                    break;

                case "showStatusBar":
                    this._context.subscriptions.push(
                        vscode.commands.registerCommand(
                            "mjgExtension.MyExpress",
                            () => {
                                vscode.window.showInformationMessage(
                                    "MyExpress Hello World!"
                                );
                            }
                        )
                    );

                    //   this._dispose.push(commands.registerCommand('extension.MyExpress', () => {
                    //     myexpress.open('a/index.html', 'mjg', vscode.ViewColumn.One);
                    // }));
                    // this.loadStatusBarButton2('MyExpress');

                    interface StatusBarItem {
                        tooltip: string;
                        vsCommand: string;
                        singleInstance?: boolean;
                        name: string;
                        color?: string;
                    }

                    var sbi: StatusBarItem = {
                        name: "MyExpress",
                        tooltip: "MyExpress",
                        vsCommand: "mjgExtension." + "MyExpress",
                    };
                    //const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
                    const statusBarItem = vscode.window.createStatusBarItem(
                        1,
                        0
                    );
                    statusBarItem.text = sbi.name;
                    statusBarItem.color = sbi.color || "red";
                    statusBarItem.tooltip = sbi.tooltip;
                    statusBarItem.command = sbi.vsCommand;
                    statusBarItem.show();
                    this._context.subscriptions.push(statusBarItem);

                    break;

                case "showDebugger":
                    vscode.commands.executeCommand(
                        "workbench.action.webview.openDeveloperTools"
                    );
                    break;

                case "columnAdd":
                    console.log(message.command);
                    var addColumnReturn = this._eparser.addColumn(
                        message.data.text,
                        message.data.dataIndex
                    );
                    if (addColumnReturn == 0) {
                        var _code = this._eparser.generate();
                        this.updateTextDocument(document, _code);
                    } else {
                        vscode.window.showErrorMessage(
                            "setPropertyReturn: " + addColumnReturn
                        );
                    }
                    break;

                case "propertyAdd":
                    console.log(message.command);
                    var addPropertyReturn = this._eparser.addProperty(
                        message.data.configName,
                        message.data.configValue
                    );
                    if (addPropertyReturn == 0) {
                        var _code = this._eparser.generate();
                        console.log(_code);
                        this.updateTextDocument(document, _code);
                    } else {
                        vscode.window.showErrorMessage(
                            "addPropertyReturn: " + addPropertyReturn
                        );
                    }
                    break;
                case "propertyUpdate":
                    console.log(message.command);
                    var updatePropertyReturn = this._eparser.updateProperty(
                        message.data.configName,
                        message.data.configValue
                    );
                    if (updatePropertyReturn == 0) {
                        var _code = this._eparser.generate();
                        //console.log(_code)
                        this.updateTextDocument(document, _code);
                        //me._currentTextDocument = doc
                        // this._currentTextDocument.edit(editBuilder => {
                        //     //var p = new vscode.Position(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                        //     var start = new vscode.Position(0, 0)
                        //     var end = new vscode.Position(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
                        //     //var newPosition = vscode.Position..with(position.line, 5);
                        //     //editBuilder.insert(p,`//${message.data.value}`)
                        //     var r = new vscode.Range(start, end)
                        //     editBuilder.replace(r, this._code)
                        // });
                    } else {
                        vscode.window.showErrorMessage(
                            "updatePropertyReturn: " + updatePropertyReturn
                        );
                    }
                    break;

                case "propertyDelete":
                    console.log(message.command);
                    var deletePropertyReturn = this._eparser.deleteProperty(
                        message.data.configName
                    );
                    if (deletePropertyReturn == 0) {
                        var _code = this._eparser.generate();
                        console.log(_code);
                        this.updateTextDocument(document, _code);
                    } else {
                        vscode.window.showErrorMessage(
                            "deletePropertyReturn: " + deletePropertyReturn
                        );
                    }
                    break;

                case "showTerminal":
                    vscode.commands
                        .executeCommand(
                            "workbench.action.terminal.toggleTerminal"
                        )
                        .then(function () {});
                    break;
            }
        });

        webviewPanel.onDidDispose(() => {
            console.log("webviewPanel.onDidDispose");
            changeDocumentSubscription.dispose();
        });
    }
}
