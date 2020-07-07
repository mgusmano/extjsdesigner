var prevElement;
var currentElementSelected;

function setMouse(viewport) {

    viewport.onmouseout = function (e) {
      var elementMouseIsOver = document.elementFromPoint(
        e.clientX,
        e.clientY
      );
      var currElement = elementMouseIsOver;
      var el = currElement.closest("#content");
      if (el == null) {
        if (prevElement != undefined) {
          prevElement.classList.remove("highlight");
        }
      }
    }

    viewport.onmousemove = function (e) {
      //console.log('m')
      //prevElement.classList.remove("highlight");
        if (prevElement != undefined) {
            prevElement.classList.remove("highlight");
        }
        var elementMouseIsOver = document.elementFromPoint(
            e.clientX,
            e.clientY
        );
        var currElement = elementMouseIsOver;

        //console.log(currElement)
        while (!currElement.className.includes("x-component ")) {
            //console.dir(currElement.className)
            currElement = currElement.parentNode;
            // if (currElement.className == 'x-button-el') {
            //     currElement = currElement.parentNode.parentNode
            // }
            // else {
            //     currElement = currElement.parentNode
            // }
            //console.dir(currElement)
        }
        currElement.classList.add("highlight");
        prevElement = currElement;
    };

    function drawIt(arrInit) {
        const arr = arrInit.reverse();
        var prevO = {};
        for (var i = arr.length - 1; i >= 1; i--) {
            var o = {};
            o.text = arr[i].substring(2, arr[i].indexOf(" "));
            o.iconCls = "fas fa-link";
            console.log(i);
            if (i == arr.length - 1) {
                o.leaf = true;
            } else {
                o.leaf = false;
            }
            o.expanded = true;
            o.children = [];
            if (prevO != {}) {
                o.children.push(prevO);
            }
            prevO = o;
        }
        var data2 = [];
        data2.push(prevO);
        return data2;
    }

    function filterIt(p) {
        var p2Keep = "";
        var p2KeepArray = [];
        var p2Reject = "";
        var last = false;
        var viewport = false;
        while (p != undefined && viewport == false) {
            p.classList.forEach((c) => {
                //    if (viewport == false) {
                if (last == false) {
                    if (c == "x-component") {
                        last = true;
                    }
                    if (c == "x-unselectable") {
                        p2Reject = p2Reject + c + " ";
                    } else if (c.substring(0, 2) != "x-") {
                        p2Reject = p2Reject + c + " ";
                    } else if (c.includes("-el")) {
                        p2Reject = p2Reject + c + " ";
                    } else if (c.split("-").length > 2) {
                        p2Reject = p2Reject + c + " ";
                    } else {
                        p2Keep = p2Keep + c + " ";
                    }
                    if (c == "x-viewport") {
                        viewport = true;
                    }
                }
                //    }
            });
            if (p2Keep.includes("x-component")) {
                if (p2Keep != "") {
                    p2KeepArray.push(p2Keep);
                }
            }
            p2Reject = "";
            p2Keep = "";
            last = false;
            p = p.parentNode;
        }
        return p2KeepArray;
    }

    viewport.onmouseup = function (e) {
        if (currentElementSelected != undefined) {
            currentElementSelected.classList.remove("highlightselect");
        }
        currentElementSelected = prevElement;

        currentElementSelected.classList.remove("highlight");
        currentElementSelected.classList.add("highlightselect");

        document.getElementById("rightfocusboxdetail").style.display = 'none';

        var p = prevElement;
        setData(p.id);
        var p2KeepArray = filterIt(p);
        var data = drawIt(p2KeepArray);

        console.log(JSON.stringify(data));
        window.extjsdesigner.treelist.setStore({
            type: "tree",
            rootVisible: true,
            root: { text: "All", children: data },
        });

        var components = [
            "x-panel",
            "x-button",
            "x-list",
            "x-dataview",
            "x-titlebar",
            "x-container",
            "x-field",
            "x-searchfield",
            "x-textfield",
            "x-component",
            "x-gridcolumn",
            "x-paneltitle",
        ];
        var classes = currentElementSelected.className.split(" ");
        var i;
        for (i = 0; i < classes.length; i++) {
            if (components.includes(classes[i])) {
                break;
            }
        }

        var s = "";
        var keys = "";
        var keyVal = "set";
        var keysArray = [];
        var configsObject = [];
        var displayValue;
        var value;
        ultimate = [];

        //document.getElementById("rightfocusboxdetail").style.display = 'none'

        var height = 10;
        var width = 150;
        var borderheight = 4 + 2;

        var rect = currentElementSelected.getBoundingClientRect();
        var x = rect.left;
        var y = rect.top;
        var w = rect.right - rect.left;
        var h = rect.bottom - rect.top;

        var top = y - height - borderheight;
        //var height = h + 20

        window.topfocusbox = document.getElementById("topfocusbox");
        topfocusbox.style.display = "flex";
        topfocusbox.style.left = x + "px";
        topfocusbox.style.top = top + "px";
        topfocusbox.style.width = width + "px";
        topfocusbox.style.height = height + "px";

        // var dX = x //+ w - width
        // var dY = y + h
        // window.bottomfocusbox = document.getElementById('bottomfocusbox');
        // bottomfocusbox.style.display = 'flex';
        // bottomfocusbox.style.left = dX + 'px';
        // bottomfocusbox.style.top = dY + 'px';
        // //bottomfocusbox.style.width = width + 'px';
        // //bottomfocusbox.style.height = height + 'px';
        // bottomfocusbox.style.width = '50' + 'px';
        // bottomfocusbox.style.height = '20' + 'px';

        var sX = x + w;
        var sY = y + 3;
        window.rightfocusbox = document.getElementById("rightfocusbox");
        rightfocusbox.style.display = "flex";
        rightfocusbox.style.left = sX + "px";
        rightfocusbox.style.top = sY + "px";
        rightfocusbox.style.width = "20" + "px";
        rightfocusbox.style.height = "20" + "px";
        document.getElementById("topfocusboxtext").innerText =
            window.extjsdesigner.classname;

        var o = Ext.getCmp(currentElementSelected.id);
        var theClass = Ext.getClass(o);
        console.log(theClass);
        window.o = o;
        var xtype = o.xtype;

        const allDocsFiltered = allDocs.filter(
            (element) => element.xtype == o.xtype
        );
        console.log(allDocsFiltered);
        //`<pre>${JSON.stringify(allDocsFiltered[0], null, 2)}</pre>`
        var outputText = "";
        if (allDocsFiltered[0] == undefined) {
            var superclassname = theClass.superclass.$className;
            console.dir(theClass.superclass);
            outputText =
                "user defined view - xtype: " +
                xtype +
                " parent: " +
                superclassname;

            const allDocsFiltered2 = allDocs.filter(
                (element) => element.xtype == theClass.superclass.xtype
            );
            if (allDocsFiltered2[0] != undefined) {
                outputText = outputText + "\n\n" + allDocsFiltered2[0].text;
            }
        } else {
            outputText = allDocsFiltered[0].text;
        }
        window.extjsdesigner.tabdescription.setHtml(
            `<pre>${outputText}</pre>`
        );

        //return

        // var docs = getDocs(xtype); //xtype

        // var theSupers = []
        // var allconfigs = []
        // var ultimateconfigs = []

        // getSuper(theClass, theClass.$config, theSupers, allconfigs, initialconfigs, ultimateconfigs, docs);

        // window.extjsdesigner.tab2container.setHtml(`<pre>${JSON.stringify(theSupers)}</pre>`);
        // window.extjsdesigner.tab3container.setHtml(`<pre>${JSON.stringify(ultimateconfigs)}</pre>`);
        // window.extjsdesigner.tab4container.setHtml(`<pre>${JSON.stringify(allconfigs)}</pre>`);

        // window.dispatchEvent(new CustomEvent('xtypeEvent', {detail:{xtype:xtype}}));
        // window.dispatchEvent(new CustomEvent('supersEvent', {detail:{supers:theSupers}}));
        // window.dispatchEvent(new CustomEvent('ultimateEvent', {detail:{configs:ultimateconfigs}}));
        // window.dispatchEvent(new CustomEvent('allEvent', {detail:{configs:allconfigs}}));
    };

    viewport.ondragover = function (event) {
        event.preventDefault();
        if (prevElement != undefined) {
            prevElement.classList.remove("highlight");
        }
        var elementMouseIsOver = document.elementFromPoint(
            event.clientX,
            event.clientY
        );
        var currElement = elementMouseIsOver;
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode;
        }
        currElement.classList.add("highlight");
        prevElement = currElement;
    };

    viewport.ondrop = function (event) {
        event.preventDefault();
        var elementMouseIsOver = document.elementFromPoint(
            event.clientX,
            event.clientY
        );
        var currElement = elementMouseIsOver;
        console.log('dropped on:')
        console.dir(currElement);
        console.dir(currElement.id);
        var elementSplit = currElement.id.split('-');
        console.log(elementSplit)
        console.log(elementSplit[1])
        var xtypedroppedon = elementSplit[1]
        console.log(currElement.parentNode)

        var curr = currElement.previousSibling;
        var count = 0;
        while (curr != null) {
            count++;
            curr = curr.previousSibling;
        }

        var data = event.dataTransfer.getData("text");
        var dataSplit = data.split('-');
        var type = dataSplit[0]
        var xtype = dataSplit[1]






        //var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;

        //var today = curMonth + ' ' + dayOfMonth + ' ' + curYear + ' ' + curHour + ":" + curMinute + "." + curSeconds + curMeridiem;

        //var text = xtype + " - " + today;
        //console.log(text);
        //var field = "text";

        //console.log(window.extjsdesigner.extend)

        if (window.extjsdesigner.extend == 'Ext.form.Panel') {
          switch (type) {
            case "form":
              count = -1
              var items = [
                {identifier: 'xtype', literal: xtype},
                {identifier: 'label', literal: xtype + ' label'},
                {identifier: 'placeholder', literal: 'placeholder'},
              ]
              vscode.postMessage({
                  command: "additems",
                  data: { items: items, index: count }
              });
              break;
            case "button":
              count = -1
              var items = [
                {identifier: 'xtype', literal: xtype},
                {identifier: 'text', literal: 'button'}
              ]
              vscode.postMessage({
                  command: "addbuttons",
                  data: { items: items, index: count }
              });
              break;
            default:
              vscode.postMessage({
                command: 'notimplemented',
                data: { text: xtype + " not valid for " + window.extjsdesigner.extend }
              });
          }
        }
        else if (window.extjsdesigner.extend == 'Ext.grid.Grid') {
          switch (type) {
            case "grid":
              field = "name";
              count = -1
              vscode.postMessage({
                  command: "addcolumn",
                  data: { xtype: xtype, field: field, text: text, index: count, xtypedroppedon: xtypedroppedon },
              });
              break;
            default:
              vscode.postMessage({
                command: 'notimplemented',
                data: { text: xtype + " not valid for " + window.extjsdesigner.extend }
              });
          }
        }
        else {
          vscode.postMessage({
            command: 'notimplemented',
            data: { text: "This view type is not implemented for the Hackathon - " + window.extjsdesigner.extend }
          });
        }



        // switch (type) {
        //   case "grid":
        //     field = "name";
        //     count = -1
        //     vscode.postMessage({
        //         command: "itemAdd",
        //         data: { xtype: xtype, field: field, text: text, index: count, xtypedroppedon: xtypedroppedon },
        //     });
        //     break;
        //   case "form":
        //     count = -1
        //     var items = [
        //       {identifier: 'xtype', literal: xtype},
        //       {identifier: 'label', literal: xtype + ' label'},
        //       {identifier: 'placeholder', literal: 'placeholder'},
        //     ]
        //     vscode.postMessage({
        //         command: "additems",
        //         data: { items: items, index: count }
        //     });
        //     break;
        //   case "button":
        //     count = -1
        //     var items = [
        //       {identifier: 'xtype', literal: xtype},
        //       {identifier: 'text', literal: 'button'}
        //     ]
        //     vscode.postMessage({
        //         command: "addbuttons",
        //         data: { items: items, index: count }
        //     });
        //     break;
        // }



        // switch (xtype) {
        //     case "column":
        //       field = "name";

        //       count = -1
        //       vscode.postMessage({
        //           command: "itemAdd",
        //           data: { xtype: xtype, field: field, text: text, index: count, xtypedroppedon: xtypedroppedon },
        //       });
        //       break;
        //     case "button":
        //       field = "text";
        //       break;
        //     default:
        //       count = -1
        //       var items = [
        //         {identifier: 'xtype', literal: xtype},
        //         {identifier: 'label', literal: 'label'},
        //         {identifier: 'placeholder', literal: 'placeholder'},
        //       ]
        //       vscode.postMessage({
        //           command: "additems",
        //           data: { items: items, index: count }
        //       });
        //       break;
        // }

        // count = -1
        // vscode.postMessage({
        //     command: "itemAdd",
        //     data: { xtype: xtype, field: field, text: text, index: count, xtypedroppedon: xtypedroppedon },
        // });
        // console.log("sent postMessage of itemAdd to vscode");

        //console.log(data)

        return
        var elementMouseIsOver = document.elementFromPoint(
            event.clientX,
            event.clientY
        );
        var currElement = elementMouseIsOver;
        //console.log(currElement)
        //console.log(currElement.parentNode)
        //console.log(currElement.parentNode.parentNode)
        //console.log(currElement.parentNode.parentNode.parentNode)
        //console.log(currElement.parentNode.parentNode.parentNode.parentNode)
        //console.log(currElement.parentNode.parentNode.parentNode.parentNode.parentNode)
        while (!currElement.className.includes("x-component ")) {
            currElement = currElement.parentNode;
        }
        //console.log(currElement)
        //currElement.classList.add("highlight");
        var o = Ext.getCmp(currElement.id);
        var theClass = Ext.getClass(o);
        var x;
        var prefix = theClass.$className.substring(0, 3);

        var classname;
        if (prefix == "Ext") {
            classname = theClass.$className;
        } else {
            classname = theClass.superclass.$className;
        }
//        document.getElementById("m-target").innerHTML = o.xtype;
//        document.getElementById("m-classname").innerHTML = classname;
//        document.getElementById("m-xtype").innerHTML = xtype;

//        const likeIt = document.getElementById("like-it");
//        const modal = document.getElementById("demo-modal");

        //modal.showModal();

        // likeIt.addEventListener("click", () => {
        //     modal.close("Like it");
        //     vscode.postMessage({
        //         command: "columnSet",
        //         data: { text: "the phone", dataIndex: "phone" },
        //     });
        // });
    };
}


