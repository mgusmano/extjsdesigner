function eventListenerLoad(event, nonce, xtype, documenttext) {
  console.log('page is fully loaded - app.js - xtype: ' + xtype);
  window.extjsdesigner.rootxtype = xtype

  if (window.extjsdesigner == undefined) {
    window.extjsdesigner = {}
  }

  window.extjsdesigner.editorGroupBorder = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editorGroup-border');
  const state = vscode.getState();
  if (state) {
    //console.log('text retrieved from state')
    text = state.text
  }
  else {
    //console.log('text NOT retrieved from state')
    text = documenttext
  }

  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement("SCRIPT");
  script.setAttribute('nonce',nonce)
  script.text = text
  head.appendChild(script)

  document.getElementById('wait').style.display = 'none'
  document.getElementById('main').style.display = 'flex '

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: text}
  }))

  Ext.application({
    name: 'EXTApp',
    launch: function () {
      var viewport = document.getElementById("ext-viewport");
      var content = document.getElementById('content');
      content.appendChild(viewport);
      Ext.Viewport.add([{"xtype": xtype}])
      setMouse(viewport)
      var bodyEl = document.getElementsByClassName("x-viewport-body-el");
      var rootId = bodyEl[0].childNodes[0].id;
      setData(rootId)
      document.body.style.filter = "";
      document.getElementById("ext-viewport").focus()
    }
  })
}
