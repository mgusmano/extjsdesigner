function setData(rootId) {
    var o = Ext.getCmp(rootId);
    window.o = o;
    var c = Ext.getClass(o);

    window.extjsdesigner.classname = c.$className;
    document.getElementById("classname").innerHTML = c.$className;

    document.dispatchEvent(
        new CustomEvent("classchange", {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: {
                classname: c.$className,
            },
        })
    );

    var extend = c.superclass.$className;
    var xtype = o.xtype;
    var classes = [];
    var configs = [];
    getSuper2(c.$config.superCfg, classes, configs, extend, xtype);
    //console.log(classes);
    //console.log(configs);
    //document.getElementById('classes').data = classes;
    //document.getElementById('configs').data = configs;

    var initialconfigs = getInitialConfigs(c);

    var o = { configName: "xtype", value1: xtype, set: "yes" };
    initialconfigs.push(o);
    var o2 = { configName: "extend", value1: extend, set: "yes" };
    initialconfigs.push(o2);

    var count = 0;
    initialconfigs.forEach((config) => {
        config.id = count;
        count++;
        const found = window.docs.find(
            (element) => element.configName == config.configName
        );
        //console.log(found)
        if (found != undefined) {
            //console.log(found.type)
            found.type == undefined ? "" : found.type;
            //console.log(found.type)
            config.type = found.type;
            found.num == undefined ? 0 : found.num;
            config.num = found.num;
            found.typesObject == undefined ? [] : found.typesObject;
            config.typesObject = found.typesObject;
        } else {
            config.type = "unknown";
            config.num = 1;
            config.types = "unknown";
            config.typesObject = ["unknown"];
        }
    });

    initialconfigs.sort((a, b) =>
        a.configName > b.configName ? 1 : b.configName > a.configName ? -1 : 0
    );
    document.getElementById("initialconfigs").data = initialconfigs;
}

function stringify(o, root) {
    if (o === null || o === undefined || o === true || o === false) {
        return o;
    }
    if (typeof o == "string" || typeof o == "number") {
        if (root != false) {
            return o;
        }
    }
    if (typeof o !== "object" || Array.isArray(o)) {
        return JSON.stringify(o);
    }
    let props = Object.keys(o)
        .map((key) => `${key}: ${stringify(o[key], false)}`)
        .join(", ");
    return `{${props}}`;
}

function getSuper2(superCfg, classes, configs, classLevel, extend, xtype) {
    if (classLevel == undefined) {
        classLevel = 0;
    } else {
        classLevel++;
    }
    var className = superCfg.cls.$className;
    //console.log(className)
    //console.log(superCfg)
    var xtype = superCfg.cls.xtype;
    classes.push({ name: className });
    var docs;
    try {
        docs = getDocs(xtype);
        if (xtype != undefined) {
            var xtypeItem = {
                configName: "xtype",
                type: "string",
                num: 1,
                types: "string",
                typesObject: ["string"],
            };
            docs.push(xtypeItem);
            var extendItem = {
                configName: "extend",
                type: "string",
                num: 1,
                types: "string",
                typesObject: ["string"],
            };
            docs.push(extendItem);
            window.docs = docs;
        }
    } catch (e) {
        console.log("not found " + xtype);
        docs = [];
    }

    var o;
    var found;
    var seq = 1;
    var sortable;
    //console.log(className + ' - superCfg.values: ' + Object.keys(superCfg.values).length)
    //console.dir(superCfg.values)
    sortable = [];
    for (var configName in superCfg.values) {
        if (superCfg.values.hasOwnProperty(configName)) {
            sortable.push({
                configName: configName,
                configValue: superCfg.values[configName],
            });
        }
    }
    function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const configNameA = a.configName.toUpperCase();
        const configNameB = b.configName.toUpperCase();

        let comparison = 0;
        if (configNameA > configNameB) {
            comparison = 1;
        } else if (configNameA < configName) {
            comparison = -1;
        }
        return comparison;
    }
    sortable.sort(compare);

    //console.dir('sortable')
    //console.dir(sortable)

    for (var config in sortable) {
        found = docs.find(function (element) {
            return element.configName == sortable[config].configName;
        });
        if (found == undefined) {
            //console.log(sortable[config].configName + ' is missing')
            continue;
        }

        o = {};
        o.seq = seq;
        seq++;
        o.configName = sortable[config].configName;

        // found = docs.find(function(element) {
        //     return element.configName == sortable[config].configName;
        // });
        // if (found == undefined) {
        //     console.log(sortable[config].configName + ' is missing')
        //     o.type = '**not found**';
        //     o.numTypes = null;
        //     o.types = null
        // }
        // else {
        o.type = found.type;
        o.numTypes = found.num;
        o.types = found.types;
        //}

        o.initialValue = stringify(sortable[config].configValue);
        o.className = className;
        o.classLevel = classLevel;
        o.xtype = xtype;

        configs.push(o);
    }

    if (superCfg.superCfg != null) {
        getSuper2(superCfg.superCfg, classes, configs, classLevel);
    }
}

