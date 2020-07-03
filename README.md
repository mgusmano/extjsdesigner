# Ext JS Designer README

This Visual Studio Code extension is an entry in the Mission: Open Architect Hackathon (https://www.sencha.com/mission-open-architect/)

# Demo Steps

The Ext JS Designer Extension is installed in the Visual Studio Extension Gallery.

To install the Ext JS Designer Extension:

1 - make sure you have the latest version of Visual Studio Code installed.
    The installer is available here: https://code.visualstudio.com/download

<br>
2 - Once installed, start Visual Studio code, you should see the following:

<img src="https://raw.githubusercontent.com/mgusmano/extjsdesigner/master/documentation/1-empty.png" alt="download" xstyle="float: left; margin-right: 10px;" />
<br>
3 - Install the Ext JS Designer Extension:

<img src="https://raw.githubusercontent.com/mgusmano/extjsdesigner/master/documentation/2-install.png" alt="download" style="float: left; margin-right: 10px;" />
<br>
4 - After the extension is installed, a dialog will appear, click 'Create' button:

<img src="https://raw.githubusercontent.com/mgusmano/extjsdesigner/master/documentation/3-rundialog.png" alt="download" style="float: left; margin-right: 10px;" />
<br>
5 - After button is pressed, a sample project will be loaded:

<img src="https://raw.githubusercontent.com/mgusmano/extjsdesigner/master/documentation/4-clickonthisfirst.png" alt="download" style="float: left; margin-right: 10px;" />
<br>
6 - Click on any 'View' file:

<img src="https://raw.githubusercontent.com/mgusmano/extjsdesigner/master/documentation/5-designer.png" alt="download" style="float: left; margin-right: 10px;" />


# in this Hackathon entry, the following are enabled:

<ul style="font-size:18px;">
<li>Modern Toolkit
<li>Views created from the 'Ext JS Designer test project'
<li>Ext JS project files ending in View.js (like SimpleView.js)
<li>Sencha cmd generated app view (specifically app/view/main/list.js) (see below)
<li>Open Tooling app View Packages (see below)
</ul>

<div style="margin-top:20px;font-size:18px;">
Key Features implemented in the Ext JS Designer VSCode Extension:
</div>

<ul style="font-size:18px;">
<li>Built as VSCode Custom editor Extension
<li>Can integrate with current Sencha VSCode Plugin
<li>Use of AST (NO metadata!!) - see https://astexplorer.net/
<li>Modular design (folder structure, Web Components)
<li>Sencha ExtWebComponents and Custom Web Components for UI elements
<li>Uses Ext JS Documentation output (DOXI) for properties, methods, events and integrated documentation
</ul>

<div style="margin-top:20px;font-size:18px;">
In the Design Editor
</div>

<ul style="font-size:18px;">
<li>Re-arrange design and code panes
<li>Hover over design pane to identify components
<li>Select a component in design view to show context areas
<li>Context editing of selected components in design pane
<li>Visual Drag and Drop of Ext JS Components onto design pane
<li>Property editing
</ul>

<div style="margin-top:20px;font-size:18px;">
Using Sencha tools to generate a starter application
</div>

<ul style="font-size:18px;">
<li>Sencha cmd generated app view (specifically app/view/main/list.js)
<ul>
<li>sencha generate app --ext -modern moderncmd ./moderncmd
<li>open /app/view/main/list.js
</ul>
<li>Open Tooling app View Packages
<ul>
<li>ext-gen app -a -t moderndesktop -n ModernApp
<li>open app/desktop/src/view/personnel/Prrsonnel.js
</ul>
</ul>
