function dataviewReady(event) {
  window.extjsdesigner.dataview = event.detail.cmp
  window.extjsdesigner.dataview.setBodyCls("dataviewvbox")
  window.extjsdesigner.dataview.setInnerCls("dataviewvbox")
  window.extjsdesigner.dataview.setItemCls("dataviewvbox")
  window.extjsdesigner.dataview.setData([

    { xtype: 'column',         type: 'grid',   icon: 'table'},

    { xtype: 'button',         type: 'button', icon: 'cog'},

    { xtype: 'textfield',      type: 'form',   icon: 'th-list'},
    { xtype: 'colorfield',     type: 'form',   icon: 'th-list'},
    { xtype: 'checkboxfield',  type: 'form',   icon: 'th-list'},
    { xtype: 'comboboxfield',  type: 'form',   icon: 'th-list'},
    { xtype: 'containerfield', type: 'form',   icon: 'th-list'},
    { xtype: 'datefield',      type: 'form',   icon: 'th-list'},
    { xtype: 'emailfield',     type: 'form',   icon: 'th-list'},
    { xtype: 'inputfield',     type: 'form',   icon: 'th-list'},
    { xtype: 'numberfield',    type: 'form',   icon: 'th-list'},
    { xtype: 'passwordfield',  type: 'form',   icon: 'th-list'},

    { xtype: 'datecolumn',     type: 'grid',   icon: 'table'},
    { xtype: 'numbercolumn',   type: 'grid',   icon: 'table'},
    { xtype: 'treecolumn',     type: 'grid',   icon: 'table'},

  ])
  setTimeout(function () {
    document.querySelectorAll('.dragcomp').forEach(item => {
      item.addEventListener('dragstart', event => {
        //console.dir(event.target)
        var type = event.target.getAttribute('type')
        var xtype = event.target.getAttribute('xtype')
        //event.dataTransfer.setData("xtype", event.srcElement.innerText);

        event.dataTransfer.setData( "text", type + '-' + xtype);
      })
    })
}, 1000);
}
