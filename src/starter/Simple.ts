export default function Simple() {
  return `Ext.define('myApp.view.SimpleView', {
  extend: 'Ext.form.Panel',
  xtype: 'simpleview',
  title: 'drag button or form components',
  layout: 'vbox',
  bodyPadding: 20,

  items: [],
  buttons: []
});
`
}