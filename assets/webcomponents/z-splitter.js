class ZSplitter extends HTMLElement {

    constructor() {
        super();
        this.priorValue = 0;
        this.isHandlerDragging = false;
        this.attachShadow({ mode: 'open' });
        const template = document.createElement('template');
        template.innerHTML = `${this.html}${this.style}${this.host}`;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    getPrevious(elem) {
        var sibling = elem.previousSibling;
        while (sibling) {
            if (sibling.nodeType != 3) {
                return sibling;
            }
            sibling = sibling.previousSibling
        }
    }

    getNext(elem) {
        var sibling = elem.nextSibling;
        while (sibling) {
            if (sibling.nodeType != 3) {
                return sibling;
            }
            sibling = sibling.nextSibling
        }
    }

    connectedCallback() {
        let styleelement = document.createElement('style');
        this.shadowRoot.appendChild(styleelement);
        this.background = 'var(--z-splitter-background)'

        const style = getComputedStyle(this.parentNode);
        this.flexDirection = style['flexDirection']
        if (this.flexDirection == 'row') {
            this.cursor = 'ew-resize'
            this.dimension = 'width'
            //this.offset = 'offsetWidth'
            this.offset = 'clientWidth'
            this.clientdimension = 'clientX'
            styleelement.textContent = 
            ':host::before { width: 14px; height: 100%; display: block; background: ' + this.background + ';margin: 0 auto; }' +
            ':host { width: 14px; height: 100%; padding: 0; background: ' + this.background + '; cursor: ew-resize; flex: 0 0 auto; }';
        }
        else {
            this.cursor = 'ns-resize'
            this.dimension = 'height'
            //this.offset = 'offsetHeight'
            this.offset = 'clientHeight'
            this.clientdimension = 'clientY'
            styleelement.textContent = 
            ':host::before { height: 14px; width: 100%;display: block;background: ' + this.background + ';margin: 0 auto; }' +
            ':host { height: 14px; width: 100%; padding: 0; background: ' + this.background + '; cursor: ns-resize; flex: 0 0 auto; }';
        }

        this.onpointerdown = (e) =>  {
//            console.dir(this.getSiblings(this))

            this.panelBefore = this.getPrevious(this);
            this.panelAfter = this.getNext(this);
            this.whereIsContent = 'error'
            if (this.panelBefore.attributes[this.dimension] == undefined) {
                this.whereIsContent = 'ContentIsBefore'
            }
            if (this.panelAfter.attributes[this.dimension] == undefined) {
                this.whereIsContent = 'ContentIsAfter'
            }
            console.log(this.whereIsContent)

            if (this.whereIsContent == 'ContentIsBefore') {
                this.content = this.panelAfter;
                this.other = this.panelBefore;
            }
            if (this.whereIsContent == 'ContentIsAfter') {
                this.content = this.panelBefore;
                this.other = this.panelAfter;
            }
            e.srcElement.priorValue = 0;

            e.srcElement.isHandlerDragging = true;
            e.srcElement.setPointerCapture(e.pointerId);
            document.body.style.cursor = e.srcElement.cursor;
        };

        this.onpointermove = (e) => {
            if (e.srcElement.isHandlerDragging == false) {
                return false;
            }
            //const currentWidthContent = e.srcElement.content[e.srcElement.offset];
            var s = getComputedStyle(e.srcElement.content);
            //console.dir('s')
            //console.dir(s)
            //console.dir(s['padding-left'])
            //console.dir(s['padding-right'])
            //console.dir(s['width'])
            var w = s[e.srcElement.dimension]
            //console.log(w)
            const currentWidthContent = parseInt(w.substring(0, w.length - 2));
            //console.log(currentWidthContent)
            var width
            var diff
            var x = e[e.srcElement.clientdimension]
             console.log('***')
             console.log(currentWidthContent)
             console.log(x)
             console.log(e.srcElement.priorValue)
            if (e.srcElement.priorValue == 0 ) {
                width = currentWidthContent
                e.srcElement.priorValue = width
            }
            else {
                if (e.srcElement.whereIsContent == 'ContentIsBefore') {
                    if (e.srcElement.priorValue > x) {
                        diff = e.srcElement.priorValue - x
                        console.log(diff)
                        width = currentWidthContent + diff
                        console.log(width)
                        }
                    else {
                        diff = x - e.srcElement.priorValue
                        console.log(diff)
                        width = currentWidthContent - diff
                        console.log(width)
                    }
                }
                if (e.srcElement.whereIsContent == 'ContentIsAfter') {
                    if (e.srcElement.priorValue > x) {
                        diff = e.srcElement.priorValue - x
                        width = currentWidthContent - diff
                    }
                    else {
                        diff = x - e.srcElement.priorValue
                        width = currentWidthContent + diff
                    }
                }
            }
            e.srcElement.priorValue = x
            var style = e.srcElement.dimension + ":" + width + "px;" + "flex-grow:0;"
            console.log(style)
            e.srcElement.content.setAttribute('style', style);
        }

        this.onpointerup = (e) =>  {
            e.srcElement.isHandlerDragging = false;
            e.srcElement.releasePointerCapture(e.pointerId);
            document.body.style.cursor = "default";
        };
    }

    get html() { return ``}
    get style() { return ``}
    get host() { return ``}

    getSiblings(elem) {
        var siblings = [];
        var sibling = elem.parentNode.firstChild;
        var prev = null
        var foundContent = false
        while (sibling) {

            if ( sibling == elem) {
                //console.log(sibling)
                //console.log(foundContent)
            }
            //if (sibling.nodeType === 1 && sibling !== elem) {

            if (sibling.className == 'content') {
                foundContent == true;
            }


            if (sibling.nodeType != 3) {

                siblings.push(sibling);
            }
            prev = sibling
            sibling = sibling.nextSibling
        }
        return siblings;
    }

}
window.customElements.define('z-splitter', ZSplitter)




    // EventListenerMode = {capture: true};

    // preventGlobalMouseEvents () {
    //   document.body.style['pointer-events'] = 'none';
    // }
    
    // restoreGlobalMouseEvents () {
    //   document.body.style['pointer-events'] = 'auto';
    // }
    
    // mousemoveListener (e) {
    //   e.stopPropagation ();
    //   // do whatever is needed while the user is moving the cursor around
    //   console.dir(e)
    // }
    
    // mouseupListener (e) {
    //   //this.restoreGlobalMouseEvents ();
    //   document.body.style['pointer-events'] = 'auto';
    //   document.removeEventListener ('mouseup',   this.mouseupListener,   this.EventListenerMode);
    //   document.removeEventListener ('mousemove', this.mousemoveListener, this.EventListenerMode);
    //   e.stopPropagation ();
    //   console.log('done')
    // }
    
    // captureMouseEvents (e) {
    //   this.preventGlobalMouseEvents ();
    //   document.addEventListener ('mouseup',   this.mouseupListener.bind(this),   this.EventListenerMode);
    //   document.addEventListener ('mousemove', this.mousemoveListener.bind(this), this.EventListenerMode);
    //   e.preventDefault ();
    //   e.stopPropagation ();
    // }


//    currentClientX = 0

//     moveIt(e) {
//         if (!this.isHandlerDragging) {
//             return false;
//         }
//         //console.dir(e)

//         //var content = this.closest('.content');
//         var content = document.querySelector('.right');
//         console.dir(content)



//         //var me = this
//         //this.onmousemove = function(e) {
//             if (!this.isHandlerDragging) {
//                 return false;
//             }
//             if (me.flexDirection == 'column') {
//                 //console.log(e.clientY)
//                 var height = e.clientY - me.parentNode.offsetTop - 15
//                 var style = "height:" + height + "pt;" + "flex-grow:0;"
//                 me.previousElementSibling.setAttribute('style', style);
//             }
//             else {
//             //    const currentWidth = me.parentNode.offsetWidth;


//                 //const computedstyle = getComputedStyle(this.previousElementSibling);
//             //    const currentWidthContent = me.previousElementSibling.offsetWidth;
//                 //console.log(currentWidthContent + ' ' + e.layerX)


//                 const currentWidthContent = content.offsetWidth;
               
//                 console.log(currentWidthContent)
//                 //console.log(e.clientX)

//                 //const currentWidth = computedstyle['width']

//                 //console.dir(this.previousElementSibling)
//                 //var style = this.previousElementSibling.getAttribute('style');
                
//                 var width
                
//             //    width = e.clientX - currentWidth;
//                 //width = currentWidth - e.clientX;
//             //    console.log(width)

//                 if (me.currentClientX == 0 || me.currentClientX == undefined) {
//                     //this.currentClientX = e.clientX
//                     console.log('here')
//                     width = currentWidthContent
//                 }
//                 else {
//                 //    console.log(e.clientX)

//                 //ScreenToClient()

//                     var diff
//                     var x = e.clientX
//                     if (this.currentClientX > x) {

//                         diff = this.currentClientX - x
//                         width = currentWidthContent + diff
//                         //width = currentWidthContent - 1
//                     }
//                     else {
//                         diff = x - this.currentClientX
//                         width = currentWidthContent - diff
                        
//                     //    width = currentWidthContent + 1
//                     }
//                     console.log(this.currentClientX)
//                      console.log(e.clientX)
//                      console.log(x)
//                      console.log(diff)


//                     //var diff = this.currentClientX - e.clientX
//                     //console.log(currentWidthContent)
//                     //console.log(diff)
//                     //width = currentWidth - diff
//                  }
//                  me.currentClientX = x
//                 //console.log(width)
//                 //var width = e.clientX - this.parentNode.offsetLeft - 15
               
//             //    console.log(e.clientX)
//             //    width = e.clientX - this.parentNode.offsetLeft
//             //    console.log(width)
            
//                 var style = "width:" + width + "px;" + "flex-grow:0;"
//                 //var style = "flex-basis:" + width + "px;"

//                 console.log(style)

//             //    console.log(style)
//             content.setAttribute('style', style);

//                 // var containerOffsetLeft = this.parentNode.offsetLeft;
//                 // var pointerRelativeXpos = e.clientX - containerOffsetLeft;
//                 // var boxAminWidth = 60;
//                 // this.previousElementSibling.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
//                 // this.previousElementSibling.style.flexGrow = 0;


//                 //console.dir(this.previousElementSibling)
//             }


//  //       console.log('move')




//     }





        //console.dir(styleelement.textContent)
        //console.dir(style['flexDirection'])


    //     var me = this;
    //     this.addEventListener('pointerdownx', function(e) {
    //         //console.log(e)
    //         // this.currentClientX = 0;
    //         // me.currentClientY = 0;
    //         // isHandlerDragging = true;
    //         me.setPointerCapture(e.pointerId);
    //         document.body.style.cursor = me.cursor;
    //    });




        // this.addEventListener('pointermove', function(e) {
        //     console.dir(e)
        // //this.onmousemove = function(e) {
        //     if (!isHandlerDragging) {
        //         return false;
        //     }
        //     if (me.flexDirection == 'column') {
        //         //console.log(e.clientY)
        //         var height = e.clientY - me.parentNode.offsetTop - 15
        //         var style = "height:" + height + "px;" + "flex-grow:0;"
        //         me.previousElementSibling.setAttribute('style', style);
        //     }
        //     else {
        //         //const computedstyle = getComputedStyle(this.previousElementSibling);
        //         const currentWidthContent = me.previousElementSibling.offsetWidth;
        //         //console.log(currentWidthContent + ' ' + e.layerX)

        //         const currentWidth = me.parentNode.offsetWidth;
        //         //console.log(currentWidth)
        //         //console.log(e.clientX)

        //         //const currentWidth = computedstyle['width']

        //         //console.dir(this.previousElementSibling)
        //         //var style = this.previousElementSibling.getAttribute('style');
                
        //         var width
                
        //     //    width = e.clientX - currentWidth;
        //         //width = currentWidth - e.clientX;
        //     //    console.log(width)

        //         if (me.currentClientX == 0) {
        //             //this.currentClientX = e.clientX
        //             width = currentWidthContent
        //         }
        //         else {
        //         //    console.log(e.clientX)
        //             var diff
        //             if (me.currentClientX > e.layerX) {
        //                 diff = me.currentClientX - e.layerX
        //                 width = currentWidthContent - diff
        //             }
        //             else {
        //                 diff = e.layerX - me.currentClientX
        //                 width = currentWidthContent + diff
        //             }
        //             //var diff = this.currentClientX - e.clientX
        //             //console.log(currentWidthContent)
        //             //console.log(diff)
        //             //width = currentWidth - diff
        //          }
        //          me.currentClientX = e.layerX
        //         //console.log(width)
        //         //var width = e.clientX - this.parentNode.offsetLeft - 15
               
        //     //    console.log(e.clientX)
        //     //    width = e.clientX - this.parentNode.offsetLeft
        //     //    console.log(width)
        //         var style = "width:" + width + "px;" + "flex-grow:0;"
        //     //    console.log(style)
        //         me.previousElementSibling.setAttribute('style', style);

        //         // var containerOffsetLeft = this.parentNode.offsetLeft;
        //         // var pointerRelativeXpos = e.clientX - containerOffsetLeft;
        //         // var boxAminWidth = 60;
        //         // this.previousElementSibling.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
        //         // this.previousElementSibling.style.flexGrow = 0;


        //         //console.dir(this.previousElementSibling)
        //     }
        // });
        // this.addEventListener('pointerup', function(e) {
        // //this.onpointerup = function(e) {
        //     isHandlerDragging = false;
        //     me.releasePointerCapture(e.pointerId);
        //     document.body.style.cursor = "default";
        // });

    // attributeChangedCallback(name, oldValue, newValue) {
    // }




