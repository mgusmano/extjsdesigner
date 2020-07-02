document.addEventListener("classchange", (event) => {
    document.getElementById("initialconfigs").classname = event.detail.classname;
});

document.addEventListener("configupdate", (event) => {
    vscode.postMessage({
        command: "propertyUpdate",
        data: {
            configName: event.detail.configName,
            configValue: event.detail.configValue,
        },
    });
});

document.addEventListener("configadd", (event) => {
    vscode.postMessage({
        command: "propertyAdd",
        data: {
            configName: event.detail.configName,
            configValue: event.detail.configValue,
        },
    });
});

document.addEventListener("configdelete", (event) => {
    vscode.postMessage({
        command: "propertyDelete",
        data: { configName: event.detail.configName },
    });
});

document.addEventListener("resizeeditor", (event) => {
    //var t = window.extjsdesigner.monacoeditor.getModel().getValue()
    if (window.extjsdesigner.monacoeditor != undefined) {
        window.extjsdesigner.monacoeditor.dispose();
    }

    var s = getComputedStyle(document.documentElement)

  //var x = getComputedStyle(document.documentElement).getPropertyValue('--vscode-editor-background');
    monaco.editor.defineTheme("myTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [{ background: s.getPropertyValue('--vscode-editor-background') }],
        colors: {
            "editor.foreground": "#000000",
            "editor.background": s.getPropertyValue('--vscode-editor-background'),
            "editorCursor.foreground": "#8B0000",
            "editor.lineHighlightBackground": "#0000FF20",
            "editorLineNumber.foreground": "#008800",
            "editor.selectionBackground": "#88000030",
            "editor.inactiveSelectionBackground": "#88000015",
        },
    });

    monaco.editor.defineTheme("myCustomTheme", {
        base: "vs-dark", // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            {
                token: "comment",
                foreground: "ffa500",
                fontStyle: "italic underline",
            },
            { token: "comment.js", foreground: "008800", fontStyle: "bold" },
            { token: "comment.css", foreground: "0000ff" }, // will inherit fontStyle from `comment` above
        ],
    });

    window.extjsdesigner.monacoeditor = monaco.editor.create(
        document.getElementById("editor"),
        {
            //value: document.getElementById('monacoeditornotes').innerHTML,
            value: event.detail.text,
            language: "javascript",
            theme: "myTheme",
        }
    );
});
