/**
 * Copyright (C) 2017 salesforce.com, inc.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Engine = {})));
}(this, (function (exports) { 'use strict';

var freeze = Object.freeze, seal = Object.seal, create = Object.create, assign = Object.assign, defineProperty = Object.defineProperty, getPrototypeOf = Object.getPrototypeOf, getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor, getOwnPropertyNames = Object.getOwnPropertyNames, defineProperties = Object.defineProperties, hasOwnProperty = Object.hasOwnProperty;
var isArray = Array.isArray;
var _a = Array.prototype, ArrayFilter = _a.filter, ArraySlice = _a.slice, ArraySplice = _a.splice, ArrayUnshift = _a.unshift, ArrayIndexOf = _a.indexOf, ArrayPush = _a.push, ArrayMap = _a.map, forEach = _a.forEach, ArrayReduce = _a.reduce;
var _b = String.prototype, StringReplace = _b.replace, StringToLowerCase = _b.toLowerCase, StringCharCodeAt = _b.charCodeAt, StringSlice = _b.slice;
function isUndefined(obj) {
    return obj === undefined;
}
function isNull(obj) {
    return obj === null;
}
function isTrue(obj) {
    return obj === true;
}
function isFalse(obj) {
    return obj === false;
}
function isFunction(obj) {
    return typeof obj === 'function';
}
function isString(obj) {
    return typeof obj === 'string';
}

var compareDocumentPosition = Node.prototype.compareDocumentPosition;
var DOCUMENT_POSITION_CONTAINS = Node.DOCUMENT_POSITION_CONTAINS;

var nextTickCallbackQueue = [];
var SPACE_CHAR = 32;
var EmptyObject = seal(create(null));
var EmptyArray = seal([]);
var ViewModelReflection = Symbol();
function flushCallbackQueue() {
    var callbacks = nextTickCallbackQueue;
    nextTickCallbackQueue = []; // reset to a new queue
    for (var i = 0, len = callbacks.length; i < len; i += 1) {
        callbacks[i]();
    }
}
function addCallbackToNextTick(callback) {
    if (nextTickCallbackQueue.length === 0) {
        Promise.resolve().then(flushCallbackQueue);
    }
    // TODO: eventually, we might want to have priority when inserting callbacks
    ArrayPush.call(nextTickCallbackQueue, callback);
}
var usesNativeSymbols = typeof Symbol() === 'symbol';

var _a$1 = Element.prototype, addEventListener = _a$1.addEventListener, removeEventListener = _a$1.removeEventListener, getAttribute = _a$1.getAttribute, getAttributeNS = _a$1.getAttributeNS, setAttribute = _a$1.setAttribute, setAttributeNS = _a$1.setAttributeNS, removeAttribute = _a$1.removeAttribute, removeAttributeNS = _a$1.removeAttributeNS, querySelector = _a$1.querySelector, querySelectorAll = _a$1.querySelectorAll;
// These properties get added to LWCElement.prototype publicProps automatically
var defaultDefHTMLPropertyNames = ['dir', 'id', 'accessKey', 'title', 'lang', 'hidden', 'draggable', 'tabIndex'];
// this regular expression is used to transform aria props into aria attributes because
// that doesn't follow the regular transformation process. e.g.: `aria-labeledby` <=> `ariaLabelBy`
var ARIA_REGEX = /^aria/;
function getAriaAttributeName(propName) {
    return StringToLowerCase.call(StringReplace.call(propName, ARIA_REGEX, 'aria-'));
}
function attemptAriaAttributeFallback(vm, attrName) {
    if (hasOwnProperty.call(AOMAttrNameToPropNameMap, attrName)) {
        vm.hostAttrs[attrName] = undefined; // marking the set is needed for the AOM polyfill
        var propName = AOMAttrNameToPropNameMap[attrName];
        var shadowValue = vm.cmpRoot[propName];
        if (shadowValue !== null) {
            setAttribute.call(vm.elm, attrName, shadowValue);
        }
    }
}
// Global Aria and Role Properties derived from ARIA and Role Attributes with their
// respective default value.
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques
var GlobalAOMProperties = {
    ariaAutocomplete: null,
    ariaChecked: null,
    ariaCurrent: null,
    ariaDisabled: null,
    ariaExpanded: null,
    ariaHasPopUp: null,
    ariaHidden: null,
    ariaInvalid: null,
    ariaLabel: null,
    ariaLevel: null,
    ariaMultiline: null,
    ariaMultiSelectable: null,
    ariaOrientation: null,
    ariaPressed: null,
    ariaReadonly: null,
    ariaRequired: null,
    ariaSelected: null,
    ariaSort: null,
    ariaValueMax: null,
    ariaValueMin: null,
    ariaValueNow: null,
    ariaValueText: null,
    ariaLive: null,
    ariaRelevant: null,
    ariaAtomic: null,
    ariaBusy: null,
    ariaDropEffect: null,
    ariaDragged: null,
    ariaActiveDescendant: null,
    ariaControls: null,
    ariaDescribedBy: null,
    ariaFlowTo: null,
    ariaLabelledBy: null,
    ariaOwns: null,
    ariaPosInSet: null,
    ariaSetSize: null,
    role: null,
};
// TODO: complete this list with Element properties
// https://developer.mozilla.org/en-US/docs/Web/API/Element
// TODO: complete this list with Node properties
// https://developer.mozilla.org/en-US/docs/Web/API/Node
var AOMAttrNameToPropNameMap = create(null);
var GlobalHTMLPropDescriptors = create(null);
// Synthetic creation of all AOM property descriptors
forEach.call(getOwnPropertyNames(GlobalAOMProperties), function (propName) {
    var attrName = getAriaAttributeName(propName);
    AOMAttrNameToPropNameMap[attrName] = propName;
    function get() {
        var vm = this[ViewModelReflection];
        if (!hasOwnProperty.call(vm.cmpProps, propName)) {
            return null;
        }
        return vm.cmpProps[propName];
    }
    function set(newValue) {
        // TODO: fallback to the root's AOM default semantics
        var vm = this[ViewModelReflection];
        var value = vm.cmpProps[propName] = isNull(newValue) ? null : newValue + ''; // storing the normalized new value
        if (isNull(value)) {
            newValue = vm.component.root[propName];
            vm.hostAttrs[attrName] = undefined;
        }
        else {
            vm.hostAttrs[attrName] = 1;
        }
        if (isNull(newValue)) {
            removeAttribute.call(this, attrName);
        }
        else {
            setAttribute.call(this, attrName, newValue);
        }
    }
    // TODO: eventually this descriptors should come from HTMLElement.prototype.*
    GlobalHTMLPropDescriptors[propName] = {
        set: set,
        get: get,
        configurable: true,
        enumerable: true,
    };
});
forEach.call(defaultDefHTMLPropertyNames, function (propName) {
    var descriptor = getOwnPropertyDescriptor(HTMLElement.prototype, propName);
    if (!isUndefined(descriptor)) {
        GlobalHTMLPropDescriptors[propName] = descriptor;
    }
});
if (isUndefined(GlobalHTMLPropDescriptors.id)) {
    // In IE11, id property is on Element.prototype instead of HTMLElement
    GlobalHTMLPropDescriptors.id = getOwnPropertyDescriptor(Element.prototype, 'id');
}

var TopLevelContextSymbol = Symbol();
var currentContext = {};
currentContext[TopLevelContextSymbol] = true;
function establishContext(ctx) {
    currentContext = ctx;
}

var Services = create(null);
var hooks = ['wiring', 'rendered', 'connected', 'disconnected', 'piercing'];
function register(service) {
    for (var i = 0; i < hooks.length; ++i) {
        var hookName = hooks[i];
        if (hookName in service) {
            var l = Services[hookName];
            if (isUndefined(l)) {
                Services[hookName] = l = [];
            }
            ArrayPush.call(l, service[hookName]);
        }
    }
}
function invokeServiceHook(vm, cbs) {
    var component = vm.component, data = vm.data, def = vm.def, context = vm.context;
    for (var i = 0, len = cbs.length; i < len; ++i) {
        cbs[i].call(undefined, component, data, def, context);
    }
}

var TargetSlot = Symbol();
var MembraneSlot = Symbol();
function isReplicable(value) {
    var type = typeof value;
    return value && (type === 'object' || type === 'function');
}
function getReplica(membrane, value) {
    if (isNull(value)) {
        return value;
    }
    value = unwrap(value);
    if (!isReplicable(value)) {
        return value;
    }
    var cells = membrane.cells;
    var r = cells.get(value);
    if (r) {
        return r;
    }
    var replica = new Proxy(value, membrane);
    cells.set(value, replica);
    return replica;
}
var Membrane = /** @class */ (function () {
    function Membrane(handler) {
        this.handler = handler;
        this.cells = new WeakMap();
    }
    Membrane.prototype.get = function (target, key) {
        if (key === TargetSlot) {
            return target;
        }
        else if (key === MembraneSlot) {
            return this;
        }
        return this.handler.get(this, target, key);
    };
    Membrane.prototype.set = function (target, key, newValue) {
        return this.handler.set(this, target, key, newValue);
    };
    Membrane.prototype.deleteProperty = function (target, key) {
        if (key === TargetSlot) {
            return false;
        }
        return this.handler.deleteProperty(this, target, key);
    };
    Membrane.prototype.apply = function (target, thisArg, argumentsList) {
        thisArg = unwrap(thisArg);
        argumentsList = unwrap(argumentsList);
        if (isArray(argumentsList)) {
            argumentsList = ArrayMap.call(argumentsList, unwrap);
        }
        return this.handler.apply(this, target, thisArg, argumentsList);
    };
    Membrane.prototype.construct = function (target, argumentsList, newTarget) {
        argumentsList = unwrap(argumentsList);
        if (isArray(argumentsList)) {
            argumentsList = ArrayMap.call(argumentsList, unwrap);
        }
        return this.handler.construct(this, target, argumentsList, newTarget);
    };
    return Membrane;
}());
// TODO: we are using a funky and leaky abstraction here to try to identify if
// the proxy is a compat proxy, and define the unwrap method accordingly.
// @ts-ignore
var getKey = Proxy.getKey;
var unwrap = getKey ?
    function (replicaOrAny) { return (replicaOrAny && getKey(replicaOrAny, TargetSlot)) || replicaOrAny; }
    : function (replicaOrAny) { return (replicaOrAny && replicaOrAny[TargetSlot]) || replicaOrAny; };

function piercingHook(membrane, target, key, value) {
    var vm = membrane.handler.vm;
    var piercing = Services.piercing;
    if (piercing) {
        var component = vm.component, data = vm.data, def = vm.def, context = vm.context;
        var result_1 = value;
        var next_1 = true;
        var callback = function (newValue) {
            next_1 = false;
            result_1 = newValue;
        };
        for (var i = 0, len = piercing.length; next_1 && i < len; ++i) {
            piercing[i].call(undefined, component, data, def, context, target, key, value, callback);
        }
        return result_1 === value ? getReplica(membrane, result_1) : result_1;
    }
}
var PiercingMembraneHandler = /** @class */ (function () {
    function PiercingMembraneHandler(vm) {
        this.vm = vm;
    }
    PiercingMembraneHandler.prototype.get = function (membrane, target, key) {
        if (key === OwnerKey) {
            return undefined;
        }
        var value = target[key];
        return piercingHook(membrane, target, key, value);
    };
    PiercingMembraneHandler.prototype.set = function (membrane, target, key, newValue) {
        target[key] = newValue;
        return true;
    };
    PiercingMembraneHandler.prototype.deleteProperty = function (membrane, target, key) {
        delete target[key];
        return true;
    };
    PiercingMembraneHandler.prototype.apply = function (membrane, targetFn, thisArg, argumentsList) {
        return getReplica(membrane, targetFn.apply(thisArg, argumentsList));
    };
    PiercingMembraneHandler.prototype.construct = function (membrane, targetFn, argumentsList, newTarget) {
        return getReplica(membrane, new (targetFn.bind.apply(targetFn, [void 0].concat(argumentsList)))());
    };
    return PiercingMembraneHandler;
}());
function pierce(vm, value) {
    var membrane = vm.membrane;
    if (!membrane) {
        var handler = new PiercingMembraneHandler(vm);
        membrane = new Membrane(handler);
        vm.membrane = membrane;
    }
    return getReplica(membrane, value);
}

