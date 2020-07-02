
import * as esprima from "esprima";
import * as escodegen from "escodegen";

interface propItem {
  identifier: string
  literal: string
}


export default class Eparser {

    program
    ast
    className
    properties
    itemsArray
    columnsArray
    buttonsArray

    constructor(program) {
      this.program = program;
      this.ast = esprima.parse(program)

      this.className = this.ast.body[0].expression.arguments[0].value
      if (this.ast.body[0].expression.arguments[1] == 'ObjectExpression') {
          throw 'Second parameter of Ext.define not a Javascript object'
      }
      this.properties = this.ast.body[0].expression.arguments[1].properties

      var items = this.properties.find(o => o.key.name === 'items')
      if (items != undefined) {
        if (items.value.type != 'ArrayExpression') {
          throw 'items is not an array of objects'
        }
        this.itemsArray = items.value.elements
      }

      var columns = this.properties.find(o => o.key.name === 'columns')
      if (columns != undefined) {
        if (columns.value.type != 'ArrayExpression') {
          throw 'columns is not an array of objects'
        }
        this.columnsArray = columns.value.elements
      }

      var buttons = this.properties.find(o => o.key.name === 'buttons')
      if (buttons != undefined) {
        if (buttons.value.type != 'ArrayExpression') {
          throw 'buttons is not an array of objects'
        }
        this.buttonsArray = buttons.value.elements
      }

    }


    // {
    //     "type": "ObjectProperty",
    //     "key": {
    //       "type": "Identifier",
    //       "name": "name"
    //     },
    //     "value": {
    //       "type": "StringLiteral",
    //       "value": "penny"
    //     }
    //   },


    prop(identifier, literal) {
      var o =
      {
        "type": "Property",
        "computed": false,
        "kind": "init",
        "method": false,
        "shorthand": false,
        "key": {
          "type": "Identifier",
          "name": identifier
        },
        "value": {
          "type": "Literal",
          "value": literal
        }
      }
      return o
    }


    addButtons(items: propItem[], index: number) {
      var properties: any = []
      var me = this;
      items.forEach((item,index) => {
        var o: any = me.prop(items[index].identifier,items[index].literal)
        properties.push(o)
      })
      var v = {
        "type": "ObjectExpression",
        "properties": properties
      }
      if (index == -1) {
        this.buttonsArray.push(v)
      }
      else {
        this.buttonsArray.splice(index, 0, v)
      }
      return 0
    }


    addItems(items: propItem[], index: number) {
      var properties: any = []
      var me = this;
      items.forEach((item,index) => {
        var o: any = me.prop(items[index].identifier,items[index].literal)
        properties.push(o)
      })
      var v = {
        "type": "ObjectExpression",
        "properties": properties
      }
      if (index == -1) {
        this.itemsArray.push(v)
      }
      else {
        this.itemsArray.splice(index, 0, v)
      }
      return 0
    }


    addItem(xtype,field,text,index) {
      var v = {
        "type": "ObjectExpression",
        "properties": [
          this.prop("xtype",xtype),
          this.prop(field,text),
          this.prop("label","lval")
        ]
      }
      if (index == -1) {
        this.itemsArray.push(v)
      }
      else {
        this.itemsArray.splice(index, 0, v)
      }
      return 0
    }

  //   {
  //     "type": "Property",
  //     "computed": false,
  //     "kind": "init",
  //     "method": false,
  //     "shorthand": false,
  //     "key": {
  //       "type": "Identifier",
  //       "name": "xtype"
  //     },
  //     "value": {
  //       "type": "Literal",
  //       "value": xtype
  //     }
  // },


    // {
    //   "type": "Property",
    //   "computed": false,
    //   "kind": "init",
    //   "method": false,
    //   "shorthand": false,
    //   "key": {
    //     "type": "Identifier",
    //     "name": "label"
    //   },
    //   "value": {
    //     "type": "Literal",
    //     "value": "label"
    //   }
    // }

    addProperty(configName, configValue) {
        console.log('addProperty')


        var obj = {}
        obj['type'] = 'Property'
        obj['key'] = {}
        obj['key']['type'] = 'Identifier'
        obj['key']['name'] = configName
        obj['computed'] = false
        obj['value'] = {}
        obj['value']['type'] = 'Literal'
        obj['value']['value'] = configValue
        obj['value']['raw'] = configValue
        obj['kind'] = 'init'
        obj['method'] = false
        obj['shorthand'] = false
        //console.log(obj)
        this.properties.push(obj)
        //console.log(this.properties)
        return 0 //need to fix this
    }

    updateProperty(configName, configValue) {
        console.log('updateProperty')
        console.log(this.properties)
        let obj = this.properties.find(o => o.key.name === configName);
        obj.value.value = configValue
        obj.value.raw = configValue
        return 0 //need to fix this
    }

    deleteProperty(configName) {
        console.log('deleteProperty')
        console.log(configName)
        console.log(this.properties)
        this.properties = this.properties.filter(o => o.key.name !== configName)
        console.log(this.properties)
        this.ast.body[0].expression.arguments[1].properties = this.properties
        return 0 //need to fix this
    }



    addColumn(text, dataIndex) {
        try {
            var newCol = this.getColumnString(text, dataIndex);
            //this.columnsArray.push(JSON.parse(newCol));
            this.columnsArray.splice(0, 0, JSON.parse(newCol))
            return 0;
        }
        catch(e) {
            return -1
        }
    }

    getProperty(name) {
        let obj = this.properties.find(o => o.key.name === name);
        return obj.value.value
    }


    addRootProperty(name, value) {
        this.properties.push(this.getPropertyString(name, value));
    }

    generate() {
      return escodegen.generate(this.ast);
    }



    getColumnString(text, dataIndex) {
        var textProperty = this.getPropertyString('text', text)
        var dataIndexProperty = this.getPropertyString('dataIndex', dataIndex)

        var obj = `{
            "type": "ObjectExpression",
            "properties": [
                ${textProperty},
                ${dataIndexProperty}
            ]
        }`
        return obj
    }

    getPropertyString(key, value) {
        var obj = `{
            "type": "Property",
            "key": {
                "type": "Identifier",
                "name": "${key}"
            },
            "computed": false,
            "value": {
                "type": "Literal",
                "value": "${value}",
                "raw": "'${value}'"
            },
            "kind": "init",
            "method": false,
            "shorthand": false
        }`
        return obj
    }

    changeRootProperty(name, value) {
        let obj = this.properties.find(o => o.key.name === name);
        obj.value.value = value
        obj.value.raw = value
    }

}