function getDocs(xtype) {
    var docs = [];
    if (xtype == undefined) {
        return docs;
    }
    var Xtype = xtype.charAt(0).toUpperCase() + xtype.slice(1);
    var componentClass = eval("Ext" + Xtype + "Def");

    var o = {};
    for (var property in componentClass.properties) {
        var prop = componentClass.properties[property];
        //console.log('propertyName: ' + property + ' propertyType: ' +  prop[0] + ' numberOfTypes: ' + prop.length + '  allTypes: ' +  prop.toString())
        o = {};
        o.configName = property;

        if (prop.indexOf("enum") > -1) {
            o.type = "enum";
        } else if (prop.indexOf("string") > -1) {
            o.type = "string";
        } else {
            o.type = prop[0];
        }

        o.num = prop.length;
        o.types = prop.toString();
        o.typesObject = prop;
        docs.push(o);
    }
    return docs;
}

function getInitialConfigs(c) {
    var initialconfigs = [];
    for (var property in c.$config.values) {
        var set = "no";
        if (c.$config.values.hasOwnProperty(property)) {
            set = "yes";
        }
        var value = "";
        if (c.$config.values[property] != undefined) {
            if (typeof c.$config.values[property] == "string") {
                value = c.$config.values[property];
            } else {
                try {
                    value = JSON.stringify(c.$config.values[property]);
                } catch (e) {
                    value = "";
                }
            }
        }

        o = { configName: property, value1: value, set: set };
        initialconfigs.push(o);
    }
    return initialconfigs;
}

function getSuper(c, zz, supers, allconfigs, initialconfigs, ultimate, obj) {
    //configurators.push({className: c.$className, configurator: configurator,  configuratorconfigs: configurator.configs})
    for (var configName in c.$config.configs) {
        if (c.$config.configs.hasOwnProperty(configName)) {
            var getter =
                "get" +
                configName.charAt(0).toUpperCase() +
                configName.slice(1);
            var value = "N/A";
            var write = false;
            try {
                var getterString = c[getter].toString();
                if (!getterString.includes("is a write-only config.")) {
                    //if (o[getter]() != undefined) {
                    write = true;
                    value = o[getter]();
                    //}
                }
            } catch (e) {
                // console.log('error...')
                // console.dir(e)
                // console.dir(c)
            }

            var type = "placeholder"; //obj.properties['type']

            // var types = obj.properties[name]
            // var type
            // if (types != null) {
            //     type = types[0].toString()
            // }
            // else {
            //     type = "undefined"
            // }
            //allconfigs.push({configName: configName, className: c.$className, value: value, write: write, types: types, type: type})
            allconfigs.push({
                configName: configName,
                className: c.$className,
                value2: "",
                type: type,
            });
        }
    }

    //supers.push({name: c.$className, configs: theConfigs})
    supers.push({ name: c.$className });

    if (c.superclass != undefined) {
        getSuper(
            c.superclass,
            c.$config.superCfg,
            supers,
            allconfigs,
            initialconfigs,
            ultimate,
            obj
        );
    } else {
        allconfigs.sort((a, b) =>
            a.configName > b.configName
                ? 1
                : b.configName > a.configName
                ? -1
                : 0
        );
        // console.log('allconfigs')
        // console.dir(allconfigs)
        //use it
        //setTimeout(function() {
        // console.log(initialconfigs.length)
        // console.log(allconfigs.length)

        //ultimate = [];
        var i;
        if (initialconfigs.length == 0) {
            console.log("allconfigs");
            console.log(allconfigs);
            ultimate = allconfigs;
            //ultimate.push(allconfigs)
        } else {
            for (i = 0; i < initialconfigs.length; i++) {
                //console.log(initialconfigs[i])
                let obj = allconfigs.find(
                    (o) => o.configName === initialconfigs[i].configName
                );
                //console.log(obj)
                const object3 = { ...obj, ...initialconfigs[i] };
                //console.log(object3)
                ultimate.push(object3);
            }
        }

        //allconfigs = [];
        //initialconfigs = [];

        //                }, 3000);
        //var allconfigsDOM = document.getElementById('allconfigs');
        //allconfigsDOM.data = ultimate;

        //window.dispatchEvent(new CustomEvent('configsEvent', {detail:{configs:allconfigs}}));
        //window.dispatchEvent(new CustomEvent('supersEvent', {detail:{supers:supers, configs:configs}}));
    }
}
