function treeReady(event) {
  window.extjsdesigner.treelist = event.detail.cmp
  var data = [
    {"text":"design pane component tree","iconCls":"fas fa-link","leaf":false,"expanded":true,"children":
      [
        {"text":"click on design pane","iconCls":"fas fa-link","leaf":false,"expanded":true,"children":[]}
      ]
    }
  ]
  window.extjsdesigner.treelist.setStore({
    type: 'tree',
      rootVisible: true,
      root: { text: 'All', children: data }
  })



  return

  // console.log(event)

  // var data2 = []
  // var arrInit = ["x-paneltitle x-component ", "x-panelheader x-container x-component ", "x-formpanel x-panel x-container x-component ", "x-viewport x-container x-component "]


  // var data3 = drawIt(arrInit)


  // const arr = arrInit.reverse();

  // var prevO = {}
  // for (var i = arr.length - 1; i >= 1; i--) {
  //   var o = {}
  //   o.text = arr[i];
  //   o.iconCls = "fas fa-home"
  //   console.log(i)
  //   if (i == arr.length - 1) {
  //     o.leaf =true
  //   }
  //   else {
  //     o.leaf = false
  //   }
  //   o.expanded = true
  //   o.children = []
  //   if (prevO != {}) {
  //     o.children.push(prevO)
  //   }
  //   prevO = o
  //   //console.log(arr[i]);
  // }
  // data2.push(prevO)






  // var data = [
  //   { "text": "Marc Gusmano", "iconCls": "fas fa-home", "leaf": false, "expanded": true,
  //     "children": [
  //       { "text": "L1", "iconCls": "fas fa-home", "leaf": false , "expanded": true,
  //         "children": [
  //           { "text": "L2", "iconCls": "fas fa-home", "leaf": false , "expanded": true,
  //             "children": [
  //               { "text": "L3", "iconCls": "fas fa-home", "leaf": true , "expanded": true,
  //               "children": [

  //               ]
  //             }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // ]

  // console.log(data2)
  // console.log(data)


  // var navStore =  Ext.create('Ext.data.TreeStore', {
  //   rootVisible: true,
  //   root: { text: 'All', children: data3 }
  // })

  // event.detail.cmp.setStore(navStore)

  // var t = document.getElementById('treelist')
  // console.dir(t)
  // console.log(navStore)
}
