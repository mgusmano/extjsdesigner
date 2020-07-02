import * as vscode from "vscode";
var exists = require('fs-exists-sync');


export class WelcomeDialog {
  //private static readonly viewType = "mjgCustoms.mjgView";
  //public _context: vscode.ExtensionContext;


  static showDialog() {
    var items = [
      { title: 'Create', isCloseAffordance: false },
    ]
    var s = `Welcome to the Ext JS Designer Extension

    Hackathon 2020 Edition!

  A Test Project will now be created
  (used to demonstrate extension features)

  Click 'Create'
  to create the Ext JS Designer Test Project

  Click 'Cancel'
  to skip creating the Ext JS Designer Test Project`
    vscode.window.showInformationMessage(s, {modal: true}, ...items).then((value) => {
      if (value == undefined) { return }
      vscode.window.showInformationMessage(value!.title);
      if (value!.title == 'Create') {
        vscode.commands.executeCommand('extjsdesigner.createtestfolder');
      }
    })
  }



  public static execute() {
    var rootPath = vscode.workspace.rootPath!
    if (!rootPath) {
      WelcomeDialog.showDialog()
    }
    else {
      var homePath = require('os').homedir()
      var folderName = "__ExtJS_Designer_Project"
      var fileName = 'ClickOnThisFirst.mjg'
      var defaultPath = require('path').join(homePath, folderName)
      //vscode.window.showInformationMessage(defaultPath.toString().toLowerCase());
      //vscode.window.showInformationMessage(rootPath.toString().toLowerCase());
      if (defaultPath.toString().toLowerCase() == rootPath.toString().toLowerCase()) {
        var readmeFile = require('path').join(homePath, folderName, fileName)
        var haveReadmeFile = exists(readmeFile);
        if (haveReadmeFile) {
          var homePath = require('os').homedir()
          var folderName = '__ExtJS_Designer_Project'
          var fileName = 'ClickOnThisFirst.mjg'
          var readme = vscode.Uri.file(require('path').join(homePath, folderName, fileName))
          //vscode.window.showInformationMessage(readme.toString());
          setTimeout(function () {
            //vscode.window.showInformationMessage(readme.toString());
            vscode.commands.executeCommand('vscode.open', readme);
          }, 1000);
        }
      }
      else {
        if (exists(defaultPath)) {
          console.log('Default path exists');
          WelcomeDialog.showDialog()
        }
        else {
          console.log('Default path does NOT exist');
          WelcomeDialog.showDialog()
        }
      }

    }

  }
}