var vmBeingConstructed = null;
function isBeingConstructed(vm) {
    return vmBeingConstructed === vm;
}
function createComponent(vm, Ctor) {
    // create the component instance
    var vmBeingConstructedInception = vmBeingConstructed;
    vmBeingConstructed = vm;
    var component = invokeComponentConstructor(vm, Ctor);
    vmBeingConstructed = vmBeingConstructedInception;
    
}
function linkComponent(vm) {
    // wiring service
    var wire = vm.def.wire;
    if (wire) {
        var wiring = Services.wiring;
        if (wiring) {
            invokeServiceHook(vm, wiring);
        }
    }
}
function clearReactiveListeners(vm) {
    var deps = vm.deps;
    var len = deps.length;
    if (len) {
        for (var i = 0; i < len; i += 1) {
            var set = deps[i];
            var pos = ArrayIndexOf.call(deps[i], vm);
            ArraySplice.call(set, pos, 1);
        }
        deps.length = 0;
    }
}
function createComponentListener(vm) {
    return function handler(event) {
        handleComponentEvent(vm, event);
    };
}
function addComponentEventListener(vm, eventName, newHandler) {
    var cmpEvents = vm.cmpEvents, cmpListener = vm.cmpListener;
    if (isUndefined(cmpEvents)) {
        // this piece of code must be in sync with modules/component-events
        vm.cmpEvents = cmpEvents = create(null);
        vm.cmpListener = cmpListener = createComponentListener(vm);
    }
    if (isUndefined(cmpEvents[eventName])) {
        cmpEvents[eventName] = [];
        var elm = vm.elm;
        addEventListener.call(elm, eventName, cmpListener, false);
    }
    ArrayPush.call(cmpEvents[eventName], newHandler);
}
function removeComponentEventListener(vm, eventName, oldHandler) {
    var cmpEvents = vm.cmpEvents, elm = vm.elm;
    if (cmpEvents) {
        var handlers = cmpEvents[eventName];
        var pos = handlers && ArrayIndexOf.call(handlers, oldHandler);
        if (handlers && pos > -1) {
            if (handlers.length === 1) {
                removeEventListener.call(elm, eventName, vm.cmpListener);
                cmpEvents[eventName] = undefined;
            }
            else {
                ArraySplice.call(cmpEvents[eventName], pos, 1);
            }
            return;
        }
    }
}
function handleComponentEvent(vm, event) {
    
    var _a = vm.cmpEvents, cmpEvents = _a === void 0 ? EmptyObject : _a;
    var type = event.type, stopImmediatePropagation = event.stopImmediatePropagation;
    var handlers = cmpEvents[type];
    if (isArray(handlers)) {
        var uninterrupted_1 = true;
        event.stopImmediatePropagation = function () {
            uninterrupted_1 = false;
            stopImmediatePropagation.call(event);
        };
        var e = pierce(vm, event);
        for (var i = 0, len = handlers.length; uninterrupted_1 && i < len; i += 1) {
            invokeComponentCallback(vm, handlers[i], [e]);
        }
        // restoring original methods
        event.stopImmediatePropagation = stopImmediatePropagation;
    }
}
function renderComponent(vm) {
    clearReactiveListeners(vm);
    var vnodes = invokeComponentRenderMethod(vm);
    vm.isDirty = false;
    return vnodes;
}
function markComponentAsDirty(vm) {
    vm.isDirty = true;
}
function getCustomElementComponent(elmOrRoot) {
    return elmOrRoot[ViewModelReflection].component;
}

