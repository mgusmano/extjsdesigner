//Thu May 14 2020 14:28:32 GMT-0400 (Eastern Daylight Time)

import {
  doProp,
  filterProp,
  isClassicDock,
  isMenu,
  isRenderercell,
  isParentGridAndChildToolbar,
  isParentGridAndChildColumn,
  isTooltip,
  isPlugin
} from './util.js';

export default class WebComponentsBaseComponent extends HTMLElement {

  constructor(properties, events) {
    super ();

    const distinct = (value, index, self) => {
        return self.indexOf(value) === index;
    };
    this.properties = properties.filter(distinct);


    var unique = [];
    this.events = [];
    for( let i = 0; i < events.length; i++ ){
      if( !unique[events[i].name]){
        this.events.push(events[i]);
        unique[events[i].name] = 1;
      }
    }
    //console.log(this.events)
    //console.log(this.events.length)

    this.A = {};
    this.A.CHILDREN = [];
    this.A.ITEMS = [];
    this.A.o = {};
    this.attributeObjects = {};

    this.base = WebComponentsBaseComponent;
  }

  connectedCallback() {
    //console.log('connectedCallback: ' + this.xtype);
    WebComponentsBaseComponent.elementcount++;
    WebComponentsBaseComponent.elements.push(this);
    //console.log('added: ' + this.tagName + ': elementcount is now ' + WebComponentsBaseComponent.elementcount);

    if (WebComponentsBaseComponent.attributeFirst == true) {
      WebComponentsBaseComponent.attributeFirst = false;

      var isEWC = true;
      if (window['ExtAngular'] == 'loaded') {
        isEWC = false;
      }
      if (window['ExtReact'] == 'loaded') {
        isEWC = false;
      }

      if (isEWC == true) {
        WebComponentsBaseComponent.attributeEarly = false;
      }
      else {
        //console.log(this.attributes.length)
        if (this.attributes.length > 1) {
          //console.log('Early')
          WebComponentsBaseComponent.attributeEarly = true;
        } else {
          //console.log('Late')
          WebComponentsBaseComponent.attributeEarly = false;
        }
      }

    }

    if (WebComponentsBaseComponent.attributeEarly == true) {
      this.connectedCallback2()
    }

  }

  connectedCallback2() {
    //console.log('connectedCallback: ' + this.xtype);
    var x = this.xtype;

    // var distinct = function distinct(value, index, self) {
    //   return self.indexOf(value) === index;
    // };

    // var properties2 = [];
    // var arrayLength = this.properties.length;

    // for (var i = 0; i < arrayLength; i++) {
    //   properties2.push(this.properties[i]);
    // }

    // this.propertiesDistinct = properties2.filter(distinct);
    // this.propertiesDistinct.forEach(function (prop) {
    //   doProp(_this2, prop);
    // });


    this.properties.forEach(prop => {
        doProp(this, prop);
    });

    this.xtype = x;

    var me = this;
    this.newCreateProps(this.properties);

    if (me.A.o['viewport'] == 'true') {
      me.A.o['viewport'] = true
    }
    if (me.A.o['viewport'] == 'false') {
      me.A.o['viewport'] = false
    }
    if (this.A.o['viewport'] == undefined) {
      this.A.o['viewport'] = false;
    }

    if (this.parentNode != null &&
        this.parentNode.nodeName.substring(0, 4) !== 'EXT-' &&
        this.A.o['viewport'] == false)
    {
      if (this.A.o.xtype != 'dialog') {
        this.A.o.renderTo = this.parentNode;
      }
    }

    if (me.A.o.createExtComponentDefer != true) {
      me.newDoExtCreate(me, me.A.o['viewport']);
    }

  }

