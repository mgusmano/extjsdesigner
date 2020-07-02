class ZPanel extends HTMLElement {
    get flexdirection(){return this.getAttribute('flexdirection')};set flexdirection(flexdirection){this.setAttribute('flexdirection',flexdirection)};
    get width(){return this.getAttribute('width')};set width(width){this.setAttribute('width',width)};
    get height(){return this.getAttribute('height')};set height(height){this.setAttribute('height',height)};
    get padding(){return this.getAttribute('padding')};set padding(padding){this.setAttribute('padding',padding)};
    get align(){return this.getAttribute('align')};set align(align){this.setAttribute('align',align)};


    get color(){return this.getAttribute('color')};set color(color){this.setAttribute('color',color)};
    get background(){return this.getAttribute('background')};set background(background){this.setAttribute('background',background)};
    static get observedAttributes() {return ['width','color','background']}

    constructor() {
        super();
        //console.log('z-panel')
        //console.log(this.background)
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `${this.html}`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
      //console.log(this.background)



        //t style = document.createElement('style');
        //this.shadowRoot.appendChild(style);
        //return

        var flexdirection;
        if (this.flexdirection != null) {flexdirection = `flex: 1 0 auto; display: flex; flex-direction: ${this.flexdirection}; flex-wrap: nowrap;`}
        else {flexdirection = ``}

        var align
        if (this.align != null) {align = `align-items: ${this.align};`}
        else {align = ``}

        var padding;
        if (this.padding != null) {padding = `padding: ${this.padding};`}
        else {padding = ``}

        var background;
        if (this.background != null) {background = `background: ${this.background};`}
        else {background = `background: var(--z-panel-background);`}

        var color;
        if (this.color != null) {color = `color: ${this.color};`}
        else {color = `color: var(--z-panel-color);`}

        var width;
        if (this.width != null) {width = `width: ${this.width};`}
        else {width = ``}

        var height;
        if (this.height != null) {height = `height: ${this.height};`}
        else {height = ``}

        var flexgrow;
        if (this.width != null || this.height != null) {flexgrow = `flex-grow: 0;`}
        else {flexgrow = `flex-grow: 1;`}

        //style.textContent = `:host { display: flex; ${align} ${padding} ${flexdirection} ${background} ${color} ${width} ${height} ${flexgrow} }`;
        var text = `:host { display: flex; ${align} ${padding} ${flexdirection} ${background} ${color} ${width} ${height} }`;

        const template = document.createElement('template');
        template.innerHTML = `<style>${text}</style>`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));


        //this.shadowRoot.appendChild(style);
     }

    get html() { return `<slot></slot>`}

     attributeChangedCallback(name, oldValue, newValue) {
        // switch(name) {
        //     case 'width':
        //         var content = this.shadowRoot.querySelector('div[class=panel]');
        //         content.style.width = this.width;
        //         break;
        //     case 'color':
        //         // var content = this.shadowRoot.querySelector('div[class=panel]');
        //         // content.style.color = this.color;
        //         // break;
        //     case 'backgroundx':
        //         //var content = this.shadowRoot.host;
        //         //console.dir(content)
        //         //var s = `<style>:host {background: ${this.background};}</style>`
        //         //console.log(s)
        //         //content.innerHTML = `<style>:host {background: ${this.background}}</style>`
        //         //content.style.background = this.background;


        //         // let styleelement = document.createElement('style');
        //         // styleelement.textContent = `:host {background: ${this.background}; flex-grow: 0;}`;
        //         // this.shadowRoot.appendChild(styleelement);



        //         break;
        //   }
     }
}
window.customElements.define('z-panel', ZPanel)
