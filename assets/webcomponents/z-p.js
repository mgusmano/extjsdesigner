class ZP extends HTMLElement {
  get data(){return JSON.parse(this.getAttribute('data'))};
  set data(data){this.setAttribute('data',JSON.stringify(data))};
  static get observedAttributes() {return ['data']}

  constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `${this.html}`;

        this.templatechild = document.createElement('template');
        this.templatechild.innerHTML = this.childHTML

        this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  doIt(items) {
    var me = this
    var rows = this.shadowRoot.querySelectorAll(".rowparent")
    for (var i = 0; i < rows.length; i++) {
      rows[i].remove()
    }


    items.forEach((item, index, array) => {
      var rowEl = this.templatechild.content.cloneNode(true)
      var confignameEl = rowEl.getElementById('configname')
      confignameEl.innerHTML = item.configName

      var rowhostEl = this.shadowRoot.getElementById('rowhost')
      rowhostEl.appendChild(rowEl);


    })

  }

  get childHTML() {
    return `
    <div class="rowparent">
      <div id="configname"></div>
    </div>
      `
  }



  displayIt(me, data) {
    var me = this
    var filteredData = data
    me.doIt(filteredData)
  }

    get html() { return `
    <style>
    :host {
      display:flex;height:200px;flex-direction:column;
    }
    </style>


    <div style="height:50px;background:gray;">header</div>
    <div id="rowhost" style="flex:1;display:flex;flex-direction:column;background:green;background:lightgray;overflow:auto;">
    </div>
    `}

    attributeChangedCallback(name, oldValue, newValue) {
      switch(name) {
        case 'data':
          var data = JSON.parse(newValue)
          var me = this;
          //console.log(data)
          me.displayIt(me, data)
          break;
        default:
          break;
    }
    }
}
window.customElements.define('z-p', ZP)