function theDate() {
  var objToday = new Date(),
  weekday = new Array(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
  ),
  dayOfWeek = weekday[objToday.getDay()],
  domEnder = (function () {
      var a = objToday;
      if (/1/.test(parseInt((a + "").charAt(0)))) return "th";
      a = parseInt((a + "").charAt(1));
      return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th";
  })(),
  dayOfMonth =
      objToday.getDate() < 10
          ? "0" + objToday.getDate() + domEnder
          : objToday.getDate() + domEnder,
  months = new Array(
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
  ),
  curMonth = months[objToday.getMonth()],
  curYear = objToday.getFullYear(),
  curHour =
      objToday.getHours() > 12
          ? objToday.getHours() - 12
          : objToday.getHours() < 10
          ? "0" + objToday.getHours()
          : objToday.getHours(),
  curMinute =
      objToday.getMinutes() < 10
          ? "0" + objToday.getMinutes()
          : objToday.getMinutes(),
  curSeconds =
      objToday.getSeconds() < 10
          ? "0" + objToday.getSeconds()
          : objToday.getSeconds(),
  curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";


}



//window.dragdrop = {}
//window.dragdrop.hover = true

// window.dragdrop.dragover = function(event) {
//     event.preventDefault();
// };

// window.dragdrop.drop = function(event) {
//     event.preventDefault();
//     var data = event.dataTransfer.getData("text");
//     console.log(data)
// };

// window.dragdrop.dragstart = function(event) {
//   console.log('dragstart')
//   console.log(event.target)
//   console.log(event.target.getAttribute('xtype'))
//     event.dataTransfer.setData("xtype", event.target.innerText);
// }

// function doToolbarRemoveFocus() {
//     console.log('doToolbarRemoveFocus')

//     // window.topfocusbox = document.getElementById('topfocusbox');
//     // topfocusbox.style.left ='-100px';
//     // topfocusbox.style.top = '-100px';
//     // topfocusbox.style.width = '-100px';
//     // topfocusbox.style.height = '-100px';

//       if (prevElement != undefined) {
//         prevElement.classList.remove("highlight");
//     }

//     if (currentElementSelected != undefined) {
//         currentElementSelected.classList.remove("highlightselect");
//     }

//     //window.dragdrop.hover = true
//   }
