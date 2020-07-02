export default function dialogs() {
  var html = `
<div id="topfocusbox" class="initialselect" style="display:none;">
<div id="topfocusboxtext" style="flex:1;padding:3px;text-align:center;font-size:12px;background:green;color:white"></div>
</div>

<div id="rightfocusbox" title="quick settings" class="initialselect" style="display:flex;justify-content:center;align-items:center;background:green;border:1px solid green;border-left:0px solid green;">
<div id="rightfocusboxbutton" style="cursor:pointer;" class="white fa fa-cog"></div>
</div>

<div id="rightfocusboxdetail" class="initialselect" style="display:none;background:green;color:white;border:1px solid green;z-index:10000;flex-direction:column;">
<div>this dialog can hold</div>
<div>additional context</div>
<div>or most edited properties</div>
</div>
  `;
  return html;
}
