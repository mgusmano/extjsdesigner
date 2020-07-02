class ZButton extends HTMLElement {

    get text(){return this.getAttribute('text')};
    set text(data){this.setAttribute('text',text)};

    get modal(){return this.getAttribute('modal')};
    set modal(data){this.setAttribute('modal',modal)};

    get onclick(){return this.getAttribute('onclick')};
    set onclick(data){this.setAttribute('onclick',onclick)};
    get width(){return this.getAttribute('width')};
    set width(data){this.setAttribute('width',width)};
    static get observedAttributes() {return ['text', 'modal', 'onclick', 'width']}

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `${this.style}`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.button = document.createElement("BUTTON");
        this.button.classList.add("up");
        this.button.id = 'b'
        this.shadowRoot.appendChild(this.button);
        // let link = document.createElement('link');
        // link.setAttribute('rel', 'stylesheet');
        // link.setAttribute('href', 'fontawesome/css/all.min.css');
        // this.shadowRoot.appendChild(link);



        // this.image = document.createElement("I");
        // //this.image.style.color = 'white';
        // this.image.classList.add("fa");
        // this.image.classList.add("fa-bars");
        // this.button.appendChild(this.image);

        this.span = document.createElement("SPAN");
        //this.span.style.color = 'white';
        //this.span.style.marginLeft = '5px';
        this.button.appendChild(this.span);
    }

    //https://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/
    get style() { return `
<style>
:host {

    opacity: 0.9;
    transition: opacity 120ms ease-in-out;
  }
  :host(:hover) {
    opacity: 2.5;
  }
  :host(:active) {
    position: relative;
    top: 3px;
    left: 3px;
  }

    .down {
        background: white;
        color: #025B80;
    }

    .up {
        background: var(--vscode-button-background);
        color: white;
    }

.btn {
    border: none;
    padding: 5px 10px 5px 10px;
    font-size: 14px;
    cursor: pointer;

  }
</style>
    `}

    attributeChangedCallback(name, oldValue, newValue) {

        switch (name) {
            case 'onclick':
                //this.button.addEventListener('onclick', new Function( newValue ));
                break;
            case 'modal':

                var b = this.shadowRoot.getElementById('b')
                if (newValue == 'true') {
                    b.classList.replace("up", "down");
                    //b.classList.remove("down");
                    //b.classList.add("up");
                }
                else {
                    b.classList.replace("down", "up");
                    //b.classList.remove("up");
                    //b.classList.add("down");
                }
                //this.shadowRoot.getElementById('b').classList.add("pressed");
                break;
            case 'text':
                this.span.innerHTML = this.text;
                break;
            case 'width':
                this.button.style.width = this.width;
                break;
            default:
        }
    }
}
window.customElements.define('z-button', ZButton)
