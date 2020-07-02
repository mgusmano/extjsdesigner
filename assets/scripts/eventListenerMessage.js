function eventListenerMessage(event, nonce, xtype) {
  const message = event.data;
  //console.log('eventListenerMessage: ' + message.type + ' isFirst: ' + window.extjsdesigner.isFirst)
  switch (message.type) {
    case 'extjsdesignerupdate':
      text = message.text
      if (window.extjsdesigner.isFirst == false) {
        updateContent(text, nonce, xtype)
      }
      window.extjsdesigner.isFirst = false
      vscode.setState({ text });
      return;
    case 'extjsdesignerthemechange':
      document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
        bubbles: true,
        cancelable: false,
        composed: true,
        detail: { text: window.extjsdesigner.monacoeditor.getModel().getValue()}
      }))
      document.getElementById('initialconfigs').theme = 'true';
      return;
    default:
      //console.log('did not process')
      //console.log(message)
      return
  }
}

function updateContent(text, nonce, xtype) {
  var className = text.substring(12,text.indexOf(',')-1)
  Ext.undefine(className)

  document.getElementById('editor').dispatchEvent(new CustomEvent('resizeeditor', {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: { text: text }
  }))

  var head = document.getElementsByTagName('head')[0];
  var script = document.createElement("SCRIPT");
  script.setAttribute('nonce',nonce)
  script.text = text
  head.appendChild(script)
  Ext.Viewport.removeAll()
  Ext.Viewport.add([{xtype:xtype}])
  var viewport = document.getElementById("ext-viewport");
  setMouse(viewport)
  var bodyEl = document.getElementsByClassName("x-viewport-body-el");
  var rootId = bodyEl[0].childNodes[0].id;
  setData(rootId)
  document.body.style.filter = "";
}

