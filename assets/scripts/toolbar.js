document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('toolbarpanelleft').addEventListener("click", () => doToolbarPane('leftpane'));
  document.getElementById('toolbarpanelright').addEventListener("click", () => doToolbarPane('rightpane'));
  //document.getElementById('toolbardebug').addEventListener("click", () => doToolbarDebug());
  document.getElementById('toolbarclear').addEventListener("click", () => doToolbarClear());
  document.getElementById('toolbareditorsave').addEventListener("click", () => doToolbarEditorSave());
  document.getElementById('toolbarsidebysidebutton').addEventListener("click", () => doToolbarSideBySide());
  document.getElementById('toolbartoptobottombutton').addEventListener("click", () => doToolbarTopToBottom());
  document.getElementById('toolbarjustdesignbutton').addEventListener("click", () => doToolbarJustDesign());
  document.getElementById('toolbarjustcodebutton').addEventListener("click", () => doToolbarJustCode());

  document.getElementById('toolbarhelp').addEventListener("click", () => doToolbarHelp());


})

function doToolbarDebug() {
  console.log('doToolbarDebug')
  vscode.postMessage({
    command: 'showDebugger',
    data: {}
  });
}

function doToolbarPane(pane) {
  console.log('doToolbarRightPane')
  if (document.getElementById(pane).style.display == 'none') {
    document.getElementById(pane).style.display = 'flex'
  }
  else {
    document.getElementById(pane).style.display = 'none'
  }

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: window.extjsdesigner.monacoeditor.getModel().getValue()}
  }))
}

function doToolbarClear() {
  console.log('doToolbarClear')

  document.getElementById("rightfocusboxdetail").style.display = 'none'


  window.focusbox = document.getElementById('topfocusbox');
  focusbox.style.left = '-40px';
  focusbox.style.top = '-40px';
  focusbox.style.width = '1px';
  focusbox.style.height = '1px';

  window.settingsbox = document.getElementById('rightfocusbox');
  settingsbox.style.left = '-40px';
  settingsbox.style.top = '-40px';
  settingsbox.style.width = '1px';
  settingsbox.style.height = '1px';

  // window.detailsbox = document.getElementById('detailsbox');
  // detailsbox.style.left = '-40px';
  // detailsbox.style.top = '-40px';
  // detailsbox.style.width = '1px';
  // detailsbox.style.height = '1px';

  if (prevElement != undefined) {
    prevElement.classList.remove("highlight");
  }
  if (currentElementSelected != undefined) {
      currentElementSelected.classList.remove("highlightselect");
  }
  window.extjsdesigner.treelist.setStore({
    type: 'tree',
      rootVisible: true,
      root: { text: 'All', children: [] }

  })

  var bodyEl = document.getElementsByClassName("x-viewport-body-el");
  var rootId = bodyEl[0].childNodes[0].id;
  setData(rootId)

}

function doToolbarEditorSave() {
  console.log('doToolbarEditorSave')
  var t = window.extjsdesigner.monacoeditor.getModel().getValue()
  vscode.postMessage({
    command: 'editorSave',
    data: {code: t}
  });
}

function doToolbarSideBySide() {
  document.getElementById('maindesign').style.display = "flex"
  document.getElementById('maincode').style.display = "flex"
  document.getElementById('mainresizer').style.display = "block"
  document.getElementById('mainparent').style.flexDirection = 'row'

  document.getElementById('maindesign').style.height = '100%'
  document.getElementById('maindesign').style.width = '50%'
  document.getElementById('mainresizer').setAttribute("data-direction", "horizontal")

  document.getElementById('toolbarsidebysidebutton').setAttribute("modal", "true")
  document.getElementById('toolbartoptobottombutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustdesignbutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustcodebutton').setAttribute("modal", "false")

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: window.extjsdesigner.monacoeditor.getModel().getValue()}
  }))
}

function doToolbarTopToBottom() {
  document.getElementById('maindesign').style.display = "flex"
  document.getElementById('mainresizer').style.display = "block"
  document.getElementById('maincode').style.display = "flex"

  document.getElementById('mainparent').style.flexDirection = 'column'
  document.getElementById('maindesign').style.height = '50%'
  document.getElementById('maindesign').style.width = '100%'
  document.getElementById('mainresizer').setAttribute("data-direction", "vertical")

  document.getElementById('toolbarsidebysidebutton').setAttribute("modal", "false")
  document.getElementById('toolbartoptobottombutton').setAttribute("modal", "true")
  document.getElementById('toolbarjustdesignbutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustcodebutton').setAttribute("modal", "false")

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: window.extjsdesigner.monacoeditor.getModel().getValue()}
  }))
}

function doToolbarJustDesign() {
  document.getElementById('maindesign').style.display = "flex"
  document.getElementById('mainresizer').style.display = "none"
  document.getElementById('maincode').style.display = "none"

  document.getElementById('mainparent').style.flexDirection = 'column'
  document.getElementById('maindesign').style.height = '100%'
  document.getElementById('maindesign').style.width = '100%'

  document.getElementById('toolbarsidebysidebutton').setAttribute("modal", "false")
  document.getElementById('toolbartoptobottombutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustdesignbutton').setAttribute("modal", "true")
  document.getElementById('toolbarjustcodebutton').setAttribute("modal", "false")
}

function doToolbarJustCode() {
  document.getElementById('maindesign').style.display = "none"
  document.getElementById('mainresizer').style.display = "none"
  document.getElementById('maincode').style.display = "flex"

  document.getElementById('mainparent').style.flexDirection = 'column'
  document.getElementById('maincode').style.height = '100%'
  document.getElementById('maincode').style.width = '100%'

  document.getElementById('toolbarsidebysidebutton').setAttribute("modal", "false")
  document.getElementById('toolbartoptobottombutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustdesignbutton').setAttribute("modal", "false")
  document.getElementById('toolbarjustcodebutton').setAttribute("modal", "true")

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: window.extjsdesigner.monacoeditor.getModel().getValue()}
  }))
}


function doToolbarHelp() {
  console.log('doToolbarHelp')
  vscode.postMessage({
    command: 'showHelp',
    data: {}
  });
}
