export default function Grid() {
  return `Ext.define('myApp.view.GridView', {
  extend: 'Ext.grid.Grid',
  xtype: 'gridview',
  title: 'drag column component into grid',
  columns: [
      {
          text: 'Email',
          dataIndex: 'email',
          width: 230
      },
      {
          text: 'Phone',
          dataIndex: 'phone',
          width: 150
      }
  ],
  store: {
    type: 'store',
    fields: [
      'name', 'email', 'phone'
    ],
    data: { items: [
        { name: 'Jean Luc', email: "jeanluc.picard@enterprise.com", phone: "555-111-1111" },
        { name: 'Worf',     email: "worf.moghsson@enterprise.com",  phone: "555-222-2222" },
        { name: 'Deanna',   email: "deanna.troi@enterprise.com",    phone: "555-333-3333" },
        { name: 'Data',     email: "mr.data@enterprise.com",        phone: "555-444-4444" }
    ]},
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: 'items'
        }
    }
  }
});
`
}