  newCreateProps(properties) {
    let listenersProvided = false;
    var o = {};
    o.xtype = this.xtype;

    if (o.xtype == 'grid' && this.getAttribute('columns') == null) {
      o.rowHeight = null;
    }

    if (this['config'] !== null) {
        Ext.apply(o, this['config']);
    }

    if ('true' == this.fitToParent || true == this.fitToParent || this.fitToParent == '') {
      o.height='100%';
    }
    for (var i = 0; i < properties.length; i++) {
      var property = properties[i];

      if (this.getAttribute(property) == '[object Object]') {
        //console.log(property)
        o[property] = this.attributeObjects[property];
        //console.log(o)
        continue
      }

      if (this.getAttribute(property) == 'object') {
        //console.log(property)
        o[property] = this.attributeObjects[property];
        continue
      }

      if (this.getAttribute(property) !== null) {
        if (property == 'config') {}
        else if (property == 'renderer') {
            //console.log(this.attributeObjects['renderer'])
            var cellxtype = '';
            if (Ext.ClassManager.getByAlias('widget.reactcell') == undefined) {
              cellxtype = 'elementcell';
            }
            else {
              cellxtype = 'reactcell';
            }
            o.cell = {};
            o.cell.xtype = cellxtype;
            o.cell.encodeHtml = false;
            if (this.attributeObjects['renderer'] != undefined) {
              o.renderer = this.attributeObjects['renderer'];
            }
            else {
              o.renderer = eval(this['renderer']);
            }
        }

        else if (property == 'summaryRenderer') {
          if (this.attributeObjects[property] != undefined) {
            o[property] = this.attributeObjects[property];
          } else {
            //o[property] = eval(this[property]);
          }
        }


        else if (this.getAttribute(property) == 'object') {
            o[property] = this.attributeObjects[property];
        }

        else if (property == 'handler') {
            var functionString = this.getAttribute(property);
            if (functionString !== 'undefined') {
                if (functionString == 'function') {
                    o[property] = this.attributeObjects[property];
                }
                else {
                    o[property] = eval(functionString);
                }
            }
        }

        else if (property == 'listeners' && this[property] != undefined) {
            o[property] = this[property];
            listenersProvided = true;
        }

        else if (this[property] != undefined &&
            property != 'listeners' &&
            property != 'config' &&
            property != 'handler' &&
            property != 'fitToParent') {
            o[property] = filterProp(this.getAttribute(property), property, this);
        }
      }

      if (!listenersProvided) {
        o.listeners = {};
        var me = this;
        this.events.forEach(function(event) {
            me.setEvent(event, o, me);
        });
      }
    }
    this.A.o = o;
  }

  doCreateExtComponent() {
    var me = this
    Object.keys(me.attributeObjects).forEach(function (name) {
      me.A.o[name] = me.attributeObjects[name];
    });
    me.A.o['xtype'] = me.xtype
    me.newDoExtCreate(me, me.A.o['viewport']);
  }

  newDoExtCreate(me, isApplication) {

    if (isApplication) {
      if (Ext.isClassic) {
        me.A.o.plugins = {viewport: true}
      }
    }
    //console.log(me.A.o);
    me.A.ext = Ext.create(me.A.o);
    me.cmp = me.A.ext;
    me.ext = me.A.ext;
    me.ext.childouterHTML = me.outerHTML;

    me.dispatchEvent(new CustomEvent('created', {
       detail: {
         cmp: me.A.ext,
       }
    }))

    this.doChildren(this);

    if (isApplication) {
      if (Ext.isModern) {
        Ext.application({
          name: 'MyEWCApp',
          launch: function launch() {
            Ext.Viewport.add([me.A.ext]);
          }
        });
      }
    }
  }

  parsedCallback() {
    //console.log('parsedCallback: ' + this.xtype);
    if (WebComponentsBaseComponent.attributeEarly == false) {
      this.connectedCallback2()
    }
  }

