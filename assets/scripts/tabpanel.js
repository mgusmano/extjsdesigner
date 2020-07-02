//console.log('in tabpanel.js')
function tabdescriptionReady(event) {
    window.extjsdesigner.tabdescription = event.detail.cmp;
}

function tabpropertiesReady(event) {
    window.extjsdesigner.tabproperties = event.detail.cmp;
}

function tabmethodsReady(event) {
    window.extjsdesigner.tabmethods = event.detail.cmp;
}

function tabeventsReady(event) {
  window.extjsdesigner.tabevents = event.detail.cmp;
}
