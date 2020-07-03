import * as vscode from "vscode";
import simple from "./starter/Simple";
import grid from "./starter/Grid";
import help from "./starter/Help";

export class CreateTestFolder {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand('extjsdesigner.createtestfolder', () => {
      var homePath = require('os').homedir()
      var folderName = "__ExtJS_Designer_Project"
      var newFolder = require('path').join(homePath, folderName)
      require('rimraf').sync(newFolder);
      require('fs').mkdirSync(newFolder);
      require('fs').writeFileSync(require('path').join(newFolder, 'SimpleView.js'), simple())
      require('fs').writeFileSync(require('path').join(newFolder, 'GridView.js'), grid())
      require('fs').writeFileSync(require('path').join(newFolder, 'ClickOnThisFirst.mjg'), help())
      var folder = vscode.Uri.file(require('path').join(homePath, folderName))
      vscode.commands.executeCommand('vscode.openFolder', folder, false);
    })
  }
}