  doChildren(me) {
    //https://docs.sencha.com/extjs/7.1.0/classic/Ext.dom.Helper.html
    //https://docs.sencha.com/extjs/7.1.0/classic/src/Date.js-6.html
    //var w = Ext.create({})
    //var tree = w.getRenderTree()
    //console.log(tree)
    //var out = []
    //var d = Ext.DomHelper.generateMarkup(tree, out);
    //console.log(d)
    //console.log(Ext.DomHelper.createDom(d))

    for (let child of this.children) {
      if (child.nodeName.substring(0, 4) !== 'EXT-') {
        var w;
        var el = Ext.get(child);
        if (Ext.isClassic) {
          w = Ext.create({
            xtype:'component',
              listeners: {
                'afterrender': function(cmp) {
                  cmp.el.dom.appendChild(el.dom)
                }
              }
          });
        }
        else {
          w = Ext.create({xtype:'widget', element: el});
        }
        w.child = '' //temp mjg
        this.A.ITEMS.push(w);
      }
      else {
        var g = {};
        g.type = 'ext';
        g.child = child;
        this.A.ITEMS.push(g);
      }
    }

    me.A.CHILDREN.forEach(function(child) {
      me.addTheChild(me.A.ext, child);
    });

    if (me.parentNode != null && me.parentNode.nodeName.substring(0, 4) === 'EXT-') {
      if (me.parentNode.A === undefined) {
        console.error('import for ' + me.parentNode.nodeName.toLowerCase() + ' is missing')
        return
      }


/*
      if (me.parentNode.A.ext !== undefined) {
        var totalLength = me.parentNode.A.ITEMS.length;
        var currentLength = me.parentNode.A.ext.items.items.length;
        if (totalLength > currentLength) {
          var filteredresult = WebComponentsBaseComponent.theDeleted.filter(obj => {
            if (obj.parentNode === me.parentNode) {
              return obj.count;
            }
          })
          if (filteredresult.length > 0) {
            me.addTheChild(me.parentNode.A.ext, me.A.ext, filteredresult[0].count);
            WebComponentsBaseComponent.theDeleted.shift()
          }
        }
      }
      else {
        //me.A.count = me.parentNode.A.CHILDREN.length
        //me.A.parentNode = me.parentNode
        me.parentNode.A.CHILDREN.push(me.A.ext);
      }
*/


      if (me.parentNode.A.ext !== undefined) {
        var found = false;
        for (var i = 0; i < me.parentNode.A.ITEMS.length; i++) {
          if (me.parentNode.A.ITEMS[i].child.outerHTML == me.A.ext.childouterHTML) {
            found = true;
            me.addTheChild(me.parentNode.A.ext, me.A.ext, i);
          }
        }
        if (found == false) {
          me.addTheChild(me.parentNode.A.ext, me.A.ext);
        }
      }
      else {
        me.parentNode.A.CHILDREN.push(me.A.ext);
      }





    }

    WebComponentsBaseComponent.elementcount--;
    //console.log('reduced: ' + me.tagName + ': elementcount reduced to ' + WebComponentsBaseComponent.elementcount)
    if (WebComponentsBaseComponent.elementcount == 0) {
      //console.log('done');
      //console.log(WebComponentsBaseComponent.elements);
      WebComponentsBaseComponent.elementsprior = [...WebComponentsBaseComponent.elements];
      WebComponentsBaseComponent.elements = [];
      //console.log(WebComponentsBaseComponent.elementsprior);
      //var allExt = [];
      var cmpObj = {};
      WebComponentsBaseComponent.elementsprior.forEach(element => {
          if (element.A != undefined) {
              for (var i = 0; i < element.A.ITEMS.length; i++) {
                //if(element.A.ITEMS[i].xtype == 'widget') {
                if(element.A.ITEMS[i].type != 'ext') {
                  element.addTheChild(element.A.ext,element.A.ITEMS[i],i);
                }
              }
          }
          if (element.getAttribute('extname') != undefined) {
              var o = {};
              //o.extname = element.getAttribute('extname');
              //o.ext = element.A.ext;
              o.cmp = element.A.ext;
              //allExt.push(o);
              cmpObj[element.getAttribute('extname')] = element.A.ext;
          }
      });

      //console.log(WebComponentsBaseComponent.elementsprior)
      me.cmp = me.A.ext;
      me.ext = me.A.ext;
      WebComponentsBaseComponent.elementsprior.forEach(element => {
          element.dispatchEvent(new CustomEvent('ready', {
              detail: {
                  cmp: element.A.ext,
                  //allCmp: allExt,
                  //ext: element.A.ext,
                  //allExt: allExt,
                  cmpObj: cmpObj
              }
          }));
      });
    }
  }

  addTheChild(parentCmp, childCmp, location) {
    var parentxtype = parentCmp.xtype;
    var childxtype = childCmp.xtype;
    //console.log('addTheChild: ' + parentxtype + '(' + parentCmp.extname + ')' + ' - ' + childxtype + '(' + childCmp.extname + ')');
    //if (childxtype == 'widget')
    if (this.A.ext.initialConfig.align != undefined) {
      if (parentxtype != 'menu' && parentxtype != 'container' && parentxtype != 'toolbar' && parentxtype != 'tooltip' && parentxtype != 'titlebar' && parentxtype != 'grid' && parentxtype != 'lockedgrid' && parentxtype != 'button') {
        console.error('Can only use align property if parent is a Titlebar or Grid or Button - parent: ' + parentxtype);
        return;
      }
    }
    switch (true) {
      case isClassicDock(childxtype):
        parentCmp.addDocked(childCmp);
        break;
      case isMenu(childxtype):
        parentCmp.setMenu(childCmp);
        break;
      case isRenderercell(childxtype):
        parentCmp.setCell(childCmp);
        break;
      case isParentGridAndChildToolbar(parentxtype, childxtype):
        if(parentCmp.items.items[0].xtype == 'titlebar') {
          parentCmp.insert(1, childCmp);
        }
        else {
          parentCmp.insert(0, childCmp);
        }
        break;
      case isParentGridAndChildColumn(parentxtype,childxtype):
        if (location == null) {
          if (Ext.isModern) {
            parentCmp.rowHeight = null;
            parentCmp.addColumn(childCmp);
          }
          else {
            parentCmp.add(childCmp);
          }
        }
        else {
            var regCols = 0;
            if (parentCmp.registeredColumns != undefined) {
                regCols = parentCmp.registeredColumns.length;
            }
            if (parentxtype == 'grid') {
              if (Ext.isModern) {
                parentCmp.insertColumn(location + regCols, childCmp);
              }
              else {
                parentCmp.insert(location + regCols, childCmp);
              }
            }
            else {
                parentCmp.insert(location + regCols, childCmp);
            }
        }
        break;
      case isTooltip(childxtype):
        parentCmp.setTooltip(childCmp);
        break;
      case isPlugin(childxtype):
        parentCmp.setPlugin(childCmp);
        break;
      default:
        if (location == null) {
            parentCmp.add(childCmp);
        }
        else {
            parentCmp.insert(location, childCmp);
        }
    }
  }

