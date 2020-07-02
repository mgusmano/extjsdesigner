import * as vscode from 'vscode';

interface Entry {
    key: string
}

export class ToolbarView {
  public _commands: object = {};

  constructor() {
      var me = this;

      var toolbarItems = [
        'Show Explorer',
        'Browser Debug Window',
        'Show Ext JS Designer Help'
      ]
      var theCommand = vscode.commands.registerCommand('toolbarView.reveal', async (command) => {
          switch(command) {
            case 'Show Explorer':
              vscode.commands.executeCommand("workbench.view.explorer");
              break;
            case 'Browser Debug Window':
              vscode.commands.executeCommand("workbench.action.webview.openDeveloperTools");
              break;
            case 'Show Ext JS Designer Help':
              var homePath = require('os').homedir()
              var folderName = '__ExtJS_Designer_Project'
              var fileName = 'ClickOnThisFirst.mjg'
              var readme = vscode.Uri.file(require('path').join(homePath, folderName, fileName))
              vscode.commands.executeCommand("vscode.open", readme);
              break;
          }
      });
      //toolbarItems.forEach(function (item) { me._commands[item] = ''; });

      vscode.window.createTreeView('toolbarView',{treeDataProvider: me.commandProvider()});
      //return theCommand;
  }

  commandProvider(): vscode.TreeDataProvider<Entry> {
    return {
      getChildren: (element: Entry): Entry[] => {
        if (element != null) { console.log('child nodes not supported'); return []; }
        var commands = Object.keys(this._commands);
        return commands.map( key => ({ key: key }));
      },

      getTreeItem: (element: Entry): vscode.TreeItem => {
        const treeItem: vscode.TreeItem = {
          id: element.key,
          label: element.key,
          command: { title: 'reveal', command: 'toolbarView.reveal', arguments: [element.key] },
        }
        return treeItem;
      }
    };
  }
}

// class Key {
//     constructor(readonly key: string) { }
// }

// getChildren: (element: Entry): Entry[] => {
//     var children = this.getChildren(element ? element.key : undefined)
//     var c = children.map(key => this.getNode(key));
//     //var c = this.getChildren(element ? element.key : undefined).map(key => this.getNode(key));
//     return c;
// },