function getLinkedElement(root) {
    return getCustomElementVM(root).elm;
}
function createAccessibilityDescriptorForShadowRoot(propName, attrName, defaultValue) {
    // we use value as the storage mechanism and as the default value for the property
    return {
        enumerable: false,
        get: function () {
            var vm = getCustomElementVM(this);
            if (!hasOwnProperty.call(vm.rootProps, propName)) {
                return defaultValue;
            }
            return vm.rootProps[propName];
        },
        set: function (newValue) {
            var vm = getCustomElementVM(this);
            vm.rootProps[propName] = newValue;
            if (!isUndefined(vm.hostAttrs[attrName])) {
                return;
            }
            if (isNull(newValue)) {
                removeAttribute.call(vm.elm, attrName);
                return;
            }
            setAttribute.call(vm.elm, attrName, newValue);
        }
    };
}
var RootDescriptors = create(null);
// This routine will be a descriptor map for all AOM properties to be added
// to ShadowRoot prototype to polyfill AOM capabilities.
forEach.call(getOwnPropertyNames(GlobalAOMProperties), function (propName) { return RootDescriptors[propName] = createAccessibilityDescriptorForShadowRoot(propName, getAriaAttributeName(propName), GlobalAOMProperties[propName]); });
function shadowRootQuerySelector(shadowRoot, selector) {
    var vm = getCustomElementVM(shadowRoot);
    var elm = getLinkedElement(shadowRoot);
    pierce(vm, elm);
    var piercedQuerySelector = piercingHook(vm.membrane, elm, 'querySelector', elm.querySelector);
    return piercedQuerySelector.call(elm, selector);
}
function shadowRootQuerySelectorAll(shadowRoot, selector) {
    var vm = getCustomElementVM(shadowRoot);
    var elm = getLinkedElement(shadowRoot);
    pierce(vm, elm);
    var piercedQuerySelectorAll = piercingHook(vm.membrane, elm, 'querySelectorAll', elm.querySelectorAll);
    return piercedQuerySelectorAll.call(elm, selector);
}
var Root = /** @class */ (function () {
    function Root(vm) {
        defineProperty(this, ViewModelReflection, {
            value: vm,
        });
    }
    Object.defineProperty(Root.prototype, "mode", {
        get: function () {
            return 'closed';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Root.prototype, "host", {
        get: function () {
            return getCustomElementVM(this).component;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Root.prototype, "innerHTML", {
        get: function () {
            // TODO: should we add this only in dev mode? or wrap this in dev mode?
            throw new Error();
        },
        enumerable: true,
        configurable: true
    });
    Root.prototype.querySelector = function (selector) {
        var node = shadowRootQuerySelector(this, selector);
        
        return node;
    };
    Root.prototype.querySelectorAll = function (selector) {
        var nodeList = shadowRootQuerySelectorAll(this, selector);
        
        return nodeList;
    };
    Root.prototype.toString = function () {
        var component = getCustomElementComponent(this);
        return "Current ShadowRoot for " + component;
    };
    return Root;
}());
defineProperties(Root.prototype, RootDescriptors);
function getFirstMatch(vm, elm, selector) {
    var nodeList = querySelectorAll.call(elm, selector);
    // search for all, and find the first node that is owned by the VM in question.
    for (var i = 0, len = nodeList.length; i < len; i += 1) {
        if (isNodeOwnedByVM(vm, nodeList[i])) {
            return pierce(vm, nodeList[i]);
        }
    }
    return null;
}
function getAllMatches(vm, elm, selector) {
    var nodeList = querySelectorAll.call(elm, selector);
    var filteredNodes = ArrayFilter.call(nodeList, function (node) { return isNodeOwnedByVM(vm, node); });
    return pierce(vm, filteredNodes);
}
function isParentNodeKeyword(key) {
    return (key === 'parentNode' || key === 'parentElement');
}
function isIframeContentWindow(key, value) {
    return (key === 'contentWindow') && value.window === value;
}
function wrapIframeWindow(win) {
    return _a = {}, _a[TargetSlot] = win, _a.postMessage = function () {
            return win.postMessage.apply(win, arguments);
        }, _a.blur = function () {
            return win.blur.apply(win, arguments);
        }, _a.close = function () {
            return win.close.apply(win, arguments);
        }, _a.focus = function () {
            return win.focus.apply(win, arguments);
        }, Object.defineProperty(_a, "closed", {
            get: function () {
                return win.closed;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "frames", {
            get: function () {
                return win.frames;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "length", {
            get: function () {
                return win.length;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "location", {
            get: function () {
                return win.location;
            },
            set: function (value) {
                win.location = value;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "opener", {
            get: function () {
                return win.opener;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "parent", {
            get: function () {
                return win.parent;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "self", {
            get: function () {
                return win.self;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "top", {
            get: function () {
                return win.top;
            },
            enumerable: true,
            configurable: true
        }), Object.defineProperty(_a, "window", {
            get: function () {
                return win.window;
            },
            enumerable: true,
            configurable: true
        }), _a;
    var _a;
}
// Registering a service to enforce the shadowDOM semantics via the Raptor membrane implementation
register({
    piercing: function (component, data, def, context, target, key, value, callback) {
        var vm = component[ViewModelReflection];
        var elm = vm.elm;
        if (value) {
            if (isIframeContentWindow(key, value)) {
                callback(wrapIframeWindow(value));
            }
            if (value === querySelector) {
                // TODO: it is possible that they invoke the querySelector() function via call or apply to set a new context, what should
                // we do in that case? Right now this is essentially a bound function, but the original is not.
                return callback(function (selector) { return getFirstMatch(vm, target, selector); });
            }
            if (value === querySelectorAll) {
                // TODO: it is possible that they invoke the querySelectorAll() function via call or apply to set a new context, what should
                // we do in that case? Right now this is essentially a bound function, but the original is not.
                return callback(function (selector) { return getAllMatches(vm, target, selector); });
            }
            if (isParentNodeKeyword(key)) {
                if (value === elm) {
                    // walking up via parent chain might end up in the shadow root element
                    return callback(component.root);
                }
                else if (target[OwnerKey] !== value[OwnerKey]) {
                    // cutting out access to something outside of the shadow of the current target (usually slots)
                    return callback();
                }
            }
            if (value === elm) {
                // prevent access to the original Host element
                return callback(component);
            }
        }
    }
});

var TargetToReactiveRecordMap = new WeakMap();
function notifyMutation(target, key) {
    var reactiveRecord = TargetToReactiveRecordMap.get(target);
    if (!isUndefined(reactiveRecord)) {
        var value = reactiveRecord[key];
        if (value) {
            var len = value.length;
            for (var i = 0; i < len; i += 1) {
                var vm = value[i];
                if (!vm.isDirty) {
                    markComponentAsDirty(vm);
                    scheduleRehydration(vm);
                }
            }
        }
    }
}
function observeMutation(target, key) {
    if (isNull(vmBeingRendered)) {
        return; // nothing to subscribe to
    }
    var vm = vmBeingRendered;
    var reactiveRecord = TargetToReactiveRecordMap.get(target);
    if (isUndefined(reactiveRecord)) {
        var newRecord = create(null);
        reactiveRecord = newRecord;
        TargetToReactiveRecordMap.set(target, newRecord);
    }
    var value = reactiveRecord[key];
    if (isUndefined(value)) {
        value = [];
        reactiveRecord[key] = value;
    }
    else if (value[0] === vm) {
        return; // perf optimization considering that most subscriptions will come from the same vm
    }
    if (ArrayIndexOf.call(value, vm) === -1) {
        ArrayPush.call(value, vm);
        // we keep track of the sets that vm is listening from to be able to do some clean up later on
        ArrayPush.call(vm.deps, value);
    }
}

function getHTMLPropDescriptor(propName, descriptor) {
    var get = descriptor.get, set = descriptor.set, enumerable = descriptor.enumerable, configurable = descriptor.configurable;
    if (!isFunction(get)) {
        throw new TypeError();
    }
    if (!isFunction(set)) {
        throw new TypeError();
    }
    return {
        enumerable: enumerable,
        configurable: configurable,
        get: function () {
            var vm = this[ViewModelReflection];
            if (isBeingConstructed(vm)) {
                return;
            }
            observeMutation(this, propName);
            return get.call(vm.elm);
        },
        set: function (newValue) {
            var vm = this[ViewModelReflection];
            if (newValue !== vm.cmpProps[propName]) {
                vm.cmpProps[propName] = newValue;
                if (vm.idx > 0) {
                    // perf optimization to skip this step if not in the DOM
                    notifyMutation(this, propName);
                }
            }
            return set.call(vm.elm, newValue);
        }
    };
}
var htmlElementDescriptors = ArrayReduce.call(getOwnPropertyNames(GlobalHTMLPropDescriptors), function (seed, propName) {
    seed[propName] = getHTMLPropDescriptor(propName, GlobalHTMLPropDescriptors[propName]);
    return seed;
}, {});
function getLinkedElement$1(cmp) {
    return cmp[ViewModelReflection].elm;
}
function querySelectorAllFromComponent(cmp, selectors) {
    var elm = getLinkedElement$1(cmp);
    return elm.querySelectorAll(selectors);
}
// This should be as performant as possible, while any initialization should be done lazily
var LWCElement = /** @class */ (function () {
    function LWCElement() {
        if (isNull(vmBeingConstructed)) {
            throw new ReferenceError();
        }
        var vm = vmBeingConstructed;
        var elm = vm.elm, def = vm.def;
        var component = this;
        vm.component = component;
        // TODO: eventually the render method should be a static property on the ctor instead
        // catching render method to match other callbacks
        vm.render = component.render;
        // linking elm and its component with VM
        component[ViewModelReflection] = elm[ViewModelReflection] = vm;
        defineProperties(elm, def.descriptors);
    }
    // HTML Element - The Good Parts
    LWCElement.prototype.dispatchEvent = function (event) {
        var elm = getLinkedElement$1(this);
        var vm = getCustomElementVM(this);
        
        // Pierce dispatchEvent so locker service has a chance to overwrite
        pierce(vm, elm);
        var dispatchEvent = piercingHook(vm.membrane, elm, 'dispatchEvent', elm.dispatchEvent);
        return dispatchEvent.call(elm, event);
    };
    LWCElement.prototype.addEventListener = function (type, listener) {
        var vm = getCustomElementVM(this);
        addComponentEventListener(vm, type, listener);
    };
    LWCElement.prototype.removeEventListener = function (type, listener) {
        var vm = getCustomElementVM(this);
        removeComponentEventListener(vm, type, listener);
    };
    LWCElement.prototype.setAttributeNS = function (ns, attrName, value) {
        // use cached setAttributeNS, because elm.setAttribute throws
        // when not called in template
        return setAttributeNS.call(getLinkedElement$1(this), ns, attrName, value);
    };
    LWCElement.prototype.removeAttributeNS = function (ns, attrName) {
        // use cached removeAttributeNS, because elm.setAttribute throws
        // when not called in template
        return removeAttributeNS.call(getLinkedElement$1(this), ns, attrName);
    };
    LWCElement.prototype.removeAttribute = function (attrName) {
        var vm = getCustomElementVM(this);
        // use cached removeAttribute, because elm.setAttribute throws
        // when not called in template
        removeAttribute.call(vm.elm, attrName);
        attemptAriaAttributeFallback(vm, attrName);
    };
    LWCElement.prototype.setAttribute = function (attrName, value) {
        var vm = getCustomElementVM(this);
        // marking the set is needed for the AOM polyfill
        vm.hostAttrs[attrName] = 1;
        // use cached setAttribute, because elm.setAttribute throws
        // when not called in template
        return setAttribute.call(getLinkedElement$1(this), attrName, value);
    };
    LWCElement.prototype.getAttributeNS = function (ns, attrName) {
        return getAttributeNS.call(getLinkedElement$1(this), ns, attrName);
    };
    LWCElement.prototype.getAttribute = function (attrName) {
        // logging errors for experimental and special attributes
        
        return getAttribute.apply(getLinkedElement$1(this), ArraySlice.call(arguments));
    };
    LWCElement.prototype.getBoundingClientRect = function () {
        var elm = getLinkedElement$1(this);
        
        return elm.getBoundingClientRect();
    };
    LWCElement.prototype.querySelector = function (selectors) {
        var vm = getCustomElementVM(this);
        var nodeList = querySelectorAllFromComponent(this, selectors);
        for (var i = 0, len = nodeList.length; i < len; i += 1) {
            if (wasNodePassedIntoVM(vm, nodeList[i])) {
                // TODO: locker service might need to return a membrane proxy
                return pierce(vm, nodeList[i]);
            }
        }
        return null;
    };
    LWCElement.prototype.querySelectorAll = function (selectors) {
        var vm = getCustomElementVM(this);
        var nodeList = querySelectorAllFromComponent(this, selectors);
        // TODO: locker service might need to do something here
        var filteredNodes = ArrayFilter.call(nodeList, function (node) { return wasNodePassedIntoVM(vm, node); });
        return pierce(vm, filteredNodes);
    };
    Object.defineProperty(LWCElement.prototype, "tagName", {
        get: function () {
            var elm = getLinkedElement$1(this);
            return elm.tagName + ''; // avoiding side-channeling
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LWCElement.prototype, "classList", {
        get: function () {
            
            return getLinkedElement$1(this).classList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LWCElement.prototype, "root", {
        get: function () {
            var vm = getCustomElementVM(this);
            var cmpRoot = vm.cmpRoot;
            // lazy creation of the ShadowRoot Object the first time it is accessed.
            if (isUndefined(cmpRoot)) {
                cmpRoot = new Root(vm);
                vm.cmpRoot = cmpRoot;
            }
            return cmpRoot;
        },
        enumerable: true,
        configurable: true
    });
    LWCElement.prototype.toString = function () {
        var vm = getCustomElementVM(this);
        var elm = vm.elm;
        var tagName = elm.tagName;
        var is = getAttribute.call(elm, 'is');
        return "<" + tagName.toLowerCase() + (is ? ' is="${is}' : '') + ">";
    };
    return LWCElement;
}());
defineProperties(LWCElement.prototype, htmlElementDescriptors);
freeze(LWCElement);
seal(LWCElement.prototype);
function getCustomElementVM(elmOrCmp) {
    return elmOrCmp[ViewModelReflection];
}

/**
 * Copyright (C) 2017 salesforce.com, inc.
 */
var isArray$1 = Array.isArray;
var getPrototypeOf$1 = Object.getPrototypeOf, ObjectCreate = Object.create, ObjectDefineProperty = Object.defineProperty, ObjectDefineProperties = Object.defineProperties;
var ObjectDotPrototype = Object.prototype;
function isUndefined$1(obj) {
    return obj === undefined;
}
var TargetSlot$1 = Symbol();
// TODO: we are using a funky and leaky abstraction here to try to identify if
// the proxy is a compat proxy, and define the unwrap method accordingly.
// @ts-ignore
var getKey$1 = Proxy.getKey;
var unwrap$1 = getKey$1 ?
    function (replicaOrAny) { return (replicaOrAny && getKey$1(replicaOrAny, TargetSlot$1)) || replicaOrAny; }
    : function (replicaOrAny) { return (replicaOrAny && replicaOrAny[TargetSlot$1]) || replicaOrAny; };
function isObservable(value) {
    if (!value) {
        return false;
    }
    if (isArray$1(value)) {
        return true;
    }
    var proto = getPrototypeOf$1(value);
    return (proto === ObjectDotPrototype || proto === null || getPrototypeOf$1(proto) === null);
}
function isObject$1(obj) {
    return typeof obj === 'object';
}

var isArray$1$1 = Array.isArray;
var getPrototypeOf$1$1 = Object.getPrototypeOf, isExtensible$1 = Object.isExtensible, getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor, getOwnPropertyNames$1 = Object.getOwnPropertyNames, getOwnPropertySymbols$1 = Object.getOwnPropertySymbols, defineProperty$1 = Object.defineProperty, preventExtensions$1 = Object.preventExtensions;
var ArrayConcat$1$1 = Array.prototype.concat;
// Unwrap property descriptors
// We only need to unwrap if value is specified
function unwrapDescriptor(descriptor) {
    if ('value' in descriptor) {
        descriptor.value = unwrap$1(descriptor.value);
    }
    return descriptor;
}
function wrapDescriptor(membrane, descriptor) {
    if ('value' in descriptor) {
        descriptor.value = isObservable(descriptor.value) ? membrane.getProxy(descriptor.value) : descriptor.value;
    }
    return descriptor;
}
function lockShadowTarget(membrane, shadowTarget, originalTarget) {
    var targetKeys = ArrayConcat$1$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
    targetKeys.forEach(function (key) {
        var descriptor = getOwnPropertyDescriptor$1(originalTarget, key);
        // We do not need to wrap the descriptor if not configurable
        // Because we can deal with wrapping it when user goes through
        // Get own property descriptor. There is also a chance that this descriptor
        // could change sometime in the future, so we can defer wrapping
        // until we need to
        if (!descriptor.configurable) {
            descriptor = wrapDescriptor(membrane, descriptor);
        }
        defineProperty$1(shadowTarget, key, descriptor);
    });
    preventExtensions$1(shadowTarget);
}
var ReactiveProxyHandler = /** @class */ (function () {
    function ReactiveProxyHandler(membrane, value) {
        this.originalTarget = value;
        this.membrane = membrane;
    }
    ReactiveProxyHandler.prototype.get = function (shadowTarget, key) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        if (key === TargetSlot$1) {
            return originalTarget;
        }
        var value = originalTarget[key];
        observeMutation$1(membrane, originalTarget, key);
        return membrane.getProxy(value);
    };
    ReactiveProxyHandler.prototype.set = function (shadowTarget, key, value) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        var oldValue = originalTarget[key];
        if (oldValue !== value) {
            originalTarget[key] = value;
            notifyMutation$1(membrane, originalTarget, key);
        }
        else if (key === 'length' && isArray$1$1(originalTarget)) {
            // fix for issue #236: push will add the new index, and by the time length
            // is updated, the internal length is already equal to the new length value
            // therefore, the oldValue is equal to the value. This is the forking logic
            // to support this use case.
            notifyMutation$1(membrane, originalTarget, key);
        }
        return true;
    };
    ReactiveProxyHandler.prototype.deleteProperty = function (shadowTarget, key) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        delete originalTarget[key];
        notifyMutation$1(membrane, originalTarget, key);
        return true;
    };
    ReactiveProxyHandler.prototype.apply = function (shadowTarget, thisArg, argArray) {
        /* No op */
    };
    ReactiveProxyHandler.prototype.construct = function (target, argArray, newTarget) {
        /* No op */
    };
    ReactiveProxyHandler.prototype.has = function (shadowTarget, key) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        observeMutation$1(membrane, originalTarget, key);
        return key in originalTarget;
    };
    ReactiveProxyHandler.prototype.ownKeys = function (shadowTarget) {
        var originalTarget = this.originalTarget;
        return ArrayConcat$1$1.call(getOwnPropertyNames$1(originalTarget), getOwnPropertySymbols$1(originalTarget));
    };
    ReactiveProxyHandler.prototype.isExtensible = function (shadowTarget) {
        var shadowIsExtensible = isExtensible$1(shadowTarget);
        if (!shadowIsExtensible) {
            return shadowIsExtensible;
        }
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        var targetIsExtensible = isExtensible$1(originalTarget);
        if (!targetIsExtensible) {
            lockShadowTarget(membrane, shadowTarget, originalTarget);
        }
        return targetIsExtensible;
    };
    ReactiveProxyHandler.prototype.setPrototypeOf = function (shadowTarget, prototype) {
    };
    ReactiveProxyHandler.prototype.getPrototypeOf = function (shadowTarget) {
        var originalTarget = this.originalTarget;
        return getPrototypeOf$1$1(originalTarget);
    };
    ReactiveProxyHandler.prototype.getOwnPropertyDescriptor = function (shadowTarget, key) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        // keys looked up via hasOwnProperty need to be reactive
        observeMutation$1(membrane, originalTarget, key);
        var desc = getOwnPropertyDescriptor$1(originalTarget, key);
        if (isUndefined$1(desc)) {
            return desc;
        }
        var shadowDescriptor = getOwnPropertyDescriptor$1(shadowTarget, key);
        if (!desc.configurable && !shadowDescriptor) {
            // If descriptor from original target is not configurable,
            // We must copy the wrapped descriptor over to the shadow target.
            // Otherwise, proxy will throw an invariant error.
            // This is our last chance to lock the value.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
            desc = wrapDescriptor(membrane, desc);
            defineProperty$1(shadowTarget, key, desc);
        }
        return shadowDescriptor || desc;
    };
    ReactiveProxyHandler.prototype.preventExtensions = function (shadowTarget) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        lockShadowTarget(membrane, shadowTarget, originalTarget);
        preventExtensions$1(originalTarget);
        return true;
    };
    ReactiveProxyHandler.prototype.defineProperty = function (shadowTarget, key, descriptor) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        var configurable = descriptor.configurable;
        // We have to check for value in descriptor
        // because Object.freeze(proxy) calls this method
        // with only { configurable: false, writeable: false }
        // Additionally, method will only be called with writeable:false
        // if the descriptor has a value, as opposed to getter/setter
        // So we can just check if writable is present and then see if
        // value is present. This eliminates getter and setter descriptors
        if ('writable' in descriptor && !('value' in descriptor)) {
            var originalDescriptor = getOwnPropertyDescriptor$1(originalTarget, key);
            descriptor.value = originalDescriptor.value;
        }
        defineProperty$1(originalTarget, key, unwrapDescriptor(descriptor));
        if (configurable === false) {
            defineProperty$1(shadowTarget, key, wrapDescriptor(membrane, descriptor));
        }
        notifyMutation$1(membrane, originalTarget, key);
        return true;
    };
    return ReactiveProxyHandler;
}());

var getOwnPropertyDescriptor$1$1 = Object.getOwnPropertyDescriptor, getOwnPropertyNames$1$1 = Object.getOwnPropertyNames, getOwnPropertySymbols$1$1 = Object.getOwnPropertySymbols, defineProperty$1$1 = Object.defineProperty;
var ArrayConcat$2 = Array.prototype.concat;
function wrapDescriptor$1(membrane, descriptor) {
    if ('value' in descriptor) {
        descriptor.value = isObservable(descriptor.value) ? membrane.getReadOnlyProxy(descriptor.value) : descriptor.value;
    }
    return descriptor;
}
var ReadOnlyHandler = /** @class */ (function () {
    function ReadOnlyHandler(membrane, value) {
        this.originalTarget = value;
        this.membrane = membrane;
    }
    ReadOnlyHandler.prototype.get = function (shadowTarget, key) {
        var _a = this, membrane = _a.membrane, originalTarget = _a.originalTarget;
        if (key === TargetSlot$1) {
            return originalTarget;
        }
        var value = originalTarget[key];
        observeMutation$1(membrane, originalTarget, key);
        return membrane.getReadOnlyProxy(value);
    };
    ReadOnlyHandler.prototype.set = function (shadowTarget, key, value) {
        
        return false;
    };
    ReadOnlyHandler.prototype.deleteProperty = function (shadowTarget, key) {
        
        return false;
    };
    ReadOnlyHandler.prototype.apply = function (shadowTarget, thisArg, argArray) {
        /* No op */
    };
    ReadOnlyHandler.prototype.construct = function (target, argArray, newTarget) {
        /* No op */
    };
    ReadOnlyHandler.prototype.has = function (shadowTarget, key) {
        var _a = this, membrane = _a.membrane, originalTarget = _a.originalTarget;
        observeMutation$1(membrane, originalTarget, key);
        return key in originalTarget;
    };
    ReadOnlyHandler.prototype.ownKeys = function (shadowTarget) {
        var originalTarget = this.originalTarget;
        return ArrayConcat$2.call(getOwnPropertyNames$1$1(originalTarget), getOwnPropertySymbols$1$1(originalTarget));
    };
    ReadOnlyHandler.prototype.setPrototypeOf = function (shadowTarget, prototype) {
        
    };
    ReadOnlyHandler.prototype.getOwnPropertyDescriptor = function (shadowTarget, key) {
        var _a = this, originalTarget = _a.originalTarget, membrane = _a.membrane;
        // keys looked up via hasOwnProperty need to be reactive
        observeMutation$1(membrane, originalTarget, key);
        var desc = getOwnPropertyDescriptor$1$1(originalTarget, key);
        if (isUndefined$1(desc)) {
            return desc;
        }
        var shadowDescriptor = getOwnPropertyDescriptor$1$1(shadowTarget, key);
        if (!desc.configurable && !shadowDescriptor) {
            // If descriptor from original target is not configurable,
            // We must copy the wrapped descriptor over to the shadow target.
            // Otherwise, proxy will throw an invariant error.
            // This is our last chance to lock the value.
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
            desc = wrapDescriptor$1(membrane, desc);
            defineProperty$1$1(shadowTarget, key, desc);
        }
        return shadowDescriptor || desc;
    };
    ReadOnlyHandler.prototype.preventExtensions = function (shadowTarget) {
        
        return false;
    };
    ReadOnlyHandler.prototype.defineProperty = function (shadowTarget, key, descriptor) {
        
        return false;
    };
    return ReadOnlyHandler;
}());
function invokeDistortion(membrane, value) {
    return membrane.distortion(value);
}
function createShadowTarget(value) {
    var shadowTarget = undefined;
    if (isArray$1(value)) {
        shadowTarget = [];
    }
    else if (isObject$1(value)) {
        shadowTarget = {};
    }
    return shadowTarget;
}
function getReactiveState(membrane, value) {
    var objectGraph = membrane.objectGraph;
    value = unwrap$1(value);
    var reactiveState = objectGraph.get(value);
    if (reactiveState) {
        return reactiveState;
    }
    reactiveState = ObjectDefineProperties(ObjectCreate(null), {
        shadowTarget: {
            get: function () {
                var shadowTarget = createShadowTarget(value);
                ObjectDefineProperty(this, 'shadowTarget', { value: shadowTarget });
                return shadowTarget;
            },
            configurable: true,
        },
        reactive: {
            get: function () {
                var shadowTarget = this.shadowTarget;
                var reactiveHandler = new ReactiveProxyHandler(membrane, value);
                var proxy = new Proxy(shadowTarget, reactiveHandler);
                ObjectDefineProperty(this, 'reactive', { value: proxy });
                return proxy;
            },
            configurable: true,
        },
        readOnly: {
            get: function () {
                var shadowTarget = this.shadowTarget;
                var readOnlyHandler = new ReadOnlyHandler(membrane, value);
                var proxy = new Proxy(shadowTarget, readOnlyHandler);
                ObjectDefineProperty(this, 'readOnly', { value: proxy });
                return proxy;
            },
            configurable: true,
        }
    });
    objectGraph.set(value, reactiveState);
    return reactiveState;
}
function notifyMutation$1(membrane, obj, key) {
    membrane.propertyMemberChange(obj, key);
}
function observeMutation$1(membrane, obj, key) {
    membrane.propertyMemberAccess(obj, key);
}
var ReactiveMembrane = /** @class */ (function () {
    function ReactiveMembrane(distrotion, eventMap) {
        this.objectGraph = new WeakMap();
        this.distortion = distrotion;
        this.propertyMemberChange = eventMap.propertyMemberChange;
        this.propertyMemberAccess = eventMap.propertyMemberAccess;
    }
    ReactiveMembrane.prototype.getProxy = function (value) {
        var distorted = invokeDistortion(this, value);
        if (isObservable(distorted)) {
            return getReactiveState(this, distorted).reactive;
        }
        return distorted;
    };
    ReactiveMembrane.prototype.getReadOnlyProxy = function (value) {
        var distorted = invokeDistortion(this, value);
        if (isObservable(distorted)) {
            return getReactiveState(this, distorted).readOnly;
        }
        return distorted;
    };
    return ReactiveMembrane;
}());
/** version: 0.18.0-1 */

function format(value) {
    return value;
}
var membrane = new ReactiveMembrane(format, {
    propertyMemberChange: notifyMutation,
    propertyMemberAccess: observeMutation,
});
var unwrapMethods = [
    unwrap,
    unwrap$1
];
var unwrapLength = unwrapMethods.length;
function unwrap$2(value) {
    for (var i = 0; i < unwrapLength; i += 1) {
        var current = unwrapMethods[i];
        var unwrapped = current(value);
        if (unwrapped !== value) {
            return unwrapped;
        }
    }
    return value;
}
// TODO: REMOVE THIS https://github.com/salesforce/lwc/issues/129
function dangerousObjectMutation(obj) {
    return membrane.getProxy(unwrap$2(obj));
}

var CHAR_S = 115;
var CHAR_V = 118;
var CHAR_G = 103;
var NamespaceAttributeForSVG = 'http://www.w3.org/2000/svg';
var SymbolIterator = Symbol.iterator;
var ELEMENT_NODE = Node.ELEMENT_NODE, TEXT_NODE = Node.TEXT_NODE, COMMENT_NODE = Node.COMMENT_NODE;
var classNameToClassMap = create(null);
function getMapFromClassName(className) {
    if (className === undefined) {
        return;
    }
    var map = classNameToClassMap[className];
    if (map) {
        return map;
    }
    map = {};
    var start = 0;
    var o;
    var len = className.length;
    for (o = 0; o < len; o++) {
        if (StringCharCodeAt.call(className, o) === SPACE_CHAR) {
            if (o > start) {
                map[StringSlice.call(className, start, o)] = true;
            }
            start = o + 1;
        }
    }
    if (o > start) {
        map[StringSlice.call(className, start, o)] = true;
    }
    classNameToClassMap[className] = map;
    return map;
}
// insert is called after postpatch, which is used somewhere else (via a module)
// to mark the vm as inserted, that means we cannot use postpatch as the main channel
// to rehydrate when dirty, because sometimes the element is not inserted just yet,
// which breaks some invariants. For that reason, we have the following for any
// Custom Element that is inserted via a template.
var hook = {
    postpatch: function (oldVNode, vnode) {
        var vm = getCustomElementVM(vnode.elm);
        vm.cmpSlots = vnode.data.slotset;
        // TODO: hot-slots names are those slots used during the last rendering cycle, and only if
        // one of those is changed, the vm should be marked as dirty.
        // TODO: Issue #133
        if (vm.cmpSlots !== oldVNode.data.slotset && !vm.isDirty) {
            markComponentAsDirty(vm);
        }
        renderVM(vm);
    },
    insert: function (vnode) {
        var vm = getCustomElementVM(vnode.elm);
        appendVM(vm);
        renderVM(vm);
    },
    create: function (oldVNode, vnode) {
        createVM(vnode.sel, vnode.elm, vnode.data.slotset);
    },
    remove: function (vnode, removeCallback) {
        removeVM(getCustomElementVM(vnode.elm));
        removeCallback();
    }
};
function isVElement(vnode) {
    return vnode.nt === ELEMENT_NODE;
}
function addNS(vnode) {
    var data = vnode.data, children = vnode.children, sel = vnode.sel;
    // TODO: review why `sel` equal `foreignObject` should get this `ns`
    data.ns = NamespaceAttributeForSVG;
    if (isArray(children) && sel !== 'foreignObject') {
        for (var j = 0, n = children.length; j < n; ++j) {
            var childNode = children[j];
            if (childNode != null && isVElement(childNode)) {
                addNS(childNode);
            }
        }
    }
}
function getCurrentOwnerId() {
    return isNull(vmBeingRendered) ? 0 : vmBeingRendered.uid;
}
function getCurrentTplToken() {
    // For root elements and other special cases the vm is not set.
    if (isNull(vmBeingRendered)) {
        return;
    }
    return vmBeingRendered.context.tplToken;
}
function normalizeStyleString(value) {
    if (value == null || value === false) {
        return;
    }
    if (isString(value)) {
        return value;
    }
    return value + '';
}
// [h]tml node
function h(sel, data, children) {
    var classMap = data.classMap, className = data.className, style = data.style, styleMap = data.styleMap, key = data.key;
    data.class = classMap || getMapFromClassName(normalizeStyleString(className));
    data.style = styleMap || normalizeStyleString(style);
    data.token = getCurrentTplToken();
    data.uid = getCurrentOwnerId();
    var text, elm; // tslint:disable-line
    var vnode = {
        nt: ELEMENT_NODE,
        tag: sel,
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
    };
    if (sel.length === 3 && StringCharCodeAt.call(sel, 0) === CHAR_S && StringCharCodeAt.call(sel, 1) === CHAR_V && StringCharCodeAt.call(sel, 2) === CHAR_G) {
        addNS(vnode);
    }
    return vnode;
}
// [c]ustom element node
function c(sel, Ctor, data) {
    // The compiler produce AMD modules that do not support circular dependencies
    // We need to create an indirection to circumvent those cases.
    // We could potentially move this check to the definition
    if (Ctor.__circular__) {
        Ctor = Ctor();
    }
    var key = data.key, slotset = data.slotset, styleMap = data.styleMap, style = data.style, on = data.on, className = data.className, classMap = data.classMap, props = data.props;
    var attrs = data.attrs;
    // hack to allow component authors to force the usage of the "is" attribute in their components
    var forceTagName = Ctor.forceTagName;
    var tag = sel, text, elm; // tslint:disable-line
    if (!isUndefined(attrs) && !isUndefined(attrs.is)) {
        tag = sel;
        sel = attrs.is;
    }
    else if (!isUndefined(forceTagName)) {
        tag = forceTagName;
        attrs = assign({}, attrs);
        attrs.is = sel;
    }
    registerComponent(sel, Ctor);
    data = { hook: hook, key: key, slotset: slotset, attrs: attrs, on: on, props: props };
    data.class = classMap || getMapFromClassName(normalizeStyleString(className));
    data.style = styleMap || normalizeStyleString(style);
    data.token = getCurrentTplToken();
    data.uid = getCurrentOwnerId();
    var vnode = {
        nt: ELEMENT_NODE,
        tag: tag,
        sel: sel,
        data: data,
        children: EmptyArray,
        text: text,
        elm: elm,
        key: key,
    };
    return vnode;
}
// [i]terable node
function i(iterable, factory) {
    var list = [];
    if (isUndefined(iterable) || iterable === null) {
        return list;
    }
    var iterator = iterable[SymbolIterator]();
    var next = iterator.next();
    var j = 0;
    var value = next.value, last = next.done;
    while (last === false) {
        // implementing a look-back-approach because we need to know if the element is the last
        next = iterator.next();
        last = next.done;
        // template factory logic based on the previous collected value
        var vnode = factory(value, j, j === 0, last);
        if (isArray(vnode)) {
            ArrayPush.apply(list, vnode);
        }
        else {
            ArrayPush.call(list, vnode);
        }
        
        // preparing next value
        j += 1;
        value = next.value;
    }
    return list;
}
/**
 * [f]lattening
 */
function f(items) {
    var len = items.length;
    var flattened = [];
    for (var j = 0; j < len; j += 1) {
        var item = items[j];
        if (isArray(item)) {
            ArrayPush.apply(flattened, item);
        }
        else {
            ArrayPush.call(flattened, item);
        }
    }
    return flattened;
}
// [t]ext node
function t(text) {
    var sel, data = {}, children, key, elm; // tslint:disable-line
    return {
        nt: TEXT_NODE,
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
    };
}
function p(text) {
    var sel = '!', data = {}, children, key, elm; // tslint:disable-line
    return {
        nt: COMMENT_NODE,
        sel: sel,
        data: data,
        children: children,
        text: text,
        elm: elm,
        key: key,
    };
}
// [d]ynamic value to produce a text vnode
function d(value) {
    if (value === undefined || value === null) {
        return null;
    }
    return t(value);
}
// [b]ind function
function b(fn) {
    if (isNull(vmBeingRendered)) {
        throw new Error();
    }
    var vm = vmBeingRendered;
    return function handler(event) {
        // TODO: only if the event is `composed` it can be dispatched
        invokeComponentCallback(vm, fn, [event]);
    };
}
var objToKeyMap = new WeakMap();
var globalKey = 0;
// [k]ind function
function k(compilerKey, obj) {
    switch (typeof obj) {
        case 'number':
        // TODO: when obj is a numeric key, we might be able to use some
        // other strategy to combine two numbers into a new unique number
        case 'string':
            return compilerKey + ':' + obj;
        case 'object':
            if (isNull(obj)) {
                return;
            }
            // Slow path. We get here when element is inside iterator
            // but no key is specified.
            var unwrapped = unwrap$2(obj);
            var objKey = objToKeyMap.get(unwrapped);
            if (isUndefined(objKey)) {
                objKey = globalKey++;
                objToKeyMap.set(unwrapped, objKey);
            }
            return compilerKey + ':' + objKey;
    }
}


var api = Object.freeze({
	h: h,
	c: c,
	i: i,
	f: f,
	t: t,
	p: p,
	d: d,
	b: b,
	k: k
});

var EmptySlots = create(null);
function getSlotsetValue(slotset, slotName) {
    // TODO: mark slotName as reactive
    return slotset && slotset[slotName];
}
var slotsetProxyHandler = {
    get: function (slotset, key) { return getSlotsetValue(slotset, key); },
    set: function () {
        return false;
    },
    deleteProperty: function () {
        return false;
    },
};
{
    assign(slotsetProxyHandler, {
        apply: function (target, thisArg, argArray) {
            throw new Error("invalid call invocation from slotset");
        },
        construct: function (target, argArray, newTarget) {
            throw new Error("invalid construction invocation from slotset");
        },
    });
}
function applyTokenToHost(vm, html) {
    var context = vm.context;
    var oldToken = context.tplToken;
    var newToken = html.token;
    if (oldToken !== newToken) {
        var host = vm.elm;
        // Remove the token currently applied to the host element if different than the one associated
        // with the current template
        if (!isUndefined(oldToken)) {
            host.removeAttribute(oldToken);
        }
        // If the template has a token apply the token to the host element
        if (!isUndefined(newToken)) {
            host.setAttribute(newToken, '');
        }
    }
}
function evaluateTemplate(vm, html) {
    // TODO: add identity to the html functions
    var component = vm.component, context = vm.context, _a = vm.cmpSlots, cmpSlots = _a === void 0 ? EmptySlots : _a, cmpTemplate = vm.cmpTemplate;
    // reset the cache memoizer for template when needed
    if (html !== cmpTemplate) {
        if (!isUndefined(cmpTemplate)) {
            resetShadowRoot(vm);
        }
        applyTokenToHost(vm, html);
        vm.cmpTemplate = html;
        context.tplCache = create(null);
        context.tplToken = html.token;
    }
    var _b = Proxy.revocable(cmpSlots, slotsetProxyHandler), slotset = _b.proxy, slotsetRevoke = _b.revoke;
    var vnodes = html.call(undefined, api, component, slotset, context.tplCache);
    slotsetRevoke();
    return vnodes;
}

// Even if all the browser the engine supports implements the UserTiming API, we need to guard the measure APIs.
// JSDom (used in Jest) for example doesn't implement the UserTiming APIs
var isUserTimingSupported = typeof performance !== 'undefined' &&
    typeof performance.mark === 'function' &&
    typeof performance.clearMarks === 'function' &&
    typeof performance.measure === 'function' &&
    typeof performance.clearMeasures === 'function';

var vmBeingRendered = null;
function invokeComponentCallback(vm, fn, args) {
    var context = vm.context, component = vm.component;
    var ctx = currentContext;
    establishContext(context);
    var result;
    var error;
    try {
        // TODO: membrane proxy for all args that are objects
        result = fn.apply(component, args);
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        establishContext(ctx);
        if (error) {
            error.wcStack = getComponentStack(vm);
            // rethrowing the original error annotated after restoring the context
            throw error; // tslint:disable-line
        }
    }
    return result;
}
function invokeComponentConstructor(vm, Ctor) {
    var context = vm.context;
    var ctx = currentContext;
    establishContext(context);
    var component;
    var error;
    try {
        component = new Ctor();
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        establishContext(ctx);
        if (error) {
            error.wcStack = getComponentStack(vm);
            // rethrowing the original error annotated after restoring the context
            throw error; // tslint:disable-line
        }
    }
    return component;
}
function invokeComponentRenderMethod(vm) {
    var render = vm.render;
    if (isUndefined(render)) {
        return [];
    }
    var component = vm.component, context = vm.context;
    var ctx = currentContext;
    establishContext(context);
    var vmBeingRenderedInception = vmBeingRendered;
    vmBeingRendered = vm;
    var result;
    var error;
    try {
        var html = render.call(component);
        if (isFunction(html)) {
            result = evaluateTemplate(vm, html);
        }
        else if (!isUndefined(html)) {
        }
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        establishContext(ctx);
        vmBeingRendered = vmBeingRenderedInception;
        if (error) {
            error.wcStack = getComponentStack(vm);
            // rethrowing the original error annotated after restoring the context
            throw error; // tslint:disable-line
        }
    }
    return result || [];
}

// stub function to prevent misuse of the @track decorator
function track() {
}
// TODO: how to allow symbols as property keys?
function createTrackedPropertyDescriptor(proto, key, descriptor) {
    defineProperty(proto, key, {
        get: function () {
            var vm = getCustomElementVM(this);
            observeMutation(this, key);
            return vm.cmpTrack[key];
        },
        set: function (newValue) {
            var vm = getCustomElementVM(this);
            var reactiveOrAnyValue = membrane.getProxy(newValue);
            if (reactiveOrAnyValue !== vm.cmpTrack[key]) {
                
                vm.cmpTrack[key] = reactiveOrAnyValue;
                if (vm.idx > 0) {
                    // perf optimization to skip this step if not in the DOM
                    notifyMutation(this, key);
                }
            }
        },
        enumerable: isUndefined(descriptor) ? true : descriptor.enumerable,
        configurable: false,
    });
}

// stub function to prevent misuse of the @wire decorator
function wire() {
}
// TODO: how to allow symbols as property keys?
function createWiredPropertyDescriptor(proto, key, descriptor) {
    createTrackedPropertyDescriptor(proto, key, descriptor);
}

// stub function to prevent misuse of the @api decorator
function api$1() {
}
var vmBeingUpdated = null;
function prepareForPropUpdate(vm) {
    vmBeingUpdated = vm;
}
// TODO: how to allow symbols as property keys?
function createPublicPropertyDescriptor(proto, key, descriptor) {
    defineProperty(proto, key, {
        get: function () {
            var vm = getCustomElementVM(this);
            if (isBeingConstructed(vm)) {
                return;
            }
            observeMutation(this, key);
            return vm.cmpProps[key];
        },
        set: function (newValue) {
            var vm = getCustomElementVM(this);
            if (isTrue(vm.isRoot) || isBeingConstructed(vm)) {
                vmBeingUpdated = vm;
                
            }
            if (vmBeingUpdated === vm) {
                // not need to wrap or check the value since that is happening somewhere else
                vmBeingUpdated = null; // releasing the lock
                vm.cmpProps[key] = membrane.getReadOnlyProxy(newValue);
                // avoid notification of observability while constructing the instance
                if (vm.idx > 0) {
                    // perf optimization to skip this step if not in the DOM
                    notifyMutation(this, key);
                }
            }
            else {}
        },
        enumerable: isUndefined(descriptor) ? true : descriptor.enumerable,
    });
}
function createPublicAccessorDescriptor(proto, key, descriptor) {
    var get = descriptor.get, set = descriptor.set, enumerable = descriptor.enumerable;
    if (!isFunction(get)) {
        throw new TypeError();
    }
    defineProperty(proto, key, {
        get: function () {
            
            return get.call(this);
        },
        set: function (newValue) {
            var vm = getCustomElementVM(this);
            if (vm.isRoot || isBeingConstructed(vm)) {
                vmBeingUpdated = vm;
                
            }
            if (vmBeingUpdated === vm) {
                // not need to wrap or check the value since that is happening somewhere else
                vmBeingUpdated = null; // releasing the lock
                if (set) {
                    set.call(this, membrane.getReadOnlyProxy(newValue));
                }
                else {}
            }
            else {}
        },
        enumerable: enumerable,
    });
}

/**
 * This module is responsible for producing the ComponentDef object that is always
 * accessible via `vm.def`. This is lazily created during the creation of the first
 * instance of a component class, and shared across all instances.
 *
 * This structure can be used to synthetically create proxies, and understand the
 * shape of a component. It is also used internally to apply extra optimizations.
 */
var CtorToDefMap = new WeakMap();
var COMPUTED_GETTER_MASK = 1;
var COMPUTED_SETTER_MASK = 2;
function propertiesReducer(seed, propName) {
    seed[propName] = { config: 3 };
    return seed;
}
var reducedDefaultHTMLPropertyNames = ArrayReduce.call(defaultDefHTMLPropertyNames, propertiesReducer, create(null));
var HTML_PROPS = ArrayReduce.call(getOwnPropertyNames(GlobalAOMProperties), propertiesReducer, reducedDefaultHTMLPropertyNames);
function createComponentDef(Ctor) {
    
    var name = Ctor.name;
    var props = getPublicPropertiesHash(Ctor);
    var methods = getPublicMethodsHash(Ctor);
    var wire$$1 = getWireHash(Ctor);
    var track$$1 = getTrackHash(Ctor);
    var proto = Ctor.prototype;
    for (var propName in props) {
        var propDef = props[propName];
        // initializing getters and setters for each public prop on the target prototype
        var descriptor = getOwnPropertyDescriptor(proto, propName);
        var config = propDef.config;
        if (COMPUTED_SETTER_MASK & config || COMPUTED_GETTER_MASK & config) {
            
            // if it is configured as an accessor it must have a descriptor
            createPublicAccessorDescriptor(proto, propName, descriptor);
        }
        else {
            createPublicPropertyDescriptor(proto, propName, descriptor);
        }
    }
    if (wire$$1) {
        for (var propName in wire$$1) {
            if (wire$$1[propName].method) {
                // for decorated methods we need to do nothing
                continue;
            }
            var descriptor = getOwnPropertyDescriptor(proto, propName);
            // TODO: maybe these conditions should be always applied.
            
            // initializing getters and setters for each public prop on the target prototype
            createWiredPropertyDescriptor(proto, propName, descriptor);
        }
    }
    if (track$$1) {
        for (var propName in track$$1) {
            var descriptor = getOwnPropertyDescriptor(proto, propName);
            // TODO: maybe these conditions should be always applied.
            
            // initializing getters and setters for each public prop on the target prototype
            createTrackedPropertyDescriptor(proto, propName, descriptor);
        }
    }
    var connectedCallback = proto.connectedCallback, disconnectedCallback = proto.disconnectedCallback, renderedCallback = proto.renderedCallback, errorCallback = proto.errorCallback;
    var superProto = getPrototypeOf(Ctor);
    var superDef = superProto !== LWCElement ? getComponentDef(superProto) : null;
    if (!isNull(superDef)) {
        props = assign(create(null), superDef.props, props);
        methods = assign(create(null), superDef.methods, methods);
        wire$$1 = (superDef.wire || wire$$1) ? assign(create(null), superDef.wire, wire$$1) : undefined;
        connectedCallback = connectedCallback || superDef.connectedCallback;
        disconnectedCallback = disconnectedCallback || superDef.disconnectedCallback;
        renderedCallback = renderedCallback || superDef.renderedCallback;
        errorCallback = errorCallback || superDef.errorCallback;
    }
    props = assign(create(null), HTML_PROPS, props);
    var descriptors = createDescriptorMap(props, methods);
    var def = {
        name: name,
        wire: wire$$1,
        track: track$$1,
        props: props,
        methods: methods,
        descriptors: descriptors,
        connectedCallback: connectedCallback,
        disconnectedCallback: disconnectedCallback,
        renderedCallback: renderedCallback,
        errorCallback: errorCallback,
    };
    
    return def;
}
function createGetter(key) {
    return function () {
        return getCustomElementComponent(this)[key];
    };
}
function createSetter(key) {
    return function (newValue) {
        getCustomElementComponent(this)[key] = newValue;
    };
}
function createMethodCaller(key) {
    return function () {
        var component = getCustomElementComponent(this);
        return component[key].apply(component, ArraySlice.call(arguments));
    };
}
function getAttributePatched(attrName) {
    
    return getAttribute.apply(this, ArraySlice.call(arguments));
}
function setAttributePatched(attrName, newValue) {
    var vm = getCustomElementVM(this);
    // marking the set is needed for the AOM polyfill
    vm.hostAttrs[attrName] = 1; // marking the set is needed for the AOM polyfill
    setAttribute.apply(this, ArraySlice.call(arguments));
}
function setAttributeNSPatched(attrNameSpace, attrName, newValue) {
    var vm = getCustomElementVM(this);
    setAttributeNS.apply(this, ArraySlice.call(arguments));
}
function removeAttributePatched(attrName) {
    var vm = getCustomElementVM(this);
    removeAttribute.apply(this, ArraySlice.call(arguments));
    attemptAriaAttributeFallback(vm, attrName);
}
function removeAttributeNSPatched(attrNameSpace, attrName) {
    var vm = getCustomElementVM(this);
    removeAttributeNS.apply(this, ArraySlice.call(arguments));
}
function createDescriptorMap(publicProps, publicMethodsConfig) {
    // replacing mutators and accessors on the element itself to catch any mutation
    var descriptors = {
        getAttribute: {
            value: getAttributePatched,
            configurable: true,
        },
        setAttribute: {
            value: setAttributePatched,
            configurable: true,
        },
        setAttributeNS: {
            value: setAttributeNSPatched,
            configurable: true,
        },
        removeAttribute: {
            value: removeAttributePatched,
            configurable: true,
        },
        removeAttributeNS: {
            value: removeAttributeNSPatched,
            configurable: true,
        },
    };
    // expose getters and setters for each public props on the Element
    for (var key in publicProps) {
        descriptors[key] = {
            get: createGetter(key),
            set: createSetter(key),
        };
    }
    // expose public methods as props on the Element
    for (var key in publicMethodsConfig) {
        descriptors[key] = {
            value: createMethodCaller(key),
            configurable: true,
        };
    }
    return descriptors;
}
function getTrackHash(target) {
    var track$$1 = target.track;
    if (!getOwnPropertyDescriptor(target, 'track') || !track$$1 || !getOwnPropertyNames(track$$1).length) {
        return EmptyObject;
    }
    // TODO: check that anything in `track` is correctly defined in the prototype
    return assign(create(null), track$$1);
}
function getWireHash(target) {
    var wire$$1 = target.wire;
    if (!getOwnPropertyDescriptor(target, 'wire') || !wire$$1 || !getOwnPropertyNames(wire$$1).length) {
        return;
    }
    // TODO: check that anything in `wire` is correctly defined in the prototype
    return assign(create(null), wire$$1);
}
function getPublicPropertiesHash(target) {
    var props = target.publicProps;
    if (!getOwnPropertyDescriptor(target, 'publicProps') || !props || !getOwnPropertyNames(props).length) {
        return EmptyObject;
    }
    return getOwnPropertyNames(props).reduce(function (propsHash, propName) {
        
        propsHash[propName] = assign({ config: 0, type: 'any' }, props[propName]);
        return propsHash;
    }, create(null));
}
function getPublicMethodsHash(target) {
    var publicMethods = target.publicMethods;
    if (!getOwnPropertyDescriptor(target, 'publicMethods') || !publicMethods || !publicMethods.length) {
        return EmptyObject;
    }
    return publicMethods.reduce(function (methodsHash, methodName) {
        methodsHash[methodName] = 1;
        return methodsHash;
    }, create(null));
}
function getComponentDef(Ctor) {
    var def = CtorToDefMap.get(Ctor);
    if (def) {
        return def;
    }
    def = createComponentDef(Ctor);
    CtorToDefMap.set(Ctor, def);
    return def;
}
var TagNameToCtor = create(null);
function getCtorByTagName(tagName) {
    return TagNameToCtor[tagName];
    /////// TODO: what is this?
}
function registerComponent(tagName, Ctor) {
    if (!isUndefined(TagNameToCtor[tagName])) {
        if (TagNameToCtor[tagName] === Ctor) {
            return;
        }
        else {}
    }
    TagNameToCtor[tagName] = Ctor;
}

/* tslint:disable:one-variable-per-declaration no-shadowed-variable */
var isArray$3 = Array.isArray;
var ELEMENT_NODE$1 = 1, TEXT_NODE$1 = 3, COMMENT_NODE$1 = 8, DOCUMENT_FRAGMENT_NODE = 11;
function isUndef(s) {
    return s === undefined;
}
function isDef(s) {
    return s !== undefined;
}
var emptyNode = {
    nt: 0,
    sel: '',
    data: {},
    children: undefined,
    text: undefined,
    elm: undefined,
    key: undefined,
};
function defaultCompareFn(vnode1, vnode2) {
    return (vnode1.nt === vnode2.nt &&
        vnode1.key === vnode2.key &&
        vnode1.sel === vnode2.sel);
}
function isVNode(vnode) {
    return vnode != null;
}
function isElementVNode(vnode) {
    return vnode.nt === ELEMENT_NODE$1;
}
function isFragmentVNode(vnode) {
    return vnode.nt === DOCUMENT_FRAGMENT_NODE;
}
function isTextVNode(vnode) {
    return vnode.nt === TEXT_NODE$1;
}
function isCommentVNode(vnode) {
    return vnode.nt === COMMENT_NODE$1;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var map = {};
    var i, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (isVNode(ch)) {
            key = ch.key;
            if (key !== undefined) {
                map[key] = i;
            }
        }
    }
    return map;
}
var hooks$1 = [
    'create',
    'update',
    'remove',
    'destroy',
    'pre',
    'post',
];
function init$1(modules, api, compareFn) {
    var cbs = {};
    var i, j;
    var sameVnode = isUndef(compareFn) ? defaultCompareFn : compareFn;
    for (i = 0; i < hooks$1.length; ++i) {
        cbs[hooks$1[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks$1[i]];
            if (hook !== undefined) {
                cbs[hooks$1[i]].push(hook);
            }
        }
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent = api.parentNode(childElm);
                api.removeChild(parent, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i;
        var data = vnode.data;
        if (!isUndef(data)) {
            if (isDef((i = data.hook)) && isDef((i = i.init))) {
                i(vnode);
            }
        }
        if (isElementVNode(vnode)) {
            var data_1 = vnode.data, tag = vnode.tag;
            var elm = (vnode.elm = isDef((i = data_1.ns))
                ? api.createElementNS(i, tag)
                : api.createElement(tag));
            if (isDef((i = data_1.hook)) && isDef(i.create)) {
                i.create(emptyNode, vnode);
            }
            for (i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode);
            }
            var children = vnode.children;
            if (isArray$3(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (isVNode(ch)) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (!isUndef(vnode.text)) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
            if (isDef((i = data_1.hook)) && isDef(i.insert)) {
                insertedVnodeQueue.push(vnode);
            }
        }
        else if (isTextVNode(vnode)) {
            vnode.elm = api.createTextNode(vnode.text);
        }
        else if (isCommentVNode(vnode)) {
            vnode.elm = api.createComment(vnode.text);
        }
        else if (isFragmentVNode(vnode)) {
            vnode.elm = api.createFragment();
        }
        else {
            throw new TypeError();
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (isVNode(ch)) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var data = vnode.data;
        var i, j;
        if (isDef((i = data.hook)) && isDef((i = i.destroy))) {
            i(vnode);
        }
        for (i = 0; i < cbs.destroy.length; ++i) {
            cbs.destroy[i](vnode);
        }
        var children = vnode.children;
        if (isUndef(children)) {
            return;
        }
        for (j = 0; j < children.length; ++j) {
            var n = children[j];
            if (isVNode(n) && !isTextVNode(n)) {
                invokeDestroyHook(n);
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            var i_1 = void 0, listeners = void 0, rm = void 0;
            // text nodes do not have logic associated to them
            if (isVNode(ch)) {
                if (!isTextVNode(ch)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1) {
                        cbs.remove[i_1](ch, rm);
                    }
                    if (isDef((i_1 = ch.data.hook)) && isDef((i_1 = i_1.remove))) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (!isVNode(oldStartVnode)) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (!isVNode(oldEndVnode)) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (!isVNode(newStartVnode)) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (!isVNode(newEndVnode)) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    // New element
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (isVNode(elmToMove)) {
                        if (elmToMove.sel !== newStartVnode.sel) {
                            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                        }
                        else {
                            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                            oldCh[idxInOld] = undefined;
                            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                        }
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                var n = newCh[newEndIdx + 1];
                before = isVNode(n) ? n.elm : null;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            }
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef((i = vnode.data))) {
            hook = i.hook;
        }
        if (isDef(hook) && isDef((i = hook.prepatch))) {
            i(oldVnode, vnode);
        }
        var elm = (vnode.elm = oldVnode.elm);
        if (oldVnode === vnode) {
            return;
        }
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i) {
                cbs.update[i](oldVnode, vnode);
            }
            if (isDef(hook) && isDef((i = hook.update))) {
                i(oldVnode, vnode);
            }
        }
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch) {
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
                }
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text)) {
                    api.setTextContent(elm, '');
                }
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            api.setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef((i = hook.postpatch))) {
            i(oldVnode, vnode);
        }
    }
    var patch = function patch(oldVnode, vnode) {
        if (!isVNode(oldVnode) || !isVNode(vnode)) {
            throw new TypeError();
        }
        var i, n, elm, parent;
        var pre = cbs.pre, post = cbs.post;
        var insertedVnodeQueue = [];
        for (i = 0, n = pre.length; i < n; ++i) {
            pre[i]();
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0, n = insertedVnodeQueue.length; i < n; ++i) {
            // if a vnode is in this queue, it must have the insert hook defined
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0, n = post.length; i < n; ++i) {
            post[i]();
        }
        return vnode;
    };
    patch.children = function children(parentElm, oldCh, newCh) {
        if (!isArray$3(oldCh) || !isArray$3(newCh)) {
            throw new TypeError();
        }
        var i, n;
        var pre = cbs.pre, post = cbs.post;
        var insertedVnodeQueue = [];
        for (i = 0, n = pre.length; i < n; ++i) {
            pre[i]();
        }
        if (oldCh !== newCh) {
            updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue);
        }
        for (i = 0, n = insertedVnodeQueue.length; i < n; ++i) {
            // if a vnode is in this queue, it must have the insert hook defined
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0, n = post.length; i < n; ++i) {
            post[i]();
        }
        return newCh;
    };
    return patch;
}

function update(oldVnode, vnode) {
    var props = vnode.data.props;
    if (isUndefined(props)) {
        return;
    }
    var oldProps = oldVnode.data.props;
    if (oldProps === props) {
        return;
    }
    var key;
    var cur;
    var old;
    var elm = vnode.elm;
    var vm = elm[ViewModelReflection];
    oldProps = isUndefined(oldProps) ? EmptyObject : oldProps;
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key in elm) && (key !== 'value' || elm[key] !== cur)) {
            if (!isUndefined(vm)) {
                prepareForPropUpdate(vm); // this is just in case the vnode is actually a custom element
            }
            // touching the dom if the prop really changes.
            elm[key] = cur;
        }
    }
}
var propsModule = {
    create: update,
    update: update,
};

var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var ColonCharCode = 58;
function updateAttrs(oldVnode, vnode) {
    var attrs = vnode.data.attrs;
    if (isUndefined(attrs)) {
        return;
    }
    var oldAttrs = oldVnode.data.attrs;
    if (oldAttrs === attrs) {
        return;
    }
    var elm = vnode.elm;
    var setAttribute = elm.setAttribute, removeAttribute = elm.removeAttribute;
    var key;
    oldAttrs = isUndefined(oldAttrs) ? EmptyObject : oldAttrs;
    // update modified attributes, add new attributes
    for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
        if (old !== cur) {
            if (isTrue(cur)) {
                setAttribute.call(elm, key, "");
            }
            else if (isFalse(cur)) {
                removeAttribute.call(elm, key);
            }
            else {
                if (StringCharCodeAt.call(key, 3) === ColonCharCode) {
                    // Assume xml namespace
                    elm.setAttributeNS.call(elm, xmlNS, key, cur);
                }
                else if (StringCharCodeAt.call(key, 5) === ColonCharCode) {
                    // Assume xlink namespace
                    elm.setAttributeNS.call(elm, xlinkNS, key, cur);
                }
                else {
                    setAttribute.call(elm, key, cur);
                }
            }
        }
    }
}
var attributesModule = {
    create: updateAttrs,
    update: updateAttrs
};

var DashCharCode = 45;
function updateStyle(oldVnode, vnode) {
    var newStyle = vnode.data.style;
    if (isUndefined(newStyle)) {
        return;
    }
    var oldStyle = oldVnode.data.style;
    if (oldStyle === newStyle) {
        return;
    }
    var name;
    var elm = vnode.elm;
    var style = elm.style;
    if (isUndefined(newStyle) || newStyle === '') {
        removeAttribute.call(elm, 'style');
    }
    else if (isString(newStyle)) {
        style.cssText = newStyle;
    }
    else {
        if (!isUndefined(oldStyle)) {
            for (name in oldStyle) {
                if (!(name in newStyle)) {
                    style.removeProperty(name);
                }
            }
        }
        else {
            oldStyle = EmptyObject;
        }
        for (name in newStyle) {
            var cur = newStyle[name];
            if (cur !== oldStyle[name]) {
                if (StringCharCodeAt.call(name, 0) === DashCharCode && StringCharCodeAt.call(name, 1) === DashCharCode) {
                    // if the name is prefixed with --, it will be considered a variable, and setProperty() is needed
                    style.setProperty(name, cur);
                }
                else {
                    // @ts-ignore
                    style[name] = cur;
                }
            }
        }
    }
}
var styleModule = {
    create: updateStyle,
    update: updateStyle,
};

function updateClass(oldVnode, vnode) {
    var elm = vnode.elm, klass = vnode.data.class;
    if (isUndefined(klass)) {
        return;
    }
    var oldClass = oldVnode.data.class;
    if (oldClass === klass) {
        return;
    }
    var classList = elm.classList;
    var name;
    oldClass = isUndefined(oldClass) ? EmptyObject : oldClass;
    for (name in oldClass) {
        // remove only if it is not in the new class collection and it is not set from within the instance
        if (isUndefined(klass[name])) {
            classList.remove(name);
        }
    }
    for (name in klass) {
        if (isUndefined(oldClass[name])) {
            classList.add(name);
        }
    }
}
var classes = {
    create: updateClass,
    update: updateClass
};

function handleEvent(event, vnode) {
    var type = event.type;
    var on = vnode.data.on;
    var handler = on && on[type];
    // call event handler if exists
    if (handler) {
        handler.call(undefined, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function removeAllEventListeners(vnode) {
    var on = vnode.data.on, listener = vnode.listener;
    if (on && listener) {
        var elm = vnode.elm;
        var name = void 0;
        for (name in on) {
            removeEventListener.call(elm, name, listener, false);
        }
        vnode.listener = undefined;
    }
}
function updateAllEventListeners(oldVnode, vnode) {
    if (isUndefined(oldVnode.listener)) {
        createAllEventListeners(oldVnode, vnode);
    }
    else {
        vnode.listener = oldVnode.listener;
        vnode.listener.vnode = vnode;
    }
}
function createAllEventListeners(oldVnode, vnode) {
    var on = vnode.data.on;
    if (isUndefined(on)) {
        return;
    }
    var elm = vnode.elm;
    var listener = vnode.listener = createListener();
    listener.vnode = vnode;
    var name;
    for (name in on) {
        addEventListener.call(elm, name, listener, false);
    }
}
// @ts-ignore
var eventListenersModule = {
    update: updateAllEventListeners,
    create: createAllEventListeners,
    destroy: removeAllEventListeners
};

function updateToken(oldVnode, vnode) {
    var oldToken = oldVnode.data.token;
    var newToken = vnode.data.token;
    if (oldToken === newToken) {
        return;
    }
    var elm = vnode.elm;
    if (!isUndefined(oldToken)) {
        removeAttribute.call(elm, oldToken);
    }
    if (!isUndefined(newToken)) {
        setAttribute.call(elm, newToken, '');
    }
}
var tokenModule = {
    create: updateToken,
    update: updateToken,
};

function updateUID(oldVnode, vnode) {
    var oldUid = oldVnode.data.uid;
    var uid = vnode.data.uid;
    if (uid === oldUid) {
        return;
    }
    vnode.elm[OwnerKey] = uid;
}
// TODO: we might not need to do this in update, only in create!
var uidModule = {
    create: updateUID,
    update: updateUID,
};

var createElement = document.createElement, createElementNS = document.createElementNS, createTextNode = document.createTextNode, createComment = document.createComment, createDocumentFragment = document.createDocumentFragment;
var _a$3 = Node.prototype, insertBefore = _a$3.insertBefore, removeChild = _a$3.removeChild, appendChild = _a$3.appendChild;
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function setTextContent(node, text) {
    node.nodeValue = text;
}
var htmlDomApi = {
    createFragment: function () {
        return createDocumentFragment.call(document);
    },
    createElement: function (tagName) {
        return createElement.call(document, tagName);
    },
    createElementNS: function (namespaceURI, qualifiedName) {
        return createElementNS.call(document, namespaceURI, qualifiedName);
    },
    createTextNode: function (text) {
        return createTextNode.call(document, text);
    },
    createComment: function (text) {
        return createComment.call(document, text);
    },
    insertBefore: function (parent, newNode, referenceNode) {
        insertBefore.call(parent, newNode, referenceNode);
    },
    removeChild: function (node, child) {
        removeChild.call(node, child);
    },
    appendChild: function (node, child) {
        appendChild.call(node, child);
    },
    parentNode: parentNode,
    nextSibling: nextSibling,
    setTextContent: setTextContent,
};
var patchVNode = init$1([
    // Attrs need to be applied to element before props
    // IE11 will wipe out value on radio inputs if value
    // is set before type=radio.
    attributesModule,
    propsModule,
    classes,
    styleModule,
    eventListenersModule,
    tokenModule,
    uidModule,
], htmlDomApi);
var patchChildren = patchVNode.children;

var idx = 0;
var uid$1 = 0;
var OwnerKey = usesNativeSymbols ? Symbol('key') : '$$OwnerKey$$';
function addInsertionIndex(vm) {
    vm.idx = ++idx;
    var connected = Services.connected;
    if (connected) {
        invokeServiceHook(vm, connected);
    }
    var connectedCallback = vm.def.connectedCallback;
    if (!isUndefined(connectedCallback)) {
        invokeComponentCallback(vm, connectedCallback);
    }
}
function removeInsertionIndex(vm) {
    vm.idx = 0;
    var disconnected = Services.disconnected;
    if (disconnected) {
        invokeServiceHook(vm, disconnected);
    }
    var disconnectedCallback = vm.def.disconnectedCallback;
    if (!isUndefined(disconnectedCallback)) {
        invokeComponentCallback(vm, disconnectedCallback);
    }
}
function renderVM(vm) {
    if (vm.isDirty) {
        rehydrate(vm);
    }
}
function appendVM(vm) {
    if (vm.idx !== 0) {
        return; // already appended
    }
    addInsertionIndex(vm);
}
function removeVM(vm) {
    if (vm.idx === 0) {
        return; // already removed
    }
    removeInsertionIndex(vm);
    // just in case it comes back, with this we guarantee re-rendering it
    vm.isDirty = true;
    clearReactiveListeners(vm);
    // At this point we need to force the removal of all children because
    // we don't have a way to know that children custom element were removed
    // from the DOM. Once we move to use Custom Element APIs, we can remove this
    // because the disconnectedCallback will be triggered automatically when
    // removed from the DOM.
    patchShadowRoot(vm, []);
}
function createVM(tagName, elm, cmpSlots) {
    if (hasOwnProperty.call(elm, ViewModelReflection)) {
        return; // already created
    }
    var Ctor = getCtorByTagName(tagName);
    var def = getComponentDef(Ctor);
    var isRoot = arguments.length === 2; // root elements can't provide slotset
    uid$1 += 1;
    var vm = {
        uid: uid$1,
        idx: 0,
        isScheduled: false,
        isDirty: true,
        isRoot: isRoot,
        def: def,
        elm: elm,
        data: EmptyObject,
        context: create(null),
        cmpProps: create(null),
        rootProps: create(null),
        cmpTrack: create(null),
        cmpState: undefined,
        cmpSlots: cmpSlots,
        cmpEvents: undefined,
        cmpListener: undefined,
        cmpTemplate: undefined,
        cmpRoot: undefined,
        component: undefined,
        children: EmptyArray,
        hostAttrs: create(null),
        // used to track down all object-key pairs that makes this vm reactive
        deps: [],
    };
    createComponent(vm, Ctor);
    linkComponent(vm);
}
function rehydrate(vm) {
    if (vm.idx > 0 && vm.isDirty) {
        var children = renderComponent(vm);
        vm.isScheduled = false;
        patchShadowRoot(vm, children);
        processPostPatchCallbacks(vm);
    }
}
function patchErrorBoundaryVm(errorBoundaryVm) {
    var children = renderComponent(errorBoundaryVm);
    var elm = errorBoundaryVm.elm, oldCh = errorBoundaryVm.children;
    errorBoundaryVm.isScheduled = false;
    errorBoundaryVm.children = children; // caching the new children collection
    // patch function mutates vnodes by adding the element reference,
    // however, if patching fails it contains partial changes.
    // patch failures are caught in flushRehydrationQueue
    patchChildren(elm, oldCh, children);
    processPostPatchCallbacks(errorBoundaryVm);
}
function patchShadowRoot(vm, children) {
    var oldCh = vm.children;
    vm.children = children; // caching the new children collection
    if (children.length === 0 && oldCh.length === 0) {
        return; // nothing to do here
    }
    var error;
    try {
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        patchChildren(vm.elm, oldCh, children);
    }
    catch (e) {
        error = Object(e);
    }
    finally {
        if (!isUndefined(error)) {
            var errorBoundaryVm = getErrorBoundaryVMFromOwnElement(vm);
            if (isUndefined(errorBoundaryVm)) {
                throw error; // tslint:disable-line
            }
            recoverFromLifeCycleError(vm, errorBoundaryVm, error);
            // synchronously render error boundary's alternative view
            // to recover in the same tick
            if (errorBoundaryVm.isDirty) {
                patchErrorBoundaryVm(errorBoundaryVm);
            }
        }
    }
}
function processPostPatchCallbacks(vm) {
    var rendered = Services.rendered;
    if (rendered) {
        invokeServiceHook(vm, rendered);
    }
    var renderedCallback = vm.def.renderedCallback;
    if (!isUndefined(renderedCallback)) {
        invokeComponentCallback(vm, renderedCallback);
    }
}
var rehydrateQueue = [];
function flushRehydrationQueue() {
    var vms = rehydrateQueue.sort(function (a, b) { return a.idx - b.idx; });
    rehydrateQueue = []; // reset to a new queue
    for (var i = 0, len = vms.length; i < len; i += 1) {
        var vm = vms[i];
        try {
            rehydrate(vm);
        }
        catch (error) {
            var errorBoundaryVm = getErrorBoundaryVMFromParentElement(vm);
            if (isUndefined(errorBoundaryVm)) {
                if (i + 1 < len) {
                    // pieces of the queue are still pending to be rehydrated, those should have priority
                    if (rehydrateQueue.length === 0) {
                        addCallbackToNextTick(flushRehydrationQueue);
                    }
                    ArrayUnshift.apply(rehydrateQueue, ArraySlice.call(vms, i + 1));
                }
                // rethrowing the original error will break the current tick, but since the next tick is
                // already scheduled, it should continue patching the rest.
                throw error; // tslint:disable-line
            }
            // we only recover if error boundary is present in the hierarchy
            recoverFromLifeCycleError(vm, errorBoundaryVm, error);
            if (errorBoundaryVm.isDirty) {
                patchErrorBoundaryVm(errorBoundaryVm);
            }
        }
    }
}
function recoverFromLifeCycleError(failedVm, errorBoundaryVm, error) {
    if (isUndefined(error.wcStack)) {
        error.wcStack = getComponentStack(failedVm);
    }
    resetShadowRoot(failedVm); // remove offenders
    var errorCallback = errorBoundaryVm.def.errorCallback;
    // error boundaries must have an ErrorCallback
    invokeComponentCallback(errorBoundaryVm, errorCallback, [error, error.wcStack]);
}
function resetShadowRoot(vm) {
    var elm = vm.elm, oldCh = vm.children;
    vm.children = EmptyArray;
    if (oldCh.length === 0) {
        return; // optimization for the common case
    }
    try {
        // patch function mutates vnodes by adding the element reference,
        // however, if patching fails it contains partial changes.
        patchChildren(elm, oldCh, EmptyArray);
    }
    catch (e) {
        // in the event of patch failure force offender removal
        vm.elm.innerHTML = "";
    }
}
function scheduleRehydration(vm) {
    if (!vm.isScheduled) {
        vm.isScheduled = true;
        if (rehydrateQueue.length === 0) {
            addCallbackToNextTick(flushRehydrationQueue);
        }
        ArrayPush.call(rehydrateQueue, vm);
    }
}
function isNodeOwnedByVM(vm, node) {
    return node[OwnerKey] === vm.uid;
}
function wasNodePassedIntoVM(vm, node) {
    var elm = vm.elm;
    // TODO: we need to walk the parent path here as well, in case they passed it via slots multiple times
    return node[OwnerKey] === elm[OwnerKey];
}
function getErrorBoundaryVMFromParentElement(vm) {
    var elm = vm.elm;
    var parentElm = elm && elm.parentElement;
    return getErrorBoundaryVM(parentElm);
}
function getErrorBoundaryVMFromOwnElement(vm) {
    var elm = vm.elm;
    return getErrorBoundaryVM(elm);
}
function getErrorBoundaryVM(startingElement) {
    var elm = startingElement;
    var vm;
    while (!isNull(elm)) {
        vm = elm[ViewModelReflection];
        if (!isUndefined(vm) && !isUndefined(vm.def.errorCallback)) {
            return vm;
        }
        // TODO: if shadowDOM start preventing this walking process, we will
        // need to find a different way to find the right boundary
        elm = elm.parentElement;
    }
}
function getComponentStack(vm) {
    var wcStack = [];
    var elm = vm.elm;
    do {
        var currentVm = elm[ViewModelReflection];
        if (!isUndefined(currentVm)) {
            ArrayPush.call(wcStack, currentVm.component.toString());
        }
        elm = elm.parentElement;
    } while (!isNull(elm));
    return wcStack.reverse().join('\n\t');
}

var _a$4 = Node.prototype, removeChild$1 = _a$4.removeChild, appendChild$1 = _a$4.appendChild, insertBefore$1 = _a$4.insertBefore, replaceChild = _a$4.replaceChild;
var ConnectingSlot = Symbol();
var DisconnectingSlot = Symbol();
function callNodeSlot(node, slot) {
    if (!isUndefined(node[slot])) {
        node[slot]();
    }
    return node; // for convenience
}
// monkey patching Node methods to be able to detect the insertions and removal of
// root elements created via createElement.
assign(Node.prototype, {
    appendChild: function (newChild) {
        var appendedNode = appendChild$1.call(this, newChild);
        return callNodeSlot(appendedNode, ConnectingSlot);
    },
    insertBefore: function (newChild, referenceNode) {
        var insertedNode = insertBefore$1.call(this, newChild, referenceNode);
        return callNodeSlot(insertedNode, ConnectingSlot);
    },
    removeChild: function (oldChild) {
        var removedNode = removeChild$1.call(this, oldChild);
        return callNodeSlot(removedNode, DisconnectingSlot);
    },
    replaceChild: function (newChild, oldChild) {
        var replacedNode = replaceChild.call(this, newChild, oldChild);
        callNodeSlot(replacedNode, DisconnectingSlot);
        callNodeSlot(newChild, ConnectingSlot);
        return replacedNode;
    }
});
/**
 * This method is almost identical to document.createElement
 * (https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
 * with the slightly difference that in the options, you can pass the `is`
 * property set to a Constructor instead of just a string value. E.g.:
 *
 * const el = createElement('x-foo', { is: FooCtor });
 *
 * If the value of `is` attribute is not a constructor,
 * then it throws a TypeError.
 */
function createElement$1(sel, options) {
    if (options === void 0) { options = {}; }
    if (isUndefined(options) || !isFunction(options.is)) {
        throw new TypeError();
    }
    registerComponent(sel, options.is);
    // extracting the registered constructor just in case we need to force the tagName
    var Ctor = getCtorByTagName(sel);
    var forceTagName = Ctor.forceTagName;
    var tagName = isUndefined(forceTagName) ? sel : forceTagName;
    // Create element with correct tagName
    var element = document.createElement(tagName);
    if (hasOwnProperty.call(element, ViewModelReflection)) {
        return element;
    }
    // In case the element is not initialized already, we need to carry on the manual creation
    createVM(sel, element);
    // Handle insertion and removal from the DOM manually
    element[ConnectingSlot] = function () {
        var vm = getCustomElementVM(element);
        removeVM(vm); // moving the element from one place to another is observable via life-cycle hooks
        appendVM(vm);
        // TODO: this is the kind of awkwardness introduced by "is" attribute
        // We don't want to do this during construction because it breaks another
        // WC invariant.
        if (!isUndefined(forceTagName)) {
            element.setAttribute('is', sel);
        }
        renderVM(vm);
    };
    element[DisconnectingSlot] = function () {
        var vm = getCustomElementVM(element);
        removeVM(vm);
    };
    return element;
}

exports.createElement = createElement$1;
exports.getComponentDef = getComponentDef;
exports.Element = LWCElement;
exports.register = register;
exports.unwrap = unwrap$2;
exports.dangerousObjectMutation = dangerousObjectMutation;
exports.api = api$1;
exports.track = track;
exports.wire = wire;

Object.defineProperty(exports, '__esModule', { value: true });

})));
/** version: 0.18.0-1 */
