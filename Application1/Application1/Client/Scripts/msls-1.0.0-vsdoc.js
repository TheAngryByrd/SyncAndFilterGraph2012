/*!
  Microsoft LightSwitch JavaScript Library v1.0.0 (for VS intellisense)
  Copyright (C) Microsoft Corporation. All rights reserved.
*/

/// <reference path="winjs-1.0.js" />
/// <reference path="jquery-1.7.1.js" />
/// <reference path="datajs-1.0.0.js" />
/// <reference path="jquery.mobile-1.1.1.js" />

(function (window, undefined) {

"use strict";

var Object = window.Object,
    WinJS = window.WinJS,
    jQuery = window.jQuery, $ = jQuery,
    msls = Object.create({});

(function () {

    var isLibrary = !window.msls;

    function isPrimitivePrototype(o) {
        return (
            o === Array.prototype ||
            o === Boolean.prototype ||
            o === Date.prototype ||
            o === Error.prototype ||
            o === Function.prototype ||
            o === Number.prototype ||
            o === Object.prototype ||
            o === RegExp.prototype ||
            o === String.prototype
        );
    }

    function getPropertyDescriptor(o, p) {
        var descriptor;
        while (o && !isPrimitivePrototype(o)) {
            descriptor = Object.getOwnPropertyDescriptor(o, p);
            if (descriptor) {
                break;
            }
            o = Object.getPrototypeOf(o);
        }
        return descriptor;
    }

    function logMessage(msg) {
        intellisense.logMessage(msg);
    }

    function handleStatementCompletion(e) {
        var targetName = e.targetName, target = e.target,
            applyFiltering = (isLibrary &&
               (!!targetName || target) && targetName !== "this"),
            useParent = (target === null || target === undefined);
        try {
            e.items = e.items.filter(function (item) {
                var object = !useParent ?
                        target : item.parentObject,
                    itemName = item.name,
                    descriptor = getPropertyDescriptor(object, itemName);
                
                if (applyFiltering) {
                    if (itemName === "constructor") {
                        return false;
                    }
                    if (itemName.charCodeAt(0) === /*_*/95) {
                        return false;
                    }
                    if (!isPrimitivePrototype(object.prototype) &&
                        !!descriptor && !descriptor.enumerable) {
                        return false;
                    }
                }

                var isObjectEnum = (object._$kind === "enum");
                if (isObjectEnum) {
                    if (!Object.hasOwnProperty.call(object, itemName)) {
                        return false;
                    }
                }

                var value = !descriptor.get ? item.value : null;
                if (value !== undefined && value !== null) {
                    if (value._$kind === "namespace") {
                        item.glyph = "vs:GlyphGroupNamespace";
                    } else if (value._$kind === "class") {
                        item.glyph = "vs:GlyphGroupClass";
                    } else if (value._$kind === "enum") {
                        item.glyph = "vs:GlyphGroupEnum";
                    }
                }
                if (!!descriptor && !!descriptor.get) {
                    item.glyph = "vs:GlyphGroupProperty";
                }
                if (object["_$field$" + itemName + "$kind"] === "event") {
                    item.kind = "property";
                    item.glyph = "vs:GlyphGroupEvent";
                }
                if (isObjectEnum) {
                    item.glyph = "vs:GlyphGroupEnumMember";
                }

                return true;
            });
        } catch (ex) {
            logMessage("statementcompletion: ERROR: " + ex.message);
        }
    }

    if (!!window.intellisense) {
        intellisense.addEventListener(
            "statementcompletion", handleStatementCompletion);
    }

    Object.getPrototypeOf(msls)._$kind = "namespace";

}());

var msls_isLibrary,
    msls_rootUri,
    msls_isFunction,
    msls_setProperty,
    msls_expose;

(function () {

    var objectToString = Object.prototype.toString,
        externalRoot = Object.getPrototypeOf(msls) !==
            Object.prototype ? Object.getPrototypeOf(msls) : null;

    msls_isLibrary = !window.msls;

    var wLoc = window.location;
    var wLocNoQueryString = wLoc.protocol + "//" + wLoc.host + wLoc.pathname;
    msls_rootUri = wLocNoQueryString.substring(0, wLocNoQueryString.lastIndexOf("/"));

    msls_isFunction =
    function isFunction(o) {
        return !!o && objectToString.call(o) === "[object Function]";
    };

    msls_setProperty =
    function setProperty(o, name, value) {
        if (name.charCodeAt(0) !== /*_*/95) {
            o[name] = value;
        } else if (!Object.prototype.hasOwnProperty.call(o, name)) {
            Object.defineProperty(o, name, {
                configurable: true, enumerable: !msls_isLibrary,
                writable: true, value: value
            });
        } else {
            o[name] = value;
        }
    };

    msls_expose =
    function expose(name, o) {
        if (externalRoot) {
            msls_setProperty(externalRoot, name, o);
            if (window.intellisense) {
                if (o && o._$savedDef) {
                    intellisense.annotate(externalRoot, o._$savedDef);
                }
            }
        }
    };

}());

var msls_mark,
    msls_codeMarkers;

(function () {

    var isEnabled = false,
        logKey = "msls_codeMarkerLog";

    function getUrlParameter(url, parameterName) {
        var pattern = "[\\?&]" + parameterName + "=([^&#]*)";
        var regularExpression = new RegExp(pattern);
        var results = regularExpression.exec(url);
        return results ? results[1] : null;
    }

    if (!!window.localStorage) {
        if (!!window.location) {
            isEnabled = !!getUrlParameter(
                window.location.href, "EnableCodeMarker");
        }
        if (isEnabled) {
            window.localStorage.removeItem(logKey);
        }
    }

    msls_mark =
    function mark(codeMarker) {

        if (!isEnabled) {
            return;
        }

        var now = new Date(),
            logMessage = "Marker: [JavaScript] " + codeMarker + "#0!" +
                (now.getMonth() + 1).toString() + "/" +
                now.getDate().toString() + "/" +
                now.getFullYear().toString() + " " +
                now.getHours().toString() + ":" +
                now.getMinutes().toString() + ":" +
                (now.getSeconds() + now.getMilliseconds() / 1000).toString();

        var currentLog = window.localStorage.getItem(logKey);
        if (!currentLog) {
            currentLog = logMessage;
        } else {
            currentLog += "\n" + logMessage;
        }
        window.localStorage.setItem(logKey, currentLog);
    };

    msls_codeMarkers = {

        applicationRun: "Application.Run",

        dispatchStart: "DispatchOperationCodeQueue.Start",
        dispatchEnd: "DispatchOperationCodeQueue.End",

        loadResourcesStart: "LoadResources.Start",
        loadResourcesEnd: "LoadResources.End",

        loadModelStart: "LoadModel.Start",
        loadModelEnd: "LoadModel.End",
        parseModelStart: "ParseModel.Start",
        parseModelEnd: "ParseModel.End",
        processModelStart: "ProcessModel.Start",
        processModelEnd: "ProcessModel.End",

        queryDataStart: "QueryData.Start",
        queryDataEnd: "QueryData.End",
        queryDataApplyEnd: "QueryData.ApplyEnd",
        saveDataStart: "SaveData.Start",
        saveDataEnd: "SaveData.End",

        loadScreenStart: "LoadScreen.Start",
        loadScreenEnd: "LoadScreen.End",
        navigationStart: "Navigation.Start",
        navigationEnd: "Navigation.End",

        transitionStart: "Transition.Start",
        transition_Stage1Start: "Transition_Stage1.Start",
        transition_Stage2Start: "Transition_Stage2.Start",
        transition_Stage3Start: "Transition_Stage3.Start",
        transition_CleanupStart: "Transition_Cleanup.Start",
        transitionEnd: "Transition.End",

        fillCollectionStart: "FillCollection.Start",
        fillCollectionEnd: "FillCollection.End",

        controlViewCreating: "ControlViewCreating",
        controlViewCreated: "ControlViewCreated",

        listViewLoadStart: "ListViewLoad.Start",
        listViewLoadDataLoaded: "ListViewLoad.DataLoaded",
        listViewLoadApplyEnd: "ListViewLoad.ApplyEnd",
        listViewLoadLoadMore: "ListViewLoad.LoadMore",
        listViewLoadEnd: "ListViewLoad.End",

        listItemClicked: "ItemClicked",

        modalViewShowStart: "ModalViewShow.Start",
        modalViewShowEnd: "ModalViewShow.End",
        modalViewCloseStart: "ModalViewClose.Start",
        modalViewCloseEnd: "ModalViewClose.End"
    };

}());

var msls_dispatch;

(function () {

    var actions = [],
        dispatching = false;

    function doDispatch() {
        dispatching = true;
        try {
            while (actions.length) {
                actions.shift()();
            }
        } finally {
            dispatching = false;
        }
    }

    msls_dispatch =
    function dispatch(action) {

        actions.push(action);
        if (actions.length === 1 && !dispatching) {
            setTimeout(doDispatch, 0);
        }
    };

}());

var msls_dataProperty,
    msls_accessorProperty,
    msls_addToInternalNamespace,
    msls_defineClass,
    msls_mixIntoExistingClass,
    msls_defineEnum,
    msls_isEnumValueDefined;
var msls_intellisense_addTypeNameResolver,
    msls_intellisense_setTypeProvider;

(function () {

    var typeNameResolvers = [];

    msls_dataProperty =
    function dataProperty(value) {
        if (value && typeof (value) === "object" &&
            ("value" in value || "get" in value)) {
            value = { value: value };
        }
        return value;
    };

    msls_accessorProperty =
    function accessorProperty(get, set) {
        return { get: get, set: set };
    };

    function processMembers(members) {
        if (!members) {
            return {};
        }
        var standardMembers = {},
            keys = Object.keys(members), key, member;
        for (var i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            member = members[key];
            if (!member || typeof (member) !== "object" ||
                !("value" in member || "get" in member ||
                msls_isFunction(member.defineOn))) {
                standardMembers[key] = member;
            } else {
                if (member.configurable === undefined) {
                    member.configurable = true;
                }
                if (!msls_isLibrary) {
                    member.enumerable = true;
                }
                if (!member.get && member.writable === undefined) {
                    member.writable = true;
                }
                if (!msls_isFunction(member.defineOn)) {
                    standardMembers[key] = member;
                } else {
                    if (member.enumerable === undefined) {
                        member.enumerable = key.charCodeAt(0) !== /*_*/95;
                    }
                }
            }
        }
        return standardMembers;
    }

    function defineExtendedMembers(o, members) {
        if (!members) {
            return;
        }
        var keys = Object.keys(members), key, member;
        for (var i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            member = members[key];
            if (member && typeof (member) === "object" &&
                msls_isFunction(member.defineOn)) {
                member.defineOn(o, key);
            }
        }
    }

    function addToNamespaceCore(parent, path, members) {
        if (window.intellisense) {
            var current = parent, fragments = path.split(".");
            for (var i = 0, len = fragments.length; i < len; i++) {
                var fragment = fragments[i];
                if (!current[fragment]) {
                    Object.defineProperty(current, fragment, {
                        configurable: true, enumerable: true,
                        writable: false, value: {}
                    });
                    current[fragment]._$kind = "namespace";
                }
                current = current[fragment];
            }
        }
        var standardMembers = processMembers(members),
            ns = WinJS.Namespace.defineWithParent(
                parent, path, standardMembers);
        defineExtendedMembers(ns, members);
        return ns;
    }

    msls_addToInternalNamespace =
    function addToInternalNamespace(path, members) {
        if (!path) {
            return addToNamespaceCore({ msls: msls }, "msls", members);
        } else {
            return addToNamespaceCore(msls, path, members);
        }
    };

    msls_defineClass =
    function defineClass(parent, className,
        constructor, baseClass, instanceMembers, staticMembers) {
        var standardInstanceMembers = processMembers(instanceMembers),
            standardStaticMembers = processMembers(staticMembers);
        if (!baseClass) {
            WinJS.Class.define(constructor,
                standardInstanceMembers, standardStaticMembers);
        } else {
            WinJS.Class.derive(baseClass, constructor,
                standardInstanceMembers, standardStaticMembers);
        }
        defineExtendedMembers(constructor.prototype, instanceMembers);
        defineExtendedMembers(constructor, staticMembers);
        if (window.intellisense) {
            constructor._$kind = "class";
        }
        if (className) {
            var namespaceContent = {};
            namespaceContent[className] = constructor;
            if (!parent || typeof (parent) === "string") {
                msls_addToInternalNamespace(parent, namespaceContent);
            } else {
                addToNamespaceCore({ _: parent }, "_", namespaceContent);
            }
        }
        return constructor;
    };

    msls_mixIntoExistingClass = function mixIntoExistingClass(constructor) {
        var standardArguments = [constructor], i, len;
        for (i = 1, len = arguments.length; i < len; i++) {
            standardArguments.push(processMembers(arguments[i]));
        }
        WinJS.Class.mix.apply(null, standardArguments);
        for (i = 1, len = arguments.length; i < len; i++) {
            defineExtendedMembers(constructor.prototype, arguments[i]);
        }
    };

    msls_defineEnum =
    function defineEnum(parent, definition) {
        var enumName = Object.keys(definition)[0],
            enumeration = definition[enumName];
        if (window.intellisense) {
            enumeration._$savedDef = definition;
            enumeration._$kind = "enum";
        }
        var ns, namespaceContent = {};
        namespaceContent[enumName] = msls_dataProperty(enumeration);
        if (!parent || typeof (parent) === "string") {
            ns = msls_addToInternalNamespace(parent, namespaceContent);
        } else {
            ns = addToNamespaceCore({ _: parent }, "_", namespaceContent);
        }
        if (window.intellisense) {
            intellisense.annotate(ns, definition);
        }
        return enumeration;
    };

    msls_isEnumValueDefined =
    function isEnumValueDefined(enumeration, value) {
        if (enumeration) {
            for (var propertyName in enumeration) {
                if (enumeration[propertyName] === value) {
                    return true;
                }
            }
        }
        return false;
    };

    msls_intellisense_addTypeNameResolver =
    function addTypeNameResolver(resolver) {
        if (window.intellisense) {
            typeNameResolvers.push(resolver);
        }
    };

    msls_intellisense_addTypeNameResolver(
        function resolvePrimitiveTypeName(type) {
            var typeName;
            if (type === Array) {
                typeName = "Array";
            } else if (type === Boolean) {
                typeName = "Boolean";
            } else if (type === Date) {
                typeName = "Date";
            } else if (type === Number) {
                typeName = "Number";
            } else if (type === Object) {
                typeName = "Object";
            } else if (type === String) {
                typeName = "String";
            }
            return typeName;
        }
    );

    msls_intellisense_addTypeNameResolver(
        function resolveLibraryTypeName(type) {
            var library = window.msls, typeName;
            for (typeName in library) {
                if (library[typeName] === type) {
                    return "msls." + typeName;
                }
            }
            return null;
        }
    );

    function resolveTypeName(type) {
        var typeName;
        if (window.intellisense) {
            for (var i = 0, len = typeNameResolvers.length; i < len; i++) {
                typeName = typeNameResolvers[i](type);
                if (typeName) {
                    break;
                }
            }
        }
        return typeName;
    }

    msls_intellisense_setTypeProvider =
    function setTypeProvider(proto, name, provider) {
        if (!window.intellisense) {
            return;
        }
        var descriptor = Object.getOwnPropertyDescriptor(proto, name),
            getCore = descriptor ? descriptor.get : null;
        if (getCore) {
            descriptor.get = function () {
                /// <returns type="Object" />
                var result = getCore.call(this), type;
                if (result === null ||
                    result === undefined ||
                    result._$isExceptionObject) {
                    type = provider(this);
                    if (type) {
                        result = new type();
                    }
                }
                return result;
            };
            Object.defineProperty(proto, name, descriptor);
        }
        intellisense.addEventListener("statementcompletionhint", function (e) {
            var item = e.completionItem,
                parentObject = item.parentObject;
            if (parentObject instanceof proto.constructor &&
                item.name === name) {
                var type = provider(parentObject), typeName;
                if (type && (typeName = resolveTypeName(type))) {
                    e.symbolHelp.symbolType = typeName;
                    e.symbolHelp.symbolDisplayType = typeName;
                }
            }
        });
    };

    msls_expose("_addToNamespace", function addToNamespace(path, members) {
        /// <summary>
        /// Adds a set of members to a namespace.
        /// </summary>
        /// <param name="path" type="String">
        /// A dot-delimited string representing a namespace.
        /// </param>
        /// <param name="members" type="Object">
        /// An object that provides property values or property descriptors.
        /// </param>
        var ns = addToNamespaceCore(window, path, members);
        if (window.intellisense && path === "msls.application") {
            ns = (function () {
                /// <returns>
                /// Represents the active LightSwitch application.
                /// </returns>
                return ns;
            }());
        }
        return ns;
    });

}());

var msls_event,
    msls_intellisense_setEventDetailType,
    msls_dispatchEventOverride;

(function () {

    var winJSUtilities = WinJS.Utilities;

    function defineEventOn(target, eventName) {
        var descriptor = this,
            eventMixin = winJSUtilities.eventMixin;
        if (!target.addEventListener) {
            target.addEventListener = eventMixin.addEventListener;
            if (window.intellisense) {
                target.addEventListener =
                    function (type, listener) {
                        /// <summary>
                        /// Adds an event listener.
                        /// </summary>
                        /// <param name="type" type="String">
                        /// The type (name) of the event.
                        /// </param>
                        /// <param name="listener" type="Function">
                        /// A function to invoke when the event is raised.
                        /// <br/>Signature: listener(eventArgs)
                        /// </param>
                        var me = this;
                        eventMixin.addEventListener.apply(me, arguments);
                        setTimeout(function () {
                            var detail = me["_$event$" + type + "$detailType"];
                            if (detail) {
                                detail = new detail();
                            }
                            me.dispatchEvent(type, detail);
                        }, 0);
                    };
            }
        }
        if (!target.dispatchEvent) {
            Object.defineProperty(target, "dispatchEvent", {
                configurable: true, enumerable: !msls_isLibrary,
                writable: true, value: eventMixin.dispatchEvent
            });
            if (window.intellisense) {
                intellisense.annotate(target.dispatchEvent,
                    function (type, details) {
                        /// <summary>
                        /// Raises an event of a specific type,
                        /// optionally with additional details.
                        /// </summary>
                        /// <param name="type" type="String">
                        /// The type (name) of the event.
                        /// </param>
                        /// <param name="details" optional="true">
                        /// An object that is included as the "detail"
                        /// property on the raised event object.
                        /// </param>
                    }
                );
            }
        }
        if (!target.removeEventListener) {
            target.removeEventListener = eventMixin.removeEventListener;
            if (window.intellisense) {
                intellisense.annotate(target.removeEventListener,
                    function (type, listener) {
                        /// <summary>
                        /// Removes an event listener.
                        /// </summary>
                        /// <param name="type" type="String">
                        /// The type (name) of the event.
                        /// </param>
                        /// <param name="listener" type="Function">
                        /// The event listener that should be removed.
                        /// <br/>Signature: listener(eventArgs)
                        /// </param>
                    }
                );
            }
        }
        if (!descriptor.noProperty) {
            Object.defineProperties(target,
                winJSUtilities.createEventProperties(eventName));
            if (window.intellisense) {
                target["_$field$on" + eventName + "$kind"] = "event";
            }
        }
    }

    msls_event =
    function createEvent(noProperty) {
        return { noProperty: noProperty, defineOn: defineEventOn };
    };

    msls_intellisense_setEventDetailType =
    function setEventDetailType(target, type, detailType) {
        if (window.intellisense) {
            target["_$event$" + type + "$detailType"] = detailType;
        }
    };


    function defineDispatchEventOverrideOn(target, propertyName) {
        var descriptor = this,
            baseDispatchEvent = target.dispatchEvent,
            derivedDispatchEvent = descriptor.value;
        Object.defineProperty(target, propertyName, {
            configurable: true, enumerable: !msls_isLibrary,
            writable: true, value: function dispatchEvent(type, details) {
                return derivedDispatchEvent.call(
                    this, type, details, baseDispatchEvent);
            }
        });
        if (window.intellisense) {
            intellisense.annotate(target.dispatchEvent, baseDispatchEvent);
        }
    }

    msls_dispatchEventOverride =
    function dispatchEventOverride(dispatchEvent) {
        return {
            value: dispatchEvent,
            defineOn: defineDispatchEventOverrideOn
        };
    };

}());

var msls_subscribe,
    msls_unsubscribe,
    msls_subscribeOnce,
    msls_notify;

(function () {

    var notifications = new (WinJS.Class.mix(null, WinJS.Utilities.eventMixin))();

    msls_subscribe =
    function subscribe(type, listener) {
        notifications.addEventListener(type, listener);
    };

    msls_unsubscribe =
    function unsubscribe(type, listener) {
        notifications.removeEventListener(type, listener);
    };

    msls_subscribeOnce =
    function subscribeOnce(type, listener) {
        function onNotify() {
            msls_unsubscribe(type, onNotify);
            listener.apply(this, arguments);
        }
        msls_subscribe(type, onNotify);
    };

    msls_notify =
    function notify(type, details) {
        notifications.dispatchEvent(type, details);
    };

    if (!!window.msls || window.__mslsTestMode) {
        msls_expose("subscribe", msls_subscribe);
        msls_expose("unsubscribe", msls_unsubscribe);
    }

}());

var msls_getValues;

(function () {

    msls_getValues =
    function getValues(o) {
        return Object.keys(o).map(function (key) {
            return o[key];
        });
    };

}());

var msls_Sequence,
    msls_iterate;

(function () {

    msls_defineClass(msls, "Sequence", function Sequence() {
        /// <summary>
        /// Represents a sequence.
        /// </summary>
        /// <field name="array" type="Array">
        /// Gets an array that represents this sequence.
        /// </field>
    }, null, {
        array: msls_accessorProperty(
            function array_get() {
                /// <returns type="Array" />
                var array = [];
                this.each(function () {
                    array.push(this);
                });
                return array;
            }
        ),
        each: function each(callback) {
            /// <summary>
            /// Iterates this sequence and invokes a callback for each item.
            /// </summary>
            /// <param name="callback" type="Function">
            /// A callback function whose "this" value and single parameter
            /// are set to the current item.<br/>The function can optionally
            /// return false to terminate the current iteration loop.
            /// <br/>Signature: [Boolean] item.callback(item)
            /// </param>
            var iterator = this._iterator ? this._iterator() : null, item;
            if (iterator) {
                while (iterator.next()) {
                    item = iterator.item();
                    if (callback.call(item, item) === false) {
                        break;
                    }
                }
            }
        }
    });
    msls_Sequence = msls.Sequence;

    msls_defineClass(msls_Sequence, "Array", function Sequence_Array(array) {
        /// <summary>
        /// Represents a sequence over an array.
        /// </summary>
        /// <param name="array" type="Array">
        /// An array.
        /// </param>
        msls_Sequence.call(this);
        msls_setProperty(this, "_array", array);
    }, msls_Sequence, {
        _iterator: function iterator() {
            return new ArrayIterator(this._array);
        }
    });
    function ArrayIterator(array) {
        this._array = array;
        this._length = array.length;
        this._index = -1;
    }
    ArrayIterator.prototype.next = function next() {
        return ++this._index < this._length;
    };
    ArrayIterator.prototype.item = function item() {
        return this._array[this._index];
    };

    msls_iterate =
    function iterate(array) {
        /// <summary>
        /// Creates a sequence over an array.
        /// </summary>
        /// <param name="array" type="Array">
        /// A source array.
        /// </param>
        /// <returns type="msls.Sequence">
        /// A sequence over an array.
        /// </returns>
        return new msls_Sequence.Array(array);
    };

    msls_expose("Sequence", msls_Sequence);
    msls_expose("iterate", msls_iterate);

}());

var msls_changeEventType = "change",
    msls_makeObservable,
    msls_observableProperty,
    msls_makeObservableProperty,
    msls_computedProperty;

(function () {

    var activeComputationStack = [],
        changesToDispatch;

    function trackAccess(o, propertyName) {
        if (activeComputationStack.length) {
            var dependentsBag = o._dependents || {},
                dependents = dependentsBag[propertyName];
            if (!dependents) {
                msls_setProperty(o, "_dependents", dependentsBag);
                dependents = dependentsBag[propertyName] = [];
            }
            dependents.push(activeComputationStack[
                activeComputationStack.length - 1]);
        }
    }

    function beginTracking(o, propertyName, version) {
        var trackingStub = o._trackingStub;
        if (!trackingStub) {
            msls_setProperty(o, "_trackingStub", trackingStub = { o: o });
        }
        activeComputationStack.push({
            trackingStub: trackingStub, name: propertyName, version: version
        });
    }

    function endTracking() {
        activeComputationStack.pop();
    }

    function invalidate(dependent) {
        var o = dependent.trackingStub.o,
            propertyName,
            computeStates,
            computeState;
        if (o) {
            propertyName = dependent.name;
            computeStates = o._computeStates;
            computeState = computeStates[propertyName];
            if (computeState.version === dependent.version) {
                computeState.isComputed = false;
                o.dispatchChange(propertyName);
            }
        }
    }

    function getChangeEventType(propertyName) {
        var eventType = msls_changeEventType;
        if (propertyName) {
            eventType = propertyName + "_" + eventType;
        }
        return eventType;
    }

    function dispatchChangeEvent(change) {
        var target = change.target, propertyName = change.propertyName;
        target.dispatchEvent(getChangeEventType(propertyName), propertyName);
        target.dispatchEvent(msls_changeEventType, propertyName);
    }

    function addChangeListener(propertyName, listener) {
        /// <summary>
        /// Adds a change event listener.
        /// </summary>
        /// <param name="propertyName" type="String" mayBeNull="true">
        /// A property name, or null for the global change event.
        /// </param>
        /// <param name="listener" type="Function">
        /// A function to invoke when the change event is raised.
        /// <br/>Signature: listener(eventArgs)
        /// </param>
        msls_intellisense_setEventDetailType(this, getChangeEventType(propertyName), String);
        this.addEventListener(getChangeEventType(propertyName), listener);
    }

    function dispatchChange(propertyName) {
        /// <summary>
        ///  Raises a change event for a property.
        /// </summary>
        /// <param name="propertyName" type="String">
        /// A property name.
        /// </param>
        var isInitiator = !changesToDispatch,
            dependentsBag = this._dependents,
            dependents = (dependentsBag ?
                dependentsBag[propertyName] : null),
            changes, change = {
                target: this, propertyName: propertyName
            };
        if (!!dependents && !!dependents.length) {
            if (isInitiator) {
                changesToDispatch = [];
            }
            changesToDispatch.push(change);
            dependentsBag[propertyName] = [];
            for (var i = 0, len = dependents.length; i < len; i++) {
                invalidate(dependents[i]);
            }
            if (isInitiator) {
                changes = changesToDispatch;
                changesToDispatch = null;
                for (i = 0, len = changes.length; i < len; i++) {
                    change = changes[i];
                    dispatchChangeEvent(change);
                }
            }
        } else {
            if (!isInitiator) {
                changesToDispatch.push(change);
            } else {
                dispatchChangeEvent(change);
            }
        }
    }

    function removeChangeListener(propertyName, listener) {
        /// <summary>
        /// Removes a change event listener.
        /// </summary>
        /// <param name="propertyName" type="String" mayBeNull="true">
        /// A property name, or null for the global change event.
        /// </param>
        /// <param name="listener" type="Function">
        /// The event listener that should be removed.
        /// <br/>Signature: listener(eventArgs)
        /// </param>
        this.removeEventListener(getChangeEventType(propertyName), listener);
    }

    msls_makeObservable =
    function makeObservable(constructor) {
        var prototype = constructor.prototype;
        if (!("onchange" in prototype)) {
            msls_mixIntoExistingClass(constructor, {
                change: msls_event()
            });
            msls_intellisense_setEventDetailType(prototype, "change", String);
        }
        if (!prototype.addChangeListener) {
            prototype.addChangeListener = addChangeListener;
        }
        if (!prototype.dispatchChange) {
            Object.defineProperty(prototype, "dispatchChange", {
                configurable: true, enumerable: !msls_isLibrary,
                writable: true, value: dispatchChange
            });
        }
        if (!prototype.removeChangeListener) {
            prototype.removeChangeListener = removeChangeListener;
        }
    };

    function defineObservablePropertyOn(target, propertyName) {
        var targetClass = target.constructor,
            descriptor = this, mixinContent = {},
            underlyingPropertyName, customGetter;

        msls_makeObservable(targetClass);

        mixinContent[getChangeEventType(propertyName)] = msls_event(true);
        if (!descriptor.get) {
            underlyingPropertyName = "__" + propertyName;
            if (descriptor.initialValue !== undefined) {
                mixinContent[underlyingPropertyName] = {
                    enumerable: !msls_isLibrary,
                    value: descriptor.initialValue
                };
            }
            mixinContent[propertyName] = msls_accessorProperty(
                function observableProperty_get() {
                    trackAccess(this, propertyName);
                    return this[underlyingPropertyName];
                },
                function observableProperty_set(value) {
                    if (this[underlyingPropertyName] !== value) {
                        msls_setProperty(this, underlyingPropertyName, value);
                        this.dispatchChange(propertyName);
                    }
                }
            );
        } else {
            customGetter = descriptor.get;
            mixinContent[propertyName] = msls_accessorProperty(
                function observableProperty_get() {
                    trackAccess(this, propertyName);
                    return customGetter.call(this);
                },
                descriptor.set
            );
        }
        msls_mixIntoExistingClass(targetClass, mixinContent);
    }

    msls_observableProperty =
    function observableProperty(initialValue, get, set) {
        return {
            get: get, set: set,
            initialValue: initialValue,
            defineOn: defineObservablePropertyOn
        };
    };

    msls_makeObservableProperty =
    function makeObservableProperty(descriptor) {
        descriptor.defineOn = defineObservablePropertyOn;
    };

    function defineComputedPropertyOn(target, propertyName) {
        var targetClass = target.constructor,
            descriptor = this, mixinContent = {},
            underlyingPropertyName = "__" + propertyName;
        mixinContent[propertyName] = msls_observableProperty(null,
            function computedProperty_get() {
                var me = this,
                    computeStates = me._computeStates || {},
                    computeState = computeStates[propertyName];
                if (!computeState) {
                    msls_setProperty(me, "_computeStates", computeStates);
                    computeState = computeStates[propertyName] = {
                        version: 0, isComputed: false
                    };
                }
                if (!computeState.isComputed) {
                    beginTracking(me, propertyName, ++computeState.version);
                    try {
                        msls_setProperty(me, underlyingPropertyName,
                            descriptor.compute.call(me));
                        computeState.isComputed = true;
                    } finally {
                        endTracking();
                    }
                }
                return me[underlyingPropertyName];
            },
            descriptor.set
        );
        msls_mixIntoExistingClass(targetClass, mixinContent);
    }

    msls_computedProperty =
    function computedProperty(compute, set) {
        return {
            compute: compute, set: set,
            defineOn: defineComputedPropertyOn
        };
    };

}());

var msls_addLifetimeDependency,
    msls_removeLifetimeDependency,
    msls_addAutoDisposeEventListener,
    msls_addAutoDisposeChangeListener,
    msls_addAutoDisposeNotificationListener,
    msls_isDependentObject,
    msls_dispose,
    msls_isDisposed;


(function () {

    var changeListenerRemover,
        eventListenerRemover;


    msls_addLifetimeDependency =
    function addLifetimeDependency(host, dependent) {

        var dependencies = host.__dependencies;

        if (!dependencies) {
            msls_setProperty(host, "__dependencies", dependencies = []);
        }
        dependencies.push(dependent);

        msls_setProperty(dependent, "__sponsor", host);
    };

    msls_removeLifetimeDependency =
    function removeLifetimeDependency(dependent) {
        var host = dependent.__sponsor,
            dependencies;
        if (host && !host.__disposed) {
            dependencies = host.__dependencies;
            if (Array.isArray(dependencies)) {
                for (var i = dependencies.length - 1; i >= 0; i--) {
                    if (dependencies[i] === dependent) {
                        dependencies.splice(i, 1);
                        return;
                    }
                }
            }
        }
        if (host) {
            dependent.__sponsor = null;
        }
    };

    msls_isDependentObject =
    function isDependentObject(object) {
        return !!object.__sponsor;
    };


    msls_dispose =
    function dispose(object) {
        var current = object,
            lastDispose,
            onDispose,
            dependencies,
            dependent,
            i, len;

        if (!object) {
            return;
        }


        if (object.__disposed) {
            return;
        }



        while (current) {
            onDispose = current._onDispose;
            if (!onDispose) {
                break;
            }
            if (onDispose !== lastDispose) {
                try {
                    onDispose.call(object);
                }
                catch (exception) {
                }
                lastDispose = onDispose;
            }
            current = Object.getPrototypeOf(current);
        }

        dependencies = object.__dependencies;
        if (Array.isArray(dependencies)) {
            object.__dependencies = null;
            for (i = 0, len = dependencies.length; i < len; i++) {
                dependent = dependencies[i];
                msls_dispose(dependent);
                dependent.__sponsor = null;
            }
        }

        object._listeners = null;
        object._dependents = null;

        if (object._trackingStub) {
            object._trackingStub.o = null;
            object._trackingStub = null;
        }


        msls_setProperty(object, "__disposed", true);
    };

    msls_isDisposed =
    function isDisposed(object) {
        return !!object.__disposed;
    };

    msls_defineClass(msls, "AutoDisposeEventListener",
        function AutoDisposeEventListener(source, eventName, listener) {
            var me = this;
            me.source = source;
            me.eventName = eventName;
            me.listener = listener;
        }, null, {
            _onDispose: function _onDispose() {
                var me = this,
                    source = me.source;
                if (source) {
                    source.removeEventListener(me.eventName, me.listener);
                }
                msls_removeLifetimeDependency(me);
            }
        }
    );

    msls_addAutoDisposeEventListener =
    function addAutoDisposeEventListener(source, eventName, target, listener) {

        source.addEventListener(eventName, listener);
        var result = new msls.AutoDisposeEventListener(source, eventName, listener);
        msls_addLifetimeDependency(target, result);

        return result;
    };

    msls_defineClass(msls, "AutoDisposeChangeListener",
        function AutoDisposeChangeListener(source, propertyName, listener) {
            var me = this;
            me.source = source;
            me.propertyName = propertyName;
            me.listener = listener;
        }, null, {
            _onDispose: function _onDispose() {
                var me = this,
                    source = me.source;
                if (source.removeChangeListener) {
                    source.removeChangeListener(me.propertyName, me.listener);
                }
                msls_removeLifetimeDependency(me);
            }
        }
    );

    msls_addAutoDisposeChangeListener =
    function addAutoDisposeChangeListener(source, propertyName, target, listener) {

        source.addChangeListener(propertyName, listener);

        var result = new msls.AutoDisposeChangeListener(source, propertyName, listener);
        msls_addLifetimeDependency(target, result);
        return result;
    };

    msls_defineClass(msls, "AutoDisposeNotificationListener",
        function AutoDisposeNotificationListener(notificationType, listener) {
            var me = this;
            me.notificationType = notificationType;
            me.listener = listener;
        }, null, {
            _onDispose: function _onDispose() {
                var me = this;
                msls_unsubscribe(me.notificationType, me.listener);
                msls_removeLifetimeDependency(me);
            }
        }
    );

    msls_addAutoDisposeNotificationListener =
    function addAutoDisposeNotificationListener(notificationType, target, listener) {

        msls_subscribe(notificationType, listener);

        var result = new msls.AutoDisposeNotificationListener(notificationType, listener);
        msls_addLifetimeDependency(target, result);
        return result;
    };

}());

var msls_promiseOperation;

(function () {

    var operationCodeQueue = [],
        operationCodeQueueSuspended = 0,
        operationCodeQueueProcessing,
        ambientOperationStack = [];

    function queueOperationCode(operationCode) {
        operationCodeQueue.push(operationCode);
        if (operationCodeQueue.length === 1 &&
            !operationCodeQueueSuspended &&
            !operationCodeQueueProcessing) {
            msls_dispatch(processOperationCodeQueue);
        }
    }

    function processOperationCodeQueue() {
        msls_mark(msls_codeMarkers.dispatchStart);
        operationCodeQueueProcessing = true;
        while (operationCodeQueue.length) {
            operationCodeQueue.shift()();
            if (operationCodeQueueSuspended) {
                break;
            }
        }
        operationCodeQueueProcessing = false;
        msls_mark(msls_codeMarkers.dispatchEnd);
    }

    function pushAmbientOperation(operation, addNestedOperation) {
        ambientOperationStack.push([operation, addNestedOperation]);
    }

    function ambientOperation() {
        var len = ambientOperationStack.length;
        return len ? ambientOperationStack[len - 1][0] : null;
    }

    function registerNestedOperation(nestedOperation) {
        var len = ambientOperationStack.length,
            addNestedOperation = ambientOperationStack[len - 1][1];
        addNestedOperation(nestedOperation);
    }

    function popAmbientOperation() {
        ambientOperationStack.pop();
    }

    function suspendOperationCodeQueue() {
        operationCodeQueueSuspended++;
    }

    function resumeOperationCodeQueue() {
        operationCodeQueueSuspended--;
        if (!operationCodeQueueSuspended &&
            operationCodeQueue.length > 0 &&
            !operationCodeQueueProcessing) {
            msls_dispatch(processOperationCodeQueue);
        }
    }

    msls_promiseOperation = function promiseOperation(init, independent) {
        /// <summary>
        /// Initiates a new operation and returns a promise object.
        /// </summary>
        /// <param name="init" type="Function">
        /// A function that initiates the operation.
        /// <br/>Signature: init(operation)
        /// </param>
        /// <param name="independent" type="Boolean" optional="true">
        /// Specifies that the new operation should run independent of any
        /// ambient operation, that is, the ambient operation will not be
        /// registered as dependent on the newly initiated operation.
        /// </param>
        /// <returns>
        /// An object that promises to complete the
        /// operation at some point in the future.
        /// </returns>
        var operation,
            currentAmbientOperation = ambientOperation(),
            shouldBeNested = !!currentAmbientOperation && !independent,
            myOperationCodeQueue = [], myOperationCodeRunning = 0,
            nestedOperations = [], pendingInterleave = false,
            promiseObject, reportError, reportComplete, promiseCleanup;

        function operationSequenced() {
            return !myOperationCodeQueue;
        }

        function addNestedOperation(nestedOperation) {
            if (nestedOperations) {
                nestedOperations.push(nestedOperation);
            } else {
                nestedOperation.sequence();
            }
        }

        function sequenceOperation() {
            if (!operationSequenced()) {
                var queue = myOperationCodeQueue;
                myOperationCodeQueue = null;
                while (nestedOperations.length) {
                    nestedOperations.shift().sequence();
                }
                nestedOperations = null;
                while (queue.length) {
                    queue.shift()();
                }
                suspendOperationCodeQueue();
            }
        }

        if (shouldBeNested) {
            registerNestedOperation({
                sequence: sequenceOperation
            });
        }

        function makeOperationCode(code, immediate, rethrow) {
            if (!code) { return code; }
            return function operationCode() {
                var me = this, args = Array.prototype.slice.call(arguments, 0);
                function operationCodeCore(rethrowErrors) {
                    var error, result;
                    pushAmbientOperation(operation, addNestedOperation);
                    myOperationCodeRunning++;
                    try {
                        result = code.apply(me, args);
                    } catch (e) {
                        if (!rethrowErrors) {
                            operation.error(e);
                        } else {
                            error = e;
                        }
                    } finally {
                        myOperationCodeRunning--;
                        popAmbientOperation();
                    }
                    if (pendingInterleave) {
                        pendingInterleave = false;
                    } else {
                        sequenceOperation();
                    }
                    if (error) {
                        throw error;
                    }
                    return result;
                }
                if (!immediate && !operationSequenced() &&
                    !myOperationCodeRunning) {
                    myOperationCodeQueue.push(operationCodeCore);
                    queueOperationCode(function queuedOperationCode() {
                        if (!operationSequenced()) {
                            myOperationCodeQueue.shift()();
                        }
                    });
                    return null;
                } else {
                    return operationCodeCore(rethrow);
                }
            };
        }

        function endOperation(error, result) {
            if (!reportError && !reportComplete) {
                return;
            }
            if (ambientOperation() !== operation) {
                makeOperationCode(function endOperationCode() {
                    endOperation(error, result);
                })();
                return;
            }
            try {
                if (error) {
                    reportError(error);
                } else {
                    reportComplete(result);
                }
            } finally {
                reportError = reportComplete = null;
            }
        }

        operation = {
            promise: function promise() {
                /// <summary>
                /// Gets the promise object for this operation.
                /// </summary>
                return promiseObject;
            },
            code: function code(operationCode, rethrowErrors) {
                /// <summary>
                /// Creates a function that calls the
                /// specified code as operation code.
                /// </summary>
                /// <param name="operationCode" type="Function">
                /// A function representing code
                /// to be called as operation code.
                /// <br/>Signature: operationCode()
                /// </param>
                /// <param name="rethrowErrors" type="Boolean" optional="true">
                /// Indicates if thrown errors should be propagated to calling
                /// code instead of being set as the error for this operation.
                /// This is relevant for ambient or sequenced operations only.
                /// </param>
                return makeOperationCode(operationCode, null, rethrowErrors);
            },
            interleave: function interleave() {
                /// <summary>
                /// Specifies that after completing this operation's current
                /// code block, the application-wide operation code queue can
                /// continue processing unrelated operation code. The calling
                /// code recognizes that any future operation code of its own
                /// may be called after arbitrary state changes have occurred.
                /// </summary>
                if (ambientOperation() === operation) {
                    pendingInterleave = true;
                }
            },
            error: function error(value) {
                /// <summary>
                /// Ends this operation with an error value.
                /// </summary>
                /// <param name="value">
                /// An error value.
                /// </param>
                endOperation(value, null);
            },
            complete: function complete(value) {
                /// <summary>
                /// Ends this operation sucessfully with an optional value.
                /// </summary>
                /// <param name="value" optional="true">
                /// A value.
                /// </param>
                endOperation(null, value);
            }
        };

        promiseObject = Object.create(WinJS.Promise.prototype);
        msls_setProperty(promiseObject, "_sequence", sequenceOperation);
        promiseCleanup = promiseObject._cleanupAction;
        msls_setProperty(promiseObject, "_cleanupAction", function () {
            promiseCleanup.call(this);
            var resume = operationSequenced();
            myOperationCodeQueue = null;
            nestedOperations = null;
            if (resume) {
                resumeOperationCodeQueue();
            }
        });
        WinJS.Promise.call(promiseObject, function initialize(c, e) {
            if (!init) {
                c();
            } else {
                reportError = e; reportComplete = c;
                makeOperationCode(init, shouldBeNested)
                    .call(operation, operation);
            }
        });

        return promiseObject;
    };

    function promiseThen(creator, thenPromise) {
        var sequence = creator._sequence;
        if (msls_isFunction(sequence)) {
            msls_setProperty(thenPromise, "_sequence", sequence);
            if (!!ambientOperation()) {
                registerNestedOperation({
                    sequence: sequence
                });
            }
        }
        return thenPromise;
    }

    function extendPromise(promise) {
        var proto = Object.getPrototypeOf(promise);

        if (proto._thenEx) {
            return;
        }

        if (window.intellisense) {
            WinJS.Class.mix(proto.constructor, {
                _$annotate: function (errorType, resultType) {
                    this._$errorType = errorType;
                    this._$resultType = resultType;
                }
            });
        }

        function invokeOrQueueCallbacks(promiseObject, c, e) {
            var errorType = promiseObject._$errorType || Object,
                resultType = promiseObject._$resultType;
            function invokeCallbacks() {
                if (c && resultType) {
                    c(new resultType());
                }
                if (e) {
                    e(new errorType());
                }
            }
            if (window.intellisense) {
                if (promiseObject._done === WinJS.Promise.prototype._done &&
                    promiseObject._then === WinJS.Promise.prototype._then) {
                    setTimeout(invokeCallbacks, 0);
                } else {
                    invokeCallbacks();
                }
            }
        }

        WinJS.Class.mix(proto.constructor, {
            done: function done(c, e, p) {
                var currentAmbientOperation = ambientOperation();
                if (currentAmbientOperation) {
                    c = currentAmbientOperation.code(c, true);
                    e = currentAmbientOperation.code(e, true);
                    p = currentAmbientOperation.code(p, true);
                }

                if (this._done !== proto._done) {
                    this._done = proto._done;
                }

                invokeOrQueueCallbacks(this, c, e);


                this._done(c, e, p);
            },
            _done: proto.done,
            then: function then(c, e, p) {
                var currentAmbientOperation = ambientOperation();
                if (currentAmbientOperation) {
                    c = currentAmbientOperation.code(c, true);
                    e = currentAmbientOperation.code(e, true);
                    p = currentAmbientOperation.code(p, true);
                }

                if (this._then !== proto._then) {
                    this._then = proto._then;
                }

                invokeOrQueueCallbacks(this, c, e);


                return promiseThen(this, this._then(c, e, p));
            },
            _then: proto.then,
            _thenEx: function _thenEx(ce) {
                return this.then(
                    function onComplete(value) {
                        return ce(null, value);
                    },
                    function onError(value) {
                        return ce(value);
                    }
                );
            }
        });

        if (window.intellisense) {
            intellisense.annotate(proto.done, proto._done);
            intellisense.annotate(proto.then, proto._then);
        }
    }
    extendPromise(WinJS.Promise.prototype);
    extendPromise(WinJS.Promise.wrapError(null));
    extendPromise(WinJS.Promise.wrap(null));

    msls_expose("promiseOperation", msls_promiseOperation);

}());

(function () {

    var _WhereSequence;

    msls_defineClass(msls, "WhereSequence", function WhereSequence(source, predicate) {
        msls_Sequence.call(this);
        msls_setProperty(this, "_source", source);
        msls_setProperty(this, "_predicate", predicate);
    }, msls_Sequence, {
        _iterator: function iterator() {
            return new WhereIterator(this);
        }
    });
    _WhereSequence = msls.WhereSequence;
    function WhereIterator(source) {
        this._iterator = source._source._iterator();
        this._predicate = source._predicate;
    }
    WhereIterator.prototype.next = function next() {
        var iterator = this._iterator,
            predicate = this._predicate, item;
        while (iterator.next()) {
            item = iterator.item();
            if (predicate.call(item, item)) {
                return true;
            }
        }
        return false;
    };
    WhereIterator.prototype.item = function item() {
        return this._iterator.item();
    };

    msls_mixIntoExistingClass(msls_Sequence, {
        all: function all(predicate) {
            /// <summary>
            /// Determines whether this sequence only
            /// contains items that satisfy a condition.
            /// </summary>
            /// <param name="predicate" type="Function">
            /// A function to test each item for a condition.
            /// <br/>Signature: Boolean item.predicate(item)
            /// </param>
            /// <returns type="Boolean">
            /// True if this sequence only contains items
            /// that satisfy the condition; otherwise, false.
            /// </returns>
            return !this.any(function (item) {
                return !predicate.call(item, item);
            });
        },
        any: function any(predicate) {
            /// <summary>
            /// Determines whether this sequence contains any
            /// items that optionally satisfy a condition.
            /// </summary>
            /// <param name="predicate" type="Function" optional="true">
            /// A function to test each item for a condition.
            /// <br/>Signature: Boolean item.predicate(item)
            /// </param>
            /// <returns type="Boolean">
            /// True if this sequence contains any items that
            /// satisfy the condition, if any; otherwise, false.
            /// </returns>
            var result = false;
            this.each(function (item) {
                if (!predicate || predicate.call(item, item)) {
                    result = true;
                    return false;
                }
                return true;
            });
            return result;
        },
        first: function first(predicate) {
            /// <summary>
            /// Gets the first item in this sequence
            /// that optionally satisfies a condition.
            /// </summary>
            /// <param name="predicate" type="Function" optional="true">
            /// A function to test each item for a condition.
            /// <br/>Signature: Boolean item.predicate(item)
            /// </param>
            /// <returns>
            /// The first item in this sequence that satisfies
            /// the condition, if any; otherwise, undefined.
            /// </returns>
            var result;
            this.each(function (item) {
                if (!predicate || predicate.call(item, item)) {
                    result = item;
                    return false;
                }
                return true;
            });
            return result;
        },
        sum: function sum(predicate) {
            /// <summary>
            /// Gets a sum over the items in this sequence.
            /// </summary>
            /// <param name="predicate" type="Function" optional="true">
            /// A function that returns a number for each item.
            /// <br/>Signature: Number item.predicate(item)
            /// </param>
            /// <returns type="Number">
            /// The sum over the items in this sequence.
            /// </returns>
            var result = 0;
            this.each(function (item) {
                result += (!predicate ? item : predicate.call(item, item));
            });
            return result;
        },
        where: function where(predicate) {
            /// <summary>
            /// Filters this sequence based on a predicate.
            /// </summary>
            /// <param name="predicate" type="Function">
            /// A function to test each item for a condition.
            /// <br/>Signature: Boolean item.predicate(item)
            /// </param>
            /// <returns type="msls.Sequence">
            /// A new sequence that is filtered based on the predicate.
            /// </returns>
            if (window.intellisense) {
                var me = this;
                setTimeout(function () {
                    me.each(predicate);
                }, 0);
            }
            return new _WhereSequence(this, predicate);
        }
    });

}());

var msls_stringFormat;

(function () {

    var replaceRE = /\{(\d+)\}/g;

    msls_stringFormat = function stringFormat(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(replaceRE,
            function (s, p) { return args[p]; });
    };

}());

var msls_resourcesReady,
    msls_getResourceString;

(function () {

    var prerequisiteResources,
        defaultPrerequisiteResources,
        shouldLoad,
        resources = {},
        defaultResources = {},
        readyPromise;

    function getPrerequisiteResources(key) {
        var r = window[key];
        if (!r) {
            r = {};
        } else {
            window[key] = null;
            shouldLoad = true;
        }
        return r;
    }

    prerequisiteResources = getPrerequisiteResources(
        "__msls_prerequisiteResources");
    defaultPrerequisiteResources = getPrerequisiteResources(
        "__msls_defaultPrerequisiteResources");

    msls_mark(msls_codeMarkers.loadResourcesStart);
    readyPromise = new WinJS.Promise(function (complete, error) {
        var loading = 0,
            errorMessage = "";

        function loadResources(relativeUri, callback) {
            var uri = msls_rootUri + "/" + relativeUri;
            $.ajax({
                url: uri,
                dataType: "text",
                error: function (request, reason, e) {
                    errorOccurred(msls_getResourceString(
                        "resources_failed_server_1args", reason + " - " + (e || "")));

                    loadCompleted();
                },
                success: function (result) {
                    try {
                        result = $.parseJSON(result);
                        if (!(result instanceof Object)) {
                            throw msls_getResourceString(
                                "resources_invalid_json");
                        }
                        callback(result);
                        
                    } catch (e) {
                        errorOccurred(msls_getResourceString(
                            "resources_failed_parse_1args", (e || "")));
                    }
                    finally {
                        loadCompleted();
                    }
                }
            });
            loading++;

            function errorOccurred(reason) {
                errorMessage += msls_getResourceString(
                    "resources_failed_2args", uri, reason) + "\n";
            }

            function loadCompleted() {
                loading--;
                if (!loading) {
                    msls_mark(msls_codeMarkers.loadResourcesEnd);
                    if (errorMessage) {
                        error(errorMessage);
                    } else {
                        complete();
                    }
                }
            }
        }

        if (shouldLoad) {
            loadResources("Content/Resources/msls.resources.json", function (r) {
                resources = r;
            });
            loadResources("Content/Resources/msls.default.resources.json", function (r) {
                defaultResources = r;
            });
        } else {
            msls_mark(msls_codeMarkers.loadResourcesEnd);
            complete();
        }
    });

    msls_resourcesReady =
    function resourcesReady() {
        return readyPromise;
    };

    msls_getResourceString = function getResourceString(key) {

        var s = key,
            found = true,
            args;

        if (key in resources) {
            s = resources[key];
        } else if (key in prerequisiteResources) {
            s = prerequisiteResources[key];
        } else if (key in defaultResources) {
            s = defaultResources[key];
        } else if (key in defaultPrerequisiteResources) {
            s = defaultPrerequisiteResources[key];
        } else {
            found = false;
        }

        if (found && arguments.length > 1) {
            args = Array.prototype.slice.call(arguments, 0);
            args[0] = s;
            s = msls_stringFormat.apply(null, args);
        }

        return s;
    };

}());

var msls_throw,
    msls_throwError,
    msls_throwInvalidOperationError,
    msls_throwArgumentError,
    msls_throwIfFalsy;

(function () {

    msls_throw =
    function throwObject(error, properties) {
        if (!error.message) {
            error.message = msls_getResourceString("errors_core");
        }
        if ("description" in error) {
            error.description = error.message;
        }
        if (properties) {
            $.extend(error, properties);
        }
        throw error;
    };

    msls_throwError =
    function throwError(name, message, properties) {
        var error = new Error();
        if (name) {
            error.name = name;
        }
        if (message) {
            error.message = message;
        }
        msls_throw(error, properties);
    };

    msls_throwInvalidOperationError =
    function throwInvalidOperationError(message, properties) {
        if (!message) {
            message = msls_getResourceString("errors_invalid_operation");
        }
        msls_throwError("InvalidOperationError", message, properties);
    };

    msls_throwArgumentError =
    function throwArgumentError(message, argument, argumentName, properties) {
        if (!message) {
            message = msls_getResourceString("errors_argument");
        }
        msls_throwError("ArgumentError", message, $.extend(properties, {
            argumentName: argumentName,
            argumentValue: argument
        }));
    };

    msls_throwIfFalsy =
    function throwIfFalsy(argument, argumentName) {
        if (!argument) {
            var message;
            if (argumentName) {
                message = msls_getResourceString("errors_falsy_1args", argumentName);
            } else {
                message = msls_getResourceString("errors_falsy");
            }
            msls_throwArgumentError(message, argument, argumentName);
        }
    };

}());

var


    msls_builtIn_rootCustomControl = ":RootCustomControl",

    

    msls_builtIn_disabledRenderingProperty = "disabledRendering",
    msls_builtIn_hiddenIfDisabledProperty = "hiddenIfDisabled",
    msls_builtIn_readOnlyRenderingProperty = "readOnlyRendering",
    msls_builtIn_validationRenderingProperty = "validationRendering";



var builtInModule = {
    binaryId: ":Binary",
    binaryTypeName: "Binary",
    blackThemeId: ":Black",
    blackThemeVersion: "1",
    booleanId: ":Boolean",
    booleanTypeName: "Boolean",
    builtInAttributeQualifiedToken: ":@",
    builtInModuleQualifiedToken: ":",
    byteId: ":Byte",
    byteTypeName: "Byte",
    controlButtonId: ":Button",
    controlCheckBoxId: ":CheckBox",
    controlCollectionButtonId: ":CollectionButton",
    controlCollectionControlSupportingExportId: ":CollectionControlSupportingExport",
    controlCollectionCustomContentControlId: ":CollectionCustomContentControl",
    controlColumnsLayoutId: ":ColumnsLayout",
    controlConcurrencyVersionChooserId: ":ConcurrencyVersionChooser",
    controlDataGridId: ":DataGrid",
    controlDataGridRowCommandsId: ":DataGridRowCommands",
    controlDataGridRowId: ":DataGridRow",
    controlDatePickerId: ":DatePicker",
    controlDateTimePickerId: ":DateTimePicker",
    controlDateTimeViewerBaseId: ":DateTimeViewerBase",
    controlDateTimeViewerId: ":DateTimeViewer",
    controlDateViewerBaseId: ":DateViewerBase",
    controlDateViewerId: ":DateViewer",
    controlDetailsAutoCompleteBoxId: ":DetailsAutoCompleteBox",
    controlDetailsCustomContentControlId: ":DetailsCustomContentControl",
    controlLabeledGroupId: ":LabeledGroup",
    controlTextId: ":Text",
    controlLinkId: ":Link",
    controlListId: ":List",
    controlModalWindowId: ":ModalWindow",
    controlModalWindowPickerDetailsId: ":ModalWindowPickerDetails",
    controlModalWindowPickerValueId: ":ModalWindowPickerValue",
    controlNoViewId: ":NoControl",
    controlNoViewName: "NoControl",
    controlPictureAndTextId: ":PictureAndText",
    controlPropertyAttachedLabelPositionId: ":RootControl/Properties[AttachedLabelPosition]",
    controlPropertyAttachedLabelPositionName: "AttachedLabelPosition",
    controlPropertyAttachedLabelPositionQualifiedName: ":RootControl/AttachedLabelPosition",
    controlPropertyAutoCompleteBoxFilterModeName: "AutoCompleteBoxFilterMode",
    controlPropertyBrowseOnlyId: ":RootControl/Properties[BrowseOnly]",
    controlPropertyBrowseOnlyName: "BrowseOnly",
    controlPropertyBrowseOnlyQualifiedName: ":RootControl/BrowseOnly",
    controlPropertyContainerStateId: ":RootControl/Properties[ContainerState]",
    controlPropertyContainerStateName: "ContainerState",
    controlPropertyContainerStateQualifiedName: ":RootControl/ContainerState",
    controlPropertyControlSizingOptionId: ":RootCustomContentControl/Properties[ControlSizingOption]",
    controlPropertyControlSizingOptionName: "ControlSizingOption",
    controlPropertyControlSizingOptionQualifiedName: ":RootCustomContentControl/ControlSizingOption",
    controlPropertyCustomContentControlTypeId: ":RootCustomContentControl/Properties[CustomControl]",
    controlPropertyCustomContentControlTypeQualifiedName: ":RootCustomContentControl/CustomControl",
    controlPropertyCustomControlName: "CustomControl",
    controlPropertyDetailsAutoCompleteBoxFilterModeId: ":DetailsAutoCompleteBox/Properties[AutoCompleteBoxFilterMode]",
    controlPropertyDetailsAutoCompleteBoxFilterModeQualifiedName: ":DetailsAutoCompleteBox/AutoCompleteBoxFilterMode",
    controlPropertyDialogPagesDialogTypeName: "dialogType",
    controlPropertyFontStyleId: ":RootControl/Properties[FontStyle]",
    controlPropertyFontStyleName: "FontStyle",
    controlPropertyFontStyleQualifiedName: ":RootControl/FontStyle",
    controlPropertyHeightId: ":RootControl/Properties[Height]",
    controlPropertyHeightName: "Height",
    controlPropertyHeightQualifiedName: ":RootControl/Height",
    controlPropertyHeightSizingModeId: ":RootControl/Properties[HeightSizingMode]",
    controlPropertyHeightSizingModeName: "HeightSizingMode",
    controlPropertyHeightSizingModeQualifiedName: ":RootControl/HeightSizingMode",
    controlPropertyHiddenIfDisabledId: ":RootCommand/Properties[HiddenIfDisabled]",
    controlPropertyHiddenIfDisabledName: "HiddenIfDisabled",
    controlPropertyHiddenIfDisabledQualifiedName: ":RootCommand/HiddenIfDisabled",
    controlPropertyHideExportButtonId: ":CollectionControlSupportingExport/Properties[HideExportButton]",
    controlPropertyHideExportButtonName: "HideExportButton",
    controlPropertyHideExportButtonQualifiedName: ":CollectionControlSupportingExport/HideExportButton",
    controlPropertyHideTabTitlesName: "hideTabTitles",
    controlPropertyHorizontalAlignmentId: ":RootControl/Properties[HorizontalAlignment]",
    controlPropertyHorizontalAlignmentName: "HorizontalAlignment",
    controlPropertyHorizontalAlignmentQualifiedName: ":RootControl/HorizontalAlignment",
    controlPropertyImageId: ":RootControl/Properties[Image]",
    controlPropertyImageName: "Image",
    controlPropertyImageQualifiedName: ":RootControl/Image",
    controlPropertyIsColumnResizableId: ":ColumnsLayout/Properties[IsColumnResizable]",
    controlPropertyIsColumnResizableName: "IsColumnResizable",
    controlPropertyIsColumnResizableQualifiedName: ":ColumnsLayout/IsColumnResizable",
    controlPropertyIsEnabledId: ":RootControl/Properties[IsEnabled]",
    controlPropertyIsEnabledName: "IsEnabled",
    controlPropertyIsEnabledQualifiedName: ":RootControl/IsEnabled",
    controlPropertyIsReadOnlyId: ":RootControl/Properties[IsReadOnly]",
    controlPropertyIsReadOnlyName: "IsReadOnly",
    controlPropertyIsReadOnlyQualifiedName: ":RootControl/IsReadOnly",
    controlPropertyIsRowResizableId: ":RowsLayout/Properties[IsRowResizable]",
    controlPropertyIsRowResizableName: "IsRowResizable",
    controlPropertyIsRowResizableQualifiedName: ":RowsLayout/IsRowResizable",
    controlPropertyItemTapName: "itemTap",
    controlPropertyLinesId: ":TextBox/Properties[Lines]",
    controlPropertyLinesName: "Lines",
    controlPropertyLongDateId: ":DateViewerBase/Properties[LongDate]",
    controlPropertyLongDateName: "LongDate",
    controlPropertyLongDateQualifiedName: ":DateViewerBase/LongDate",
    controlPropertyMaxHeightId: ":RootControl/Properties[MaxHeight]",
    controlPropertyMaxHeightName: "MaxHeight",
    controlPropertyMaxHeightQualifiedName: ":RootControl/MaxHeight",
    controlPropertyMaxLabelWidthId: ":LabeledGroup/Properties[MaxLabelWidth]",
    controlPropertyMaxLabelWidthName: "MaxLabelWidth",
    controlPropertyMaxLabelWidthQualifiedName: ":LabeledGroup/MaxLabelWidth",
    controlPropertyMaxWidthId: ":RootControl/Properties[MaxWidth]",
    controlPropertyMaxWidthName: "MaxWidth",
    controlPropertyMaxWidthQualifiedName: ":RootControl/MaxWidth",
    controlPropertyMinHeightId: ":RootControl/Properties[MinHeight]",
    controlPropertyMinHeightName: "MinHeight",
    controlPropertyMinHeightQualifiedName: ":RootControl/MinHeight",
    controlPropertyMinWidthId: ":RootControl/Properties[MinWidth]",
    controlPropertyMinWidthName: "MinWidth",
    controlPropertyMinWidthQualifiedName: ":RootControl/MinWidth",
    controlPropertyCompactMarginsName: "compactMargins",
    controlPropertyRowSpanId: ":TableColumnLayout/Properties[RowSpan]",
    controlPropertyRowSpanName: "RowSpan",
    controlPropertyRowSpanQualifiedName: ":TableColumnLayout/RowSpan",
    controlPropertyShowArrows: "showArrows",
    controlPropertyShowAsLinkId: ":RootControl/Properties[ShowAsLink]",
    controlPropertyShowAsLinkName: "ShowAsLink",
    controlPropertyShowAsLinkQualifiedName: ":RootControl/ShowAsLink",
    controlPropertyShowCheckBoxLabelId: ":CheckBox/Properties[ShowCheckBoxLabel]",
    controlPropertyShowCheckBoxLabelName: "ShowCheckBoxLabel",
    controlPropertyShowCheckBoxLabelQualifiedName: ":CheckBox/ShowCheckBoxLabel",
    controlPropertyShowDateId: ":DateTimeViewerBase/Properties[ShowDate]",
    controlPropertyShowDateName: "ShowDate",
    controlPropertyShowDateQualifiedName: ":DateTimeViewerBase/ShowDate",
    controlPropertyShowHeaderName: "showHeader",
    controlPropertyShowSaveButtonName: "showSaveButton",
    controlPropertyShowSmallImageId: ":ShellButton/Properties[ShowSmallImage]",
    controlPropertyShowSmallImageName: "ShowSmallImage",
    controlPropertyShowSmallImageQualifiedName: ":ShellButton/ShowSmallImage",
    controlPropertyShowTimeId: ":DateTimeViewerBase/Properties[ShowTime]",
    controlPropertyShowTimeName: "ShowTime",
    controlPropertyShowTimeQualifiedName: ":DateTimeViewerBase/ShowTime",
    controlPropertyShowVirtualRowId: ":DataGrid/Properties[ShowVirtualRow]",
    controlPropertyShowVirtualRowName: "ShowVirtualRow",
    controlPropertyShowVirtualRowQualifiedName: ":DataGrid/ShowVirtualRow",
    controlPropertyTapName: "tap",
    controlPropertyTextAlignmentId: ":RootControl/Properties[TextAlignment]",
    controlPropertyTextAlignmentName: "TextAlignment",
    controlPropertyTextAlignmentQualifiedName: ":RootControl/TextAlignment",
    controlPropertyTextBoxLinesQualifiedName: ":TextBox/Lines",
    controlPropertyValueAutoCompleteBoxFilterModeId: ":ValueAutoCompleteBox/Properties[AutoCompleteBoxFilterMode]",
    controlPropertyValueAutoCompleteBoxFilterModeQualifiedName: ":ValueAutoCompleteBox/AutoCompleteBoxFilterMode",
    controlPropertyWeightedColumnWidthId: ":ColumnsLayout/Properties[WeightedColumnWidth]",
    controlPropertyWeightedColumnWidthName: "WeightedColumnWidth",
    controlPropertyWeightedColumnWidthQualifiedName: ":ColumnsLayout/WeightedColumnWidth",
    controlPropertyWeightedRowHeightId: ":RowsLayout/Properties[WeightedRowHeight]",
    controlPropertyWeightedRowHeightName: "WeightedRowHeight",
    controlPropertyWeightedRowHeightQualifiedName: ":RowsLayout/WeightedRowHeight",
    controlPropertyWidthId: ":RootControl/Properties[Width]",
    controlPropertyWidthName: "Width",
    controlPropertyWidthQualifiedName: ":RootControl/Width",
    controlPropertyWidthSizingModeId: ":RootControl/Properties[WidthSizingMode]",
    controlPropertyWidthSizingModeName: "WidthSizingMode",
    controlPropertyWidthSizingModeQualifiedName: ":RootControl/WidthSizingMode",
    controlPropertyDisableScrollbarsName: "disableScrollbars",
    controlRootControlId: ":RootControl",
    controlRootCustomContentControlId: ":RootCustomContentControl",
    controlRootGroupId: ":RootGroup",
    controlRowsLayoutId: ":RowsLayout",
    controlScreenCustomContentControlId: ":ScreenCustomContentControl",
    controlScreenId: ":Screen",
    controlScrollableControlId: ":ScrollableControl",
    controlShellButtonId: ":ShellButton",
    controlSummaryId: ":Summary",
    controlTableColumnLayoutId: ":TableColumnLayout",
    controlTableLayoutId: ":TableLayout",
    controlTabsId: ":TabsLayout",
    controlTextAndPictureId: ":TextAndPicture",
    controlTextBoxId: ":TextBox",
    controlValueAutoCompleteBoxId: ":ValueAutoCompleteBox",
    controlValueCustomContentControlId: ":ValueCustomContentControl",
    controlValueDropdownId: ":ValueDropdown",
    dateId: ":Date",
    dateTimeId: ":DateTime",
    dateTimeTypeName: "DateTime",
    dateTypeName: "Date",
    decimalId: ":Decimal",
    decimalTypeName: "Decimal",
    defaultShellId: ":Standard",
    defaultThemeId: ":Blue",
    defaultThemeVersion: "1",
    doubleId: ":Double",
    doubleTypeName: "Double",
    guidId: ":Guid",
    guidTypeName: "Guid",
    id: ":!module",
    int16Id: ":Int16",
    int16TypeName: "Int16",
    int32Id: ":Int32",
    int32TypeName: "Int32",
    int64Id: ":Int64",
    int64TypeName: "Int64",
    name: "Microsoft.LightSwitch",
    placeholderNameConcurrencyVersionChooserCurrentValue: "CurrentValue",
    placeholderNameConcurrencyVersionChooserLocalValue: "LocalValue",
    placeholderNameConcurrencyVersionChooserServerValue: "ServerValue",
    sByteId: ":SByte",
    sByteTypeName: "SByte",
    screenCloseMethodId: "/Methods[Close]",
    screenCloseMethodName: "Close",
    screenCommandShowNamePrefix: "ScreenCommandShow",
    screenMethodShowNamePrefix: "Show",
    screenRefreshMethodId: "/Methods[Refresh]",
    screenRefreshMethodName: "Refresh",
    screenSaveMethodId: "/Methods[Save]",
    screenSaveMethodName: "Save",
    singleId: ":Single",
    singleTypeName: "Single",
    stringId: ":String",
    stringTypeName: "String",
    timeSpanId: ":TimeSpan",
    timeSpanTypeName: "TimeSpan",
    visualCollectionAddAndEditNewMethodName: "addAndEditNew",
    visualCollectionAddNewMethodName: "addNew",
    visualCollectionDeleteSelectedMethodName: "deleteSelected",
    visualCollectionEditSelectedMethodName: "editSelected",
    visualCollectionRefreshMethodName: "refresh",
    visualCollectionRemoveSelectedMethodName: "removeSelected",
    visualCollectionSelectedItemPropertyName: "selectedItem"
};

(function () {

    msls_defineClass(msls, "ModelService", function ModelService() {
        this.isLoaded = false;
        msls_setProperty(this, "_itemDictionary", {});
    }, null, {
        load: function load() {
            var me = this;

            if (this._loadPromise) {
                return this._loadPromise;
            }

            msls_mark(msls_codeMarkers.loadModelStart);

            msls_setProperty(this, "_loadPromise", new WinJS.Promise(
                function initLoad(complete, error) {
                    function reportModelLoadError(request, reason, e) {
                        msls_mark(msls_codeMarkers.loadModelEnd);
                        error(msls_getResourceString(
                            "model_failed_server_1args", reason + " - " + (e || "")));
                    }

                    function parseAndProcessModel(result) {
                        msls_mark(msls_codeMarkers.loadModelEnd);
                        msls_mark(msls_codeMarkers.parseModelStart);
                        try {
                            result = $.parseJSON(result);
                            if (!(result instanceof Object)) {
                                throw msls_getResourceString(
                                    "model_invalid_json");
                            }
                            me.model = result;

                        } catch (e) {
                            error(msls_getResourceString(
                                "model_failed_parse_1args", (e || "")));
                            return;
                        }
                        msls_mark(msls_codeMarkers.parseModelEnd);
                        msls_mark(msls_codeMarkers.processModelStart);
                        try {
                            me._registerModelItem(me.model, true);
                            me._resolveReferenceProperties(me.model, true);
                        } catch (e) {
                            error(e);
                            return;
                        }
                        msls_mark(msls_codeMarkers.processModelEnd);
                        me.isLoaded = true;
                        complete(me.model);
                    }

                    $.ajax({
                        url: msls_rootUri + "/Content/Resources/Generated/model.json",
                        cache: false,
                        dataType: "text",
                        error: reportModelLoadError,
                        success: parseAndProcessModel
                    });
                }
            ));

            return this._loadPromise;
        },
        tryLookupById: function tryLookupById(modelId) {
            var item;
            if (modelId) {
                item = this._itemDictionary[modelId];
                if (item) {
                    return item;
                }
            }
            return null;
        },
        _registerModelItem: function _registerModelItem(item, recursive) {
            var propertyName;
            if (item && item.id) {
                this._itemDictionary[item.id] = item;
            }
            if (recursive) {
                if (item && (item instanceof Object)) {
                    for (propertyName in item) {
                        this._registerModelItem(item[propertyName], recursive);
                    }
                }
            }
        },
        _resolveReferenceProperties: function _resolveReferenceProperties(item, recursive) {
            var propertyName,
                value,
                referenceId;

            if (item && (item instanceof Object)) {
                for (propertyName in item) {
                    value = item[propertyName];
                    if ((value instanceof Object) && "__id" in value) {
                        referenceId = value.__id;
                        if ((item[propertyName] = this.tryLookupById(referenceId)) === null) {
                            throwModelError(msls_getResourceString("model_reference_error_1args", referenceId));
                        }
                    } else if (recursive) {
                        this._resolveReferenceProperties(value, recursive);
                    }
                }
            }
        }

    });

    function throwModelError(message) {
        msls_throwError("ModelError", message);
    }

    msls_addToInternalNamespace("services", {
        modelService: new msls.ModelService()
    });

}());

var msls_getAttribute,
    msls_getAttributes,
    msls_getApplicationDefinition,
    msls_getControlForPropertyDefinition,
    msls_getProgrammaticName,
    msls_getCssClassName,
    msls_findModelItem,
    msls_findGlobalItems,
    msls_isCallExpression,
    msls_isChainExpression,
    msls_isConstantExpression,
    msls_isMemberExpression,
    msls_isControlDefinition,
    msls_isPrimitiveType,
    msls_isEntityContainer,
    msls_isNullableType,
    msls_isSemanticType,
    msls_isScreenDefinition,
    msls_isEntityType,
    msls_isCountlessEntityType,
    msls_isKeyProperty,
    msls_isApplicationDefinition,
    msls_isGroupControl;

(function () {

    msls_getAttribute =
    function getAttribute(item, classId) {

        var att = null,
            s = null;
        if (item) {
            att = item[classId];
            if (att) {
                if ($.isArray(att)) {
                    if (att.length > 0) {
                        s = att[0];
                    }
                } else {
                    s = att;
                }
            }
        }
        return s;
    };

    msls_getAttributes =
    function getAttributes(item, classId) {

        var att = null,
            m = null;
        if (item) {
            att = item[classId];
            if (att) {
                if ($.isArray(att)) {
                    m = att;
                } else {
                    m = [att];
                }
            }
        }
        return m;
    };

    msls_getApplicationDefinition =
    function getApplicationDefinition() {
        var applicationDefinition = null,
            modelService = msls.services.modelService,
            model = modelService.model;
        if (modelService.isLoaded && !!model && !!model.modules) {
            applicationDefinition = msls_iterate(model.modules).first(function (module) {
                return msls_isApplicationDefinition(module);
            });
        }
        return applicationDefinition;
    };

    msls_findModelItem = function findModelItem(itemCollection, programmaticName, predicate) {
        var modelItem = null;
        if (!!itemCollection && !!programmaticName) {
            modelItem = msls_iterate(itemCollection).first(
                function (item) {
                    return ((!predicate || predicate(item)) && (item.name === programmaticName || item.name === getPossibleModelName(programmaticName)));
                });
        }
        return modelItem;
    };

    msls_getProgrammaticName = function getProgrammaticName(modelName, forceCamelCase) {
        if (forceCamelCase && modelName.length > 1) {
            modelName = modelName[0].toLowerCase() + modelName.substring(1);
        }
        return modelName;
    };

    msls_getCssClassName = function getCssClassName(identifier) {

        if (!!identifier) {
            identifier = identifier[0].toLowerCase() + identifier.substring(1);
            return identifier.replace(/([A-Z])/g, "-$1").toLowerCase();
        }
        return identifier;
    };

    function getPossibleModelName(programmaticName) {
        return programmaticName;
    }

    msls_findGlobalItems =
    function findGlobalItems(filter) {
        var items = [],
            model = msls.services.modelService.model;
        if (!!model && !!model.modules) {
            $.each(model.modules, function (index, module) {
                $.each(module.globalItems, function (index2, item) {
                    if (!filter || filter(item)) {
                        items.push(item);
                    }
                });
            });
        }

        return items;
    };

    msls_getControlForPropertyDefinition =
    function getControlForPropertyDefinition(propertyDefinition) {
        var controlId = propertyDefinition.id.replace(/\/Properties\[.*\]/, ""),
            control = msls.services.modelService.tryLookupById(controlId);
        return control;
    };

    msls_isGroupControl =
    function isGroupControl(controlDefinition) {
        return controlDefinition.supportedContentItemKind === "Group";
    };

    msls_isCallExpression =
    function isCallExpression(item) {
        return "target" in item;
    };

    msls_isChainExpression =
    function isChainExpression(item) {
        return "links" in item;
    };

    msls_isConstantExpression =
    function isConstantExpression(item) {
        return "value" in item;
    };

    msls_isMemberExpression =
    function isMemberExpression(item) {
        return "member" in item;
    };

    msls_isControlDefinition =
    function isControlDefinition(item) {
        return "supportedContentItemKind" in item;
    };

    msls_isPrimitiveType =
    function isPrimitiveType(item) {
        return "__isPrimitiveType" in item;
    };

    msls_isEntityContainer =
    function isEntityContainer(item) {
        return "entitySets" in item;
    };

    msls_isNullableType =
    function isNullableType(item) {
        return "__isNullableType" in item;
    };

    msls_isSemanticType =
    function isSemanticType(item) {
        return "__isSemanticType" in item;
    };

    msls_isScreenDefinition =
    function isScreenDefinition(item) {
        return "rootContentItem" in item;
    };

    msls_isEntityType =
    function isEntityType(item) {
        return "__isEntityType" in item;
    };

    msls_isCountlessEntityType =
    function isCountlessEntityType(entityType) {
        var pagingAttribute;
        return !!entityType &&
            !!(pagingAttribute = entityType[":@Paging"]) &&
            pagingAttribute.mode === "Countless";
    };

    msls_isKeyProperty =
    function isKeyProperty(item) {
        return "__isKeyProperty" in item;
    };

    msls_isApplicationDefinition =
    function isApplicationDefinition(item) {
        return "homeScreen" in item;
    };

}());

var msls_CollectionChangeAction,
    msls_CollectionChange;


(function () {

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies how a collection is changed.
        /// </field>
        CollectionChangeAction: {
            /// <field type="String">
            /// Specifies that the entire collection has changed.
            /// </field>
            refresh: "refresh",
            /// <field type="String">
            /// Specifies that items were added to the collection.
            /// </field>
            add: "add",
            /// <field type="String">
            /// Specifies that items were removed from the collection.
            /// </field>
            remove: "remove"
        }
    });
    msls_CollectionChangeAction = msls.CollectionChangeAction;

    msls_defineClass(msls, "CollectionChange", function CollectionChange(action, items, oldStartingIndex, newStartingIndex) {
        /// <summary>
        /// Provides data for the collection change event.
        /// </summary>
        /// <param name="action" type="String">
        /// The action (from msls.CollectionChangeAction) that caused the event.
        /// </param>
        /// <param name="items" type="Array" optional="true">
        /// The array of items affected by the action.
        /// </param>
        /// <param name="oldStartingIndex" type="Number" optional="true">
        /// The index at which the items were removed, if applicable.
        /// </param>
        /// <param name="newStartingIndex" type="Number" optional="true">
        /// The index at which the items were added, if applicable.
        /// </param>
        /// <field name="action" type="String">
        /// Gets the description of the action that caused the event.
        /// </field>
        /// <field name="items" type="Array">
        /// Gets the array of items affected by the action.
        /// </field>
        /// <field name="oldStartingIndex" type="Number">
        /// Gets the index at which the items were removed, if applicable.
        /// </field>
        /// <field name="newStartingIndex" type="Number">
        /// Gets the index at which the items were added, if applicable.
        /// </field>
        this.action = action;
        this.items = items;
        this.oldStartingIndex = oldStartingIndex;
        this.newStartingIndex = newStartingIndex;
    });

    msls_CollectionChange = msls.CollectionChange;

    msls_expose("CollectionChangeAction", msls_CollectionChangeAction);
    msls_expose("CollectionChange", msls_CollectionChange);

}());

var msls_defineClassWithDetails,
    msls_ObjectWithDetails,
    msls_ObjectWithDetails_Details,
    msls_ObjectWithDetails_Details_Property,
    msls_propertyWithDetails;

(function () {

    msls_defineClassWithDetails =
    function defineClassWithDetails(parent, className,
        constructor, detailsConstructor, baseClass, simpleMembers, detailsMembers) {
        var cls = msls_defineClass(parent, className, constructor, baseClass),
            baseCls = baseClass,
            baseDetailsCls = baseCls ? baseCls.Details : null,
            detailsCls = msls_defineClass(cls, "Details",
                detailsConstructor, baseDetailsCls),
            _PropertySet = msls_defineClass(detailsCls, "PropertySet",
                function PropertySet(details) {
                    /// <summary>
                    /// Represents a set of property objects.
                    /// </summary>
                    /// <param name="details">
                    /// The details object that owns this property set.
                    /// </param>
                    msls_setProperty(this, "_details", details);
                },
                baseCls ? baseCls.Details.PropertySet : null
            );
        msls_mixIntoExistingClass(cls, simpleMembers);
        msls_mixIntoExistingClass(detailsCls, detailsMembers);
        msls_mixIntoExistingClass(detailsCls, {
            properties: msls_accessorProperty(
                function properties_get() {
                    if (!this._properties) {
                        msls_setProperty(this, "_properties",
                            new _PropertySet(this));
                    }
                    return this._properties;
                }
            )
        });
        return cls;
    };

    msls_defineClassWithDetails(msls, "ObjectWithDetails",
        function ObjectWithDetails() {
            /// <summary>
            /// Represents an object with details.
            /// </summary>
            /// <field name="details" type="msls.ObjectWithDetails.Details">
            /// Gets the details for this object.
            /// </field>
            /// <field name="onchange" type="Function">
            /// Gets or sets a handler for the change event, which is called any
            /// time the value of an observable property on this object changes.
            /// </field>
            this.details = new this.constructor.Details(this);
        },
        function ObjectWithDetails_Details(owner) {
            /// <summary>
            /// Represents the details for an object with details.
            /// </summary>
            /// <param name="owner" type="msls.ObjectWithDetails">
            /// The object that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.ObjectWithDetails">
            /// Gets the object that owns this details object.
            /// </field>
            /// <field name="properties" type="msls.ObjectWithDetails.Details.PropertySet">
            /// Gets the set of property objects for the owner's properties.
            /// </field>
            /// <field name="onchange" type="Function">
            /// Gets or sets a handler for the change event, which is called any
            /// time the value of an observable property on this object changes.
            /// </field>
            this.owner = owner;
        },
        null,
        null,
        {
            getModel: function getModel() {
                /// <summary>
                /// Gets the model item describing the
                /// object that owns this details object.
                /// </summary>
                /// <returns type="Object">
                /// The model item describing the object
                /// that owns this details object.
                /// </returns>
                var model = this._model;
                if (!model) {
                    if (this._findModel) {
                        model = this._findModel();
                    }

                    msls_setProperty(
                        Object.getPrototypeOf(this),
                        "_model", model);
                }
                return model;
            }
        }
    );
    msls_ObjectWithDetails = msls.ObjectWithDetails;
    msls_ObjectWithDetails_Details = msls_ObjectWithDetails.Details;
    msls_intellisense_setTypeProvider(
        msls_ObjectWithDetails_Details.prototype, "owner",
        function (o) {
            return o.owner.constructor;
        }
    );

    msls_makeObservable(msls_ObjectWithDetails);
    msls_makeObservable(msls_ObjectWithDetails_Details);

    msls_mixIntoExistingClass(msls_ObjectWithDetails_Details.PropertySet, {
        all: function all() {
            /// <summary>
            /// Gets all the property objects in this set.
            /// </summary>
            /// <returns type="Array">
            /// All the property objects in this set.
            /// </returns>
            var result = [], name;
            for (name in this) {
                if (name.charCodeAt(0) === /*_*/95) {
                    continue;
                }
                if (this[name] && !msls_isFunction(this[name])) {
                    result.push(this[name]);
                }
            }
            return result;
        }
    });

    msls_defineClass(msls_ObjectWithDetails_Details, "Property",
        function ObjectWithDetails_Details_Property(details, entry) {
            /// <summary>
            /// Represents a property object.
            /// </summary>
            /// <param name="details" type="msls.ObjectWithDetails.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.ObjectWithDetails">
            /// Gets the object that owns this property.
            /// </field>
            /// <field name="name" type="String">
            /// Gets the name of this property.
            /// </field>
            /// <field name="isReadOnly" type="Boolean">
            /// Gets a value indicating if this property is read-only.
            /// </field>
            /// <field name="value" type="Object">
            /// Gets or sets the value of this property.
            /// </field>
            /// <field name="onchange" type="Function">
            /// Gets or sets a handler for the change event, which is called any
            /// time the value of an observable property on this object changes.
            /// </field>
            this.owner = details ? details.owner : null;
            msls_setProperty(this, "_details", details);
            msls_setProperty(this, "_entry", entry);
        },
        null, {
            name: msls_accessorProperty(
                function name_get() {
                    /// <returns type="String" />
                    return this._entry.name;
                }
            ),
            isReadOnly: msls_accessorProperty(
                function isReadOnly_get() {
                    /// <returns type="Boolean" />
                    return !this._entry.set;
                }
            ),
            getPropertyType: function getPropertyType() {
                /// <summary>
                /// Gets the type of this property.
                /// </summary>
                /// <returns type="Function">
                /// The type of this property.
                /// </returns>
                return this._entry.type || Object;
            },
            getModel: function getModel() {
                /// <summary>
                /// Gets the model item describing this property.
                /// </summary>
                /// <returns type="Object">
                /// The model item describing this property.
                /// </returns>
                var model = this._entry.model;
                if (!model) {
                    if (this._findModel) {
                        model = this._findModel();
                    }

                    this._entry.model = model;
                }
                return model;
            }
        }
    );
    msls_ObjectWithDetails_Details_Property =
        msls_ObjectWithDetails_Details.Property;
    msls_intellisense_setTypeProvider(
        msls_ObjectWithDetails_Details_Property.prototype, "owner",
        function (o) {
            return o.owner.constructor;
        }
    );

    msls_makeObservable(msls_ObjectWithDetails_Details_Property);

    function capitalizePropertyName(propertyName) {
        return propertyName[0].toUpperCase() + propertyName.substr(1);
    }

    function definePropertyWithDetailsOn(target, propertyName) {
        var entry = this,
            descriptor = entry.simpleDescriptor,
            mixinContent = {},
            isAsyncProperty = !!entry.async,
            getCore, setCore,
            capitalizedPropertyName = capitalizePropertyName(propertyName),
            getValueName = "get" + capitalizedPropertyName,
            setValueName = "set" + capitalizedPropertyName,
            cls = target.constructor,
            detailsCls = cls.Details,
            _PropertySet = detailsCls ? detailsCls.PropertySet : null,
            _Details = entry.detailsClass,
            underlyingPropertyName;

        entry.name = propertyName;

        mixinContent[propertyName] = descriptor;
        msls_makeObservableProperty(descriptor);
        if (isAsyncProperty) {
            descriptor.enumerable = !msls_isLibrary;

            getCore = descriptor.get;

            descriptor.get = function getValue() {
                var error,
                    result = descriptor.rawGet &&
                        descriptor.rawGet(this.details, descriptor);
                getCore.call(this).then(
                    function onComplete(value) {
                        result = value;
                    },
                    function onError(e) {
                        error = e;
                    }
                );
                if (error) {
                    throw error;
                }
                return result;
            };
        }
        if (descriptor.set) {
            setCore = descriptor.set;

            descriptor.set = function setValue(value) {
                /// <summary>
                /// Sets the value of a property.
                /// </summary>
                /// <param name="value">
                /// The new value of the property.
                /// </param>
                var me = this, promise, initError;
                promise = msls_promiseOperation(
                    function initSetValue(operation) {
                        try {
                            setCore.call(me, value, operation);
                        } catch (e) {
                            initError = e;
                            throw e;
                        }
                        if (setCore.length === 1) {
                            operation.complete();
                        }
                    }
                );
                if (initError) {
                    throw initError;
                }
            };
        }

        if (!isAsyncProperty) {
            mixinContent[getValueName] = {
                enumerable: !msls_isLibrary
            };

            getCore = descriptor.get;

            mixinContent[getValueName].value = function getValue() {
                /// <summary>
                /// Asynchronously gets the value of a property.
                /// </summary>
                /// <returns type="WinJS.Promise">
                /// A fulfilled promise object whose value is the
                /// current value of the synchronous property.
                /// </returns>
                var promise = WinJS.Promise.as(getCore.call(this));
                if (window.intellisense) {
                    promise._$annotate(null, descriptor.type);
                }
                return promise;
            };
        } else {
            mixinContent[getValueName] = getCore;
        }
        if (descriptor.set) {
            if (!isAsyncProperty) {
                mixinContent[setValueName] = {
                    enumerable: !msls_isLibrary,
                    value: descriptor.set
                };
            } else {
                mixinContent[setValueName] = descriptor.set;
            }
        }

        msls_mixIntoExistingClass(cls, mixinContent);
        if (isAsyncProperty) {
            msls_intellisense_setTypeProvider(target, propertyName, function (o) {
                return descriptor.type;
            });
        }

        if (_PropertySet && _Details) {
            mixinContent = {};
            underlyingPropertyName = "__" + propertyName;
            mixinContent[propertyName] = msls_accessorProperty(
                function property_get() {
                    if (!this[underlyingPropertyName]) {
                        msls_setProperty(this, underlyingPropertyName,
                            new _Details(this._details, entry));
                    }
                    return this[underlyingPropertyName];
                }
            );
            msls_mixIntoExistingClass(_PropertySet, mixinContent);
        }
    }

    msls_propertyWithDetails =
    function propertyWithDetails(simpleDescriptor, propertyType, detailsClass) {
        var descriptor = Object.create(simpleDescriptor);
        descriptor.simpleDescriptor = simpleDescriptor;
        descriptor.type = propertyType;
        descriptor.detailsClass = detailsClass;
        descriptor.defineOn = definePropertyWithDetailsOn;
        return descriptor;
    };

    msls_expose("ObjectWithDetails", msls_ObjectWithDetails);

}());

var msls_BusinessObject,
    msls_BusinessObject_Details,
    msls_BusinessObject_Details_Property;

(function () {

    msls_defineClassWithDetails(msls, "BusinessObject",
        function BusinessObject() {
            /// <summary>
            /// Represents a business object.
            /// </summary>
            /// <field name="details" type="msls.BusinessObject.Details">
            /// Gets the details for this business object.
            /// </field>
            msls_ObjectWithDetails.call(this);
        },
        function BusinessObject_Details(owner) {
            /// <summary>
            /// Represents the details for a business object.
            /// </summary>
            /// <param name="owner" type="msls.BusinessObject">
            /// The business object that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.BusinessObject">
            /// Gets the business object that owns this details object.
            /// </field>
            /// <field name="properties" type="msls.BusinessObject.Details.PropertySet">
            /// Gets the set of property objects for the owner's properties.
            /// </field>
            msls_ObjectWithDetails_Details.call(this, owner);
            if (window.intellisense) {
                if (!owner) {
                    this.owner = null;
                }
            }
        },
        msls_ObjectWithDetails
    );
    msls_BusinessObject = msls.BusinessObject;
    msls_BusinessObject_Details = msls_BusinessObject.Details;

    msls_defineClass(msls_BusinessObject_Details, "Property",
        function BusinessObject_Details_Property(details, entry) {
            /// <summary>
            /// Represents a business property object.
            /// </summary>
            /// <param name="details" type="msls.BusinessObject.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.BusinessObject">
            /// Gets the business object that owns this property.
            /// </field>
            msls_ObjectWithDetails_Details_Property.call(this, details, entry);
            if (window.intellisense) {
                if (!details) {
                    this.owner = null;
                }
            }
        },
        msls_ObjectWithDetails_Details_Property,
        {
            _findModel: function _findModel() {
                return msls_findModelItem(
                    this._details.getModel().properties,
                    this._entry.name);
            }
        }
    );
    msls_BusinessObject_Details_Property =
        msls_BusinessObject_Details.Property;

    msls_expose("BusinessObject", msls_BusinessObject);

}());

(function () {

    function createEntryPoint(entryPoint, callContext) {
        var valueProperty = "__" + entryPoint, args;
        return {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[valueProperty];
            },
            set: function (value) {
                var me = this;
                msls_setProperty(me, valueProperty, value);
                setTimeout(function () {
                    if (!me[valueProperty]) {
                        return;
                    }
                    if (!args) {
                        args = callContext.map(function (item) {
                            if (msls_isFunction(item)) {
                                item = new item();
                            }
                            return item;
                        });
                    }
                    me[valueProperty].apply(null, args);
                }, 0);
            }
        };
    }

    function addEntryPoints(constructor, entryPoints) {
        /// <summary>
        /// Adds user code entry points to a constructor function.
        /// </summary>
        /// <param name="entryPoints" type="Object">
        /// An object representing one or more user code entry points, where
        /// each key is the name of an entry point and each value is an array
        /// of argument objects and/or types passed to the user code function
        /// for the purposes of providing appropriate intellisense information.
        /// </param>
        var properties = {};
        for (var entryPoint in entryPoints) {
            properties[entryPoint] = createEntryPoint(
                entryPoint, entryPoints[entryPoint]);
            properties["_$field$" + entryPoint + "$kind"] = {
                value: "event"
            };
        }
        Object.defineProperties(constructor, properties);
        intellisense.annotate(constructor, entryPoints);
    }

    msls_expose("_addEntryPoints", addEntryPoints);

}());

var msls_ValidationResult;

(function () {

    msls_defineClass(msls, "ValidationResult", function ValidationResult(property, message) {
        /// <summary>
        /// Represents a validation result.
        /// </summary>
        /// <param name="property" type="msls.BusinessObject.Details.Property">
        /// A property to associate with the validation result.
        /// </param>
        /// <param name="message" type="String">
        /// A message describing the validation error.
        /// </param>
        /// <field name="property" type="msls.BusinessObject.Details.Property">
        /// Gets the property on which the validation error occurred.
        /// </field>
        /// <field name="message" type="String">
        /// Gets a message describing the validation error.
        /// </field>
        this.property = property;
        this.message = message;
    });
    msls_ValidationResult = msls.ValidationResult;

    msls_expose("ValidationResult", msls_ValidationResult);

}());

var OData = window.OData;

var msls_initEntity,
    msls_initEntityDetails,
    msls_initLink,
    msls_initLinkSet,
    msls_initEntitySet,
    msls_initDataServiceQuery,
    msls_initDataService,
    msls_initDataServiceDetails,
    msls_initDataWorkspace,
    msls_initDataWorkspaceDetails,
    msls_DataWorkspace_updateNestedChangeCount,
    msls_EntitySet_getEntitySetForEntityType,
    msls_EntitySet_isEntitySetReadOnly,
    msls_DataServiceQuery_isValidSkipTop,
    msls_toODataString;

(function () {

    msls_defineClassWithDetails(msls, "Entity",
        function Entity(entitySet) {
            /// <summary>
            /// Represents an entity.
            /// </summary>
            /// <param name="entitySet" type="msls.EntitySet" optional="true">
            /// An entity set that should contain this entity.
            /// </param>
            /// <field name="details" type="msls.Entity.Details">
            /// Gets the details for this entity.
            /// </field>
            msls_BusinessObject.call(this);
            msls_initEntity(this, entitySet);
        },
        function Entity_Details(owner) {
            /// <summary>
            /// Represents the details for an entity.
            /// </summary>
            /// <param name="owner" type="msls.Entity">
            /// The entity that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.Entity">
            /// Gets the entity that owns this details object.
            /// </field>
            /// <field name="entity" type="msls.Entity">
            /// Gets the entity that owns this details object.
            /// </field>
            /// <field name="entitySet" type="msls.EntitySet">
            /// Gets the entity set that contains the entity.
            /// </field>
            /// <field name="entityState" type="String">
            /// Gets the state (from msls.EntityState) of the entity.
            /// </field>
            /// <field name="hasEdits" type="Boolean">
            /// Gets a value indicating if the entity has edits (it is
            /// added and has been edited or it is modified or deleted).
            /// </field>
            /// <field name="properties" type="msls.Entity.Details.PropertySet">
            /// Gets the set of property objects for the entity.
            /// </field>
            msls_BusinessObject_Details.call(this, owner);
            if (window.intellisense) {
                if (!owner) {
                    this.owner = null;
                }
            }
            msls_initEntityDetails(this, owner);
        },
        msls_BusinessObject
    );
    msls_intellisense_setTypeProvider(
        msls.Entity.Details.prototype, "entity",
        function (o) {
            return o.entity.constructor;
        }
    );

    msls_defineClass(msls, "Link",
        function Link(end1, endEntity1, end2, endEntity2, state, changeSetIndex) {
            msls_initLink(this, end1, endEntity1, end2, endEntity2, state, changeSetIndex);
        }
    );

    msls_defineEnum(msls, {
        LinkState: {
            unchanged: 0,
            added: 1,
            deleted: 3,
            discarded: 4
        }
    });

    msls_defineClass(msls, "LinkSet",
        function LinkSet(endNames, propertyNames) {
            msls_initLinkSet(this, endNames, propertyNames);
        }
    );

    msls_defineClass(msls, "EntitySet",
        function EntitySet(dataService, entry) {
            /// <summary>
            /// Represents an entity set.
            /// </summary>
            /// <param name="dataService" type="msls.DataService">
            /// The data service that owns this entity set.
            /// </param>
            /// <param name="entry">
            /// An entity set property entry.
            /// </param>
            /// <field name="dataService" type="msls.DataService">
            /// Gets the data service that owns this entity set.
            /// </field>
            /// <field name="name" type="String">
            /// Gets the name of this entity set.
            /// </field>
            /// <field name="canInsert" type="Boolean">
            /// Gets a value indicating if entities
            /// can be added to this entity set.
            /// </field>
            /// <field name="canUpdate" type="Boolean">
            /// Gets a value indicating if entities
            /// in this entity set can be modified.
            /// </field>
            /// <field name="canDelete" type="Boolean">
            /// Gets a value indicating if entities
            /// in this entity set can be deleted.
            /// </field>
            msls_initEntitySet(this, dataService, entry);
        }
    );
    msls_intellisense_setTypeProvider(
        msls.EntitySet.prototype, "dataService",
        function (o) {
            return o.dataService.constructor;
        }
    );

    msls_defineClass(msls, "DataServiceQuery",
        function DataServiceQuery(source, rootUri, queryParameters) {
            /// <summary>
            /// Represents a data service query.
            /// </summary>
            /// <param name="source">
            /// A source queryable object.
            /// </param>
            /// <param name="rootUri" type="String" optional="true">
            /// The root request URI if this is a root data service
            /// query, for example a collection navigation query.
            /// </param>
            /// <param name="queryParameters" type="String" optional="true">
            /// The query parameters, if query has parameters, for example
            /// a screen query based a query operation with parameters.
            /// </param>
            msls_initDataServiceQuery(this, source, rootUri, queryParameters);
        }
    );

    msls_defineClassWithDetails(msls, "DataService",
        function DataService(dataWorkspace) {
            /// <summary>
            /// Represents a data service.
            /// </summary>
            /// <param name="dataWorkspace" type="msls.DataWorkspace" optional="true">
            /// The data workspace that owns this data service.
            /// </param>
            /// <field name="details" type="msls.DataService.Details">
            /// Gets the details for this data service.
            /// </field>
            msls_ObjectWithDetails.call(this);
            msls_initDataService(this, dataWorkspace);
        },
        function DataService_Details(owner) {
            /// <summary>
            /// Represents the details for a data service.
            /// </summary>
            /// <param name="owner" type="msls.DataService">
            /// The data service that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.DataService">
            /// Gets the data service that owns this details object.
            /// </field>
            /// <field name="dataService" type="msls.DataService">
            /// Gets the data service that owns this details object.
            /// </field>
            /// <field name="dataWorkspace" type="msls.DataWorkspace">
            /// Gets the data workspace that manages the data service, if any.
            /// </field>
            /// <field name="hasChanges" type="Boolean">
            /// Gets a value indicating if the data service has changes
            /// (there are entities pending addition, modification or deletion).
            /// </field>
            /// <field name="properties" type="msls.DataService.Details.PropertySet">
            /// Gets the set of property objects for the data service.
            /// </field>
            /// <field name="oncontentchange" type="Function">
            /// Gets or sets a handler for the contentchange event, which is
            /// called any time any entity owned by the data service changes.
            /// </field>
            msls_ObjectWithDetails_Details.call(this, owner);
            if (window.intellisense) {
                if (!owner) {
                    this.owner = null;
                }
            }
            msls_initDataServiceDetails(this, owner);
        },
        msls_ObjectWithDetails
    );
    msls_intellisense_setTypeProvider(
        msls.DataService.Details.prototype, "dataService",
        function (o) {
            return o.dataService.constructor;
        }
    );

    msls_defineClassWithDetails(msls, "DataWorkspace",
        function DataWorkspace() {
            /// <summary>
            /// Represents a data workspace.
            /// </summary>
            /// <field name="details" type="msls.DataWorkspace.Details">
            /// Gets the details for this data workspace.
            /// </field>
            msls_ObjectWithDetails.call(this);
            msls_initDataWorkspace(this);
        },
        function DataWorkspace_Details(owner) {
            /// <summary>
            /// Represents the details for a data workspace.
            /// </summary>
            /// <param name="owner" type="msls.DataWorkspace">
            /// The data workspace that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.DataWorkspace">
            /// Gets the data workspace that owns this details object.
            /// </field>
            /// <field name="dataWorkspace" type="msls.DataWorkspace">
            /// Gets the data workspace that owns this details object.
            /// </field>
            /// <field name="hasChanges" type="Boolean">
            /// Gets a value indicating if the data workspace has changes
            /// (there are entities pending addition, modification or deletion).
            /// </field>
            /// <field name="hasNestedChangeSets" type="Boolean">
            /// Gets a value indicating if the data
            /// workspace has any nested change sets.
            /// </field>
            /// <field name="properties" type="msls.DataWorkspace.Details.PropertySet">
            /// Gets the set of property objects for the data workspace.
            /// </field>
            /// <field name="oncontentchange" type="Function">
            /// Gets or sets a handler for the contentchange event, which is
            /// called any time any entity owned by any data service owned by
            /// this data workspace changes.
            /// </field>
            msls_ObjectWithDetails_Details.call(this, owner);
            if (window.intellisense) {
                if (!owner) {
                    this.owner = null;
                }
            }
            msls_initDataWorkspaceDetails(this, owner);
        },
        msls_ObjectWithDetails
    );
    msls_intellisense_setTypeProvider(
        msls.DataWorkspace.Details.prototype, "dataWorkspace",
        function (o) {
            return o.dataWorkspace.constructor;
        }
    );

}());

var msls_loadedEntityData,
    msls_Entity_acceptNestedChanges,
    msls_Entity_cancelNestedChanges,
    msls_Entity_raiseNavigationPropertyChanged,
    msls_Entity_getNavigationPropertyTargetEntitySet,
    msls_Entity_getNavigationPropertyLinkSet,
    msls_Entity_setNavigationPropertyAvailable,
    msls_Entity_tryGetAddedReferencePropertyValue,
    msls_Entity_resetAddedNavigationPropertyAfterSave,
    msls_Entity_resetModifiedReferencePropertyAfterSave,
    msls_Entity_getEntityCollection,
    msls_Entity_getAddedEntitiesInCollection;

(function () {

    var msls_Sequence_Array = msls_Sequence.Array,
        navigationPropertyState = {
            notInitialized: -1,
            unavailable: 0,
            available: 1,
            loaded: 2
        },
        _Entity = msls.Entity,
        _EntityDetails = _Entity.Details,
        _EntityProperty,
        _TrackedProperty,
        _StorageProperty,
        _ReferenceProperty,
        _CollectionProperty,
        _EntityCollection,
        _ComputedProperty,
        _EntityState;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies the state of an entity.
        /// </field>
        EntityState: {
            /// <field type="String">
            /// The entity is unchanged.
            /// </field>
            unchanged: "unchanged",
            /// <field type="String">
            /// The entity is added.
            /// </field>
            added: "added",
            /// <field type="String">
            /// The entity is modified.
            /// </field>
            modified: "modified",
            /// <field type="String">
            /// The entity is deleted.
            /// </field>
            deleted: "deleted",
            /// <field type="String">
            /// The entity is discarded.
            /// </field>
            discarded: "discarded"
        }
    });
    _EntityState = msls.EntityState;

    function getEntityPropertyValue() {
        return this._entry.get.call(this._details.owner);
    }

    function setEntityPropertyValue(value) {
        this._entry.set.call(this._details.owner, value);
    }

    msls_defineClass(_EntityDetails, "Property",
        function Entity_Details_Property(details, entry) {
            /// <summary>
            /// Represents an entity property object.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.Entity">
            /// Gets the entity that owns this property.
            /// </field>
            /// <field name="entity" type="msls.Entity">
            /// Gets the entity that owns this property.
            /// </field>
            msls_BusinessObject_Details_Property.call(this, details, entry);
            if (window.intellisense) {
                if (!details) {
                    this.owner = null;
                }
            }
            this.entity = this.owner;
        },
        msls_BusinessObject_Details_Property, {
            value: msls_accessorProperty(
                getEntityPropertyValue,
                setEntityPropertyValue
            )
        }
    );
    _EntityProperty = _EntityDetails.Property;
    msls_intellisense_setTypeProvider(
        _EntityProperty.prototype, "entity",
        function (o) {
            return o.entity.constructor;
        }
    );
    msls_intellisense_setTypeProvider(
        _EntityProperty.prototype, "value",
        function (o) {
            return o.getPropertyType();
        }
    );

    function getIsEditedName(serviceName) {
        return "__" + serviceName + "_IsEdited";
    }

    function isNavigationProperty(
        entry) {
        return isReferenceNavigationProperty(entry) ||
            isCollectionNavigationProperty(entry);
    }

    function isReferenceNavigationProperty(
        entry) {
        return entry.kind === "reference" || entry.kind === "virtualReference";
    }

    function isCollectionNavigationProperty(
        entry) {
        return entry.kind === "collection" || entry.kind === "virtualCollection";
    }

    function isVirtualNavigationProperty(
        entry) {
        return entry.kind === "virtualReference" || entry.kind === "virtualCollection";
    }

    function getNavigationPropertyDataPropertyName(propertyName) {
        return "__" + propertyName;
    }

    function tryGetNavigationPropertyData(details, property) {
        return details[getNavigationPropertyDataPropertyName(property.name)];
    }

    function getIsEdited() {
        /// <returns type="Boolean" />
        var details = this._details,
            entry = this._entry,
            data = details._, navigationPropertyData;
        if (entry.kind === "storage") {
            return !!data[getIsEditedName(entry.serviceName)];
        } else if (isReferenceNavigationProperty(
            entry)) {
            navigationPropertyData = tryGetNavigationPropertyData(
                details, this);
            return !!navigationPropertyData && !!navigationPropertyData.changeInfo;
        }
        return false;
    }

    function getIsChanged() {
        /// <returns type="Boolean" />
        if (this._details.entityState === _EntityState.added) {
            return false;
        }
        return this.isEdited;
    }

    function isNavigationPropertyFromAssociationEnd(
        association,
        associationEnd,
        navigationPropertyDefinition) {
        return navigationPropertyDefinition.association === association &&
            navigationPropertyDefinition.fromEnd === associationEnd;
    }

    function getNavigationPropertyTargetEntitySet(details, navigationPropertyData) {

        var associationSetEnd = msls_iterate(navigationPropertyData.associationSet.ends).first(function () {
                    return this.name === navigationPropertyData.model.toEnd.name;
                }),
            dataService = details.entitySet.dataService,
            entityContainer = associationSetEnd.entityContainer;

        if (entityContainer) {
            dataService = dataService.details.dataWorkspace[msls_getProgrammaticName(entityContainer.name)];
        }

        return dataService[msls_getProgrammaticName(associationSetEnd.entitySet.name)];
    }

    function setNavigationPropertyIsLoaded(
        details,
        entry,
        data,
        property
        ) {
        if (!property) {
            property = details.properties[entry.name];
        }

        var entity = details.entity,
            value;

        data.state = navigationPropertyState.available;

        value = getNavigationPropertyValueWithoutLoading(
            details, entry, data);

        property.dispatchChange("isLoaded");
        if (isReferenceNavigationProperty(entry)) {
            property.dispatchChange("value");
            entity.dispatchChange(entry.name);
        } else {
            tryRaiseCollectionChangeEvent(data, msls_CollectionChangeAction.refresh);
        }
    }

    function afterNavigationQueryExecuted(
        details,
        entry,
        data,
        isVirtual,
        query,
        queryResult) {

        var model = data.model,
            entity = details.entity,
            current = query,
            setIsLoaded = true,
            filtersCount = 0;

        queryResult.results.forEach(function (result) {
            data.linkSet.attachLink(
                model.fromEnd.name, entity, model.toEnd.name, result);
        });

        do {
            if (msls_DataServiceQuery_isValidSkipTop(current._skip) ||
                msls_DataServiceQuery_isValidSkipTop(current._take)) {
                setIsLoaded = false;
                break;
            } else if (typeof current._filter === "string") {
                filtersCount += 1;
            }
            current = current._source;
        } while (current);

        if (setIsLoaded) {
            if (isVirtual) {
                filtersCount -= 1;
            }
            setIsLoaded = filtersCount <= 0;
        }

        if (setIsLoaded) {
            setNavigationPropertyIsLoaded(details, entry, data);
        }
    }

    function refreshNavigationPropertyQuery(
        details, entityData, entry,
        navigationPropertyData, isVirtual) {

        if (isVirtual) {
            var fromKeyProperties,
                toKeyProperties,
                filters = [],
                fromKeyProperty,
                keyValue,
                primitiveType,
                filterString;

            msls_iterate(navigationPropertyData.associationSet.ends).each(function () {
                if (this.name === navigationPropertyData.model.fromEnd.name) {
                    fromKeyProperties = this.properties;
                } else {
                    toKeyProperties = this.properties;
                }
            });

            toKeyProperties.forEach(function (toKeyProperty, index) {

                fromKeyProperty = fromKeyProperties[index].entityProperty;
                keyValue = entityData[fromKeyProperty.name];

                primitiveType = fromKeyProperty.propertyType;
                if (msls_isNullableType(primitiveType)) {
                    primitiveType = primitiveType.underlyingType;
                }
                while (!!primitiveType && msls_isSemanticType(primitiveType)) {
                    primitiveType = primitiveType.underlyingType;
                }

                filters.push(toKeyProperty.entityProperty.name + " eq " + msls_toODataString(keyValue, primitiveType.id));
            });

            filterString = filters.join(" and ");
            navigationPropertyData.query = getNavigationPropertyTargetEntitySet(details, navigationPropertyData)
                    .filter(filterString);

        } else {
            var result = entityData[entry.serviceName],
                deferred = result && result.__deferred,
                queryUri = deferred ? deferred.uri : (entityData.__metadata.uri + "/" + entry.serviceName);

            navigationPropertyData.query = new msls.DataServiceQuery(
                {
                    _entitySet: getNavigationPropertyTargetEntitySet(details, navigationPropertyData)
                },
                queryUri);
        }

        msls_setProperty(navigationPropertyData.query, "_afterQueryExecuted", function (
            query, queryResult) {
            afterNavigationQueryExecuted(
                details, entry, navigationPropertyData, isVirtual,
                query, queryResult);
        });
    }

    function getNavigationPropertyData(details, entry) {
        var entryName = entry.name,
            dataPropertyName = getNavigationPropertyDataPropertyName(entryName),
            data = details[dataPropertyName],
            isVirtual = isVirtualNavigationProperty(entry),
            entryData,
            dataService, dataServiceDetails,
            propertyDefinition,
            association, endNames, propertyNames, endName, otherPropertyDefinition,
            entityContainer,
            associationSet, associationSetName, associationSetEnd,
            linkSets;

        if (!data) {
            dataService = details.entitySet.dataService;
            dataServiceDetails = dataService.details,
            entryData = entry.data;

            if (!entryData) {
                entryData = entry.data = {};

                entryData.model = propertyDefinition = details.properties[entryName].getModel();

                association = isVirtual ? propertyDefinition.virtualAssociation : propertyDefinition.association;
                msls_iterate(association.ends).each(function (end) {
                    if (!isNavigationPropertyFromAssociationEnd(association, end, propertyDefinition)) {
                        otherPropertyDefinition = msls_iterate(end.entityType.properties)
                            .first(function (p) {
                                return isNavigationPropertyFromAssociationEnd(association, end, p);
                            });
                    }
                });
                entryData.toPropertyName = otherPropertyDefinition &&
                    msls_getProgrammaticName(otherPropertyDefinition.name);

                if (isVirtual) {
                    associationSet = msls_iterate(msls_getApplicationDefinition().globalItems)
                        .first(function () {
                            return this.virtualAssociation === association;
                        });
                } else {
                    entityContainer = dataServiceDetails.getModel();
                    associationSet = msls_iterate(entityContainer.associationSets).first(function () {
                            return this.association === association;
                        });
                }
                entryData.associationSet = associationSet;
            }

            data = details[dataPropertyName] = Object.create(entryData);

            data.state = navigationPropertyState.notInitialized;

            linkSets = isVirtual ? dataService.details.dataWorkspace.details._linkSets : dataServiceDetails._linkSets;
            associationSetName = entryData.associationSet.name;
            if (!linkSets[associationSetName]) {
                endNames = [];
                propertyNames = {};
                propertyDefinition = entryData.model;
                association = propertyDefinition.association;
                msls_iterate(association.ends).each(function (end) {
                    endName = end.name;
                    endNames.push(endName);
                    if (isNavigationPropertyFromAssociationEnd(association, end, propertyDefinition)) {
                        propertyNames[endName] = entry.name;
                    } else {
                        propertyNames[endName] = entryData.toPropertyName;
                    }
                });
                linkSets[associationSetName] = new msls.LinkSet(endNames, propertyNames);
            }
            data.linkSet = linkSets[associationSetName];

            if (details.entityState !== _EntityState.added && details.entityState !== _EntityState.discarded) {
                refreshNavigationPropertyQuery(details, details._, entry, data, isVirtual);
            }
        }

        return data;
    }

    function getOriginalValue() {
        var originalValue,
            details = this._details,
            entry = this._entry,
            data = details._, navigationPropertyData;
        if (this.isChanged) {
            if (entry.kind === "storage") {
                originalValue = data.__original[entry.serviceName];
            } else if (isReferenceNavigationProperty(
                entry)) {
                navigationPropertyData = getNavigationPropertyData(
                    details, entry);
                originalValue = navigationPropertyData.changeInfo.originalEntity;
            }
        }
        return originalValue;
    }

    msls_defineClass(_EntityDetails, "TrackedProperty",
        function Entity_Details_TrackedProperty(details, entry) {
            /// <summary>
            /// Represents a tracked entity property object.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="isEdited" type="Boolean">
            /// Gets a value indicating if this property has been edited. This
            /// is true for properties of added entities that have been edited.
            /// </field>
            /// <field name="isChanged" type="Boolean">
            /// Gets a value indicating if this property has been changed.
            /// This value is always false for properties of added entities.
            /// </field>
            /// <field name="originalValue" type="Object">
            /// Gets the original value of this property.
            /// </field>
            _EntityProperty.call(this, details, entry);
        },
        _EntityProperty, {
            isEdited: msls_observableProperty(null, getIsEdited),
            isChanged: msls_observableProperty(null, getIsChanged),
            originalValue: msls_observableProperty(null, getOriginalValue)
        }
    );
    _TrackedProperty = _EntityDetails.TrackedProperty;
    msls_intellisense_setTypeProvider(
        _TrackedProperty.prototype, "originalValue",
        function (o) {
            return o.getPropertyType();
        }
    );

    msls_defineClass(_EntityDetails, "StorageProperty",
        function Entity_Details_StorageProperty(details, entry) {
            /// <summary>
            /// Represents an entity storage property object.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            _TrackedProperty.call(this, details, entry);
        },
        _TrackedProperty, {
            isReadOnly: msls_accessorProperty(
                function isReadOnly_get() {
                    /// <returns type="Boolean" />
                    var propDef = this.getModel();

                    if (propDef.isReadOnly) {
                        return true;
                    }

                    if (this._details.entityState === _EntityState.added) {
                        return false;
                    }

                    if (msls_isKeyProperty(propDef)) {
                        return true;
                    }

                    return !this._details.entitySet.canUpdate;
                }
            )
        }
    );
    _StorageProperty = _EntityDetails.StorageProperty;

    function getIsLoaded(details, data) {
        var model, associationToEnd, links;
        if (data.state === navigationPropertyState.notInitialized) {
            model = data.model;
            associationToEnd = msls_iterate(model.association.ends).first(function () {
                    return this === model.toEnd;
                });

            if (associationToEnd.multiplicity !== "Many" &&
                data.linkSet.hasLinks(model.fromEnd.name, details.entity)) {
                data.state = navigationPropertyState.available;
            } else {
                data.state = navigationPropertyState.unavailable;
            }
        }
        return data.state !== navigationPropertyState.unavailable;
    }

    function isLoaded_get() {
        /// <returns type="Boolean" />
        var details = this._details;
        return getIsLoaded(details,
            getNavigationPropertyData(
                details,
                this._entry));
    }

    function getNavigationPropertyValueWithoutLoading(
        details,
        entry,
        data) {
        var model = data.model;

        if (isReferenceNavigationProperty(entry)) {
            if (data.state === navigationPropertyState.available) {
                data.value = data.linkSet.getTargetEntity(
                    model.fromEnd.name, details.entity, model.toEnd.name);
                data.state = navigationPropertyState.loaded;
            }
        } else {
            if (!data.value) {
                data.value = new _EntityCollection(details, data);
            }
        }
        return data.value;
    }

    function tryRaiseCollectionChangeEvent(data,
        action, items, oldStartingIndex, newStartingIndex) {
        var entityCollection = data.value;
        if (entityCollection) {
            entityCollection.dispatchEvent("collectionchange",
                new msls_CollectionChange(
                    action, items, oldStartingIndex, newStartingIndex));
        }
    }

    function load() {
        /// <summary>
        /// Asynchronously loads the value of this property and returns
        /// a promise that will be fulfilled when the value of this property
        /// is loaded.
        /// </summary>
        /// <returns type="WinJS.Promise">
        /// A promise that is fulfilled when the value of this property is loaded.
        /// </returns>
        var me = this,
            details = me._details,
            entry = me._entry,
            data = getNavigationPropertyData(details, entry),
            isLoaded = getIsLoaded(details, data),
            loadPromise = data.loadPromise,
            operationDone;

        if (!loadPromise) {
            if (data.state !== navigationPropertyState.unavailable) {
                data.state = navigationPropertyState.unavailable;
                me.dispatchChange("isLoaded");
            }
            if (me.loadError) {
                me.loadError = null;
            }

            loadPromise = data.loadPromise =
            msls_promiseOperation(function initLoad(operation) {
                loadPromise = data.loadPromise = operation.promise();

                var entity = details.entity,
                    query = data.query;

                function onQueryLoadDone(error, loadOperation) {
                    operationDone = true;
                    data.loadPromise = null;

                    if (!error) {
                        if (!query) {
                            setNavigationPropertyIsLoaded(
                                details, entry, data, me);
                        }

                        loadOperation.complete(data.value);

                    } else {
                        me.loadError = error;

                        loadOperation.error(error);
                    }
                }

                if (query) {
                    query.execute()._thenEx(function (error, result) {
                        onQueryLoadDone(error, operation);
                    });
                } else {
                    onQueryLoadDone(null, operation);
                }
            });
            if (window.intellisense) {
                loadPromise._$annotate(String, me.getPropertyType());
            }

            if (operationDone) {
                data.loadPromise = null;
            }
        }

        return loadPromise;
    }

    msls_defineClass(_EntityDetails, "ReferenceProperty",
        function Entity_Details_ReferenceProperty(details, entry) {
            /// <summary>
            /// Represents an entity reference property object.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="isLoaded" type="Boolean">
            /// Gets a value indicating if this property has been loaded.
            /// </field>
            /// <field name="loadError" type="String">
            /// Gets the last load error, or null if no error occurred.
            /// </field>
            /// <field name="originalValue" type="msls.Entity">
            /// Gets the original value of this property.
            /// </field>
            /// <field name="value" type="msls.Entity">
            /// Gets or sets the value of this property.
            /// </field>
            _TrackedProperty.call(this, details, entry);
        },
        _TrackedProperty, {
            isLoaded: msls_observableProperty(false, isLoaded_get),
            loadError: msls_observableProperty(null),

            load: load
        }
    );
    _ReferenceProperty = _EntityDetails.ReferenceProperty;
    if (window.intellisense) {
        msls_mixIntoExistingClass(_ReferenceProperty, {
            getPropertyType:
                function getPropertyType() {
                    return !!this._entry && !!this._entry.type ?
                        this._entry.type : msls.Entity;
                }
        });
        intellisense.annotate(
            _ReferenceProperty.prototype.getPropertyType,
            _TrackedProperty.prototype.getPropertyType
        );
    }

    msls_Entity_getNavigationPropertyTargetEntitySet =
    function getNavigationPropertyTargetEntitySetInternal(property) {
        return getNavigationPropertyTargetEntitySet(
            property.entity.details,
            getNavigationPropertyData(
                property._details, property._entry));
    };

    msls_Entity_getNavigationPropertyLinkSet =
    function getNavigationPropertyLinkSetInternal(property) {
        var data = getNavigationPropertyData(
                property._details, property._entry);
        return data.linkSet;
    };

    msls_Entity_setNavigationPropertyAvailable =
    function setNavigationPropertyAvailableInternal(details, entry) {
        var data = getNavigationPropertyData(details, entry);
        if (data.state !== navigationPropertyState.loaded) {
            data.state = navigationPropertyState.available;
        }
    };

    msls_Entity_tryGetAddedReferencePropertyValue =
    function tryGetAddedReferencePropertyValue(details, property) {
        var navigationPropertyData = tryGetNavigationPropertyData(
            details, property);
        return navigationPropertyData && navigationPropertyData.value;
    };

    msls_Entity_resetAddedNavigationPropertyAfterSave =
    function resetAddedNavigationPropertyAfterSave(details, property, changeResponseData) {

        var entry = property._entry,
            navigationPropertyData;
        if (!isNavigationProperty(entry)) {
            return;
        }

        navigationPropertyData = tryGetNavigationPropertyData(details, property);
        if (navigationPropertyData) {
            refreshNavigationPropertyQuery(
                details, changeResponseData, entry,
                navigationPropertyData, isVirtualNavigationProperty(entry));
            navigationPropertyData.changeInfo = null;
        }
    };

    msls_Entity_resetModifiedReferencePropertyAfterSave =
    function resetModifiedReferencePropertyAfterSave(details, property) {

        getNavigationPropertyData(
            details, property._entry).changeInfo = null;
    };

    msls_defineClass(msls, "EntityCollection",
        function EntityCollection(details, data) {
            /// <summary>
            /// Represents a local collection of entities.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object for the entity
            /// that owns this entity collection.
            /// </param>
            /// <param name="data">
            /// An object that provides property data.
            /// </param>
            /// <field name="oncollectionchange" type="Function">
            /// Gets or sets a handler for the collection change event.
            /// </field>
            msls_Sequence.call(this);
            msls_setProperty(this, "_details", details);
            msls_setProperty(this, "_data", data);
        },
        msls_Sequence_Array, {
            _array: [],
            _iterator: function iterator() {
                var data = this._data,
                    model = data.model;
                if (data.state === navigationPropertyState.available) {
                    this._array = data.linkSet.getTargetEntities(model.fromEnd.name, this._details.entity, model.toEnd.name);
                    data.state = navigationPropertyState.loaded;
                }
                return msls_Sequence_Array.prototype._iterator.call(this);
            },

            collectionchange: msls_event()
        }
    );
    _EntityCollection = msls.EntityCollection;
    msls_intellisense_addTypeNameResolver(
        function resolveEntityCollectionTypeName(type) {
            if (type === _EntityCollection) {
                return "msls.EntityCollection";
            }
            return null;
        }
    );

    function getQuery() {
        /// <returns type="msls.DataServiceQuery" />
        var data = getNavigationPropertyData(this._details, this._entry);
        return data.query;
    }

    msls_defineClass(_EntityDetails, "CollectionProperty",
        function Entity_Details_CollectionProperty(details, entry) {
            /// <summary>
            /// Represents an entity collection property object.
            /// </summary>
            /// <param name="details" type="msls.Entity.Details">
            /// The details object that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="isLoaded" type="Boolean">
            /// Gets a value indicating if this property has been loaded.
            /// </field>
            /// <field name="loadError" type="String">
            /// Gets the last load error, or null if no error occurred.
            /// </field>
            /// <field name="query" type="msls.DataServiceQuery">
            /// Gets the query that produces the value of this property.
            /// </field>
            /// <field name="value" type="msls.EntityCollection" elementType="msls.Entity">
            /// Gets the value of this property.
            /// </field>
            _EntityProperty.call(this, details, entry);
        },
        _EntityProperty, {
            isLoaded: msls_observableProperty(false, isLoaded_get),
            loadError: msls_observableProperty(null),

            query: msls_accessorProperty(getQuery),
            value: msls_accessorProperty(getEntityPropertyValue),
            load: load
        }
    );
    _CollectionProperty = _EntityDetails.CollectionProperty;
    if (window.intellisense) {
        msls_mixIntoExistingClass(_CollectionProperty, {
            value: msls_accessorProperty(
                function value_get() {
                    /// <returns type="msls.EntityCollection" />
                    return getEntityPropertyValue.apply(this, arguments);
                }
            )
        });
    }

    msls_Entity_getEntityCollection =
    function getEntityCollection(collectionProperty) {

        var details = collectionProperty._details,
            entry = collectionProperty._entry;
        return getNavigationPropertyValueWithoutLoading(
            details, entry, getNavigationPropertyData(details, entry));
    };

    msls_Entity_getAddedEntitiesInCollection =
    function getAddedEntitiesInCollection(collectionProperty) {

        var details = collectionProperty._details,
            data = getNavigationPropertyData(
                details,
                collectionProperty._entry),
            model = data.model;
        return data.linkSet.getAddedEntities(
            model.fromEnd.name, details.entity, model.toEnd.name);
    };

    function removeAddedEntity(details, entitySet) {
        var addedEntities = entitySet._addedEntities;
        $.each(addedEntities, function (index, item) {
            if (item === details.entity) {
                addedEntities.splice(index, 1);
                return false;
            }
            return true;
        });
    }

    msls_Entity_raiseNavigationPropertyChanged =
    function raiseNavigationPropertyChanged(entity, propertyName, action, item) {
        if (!entity || !propertyName) {
            return;
        }

        var details = entity.details,
            property = details.properties[propertyName],
            entry = property._entry,
            data = details[getNavigationPropertyDataPropertyName(propertyName)];


        if (!!data && data.state === navigationPropertyState.loaded) {
            data.state = navigationPropertyState.available;
        }

        if (isCollectionNavigationProperty(entry)) {
            if (data) {
                tryRaiseCollectionChangeEvent(data, action, [item]);
            }
        } else {
            property.dispatchChange("value");
            entity.dispatchChange(propertyName);
        }
    };

    function raiseRelatedEntitiesNavigationPropertiesChanged(entity, details, action) {
        var entry,
            data,
            toPropertyName,
            toEntities;

        $.each(details.properties.all(), function (i, p) {
            entry = p._entry;
            if (!isNavigationProperty(entry)) {
                return;
            }

            data = getNavigationPropertyData(details, entry);
            toPropertyName = data.toPropertyName;
            if (!toPropertyName) {
                return;
            }

            if (isCollectionNavigationProperty(entry)) {
                toEntities = p.value.array;
                $.each(toEntities, function (j, toEntity) {
                    msls_Entity_raiseNavigationPropertyChanged(toEntity, toPropertyName, action, entity);
                });
            } else if (getIsLoaded(details, data)) {
                msls_Entity_raiseNavigationPropertyChanged(
                    p.value, toPropertyName, action, entity);
            }
        });
    }

    function popEditingScope(details) {
        var data = details._;
        if (!!data.__parent) {
            details._ = data.__parent;
        }
    }

    function isReferencePropertyChangedInChangeSet(
        navigationData, currentChangeSetIndex) {
        var changeSetIndices =
                navigationData &&
                navigationData.changeInfo &&
                navigationData.changeInfo.changeSetIndices;

        return !!changeSetIndices &&
            changeSetIndices.indexOf(currentChangeSetIndex) > -1;
    }

    function popEditingScopesForDiscard(
        details,
        data,
        dataWorkspaceDetails,
        handleChangedProperty) {

        var scopeHasChanges,
            currentChangeSetIndex,
            trackedProperties = msls_iterate(details.properties.all())
                .where(function (p) {
                    return p instanceof _TrackedProperty;
                })
                .array;

        function processChangedProperty(p) {

            var propertyChanged;
            if (p instanceof _StorageProperty) {
                propertyChanged = data.hasOwnProperty(p._entry.serviceName);
            } else {
                propertyChanged = isReferencePropertyChangedInChangeSet(
                    tryGetNavigationPropertyData(
                        details, p),
                    currentChangeSetIndex);
            }

            if (propertyChanged) {
                scopeHasChanges = true;
                if (handleChangedProperty) {
                    handleChangedProperty(data, p, currentChangeSetIndex);
                }
            }
        }

        while (data.__parent) {
            scopeHasChanges = false;
            currentChangeSetIndex = data.__changeSetIndex;

            popEditingScope(details);

            trackedProperties.forEach(processChangedProperty);

            if (scopeHasChanges) {
                msls_DataWorkspace_updateNestedChangeCount(
                    dataWorkspaceDetails, currentChangeSetIndex, -1);
            }
            data = details._;
        }
    }

    function raiseTrackedPropertyDiscardedEvents(entity, property, entry) {
        entity.dispatchChange(entry.name);
        property.dispatchChange("value");
        property.dispatchChange("originalValue");
        property.dispatchChange("isChanged");
        property.dispatchChange("isEdited");
    }

    function isReferencePropertyFirstChangedInChangeSet(navigationData, currentChangeSetIndex) {
        var changeSetIndices = navigationData.changeInfo.changeSetIndices;
        return changeSetIndices[0] === currentChangeSetIndex;
    }

    function discardChanges() {
        /// <summary>
        /// Discards any changes made to the entity.
        /// </summary>
        var details = this,
            entity = details.entity,
            entityState = details.entityState,
            hasEdits = details.hasEdits,
            entitySet = details.entitySet,
            dataServiceDetails = entitySet.dataService.details,
            dataWorkspaceDetails = dataServiceDetails.dataWorkspace.details,
            data = details._;

        if (entityState === _EntityState.unchanged || entityState === _EntityState.discarded) {
            return;
        }

        if (entityState === _EntityState.added) {

            removeAddedEntity(details, entitySet);

            if (data.__hasEdits) {
                data.__hasEdits = false;
            }
            data.__entityState = _EntityState.discarded;
            raiseRelatedEntitiesNavigationPropertiesChanged(entity, details, msls_CollectionChangeAction.remove);

            popEditingScopesForDiscard(details, data, dataWorkspaceDetails);

            msls_DataWorkspace_updateNestedChangeCount(
                dataWorkspaceDetails, details._.__changeSetIndex, -1);

            if (data.__parent) {
                data.__parent = null;
            }
            data.__changeSetIndex = -1;
            details._ = data;

        } else if (entityState === _EntityState.deleted) {
            popEditingScope(details);
            raiseRelatedEntitiesNavigationPropertiesChanged(entity, details, msls_CollectionChangeAction.add);
            msls_DataWorkspace_updateNestedChangeCount(dataWorkspaceDetails, data.__changeSetIndex, -1);

        } else if (entityState === _EntityState.modified) {
            popEditingScopesForDiscard(details, data, dataWorkspaceDetails,
                function handleChangedProperty(
                    currentData, property, currentChangeSetIndex) {

                    var entry = property._entry,
                        navigationData,
                        model;

                    if (property instanceof _StorageProperty) {
                        if (currentData.hasOwnProperty(getIsEditedName(
                                entry.serviceName))) {
                            raiseTrackedPropertyDiscardedEvents(
                                entity, property, entry);
                        }
                    } else {
                        navigationData = getNavigationPropertyData(
                            details, entry);

                        if (isReferencePropertyFirstChangedInChangeSet(navigationData, currentChangeSetIndex)) {
                            model = navigationData.model;
                            navigationData.linkSet.discardReferenceChanges(model.fromEnd.name, entity, model.toEnd.name);
                            navigationData.value = navigationData.changeInfo.originalEntity;
                            navigationData.state = navigationPropertyState.loaded;
                            navigationData.changeInfo = null;

                            raiseTrackedPropertyDiscardedEvents(entity, property, entry);
                        }
                    }
                }
            );

        }
        if (details.hasEdits !== hasEdits) {
            details.dispatchChange("hasEdits");
        }
        details.dispatchChange("entityState");
        if (--dataServiceDetails._changeCount === 0) {
            dataServiceDetails.dispatchChange("hasChanges");
        }
        dataServiceDetails.dispatchEvent("contentchange", entity);
    }

    function _findModel() {
        var model = null,
            entitySet = this.entitySet,
            dataService,
            dataServiceDetails,
            entitySetProperty,
            entitySetDefinition;

        if (!!entitySet &&
            !!(dataService = entitySet.dataService) &&
            !!(dataServiceDetails = dataService.details)) {

            entitySetProperty = msls_iterate(dataServiceDetails.properties.all()).first(
                    function (p) {
                        return (p.value === entitySet);
                    }
                );

            if (entitySetProperty) {
                entitySetDefinition = entitySetProperty.getModel();

                model = entitySetDefinition.entityType;
            }
        }
        return model;
    }

    msls_mixIntoExistingClass(_EntityDetails, {
        entityState: msls_observableProperty(null,
            function entityState_get() {
                /// <returns type="String" />
                return this._.__entityState || _EntityState.unchanged;
            }
        ),
        hasEdits: msls_observableProperty(null,
            function hasEdits_get() {
                /// <returns type="Boolean" />
                return !!this._.__hasEdits;
            }
        ),

        discardChanges: discardChanges,
        _findModel: _findModel
    });

    msls_initEntityDetails =
    function initEntityDetails(entityDetails, owner) {
        entityDetails.entity = owner;
        if (!msls_loadedEntityData) {
            entityDetails._ = {
                __entityState: _EntityState.added
            };
        } else {
            entityDetails._ = msls_loadedEntityData;
        }
    };

    function popEditingScopeForCancel(
        entity,
        details,
        entityState,
        data,
        currentChangeSetIndex) {

        $.each(details.properties.all(), function (index, property) {

            if (!(property instanceof _TrackedProperty)) {
                return;
            }

            var entry = property._entry,
                serviceName = entry.serviceName,
                isEditedName,
                propertyChanged = false,
                propertyFirstChanged = false,
                navigationData,
                model,
                newRelatedEntity;

            if (property instanceof _StorageProperty) {
                propertyChanged = data.hasOwnProperty(serviceName);
                if (propertyChanged) {
                    delete data[serviceName];
                    isEditedName = getIsEditedName(serviceName);
                    propertyFirstChanged = data.hasOwnProperty(isEditedName);
                    if (propertyFirstChanged) {
                        delete data[isEditedName];
                    }
                }
            } else {
                navigationData = tryGetNavigationPropertyData(
                    details, property);
                propertyChanged = isReferencePropertyChangedInChangeSet(navigationData, currentChangeSetIndex);
                if (propertyChanged) {
                    model = navigationData.model;
                    newRelatedEntity = navigationData.linkSet.cancelReferenceChanges(model.fromEnd.name, entity, model.toEnd.name);
                    propertyFirstChanged = isReferencePropertyFirstChangedInChangeSet(navigationData, currentChangeSetIndex);

                    navigationData.value = newRelatedEntity;
                    navigationData.state = navigationPropertyState.loaded;
                    if (propertyFirstChanged) {
                        navigationData.changeInfo = null;
                    } else {
                        navigationData.changeInfo.changeSetIndices.pop();
                    }
                }
            }

            if (propertyChanged) {
                entity.dispatchChange(entry.name);
                property.dispatchChange("value");
                if (propertyFirstChanged) {
                    if (entityState !== _EntityState.added) {
                        property.dispatchChange("originalValue");
                        property.dispatchChange("isChanged");
                    }
                    property.dispatchChange("isEdited");
                }
            }
        });
        popEditingScope(details);
    }

    msls_Entity_cancelNestedChanges =
    function cancelNestedChanges(details) {
        var entity = details.entity,
            entityState = details.entityState,
            hasEdits = details.hasEdits,
            entitySet = details.entitySet,
            dataServiceDetails = entitySet.dataService.details,
            dataWorkspaceDetails = dataServiceDetails.dataWorkspace.details,
            lastChangeSetIndex = dataWorkspaceDetails._nestedChangeSets.length - 1,
            data = details._,
            currentChangeSetIndex = data.__changeSetIndex;

        if (entityState === _EntityState.unchanged || entityState === _EntityState.discarded ||
            (lastChangeSetIndex >= 0 && currentChangeSetIndex !== lastChangeSetIndex)) {
            return;
        }

        if (entityState === _EntityState.added) {
            if (data.__parent) {
                popEditingScopeForCancel(
                    entity, details, entityState, data, currentChangeSetIndex);
            } else {
                removeAddedEntity(details, entitySet);
                if (data.__hasEdits) {
                    data.__hasEdits = false;
                }
                data.__entityState = _EntityState.discarded;
                raiseRelatedEntitiesNavigationPropertiesChanged(
                    entity, details, msls_CollectionChangeAction.remove);
            }
        } else if (entityState === _EntityState.deleted) {
            popEditingScope(details);
            raiseRelatedEntitiesNavigationPropertiesChanged(
                entity, details, msls_CollectionChangeAction.add);
        } else if (entityState === _EntityState.modified) {
            popEditingScopeForCancel(
                entity, details, entityState, data, currentChangeSetIndex);
        }
        msls_DataWorkspace_updateNestedChangeCount(
            dataWorkspaceDetails, lastChangeSetIndex, -1);
        if (details.hasEdits !== hasEdits) {
            details.dispatchChange("hasEdits");
        }
        if (entityState !== details.entityState) {
            details.dispatchChange("entityState");
            if (--dataServiceDetails._changeCount === 0) {
                dataServiceDetails.dispatchChange("hasChanges");
            }
            dataServiceDetails.dispatchEvent("contentchange", details.entity);
        }
    };

    msls_Entity_acceptNestedChanges =
    function acceptNestedChanges(details) {
        var entityState = details.entityState,
            entitySet = details.entitySet,
            dataServiceDetails = entitySet.dataService.details,
            dataWorkspaceDetails = dataServiceDetails.dataWorkspace.details,
            lastChangeSetIndex = dataWorkspaceDetails._nestedChangeSets.length - 1,
            data = details._,
            currentChangeSetIndex = data.__changeSetIndex,
            parentChangeSetIndex = currentChangeSetIndex - 1,
            parentData = data.__parent,
            navigationData, changeSetIndices, changeSetIndicesLength, model;

        if (entityState === _EntityState.unchanged || entityState === _EntityState.discarded ||
            (lastChangeSetIndex >= 0 && currentChangeSetIndex !== lastChangeSetIndex)) {
            return false;
        }

        if (entityState === _EntityState.modified ||
            entityState === _EntityState.added) {
            $.each(details.properties.all(), function (index, property) {
                if (!(property instanceof _ReferenceProperty)) {
                    return;
                }

                navigationData = tryGetNavigationPropertyData(details, property);
                if (isReferencePropertyChangedInChangeSet(navigationData, currentChangeSetIndex)) {
                    model = navigationData.model;
                    navigationData.linkSet.acceptReferenceChanges(model.fromEnd.name, details.entity, model.toEnd.name);
                    changeSetIndices = navigationData.changeInfo.changeSetIndices;
                    changeSetIndices.pop();
                    changeSetIndicesLength = changeSetIndices.length;
                    if ((changeSetIndicesLength === 0 &&
                         parentChangeSetIndex > -1) ||
                        (changeSetIndicesLength > 0 &&
                         changeSetIndices[changeSetIndicesLength - 1] !== parentChangeSetIndex)) {
                        changeSetIndices.push(parentChangeSetIndex);
                    }
                    if (changeSetIndices.length === 0) {
                        navigationData.changeInfo.changeSetIndices = null;
                    }
                }
            });
        }

        if ((entityState === _EntityState.added && !parentData) ||
            entityState === _EntityState.deleted ||
            parentData.__changeSetIndex !== parentChangeSetIndex) {
            data.__changeSetIndex--;
            return true;
        } else {
            delete data.__parent;
            delete data.__changeSetIndex;
            $.each(data, function (propertyName, propertyValue) {
                if (data.hasOwnProperty(propertyName)) {
                    parentData[propertyName] = propertyValue;
                }
            });
            details._ = parentData;
            return false;
        }
    };

    function deleteEntity() {
        /// <summary>
        /// Deletes this entity.
        /// </summary>
        var details = this.details,
            entitySet = details.entitySet,
            dataServiceDetails = entitySet.dataService.details,
            entityState = details.entityState;

        if (entityState === _EntityState.added || entityState === _EntityState.modified) {
            details.discardChanges();
            entityState = details.entityState;
        }

        if (entityState === _EntityState.unchanged) {
            ensurePending(details, _EntityState.deleted);
            dataServiceDetails.dispatchEvent("contentchange", this);
            raiseRelatedEntitiesNavigationPropertiesChanged(this, details, msls_CollectionChangeAction.remove);
        }
    }

    msls_mixIntoExistingClass(_Entity, {
        deleteEntity: deleteEntity
    });

    msls_initEntity =
    function initEntity(entity, entitySet) {
        var entityClassInstance = entity,
            entityClass = entityClassInstance.constructor,
            details = entity.details,
            dataServiceDetails, dataWorkspace, dataWorkspaceDetails, lastChangeSetIndex;
        if (!entitySet) {
            entitySet = msls_EntitySet_getEntitySetForEntityType(
                msls.application.dataWorkspace, entity.constructor);
        }
        details.entitySet = entitySet;
        if (details.entityState === _EntityState.added) {
            dataServiceDetails = entitySet.dataService.details;
            entitySet._addedEntities.push(entity);
            dataWorkspace = dataServiceDetails.dataWorkspace;
            dataWorkspaceDetails = dataWorkspace.details;
            lastChangeSetIndex = dataWorkspaceDetails._nestedChangeSets.length - 1;

            details._.__changeSetIndex = lastChangeSetIndex;
            msls_DataWorkspace_updateNestedChangeCount(dataWorkspaceDetails, lastChangeSetIndex, 1);

            if (++dataServiceDetails._changeCount === 1) {
                dataServiceDetails.dispatchChange("hasChanges");
            }
            dataServiceDetails.dispatchEvent("contentchange", entity);
            if (entityClass.created) {
                entityClass.created.call(null, entity);
            }
        }
    };

    function makeEntityDetails(entityClass) {
        function EntityDetails(owner) {
            /// <summary>
            /// Represents the details for an entity.
            /// </summary>
            /// <param name="owner">
            /// The entity that owns this details object.
            /// </param>
            /// <field name="properties">
            /// Gets the set of property objects for the entity.
            /// </field>
            _EntityDetails.call(this, owner);
        }
        return EntityDetails;
    }

    function getStoragePropertyValue(
        details) {
        return details._[this.serviceName];
    }

    function ensurePending(details, targetState) {

        var dataServiceDetails = details.entitySet.dataService.details,
            dataWorkspaceDetails = dataServiceDetails.dataWorkspace.details,
            data = details._,
            lastChangeSetIndex = dataWorkspaceDetails._nestedChangeSets.length - 1,
            entityState = details.entityState,
            entityUnchanged = entityState === _EntityState.unchanged,
            entityBeingModifiedOutOfScope =
                targetState === _EntityState.modified &&
                data.__changeSetIndex !== lastChangeSetIndex,
            newData;


        if (entityUnchanged || entityBeingModifiedOutOfScope) {
            newData = Object.create(data);
            newData.__parent = data;
            newData.__changeSetIndex = lastChangeSetIndex;
            details._ = newData;

            msls_DataWorkspace_updateNestedChangeCount(
                dataWorkspaceDetails, lastChangeSetIndex, 1);

            if (entityUnchanged) {
                if (!data.__parent) {
                    newData.__original = data;
                }
                newData.__entityState = targetState;
                newData.__hasEdits = true;

                details.dispatchChange("entityState");
                details.dispatchChange("hasEdits");
                if (++dataServiceDetails._changeCount === 1) {
                    dataServiceDetails.dispatchChange("hasChanges");
                }
            }

            data = details._;
        }
        if (!data.__hasEdits) {
            data.__hasEdits = true;
            details.dispatchChange("hasEdits");
        }
    }

    function raiseTrackedPropertyChangedEvents(details, entry, isFirstEdit, property) {
        var dataServiceDetails = details.entitySet.dataService.details,
            propertyName = entry.name;
        if (!property) {
            property = details.properties[propertyName];
        }

        if (isFirstEdit) {
            property.dispatchChange("isEdited");
            if (details.entityState !== _EntityState.added) {
                property.dispatchChange("isChanged");
                property.dispatchChange("originalValue");
            }
        }
        property.dispatchChange("value");
        details.entity.dispatchChange(propertyName);
        dataServiceDetails.dispatchEvent("contentchange", property);
    }

    function setStoragePropertyValue(details, value) {
        var data = details._,
            isFirstEdit = false,
            property = details.properties[this.name],
            serviceName = this.serviceName,
            entityState = details.entityState;
        if (entityState === _EntityState.deleted ||
            entityState === _EntityState.discarded) {
            return;
        }
        ensurePending(details, _EntityState.modified);
        data = details._;
        isFirstEdit = !property.isEdited;
        data[serviceName] = value;
        if (isFirstEdit) {
            data[getIsEditedName(serviceName)] = true;
        }
        raiseTrackedPropertyChangedEvents(
            details,
            this,
            isFirstEdit,
            property);
    }

    function getNavigationPropertyValue(details) {
        var data = getNavigationPropertyData(details, this),
            model = data.model;
        if (!getIsLoaded(details, data)) {
            return details.properties[this.name].load();
        } else {
            return WinJS.Promise.as(
                getNavigationPropertyValueWithoutLoading(details, this, data));
        }
    }

    function setReferencePropertyBaseValue(
        details, entry,
        value, operation, setter) {

        var entityState = details.entityState,
            data = getNavigationPropertyData(details, entry),
            valueEntityState;

        if (entityState === _EntityState.deleted ||
            entityState === _EntityState.discarded) {
            return;
        }

        if (value) {
            valueEntityState = value.details.entityState;
            if (valueEntityState === _EntityState.deleted || valueEntityState === _EntityState.discarded) {
                msls_throwArgumentError(
                    msls_getResourceString("entity_setReferencePropertyValue_DeletedDiscarded"),
                    value, "value");
            }
        }

        if (getIsLoaded(details, data)) {
            setter(details, entry, entityState, data, value);
            operation.complete();
        } else {
            details.properties[entry.name].load().then(function () {
                setter(details, entry, entityState, data, value);
                operation.complete();
            });
        }
    }

    function setReferencePropertyValueCore(
        details, entry,
        entityState, data,
        value) {

        var model = data.model,
            changeInfo = data.changeInfo,
            isFirstEdit = !changeInfo,
            originalEntity,
            currentChangeSetIndex,
            changeSetIndices, changeSetIndicesLength;

        ensurePending(details, _EntityState.modified);

        originalEntity = data.linkSet.setReferenceLink(model.fromEnd.name, details.entity, model.toEnd.name, value);
        data.value = value;
        data.state = navigationPropertyState.loaded;
        if (!changeInfo) {
            changeInfo = data.changeInfo = {
                originalEntity: originalEntity,
                changeSetIndices: []
            };
        }

        currentChangeSetIndex = details._.__changeSetIndex;

        changeSetIndices = changeInfo.changeSetIndices;
        if (!changeSetIndices) {
            changeSetIndices = changeInfo.changeSetIndices = [];
        }

        changeSetIndicesLength = changeSetIndices.length;
        if (changeSetIndicesLength === 0 ||
            changeSetIndices[changeSetIndicesLength - 1] !== currentChangeSetIndex) {
            changeSetIndices.push(currentChangeSetIndex);
        }

        raiseTrackedPropertyChangedEvents(
            details, entry, isFirstEdit);
    }

    function setReferencePropertyValue(details, value, operation) {
        setReferencePropertyBaseValue(
            details, this,
            value, operation, setReferencePropertyValueCore);
    }

    function rawGetNavigationPropertyValue(
        details,
        entry) {
        return getNavigationPropertyValueWithoutLoading(
            details,
            entry,
            getNavigationPropertyData(details, entry));
    }

    function setVirtualReferencePropertyValueCore(
        details, entry,
        entityState, data,
        value) {

        setReferencePropertyValueCore(details, entry, entityState, data, value);

        var entity = details.entity,
            fromASEProperties,
            toASEProperties,
            fromKeyProperty,
            toKeyProperty;

        msls_iterate(data.associationSet.ends).each(function () {
            if (this.name === data.model.fromEnd.name) {
                fromASEProperties = this.properties;
            } else {
                toASEProperties = this.properties;
            }
        });

        fromASEProperties.forEach(function (fromASEProperty, index) {
            fromKeyProperty = fromASEProperty.entityProperty;
            toKeyProperty = toASEProperties[index].entityProperty;

            entity[msls_getProgrammaticName(fromKeyProperty.name)] = value ?
                value[msls_getProgrammaticName(toKeyProperty.name)] :
                null;
        });
    }

    function setVirtualReferencePropertyValue(details, value, operation) {
        setReferencePropertyBaseValue(
            details, this,
            value, operation, setVirtualReferencePropertyValueCore);
    }

    function defineEntity(constructor, properties) {
        /// <summary>
        /// Classifies a constructor function as an entity class.
        /// </summary>
        /// <param name="constructor" type="Function">
        /// A constructor function.
        /// </param>
        /// <param name="properties" type="Array">
        /// An array of property descriptors.
        /// </param>
        /// <returns type="Function">
        /// The constructor function classified as an entity class.
        /// </returns>
        var entityClass = constructor,
            details = makeEntityDetails(constructor),
            mixInContent = {};

        msls_defineClassWithDetails(null, null,
            constructor, details, _Entity);

        if (properties) {
            properties.forEach(function (entry) {
                var cEntry,
                    entryName = entry.name;
                entry.serviceName = entryName;
                if (typeof entry.kind !== "string") {
                    entry.kind = "storage";
                }
                switch (entry.kind) {
                    case "storage":
                        if (!entry.type) {
                            entry.type = String;
                        }
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _StorageProperty);
                        entry.getValue = getStoragePropertyValue;
                        entry.setValue = setStoragePropertyValue;
                        break;
                    case "reference":
                    case "virtualReference":
                        if (!entry.type) {
                            entry.type = _Entity;
                        }
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _ReferenceProperty);
                        entry.async = true;
                        entry.getValue = getNavigationPropertyValue;
                        if (entry.kind === "reference") {
                            entry.setValue = setReferencePropertyValue;
                        } else {
                            entry.setValue = setVirtualReferencePropertyValue;
                        }
                        break;
                    case "collection":
                    case "virtualCollection":
                        entry.type = _EntityCollection;
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _CollectionProperty);
                        entry.async = true;
                        entry.getValue = getNavigationPropertyValue;
                        entry.rawGet = rawGetNavigationPropertyValue;
                        break;
                }
                entry.get = function () {
                    return entry.getValue(this.details);
                };
                if (window.intellisense && entry.async) {
                    intellisense.annotate(entry.get, function () {
                        /// <summary>
                        /// Asynchronously gets the value of a property.
                        /// </summary>
                        /// <returns type="WinJS.Promise">
                        /// An object that promises to provide the value.
                        /// </returns>
                    });
                }
                if (entry.setValue) {
                    if (entry.async) {
                        entry.set = function (value, operation) {
                            entry.setValue(this.details, value, operation);
                        };
                    } else {
                        entry.set = function (value) {
                            entry.setValue(this.details, value);
                        };
                    }
                }
            });
            msls_mixIntoExistingClass(entityClass, mixInContent);
        }
        return entityClass;
    }

    msls_expose("EntityState", _EntityState);
    msls_expose("Entity", _Entity);
    msls_expose("EntityCollection", _EntityCollection);
    msls_expose("_defineEntity", defineEntity);

}());

(function () {

    var _Link = msls.Link,
        _LinkState = msls.LinkState,
        _LinkSet = msls.LinkSet,
        _EntityState = msls.EntityState;

    function getLastLinkStateData(states) {
        var stateData;
        if (states.length > 0) {
            stateData = states[states.length - 1];
        }
        return stateData;
    }

    msls_mixIntoExistingClass(_Link, {
        state: msls_accessorProperty(function state_get() {
            var states = this._states;
            if (states) {
                return getLastLinkStateData(states).state;
            } else {
                return _LinkState.unchanged;
            }
        })
    });

    function createLinkStateData(state, changeSetIndex) {
        return { state: state, changeSetIndex: changeSetIndex };
    }

    msls_initLink =
    function initLink(link, end1, endEntity1, end2, endEntity2, state, changeSetIndex) {

        link[end1] = endEntity1;
        link[end2] = endEntity2;

        if (state === _LinkState.added) {
            link._states = [];
            link._states.push(createLinkStateData(state, changeSetIndex));
        }
    };

    function getLinkIdCore(entity1Details, entity2Details) {

        return entity1Details._.__metadata.uri + " " +
               entity2Details._.__metadata.uri;
    }

    function getLinkId(me, end1, entity1Details, end2, entity2Details) {
        var firstEntityDetails, secondEntityDetails;
        if (end1 === me._endNames[0]) {
            firstEntityDetails = entity1Details,
            secondEntityDetails = entity2Details;
        } else {
            firstEntityDetails = entity2Details;
            secondEntityDetails = entity1Details;
        }
        return getLinkIdCore(firstEntityDetails, secondEntityDetails);
    }

    function attachLink(end1, entity1, end2, entity2) {
        var loadedLinks = this._loadedLinks,
            linkId = getLinkId(this, end1, entity1.details, end2, entity2.details),
            link = loadedLinks[linkId];
        if (!link) {
            loadedLinks[linkId] = new _Link(end1, entity1, end2, entity2, _LinkState.unchanged);
        }
    }

    function each(me, callback, reverseAddedLinks) {
        var addedLinks = me._addedLinks,
            continueNext = true;
        if (reverseAddedLinks) {
            for (var j = addedLinks.length - 1; j >= 0; j--) {
                continueNext = callback(addedLinks[j], j);
                if (continueNext === false) {
                    break;
                }
            }
        } else {
            $.each(addedLinks, function (i, link) {
                continueNext = callback(link, i);
                return continueNext;
            });
        }
        if (continueNext !== false) {
            $.each(me._loadedLinks, function (i, link) {
                continueNext = callback(link, i);
                return continueNext;
            });
        }
    }

    function getTargetEntitiesCore(me, fromEnd, fromEntity, toEnd, firstOrDefault) {
        var result = [], toEntity, toEntityState;
        each(me, function (link) {
            if (link[fromEnd] === fromEntity &&
                (link.state === _LinkState.added ||
                 link.state === _LinkState.unchanged)) {
                toEntity = link[toEnd];
                toEntityState = toEntity.details.entityState;
                if (toEntityState !== _EntityState.deleted &&
                    toEntityState !== _EntityState.discarded) {
                    result.push(toEntity);
                }
                return !firstOrDefault;
            }
            return true;
        });
        return result;
    }

    function getTargetEntities(fromEnd, fromEntity, toEnd) {
        return getTargetEntitiesCore(
            this, fromEnd, fromEntity, toEnd);
    }

    function getTargetEntity(fromEnd, fromEntity, toEnd) {
        return getTargetEntitiesCore(
            this, fromEnd, fromEntity, toEnd, true)[0];
    }

    function getAddedEntities(fromEnd, fromEntity, toEnd) {
        var results = [];
        this._addedLinks.forEach(function (link) {
            if (link[fromEnd] === fromEntity) {
                results.push(link[toEnd]);
            }
        });
        return results;
    }

    function hasLinks(fromEnd, fromEntity) {
        var linkFound = false;
        each(this, function (link) {
            linkFound = (link[fromEnd] === fromEntity);
            return !linkFound;
        });
        return linkFound;
    }

    function setLinkState(link, state, changeSetIndex) {

        var states = link._states,
            stateData;
        if (!states) {
            states = link._states = [];
        }
        stateData = getLastLinkStateData(states);
        if (!!stateData && stateData.changeSetIndex === changeSetIndex) {
            stateData.state = state;
        } else {
            states.push(createLinkStateData(state, changeSetIndex));
        }
    }

    function setReferenceLink(fromEnd, fromEntity, toEnd, toEntity) {

        var
        changeSetIndex = fromEntity.details._.__changeSetIndex,
        toPropertyName = this._propertyNames[toEnd],
        existingLoadedLink,
        existingAddedLink,
        activeLink,
        originalEntity;

        each(this, function (link) {
            if (link[fromEnd] === fromEntity) {
                if (link[toEnd] === toEntity) {
                    if (link.state === _LinkState.unchanged || link.state === _LinkState.deleted) {
                        existingLoadedLink = link;
                    } else {
                        existingAddedLink = link;
                    }
                }
                if (link.state === _LinkState.unchanged || link.state === _LinkState.added) {
                    activeLink = link;
                }
            }
            return !(existingLoadedLink && existingAddedLink && activeLink);
        });

        if (!!activeLink) {
            if (activeLink.state === _LinkState.unchanged) {
                setLinkState(activeLink, _LinkState.deleted, changeSetIndex);
                originalEntity = activeLink[toEnd];
            } else {
                setLinkState(activeLink, _LinkState.discarded, changeSetIndex);
            }
            msls_Entity_raiseNavigationPropertyChanged(
                activeLink[toEnd], toPropertyName, msls_CollectionChangeAction.remove, fromEntity);
        }
        if (toEntity) {
            if (!!existingAddedLink) {
                setLinkState(existingAddedLink, _LinkState.added, changeSetIndex);
            } else {
                if (!!existingLoadedLink && existingLoadedLink.state === _LinkState.unchanged) {
                    setLinkState(existingLoadedLink, _LinkState.deleted, changeSetIndex);
                }
                this._addedLinks.push(new _Link(fromEnd, fromEntity, toEnd, toEntity, _LinkState.added, changeSetIndex));
            }
            msls_Entity_raiseNavigationPropertyChanged(
                toEntity, toPropertyName, msls_CollectionChangeAction.add, fromEntity);
        }

        return originalEntity;
    }

    function discardReferenceChanges(fromEnd, fromEntity, toEnd) {
        var me = this,
            toPropertyName = me._propertyNames[toEnd],
            state;
        each(me, function (link, i) {
            if (link[fromEnd] === fromEntity) {
                state = link.state;


                if (state === _LinkState.added || state === _LinkState.discarded) {
                    me._addedLinks.splice(i, 1);
                    if (state === _LinkState.added) {
                        msls_Entity_raiseNavigationPropertyChanged(
                            link[toEnd], toPropertyName, msls_CollectionChangeAction.remove, fromEntity);
                    }
                } else if (state === _LinkState.deleted) {
                    link._states = null;
                    msls_Entity_raiseNavigationPropertyChanged(
                        link[toEnd], toPropertyName, msls_CollectionChangeAction.add, fromEntity);
                }
            }
        }, true);
    }

    function cancelReferenceChanges(fromEnd, fromEntity, toEnd) {
        var me = this,
            toPropertyName = me._propertyNames[toEnd],
            stateData, state,
            addedLink,
            newRelatedEntity, cancelResult;

        each(me, function (link, i) {
            if (link[fromEnd] === fromEntity) {

                stateData = getLastLinkStateData(link._states);
                if (stateData.changeSetIndex === fromEntity.details._.__changeSetIndex) {
                    state = stateData.state;

                    if (state === _LinkState.added || state === _LinkState.discarded) {
                        if (state === _LinkState.added) {

                            addedLink = link;
                        }

                        cancelResult = cancelLink(me, fromEntity, toEnd, toPropertyName, link, i, state);
                        if (cancelResult) {
                            newRelatedEntity = cancelResult;
                        }
                    } else {


                        link._states = null;
                        newRelatedEntity = link[toEnd];
                    }
                }
            }
        }, true);

        if (addedLink) {
            msls_Entity_raiseNavigationPropertyChanged(
                addedLink[toEnd], toPropertyName, msls_CollectionChangeAction.remove, fromEntity);
        }

        if (newRelatedEntity) {
            msls_Entity_raiseNavigationPropertyChanged(
                newRelatedEntity, toPropertyName, msls_CollectionChangeAction.add, fromEntity);
        }

        return newRelatedEntity;
    }

    function cancelLink(me, fromEntity, toEnd, toPropertyName, link, index, linkState) {

        var states = link._states,
            newRelatedEntity;
        if (states.length === 1) {
            me._addedLinks.splice(index, 1);
            states = null;
        } else {
            states.pop();
        }
        if (!!states && link.state === _LinkState.added) {
            newRelatedEntity = link[toEnd];
        }
        return newRelatedEntity;
    }

    function acceptReferenceChanges(fromEnd, fromEntity, toEnd) {
        var states,
            stateData,
            currentIndex,
            parentIndex;

        each(this, function (link) {
            if (link[fromEnd] === fromEntity) {
                states = link._states;

                stateData = getLastLinkStateData(states);
                currentIndex = stateData.changeSetIndex;
                if (currentIndex === fromEntity.details._.__changeSetIndex) {

                    if (states.length > 1) {
                        parentIndex = states.length - 2;
                        if (states[parentIndex].changeSetIndex === currentIndex - 1) {
                            states.splice(parentIndex, 1);
                        }
                    }

                    stateData.changeSetIndex -= 1;
                }
            }
        });
    }

    function resetAfterSave() {
        var me = this,
            end1 = me._endNames[0],
            end2 = me._endNames[1],
            loadedLinks = me._loadedLinks;

        each(me, function (link, i) {

            var entity1, entity2,
                entity1Details, entity2Details;

            switch (link.state) {
                case _LinkState.added:

                    entity1 = link[end1];
                    entity2 = link[end2];
                    entity1Details = entity1.details;
                    entity2Details = entity2.details;

                    if (entity1Details.entityState === _EntityState.unchanged &&
                        entity2Details.entityState === _EntityState.unchanged) {
                        link._states = null;
                        loadedLinks[getLinkIdCore(entity1Details, entity2Details)] = link;
                    }
                    break;

                case _LinkState.deleted:

                    delete loadedLinks[i];
                    break;

                default:
                    break;
            }
        });

        me._addedLinks.length = 0;
    }

    msls_mixIntoExistingClass(_LinkSet, {
        attachLink: attachLink,
        getTargetEntities: getTargetEntities,
        getTargetEntity: getTargetEntity,
        getAddedEntities: getAddedEntities,
        hasLinks: hasLinks,
        setReferenceLink: setReferenceLink,
        discardReferenceChanges: discardReferenceChanges,
        cancelReferenceChanges: cancelReferenceChanges,
        acceptReferenceChanges: acceptReferenceChanges,
        resetAfterSave: resetAfterSave
    });

    msls_initLinkSet =
    function initLinkSet(linkSet, endNames, propertyNames) {
        msls_setProperty(linkSet, "_endNames", endNames);
        msls_setProperty(linkSet, "_propertyNames", propertyNames);
        msls_setProperty(linkSet, "_loadedLinks", {});
        msls_setProperty(linkSet, "_addedLinks", []);
    };

}());

var msls_relativeDates_now;

(function () {
    var monthsPerQuarter = 3;

    msls_relativeDates_now = function () {
        return new Date();
    };

    function addMilliseconds(date, value) {
        date.setMilliseconds(date.getMilliseconds() + value);
    }

    function addDays(date, value) {
        addMilliseconds(date, value * 86400000);
    }

    msls_addToInternalNamespace("relativeDates", {
        now: function now() {
            /// <summary>
            /// Returns the current date and time.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the current date and time on this computer.
            /// </returns>
            return msls_relativeDates_now();
        },
        today: function today() {
            /// <summary>
            /// Returns the current date.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the current date on this computer.
            /// </returns>
            var result = this.now();
            result.setHours(0);
            result.setMinutes(0);
            result.setSeconds(0);
            result.setMilliseconds(0);
            
            return result;
        },
        endOfDay: function endOfDay() {
            /// <summary>
            /// Returns the date and time for the end of the current day.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the last moment in time of the current day.
            /// </returns>
            var result = this.now();
            result.setHours(23);
            result.setMinutes(59);
            result.setSeconds(59);
            result.setMilliseconds(999);

            return result;
        },
        startOfWeek: function startOfWeek() {
            /// <summary>
            /// Returns the date and time for the start of this week.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the first moment in time
            /// of the start of this week.
            /// </returns>
            var result = this.today();
            addDays(result, 0 - result.getDay());

            return result;
        },
        endOfWeek: function endOfWeek() {
            /// <summary>
            /// Returns the date and time for the end of this week.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the last moment in time
            /// of the end of this week.
            /// </returns>
            var result = this.startOfWeek();
            addDays(result, 7);
            addMilliseconds(result, -1);

            return result;
        },
        startOfMonth: function startOfMonth() {
            /// <summary>
            /// Returns the date and time for the start of this month.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the first moment in time
            /// of the start of this month.
            /// </returns>
            var result = this.today();
            result.setDate(1);

            return result;
        },
        endOfMonth: function endOfMonth() {
            /// <summary>
            /// Returns the date and time for the end of this month.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the last moment in time
            /// of the end of this month.
            /// </returns>
            var result = this.startOfMonth();
            result.setMonth(result.getMonth() + 1);
            addMilliseconds(result, -1);

            return result;
        },
        startOfQuarter: function startOfQuarter() {
            /// <summary>
            /// Returns the date and time for the start of this quarter.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the first moment in time
            /// of the start of this quarter.
            /// </returns>
            var result = this.startOfMonth(),
                month = result.getMonth();
            result.setMonth(month - month % monthsPerQuarter);

            return result;
        },
        endOfQuarter: function endOfQuarter() {
            /// <summary>
            /// Returns the date and time for the end of this quarter.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the last moment in time
            /// of the end of this quarter.
            /// </returns>
            var result = this.startOfMonth(),
                month = result.getMonth();
            result.setMonth(month - month % monthsPerQuarter + monthsPerQuarter);
            addMilliseconds(result, -1);

            return result;
        },
        startOfYear: function startOfYear() {
            /// <summary>
            /// Returns the date and time for the start of this year.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the first moment in time
            /// of the start of this year.
            /// </returns>
            var result = this.today();
            result.setMonth(0, 1);

            return result;
        },
        endOfYear: function endOfYear() {
            /// <summary>
            /// Returns the date and time for the end of this year.
            /// </summary>
            /// <returns type="Date">
            /// A Date that is set to the last moment in time
            /// of the end of this year.
            /// </returns>
            var result = this.startOfYear();
            result.setFullYear(result.getFullYear() + 1);
            addMilliseconds(result, -1);

            return result;
        },
    });
    if (window.intellisense) {
        (function () {
            /// <returns>
            /// Contains the implementation of globally-defined relative dates.
            /// </returns>
            return msls.relativeDates;
        }());
    }

    msls_expose("relativeDates", msls.relativeDates);
}());

var msls_validate;

(function () {

    var validators;

    function validateLength(modelItem, property, id, value) {
        var validationResult,
            attribute = msls_getAttribute(modelItem, ":@MaxLength");

        if (attribute) {
            var propValue = value,
                message;

            if (!!propValue && !!propValue.length && propValue.length > attribute.value) {
                message = msls_getResourceString("validation_max_length_1args", attribute.value);
                validationResult = new msls_ValidationResult(property, message);
            }
        }

        return validationResult;
    }

    function validateRequired(modelItem, property, id, value) {
        var validationResult,
            attribute = msls_getAttribute(modelItem, ":@Required");

        if (attribute) {
            if (value === undefined || value === null) {
                validationResult = new msls_ValidationResult(property, msls_getResourceString("validation_required"));
            }
        }

        return validationResult;
    }

    function validateRange(modelItem, property, id, value) {
        var validationResult,
            attribute = msls_getAttribute(modelItem, ":@Range"),
            propValue,
            dateValue,
            minValue,
            maxValue,
            message;

        if (attribute) {

            if (id !== builtInModule.dateId && id !== builtInModule.dateTimeId) {
                if (!!value) {
                    propValue = parseFloat(value);

                    if (propValue < attribute.minimum || propValue > attribute.maximum) {
                        message = msls_getResourceString("validation_range_2args", attribute.minimum, attribute.maximum);
                        validationResult = new msls_ValidationResult(property, message);
                    }
                }
            } else {
                dateValue = new Date(value);
                minValue = new Date(attribute.minimum);
                maxValue = new Date(attribute.maximum);

                if (!!dateValue && (dateValue.getTime() < minValue.getTime() || dateValue.getTime() > maxValue.getTime())) {
                    message = msls_getResourceString("validation_range_2args", attribute.minimum, attribute.maximum);
                    validationResult = new msls_ValidationResult(property, message);
                }
            }
        }

        return validationResult;
    }

    validators = {
        ":@MaxLength": validateLength,
        ":@Required": validateRequired,
        ":@Range": validateRange
    };

    msls_validate =
    function validate(property, value) {


        var results = [],
            validationResult,
            validator,
            propDef = property.getModel();

        if (!property.isReadOnly) {
            for (var attributeName in propDef) {

                validator = validators[attributeName];

                if (!!validator) {
                    validationResult = validator(propDef, property, propDef.propertyType.id, value);

                    if (!!validationResult) {
                        results.push(validationResult);
                    }
                }
            }
        }
        return results;
    };

}());

var msls_DataService_cancelNestedChanges,
    msls_DataService_acceptNestedChanges;

(function () {

    var _DataService = msls.DataService,
        _DataServiceDetails = _DataService.Details,
        _EntitySetProperty,
        _EntitySet = msls.EntitySet,
        _DataServiceQuery = msls.DataServiceQuery,
        _EntityState = msls.EntityState,
        _TrackedProperty = msls.Entity.Details.TrackedProperty,
        _StorageProperty = msls.Entity.Details.StorageProperty;

    msls_setProperty(msls, "queryable", {

        filter: function filter(expression) {
            /// <summary>
            /// Filters results using an expression defined
            /// by the OData $filter system query option.
            /// </summary>
            /// <param name="expression" type="String">
            /// An OData filter expression.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_filter", expression);
            return q;
        },

        orderBy: function orderBy(propertyName) {
            /// <summary>
            /// Orders results by a property in ascending order.
            /// </summary>
            /// <param name="propertyName" type="String">
            /// A property name.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_orderBy", propertyName);
            return q;
        },

        orderByDescending: function orderByDescending(propertyName) {
            /// <summary>
            /// Orders results by a property in descending order.
            /// </summary>
            /// <param name="propertyName" type="String">
            /// A property name.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_orderBy", propertyName + " desc");
            return q;
        },

        thenBy: function thenBy(propertyName) {
            /// <summary>
            /// Further orders results by a property in ascending order.
            /// </summary>
            /// <param name="propertyName" type="String">
            /// A property name.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_orderBy", propertyName);
            return q;
        },

        thenByDescending: function thenByDescending(propertyName) {
            /// <summary>
            /// Further orders results by a property in descending order.
            /// </summary>
            /// <param name="propertyName" type="String">
            /// A property name.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_orderBy", propertyName + " desc");
            return q;
        },

        expand: function expand(expression) {
            /// <summary>
            /// Expands results by including additional navigation properties using
            /// an expression defined by the OData $expand system query option.
            /// </summary>
            /// <param name="expression" type="String">
            /// An OData expand expression (a comma-separated
            /// list of names of navigation properties).
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_expand", expression);
            return q;
        },

        skip: function skip(count) {
            /// <summary>
            /// Bypasses a specified number of results.
            /// </summary>
            /// <param name="count" type="Number">
            /// The number of results to skip.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_skip", count);
            return q;
        },

        top: function top(count) {
            /// <summary>
            /// Restricts results by a specified number.
            /// </summary>
            /// <param name="count" type="Number">
            /// The number of results to return.
            /// </param>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_take", count);
            return q;
        },

        includeTotalCount: function includeTotalCount() {
            /// <summary>
            /// Requests that the total result count as if the skip and top
            /// operators were not applied is returned in addition to the results.
            /// </summary>
            /// <returns type="msls.DataServiceQuery" />
            var q = new _DataServiceQuery(this);
            msls_setProperty(q, "_includeTotalCount", true);
            return q;
        }

    });

    function loadEntity(entitySet, entityData) {
        var uri = entityData.__metadata.uri,
            entity = entitySet._loadedEntities[uri];
        if (!entity) {
            msls_loadedEntityData = entityData;
            entity = new entitySet._entityType(entitySet);
            msls_loadedEntityData = null;
            entitySet._loadedEntities[uri] = entity;
        }
        return entity;
    }

    function getQueryExpandsTree(query) {
        var current = query,
            queryExpand,
            currentObject,
            result = {};

        function visitLevel(level) {

            var propertyName = msls_getProgrammaticName(level),
                nextObject = currentObject[propertyName];
            if (!nextObject) {
                nextObject = currentObject[propertyName] = {};
            }
            currentObject = nextObject;
        }

        function visitExpand(expand) {

            currentObject = result;

            expand.split("/").forEach(visitLevel);
        }

        do {
            queryExpand = current._expand;
            if (typeof queryExpand === "string") {
                queryExpand.split(",").forEach(visitExpand);
            }
            current = current._source;
        } while (current);

        return result;
    }

    function fixInclusionInQueryResult(entities, serverResults, queryExpandTree) {
        if (entities.length <= 0 || Object.keys(queryExpandTree).length <= 0) {
            return;
        }

        var firstEntity = entities[0],
            firstDetails = firstEntity.details,
            firstDetailsProperties = firstDetails.properties,
            firstProperty,
            propertyEntry,
            propertyServiceName,
            entitySet,
            targetLinkSet,
            propertyModel,
            fromEndName,
            toEndName,
            newEntities,
            newServerResults;

        function processEntity(k, entity) {
            var serverResultItem = serverResults[k][propertyServiceName],
                serverItems = serverResultItem ?
                    ($.isArray(serverResultItem.results) ? serverResultItem.results :
                        $.isArray(serverResultItem) ? serverResultItem : [serverResultItem]) :
                    [];

            $.each(serverItems, function (s, serverItem) {
                var newEntity = loadEntity(entitySet, serverItem);

                targetLinkSet.attachLink(fromEndName, entity, toEndName, newEntity);

                newServerResults.push(serverItem);
                newEntities.push(newEntity);
            });

            msls_Entity_setNavigationPropertyAvailable(entity.details, propertyEntry);

            serverResults[k][propertyServiceName] = null;
        }

        for (var propertyName in queryExpandTree) {
            if (propertyName in firstDetailsProperties) {
                firstProperty = firstDetailsProperties[propertyName];
                propertyEntry = firstProperty._entry;
                newEntities = [];
                newServerResults = [];

                if (propertyEntry.kind === "reference" || propertyEntry.kind === "collection") {
                    propertyServiceName = propertyEntry.serviceName;
                    entitySet = msls_Entity_getNavigationPropertyTargetEntitySet(firstProperty);
                    targetLinkSet = msls_Entity_getNavigationPropertyLinkSet(firstProperty);
                    propertyModel = propertyEntry.data.model;
                    fromEndName = propertyModel.fromEnd.name;
                    toEndName = propertyModel.toEnd.name;

                    $.each(entities, processEntity);

                    fixInclusionInQueryResult(newEntities, newServerResults, queryExpandTree[propertyName]);
                }
            }
        }
    }

    function convertDatesToLocal(result) {
        var property, value;
        if (Array.isArray(result)) {
            result.forEach(convertDatesToLocal);
        } else {
            for (property in result) {
                if (property === "__metadata") {
                    continue;
                }
                value = result[property];
                if (value instanceof Date) {
                    value.setMinutes(value.getMinutes() +
                        value.getTimezoneOffset());
                } else if (typeof (value) === "object") {
                    convertDatesToLocal(value);
                }
            }
        }
    }

    function createServerError(message, property, validationMessage) {
        var result = { message: message };
        if (validationMessage) {
            result.validationResult = new msls_ValidationResult(property, validationMessage);
        }
        return result;
    }

    function getServerErrors(
        response,
        dataServiceDetails) {
        var
        serverErrors = [],
        exception, nonValidationErrorMessage,
        body, bodyXML, jBodyXML, messageNode, rootPrefix, rootPrefixSelector,
        messageValue, messageXML, jMessageXML,
        validationResults, jValidationResult,
        validationResultMessage, validationResultTarget, validationResultProperty,
        entity,
        detailsProperty,
        serverErrorMessage;

        try {
            body = $.parseJSON(response.body);
            messageValue = body &&
                body.error &&
                body.error.message &&
                body.error.message.value;
        } catch (exception) {
            try {
                bodyXML = $.parseXML(response.body);
                if (bodyXML) {
                    rootPrefix = bodyXML.documentElement &&
                                 bodyXML.documentElement.prefix;
                    rootPrefixSelector = rootPrefix && rootPrefix + "\\:";
                    rootPrefixSelector = rootPrefixSelector || "";
                    jBodyXML = $(bodyXML);
                }
            }
            catch (exception) {
            }
            if (!!jBodyXML) {
                messageNode = jBodyXML.find(rootPrefixSelector + "message");
                if (!messageNode.length) {
                    messageNode = jBodyXML.find("message");
                }
                if (!!messageNode.length) {
                    messageValue = messageNode.text();
                }
            }
        }
        if (messageValue) {
            try {
                messageXML = $.parseXML(messageValue);
                if (messageXML) {
                    jMessageXML = $(messageXML);
                }
            } catch (exception) {
            }
            if (!!jMessageXML) {
                validationResults = jMessageXML.find("ValidationResult");
                if (validationResults.length > 0 && !!dataServiceDetails) {
                    $.each(validationResults, function (i, validationResult) {
                        jValidationResult = $(validationResult);
                        validationResultMessage = jValidationResult.find("Message").text();
                        validationResultTarget = jValidationResult.find("Target").text();
                        validationResultProperty = jValidationResult.find("Property").text();
                        detailsProperty = null;
                        if (validationResultTarget && validationResultProperty) {
                            $.each(dataServiceDetails._entitySets, function (j, entitySet) {
                                entity = entitySet._loadedEntities[validationResultTarget];
                                return !entity;
                            });
                            if (entity) {
                                detailsProperty = entity.details
                                .properties[msls_getProgrammaticName(validationResultProperty)];
                            }
                        }
                        serverErrorMessage = detailsProperty ?
                            detailsProperty.name + ": " + validationResultMessage :
                            validationResultMessage;
                        serverErrors.push(createServerError(
                            serverErrorMessage, detailsProperty, validationResultMessage));
                    });
                } else {
                    nonValidationErrorMessage = jMessageXML.find("Message").text() || messageValue;
                }
            } else {
                nonValidationErrorMessage = messageValue;
            }
        } else {
            nonValidationErrorMessage = response.body || response.statusCode + ": " + response.statusText;
        }

        if (!!nonValidationErrorMessage || nonValidationErrorMessage === "") {
            serverErrors.push(createServerError(nonValidationErrorMessage));
        }

        return serverErrors;
    }

    function executeQuery(query) {
        msls_mark(msls_codeMarkers.queryDataStart);

        var promise = msls_promiseOperation(function initExecuteQuery(operation) {
            var requestUri = query._requestUri,
                entitySet = query._entitySet;

            OData.read(
                {
                    requestUri: requestUri,
                    recognizeDates: true
                },
                operation.code(function success(data) {
                    msls_mark(msls_codeMarkers.queryDataEnd);

                    var results = [],
                        serverResults = data ?
                            ($.isArray(data.results) ? data.results : [data]) :
                            [],
                        queryExpandTree;

                    convertDatesToLocal(serverResults);

                    $.each(serverResults, function (index, result) {
                        if (entitySet) {
                            result = loadEntity(entitySet, result);
                        }
                        results.push(result);
                    });

                    if (results.length > 0) {
                        queryExpandTree = getQueryExpandsTree(query);
                        fixInclusionInQueryResult(results, serverResults, queryExpandTree);
                    }

                    operation.complete({
                        totalCount: data && data.__count,
                        results: results
                    });
                    msls_mark(msls_codeMarkers.queryDataApplyEnd);
                }),
                operation.code(function error(err) {
                    msls_mark(msls_codeMarkers.queryDataEnd);

                    var response,
                        serverErrors,
                        errorMessages,
                        body;
                    if (!!(response = err.response) &&
                        (serverErrors = getServerErrors(response)).length > 0) {
                        errorMessages = serverErrors
                            .map(function (serverError) {
                                return serverError.message;
                            });
                    } else {
                        errorMessages = [err.message];
                        if (!!response && !!(body = response.body)) {
                            errorMessages.push(body);
                        }
                    }

                    operation.error(errorMessages.join("\r\n"));
                })
            );
        });
        if (window.intellisense) {
            promise._$annotate(String, function QueryResult() {
                /// <field name="totalCount" type="Number">
                /// Gets the total number of results, if requested.
                /// </field>
                /// <field name="results" type="Array">
                /// Gets the array of results.
                /// </field>
            });
        }
        return promise;
    }

    msls_mixIntoExistingClass(_DataServiceQuery, msls.queryable);

    msls_DataServiceQuery_isValidSkipTop = function isValidSkipTop(value) {
        return typeof value === "number" && value > 0;
    };

    msls_mixIntoExistingClass(_DataServiceQuery, {
        execute: function execute() {
            /// <summary>
            /// Asynchronously executes this query and returns a promise
            /// that is fulfilled when the query has been executed.
            /// </summary>
            /// <returns type="WinJS.Promise">
            /// A promise that is fulfilled when the query has been executed.
            /// </returns>
            var me = this,
                current = me,
                afterQueryExecuted;
            do {
                afterQueryExecuted = current._afterQueryExecuted;
                if (msls_isFunction(afterQueryExecuted)) {
                    break;
                }
                current = current._source;
            } while (current);

            if (afterQueryExecuted) {
                return msls_promiseOperation(function initExecute(
                    operation) {
                    executeQuery(me)
                    ._thenEx(function (error, result) {
                        if (error) {
                            operation.error(error);
                        } else {
                            try {
                                afterQueryExecuted(me, result);
                            } catch (ex) {
                                operation.error(ex);
                            }
                            operation.complete(result);
                        }
                    });
                });
            } else {
                return executeQuery(me);
            }
        },
        _requestUri: msls_accessorProperty(
            function _requestUri_get() {
                var requestUri,
                    current = this, i,
                    filters = [],
                    skip,
                    take,
                    includeTotalCount,
                    orderBys = [],
                    expands = [],
                    options = [];
                do {
                    if (current._rootUri) {
                        requestUri = current._rootUri;
                        break;
                    }
                    if (typeof current._filter === "string") {
                        if (filters.length === 0) {
                            filters.unshift(current._filter);
                        } else {
                            if (filters.length === 1) {
                                filters[0] = "(" + filters[0] + ")";
                            }
                            filters.unshift("(" + current._filter + ")");
                        }
                    }
                    if (typeof current._orderBy === "string") {
                        orderBys.unshift(current._orderBy);
                    }
                    if (typeof current._expand === "string") {
                        expands.push(current._expand.replace(/\./g, "/"));
                    }
                    if (typeof skip !== "number" &&
                        msls_DataServiceQuery_isValidSkipTop(current._skip)) {
                        skip = current._skip;
                    }
                    if (typeof take !== "number" &&
                        msls_DataServiceQuery_isValidSkipTop(current._take)) {
                        take = current._take;
                    }
                    if (typeof includeTotalCount !== "boolean" &&
                        current._includeTotalCount) {
                        includeTotalCount = current._includeTotalCount;
                    }
                    current = current._source;
                } while (current);
                if (current._queryParameters) {
                    $.each(current._queryParameters, function (key, val) {
                        if (val !== "null") {
                            options.push(key.toString() + "=" + val.toString());
                        }
                    });
                }
                if (filters.length > 0) {
                    options.push("$filter=" + encodeURIComponent(filters.join(" and ")));
                }
                if (orderBys.length > 0) {
                    options.push("$orderby=" + orderBys.join(","));
                }
                if (expands.length > 0) {
                    options.push("$expand=" + expands.join(","));
                }
                if (typeof skip === "number") {
                    options.push("$skip=" + skip.toString());
                }
                if (typeof take === "number") {
                    options.push("$top=" + take.toString());
                }
                if (includeTotalCount) {
                    options.push("$inlinecount=allpages");
                }
                if (options.length > 0) {
                    requestUri += "?" + options.join("&");
                }
                return requestUri;
            }
        )
    });

    msls_initDataServiceQuery =
    function initDataServiceQuery(dataServiceQuery, source, rootUri, queryParameters) {
        msls_setProperty(dataServiceQuery, "_source", source);
        msls_setProperty(dataServiceQuery, "_entitySet", source._entitySet);
        msls_setProperty(dataServiceQuery, "_rootUri", rootUri);
        msls_setProperty(dataServiceQuery, "_queryParameters", queryParameters);
    };

    msls_mixIntoExistingClass(_EntitySet, msls.queryable);

    msls_mixIntoExistingClass(_EntitySet, {
        canInsert: msls_accessorProperty(
            function canInsert_get() {
                /// <returns type="Boolean" />
                return !!this._model.canInsert;
            }
        ),
        canUpdate: msls_accessorProperty(
            function canUpdate_get() {
                /// <returns type="Boolean" />
                return !!this._model.canUpdate;
            }
        ),
        canDelete: msls_accessorProperty(
            function canDelete_get() {
                /// <returns type="Boolean" />
                return !!this._model.canDelete;
            }
        ),
        getModel: function getModel() {
            /// <summary>
            /// Gets the model for this entity set.
            /// </summary>
            /// <returns type="Object">
            /// The model for this entity set.
            /// </returns>
            return this._model;
        },
        getEntityType: function getEntityType() {
            /// <summary>
            /// Gets the type of entity represented by this entity set.
            /// </summary>
            /// <returns type="Function">
            /// The type of entity represented by this entity set.
            /// </returns>
            return this._entityType;
        },
        load: function load() {
            /// <summary>
            /// Asynchronously loads this entity set and returns a promise
            /// that is fulfilled when the entity set has been loaded.
            /// </summary>
            /// <returns type="WinJS.Promise">
            /// A promise that is fulfilled when the entity set has been loaded.
            /// </returns>
            return executeQuery(this);
        },
        addNew: function addNew() {
            /// <summary>
            /// Adds a new entity to this entity set.
            /// </summary>
            /// <returns type="msls.Entity">
            /// The new entity.
            /// </returns>
            return new (this.getEntityType())(this);
        }
    });

    msls_initEntitySet =
    function initEntitySet(entitySet, dataService, entry) {
        var dataServiceDetails = dataService.details;
        entitySet.dataService = dataService;
        entitySet.name = entry.name;
        msls_setProperty(entitySet, "_model",
            dataServiceDetails.properties[entry.name].getModel());
        msls_setProperty(entitySet, "_entityType", entry.elementType);
        msls_setProperty(entitySet, "_requestUri",
            dataServiceDetails._serviceUri + "/" + entry.serviceName);
        msls_setProperty(entitySet, "_rootUri", entitySet._requestUri);
        msls_setProperty(entitySet, "_entitySet", entitySet);
        msls_setProperty(entitySet, "_addedEntities", []);
        msls_setProperty(entitySet, "_loadedEntities", {});
    };

    function toODataJSONFormat(data, type) {
        if (data === undefined || data === null) {
            return data;
        }

        if (type.charAt(0) !== ":") {
            type = ":" + type;
        }

        switch (type) {
            case ":Binary":
            case ":Binary?":
            case ":Decimal":
            case ":Decimal?":
            case ":Guid":
            case ":Guid?":
            case ":Int64":
            case ":Int64?":
                return data.toString();
            default:
                return data;
        }

        return;
    }

    function updateChangeRequest(
        requests, request,
        entityDetails, entityState, entityData) {

        if (entityState === _EntityState.added) {
            request.method = "POST";
            requests.newEntities.push(request);
        } else {
            request.method = "MERGE";
            requests.existingEntities.push(request);
        }

        var requestData = request.data = {},
            serviceName,
            referenceEntity,
            referenceEntityDetails,
            referenceEntityState,
            referenceEntityData,
            referenceUri,
            propDef;

        $.each(entityDetails.properties.all(), function (i, property) {
            var value;
            if (!(property instanceof _TrackedProperty)) {
                return;
            }

            serviceName = property._entry.serviceName;

            if (property instanceof _StorageProperty) {
                if (property.isChanged ||
                    (entityState === _EntityState.added && entityData.hasOwnProperty(serviceName))) {
                    propDef = property.getModel();
                    value = requestData[serviceName] = toODataJSONFormat(entityData[serviceName], propDef.propertyType.id);
                    if (value instanceof Date) {
                        value = new Date(value.valueOf());
                        value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
                        requestData[serviceName] = value;
                    }
                }
            } else if (property._entry.kind === "reference") {
                if (entityState === _EntityState.added || property.isChanged) {
                    if (entityState === _EntityState.added) {
                        referenceEntity = msls_Entity_tryGetAddedReferencePropertyValue(
                            entityDetails, property);
                    } else {
                        referenceEntity = property.value;
                    }

                    if (referenceEntity) {
                        referenceEntityDetails = referenceEntity.details;
                        referenceEntityState = referenceEntityDetails.entityState;

                        referenceEntityData = referenceEntityDetails._;
                        if (referenceEntityState === _EntityState.added) {
                            referenceUri = "$" + referenceEntityData.__contentID;
                        } else {
                            referenceUri = referenceEntityData.__metadata.uri;
                        }

                        if (entityState === _EntityState.added &&
                            referenceEntityState === _EntityState.added) {
                            requests.links.push({
                                method: "PUT",
                                requestUri: "$" + entityData.__contentID + "/$links/" + serviceName,
                                data: {
                                    uri: referenceUri
                                }
                            });
                        } else {
                            requestData[serviceName] = {
                                __metadata: {
                                    uri: referenceUri
                                }
                            };
                        }

                    } else {
                        if (entityState === _EntityState.modified) {
                            requests.links.push({
                                method: "DELETE",
                                requestUri: request.requestUri + "/$links/" + serviceName
                            });
                        }
                    }
                }
            }
        });
    }

    function initSaveChanges(dataService, operation) {

        msls_mark(msls_codeMarkers.saveDataStart);

        var dataServiceDetails = dataService.details,
            dataWorkspaceDetails = dataServiceDetails.dataWorkspace.details,
            hasNestedChangeSets,
            changes,
            requestUri = dataService.details._serviceUri + "/$batch",
            requests = {
                newEntities: [],
                existingEntities: [],
                links: []
            },
            serverErrors;

        if ((hasNestedChangeSets = dataWorkspaceDetails._nestedChangeSets.length > 0) ||
            (changes = dataService.details.getChanges()).length === 0) {
            msls_mark(msls_codeMarkers.saveDataEnd);
            if (hasNestedChangeSets) {
                msls_throwInvalidOperationError(msls_getResourceString("dataService_save_with_nested_changes"));
            } else {
                operation.complete();
                return;
            }
        }

        changes.forEach(function (entity, i) {
            entity.details._.__contentID = i.toString();
        });

        changes.forEach(function (entity) {
            var entityDetails = entity.details,
                entityState = entityDetails.entityState,
                entitySet = entityDetails.entitySet,
                entityData = entityDetails._,
                request = { recognizeDates: true },
                headers = request.headers = {},
                metadata,
                etag;

            headers["Content-ID"] = entityData.__contentID;

            if (entityState === _EntityState.added) {
                request.requestUri = entitySet._requestUri.substr(
                    dataServiceDetails._serviceUri.length + 1);
                updateChangeRequest(requests, request, entityDetails, entityState, entityData);

            } else {
                metadata = entityData.__metadata;
                request.requestUri = metadata.uri.substr(
                    dataServiceDetails._serviceUri.length + 1);
                etag = metadata.etag;
                if (etag) {
                    headers["If-Match"] = etag;
                }
                if (entityState === _EntityState.modified) {
                    updateChangeRequest(requests, request, entityDetails, entityState, entityData);

                } else if (entityState === _EntityState.deleted) {
                    request.method = "DELETE";
                    requests.existingEntities.push(request);
                }
            }
        });

        OData.request(
            {
                requestUri: requestUri,
                method: "POST",
                data: {
                    __batchRequests: [
                        {
                            __changeRequests: [].concat(
                                requests.newEntities,
                                requests.existingEntities,
                                requests.links)
                        }
                    ]
                },
                recognizeDates: true
            },
            operation.code(function success(data) {
                var changeResponses = data.__batchResponses[0].__changeResponses,
                    savedEntityEntries = [],
                    entity,
                    entityDetails;

                if (changeResponses.length === 1) {
                    var errorChangeResponse = changeResponses[0];
                    if (errorChangeResponse.response) {
                        serverErrors = getServerErrors(errorChangeResponse.response, dataServiceDetails);
                    }
                }

                if (!serverErrors) {

                    $.each(changeResponses, function (i, changeResponse) {

                        var changeResponseHeaders = changeResponse.headers,
                            headersContentID = changeResponseHeaders &&
                                changeResponseHeaders["Content-ID"],
                            savedEntityEntry,
                            entityState,
                            entitySet,
                            entityData,
                            changedProperties,
                            originalEntityData,
                            changeResponseETag;

                        if (!headersContentID) {
                            return;
                        }

                        entity = changes[parseInt(headersContentID, 10)];
                        entityDetails = entity.details;
                        entityState = entityDetails.entityState;
                        entitySet = entityDetails.entitySet;
                        entityData = entityDetails._;
                        changedProperties = [];
                        savedEntityEntry = {
                            entity: entity,
                            oldEntityState: entityState,
                            oldHasEdits: entityDetails.hasEdits
                        };

                        if (entityState === _EntityState.added) {
                            convertDatesToLocal(changeResponse.data);

                            $.each(entityDetails.properties.all(), function (j, property) {
                                if (property instanceof _StorageProperty) {
                                    if (changeResponse.data[property._entry.serviceName] !== property.value) {
                                        changedProperties.push(property);
                                    }
                                } else {
                                    msls_Entity_resetAddedNavigationPropertyAfterSave(
                                        entityDetails,
                                        property,
                                        changeResponse.data);
                                }
                            });
                            savedEntityEntry.changedProperties = changedProperties;
                            entityDetails._ = changeResponse.data;
                            entityData = entityDetails._;
                            $.each(entitySet._addedEntities, function (j) {
                                if (this === entity) {
                                    entitySet._addedEntities.splice(j, 1);
                                    return false;
                                }
                                return true;
                            });
                            entitySet._loadedEntities[entityData.__metadata.uri] = entity;
                        } else if (entityState === _EntityState.modified) {
                            originalEntityData = entityData.__original;
                            $.each(entityDetails.properties.all(), function (j, property) {
                                var serviceName;
                                if (!(property instanceof _TrackedProperty && property.isChanged)) {
                                    return;
                                }

                                if (property instanceof _StorageProperty) {
                                    serviceName = property._entry.serviceName;
                                    originalEntityData[serviceName] = entityData[serviceName];
                                } else {
                                    msls_Entity_resetModifiedReferencePropertyAfterSave(
                                        entityDetails, property);
                                }
                                changedProperties.push(property);
                            });
                            savedEntityEntry.changedProperties = changedProperties;
                            changeResponseETag = changeResponseHeaders && changeResponseHeaders.ETag;
                            if (changeResponseETag) {
                                originalEntityData.__metadata.etag = changeResponseETag;
                            }
                            entityDetails._ = originalEntityData;
                        } else if (entityState === _EntityState.deleted) {
                            delete entitySet._loadedEntities[entityData.__metadata.uri];
                            entityData.__entityState = _EntityState.discarded;
                        }
                        savedEntityEntries.push(savedEntityEntry);
                    });

                    $.each(dataServiceDetails._linkSets, function (i, linkSet) {
                        linkSet.resetAfterSave();
                    });
                    $.each(dataServiceDetails.dataWorkspace.details._linkSets, function (i, linkSet) {
                        linkSet.resetAfterSave();
                    });

                    $.each(savedEntityEntries, function (i, savedEntry) {
                        entity = savedEntry.entity;
                        entityDetails = entity.details;
                        switch (savedEntry.oldEntityState) {
                            case _EntityState.added:
                                $.each(savedEntry.changedProperties, function () {
                                    this.dispatchChange("value");
                                    entity.dispatchChange(this.name);
                                    dataServiceDetails.dispatchEvent("contentchange", this);
                                });
                                if (savedEntry.oldHasEdits) {
                                    entityDetails.dispatchChange("hasEdits");
                                }
                                entityDetails.dispatchChange("entityState");
                                break;
                            case _EntityState.modified:
                                $.each(savedEntry.changedProperties, function () {
                                    this.dispatchChange("originalValue");
                                    this.dispatchChange("isChanged");
                                    this.dispatchChange("isEdited");
                                });
                                entityDetails.dispatchChange("hasEdits");
                                entityDetails.dispatchChange("entityState");
                                break;
                            case _EntityState.deleted:
                                entityDetails.dispatchChange("hasEdits");
                                entityDetails.dispatchChange("entityState");
                                dataServiceDetails.dispatchEvent("contentchange", entity);
                                break;
                            default:
                                break;
                        }
                        dataServiceDetails._changeCount--;
                    });

                    dataServiceDetails.dispatchChange("hasChanges");
                }

                msls_mark(msls_codeMarkers.saveDataEnd);

                if (serverErrors) {
                    operation.error(serverErrors);
                } else {
                    operation.complete();
                }
            }),
            operation.code(function error(err) {
                serverErrors = getServerErrors(err.response, dataServiceDetails);

                msls_mark(msls_codeMarkers.saveDataEnd);

                operation.error(serverErrors);
            }),
            OData.batchHandler
        );
    }

    function saveChanges() {
        /// <summary>
        /// Asynchronously saves the changes to this data service and returns
        /// a promise that is fulfilled when the changes have been saved.
        /// </summary>
        /// <returns type="WinJS.Promise">
        /// A promise that is fulfilled when the changes have been saved.
        /// </returns>
        var me = this,
            promise,
            initError;
        promise = msls_promiseOperation(function (operation) {
            try {
                initSaveChanges(me, operation);
            } catch (e) {
                initError = e;
                throw e;
            }
        });
        if (window.intellisense) {
            promise._$annotate(Array);
        }
        if (initError) {
            throw initError;
        }
        return promise;
    }

    msls_mixIntoExistingClass(_DataService, {
        saveChanges: saveChanges
    });

    msls_initDataService =
    function initDataService(dataService, dataWorkspace) {
        if (dataWorkspace) {
            dataService.details.dataWorkspace = dataWorkspace;
        }
    };

    function getChanges() {
        /// <summary>
        /// Gets the entities tracked by this data service that
        /// have been added, modified or marked for deletion.
        /// </summary>
        /// <returns type="Array">
        /// The entities that have been added, modified or marked for deletion.
        /// </returns>
        var changes = [];
        $.each(this.properties.all(), function () {
            var entitySet = this.value;
            changes = changes.concat(entitySet._addedEntities);
            $.each(entitySet._loadedEntities, function () {
                if (this.details.entityState !== _EntityState.unchanged) {
                    changes.push(this);
                }
            });
        });
        return changes;
    }

    function discardChanges() {
        /// <summary>
        /// Discards the changes to all entities tracked by this data service.
        /// </summary>
        $.each(this.getChanges(), function () {
            this.details.discardChanges();
        });
    }

    function _findModel() {
        var
        dataService = this.dataService,
        model = null,
        modelService = msls.services.modelService,
        applicationDefinition,
        dataServiceDetails,
        dataServiceProperty,
        dataWorkspace,
        dataWorkspaceDetails;

        if (!!dataService && modelService.isLoaded) {
            dataServiceDetails = dataService.details;
            dataWorkspace = dataServiceDetails.dataWorkspace;
            if (dataWorkspace) {
                dataWorkspaceDetails = dataWorkspace.details;
                dataServiceProperty = msls_iterate(dataWorkspaceDetails.properties.all())
                    .first(function (p) {
                        return (p.value === dataService);
                    }
                );
                if (dataServiceProperty) {
                    applicationDefinition = msls_getApplicationDefinition();
                    if (applicationDefinition) {
                        model = msls_findModelItem(applicationDefinition.globalItems, dataServiceProperty.name, function (item) {
                            return msls_isEntityContainer(item);
                        });
                    }
                }
            }
        }
        return model;
    }

    msls_mixIntoExistingClass(_DataServiceDetails, {
        hasChanges: msls_observableProperty(null,
            function hasChanges_get() {
                return this._changeCount > 0;
            }
        ),

        getChanges: getChanges,
        discardChanges: discardChanges,
        _findModel: _findModel,

        contentchange: msls_event(),
        dispatchEvent: msls_dispatchEventOverride(
            function dispatchEvent(type, details, baseDispatchEvent) {

                baseDispatchEvent.call(this, type, details);
                var dataWorkspace = this.dataWorkspace,
                    dataWorkspaceDetails,
                    raiseHasChanges;
                if (dataWorkspace) {
                    dataWorkspaceDetails = dataWorkspace.details;
                    if (type === "contentchange") {
                        dataWorkspaceDetails.dispatchEvent("contentchange", details);
                    } else if (type === msls_changeEventType && details === "hasChanges") {
                        if (this.hasChanges) {
                            raiseHasChanges = ++dataWorkspaceDetails._changeCount === 1;
                        } else {
                            raiseHasChanges = --dataWorkspaceDetails._changeCount === 0;
                        }
                        if (raiseHasChanges) {
                            dataWorkspaceDetails.dispatchChange("hasChanges");
                        }
                    }
                }
            }
        )
    });
    msls_intellisense_setEventDetailType(
        _DataServiceDetails.prototype, "contentchange", Object);

    msls_initDataServiceDetails =
    function initDataServiceDetails(dataServiceDetails, owner) {
        dataServiceDetails.dataService = owner;
        msls_setProperty(dataServiceDetails, "_entitySets", {});
        msls_setProperty(dataServiceDetails, "_linkSets", {});
        msls_setProperty(dataServiceDetails, "_changeCount", 0);
    };

    msls_DataService_cancelNestedChanges =
    function cancelNestedChanges(details) {
        $.each(details.getChanges(), function () {
            msls_Entity_cancelNestedChanges(this.details);
        });
    };

    msls_DataService_acceptNestedChanges =
    function acceptNestedChanges(details) {
        var newChangesCount = 0;
        $.each(details.getChanges(), function () {
            if (msls_Entity_acceptNestedChanges(this.details)) {
                newChangesCount++;
            }
        });
        return newChangesCount;
    };

    function getEntitySetPropertyValue() {
        var details = this._details,
            entry = this._entry,
            sets = details._entitySets,
            propertyName = entry.name,
            set = sets[propertyName];
        if (!set) {
            sets[propertyName] = set = new _EntitySet(this.dataService, entry);
        }
        return set;
    }

    msls_defineClass(_DataServiceDetails, "EntitySetProperty",
        function DataService_Details_EntitySetProperty(details, entry) {
            /// <summary>
            /// Represents an entity set property object.
            /// </summary>
            /// <param name="details" type="msls.DataService.Details">
            /// The data service details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.DataService">
            /// Gets the data service that owns this property.
            /// </field>
            /// <field name="dataService" type="msls.DataService">
            /// Gets the data service that owns this property.
            /// </field>
            /// <field name="value" type="msls.EntitySet">
            /// Gets the value of this property.
            /// </field>
            msls_ObjectWithDetails_Details_Property.call(this, details, entry);
            if (window.intellisense) {
                if (!details) {
                    this.owner = null;
                }
            }
            this.dataService = this.owner;
        }, msls_ObjectWithDetails_Details_Property, {
            value: msls_accessorProperty(getEntitySetPropertyValue),
            _findModel:
                function _findModel() {
                    return msls_findModelItem(
                        this._details.getModel().entitySets,
                        this._entry.name);
                }
        }
    );
    _EntitySetProperty = _DataServiceDetails.EntitySetProperty;
    msls_intellisense_setTypeProvider(
        _EntitySetProperty.prototype, "dataService",
        function (o) {
            return o.dataService.constructor;
        }
    );

    function makeDataServiceDetails(dataServiceClass) {
        function DataServiceDetails(owner) {
            /// <summary>
            /// Represents the details for a data service.
            /// </summary>
            /// <param name="owner">
            /// The data service that owns this details object.
            /// </param>
            /// <field name="properties">
            /// Gets the set of property objects for the data service.
            /// </field>
            _DataServiceDetails.call(this, owner);
        }
        return DataServiceDetails;
    }

    function defineDataService(constructor,
        baseServiceUri, entitySets, operations) {
        /// <summary>
        /// Classifies a constructor function as a data service.
        /// </summary>
        /// <param name="constructor" type="Function">
        /// A constructor function.
        /// </param>
        /// <param name="baseServiceUri" type="String">
        /// Base URI of the service to connect to.
        /// </param>
        /// <param name="entitySets" type="Array">
        /// An array of entity set descriptors.
        /// </param>
        /// <param name="operations" type="Array">
        /// An array of operation descriptors.
        /// </param>
        /// <returns type="Function">
        /// The constructor function classified as a data service.
        /// </returns>
        var dataServiceClass = constructor,
            details = makeDataServiceDetails(constructor),
            mixInContent = {};

        msls_defineClassWithDetails(null, null,
            constructor, details, _DataService);

        msls_mixIntoExistingClass(details, {
            _serviceUri: baseServiceUri
        });

        if (entitySets) {
            entitySets.forEach(function (entry) {
                var entryName = entry.name;
                entry.serviceName = entryName;
                entry.get = function entitySet_get() {
                    /// <returns type="msls.EntitySet" />
                    return this.details.properties[entryName].value;
                };
                mixInContent[entryName] = msls_propertyWithDetails(
                    entry, _EntitySet, _EntitySetProperty);
            });
        }
        if (operations) {
            operations.forEach(function (entry) {
                entry.serviceName = entry.name;
                mixInContent[entry.name] = entry;
            });
        }
        msls_mixIntoExistingClass(dataServiceClass, mixInContent);

        return dataServiceClass;
    }

    msls_toODataString =
    function toODataString(parameter, dataType) {
        /// <summary>
        /// Converts a query parameter value to
        /// its OData string representation.
        /// </summary>
        /// <param name="parameter">
        /// A parameter value.
        /// </param>
        /// <param name="dataType" type="String">
        /// The identifier of a LightSwitch modeled data type.
        /// </param>
        /// <returns type="String">
        /// The OData string representation of the parameter value.
        /// </returns>
        if (parameter === undefined || parameter === null) {
            return "null";
        }

        if (dataType.charAt(0) !== ":") {
            dataType = ":" + dataType;
        }

        switch (dataType) {
            case ":Binary":
            case ":Binary?":
                return "binary'" + parameter + "'";
            case ":Date":
            case ":DateTime":
            case ":Date?":
            case ":DateTime?":
                var d = parameter;
                return "datetime'" +
                    d.getFullYear().toString() + "-" +
                    formatDateElement(d.getMonth() + 1) + "-" +
                    formatDateElement(d.getDate()) + "T" +
                    formatDateElement(d.getHours()) + ":" +
                    formatDateElement(d.getMinutes()) + ":" +
                    formatDateElement(d.getSeconds()) + "'";
            case ":Decimal":
            case ":Decimal?":
                return parameter + "M";
            case ":Guid":
            case ":Guid?":
                return "guid'" + parameter + "'";
            case ":Int64":
            case ":Int64?":
                return parameter + "L";
            case ":Single":
            case ":Single?":
                return parameter + "f";
            case ":String":
            case ":String?":
                return "'" + parameter.replace(/'/g, "''") + "'";
            case ":TimeSpan":
            case ":TimeSpan?":
                var t = parameter,
                    sign = "",
                    ms,
                    days,
                    hours,
                    minutes,
                    seconds;
                ms = t.ms;
                if (ms < 0) {
                    sign = "-";
                    ms = -ms;
                }
                days = Math.floor(ms / 86400000);
                ms -= 86400000 * days;
                hours = Math.floor(ms / 3600000);
                ms -= 3600000 * hours;
                minutes = Math.floor(ms / 60000);
                ms -= 60000 * minutes;
                seconds = Math.floor(ms / 1000);
                ms -= seconds * 1000;
                return "time'" + sign + "P" + ((days > 0) ? days.toString() + "D" : "") +
                                 "T" + hours.toString() + "H" + minutes.toString() + "M" +
                                 ((ms > 0) ? (seconds + ms / 1000).toString() : seconds.toString()) + "S'";
            case ":Byte":
            case ":Byte?":
            case ":Boolean":
            case ":Boolean?":
            case ":Double":
            case ":Double?":
            case ":Int16":
            case ":Int16?":
            case ":Int32":
            case ":Int32?":
            case ":SByte":
            case ":SByte?":
                return parameter.toString();
            default:
                return;
        }

        return;
    };

    function formatDateElement(value) {
        if (value < 10) {
            return "0" + value.toString();
        } else {
            return value.toString();
        }
    }

    msls_expose("DataService", _DataService);
    msls_expose("_toODataString", msls_toODataString);
    msls_expose("EntitySet", _EntitySet);
    msls_expose("DataServiceQuery", _DataServiceQuery);
    msls_expose("_defineDataService", defineDataService);

    function getEntitySetInformationForEntityType(dataWorkspace, entityType) {

        var entitySet,
            result;

        msls_iterate(dataWorkspace.details.properties.all())
        .each(function (dataServiceProperty) {

            msls_iterate(dataServiceProperty.value.details.properties.all())
            .each(function (entitySetProperty) {
                entitySet = entitySetProperty.value;
                if (entitySet.getEntityType() === entityType) {
                    result = {
                        entitySet: entitySet,
                        model: entitySetProperty.getModel()
                    };
                    return false;
                }
                return true;
            });

            return !result;
        });

        return result;
    }

    msls_EntitySet_getEntitySetForEntityType =
    function getEntitySetForEntityType(dataWorkspace, entityType) {
        var entitySetInfo = getEntitySetInformationForEntityType(
                dataWorkspace, entityType);

        return entitySetInfo.entitySet;
    };

    msls_EntitySet_isEntitySetReadOnly =
    function isEntitySetReadOnly(dataWorkspace, entityType) {
        var entitySetInfo = getEntitySetInformationForEntityType(
                dataWorkspace, entityType),
            entitySetModel = entitySetInfo.model;

        return !(entitySetModel.canDelete ||
                entitySetModel.canInsert ||
                entitySetModel.canUpdate);
    };
}());

(function () {

    var _DataWorkspace = msls.DataWorkspace,
        _DataWorkspaceDetails = _DataWorkspace.Details,
        _DataServiceProperty;

    function hasNestedChanges_get() {
        return this._changeCount > 0;
    }

    function isLastNestedChangeSet(nestedChangeSet) {
        var nestedChangeSets = nestedChangeSet._owner._nestedChangeSets;
        if (nestedChangeSets.length <= 0) {
            return false;
        }
        return nestedChangeSet === nestedChangeSets[nestedChangeSets.length - 1];
    }

    function updateChangeCount(nestedChangeSet, amount) {
        var previousHasChanges = nestedChangeSet.hasNestedChanges;
        nestedChangeSet._changeCount += amount;
        if (previousHasChanges !== nestedChangeSet.hasNestedChanges) {
            nestedChangeSet.dispatchChange("hasNestedChanges");
        }
    }

    function closeChanges(nestedChangeSet, newChangesCount) {

        var dataWorkspaceDetails = nestedChangeSet._owner,
            nestedChangeSets = dataWorkspaceDetails._nestedChangeSets;

        nestedChangeSets.pop();

        updateChangeCount(nestedChangeSet, -nestedChangeSet._changeCount);

        if (nestedChangeSets.length > 0) {
            updateChangeCount(
                nestedChangeSets[nestedChangeSets.length - 1],
                newChangesCount);
        }

        if (nestedChangeSets.length === 0) {
            dataWorkspaceDetails.dispatchChange("hasNestedChangeSets");
        }
    }

    function getNestedChanges() {
        /// <summary>
        /// Gets the entities tracked by this nested change set
        /// that have been added, modified or marked for deletion.
        /// </summary>
        /// <returns type="Array">
        /// The entities that have been added, modified or marked for deletion.
        /// </returns>
        var allChanges = this._owner.getChanges(),
            changeSetIndex = this._owner._nestedChangeSets.indexOf(this),
            nestedChanges = [];
        $.each(allChanges, function () {
            var entityData = this.details._;
            while (entityData) {
                if (entityData.__changeSetIndex === changeSetIndex) {
                    nestedChanges.push(this);
                    break;
                }
                entityData = entityData.__parent;
            }
        });
        return nestedChanges;
    }

    function acceptNestedChanges() {
        /// <summary>
        /// Accepts all the changes in this nested change set.
        /// </summary>
        if (!isLastNestedChangeSet(this)) {
            return;
        }
        var newChangesCount = 0;
        $.each(this._owner._dataServices, function (serviceName, service) {
            newChangesCount += msls_DataService_acceptNestedChanges(service.details);
        });
        closeChanges(this, newChangesCount);
    }

    function cancelNestedChanges() {
        /// <summary>
        /// Cancels all the changes in this nested change set.
        /// </summary>
        if (!isLastNestedChangeSet(this)) {
            return;
        }
        $.each(this._owner._dataServices, function (serviceName, service) {
            msls_DataService_cancelNestedChanges(service.details);
        });
        closeChanges(this, 0);
    }

    msls_defineClass(_DataWorkspace, "NestedChangeSet",
        function DataWorkspace_NestedChangeSet(owner) {
            /// <summary>
            /// Represents a nested change set.
            /// </summary>
            /// <param name="owner" type="msls.DataWorkspace.Details">
            /// The data workspace details that owns this nested change set.
            /// </param>
            /// <field name="hasNestedChanges" type="Boolean">
            /// Gets a value indicating if this nested change set has changes.
            /// </field>
            /// <field name="onchange" type="Function">
            /// Gets or sets a handler for the change event, which is called any
            /// time the value of an observable property on this object changes.
            /// </field>
            msls_setProperty(this, "_owner", owner);
        }, null, {
            _changeCount: 0,

            hasNestedChanges: msls_observableProperty(null, hasNestedChanges_get),

            getNestedChanges: getNestedChanges,
            acceptNestedChanges: acceptNestedChanges,
            cancelNestedChanges: cancelNestedChanges
        }
    );

    msls_initDataWorkspace =
    function initDataWorkspace(dataWorkspace) {
    };

    function hasChanges_get() {
        return this._changeCount > 0;
    }

    function hasNestedChangeSets_get() {
        return this._nestedChangeSets.length > 0;
    }

    function getChanges() {
        /// <summary>
        /// Gets the entities tracked by this data workspace
        /// that have been added, modified or marked for deletion.
        /// </summary>
        /// <returns type="Array">
        /// The entities that have been added, modified or marked for deletion.
        /// </returns>
        var changes = [];
        $.each(this._dataServices, function () {
            changes = changes.concat(this.details.getChanges());
        });
        return changes;
    }

    function beginNestedChanges() {
        /// <summary>
        /// Begins a nested change set.
        /// </summary>
        /// <returns type="msls.DataWorkspace.NestedChangeSet">
        /// The created nested change set.
        /// </returns>
        var nestedChangeSets = this._nestedChangeSets,
            nestedChangeSet = new msls.DataWorkspace.NestedChangeSet(this);
        nestedChangeSets.push(nestedChangeSet);
        if (nestedChangeSets.length === 1) {
            this.dispatchChange("hasNestedChangeSets");
        }
        return nestedChangeSet;
    }

    function _findModel() {
        return msls_findModelItem(
            msls_getApplicationDefinition().globalItems,
            "DataWorkspace");
    }

    msls_mixIntoExistingClass(_DataWorkspaceDetails, {
        hasChanges: msls_observableProperty(null, hasChanges_get),
        hasNestedChangeSets: msls_observableProperty(null, hasNestedChangeSets_get),

        getChanges: getChanges,
        beginNestedChanges: beginNestedChanges,
        _findModel: _findModel,

        contentchange: msls_event()
    });
    msls_intellisense_setEventDetailType(
        _DataWorkspaceDetails.prototype, "contentchange", Object);

    msls_initDataWorkspaceDetails =
    function initDataWorkspaceDetails(dataWorkspaceDetails, owner) {
        dataWorkspaceDetails.dataWorkspace = owner;
        msls_setProperty(dataWorkspaceDetails, "_dataServices", {});
        msls_setProperty(dataWorkspaceDetails, "_linkSets", {});
        msls_setProperty(dataWorkspaceDetails, "_nestedChangeSets", []);
        msls_setProperty(dataWorkspaceDetails, "_changeCount", 0);
    };

    msls_DataWorkspace_updateNestedChangeCount =
    function updateNestedChangeCount(details, nestedChangeSetIndex, amount) {
        var nestedChangeSets = details._nestedChangeSets;
        if (0 <= nestedChangeSetIndex && nestedChangeSetIndex < nestedChangeSets.length) {
            updateChangeCount(
                nestedChangeSets[nestedChangeSetIndex],
                amount);
        }
    };

    function getDataServicePropertyValue() {
        var details = this._details,
            entry = this._entry,
            services = details._dataServices,
            propertyName = entry.name,
            service = services[propertyName];
        if (!service) {
            services[propertyName] = service = new entry.type(details.dataWorkspace);
        }
        return service;
    }

    msls_defineClass(_DataWorkspaceDetails, "DataServiceProperty",
        function DataWorkspace_Details_DataServiceProperty(details, entry) {
            /// <summary>
            /// Represents a data service property object.
            /// </summary>
            /// <param name="details" type="msls.DataWorkspace.Details">
            /// The data workspace details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.DataWorkspace">
            /// Gets the data workspace that owns this property.
            /// </field>
            /// <field name="dataWorkspace" type="msls.DataWorkspace">
            /// Gets the data workspace that owns this property.
            /// </field>
            /// <field name="value" type="msls.DataService">
            /// Gets the value of this property.
            /// </field>
            msls_ObjectWithDetails_Details_Property.call(this, details, entry);
            if (window.intellisense) {
                if (!details) {
                    this.owner = null;
                }
            }
            this.dataWorkspace = this.owner;
        }, msls_ObjectWithDetails_Details_Property, {
            value: msls_accessorProperty(getDataServicePropertyValue),
            _findModel:
                function _findModel() {
                    return msls_findModelItem(
                        this._details.getModel().members,
                        this._entry.name);
                }
        }
    );
    _DataServiceProperty = _DataWorkspaceDetails.DataServiceProperty;
    msls_intellisense_setTypeProvider(
        _DataServiceProperty.prototype, "dataWorkspace",
        function (o) {
            return o.dataWorkspace.constructor;
        }
    );
    msls_intellisense_setTypeProvider(
        _DataServiceProperty.prototype, "value",
        function (o) {
            return !!o._entry && !!o._entry.type ?
                o._entry.type : msls.DataService;
        }
    );

    function makeDataWorkspaceDetails(dataWorkspaceClass) {
        function DataWorkspaceDetails(owner) {
            /// <summary>
            /// Represents the details for a data workspace.
            /// </summary>
            /// <param name="owner">
            /// The data workspace that owns this details object.
            /// </param>
            /// <field name="properties">
            /// Gets the set of property objects for the data workspace.
            /// </field>
            _DataWorkspaceDetails.call(this, owner);
        }
        return DataWorkspaceDetails;
    }

    function defineDataWorkspace(constructor, dataServices) {
        /// <summary>
        /// Classifies a constructor function as a data workspace.
        /// </summary>
        /// <param name="constructor" type="Function">
        /// A constructor function.
        /// </param>
        /// <param name="dataServices" type="Array">
        /// An array of data service descriptors.
        /// </param>
        /// <returns type="Function">
        /// The constructor function classified as a data workspace.
        /// </returns>
        var dataWorkspaceClass = constructor,
            details = makeDataWorkspaceDetails(constructor),
            mixInContent = {};
        msls_defineClassWithDetails(null, null,
            constructor, details, _DataWorkspace);
        if (dataServices) {
            dataServices.forEach(function (entry) {
                var entryName = entry.name;
                entry.serviceName = entryName;
                entry.get = function () {
                    return this.details.properties[entryName].value;
                };
                mixInContent[entryName] = msls_propertyWithDetails(
                    entry, entry.type, _DataServiceProperty);
            });
            msls_mixIntoExistingClass(dataWorkspaceClass, mixInContent);
            dataServices.forEach(function (entry) {
                var entryName = entry.name;
                msls_intellisense_setTypeProvider(
                    dataWorkspaceClass.prototype,
                    entryName, function (o) {
                        return entry.type;
                    }
                );
            });
        }
        return dataWorkspaceClass;
    }

    msls_expose("DataWorkspace", _DataWorkspace);
    msls_expose("_defineDataWorkspace", defineDataWorkspace);

}());

var msls_CollectionLoader;

(function () {

    function subscribe(collectionChangeCallback, invalidatedCallback) {

        msls_setProperty(this, "_collectionChangeCallback", collectionChangeCallback);
        msls_setProperty(this, "_invalidatedCallback", invalidatedCallback);
    }

    function loadNext(currentItems) {
        throw undefined;
    }

    function reset() {
        throw undefined;
    }

    function addNewItem() {
        throw undefined;
    }

    function deleteItem(item) {
        throw undefined;
    }

    msls_defineClass(msls, "CollectionLoader",
        function CollectionLoader(pageSize) {

            if (!pageSize) {
                pageSize = 45;
            }
            msls_setProperty(this, "_pageSize", pageSize);
        },
        null, {
            canLoadNext: false,
            subscribe: subscribe,
            loadNext: loadNext,
            reset: reset,
            addNewItem: addNewItem,
            deleteItem: deleteItem
        }
    );
    msls_CollectionLoader = msls.CollectionLoader;

}());

var msls_data_DataBindingMode;

(function () {
    
    msls_defineEnum("data", {
        DataBindingMode: {
            twoWay: 1,
            oneWayFromSource: 2,
            oneWayFromTarget: 3,
            once: 4
        }
    });

    msls_data_DataBindingMode = msls.data.DataBindingMode;

    function DataBinding(bindingPath, bindingSource, targetProperty, bindingTarget, bindingMode) {

        if (!isValidPath(this, bindingPath)) {
            throw msls_getResourceString("databinding_invalid_path_1args", bindingPath);
        }


        this.bindingPath = bindingPath;
        this.bindingSource = bindingSource;
        this.targetProperty = targetProperty;
        this.bindingTarget = bindingTarget;
        this.bindingMode = bindingMode ? bindingMode : msls_data_DataBindingMode.twoWay;
        this._resetting = false;
        this._lastSourceNode = null;
        this._lastSourceProperty = null;
        this._callbacks = [];

        if ($.isFunction(bindingTarget) &&
            (this.bindingMode === msls_data_DataBindingMode.twoWay || this.bindingMode === msls_data_DataBindingMode.oneWayFromTarget)) {
                throw "Binding initialization error. Invalid binding mode.";
        }
    }

    function CallbackObject(host, propertyName, callback) {
        this.host = host;
        this.propertyName = propertyName;
        this.callback = callback;
    }

    
    function bind() {
        var me = this,
            target = me.bindingTarget;

        _reset(me, false);

        if (!msls_isDependentObject(me)) {
            if (target && !$.isFunction(target)) {
                msls_addLifetimeDependency(target, me);
            } else {
                msls_addLifetimeDependency(me.bindingSource, me);
            }
        }
    }

    function activate() {
        if (this._isDeactivated) {
            this._isDeactivated = false;

            if (this._invalidated) {
                _reset(this, false);
                this._invalidated = false;
            }
        }
    }

    function deactivate() {

        this._isDeactivated = true;
    }

    function _onDispose() {
        this.bindingSource = null;
        _reset(this, true);

        this.bindingTarget = null;
        this.value = null;
    }

    function isValidPath(me, path) {
        return path.match(/^[a-zA-Z0-9$._]*$/);
    }

    function _reset(me, calledFromDispose) {
    
        var paths = me.bindingPath ? me.bindingPath.split(".") : [],
            curNode = me.bindingSource,
            registeredCallbacks = me._callbacks,
            i, callback, targetCallback,
            self_targetCallback = me._targetCallback,
            self_bindingTarget = me.bindingTarget,
            value;

        if (me._resetting) {
            return;
        }

        function updateValue() {
            if (!!me._isDeactivated) {
                me._invalidated = true;
            } else {
                value = _convertValue(me, me._lastSourceNode[me._lastSourceProperty]);
                compareAndSetValue(me, self_bindingTarget, me.targetProperty, value);
            }
        }

        function resetValue() {
            if (!!me._isDeactivated) {
                me._invalidated = true;
            } else {
                _reset(me, false);
            }
        }

        try {
            me._resetting = true;

            for (i = 0; i < registeredCallbacks.length; i++) {
                callback = registeredCallbacks[i];
                callback.host.removeChangeListener(callback.propertyName, callback.callback);
            }

            registeredCallbacks = [];

            if (!calledFromDispose) {
                for (i = 0; i < paths.length; i++) {
                    var path = paths[i];
                    if (!isValidPath(me, path)) {
                        throw msls_getResourceString("databinding_invalid_component_1args", path);
                    }

                    if (curNode && supportsNotifyPropertyChanged(curNode) &&
                         (me.bindingMode === msls_data_DataBindingMode.twoWay ||
                          me.bindingMode === msls_data_DataBindingMode.oneWayFromSource)) {

                        if (i === paths.length - 1) {
                            callback = updateValue;
                        } else {
                            callback = resetValue;
                        }

                        curNode.addChangeListener(path, callback);
                        registeredCallbacks.push(new CallbackObject(curNode, path, callback));
                    }

                    me._lastSourceNode = curNode;
                    me._lastSourceProperty = path;

                    if (!curNode) {
                        break;
                    }

                    curNode = curNode[path];
                    if (!curNode && i < paths.length - 1) {
                        me._lastSourceNode = null;
                        break;
                    }
                }
                value = _convertValue(me, curNode);
                compareAndSetValue(me, self_bindingTarget, me.targetProperty, value);
            } else {
                me._lastSourceNode = null;
                me._lastSourceProperty = null;
                me.value = null;
            }

            if (self_targetCallback) {
                self_targetCallback.host.removeChangeListener(self_targetCallback.propertyName, self_targetCallback.callback);
            }

            self_targetCallback = null;

            if (!calledFromDispose) {
                if (!!self_bindingTarget && supportsNotifyPropertyChanged(self_bindingTarget) &&
                     (me.bindingMode === msls_data_DataBindingMode.twoWay ||
                      me.bindingMode === msls_data_DataBindingMode.oneWayFromTarget)) {

                    targetCallback = function () {
                        if (me._isDeactivated) {
                            me._invalidated = true;
                        } else {
                            _updateSource(me);
                        }
                    };

                    self_bindingTarget.addChangeListener(me.targetProperty, targetCallback);
                    self_targetCallback = new CallbackObject(self_bindingTarget, me.targetProperty, targetCallback);
                }
            }
        } finally {
            me._resetting = false;
            me._callbacks = registeredCallbacks;
            me._targetCallback = self_targetCallback;
        }
    }

    function _updateSource(me) {

        var lastSourceProperty = me._lastSourceProperty;

        if (me._resetting) {
            return;
        }

        me._resetting = true;
        var value = _convertBackValue(me, me.bindingTarget[me.targetProperty]);

        compareAndSetValue(me, me._lastSourceNode, me._lastSourceProperty, value);
        me._resetting = false;
    }

    function _convertValue(me, value) {

        var converter = me.converter;

        if (!converter || !$.isFunction(converter.convert)) {
            return value;
        }
        return converter.convert(value);
    }

    function _convertBackValue(me, value) {

        var converter = me.converter;

        if (!converter || !$.isFunction(converter.convertBack)) {
            return value;
        }
        return converter.convertBack(value);
    }

    function supportsNotifyPropertyChanged(object) {
        return object.addChangeListener && object.removeChangeListener;
    }

    function compareAndSetValue(me, object, propertyName, newValue) {

        if (me.value !== newValue || !me._isTargetInitialized) {
            me.value = newValue;
            if ($.isFunction(object)) {
                object.call(me, newValue);
            } else if (!!object && !!propertyName && object[propertyName] !== newValue) {
                object[propertyName] = newValue;
            }
            me._isTargetInitialized = true;
        }
    }

    msls_defineClass("data", "DataBinding", DataBinding, null, {
        value: null,

        bind: bind,
        activate: activate,
        deactivate: deactivate,

        _onDispose: _onDispose
    });

}());

var msls_createBoundArguments;

(function () {

    function createBoundArgumentsClass(count) {
        return msls_defineClass(null, null,
                function BoundArguments() {
                },
                msls.BoundArguments,
                { length: count }
            );
    }

    msls_createBoundArguments =
    function createBoundArguments(context, args) {
        var _Class = createBoundArgumentsClass(args.length),
            result = new _Class(),
            mixInContent = {},
            dataBinding,
            dataBindings = [];

        $.each(args, function (index) {
            var argumentName = "arg" + index.toString(),
                optional = this.optional,
                binding = this.binding,
                value = this.value;
            if (binding) {
                mixInContent[argumentName] = msls_observableProperty(value);

                dataBinding = new msls.data.DataBinding(binding, context, argumentName, result);
                dataBindings.push(dataBinding);


            } else {
                mixInContent[argumentName] = msls_dataProperty(value);
            }
            if (optional) {
                mixInContent[argumentName + ".optional"] = true;
            }
        });
        msls_mixIntoExistingClass(_Class, mixInContent);
        dataBindings.forEach(function (binding) {
            binding.bind();
        });
        return result;
    };

    function getCurrentValues() {
        var result = [];
        for (var i = 0, len = this.length; i < len; i++) {
            result.push(this["arg" + i.toString()]);
        }
        return result;
    }

    msls_defineClass(msls, "BoundArguments",
        function BoundArguments() {
        },
        null, {

            getCurrentValues: getCurrentValues
        }
    );
    msls_makeObservable(msls.BoundArguments);

}());

var msls_convert_type;

(function () {




    function TextFormatConverter() {
    }

    function textFormatConverter_convert(value) {
        var re = /\{(.*)\}/,
            variable,
            match = re.exec(this.format),
            result = this.format,
            evaluatedValue;

        while (!!match) {
            variable = match[1];
            evaluatedValue = (variable === "value") ? value : (this[variable] ? this[variable] : "");

            result = result.replace("{" + variable + "}", evaluatedValue);
            match = re.exec(result);
        }
        return result;
    }

    function textFormatConverter_convertBack(value) {
        return value;
    }

    msls_defineClass("ui.converters", "TextFormatConverter", TextFormatConverter, null, {
        convert: textFormatConverter_convert,
        convertBack: textFormatConverter_convertBack
    });

    function GenericConverter(convert, convertBack) {

        msls_throwIfFalsy(convert, "convert");

        this._convert = convert;
        this._convertBack = convertBack;
    }

    function genericConverter_convert(value) {
        return this._convert.call(this, value);
    }

    function genericConverter_convertBack(value) {
        if (this._convertBack) {
            return this._convertBack.call(this, value);
        }
        return value;
    }

    msls_defineClass("ui.converters", "GenericConverter", GenericConverter, null, {
        convert: genericConverter_convert,
        convertBack: genericConverter_convertBack
    }
    );


    function PropertyConverter() {
    }

    function propertyConverter_convert(value) {
        var result;
        if (!!value && !!value.properties && !!this.property) {
            result = value.properties[this.property];
        }
        return result;
    }

    function propertyConverter_convertBack(value) {
        return value;
    }

    msls_defineClass("ui.converters", "PropertyConverter", PropertyConverter, null, {
        convert: propertyConverter_convert,
        convertBack: propertyConverter_convertBack
    });


    msls_convert_type =
    function convert_type(stringValue, modelType) {

        if (!stringValue) {
            return { value: null };
        }

        var stringValue_lc,
            value,
            error,
            type,
            nullableType,
            semanticType,
            primitiveType,
            expression;

        if (msls_isNullableType(modelType)) {
            nullableType = modelType;
            modelType = nullableType.underlyingType;
        }

        type = modelType.id;

        while (!!modelType && msls_isSemanticType(modelType)) {
            semanticType = modelType;
            modelType = semanticType.underlyingType;
        }

        if (!!modelType) {
            primitiveType = modelType.id;
        }

        stringValue_lc = stringValue.toLowerCase();

        if (primitiveType === ":Byte" || primitiveType === ":Int16" || type === ":Int32" || type === ":Int64") {
            value = parseInt(stringValue_lc, 10);
            if (!/^\s*(\+|-)?\d+\s*$/.test(stringValue_lc)) {
                error = msls_getResourceString("validation_type_int_invalidChars");
            } else if (isNaN(value)) {
                error = msls_getResourceString("validation_type_int_invalidValue");
            } else {
                if (primitiveType === ":Byte") {
                    if (value < 0 || value > 255) {
                        error = msls_getResourceString("validation_type_byte_invalidRange");
                    }
                } else if (primitiveType === ":Int16") {
                    if (value < -65536 || value > 65535) {
                        error = msls_getResourceString("validation_type_int16_invalidRange");
                    }
                } else if (primitiveType === ":Int32") {
                    if (value < -4294967296 || value > 4294967295) {
                        error = msls_getResourceString("validation_type_int32_invalidRange");
                    }
                } else if (primitiveType === ":Int64") {
                    if (value < -18446744073709551616 || value > 18446744073709551615) {
                        error = msls_getResourceString("validation_type_int64_invalidRange");
                    }
                }
            }
        } else if (primitiveType === ":Decimal" || primitiveType === ":Double" || primitiveType === ":Single") {
            value = parseFloat(stringValue_lc);
            if (!/^\s*(\+|-)?((\d+(\.\d*)?)|(\.\d+))\s*$/.test(stringValue_lc)) {
                error = msls_getResourceString(primitiveType === ":Decimal" ? "validation_type_decimal_invalidChars" :
                                               (primitiveType === ":Double" ? "validation_type_double_invalidChars" : "validation_type_single_invalidChars"));
            } else if (isNaN(value)) {
                error = msls_getResourceString(primitiveType === ":Decimal" ? "validation_type_decimal_invalidValue" :
                                               (primitiveType === ":Double" ? "validation_type_double_invalidValue" : "validation_type_single_invalidValue"));
            }
        } else if (primitiveType === ":Boolean") {
            value = stringValue_lc === "true" || stringValue_lc === "1";
            if (!value) {
                if (stringValue_lc !== "false" && stringValue_lc !== "0") {
                    error = msls_getResourceString("validation_type_boolean_invalidValue");
                }
            }
        } else if (type === ":Date" || primitiveType === ":DateTime") {
            value = new Date(stringValue);
            if (!value || isNaN(value.getYear())) {
                error = msls_getResourceString("validation_type_date_invalidValue");
            } else if (type === ":Date") {
                value.setHours(0, 0, 0, 0);
            }
        } else if (type === ":TimeSpan") {
            var parts,
                days,
                hours,
                minutes,
                seconds,
                milliseconds,
                ms;
            expression = /^\s*(\+|-)?((\d+)?\.)?(\d{1,2})?:{0,1}(\d{1,2})?:{0,1}(\d{1,2})?(\.(\d{1,7})?)?\s*$/;
            parts = expression.exec(stringValue);
            if (parts === null) {
                error = msls_getResourceString("validation_type_timespan_invalidValue");
            } else {
                days = parseInt(parts[3] || "0", 10),
                hours = parseInt(parts[4] || "0", 10),
                minutes = parseInt(parts[5] || "0", 10),
                seconds = parseInt(parts[6] || "0", 10);
                milliseconds = parseInt((parts[8] || "0").slice(0, 3), 10);
                if (hours > 23 || minutes > 59 || seconds > 59) {
                    error = msls_getResourceString("validation_type_timespan_invalidRange");
                } else {
                    ms = days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000 + milliseconds;
                    if (parts[1] === "-") {
                        ms = -ms;
                    }
                    value = { ms: ms, __edmType: "Edm.Time" };
                }
            }
        } else if (type === ":Guid") {
            value = stringValue;
            expression = /^(\{{0,1}([0-9a-fA-F]){8}(-([0-9a-fA-F]){4}){3}-([0-9a-fA-F]){12}\}{0,1})$/;
            if (!expression.test(value)) {
                error = msls_getResourceString("validation_type_guid_invalidValue");
            }
        } else {
            value = stringValue;
        }
        return { value: error ? null : value, error: error };
    };

}());

var msls_makeDataServiceQueryLoader;

(function () {

    function executeQuery(loader) {
        var activeQuery = loader._activeQuery,
            executeQueryFunction =
                activeQuery.execute || activeQuery.load;
        return executeQueryFunction.call(activeQuery);
    }

    function getEntityUri(entity) {
        var entityData,
            entityMetadata;
        return entity &&
            (entityData = entity.details._) &&
            (entityMetadata = entityData.__metadata) &&
            entityMetadata.uri;
    }

    function removeDuplicates(me, currentItems, newItems) {
        var items = newItems,
            currentItemsHash = {};

        if (!currentItems || currentItems.length <= 0 ||
            !newItems || newItems.length <= 0) {
            return items;
        }

        items = [];

        currentItems.forEach(function (currentEntity) {
            var currentEntityUri = getEntityUri(currentEntity);
            if (currentEntityUri) {
                currentItemsHash[currentEntityUri] = true;
            }
        });

        newItems.forEach(function (newEntity) {
            var newEntityUri = getEntityUri(newEntity);
            if (!newEntityUri || !currentItemsHash[newEntityUri]) {
                items.push(newEntity);
            }
        });

        return items;
    }

    function loadNext(currentItems) {

        var me = this,
            activePromise = me._activePromise,
            loadNextOperationDone;

        if (!activePromise) {
            activePromise = me._activePromise =
            msls_promiseOperation(function initLoadNext(operation) {
                activePromise = me._activePromise = operation.promise();

                var query = me._baseQuery,
                    skipCount = me._skipCount,
                    takeCount,
                    includeTotalCount;

                function onQueryExecuted(
                    loadNextCurrentItems, error, result, loadNextOperation) {


                    loadNextOperationDone = true;
                    me._activePromise = null;
                    me._activeQuery = null;

                    if (error) {
                        loadNextOperation.error(error);

                    } else {
                        var results = result.results,
                            resultsLength = results.length,
                            totalCount = result.totalCount,
                            newItems,
                            addedItems;

                        if (me._isFirstPage) {
                            newItems = results;

                            addedItems = me._getAddedEntities();
                            if (!!addedItems && addedItems.length > 0) {
                                newItems = addedItems.slice(0).reverse()
                                    .concat(newItems);
                            }

                            me._skipCount = resultsLength;
                            if (me._isTotalCountIncluded) {
                                if (typeof totalCount !== "number" || totalCount < 0) {
                                    me._serverCount = Number.MAX_VALUE;
                                } else {
                                    me._serverCount = totalCount;
                                }
                            } else {
                                if (me._disablePaging || resultsLength < me._pageSize) {
                                    me._serverCount = resultsLength;
                                } else {
                                    me._serverCount = Number.MAX_VALUE;
                                }
                            }
                            me._isFirstPage = false;
                        } else {
                            newItems = removeDuplicates(me, loadNextCurrentItems, results);

                            me._skipCount += resultsLength;

                            if (results.length < me._pageSize) {
                                me._serverCount = me._skipCount;
                            } else if (me._isTotalCountIncluded) {
                                me._serverCount = totalCount;
                            }
                        }

                        loadNextOperation.complete(newItems);
                    }
                }

                if (me.canLoadNext && !!query) {
                    takeCount = me._pageSize;
                    if (me._isFirstPage) {
                        includeTotalCount = true;
                    } else {
                        includeTotalCount = (skipCount + takeCount) >= me._serverCount;
                    }
                    includeTotalCount = includeTotalCount && !me._disableTotalCount;
                    me._isTotalCountIncluded = includeTotalCount;

                    if (!me._disablePaging) {
                        query = query.skip(skipCount).top(takeCount);
                    }
                    if (includeTotalCount) {
                        query = query.includeTotalCount();
                    }
                    me._activeQuery = query;

                    executeQuery(me)._thenEx(function (error, result) {
                        if (me._activeQuery === query) {
                            onQueryExecuted(currentItems, error, result, operation);
                        }
                    });

                } else {
                    onQueryExecuted(
                        currentItems, null, { totalCount: 0, results: [] }, operation);
                }
            });

            if (loadNextOperationDone) {
                me._activePromise = null;
            }
        }

        return activePromise;
    }

    function reset() {
        this._activePromise = null;
        this._activeQuery = null;
        this._isFirstPage = true;
        this._skipCount = 0;
    }

    msls_makeDataServiceQueryLoader =
    function makeDataServiceQueryLoader(loaderType) {
        msls_mixIntoExistingClass(loaderType, {
            _isFirstPage: true,
            _serverCount: 0,
            _skipCount: 0,
            canLoadNext: msls_accessorProperty(
                function canLoadNext_get() {
                    var me = this;
                    return me._isFirstPage ||
                        (!!me._baseQuery && me._skipCount < me._serverCount);
                }
            ),
            loadNext: loadNext,
            reset: reset
        });
    };

}());

var msls_parseConstantExpression,
    msls_parseContentItemRelativeExpression,
    msls_parseScreenRelativeExpression,
    msls_combineBindingPaths;

(function () {

    var defaultValueBindingPath = "";

    msls_defineClass(msls, "ExpressionInfo",
        function ExpressionInfo() {
        },
        null,
        {
            isConstant: false,
            isBinding: false,
            detailsBindingPath: null,
            valueBindingPath: defaultValueBindingPath,
        }
    );

    function parseContentItemRelativeExpression(expression) {
        return _parseExpression(expression, _determineContextForContentItemRelativeExpression);
    }
    msls_parseContentItemRelativeExpression = parseContentItemRelativeExpression;

    function parseScreenRelativeExpression(expression) {
        return _parseExpression(expression, _determineContextForScreenRelativeExpression);
    }
    msls_parseScreenRelativeExpression = parseScreenRelativeExpression;

    msls_parseConstantExpression =
    function parseConstantExpression(expression) {

        var info = _parseExpression(expression, _determineContextForConstantExpression);
        return info.constantValue;
    };

    function _parseExpression(expression, determineContext) {
        var info = new msls.ExpressionInfo();

        if (msls_isChainExpression(expression)) {
            var chain = expression;
            return _parseChainOfExpressions(chain.links || [], determineContext);
        }

        return _parseChainOfExpressions([expression], determineContext);
    }

    function _parseChainOfExpressions(links, determineContext) {

        var info = new msls.ExpressionInfo();

        if (links.length === 1 && msls_isConstantExpression(links[0])) {
            info.constantValue = links[0].value;
            info.isConstant = true;
            return info;
        }

        info.valueBindingPath = determineContext(links);

        if (links.length === 0) {
            info.isBinding = true;
            return info;
        }

        for (var iLink = 0; iLink < links.length; iLink++) {
            var link = links[iLink],
                modelItem,
                memberName,
                isMemberExpression = msls_isMemberExpression(link),
                isCallExpression = msls_isCallExpression(link),
                isLastLink = (iLink === links.length - 1);

            if (isMemberExpression) {
                modelItem = link.member;
                if (typeof link.member === "string") {
                    memberName = link.member;
                    modelItem = null;
                } else {
                    memberName = modelItem.name;
                }
            } else if (isCallExpression) {
                modelItem = link.target;
                memberName = modelItem.name;
            } else {
                return info;
            }

            var programmaticName = msls_getProgrammaticName(memberName);

            var parentValuePath = info.valueBindingPath;
            info.valueBindingPath = combineBindingPaths(parentValuePath, programmaticName);

            if (isLastLink) {
                info.lastModelItem = modelItem;
                info.lastObjectBindingPath = parentValuePath;

                if (isMemberExpression) {
                    var newDetailsPath = combineBindingPaths(parentValuePath, "details", "properties", programmaticName);
                    info.detailsBindingPath = newDetailsPath;
                } else {

                    var associatedCollectionAttribute = msls_getAttribute(link, ":@AssociatedCollection");
                    if (associatedCollectionAttribute) {
                        info.associatedCollection = associatedCollectionAttribute.collection;
                    }
                    info.createNewEntities = msls_getAttributes(
                        link, ":@CreateNewEntity") || [];

                    info.argumentBindings = [];
                    info.isCall = true;
                    var parameters = link.target.parameters,
                        source = link.target.source,
                        member, memberParameters,
                        call = link,
                        args = call.arguments;

                    while (source) {
                        if (!!(member = source.member)) {
                            if (!!(memberParameters = member.parameters)) {
                                parameters = memberParameters.concat(parameters || []);
                            }
                            source = member.source;
                        } else {
                            break;
                        }
                    }

                    if (parameters && args) {
                        var argumentBindings = info.argumentBindings;
                        for (var iArgument = 0; iArgument < args.length; iArgument++) {
                            var argExpression = args[iArgument];

                            var index = parameters.indexOf(argExpression.parameter);
                            if (index < 0 || !argExpression.value) {
                                argumentBindings[index] = null;
                            } else {
                                var valueExpression = argExpression.value;
                                var valueInfo = _parseExpression(valueExpression, determineContext);
                                if (valueInfo.isConstant) {
                                    argumentBindings[index] = { value: valueInfo.constantValue };
                                } else if (valueInfo.isCall) {
                                } else if (valueInfo.isBinding) {
                                    argumentBindings[index] = { binding: valueInfo.valueBindingPath };
                                } else {
                                }
                                if (msls_isNullableType(argExpression.parameter.parameterType)) {
                                    argumentBindings[index].optional = true;
                                }
                            }
                        }
                        for (var iParameter = 0; iParameter < parameters.length; iParameter++) {
                            if (!argumentBindings[iParameter]) {
                                argumentBindings[iParameter] = null;
                                if (msls_isNullableType(parameters[iParameter].parameterType) ||
                                    msls_iterate(info.createNewEntities).any(
                                        function (attr) {
                                            return attr.targetParameter === parameters[iParameter];
                                        }
                                        )) {
                                    argumentBindings[iParameter] = { optional: true };
                                }
                            }
                        }
                    }
                }
            }
        }

        info.isBinding = true;


        return info;
    }

    function _determineContextForConstantExpression(links) {
        return null;
    }

    function _determineContextForContentItemRelativeExpression(links) {

        var defaultContext = "data";

        if (links.length === 0) {
            return defaultContext;
        } else {
            switch (_determineRelativeType(links[0])) {
                case "Screen":
                    return "screen";

                case "Application":
                    return "application";

                case "EntityType":
                    return defaultContext;

                default:
                    return null;
            }
        }
    }

    function _determineContextForScreenRelativeExpression(links) {

        if (links.length === 0) {
            return "";
        } else {
            switch (_determineRelativeType(links[0])) {
                case "Screen":
                    return "";
                case "EntitySets":
                    return "";
                default:
                    return null;
            }
        }
    }

    function _determineRelativeType(expression) {

        var source = (expression.member || expression.target),
            modelParent;
        if (source) {
            var idOfModelParent = source.id.replace(/[\/].*/, "");

            modelParent = msls.services.modelService.tryLookupById(idOfModelParent);
            if (!modelParent && msls_getApplicationDefinition().name === idOfModelParent) {
                return "Application";
            }
        }

        if (msls_isApplicationDefinition(modelParent)) {
            return "Application";
        } else if (msls_isScreenDefinition(modelParent)) {
            return "Screen";
        } else if (msls_isEntityType(modelParent)) {
            return "EntityType";
        } else if (msls_isEntityContainer(modelParent)) {
            return "EntitySets";
        }

        return;
    }

    function combineBindingPaths() {

        var fullPath = null;
        $.each(arguments, function (index, path) {
            if (!!path) {
                fullPath = !!fullPath ? [fullPath, path].join(".") : path;
            }
        });

        return fullPath;
    }
    msls_combineBindingPaths = combineBindingPaths;

}());

var msls_modal,
    msls_modal_DialogResult,
    msls_modal_DialogButtons,
    msls_modal_showError;

(function () {
    msls_setProperty(msls, "modal", {});
    msls_modal = msls.modal;


    msls_defineEnum(msls_modal, {
        DialogResult: {
            none: 0,
            cancel: 1,
            ok: 2,
            yes: 4,
            no: 8
        }
    });
    msls_modal_DialogResult = msls_modal.DialogResult;

    msls_defineEnum(msls_modal, {
        DialogButtons: {
            none: 0,
            ok: msls_modal_DialogResult.ok,
            okCancel: msls_modal_DialogResult.ok | msls_modal_DialogResult.cancel,
            yesNo: msls_modal_DialogResult.yes | msls_modal_DialogResult.no,
            yesNoCancel: msls_modal_DialogResult.yes | msls_modal_DialogResult.no | msls_modal_DialogResult.cancel
        }
    });
    msls_modal_DialogButtons = msls_modal.DialogButtons;

    function createButtonOption(dialogResult) {

        var buttonOption = { result: dialogResult };

        switch (dialogResult) {
            case msls_modal_DialogResult.cancel:
                buttonOption.text = msls_getResourceString("dialogService_cancel");
                buttonOption.icon = "back";
                break;
            case msls_modal_DialogResult.ok:
                buttonOption.text = msls_getResourceString("dialogService_ok");
                buttonOption.icon = "check";
                break;
            case msls_modal_DialogResult.yes:
                buttonOption.text = msls_getResourceString("dialogService_yes");
                buttonOption.icon = "check";
                break;
            case msls_modal_DialogResult.no:
                buttonOption.text = msls_getResourceString("dialogService_no");
                buttonOption.icon = "delete";
                break;
            default:
                return;
        }

        return buttonOption;
    }

    function ensureButtonOptionArray(buttons) {
        var result = [];
        if (buttons) {
            if (Array.isArray(buttons)) {
                result = buttons;
            } else if (typeof buttons === "number" &&
                msls_isEnumValueDefined(msls_modal_DialogButtons, buttons)) {
                [
                    msls_modal_DialogResult.ok,
                    msls_modal_DialogResult.yes,
                    msls_modal_DialogResult.no,
                    msls_modal_DialogResult.cancel
                ].forEach(function (dialogResultValue) {
                    if ((buttons & dialogResultValue) === dialogResultValue) {
                        result.push(createButtonOption(dialogResultValue));
                    }
                });
            }
        }
        return result;
    }

    msls_setProperty(msls_modal, "show", function (options) {
        return msls_promiseOperation(function initShow(operation) {
            options.buttons = ensureButtonOptionArray(options.buttons);
            msls_modal._modalView.show(options).then(function onComplete(result) {
                operation.complete(result);
            });
        });
    });

    msls_setProperty(msls_modal, "close", function () {
        msls_modal._modalView.close();
    });


    msls_setProperty(msls_modal, "isOpen", function isOpen() {
        return msls_modal._modalView.isOpen();
    });

    msls_modal_showError =
    function showError(error, defaultTitle) {

        var
        title = "Error",
        errors,
        message;

        if (error.noErrorDialog) {
            return WinJS.Promise.as();
        }

        if (error.title && typeof error.title === "string") {
            title = error.title;
        } else if (!!defaultTitle && typeof defaultTitle === "string") {
            title = defaultTitle;
        }

        function getMessage(e) {
            if (e && e.message && typeof e.message === "string") {
                return e.message;
            } else if (typeof e === "string") {
                return e;
            }
            return null;
        }
        if (Array.isArray(error)) {
            message = "";
            errors = error;
            errors.forEach(function (errorItem) {
                var m = getMessage(errorItem);
                if (m) {
                    if (message) {
                        message += "\r\n";
                    }
                    message += m;
                }
            });
        } else {
            message = getMessage(error);
        }

        return msls_modal.show({
            title: title,
            message: message,
            buttons: msls_modal_DialogButtons.ok
        });
    };

}());

var msls_commandProgressStartNotification = "CommandProgressStart",
    msls_commandProgressCompleteNotification = "CommandProgressComplete";

(function () {

    var commandRunningCount = 0;
    function _onCommandStart(me) {
        var isStarting = commandRunningCount <= 0;
        commandRunningCount++;
        if (isStarting) {
            msls_notify(msls_commandProgressStartNotification);
        }
    }
    function _onCommandComplete(me) {
        commandRunningCount--;
        if (commandRunningCount <= 0) {
            msls_notify(msls_commandProgressCompleteNotification);
        }
    }


    function _computeCanExecute() {

        var me = this,
            method = me._method,
            executionContext = me._executionContext,
            argumentValues = me._argumentValues,
            missingArguments = false;
        if (!method || !executionContext || !argumentValues) {
            return false;
        }

        $.each(argumentValues, function (i, value) {
            if ((value === undefined || value === null) && !me._isOptional(i)) {
                missingArguments = true;
                return false;
            }
            return true;
        });
        if (missingArguments) {
            return false;
        }

        var canExecuteField = method.canExecute;
        var result;
        if ($.isFunction(canExecuteField)) {
            result = !!canExecuteField.apply(executionContext, argumentValues);
        } else if (typeof canExecuteField === "boolean") {
            result = canExecuteField;
        } else {
            result = true;
        }

        return result;
    }

    function _isOptional(index) {
        return false;
    }

    function execute() {
        var me = this;
        me._isExecuting = true;
        return msls_promiseOperation(function initExecute(operation) {
            _onCommandStart(me);

            if (!me._computeCanExecute()) {
                msls_throwError("cannotExecuteError", msls_getResourceString("command_cannot"));
            }

            var synchronousResult = me._method.apply(me._executionContext, me._argumentValues);
            if (WinJS.Promise.is(synchronousResult)) {
                var promise = synchronousResult;
                promise.then(function (result) {
                    operation.complete(result);
                }, function (error) {
                    operation.error(error);
                });
            } else {
                operation.complete(synchronousResult);
            }
        })._thenEx(function (error, result) {
            me._isExecuting = false;
            _onCommandComplete(me);

            if (error) {
                throw error;
            }
            return result;
        });
    }

    msls_defineClass(msls, "Command",
        function Command(method, executionContext, argumentValues) {

            this._method = method;
            this._executionContext = executionContext;
            this._argumentValues = argumentValues;
            this.options = {};
        },
        null,
        {
            _method: msls_observableProperty(null),
            _executionContext: msls_observableProperty(null),
            _argumentValues: msls_observableProperty(null),
            _isExecuting: msls_observableProperty(false),
            canExecute: msls_computedProperty(
                function canExecute_compute() {
                    return !this._isExecuting &&
                        _computeCanExecute.call(this);
                }
            ),

            execute: execute,
            _computeCanExecute: _computeCanExecute,
            _isOptional: _isOptional
        }
    );

}());

(function () {

    msls_defineClass(msls, "BoundCommand",
        function BoundCommand(bindingPath, bindingSource, boundArguments) {

            msls.Command.prototype.constructor.call(this, null, null, null);


            msls_throwIfFalsy(bindingSource, "bindingSource");

            var me = this;

            var methodBinding = (new msls.data.DataBinding(bindingPath, bindingSource, "_method", me));
            methodBinding.bind();


            var contextBindingPath = bindingPath.replace(/[.][^.]+$/, "");
            if (bindingPath === contextBindingPath) {
                me._executionContext = bindingSource;
            } else {
                var contextBinding = (new msls.data.DataBinding(contextBindingPath, bindingSource, "_executionContext", me));
                contextBinding.bind();

            }

            if (!!boundArguments && boundArguments.length > 0) {
                msls_setProperty(me, "_boundArguments", boundArguments);
                me._argumentValues = me._boundArguments.getCurrentValues();
                boundArguments.addChangeListener(null, function () {
                    me._argumentValues = me._boundArguments.getCurrentValues();
                });
            } else {
                me._argumentValues = [];
            }
        },
        msls.Command, {
            _isOptional: function _isOptional(index) {
                return !!this._boundArguments["arg" +
                    index.toString() + ".optional"];
            },

            _onDispose: function _onDispose() {
                var me = this;
                if (me._boundArguments) {
                    msls_dispose(me._boundArguments);
                    me._boundArguments = null;
                }
            }
        }
    );

}());

var msls_BoundaryOption,
    msls_NavigateBackOption;

(function () {

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies boundary behavior that occurs
        /// when navigating to or from a target screen.
        /// </field>
        BoundaryOption: {
            /// <field type="String">
            /// Specifies that nothing special will happen before entering
            /// the target screen or returning from the target screen.
            /// <br/>The target screen shows a "Close" command.
            /// </field>
            none: "none",
            /// <field type="String">
            /// Specifies that before entering the target screen, a nested
            /// change set will be started on the data workspace, and that
            /// before returning from the target screen, the nested change
            /// set will be either accepted or cancelled.
            /// <br/>The target screen shows "OK" and "Cancel" commands.
            /// </field>
            nested: "nested",
            /// <field type="String">
            /// Specifies that before entering or returning from the target
            /// screen, data workspace changes will be saved or discarded.
            /// <br/>The target screen shows "Save" and "Discard" commands.
            /// </field>
            save: "save"
        }
    });
    msls_BoundaryOption = msls.BoundaryOption;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies how far back to navigate when
        /// saving or discarding data workspace changes.
        /// </field>
        NavigateBackOption: {
            /// <field type="String">
            /// Specifies that the application will not perform any navigation.
            /// </field>
            none: "none",
            /// <field type="String">
            /// Specifies that on a successful save, the application
            /// will navigate back to the last screen that was shown
            /// using the "save" boundary option.
            /// </field>
            saveBoundary: "saveBoundary",
            /// <field type="String">
            /// Specifies that on a successful save, the application
            /// will navigate back one page prior to the last screen
            /// that was shown using the "save" boundary option.
            /// </field>
            beforeSaveBoundary: "beforeSaveBoundary"
        }
    });
    msls_NavigateBackOption = msls.NavigateBackOption;

    msls_expose("BoundaryOption", msls_BoundaryOption);
    msls_expose("NavigateBackOption", msls_NavigateBackOption);

}());

(function () {





    function _applyPropertyOverrides(me, overrideDefinition) {

        var defaultValueSource = overrideDefinition.defaultValueSource;
        if (defaultValueSource) {
            _applyDefaultValueOverride(me, defaultValueSource);
        }

        var isReadOnly = overrideDefinition.isReadOnly;
        if (typeof isReadOnly !== "undefined") {
            me._isReadOnly = !!isReadOnly;
        }

    }

    function _applyDefaultValueOverride(me, defaultValueExpression) {

        if (defaultValueExpression) {
            me._defaultValue = msls_parseConstantExpression(defaultValueExpression);
        }
    }

    function _clone(description) {

        var newDescription = new msls.PropertyDescription(description.propertyDefinition);
        newDescription._defaultValue = description._defaultValue;
        newDescription._isReadOnly = description._isReadOnly;


        return newDescription;
    }

    function applyPropertyOverrides(overrideDefinition) {
 
        var newDescription = _clone(this);
        _applyPropertyOverrides(newDescription, overrideDefinition);
        return newDescription;
    }

    function applyDefaultValueOverride(defaultValueExpression) {

        var newDescription = _clone(this);
        _applyDefaultValueOverride(newDescription, defaultValueExpression);
        return newDescription;
    }

    function applyDefaultValueOverrideFromConstant(defaultValue) {

        var newDescription = _clone(this);
        newDescription._defaultValue = defaultValue;
        return newDescription;
    }

    msls_defineClass(msls, "PropertyDescription", function (propertyDefinition) {

        this.propertyDefinition = propertyDefinition;

        var propertyType = propertyDefinition.propertyType;
        if (!propertyType) {
        } else if (!msls_isPrimitiveType(propertyType)) {
        }

        _applyDefaultValueOverride(this, propertyDefinition.defaultValueSource);
        this._isReadOnly = !!propertyDefinition.isReadOnly;
    }, null, {
        _defaultValue: null,

        isReadOnly: msls_accessorProperty(function () {
            return this._isReadOnly;
        }),
        defaultValue: msls_accessorProperty(function () {
            return this._defaultValue;
        }),
        propertyType: msls_accessorProperty(function () {
            return this.propertyDefinition.propertyType;
        }),
        isAttachable: msls_accessorProperty(function () {
            return !!this.propertyDefinition.isAttachable;
        }),
        isInheritable: msls_accessorProperty(function () {
            return !!this.propertyDefinition.isInheritable;
        }),
        propertyId: msls_accessorProperty(function () {
            return this.propertyDefinition.id;
        }),
        propertyName: msls_accessorProperty(function () {
            return this.propertyDefinition.name;
        }),

        applyPropertyOverrides: applyPropertyOverrides,
        applyDefaultValueOverride: applyDefaultValueOverride,
        applyDefaultValueOverrideFromConstant: applyDefaultValueOverrideFromConstant
    });

}());

(function () {

    function setValue(propertyId, value) {

        if (!(propertyId in this.values)) {
            return;
        }

        _setValueInternal(this, propertyId, value);
    }

    function _setValueInternal(me, propertyId, value) {

        var property = msls.services.modelService.tryLookupById(propertyId);

        var shortKey = msls_getProgrammaticName(property.name, true);

        if (shortKey in me.values) {
            delete me.values[shortKey];
            delete me.values[propertyId];
        }

        Object.defineProperty(me.values, shortKey, {
            configurable: true, enumerable: true,
            writable: false, value: value
        });
        Object.defineProperty(me.values, propertyId, {
            configurable: true, enumerable: true,
            writable: false, value: value
        });
    }

    msls_defineClass(msls, "PropertyDictionary",
        function (propertyDescriptions, contentItemName) {

            var me = this;

            this.descriptions = propertyDescriptions;
            this.values = {};
            this.contentItemName = contentItemName;

            $.each(propertyDescriptions, function (key, description) {
                _setValueInternal(me, description.propertyId, description.defaultValue);
            });


        }, null, {
            setValue: setValue
        }
    );

}());

var msls_clearPropertyResolutionCaches;

(function () {
    var guaranteedControl_RootControlId = ":RootControl";

    var __rootControl;

    var __commonPropertyDescriptions,
        __immediateChildrenAttachedProperties;

    function resolveProperties(view) {



        _resolveCommonPropertyDescriptions(this);

        _processViewSpecificProperties(this, view);
        _processControlPropertySources(this, view);

        _processParentPropertySourcesForChildren(this, this._parentView);
        _processPlaceholderPropertySources(this, this._placeholderInParent);

        this._stateIsResolved = true;
        return this._properties;
    }

    msls_clearPropertyResolutionCaches =
    function clearPropertyResolutionCaches() {
        __rootControl = null;
        __commonPropertyDescriptions = null;
        __immediateChildrenAttachedProperties = null;
    };

    function _isPropertyDefinedByParentView(me, propertyDefinition) {

        var control;
        if (!propertyDefinition || !(control = msls_getControlForPropertyDefinition(propertyDefinition))) {
            return false;
        }

        var parentControl = me._parentView;

        while (parentControl) {
            if (control.id === parentControl.id) {
                return true;
            }

            parentControl = parentControl.baseControl;
        }

        return false;
    }

    function _getAllCommonPropertyDescriptions(me) {

        if (!__commonPropertyDescriptions) {
            __commonPropertyDescriptions = [];
            __immediateChildrenAttachedProperties = [];
            var common = _getAllCommonPropertyDefinitions(me);
            $.each(common, function (index, definition) {
                if (definition.isAttachable &&
                    definition.attachedPropertyAvailability === "ImmediateChildren") {
                    __immediateChildrenAttachedProperties.push(new msls.PropertyDescription(definition));
                } else {
                    __commonPropertyDescriptions.push(new msls.PropertyDescription(definition));
                }
            });
        }

        return __commonPropertyDescriptions;
    }

    function _getAllCommonPropertyDefinitions(me) {

        var definitions = [];

        var allControls = msls_findGlobalItems(msls_isControlDefinition);
        $.each(allControls, function (index, controlDefinition) {

            if (controlDefinition.properties) {
                $.each(controlDefinition.properties, function (index2, propertyDefinition) {
                    if (propertyDefinition.isInheritable && !propertyDefinition.isAttachable) {
                    }

                    if (propertyDefinition.isAttachable) {
                        definitions.push(propertyDefinition);
                    }
                });
            }
        });

        if (!!__rootControl && !!__rootControl.properties) {
            $.each(__rootControl.properties, function (index, propertyDefinition) {
                if (!propertyDefinition.isAttachable) {
                    definitions.push(propertyDefinition);
                }
            });
        }

        return definitions;
    }

    function _getCommonPropertyDescriptionsCopy(me) {

        var descriptions = _getAllCommonPropertyDescriptions(me).slice(0);

        $.each(__immediateChildrenAttachedProperties, function (index, description) {
            if (_isPropertyDefinedByParentView(me, description.propertyDefinition)) {
                descriptions.push(description);
            }
        });

        return descriptions;
    }

    function _resolveNonCommonPropertiesForView(me, view) {

        var control = view;
        if (!!control) {
            _resolveNonCommonPropertiesForViewHelper(me, control);
        }
    }

    function _resolveNonCommonPropertiesForViewHelper(me, control) {


        var superControl = control.baseControl;
        if (!superControl) {
            superControl = __rootControl;
        }

        if (superControl) {
            if (!__rootControl || superControl.id !== __rootControl.id) {
                _resolveNonCommonPropertiesForViewHelper(me, superControl);
            }
        }

        if (control.propertyOverrides) {
            $.each(control.propertyOverrides, function (index, overrideDefinition) {
                var id = overrideDefinition.property.id,
                    propertyToOverride = me._properties[id];
                if (!propertyToOverride) {
                }

                me._properties[id] = propertyToOverride.applyPropertyOverrides(overrideDefinition);
            });
        }

        if (control.properties) {
            $.each(control.properties, function (index, propertyDefinition) {
                if (!propertyDefinition.isAttachable) {
                    me._properties[propertyDefinition.id] = new msls.PropertyDescription(propertyDefinition);
                }
            });
        }
    }

    function _resolveCommonPropertyDescriptions(me) {

        var commonProperties = _getCommonPropertyDescriptionsCopy(me);

        $.each(commonProperties, function (index, commonProperty) {
            var ownerValue;
            if (commonProperty.isInheritable && !!me._ownerPropertyValues && !!(ownerValue = me._ownerPropertyValues[commonProperty.propertyDefinition.id])) {

                commonProperty = commonProperty.applyDefaultValueOverrideFromConstant(ownerValue);
            }

            me._properties[commonProperty.propertyDefinition.id] = commonProperty;
        });
    }

    function _overridePropertyDescriptionDefaultValue(me, property, newDefaultValueExpression) {

        var id = property.id,
            propertyInDictionary = me._properties[id];
        if (propertyInDictionary) {
            me._properties[id] = propertyInDictionary.applyDefaultValueOverride(newDefaultValueExpression);
        } else {
        }
    }

    function _processViewSpecificProperties(me, view) {

        if (!view) {
            return;
        }

        _resolveNonCommonPropertiesForView(me, view);
    }

    function _processControlPropertySources(me, control) {

        if (!!control && !!control.propertySources) {
            _processPropertySources(me, control.propertySources);
        }
    }

    function _processParentPropertySourcesForChildren(me, parentControl) {

        if (!!parentControl && !!parentControl.childItemPropertySources) {
            _processPropertySources(me, parentControl.childItemPropertySources);
        }
    }

    function _processPlaceholderPropertySources(me, placeholder) {

        if (!!placeholder && !!placeholder.propertySources) {
            _processPropertySources(me, placeholder.propertySources);
        }
    }

    function _processPropertySources(me, propertySources) {

        $.each(propertySources, function (index, source) {
            _overridePropertyDescriptionDefaultValue(me, source.property, source.source);
        });
    }

    msls_defineClass(msls, "PropertyDefaultsResolver", function (
        friendlyContentItemId,
        ownerPropertyValues,
        placeholderInParent,
        parentView
    ) {


        msls_setProperty(this, "_ownerPropertyValues", ownerPropertyValues);
        msls_setProperty(this, "_placeholderInParent", placeholderInParent);
        msls_setProperty(this, "_parentView", parentView);
        msls_setProperty(this, "_properties", {});

        if (!__rootControl) {
            __rootControl = msls.services.modelService.tryLookupById(guaranteedControl_RootControlId);
        }

    }, null, {
        _stateIsResolved: false,
        resolveProperties: resolveProperties
    });

}());

var msls_initScreen,
    msls_initScreenDetails,
    msls_makeVisualCollection,
    msls_initVisualCollection,
    msls_initVisualCollectionDetails,
    msls_Screen_rawGetCollectionPropertyValue;

(function () {

    msls_defineClassWithDetails(msls, "Screen",
        function Screen(dataWorkspace, modelId, screenParameters) {
            /// <summary>
            /// Represents a screen.
            /// </summary>
            /// <param name="dataWorkspace" type="msls.DataWorkspace">
            /// A data workspace.
            /// </param>
            /// <param name="modelId" type="String">
            /// The identifier of the model item that defines this screen.
            /// </param>
            /// <param name="screenParameters" type="Array" optional="true">
            /// An object containing parameters to the screen.
            /// </param>
            /// <field name="details" type="msls.Screen.Details">
            /// Gets the details for this screen.
            /// </field>
            msls_BusinessObject.call(this);
            msls_initScreen(this, dataWorkspace, modelId, screenParameters);
        },
        function Screen_Details(owner) {
            /// <summary>
            /// Represents the details for a screen.
            /// </summary>
            /// <param name="owner" type="msls.Screen">
            /// The screen that owns this details object.
            /// </param>
            /// <field name="owner" type="msls.Screen">
            /// Gets the screen that owns this details object.
            /// </field>
            /// <field name="screen" type="msls.Screen">
            /// Gets the screen that owns this details object.
            /// </field>
            /// <field name="displayName" type="String">
            /// Gets or sets the display name for the screen.
            /// </field>
            /// <field name="dataWorkspace" type="msls.DataWorkspace">
            /// Gets the data workspace that provides the screen's data.
            /// </field>
            /// <field name="saveChangesTo" type="Array">
            /// Gets the array of editable data services for the screen.
            /// </field>
            /// <field name="rootContentItem" type="msls.ContentItem">
            /// Gets the root content item for the screen.
            /// </field>
            /// <field name="pages" type="Array">
            /// Gets the root content items for the screen's tab and dialog pages.
            /// </field>
            /// <field name="startPage" type="msls.ContentItem">
            /// Gets the root content item for the screen's start page.
            /// </field>
            /// <field name="serverErrors" type="Array">
            /// Gets the server errors that occurred when the screen was last saved.
            /// </field>
            /// <field name="properties" type="msls.Screen.Details.PropertySet">
            /// Gets the set of property objects for the screen.
            /// </field>
            msls_BusinessObject_Details.call(this, owner);
            if (window.intellisense) {
                if (!owner) {
                    this.owner = null;
                }
            }
            msls_initScreenDetails(this, owner);
        },
        msls_BusinessObject
    );
    msls_intellisense_setTypeProvider(
        msls.Screen.Details.prototype, "screen",
        function (o) {
            return o.screen.constructor;
        }
    );

    msls_defineClass(msls, "VisualCollection",
        function VisualCollection(screenDetails, loader) {
            /// <summary>
            /// Represents a collection of data that is shown by a screen.
            /// </summary>
            /// <param name="screenDetails" type="msls.Screen.Details">
            /// The screen details object that owns the screen
            /// collection property whose value is this collection.
            /// </param>
            /// <param name="loader">
            /// An object that is used to load data into the collection.
            /// </param>
            /// <field name="screen" type="msls.Screen">
            /// Gets the screen that owns this collection.
            /// </field>
            /// <field name="state" type="String">
            /// Gets the current state (from msls.VisualCollection.State)
            /// of this collection.
            /// </field>
            /// <field name="isLoaded" type="Boolean">
            /// Gets a value indicating if this collection
            /// has loaded one or more pages of data.
            /// </field>
            /// <field name="canLoadMore" type="Boolean">
            /// Gets a value indicating if this collection
            /// believes that it can load more pages of data.
            /// </field>
            /// <field name="loadError" type="String">
            /// Gets the last load error that occurred, or null if no error occurred.
            /// </field>
            /// <field name="selectedItem" type="Object">
            /// Gets or sets the currently selected item.
            /// </field>
            /// <field name="count" type="Number">
            /// Gets the number of items that are currently in this collection.
            /// </field>
            /// <field name="data" type="Array">
            /// Gets the items that are currently in this collection.
            /// </field>
            msls_initVisualCollection(this, screenDetails, loader);
        }
    );
    msls_intellisense_setTypeProvider(
        msls.VisualCollection.prototype, "screen",
        function (o) {
            return o._$screenClass || o.screen.constructor;
        }
    );

}());

var msls_AttachedLabelPosition,
    msls_HorizontalAlignment,
    msls_WidthSizingMode,
    msls_HeightSizingMode,
    msls_ContentItemKind,
    msls_PageKind,
    msls_VisualState;

(function () {

    var _DataBinding = msls.data.DataBinding;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies the position of an attached label for a content item.
        /// </field>
        AttachedLabelPosition: {
            /// <field type="String">
            /// Specifies that the attached label is positioned left of the
            /// content and is aligned left in the space where it appears.
            /// </field>
            leftAligned: "LeftAligned",
            /// <field type="String">
            /// Specifies that the attached label is positioned left of the
            /// content and is aligned right in the space where it appears.
            /// </field>
            rightAligned: "RightAligned",
            /// <field type="String">
            /// Specifies that the attached label
            /// is positioned above the content.
            /// </field>
            topAligned: "Top",
            /// <field type="String">
            /// Specifies that the attached label is left aligned unless
            /// there is not enough space, in which case it is top aligned.
            /// </field>
            auto: "Auto",
            /// <field type="String">
            /// Specifies that the attached label is hidden and the space
            /// where the attached label would be shown is still consumed.
            /// </field>
            hidden: "Hidden",
            /// <field type="String">
            /// Specifies that the attached label is not
            /// visible and does not consume any space.
            /// </field>
            none: "None"
        }
    });
    msls_AttachedLabelPosition = msls.AttachedLabelPosition;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies the horizontal alignment of a content item.
        /// </field>
        HorizontalAlignment: {
            /// <field type="String">
            /// Specifies that the content item is left aligned.
            /// </field>
            left: "Left",
            /// <field type="String">
            /// Specifies that the content item is right aligned.
            /// </field>
            right: "Right"
        }
    });
    msls_HorizontalAlignment = msls.HorizontalAlignment;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies how the width of a content item is calculated.
        /// </field>
        WidthSizingMode: {
            /// <field type="String">
            /// Specifies that the content item width is based on the
            /// available width provided by its parent content item.
            /// </field>
            stretchToContainer: "StretchToContainer",
            /// <field type="String">
            /// Specifies that the content item width is
            /// based on the desired width of its content.
            /// </field>
            fitToContent: "FitToContent",
            /// <field type="String">
            /// Specifies that the content item width is fixed.
            /// </field>
            fixedSize: "FixedSize"
        }
    });
    msls_WidthSizingMode = msls.WidthSizingMode;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies how the height of a content item is calculated.
        /// </field>
        HeightSizingMode: {
            /// <field type="String">
            /// Specifies that the content item height is based on the
            /// available height provided by its parent content item.
            /// </field>
            stretchToContainer: "StretchToContainer",
            /// <field type="String">
            /// Specifies that the content item height is
            /// based on the desired height of its content.
            /// </field>
            fitToContent: "FitToContent",
            /// <field type="String">
            /// Specifies that the content item height is fixed.
            /// </field>
            fixedSize: "FixedSize"
        }
    });
    msls_HeightSizingMode = msls.HeightSizingMode;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies the kind of a content item.
        /// </field>
        ContentItemKind: {
            /// <field type="String">
            /// Specifies a content item that binds to a visual collection.
            /// </field>
            collection: "Collection",
            /// <field type="String">
            /// Specifies a content item that binds
            /// to a command that invokes a method.
            /// </field>
            command: "Command",
            /// <field type="String">
            /// Specifies a content item that binds to a
            /// value such as a number, date or string.
            /// </field>
            value: "Value",
            /// <field type="String">
            /// Specifies a content item that binds
            /// to an object such as an entity.
            /// </field>
            details: "Details",
            /// <field type="String">
            /// Specifies a content item that contains other content items.
            /// </field>
            group: "Group",
            /// <field type="String">
            /// Specifies the root content item of a screen.
            /// </field>
            screen: "Screen",
            /// <field type="String">
            /// Specifies the root content item of a tab on a screen.
            /// </field>
            tab: "Tab",
            /// <field type="String">
            /// Specifies the root content item of a dialog on a screen.
            /// </field>
            dialog: "Dialog"
        }
    });
    msls_ContentItemKind = msls.ContentItemKind;

    msls_defineEnum(msls, {
        /// <field>
        /// Specifies the kind of page represented by a content item.
        /// </field>
        PageKind: {
            /// <field type="String">
            /// Specifies that the content item does not represent a page.
            /// </field>
            none: "None",
            /// <field type="String">
            /// Specifies that the content item represents
            /// a tab that appears in the screen tabs bar.
            /// </field>
            tab: "Tab",
            /// <field type="String">
            /// Specifies that the content item represents a dialog
            /// that is shown using the "none" boundary option.
            /// </field>
            simpleDialog: "SimpleDialog",
            /// <field type="String">
            /// Specifies that the content item represents a dialog
            /// that is shown using the "nested" boundary option.
            /// </field>
            nestedDialog: "NestedDialog"
        }
    });
    msls_PageKind = msls.PageKind;

    msls_defineEnum(msls, {
        VisualState: {
            hidden: "hidden",

            loading: "loading",

            hasDisplayError: "hasDisplayError",

            disabled: "disabled",

            readOnly: "readOnly",

            hasValidationError: "hasValidationError",

            normal: "normal"
        }
    });
    msls_VisualState = msls.VisualState;


    function _onDispose() {
        var me = this;

        me.children.forEach(msls_dispose);
        me.children = null;

        me.commandItems.forEach(msls_dispose);
        me.commandItems = null;

        me._binding = null;
        me._detailsBinding = null;
        me._choicesSourceBinding = null;
        me._externalBindings = null;

        me.parent = null;
        me._view = null;

        me.__details = null;
        me.__screen = null;
        me.__value = null;
        me.__data = null;
        me.__choicesSource = null;
    }

    function _initialize(initialData) {

        var me = this,
            model = me.model,
            choicesSource = model.choicesSource,
            choicesSourceExpressionInfo;

        me.kind = model.kind;
        me.name = model.name;
        me.displayName = model.displayName;
        me.validationResults = [];

        if (choicesSource) {
            choicesSourceExpressionInfo = msls_parseContentItemRelativeExpression(choicesSource);
            me._choicesSourceBindingPath = choicesSourceExpressionInfo.valueBindingPath;
        }

        me._initializeCore(initialData);
    }

    function _initializeCore(initialData) {

        var me = this,
            model = me.model;
        me.data = initialData;
        me.children = [];
        me.commandItems = [];

        me._parseDataSource();

        if (!!me.parent && me.parent.kind !== "Collection") {
            me.data = me.parent.value;
        }

        me._resolveProperties();
        _cacheCommonPropertyValues(me);
        me._parseChoiceList();

        if (me.kind === msls_ContentItemKind.value) {
            if (me.valueModel) {
                var attribute = msls_getAttribute(me.valueModel, ":@MaxLength");
                if (!!attribute) {
                    me.maxLength = attribute.value;
                }
            }
        }

        if (!!me.parent && me.parent._isActivated) {
            me._activate();
        }
        me._isUnderList = !!me.parent && (me.parent.kind === msls_ContentItemKind.collection || me.parent._isUnderList);
    }

    function _activate() {

        var me = this,
            i, len;

        if (!me._bindingInitialized) {
            msls_setProperty(me, "_bindingInitialized", true);

            _initializeBindings(me);

        } else {
            if (!!me._detailsBinding) {
                me._detailsBinding.activate();
            }

            if (!!me._binding) {
                me._binding.activate();
            }

            if (!!me._choicesSourceBinding) {
                me._choicesSourceBinding.activate();
            }

            var bindings = me._externalBindings;
            if (!!bindings) {
                for (i = 0, len = bindings.length; i < len; i++) {
                    bindings[i].activate();
                }
            }
        }
        msls_setProperty(me, "_isActivated", true);

        for (i = 0, len = me.children.length; i < len; i++) {
            me.children[i]._activate();
        }
        for (i = 0, len = me.commandItems.length; i < len; i++) {
            me.commandItems[i]._activate();
        }
    }

    function _deactivate() {

        var me = this,
            i, len;

        me._isActivated = false;

        if (!!me._detailsBinding) {
            me._detailsBinding.deactivate();
        }

        if (!!me._binding) {
            me._binding.deactivate();
        }

        if (!!me._choicesSourceBinding) {
            me._choicesSourceBinding.deactivate();
        }

        var bindings = me._externalBindings;
        if (!!bindings) {
            for (i = 0, len = bindings.length; i < len; i++) {
                bindings[i].deactivate();
            }
        }

        for (i = 0, len = me.children.length; i < len; i++) {
            me.children[i]._deactivate();
        }
        for (i = 0, len = me.commandItems.length; i < len; i++) {
            me.commandItems[i]._deactivate();
        }
    }

    function _setParent(parentCI) {
        this.parent = parentCI;
        parentCI.children.push(this);
    }

    function _setCommandItemParent(parentCI) {

        this.parent = parentCI;
        parentCI.commandItems.push(this);
    }

    function findItem(contentItemName) {
        /// <summary>
        /// Recursively searches for a content
        /// item starting from this content item.
        /// </summary>
        /// <param name="contentItemName" type="String">
        /// The unique name of a content item.
        /// </param>
        /// <returns type="msls.ContentItem">
        /// The content item with the specified name,
        /// if found; otherwise, a falsy value.
        /// </returns>
        var index = 0,
            result;

        if (this.name === contentItemName) {
            return this;
        }

        if (!!this.children) {
            while (index < this.children.length) {
                result = this.children[index++].findItem(contentItemName);
                if (!!result) {
                    return result;
                }
            }
        }

        index = 0;
        if (!!this.commandItems) {
            while (index < this.commandItems.length) {
                result = this.commandItems[index++].findItem(contentItemName);
                if (!!result) {
                    return result;
                }
            }
        }

        return result;
    }

    function validate(recursive) {
        /// <summary>
        /// Runs defined validation rules on the value property and
        /// updates the value of the "validationResults" property.
        /// </summary>
        /// <param name="recursive" type="Boolean" optional="true">
        /// Indicates if child content items should also be validated. If true,
        /// the "validationResults" property on child content items are updated.
        /// </param>
        var results,
            currentStringConversionError = this._stringValueConversionError;

        if (!!this.details && this.kind === msls_ContentItemKind.value) {
            results = msls_validate(this.details, this.value);
        }

        this._stringValueConversionError = null;
        if (!!currentStringConversionError) {
            results.push(currentStringConversionError);
        }
        if (!results) {
            clearValidationResults(this);
        } else {
            this.validationResults = results;
        }

        if (recursive) {
            $.each(this.children, function () {
                this.validate(recursive);
            });
        }
    }

    function hasValidationErrors(recursive) {
        /// <summary>
        /// Indicates if this content item currently has validation errors.
        /// </summary>
        /// <param name="recursive" type="Boolean" optional="true">
        /// Indicates if child content items should also be checked.
        /// </param>
        /// <returns type="Boolean">
        /// True if there are validation errors; otherwise, false.
        /// </returns>
        if (this.validationResults.length) {
            return true;
        }

        if (recursive) {
            return msls_iterate(this.children).any(function () {
                return this.hasValidationErrors(recursive);
            });
        }
        return false;
    }

    function dataBind(bindingPath, callback) {
        /// <summary>
        /// Binds to a source identified by a binding path like "value.unitPrice".
        /// </summary>
        /// <param name="bindingPath" type="String">
        /// A dot-delimited binding path describing the path to the source.
        /// </param>
        /// <param name="callback">
        /// A function that is called when the source changes.
        /// </param>
        if (!callback || !$.isFunction(callback)) {
            throw msls_getResourceString("databinding_invalid_callback");
        }

        var binding = new msls.data.DataBinding(bindingPath, this, "", callback,
                msls_data_DataBindingMode.oneWayFromSource);
        binding.bind();

        if (!this._externalBindings) {
            msls_setProperty(this, "_externalBindings", [binding]);
        } else {
            this._externalBindings.push(binding);
        }
    }


    function _isPage(me) {
        return me.pageKind !== msls_PageKind.none;
    }

    function virtual_parseDataSource() {

        var me = this,
            model = me.model,
            bindToParent = !!me.parent && me.parent.kind !== "Collection";

        if (!model.dataSource) {
            me.bindingPath = "data";
            if (bindToParent) {
                msls_setProperty(me, "_detailsBindingPath", "parent.details");
            }
        } else {
            if (me.kind === msls_ContentItemKind.command) {
                me.bindingPath = null;
                msls_setProperty(me, "_detailsBindingPath", null);
            } else {
                var expressionInfo = msls_parseContentItemRelativeExpression(model.dataSource);

                me.bindingPath = expressionInfo.valueBindingPath;
                if (me.bindingPath === "data" && bindToParent) {
                    msls_setProperty(me, "_detailsBindingPath", "parent.details");
                } else {
                    msls_setProperty(me, "_detailsBindingPath", expressionInfo.detailsBindingPath);
                }
                me.valueModel = expressionInfo.lastModelItem;
            }
        }
    }

    function _initializeBindings(me) {
        var choicesSourceBindingPath;

        if (!!me._detailsBindingPath) {
            msls_setProperty(me, "_detailsBinding", new _DataBinding(me._detailsBindingPath, me, "details", me, msls_data_DataBindingMode.oneWayFromSource));
            me._detailsBinding.bind();
        }

        if (!!me.bindingPath) {
            msls_setProperty(me, "_binding", new _DataBinding(me.bindingPath, me, "value", me));
            me._binding.bind();
        }

        choicesSourceBindingPath = me._choicesSourceBindingPath;
        if (choicesSourceBindingPath) {
            msls_setProperty(me, "_choicesSourceBinding",
                new _DataBinding(choicesSourceBindingPath, me, "choicesSource", me));
            me._choicesSourceBinding.bind();
        }

        function runValidation() {
            var details = me.details,
                entity = details && details.owner,
                entityDetails = entity && entity.details;

            if (me.kind === msls_ContentItemKind.value) {
                if (me._stringValueUpdating ||
                    (!!details &&
                     (details.isChanged || (!!entityDetails && entityDetails.entityState === msls.EntityState.added)))) {
                    me.validate();
                } else {
                    clearValidationResults(me);
                }
            }

            me._validated = true;
        }

        me.addChangeListener("details", function onDetailsChange() {
            me._validated = false;
            msls_dispatch(function () {
                if (!me._validated) {
                    runValidation();
                }
            });
        });

        me.addChangeListener("value", function onValueChange() {
            me._valueUpdating = true;
            try {
                if (!me._stringValueUpdating && me.kind === msls_ContentItemKind.value) {
                    setStringValueFromValue(me);
                }
                runValidation();

                if (me.kind !== msls_ContentItemKind.collection) {
                    var value = me.value,
                        children = me.children,
                        commandItems = me.commandItems,
                        i, len;

                    if (children) {
                        for (i = 0, len = children.length; i < len; i++) {
                            children[i].data = value;
                        }
                    }
                    if (commandItems) {
                        for (i = 0, len = commandItems.length; i < len; i++) {
                            commandItems[i].data = value;
                        }
                    }
                }
            } finally {
                me._valueUpdating = false;
            }
        });

        me.addChangeListener("stringValue", function onStringValueChange() {
            if (!me._stringValueUpdating) {
                me._stringValueUpdating = true;
                try {
                    if (!me._valueUpdating && me.kind === msls_ContentItemKind.value) {
                        setValueFromStringValue(me);
                    }
                } finally {
                    me._stringValueUpdating = false;
                }
            }
        });

        if (me.value !== undefined) {
            me.dispatchChange("value");
        }
    }

    function virtual_resolveProperties() {

        var me = this,
            propertiesOwner = me.parent,
            model = me.model,
            ownerPropertyValues = propertiesOwner ? propertiesOwner.properties : {},
            placeholderInParent = null;

        var resolver = new msls.PropertyDefaultsResolver(me.name || me.displayName,
            ownerPropertyValues,
            placeholderInParent, me.parent ? me.parent.controlModel : null);
        var resolvedDescriptions = resolver.resolveProperties(me.controlModel);
        msls_setProperty(me, "_dictionary", new msls.PropertyDictionary(resolvedDescriptions, me.name));

        if (model.propertySources) {
            $.each(model.propertySources, function () {
                var info = _parsePropertySource(me, this);
                me._dictionary.setValue(info.property.id, info.value);
            });
        }
    }

    function _cacheCommonPropertyValues(me) {

        me.horizontalAlignment = me.properties[builtInModule.controlPropertyHorizontalAlignmentId];
        me.widthSizingMode = me.properties[builtInModule.controlPropertyWidthSizingModeId];
        me.heightSizingMode = me.properties[builtInModule.controlPropertyHeightSizingModeId];
        msls_setProperty(me, "_isHStretch", me.widthSizingMode === msls_WidthSizingMode.stretchToContainer);
        msls_setProperty(me, "_isVStretch", me.heightSizingMode === msls_HeightSizingMode.stretchToContainer);
    }

    function _parsePropertySource(me, propertySource) {


        var property = propertySource.property,
            value;

        if ("value" in propertySource) {
            value = propertySource.value;
        } else {


            if (!!property.isAction && !!propertySource.source) {
                var expressionInfo = msls_parseContentItemRelativeExpression(propertySource.source),
                    boundArguments = msls_createBoundArguments(me, expressionInfo.argumentBindings);
                if (!!expressionInfo.associatedCollection ||
                    expressionInfo.createNewEntities.length > 0) {
                    var targetMethod = expressionInfo.lastModelItem;
                    boundArguments.length = targetMethod.parameters.length;
                    boundArguments["arg" + (boundArguments.length++).toString()] = {
                        canExecute: createCanExecute(me, expressionInfo),
                        beforeShown: createBeforeShown(me, expressionInfo)
                    };
                }
                value = new msls.BoundCommand(
                    expressionInfo.valueBindingPath,
                    me, boundArguments);
                msls_addLifetimeDependency(value, boundArguments);
                msls_addLifetimeDependency(me, value);
            }
        }

        return { property: property, value: value };
    }

    function createCanExecute(me, expressionInfo) {
        return function canExecute() {
            var result = true,
                createNewEntities = expressionInfo.createNewEntities,
                dataWorkspace = me.screen.details.dataWorkspace,
                associatedCollection = expressionInfo.associatedCollection,
                visualCollection, entity;
            if (associatedCollection) {
                visualCollection = me.screen[
                    msls_getProgrammaticName(associatedCollection.name)];
            }
            result = msls_iterate(createNewEntities).all(
                function () {
                    var _EntityClass;
                    if (!associatedCollection && !!this.entityType) {
                        _EntityClass = window.msls.application[this.entityType.name];
                        return msls_EntitySet_getEntitySetForEntityType(
                            dataWorkspace, _EntityClass).canInsert;
                    } else if (associatedCollection) {
                        return visualCollection.addNew.canExecute.apply(visualCollection);
                    }
                    return true;
                }
            );
            if (!result) {
                return result;
            }
            if (!!associatedCollection &&
                !msls_iterate(createNewEntities).first(
                    function () { return !this.entityType; })) {
                entity = visualCollection.selectedItem;
                result = !!entity && (
                    entity.details.entityState === msls.EntityState.added ||
                    entity.details.entitySet.canUpdate);
            }
            return result;
        };
    }

    function createBeforeShown(me, expressionInfo) {
        if (expressionInfo.createNewEntities.length > 0) {
            return function beforeShown() {
                var targetScreen = this, _EntityClass,
                    visualCollection, newEntity;
                expressionInfo.createNewEntities.forEach(function (createNewEntity) {
                    if (!expressionInfo.associatedCollection &&
                        !!createNewEntity.entityType) {
                        _EntityClass = window.msls.application[createNewEntity.entityType.name];
                        newEntity = new _EntityClass(
                            msls_EntitySet_getEntitySetForEntityType(
                                targetScreen.details.dataWorkspace, _EntityClass
                            )
                        );
                    } else if (expressionInfo.associatedCollection) {
                        visualCollection = me.screen[
                            msls_getProgrammaticName(expressionInfo.associatedCollection.name)];
                        newEntity = visualCollection.addNew();
                    }
                    if (createNewEntity.targetParameter) {
                        targetScreen[msls_getProgrammaticName(createNewEntity.targetParameter.name)] = newEntity;
                    }
                });
            };
        } else {
            return null;
        }
    }

    function setStringValueValidationResult(me, validationResult) {

        me._stringValueConversionError = validationResult;
        me.validationResults = [validationResult];
    }

    function clearValidationResults(me) {

        if (me.validationResults.length) {
            me.validationResults = [];
        }
    }

    function clearStringValueValidationResult(me) {

        if (me._stringValueConversionError) {
            me._stringValueConversionError = null;
            clearValidationResults(me);
        }
    }

    function setStringValueFromValue(me) {

        var stringValue = "",
            value = me.value,
            property;

        clearStringValueValidationResult(me);

        if (value !== undefined && value !== null) {
            if (!!me.details) {
                property = me.details.getModel();
            }
            if (!!property && !!property.propertyType && (
                property.propertyType.id === ":TimeSpan?" ||
                property.propertyType.id === ":TimeSpan")) {
                stringValue = getTimeSpanStringValueFromValue(value);
            } else {
                stringValue = value.toString();
            }
            if (me.choiceList) {
                $.each(me.choiceList, function () {
                    if (this.value === value) {
                        stringValue = this.stringValue;
                        return false;
                    }
                    return true;
                });
            }
        }
        me.stringValue = stringValue;
    }

    function setValueFromStringValue(me) {

        var value = me.stringValue,
            converted = false,
            property,
            convertedValue;

        if (me.choiceList) {
            $.each(me.choiceList, function () {
                if (this.stringValue === me.stringValue) {
                    value = this.value;
                    converted = true;
                    return false;
                }
                return true;
            });
        }

        if (!converted && !!me.details) {

            property = me.details.getModel();
            convertedValue = msls_convert_type(value, property.propertyType);
            if (convertedValue.error) {
                var validationResult = new msls_ValidationResult(me.details, convertedValue.error);
                setStringValueValidationResult(me, validationResult);
            } else {
                clearStringValueValidationResult(me);

                if (me.value === convertedValue.value) {
                    me.validate();
                }
                me.value = convertedValue.value;
                setStringValueFromValue(me);
            }
        } else {
            me.value = value;
        }
    }

    function getTimeSpanStringValueFromValue(value) {
        var t = value,
            sign = "",
            ms,
            days,
            hours,
            minutes,
            seconds;
        ms = t.ms;
        if (ms < 0) {
            sign = "-";
            ms = -ms;
        }
        days = Math.floor(ms / 86400000);
        ms -= 86400000 * days;
        hours = Math.floor(ms / 3600000);
        ms -= 3600000 * hours;
        minutes = Math.floor(ms / 60000);
        ms -= 60000 * minutes;
        seconds = Math.floor(ms / 1000);
        ms -= seconds * 1000;
        return sign + ((days > 0) ? days.toString() + "." : "") + formatTimeElement(hours) + ":" + formatTimeElement(minutes) +
                        ":" + formatTimeElement(seconds) + ((ms > 0) ? "." + ms.toString() : "");
    }

    function formatTimeElement(value) {
        if (value < 10) {
            return "0" + value.toString();
        } else {
            return value.toString();
        }
    }

    function virtual_parseChoiceList() {

        var me = this,
            dataSource,
            supportedValues,
            i,
            isRequired;

        if (me.kind === msls_ContentItemKind.value) {
            if (me.valueModel) {
                supportedValues = msls_getAttributes(me.valueModel, ":@SupportedValue");
                if (supportedValues) {
                    me.choiceList = [];
                    isRequired = msls_getAttribute(me.valueModel, ":@Required");
                    if (!isRequired) {
                        me.choiceList.push({ value: "", stringValue: "" });
                    }

                    $.each(supportedValues, function (key, value) {
                        me.choiceList.push(
                             {
                                 value: this.value,
                                 stringValue: this.displayName ? this.displayName : this.value
                             }
                         );
                    });

                }
            }
        }

    }

    function _pageKind_get() {
        if (this.kind === msls_ContentItemKind.tab) {
            return msls_PageKind.tab;
        } else if (this.kind === msls_ContentItemKind.dialog) {
            var dialogType = this.properties[builtInModule.controlPropertyDialogPagesDialogTypeName];
            return dialogType === "Close" ? msls_PageKind.simpleDialog : msls_PageKind.nestedDialog;
        } else {
            return msls_PageKind.none;
        }
    }


    function _computeIsEnabled() {

        var details = this.details;
        if (!details && !this.value) {
            return false;
        }

        var tap;
        if ((this.kind === msls_ContentItemKind.command) &&
            !!(tap = this.properties[builtInModule.controlPropertyTapName])) {
            if (!tap.canExecute) {
                return false;
            }
        }

        var owner = details && details.owner,
            ownerDetails = owner && owner.details;
        if (ownerDetails && "entityState" in ownerDetails) {
            var entityState = ownerDetails.entityState;
            if (entityState === msls.EntityState.deleted || entityState === msls.EntityState.discarded) {
                return false;
            }
        }

        var developerIsEnabled = this._backingIsEnabled;
        if (typeof this._backingIsEnabled === "boolean") {
            return developerIsEnabled;
        }

        var parentItem = this.parent;
        if (!!parentItem && !_isPage(this)) {
            return parentItem.isEnabled;
        }

        return true;
    }

    function _setIsEnabled(value) {
        this._backingIsEnabled = value;
    }

    function _computeIsReadOnly() {
        var me = this,
            details = me.details,
            detailsIsReadOnly = details && details.isReadOnly,
            developerIsReadOnly = me._backingIsReadOnly,
            parentItem = me.parent;

        if (typeof detailsIsReadOnly === "boolean" && detailsIsReadOnly) {
            return true;
        }

        if (typeof developerIsReadOnly === "boolean") {
            return developerIsReadOnly;
        }

        if (!!parentItem && !_isPage(me) && parentItem.kind !== msls_ContentItemKind.collection) {
            return parentItem.isReadOnly;
        }

        return false;
    }

    function _setIsReadOnly(value) {
        this._backingIsReadOnly = value;
    }

    function _computeIsVisible() {

        var developerIsVisible = this._backingIsVisible;
        if (typeof developerIsVisible === "boolean") {
            return developerIsVisible;
        }

        if (this.properties[msls_builtIn_hiddenIfDisabledProperty]) {
            if (!this.isEnabled) {
                return false;
            }
        }

        var model = this.model;
        return !model.isHidden;
    }

    function _setIsVisible(value) {
        this._backingIsVisible = value;
    }

    function _computeIsLoading() {
        if (this.kind === msls_ContentItemKind.command) {
            return false;
        }

        var details = this.details;
        if (details) {
            var isLoaded = details.isLoaded;
            if (typeof isLoaded === "boolean") {
                return !isLoaded && !details.loadError && !this.displayError;
            }
        }

        return false;
    }

    function _computeDisplayError() {
        if (this.kind === msls_ContentItemKind.command) {
            return false;
        }

        if (this._backingDisplayError) {
            return this._backingDisplayError;
        }

        var details = this.details;
        return details ? details.loadError : null;
    }

    function _setDisplayError(value) {
        this._backingDisplayError = value;
    }

    function _computeVisualState() {


        if (!this.isVisible) {
            return msls_VisualState.hidden;
        } else if (this.displayError) {
            return msls_VisualState.hasDisplayError;
        } else if (this.isLoading) {
            return msls_VisualState.loading;
        } else if (!this.isEnabled) {
            return msls_VisualState.disabled;
        } else if (this.isReadOnly) {
            return msls_VisualState.readOnly;
        } else if (!!this.validationResults.length && this.kind !== msls_ContentItemKind.command) {
            return msls_VisualState.hasValidationError;
        } else {
            return msls_VisualState.normal;
        }
    }


    msls_defineClass(msls, "ContentItem", function ContentItem(screenObject, model) {
            /// <summary>
            /// Represents the view model for an item of
            /// content that is visualized by a screen.
            /// </summary>
            /// <param name="screenObject" type="msls.Screen">
            /// The screen that owns this content item.
            /// </param>
            /// <param name="model">
            /// The modeled definition of this content item.
            /// </param>
            ///
            /// <field name="application">
            /// Gets the application object.
            /// </field>
            /// <field name="screen" type="msls.Screen">
            /// Gets the screen that produced this content item.
            /// </field>
            /// <field name="parent" type="msls.ContentItem">
            /// Gets the parent content item that owns this content item.
            /// </field>
            /// <field name="model" type="Object">
            /// Gets the model item describing this content item.
            /// </field>
            /// <field name="name" type="String">
            /// Gets the name of this content item.
            /// </field>
            /// <field name="kind" type="String">
            /// Gets the kind (from msls.ContentItemKind) of this content item.
            /// </field>
            /// <field name="pageKind" type="String">
            /// Gets the page kind (from msls.PageKind) of this content item.
            /// </field>
            /// <field name="displayName" type="String">
            /// Gets or sets the display name for this content item.
            /// </field>
            /// <field name="data" type="Object">
            /// Gets the source data object from which the
            /// "details" and "value" properties are bound.
            /// </field>
            /// <field name="bindingPath" type="String">
            /// Gets the binding path that produces the "value" property.
            /// </field>
            /// <field name="valueModel" type="Object">
            /// Gets the model item describing the value of this content item.
            /// </field>
            /// <field name="maxLength" type="Number">
            /// Gets the maximum length of the value for this content item, if
            /// the value's data type supports the concept of maximum length.
            /// </field>
            /// <field name="choiceList" type="Array">
            /// Gets the list of static choices for the
            /// value of this content item, if applicable.
            /// </field>
            /// <field name="choicesSource" type="msls.VisualCollection">
            /// Gets or sets a visual collection that provides a dynamic
            /// set of choices for the value of this content item.
            /// </field>
            /// <field name="value" type="Object">
            /// Gets or sets the value that this content item represents.
            /// </field>
            /// <field name="stringValue" type="String">
            /// Gets or sets the string representation of the "value" property.
            /// </field>
            /// <field name="details" type="msls.BusinessObject.Details.Property">
            /// Gets the details property object for the value that this
            /// content item represents, using a binding path that is
            /// derived from the "bindingPath" property.
            /// </field>
            /// <field name="validationResults" type="Array">
            /// Gets the last set of validation results that were produced
            /// for this content item by calling the validate() method.
            /// </field>
            /// <field name="controlModel" type="Object">
            /// Gets the model item describing the control
            /// that is visualizing this content item.
            /// </field>
            /// <field name="properties" type="Object">
            /// Gets the set of control specific properties used to
            /// configure the visualization of this content item.
            /// </field>
            /// <field name="horizontalAlignment" type="String">
            /// Gets the horizontal alignment (from msls.HorizontalAlignment)
            /// of this content item.
            /// </field>
            /// <field name="widthSizingMode" type="String">
            /// Gets the width sizing mode (from msls.WidthSizingMode)
            /// for this content item.
            /// </field>
            /// <field name="heightSizingMode" type="String">
            /// Gets the height sizing mode (from msls.HeightSizingMode)
            /// for this content item.
            /// </field>
            /// <field name="isVisible" type="Boolean">
            /// Gets or sets a value indicating if the
            /// control for this content item should be visible.
            /// </field>
            /// <field name="isEnabled" type="Boolean">
            /// Gets a value indicating if the control
            /// for this content item should be enabled.
            /// </field>
            /// <field name="isReadOnly" type="Boolean">
            /// Gets a value indicating if the control
            /// for this content item should be read only.
            /// </field>
            /// <field name="commandItems" type="Array">
            /// Gets the command content items owned by this content item.
            /// </field>
            /// <field name="children" type="Array">
            /// Gets the child content items owned by this content item.
            /// </field>
            /// <field name="onchange" type="Function">
            /// Gets or sets a handler for the change event, which is called any
            /// time the value of an observable property on this object changes.
            /// </field>



            this.screen = screenObject;
            this.model = model;

        }, null, {
            application: msls_accessorProperty(function application_get() {
                return window.msls.application;
            }),
            choicesSource: msls_observableProperty(),
            data: msls_observableProperty(),
            details: msls_observableProperty(),
            displayName: msls_observableProperty(),

            isEnabled: msls_computedProperty(_computeIsEnabled, _setIsEnabled),
            isReadOnly: msls_computedProperty(_computeIsReadOnly, _setIsReadOnly),
            isLoading: msls_computedProperty(_computeIsLoading),
            displayError: msls_computedProperty(_computeDisplayError, _setDisplayError),
            isVisible: msls_computedProperty(_computeIsVisible, _setIsVisible),
            _visualState: msls_computedProperty(_computeVisualState),

            _backingIsEnabled: msls_observableProperty(),
            _backingIsReadOnly: msls_observableProperty(),
            _backingIsVisible: msls_observableProperty(),
            _backingDisplayError: msls_observableProperty(),

            pageKind: msls_accessorProperty(_pageKind_get),
            properties: msls_accessorProperty(
                function properties_get() {
                    /// <returns type="Object" />
                    return this._dictionary.values;
                }
            ),
            stringValue: msls_observableProperty(),
            value: msls_observableProperty(),
            controlModel: msls_accessorProperty(
                function controlModel_get() {
                    var model = this.model;
                    return model.view;
                }
            ),
            validationResults: msls_observableProperty(),
            _alwaysShowValidationResults: msls_accessorProperty(
                function _alwaysShowValidationResults_get() {
                    return this._alwaysShowValidationResultsValue ||
                        (!!this.parent && this.parent._alwaysShowValidationResults);
                },
                function _alwaysShowValidationResults_set(value) {
                    this._alwaysShowValidationResultsValue = value;
                }
            ),

            findItem: findItem,
            validate: validate,
            hasValidationErrors: hasValidationErrors,

            dataBind: dataBind,

            _initialize: _initialize,
            _activate: _activate,
            _deactivate: _deactivate,
            _initializeCore: _initializeCore,
            _setParent: _setParent,
            _setCommandItemParent: _setCommandItemParent,

            _parseDataSource: virtual_parseDataSource,
            _resolveProperties: virtual_resolveProperties,
            _parseChoiceList: virtual_parseChoiceList,

            _onDispose: _onDispose
        }
    );

    msls_expose("ContentItem", msls.ContentItem);
    msls_expose("HorizontalAlignment", msls_HorizontalAlignment);
    msls_expose("WidthSizingMode", msls_WidthSizingMode);
    msls_expose("HeightSizingMode", msls_HeightSizingMode);
    msls_expose("ContentItemKind", msls_ContentItemKind);
    msls_expose("PageKind", msls_PageKind);
    msls_expose("ContentItem", msls.ContentItem);

}());

(function () {

    function _initialize(initialData) {

        var template = this._template,
            choicesSourceBindingPath = template._choicesSourceBindingPath;

        this.kind = template.kind;
        this.name = template.name;
        this.displayName = template.displayName;
        this.model = template.model;
        this.validationResults = [];
        this.screen = template.screen;
        if (choicesSourceBindingPath) {
            this._choicesSourceBindingPath = choicesSourceBindingPath;
        }


        this._initializeCore(initialData);
    }


    function override_parseDataSource() {
        this.bindingPath = this._template.bindingPath;
        this._detailsBindingPath = this._template._detailsBindingPath;
        this.valueModel = this._template.valueModel;
    }

    function override_resolveProperties() {
        this._dictionary = this._template._dictionary;
    }

    function override_parseChoiceList() {
        this.choiceList = this._template.choiceList;
    }

    msls_defineClass("ui", "ContentItemClone",
        function ContentItemClone(template) {

            this._template = template;
        }, msls.ContentItem, {
            _initialize: _initialize,
            _parseDataSource: override_parseDataSource,
            _resolveProperties: override_resolveProperties,
            _parseChoiceList: override_parseChoiceList
        }
    );

}());

(function () {

    function ContentItemService() {
    }

    function createContentItemTree(screenObject, contentItemDefinition, parentContentItem, initialData) {
        return _createContentItemTreeHelper(screenObject, contentItemDefinition, parentContentItem, null, initialData);
    }

    function _createContentItemTreeHelper(screenObject, contentItemDefinition, parentContentItem, commandParent, initialData) {
        var i,
            contentItem = new msls.ContentItem(screenObject, contentItemDefinition);


        if (!!parentContentItem) {
            contentItem._setParent(parentContentItem);
        } else if (!!commandParent) {
            contentItem._setCommandItemParent(commandParent);
        }

        contentItem._initialize(initialData);

        if ($.isArray(contentItemDefinition.childContentItems)) {
            for (i = 0; i < contentItemDefinition.childContentItems.length; i++) {
                var childDefinition = contentItemDefinition.childContentItems[i];
                var child = _createContentItemTreeHelper(screenObject, childDefinition, contentItem, null);
            }
        }

        if ($.isArray(contentItemDefinition.commandItems)) {
            for (i = 0; i < contentItemDefinition.commandItems.length; i++) {
                var commandItemDefinition = contentItemDefinition.commandItems[i];
                var commandItem = _createContentItemTreeHelper(screenObject, commandItemDefinition, null, contentItem);
            }
        }

        return contentItem;
    }

    function cloneContentItemTree(template, parentContentItem, initialData) {

        return _cloneContentItemTreeHelper(template, parentContentItem, null, initialData);
    }

    function _cloneContentItemTreeHelper(template, parentContentItem, commandParent, initialData) {
        var i,
            clone = new msls.ui.ContentItemClone(template);


        if (!!parentContentItem) {
            clone._setParent(parentContentItem);
        } else if (!!commandParent) {
            clone._setCommandItemParent(commandParent);
        }

        clone._initialize(initialData);

        for (i = 0; i < template.children.length; i++) {
            var childTemplate = template.children[i];
            var childClone = _cloneContentItemTreeHelper(childTemplate, clone, null);
        }

        for (i = 0; i < template.commandItems.length; i++) {
            var commandItemTemplate = template.commandItems[i];
            var commandItemClone = _cloneContentItemTreeHelper(commandItemTemplate, null, clone);
        }

        return clone;
    }

    msls_defineClass("ui", "ContentItemService", ContentItemService, null, {
        createContentItemTree: createContentItemTree,
        cloneContentItemTree: cloneContentItemTree
    });

    msls_setProperty(msls.services, "contentItemService", new ContentItemService());

}());

var msls_createScreen;

(function () {

    var _Screen = msls.Screen,
        _ScreenDetails = _Screen.Details;

    function getLocalPropertyValue(details) {
        return details.screen["__" + this.name];
    }

    function setLocalPropertyValue(details, value) {
        var propertyName = this.name,
            localProperty = details.properties[propertyName],
            screenObject = details.screen;

        msls_setProperty(screenObject, "__" + propertyName, value);
        localProperty.dispatchChange("value");
        screenObject.dispatchChange(propertyName);
    }

    function getRemotePropertyValue(details) {
        var propertyName = this.name,
            remoteProperty = details.properties[propertyName],
            data = details._propertyData[propertyName],
            autoLoad = true;

        if (!remoteProperty.isLoaded && autoLoad) {
            return remoteProperty.load();
        } else {
            return WinJS.Promise.as(data._value);
        }
    }

    function rawGetCollectionPropertyValue(
        details,
        entry) {
        var data = details._propertyData[entry.name];

        return msls_Screen_rawGetCollectionPropertyValue(details, entry, data);
    }

    function getComputedPropertyValue(details) {
        return this.type.prototype;
    }

    function defineScreen(constructor, properties, methods) {
        /// <summary>
        /// Classifies a constructor function as a screen class.
        /// </summary>
        /// <param name="constructor" type="Function">
        /// A constructor function.
        /// </param>
        /// <param name="properties" type="Array">
        /// An array of property descriptors.
        /// </param>
        /// <param name="methods" type="Array">
        /// An array of method descriptors.
        /// </param>
        /// <returns type="Function">
        /// The constructor function classified as a screen class.
        /// </returns>
        var screenClass = constructor,
            details = makeScreenDetails(constructor),
            mixInContent = {};

        msls_defineClassWithDetails(null, null,
            constructor, details, _Screen);

        if (properties) {
            properties.forEach(function (entry) {
                var entryName = entry.name;
                if (typeof entry.kind !== "string") {
                    entry.kind = "local";
                }
                switch (entry.kind) {
                    case "local":
                        if (!entry.type) {
                            entry.type = String;
                        }
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _ScreenDetails.LocalProperty);
                        entry.getValue = getLocalPropertyValue;
                        entry.setValue = setLocalPropertyValue;
                        break;
                    case "reference":
                        if (!entry.type) {
                            entry.type = msls.Entity;
                        }
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _ScreenDetails.ReferenceProperty);
                        entry.async = true;
                        entry.getValue = getRemotePropertyValue;
                        break;
                    case "collection":
                        entry.type = msls_makeVisualCollection(constructor, entry);
                        if (!entry.elementType) {
                            entry.elementType = msls.Entity;
                        }
                        mixInContent[entryName] = msls_propertyWithDetails(
                            entry, entry.type, _ScreenDetails.CollectionProperty);
                        entry.async = true;
                        entry.getValue = getRemotePropertyValue;
                        entry.rawGet = rawGetCollectionPropertyValue;
                        break;
                }
                entry.get = function () {
                    return entry.getValue(this.details);
                };
                if (entry.setValue) {
                    entry.set = function (value) {
                        entry.setValue(this.details, value);
                    };
                }
            });
        }
        if (methods) {
            methods.forEach(function (entry) {
                if (entry.value) {
                    mixInContent[entry.name] = entry;
                } else {
                    mixInContent[entry.name] = function screenMethod() {
                        /// <summary>
                        /// Executes a screen method.
                        /// </summary>
                        var userCode = screenClass[entry.name + "_execute"],
                            result;
                        if (msls_isFunction(userCode)) {
                            result = userCode.call(null, this);
                        }
                        return result;
                    };
                    mixInContent[entry.name].canExecute = function canExecute() {
                        var result = true,
                            userCode = screenClass[entry.name + "_canExecute"];
                        if (msls_isFunction(userCode)) {
                            result = !!userCode.call(null, this);
                        }
                        return result;
                    };
                }
            });
        }
        msls_mixIntoExistingClass(screenClass, mixInContent);

        return screenClass;
    }

    msls_createScreen =
    function createScreen(constructor, dataWorkspace, screenArguments) {
        var screenObject;
        if (!$.isFunction(constructor) || (!!screenArguments && !$.isArray(screenArguments))) {
            return screenObject;
        }

        screenObject = Object.create(constructor.prototype);
        constructor.call(screenObject, screenArguments, dataWorkspace);

        return screenObject;
    };

    msls_initScreen =
    function initScreen(screen, dataWorkspace, modelId, screenParameters) {
        var screenClassInstance = screen,
            screenClass = screenClassInstance.constructor,
            screenDetails = screen.details,
            parameterName,
            parameterProperties,
            property,
            entity,
            entityDetails,
            entitySet,
            dataServiceDetails,
            data,
            valid = false, isLocal = false, isReference = false;

        screenDetails.dataWorkspace = dataWorkspace;
        msls_setProperty(screenDetails, "_modelId", modelId);

        var model = screenDetails.getModel();
        if (model) {
            screen.details.displayName = model.displayName;
        }

        if (screenParameters && model.properties) {
            parameterProperties = msls_iterate(model.properties)
                .where(function (p) {
                    return !!msls_getAttribute(p, ":@IsParameter");
                })
                .array;

            if (screenParameters.length > parameterProperties.length) {
                msls_throwInvalidOperationError(msls_getResourceString("screen_too_many_parameter_values"));
            }

            screenParameters.forEach(function (parameterValue, index) {
                parameterName = msls_getProgrammaticName(parameterProperties[index].name);
                property = screenDetails.properties[parameterName];
                isLocal = property instanceof msls.Screen.Details.LocalProperty;
                isReference = property instanceof msls.Screen.Details.ReferenceProperty;
                if (parameterValue instanceof msls.Entity) {
                    entity = parameterValue;
                    entityDetails = entity.details;
                    entitySet = entityDetails.entitySet;

                    if (!!entitySet && !!entitySet.dataService) {
                        dataServiceDetails = entitySet.dataService.details;
                        if (!!dataWorkspace && dataServiceDetails.dataWorkspace === dataWorkspace) {
                            valid = true;
                        }
                    }
                } else {
                    valid = true;
                }
                if (valid) {
                    if (isLocal) {
                        msls_setProperty(screen, "__" + parameterName, parameterValue);
                    } else if (isReference) {
                        data = screenDetails._propertyData[parameterName];
                        data._value = parameterValue;
                        data._isLoaded = true;
                    }
                }
            });
        }
    };

    msls_initScreenDetails =
    function initScreenDetails(screenDetails, owner) {
        screenDetails.screen = owner;
        msls_setProperty(screenDetails, "_model", null);
        screenDetails.serverErrors = [];

        msls_setProperty(screenDetails, "_propertyData", {});
        $.each(screenDetails.properties.all(),function () {
            screenDetails._propertyData[this.name] = {};
        });
    };

    msls_mixIntoExistingClass(_Screen, {
        showTab: function showTab(tabName, options) {
            /// <summary>
            /// Shows a tab page.
            /// </summary>
            /// <param name="tabName" type="String">
            /// The name of the tab to show.
            /// </param>
            /// <param name="options" optional="true">
            /// An object that specifies options for showing the tab.
            /// </param>
            /// <returns type="WinJS.Promise">
            /// A promise object that is fulfilled after the tab has been shown.
            /// </returns>
            var beforeShown = options ? options.beforeShown : null;
            return msls.shell.showTab(tabName, null, null, beforeShown);
        },
        showDialog: function showDialog(dialogName, options) {
            /// <summary>
            /// Shows a dialog page.
            /// </summary>
            /// <param name="dialogName" type="String">
            /// The name of the dialog to show.
            /// </param>
            /// <param name="options" optional="true">
            /// An object that specifies options for showing the dialog.
            /// </param>
            /// <returns type="WinJS.Promise">
            /// A promise object that is fulfilled after the dialog has been shown.
            /// </returns>
            var beforeShown = options ? options.beforeShown : null;
            return msls.shell.showDialog(dialogName, null, null, beforeShown);
        },
        findContentItem: function findContentItem(contentItemName) {
            /// <summary>
            /// Finds a content item in this screen's content item tree.
            /// </summary>
            /// <param name="contentItemName" type="String">
            /// The unique name of a content item in the content item tree.
            /// </param>
            /// <returns type="msls.ContentItem">
            /// The content item with the specified
            /// name, if found; otherwise, undefined.
            /// </returns>
            return this.details.rootContentItem.findItem(contentItemName);
        }
    });

    msls_setProperty(_Screen.prototype.showTab, "canExecute", function (tabName, options) {
        if (!!options && msls_isFunction(options.canExecute)) {
            return options.canExecute.apply(this, arguments);
        }
        return true;
    });
    msls_setProperty(_Screen.prototype.showDialog, "canExecute", function (dialogName, options) {
        if (!!options && msls_isFunction(options.canExecute)) {
            return options.canExecute.apply(this, arguments);
        }
        return true;
    });

    msls_mixIntoExistingClass(_ScreenDetails, {
        displayName: msls_observableProperty(),
        serverErrors: msls_observableProperty(),

        saveChangesTo: msls_accessorProperty(
            function saveChangesTo_get() {
                var me = this,
                    attributes;

                if (!me._saveChangesToValue) {
                    attributes = msls_getAttributes(me.getModel(), ":@SaveChangesTo");
                    msls_setProperty(me, "_saveChangesToValue", []);
                    if (attributes) {
                        $.each(attributes, function () {
                            var pName;
                            if (!!this.property &&
                                !!(pName = this.property.name)) {
                                me._saveChangesToValue.push(me.dataWorkspace[msls_getProgrammaticName(pName)]);
                            }
                        });
                    }
                }
                return me._saveChangesToValue;
            }
        ),
        startPage: msls_accessorProperty(
            function startPage_get() {
                /// <returns type="msls.ContentItem" />
                var attribute;

                if (!this._startPageValue) {
                    attribute = msls_getAttribute(this.getModel(), ":@StartPage");
                    if (attribute) {
                        msls_setProperty(this, "_startPageValue", this.screen.findContentItem(attribute.value));
                    } else {
                        msls_setProperty(this, "_startPageValue", this.pages[0]);
                    }
                }
                return this._startPageValue;
            }
        ),
        validate: function validate() {
            /// <summary>
            /// Locally validates changes to the editable data services.
            /// </summary>
            /// <returns type="Array">
            /// An array of validation results.
            /// </returns>
            var results,
                dataService;

            if (!!this.saveChangesTo && this.saveChangesTo.length > 0) {
                results = [];
                dataService = this.saveChangesTo[0];

                if (!!dataService) {
                    var changes = dataService.details.getChanges();
                    $.each(changes, function () {
                        $.each(this.details.properties.all(), function () {
                            if (this instanceof msls.Entity.Details.StorageProperty) {
                                results = results.concat(msls_validate(this, this.value));
                            }
                        });
                    });
                }
            }

            return results;
        },
        rootContentItem: msls_accessorProperty(
            function rootContentItem_get() {
                if (!this._rootContentItem) {
                    var model = this.getModel();
                    msls_setProperty(this, "_rootContentItem", msls.services.contentItemService.createContentItemTree(this.screen, model.rootContentItem, null));
                }
                return this._rootContentItem;
            }
        ),
        pages: msls_accessorProperty(function pages_get() {

            var tree = this.rootContentItem,
                pageContainers,
                pages = [];

            if (!!tree && !!(pageContainers = tree.children)) {

                for (var i = 0; i < pageContainers.length; i++) {
                    pages = pages.concat(pageContainers[i].children.slice(0));
                }
            }

            return pages;
        }),
        _findModel: function findModel() {
            return msls.services.modelService.tryLookupById(this._modelId);
        },
        _onDispose: function _onDispose() {
            if (this._rootContentItem) {
                msls_dispose(this._rootContentItem);
                this._rootContentItem = null;
            }
            if (this._startPageValue) {
                this._startPageValue = null;
            }
            this._propertyData = null;
        }
    });

    function makeScreenDetails(screenClass) {
        function ScreenDetails(owner) {
            /// <summary>
            /// Represents the details for a screen.
            /// </summary>
            /// <param name="owner">
            /// The screen that owns this details object.
            /// </param>
            /// <field name="dataWorkspace" type="msls.application.DataWorkspace">
            /// Gets the data workspace that provides the screen's data.
            /// </field>
            /// <field name="properties">
            /// Gets the set of property objects for the screen.
            /// </field>
            _ScreenDetails.call(this, owner);
        }
        return ScreenDetails;
    }

    msls_expose("_defineScreen", defineScreen);
    msls_expose("Screen", _Screen);

}());

var msls_createShellCommandViewModel;

(function () {

    msls_defineClass(msls, "ShellCommandViewModel",
        function ShellCommandViewModel(command, displayName, name) {

            this.command = command;
            this.displayName = displayName;
            this.name = name;
        },
        null,
        {
        }
    );

    msls_createShellCommandViewModel =
        function createShellCommandViewModel(bindingPath, bindingSource, boundArguments, displayName, name) {
            var boundCommand = new msls.BoundCommand(bindingPath, bindingSource, boundArguments),
                viewModel = new msls.ShellCommandViewModel(boundCommand, displayName, name);

            msls_addLifetimeDependency(viewModel, boundCommand);
            return viewModel;
        };

}());

(function () {

    msls_defineClass(msls, "NavigationUnit",
        function NavigationUnit(shell) {

            this.shell = shell;
        }, null, {
            boundaryOption: msls_BoundaryOption.none,
            popup: false,
            nestedChangeSet: null,
            dialogTitle: msls_observableProperty(),
            pageName: msls_observableProperty(),

            hasChanges: msls_accessorProperty(function () {
                var boundary = this.boundaryOption;
                if (boundary === msls_BoundaryOption.save) {
                    return this.screen.details.dataWorkspace.details.hasChanges;
                } else if (boundary === msls_BoundaryOption.nested) {
                    return !!this.nestedChangeSet && this.nestedChangeSet.hasNestedChanges;
                } else {
                    return false;
                }
            })
        }
    );

    msls_defineClass(msls, "TaskViewModel",
        function TaskViewModel(shell, screenObject, taskBoundaryOption) {

            this.shell = shell;
            this.screen = screenObject;
            this.taskBoundaryOption = taskBoundaryOption;
        }, null, {
            taskTitle: msls_observableProperty(),
            screenTitle: msls_observableProperty(),

            _onDispose:
            function _onDispose() {
                var me = this,
                    commands = me.tabCommands,
                    i, len;
                if (commands) {
                    commands.forEach(msls_dispose);
                    me.tabCommands = null;
                }
                me.screen = null;
            }
        }
    );

}());

var msls_shell,
    msls_shell_activeNavigationUnitChangedNotification = "activeNavigationUnitChanged",
    msls_dispatchApplicationSaveChangesEvent,
    msls_shellCommandStartNotification = "shellCommandStart",
    msls_shellCommandCompleteNotification = "shellCommandComplete";

(function () {

    var defaultNavigateBackOption = msls_NavigateBackOption.none,
        alreadyNavigatingError = "AlreadyNavigatingError";


    function initialize(applicationDefinition) {

        var me = this;


        me.saveCommand = msls_createShellCommandViewModel(
            "saveChanges",
            this,
            msls_createBoundArguments(msls.application, [{ value: defaultNavigateBackOption }]),
            msls_getResourceString("shell_saveChanges_btn"),
            "save");

        me.discardCommand = msls_createShellCommandViewModel(
            "discardChanges",
            this,
            msls_createBoundArguments(msls.application, [{ value: defaultNavigateBackOption }]),
            msls_getResourceString("shell_discardChanges_btn"),
            "discard");

        me.okCommand = msls_createShellCommandViewModel(
            "acceptNestedChanges",
            this,
            null,
            msls_getResourceString("shell_acceptNested_btn"),
            "ok");

        me.cancelCommand = msls_createShellCommandViewModel(
            "cancelNestedChanges",
            this,
            null,
            msls_getResourceString("shell_cancelNested_btn"),
            "cancel");

        me.homeCommand = msls_createShellCommandViewModel(
            "navigateHome",
            this,
            null,
            msls_getResourceString("shell_home_btn"),
            "home");

        me.backCommand = msls_createShellCommandViewModel(
            "navigateBack",
            this,
            null,
            msls_getResourceString("shell_back_btn"),
            "back");

        me.closeCommand = msls_createShellCommandViewModel(
            "navigateBack",
            this,
            null,
            msls_getResourceString("shell_close_btn"),
            "close");

        applicationDefinition = applicationDefinition || msls_getApplicationDefinition();
        me._homeScreen = applicationDefinition ? applicationDefinition.homeScreen : null;
        if (!me._homeScreen) {
            return WinJS.Promise.wrapError(
                msls_getResourceString("shellViewModel_noHomeScreen"));
        }
        me.logoPath = msls_rootUri + applicationDefinition.logo;

        var homeUnit = _prepareNavigationUnit(this, {
            screenDefinition: this._homeScreen,
            boundaryOption: msls_BoundaryOption.save
        });

        me.beforeFirstPageNavigationUnit = new msls.NavigationUnit(me);
        me.beforeFirstPageNavigationUnit.boundaryOption = msls_BoundaryOption.none;
        me.beforeFirstPageNavigationUnit.index = -1;

        return me._startNavigationOperation(null, function (operation) {
            _resolveWhenPromiseComplete(operation,
            _navigateView(me, homeUnit));
        });
    }

    function finishNavigation() {

        var me = this;

        if (me._currentNavigationOperation) {
            return me._currentNavigationOperation.promise();
        } else {
            return msls_promiseOperation(function initFinishNavigation(operation) {
                msls_dispatch(operation.code(function () {
                    if (me._currentNavigationOperation) {
                        _resolveWhenPromiseComplete(operation, me._currentNavigationOperation.promise());
                    } else {
                        operation.complete();
                    }
                }));
            });
        }
    }

    function showScreen(screenIdOrDefinition, screenArguments, pageName, boundaryOption, popup, beforeShown) {

        var modelService = msls.services.modelService;
        var screenId, screenDefinition;
        if (typeof screenIdOrDefinition === "string") {
            screenId = screenIdOrDefinition;
        } else {
            screenDefinition = screenIdOrDefinition;
        }

        if (boundaryOption === undefined || boundaryOption === null) {
            boundaryOption = msls_BoundaryOption.save;
        }

        popup = !!popup;


        var loadOptions = {
            screenId: screenId,
            screenDefinition: screenDefinition,
            pageName: pageName,
            screenArguments: screenArguments,
            boundaryOption: boundaryOption,
            popup: popup,
            beforeShown: beforeShown
        };
        return _showScreenOrPageCore(this, loadOptions);
    }

    function showTab(tabName, boundaryOption, popup, beforeShown) {
        return _showTabOrDialog(this, tabName, false, boundaryOption, popup, beforeShown);
    }

    function showDialog(dialogName, boundaryOption, popup, beforeShown) {
        return _showTabOrDialog(this, dialogName, true, boundaryOption, popup, beforeShown);
    }

    function _showTabOrDialog(me, pageName, isDialog, boundaryOption, popup, beforeShown) {

        if (pageName === me.activeNavigationUnit.pageName) {
            return _createDeferredResolution();
        }

        var pageRoot = _getPageContentItemRoot(me.activeNavigationUnit.screen, pageName, isDialog),
            pageKind = pageRoot.pageKind,
            defaultPopup = (pageKind === msls_PageKind.simpleDialog || pageKind === msls_PageKind.nestedDialog),
            defaultBoundary =
                pageKind === msls_PageKind.nestedDialog ? msls_BoundaryOption.nested :
                msls_BoundaryOption.none;

        boundaryOption = typeof boundaryOption === "string" ? boundaryOption : defaultBoundary;
        popup = typeof popup === "boolean" ? popup : defaultPopup;

        var loadOptions = {
            screen: me.activeNavigationUnit.screen,
            pageName: pageName,
            boundaryOption: boundaryOption,
            popup: popup,
            beforeShown: beforeShown,
            isDialog: isDialog,
            isTabChange: !isDialog
        };
        return _showScreenOrPageCore(me, loadOptions);
    }

    function validateActivePage(onCompletion) {

        _validatePageUI(this, this.activeNavigationUnit, onCompletion);
    }

    function saveChanges(navigateBackOption) {


        var me = this;

        if (!me.canSaveChanges) {
            _throwCannotExecute();
        }

        return me._startNavigationOperation("saveChanges", function (operation) {
            var delay = 1;


            setTimeout(function () {
                _validateBeforeSave(me, operation, function () {
                    var navigationDescription = _createSaveOrDiscardNavigationDescription(me, navigateBackOption),
                        navigationTarget = _determineTargetForSaveOrDiscard(me, navigateBackOption);
                    _resolveWhenPromiseComplete(operation,
                        _processNavigationDescription(me, navigationDescription, true, navigationTarget));
                });
            }, delay);
        });
    }
    saveChanges.canExecute = function (navigateBackOption) {
        return this.canSaveChanges;
    };

    function discardChanges(navigateBackOption) {

        if (!this.canDiscardChanges) {
            _throwCannotExecute();
        }

        var me = this;
        return me._startNavigationOperation(null, function (operation) {
            setTimeout(function () {
                var currentUnit = me.activeNavigationUnit,
                    navigationDescription = _createSaveOrDiscardNavigationDescription(me, navigateBackOption),
                    navigationTarget = _determineTargetForSaveOrDiscard(me, navigateBackOption);
                currentUnit.contentItemTree._alwaysShowValidationResults = false;
                currentUnit.screen.details.rootContentItem._alwaysShowValidationResults = false;
                _resolveWhenPromiseComplete(operation,
                    _processNavigationDescription(me, navigationDescription, false, navigationTarget));
            }, 1);
        });
    }
    discardChanges.canExecute = function (navigateBackOption) {
        return this.canDiscardChanges;
    };

    function acceptNestedChanges() {

        if (!this.canAcceptNestedChanges) {
            _throwCannotExecute();
        }

        var me = this;
        return me._startNavigationOperation(null, function (operation) {
            me.validateActivePage(operation.code(function (error) {
                if (error) {
                    operation.error(error);
                } else {
                    var target = _determineTargetForAcceptOrCancel(me);
                    var navigationDescription = _createBackwardNavigationDescription(me, me.activeNavigationUnit, target);
                    _resolveWhenPromiseComplete(operation,
                        _processNavigationDescription(me, navigationDescription, true, target));
                }
            }));

        });
    }
    acceptNestedChanges.canExecute = function () {
        return this.canAcceptNestedChanges;
    };

    function cancelNestedChanges() {

        if (!this.canCancelNestedChanges) {
            _throwCannotExecute();
        }

        var me = this;
        return me._startNavigationOperation(null, function (operation) {
            var target = _determineTargetForAcceptOrCancel(me),
                navigationDescription = _createBackwardNavigationDescription(me, me.activeNavigationUnit, target);
            me.activeNavigationUnit.contentItemTree._alwaysShowValidationResults = false;
            _resolveWhenPromiseComplete(operation,
                _processNavigationDescription(me, navigationDescription, false, target));
        });
    }
    cancelNestedChanges.canExecute = function () {
        return this.canCancelNestedChanges;
    };

    function navigateHome() {

        return this.showScreen(this._homeScreen);
    }
    navigateHome.canExecute = function () {
        return this.canNavigateHome;
    };

    function navigateBack(distance) {

        var me = this;

        distance = distance || 1;
        var currentIndex = me.activeNavigationUnit.index,
            newIndex = currentIndex - distance;
        if (distance <= 0 || newIndex < 0) {
            msls_throwArgumentError(null, distance, "distance");
        }

        var targetNavigationUnit = me.navigationStack[newIndex];

        return me._startNavigationOperation(null, function (operation) {
            _resolveWhenPromiseComplete(operation,
                me.requestNavigateBack(targetNavigationUnit));
        });
    }

    function requestNavigateBack(navigationUnit) {

        var me = this;

        if (navigationUnit === this.activeNavigationUnit) {
            return;
        }


        return msls_promiseOperation(function initRequestNavigateBack(operation) {
            var navigationDescription = _createBackwardNavigationDescription(me, me.activeNavigationUnit, navigationUnit);
            _askAndProcessNavigation(me, navigationDescription, navigationUnit)
            .then(function success() {
                msls_dispatch(function () {
                    operation.complete();
                });
            }, function fail(result) {
                operation.error(result || msls_getResourceString("command_exec_err"));
            });
        });
    }




    function _throwCannotExecute() {
        msls_throwError("CannotExecuteError", msls_getResourceString("command_cannot"));
    }

    function _complete(onCompletion, error) {

        if (onCompletion) {
            onCompletion(error || null);
        }
    }

    function _resolveWhenPromiseComplete(operation, promise) {
        promise
        .then(
            function success(result) {
                operation.complete(result);
            },
            function fail(error) {
                operation.error(error);
            });
    }

    function _startNavigationOperation(notificationName, code) {
        msls_mark(msls_codeMarkers.navigationStart);

        var me = this;
        if (me._currentNavigationOperation) {
            msls_throwError("AlreadyNavigatingError", msls_getResourceString("shell_already_nav"));
        }

        return msls_promiseOperation(function initNavigationOperation(operation) {
            if (notificationName) {
                msls_notify(msls_shellCommandStartNotification, { name: notificationName });
            }
            me._currentNavigationOperation = operation;
            code(operation);
        })._thenEx(function (error) {
            me._currentNavigationOperation = null;
            if (notificationName) {
                msls_notify(msls_shellCommandCompleteNotification, { name: notificationName, error: error });
            }
            if (error) {
                throw error;
            }
        });
    }

    function _createDeferredResolution(result) {
        return msls_promiseOperation(function (operation) {
            msls_dispatch(function () { operation.complete(result); });
        });
    }

    function _findNavigationUnitWithIndex(me, index) {
        return me.navigationStack[index];
    }

    function _findPreviousNavigationUnit(me, navigationUnit) {

        if (navigationUnit.index > 0) {
            var before = _findNavigationUnitWithIndex(me, navigationUnit.index - 1);
            return before;
        }

        return null;
    }

    function findNavigationUnits(filter) {

        var units = [];

        for (var i = 0; i in this.navigationStack; i++) {
            var navigationUnit = this.navigationStack[i];
            if (!filter || filter(navigationUnit)) {
                units.push(navigationUnit);
            }
        }

        return units;
    }

    function _processArrayWithErrorHandling(array, elementFunction) {

        return msls_promiseOperation(function (operation) {

            function recursiveProcessHelper(elementArray) {
                if (elementArray.length === 0) {
                    operation.complete();
                } else {
                    var element = elementArray[0];
                    var error = null;
                    var remaining = elementArray.slice(1);

                    try {
                        elementFunction(element, operation.code(function (functionError) {
                            error = functionError;

                            if (error) {
                                operation.error({ error: error, errorElement: element });
                            } else {
                                recursiveProcessHelper(remaining);
                            }
                        }));
                    } catch (ex) {
                        operation.error({ error: ex, errorElement: element });
                    }
                }
            }

            recursiveProcessHelper(array);
        });
    }

    function _prepareNavigationUnit(me, loadOptions) {

        var
        options = $.extend({}, _prepareNavigationUnit.defaults, loadOptions),
        isTabChange = !!options.isTabChange,
        _ScreenType,
        screenObject,
        pageModelId,
        pageModel,
        boundaryOption = options.boundaryOption;

        msls_mark(msls_codeMarkers.loadScreenStart);

        if (options.screen) {
            screenObject = options.screen;
        } else {

            var dataWorkspace = me.activeNavigationUnit ? me.activeNavigationUnit.screen.details.dataWorkspace : null;

            if (!options.screenDefinition) {
                options.screenDefinition = msls.services.modelService.tryLookupById(options.screenId);
                if (!options.screenDefinition) {
                    throw msls_getResourceString("shell_invalid_1args", options.screenId);
                }
            }

            _ScreenType = window.msls.application[options.screenDefinition.name];

            screenObject = msls_createScreen(_ScreenType, dataWorkspace, options.screenArguments);
        }

        var contentItemTree = _getPageContentItemRoot(screenObject, options.pageName, options.isDialog);

        contentItemTree.isVisible = true;

        var task = msls_iterate(
            msls_getValues(me.navigationStack)
                .map(function (unitItem) {
                    return unitItem.task;
                })
            ).where(function (taskItem) {
                return taskItem.screen === screenObject;
            }).first();
        if (!task) {
            task = _createTaskViewModel(me, screenObject, boundaryOption);
        }

        var unit;
        if (isTabChange) {

            unit = me.activeNavigationUnit;

            if (unit.contentItemTree) {
                unit.contentItemTree._deactivate();
            }
            contentItemTree._activate();

            unit.contentItemTree = contentItemTree;
            unit.pageName = contentItemTree.name;
        } else {
            unit = new msls.NavigationUnit(me);
            var currentIndex = me.activeNavigationUnit ?
                    me.activeNavigationUnit.index :
                    -1,
                newIndex = currentIndex + 1;
            unit.index = newIndex;
            unit.boundaryOption = boundaryOption;
            unit.popup = !!options.popup;
            unit.screen = screenObject;
            unit.contentItemTree = contentItemTree;
            unit.pageName = contentItemTree.name;
            unit.task = task;
            if (boundaryOption === msls_BoundaryOption.none) {
                if (me.activeNavigationUnit) {
                    unit.boundaryUnit = me.activeNavigationUnit.boundaryUnit;
                }
            } else {
                unit.boundaryUnit = unit;
            }

            if (options.popup) {
                (new msls.data.DataBinding("displayName", contentItemTree, "dialogTitle", unit,
                    msls_data_DataBindingMode.oneWayFromSource))
                .bind();
            }

            me.navigationStack[newIndex] = unit;

            if (boundaryOption === msls_BoundaryOption.nested) {
                unit.nestedChangeSet = screenObject.details.dataWorkspace.details.beginNestedChanges();
            }
        }

        if (options.beforeShown) {
            options.beforeShown.call(screenObject, screenObject);
        }

        if (!!_ScreenType && !!_ScreenType.created) {
            _ScreenType.created.call(null, screenObject);
        }

        if (contentItemTree.data !== screenObject) {
            contentItemTree.data = screenObject;
            contentItemTree.screen = screenObject;
        }

        msls_mark(msls_codeMarkers.loadScreenEnd);

        return unit;
    }
    _prepareNavigationUnit.defaults = {
        screenId: null,
        screenDefinition: null,
        screen: null,
        pageName: null,
        prepend: false,
        screenArguments: []
    };

    function _showScreenOrPageCore(me, loadOptions) {

        var activeNavigationUnit = me.activeNavigationUnit,
            screenObject;

        var backwardsTarget,
            nestedBoundariesCount = me.findNavigationUnits(function (navigationUnit) {
                return navigationUnit.boundaryOption === msls_BoundaryOption.nested;
            }).length;
        for (var i = me.activeNavigationUnit.index; i >= 0 && !backwardsTarget; i--) {
            var unit = _findNavigationUnitWithIndex(me, i),
                safeToNavigateForwardFromHere;

            safeToNavigateForwardFromHere = true;
            if (nestedBoundariesCount > 0 && loadOptions.boundaryOption === msls_BoundaryOption.save) {
                safeToNavigateForwardFromHere = false;
            } else if (!loadOptions.popup && unit.popup) {
                safeToNavigateForwardFromHere = false;
            }

            if (unit.boundaryOption === msls_BoundaryOption.nested) {
                nestedBoundariesCount--;
            }

            if (safeToNavigateForwardFromHere) {
                backwardsTarget = unit === me.activeNavigationUnit ? null : unit;
                break;
            }
        }

        return me._startNavigationOperation(null, function (operation) {

            function helper_doMainNavigation() {
                var navigationDescription = _createForwardNavigationDescription(me, me.activeNavigationUnit, loadOptions.boundaryOption);

                _askAndProcessNavigation(me, navigationDescription, null)
                ._thenEx(function (error, result) {
                    if (error) {
                        operation.error(error);
                    } else {

                        var navigationUnit = _prepareNavigationUnit(me, loadOptions);
                        _resolveWhenPromiseComplete(operation,
                            _navigateView(me, navigationUnit));
                    }
                })
                .then(null, function (error) {
                    operation.error(error);
                });
            }

            if (backwardsTarget) {
                var backwardsTargetNavigationDescription = _createBackwardNavigationDescription(me, me.activeNavigationUnit, backwardsTarget);
                _askAndProcessNavigation(me, backwardsTargetNavigationDescription, backwardsTarget)
                .then(function success() {
                    helper_doMainNavigation();
                }, function failure(error) {
                    operation.error(error);
                });
            } else {
                helper_doMainNavigation();
            }
        });
    }

    function _getPageContentItemRoot(screenObject, pageName, isDialog) {

        var contentItemTree;
        if (pageName) {
            contentItemTree = screenObject.findContentItem(pageName);
            var validPageName = false;
            if (contentItemTree) {
                switch (contentItemTree.pageKind) {
                    case msls_PageKind.tab:
                        validPageName = !isDialog;
                        break;

                    case msls_PageKind.nestedDialog:
                    case msls_PageKind.simpleDialog:
                        validPageName = isDialog;
                        break;


                    case msls_PageKind.none:
                        break;
                }
            }

            if (!validPageName) {
                msls_throwError(isDialog ? "DialogNotFoundError" : "TabNotFoundError",
                    msls_getResourceString(isDialog ? "shell_dialognotfound_2args" : "shell_tabnotfound_2args",
                        pageName, screenObject.details.getModel().name));
            }
        } else {
            contentItemTree = screenObject.details.startPage;
        }

        return contentItemTree;
    }

    function _processNavigationUnitChanges(me, navigationUnit, navigationDescription, accept, onCompletion) {

        if (navigationDescription.isBackward && navigationUnit.boundaryOption === msls_BoundaryOption.nested) {

            var changeSet = navigationUnit.nestedChangeSet;
            if (changeSet) {
                if (accept) {
                    changeSet.acceptNestedChanges();
                } else {
                    changeSet.cancelNestedChanges();
                }


                navigationUnit.nestedChangeSet = null;
            }

            _complete(onCompletion);

        } else {
            var thisUnitCrossesSaveBoundary = (navigationDescription.isForward && navigationDescription.crossesSaveBoundary) ||
                (navigationDescription.isBackward && navigationUnit.boundaryOption === msls_BoundaryOption.save);
            if (thisUnitCrossesSaveBoundary) {
                var workspaceDetails = navigationUnit.screen.details.dataWorkspace.details;


                if (accept) {
                    _saveChangesToDataWorkspace(me, navigationUnit, function (error) {

                        _complete(onCompletion, error);
                    });
                } else {
                    _discardChangesToDataWorkspace(me, navigationUnit);

                    _complete(onCompletion);
                }
            } else {
                _complete(onCompletion);
            }
        }
    }

    function _processNavigationDescription(me, navigationDescription, accept, targetNavigationUnit) {


        return msls_promiseOperation(function (operation) {
            _processArrayWithErrorHandling(navigationDescription.navigationUnitsCrossedOver.reverse(), function (element, onSingleElementCompletion) {
                _processNavigationUnitChanges(me, element, navigationDescription, accept, function (completionError) {
                    if (!completionError) {

                    }
                    onSingleElementCompletion(completionError);
                });
            })
            ._thenEx(function (error) {
                var error2 = null;
                if (error && error.error) {
                    if (targetNavigationUnit) {
                        targetNavigationUnit = error.errorElement;
                    }
                    error2 = error.error || msls_getResourceString("shell_unknown_save");
                }

                if (navigationDescription.isForward) {
                    $.each(navigationDescription.navigationUnitsCrossedOver, function (id, unit) {
                        if (unit.boundaryOption === msls_BoundaryOption.nested && !unit.nestedChangeSet) {
                            unit.nestedChangeSet = unit.screen.details.dataWorkspace.details.beginNestedChanges();

                        }
                    });
                }

                if (!!targetNavigationUnit &&
                    targetNavigationUnit !== me.activeNavigationUnit) {
                    _navigateView(me, targetNavigationUnit)
                    ._thenEx(function (navigationError) {
                        if (navigationError && !error2) {
                            error2 = navigationError;
                        }
                        _completeOrFailOperation(operation, error2);
                    });
                } else {
                    _completeOrFailOperation(operation, error2);
                }
            });
        });
    }

    function _saveChangesToDataWorkspace(me, navigationUnit, onCompletion) {

        var screenDetails = navigationUnit.screen.details,
            dataWorkspaceDetails = screenDetails.dataWorkspace.details,
            saveChangesPromise,
            dataServiceProperties,
            dataServiceProperty,
            dataServiceWithChanges;
        if (!dataWorkspaceDetails.hasChanges) {
            _complete(onCompletion);
            return;
        }

        saveChangesPromise = msls_dispatchApplicationSaveChangesEvent();
        if (!saveChangesPromise) {
            dataServiceProperties = dataWorkspaceDetails.properties.all();
            for (var i = 0, len = dataServiceProperties.length; i < len; i++) {
                dataServiceProperty = dataServiceProperties[i];
                if (dataServiceProperty.value.details.hasChanges) {
                    if (dataServiceWithChanges) {
                        _complete(onCompletion, {
                            title: msls_getResourceString("screen_save_failed"),
                            message: msls_getResourceString("screen_save_multiple_data_sources")
                        });
                        return;
                    }
                    dataServiceWithChanges = dataServiceProperty.value;
                }
            }
            saveChangesPromise = dataServiceWithChanges.saveChanges();
        }

        saveChangesPromise._thenEx(function (serverErrors) {
            var succeeded = !serverErrors,
                validationResults = [],
                errorMessage = "",
                validationResult,
                error;

            if (!succeeded) {
                $.each(serverErrors, function (index, serverError) {
                    if (index > 0) {
                        errorMessage += "\r\n";
                    }
                    errorMessage += serverError.message;
                    validationResult = serverError.validationResult;
                    if (validationResult) {
                        validationResults.push(validationResult);
                    }
                });
                error = {
                    title: msls_getResourceString("screen_save_failed"),
                    message: errorMessage
                };
            }

            if (!(screenDetails.serverErrors.length === 0 && validationResults.length === 0)) {
                screenDetails.serverErrors = validationResults;
            }

            screenDetails.rootContentItem._alwaysShowValidationResults = !succeeded;

            _complete(onCompletion, error);
        }).then(null, function (error) {
            _complete(onCompletion, error);
        });
    }

    function _discardChangesToDataWorkspace(me, navigationUnit) {

        var screenDetails = navigationUnit.screen.details,
            dataWorkspaceDetails = screenDetails.dataWorkspace.details,
            dataServiceProperties = dataWorkspaceDetails.properties.all(),
            currentDataServiceDetails;

        for (var i = 0, len = dataServiceProperties.length; i < len; i++) {
            currentDataServiceDetails = dataServiceProperties[i].value.details;
            if (currentDataServiceDetails.hasChanges) {
                currentDataServiceDetails.discardChanges();
            }
        }
    }

    function _validateBeforeSave(me, operation, callback) {
        var currentUnit = me.activeNavigationUnit;

        _validatePageUI(me, currentUnit, operation.code(function (error) {
            if (error) {
                operation.error(error);
            } else {
                _validateScreenData(me, currentUnit.screen, operation.code(function (validationError) {
                    if (validationError) {
                        operation.error(validationError);
                    } else {
                        callback();
                    }
                }));
            }
        }));
    }

    function _createSaveOrDiscardNavigationDescription(me, navigateBackOption) {
        var boundaryUnit = me.activeNavigationUnit.boundaryUnit;

        var navigationDescriptionTarget = null;
        if (boundaryUnit.index === 0) {
            navigationDescriptionTarget = me.beforeFirstPageNavigationUnit;
        } else {
            navigationDescriptionTarget = _findPreviousNavigationUnit(me, boundaryUnit);
        }

        return _createBackwardNavigationDescription(me, me.activeNavigationUnit, navigationDescriptionTarget);
    }

    function _validatePageUI(me, navigationUnit, onCompletion) {

        var rootContentItem = navigationUnit.contentItemTree,
            error = msls_getResourceString("shell_validation_errors");

        rootContentItem.validate(true);
        if (rootContentItem.hasValidationErrors(true)) {
            rootContentItem._alwaysShowValidationResults = true;
            _complete(onCompletion, error);
        } else {
            rootContentItem._alwaysShowValidationResults = false;
            _complete(onCompletion);
        }
    }

    function _validateScreenData(me, screenObject, onCompletion) {

        var errors = screenObject.details.validate(),
            rootContentItem = screenObject.details.rootContentItem;
        if (errors.length > 0) {
            var errorMessages = [];
            $.each(errors, function () {
                errorMessages.push(this.property.name + ": " + this.message);
            });
            var dialogMessage = errorMessages.join("\r\n");
            rootContentItem._alwaysShowValidationResults = true;
            _complete(onCompletion, dialogMessage);
        } else {
            rootContentItem._alwaysShowValidationResults = false;
            _complete(onCompletion);
        }
    }

    function _needPermissionToNavigateBack(sourceUnit) {

        switch (sourceUnit.boundaryOption) {
            case msls_BoundaryOption.save:
                return sourceUnit.screen.details.dataWorkspace.details.hasChanges;

            case msls_BoundaryOption.nested:
                return !!sourceUnit.nestedChangeSet && sourceUnit.nestedChangeSet.hasNestedChanges;

            default:
                return false;
        }
    }

    function _needPermissionToNavigateForward(sourceUnit, crossesSaveBoundary) {

        if (crossesSaveBoundary) {
            if (sourceUnit.screen.details.dataWorkspace.details.hasChanges) {
                return true;
            }
        }

        return false;
    }

    function _mustAskToNavigate(me, navigationDescription) {

        if (navigationDescription.isForward) {

            return _needPermissionToNavigateForward(navigationDescription.sourceNavigationUnit,
                navigationDescription.crossesSaveBoundary);
        } else {
            for (var i = 0; i < navigationDescription.navigationUnitsCrossedOver.length; i++) {
                if (_needPermissionToNavigateBack(navigationDescription.navigationUnitsCrossedOver[i])) {
                    return true;
                }
            }

            return false;
        }
    }
    function _askAndProcessNavigation(me, navigationDescription, targetNavigationUnit) {

        if (!_mustAskToNavigate(me, navigationDescription)) {
            if (navigationDescription.isBackward) {
                return _processNavigationDescription(me, navigationDescription, false, targetNavigationUnit);
            } else {
                return _createDeferredResolution();
            }
        }

        var dialogServiceOptions;

        if (navigationDescription.crossesSaveBoundary) {
            dialogServiceOptions = {
                message: msls_getResourceString("shell_save_message"),
                title: msls_getResourceString("shell_save_title"),
                buttons: [
                    {
                        text: msls_getResourceString("shell_save_btn"), icon: "check", result: msls_modal_DialogResult.yes
                    },
                    {
                        text: msls_getResourceString("shell_discard_btn"), icon: "delete", result: msls_modal_DialogResult.no
                    },
                    {
                        text: msls_getResourceString("shell_stay_btn"), icon: "back", result: msls_modal_DialogResult.cancel
                    }],
            };
        } else {
            dialogServiceOptions = {
                message: msls_getResourceString("shell_apply_message"),
                title: msls_getResourceString("shell_apply_title"),
                buttons: [
                    {
                        text: msls_getResourceString("shell_apply"), icon: "check", result: msls_modal_DialogResult.yes
                    },
                    {
                        text: msls_getResourceString("shell_discard_btn"), icon: "delete", result: msls_modal_DialogResult.no
                    },
                    {
                        text: msls_getResourceString("shell_stay_btn"), icon: "back", result: msls_modal_DialogResult.cancel
                    }],
            };
        }

        var keepChanges,
            stayOnPage = false;

        return msls_promiseOperation(function (operation) {
            msls_modal.show(dialogServiceOptions).then(function (result) {

                function saveOrDiscard() {
                    _resolveWhenPromiseComplete(operation, _processNavigationDescription(me, navigationDescription, keepChanges, targetNavigationUnit));
                }

                if (result === msls_modal_DialogResult.yes || result === msls_modal_DialogResult.no) {

                    keepChanges = result === msls_modal_DialogResult.yes ? true : false;

                    if (keepChanges) {
                        _validateBeforeSave(me, operation, saveOrDiscard);
                    } else {
                        saveOrDiscard();
                    }
                } else if (result === msls_modal_DialogResult.cancel) {
                    operation.error({ message: "User canceled the navigation by clicking Cancel button", userCanceled: true, noErrorDialog: true });
                } else if (result === msls_modal_DialogResult.none) {
                    operation.error({ message: "User canceled the navigation without clicking any buttons", userCanceled: true, noErrorDialog: true });
                } else {
                    operation.error({ message: "Cancel the navigation due to unexpected result.", userCanceled: true, noErrorDialog: true });
                }

            });
        });
    }

    function _navigateView(me, navigationUnit) {


        if (navigationUnit === me.beforeFirstPageNavigationUnit) {
            navigationUnit = me.navigationStack[0];
        }

        return msls_promiseOperation(function initNavigateView(operation) {
            if (me.activeNavigationUnit !== navigationUnit) {
                if (me.activeNavigationUnit) {
                    me.activeNavigationUnit.contentItemTree._deactivate();
                }
                navigationUnit.contentItemTree._activate();
            }
            me.shellView.navigate(navigationUnit)
            .then(function success() {
                me.activeNavigationUnit = navigationUnit;
                _cleanUpNavigationStack(me);

                me.finishNavigation()._thenEx(function (error) {
                    if (!error) {
                        msls_notify(msls_shell_activeNavigationUnitChangedNotification, me);
                    }
                });

                operation.complete();

            }, function fail(error) {
                operation.error(error || msls_getResourceString("shell_nav_failed"));
            });
        });
    }

    function _determineTargetForAcceptOrCancel(me) {

        var boundaryUnit = me.activeNavigationUnit.boundaryUnit,
            beforeBoundaryUnit;


        if (!!boundaryUnit && boundaryUnit.boundaryOption === msls_BoundaryOption.nested) {
            beforeBoundaryUnit = _findPreviousNavigationUnit(me, boundaryUnit);
        }

        return beforeBoundaryUnit;
    }

    function _determineTargetForSaveOrDiscard(me, navigateBackOption) {

        var boundaryUnit = me.activeNavigationUnit.boundaryUnit,
            navigationTarget;

        if (!boundaryUnit || (boundaryUnit.boundaryOption !== msls_BoundaryOption.save)) {
            return null;
        }

        if (navigateBackOption === msls_NavigateBackOption.saveBoundary) {
            navigationTarget = boundaryUnit;
        } else if (navigateBackOption === msls_NavigateBackOption.beforeSaveBoundary) {
            navigationTarget = boundaryUnit;
            if (boundaryUnit.index > 0) {
                navigationTarget = _findNavigationUnitWithIndex(me, boundaryUnit.index - 1);
            }
        } else {
            navigationTarget = null;
        }

        return navigationTarget;
    }

    function _computeCanSaveChanges() {
        var navigationUnit = this.activeNavigationUnit;
        if (navigationUnit) {
            var screenDetails = navigationUnit.screen.details,
                dataWorkSpaceDetails = screenDetails.dataWorkspace.details,
                canSaveChanges = dataWorkSpaceDetails.hasChanges &&
                    !dataWorkSpaceDetails.hasNestedChangeSets;

            return canSaveChanges;
        }

        return false;
    }

    function _computeCanDiscardChanges() {
        return this.canSaveChanges;
    }

    function _computeCanAcceptNestedChanges() {

        var navigationUnit = this.activeNavigationUnit;
        if (navigationUnit) {
            var screenDetails = navigationUnit.screen.details;
            var dataWorkSpaceDetails = screenDetails.dataWorkspace.details;
            if (dataWorkSpaceDetails.hasNestedChangeSets) {
                var boundaryUnit = this.activeNavigationUnit.boundaryUnit;
                return boundaryUnit.boundaryOption === msls_BoundaryOption.nested &&
                    !!boundaryUnit.nestedChangeSet &&
                    boundaryUnit.nestedChangeSet.hasNestedChanges;
            }
        }

        return false;
    }

    function _computeCanCancelNestedChanges() {
        var navigationUnit = this.activeNavigationUnit;
        if (navigationUnit) {
            var screenDetails = navigationUnit.screen.details;
            var dataWorkSpaceDetails = screenDetails.dataWorkspace.details;
            return dataWorkSpaceDetails.hasNestedChangeSets;
        }

        return false;
    }

    function _computeCanNavigateHome() {
        return !!this.activeNavigationUnit &&
            (this.activeNavigationUnit.screen.details.getModel().id !== this._homeScreen.id);
    }

    function _cleanUpNavigationStack(me) {
        var currentIndex = me.activeNavigationUnit.index,
            toClean = [];

        $.each(me.navigationStack, function (id, unit) {
            if (unit.index > currentIndex) {
                toClean.push(unit);
            }
        });

        var unitsInReverseOrder = toClean.sort(function (a, b) {
            return b.index - a.index;
        });

        $.each(unitsInReverseOrder, function (id, unit) {
            _closeNavigationUnit(me, unit);
        });
    }

    function _closeNavigationUnit(me, navigationUnit) {

        delete me.navigationStack[navigationUnit.index];

        var onClosed = me.shellView.onNavigationUnitClosed;
        if (onClosed) {
            onClosed.call(me.shellView, navigationUnit);
        }

        msls_dispose(navigationUnit);
    }


    function NavigationDescription() {

        this.navigationUnitsCrossedOver = [];
    }
    NavigationDescription.prototype = {
        isForward: false,
        isBackward: false,
        sourceNavigationUnit: null,

        targetNavigationUnit: null,

        navigationUnitsCrossedOver: null,

        crossesSaveBoundary: false,
        crossesNestedBoundary: false
    };

    function _createBackwardNavigationDescription(me, sourceNavigationUnit, targetNavigationUnit) {

        var isTargetNavigationUnitBeforeFirstPage = targetNavigationUnit === me.beforeFirstPageNavigationUnit;
        var description = new NavigationDescription();
        description.sourceNavigationUnit = sourceNavigationUnit;
        description.targetNavigationUnit = targetNavigationUnit;
        description.isBackward = true;

        var navigationUnit = sourceNavigationUnit;
        while (navigationUnit) {
            if (navigationUnit === targetNavigationUnit) {
                break;
            }

            description.navigationUnitsCrossedOver.push(navigationUnit);

            switch (navigationUnit.boundaryOption) {
                case msls_BoundaryOption.nested:
                    description.crossesNestedBoundary = true;
                    break;

                case msls_BoundaryOption.save:
                    description.crossesSaveBoundary = true;
                    break;

            }

            var
            nextIndex = navigationUnit.index - 1,
            nextNavigationUnit = _findNavigationUnitWithIndex(me, nextIndex);

            navigationUnit = nextNavigationUnit;
        }

        description.navigationUnitsCrossedOver = description.navigationUnitsCrossedOver.reverse();


        return description;
    }

    function _createForwardNavigationDescription(me, sourceNavigationUnit, boundaryOption) {

        var description = new NavigationDescription();
        description.sourceNavigationUnit = sourceNavigationUnit;
        description.isForward = true;

        description.crossesSaveBoundary = boundaryOption === msls_BoundaryOption.save;
        description.crossesNestedBoundary = boundaryOption === msls_BoundaryOption.nested;

        if (description.crossesSaveBoundary) {
            for (var id in me.navigationStack) {
                var navigationUnit = me.navigationStack[id];
                if (navigationUnit.screen === sourceNavigationUnit.screen) {
                    description.navigationUnitsCrossedOver.push(navigationUnit);
                }
            }
        } else {
            description.navigationUnitsCrossedOver.push(sourceNavigationUnit);
        }

        return description;
    }

    function _createTaskViewModel(me, screenObject, taskBoundaryOption) {

        var task = new msls.TaskViewModel(me, screenObject, taskBoundaryOption);

        task.home = screenObject.details.getModel().id === me._homeScreen.id;


        task.tabCommands = [];
        var tabs = screenObject.details.pages.filter(function (page) {
            return page.pageKind === msls_PageKind.tab;
        });

        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i],
                commandName = tab.name,
                commandVM = msls_createShellCommandViewModel("showTab", screenObject,
                    msls_createBoundArguments(null, [{ value: tab.name }]),
                    tab.displayName,
                    commandName),
                displayNameBinding = new msls.data.DataBinding("displayName", tab, "displayName", commandVM);

            displayNameBinding.bind();
            task.tabCommands.push(commandVM);
        }

        var titleScreen, taskTitleScreen;

        titleScreen = screenObject;

        if (taskBoundaryOption !== msls_BoundaryOption.save) {
            var saveUnits = me.findNavigationUnits(
                function (navUnit) {
                    return (navUnit.boundaryOption === msls_BoundaryOption.save);
                }),
                lastSaveBoundaryUnit = (saveUnits.length ?
                    saveUnits.pop() :
                    me.navigationStack[0]);
            taskTitleScreen = (lastSaveBoundaryUnit ? lastSaveBoundaryUnit.screen : screenObject);
        }

        var titleBinding = new msls.data.DataBinding("displayName", titleScreen.details, "screenTitle", task,
            msls_data_DataBindingMode.oneWayFromSource);
        titleBinding.bind();
        if (taskTitleScreen) {
            var taskTitleBinding = new msls.data.DataBinding("displayName", taskTitleScreen.details, "taskTitle", task,
                msls_data_DataBindingMode.oneWayFromSource);
            taskTitleBinding.bind();
        }

        return task;
    }

    function _completeOrFailOperation(operation, error) {
        if (error) {
            operation.error(error);
        } else {
            operation.complete();
        }
    }


    msls_defineClass(msls, "ShellViewModel",
        function ShellViewModel() {

            this.navigationStack = {};
        }, null, {
            activeNavigationUnit: msls_observableProperty(),
            logoPath: msls_observableProperty(),
            canSaveChanges: msls_computedProperty(_computeCanSaveChanges),
            canDiscardChanges: msls_computedProperty(_computeCanDiscardChanges),
            canAcceptNestedChanges: msls_computedProperty(_computeCanAcceptNestedChanges),
            canCancelNestedChanges: msls_computedProperty(_computeCanCancelNestedChanges),
            canNavigateHome: msls_computedProperty(_computeCanNavigateHome),

            saveChanges: saveChanges,
            discardChanges: discardChanges,
            acceptNestedChanges: acceptNestedChanges,
            cancelNestedChanges: cancelNestedChanges,

            showScreen: showScreen,
            showTab: showTab,
            showDialog: showDialog,
            navigateBack: navigateBack,
            navigateHome: navigateHome,

            requestNavigateBack: requestNavigateBack,
            validateActivePage: validateActivePage,
            initialize: initialize,
            findNavigationUnits: findNavigationUnits,
            navigationInProgress: msls_accessorProperty(function () {
                return !!this._currentNavigationOperation;
            }),
            finishNavigation: finishNavigation,
            _startNavigationOperation: _startNavigationOperation,

            _onDispose:
                function _onDispose() {
                    msls_dispose(this.saveCommand);
                    msls_dispose(this.discardCommand);
                    msls_dispose(this.okCommand);
                    msls_dispose(this.cancelCommand);
                    msls_dispose(this.homeCommand);
                    msls_dispose(this.backCommand);
                    msls_dispose(this.closeCommand);
                }

        }
    );

    msls_setProperty(msls, "shell", new msls.ShellViewModel());
    msls_shell = msls.shell;

}());

var msls_createScreenLoaderArguments;

(function () {
    var _ScreenCollectionPropertyLoader,
        _EntityState = msls.EntityState;

    function getPropertyModel(screenDetails, entry) {
        var screenModel = screenDetails.getModel(),
            propertyModel = screenModel ? msls_findModelItem(screenModel.properties, entry.name) : null;
        return propertyModel;
    }

    function createScreenLoaderArguments(
        screenDetails,
        propertyModel) {

        var source, descriptors = [];

        if (!!propertyModel &&
            !!(source = propertyModel.source)) {
            var info = msls_parseScreenRelativeExpression(source);
            descriptors = info.argumentBindings;
        }

        return msls_createBoundArguments(screenDetails.screen, descriptors);
    }

    msls_createScreenLoaderArguments =
    function msls_createScreenLoaderArguments(
        screenDetails,
        entry) {
        return createScreenLoaderArguments(screenDetails, getPropertyModel(screenDetails, entry));
    };

    function handleArgumentsChanged(me) {
        var invalidatedCallback = me._invalidatedCallback;
        if (invalidatedCallback) {
            invalidatedCallback();
        }
    }

    msls_defineClass(msls, "ScreenCollectionPropertyLoader",
        function ScreenCollectionPropertyLoader(
            screenDetails,
            entry) {

            var me = this,
                propertyModel = getPropertyModel(
                    screenDetails, entry);

            msls_CollectionLoader.call(me, propertyModel.pageSize);

            msls_setProperty(me, "_screenDetails", screenDetails);
            msls_setProperty(me, "_entry", entry);
            msls_setProperty(me, "_arguments",
                createScreenLoaderArguments(screenDetails, propertyModel));

            if (!!propertyModel.disablePaging) {
                msls_setProperty(me, "_disablePaging", true);
            }
            if (msls_isCountlessEntityType(propertyModel.elementType)) {
                msls_setProperty(me, "_disableTotalCount", true);
            }

            me._arguments.addChangeListener(null, function () {
                handleArgumentsChanged(me);
            });
        },
        msls_CollectionLoader, {
            deleteItem:
                function deleteItem(item) {
                    item.deleteEntity();
                },

            _onDispose:
                function _onDispose() {
                    msls_dispose(this._arguments);
                }
        }
    );
    _ScreenCollectionPropertyLoader = msls.ScreenCollectionPropertyLoader;

    function getEntitySet(me, entityType) {

        var entitySet = me._entitySet,
            baseQuery;

        if (!entitySet) {
            baseQuery = me._baseQuery;
            if (baseQuery) {
                entitySet = baseQuery._entitySet;
            } else {
                if (!entityType) {
                    entityType = me._entry.elementType;
                }
                entitySet = msls_EntitySet_getEntitySetForEntityType(
                    me._screenDetails.dataWorkspace, entityType);
            }
            me._entitySet = entitySet;
        }
        return entitySet;
    }

    function screenCollectionPropertyLoader_addNewItem(me) {

        var _entityType = me._entry.elementType,
            entitySet = getEntitySet(me, _entityType);


        return new _entityType(entitySet);
    }
    function screenCollectionPropertyLoader_addNewItem_canExecute(me) {
        var _entityType = me._entry.elementType,
            entitySet = getEntitySet(me, _entityType);
        return entitySet.canInsert;
    }

    function contentChangeHandler(me, entity) {
        var collectionChangeCallback = me._collectionChangeCallback,
            entityState;

        if (collectionChangeCallback && entity instanceof me._entry.elementType) {
            entityState = entity.details.entityState;

            if (entityState === _EntityState.added) {
                collectionChangeCallback(msls_CollectionChangeAction.add, entity);
            } else if (entityState === _EntityState.discarded) {
                collectionChangeCallback(msls_CollectionChangeAction.remove, entity);
            }
        }
    }

    msls_defineClass(msls, "ScreenQueryPropertyLoader",
        function ScreenQueryPropertyLoader(screenDetails, entry) {
            var me = this;
            _ScreenCollectionPropertyLoader.call(me, screenDetails, entry);

            msls_addAutoDisposeEventListener(
                me._screenDetails.dataWorkspace.details,
                "contentchange",
                me,
                function (e) {
                    contentChangeHandler(me, e.detail);
                }
            );
        },
        _ScreenCollectionPropertyLoader, {
            _baseQuery: msls_accessorProperty(
                function _baseQuery_get() {
                    return this._entry.createQuery.apply(
                        this._screenDetails, this._arguments.getCurrentValues());
                }
            ),
            _getAddedEntities:
                function _getAddedEntities() {
                    return getEntitySet(this)._addedEntities;
                },
            addNewItem:
                function addNewItem() {
                    return screenCollectionPropertyLoader_addNewItem(this);
                }
        }
    );
    msls_makeDataServiceQueryLoader(msls.ScreenQueryPropertyLoader);
    msls_setProperty(msls.ScreenQueryPropertyLoader.prototype.addNewItem, "canExecute",
        function addNewItem_canExecute() {
            return screenCollectionPropertyLoader_addNewItem_canExecute(this);
        }
    );

    function entityCollectionChange(me, collectionChange) {
        var collectionChangeCallback = me._collectionChangeCallback,
            action = collectionChange.action;
        if (!!collectionChangeCallback &&
            (action === msls_CollectionChangeAction.add || action === msls_CollectionChangeAction.remove)) {
            collectionChangeCallback(action, collectionChange.items[0]);
        }
    }

    function resetScreenNavigationPropertyLoader(me) {

        var collectionProperty = me._collectionProperty,
            collectionChangeHandler = me._collectionChangeHandler,
            collectionChangeEventName = "collectionchange",
            entityCollection;

        if (collectionChangeHandler) {
            msls_dispose(collectionChangeHandler);
        }

        collectionProperty = me._collectionProperty = me._entry.getNavigationProperty.apply(me._screenDetails);
        if (collectionProperty) {
            entityCollection = msls_Entity_getEntityCollection(collectionProperty);

            me._collectionChangeHandler = msls_addAutoDisposeEventListener(
                entityCollection,
                collectionChangeEventName,
                me,
                function (e) {
                    entityCollectionChange(me, e.detail);
                }
            );
        }
    }

    msls_defineClass(msls, "ScreenNavigationPropertyLoader",
        function ScreenNavigationPropertyLoader(
            screenDetails,
            entry) {


            var me = this,
                propertyModel, queryModel, source, descriptors = [], sourceBinding;

            _ScreenCollectionPropertyLoader.call(me, screenDetails, entry);

            if (!!(propertyModel = getPropertyModel(me._screenDetails, me._entry)) &&
                !!(queryModel = propertyModel.query) &&
                !!(source = queryModel.source)) {
                var info = msls_parseScreenRelativeExpression(source);
                descriptors.push({ binding: info.lastObjectBindingPath });
            }

            sourceBinding = msls_createBoundArguments(screenDetails.screen, descriptors);
            sourceBinding.addChangeListener(null, function () {
                resetScreenNavigationPropertyLoader(me);
                handleArgumentsChanged(me);
            });

            msls_addLifetimeDependency(me, sourceBinding);

            resetScreenNavigationPropertyLoader(me);
        },
        _ScreenCollectionPropertyLoader, {
            _baseQuery: msls_accessorProperty(
                function _baseQuery_get() {
                    var collectionProperty = this._collectionProperty;
                    return collectionProperty && collectionProperty.query;
                }
            ),
            _getAddedEntities:
                function _getAddedEntities() {
                    var results = [],
                        collectionProperty = this._collectionProperty;
                    if (collectionProperty) {
                        results = msls_Entity_getAddedEntitiesInCollection(
                            collectionProperty);
                    }
                    return results;
                },
            addNewItem:
                function addNewItem() {
                    var me = this,
                        collectionProperty = me._collectionProperty,
                        newEntity = screenCollectionPropertyLoader_addNewItem(
                            me),
                        data,
                        toPropertyName;
                    if (!!collectionProperty) {
                        data = collectionProperty._entry.data;

                        if (!!data) {
                            toPropertyName = data.toPropertyName;
                            if (!!toPropertyName) {
                                newEntity[toPropertyName] = collectionProperty.owner;
                            }
                        }
                    }
                    return newEntity;
                }
        }
    );
    msls_makeDataServiceQueryLoader(msls.ScreenNavigationPropertyLoader);
    msls_setProperty(msls.ScreenNavigationPropertyLoader.prototype.addNewItem, "canExecute",
        function addNewItem_canExecute() {
            return screenCollectionPropertyLoader_addNewItem_canExecute(this);
        }
    );

}());

(function () {

    msls_defineClass(msls, "ScreenScalarPropertyLoader",
        function ScreenScalarPropertyLoader(
            screenDetails, entry, invalidatedCallback) {

            var me = this;

            msls_setProperty(me, "_screenDetails", screenDetails);
            msls_setProperty(me, "_entry", entry);
            msls_setProperty(me, "_arguments", msls_createScreenLoaderArguments(
                screenDetails,
                entry));

            me._arguments.addChangeListener(null, invalidatedCallback);
        }, null, {
            load: function load() {
                var me = this,
                    activePromise = me._activePromise,
                    baseQuery,
                    loadOperationDone;

                if (!activePromise) {
                    activePromise = me._activePromise = msls_promiseOperation(
                        function initLoad(operation) {
                            baseQuery = me._entry.createQuery.apply(
                                    me._screenDetails, me._arguments.getCurrentValues());
                            baseQuery.execute()._thenEx(
                                function (error, queryResult) {
                                    loadOperationDone = true;
                                    me._activePromise = null;

                                    if (error) {
                                        operation.error(error);
                                    } else {
                                        operation.complete(queryResult.results[0]);
                                    }
                                }
                            );
                        }
                    );

                    if (loadOperationDone) {
                        me._activePromise = null;
                    }
                }

                return activePromise;
            }
        }
    );

}());

(function () {

    var _Screen = msls.Screen,
        _ScreenDetails = _Screen.Details,
        _ScreenProperty,
        _LocalProperty,
        _RemoteProperty,
        _ReferenceProperty,
        _CollectionProperty,
        _ComputedProperty;

    msls_defineClass(_ScreenDetails, "Property",
        function Screen_Details_Property(details, entry) {
            /// <summary>
            /// Represents a screen property object.
            /// </summary>
            /// <param name="details" type="msls.Screen.Details">
            /// The screen details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="owner" type="msls.Screen">
            /// Gets the screen that owns this property.
            /// </field>
            /// <field name="screen" type="msls.Screen">
            /// Gets the screen that owns this property.
            /// </field>
            msls_BusinessObject_Details_Property.call(this, details, entry);
            if (window.intellisense) {
                if (!details) {
                    this.owner = null;
                }
            }
            this.screen = this.owner;
        },
        msls_BusinessObject_Details_Property
    );
    _ScreenProperty = _ScreenDetails.Property;
    msls_intellisense_setTypeProvider(
        _ScreenProperty.prototype, "screen",
        function (o) {
            return o.screen.constructor;
        }
    );

    function getScreenPropertyValue() {
        return this._entry.get.call(this._details.owner);
    }

    function setScreenPropertyValue(value) {
        this._entry.set.call(this._details.owner, value);
    }

    msls_defineClass(_ScreenDetails, "LocalProperty",
        function Screen_Details_LocalProperty(details, entry) {
            /// <summary>
            /// Represents a local screen property object.
            /// </summary>
            /// <param name="details" type="msls.Screen.Details">
            /// The screen details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            _ScreenProperty.call(this, details, entry);
        },
        _ScreenProperty, {
            value: msls_accessorProperty(
                getScreenPropertyValue,
                setScreenPropertyValue
            )
        }
    );
    _LocalProperty = _ScreenDetails.LocalProperty;
    msls_intellisense_setTypeProvider(
        _LocalProperty.prototype, "value",
        function (o) {
            return o.getPropertyType();
        }
    );

    msls_defineClass(_ScreenDetails, "RemoteProperty",
        function Screen_Details_RemoteProperty(details, entry) {
            /// <summary>
            /// Represents a remote screen property object.
            /// </summary>
            /// <param name="details" type="msls.Screen.Details">
            /// The screen details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="isLoaded" type="Boolean">
            /// Gets a value indicating if this property has been loaded.
            /// </field>
            /// <field name="loadError" type="String">
            /// Gets the last load error, or null if no error occurred.
            /// </field>
            /// <field name="value" type="Object">
            /// Gets the value of this property.
            /// </field>
            _ScreenProperty.call(this, details, entry);
        },
        _ScreenProperty, {
            isLoaded: msls_observableProperty(false,
                function isLoaded_get() {
                    var details = this._details,
                        data = details._propertyData[this.name];

                    return !!data._isLoaded;
                }
            ),
            loadError: msls_observableProperty(null),
            value: msls_accessorProperty(getScreenPropertyValue)
        }
    );
    _RemoteProperty = _ScreenDetails.RemoteProperty;
    msls_intellisense_setTypeProvider(
        _RemoteProperty.prototype, "value",
        function (o) {
            return o.getPropertyType();
        }
    );

    function loadRemoteProperty(
        me,
        data,
        initLoad) {
        /// <param name="me" type="msls.Screen.Details.RemoteProperty" />
        /// <param name="data" />
        /// <param name="initLoad" type="Function" />
        /// <returns type="WinJS.Promise" />
        var loadPromise = data._loadPromise;

        if (!loadPromise) {
            if (data._isLoaded) {
                data._isLoaded = false;
                me.dispatchChange("isLoaded");
            }
            data._loading = true;
            if (me.loadError) {
                me.loadError = null;
            }

            loadPromise = data._loadPromise = msls_promiseOperation(initLoad);

            if (!data._loading) {
                data._loadPromise = null;
            }
        }

        return loadPromise;
    }

    function completeLoadRemoteProperty(
        me,
        data,
        error) {
        data._loading = false;

        data._isLoaded = true;
        me.dispatchChange("isLoaded");

        if (error) {
            me.loadError = error;
        }

        data._loadPromise = null;
    }

    msls_defineClass(_ScreenDetails, "ReferenceProperty",
        function Screen_Details_ReferenceProperty(details, entry) {
            /// <summary>
            /// Represents a screen reference property object.
            /// </summary>
            /// <param name="details" type="msls.Screen.Details">
            /// The screen details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            _RemoteProperty.call(this, details, entry);
        },
        _RemoteProperty, {
            load: function load() {
                /// <summary>
                /// Asynchronously loads the value of this property and returns
                /// a promise that is fulfilled when the value has been loaded.
                /// </summary>
                /// <returns type="WinJS.Promise">
                /// A promise that is fulfilled when the value has been loaded.
                /// </returns>
                var me = this,
                    details = me._details,
                    propertyName = me.name,
                    data = details._propertyData[propertyName],
                    loadPromise;

                loadPromise = loadRemoteProperty(
                    me,
                    data,
                    function initLoad(operation) {
                        var loader = data._loader;
                        if (!loader) {
                            loader = data._loader = new msls.ScreenScalarPropertyLoader(
                                details, me._entry, function onLoaderInvalidated() {
                                    details.properties[propertyName].load();
                                }
                            );
                        }
                        loader.load()._thenEx(function (error, entity) {
                            completeLoadRemoteProperty(
                                me,
                                data,
                                error);

                            if (data._value !== entity) {
                                data._value = entity;

                                me.dispatchChange("value");
                                me.screen.dispatchChange(propertyName);
                            }

                            if (!error) {
                                operation.complete(entity);
                            } else {
                                operation.error(error);
                            }
                        });
                    }
                );
                if (window.intellisense) {
                    loadPromise._$annotate(String, me.getPropertyType());
                }
                return loadPromise;
            }
        }
    );
    _ReferenceProperty = _ScreenDetails.ReferenceProperty;

    msls_Screen_rawGetCollectionPropertyValue =
    function rawGetCollectionPropertyValue(
        details,
        entry,
        data) {

        var value = data._value,
            loader;

        if (!value) {
            loader = createCollectionLoader(details, entry);
            value = data._value = new entry.type(details, loader);

            msls_addLifetimeDependency(value, loader);
            msls_addLifetimeDependency(details, value);
        }

        return value;
    };

    msls_defineClass(_ScreenDetails, "CollectionProperty",
        function Screen_Details_CollectionProperty(details, entry) {
            /// <summary>
            /// Represents a screen collection property object.
            /// </summary>
            /// <param name="details" type="msls.Screen.Details">
            /// The screen details that owns this property.
            /// </param>
            /// <param name="entry">
            /// The entry that describes this property.
            /// </param>
            /// <field name="value" type="msls.VisualCollection">
            /// Gets the value of this property.
            /// </field>
            _RemoteProperty.call(this, details, entry);
        },
        _RemoteProperty, {
            isReadOnly: msls_accessorProperty(
                function isReadOnly_get() {
                    /// <returns type="Boolean" />
                    return msls_EntitySet_isEntitySetReadOnly(
                            this._details.dataWorkspace,
                            this._entry.elementType);
                }
            ),
            load: function load() {
                /// <summary>
                /// Asynchronously loads the value of this property and returns
                /// a promise that is fulfilled when the value has been loaded.
                /// </summary>
                /// <returns type="WinJS.Promise">
                /// A promise that is fulfilled when the value has been loaded.
                /// </returns>
                var me = this,
                    details = me._details,
                    data = details._propertyData[me.name],
                    loadPromise;

                loadPromise = loadRemoteProperty(
                    me,
                    data,
                    function initLoad(operation) {

                        var vc = msls_Screen_rawGetCollectionPropertyValue(
                            details, me._entry, data);

                        function afterLoad(error) {
                            completeLoadRemoteProperty(
                                me,
                                data,
                                error);
                            if (!error) {
                                operation.complete(vc);
                            } else {
                                operation.error(error);
                            }
                        }

                        if (vc.canLoadMore) {
                            vc.load()._thenEx(afterLoad);
                        } else {
                            afterLoad(null);
                        }
                    }
                );
                if (window.intellisense) {
                    loadPromise._$annotate(String, me._entry.type);
                }
                return loadPromise;
            }
        }
    );
    _CollectionProperty = _ScreenDetails.CollectionProperty;
    if (window.intellisense) {
        msls_mixIntoExistingClass(_CollectionProperty, {
            value: msls_accessorProperty(
                function value_get() {
                    /// <returns type="msls.VisualCollection" />
                    return getScreenPropertyValue.apply(this, arguments);
                }
            )
        });
    }

    function createCollectionLoader(screenDetails, entry) {
        if (entry.getNavigationProperty) {
            return new msls.ScreenNavigationPropertyLoader(screenDetails, entry);
        } else {
            return new msls.ScreenQueryPropertyLoader(screenDetails, entry);
        }
    }

}());

(function () {

    var _VisualCollection = msls.VisualCollection,
        _VisualCollectionState;

    msls_defineEnum(_VisualCollection, {
        /// <field>
        /// Specifies the state of a visual collection.
        /// </field>
        State: {
            /// <field type="String">
            /// Specifies that the collection is not currently loading data.
            /// </field>
            idle: "idle",
            /// <field type="String">
            /// Specifies that the visual collection is currently loading data.
            /// </field>
            loading: "loading",
            /// <field type="String">
            /// Specifies that the visual collection is currently loading more data.
            /// </field>
            loadingMore: "loadingMore"
        }
    });
    _VisualCollectionState = _VisualCollection.State;

    msls_initVisualCollection = function initVisualCollection(visualCollection, screenDetails, loader) {
        var me = visualCollection;

        me.screen = screenDetails ? screenDetails.owner : null;
        if (window.intellisense) {
            if (!me.screen && !!me._$screenClass) {
                me.screen = new me._$screenClass();
            }
        }
        msls_setProperty(me, "_loader", loader);
        msls_setProperty(me, "_data", []);
        msls_setProperty(me, "_deferredEvents", []);

        loader.subscribe(function (action, item) {
            onLoaderCollectionChange(me, action, item);
        }, function (action, item) {
            onLoaderInvalidated(me);
        });
    };

    function onLoaderInvalidated(me) {
        if (me._loadOperation) {
            me._loadOperation.code(function () {
                resetAndLoadNext(me);
            })();
        } else {
            me.load();
        }
    }

    function onLoaderCollectionChange(me, action, item) {

        var data = me._data,
            foundIndex = -1;

        if (action === msls_CollectionChangeAction.add) {
            data.splice(0, 0, item);
            publishEvent(me, "change", "count");
            publishEvent(me, "collectionchange",
                        new msls_CollectionChange(action, [item], -1, 0));
        } else {
            $.each(data, function (index, o) {
                if (o === item) {
                    data.splice(index, 1);
                    foundIndex = index;
                    return false;
                }
                return true;
            });

            if (foundIndex >= 0) {
                if (me.selectedItem === item) {
                    me.selectedItem = null;
                }
                publishEvent(me, "change", "count");
                publishEvent(me, "collectionchange",
                        new msls_CollectionChange(msls_CollectionChangeAction.remove, [item], foundIndex, -1));
            }
        }
    }

    function holdEvents(me) {
        me._deferEvents = true;
    }

    function releaseEvents(me) {
        var list = me._deferredEvents;
        me._deferEvents = false;
        $.each(list, function () {
            if (this.type === "change") {
                me.dispatchChange(this.e);
            } else {
                me.dispatchEvent(this.type, this.e);
            }
        });
        list.length = 0;
    }

    function publishEvent(me, type, e) {
        if (me._deferEvents) {
            me._deferredEvents.push({ type: type, e: e });
        } else {
            if (type === "change") {
                me.dispatchChange(e);
            } else {
                me.dispatchEvent(type, e);
            }
        }
    }

    function setFieldAndPublishEvent(me, fieldName, value, propertyName) {
        if (me[fieldName] !== value) {
            me[fieldName] = value;
            publishEvent(me, "change", propertyName);
        }
    }

    function selectedItem_get() {
        return this._selectedItem;
    }

    function selectedItem_set(value) {
        setFieldAndPublishEvent(this, "_selectedItem", value, "selectedItem");
    }

    function setIsLoaded(me, value) {
        setFieldAndPublishEvent(me, "_isLoaded", value, "isLoaded");
    }

    function setLoadError(me, value) {
        setFieldAndPublishEvent(me, "_loadError", value, "loadError");
    }

    function load() {
        /// <summary>
        /// Asynchronously loads the first page of items into this collection and
        /// returns a promise that will be fulfilled when the first page is loaded.
        /// </summary>
        /// <returns type="WinJS.Promise">
        /// A promise that is fulfilled when the first page is loaded.
        /// </returns>
        var me = this,
            loadPromise = me._loadPromise,
            eventsPublished, operationInitialized;

        function tryPublishLoadEvents() {
            if (!eventsPublished) {
                eventsPublished = true;
                publishEvent(me, "change", "state");
                publishEvent(me, "change", "canLoadMore");
                setLoadError(me, null);
            }
        }

        if (loadPromise) {
            return loadPromise;
        }

        me._loadMorePromise = null;

        loadPromise = me._loadPromise =
        msls_promiseOperation(function initLoad(operation) {
            operationInitialized = true;
            me._loadOperation = operation;
            loadPromise = me._loadPromise = operation.promise();
            tryPublishLoadEvents();

            resetAndLoadNext(me);
        });
        if (window.intellisense) {
            loadPromise._$annotate(String, Number);
        }

        if (operationInitialized && !me._loadOperation) {
            me._loadPromise = null;
        }

        tryPublishLoadEvents();

        return loadPromise;
    }

    function resetAndLoadNext(me) {
        var loader = me._loader,
            loaderPromise;

        loader.reset();

        loaderPromise = me._activeLoaderPromise = loader.loadNext();
        loaderPromise._thenEx(function (error, items) {
            if (me._activeLoaderPromise === loaderPromise) {
                resetAndLoadNextCompleted(me, items, error);
            }
        });
    }

    function resetAndLoadNextCompleted(me, items, error) {
        msls_mark(msls_codeMarkers.fillCollectionStart);
        var data = me._data,
            loadOperation = me._loadOperation;

        me._loadOperation = null;
        me._loadPromise = null;

        try {
            holdEvents(me);
            if (error) {
                setLoadError(me, error);
            } else {
                setLoadError(me, null);

                data.length = 0;
                $.each(items, function () {
                    data.push(this);
                });

                publishEvent(me, "change", "state");
                publishEvent(me, "change", "count");
                publishEvent(me, "collectionchange", new msls_CollectionChange(msls_CollectionChangeAction.refresh));
                setIsLoaded(me, true);
                publishEvent(me, "change", "canLoadMore");
                me.selectedItem = null;
            }
            releaseEvents(me);
        }
        finally {
            if (error) {
                loadOperation.error(error);
            } else {
                loadOperation.complete(me.count);
            }

            msls_mark(msls_codeMarkers.fillCollectionEnd);
        }
    }

    function loadMore() {
        /// <summary>
        /// Asynchronously loads an additional page of items into this collection
        /// and returns a promise that will be fulfilled when the page is loaded.
        /// </summary>
        /// <returns type="WinJS.Promise">
        /// A promise that is fulfilled when the additional page of items is loaded.
        /// </returns>
        var me = this,
            loadMorePromise = me._loadMorePromise,
            eventsPublished, operationInitialized;

        function throwIfCannotLoadMore() {
            if (!me.canLoadMore) {
                var errorMessage;
                if (me._loadPromise) {
                    errorMessage = msls_getResourceString("visualCollection_load_pending");
                } else {
                    errorMessage = msls_getResourceString("visualCollection_already_loaded");
                }
                msls_throwInvalidOperationError(errorMessage);
            }
        }

        function tryPublishLoadMoreEvents() {
            if (!eventsPublished) {
                eventsPublished = true;

                publishEvent(me, "change", "state");
            }
        }

        if (loadMorePromise) {
            return loadMorePromise;
        }

        throwIfCannotLoadMore();

        loadMorePromise = me._loadMorePromise =
        msls_promiseOperation(function (operation) {
            throwIfCannotLoadMore();

            operationInitialized = true;
            me._loadMoreOperation = operation;
            loadMorePromise = me._loadMorePromise = operation.promise();

            tryPublishLoadMoreEvents();

            var loaderPromise = me._activeLoaderPromise = me._loader.loadNext(me._data);
            loaderPromise._thenEx(function (error, items) {
                if (me._activeLoaderPromise === loaderPromise) {
                    loadNextCompleted(me, items, error);
                }
            });
        });
        function LoadMoreResult() {
            /// <field name="startIndex" type="Number">
            /// Gets the starting index in the collection of the loaded items.
            /// </field>
            /// <field name="items" type="Array">
            /// Gets the array of loaded items.
            /// </field>
        }
        if (window.intellisense) {
            loadMorePromise._$annotate(String, LoadMoreResult);
        }

        if (operationInitialized && !me._loadMoreOperation) {
            me._loadMorePromise = null;
        }

        tryPublishLoadMoreEvents();

        return loadMorePromise;
    }

    function loadNextCompleted(me, items, error) {
        msls_mark(msls_codeMarkers.fillCollectionStart);

        var data = me._data,
            startIndex = data.length,
            loadMoreOperation = me._loadMoreOperation;

        me._loadMoreOperation = null;
        me._loadMorePromise = null;

        try {
            holdEvents(me);
            if (error) {
                setLoadError(me, error);
            } else {
                setLoadError(me, null);

                $.each(items, function () {
                    data.push(this);
                });

                publishEvent(me, "change", "state");
                if (items.length > 1) {
                    publishEvent(me, "change", "count");
                    publishEvent(me, "collectionchange",
                        new msls_CollectionChange(msls_CollectionChangeAction.add, items, -1, startIndex));
                }
                setIsLoaded(me, true);
                if (!me.canLoadMore) {
                    publishEvent(me, "change", "canLoadMore");
                }
            }
            releaseEvents(me);
        }
        finally {
            if (error) {
                loadMoreOperation.error(error);
            } else {
                loadMoreOperation.complete({
                    items: items,
                    startIndex: startIndex
                });
            }

            msls_mark(msls_codeMarkers.fillCollectionEnd);
        }
    }

    function addNew() {
        var newItem = this._loader.addNewItem();
        this.selectedItem = newItem;
        return newItem;
    }
    addNew.canExecute = function addNew_canExecute() {
        var loader = this._loader,
            addNewItem = loader.addNewItem;
        return !addNewItem.canExecute || addNewItem.canExecute.apply(loader);
    };

    function deleteSelected() {
        var selectedItem = this.selectedItem;
        if (selectedItem) {
            this._loader.deleteItem(selectedItem);
        } else {
            msls_throwInvalidOperationError(msls_getResourceString("visualCollection_no_sel"));
        }
    }
    deleteSelected.canExecute = function deleteSelected_canExecute() {
        var selectedItem = this.selectedItem,
            entityDetails, entitySet;
        return !!selectedItem &&
            !!(entityDetails = selectedItem.details) &&
            !!(entitySet = entityDetails.entitySet) &&
            (entityDetails.entityState === msls.EntityState.added || !!entitySet.canDelete);
    };

    msls_mixIntoExistingClass(_VisualCollection, {
        _deferEvents: false,
        _isLoaded: false,
        _loadError: null,
        _selectedItem: null,
        canLoadMore: msls_accessorProperty(
            function canLoadMore_get() {
                /// <returns type="Boolean" />
                return !this._loadPromise && this._loader.canLoadNext;
            }
        ),
        data: msls_accessorProperty(
            function data_get() {
                /// <returns type="Array" />
                return this._data.slice(0);
            }
        ),
        count: msls_observableProperty(null,
            function count_get() {
                /// <returns type="Number" />
                return this._data.length;
            }
        ),
        isLoaded: msls_observableProperty(null,
            function isLoaded_get() {
                /// <returns type="Boolean" />
                return this._isLoaded;
            }
        ),
        state: msls_observableProperty(_VisualCollectionState.idle,
            function state_get() {
                if (this._loadPromise) {
                    return _VisualCollectionState.loading;
                } else if (this._loadMorePromise) {
                    return _VisualCollectionState.loadingMore;
                } else {
                    return _VisualCollectionState.idle;
                }
            }
        ),
        loadError: msls_observableProperty(null,
            function loadError_get() {
                /// <returns type="String" />
                return this._loadError;
            }
        ),
        selectedItem: msls_observableProperty(null, selectedItem_get, selectedItem_set),

        load: load,
        loadMore: loadMore,
        addNew: addNew,
        deleteSelected: deleteSelected,
        _onDispose:  function _onDispose() {
            var loader = this._loader;
            if (loader) {
                msls_dispose(loader);
                this._loader = null;
            }
        },

        collectionchange: msls_event()
    });
    msls_intellisense_setTypeProvider(
        _VisualCollection.prototype, "selectedItem",
        function (o) {
            return o._$entry ? o._$entry.elementType : null;
        }
    );

    msls_makeVisualCollection =
    function makeVisualCollection(screenClass, entry) {
        var visualCollectionClass = _VisualCollection;
        visualCollectionClass = function VisualCollection(screenDetails, loader) {
            _VisualCollection.call(this, screenDetails, loader);
        };
        msls_defineClass(null, null, visualCollectionClass, _VisualCollection, {
            _$screenClass: screenClass,
            _$entry: entry
        });
        return visualCollectionClass;
    };

    msls_expose("VisualCollection", _VisualCollection);

}());

var


    cssDefaultJqmTheme = "a",


    ui_page_active = "ui-page-active",


    msls_presenter_content = "msls-presenter-content",
    msls_presenter = "msls-presenter",



    ui_btn_active = "ui-btn-active",

    msls_list_empty = "msls-list-empty",
    msls_list_loading = "msls-list-loading",



    msls_overlay = "msls-overlay",
    msls_overlay_active = "msls-overlay-active",
    msls_id_dialog_overlay = "msls-id-dialog-overlay",
    msls_id_progress_overlay = "msls-id-progress-overlay",
    msls_progress_icon = "msls-progress-icon",
    msls_msgbox_container = "msls-msgbox-container",
    msls_msgbox_overlay = "msls-msgbox-overlay",



    data_msls_weight = "data-msls-weight",
    msls_hstretch = "msls-hstretch",
    msls_hauto = "msls-hauto",
    msls_vstretch = "msls-vstretch",
    msls_vauto = "msls-vauto",
    msls_vscroll = "msls-vscroll",
    msls_columns_layout = "msls-columns-layout",
    msls_rows_layout = "msls-rows-layout",
    msls_layout_ignore = "msls-layout-ignore",
    msls_layout_ignore_children = "msls-layout-ignore-children",


    msls_viewer = "msls-viewer",

    msls_attached_label = "msls-attached-label",
    msls_state_overlay = "msls-state-overlay",
    ui_disabled = "ui-disabled",
    msls_collapsed = "msls-collapsed",
    msls_executing = "msls-executing",
    msls_display_error = "msls-display-error",
    msls_display_error_icon = "msls-display-error-icon",
    msls_display_error_text = "msls-display-error-text",
    msls_loading = "msls-loading",
    msls_read_only = "msls-read-only",
    msls_validation_error = "msls-validation-error",
    msls_validation_error_text = "msls-validation-error-text",


    msls_screen_tab = "msls-screen-tab",
    msls_screen_tab_active = "msls-screen-tab-active",

    msls_tab_content = "msls-tab-content",
    msls_tab_content_container = "msls-tab-content-container",
    msls_tab_content_active = "msls-tab-content-active",


    msls_id_app_loading_selector = "#msls-id-app-loading",
    msls_id_main_buttons_template_selector = "#msls-id-main-buttons-template",
    msls_id_main_buttons = "msls-id-main-buttons",

    msls_save_home_buttons = "msls-save-home-buttons",
    msls_okay_cancel_buttons = "msls-okay-cancel-buttons",
    taskHeaderTemplateSelector = "#Microsoft-LightSwitch-Task-Header",
    tabsBarTemplateSelector = "#Microsoft-LightSwitch-Tabs-Bar",
    dialogHeaderTemplateSelector = "#Microsoft-LightSwitch-Dialog-Header",

    msls_background_page = "msls-background-page",
    msls_content = "msls-content",
    msls_control_header = "msls-control-header",
    msls_dialog = "msls-dialog",
    msls_header = "msls-header",
    msls_id_animation_timekeeper = "msls-id-animation-timekeeper",
    msls_logo = "msls-logo",
    msls_logo_back_area = "msls-logo-back-area",
    msls_task = "msls-task",


    msls_dialog_transition = "msls-dialog-transition",
    msls_opening_transition = "msls-opening-transition",
    msls_screen_transition = "msls-screen-transition",
    msls_tab_transition = "msls-tab-transition",

    msls_in = "msls-in",
    msls_out = "msls-out",
    msls_reverse = "msls-reverse",
    msls_stage1 = "msls-stage1",
    msls_stage2 = "msls-stage2",
    msls_stage3 = "msls-stage3",


    msls_sharePoint_chrome = "msls-sharepoint-chrome",
    sharePointChromeTemplateSelector = "#Microsoft-LightSwitch-SharePoint-Chrome",
    msls_sharePoint_enabled = "msls-sharepoint-enabled"


;

var msls_application;

(function () {

    function navigateHome() {
        /// <summary>
        /// Asynchronously navigates forward to the home screen.
        /// </summary>
        /// <returns type="WinJS.Promise" />
        return msls_shell.navigateHome();
    }
    navigateHome.canExecute = function navigateHome_canExecute() {
        return msls_shell.navigateHome.canExecute.call(msls_shell);
    };

    function showScreen(screenId, boundaryOption, parameters, options) {
        /// <summary>
        /// Asynchronously navigates forward to a specific screen.
        /// </summary>
        /// <param name="screenId">
        /// The modeled name of a screen or the
        /// model item that defines a screen.
        /// </param>
        /// <param name="boundaryOption" type="String">
        /// A boundary option (from msls.BoundaryOption) that specifies the
        /// behavior when navigating to or returning from the target screen.
        /// </param>
        /// <param name="parameters" type="Array" optional="true">
        /// An array of screen parameters, if applicable.
        /// </param>
        /// <param name="options" optional="true">
        /// An object that provides one or more of the following options:
        /// <br/>- beforeShown: a function that is called after boundary
        ///          behavior has been applied but before the screen is shown.
        /// </param>
        /// <returns type="WinJS.Promise" />
        return msls_shell.showScreen(screenId, parameters, null,
            boundaryOption, false, options ? options.beforeShown : null);
    }

    function saveChanges(navigateBackOption) {
        /// <summary>
        /// Asynchronously saves any changes to the active data workspace
        /// and optionally navigates back to or before the last save boundary.
        /// </summary>
        /// <param name="navigateBackOption" type="String">
        /// A navigate back option (from msls.NavigateBackOption) that
        /// specifies how far back to navigate after saving changes.
        /// </param>
        /// <returns type="WinJS.Promise" />
        return msls_shell.saveChanges(navigateBackOption);
    }
    saveChanges.canExecute = function saveChanges_canExecute(navigateBackOption) {
        return msls_shell.saveChanges.canExecute.call(msls_shell, navigateBackOption);
    };

    function discardChanges(navigateBackOption) {
        /// <summary>
        /// Asynchronously discards any changes to the active data workspace
        /// and optionally navigates back to or before the last save boundary.
        /// </summary>
        /// <param name="navigateBackOption" type="String">
        /// A navigate back option (from msls.NavigateBackOption) that
        /// specifies how far back to navigate after discarding changes.
        /// </param>
        /// <returns type="WinJS.Promise" />
        return msls_shell.discardChanges(navigateBackOption);
    }
    discardChanges.canExecute = function discardChanges_canExecute(navigateBackOption) {
        return msls_shell.discardChanges.canExecute.call(msls_shell, navigateBackOption);
    };

    function acceptNestedChanges() {
        /// <summary>
        /// Asynchronously accepts any changes in the current nested change
        /// set (if any) and navigates back until the boundary that created
        /// the nested change set is crossed.
        /// </summary>
        /// <returns type="WinJS.Promise" />
        return msls_shell.acceptNestedChanges();
    }
    acceptNestedChanges.canExecute = function acceptNestedChanges_canExecute() {
        return msls_shell.acceptNestedChanges.canExecute.call(msls_shell);
    };

    function cancelNestedChanges() {
        /// <summary>
        /// Asynchronously cancels any changes in the current nested change
        /// set (if any) and navigates back until the boundary that created
        /// the nested change set is crossed.
        /// </summary>
        /// <returns type="WinJS.Promise" />
        return msls_shell.cancelNestedChanges();
    }
    cancelNestedChanges.canExecute = function cancelNestedChanges_canExecute() {
        return msls_shell.cancelNestedChanges.canExecute.call(msls_shell);
    };

    msls_addToInternalNamespace("application", {
        dataWorkspace: msls_accessorProperty(
            function dataWorkspace_get() {
                /// <returns type="msls.application.DataWorkspace" />
                var unit = msls_shell.activeNavigationUnit;
                if (!unit) {
                    unit = msls_shell.navigationStack[0];
                }
                return unit.screen.details.dataWorkspace;
            }
        ),
        rootUri: msls_rootUri.substring(0, msls_rootUri.lastIndexOf("/")),
        navigateHome: navigateHome,
        showScreen: showScreen,
        saveChanges: saveChanges,
        onsavechanges: msls_accessorProperty(
            function onsavechanges_get() {
                return this._listeners && this._listeners.savechanges;
            },
            function onsavechanges_set(value) {
                var me = this;
                if (me._listeners) {
                    me._listeners.savechanges = null;
                }
                WinJS.Utilities.eventMixin.addEventListener
                    .call(me, "savechanges", value);
                if (window.intellisense) {
                    setTimeout(function () {
                        WinJS.Utilities.eventMixin.dispatchEvent
                            .call(me, "savechanges", {
                                /// <field type="WinJS.Promise">
                                /// Gets or sets the promise object that
                                /// represents the saving of changes to
                                /// the active data workspace.
                                /// </field>
                                promise: null
                            });
                    }, 0);
                }
            }
        ),
        discardChanges: discardChanges,
        acceptNestedChanges: acceptNestedChanges,
        cancelNestedChanges: cancelNestedChanges
    });
    msls_application = msls.application;
    if (window.intellisense) {
        intellisense.annotate(msls_application, {
            /// <field type="msls.application.DataWorkspace">
            /// Gets the active data workspace.
            /// </field>
            dataWorkspace: null,
            /// <field type="String">
            /// Gets the root URI for the entire LightSwitch application. This
            /// is one level above the URI of the active client, and represents
            /// the location of the LightSwitch data service .svc files.
            /// </field>
            rootUri: null,
            /// <field type="Function">
            /// Gets or sets a handler for the save event, which is called when
            /// the application wants to save changes to the data workspace.
            /// <br/><br/>
            /// The handler should use the active data workspace to access and
            /// save changes to each data service that has changes, in an
            /// appropriate order and with appropriate error handling. The
            /// promise objects produced by the save operations should be
            /// combined into a single promise object and set as the value of
            /// the "promise" property on the event detail object. If errors
            /// occur while saving one or more data services, the combined
            /// promise error object should be an array that concatenates all
            /// of the server errors returned by each individual data service.
            /// <br/><br/>
            /// If the "promise" property is not set, the LightSwitch runtime
            /// will apply default behavior as follows. If there are no changes
            /// to any data services, nothing will happen. If there are changes
            /// to a single data service, these changes will be saved. In all
            /// other cases, an error message will be shown to the user stating
            /// that changes to multiple data services cannot be saved.
            /// </field>
            onsavechanges: null
        });
        msls_application._$field$onsavechanges$kind = "event";
    }

    msls_dispatchApplicationSaveChangesEvent =
    function dispatchApplicationSaveChangesEvent() {
        var details = {
            promise: null
        };
        WinJS.Utilities.eventMixin.dispatchEvent.call(
            window.msls.application, "savechanges", details);
        return details.promise;
    };

    msls_expose("_defineShowScreen", function defineShowScreen(method) {
        method.canExecute = function () {
            var options = arguments[method.length - 1];
            if (!!options && !!options.canExecute) {
                return options.canExecute.apply(this, arguments);
            }
            return true;
        };
        return method;
    });

    function initRun(complete, error) {
        $(msls_id_app_loading_selector + " img").error(function () {
            $(this).hide();
        });

        var promise = msls_resourcesReady();
        $(function () {
            promise.then(function () {
                loadTemplate(msls_rootUri + "/Content/Resources/msls.tmpl.html", function () {
                    msls.services.modelService.load().then(
                        function onModelLoaded() {
                            msls_shell.initialize()
                            .then(function success() {
                                complete();
                            }, function failure(e) {
                                error(e);
                            });
                        },
                        function onModelLoadError(description) {
                            var message = "Failed to load model: " + description;
                            error(message);
                        }
                    ).then(null, function (e) {
                        error(e);
                    });
                }, function (errorText) {
                    var message = "Failed to load template: " + errorText;
                    error(message);
                });
            }, function (errorMessage) {
                error(errorMessage);
            });
        });
    }

    var loadedTemplates = [];
    function loadTemplate(templateFileUri, success, error) {

        var loaded = false;
        for (var i = 0; i < loadedTemplates.length; i++) {
            if (loadedTemplates[i] === templateFileUri) {
                loaded = true;
                break;
            }
        }
        if (!loaded) {
            $.ajax({
                url: templateFileUri,
                success: function (data) {
                    $("body").append(data);
                    loadedTemplates.push(templateFileUri);
                    if (success) {
                        success();
                    }
                },
                cache: false,
                error: function (request, textStatus, errorThrown) {
                    if (error) {
                        error(errorThrown);
                    }
                }
            });
        } else {
            if (success) {
                success();
            }
        }
    }

    function run() {
        /// <summary>
        /// Asynchronously runs the LightSwitch application.
        /// </summary>
        /// <returns type="WinJS.Promise" />
        msls_mark(msls_codeMarkers.applicationRun);
        return new WinJS.Promise(initRun);
    }

    msls_expose("application", Object.create(msls_application));
    msls_intellisense_addTypeNameResolver(
        function resolveApplicationTypeName(type) {
            var application = window.msls.application, typeName;
            for (typeName in application) {
                if (application[typeName] === type) {
                    return "msls.application." + typeName;
                }
            }
            return null;
        }
    );

    msls_expose("_run", run);

}());

var msls_ui_controls_ScrollHelper;

(function () {

    function ScrollHelper(element) {

        var me = this,
            scrollElement = element.closest(".msls-vscroll");
        msls_setProperty(me, "_scrollElement", scrollElement);

        scrollElement.scroll(function () {
            onScroll(me);
        });
    }

    msls_defineClass("ui.controls", "ScrollHelper", ScrollHelper, null, {
        viewHeight: msls_accessorProperty(
            function viewHeight_get() {
                return this._scrollElement.height();
            }
        ),
        viewTop: msls_accessorProperty(
            function viewTop_get() {
                return this._scrollElement.scrollTop();
            }
        ),
        scroll: msls_event()
    });
    msls_ui_controls_ScrollHelper = msls.ui.controls.ScrollHelper;


    function onScroll(scrollHelper) {
        scrollHelper.dispatchEvent("scroll");
    }
}());

var msls_addOrRemoveClass,
    msls_removeClasses,
    msls_addClasses;

(function () {

    var arraySlice = Array.prototype.slice,
        space = /\s+/;

    msls_addOrRemoveClass =
    function addOrRemoveCssClass(jQueryElement, condition, trueClassNames, falseClassNames) {
        var addClasses,
            removeClasses,
            i, l,
            element, className,
            stringLength, changed,
            c, cl;

        if (condition) {
            addClasses = trueClassNames.split(space);
            removeClasses = falseClassNames ? falseClassNames.split(space) : null;
        } else {
            removeClasses = trueClassNames.split(space);
            addClasses = falseClassNames ? falseClassNames.split(space) : null;
        }

        for (i = 0, l = jQueryElement.length; i < l; i++) {
            element = jQueryElement[i];

            if (element.nodeType === 1) {
                className = element.className;
                if (!className && !!addClasses && addClasses.length === 1) {
                    element.className = addClasses[0];
                } else {
                    changed = false;
                    className = (" " + className + " ").replace(space, " ");

                    if (addClasses) {
                        for (c = 0, cl = addClasses.length; c < cl; c++) {
                            if (className.indexOf(" " + addClasses[c] + " ") < 0) {
                                className += addClasses[c] + " ";
                                changed = true;
                            }
                        }
                    }
                    if (removeClasses) {
                        stringLength = className.length;
                        for (c = 0, cl = removeClasses.length; c < cl; c++) {
                            className = className.replace(" " + removeClasses[c] + " ", " ");
                        }
                        if (className.length < stringLength) {
                            changed = true;
                        }
                    }
                    if (changed) {
                        element.className = $.trim(className);
                    }
                }
            }
        }
    };

    msls_addClasses =
    function addClasses($element) {
        $element.addClass(arraySlice.call(arguments, 1).join(" "));
    };

    msls_removeClasses =
    function addClasses($element) {
        $element.removeClass(arraySlice.call(arguments, 1).join(" "));
    };


    function ObservableCssClass(elementOrJquery, trueClassName, falseClassName) {


        this._element = elementOrJquery;
        this._trueClassName = trueClassName;
        this._falseClassName = falseClassName;
    }

    msls_defineClass("ui.helpers", "ObservableCssClass", ObservableCssClass, null, {
        value: msls_observableProperty(null, function value_get() {

            function helper_isConsistentState(actualState, expectedState) {
                return (actualState === null) || actualState === expectedState;
            }

            var jQueryElement = $(this._element),
                hasTrueClass = !!this._trueClassName && jQueryElement.hasClass(this._trueClassName),
                hasFalseClass = !!this._falseClassName && jQueryElement.hasClass(this._falseClassName);


            if (helper_isConsistentState(hasTrueClass, true) && helper_isConsistentState(hasFalseClass, false)) {
                return true;
            } else if (helper_isConsistentState(hasTrueClass, false) && helper_isConsistentState(hasFalseClass, true)) {
                return false;
            }

            return null;

        }, function value_set(value) {
            var jQueryElement = $(this._element);

            if (this._trueClassName) {
                msls_addOrRemoveClass(jQueryElement, value, this._trueClassName);
            }

            if (this._falseClassName) {
                msls_addOrRemoveClass(jQueryElement, !value, this._falseClassName);
            }
        })
    });


    msls_defineClass("ui.helpers", "ObservableVisibility", function ObservableVisibility(elementOrJquery) {

        ObservableCssClass.call(this, elementOrJquery, null, "msls-collapsed");
    }, ObservableCssClass, {});

}());

var msls_updateLayout,
    msls_updateLayoutImmediately,
    msls_suspendLayout,
    msls_resumeLayout,
    msls_layout_updatingNotification = "LayoutUpdating",
    msls_layout_updatedNotification = "LayoutUpdated";

(function () {

    function updateLayout($rootNodes, isolated) {
    }

    msls_updateLayout = updateLayout;

    msls_suspendLayout = function suspendLayout() {
    };

    msls_resumeLayout = function resumeLayout(queueUpdate) {

    };

}());

var
    msls_ui_Control,
    msls_getTemplateItemPath,
    msls_getTemplateItem,
    msls_control_find,
    msls_controlProperty,
    msls_bind_clickEvent;

(function () {

    var _lastDispatcherId = 0,
        clickActionExecutedNotification = "clickActionExecuted";


    function defineControlPropertyOn(target, propertyName) {
        var targetClass = target.constructor,
            descriptor = this, mixContent = {},
            underlyingPropertyName,
            onChanged = descriptor.onChanged,
            needPropertyEvents = descriptor.needPropertyEvents,
            contentItemProperty = descriptor.contentItemProperty;

        if (needPropertyEvents) {
            msls_makeObservable(targetClass);
            mixContent[propertyName + "_" + msls_changeEventType] = msls_event(true);
        }

        underlyingPropertyName = "__" + propertyName;
        if (descriptor.initialValue !== undefined) {
            mixContent[underlyingPropertyName] = {
                enumerable: !msls_isLibrary,
                value: descriptor.initialValue
            };
        }
        mixContent[propertyName] = msls_accessorProperty(
            function controlProperty_get() {
                return this[underlyingPropertyName];
            },
            function controlProperty_set(value) {
                if (this[underlyingPropertyName] !== value) {
                    msls_setProperty(this, underlyingPropertyName, value);
                    if (onChanged) {
                        onChanged.call(this, value);
                    }
                    if (needPropertyEvents) {
                        var me =  this;
                        me.dispatchChange(propertyName);
                    }
                }
            }
        );

        msls_mixIntoExistingClass(targetClass, mixContent);
    }

    msls_controlProperty =
    function controlProperty(onChanged, initialValue, needPropertyEvents) {
        return {
            onChanged: onChanged,
            initialValue: initialValue,
            needPropertyEvents: needPropertyEvents,
            defineOn: defineControlPropertyOn
        };
    };


    function Control(view) {

        var me = this;


        me.children = [];

        if (!view || !view.length) {
            me._view = $("<div />");
        }

        me._view = view;

        msls_dispatch(function () {
            if (!me.isRendered) {
                me.render();
            }
        });
    }

    function _registerTapAction() {

        var me = this,
            uiElement = me._tapElement;

        if (me._isViewCreated && !!me.tap) {

            if (!uiElement) {
                uiElement = me.getView();
            }

            msls_bind_clickEvent(uiElement, me, "tap", "ButtonClickPromise");

            uiElement.addClass("msls-tap");
        }
    }

    function _onDispose() {
        var me = this,
            children = me.children,
            child,
            i, len;

        me.children = null;
        for (i = 0, len = children.length; i < len; i++) {
            child = children[i];
            child._parent = null;
            msls_dispose(child);
        }

        me.parent = null;

        me.__tap = null;
        me.__data = null;

    }

    function getView() {

        return this._view;
    }

    function attachView(templateData) {
        if (!this._isViewCreated) {
            this._isViewCreated = true;
            this._attachViewCore(templateData);
            this.isRendered = true;
        }
    }

    function render() {

        if (!this._isViewCreated) {
            var constructor = this.constructor,
                templateData = {},
                fillTemplate = constructor._fillTemplate;

            if (fillTemplate) {
                fillTemplate(this.getView(), this.data, templateData);
            }

            this.attachView(templateData);
        }
    }

    function _fillTemplate(view, contentItem, templateData) {
    }

    function _attachViewCore(templateData) {


        this._registerTapAction();
    }


    msls_defineClass("ui", "Control", Control, null, {
        controlName: "Undefined",
        data: msls_controlProperty(
            function onDataChanged(value) {
                if (this._onDataChanged) {
                    this._onDataChanged(value);
                }
            }, null),

        isRendered: msls_observableProperty(false),
  
        tap: msls_controlProperty(
            function onTapChanged(value) {
                if (this._isViewCreated) {
                    this._registerTapAction();
                }
            }),
        parent: msls_accessorProperty(
            function parent_get() {
                return this._parent;
            },
            function parent_set(value) {

                var index;

                if (this._parent !== value) {
                    if (!!this._parent && !!this._parent.children) {
                        index = this._parent.children.indexOf(this);
                        if (index >= 0) {
                            this._parent.children.splice(index, 1);
                        }
                    }
                    this._parent = value;
                    if (!!value) {
                        this._parent.children.push(this);
                    }
                }
            }
        ),
        _onDispose: _onDispose,
        getView: getView,
        attachView: attachView,
        render: render,
        _attachViewCore: _attachViewCore,
        _registerTapAction: _registerTapAction
    }, {
        _fillTemplate: _fillTemplate
    });

    msls_ui_Control = msls.ui.Control;
    msls_ui_Control.prototype._propertyMappings = {
    };
    msls_ui_Control.prototype._editableProperties = {
    };


    msls_getTemplateItemPath =
    function getTemplateItemPath(parentView, item) {

        var rootNode = parentView[0],
            itemNode = item[0],
            items = [],
            path = [],
            index;

        while (itemNode !== rootNode && !!itemNode) {
            items.push(itemNode);
            itemNode = itemNode.parentNode;
        }

        if (!!itemNode) {
            while (items.length > 0) {
                itemNode = items.pop();
                rootNode = rootNode.firstChild;
                index = 0;
                while (rootNode !== itemNode) {
                    rootNode = rootNode.nextSibling;
                    index++;
                }
                path.push(index);
            }
        }
        return path;
    };

    msls_getTemplateItem =
    function getTemplateItem(node, templateItemPath, fallbackSelector) {
        if (!templateItemPath || !templateItemPath.length) {
            if (templateItemPath === undefined && !!fallbackSelector) {
                return msls_control_find(node, fallbackSelector);
            }
            return node;
        }

        var len = templateItemPath.length,
            i,
            index,
            currentNode = node[0];

        for (i = 0; i < len && !!currentNode; i++) {
            index = templateItemPath[i];
            currentNode = currentNode.firstChild;
            while (index > 0 && !!currentNode) {
                currentNode = currentNode.nextSibling;
                index--;
            }
        }

        return $(currentNode);
    };

    msls_control_find =
    function findIncludingSelf(node, selector) {
        return node.is(selector) ? node : node.find(selector);
    };

    var excludedTagNames = { a: null, input: null, textarea: null };

    msls_bind_clickEvent = function (uiElement, control, actionPropertyName, notificationType, filter) {
        uiElement.unbind("click").bind("click", function (e) {

            var action = control[actionPropertyName];
            if (!!action && action.canExecute) {
                var target = e.target,
                    targetTag = target.tagName.toLowerCase();

                if ((!filter || filter(e)) && (!(targetTag in excludedTagNames) || (targetTag === "a" && !target.href))) {

                    var data = control.data,
                        disabled = data.isEnabled === false;

                    if (!disabled) {
                        control.getView().addClass(msls_executing);

                        msls_notify(notificationType,
                            action.execute()._thenEx(
                                function (error, result) {
                                    msls_notify(clickActionExecutedNotification, {
                                        control: control,
                                        result: result,
                                        error: error
                                    });
                                    if (!!error) {
                                        msls_modal_showError(error);
                                    }

                                    control.getView().removeClass(msls_executing);
                                }
                            )
                        );
                    }
                }
                e.stopPropagation();
            }
        });
    };

    msls_defineEnum("ui", {
        Orientation: {
            horizontal: "horizontal",
            vertical: "vertical"
        }
    });

}());

(function () {

    var control_attachViewCore = msls.ui.Control.prototype._attachViewCore,
        _Orientation = msls.ui.Orientation,
        _Button;


    (function () {
        function Text(view) {

            var me = this;
            msls_ui_Control.call(me, view);
        }

        function _refreshView(notify) {
            if (this._isViewCreated) {
                this._textElement.text(this.text);
                if (notify) {
                    this._textElement.trigger("updatelayout");
                }
            }
        }

        function _fillTemplate(view, contentItem, templateData) {

            $('<div class="msls-text-container"><span class="id-element msls-text"></span></div>').appendTo(view);
            templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
        }

        function _attachViewCore(templateData) {
            control_attachViewCore.call(this, templateData);
            this._textElement = msls_getTemplateItem(this.getView(), templateData.idElement, ".id-element");
            this._refreshView();
        }

        msls_defineClass("ui.controls", "Text", Text, msls_ui_Control, {
            controlName: "Text",
            text: msls_controlProperty(
                function onTextChanged(value) {
                    this._refreshView(true);
                }, null, true),

            _attachViewCore: _attachViewCore,
            _refreshView: _refreshView
        }, {
            _fillTemplate: _fillTemplate
        });

        msls.ui.controls.Text.prototype._propertyMappings = {
            stringValue: "text",
            properties: {
                tap: "tap"
            }
        };

    }());


    (function () {
        function TextBox(view) {

            var me = this;
            msls_ui_Control.call(me, view);
            me._updatingText = false;
        }

        function _fillTemplate(view, contentItem, templateData) {

            $('<input type="text" class="id-element"></input>').appendTo(view)
                .parent().addClass("msls-textBox-container");
            templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
        }

        function _attachViewCore(templateData) {
            var me = this;

            me._textElement = msls_getTemplateItem(me.getView(), templateData.idElement, ".id-element");

            control_attachViewCore.call(me, templateData);

            me._textElement.change(function () {
                me._updatingText = true;
                me.text = me._textElement.val();
                me._updatingText = false;
            });
            me._refreshView();
        }

        function _refreshView() {
            if (!this._isViewCreated) {
                return;
            }

            if (!this._updatingText || this._textElement.val() !== this.text) {
                this._textElement.val(this.text);
            }

            _setMaxLength(this);
        }

        function _setMaxLength(me) {
            if (me._isViewCreated) {
                if (me.maxLength) {
                    me._textElement.attr("maxlength", me.maxLength.toString());
                } else {
                    if (me._textElement.attr("maxlength")) {
                        me._textElement.removeAttr("maxlength");
                    }
                }
            }
        }

        var textBox = msls_defineClass("ui.controls", "TextBox", TextBox, msls_ui_Control, {
            controlName: "TextBox",
            text: msls_controlProperty(
                function onTextChanged(value) {
                    this._refreshView();
                },
                null, true),
            maxLength: msls_controlProperty(
                function onMaxLengthChanged(value) {
                    _setMaxLength(this);
                }),

            _attachViewCore: _attachViewCore,
            _refreshView: _refreshView
        }, {
            _fillTemplate: _fillTemplate
        });

        textBox.prototype._propertyMappings = {
            stringValue: "text",
            maxLength: "maxLength"
        };

        textBox.prototype._editableProperties = {
            text: "stringValue"
        };
    }());


    (function () {
        var _BaseClass = msls.ui.controls.TextBox;

        function TextArea(view) {
            _BaseClass.call(this, view);
        }

        function _fillTemplate(view, contentItem, templateData) {
            $('<textarea class="id-element msls-vclip" ></textarea>').appendTo(view);
            templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
        }

        function _refreshView() {
            var textElement = this._textElement;

            _BaseClass.prototype._refreshView.call(this);

            if (this._isViewCreated) {
                msls_addAutoDisposeNotificationListener(msls_layout_updatingNotification, this, function () {
                    textElement.keyup();
                });
            }
        }

        msls_defineClass("ui.controls", "TextArea", TextArea, _BaseClass, {
            controlName: "TextArea",
            _refreshView: _refreshView,
            _onDispose:  function _onDispose() {
                this._textElement.remove();
            }
        }, {
            _fillTemplate: _fillTemplate
        });

        msls.ui.controls.TextArea.prototype._propertyMappings = {
            stringValue: "text"
        };
    }());


    (function () {

        function Button(view) {

            msls_ui_Control.call(this, view);
        }

        function _fillTemplate(view, contentItem, templateData) {
            var element = $('<a class="id-element" data-role="button" data-theme="' + cssDefaultJqmTheme + '"/>').appendTo(view);
            templateData.idElement = msls_getTemplateItemPath(view, element);
        }

        function _attachViewCore(templateData) {
            var view = this.getView();
            this._element = msls_getTemplateItem(view, templateData.idElement, ".id-element");

            control_attachViewCore.call(this, templateData);

            this._refreshView();
        }

        function _refreshView() {
            var me = this;

            if (!me._isViewCreated) {
                return;
            }


            me._element.text(me.content);

            if (me._element.data("button")) {
                me._element.trigger("refresh");
            }

            me._initialized = true;
        }

        function _customVisualStateHandler(e) {

            var element = this._element;
            if (element && element.hasClass(ui_disabled)) {
                element.removeClass("ui-btn-hover-a");
            }
        }

        msls_defineClass("ui.controls", "Button", Button, msls_ui_Control, {
            controlName: "Button",
            content: msls_controlProperty(
                function onContentChanged(value) {
                    this._refreshView();
                }),
            _attachViewCore: _attachViewCore,
            _refreshView: _refreshView,
            _customVisualStateHandler: _customVisualStateHandler
        }, {
            _fillTemplate: _fillTemplate
        });

        msls.ui.controls.Button.prototype._propertyMappings = {
            displayName: "content",
            properties: {
                tap: "tap",
                hiddenIfDisabled: "hiddenIfDisabled"
            }
        };

    }());
    _Button = msls.ui.controls.Button;



    (function () {

        function ShellButton(view) {

            _Button.call(this, view);
        }

        function _refreshView() {
            _Button.prototype._refreshView.call(this);
            if (this._isViewCreated) {
                msls_addOrRemoveClass(this._element.closest(".subControl"), !this.isEnabled, ui_disabled);
            }
        }

        msls_defineClass("ui.controls", "ShellButton", ShellButton, _Button, {
            controlName: "ShellButton",
            _refreshView: _refreshView,

            isEnabled: msls_controlProperty(
                function onEnabledChanged(value) {
                    this._refreshView();
                }, false),

            tap: msls_observableProperty()
        }, {
            _fillTemplate: _Button._fillTemplate
        })
        .prototype._propertyMappings = {
            displayName: "content"
        };

    }());


    (function () {

        function Dropdown(view) {

            var me = this;

            msls_ui_Control.call(me, view);
            me._updatingDropdown = false;
        }

        function _refreshView() {
            if (!this._updatingDropdown && this._isViewCreated) {
                _populateOptions(this);
                _updateSelection(this);
            }
        }

        function _populateOptions(me) {

            var dropdownElement = me._dropdownElement,
                option;

            if (!me._updatingDropdown && me._isViewCreated) {
                if (me.choiceList) {
                    dropdownElement.empty();
                    $.each(me.choiceList, function () {
                        option = $("<option></option>");
                        option.attr("value", this.stringValue);
                        option.text(this.stringValue);

                        dropdownElement.append(option);
                    });
                }
            }
        }

        function _updateSelection(me) {

            var dropdownElement = me._dropdownElement,
                option,
                sValue,
                invalidValue = true;

            if (!me._updatingDropdown && me._isViewCreated) {
                sValue = me.selectedValue;
                if (sValue === null) {
                    sValue = "";
                }

                $.each(me.choiceList, function () {
                    if (this.stringValue === sValue) {
                        invalidValue = false;
                    }
                    return invalidValue;
                });

                if (invalidValue) {
                    option = $('<option disabled="disabled"></option>');
                    option.attr("value", sValue);
                    option.text(sValue);

                    dropdownElement.append(option);
                }

                try {
                    me._updatingDropdown = true;
                    me._dropdownElement.val(sValue);
                    me._dropdownElement.change();
                }
                finally {
                    me._updatingDropdown = false;
                }
            }
        }

        function _fillTemplate(view, contentItem, templateData) {
            var dropdownElement = $('<select class="id-element" />').appendTo(view);
            templateData.idElement = msls_getTemplateItemPath(view, dropdownElement);
        }

        function _attachViewCore(templateData) {
            var me = this,
                value;

            me._dropdownElement = msls_getTemplateItem(me.getView(), templateData.idElement, ".id-element");

            control_attachViewCore.call(me);

            me._dropdownElement.change(
                function (e) {
                    if (!me._updatingDropdown) {
                        value = me._dropdownElement.val();
                        if (value === "") {
                            value = null;
                        }
                        try {
                            me._updatingDropdown = true;
                            me.selectedValue = value;
                        }
                        finally {
                            me._updatingDropdown = false;
                        }
                    }
                }
            );
            me._refreshView();
        }

        function _customVisualStateHandler(e) {

            if (e.state === msls_VisualState.disabled || e.state === msls_VisualState.readOnly) {
                var element = this._dropdownElement;
                if (this._isViewCreated && !!element) {
                    if (element.data("selectmenu")) {
                        element.selectmenu(e.activate ? "disable" : "enable");
                    } else {
                        if (e.activate) {
                            this._dropdownElement.attr("disabled", "disabled");
                        } else {
                            this._dropdownElement.attr("disabled", "");
                        }
                    }
                }

                e.custom = true;
            }
        }

        var dropdown = msls_defineClass("ui.controls", "Dropdown", Dropdown, msls_ui_Control, {
            controlName: "Dropdown",
            selectedValue: msls_controlProperty(
                function onChoiceListChanged(value) {
                    _updateSelection(this);
                },
                null, true),
            choiceList: msls_controlProperty(
                function onChoiceListChanged(value) {
                    _populateOptions(this);
                }),

            _attachViewCore: _attachViewCore,
            _refreshView: _refreshView,
            _customVisualStateHandler: _customVisualStateHandler
        }, {
            _fillTemplate: _fillTemplate
        });

        dropdown.prototype._propertyMappings = {
            stringValue: "selectedValue",
            choiceList: "choiceList"
        };

        dropdown.prototype._editableProperties = {
            selectedValue: "stringValue"
        };
    }());


    (function () {

        var _BaseClass = msls.ui.controls.Text;

        function Paragraph(view) {

            var me = this;
            _BaseClass.call(me, view);
        }

        function _fillTemplate(view, contentItem, templateData) {

            $('<div class="msls-text-container ' + (contentItem.heightSizingMode !== msls_HeightSizingMode.fitToContent ? "msls-vstretch " : "") + '"><p class="id-element msls-text msls-multiline"></p></div>').appendTo(view);
            templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
        }

        function _refreshView(notify) {
            var me = this,
                contentItem = me.data;

            _BaseClass.prototype._refreshView.call(me, notify);

            if (this._isViewCreated) {
                if (contentItem.heightSizingMode !== msls_HeightSizingMode.fitToContent) {
                    msls_addAutoDisposeNotificationListener(msls_layout_updatedNotification, me, function () {
                        me._makeEllipsis();
                    });
                }
            }
        }

        function _makeEllipsis() {
            var text = this.text,
                textElement = this._textElement,
                containerHeight,
                diff,
                lastMid = 0,
                textLength,
                start = 0, end, mid, croppedText, indexOfLastSpace;

            if (!text) {
                return;
            }

            containerHeight = textElement.parent().height();
            textLength = text.length;
            end = textLength - 1;
            diff = containerHeight - textElement.height();
            if (diff < 0) {
                while (start < end) {
                    mid = Math.floor((start + end) / 2);
                    textElement.text(text.substr(0, mid + 1) + "...");
                    diff = containerHeight - textElement.height();

                    if (diff < 0) {
                        end = mid - 1;
                    } else if (diff >= 0) {
                        start = mid + 1;
                        lastMid = mid;
                    }
                }
                croppedText = text.substr(0, lastMid + 1);
                indexOfLastSpace = croppedText.lastIndexOf(" ");
                croppedText = indexOfLastSpace !== -1 ? croppedText.substr(0, indexOfLastSpace) : croppedText;
                textElement.text(croppedText + "...");
            }
        }

        var paragraph = msls_defineClass("ui.controls", "Paragraph", Paragraph, _BaseClass, {
            controlName: "Paragraph",
            lines: msls_observableProperty(),
            _refreshView: _refreshView,
            _makeEllipsis: _makeEllipsis
        }, {
            _fillTemplate: _fillTemplate
        });

        paragraph.prototype._propertyMappings = {
            stringValue: "text",
            properties: { tap: "tap" }
        };

    }());


    (function () {

        function CustomControl(view) {

            msls_ui_Control.call(this, view);
        }

        function _attachViewCore(templateData) {

            control_attachViewCore.call(this);

            var contentItem = this.data;
            if (contentItem) {
                var screenClass = contentItem.screen.constructor,
                    renderMethod = screenClass[contentItem.name + "_render"],
                    $view = this.getView();
                if (!!renderMethod && $.isFunction(renderMethod)) {
                    try {
                        renderMethod.call(null, $view[0], contentItem);
                    } catch (ex) {
                        contentItem.displayError = msls_getResourceString("customControl_renderError_2args", contentItem.name, ex);
                    }
                } else {
                    contentItem.displayError = msls_getResourceString("customControl_noRender_1args", contentItem.name);
                }
            }
        }

        function _customVisualStateHandler(e) {

            var custom = "Custom",
                isCustom = (e.state === msls_VisualState.disabled && this.disabledRendering === custom) ||
                    (e.state === msls_VisualState.readOnly && this.readOnlyRendering === custom) ||
                    (e.state === msls_VisualState.hasValidationError && this.validationRendering === custom);

            if (isCustom) {
                e.custom = true;
            }
        }

        msls_defineClass("ui.controls", "CustomControl", CustomControl, msls_ui_Control, {
            controlName: "CustomControl",
            _customVisualStateHandler: _customVisualStateHandler,
            _attachViewCore: _attachViewCore
        })
        .prototype._propertyMappings = {
            stringValue: "displayName",
            properties: { tap: "tap" }
        };

    }());

}());

(function () {
    var control_attachViewCore = msls_ui_Control.prototype._attachViewCore;

    function ContentControl(view) {
        var me = this;
        me._subControls = {};
        me._resources = {};
        me.dataTemplate = $("<div/>");

        msls_ui_Control.call(me, view);
    }

    function _onDataChanged(value) {
        this._refreshView();
    }

    function _attachViewCore(templateData) {
        control_attachViewCore.call(this, templateData);
        this._refreshView();
        this._dataTemplateLoaded = true;
    }

    function _refreshView() {
        var me = this,
            dataTemplate,
            template,
            bindings = [];

        if (!me._isViewCreated) {
            return;
        }

        template = $(me.dataTemplate.html()).appendTo(me.getView());
        parseTemplate(me, template, me._subControls, bindings, me._resources);
    }

    msls_defineClass("ui.controls", "ContentControl", ContentControl, msls_ui_Control, {
        controlName: "ContentControl",
        dataTemplate: msls_observableProperty(),

        _dataTemplateLoaded: msls_observableProperty(false),

        _attachViewCore: _attachViewCore,
        _refreshView: _refreshView,

        _onDataChanged: _onDataChanged
    }, {
        _fillTemplate: msls_ui_Control._fillTemplate
    });

    function parseTemplate(owner, template, subControls, bindings, resources) {

        var index,
            item,
            root,
            resourceElements,
            typeName,
            resourceName,
            _TypeConstructor,
            resource,
            subControlElements,
            controlName,
            _ControlClass,
            i,
            subControl,
            controlIdentifierName,
            binding,
            controlBindings,
            dataContextBinding;

        resourceElements = template.children(".resource");

        for (index = 0; index < resourceElements.length; index++) {
            item = resourceElements[index];
            root = $(item);

            typeName = root.attr("type");
            resourceName = root.attr("name");
            _TypeConstructor = resolvePropertyPath(typeName);

            if (!!_TypeConstructor && $.isFunction(_TypeConstructor)) {
                resource = new _TypeConstructor();

                parseAttributes(resources, item, bindings, resource, false);
            }
            resources[resourceName] = resource;
        }
        $.each(bindings, function () {
            this.bind();
        });
        resourceElements.remove();

        subControlElements = template.find(".subControl");

        function addBinding(j, b) {
            b.bind();
            bindings.push(b);
        }

        for (index = 0; index < subControlElements.length; index++) {
            item = subControlElements[index];
            root = $(item);

            controlName = root.attr("control");
            _ControlClass = msls.ui.controls[controlName];

            if (!_ControlClass) {
                _ControlClass = resolvePropertyPath(controlName);
            }

            if (!!_ControlClass && $.isFunction(_ControlClass)) {

                subControl = new _ControlClass(root);
                subControl.parent = owner;

                controlIdentifierName = root.attr("name");
                if (!controlIdentifierName) {
                    controlIdentifierName = index.toString();
                }

                controlBindings = [];
                parseAttributes(resources, item, controlBindings, subControl, false);

                dataContextBinding = msls_iterate(controlBindings).first(function (b) {
                    return b.targetProperty === "data" && b.bindingTarget === subControl;
                });
                if (!dataContextBinding) {
                    dataContextBinding = setControlProperty(resources, subControl, "data:{data, bindingMode=[msls.data.DataBindingMode.oneWayFromSource]}");
                }

                if (dataContextBinding) {
                    dataContextBinding.bindingSource = owner;
                    dataContextBinding.bind();
                    controlBindings.push(dataContextBinding);
                } else {
                }

                subControls[controlIdentifierName] = subControl;
                root.removeAttr("control");
                if (root.attr("name")) {
                    root.removeAttr("name");
                }

                $.each(controlBindings, addBinding);

                subControl.render();
            } else {
            }

        }
    }

    function parseAttributes(resources, item, bindings, target, removeAttributes) {

        var attr,
            i,
            binding,
            isHtmlAttr,
            isBuiltInAttr,
            attributesToRemove = [];

        for (i = 0; i < item.attributes.length; i++) {
            attr = item.attributes[i];

            if (attr.name.indexOf("data-ls-") === 0) {
                binding = setControlProperty(resources, target, attr.value);
                if (binding) {
                    bindings.push(binding);
                }

                if (removeAttributes) {
                    attributesToRemove.push(attr.name);
                }
            }
        }

        for (i = 0; i < attributesToRemove.length; i++) {
            item.removeAttribute(attributesToRemove[i]);
        }
    }

    function setControlProperty(resources, subControl, propertyValueRaw) {

        var i,
            items,
            propertyNameRe = /^([a-zA-Z_0-9]+):(\S+)$/,
            bindingRe = /^\{(\S*)\}$/,
            bindingPath,
            match,
            binding,
            bindingOptions = [],
            splitItems,
            propertyName,
            propertyValue,
            bindingOption;

        propertyValue = propertyValueRaw.replace(/\s/, "");

        match = propertyNameRe.exec(propertyValue);
        if (match) {
            propertyName = match[1];
            propertyValue = match[2];
        } else {
        }

        match = bindingRe.exec(propertyValue);
        if (match) {
            items = match[1].split(",");
            bindingPath = items[0];
            for (i = 1; i < items.length; i++) {
                splitItems = items[i].split("=");
                bindingOptions.push({ option: splitItems[0], value: splitItems[1] });
            }
        }

        if (!bindingPath) {
            subControl[propertyName] = loadValue(resources, propertyValue);
        } else {
            binding = new msls.data.DataBinding(bindingPath, subControl, propertyName, subControl);
            for (i = 0; i < bindingOptions.length; i++) {
                bindingOption = bindingOptions[i];
                binding[bindingOption.option] = loadValue(resources, bindingOption.value);
            }
            return binding;
        }
        return null;
    }

    var resourcePrefix = "resource:";
    function loadValue(resources, value) {

        var resourceName,
            valueRex = /^\[(\S*)\]$/,
            valueMatch = valueRex.exec(value);

        if (valueMatch) {
            value = valueMatch[1];
            if (value.indexOf(resourcePrefix) === 0) {
                resourceName = value.substr(resourcePrefix.length);
                return resources[resourceName];
            } else if (value.indexOf("#") === 0) {
                return $(value);
            } else {
                return resolvePropertyPath(value);
            }
        }

        return value;
    }


    function resolvePropertyPath(propertyPath) {

        if (!propertyPath) {
            return null;
        }

        var i,
            item,
            components = propertyPath.split("."),
            current = window;

        for (i = 0; i < components.length; i++) {

            item = components[i];

            if (i === 0 && item === "msls") {
                current = msls;
            } else {
                current = current[item];
            }

            if (!current) {
                break;
            }
        }
        return current;
    }

}());

var msls_getAttachedLabelPosition,
    msls_createPresenterTemplate,
    msls_layoutControlMappings = {},
    msls_controlMappings = {};

(function () {

    var previousDataName = "msls-previous-",
        tabIndex = "tabIndex",
        disabledAttribute = "disabled",
        readOnlyAttribute = "readonly";


    function ContentItemPresenter(view) {


        var me = this;
        me._currentVisualState = msls_VisualState.normal;
        msls_ui_Control.call(me, view);
    }

    msls_createPresenterTemplate =
    function _fillTemplate(view, contentItem, templateData) {
        var controlContainer,
            controlId,
            controlClass,
            fillTemplate;

        view.addClass("msls-presenter" + (contentItem._isUnderList ? " msls-list-child" : ""));

        controlContainer = _addAttachedLabel(view, contentItem, templateData);

        _addControlClasses(view, contentItem, controlContainer);

        controlId = getControlId(contentItem);
        if (!!controlId) {
            controlClass = msls_controlMappings[controlId];
            if ($.isFunction(controlClass)) {
                fillTemplate = controlClass._fillTemplate;
                if (!!fillTemplate) {
                    fillTemplate(controlContainer, contentItem, templateData.control = {});
                }
            }
        }
    };

    function _attachViewCore(templateData) {
        var me = this,
            contentItem = me.data;
        me._container = me.getView();

        me._contentContainer = msls_getTemplateItem(me._container, templateData.contentPath);
        me.isVisible = contentItem.isVisible;

        _loadControl(me, templateData.control);
        msls_ui_Control.prototype._attachViewCore.call(me, templateData);

        _updateVisualState(this);
    }

    function _onDispose() {
        var contentItem = this.data;
        if (!!contentItem) {
            contentItem._view = null;
        }
    }

    function _onDataChanged(value) {
        var me = this,
            contentItem = value;

        if (me._contentItemEventHandler) {
            msls_dispose(me._contentItemEventHandler);
            me._contentItemEventHandler = null;
        }
        if (!!contentItem) {
            contentItem._view = me;

            if (contentItem.addEventListener) {
                me._contentItemEventHandler = msls_addAutoDisposeEventListener(contentItem, "change", me,
                    function onContentPropertyChanged(e) {
                        var propertyName = e.detail,
                            control,
                            mapping,
                            editableProperties,
                            targetProperty;

                        var propertiesThatAffectVisualState = ["_visualState", "validationResults", "displayError"];
                        if (propertiesThatAffectVisualState.indexOf(propertyName) >= 0) {
                            if (!me._updateVisualStateRequested) {
                                me._updateVisualStateRequested = true;
                                setTimeout(function () {
                                    me._updateVisualStateRequested = false;
                                    _updateVisualState(me);
                                }, 1);
                            }
                        }

                        control = me.underlyingControl;
                        if (!!control) {
                            mapping = control._propertyMappings;
                            if (!!mapping) {
                                editableProperties = control._editableProperties || {};
                                targetProperty = control._propertyMappings[propertyName];
                                if (!!targetProperty && typeof targetProperty === "string" && !(targetProperty in editableProperties)) {
                                    control[targetProperty] = contentItem[propertyName];
                                }
                            }
                        }
                    });
            }
        }
        _refreshView(me);
    }


    function _refreshView(me) {

        if (!me._isViewCreated) {
            return;
        }

        if (!me._container) {
            return;
        }

        if (!me.data) {
            return;
        }

        me._isViewCreated = false;
        me.getView().empty();

        me.render();
    }

    function getControlId(contentItem) {
        var controlModel = contentItem.controlModel;

        if (!!controlModel) {
            return msls_getProgrammaticName(controlModel.id.replace(/\S*:/, ""));
        }
        return builtInModule.controlNoViewName;
    }

    function _loadControl(me, templateData) {

        var contentItem = me.data,
            controlId = getControlId(contentItem),
            controlCreator,
            control;

        if (!!controlId) {
            controlCreator = msls_layoutControlMappings[controlId];
            if ($.isFunction(controlCreator)) {
                control = controlCreator(me._contentContainer, contentItem, templateData);

                if (!!control && $.isFunction(control.render)) {
                    control.parent = me;
                    me.underlyingControl = control;
                }
            } else {
            }
        }
    }

    function _addAttachedLabel(view, contentItem, templateData) {

        var bindings = [],
            labelPosition = msls_getAttachedLabelPosition(contentItem),
            isAuto = labelPosition === msls_AttachedLabelPosition.auto,
            isNone = labelPosition === msls_AttachedLabelPosition.none,
            isTopAligned = labelPosition === msls_AttachedLabelPosition.topAligned,
            isLeftAligned = labelPosition === msls_AttachedLabelPosition.leftAligned,
            isRightAligned = labelPosition === msls_AttachedLabelPosition.rightAligned,
            isHidden = labelPosition === msls_AttachedLabelPosition.hidden,
            labelCol,
            contentCol;

        if (isNone) {
            return view;
        }

        labelCol = $("<div class='" + msls_attached_label + " msls-hauto" +
                (isTopAligned ? " msls-label-align-top msls-clear" : "") +
                (isLeftAligned ? " msls-label-align-left" : "") +
                (isRightAligned ? " msls-label-align-right" : "") +
                (isHidden ? " msls-label-align-none" : "") +
                (isAuto ? " msls-label-align-auto" : "") +
                "' />");
        contentCol = $('<div class="' +
                (contentItem._isVStretch ? "msls-vstretch" : "msls-vauto") +
                (isTopAligned ? " msls-clear" : "") +
                (contentItem._isHStretch ? (isTopAligned ? "" : " msls-hstretch") : " msls-hauto") + '" />');

        if (!isTopAligned) {
            view.addClass("msls-overflow-columns msls-columns-layout");
        }
        labelCol.appendTo(view);
        contentCol.appendTo(view);

        templateData.contentPath = msls_getTemplateItemPath(view, contentCol);

        if (isHidden) {
            $('<div style="height:1px"></div>').appendTo(labelCol);
        } else {
            $("<label class='msls-label-text'>" + contentItem.displayName + "</label>").appendTo(labelCol);
        }
        return contentCol;
    }

    function _addControlClasses(view, contentItem, contentContainer) {

        var contentProperties = contentItem.properties,
            minHeight = contentProperties[builtInModule.controlPropertyMinHeightId],
            maxHeight = contentProperties[builtInModule.controlPropertyMaxHeightId],
            minWidth = contentProperties[builtInModule.controlPropertyMinWidthId],
            maxWidth = contentProperties[builtInModule.controlPropertyMaxWidthId],
            isFixedHeight = contentItem.heightSizingMode === msls_HeightSizingMode.fixedSize,
            isFixedWidth = contentItem.widthSizingMode === msls_WidthSizingMode.fixedSize,
            height = contentProperties[builtInModule.controlPropertyHeightId],
            width = contentProperties[builtInModule.controlPropertyWidthId],
            fontStyle = contentProperties[builtInModule.controlPropertyFontStyleId],
            hAlignment = contentProperties[builtInModule.controlPropertyHorizontalAlignmentId],
            hScrollEnabled = contentItem._isHStretch,
            vScrollEnabled = contentItem._isVStretch,
            containerClasses = [],
            contentContainerClasses = [];

        contentContainerClasses.push(msls_presenter_content);
        if (contentItem._isUnderList) {
            contentContainerClasses.push("msls-list-child");
        }



        if (fontStyle) {
            containerClasses.push("msls-fontstyle-" + fontStyle.toLowerCase());
            containerClasses.push("msls-ctl-" + msls_getCssClassName(getControlId(contentItem)));
        }

        if (isFixedHeight) {
            contentContainer.height(height);
            contentContainerClasses.push("msls-fixed-height");
        } else {
            if (minHeight) {
                contentContainer.css("min-height", minHeight + "px");
            }
            if (maxHeight) {
                contentContainer.css("max-height", maxHeight + "px");
            }
        }

        if (isFixedWidth) {
            contentContainer.width(width);
            contentContainerClasses.push("msls-fixed-width");
        } else {
            if (minWidth) {
                contentContainer.css("min-width", minWidth + "px");
                view.css("min-width", minWidth + "px");
            }
            if (maxWidth) {
                contentContainer.css("max-width", maxWidth + "px");
            }
        }

        contentContainerClasses.push(contentItem._isVStretch ? "msls-vstretch" : "msls-vauto");
        contentContainerClasses.push(contentItem._isHStretch ? "msls-hstretch" : "msls-hauto");
        containerClasses.push(contentItem._isVStretch ? "msls-vstretch" : "msls-vauto");
        containerClasses.push(contentItem._isHStretch ? "msls-hstretch" : "msls-hauto");

        if (vScrollEnabled) {
            contentContainerClasses.push("msls-vscroll");
        }

        if (contentItem.kind === msls_ContentItemKind.value) {
            containerClasses.push("msls-redraw");
        }

        if (hScrollEnabled) {
            contentContainerClasses.push("msls-hscroll");
        }

        if (containerClasses.length > 0) {
            view.addClass(containerClasses.join(" "));
        }

        if (contentContainerClasses.length > 0) {
            contentContainer.addClass(contentContainerClasses.join(" "));
        }
    }

    msls_getAttachedLabelPosition =
    function getAttachedLabelPosition(contentItem) {

        var controlDefinition = contentItem.controlModel,
            labelPosition = contentItem.properties[builtInModule.controlPropertyAttachedLabelPositionId];

        if ((!!controlDefinition && controlDefinition.attachedLabelSupport === "DisplayedByControl") || !labelPosition) {
            labelPosition = msls_AttachedLabelPosition.none;
        }

        return labelPosition;
    };

    function updateAttachedLabels() {
        var rootNodes = $("body > div:not(.msls-layout-ignore)").filter(":visible"),
            labelHosts = $(".msls-label-host", rootNodes);

        $.each(labelHosts, function () {
            var maxWidth = 0,
                node = $(this),
                labels = [],
                width;

            if (!!node.data("msls-label-set") || !node.is(":visible")) {
                return;
            }

            node.children().each(function () {
                var labelContainer = $(this),
                    attachedLabel = labelContainer.children().first();

                if (attachedLabel.length === 1 && attachedLabel.hasClass(msls_attached_label) && !attachedLabel.hasClass("msls-label-align-top")) {
                    width = attachedLabel[0].offsetWidth;
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                    labels.push(attachedLabel[0]);
                }
            });
            if (maxWidth > 0) {
                $.each(labels, function () {
                    this.style.width = this.style.minWidth = maxWidth + "px";
                });
                node.data("msls-label-set", true);
            }
        });
    }

    msls_subscribe(msls_layout_updatingNotification, updateAttachedLabels);

    function render_external(element, contentItem) {
        /// <summary>
        /// Renders the visualization of a content item inside a root HTML element.
        /// </summary>
        /// <param name="element" type="HTMLElement">
        /// A root HTML element under which the
        /// the content item visual is rendered.
        /// </param>
        /// <param name="contentItem" type="msls.ContentItem">
        /// A content item that provides the view model for the visual elements.
        /// </param>
        if (!element) {
            throw msls_getResourceString("render_invalid_arg_element");
        }
        if (!contentItem) {
            throw msls_getResourceString("render_invalid_arg_contentItem");
        }
        var presenter = new msls.ui.controls.ContentItemPresenter($(element));
        presenter.data = contentItem;
        presenter.render();
    }

    msls_expose("render", render_external);



    function _unTrim(s) {
        return " " + s + " ";
    }

    function _addOrRemoveControlOverlay(me, add) {

        var $view = me.getView(),
            $overlayParent = me._contentContainer;


        var $overlay = $overlayParent.children().filter("." + msls_state_overlay);

        if ($overlay.length > 0) {
            if (add) {
                return $overlay;
            } else {
                $overlay.remove();
                return null;
            }
        } else {
            if (add) {
                $overlay = $("<div class='msls-state-overlay'></div>").appendTo($overlayParent);
                return $overlay;
            } else {
                return null;
            }
        }
    }

    function _mapNonNestedDescendents($root, filter) {

        var results = [],
            result;

        function helper_search(element) {
            result = filter(element);
            if (result) {
                results.push(result);
            }

            for (var i = 0, children = element.childNodes, len = children.length; i < len; i++) {
                var child = children[i];

                if (!_unTrim(child.className).match(/ msls-presenter /)) {
                    helper_search(child);
                }
            }
        }

        if ($root.length) {
            helper_search($root[0]);
        }

        return results;
    }

    function _findNonNestedDescendentsByTag($root, tags) {

        return _mapNonNestedDescendents($root, function (element) {
            var tagName = element.tagName;
            return tagName && tags.indexOf(tagName.toLowerCase()) >= 0 ? element : null;
        });
    }

    function _setUndoableAttribute($elements, attributeName, value) {

        function helper(element) {
            var currentValue = $.attr(element, attributeName);
            $.data(element, previousDataName + attributeName, currentValue);
            $.attr(element, attributeName, value);
        }

        if ($elements.length === 1) {
            helper($elements[0]);
        } else {
            for (var i = 0, len = $elements.length; i < len; i++) {
                helper($elements[i]);
            }
        }
    }

    function _resetUndoableAttribute($elements, attributeName) {

        function helper(element) {
            var previousName = previousDataName + attributeName,
                previousValue = $.data(element, previousName);
            if (previousValue === undefined) {
                element.removeAttribute(attributeName);
            } else {
                element.setAttribute(attributeName, previousValue);
            }

            $.removeData(element, previousName);
        }

        if ($elements.length === 1) {
            helper($elements[0]);
        } else {
            for (var i = 0, len = $elements.length; i < len; i++) {
                helper($elements[i]);
            }
        }
    }

    function _setOrResetUndoableAttribute($element, set, attributeName, value) {

        if (set) {
            _setUndoableAttribute($element, attributeName, value);
        } else {
            _resetUndoableAttribute($element, attributeName);
        }
    }

    function _isUsingCustomControl(me) {

        function helper_isCustomControl(controlModel) {
            if (controlModel.id === msls_builtIn_rootCustomControl) {
                return true;
            } else {
                var baseControl = controlModel.baseControl;
                return baseControl && helper_isCustomControl(baseControl);
            }
        }

        var contentItem = me.data;
        if (!contentItem) {
            return false;
        }

        return helper_isCustomControl(contentItem.controlModel);
    }

    function _isUsingGroupControl(me) {

        var contentItem = me.data;
        if (!contentItem) {
            return false;
        }

        var controlModel = contentItem.controlModel,
            result = msls_isGroupControl(controlModel);
        return result;
    }

    function _isUsingViewerControl(me) {

        var contentItem = me.data;
        if (!contentItem) {
            return false;
        }

        var controlModel = contentItem.controlModel;
        return controlModel.isViewer;
    }

    function _disableTabIndices($root, isDisabled) {

        var supportTabIndex = _findNonNestedDescendentsByTag($root, ["a", "area", "button", "input", "object", "select", "textarea"]);
        _setOrResetUndoableAttribute($(supportTabIndex), isDisabled, tabIndex, "-1");
    }

    function _disableControlUsingOverlay(me, isDisabled) {

        var $overlay = _addOrRemoveControlOverlay(me, isDisabled);
        _disableTabIndices(me.getView(), isDisabled);
        return $overlay;
    }


    function _updateHiddenState(me, e) {

        msls_addOrRemoveClass(me.getView(), e.activate, msls_collapsed);
        e.needsLayoutUpdate = true;
    }

    function _updateLoadingState(me, e) {

        var contentItem = me.data;
        if (contentItem.kind === msls_ContentItemKind.command) {
            return;
        }

        var isLoading = e.activate,
            $overlay = _addOrRemoveControlOverlay(me, isLoading);
        msls_addOrRemoveClass(me._contentContainer, isLoading, msls_loading);
    }

    function _updateValidationErrorState(me, e) {

        function transformValidationResults(validationResults) {

            var results = Array.prototype.slice.call(validationResults || [], 0),
                messages = results.map(function (result) {
                    return result.message;
                });
            return messages.join("<br/>");
        }

        if (e.custom) {
            return;
        }

        if (_isUsingViewerControl(me)) {
            return;
        }

        var contentItem = me.data,
            trackedProperty = contentItem.details;

        if (!contentItem._alwaysShowValidationResults &&
            !!trackedProperty && !trackedProperty.isEdited) {
            return;
        }

        var showValidationErrors = e.activate;

        var $messageParent = me._contentContainer;
        msls_addOrRemoveClass($messageParent, showValidationErrors, msls_validation_error);


        var $message = me._contentContainer.children().filter("." + msls_validation_error_text);

        if (showValidationErrors) {
            var message = transformValidationResults(contentItem.validationResults);


            if (!$message.length) {
                $message = $("<div class='" + msls_validation_error_text + "'></div>")
                    .appendTo($messageParent);
            }
            $message.append(message);
        } else {
            $message.remove();
        }

        e.needsLayoutUpdate = true;
    }

    function _updateDisabledState(me, e) {

        var contentItem = me.data,
            $view = me.getView(),
            isDisabled = e.activate;

        if (e.custom) {
            msls_addOrRemoveClass($view, isDisabled, ui_disabled);
            return;
        }

        if (_isUsingCustomControl(me)) {
            _disableControlUsingOverlay(me, isDisabled);
        } else {
            var elementsToDisable = _findNonNestedDescendentsByTag($view, ["button", "fieldset", "input", "optgroup", "option", "select", "textarea"]);
            _setOrResetUndoableAttribute($(elementsToDisable), isDisabled, disabledAttribute, disabledAttribute);
        }

        msls_addOrRemoveClass($view, isDisabled, ui_disabled);
    }

    function _updateReadOnlyState(me, e) {

        var $view = me.getView(),
            contentItem = me.data,
            kind = contentItem.kind,
            isReadOnly = e.activate;

        if (e.custom) {
            return;
        }

        switch (kind) {
            case msls_ContentItemKind.group:
            case msls_ContentItemKind.details:
            case msls_ContentItemKind.value:
                break;

            default:
                return;
        }

        if (_isUsingCustomControl(me)) {
            _disableControlUsingOverlay(me, isReadOnly);
        } else {

            if (_isUsingViewerControl(me) || _isUsingGroupControl(me)) {
                return;
            }

            if (kind === msls_ContentItemKind.value || kind === msls_ContentItemKind.details) {

                var $elementsToMakeReadOnly = $(_findNonNestedDescendentsByTag($view, ["input", "textarea"])),
                    $elementsToDisable = $(_findNonNestedDescendentsByTag($view, ["select", "option"]));

                _setOrResetUndoableAttribute($elementsToMakeReadOnly, isReadOnly, readOnlyAttribute, readOnlyAttribute);
                _setOrResetUndoableAttribute($elementsToDisable, isReadOnly, disabledAttribute, disabledAttribute);

                msls_addOrRemoveClass($elementsToMakeReadOnly, isReadOnly, msls_read_only);
                msls_addOrRemoveClass($elementsToDisable, isReadOnly, msls_read_only);
            }
        }

        msls_addOrRemoveClass(me._contentContainer, isReadOnly, msls_read_only);
    }

    function _updateDisplayErrorState(me, e) {


        var showDisplayError = e.activate,
            $overlay = _disableControlUsingOverlay(me, showDisplayError);

        var $messageParent = me._contentContainer;
        msls_addOrRemoveClass($messageParent, showDisplayError, msls_display_error);

        var $message = me._contentContainer.children().filter("." + msls_display_error_text);

        if (showDisplayError) {
            var contentItem = me.data,
                message = contentItem.displayError;


            if (!$message.length) {
                $message = $("<div class='" + msls_display_error_text + "'></div>")
                    .appendTo($messageParent);
                $overlay.append("<div class='" + msls_display_error_icon + "'></div>");
            }
            $message.text(message);
        } else {
            $message.remove();
        }

        e.needsLayoutUpdate = true;
    }

    var visualStateToSetFunctionMap = {};
    visualStateToSetFunctionMap[msls_VisualState.disabled] = _updateDisabledState;
    visualStateToSetFunctionMap[msls_VisualState.hidden] = _updateHiddenState;
    visualStateToSetFunctionMap[msls_VisualState.hasValidationError] = _updateValidationErrorState;
    visualStateToSetFunctionMap[msls_VisualState.hasDisplayError] = _updateDisplayErrorState;
    visualStateToSetFunctionMap[msls_VisualState.loading] = _updateLoadingState;
    visualStateToSetFunctionMap[msls_VisualState.readOnly] = _updateReadOnlyState;

    function _updateVisualState(me) {

        var contentItem = me.data;
        if (!contentItem || contentItem._isUnderList) {
            return;
        }

        var underlyingControl = me.underlyingControl,
            oldState = me._currentVisualState,
            newState = contentItem._visualState,
            removeOldStateFunction,
            setNewStateFunction,
            customVisualStateHandler = underlyingControl &&
                underlyingControl._customVisualStateHandler,
            needsLayoutUpdate;

        if (oldState === newState) {
            switch (contentItem._visualState) {
                case msls_VisualState.normal:
                case msls_VisualState.disabled:
                case msls_VisualState.hidden:
                case msls_VisualState.loading:
                case msls_VisualState.normal:
                case msls_VisualState.readOnly:
                    return;
            }
        }

        removeOldStateFunction = visualStateToSetFunctionMap[oldState];
        var e = { state: oldState, activate: false, custom: false, needsLayoutUpdate: false };
        if (customVisualStateHandler) {
            customVisualStateHandler.call(underlyingControl, e);
        }
        if (removeOldStateFunction) {
            removeOldStateFunction(me, e);
        }

        me._currentVisualState = newState;
        setNewStateFunction = visualStateToSetFunctionMap[newState];
        var e2 = { state: newState, activate: true, custom: false, needsLayoutUpdate: false };
        if (customVisualStateHandler) {
            customVisualStateHandler.call(underlyingControl, e2);
        }
        if (setNewStateFunction) {
            setNewStateFunction(me, e2);
        }

        needsLayoutUpdate = e.needsLayoutUpdate || e2.needsLayoutUpdate;
        if (needsLayoutUpdate && contentItem._isActivated) {
            me.getView().trigger("updatelayout");
        }
    }


    msls_defineClass("ui.controls", "ContentItemPresenter", ContentItemPresenter, msls_ui_Control, {
        controlName: "ContentItemPresenter",
        suppressLabel: false,

        _attachViewCore: _attachViewCore,

        _onDataChanged: _onDataChanged,
        _onDispose: _onDispose
    }, {
        _fillTemplate: msls_createPresenterTemplate
    });


}());

(function () {

    function AccordionLayout(view) {

        var me = this;
        msls_ui_Control.call(me, view);
    }

    function _fillTemplate(view, contentItem, templateData) {
        var itemsSource,
            collapsibleSet,
            contentStrings = [],
            collapsibleSetClassIndex,
            hasVStretchChild = false,
            containerNode,
            sectionNode;

        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;
        if (!itemsSource || !$.isArray(itemsSource)) {
            return;
        }

        contentStrings.push('<div data-role="collapsible-set" class="');
        if (contentItem._isVStretch) {
            contentStrings.push("msls-vstretch ");
        }
        collapsibleSetClassIndex = contentStrings.length;
        contentStrings.push('">');

        $.each(itemsSource, function (index) {
            contentStrings.push('<div data-role="collapsible"');
            if (index === 0) {
                contentStrings.push(' data-collapsed="false"');
            }
            contentStrings.push(' class="');
            contentStrings.push(this._isVStretch ? msls_vstretch : msls_vauto);
            contentStrings.push('" >');

            contentStrings.push("<h3>");
            contentStrings.push(this.displayName);
            contentStrings.push("</h3>");

            contentStrings.push("<div");
            if (this._isVStretch) {
                contentStrings.push(' class="msls-vstretch"');
            }
            contentStrings.push(">");

            contentStrings.push("</div>");

            contentStrings.push("</div>");
            if (this._isVStretch) {
                hasVStretchChild = true;
            }
        });

        contentStrings.splice(collapsibleSetClassIndex, 0, hasVStretchChild ? msls_vstretch : msls_vauto);

        contentStrings.push("</div>");

        view[0].innerHTML = contentStrings.join("");

        containerNode = view[0];
        sectionNode = containerNode.firstChild.firstChild;
        $.each(itemsSource, function (index) {
            msls_createPresenterTemplate($(sectionNode.lastChild), this, templateData[index] = {});
            sectionNode = sectionNode.nextSibling;
        });
    }

    function _attachViewCore(templateData) {

        var me = this,
            contentItem,
            itemsSource,
            container,
            collapsibleSet,
            containerNode,
            sectionNode;

        msls_ui_Control.prototype._attachViewCore.call(this, templateData);

        contentItem = me.data;
        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;

        container = me.getView();

        containerNode = container[0];

        collapsibleSet = $(containerNode.firstChild);

        sectionNode = containerNode.firstChild.firstChild;
        $.each(itemsSource, function (index) {

            var section,
                content,
                contentRoot,
                firstExpand = function () {
                    var s = $(this);
                    s.find("textarea").keyup();
                    s.unbind("expand", firstExpand);
                };

            section = $(sectionNode);
            contentRoot = $(sectionNode.lastChild);
            sectionNode = sectionNode.nextSibling;

            content = new msls.ui.controls.ContentItemPresenter(contentRoot);
            content.parent = me;
            content.data = this;
            content.attachView(templateData[index]);

            section.bind("expand", firstExpand);
        });

        me._collapsibleSet = collapsibleSet;
    }

    msls_defineClass("ui.controls", "AccordionLayout", AccordionLayout, msls_ui_Control, {
        controlName: "AccordionLayout",

        _attachViewCore: _attachViewCore
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.AccordionLayout.prototype._propertyMappings = {
    };

}());

(function () {


    var _yearFieldWidth,
        _monthFieldWidth,
        _dayFieldWidth,
        _hourPeriodFieldWidth,
        _hourNumberFieldWidth,
        _minuteFieldWidth;

    var _monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        _dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        _periodNames = ["AM", "PM"],
        _firstDayOfWeek = 0,
        _dCalendarPattern = "MM/dd/yyyy",
        _slashCalendarPattern = "/";

    function _buildHiddenSelect(selectElementName, selectedString) {

        var selectElement = document.createElement("select");
        selectElement.setAttribute("name", selectElementName);
        selectElement.appendChild(_buildOption(selectedString, selectedString));
        selectElement.selectedIndex = 0;

        return selectElement;

    }

    function _buildHiddenFieldSets() {

        var monthNames = _monthNames,
            dayNames = _dayNames,
            periodNames = _periodNames;

        var longestYearString = "WWWW",
            longestMonthString = "WW" + _getLongestString(monthNames),
            longestDayString = "WWWWW" + _getLongestString(dayNames),
            longestHourString = "WWW",
            longestMinuteString = "WWW",
            longestPeriodString = "WWW";

        var $hiddenFieldSets = $('<div class="msls-dateTimePicker-container"/>'),
            hiddenDate = $('<fieldset id="hiddenDate" data-role="controlgroup" data-type="horizontal" style="float:left"/>'),
            hiddenTime = $('<fieldset id="hiddenTime" data-role="controlgroup" data-type="horizontal" style="float:left"/>');

        $(hiddenDate).append(_buildHiddenSelect("yearHidden", longestYearString));
        $(hiddenDate).append(_buildHiddenSelect("monthHidden", longestMonthString));
        $(hiddenDate).append(_buildHiddenSelect("dayHidden", longestDayString));
        $(hiddenTime).append(_buildHiddenSelect("hourHidden", longestHourString));
        $(hiddenTime).append(_buildHiddenSelect("minuteHidden", longestMinuteString));
        $(hiddenTime).append(_buildHiddenSelect("periodHidden", longestPeriodString));

        
        $hiddenFieldSets.append(hiddenDate);
        $hiddenFieldSets.append(hiddenTime);


        return $hiddenFieldSets;

    }

    function _getJqmSelectElementWidth(selectElementName) {

        return $('select[name="' + selectElementName + '"]').parent("div.ui-select div.ui-btn").first().width();
    }

    function _setJqmSelectElementWidth(me, selectElementName, newWidth) {

        return $(me.getView()).find('select[name="' + selectElementName + '"]').parent("div.ui-select div.ui-btn").first().css("min-width", newWidth);
    }

    var _setControlFieldWidths = function () {
        var hiddenFieldSets = _buildHiddenFieldSets();
        $(".ui-page div.ui-content").append(hiddenFieldSets);

        $("div.msls-dateTimePicker-container select").selectmenu();

        $("div.msls-dateTimePicker-container div.ui-select div").removeClass("ui-btn-icon-right");
        $("div.msls-dateTimePicker-container div.ui-select span.ui-icon").remove();

        $("div.msls-dateTimePicker-container fieldset").controlgroup().trigger("create");

        _yearFieldWidth = _getJqmSelectElementWidth("yearHidden");
        _monthFieldWidth = _getJqmSelectElementWidth("monthHidden");
        _dayFieldWidth = _getJqmSelectElementWidth("dayHidden");
        _hourNumberFieldWidth = _getJqmSelectElementWidth("hourHidden");
        _hourPeriodFieldWidth = _getJqmSelectElementWidth("periodHidden");
        _minuteFieldWidth = _getJqmSelectElementWidth("minuteHidden");

        $("fieldset#hiddenDate").remove();
        $("fieldset#hiddenTime").remove();

        $(document).unbind("pageshow", _setControlFieldWidths);
    };


    $(document).bind("pageshow", _setControlFieldWidths);



    function DateTimePicker(view) {

        var me = this;
        msls_ui_Control.call(me, view);

    }

    function _getCultureSelector(me) {

        return "en-US";
    }


    function _checkCultureSupportsPeriods(me) {
        return true;
    }


    function _createDate(fullYear, month, day, hours, minutes, seconds, milliseconds) {

        if (fullYear >= 100 || fullYear < 0) {
            return new Date(fullYear, month, day, hours, minutes, seconds, milliseconds);
        }

        var date = new Date(0, 0, 0, 0, 0, 0, 0);
        date.setFullYear(fullYear);
        date.setMonth(month);
        date.setDate(day);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        date.setMilliseconds(milliseconds);

        return date;
    }

    function _getNumberDaysInMonth(year, month) {

        return _createDate(year, month + 1, 0, 0, 0, 0, 0).getDate();
    }

    function _getFirstDayOfMonth(year, month) {

        return _createDate(year, month, 1, 0, 0, 0, 0).getDay();
    }

    function _padStringWithLeadingZeros(string, desiredLength) {

        while (desiredLength > string.length) {
            string = "0" + string;
        }

        return string;
    }

    function _getYearString(me, year) {

        return year.toString();

    }

    function _getMonthString(me, month) {
        
        return _monthNames[month];

    }

    function _getDayString(me, year, month, day) {

        var firstDayOfWeek = _firstDayOfWeek,
            firstDayOfMonth = _getFirstDayOfMonth(year, month),
            dayNumberString = _padStringWithLeadingZeros(day.toString(), 2),
            daysOfWeek = _dayNames,
            daysOfWeekIndex = (firstDayOfMonth + day - 1 + firstDayOfWeek) % daysOfWeek.length;


        return msls_getResourceString("dateTimePicker_dayNumberAndDayPattern", dayNumberString, daysOfWeek[daysOfWeekIndex]);

    }

    function _getPeriodString(me, period) {



        return period;

    }

    function _getHourString(me, hour) {

        var wrappedHour;

        switch (me.clock) {
            case "TwelveHour":
                wrappedHour = (hour % 12);
                if (wrappedHour === 0) {
                    wrappedHour = 12;
                }
                break;

            case "TwentyFourHour":
                wrappedHour = hour;
                break;

            default:
                wrappedHour = hour;
                break;
        }

        return wrappedHour.toString();

    }

    function _getMinuteString(me, minute) {

        return _padStringWithLeadingZeros(minute.toString(), 2);

    }

    function _buildOption(text, value) {

        var option = document.createElement("option");
        option.value = value;
        option.text = text;

        return option;
    }

    function _addNullOption(dropdownElement, nullOptionString) {

        var nullOption = _buildOption(nullOptionString, "");
        dropdownElement.insertBefore(nullOption, dropdownElement.firstChild);
    }

    function _selectOptionByValue(selector, value) {

        var selectedValue = value !== null ? value.toString() : "";
        var optionElement = $(selector).find("option[value=" + selectedValue + "]");
        selector.selectedIndex = optionElement.index();

    }

    function _populateYearDropdownElement(me) {

        var selector = me._yearDropdownElement,
            date = me.date,
            selectedYear = !!me.date ? date.getFullYear() : null,
            originalDate = me.originalDate,
            originalYear = !!me.originalDate ? originalDate.getFullYear() : null,

            extraOptions = ([selectedYear, originalYear]).sort(),
            previousYearOption,
            optionIndex,
            option;

        $(selector).empty();

        for (optionIndex in extraOptions) {
            option = extraOptions[optionIndex];
            if (option !== null && option < me.minimumYear && option !== previousYearOption) {
                selector.appendChild(_buildOption(_getYearString(me, option), option.toString()));
            }

            previousYearOption = option;
        }

        for (var year = me.minimumYear; year <= me.maximumYear; year++) {

            var yearOption = _buildOption(_getYearString(me, year), year.toString());
            selector.appendChild(yearOption);

            previousYearOption = year;
        }

        for (optionIndex in extraOptions) {
            option = extraOptions[optionIndex];
            if (option !== null && option > me.maximumYear && option !== previousYearOption) {
                selector.appendChild(_buildOption(_getYearString(me, option), option.toString()));
            }

            previousYearOption = option;
        }

        if (!me.date || me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyYear"));
        }

        _selectOptionByValue(selector, selectedYear);

    }

    function _populateMonthDropdownElement(me) {

        var selector = me._monthDropdownElement;
        $(selector).empty();

        var date = me.date,
            selectedMonth = me.date ? date.getMonth() : null;

        for (var month = 0; month < me._numberOfMonths; month++) {

            var monthOption = _buildOption(_getMonthString(me, month), month.toString());
            selector.appendChild(monthOption);
        }

        if (!me.date || me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyMonth"));
        }

        _selectOptionByValue(selector, selectedMonth);

    }

    function _populateDayDropdownElement(me) {

        var selector = me._dayDropdownElement;
        $(selector).empty();

        if (!me.date) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyDay"));
            return;
        }

        var date = me.date,
            month = date.getMonth(),
            year = date.getFullYear(),
            selectedDate = me.date ? date.getDate() : null,
            daysInMonth = _getNumberDaysInMonth(year, month);


        for (var day = 1; day <= daysInMonth; day++) {
            var optionValue = day.toString();
            var optionText = _getDayString(me, year, month, day);

            selector.appendChild(_buildOption(optionText, optionValue));

        }

        if (me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyDay"));
        }

        _selectOptionByValue(selector, selectedDate);

    }

    function _populateHourPeriodDropdownElement(me) {
        var selector = me._hourPeriodDropdownElement;
        $(selector).empty();

        var date = me.date,
            selectedHour = me.date ? date.getHours() : null;

        var amPeriodString = _getPeriodString(me, "AM");
        var pmPeriodString = _getPeriodString(me, "PM");


        selector.appendChild(_buildOption(amPeriodString, "0"));
        selector.appendChild(_buildOption(pmPeriodString, "12"));

        if (!me.date || me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyPeriod"));
        }

        var selectedPeriod;
        if (selectedHour === null) {
            selectedPeriod = null;
        } else if (selectedHour < 12) {
            selectedPeriod = 0;
        } else {
            selectedPeriod = 12;
        }

        _selectOptionByValue(selector, selectedPeriod);

    }

    function _populateHourNumberDropdownElement(me) {

        var selector = me._hourNumberDropdownElement;
        $(selector).empty();


        var totalHourNumbers = 0;

        switch (me.clock) {
            case "TwelveHour":
                totalHourNumbers = 12;
                break;
            case "TwentyFourHour":
                totalHourNumbers = 24;
                break;

            default:
                return;
        }


        var date = me.date,
            selectedHour = me.date ? date.getHours() % totalHourNumbers : null;


        for (var hour = 0; hour < totalHourNumbers; hour++) {

            var optionValue = hour.toString();
            var optionText = _getHourString(me, hour);

            selector.appendChild(_buildOption(optionText, optionValue));

        }

        if (!me.date || me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyHour"));
        }

        _selectOptionByValue(selector, selectedHour);

    }

    function _populateMinuteDropdownElement(me) {

        var selector = me._minuteDropdownElement,
            date = me.date,
            selectedMinute = !!me.date ? date.getMinutes() : null,
            originalDate = me.originalDate,
            originalMinute = !!me.originalDate ? originalDate.getMinutes() : null,

            extraOptions = ([selectedMinute, originalMinute]).sort();

        $(selector).empty();

        for (var minute = 0, previousMinute = minute; minute < 60; minute += me.minuteIncrement) {

            var optionValue = minute.toString();
            var optionText = _getMinuteString(me, minute);

            for (var optionIndex in extraOptions) {
                var option = extraOptions[optionIndex];
                if (option !== null && option > previousMinute && option < minute) {
                    selector.appendChild(_buildOption(_getMinuteString(me, option), option.toString()));

                    previousMinute = option;
                }
            }

            selector.appendChild(_buildOption(optionText, optionValue));

            previousMinute = minute;

        }

        if (!me.date || me._isNullable) {
            _addNullOption(selector, msls_getResourceString("dateTimePicker_emptyMinute"));
        }

        _selectOptionByValue(selector, selectedMinute);
    }

    function _getCurrentDateOrDefault(me) {
        if (me.date) {
            var date = new Date(me.date);
            date.setMilliseconds(me.date.getMilliseconds());
            return date;
        } else {
            return _createDate(me.minimumYear, 0, 1, 0, 0, 0, 0);
        }

    }

    function _updateYear(me, year) {

        if (year === null) {
            me.date = null;
            return;
        }

        var date = _getCurrentDateOrDefault(me);

        var maxDayInNewMonth = _getNumberDaysInMonth(year, date.getMonth());
        if (maxDayInNewMonth < date.getDate()) {
            date.setDate(maxDayInNewMonth);
        }

        date.setFullYear(year);
        me.date = date;
    }

    function _updateDay(me, day) {

        if (day === null) {
            me.date = null;
            return;
        }



        var date = _getCurrentDateOrDefault(me);

        var maxDayInMonth = _getNumberDaysInMonth(date.getFullYear(), date.getMonth());

        date.setDate(day);
        me.date = date;
    }

    function _updateMonth(me, month) {

        if (month === null) {
            me.date = null;
            return;
        }


        var date = _getCurrentDateOrDefault(me);

        var maxDayInNewMonth = _getNumberDaysInMonth(date.getFullYear(), month);
        if (maxDayInNewMonth < date.getDate()) {
            date.setDate(maxDayInNewMonth);
        }

        date.setMonth(month);
        me.date = date;
    }

    function _updateHour(me, hour, periodOffset) {

        if (!hour) {
            hour = 0;
        } else if (!periodOffset) {
            periodOffset = 0;
        }

        var date = _getCurrentDateOrDefault(me);
        date.setHours(hour + periodOffset);
        me.date = date;
    }

    function _updateHourPeriod(me, hour, periodOffset) {

        if (periodOffset === null) {
            me.date = null;
            return;
        }

        _updateHour(me, hour, periodOffset);
    }

    function _updateHourNumber(me, hour, periodOffset) {

        if (hour === null) {
            me.date = null;
            return;
        }

        _updateHour(me, hour, periodOffset);
    }

    function _updateMinute(me, minute) {

        if (minute === null) {
            me.date = null;
            return;
        }

        var date = _getCurrentDateOrDefault(me);
        date.setMinutes(minute);
        me.date = date;
    }

    function _getSelectedValue(selectElement) {

        if (!selectElement) {
            return null;
        }

        var selectedValue = selectElement.options[selectElement.selectedIndex].value;

        if (selectedValue === "") {
            return null;
        } else {
            return parseInt(selectedValue, 10);
        }
    }

    function _getLongestString(stringArray) {
        var longestString = "";

        for (var i = 0, len = stringArray.length; i < len; i++) {
            if (stringArray[i].length > longestString.length) {
                longestString = stringArray[i];
            }
        }

        return longestString;
    }

    function _buildDropdownElement(me, dropdownElementName, nameAttribute, populate, update) {

        var dropdownElement = me[dropdownElementName] = document.createElement("select");
        dropdownElement.setAttribute("class", "id-element");
        dropdownElement.setAttribute("name", nameAttribute);

        dropdownElement.setAttribute("style", "min-width: 100%; max-width: none;");

        populate(me);

        $(dropdownElement).change(function () {
            if (!me._updatingDropdownElements) {
                update();
            }
        });

    }


    function _initialize(me) {

        if (me.minuteIncrement <= 0) {
            me.minuteIncrement = 1;
        }

        var contentItem = me.data;
        me._isNullable = !msls_getAttribute(contentItem.valueModel, ":@Required");



        var dateRange = msls_getAttribute(contentItem.valueModel, ":@Range");
        if (!!dateRange) {

            if (!!dateRange.minimum) {

                me._minimumDate = new Date(dateRange.minimum);
                var minYear = me._minimumDate.getFullYear();

                if (me.minimumYear < minYear) {
                    me.minimumYear = minYear;
                }

            } else {
                me._minimumDate = null;
            }

            if (!!dateRange.maximum) {

                me._maximumDate = new Date(dateRange.maximum);
                var maxYear = me._maximumDate.getFullYear();

                if (me.maximumYear > maxYear) {
                    me.maximumYear = maxYear;
                }

            } else {
                me._maximumDate = null;
            }

        }



        var cultureSelector = _getCultureSelector(me);

        if (!_checkCultureSupportsPeriods(me)) {
            me.clock = "TwentyFourHour";
        }
        me._numberOfMonths = 12;


        me._updatingDropdownElements = false;

    }

    function _buildWrappedPicker(me, orderedDropdownArray, dropdownContainer) {

        var $dropdownElements = $('<fieldset data-role="controlgroup" data-type="horizontal" data-inline="true"></fieldset>');

        for (var dropdownIndex in orderedDropdownArray) {
            $dropdownElements = $dropdownElements.append($(orderedDropdownArray[dropdownIndex]));
        }

        dropdownContainer.append($dropdownElements);
    }

    function _initializeView(me) {

        _initialize(me);

        var dateTimePickerContainer = $('<div class="msls-dateTimePicker-container">');
        var dropdownContainer = dateTimePickerContainer,
            orderedDateDropdownArray = [],
            orderedTimeDropdownArray = [],
            $dateDropdownElements = $(),
            $timeDropdownElements = $();


        if (me.datePickerEnabled) {

            _buildDropdownElement(me, "_yearDropdownElement", "year", _populateYearDropdownElement,
                function () {
                    _updateYear(me, _getSelectedValue(me._yearDropdownElement));
                });

            _buildDropdownElement(me, "_monthDropdownElement", "month", _populateMonthDropdownElement,
                function () {
                    _updateMonth(me, _getSelectedValue(me._monthDropdownElement));
                });

            _buildDropdownElement(me, "_dayDropdownElement", "day", _populateDayDropdownElement,
                function () {
                    _updateDay(me, _getSelectedValue(me._dayDropdownElement));
                });



            var dateFormat = _dCalendarPattern,
                delimiter = _slashCalendarPattern,
                cultureDateOrderArray = dateFormat.split(delimiter, 3);

            for (var datePart in cultureDateOrderArray) {

                var datePartClean = cultureDateOrderArray[datePart].split(" ", 1)[0];

                switch (datePartClean) {
                    case "M":
                    case "MM":
                        orderedDateDropdownArray.push(me._monthDropdownElement);
                        break;
                    case "d":
                    case "dd":
                        orderedDateDropdownArray.push(me._dayDropdownElement);
                        break;
                    case "yyyy":
                    case "yy":
                        orderedDateDropdownArray.push(me._yearDropdownElement);
                        break;
                }

            }

            _buildWrappedPicker(me, orderedDateDropdownArray, dropdownContainer);

        }



        if (me.timePickerEnabled) {


            _buildDropdownElement(me, "_hourNumberDropdownElement", "hour", _populateHourNumberDropdownElement,
                function () {
                    _updateHourNumber(me, _getSelectedValue(me._hourNumberDropdownElement),
                        _getSelectedValue(me._hourPeriodDropdownElement));
                });

            _buildDropdownElement(me, "_hourPeriodDropdownElement", "period", _populateHourPeriodDropdownElement,
                function () {
                    _updateHourPeriod(me, _getSelectedValue(me._hourNumberDropdownElement),
                        _getSelectedValue(me._hourPeriodDropdownElement));
                });

            _buildDropdownElement(me, "_minuteDropdownElement", "minute", _populateMinuteDropdownElement,
                function () {
                    _updateMinute(me, _getSelectedValue(me._minuteDropdownElement));
                });


            orderedTimeDropdownArray.push(me._hourNumberDropdownElement);
            orderedTimeDropdownArray.push(me._minuteDropdownElement);

            if (me.clock === "TwelveHour") {
                orderedTimeDropdownArray.push(me._hourPeriodDropdownElement);
            }

            _buildWrappedPicker(me, orderedTimeDropdownArray, dropdownContainer);

        }



        $(me.getView()).append(dateTimePickerContainer);

        msls_subscribeOnce(msls_layout_updatedNotification, function () {
            $("div.msls-dateTimePicker-container select").selectmenu();

            $("div.msls-dateTimePicker-container div.ui-select div").removeClass("ui-btn-icon-right");
            $("div.msls-dateTimePicker-container div.ui-select span.ui-icon").remove();

            if (me.datePickerEnabled) {

                _setJqmSelectElementWidth(me, "year", _yearFieldWidth);
                _setJqmSelectElementWidth(me, "month", _monthFieldWidth);
                _setJqmSelectElementWidth(me, "day", _dayFieldWidth);

            }

            if (me.timePickerEnabled) {

                _setJqmSelectElementWidth(me, "period", _hourPeriodFieldWidth);
                _setJqmSelectElementWidth(me, "hour", _hourNumberFieldWidth);
                _setJqmSelectElementWidth(me, "minute", _minuteFieldWidth);

            }
        });
        
    }


    function _updateDropdowns(me) {

        try {

            me._updatingDropdownElements = true;

            if (me.datePickerEnabled) {

                _populateYearDropdownElement(me);
                _populateMonthDropdownElement(me);
                _populateDayDropdownElement(me);

                $(me._yearDropdownElement).change();
                $(me._monthDropdownElement).change();
                $(me._dayDropdownElement).change();

            }

            if (me.timePickerEnabled) {

                _populateHourNumberDropdownElement(me);
                _populateMinuteDropdownElement(me);

                $(me._hourNumberDropdownElement).change();
                $(me._minuteDropdownElement).change();

                if (me.clock === "TwelveHour") {
                    _populateHourPeriodDropdownElement(me);
                    $(me._hourPeriodDropdownElement).change();
                }

            }

        } finally {

            me._updatingDropdownElements = false;

        }

    }

    function _setDropdownElementIsEnabled(dropdownSelectElement, isEnabled) {

        var element = $(dropdownSelectElement);

        if (element.data("selectmenu")) {

            element.selectmenu(isEnabled ? "enable" : "disable");

        }

        if (isEnabled) {
            if (element.attr("disabled") === "disabled") {
                element.removeAttr("disabled");
            }
        } else {
            element.attr("disabled", "disabled");
        }
    }

    function _updateIsEnabled(me, isEnabled) {

        if (me.datePickerEnabled) {
            _setDropdownElementIsEnabled(me._yearDropdownElement, isEnabled);
            _setDropdownElementIsEnabled(me._monthDropdownElement, isEnabled);
            _setDropdownElementIsEnabled(me._dayDropdownElement, isEnabled);
        }

        if (me.timePickerEnabled) {
            _setDropdownElementIsEnabled(me._hourNumberDropdownElement, isEnabled);
            _setDropdownElementIsEnabled(me._hourPeriodDropdownElement, isEnabled);
            _setDropdownElementIsEnabled(me._minuteDropdownElement, isEnabled);

        }
    }

    function _customVisualStateHandler(e) {

        if (e.state === msls_VisualState.disabled || e.state === msls_VisualState.readOnly) {
            var isDisabledOrReadOnly = e.activate;
            _updateIsEnabled(this, !isDisabledOrReadOnly);
            e.custom = true;
        }
    }

    function _refreshView() {
        if (this._isViewCreated) {
            _updateDropdowns(this);

        }

    }

    function _attachViewCore(templateData) {
        var me = this;
        msls.ui.Control.prototype._attachViewCore.call(me);

        _initializeView(me);
        me._refreshView();
    }


    var dateTimePicker = msls_defineClass("ui.controls", "DateTimePicker", DateTimePicker, msls_ui_Control, {
        controlName: "DateTimePicker",

        minimumYear: msls_controlProperty(),
        maximumYear: msls_controlProperty(),
        clock: msls_controlProperty(),
        minuteIncrement: msls_controlProperty(),
        datePickerEnabled: msls_controlProperty(),
        timePickerEnabled: msls_controlProperty(),
        date: msls_controlProperty(
            function onDateChanged(value) {
                this._refreshView();
            },
            null, true),
        originalDate: msls_controlProperty(
            function onOriginalDateChanged(value) {
                this._refreshView();
            }),

        _attachViewCore: _attachViewCore,
        _refreshView: _refreshView,
        _customVisualStateHandler: _customVisualStateHandler
    });

    dateTimePicker.prototype._propertyMappings = {
        value: "date",
        properties: {
            minimumYear: "minimumYear",
            maximumYear: "maximumYear",
            clock: "clock",
            minuteIncrement: "minuteIncrement",
            datePickerEnabled: "datePickerEnabled",
            timePickerEnabled: "timePickerEnabled"
        },
        details: {
            originalValue: "originalDate"
        }
    };

    dateTimePicker.prototype._editableProperties = {
        date: "value"
    };
}());


(function () {
    function DatePicker(view) {

        var me = this;
        me.timePickerEnabled = false;
        me.datePickerEnabled = true;
        me.clock = "TwentyFourHour";

        msls.ui.controls.DateTimePicker.call(me, view);
    }

    msls_defineClass("ui.controls", "DatePicker", DatePicker, msls.ui.controls.DateTimePicker, {
        controlName: "DatePicker"
    });

    msls.ui.controls.DatePicker.prototype._propertyMappings = {
        value: "date",
        properties: {
            minimumYear: "minimumYear",
            maximumYear: "maximumYear"
        },
        details: {
            originalValue: "originalDate"
        }
    };
}());

(function () {
    function EmailAddressEditor(view) {

        msls.ui.controls.TextBox.call(this, view);
    }

    function _fillTemplate(view, contentItem, templateData) {
        var template = '<input type="email" class="id-element" />';

        $(template).appendTo(view);
        templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
    }

    msls_defineClass("ui.controls", "EmailAddressEditor", EmailAddressEditor, msls.ui.controls.TextBox, {
        controlName: "EmailAddressEditor"
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.EmailAddressEditor.prototype._propertyMappings = {
        stringValue: "text",
        maxLength: "maxLength"
    };
}());

(function () {
    function EmailAddressViewer(view) {

        msls.ui.controls.Text.call(this, view);
    }

    function _refreshView() {
        if (this._isViewCreated) {
            this._textElement.text(this.text);
            this._textElement.attr("href", "mailto:" + this.text);
        }
    }

    function _fillTemplate(view, contentItem, templateData) {
        $('<div class="msls-text-container"><a class="id-element" target="_blank"></a></div>')
            .appendTo(view);
        templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
    }

    msls_defineClass("ui.controls", "EmailAddressViewer", EmailAddressViewer, msls.ui.controls.Text, {
        controlName: "EmailAddressViewer",

        _refreshView: _refreshView
    }, {
        _fillTemplate: _fillTemplate
    });

}());

(function () {

    function Image(view) {

        var me = this;
        msls_ui_Control.call(me, view);
    }

    function _fillTemplate(view, contentItem, templateData) {
        $('<div class="msls-image-container"><div class="msls-image-border"><img alt="Image"/></div></div>').appendTo(view);
        templateData.imageContainer = msls_getTemplateItemPath(view, msls_control_find(view, ".msls-image-container"));
    }

    function _attachViewCore(templateData) {
        var me = this;

        me._element = msls_getTemplateItem(me.getView(), templateData.imageContainer, ".msls-image-container");

        msls_addAutoDisposeNotificationListener(msls_layout_updatedNotification, me, function () {
            msls_dispatch(function () { _updateSize(me); });
        });

        _updateView(this);
        msls.ui.Control.prototype._attachViewCore.call(this, templateData);
    }

    function _calculateControlSize(me, imageWidth, imageHeight) {
        var controlWidth = me.isHStretch ? me._element.width() : imageWidth,
            controlHeight = me.isVStretch ? me._element.height() : imageHeight,
            width = me.width,
            height = me.height,
            minWidth = me.minWidth,
            minHeight = me.minHeight,
            maxWidth = me.maxWidth,
            maxHeight = me.maxHeight;

        if (me.widthSizingMode === msls_WidthSizingMode.fixedSize) {
            if (typeof width === "number" && width >= 0) {
                controlWidth = width;
            }
        } else {
            if (typeof minWidth === "number" && minWidth >= 0 && controlWidth < minWidth) {
                controlWidth = minWidth;
            }
            if (typeof maxWidth === "number" && maxWidth >= 0 && controlWidth > maxWidth) {
                controlWidth = maxWidth;
            }
        }

        if (me.heightSizingMode === msls_HeightSizingMode.fitToContent && imageWidth > 0) {
            controlHeight = imageHeight * controlWidth / imageWidth;
        }

        if (me.heightSizingMode === msls_HeightSizingMode.fixedSize) {
            if (typeof height === "number" && height >= 0) {
                controlHeight = height;
            }
        } else {
            if (typeof minHeight === "number" && minHeight >= 0 && controlHeight < minHeight) {
                controlHeight = minHeight;
            }
            if (typeof maxHeight === "number" && maxHeight >= 0 && controlHeight > maxHeight) {
                controlHeight = maxHeight;
            }
        }

        if (me.widthSizingMode === msls_WidthSizingMode.fitToContent && imageHeight > 0) {
            controlWidth = imageWidth * controlHeight / imageHeight;

            if (typeof minWidth === "number" && minWidth >= 0 && controlWidth < minWidth) {
                controlWidth = minWidth;
            }
            if (typeof maxWidth === "number" && maxWidth >= 0 && controlWidth > maxWidth) {
                controlWidth = maxWidth;
            }
        }

        return { width: controlWidth, height: controlHeight };
    }

    function _updateSize(me, forceUpdate) {

        var border = me._element.children("div"),
            image = border.children("img"),
            imageWidth = image.prop("naturalWidth") || 80,
            imageHeight = image.prop("naturalHeight") || 80,
            controlSize = _calculateControlSize(me, imageWidth, imageHeight),
            controlWidth = Math.floor(controlSize.width),
            controlHeight = Math.floor(controlSize.height),
            displayWidth = controlWidth,
            displayHeight = controlHeight,
            displayOffsetX = 0,
            displayOffsetY = 0;

        if (forceUpdate || me._controlWidth !== controlWidth || me._controlHeight !== controlHeight) {

            me._controlHeight = controlHeight;
            me._controlWidth = controlWidth;

            if (me.scale === "Fit") {
                if (controlWidth * imageHeight > imageWidth * controlHeight) {
                    displayWidth = controlHeight * imageWidth / imageHeight;
                    displayOffsetX = (controlWidth - displayWidth) / 2;
                } else {
                    displayHeight = controlWidth * imageHeight / imageWidth;
                    displayOffsetY = (controlHeight - displayHeight) / 2;
                }
            } else if (me.scale === "Fill" && imageHeight > 0 && imageWidth > 0) {
                if (controlWidth * imageHeight < imageWidth * controlHeight) {
                    displayWidth = controlHeight * imageWidth / imageHeight;
                    displayOffsetX = (controlWidth - displayWidth) / 2;
                } else {
                    displayHeight = controlWidth * imageHeight / imageWidth;
                    displayOffsetY = (controlHeight - displayHeight) / 2;
                }
            }

            border.width(controlWidth);
            border.height(controlHeight);

            image.width(displayWidth);
            image.height(displayHeight);
            image
                .css({
                    "margin-left": displayOffsetX.toString() + "px",
                    "margin-top": displayOffsetY.toString() + "px"
                });

            if (me.widthSizingMode === msls_WidthSizingMode.fitToContent ||
                me.heightSizingMode === msls_HeightSizingMode.fitToContent) {
                me.getView().trigger("updatelayout");
            }
        }
    }

    function _updateView(me) {
        if (me._isViewCreated && !!me._element) {

            var dataUrl = me.src,
                contentItem = me.data,
                border = me._element.children("div"),
                image = border.children("img");

            if (!!contentItem.valueModel) {
                var nullableType,
                    modelItem = contentItem.valueModel,
                    type = modelItem.propertyType;

                if (msls_isNullableType(type)) {
                    nullableType = type;
                    type = nullableType.underlyingType;
                }

                if (!!type && type.id === ":Binary") {
                    dataUrl = "data:image;base64," + me.src;
                }
            }

            border.css({ width: "100%", height: "100%" });

            image
                .hide()
                .css({
                    width: "100%",
                    height: "100%",
                    "margin-left": "0px",
                    "margin-top": "0px"
                });

            if (!!me.src) {
                image
                    .unbind("load")
                    .bind("load", function () {
                        _updateSize(me, true);
                        image.show();
                    })
                    .unbind("error")
                    .bind("error", function () {
                        image.attr("alt", msls_getResourceString(dataUrl === me.src ? "image_invalid_url" : "image_invalid_data"));
                        _updateSize(me, true);
                        image.show();
                    })
                    .attr("src", dataUrl);
            }
        }
    }

    function _onPropertyChanged(value) {
        _updateView(this);
    }

    msls_defineClass("ui.controls", "Image", Image, msls_ui_Control, {
        controlName: "Image",
        src: msls_controlProperty(_onPropertyChanged),
        scale: msls_controlProperty(),
        isHStretch: msls_controlProperty(),
        isVStretch: msls_controlProperty(),
        width: msls_controlProperty(),
        height: msls_controlProperty(),
        minWidth: msls_controlProperty(),
        minHeight: msls_controlProperty(),
        maxWidth: msls_controlProperty(),
        maxHeight: msls_controlProperty(),
        widthSizingMode: msls_controlProperty(),
        heightSizingMode: msls_controlProperty(),

        _attachViewCore: _attachViewCore
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.Image.prototype._propertyMappings = {
        value: "src",
        properties: {
            scale: "scale",
            tap: "tap",
            width: "width",
            height: "height",
            minWidth: "minWidth",
            minHeight: "minHeight",
            maxWidth: "maxWidth",
            maxHeight: "maxHeight",
            widthSizingMode: "widthSizingMode",
            heightSizingMode: "heightSizingMode"
        },
        _isHStretch: "isHStretch",
        _isVStretch: "isVStretch"
    };
}());

(function () {

    function tearDownChildrenDOMTree(parentControl) {
        var children = parentControl.children,
            i, len;

        for (i = 0, len = children.length; i < len; i++) {
            children[i].getView().remove();
        }
    }

(function () {
    function RowsLayout(view) {

        var me = this;
        msls_ui_Control.call(me, view);
    }

    function _fillTemplate(view, contentItem, templateData) {

        var rowTexts,
            i, len,
            itemsSource,
            rowContainer,
            compactMargins = false;

        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;
        if (!itemsSource || !$.isArray(itemsSource)) {
            return;
        }

        compactMargins = !!contentItem.properties[builtInModule.controlPropertyCompactMarginsName];
        view.addClass("msls-label-host msls-rows-layout " + (compactMargins ? "msls-compact-padding" : ""));
        rowTexts = [];
        for (i = 0, len = itemsSource.length; i < len; i++) {
            var item = itemsSource[i],
                isFirst = i === 0,
                isLast = i === len - 1,
                weight = item.properties[builtInModule.controlPropertyWeightedRowHeightId],
                weightText = "";

            if (!!weight && weight !== 1 && weight > 0) {
                weightText = ' data-msls-weight="' + weight + '"';
            }

            rowTexts.push('<div class="msls-clear');
            if (isFirst) {
                if (!isLast) {
                    rowTexts.push(" msls-first-row ");
                }
            } else if (isLast) {
                rowTexts.push(" msls-last-row ");
            } else {
                rowTexts.push(" msls-row ");
            }

            if (!item.isVisible) {
                rowTexts.push(" msls-collapsed ");
            }
            if (item.widthSizingMode === msls_WidthSizingMode.fitToContent && item.horizontalAlignment === msls_HorizontalAlignment.right) {
                rowTexts.push(' msls-hauto msls-halign-left"' + weightText + '><div class="msls-halign-right ');
                rowTexts.push(item._isVStretch ? msls_vstretch : msls_vauto);
                rowTexts.push('"></div></div>');
            } else {
                rowTexts.push('"' + weightText + "></div>");
            }
            if (isLast) {
                rowTexts.push('<div class="msls-clear"></div>');
            }
        }

        view[0].innerHTML = rowTexts.join("");

        rowContainer = view[0].firstChild;

        $.each(itemsSource, function (index) {
            var row,
                childTemplateData = templateData[index] = {};

            if (rowContainer.firstChild) {
                row = $(rowContainer.firstChild);
                childTemplateData.containerPath = [0];
            } else {
                row = $(rowContainer);
            }

            msls_createPresenterTemplate(row, this, childTemplateData);
            rowContainer = rowContainer.nextSibling;
        });
    }

    function _attachViewCore(templateData) {
        var me = this,
            contentItem,
            rootElement,
            itemsSource,
            rowContainer;

        msls_ui_Control.prototype._attachViewCore.call(me, templateData);

        me._tapElement = me._container = me.getView();

        contentItem = me.data;
        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;
        if (!itemsSource || !$.isArray(itemsSource)) {
            return;
        }

        rootElement = me._container[0];

        rowContainer = rootElement.firstChild;

        $.each(itemsSource, function (index) {
            var row,
                contentPresenter,
                rowTemplateData = templateData[index];

            row = msls_getTemplateItem($(rowContainer), rowTemplateData.containerPath);

            rowContainer = rowContainer.nextSibling;

            contentPresenter = new msls.ui.controls.ContentItemPresenter(row);
            contentPresenter.parent = me;
            contentPresenter.data = this;
            contentPresenter.attachView(rowTemplateData);
        });
    }

    msls_defineClass("ui.controls", "RowsLayout", RowsLayout, msls_ui_Control, {
        controlName: "RowsLayout",

        _onDispose:
            function _onDispose() {
                tearDownChildrenDOMTree(this);
            },

        _attachViewCore: _attachViewCore
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.RowsLayout.prototype._propertyMappings = {
        properties: { tap: "tap" }
    };
}());

(function () {

    function ColumnsLayout(view) {

        var me = this;
        msls_ui_Control.call(me, view);
    }

    function _fillTemplate(view, contentItem, templateData) {

        var itemsSource,
            columnTexts,
            i, len,
            column,
            compactMargins = false;

        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;

        if (!itemsSource || !$.isArray(itemsSource)) {
            return;
        }

        compactMargins = !!contentItem.properties[builtInModule.controlPropertyCompactMarginsName];
        view.addClass("msls-columns-layout msls-overflow-columns " + (compactMargins ? "msls-compact-padding" : "msls-dynamic-padding"));

        columnTexts = [];
        for (i = 0, len = itemsSource.length; i < len; i++) {
            var item = itemsSource[i],
                isFirst = i === 0,
                isLast = i === len - 1,
                weight = item.properties[builtInModule.controlPropertyWeightedColumnWidthId];

            columnTexts.push('<div class="');
            if (isFirst) {
                if (!isLast) {
                    columnTexts.push(" msls-first-column ");
                }
            } else if (isLast) {
                columnTexts.push(" msls-last-column ");
            } else {
                columnTexts.push(" msls-column ");
            }

            if (!itemsSource[i].isVisible) {
                columnTexts.push(" msls-collapsed ");
            }


            columnTexts.push('"');
            if (!!weight && weight !== 1 && weight > 0) {
                columnTexts.push(' data-msls-weight="', weight + '"');
            }
            columnTexts.push('></div><div class="' + (isLast ? "msls-clear" : "msls-hempty") + '"></div>');
        }

        view[0].innerHTML = columnTexts.join("");

        i = 0;
        column = view[0].firstChild;
        while (column) {
            if (i % 2 === 0) {
                msls_createPresenterTemplate($(column), itemsSource[i / 2], templateData[i / 2] = {});
            }
            i++;
            column = column.nextSibling;
        }
    }

    function _attachViewCore(templateData) {
        var me = this,
            contentItem,
            itemsSource,
            root,
            column,
            i,
            contentItemPresenter;

        msls_ui_Control.prototype._attachViewCore.call(me, templateData);

        root = me._container = me.getView();

        contentItem = me.data;
        if (!contentItem) {
            return;
        }

        itemsSource = contentItem.children;

        if (!itemsSource || !$.isArray(itemsSource)) {
            return;
        }

        i = 0;
        column = root[0].firstChild;
        while (column) {
            if (i % 2 === 0) {
                contentItemPresenter = new msls.ui.controls.ContentItemPresenter($(column));
                contentItemPresenter.parent = me;
                contentItemPresenter.data = itemsSource[i / 2];
                contentItemPresenter.attachView(templateData[i / 2]);
            }
            i++;
            column = column.nextSibling;
        }
    }


    msls_defineClass("ui.controls", "ColumnsLayout", ColumnsLayout, msls_ui_Control, {
        controlName: "ColumnsLayout",
        _onDispose:
            function _onDispose() {
                tearDownChildrenDOMTree(this);
            },

        _attachViewCore: _attachViewCore
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.ColumnsLayout.prototype._propertyMappings = {
        properties: { tap: "tap" }
    };
}());

}());

(function () {
    var
    itemHtml = "li",
    itemDataKey = "__entity",
    listViewTemplate =
        '<div class="msls-vauto ' + msls_control_header + '"/>' +
        '<div{0}><ul data-role="listview" data-inset="false" /></div>',
    listViewEmptyHtml,
    initializedNotification = "listViewInitialized",
    loadingNotification = "listViewLoading",
    itemsAddedNotification = "listViewItemsAdded",
    contentItemService = msls.services.contentItemService,
    _ContentItemPresenter = msls.ui.controls.ContentItemPresenter,
    _VisualCollectionState = msls.VisualCollection.State;

    function updateSelection(listView, liElement) {

        msls_mark(msls_codeMarkers.listItemClicked);

        var
        collection = listView._collection,
        entity;

        listView._selectingElement = liElement;

        entity = liElement.data(itemDataKey);
        collection.selectedItem = entity;

        listView._selectingElement = null;
    }

    function addItemEventHandlers(listView) {

        var ulElement = listView._ulElement,
            ulHtmlElement = ulElement[0],
            onItemClicked;

        msls_bind_clickEvent(ulElement, listView, "itemTap", "ItemTapPromise", function filterEvent(e) {
            return $(e.target).closest("li").length;
        });

        listView._itemClickedHandler = onItemClicked =
            function onItemClicked(e) {
                var element =  e.target,
                    elementParent = element.parentNode;

                if (element !== ulHtmlElement) {
                    while (elementParent !== ulHtmlElement) {
                        element = elementParent;
                        elementParent = element.parentNode;
                    }
                    updateSelection(listView, $(element));
                }
            };

        ulHtmlElement.addEventListener("click", onItemClicked, true);
    }

    function endLoading(listView) {
        msls_mark(msls_codeMarkers.listViewLoadEnd);
        notifyLoading(listView, false);
    }

    function loadMoreEntities(listView) {
        var collection = listView._collection,
            itemsCount = listView.data.children.length - 1,
            collectionData = collection.data;

        if (itemsCount < collectionData.length) {

            notifyLoading(listView, true);
            addListItems(listView, collectionData.slice(
                itemsCount, itemsCount + collection._loader._pageSize));

        } else if (collection.canLoadMore) {
            msls_mark(msls_codeMarkers.listViewLoadLoadMore);
            collection.loadMore();

        } else {
            endLoading(listView);
        }
    }

    function tryLoadMoreEntities(listView) {
        var collection = listView._collection;

        if (!collection) {
            return;
        }

        if (collection.state === _VisualCollectionState.idle) {
            var scrollHelper = listView._scrollHelper,
                needMoreItems =
                    listView.data._isActivated &&
                    listView._ulElement.height() - scrollHelper.viewTop <
                        2 * scrollHelper.viewHeight;

            if (needMoreItems) {
                loadMoreEntities(listView);
            } else {
                endLoading(listView);
            }
        }
    }

    function updateListViewEmpty(listView) {

        var ulElement = listView._ulElement;

        if (listView.data.children.length === 1) {
            if (!listViewEmptyHtml) {
                listViewEmptyHtml = "<div class='" + msls_list_empty + "'>" +
                    msls_getResourceString("listView_no_items") + "</div>";
            }
            ulElement.after(listViewEmptyHtml);
        } else {
            ulElement.next("." + msls_list_empty).remove();
        }
    }

    function addListItems(listView, items, startingIndex, skipTryLoadMore) {
        var
        index, lastIndex = items.length - 1, entity, lastItemControl,
        ulElement = listView._ulElement,
        listViewContentItem = listView.data,
        rowTemplateContentItem = listViewContentItem.children[0],
        prependElements = startingIndex === 0 && ulElement.find(itemHtml).length !== 0,
        childContentItem,
        contentItemPresenterView,
        rowElement,
        rowTemplate = listView._rowTemplate,
        rowTemplateData = listView._rowTemplateData,
        li,
        contentItemPresenterControl,
        emptyElement = $(".msls-empty", ulElement),
        addedElements = [];


        if (!ulElement.data("listview")) {
            msls_dispose(listView);
            return;
        }

        if (!rowTemplateContentItem) {
            return;
        }

        if (prependElements) {
            items.reverse();
        }

        if (!rowTemplate) {
            rowTemplateData = listView._rowTemplateData = {};
            rowTemplate = listView._rowTemplate = window.document.createElement("li");
            li = $(rowTemplate);

            contentItemPresenterView = $("<div></div>").appendTo(li);
            $('<div class="msls-clear"></div>').appendTo(li);
            li.attr("data-icon", "false");
            li.addClass("ui-btn ui-btn-up-a");

            msls_createPresenterTemplate(contentItemPresenterView, rowTemplateContentItem, rowTemplateData);
        }

        for (index = 0; index <= lastIndex; index++) {
            entity = items[index];
            li = $(rowElement = rowTemplate.cloneNode(true));

            if (prependElements) {
                li = li.prependTo(ulElement);
            } else {
                li = li.insertBefore(emptyElement);
            }
            li.data(itemDataKey, entity);
            addedElements.push(li[0]);

            contentItemPresenterView = $(rowElement.firstChild);

            childContentItem = contentItemService.cloneContentItemTree(rowTemplateContentItem, listViewContentItem, entity);

            contentItemPresenterControl = new _ContentItemPresenter(contentItemPresenterView);
            contentItemPresenterControl.parent = listView;
            contentItemPresenterControl.data = childContentItem;
            contentItemPresenterControl.attachView(rowTemplateData);
        }

        ulElement.listview("refresh");

        if (lastIndex >= 0) {
            msls_notify(itemsAddedNotification, listView);
        }

        msls_mark(msls_codeMarkers.listViewLoadApplyEnd);

        function onLayoutUpdated() {
            msls_unsubscribe(msls_layout_updatedNotification, onLayoutUpdated);
            msls_dispatch(function () {
                tryLoadMoreEntities(listView);
            });
        }
        if (!skipTryLoadMore) {
            if (lastIndex >= 0) {
                msls_subscribe(msls_layout_updatedNotification, onLayoutUpdated);
            } else {
                msls_dispatch(function () {
                    tryLoadMoreEntities(listView);
                });
            }
        }

        updateListViewEmpty(listView);
        msls_updateLayout($(addedElements), true);
    }

    function removeListItems(listView, items) {

        if (!items || items.length === 0) {
            return;
        }

        var
            itemsToSearch = items.slice(0),
            childContentItems = listView.data.children,
            i, len,
            childIndex,
            removingIndices = [],
            childContentItem,
            childContentItemView;

        for (i = 1, len = childContentItems.length; i < len; i++) {
            childIndex = itemsToSearch.indexOf(
                childContentItems[i].data);
            if (childIndex > -1) {
                removingIndices.push(i);
                itemsToSearch.splice(childIndex, 1);
            }
            if (itemsToSearch.length === 0) {
                break;
            }
        }

        for (i = removingIndices.length - 1; i >= 0; i--) {
            childIndex = removingIndices[i];
            childContentItem = childContentItems[childIndex];

            childContentItems.splice(childIndex, 1);

            childContentItemView = childContentItem._view;
            childContentItemView.getView().parents(itemHtml).remove();

            childContentItemView.parent = null;
            msls_dispose(childContentItemView);
            msls_dispose(childContentItem);
        }

        updateListViewEmpty(listView);
    }

    function onCollectionChange(listView, e) {

        if (listView._collectionPromise) {
            return;
        }

        var action = e.action,
            items = e.items;


        if (action === msls_CollectionChangeAction.add) {
            addListItems(listView, items, e.newStartingIndex, true);
        } else if (e.action === msls_CollectionChangeAction.remove) {
            removeListItems(listView, items);
        }
    }

    function notifyLoading(listView, isLoading) {
        msls_notify(loadingNotification, {
            listView: listView,
            isLoading: isLoading
        });
    }

    function onVisualCollectionExecutionResolved(listView, items, startIndex) {
        if (!listView._collection) {
            return;
        }

        listView._collectionPromise = null;
        msls_mark(msls_codeMarkers.listViewLoadDataLoaded);
        addListItems(listView, items, startIndex);
    }

    function joinVisualCollectionExecution(listView) {

        var visualCollection = listView._collection,
            collectionState = visualCollection.state,
            ulElement = listView._ulElement;

        ulElement.next("." + msls_list_empty).remove();
        if (ulElement.next("." + msls_list_loading).length <= 0) {
            listView._ulElement.after("<div class='" + msls_list_loading + "'></div>");
            notifyLoading(listView, true);
        }

        if (collectionState === _VisualCollectionState.loading) {
            (listView._collectionPromise = visualCollection.load()).then(
                function success(count) {
                    onVisualCollectionExecutionResolved(listView, visualCollection.data);
                },
                function failure(error) {
                    msls_modal_showError(error);
                }
            );
        } else {
            (listView._collectionPromise = visualCollection.loadMore()).then(
                function success(result) {
                    onVisualCollectionExecutionResolved(
                        listView, result.items, result.startIndex);
                },
                function failure(error) {
                    msls_modal_showError(error);
                }
            );
        }
    }

    function onCollectionStateChange(listView) {

        var collectionState = listView._collection.state;
        if (collectionState === _VisualCollectionState.idle) {

            listView._ulElement.next("." + msls_list_loading).remove();

        } else {

            if (collectionState === _VisualCollectionState.loading) {
                listView._scrollHelper._scrollElement.scrollTop(0);
                listView._ulElement.children(itemHtml).remove();
                listView.data.children.splice(1);
            }
            joinVisualCollectionExecution(listView);
        }
    }

    function onCollectionSelectedItemChange(listView) {

        var ulElement = listView._ulElement,
            selectedItem = listView._collection.selectedItem,
            selectingElement,
            element;

        if (selectedItem) {
            selectingElement = listView._selectingElement;
            listView._selectingElement = null;

            if (!selectingElement) {
                ulElement.find(itemHtml).each(function () {
                    element = $(this);
                    if (element.data(itemDataKey) === selectedItem) {
                        selectingElement = element;
                        return false;
                    }
                    return true;
                });
            }

        }

        if (!selectingElement ||
            !selectingElement.hasClass(ui_btn_active)) {
            ulElement.find(itemHtml).removeClass(ui_btn_active);

            if (selectingElement) {
                selectingElement.addClass(ui_btn_active);
            }
        }
    }

    function onCreated(listView) {
        var collection = listView._collection;

        if (!collection) {
            return;
        }

        msls_addAutoDisposeEventListener(collection, "collectionchange", listView, function (e) {
            onCollectionChange(listView, e.detail);
        });

        msls_addAutoDisposeChangeListener(collection, "state", listView, function () {
            onCollectionStateChange(listView);
        });

        msls_addAutoDisposeChangeListener(collection, "selectedItem", listView, function () {
            onCollectionSelectedItemChange(listView);
        });

        msls_mark(msls_codeMarkers.listViewLoadStart);
        if (collection.state !== _VisualCollectionState.idle) {
            joinVisualCollectionExecution(listView);

        } else {
            loadMoreEntities(listView);
        }
    }

    msls_defineClass("ui.controls", "ListView", function ListView(view) {
        msls_ui_Control.call(this, view);
    }, msls_ui_Control, {
        controlName: "ListView",
        itemTap: msls_controlProperty(),

        _attachViewCore: function (templateData) {

            var listView = this,
                ulElement = listView._ulElement =
                msls_control_find(listView.getView(), "ul"),
                scrollHelper,
                contentItem = listView.data,
                collection = listView._collection = contentItem.value,
                controlModel = contentItem.controlModel,
                isTileList = controlModel.id === ":TileList";

            ulElement.parent().addClass("msls-vstretch msls-vscroll");
            if (isTileList) {
                ulElement.addClass("msls-tile-list");
            }
            ulElement.append('<div class="msls-clear msls-empty" />');

            scrollHelper = listView._scrollHelper =
            new msls.ui.controls.ScrollHelper(listView._ulElement);

            if (!listView._headerLabel) {
                listView._headerLabel = new msls.ui.controls.Text(
                    $("." + msls_control_header, listView.getView()));

                var isVisible = contentItem.properties[builtInModule.controlPropertyShowHeaderName];
                msls_addOrRemoveClass(listView._headerLabel.getView(), !isVisible, msls_collapsed);

                var headerTextBinding = new msls.data.DataBinding(
                    "data.displayName", listView, "text", listView._headerLabel,
                    msls_data_DataBindingMode.oneWayFromSource);
                headerTextBinding.bind();
            }
            listView._headerLabel.render();

            if (!collection) {
                return;
            }

            addItemEventHandlers(listView);

            function onLayoutUpdated() {
                msls_unsubscribe(msls_layout_updatedNotification, onLayoutUpdated);
                msls_dispatch(function () {
                    onCreated(listView);
                });
            }

            msls_subscribe(msls_layout_updatedNotification, onLayoutUpdated);
            scrollHelper.addEventListener("scroll", function () {
                tryLoadMoreEntities(listView);
            });

            msls_notify(initializedNotification, listView);
            msls_ui_Control.prototype._attachViewCore.call(listView, templateData);
        },

        _onDispose:
            function _onDispose() {
                var ulElement = this._ulElement,
                    onItemClicked = this._itemClickedHandler,
                    ulHtmlElement;
                if (this._headerLabel) {
                    msls_dispose(this._headerLabel);
                    this._headerLabel = null;
                }

                if (this.itemTap) {
                    msls_dispose(this.itemTap);
                    this.itemTap = null;
                }

                if (!!ulElement && !!onItemClicked) {
                    ulHtmlElement = ulElement[0];
                    ulHtmlElement.removeEventListener("click", onItemClicked, true);
                }

                this._ulElement = null;
                this._collection = null;
                this._scrollHelper = null;
            }
    }, {
        _fillTemplate:
            function _fillTemplate(view, contentItem, templateData) {

                var ulContainerClass = "",
                    rowTemplateContentItem = contentItem.children[0];

                if (contentItem._isVStretch) {
                    ulContainerClass = ' class="msls-vstretch ';
                }
                if (!rowTemplateContentItem._isHStretch) {
                    ulContainerClass += " " + msls_layout_ignore_children;
                }
                ulContainerClass += '"';
                $(msls_stringFormat(listViewTemplate, ulContainerClass))
                    .appendTo(view);
            },
    });

    msls.ui.controls.ListView.prototype._propertyMappings = {
        properties: { itemTap: "itemTap" },
    };
}());

var msls_modalView;

(function () {
    var
        shownNotification = "dialogShown",
        closedNotification = "dialogClosed",
        overlay,
        dialog,
        showComplete,
        escapeElement = $("<pre/>");

    function createDiv() {
        return $("<div/>");
    }

    function createOverlay(parentElement) {

        return createDiv()
            .addClass(msls_msgbox_overlay)
            .addClass(msls_overlay)
            .appendTo(parentElement);
    }

    function createDialog(parentElement) {

        return createDiv()
            .addClass(msls_msgbox_container + " ui-body-a pop in")
            .css({
                display: "none"
            })
            .appendTo(parentElement);
    }

    function formatText(text) {


        escapeElement.text(text);
        text = escapeElement.html();
        return text.replace(/\n|\r\n/g, "<br>");
    }

    function addButtons(buttons) {
        var dialogButtons;

        if (!buttons || !Array.isArray(buttons)) {
            return;
        }

        buttons.forEach(function (buttonOption) {
            if (!!buttonOption && !!buttonOption.text) {
                if (!dialogButtons) {
                    dialogButtons = createDiv().appendTo(dialog);
                }

                $("<a href='#'>" + formatText(buttonOption.text) + "</a>").appendTo(dialogButtons).buttonMarkup({
                    theme: cssDefaultJqmTheme,
                    icon: buttonOption.icon,
                    iconpos: "left"
                }).bind("click", function onButtonVirtualClick() {
                    closeCore(buttonOption.result);
                });
            }
        });
    }

    function buildContent(options) {

        var title = options.title,
            message = options.message,
            buildContentCallback = options.buildContentCallback,
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            documentWindowOffset = $(window).scrollTop(),
            contentAttributes = {
                position: "absolute"
            },
            buildContentResult;

        if (title) {
            $("<h2>").addClass("msls-message-box-header")
                .html(formatText(title)).appendTo(dialog);
        }
        if (buildContentCallback) {
            buildContentResult = buildContentCallback(dialog);
        } else if (message) {
            createDiv().addClass("msls-message-box-message")
                .html(formatText(message)).appendTo(dialog);
        }

        addButtons(options.buttons);

        if (buildContentResult) {
            $.extend(contentAttributes, buildContentResult);
        } else {
            $.extend(contentAttributes, {
                top: documentWindowOffset + (windowHeight - dialog.height()) / 2,
                left: (windowWidth - dialog.width()) / 2
            });
        }
        dialog.css(contentAttributes);
        dialog.trigger("create");
    }

    function closeCore(result) {

        if (dialog) {
            msls_mark(msls_codeMarkers.modalViewCloseStart);

            var currentShowComplete = showComplete;

            dialog.remove();
            dialog = null;
            overlay.remove();
            overlay = null;
            showComplete = null;
            currentShowComplete(result);

            msls_mark(msls_codeMarkers.modalViewCloseEnd);
            msls_notify(closedNotification);
        }
    }

    msls_modalView = {
        show: function show(options) {


            msls_mark(msls_codeMarkers.modalViewShowStart);
            closeCore(msls_modal_DialogResult.none);

            var parentElement = options.parentToPage ? $.mobile.activePage : $("body"),
                promise;

            if (parentElement.length !== 1) {
                return;
            }

            overlay = createOverlay(parentElement);
            if (!options.buttons) {
                overlay.bind("click", function () {
                    msls_modalView.close();
                });
            }
            overlay.show();
            setTimeout(function () {
                if (overlay) {
                    overlay.addClass(msls_overlay_active);
                }
            }, 1);

            msls_suspendLayout();
            try {
                dialog = createDialog(parentElement);
                buildContent(options);
            } finally {
                msls_resumeLayout(false);
                msls_updateLayout(dialog);
            }
            dialog.show();

            promise = new WinJS.Promise(function (complete, error) {
                showComplete = complete;
            });

            msls_mark(msls_codeMarkers.modalViewShowEnd);
            msls_notify(shownNotification);

            return promise;
        },
        close: function close() {
            closeCore(msls_modal_DialogResult.none);
        },
        isOpen: function isOpen() {
            return !!dialog;
        }

    };
    msls_modal._modalView = msls_modalView;

}());

(function () {
    var _ModalPickerQueryObjectLoader,
        popupOpenedNotification = "modalPickerPopupOpened",
        popupClosedNotification = "modalPickerPopupClosed",
        contentItemService = msls.services.contentItemService,
        listViewModel;

    msls_defineClass(msls, "ModalPickerQueryObjectLoader",
        function ModalPickerQueryObjectLoader(
            query,
            disableTotalCount) {
            msls_CollectionLoader.call(this);

            msls_setProperty(this, "_baseQuery", query);
            if (disableTotalCount) {
                msls_setProperty(this, "_disableTotalCount", true);
            }
        },
        msls_CollectionLoader, {
            _getAddedEntities:
                function _getAddedEntities() {
                    return this._baseQuery._addedEntities;
                }
        }
    );
    _ModalPickerQueryObjectLoader = msls.ModalPickerQueryObjectLoader;
    msls_makeDataServiceQueryLoader(_ModalPickerQueryObjectLoader);

    function _isReadOnlyOrDisabled(me) {
        var contentItem = me.data;
        return (!contentItem || !contentItem.isEnabled || contentItem.isReadOnly);
    }

    function _fillTemplate(view, contentItem, templateData) {

        var element = $('<a class="id-element" data-role="button" data-icon="arrow-d" data-iconpos="right" data-theme="' + cssDefaultJqmTheme + '" />').appendTo(view);
        templateData.idElement = msls_getTemplateItemPath(view, element);
    }

    function _attachViewCore(templateData) {
        var me = this,
            element = me._element = msls_getTemplateItem(me.getView(), templateData.idElement, ".id-element"),
            itemViewModel = me.data.children[0],
            itemView;

        msls_ui_Control.prototype._attachViewCore.call(me, templateData);

        element.bind("click", function () {
            showPicker(me);
        });

        if (!itemViewModel) {
            return;
        }

        element.empty();
        itemView = new msls.ui.controls.ContentItemPresenter($("<div>").appendTo(element));
        itemView.parent = me;
        itemView.data = itemViewModel;
    }

    function _onDispose() {
        var me = this,
            visualCollection = me._visualCollection;
        if (!!visualCollection && !me.data.choicesSource) {
            msls_dispose(visualCollection);
        }
    }

    function showPicker(me) {

        if (_isReadOnlyOrDisabled(me)) {
            return;
        }

        var modalPickerContentItem = me.data,
            modalPickerContentItemModel = modalPickerContentItem.model,
            itemContentItemTemplate =
                modalPickerContentItem.children[0],
            loader,
            visualCollection = me._visualCollection,
            propertyModel,
            entityType,
            screenDetails,
            targetEntitySet,
            listViewControlModels,
            listView,
            listViewContentItem;

        if (!visualCollection) {
            visualCollection = modalPickerContentItem.choicesSource;

            if (!visualCollection) {
                propertyModel =  me.detailsProperty.getModel();
                entityType = propertyModel.propertyType;

                screenDetails = modalPickerContentItem.screen.details;
                msls_iterate(screenDetails.dataWorkspace.details.properties.all())
                .each(function (dataServiceProperty) {
                    msls_iterate(dataServiceProperty.value.details.properties.all())
                    .each(function (entitySetProperty) {
                        if (entitySetProperty.getModel().entityType === entityType) {
                            targetEntitySet = entitySetProperty.value;
                        }
                        return !targetEntitySet;
                    });

                    return !targetEntitySet;
                });

                loader = new _ModalPickerQueryObjectLoader(
                        targetEntitySet, msls_isCountlessEntityType(entityType));
                visualCollection =
                    new msls.VisualCollection(modalPickerContentItem.screen.details, loader);
            }

            me._visualCollection = visualCollection;
        }

        if (!listViewModel) {
            listViewControlModels = msls_findGlobalItems(
                function isControl(globalItem) {
                    return globalItem.id === ":List";
                });
            listViewModel = {
                kind: "Collection",
                view: listViewControlModels[0]
            };
        }

        listViewModel.name = modalPickerContentItemModel.name + "AutoGeneratedListView";
        listViewModel.displayName = itemContentItemTemplate.displayName;
        listViewModel.childContentItems = [
            itemContentItemTemplate.model
        ];

        listViewContentItem = contentItemService.createContentItemTree(
            modalPickerContentItem.screen, listViewModel, modalPickerContentItem);
        modalPickerContentItem.children.pop();
        listViewContentItem.__value = visualCollection;
        listViewContentItem.__details = null;

        msls_modalView.show({
            parentToPage: true,
            buildContentCallback: function buildContent(content) {

                var listViewContainerElement = $('<div class="msls-vstretch">').appendTo(content),
                    $window = $(window),
                    windowHeight = $window.height(),
                    windowWidth = $window.width();

                listView = new msls.ui.controls.ListView(listViewContainerElement);
                listView.data = listViewContentItem;

                listView.itemTap = new msls.BoundCommand(
                    "_onItemTap",
                    me,
                    msls_createBoundArguments(visualCollection, [{ binding: "selectedItem" }]));

                msls_notify(popupOpenedNotification, {
                    modalPicker: me,
                    listView: listView,
                });

                listView.render();
                listViewContainerElement.trigger("refresh");
                msls_updateLayout();

                return {
                    top: windowHeight / 8,
                    left: windowWidth / 4,
                    height: windowHeight * 3 / 4,
                    width: windowWidth / 2
                };
            }
        }).then(function () {
            msls_notify(popupClosedNotification, {
                modalPicker: me,
            });

            listViewContentItem.parent = null;
            msls_dispose(listView);
            msls_dispose(listViewContentItem);
        });
    }

    function _onItemTap(item) {
        if (_isReadOnlyOrDisabled(this)) {
            return;
        }

        this.detailsProperty.value = item;
        msls_modalView.close();
    }

    msls_defineClass("ui.controls", "ModalPicker",
        function ModalPicker(view) {
            var me = this;
            msls_ui_Control.call(me, view);
        },
        msls_ui_Control, {
            controlName: "ModalPicker",
            item: msls_controlProperty(
                null, null, true),

            _attachViewCore: _attachViewCore,
            _onItemTap: _onItemTap,
            _onDispose: _onDispose
        }, {
            _fillTemplate: _fillTemplate
        }
    );
    msls.ui.controls.ModalPicker.prototype._propertyMappings = {
        value: "item",
        details: "detailsProperty"
    };
    msls.ui.controls.ModalPicker.prototype._editableProperties = {
        item: "value"
    };
}());

(function () {
    function NoControl(view) {
        msls.ui.Control.call(this, view);
    }

    msls_defineClass("ui.controls", "NoControl", NoControl, msls.ui.Control, {
        controlName: "NoControl"
    });

    msls.ui.controls.NoControl.prototype._propertyMappings = {};
}());

(function () {
    function PhoneNumberEditor(view) {

        msls.ui.controls.TextBox.call(this, view);
    }

    function _fillTemplate(view, contentItem, templateData) {

        var template = '<input type="tel" class="id-element" />';

        $(template).appendTo(view);
        templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
    }

    msls_defineClass("ui.controls", "PhoneNumberEditor", PhoneNumberEditor, msls.ui.controls.TextBox, {
        controlName: "PhoneNumberEditor"
    }, {
        _fillTemplate: _fillTemplate
    });

    msls.ui.controls.PhoneNumberEditor.prototype._propertyMappings = {
        stringValue: "text",
        maxLength: "maxLength"
    };
}());

(function () {

    function dispatchEventOverride(type, details, baseDispatchEvent) {

        baseDispatchEvent.call(this, type, details);
        if (type !== "change") {
            return;
        }

        switch (details) {
            case "task":
                this.refreshView();
                break;

            case "activeTab":
                _setActiveTab(this);
                break;

            case "areButtonsVisible":
                msls_updateLayout();
                break;
        }
    }

    function _fillTemplate(view, contentItem, templateData) {
        $('<ul class="tabs-container" data-role="controlgroup" data-type="horizontal" />').appendTo(view);
    }

    function _attachViewCore(templateData) {
        var me = this;

        msls_ui_Control.prototype._attachViewCore.call(me, templateData);
        this.refreshView();
    }

    function refreshView() {
        var me = this,
            task = me.task,
            container,
            visibilityHelper,
            visibilityBinding;
        if (!me._isViewCreated) {
            return;
        }

        if (!task) {
            return;
        }

        container = msls_control_find(me.getView(), ".tabs-container");
        container.empty();
        me._buttons = [];
        me._contentItems = [];

        var pages = task.screen.details.pages;
        $.each(task.tabCommands, function (index, tabViewModel) {
            var buttonView = $('<div class="subControl" control="Button"/>'),
                tabView = $("<li class='" + msls_screen_tab + "'></li>").append(buttonView),
                button = new msls.ui.controls.Button(buttonView),
                tabContentItem = msls_iterate(pages).first(function (page) { return page.name === tabViewModel.name; });

            button.render();
            me._buttons.push(button);
            me._contentItems.push(tabContentItem);
            button.data = tabViewModel;
            tabView.data("msls-tabName", tabViewModel.name);

            (new msls.data.DataBinding("data.displayName", button, "content", button, msls_data_DataBindingMode.oneWayFromSource)).bind();

            (new msls.data.DataBinding("data.command", button, "tap", button, msls_data_DataBindingMode.oneWayFromSource)).bind();

            (new msls.data.DataBinding("tap.canExecute", button, "isEnabled", button)).bind();

            visibilityHelper = new msls.ui.helpers.ObservableVisibility(button.getView());
            visibilityBinding = new msls.data.DataBinding("isVisible", tabContentItem, "value", visibilityHelper,
                msls_data_DataBindingMode.oneWayFromSource);
            visibilityBinding.bind();

            msls_addLifetimeDependency(button, visibilityHelper);

            button.parent = me;
            container.append(tabView);
        });

        visibilityHelper = new msls.ui.helpers.ObservableVisibility(me.getView());
        visibilityBinding = new msls.data.DataBinding("areButtonsVisible", me, "value", visibilityHelper,
                msls_data_DataBindingMode.oneWayFromSource);
        visibilityBinding.bind();

        msls_addLifetimeDependency(me, visibilityHelper);

        me._ul = container;
        _setActiveTab(me);
    }

    function _setActiveTab(me) {

        var navigationUnit = me.data;
        if (navigationUnit) {
            if (me._ul) {
                $("." + msls_screen_tab_active, me._ul).removeClass(msls_screen_tab_active);
            }
            for (var i = 0; i < me._buttons.length; i++) {
                var button = me._buttons[i],
                    commandVM = button.data;
                if (!!commandVM && commandVM.name === me.activeTab) {
                    var tabView = button.getView().parent();
                    tabView.addClass(msls_screen_tab_active);
                }
            }
        }
    }

    function areButtonsVisible_compute() {
        var isVisible = !this.task.screen.details.rootContentItem.properties[builtInModule.controlPropertyHideTabTitlesName],
            countVisibleTabs = 0;

        for (var i = 0; i < this._contentItems.length; i++) {
            var contentItem = this._contentItems[i];
            if (contentItem.isVisible) {
                countVisibleTabs++;
            }
        }

        return isVisible && countVisibleTabs > 1;
    }

    msls_defineClass("ui.controls", "ScreenTabs", function (view) {

        this._buttons = [];
        this._contentItems = [];
        msls_ui_Control.call(this, view);
    }, msls.ui.Control, {
        controlName: "ScreenTabs",
        _attachViewCore: _attachViewCore,
        refreshView: refreshView,
        dispatchEvent: msls_dispatchEventOverride(dispatchEventOverride),

        activeTab: msls_observableProperty(),
        hideTabTitles: msls_observableProperty(),
        task: msls_observableProperty(),

        areButtonsVisible: msls_computedProperty(areButtonsVisible_compute),
    }, {
        _fillTemplate: _fillTemplate
    });
}());

var msls_shellView;

(function () {

    var forwardButtonIgnoredNotification = "forwardButtonIgnoredNotification",
        taskDataName = "msls-screen",
        msls_dismiss_dialog = "msls-dismiss-dialog",
        data_msls_tabName = "msls-tab-name",
        $body,
        $empty = $([]),
        $mainButtonsContainer,
        $saveButton,
        $homeButton,
        $dialogOverlay,
        $progressOverlay,
        $progressIcon,
        saveIconClasses = "msls-progress-icon msls-progress-save-icon",

        delayBeforeShowingCommandProgress = 2000,
        showProgressOverlayAtTime = null,
        isModalViewVisible = false,
        progressOverlayActive = false,
        longRunningCount = 0;

    if ($.mobile) {
        $.mobile.autoInitializePage = false;

        $.mobile.pushStateEnabled = false;

        $.mobile.ajaxLinksEnabled = false;
    }

    function initialize() {

        var me = this;
        $body = $("body");

        $body.attr("data-theme", cssDefaultJqmTheme);

        _registerTransitionHandler();

        $(window).bind("beforeunload", function () {
            if (_anyNavigationUnitHasChanges()) {
                return msls_getResourceString("shell_unsaved_message");
            } else {
                return;
            }
        });

        _bindAsFirstHandler($(window), "hashchange", function (e) {
            _handleHashChange(me, e);
        });

        msls_subscribe(msls_layout_updatingNotification, function () {
            if (msls_shell.activeNavigationUnit) {
                var unit = msls_shell.activeNavigationUnit;
                _setDialogMaxSize(me, _findPageIdFromNavigationUnit(me, unit), unit);
            }
        });

        msls_subscribe(msls_shell_activeNavigationUnitChangedNotification, function () {
            _setMainButtonsVisibility(me, msls_shell.activeNavigationUnit.task);
        });
        msls_subscribe(msls_commandProgressStartNotification, function () {
            startPossibleLongRunningOperation(me);
        });
        msls_subscribe(msls_commandProgressCompleteNotification, function () {
            stopPossibleLongRunningOperation(me);
        });
        msls_subscribe(msls_shellCommandStartNotification, function (e) {
            if (e.detail.name === "saveChanges") {
                $progressIcon.addClass(saveIconClasses);
                startPossibleLongRunningOperation(me, 50);
            }
        });
        msls_subscribe(msls_shellCommandCompleteNotification, function (e) {
            if (e.detail.name === "saveChanges") {
                stopPossibleLongRunningOperation(me);
                $progressIcon.removeClass(saveIconClasses);
            }
        });
        msls_subscribe("dialogShown", function () {
            isModalViewVisible = true;
        });
        msls_subscribe("dialogClosed", function () {
            isModalViewVisible = false;
            _resetProgressOverlayCounter(me);
        });

        _createMainButtons();
        _createOverlays();
    }

    function _resetProgressOverlayCounter(me) {
        showProgressOverlayAtTime = 0;
        _setProgressOverlayCounter(me);
    }

    function _setProgressOverlayCounter(me, delayOverride) {

        if (longRunningCount > 0) {
            var delay = delayOverride ? delayOverride : delayBeforeShowingCommandProgress;

            var showAtTime = Date.now() + delay;
            if (!showProgressOverlayAtTime || showAtTime < showProgressOverlayAtTime) {
                showProgressOverlayAtTime = showAtTime;
                setTimeout(function () {
                    _checkShowProgressOverlay(me);
                }, delay + 1);
            }
        }
    }

    function _checkShowProgressOverlay(me) {

        if (!!showProgressOverlayAtTime &&
                Date.now() >= showProgressOverlayAtTime && !isModalViewVisible &&
                longRunningCount > 0) {
            progressOverlayActive = true;
            _updateProgressOverlay(me);
        }
    }

    function startPossibleLongRunningOperation(me, delayOverride) {

        longRunningCount++;
        _setProgressOverlayCounter(me, delayOverride);
    }

    function stopPossibleLongRunningOperation(me) {

        longRunningCount--;

        if (longRunningCount <= 0) {
            progressOverlayActive = false;
            showProgressOverlayAtTime = null;
            _updateProgressOverlay(me);
        }
    }

    function navigate(targetUnit) {
        var me = this;
        return new WinJS.Promise(function initNavigate(complete, error) {
            navigateCore(me, targetUnit, complete, error);
        });
    }

    function navigateCore(me, targetUnit, complete, error) {
        var pageId;

        if (me._initializeMobileOnce) {

            if (window.location.hash) {

                _restartApplication();
            }

            me.initialize();
        }

        if (targetUnit === msls_shell.activeNavigationUnit) {
            _switchToTab(me, targetUnit, complete);
            return;
        }

        var existingPageId = _findPageIdFromNavigationUnit(me, targetUnit);
        if (existingPageId) {

            _goToPageInHistory(me, $.mobile.activePage[0].id, existingPageId, false, function () {

                var existingViewInfo = me._pageIdMapping[existingPageId];
                _showOrHideDialogBackground(existingViewInfo);

                complete();
                msls_mark(msls_codeMarkers.navigationEnd);
            });

            return;
        }

        var prefix = "";


        pageId = _createUniquePageId(me, prefix);

        if (!me._firstPageId) {
            me._firstPageId = pageId;
        }

        var viewInfo = {
            pageId: pageId,
            unit: targetUnit
        };
        me._pageIdMapping[pageId] = viewInfo;
        me._pageIdToIndexMapping[pageId] = targetUnit.index;

        var createFunction = targetUnit.popup ? _createDialog : _createPage,
            page = createFunction(me, pageId, targetUnit);

        if (targetUnit.popup) {
            var previousViewInfo = me._pageIdMapping[$.mobile.activePage[0].id];
            viewInfo.backgroundPageId = previousViewInfo.backgroundPageId ? previousViewInfo.backgroundPageId : $.mobile.activePage[0].id;

            page.click(function (e) {
                if ($(e.target).hasClass(msls_dismiss_dialog)) {
                    msls_shell.navigateBack();
                }
            });
        }
        _showOrHideDialogBackground(viewInfo);

        if (me._initializeMobileOnce) {

            me._initializeMobileOnce = false;

            page.css("opacity", 0);

            _awaitPageChange(me, pageId)
            .then(function success2() {
                $(msls_id_app_loading_selector).remove();

                _transitionOpeningScreen(me, $.mobile.activePage, function () {
                    complete();
                });
            }, function failure(e) {
                error(e);
            });

            $.mobile.initializePage();
        } else {

            var transitionName = targetUnit.popup ? msls_dialog_transition :
                msls_screen_transition;

            _navigateToPage(me, page, transitionName, false, complete, error);
        }
    }

    function _showOrHideDialogBackground(viewInfo) {
        $(".ui-page").removeClass(msls_background_page);
        var backgroundPageId = viewInfo.backgroundPageId;
        if (backgroundPageId) {
            $("#" + backgroundPageId).addClass(msls_background_page);
        }
    }

    function _createHeader(me, task) {

        var $header = $("<div class='" + msls_task + " " + msls_vauto + " ui-bar-a ui-header " + msls_header +
                "' data-role='header' role='banner'></div>"),
            headerControl = new msls.ui.controls.ContentControl($header);
        headerControl.dataTemplate = $(taskHeaderTemplateSelector);
        headerControl.data = task;
        headerControl.render();

        var isBackVisible = _isBackButtonVisible(me, task);
        if (!isBackVisible) {
            $(".msls-back-button", $header).addClass(msls_collapsed);
        } else {
            $(".msls-logo", $header).addClass(msls_collapsed);
        }

        $("." + msls_logo + " img", $header).error(function () {
            $("." + msls_logo).addClass(msls_collapsed);
        });

        msls_addLifetimeDependency(task, headerControl);
        return $header;
    }

    function _createMainButtons() {

        $mainButtonsContainer = $("<div id='" + msls_id_main_buttons + "' class='ui-bar-a msls-header " + msls_layout_ignore + "'></div>");
        var containerControl = new msls.ui.controls.ContentControl($mainButtonsContainer);
        containerControl.dataTemplate = $(msls_id_main_buttons_template_selector);
        containerControl.data = msls_shell;
        containerControl.render();
        $mainButtonsContainer.appendTo($body)
            .addClass(msls_collapsed);

        $saveButton = $(".msls-save-button", $mainButtonsContainer);
        $homeButton = $(".msls-home-button", $mainButtonsContainer);

        $mainButtonsContainer.trigger("create");
    }

    function _createOverlays() {
        $dialogOverlay = $("<div id='" + msls_id_dialog_overlay + "' class='" + _join(msls_overlay, msls_layout_ignore, msls_collapsed) + "'></div>")
            .appendTo($body);

        $progressOverlay = $("<div id='" + msls_id_progress_overlay + "' class='" + _join(msls_overlay, msls_layout_ignore, msls_collapsed) +
            "'><div class='msls-progress'><div class='" + msls_progress_icon + "'></div></div></div>")
            .appendTo($body);
        $progressIcon = $("." + msls_progress_icon, $progressOverlay);
    }

    function _createPage(me, pageId, navigationUnit) {

        var $page = _createEmptyPage(pageId, false);

        var $header = _createHeader(me, navigationUnit.task).appendTo($page);

        var $pageContainer = $("<div data-role='content' class='" + _join(msls_tab_content_container, msls_content, msls_vstretch, msls_vscroll) + "'/>").appendTo($page);

        var tabsBarControl = new msls.ui.controls.ContentControl($pageContainer);
        tabsBarControl.dataTemplate = $(tabsBarTemplateSelector);
        tabsBarControl.data = navigationUnit.task;
        tabsBarControl.render();

        msls_addLifetimeDependency(navigationUnit, tabsBarControl);

        var $tabContent = _createTabContent(me, $page, navigationUnit, false)
                .addClass(msls_tab_content_active);

        var applicationDefinition = msls_getApplicationDefinition();
        var spEnabled = msls_iterate(applicationDefinition.globalItems).first(function (i) { return i[":@SharePointEnabled"]; });
        if (spEnabled) {
            _createSharePointChrome($page, navigationUnit);
        }

        return $page;
    }

    function _createSharePointChrome($page, navigationUnit) {

        var $chrome = $("<div class='" + msls_sharePoint_chrome + " " + msls_vauto + "'></div>");
        var containerControl = new msls.ui.controls.ContentControl($chrome);
        containerControl.dataTemplate = $(sharePointChromeTemplateSelector);
        containerControl.render();
        $chrome.prependTo($page);

        $body.addClass(msls_sharePoint_enabled);

        msls_addLifetimeDependency(navigationUnit, containerControl);
    }


    function _createTabContent(me, $page, navigationUnit, enhance) {
        var tabName = navigationUnit.pageName,
            $tabsContainer = $("." + msls_tab_content_container, $page),
            $tabContentRoot = $("<div class=''></div>").appendTo($tabsContainer),
            $tabContent = _createPageContent(me, navigationUnit, $tabContentRoot)
                .addClass(msls_tab_content)
                .attr(data_msls_tabName, tabName);

        if (enhance) {
            $tabContent.trigger("create");
        }

        return $tabContent;
    }

    function _switchToTab(me, navigationUnit, complete) {

        var tabName = navigationUnit.pageName,
            viewInfo = me._pageIdMapping[_findPageIdFromNavigationUnit(me, navigationUnit)],
            $page = $("#" + viewInfo.pageId),
            tabContent = msls_iterate($("." + msls_tab_content, $page).toArray())
                .where(function (element) {
                    return $(element).attr(data_msls_tabName) === tabName;
                }).first(),
            needsImmediateLayout = false;

        var $tabContent;
        if (!tabContent) {
            msls_suspendLayout();
            try {
                $tabContent = _createTabContent(me, $page, navigationUnit, true);
                needsImmediateLayout = true;
            } finally {
                msls_resumeLayout(false);
            }
        } else {
            $tabContent = $(tabContent);
        }

        var $fromContent = $("." + msls_tab_content_active, $page),
            $toContent = $tabContent;
        _transitionTabs(me, $fromContent, $toContent, needsImmediateLayout, complete);
    }

    function _createDialog(me, pageId, navigationUnit) {


        var dialogPage = _createEmptyPage(pageId, true),
            topRow = $("<div class='msls-vstretch " + msls_dismiss_dialog + "' data-msls-weight='5'></div>").appendTo(dialogPage),
            middleRow = $("<div class='" + msls_dismiss_dialog + " " + msls_columns_layout + "' data-msls-weight='85'></div>").appendTo(dialogPage),
            bottomRow = $("<div class='msls-vstretch " + msls_dismiss_dialog + "' data-msls-weight='10'></div>").appendTo(dialogPage);
        dialogPage.addClass(msls_dialog);
        dialogPage.addClass(msls_rows_layout);

        var middleLeft = $("<div class='msls-hstretch " + msls_dismiss_dialog + "' data-msls-weight='10' style='min-height: 1px'></div>").appendTo(middleRow),
            frame = $("<div class='msls-dialog-frame ui-body-" + cssDefaultJqmTheme + "' data-msls-weight='80'></div>").appendTo(middleRow),
            middleRight = $("<div class='msls-hstretch " + msls_dismiss_dialog + "' data-msls-weight='10' style='min-height: 1px'></div>").appendTo(middleRow);

        $("<div class='msls-hempty msls-clear'></div>").appendTo(middleRow);
        var header = $("<div class='msls-vauto'></div>").appendTo(frame),
            headerControl = new msls.ui.controls.ContentControl(header),
            pageContentContainer = $("<div class='msls-hscroll msls-vscroll'></div>").appendTo(frame);
        headerControl.dataTemplate = $(dialogHeaderTemplateSelector);
        headerControl.data = navigationUnit;
        headerControl.render();

        var dialogContentItem = navigationUnit.contentItemTree,
            isHStretch = dialogContentItem._isHStretch,
            isVStretch = dialogContentItem._isVStretch;
        msls_addOrRemoveClass(middleRow, isVStretch, msls_vstretch, msls_vauto);
        msls_addOrRemoveClass(frame, isHStretch, msls_hstretch, msls_hauto);
        msls_addOrRemoveClass(frame, isVStretch, msls_vstretch, msls_vauto);
        msls_addOrRemoveClass(pageContentContainer, isVStretch, msls_vstretch, msls_vauto);

        var content = _createPageContent(me, navigationUnit, pageContentContainer);

        if (navigationUnit.boundaryOption === msls_BoundaryOption.nested) {
            $(".msls-close-button", header).addClass(msls_collapsed);
        } else {
            $(".msls-ok-button", header).addClass(msls_collapsed);
            $(".msls-cancel-button", header).addClass(msls_collapsed);
        }

        _setDialogMaxSize(me, pageId, navigationUnit);

        return dialogPage;
    }

    function _setDialogMaxSize(me, pageId, navigationUnit) {


        if (!navigationUnit || !navigationUnit.popup) {
            return;
        }
        var contentItem = navigationUnit.contentItemTree;
        if (contentItem._isVStretch && contentItem._isHStretch) {
            return;
        }

        var frameElement = document.getElementById(pageId).getElementsByClassName("msls-dialog-frame")[0],
            frameStyle = window.getComputedStyle(frameElement),
            header = $(frameElement.firstChild),
            pageContentContainer = $(frameElement.lastChild),
            wrappedWindow = $(window),
            headerHeight = header.height();


        headerHeight = 47;

        var maxWidth, maxHeight;
        if (!contentItem._isVStretch) {
            maxWidth = Math.round((wrappedWindow.width() * 0.8)) + "px";
            if (pageContentContainer.css("max-width") !== maxWidth) {
                pageContentContainer.css("max-width", maxWidth);
                msls_updateLayout();
            }
        }
        if (!contentItem._isHStretch) {
            maxHeight = Math.round((wrappedWindow.height() * 0.85 -
                headerHeight - parseFloat(frameStyle.paddingTop) - parseFloat(frameStyle.paddingBottom))) + "px";
            if (pageContentContainer.css("max-height") !== maxHeight) {
                pageContentContainer.css("max-height", maxHeight);
                msls_updateLayout();
            }
        }

    }

    function _createPageContent(me, navigationUnit, root) {


        var pageRootControl = new msls.ui.controls.ContentItemPresenter(root);
        pageRootControl.data = navigationUnit.contentItemTree;

        pageRootControl.render();


        msls_addLifetimeDependency(navigationUnit, pageRootControl);

        return root;
    }

    function _createEmptyPage(pageId, isDialog) {


        var page = $("<div data-role='page'" +
            (isDialog ? "" : "class='msls-vstretch'") +
            "></div>").appendTo($body);
        page.attr("data-theme", cssDefaultJqmTheme);
        page.attr("id", pageId);
        page.attr("data-url", pageId);

        return page;
    }

    function _isBackButtonVisible(me, task) {

        if (true || true) {
            return !task.home;
        } else {

            var unitsInReverse = msls_shell.findNavigationUnits().reverse();
            if (unitsInReverse.length === 0) {
                return false;
            }

            var showBackButton,
                lastScreen = unitsInReverse[0].screen;
            $.each(unitsInReverse, function (index, navigationUnit) {
                if (navigationUnit.screen !== lastScreen) {
                    showBackButton = true;

                    return false;
                } else if (navigationUnit.boundaryOption !== msls_BoundaryOption.none) {
                    showBackButton = false;

                    return false;
                } else {
                    return true;
                }
            });

            showBackButton = !!showBackButton;

            return showBackButton;
        }
    }

    function _createUniquePageId(me, prefix) {

        var id,
            ceiling = 4294967296;
        while (!id || id in me._pageIdToIndexMapping) {
            var startLetter = (Math.floor(Math.random() * 6 + 10)).toString(16);

            id = prefix + startLetter + (Math.floor(Math.random() * ceiling)).toString(16);
        }

        return id;
    }

    function _ignoreNextHashChange(me) {
        me._ignoreHashChangeOnce = true;
        return new WinJS.Promise(function (complete) {
            me._completeOnHashChange = complete;
        });
    }

    function _handleHashChange(me, e) {


        if (me._ignoreHashChangeOnce || me._stopHashChangePropagationOnce) {

            me._ignoreHashChangeOnce = false;

            if (me._stopHashChangePropagationOnce) {
                e.stopImmediatePropagation();
            }
            me._stopHashChangePropagationOnce = false;

            if (me._completeOnHashChange) {
                msls_dispatch(function () {
                    var completeOnHashChange = me._completeOnHashChange;
                    me._completeOnHashChange = null;
                    completeOnHashChange();
                });
            }

            return;
        }


        if (!$.mobile.activePage) {
            return;
        }

        msls_mark(msls_codeMarkers.navigationStart);
        var newPageId = window.location.hash.replace(/^#/, ""),
                previousPageId = $.mobile.activePage[0].id;

        newPageId = newPageId || me._firstPageId;


        var newNavigationUnitInfo = me._pageIdMapping[newPageId],
            newNavigationUnit = newNavigationUnitInfo ? newNavigationUnitInfo.unit : null;

        e.stopImmediatePropagation();

        var hideHashChangeFromJqueryMobile = true;

        if (msls_modal.isOpen()) {
            _goToPageInHistory(me, newPageId, previousPageId, hideHashChangeFromJqueryMobile, function () {
                msls_modal.close();
            });

            return;
        }

        function helper_handleBack(operation) {
            _goToPageInHistory(me, newPageId, previousPageId, hideHashChangeFromJqueryMobile, operation.code(function () {

                if (newNavigationUnit) {
                    msls_shell.requestNavigateBack(newNavigationUnit)
                    .then(function success(result) {
                        operation.complete(result);
                    }, function failure(error) {
                        msls_modal_showError(error).then(function () {
                            msls_dispatch(function () {
                                operation.error(error);
                            });
                        });
                    });
                } else {

                    msls_notify(forwardButtonIgnoredNotification, me);
                    operation.complete();
                }
            }));
        }

        if (msls_shell.navigationInProgress) {
            return;
        } else {
            msls_notify("BrowserBackPromise",
                msls_shell._startNavigationOperation(null, helper_handleBack));
        }
    }

    function _navigateToPage(me, jqueryMobilePage, transitionName, reverse, complete, error) {

        var promises = [];

        promises.push(_awaitPageChange(me, jqueryMobilePage[0].id));

        promises.push(_ignoreNextHashChange(me));

        WinJS.Promise.join(promises)
        .then(function success() {

            complete();
        }, function failure(e) {
            error(e);
        });

        $.mobile.changePage(jqueryMobilePage, { transition: transitionName, reverse: false });
    }

    function _awaitPageChange(me, expectedPageId) {

        return new WinJS.Promise(function initAwaitPageChange(complete, error) {
            $(window).one("pageshow", function () {
                var newActivePage = $.mobile.activePage;
                if (!!newActivePage && (newActivePage.length === 1) && (newActivePage[0].id === expectedPageId)) {
                    complete();
                    msls_mark(msls_codeMarkers.navigationEnd);
                } else {
                    error(msls_getResourceString("shell_nav_failed"));
                }
            });
        });
    }

    function _createValidHash(s) {

        return s.replace(/[^a-zA-Z0-9]/g, "-");
    }

    function _findPageIdFromNavigationUnit(me, navigationUnit) {

        var pageId;
        $.each(me._pageIdMapping, function (id, info) {
            if (info.unit === navigationUnit) {
                pageId = id;
            }
        });

        return pageId;
    }

    function _goToPageInHistory(me, currentPageId, targetPageId, hideHashChangeFromJqueryMobile, doneHandler) {


        var
            currentIndex = me._pageIdToIndexMapping[currentPageId],
            targetIndex = me._pageIdToIndexMapping[targetPageId];

        if (typeof currentIndex === "undefined" || typeof targetIndex === "undefined") {
            _restartApplication();
            return;
        }

        if (targetIndex !== currentIndex) {
            var promises = [];

            promises.push(_ignoreNextHashChange(me));

            if (hideHashChangeFromJqueryMobile) {
                me._stopHashChangePropagationOnce = true;
            } else {
                promises.push(_awaitPageChange(me, targetPageId));
            }

            WinJS.Promise.join(promises)
            .then(function success() {
                var actualId = window.location.hash.replace(/^#/, "") || me._firstPageId;
                if (actualId === targetPageId) {
                    msls_dispatch(function () {
                        doneHandler();
                    });
                } else {
                    doneHandler(msls_getResourceString("shell_nav_failed"));
                }
            }, function failure(error) {
                doneHandler(error);
            });

            window.history.go(targetIndex - currentIndex);
        } else {
            doneHandler();
        }
    }

    function _anyNavigationUnitHasChanges() {
        for (var id in msls_shell.navigationStack) {
            if (msls_shell.navigationStack[id].hasChanges) {
                return true;
            }
        }
        return false;
    }

    function _bindAsFirstHandler(source, type, handler) {

        var
        previousEvents = source.data("events"),
        previousHashChangeEvents = previousEvents[type],
        copyOfEvents = previousHashChangeEvents.slice(0),
        i;

        source.unbind(type);
        source.bind(type, handler);
        $.each(copyOfEvents, function (index, handler2) {
            source.bind(type, handler2);
        });
    }

    function _restartApplication() {
        window.location.replace(window.location.href.replace(/#.*/, ""));
        return;
    }

    function onNavigationUnitClosed(navigationUnit) {

        var pageId = _findPageIdFromNavigationUnit(this, navigationUnit),
            unitViewInfo = this._pageIdMapping[pageId];

        if (pageId) {

            delete this._pageIdMapping[pageId];
            var element = $("#" + pageId, $.mobile.pageContainer);
            element.remove();
        }
        var task = unitViewInfo.unit.task,
            taskUses = msls_getValues(this._pageIdMapping).filter(function (infoEntry) {
                return infoEntry.unit.task === task;
            });

        if (!taskUses.length) {
            var screenObject = task.screen;

            msls_dispose(task);
            msls_dispose(screenObject.details);
        }
    }


    function _updateProgressOverlay(me) {

        if (progressOverlayActive) {
            if ($progressOverlay.hasClass(msls_collapsed)) {
                $progressOverlay.removeClass(_join(msls_collapsed, msls_overlay_active));
            }

            setTimeout(function () {
                if (progressOverlayActive) {
                    $progressOverlay.addClass(msls_overlay_active);
                }
            }, 1);
        } else {
            if (!$progressOverlay.hasClass(msls_collapsed)) {
                $progressOverlay.removeClass(msls_overlay_active);

                setTimeout(function () {
                    if (!progressOverlayActive) {
                        $progressOverlay.addClass(msls_collapsed).removeClass(msls_overlay_active);
                    }
                }, 200);
            }
        }
    }


    function _computeIsSaveButtonVisible() {
        var task, screenObject;
        if (!!msls_shell.activeNavigationUnit &&
            !!(task = msls_shell.activeNavigationUnit.task) &&
            !!(screenObject = task.screen)) {
            var showSaveButton = screenObject.details.rootContentItem.properties[builtInModule.controlPropertyShowSaveButtonName];
            if (showSaveButton === "Never") {
                return false;
            } else if (showSaveButton === "Dirty") {
                return msls_shell.canSaveChanges;
            } else {
                return true;
            }
        }

        return false;
    }

    function _setMainButtonsVisibility(me, task) {

        var showOkayCancel = task.taskBoundaryOption === msls_BoundaryOption.nested;

        msls_addOrRemoveClass($("." + msls_save_home_buttons, $mainButtonsContainer), showOkayCancel, msls_collapsed);
        msls_addOrRemoveClass($("." + msls_okay_cancel_buttons, $mainButtonsContainer), !showOkayCancel, msls_collapsed);

        msls_addOrRemoveClass($homeButton, task.home, msls_collapsed);

        $mainButtonsContainer.removeClass(msls_collapsed);
    }

    function lightSwitchTransitionHandler(transitionName, reverse, $to, $from) {
        var me = msls.shellView,
            deferred = new $.Deferred();

        function onComplete() {
            deferred.resolve();
        }

        switch (transitionName) {
            case msls_screen_transition:
                _transitionScreens(me, transitionName, reverse, $to, $from, onComplete);
                break;

            case msls_dialog_transition:
                _transitionDialog(me, transitionName, reverse, $to, $from, onComplete);
                break;

            case "none":
                if ($from) {
                    $from.removeClass(ui_page_active);
                }
                $to.addClass(ui_page_active);
                onComplete();
                break;

            default:
                deferred.reject("Unexpected transition name: " + transitionName);
                break;
        }

        return deferred.promise();
    }

    function _transitionScreens(me, transitionName, reverse, $to, $from, complete) {

        var forward = !reverse;
        if (forward) {
            msls_suspendLayout();
        }
        _transition(me,
            {
                transitionName: transitionName,
                stage1Delay: 167,
                stage3Delay: 167,
                reverse: reverse,
                $ins: $to,
                $outs: $from,
                onStage2: function () {
                    $to.addClass(ui_page_active);

                    if (forward) {
                        msls_resumeLayout(false);
                        return _updateLayoutAndWaitToFinish($to);
                    }

                    return true;
                },
                onCleanup: function () {
                    $from.removeClass(ui_page_active);
                    if (reverse) {
                        msls_updateLayout();
                    }
                },
                onComplete: complete
            });
    }

    function _transitionTabs(me, $fromContent, $toContent, needsImmediateLayout, complete) {

        var transitionName = msls_tab_transition,
            $container = $fromContent.parent(),
            hasVScroll = $container.hasClass(msls_vscroll);

        if (hasVScroll) {
            $container.removeClass(msls_vscroll);
        }
        _transition(me,
            {
                transitionName: transitionName,
                reverse: false,
                stage1Delay: 167,
                stage3Delay: 167,
                $ins: $toContent,
                $outs: $fromContent,
                onStage2: function () {
                    if (needsImmediateLayout) {
                        return _updateLayoutAndWaitToFinish($toContent);
                    }

                    return true;
                },
                onStage3: function () {
                    $toContent.addClass(msls_tab_content_active);
                },
                onCleanup: function () {
                    $fromContent.removeClass(msls_tab_content_active);
                    if (!needsImmediateLayout) {
                        msls_updateLayout();
                    }
                    if (hasVScroll) {
                        $container.addClass(msls_vscroll);
                    }
                },
                onComplete: complete
            });
    }

    function _transitionDialog(me, transitionName, reverse, $to, $from, complete) {

        var forward = !reverse;
        if (forward) {
            msls_removeClasses($dialogOverlay, msls_collapsed, msls_overlay_active);
            msls_suspendLayout();
        }

        _transition(me,
            {
                transitionName: transitionName,
                reverse: reverse,
                stage1Delay: 1,
                stage3Delay: forward ? 167 : 267,
                $ins: $to,
                $outs: $from,
                onStage1: function () {
                    $to.addClass(ui_page_active);
                    if (!reverse) {
                        $dialogOverlay.addClass(msls_overlay_active);
                    }
                },
                onStage2: function () {
                    if (forward) {
                        msls_resumeLayout(false);
                        _updateLayoutAndWaitToFinish($to);
                    }

                    return true;
                },
                onStage3: function () {
                    if (reverse) {
                        $dialogOverlay.removeClass(msls_overlay_active);
                    }
                },
                onCleanup: function () {
                    $from.removeClass(ui_page_active);
                    if (reverse) {
                        $dialogOverlay.addClass(msls_collapsed);
                        msls_updateLayout();
                    }
                },
                onComplete: complete
            });
    }

    function _transitionOpeningScreen(me, $page, complete) {

        msls_suspendLayout();
        var $ins = $page;
        _transition(me,
            {
                transitionName: msls_opening_transition,
                stage1Delay: 1,
                stage3Delay: 167,
                reverse: false,
                $ins: $ins,
                $outs: $empty,
                onStage1: function () {
                    $ins.css("opacity", "");
                },
                onStage2: function () {
                    msls_resumeLayout(false);
                    return _updateLayoutAndWaitToFinish($ins);
                },
                onCleanup: function () {
                },
                onComplete: complete
            });
    }

    function _transition(me, options) {


        function helper_awaitCallback(action) {
            return WinJS.Promise.join([action ? action() : null]);
        }

        function helper_delay(milliseconds) {

            var delay = milliseconds || 1;

            return new WinJS.Promise(function init(c) {
                setTimeout(function () {
                    c();
                }, delay);
            });
        }

        msls_mark(msls_codeMarkers.transitionStart);

        _resetProgressOverlayCounter(me);

        var transitionName = options.transitionName,
            $ins = options.$ins,
            $outs = options.$outs,
            onStage1 = options.onStage1,
            onStage2 = options.onStage2,
            onStage3 = options.onStage3,
            onCleanup = options.onCleanup,
            onComplete = options.onComplete,
            stage1Delay = options.stage1Delay,
            stage3Delay = options.stage3Delay;
        if (!stage1Delay) {
            stage1Delay = 167;
        }



        WinJS.Promise.join([
        ])
        .then(function () {
            msls_mark(msls_codeMarkers.transition_Stage1Start);
            return helper_awaitCallback(onStage1);
        })
        .then(function () {
            $outs.addClass(msls_out);
            $ins.addClass(msls_in);

            msls_addOrRemoveClass($body, options.reverse, msls_reverse);
            $body.addClass(transitionName + " " + msls_stage1);

            return helper_delay(stage1Delay);
        })


        .then(function () {
            msls_mark(msls_codeMarkers.transition_Stage2Start);
            _resetProgressOverlayCounter(me);
            $body.removeClass(msls_stage1).addClass(msls_stage2);

            $outs.addClass(msls_layout_ignore);
            $ins.removeClass(msls_layout_ignore);
            return helper_awaitCallback(onStage2);
        })


        .then(function () {
            msls_mark(msls_codeMarkers.transition_Stage3Start);
            _resetProgressOverlayCounter(me);
            return helper_awaitCallback(onStage3);
        })
        .then(function () {
            $body.removeClass(msls_stage2)
                .addClass(msls_stage3);
            return helper_delay(stage3Delay);
        })


        .then(function () {
            msls_mark(msls_codeMarkers.transition_CleanupStart);
            _resetProgressOverlayCounter(me);
            return helper_awaitCallback(onCleanup);
        })
        .then(function () {
            msls_removeClasses($body, transitionName, msls_stage3, msls_reverse);
            msls_removeClasses($outs, msls_out);
            msls_removeClasses($ins, msls_in);
        })


        .then(function () {
            msls_mark(msls_codeMarkers.transitionEnd);
            if (onComplete) {
                onComplete();
            }
        });
    }

    function _join() {
        return Array.prototype.join.call(arguments, " ");
    }

    function _updateLayoutAndWaitToFinish($rootNodes) {
        return new WinJS.Promise(function init(c) {
            msls_updateLayoutImmediately($rootNodes);
            c();
        });
    }

    function _registerTransitionHandler() {

        $.mobile.defaultTransitionHandler = lightSwitchTransitionHandler;
    }


    msls_defineClass(msls, "ShellView",
        function ShellView() {

            this._pageIdMapping = {};
            msls_setProperty(this, "_pageIdToIndexMapping", {});

        }, null, {
            _nextPageId: 1,
            _firstPageId: null,
            _initializeMobileOnce: true,
            initialize: initialize,
            navigate: navigate,
            onNavigationUnitClosed: onNavigationUnitClosed,
            isSaveButtonVisible: msls_computedProperty(_computeIsSaveButtonVisible)
        }
    );

    msls_shellView = new msls.ShellView();
    msls_setProperty(msls, "shellView", msls_shellView);
    msls_setProperty(msls.shell, "shellView", msls_shellView);

}());

(function () {

    var _Text = msls.ui.controls.Text,
        inUpdatingView;

    function Summary(view) {

        var me = this;
        _Text.call(me, view);
    }

    function _refreshView() {
        if (!inUpdatingView) {
            _updateView(this);
        }
    }

    function _updateView(me) {

        inUpdatingView = true;
        try {
            var value,
                textElement = me._textElement;

            if (me._isViewCreated && !!textElement) {

                value = _getStringValue(me);

                me.text = value;
                if (value) {
                    textElement.text(value);
                } else {
                    textElement.html("&nbsp;");
                }

                textElement.addClass("msls-p-ellipsis");
            }
        }
        finally {
            inUpdatingView = false;
        }
    }

    function isComputedProperty(property) {
        return !!property && !!msls_getAttribute(property, ":@Computed");
    }

    function _getStringValue(me) {
        var entity = me.entity,
            entityType,
            nonComputedProperties,
            summaryAttribute,
            property,
            modelType,
            nullableType,
            propertyName,
            supportedValues,
            valuePair,
            value = null,
            originalListener = me._originalEntityListener;

        if (!!entity) {

            entityType = entity.details.getModel();

            summaryAttribute = msls_getAttribute(entityType, ":@SummaryProperty");
            if (!!summaryAttribute &&
                !isComputedProperty(summaryAttribute.property)) {
                property = summaryAttribute.property;
            }

            if (!property) {
                nonComputedProperties = msls_iterate(entityType.properties)
                    .where(function (p) {
                        return !isComputedProperty(p);
                    });
                property = nonComputedProperties
                    .first(function (p) {
                        modelType = p.propertyType;
                        if (msls_isNullableType(modelType)) {
                            nullableType = modelType;
                            modelType = nullableType.underlyingType;
                        }
                        return modelType.id === ":String";
                    });
                if (!property) {
                    property = nonComputedProperties.first();
                }
            }


            if (property) {
                propertyName = msls_getProgrammaticName(property.name);

                if (originalListener) {
                    msls_dispose(originalListener);
                    me._originalEntityListener = null;
                }

                if ($.isFunction(entity.addChangeListener)) {

                    me._originalEntityListener = msls_addAutoDisposeChangeListener(entity, propertyName, me, function () {
                        _updateView(me);
                    });
                }

                value = entity[propertyName];
                supportedValues = msls_getAttributes(property, ":@SupportedValue");

                if (!!supportedValues) {
                    valuePair = msls_iterate(supportedValues)
                        .first(function (sv) { return sv.value === value; });
                    if (!!valuePair) {
                        value = valuePair.displayName;
                    }
                }
            }
        }

        return value === null || value === undefined ? "" : value + "";
    }

    msls_defineClass("ui.controls", "Summary", Summary, _Text, {
        controlName: "Summary",
        entity: msls_controlProperty(
            function onEntityChanged(value) {
                _updateView(this);
            }),

        _refreshView: _refreshView,
        _originalEntityListener: null
    }, {
        _fillTemplate: _Text._fillTemplate
    });

    msls.ui.controls.Summary.prototype._propertyMappings = {
        value: "entity",
        properties: { tap: "tap" }
    };
}());

(function () {
    function WebAddressViewer(view) {

        msls.ui.controls.Text.call(this, view);
    }

    function _refreshView() {
        var displayText = this.text,
            linkValue = this.text,
            textElement = this._textElement;

        if (this._isViewCreated && typeof displayText === "string") {

            var match = displayText.match(/(.*?[^,]), (.+)/);
            if (match) {
                displayText = match[2];
                linkValue = match[1];
            }

            textElement.text(displayText);

            match = linkValue.match(/^https?:\/\/(.+)/i);
            if (!match) {
                linkValue = "http://" + linkValue;
            }

            textElement.removeAttr("href");
            textElement.removeClass("ui-link");

            try {
                var link = document.createElement("a");
                link.href = linkValue;

                match = link.href.match(/^(https?:\/\/.+?)\/(.*)/i);
                if (!link.href.match(/^https?:\/\/\//i) &&
                    (link.href.toLowerCase() === linkValue.toLowerCase() ||
                    !!match && (match[1] + match[2]).toLowerCase() === linkValue.toLowerCase())) {
                    textElement.attr("href", link.href);
                    textElement.addClass("ui-link");
                }
            } catch (e) {
            }
        }
    }

    function _fillTemplate(view, contentItem, templateData) {
        $('<div class="msls-text-container"><a class="id-element" target="_blank"></a></div>')
            .appendTo(view);
        templateData.idElement = msls_getTemplateItemPath(view, msls_control_find(view, ".id-element"));
    }

    msls_defineClass("ui.controls", "WebAddressViewer", WebAddressViewer, msls.ui.controls.Text, {
        controlName: "WebAddressViewer",

        _refreshView: _refreshView
    }, {
        _fillTemplate: _fillTemplate
    });

}());

(function () {
    var _DataBindingMode = msls.data.DataBindingMode;

    var msls_createControlMappings =
        function createControlMappings(controlName, controlClass) {

            function initControlPropertyBindings(control, mappings, valueSource, additionalPath) {
                var sourceProperty,
                    targetProperty,
                    binding;

                for (sourceProperty in mappings) {
                    additionalPath.push(sourceProperty);
                    targetProperty = mappings[sourceProperty];
                    if (typeof targetProperty === "string") {
                        binding = new msls.data.DataBinding(additionalPath.join("."), valueSource, targetProperty, control, msls_data_DataBindingMode.oneWayFromSource);
                        binding.bind();
                    } else {
                        initControlPropertyBindings(control, targetProperty, valueSource, additionalPath);
                    }
                    additionalPath.pop();
                }
            }

            function initControlProperties(control, mappings, valueSource) {
                var sourceProperty,
                    targetProperty;

                for (sourceProperty in mappings) {
                    targetProperty = mappings[sourceProperty];
                    if (typeof targetProperty === "string") {
                        control[targetProperty] = valueSource[sourceProperty];
                    } else if (sourceProperty === "properties") {
                        initControlProperties(control, targetProperty, valueSource[sourceProperty]);
                    } else {
                        initControlPropertyBindings(control, targetProperty, valueSource, [sourceProperty]);
                    }
                }
            }

            function bindEditableProperties(control, editableProperties, contentItem) {
                var sourceProperty,
                    targetProperty,
                    binding;

                for (sourceProperty in editableProperties) {
                    targetProperty = editableProperties[sourceProperty];
                    binding = new msls.data.DataBinding(targetProperty, contentItem, sourceProperty, control);
                    binding.bind();
                }
            }

            if (controlClass) {
                msls_controlMappings[controlName] = controlClass;
            }

            msls_layoutControlMappings[controlName] =
            function render(view, contentItem, templateData) {

                var screenClass = contentItem.screen.constructor,
                    control,
                    _Constructor = controlClass,
                    propertyMappings,
                    editableProperties,
                    postRenderMethod;

                control = new _Constructor(view);
                control.data = contentItem;

                propertyMappings = control._propertyMappings;
                if (!!propertyMappings) {
                    initControlProperties(control, propertyMappings, contentItem);
                }
                editableProperties = control._editableProperties;
                if (!!editableProperties) {
                    bindEditableProperties(control, editableProperties, contentItem);
                }

                if (templateData !== undefined) {
                    control.attachView(templateData);
                } else {
                    control.render();
                }

                postRenderMethod = screenClass[contentItem.name + "_postRender"];
                if (!!postRenderMethod) {
                    try {
                        postRenderMethod.call(null, view[0], contentItem);
                    } catch (ex) {
                        contentItem.displayError = msls_getResourceString("customControl_postRenderError_2args", contentItem.name, ex);
                    }
                }

                return control;
            };

        };

    msls_createControlMappings("DateTimePicker", msls.ui.controls.DateTimePicker);
    msls_createControlMappings("DatePicker", msls.ui.controls.DatePicker);
    msls_createControlMappings("Control", msls.ui.Control);
    msls_createControlMappings("TextBox", msls.ui.controls.TextBox);
    msls_createControlMappings("Text", msls.ui.controls.Text);
    msls_createControlMappings("TextArea", msls.ui.controls.TextArea);
    msls_createControlMappings("RowsLayout", msls.ui.controls.RowsLayout);
    msls_createControlMappings("ColumnsLayout", msls.ui.controls.ColumnsLayout);
    msls_createControlMappings("List", msls.ui.controls.ListView);
    msls_createControlMappings("TileList", msls.ui.controls.ListView);
    msls_createControlMappings("Button", msls.ui.controls.Button);
    msls_createControlMappings("Summary", msls.ui.controls.Summary);
    msls_createControlMappings("PhoneNumberEditor", msls.ui.controls.PhoneNumberEditor);
    msls_createControlMappings("EmailAddressEditor", msls.ui.controls.EmailAddressEditor);
    msls_createControlMappings("EmailAddressViewer", msls.ui.controls.EmailAddressViewer);
    msls_createControlMappings("WebAddressViewer", msls.ui.controls.WebAddressViewer);
    msls_createControlMappings("Image", msls.ui.controls.Image);
    msls_createControlMappings("AccordionLayout", msls.ui.controls.AccordionLayout);
    msls_createControlMappings("ValueDropdown", msls.ui.controls.Dropdown);
    msls_createControlMappings("DetailsModalPicker", msls.ui.controls.ModalPicker);
    msls_createControlMappings("Paragraph", msls.ui.controls.Paragraph);
    msls_createControlMappings("ValueCustomControl", msls.ui.controls.CustomControl);
    msls_createControlMappings("GroupCustomControl", msls.ui.controls.CustomControl);
    msls_createControlMappings("CollectionCustomControl", msls.ui.controls.CustomControl);
    msls_createControlMappings("ScreenCustomControl", msls.ui.controls.CustomControl);
    msls_createControlMappings("NoControl", msls.ui.controls.NoControl);

}());

if (!window.msls) {
    window.msls = Object.getPrototypeOf(msls);
}

})(window);