  setEvent(eventparameters, o, me) {
    o.listeners[eventparameters.name] = function() {
      let eventname = eventparameters.name
      //console.log('in event: ' + eventname + ' ' + o.xtype)
      let parameters = eventparameters.parameters;
      let parms = parameters.split(',');
      let args = Array.prototype.slice.call(arguments);
      let event = {};
      for (let i = 0, j = parms.length; i < j; i++ ) {
        event[parms[i]] = args[i];
      }
      me.dispatchEvent(new CustomEvent(eventname,{detail: event}))
    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (/^on/.test(attr)) {
        if (newVal) {
          if (newVal == 'function') { return }
          this.addEventListener(attr.slice(2), function(event) {
              var functionString = newVal;
              eval(functionString + '(event)');

              //// todo: error check for only 1 dot
              //var r = functionString.split('.');
              //var obj = r[0];
              //var func = r[1];
              //if (obj && func) {
              //window[obj][func](event);
              //}
          });
        }
        else {
          //delete this[attr];
          //this.removeEventListener(attr.slice(2), this);
        }
    }
    else {
      var ischanged
      if (this.A) {
        if (this.A.ext != undefined) {
            ischanged = true
            var method = 'set' + attr[0].toUpperCase() + attr.substring(1)
            if (typeof this.A.ext[method] == 'function') {
              //console.log(method)
              //console.log(attr)
              //console.log(newVal)
              //console.log(this.attributeObjects[attr])
              //console.log(typeof newVal)
              if (newVal == null) {
                return;
              }
              var propertyVal = newVal;
              if (newVal == 'function') {
                if (attr == 'renderer') {
                  //console.log('renderer')
                  var cellxtype = '';
                  if (Ext.ClassManager.getByAlias('widget.reactcell') == undefined) {
                    cellxtype = 'elementcell';
                  } else {
                    cellxtype = 'reactcell';
                  }
                  var o = {};
                  o.xtype = cellxtype;
                  o.encodeHtml = false;
                  if (this.attributeObjects['renderer'] != undefined) {
                    propertyVal = this.attributeObjects['renderer'];
                  } else {
                    propertyVal = eval(this['renderer']);
                  }
                  //console.log(o)
                  this.A.ext['setCell'](o);
                  //console.log(this.A.ext)
                }
                else {
                  propertyVal = this.attributeObjects[attr];
                }
              }
              //if (newVal == '[object Object]') {
              if (newVal.includes('[object Object]')) {
                propertyVal = this.attributeObjects[attr]
              }
              if (newVal == 'object') {
                propertyVal = this.attributeObjects[attr]
              }
              else if (newVal === 'true') {
                propertyVal = true;
              }
              else if (newVal === 'false') {
                propertyVal = false;
              }
              else {
                try {
                  propertyVal = JSON.parse(newVal);
                } catch (e) {}
              }

              if ((this.A.ext.xtype == 'calendar-day'  ||
                  this.A.ext.xtype  == 'calendar-week' ||
                  this.A.ext.xtype  == 'calendar-month')
                && method == 'setValue') {
                //console.log('here')
                //console.log(propertyVal)
                //console.log(this.A.ext.xtype + ' ' + method)
                //console.log(propertyVal)
                this.A.ext[method](new Date(propertyVal));
              }
              else {
                this.A.ext[method](propertyVal);
              }

            }
          }
          else {
            ischanged = false
          }
      }
    }
  }

  disconnectedCallback() {
    //console.log('ExtBase disconnectedCallback ' + this.A.ext.xtype)

    //var o = {
    //  //what: this,
    //  parentNode: this.A.parentNode,
    //  count: this.A.count
    //}
    //WebComponentsBaseComponent.theDeleted.push(o)

    try {
    Ext.destroy(this.A.ext);
    }
    catch(e) {
      console.log(e)
    }
  }

}

WebComponentsBaseComponent.theDeleted = [];

WebComponentsBaseComponent.attributeFirst = true;
WebComponentsBaseComponent.attributeEarly = true;

WebComponentsBaseComponent.elementcountnew = 0;

WebComponentsBaseComponent.elementcount = 0;
WebComponentsBaseComponent.elements = [];
WebComponentsBaseComponent.elementsprior = [];

WebComponentsBaseComponent.isLoading = false;
WebComponentsBaseComponent.isDone = false;

WebComponentsBaseComponent.count = 0;
WebComponentsBaseComponent.DIRECTION = '';
