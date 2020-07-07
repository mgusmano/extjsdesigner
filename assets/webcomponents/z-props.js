class ZProps extends HTMLElement {
  get theme(){return this.getAttribute('theme')};
  set theme(data){this.setAttribute('theme',data)};
  // get classname(){return this.getAttribute('classname')};
  // set classname(data){this.setAttribute('classname',data)};
  get data(){return JSON.parse(this.getAttribute('data'))};
  set data(data){this.setAttribute('data',JSON.stringify(data))};
  static get observedAttributes() {return ['theme', 'data']}

  constructor() {
    super()

    var primary = 'rgb(6,54,74)'
    var secondary = 'rgb(9,65,88)'
    var tertiary = 'rgb(19,72,95)'



    var steelgray = 'rgb(25,35,45)'
    var steelgraylight = 'rgb(25,48,71)'
    this.headercolor = 'white'
    this.headerbackground = getComputedStyle(document.documentElement).getPropertyValue('--vscode-activityBar-background');
    this.childcolor = 'white'
    this.childbackground = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-background');
    this.linebackground = secondary
    this.attachShadow({ mode: 'open' })
    const templateroot = document.createElement('template');
    //templateroot.innerHTML = `${this.html}${this.style}${this.host}`;
    templateroot.innerHTML = `${this.html}${this.style}${this.host}`;
    this.templatechild = document.createElement('template');
    this.templatechild.innerHTML = this.childHTMLSimple
    //this.templateradio = document.createElement('template');
    //this.templateradio.innerHTML = this.radioHTML



    this.shadowRoot.appendChild(templateroot.content.cloneNode(true));
  }

  doIt(items) {
    var me = this
    var rows = this.shadowRoot.querySelectorAll(".rowparent")
    for (var i = 0; i < rows.length; i++) {
      rows[i].remove()
    }
    items.forEach((item, index, array) => {
      function checkId(obj) {
        return obj.id == item.id;
      }
      let globalIndex = me.data.findIndex(checkId);
      let globalItem = me.data[globalIndex]

      var rowEl = this.templatechild.content.cloneNode(true)

      var confignameEl = rowEl.getElementById('configname')
      confignameEl.innerHTML = item.configName

      var inputvalueEl = rowEl.getElementById('inputvalue')
      inputvalueEl.setAttribute("value", item.value1);
      inputvalueEl.addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          me.sendConfigEvent(item.configName, inputvalueEl.value, item.set)
        }
      });

      var selectvalueEl = rowEl.getElementById('selectvalue')
      selectvalueEl.value =item.value1;
      selectvalueEl.onchange = (event) => {
        event.preventDefault();
        me.sendConfigEvent(item.configName, selectvalueEl.value, item.set)
      }

      var booleanvalueEl = rowEl.getElementById('booleanvalue')
      booleanvalueEl.onchange = (event) => {
        event.preventDefault();
        // console.log(item.configName)
        // console.log(booleanvalueEl.value)
        // console.log(item.set)
        me.sendConfigEvent(item.configName, booleanvalueEl.value, item.set)
      }
      var objectvalueEl = rowEl.getElementById('objectvalue')
      var arrayvalueEl = rowEl.getElementById('arrayvalue')
      var unknownvalueEl = rowEl.getElementById('unknownvalue')
      var othervalueEl = rowEl.getElementById('othervalue')

      function clickIt(currentType) {
        inputvalueEl.style.display = 'none'
        selectvalueEl.style.display = 'none'
        booleanvalueEl.style.display = 'none'
        objectvalueEl.style.display = 'none'
        arrayvalueEl.style.display = 'none'
        unknownvalueEl.style.display = 'none'
        othervalueEl.style.display = 'none'
        switch (currentType) {
          case('enum'):
            selectvalueEl.style.display = 'block'
          break;
          case('string'):
            inputvalueEl.style.display = 'block'
          break;
          case('object'):
            objectvalueEl.style.display = 'block'
          break;
          case('array'):
            arrayvalueEl.style.display = 'block'
          break;
          case('unknown'):
            inputvalueEl.style.display = 'block'
          break;
          case('boolean'):
            booleanvalueEl.style.display = 'block'
          break;
          default:
            othervalueEl.style.display = 'block'
          break;
        }
      }
      item.typesObject.forEach((type) => {
        //var r = this.templateradio.content.cloneNode(true)
        //var radiolabelEl = r.getElementById('radiolabel')
        //var radioinputEl = r.getElementById('radioinput')
        //radiolabelEl.innerHTML = type
        //radioinputEl.setAttribute("name", item.configName);
        //var currentType
        //console.log(globalItem.currentType)
        if (globalItem.currentType == undefined) {
          if (globalItem.type == type) {
            //radioinputEl.checked = true
            //var currentType = type
            clickIt(type)
          }
        }
        else if (globalItem.currentType == type) {
          //radioinputEl.checked = true
          //var currentType = type
          clickIt(type)

        }

        //var radioparentEl = rowEl.getElementById('radioparent')
        //radioparentEl.appendChild(r);

        var deleteEl = rowEl.getElementById('delete')
        if (item.set == 'no') {
          deleteEl.style.display = 'none'
        }
        deleteEl.addEventListener("click", function(event) {
          console.log('delete ' + confignameEl.innerHTML)
          me.sendConfigDelete(item.configName)
        });

      })

      var headerEl = this.shadowRoot.getElementById('header')
      var hb = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-background');
      //console.log(hb)
      headerEl.style.background = hb;
      var hf = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-foreground');
      //console.log(hf)
      headerEl.style.color = hf;



      var rowHeaderEl = this.shadowRoot.getElementById('rowhost')
      var b = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-background');
      //console.log(b)
      rowHeaderEl.style.background = b;
      var f = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-foreground');
      //console.log(f)
      rowHeaderEl.style.color = f;
      rowHeaderEl.appendChild(rowEl);
    })
  }

  displayIt(me, data) {
    // this.headercolor = 'white'
    // this.headerbackground = getComputedStyle(document.documentElement).getPropertyValue('--vscode-activityBar-background');
    // console.log(this.headerbackground)
    // this.childcolor = 'white'
    // this.childbackground = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-background');

    // templateroot.innerHTML = `${this.html}${this.style}${this.host}`;
    // this.templatechild = document.createElement('template');
    // this.templatechild.innerHTML = this.childHTMLSimple


    var modifiedData = []
    var showmodifiedEl = me.shadowRoot.getElementById('showmodified')
    if (showmodifiedEl.checked == true) {
      function filter_modified(item) {
        return item.set == 'yes';
      }
      modifiedData = data.filter(filter_modified);
    }
    else {
      modifiedData = data;
    }
    var filteredData = []
    var filterEl = me.shadowRoot.getElementById('filter')
    if (filterEl.value.trim() !== '') {
      function filter_items(item) {
        return item.configName.toLowerCase().includes(filterEl.value.toLowerCase());
      }
      filteredData = modifiedData.filter(filter_items);
    }
    else {
      filteredData = modifiedData
    }
    me.doIt(filteredData)
  }

  attributeChangedCallback(name, oldValue, newValue) {
    var me = this;
    switch(name) {
        // case 'classname':
        //   me.shadowRoot.getElementById('classname').innerText = newValue
        //   break;

        case 'theme':
          //console.log(this.data)
          //var data = JSON.parse(this.data)
          me.displayIt(me, this.data)
          break;


        case 'data':
          var data = JSON.parse(newValue)

          //console.log(data)
          me.displayIt(me, data)
          //me.doIt(data)
          break;
        default:
          break;
    }
  }

  connectedCallback() {
    var me = this;

    var showmodifiedEl = this.shadowRoot.getElementById('showmodified')
    showmodifiedEl.addEventListener("click", function(event) {
      me.displayIt(me, me.data)
    });

    var filterEl = this.shadowRoot.getElementById('filter')
    filterEl.addEventListener("keyup", function(event) {
      me.displayIt(me, me.data)
    });

  }

  sendConfigDelete(configName) {
    this.dispatchEvent(new CustomEvent('configdelete', {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        configName: configName
      }
    }))
  }

  sendConfigEvent(configName, configValue, set) {
    var eventToSend = ''
    if (set == 'yes') {
      eventToSend = 'configupdate'
    }
    else {
      eventToSend = 'configadd'
    }
    this.dispatchEvent(new CustomEvent(eventToSend, {
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {
        configName: configName,
        configValue: configValue
      }
    }))
  }

  get style() {
    //var editorBackground = 'rgb(86,86,86)';
    return `
    <style>
    .rowparent {
      xflex:1;
      font-size: 12px;
      padding: 3px 3px 3px 3px;
      border-bottom: 1px solid ${this.linebackground};
      display: flex;
      flex-direction: row;
    }
    </style>
  `}

  get host() {
    //var editorBackground = 'var(--vscode-tab-activeBackground)'
    return `
    <style>
    :host {
      flex:1;display:flex;flex-direction:column;
    }
    </style>
  `}

  get html() {
    return `
    <div id="header" style="font-size:12px;height:60px;padding:5px;color:${this.headercolor};background:${this.headerbackground};display:flex:flex-direction:column;">
      <div style="flex:1;display:flex;flex-direction:row;">
          <div style="width:60px;">Modified:</div>
          <input type="checkbox" id="showmodified" name="showmodified" value="showmodified">
      </div>
      <div style="flex:1;display:flex;flex-direction:row;">
          <div style="width:60px;">Filter:</div>
          <input type="text" style="width:90px;" id="filter">
      </div>
    </div>
    <div id="rowhost" style="flex:1;display:flex;flex-direction:column;color:${this.childcolor};background:${this.childbackground};overflow:auto;"></div>
  `}

//   <div style="flex:none;xwidth:40px;xheight:15px;border:0px solid red;">
//   <button id="delete" style="xwidth:100%;xheight:100%;">delete</button>
// </div>

  get childHTMLSimple() { return `
    <div class="rowparent">
      <button id="delete" style="height:20px;">X</button>

      <div id="configname" style="flex:1;text-align:right;padding-right:10px;" class="xname"></div>
      <div style="flex:none;">
        <input id="inputvalue" style="width:90px;" type="text"/>
        <select id="selectvalue" style="width:95px;" class="value" >
          <option value="auto">auto</option>
          <option value="hbox">hbox</option>
          <option value="vbox">vbox</option>
          <option value="fit">fit</option>
        </select>
        <select id="booleanvalue" class="xvalue" style="width:95px;">
          <option value=""></option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <div id="objectvalue" style="width:90px;">object</div>
        <div id="arrayvalue" style="width:90px;">array</div>
        <div id="unknownvalue" style="width:90px;">unknown</div>
        <div id="othervalue" style="width:90px;">other</div>
      </div>
      <div style="flex:none;width:5px;height:15px;border:0px solid red;">
    </div>
  `}

}
window.customElements.define('z-props', ZProps)
