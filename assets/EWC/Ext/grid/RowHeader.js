import Ext_dataview_ItemHeader from '../../Ext/dataview/ItemHeader.js';

export default class Ext_grid_RowHeader extends Ext_dataview_ItemHeader {
  static PROPERTIES() { return [
    'alignSelf',
    'alwaysOnTop',
    'ariaAttributes',
    'ariaDescribedBy',
    'ariaLabel',
    'ariaLabelledBy',
    'axisLock',
    'bind',
    'border',
    'bottom',
    'centered',
    'cls',
    'constrainAlign',
    'contentEl',
    'controller',
    'data',
    'defaultListenerScope',
    'defaultToolWeights',
    'disabled',
    'displayed',
    'docked',
    'draggable',
    'flex',
    'floated',
    'focusCls',
    'fullscreen',
    'group',
    'height',
    'hidden',
    'hideAnimation',
    'hideMode',
    'hideOnMaskTap',
    'html',
    'id',
    'instanceCls',
    'itemId',
    'keyMap',
    'keyMapEnabled',
    'keyMapTarget',
    'left',
    'listeners',
    'margin',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'modal',
    'modelValidation',
    'name',
    'nameable',
    'padding',
    'pinned',
    'plugins',
    'publishes',
    'record',
    'reference',
    'relative',
    'renderTo',
    'right',
    'ripple',
    'scrollable',
    'session',
    'shadow',
    'shareableName',
    'shim',
    'showAnimation',
    'stateful',
    'statefulDefaults',
    'stateId',
    'style',
    'tabIndex',
    'toFrontOnShow',
    'toolDefaults',
    'tools',
    'tooltip',
    'top',
    'touchAction',
    'tpl',
    'tplWriteMode',
    'translatable',
    'twoWayBindable',
    'ui',
    'userCls',
    'userSelectable',
    'viewModel',
    'weight',
    'width',
    'x',
    'xtype',
    'y',
    'zIndex',
  ]};
  static EVENTS() { return [
    {name:'added', parameters:'sender,container,index'},
    {name:'beforebottomchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforecenteredchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforedisabledchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforedockedchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforeheightchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforehiddenchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforehide', parameters:'sender'},
    {name:'beforeleftchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforemaxHeightchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforemaxWidthchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforeminHeightchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforeminWidthchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforeorientationchange', parameters:''},
    {name:'beforerightchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforescrollablechange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforeshow', parameters:'sender'},
    {name:'beforetofront', parameters:'sender'},
    {name:'beforetopchange', parameters:'sender,value,oldValue,undefined'},
    {name:'beforewidthchange', parameters:'sender,value,oldValue,undefined'},
    {name:'blur', parameters:'sender,event'},
    {name:'bottomchange', parameters:'sender,value,oldValue'},
    {name:'centeredchange', parameters:'sender,value,oldValue'},
    {name:'destroy', parameters:''},
    {name:'disabledchange', parameters:'sender,value,oldValue'},
    {name:'dockedchange', parameters:'sender,value,oldValue'},
    {name:'erased', parameters:'sender'},
    {name:'floatingchange', parameters:'sender,positioned'},
    {name:'focus', parameters:'sender,event'},
    {name:'focusenter', parameters:'sender,event'},
    {name:'focusleave', parameters:'sender,event'},
    {name:'fullscreen', parameters:'sender'},
    {name:'heightchange', parameters:'sender,value,oldValue'},
    {name:'hiddenchange', parameters:'sender,value,oldValue'},
    {name:'hide', parameters:'sender'},
    {name:'initialize', parameters:'sender'},
    {name:'leftchange', parameters:'sender,value,oldValue'},
    {name:'maxHeightchange', parameters:'sender,value,oldValue'},
    {name:'maxWidthchange', parameters:'sender,value,oldValue'},
    {name:'minHeightchange', parameters:'sender,value,oldValue'},
    {name:'minWidthchange', parameters:'sender,value,oldValue'},
    {name:'moved', parameters:'sender,container,toIndex,fromIndex'},
    {name:'orientationchange', parameters:''},
    {name:'painted', parameters:'sender,element'},
    {name:'positionedchange', parameters:'sender,positioned'},
    {name:'removed', parameters:'sender,container,index'},
    {name:'resize', parameters:'element,info'},
    {name:'rightchange', parameters:'sender,value,oldValue'},
    {name:'scrollablechange', parameters:'sender,value,oldValue'},
    {name:'show', parameters:'sender'},
    {name:'tofront', parameters:'sender'},
    {name:'topchange', parameters:'sender,value,oldValue'},
    {name:'updatedata', parameters:'sender,newData'},
    {name:'widthchange', parameters:'sender,value,oldValue'},
    {name:'ready', parameters:'cmp,cmpObj'},
    {name:'created', parameters:'cmp'}
  ]};
  static getProperties(properties) {
    properties = properties.concat(Ext_grid_RowHeader.PROPERTIES());
    return Ext_dataview_ItemHeader.getProperties(properties);
  }
  static getEvents(events) {
    events = events.concat(Ext_grid_RowHeader.EVENTS());
    return Ext_dataview_ItemHeader.getEvents(events);
  }

  static get observedAttributes() {
    var attrs = super.observedAttributes
    Ext_grid_RowHeader.PROPERTIES().forEach(function (property, index, array) {
        attrs.push(property)
    })
    Ext_grid_RowHeader.EVENTS().forEach(function (eventparameter, index, array) {
        attrs.push('on' + eventparameter.name)
    })
    return attrs
  }

  constructor(properties, events) {
    super (
      properties.concat(Ext_grid_RowHeader.PROPERTIES()),
      events.concat(Ext_grid_RowHeader.EVENTS())
    )
  }

  connectedCallback() {
    super.connectedCallback()
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal)
  }

}
