!function(root, factory) {
    "object" == typeof exports && "object" == typeof module ? module.exports = factory() : "function" == typeof define && define.amd ? define("tick42-glue-core", [], factory) : "object" == typeof exports ? exports["tick42-glue-core"] = factory() : root["tick42-glue-core"] = factory();
}(this, function() {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        var installedModules = {};
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.i = function(value) {
            return value;
        }, __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 45);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        (function(process, global) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            !function(global, factory) {
                "object" === _typeof(exports) && void 0 !== module ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_FACTORY__ = factory, 
                void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            }(0, function() {
                function objectOrFunction(x) {
                    return "function" == typeof x || "object" === (void 0 === x ? "undefined" : _typeof(x)) && null !== x;
                }
                function isFunction(x) {
                    return "function" == typeof x;
                }
                function setScheduler(scheduleFn) {
                    customSchedulerFn = scheduleFn;
                }
                function setAsap(asapFn) {
                    asap = asapFn;
                }
                function useVertxTimer() {
                    return void 0 !== vertxNext ? function() {
                        vertxNext(flush);
                    } : useSetTimeout();
                }
                function useSetTimeout() {
                    var globalSetTimeout = setTimeout;
                    return function() {
                        return globalSetTimeout(flush, 1);
                    };
                }
                function flush() {
                    for (var i = 0; i < len; i += 2) {
                        (0, queue[i])(queue[i + 1]), queue[i] = void 0, queue[i + 1] = void 0;
                    }
                    len = 0;
                }
                function then(onFulfillment, onRejection) {
                    var _arguments = arguments, parent = this, child = new this.constructor(noop);
                    void 0 === child[PROMISE_ID] && makePromise(child);
                    var _state = parent._state;
                    return _state ? function() {
                        var callback = _arguments[_state - 1];
                        asap(function() {
                            return invokeCallback(_state, child, callback, parent._result);
                        });
                    }() : subscribe(parent, child, onFulfillment, onRejection), child;
                }
                function resolve(object) {
                    var Constructor = this;
                    if (object && "object" === (void 0 === object ? "undefined" : _typeof(object)) && object.constructor === Constructor) return object;
                    var promise = new Constructor(noop);
                    return _resolve(promise, object), promise;
                }
                function noop() {}
                function selfFulfillment() {
                    return new TypeError("You cannot resolve a promise with itself");
                }
                function cannotReturnOwn() {
                    return new TypeError("A promises callback cannot return that same promise.");
                }
                function getThen(promise) {
                    try {
                        return promise.then;
                    } catch (error) {
                        return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                    }
                }
                function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                    try {
                        then.call(value, fulfillmentHandler, rejectionHandler);
                    } catch (e) {
                        return e;
                    }
                }
                function handleForeignThenable(promise, thenable, then) {
                    asap(function(promise) {
                        var sealed = !1, error = tryThen(then, thenable, function(value) {
                            sealed || (sealed = !0, thenable !== value ? _resolve(promise, value) : fulfill(promise, value));
                        }, function(reason) {
                            sealed || (sealed = !0, _reject(promise, reason));
                        }, "Settle: " + (promise._label || " unknown promise"));
                        !sealed && error && (sealed = !0, _reject(promise, error));
                    }, promise);
                }
                function handleOwnThenable(promise, thenable) {
                    thenable._state === FULFILLED ? fulfill(promise, thenable._result) : thenable._state === REJECTED ? _reject(promise, thenable._result) : subscribe(thenable, void 0, function(value) {
                        return _resolve(promise, value);
                    }, function(reason) {
                        return _reject(promise, reason);
                    });
                }
                function handleMaybeThenable(promise, maybeThenable, then$$) {
                    maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve ? handleOwnThenable(promise, maybeThenable) : then$$ === GET_THEN_ERROR ? (_reject(promise, GET_THEN_ERROR.error), 
                    GET_THEN_ERROR.error = null) : void 0 === then$$ ? fulfill(promise, maybeThenable) : isFunction(then$$) ? handleForeignThenable(promise, maybeThenable, then$$) : fulfill(promise, maybeThenable);
                }
                function _resolve(promise, value) {
                    promise === value ? _reject(promise, selfFulfillment()) : objectOrFunction(value) ? handleMaybeThenable(promise, value, getThen(value)) : fulfill(promise, value);
                }
                function publishRejection(promise) {
                    promise._onerror && promise._onerror(promise._result), publish(promise);
                }
                function fulfill(promise, value) {
                    promise._state === PENDING && (promise._result = value, promise._state = FULFILLED, 
                    0 !== promise._subscribers.length && asap(publish, promise));
                }
                function _reject(promise, reason) {
                    promise._state === PENDING && (promise._state = REJECTED, promise._result = reason, 
                    asap(publishRejection, promise));
                }
                function subscribe(parent, child, onFulfillment, onRejection) {
                    var _subscribers = parent._subscribers, length = _subscribers.length;
                    parent._onerror = null, _subscribers[length] = child, _subscribers[length + FULFILLED] = onFulfillment, 
                    _subscribers[length + REJECTED] = onRejection, 0 === length && parent._state && asap(publish, parent);
                }
                function publish(promise) {
                    var subscribers = promise._subscribers, settled = promise._state;
                    if (0 !== subscribers.length) {
                        for (var child = void 0, callback = void 0, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
                        callback = subscribers[i + settled], child ? invokeCallback(settled, child, callback, detail) : callback(detail);
                        promise._subscribers.length = 0;
                    }
                }
                function ErrorObject() {
                    this.error = null;
                }
                function tryCatch(callback, detail) {
                    try {
                        return callback(detail);
                    } catch (e) {
                        return TRY_CATCH_ERROR.error = e, TRY_CATCH_ERROR;
                    }
                }
                function invokeCallback(settled, promise, callback, detail) {
                    var hasCallback = isFunction(callback), value = void 0, error = void 0, succeeded = void 0, failed = void 0;
                    if (hasCallback) {
                        if (value = tryCatch(callback, detail), value === TRY_CATCH_ERROR ? (failed = !0, 
                        error = value.error, value.error = null) : succeeded = !0, promise === value) return void _reject(promise, cannotReturnOwn());
                    } else value = detail, succeeded = !0;
                    promise._state !== PENDING || (hasCallback && succeeded ? _resolve(promise, value) : failed ? _reject(promise, error) : settled === FULFILLED ? fulfill(promise, value) : settled === REJECTED && _reject(promise, value));
                }
                function initializePromise(promise, resolver) {
                    try {
                        resolver(function(value) {
                            _resolve(promise, value);
                        }, function(reason) {
                            _reject(promise, reason);
                        });
                    } catch (e) {
                        _reject(promise, e);
                    }
                }
                function nextId() {
                    return id++;
                }
                function makePromise(promise) {
                    promise[PROMISE_ID] = id++, promise._state = void 0, promise._result = void 0, promise._subscribers = [];
                }
                function Enumerator(Constructor, input) {
                    this._instanceConstructor = Constructor, this.promise = new Constructor(noop), this.promise[PROMISE_ID] || makePromise(this.promise), 
                    isArray(input) ? (this._input = input, this.length = input.length, this._remaining = input.length, 
                    this._result = new Array(this.length), 0 === this.length ? fulfill(this.promise, this._result) : (this.length = this.length || 0, 
                    this._enumerate(), 0 === this._remaining && fulfill(this.promise, this._result))) : _reject(this.promise, validationError());
                }
                function validationError() {
                    return new Error("Array Methods must be provided an Array");
                }
                function all(entries) {
                    return new Enumerator(this, entries).promise;
                }
                function race(entries) {
                    var Constructor = this;
                    return new Constructor(isArray(entries) ? function(resolve, reject) {
                        for (var length = entries.length, i = 0; i < length; i++) Constructor.resolve(entries[i]).then(resolve, reject);
                    } : function(_, reject) {
                        return reject(new TypeError("You must pass an array to race."));
                    });
                }
                function reject(reason) {
                    var Constructor = this, promise = new Constructor(noop);
                    return _reject(promise, reason), promise;
                }
                function needsResolver() {
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                }
                function needsNew() {
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                }
                function Promise(resolver) {
                    this[PROMISE_ID] = nextId(), this._result = this._state = void 0, this._subscribers = [], 
                    noop !== resolver && ("function" != typeof resolver && needsResolver(), this instanceof Promise ? initializePromise(this, resolver) : needsNew());
                }
                function polyfill() {
                    var local = void 0;
                    if (void 0 !== global) local = global; else if ("undefined" != typeof self) local = self; else try {
                        local = Function("return this")();
                    } catch (e) {
                        throw new Error("polyfill failed because global object is unavailable in this environment");
                    }
                    var P = local.Promise;
                    if (P) {
                        var promiseToString = null;
                        try {
                            promiseToString = Object.prototype.toString.call(P.resolve());
                        } catch (e) {}
                        if ("[object Promise]" === promiseToString && !P.cast) return;
                    }
                    local.Promise = Promise;
                }
                var _isArray = void 0;
                _isArray = Array.isArray ? Array.isArray : function(x) {
                    return "[object Array]" === Object.prototype.toString.call(x);
                };
                var isArray = _isArray, len = 0, vertxNext = void 0, customSchedulerFn = void 0, asap = function(callback, arg) {
                    queue[len] = callback, queue[len + 1] = arg, 2 === (len += 2) && (customSchedulerFn ? customSchedulerFn(flush) : scheduleFlush());
                }, browserWindow = "undefined" != typeof window ? window : void 0, browserGlobal = browserWindow || {}, BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver, isNode = "undefined" == typeof self && void 0 !== process && "[object process]" === {}.toString.call(process), isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, queue = new Array(1e3), scheduleFlush = void 0;
                scheduleFlush = isNode ? function() {
                    return function() {
                        return process.nextTick(flush);
                    };
                }() : BrowserMutationObserver ? function() {
                    var iterations = 0, observer = new BrowserMutationObserver(flush), node = document.createTextNode("");
                    return observer.observe(node, {
                        characterData: !0
                    }), function() {
                        node.data = iterations = ++iterations % 2;
                    };
                }() : isWorker ? function() {
                    var channel = new MessageChannel();
                    return channel.port1.onmessage = flush, function() {
                        return channel.port2.postMessage(0);
                    };
                }() : void 0 === browserWindow ? function() {
                    try {
                        var vertx = __webpack_require__(48);
                        return vertxNext = vertx.runOnLoop || vertx.runOnContext, useVertxTimer();
                    } catch (e) {
                        return useSetTimeout();
                    }
                }() : useSetTimeout();
                var PROMISE_ID = Math.random().toString(36).substring(16), PENDING = void 0, FULFILLED = 1, REJECTED = 2, GET_THEN_ERROR = new ErrorObject(), TRY_CATCH_ERROR = new ErrorObject(), id = 0;
                return Enumerator.prototype._enumerate = function() {
                    for (var length = this.length, _input = this._input, i = 0; this._state === PENDING && i < length; i++) this._eachEntry(_input[i], i);
                }, Enumerator.prototype._eachEntry = function(entry, i) {
                    var c = this._instanceConstructor, resolve$$ = c.resolve;
                    if (resolve$$ === resolve) {
                        var _then = getThen(entry);
                        if (_then === then && entry._state !== PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" != typeof _then) this._remaining--, 
                        this._result[i] = entry; else if (c === Promise) {
                            var promise = new c(noop);
                            handleMaybeThenable(promise, entry, _then), this._willSettleAt(promise, i);
                        } else this._willSettleAt(new c(function(resolve$$) {
                            return resolve$$(entry);
                        }), i);
                    } else this._willSettleAt(resolve$$(entry), i);
                }, Enumerator.prototype._settledAt = function(state, i, value) {
                    var promise = this.promise;
                    promise._state === PENDING && (this._remaining--, state === REJECTED ? _reject(promise, value) : this._result[i] = value), 
                    0 === this._remaining && fulfill(promise, this._result);
                }, Enumerator.prototype._willSettleAt = function(promise, i) {
                    var enumerator = this;
                    subscribe(promise, void 0, function(value) {
                        return enumerator._settledAt(FULFILLED, i, value);
                    }, function(reason) {
                        return enumerator._settledAt(REJECTED, i, reason);
                    });
                }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, 
                Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, 
                Promise.prototype = {
                    constructor: Promise,
                    then: then,
                    catch: function(onRejection) {
                        return this.then(null, onRejection);
                    }
                }, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
            });
        }).call(exports, __webpack_require__(13), __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var g, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        g = function() {
            return this;
        }();
        try {
            g = g || Function("return this")() || (0, eval)("this");
        } catch (e) {
            "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)) && (g = window);
        }
        module.exports = g;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function() {
            function add(key, callback) {
                var callbacksForKey = callbacks[key];
                return callbacksForKey || (callbacksForKey = [], callbacks[key] = callbacksForKey), 
                callbacksForKey.push(callback), function() {
                    var allForKey = callbacks[key];
                    allForKey = allForKey.filter(function(item) {
                        return item !== callback;
                    }), callbacks[key] = allForKey;
                };
            }
            function execute(key) {
                var callbacksForKey = callbacks[key];
                if (!callbacksForKey || 0 === callbacksForKey.length) return [];
                var args = [].splice.call(arguments, 1), results = [];
                return callbacksForKey.forEach(function(callback) {
                    try {
                        var result = callback.apply(void 0, args);
                        results.push(result);
                    } catch (err) {
                        results.push(void 0);
                    }
                }), results;
            }
            var callbacks = {};
            return {
                add: add,
                execute: execute
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var shortid = __webpack_require__(8);
        module.exports = function() {
            return shortid();
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function convertInfoToInstance(info) {
            return "object" !== (void 0 === info ? "undefined" : _typeof(info)) && (info = {}), 
            {
                application: info.ApplicationName,
                environment: info.Environment,
                machine: info.MachineName,
                pid: info.ProcessId,
                region: info.Region,
                service: info.ServiceName,
                user: info.UserName,
                started: info.ProcessStartTime
            };
        }
        function isStreamingFlagSet(flags) {
            if ("number" != typeof flags || isNaN(flags)) return !1;
            return 32 == (32 & flags);
        }
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        module.exports = {
            isStreamingFlagSet: isStreamingFlagSet,
            convertInfoToInstance: convertInfoToInstance
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function reset() {
            shuffled = !1;
        }
        function setCharacters(_alphabet_) {
            if (!_alphabet_) return void (alphabet !== ORIGINAL && (alphabet = ORIGINAL, reset()));
            if (_alphabet_ !== alphabet) {
                if (_alphabet_.length !== ORIGINAL.length) throw new Error("Custom alphabet for shortid must be " + ORIGINAL.length + " unique characters. You submitted " + _alphabet_.length + " characters: " + _alphabet_);
                var unique = _alphabet_.split("").filter(function(item, ind, arr) {
                    return ind !== arr.lastIndexOf(item);
                });
                if (unique.length) throw new Error("Custom alphabet for shortid must be " + ORIGINAL.length + " unique characters. These characters were not unique: " + unique.join(", "));
                alphabet = _alphabet_, reset();
            }
        }
        function characters(_alphabet_) {
            return setCharacters(_alphabet_), alphabet;
        }
        function setSeed(seed) {
            randomFromSeed.seed(seed), previousSeed !== seed && (reset(), previousSeed = seed);
        }
        function shuffle() {
            alphabet || setCharacters(ORIGINAL);
            for (var characterIndex, sourceArray = alphabet.split(""), targetArray = [], r = randomFromSeed.nextValue(); sourceArray.length > 0; ) r = randomFromSeed.nextValue(), 
            characterIndex = Math.floor(r * sourceArray.length), targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
            return targetArray.join("");
        }
        function getShuffled() {
            return shuffled || (shuffled = shuffle());
        }
        function lookup(index) {
            return getShuffled()[index];
        }
        var alphabet, previousSeed, shuffled, randomFromSeed = __webpack_require__(19), ORIGINAL = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
        module.exports = {
            characters: characters,
            seed: setSeed,
            lookup: lookup,
            shuffled: getShuffled
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function(promise, successCallback, errorCallback) {
            if ("function" != typeof successCallback && "function" != typeof errorCallback) return promise;
            "function" != typeof successCallback ? successCallback = function() {} : "function" != typeof errorCallback && (errorCallback = function() {}), 
            promise.then(successCallback, errorCallback);
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = function(module) {
            return module.webpackPolyfill || (module.deprecate = function() {}, module.paths = [], 
            module.children || (module.children = []), Object.defineProperty(module, "loaded", {
                enumerable: !0,
                get: function() {
                    return module.l;
                }
            }), Object.defineProperty(module, "id", {
                enumerable: !0,
                get: function() {
                    return module.i;
                }
            }), module.webpackPolyfill = 1), module;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = __webpack_require__(16);
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function default_1(userConfiguration, hardDefaults) {
            var merge = __webpack_require__(12), config = userConfiguration, global = function() {
                return this;
            }();
            "undefined" != typeof window && (global = global || window), global = global || {};
            var defaults = merge(hardDefaults || {}, global.GLUE_DEFAULT_CONFIG || {});
            return Object.keys(defaults).length && (config = merge(defaults, config, {
                clone: !0
            })), {
                config: config,
                defaults: defaults
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = default_1;
    }, function(module, exports) {
        module.exports = {
            _args: [ [ {
                raw: "tick42-agm@3.5.3",
                scope: null,
                escapedName: "tick42-agm",
                name: "tick42-agm",
                rawSpec: "3.5.3",
                spec: "3.5.3",
                type: "version"
            }, "D:\\source\\glue-dev\\node_modules\\tick42-glue-core" ] ],
            _from: "tick42-agm@3.5.3",
            _id: "tick42-agm@3.5.3",
            _inCache: !0,
            _location: "/tick42-agm",
            _phantomChildren: {},
            _requested: {
                raw: "tick42-agm@3.5.3",
                scope: null,
                escapedName: "tick42-agm",
                name: "tick42-agm",
                rawSpec: "3.5.3",
                spec: "3.5.3",
                type: "version"
            },
            _requiredBy: [ "/" ],
            _resolved: "http://repo.tick42.com:8081/artifactory/api/npm/tick42-npm/tick42-agm/-/tick42-agm-3.5.3.tgz",
            _shasum: "b4108266dcc85f5e7f6a375eb51ed1ee38b86283",
            _shrinkwrap: null,
            _spec: "tick42-agm@3.5.3",
            _where: "D:\\source\\glue-dev\\node_modules\\tick42-glue-core",
            author: {
                name: "Tick42",
                url: "http://www.tick42.com"
            },
            bugs: {
                url: "https://jira.tick42.com/browse/APPCTRL"
            },
            dependencies: {
                "callback-registry": "^2.2.1",
                shortid: "^2.2.6",
                "util-deprecate": "^1.0.2"
            },
            description: "JavaScript AGM",
            devDependencies: {
                "babel-core": "^6.17.0",
                "babel-loader": "^6.2.5",
                "babel-plugin-add-module-exports": "^0.2.1",
                "babel-plugin-es6-promise": "^1.0.0",
                "babel-preset-es2015": "^6.16.0",
                "babel-preset-stage-2": "^6.22.0",
                blanket: "^1.1.6",
                bluebird: "^2.9.30",
                docdash: "^0.4.0",
                eslint: "^3.1.1",
                "eslint-config-standard": "^5.3.5",
                "eslint-config-tick42": "^1.0.6",
                "eslint-plugin-promise": "^2.0.0",
                "eslint-plugin-standard": "^2.0.0",
                "http-server": "^0.9.0",
                minifyify: "^7.3.2",
                onchange: "^2.1.2",
                phantomjs: "^1.9.12",
                "pre-commit": "^1.1.3",
                qunitjs: "^1.15.0",
                shelljs: "^0.6.0",
                "tick42-webpack-config": "1.3.1",
                webpack: "2.3.3"
            },
            dist: {
                tarball: "http://repo.tick42.com:8081/artifactory/api/npm/tick42-npm/tick42-agm/-/tick42-agm-3.5.3.tgz",
                shasum: "b4108266dcc85f5e7f6a375eb51ed1ee38b86283"
            },
            keywords: [ "agm", "javascript", "library" ],
            main: "src/main.js",
            name: "tick42-agm",
            optionalDependencies: {},
            precommit: "eslint",
            readme: "ERROR: No README data found!",
            scripts: {
                build: "npm run eslint && webpack",
                eslint: "eslint library",
                "eslint:fix": "eslint library --fix",
                "generate-docs": "jsdoc -c jsdoc-config.json",
                prepublish: "npm update & npm run build",
                serve: "http-server -p 8000 -a 127.0.0.1",
                test: 'npm run eslint && mocha --require ./test/test_helper "test/**/*.js"',
                watch: 'onchange "./library/**/*.js" -iv -e "./bin" -- npm run build',
                "watch-docs": 'onchange "./library/*.js" -iv -e "./bin" -- npm run generate-docs'
            },
            title: "Tick42 AGM",
            version: "3.5.3"
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise;
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var tick42_metrics_1 = __webpack_require__(42), tick42_gateway_connection_1 = __webpack_require__(40), tick42_logger_1 = __webpack_require__(41), tick42_agm_1 = __webpack_require__(29), config_1 = __webpack_require__(43), dummyConnection_1 = __webpack_require__(44), timer_1 = __webpack_require__(46), mergeConfigWithDefaults_1 = __webpack_require__(9), GlueCore = function(userConfig) {
            function registerLib(name, inner, timer) {
                inner.initStartTime = timer.startTime, inner.ready ? inner.ready().then(function() {
                    inner.initTime = timer.stop(), inner.initEndTime = timer.endTime;
                }) : (inner.initTime = timer.stop(), inner.initEndTime = timer.endTime), libs[name] = inner;
            }
            function setupConnection() {
                var initTimer = timer_1.default();
                return internalConfig.connection.logger = _logger.subLogger("connection"), _connection = tick42_gateway_connection_1.default(internalConfig.connection), 
                internalConfig.connection && !internalConfig.auth && internalConfig.connection.protocolVersion > 1 && _Promise.reject("You need to provide auth information"), 
                internalConfig.auth ? new _Promise(function(resolve, reject) {
                    var authRequest;
                    if ("string" == typeof internalConfig.auth || "number" == typeof internalConfig.auth) authRequest = {
                        token: internalConfig.auth
                    }; else {
                        if ("[object Object]" !== Object.prototype.toString.call(internalConfig.auth)) throw new Error("Invalid auth object - " + JSON.stringify(internalConfig.auth));
                        authRequest = internalConfig.auth;
                    }
                    _connection.login(authRequest).then(function(identity) {
                        identity && (identity.machine && (internalConfig.agm.instance.machine = identity.machine), 
                        identity.username && (internalConfig.agm.instance.user = identity.username)), registerLib("connection", _connection, initTimer), 
                        resolve(internalConfig);
                    }).catch(function(err) {
                        reject(err);
                    });
                }) : (registerLib("connection", _connection, initTimer), _Promise.resolve());
            }
            function setupMetrics() {
                var initTimer = timer_1.default();
                return _rootMetrics = tick42_metrics_1.default({
                    identity: internalConfig.metrics.identity,
                    connection: internalConfig.metrics ? _connection : dummyConnection_1.default,
                    logger: _logger.subLogger("metrics")
                }), _metrics = _rootMetrics.subSystem("App"), _logger.metricsLevel("warn", _metrics.parent.subSystem("LogEvents")), 
                registerLib("metrics", _metrics, initTimer), _Promise.resolve();
            }
            function setupAGM() {
                var initTimer = timer_1.default(), agmConfig = {
                    instance: internalConfig.agm.instance,
                    connection: _connection,
                    metrics: _rootMetrics.subSystem("AGM"),
                    logger: _logger.subLogger("agm")
                };
                return new _Promise(function(resolve, reject) {
                    tick42_agm_1.default(agmConfig).then(function(agmLib) {
                        _agm = agmLib, registerLib("agm", _agm, initTimer), resolve(internalConfig);
                    }).catch(function(err) {
                        return reject(err);
                    });
                });
            }
            function setupExternalLibs(externalLibs) {
                try {
                    return externalLibs.forEach(function(lib) {
                        setupExternalLib(lib.name, lib.create);
                    }), _Promise.resolve();
                } catch (e) {
                    return _Promise.reject(e);
                }
            }
            function setupExternalLib(name, createCallback) {
                var initTimer = timer_1.default(), lib = createCallback(libs);
                lib && registerLib(name, lib, initTimer);
            }
            function waitForLibs() {
                var libsReadyPromises = Object.keys(libs).map(function(key) {
                    var lib = libs[key];
                    return lib.ready ? lib.ready() : _Promise.resolve();
                });
                return _Promise.all(libsReadyPromises);
            }
            function constructGlueObject() {
                var feedbackFunc = function() {
                    _agm && _agm.invoke("T42.ACS.Feedback", {}, "best");
                }, info = {
                    glueVersion: internalConfig.version
                };
                glueInitTimer.stop();
                var glue = {
                    feedback: feedbackFunc,
                    info: info,
                    version: internalConfig.version
                };
                if (glue.performance = {
                    get browser() {
                        return window.performance.timing;
                    },
                    get memory() {
                        return window.performance.memory;
                    },
                    get initTimes() {
                        var result = Object.keys(glue).filter(function(key) {
                            return "initTimes" !== key && glue[key].initTime;
                        }).map(function(key) {
                            return {
                                name: key,
                                time: glue[key].initTime,
                                startTime: glue[key].initStartTime,
                                endTime: glue[key].initEndTime
                            };
                        });
                        return result.push({
                            name: "glue",
                            startTime: glueInitTimer.startTime,
                            endTime: glueInitTimer.endTime,
                            time: glueInitTimer.period
                        }), result;
                    }
                }, internalConfig.configurationData = internalConfig.configurationData || {}, glue.configurationData = glue.configurationData || {}, 
                glue.configurationData.glueCore = internalConfig.configurationData, glue.configurationData.glueCore.final = internalConfig, 
                delete internalConfig.configurationData, Object.keys(libs).forEach(function(key) {
                    var lib = libs[key];
                    glue[key] = lib, info[key] = lib.version;
                }), hc && hc.perfDataNeeded && hc.updatePerfData) {
                    var delay = hc.perfDataDelay || 100;
                    setTimeout(function() {
                        hc.updatePerfData(glue.performance);
                    }, delay);
                }
                return glue;
            }
            var glueInitTimer = timer_1.default();
            userConfig = userConfig || {};
            var _connection, _agm, _logger, _rootMetrics, _metrics, internalConfig = config_1.default(userConfig), hc = "undefined" != typeof window && window.htmlContainer, libs = {};
            return function() {
                var initTimer = timer_1.default(), loggerConfig = {
                    identity: internalConfig.metrics.identity,
                    getConnection: function() {
                        return _connection || dummyConnection_1.default;
                    },
                    publish: internalConfig.logger.publish || "off",
                    console: internalConfig.logger.console || "info",
                    metrics: internalConfig.logger.metrics || "off"
                };
                return _logger = tick42_logger_1.default(loggerConfig), registerLib("logger", _logger, initTimer), 
                _Promise.resolve();
            }().then(setupConnection).then(setupMetrics).then(setupAGM).then(function() {
                return setupExternalLibs(internalConfig.libs || []);
            }).then(waitForLibs).then(constructGlueObject).catch(function(err) {
                return _Promise.reject({
                    err: err,
                    libs: libs
                });
            });
        };
        GlueCore.implementation = {
            mergeConfigWithDefaults: mergeConfigWithDefaults_1.default
        }, exports.default = GlueCore;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        !function(root, factory) {
            __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__);
        }(0, function() {
            function isMergeableObject(val) {
                return val && "object" === (void 0 === val ? "undefined" : _typeof(val)) && "[object RegExp]" !== Object.prototype.toString.call(val) && "[object Date]" !== Object.prototype.toString.call(val);
            }
            function emptyTarget(val) {
                return Array.isArray(val) ? [] : {};
            }
            function cloneIfNecessary(value, optionsArgument) {
                return optionsArgument && !0 === optionsArgument.clone && isMergeableObject(value) ? deepmerge(emptyTarget(value), value, optionsArgument) : value;
            }
            function defaultArrayMerge(target, source, optionsArgument) {
                var destination = target.slice();
                return source.forEach(function(e, i) {
                    void 0 === destination[i] ? destination[i] = cloneIfNecessary(e, optionsArgument) : isMergeableObject(e) ? destination[i] = deepmerge(target[i], e, optionsArgument) : -1 === target.indexOf(e) && destination.push(cloneIfNecessary(e, optionsArgument));
                }), destination;
            }
            function mergeObject(target, source, optionsArgument) {
                var destination = {};
                return isMergeableObject(target) && Object.keys(target).forEach(function(key) {
                    destination[key] = cloneIfNecessary(target[key], optionsArgument);
                }), Object.keys(source).forEach(function(key) {
                    isMergeableObject(source[key]) && target[key] ? destination[key] = deepmerge(target[key], source[key], optionsArgument) : destination[key] = cloneIfNecessary(source[key], optionsArgument);
                }), destination;
            }
            function deepmerge(target, source, optionsArgument) {
                var array = Array.isArray(source), options = optionsArgument || {
                    arrayMerge: defaultArrayMerge
                }, arrayMerge = options.arrayMerge || defaultArrayMerge;
                return array ? Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument) : mergeObject(target, source, optionsArgument);
            }
            return deepmerge.all = function(array, optionsArgument) {
                if (!Array.isArray(array) || array.length < 2) throw new Error("first argument should be an array with at least two elements");
                return array.reduce(function(prev, next) {
                    return deepmerge(prev, next, optionsArgument);
                });
            }, deepmerge;
        });
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function defaultSetTimout() {
            throw new Error("setTimeout has not been defined");
        }
        function defaultClearTimeout() {
            throw new Error("clearTimeout has not been defined");
        }
        function runTimeout(fun) {
            if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
            if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
            setTimeout(fun, 0);
            try {
                return cachedSetTimeout(fun, 0);
            } catch (e) {
                try {
                    return cachedSetTimeout.call(null, fun, 0);
                } catch (e) {
                    return cachedSetTimeout.call(this, fun, 0);
                }
            }
        }
        function runClearTimeout(marker) {
            if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
            if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
            clearTimeout(marker);
            try {
                return cachedClearTimeout(marker);
            } catch (e) {
                try {
                    return cachedClearTimeout.call(null, marker);
                } catch (e) {
                    return cachedClearTimeout.call(this, marker);
                }
            }
        }
        function cleanUpNextTick() {
            draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
            queue.length && drainQueue());
        }
        function drainQueue() {
            if (!draining) {
                var timeout = runTimeout(cleanUpNextTick);
                draining = !0;
                for (var len = queue.length; len; ) {
                    for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                    queueIndex = -1, len = queue.length;
                }
                currentQueue = null, draining = !1, runClearTimeout(timeout);
            }
        }
        function Item(fun, array) {
            this.fun = fun, this.array = array;
        }
        function noop() {}
        var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
        !function() {
            try {
                cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
            } catch (e) {
                cachedSetTimeout = defaultSetTimout;
            }
            try {
                cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
            } catch (e) {
                cachedClearTimeout = defaultClearTimeout;
            }
        }();
        var currentQueue, queue = [], draining = !1, queueIndex = -1;
        process.nextTick = function(fun) {
            var args = new Array(arguments.length - 1);
            if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
            queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
        }, Item.prototype.run = function() {
            this.fun.apply(null, this.array);
        }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
        process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
        process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
        process.emit = noop, process.binding = function(name) {
            throw new Error("process.binding is not supported");
        }, process.cwd = function() {
            return "/";
        }, process.chdir = function(dir) {
            throw new Error("process.chdir is not supported");
        }, process.umask = function() {
            return 0;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function decode(id) {
            var characters = alphabet.shuffled();
            return {
                version: 15 & characters.indexOf(id.substr(0, 1)),
                worker: 15 & characters.indexOf(id.substr(1, 1))
            };
        }
        var alphabet = __webpack_require__(5);
        module.exports = decode;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function encode(lookup, number) {
            for (var done, loopCounter = 0, str = ""; !done; ) str += lookup(number >> 4 * loopCounter & 15 | randomByte()), 
            done = number < Math.pow(16, loopCounter + 1), loopCounter++;
            return str;
        }
        var randomByte = __webpack_require__(18);
        module.exports = encode;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function generate() {
            var str = "", seconds = Math.floor(.001 * (Date.now() - REDUCE_TIME));
            return seconds === previousSeconds ? counter++ : (counter = 0, previousSeconds = seconds), 
            str += encode(alphabet.lookup, version), str += encode(alphabet.lookup, clusterWorkerId), 
            counter > 0 && (str += encode(alphabet.lookup, counter)), str += encode(alphabet.lookup, seconds);
        }
        function seed(seedValue) {
            return alphabet.seed(seedValue), module.exports;
        }
        function worker(workerId) {
            return clusterWorkerId = workerId, module.exports;
        }
        function characters(newCharacters) {
            return void 0 !== newCharacters && alphabet.characters(newCharacters), alphabet.shuffled();
        }
        var counter, previousSeconds, alphabet = __webpack_require__(5), encode = __webpack_require__(15), decode = __webpack_require__(14), isValid = __webpack_require__(17), REDUCE_TIME = 1459707606518, version = 6, clusterWorkerId = __webpack_require__(20) || 0;
        module.exports = generate, module.exports.generate = generate, module.exports.seed = seed, 
        module.exports.worker = worker, module.exports.characters = characters, module.exports.decode = decode, 
        module.exports.isValid = isValid;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function isShortId(id) {
            if (!id || "string" != typeof id || id.length < 6) return !1;
            for (var characters = alphabet.characters(), len = id.length, i = 0; i < len; i++) if (-1 === characters.indexOf(id[i])) return !1;
            return !0;
        }
        var alphabet = __webpack_require__(5);
        module.exports = isShortId;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function randomByte() {
            if (!crypto || !crypto.getRandomValues) return 48 & Math.floor(256 * Math.random());
            var dest = new Uint8Array(1);
            return crypto.getRandomValues(dest), 48 & dest[0];
        }
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, crypto = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)) && (window.crypto || window.msCrypto);
        module.exports = randomByte;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function getNextValue() {
            return (seed = (9301 * seed + 49297) % 233280) / 233280;
        }
        function setSeed(_seed_) {
            seed = _seed_;
        }
        var seed = 1;
        module.exports = {
            nextValue: getNextValue,
            seed: setSeed
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        module.exports = 0;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var random = __webpack_require__(3);
        module.exports = function(protocol) {
            function invoke(method, argumentsObj, target, stuff, success, error) {
                var invocationId = random();
                registerInvocation(invocationId, {
                    method: method,
                    calledWith: argumentsObj
                }, success, error, stuff.method_response_timeout), protocol.invoke(invocationId, method, argumentsObj, target, stuff);
            }
            function registerInvocation(invocationId, response, success, error, timeout) {
                pendingCallbacks[invocationId] = {
                    response: response,
                    success: success,
                    error: error
                }, setTimeout(function() {
                    void 0 !== pendingCallbacks[invocationId] && (error({
                        method: response.method,
                        called_with: response.calledWith,
                        message: "Timeout reached"
                    }), delete pendingCallbacks[invocationId]);
                }, timeout);
            }
            function processInvocationResult(invocationId, executedBy, status, result, resultMessage) {
                var callback = pendingCallbacks[invocationId];
                void 0 !== callback && (0 === status && "function" == typeof callback.success ? callback.success({
                    method: callback.response.method.info,
                    called_with: callback.response.calledWith,
                    executed_by: executedBy,
                    returned: result,
                    message: resultMessage
                }) : "function" == typeof callback.error && callback.error({
                    method: callback.response.method.info,
                    called_with: callback.response.calledWith,
                    executed_by: executedBy,
                    message: resultMessage,
                    status: status,
                    returned: result
                }), delete pendingCallbacks[invocationId]);
            }
            var pendingCallbacks = {};
            return protocol.onInvocationResult(processInvocationResult), {
                invoke: invoke
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, ClientInvocationsState = __webpack_require__(21), promisify = __webpack_require__(6);
            module.exports = function(protocol, repo, instance, configuration) {
                function getMethods(methodFilter) {
                    return void 0 === methodFilter ? repo.getMethods() : ("string" == typeof methodFilter && (methodFilter = {
                        name: methodFilter
                    }), repo.getMethods().filter(function(method) {
                        return methodMatch(methodFilter, method.info);
                    }));
                }
                function getMethodsForInstance(instanceFilter) {
                    var allServers = repo.getServers(), matchingServers = allServers.filter(function(server) {
                        return instanceMatch(instanceFilter, server.info);
                    });
                    if (0 === matchingServers.length) return [];
                    var resultMethodsObject = {};
                    return 1 === matchingServers.length ? resultMethodsObject = matchingServers[0].methods : matchingServers.forEach(function(server) {
                        Object.keys(server.methods).forEach(function(methodKey) {
                            var method = server.methods[methodKey];
                            resultMethodsObject[method.id] = method.getInfoForUser();
                        });
                    }), Object.keys(resultMethodsObject).map(function(key) {
                        return resultMethodsObject[key];
                    });
                }
                function getServers(methodFilter) {
                    var servers = repo.getServers();
                    return void 0 === methodFilter ? servers.map(function(server) {
                        return {
                            server: server
                        };
                    }) : void 0 === getMethods(methodFilter) ? [] : servers.reduce(function(prev, current) {
                        var methods = repo.getServerMethodsById(current.id), matchingMethods = methods.filter(function(method) {
                            return methodMatch(methodFilter, method.info);
                        });
                        return matchingMethods.length > 0 && prev.push({
                            server: current,
                            methods: matchingMethods
                        }), prev;
                    }, []);
                }
                function getServerMethodsByFilterAndTarget(methodFilter, target) {
                    return filterByTarget(target, getServers(methodFilter));
                }
                function invoke(methodFilter, argumentObj, target, additionalOptions, success, error) {
                    var promise = new _Promise(function(resolve, reject) {
                        var successProxy, errorProxy;
                        successProxy = function(args) {
                            resolve(args);
                        }, errorProxy = function(args) {
                            reject(args);
                        }, argumentObj || (argumentObj = {}), target || (target = "best"), "string" == typeof target && "all" !== target && "best" !== target && reject({
                            message: '"' + target + '" is not a valid target. Valid targets are "all" and "best".'
                        }), additionalOptions || (additionalOptions = {}), void 0 === additionalOptions.method_response_timeout && (additionalOptions.method_response_timeout = configuration.method_response_timeout), 
                        void 0 === additionalOptions.waitTimeoutMs && void 0 !== additionalOptions.wait_for_method_timeout && (additionalOptions.waitTimeoutMs = additionalOptions.wait_for_method_timeout), 
                        void 0 !== additionalOptions.waitTimeoutMs && "number" != typeof additionalOptions.waitTimeoutMs && reject({
                            message: '"' + additionalOptions.waitTimeoutMs + "\" is not a valid number for 'waitTimeoutMs'"
                        }), void 0 === additionalOptions.waitTimeoutMs && (additionalOptions.waitTimeoutMs = configuration.wait_for_method_timeout), 
                        "object" !== (void 0 === argumentObj ? "undefined" : _typeof(argumentObj)) && reject({
                            message: "The method arguments must be an object."
                        }), "string" == typeof methodFilter && (methodFilter = {
                            name: methodFilter
                        });
                        var serversMethodMap = getServerMethodsByFilterAndTarget(methodFilter, target);
                        if (0 === serversMethodMap.length) invokeUnexisting(methodFilter, argumentObj, target, additionalOptions, successProxy, errorProxy); else if (1 === serversMethodMap.length) {
                            var serverMethodPair = serversMethodMap[0];
                            clientInvocations.invoke(serverMethodPair.methods[0], argumentObj, serverMethodPair.server, additionalOptions, successProxy, errorProxy);
                        } else invokeOnAll(serversMethodMap, argumentObj, additionalOptions, successProxy, errorProxy);
                    });
                    return promisify(promise, success, error);
                }
                function invokeUnexisting(methodFilter, argumentObj, target, additionalOptions, success, error) {
                    function callError() {
                        error({
                            method: methodFilter,
                            called_with: argumentObj,
                            message: "Can not find a method matching " + JSON.stringify(methodFilter) + " with server filter " + JSON.stringify(target)
                        });
                    }
                    if (0 === additionalOptions.waitTimeoutMs) callError(); else {
                        var delayTillNow = 0;
                        setTimeout(function retry() {
                            delayTillNow += 500, getServerMethodsByFilterAndTarget(methodFilter, target).length > 0 ? invoke(methodFilter, argumentObj, target, additionalOptions, success, error) : delayTillNow >= additionalOptions.waitTimeoutMs ? callError() : setTimeout(retry, 500);
                        }, 500);
                    }
                }
                function invokeOnAll(serverMethodsMap, argumentObj, additionalOptions, success, error) {
                    function sendResponse() {
                        if (!(successes.length + errors.length < serverMethodsMap.length)) if (0 !== successes.length) {
                            var result = successes.reduce(function(obj, success) {
                                return obj.method = success.method, obj.called_with = success.called_with, obj.returned = success.returned, 
                                obj.all_return_values.push({
                                    executed_by: success.executed_by,
                                    returned: success.returned
                                }), obj.executed_by = success.executed_by, obj;
                            }, {
                                all_return_values: []
                            });
                            0 !== errors.length && (result.all_errors = [], errors.forEach(function(obj) {
                                result.all_errors.push({
                                    name: obj.method.name,
                                    message: obj.message
                                });
                            })), success(result);
                        } else 0 !== errors.length && error(errors.reduce(function(obj, error) {
                            return obj.method = error.method, obj.called_with = error.called_with, obj.message = error.message, 
                            obj.all_errors.push({
                                executed_by: error.executed_by,
                                message: error.message
                            }), obj;
                        }, {
                            all_errors: []
                        }));
                    }
                    var successes = [], errors = [], successCallback = function(result) {
                        successes.push(result), sendResponse();
                    }, errorCallback = function(result) {
                        errors.push(result), sendResponse();
                    };
                    serverMethodsMap.forEach(function(serverMethodsPair) {
                        clientInvocations.invoke(serverMethodsPair.methods[0], argumentObj, serverMethodsPair.server, additionalOptions, successCallback, errorCallback);
                    });
                }
                function filterByTarget(target, serverMethodMap) {
                    return "string" == typeof target ? "all" === target ? target = serverMethodMap : "best" === target && (target = void 0 !== serverMethodMap[0] ? [ serverMethodMap[0] ] : []) : (Array.isArray(target) || (target = [ target ]), 
                    target = target.reduce(function(matches, filter) {
                        var myMatches = serverMethodMap.filter(function(serverMethodPair) {
                            return instanceMatch(filter, serverMethodPair.server.info);
                        });
                        return matches.concat(myMatches);
                    }, [])), target;
                }
                function instanceMatch(instanceFilter, instanceDefinition) {
                    return containsProps(instanceFilter, instanceDefinition);
                }
                function methodMatch(methodFilter, methodDefinition) {
                    return containsProps(methodFilter, methodDefinition);
                }
                function containsProps(filter, object) {
                    return Object.keys(filter).reduce(function(match, prop) {
                        return filter[prop] ? filter[prop].constructor === RegExp ? !!filter[prop].test(object[prop]) && match : String(filter[prop]).toLowerCase() === String(object[prop]).toLowerCase() && match : match;
                    }, !0);
                }
                function subscribe(name, options, successCallback, errorCallback) {
                    function callProtocolSubscribe(targetServers, stream, options, successProxy, errorProxy) {
                        void 0 !== global.console && !0 === configuration.debug && console.log('>>> Subscribing to "' + name + '" on ' + targetServers.length + " servers"), 
                        protocol.subscribe(stream, options.arguments, targetServers, {
                            method_response_timeout: options.waitTimeoutMs
                        }, successProxy, errorProxy);
                    }
                    var promise = new _Promise(function(resolve, reject) {
                        var successProxy = function(args) {
                            resolve(args);
                        }, errorProxy = function(args) {
                            reject(args);
                        };
                        void 0 === options && (options = {});
                        var target = options.target;
                        void 0 === target && (target = "best"), "string" == typeof target && "all" !== target && "best" !== target && reject({
                            message: '"' + target + '" is not a valid target. Valid targets are "all", "best", or an instance.'
                        }), "number" == typeof options.waitTimeoutMs && options.waitTimeoutMs === options.waitTimeoutMs || (options.waitTimeoutMs = configuration.wait_for_method_timeout);
                        var delayTillNow = 0, currentServers = getServerMethodsByFilterAndTarget({
                            name: name
                        }, target);
                        currentServers.length > 0 ? callProtocolSubscribe(currentServers, currentServers[0].methods[0], options, successProxy, errorProxy) : setTimeout(function retry() {
                            delayTillNow += 500;
                            var currentServers = getServerMethodsByFilterAndTarget({
                                name: name
                            }, target);
                            if (currentServers.length > 0) {
                                callProtocolSubscribe(currentServers, currentServers[0].methods[0], options, successProxy, errorProxy);
                            } else delayTillNow >= options.waitTimeoutMs ? callProtocolSubscribe(currentServers, {
                                name: name
                            }, options, successProxy, errorProxy) : setTimeout(retry, 500);
                        }, 500);
                    });
                    return promisify(promise, successCallback, errorCallback);
                }
                var clientInvocations = new ClientInvocationsState(protocol);
                return {
                    subscribe: subscribe,
                    invoke: invoke,
                    servers: function(methodFilter) {
                        return getServers(methodFilter).map(function(serverMethodMap) {
                            return serverMethodMap.server.getInfoForUser();
                        });
                    },
                    methods: function(methodFilter) {
                        return getMethods(methodFilter).map(function(m) {
                            return m.getInfoForUser();
                        });
                    },
                    methodsForInstance: function(instance) {
                        return getMethodsForInstance(instance).map(function(m) {
                            return m.getInfoForUser();
                        });
                    },
                    methodAdded: function(callback) {
                        repo.onMethodAdded(function(method) {
                            callback(method.getInfoForUser());
                        });
                    },
                    methodRemoved: function(callback) {
                        repo.onMethodRemoved(function(method) {
                            callback(method.getInfoForUser());
                        });
                    },
                    serverAdded: function(callback) {
                        repo.onServerAdded(function(server) {
                            callback(server.getInfoForUser());
                        });
                    },
                    serverRemoved: function(callback) {
                        repo.onServerRemoved(function(server, reason) {
                            callback(server.getInfoForUser(), reason);
                        });
                    },
                    serverMethodAdded: function(callback) {
                        repo.onServerMethodAdded(function(server, method) {
                            callback({
                                server: server.getInfoForUser(),
                                method: method.getInfoForUser()
                            });
                        });
                    },
                    serverMethodRemoved: function(callback) {
                        repo.onServerMethodRemoved(function(server, method) {
                            callback({
                                server: server.getInfoForUser(),
                                method: method.getInfoForUser()
                            });
                        });
                    }
                };
            };
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, document = global.document || global.process, random = __webpack_require__(3);
            module.exports = function(userSubmittedProperties) {
                function updateIdentity(newInstance) {
                    identityUpdated || (void 0 === instance.MachineName && (instance.MachineName = newInstance.MachineName), 
                    void 0 === instance.UserName && (instance.UserName = newInstance.UserName), void 0 === instance.Environment && (instance.Environment = newInstance.Environment), 
                    void 0 === instance.Region && (instance.Region = newInstance.Region), void 0 === instance.State && (instance.State = newInstance.State), 
                    identityUpdated = !0);
                }
                function createGetter(property) {
                    return instance[property];
                }
                function info() {
                    return instance;
                }
                var instance = {};
                instance.ApplicationName = document.title + random(), instance.ProcessId = Math.floor(1e10 * Math.random()), 
                instance.ProcessStartTime = new Date().getTime(), "object" === (void 0 === userSubmittedProperties ? "undefined" : _typeof(userSubmittedProperties)) && (void 0 !== userSubmittedProperties.application && (instance.ApplicationName = userSubmittedProperties.application), 
                instance.MachineName = userSubmittedProperties.machine, instance.UserName = userSubmittedProperties.user, 
                instance.Environment = userSubmittedProperties.environment, instance.Region = userSubmittedProperties.region, 
                instance.State = 1);
                var identityUpdated = !1;
                return {
                    _updateIdentity: updateIdentity,
                    info: info,
                    get application() {
                        return createGetter("ApplicationName");
                    },
                    get pid() {
                        return createGetter("ProcessId");
                    },
                    get user() {
                        return createGetter("UserName");
                    },
                    get machine() {
                        return createGetter("MachineName");
                    }
                };
            };
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, promisify = __webpack_require__(6), pjson = __webpack_require__(10);
            module.exports = function(configuration) {
                function stringToObject(param, stringPropName) {
                    if ("string" == typeof param) {
                        var obj = {};
                        return obj[stringPropName] = param, obj;
                    }
                    return param;
                }
                function agmParse(str) {
                    return JSON.parse(str, function(k, v) {
                        if ("string" != typeof v) return v;
                        if (v[0] !== dateTimeIdentifier[0]) return v;
                        if (0 !== v.indexOf(dateTimeIdentifier)) return v;
                        var unixTimestampMs = v.substr(lenOfIdentifier);
                        return new Date(parseFloat(unixTimestampMs));
                    });
                }
                function targetArgToObject(target) {
                    if ("string" == typeof (target = target || "best")) {
                        if ("all" !== target && "best" !== target) throw new Error('"' + target + '" is not a valid target. Valid targets are "all" and "best".');
                        return {
                            target: target
                        };
                    }
                    return Array.isArray(target) || (target = [ target ]), target = target.map(function(e) {
                        return convertInstanceToRegex(e);
                    }), {
                        serverFilter: target
                    };
                }
                function convertInstanceToRegex(instance) {
                    var instanceConverted = {};
                    return Object.keys(instance).forEach(function(key) {
                        var propValue = instance[key];
                        instanceConverted[key] = propValue, void 0 !== propValue && null !== propValue && ("string" == typeof propValue && "" !== propValue ? instanceConverted[key] = "^" + instance[key] + "$" : instance[key].constructor === RegExp ? instanceConverted[key] = instance[key].source : instanceConverted[key] = instance[key]);
                    }), instanceConverted;
                }
                function validateMethodInfo(methodInfo) {
                    if (void 0 === methodInfo) throw Error("methodInfo is required argument");
                    if (!methodInfo.name) throw Error("methodInfo object must contain name property");
                    methodInfo.objectTypes && (methodInfo.object_types = methodInfo.objectTypes), methodInfo.displayName && (methodInfo.display_name = methodInfo.displayName);
                }
                var facade = global.htmlContainer.jsAgmFacade, dateTimeIdentifier = facade.jsonValueDatePrefix, lenOfIdentifier = dateTimeIdentifier.length;
                return new _Promise(function(resolve, reject) {
                    var result = {
                        version: pjson.version,
                        register: function(methodInfo, callback) {
                            var methodInfoAsObject = stringToObject(methodInfo, "name");
                            validateMethodInfo(methodInfoAsObject);
                            var pv = this.agmFacade.protocolVersion;
                            pv && pv >= 3 ? this.agmFacade.register(JSON.stringify(methodInfoAsObject), callback, !0) : this.agmFacade.register(JSON.stringify(methodInfoAsObject), function(arg) {
                                var result = callback(JSON.parse(arg), arguments[1]);
                                return JSON.stringify(result);
                            });
                        },
                        registerAsync: function(methodInfo, callback) {
                            if (!this.agmFacade.registerAsync) throw new Error("not supported in that version of HtmlContainer");
                            var methodInfoAsObject = stringToObject(methodInfo, "name");
                            validateMethodInfo(methodInfoAsObject), this.agmFacade.registerAsync(methodInfoAsObject, function(args, instance, tracker) {
                                callback(args, instance, function(successArgs) {
                                    tracker.success(successArgs);
                                }, function(error) {
                                    tracker.error(error);
                                });
                            });
                        },
                        unregister: function(methodFilter) {
                            this.agmFacade.unregister(JSON.stringify(stringToObject(methodFilter, "name")));
                        },
                        invoke: function(methodFilter, args, target, options, successCallback, errorCallback) {
                            var promise = new _Promise(function(resolve, reject) {
                                if (void 0 === args && (args = {}), "object" !== (void 0 === args ? "undefined" : _typeof(args)) && reject({
                                    message: "The method arguments must be an object."
                                }), void 0 === options && (options = {}), target = targetArgToObject(target), this.agmFacade.invoke2) this.agmFacade.invoke2(JSON.stringify(stringToObject(methodFilter, "name")), args, JSON.stringify(target), JSON.stringify(options), function(args) {
                                    resolve(args);
                                }, function(err) {
                                    reject(err);
                                }); else {
                                    var successProxy, errorProxy;
                                    successProxy = function(args) {
                                        var parsed = JSON.parse(args);
                                        resolve(parsed);
                                    }, errorProxy = function(args) {
                                        var parsed = JSON.parse(args);
                                        reject(parsed);
                                    }, this.agmFacade.invoke(JSON.stringify(stringToObject(methodFilter, "name")), JSON.stringify(args), JSON.stringify(target), JSON.stringify(options), successProxy, errorProxy);
                                }
                            }.bind(this));
                            return promisify(promise, successCallback, errorCallback);
                        },
                        methodAdded: function(callback) {
                            this.agmFacade.methodAdded(callback);
                        },
                        methodRemoved: function(callback) {
                            this.agmFacade.methodRemoved(callback);
                        },
                        serverAdded: function(callback) {
                            this.agmFacade.serverAdded(callback);
                        },
                        serverRemoved: function(callback) {
                            this.agmFacade.serverRemoved(callback);
                        },
                        serverMethodAdded: function(callback) {
                            this.agmFacade.serverMethodAdded(callback);
                        },
                        serverMethodRemoved: function(callback) {
                            this.agmFacade.serverMethodRemoved(callback);
                        },
                        servers: function(methodFilter) {
                            var jsonResult = this.agmFacade.servers(JSON.stringify(stringToObject(methodFilter, "name"))), parsedResult = agmParse(jsonResult);
                            return parsedResult.forEach(function(server) {
                                server.getMethods = function() {
                                    return this.methodsForInstance(server);
                                }.bind(this), server.getStreams = function() {
                                    return this.methodsForInstance(server).filter(function(method) {
                                        return method.supportsStreaming;
                                    });
                                }.bind(this);
                            }, this), parsedResult;
                        },
                        methods: function(methodFilter) {
                            var jsonResult = this.agmFacade.methods(JSON.stringify(stringToObject(methodFilter, "name"))), parsedResult = agmParse(jsonResult);
                            return parsedResult.forEach(function(method) {
                                method.displayName = method.display_name, method.objectTypes = method.object_types, 
                                method.getServers = function() {
                                    return this.servers(method.name);
                                }.bind(this);
                            }, this), parsedResult;
                        },
                        methodsForInstance: function(instanceFilter) {
                            return agmParse(this.agmFacade.methodsForInstance(JSON.stringify(instanceFilter)));
                        },
                        subscribe: function(name, options, successCallback, errorCallback) {
                            var promise = new _Promise(function(resolve, reject) {
                                void 0 === options && (options = {}), options.args = JSON.stringify(options.arguments || {}), 
                                options.target = targetArgToObject(options.target), this.agmFacade.subscribe2(name, JSON.stringify(options), function(stream) {
                                    resolve(stream);
                                }, function(error) {
                                    reject(error);
                                });
                            }.bind(this));
                            return promisify(promise, successCallback, errorCallback);
                        },
                        createStream: function(streamDef, callbacks, successCallback, errorCallback) {
                            var promise = new _Promise(function(resolve, reject) {
                                "string" == typeof streamDef && (streamDef = {
                                    name: streamDef
                                }), callbacks || (callbacks = {}), this.agmFacade.createStream2(JSON.stringify(streamDef), callbacks.subscriptionRequestHandler, callbacks.subscriptionAddedHandler, callbacks.subscriptionRemovedHandler, function(stream) {
                                    resolve(stream);
                                }, function(error) {
                                    reject(error);
                                });
                            }.bind(this));
                            return promisify(promise, successCallback, errorCallback);
                        }
                    };
                    if (void 0 !== configuration && void 0 !== configuration.metrics) {
                        configuration.metrics.metricsIdentity = configuration.metrics.identity;
                        var metricsConfig = {
                            metricsIdentity: configuration.metrics.metricsIdentity,
                            path: configuration.metrics.path
                        };
                        configuration.metrics = metricsConfig;
                    }
                    delete configuration.logger;
                    var successInit = function(instance) {
                        result.instance = instance, result.agmFacade = facade, result.create_stream = result.createStream, 
                        result.methods_for_instance = result.methodsForInstance, result.method_added = result.methodAdded, 
                        result.method_removed = result.methodRemoved, result.server_added = result.serverAdded, 
                        result.server_removed = result.serverRemoved, result.server_method_added = result.serverMethodAdded, 
                        result.server_method_removed = result.serverMethodRemoved, resolve(result);
                    }, cfgAsString = JSON.stringify(configuration), pv = facade.protocolVersion;
                    if (pv && pv >= 5 && facade.initAsync) facade.initAsync(cfgAsString, successInit, function(err) {
                        reject(err);
                    }); else {
                        successInit(facade.init(cfgAsString));
                    }
                });
            };
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var Callbacks = __webpack_require__(2);
        module.exports = function() {
            function addServer(info, serverId) {
                var current = servers[serverId];
                if (current) return current.id;
                var serverEntry = {
                    id: serverId,
                    info: info,
                    methods: {}
                };
                return serverEntry.getInfoForUser = function() {
                    var serverInfo = createUserServerInfo(serverEntry.info);
                    return serverInfo.getMethods = function() {
                        return getServerMethodById(serverEntry.id).map(function(m) {
                            return m.getInfoForUser();
                        });
                    }, serverInfo.getStreams = function() {
                        var methods = getServerMethodById(serverEntry.id);
                        return methods = methods.filter(function(method) {
                            return method.supportsStreaming;
                        }), methods.map(function(m) {
                            return m.getInfoForUser();
                        });
                    }, serverInfo;
                }, servers[serverId] = serverEntry, callbacks.execute("onServerAdded", serverEntry), 
                serverId;
            }
            function removeServerById(id, reason) {
                var server = servers[id];
                Object.keys(server.methods).forEach(function(methodId) {
                    removeServerMethod(id, methodId);
                }), delete servers[id], callbacks.execute("onServerRemoved", server, reason);
            }
            function addServerMethod(serverId, method) {
                var server = servers[serverId];
                if (!server) throw new Error("server does not exists");
                var methodId = createMethodId(method);
                if (!server.methods[methodId]) {
                    var methodEntity = {
                        id: methodId,
                        info: method
                    };
                    methodEntity.getInfoForUser = function() {
                        var result = createUserMethodInfo(methodEntity.info);
                        return result.getServers = function() {
                            return getServersByMethod(this.id);
                        }.bind(this), result;
                    }, server.methods[methodId] = methodEntity, methodsCount[methodId] || (methodsCount[methodId] = 0, 
                    callbacks.execute("onMethodAdded", methodEntity)), methodsCount[methodId] = methodsCount[methodId] + 1, 
                    callbacks.execute("onServerMethodAdded", server, methodEntity);
                }
            }
            function createMethodId(methodInfo) {
                var accepts = void 0 !== methodInfo.accepts ? methodInfo.accepts : "", returns = void 0 !== methodInfo.returns ? methodInfo.returns : "", version = void 0 !== methodInfo.version ? methodInfo.version : 0;
                return (methodInfo.name + accepts + returns + version).toLowerCase();
            }
            function removeServerMethod(serverId, methodId) {
                var server = servers[serverId];
                if (!server) throw new Error("server does not exists");
                var method = server.methods[methodId];
                delete server.methods[methodId], methodsCount[methodId] = methodsCount[methodId] - 1, 
                0 === methodsCount[methodId] && callbacks.execute("onMethodRemoved", method), callbacks.execute("onServerMethodRemoved", server, method);
            }
            function getServersByMethod(id) {
                var allServers = [];
                return Object.keys(servers).forEach(function(serverId) {
                    var server = servers[serverId];
                    Object.keys(server.methods).forEach(function(methodId) {
                        methodId === id && allServers.push(server.getInfoForUser());
                    });
                }), allServers;
            }
            function getMethods() {
                var allMethods = {};
                return Object.keys(servers).forEach(function(serverId) {
                    var server = servers[serverId];
                    Object.keys(server.methods).forEach(function(methodId) {
                        var method = server.methods[methodId];
                        allMethods[method.id] = method;
                    });
                }), Object.keys(allMethods).map(function(id) {
                    return allMethods[id];
                });
            }
            function getServers() {
                var allServers = [];
                return Object.keys(servers).forEach(function(serverId) {
                    var server = servers[serverId];
                    allServers.push(server);
                }), allServers;
            }
            function getServerMethodById(serverId) {
                var server = servers[serverId];
                return Object.keys(server.methods).map(function(id) {
                    return server.methods[id];
                });
            }
            function onServerAdded(callback) {
                callbacks.add("onServerAdded", callback), getServers().forEach(function(server) {
                    callback(server);
                });
            }
            function onMethodAdded(callback) {
                callbacks.add("onMethodAdded", callback), getMethods().forEach(function(method) {
                    callback(method);
                });
            }
            function onServerMethodAdded(callback) {
                callbacks.add("onServerMethodAdded", callback), getServers().forEach(function(server) {
                    var methods = server.methods;
                    Object.keys(methods).forEach(function(methodId) {
                        callback(server, methods[methodId]);
                    });
                });
            }
            function getServerById(id) {
                return servers[id];
            }
            function createUserServerInfo(serverInfo) {
                return {
                    machine: serverInfo.machine,
                    pid: serverInfo.pid,
                    user: serverInfo.user,
                    application: serverInfo.application,
                    environment: serverInfo.environment,
                    region: serverInfo.region,
                    instance: serverInfo.instance
                };
            }
            function createUserMethodInfo(methodInfo) {
                return {
                    name: methodInfo.name,
                    accepts: methodInfo.accepts,
                    returns: methodInfo.returns,
                    description: methodInfo.description,
                    displayName: methodInfo.displayName,
                    display_name: methodInfo.displayName,
                    version: methodInfo.version,
                    objectTypes: methodInfo.objectTypes,
                    object_types: methodInfo.objectTypes,
                    supportsStreaming: methodInfo.supportsStreaming
                };
            }
            function reset() {
                servers = {}, methodsCount = {};
            }
            var servers = {}, methodsCount = {}, callbacks = new Callbacks();
            return {
                getServerById: getServerById,
                getServers: getServers,
                getMethods: getMethods,
                getServerMethodsById: getServerMethodById,
                getMethodId: createMethodId,
                addServer: addServer,
                addServerMethod: addServerMethod,
                removeServerById: removeServerById,
                removeServerMethod: removeServerMethod,
                onServerAdded: onServerAdded,
                onServerRemoved: function(callback) {
                    callbacks.add("onServerRemoved", callback);
                },
                onMethodAdded: onMethodAdded,
                onMethodRemoved: function(callback) {
                    callbacks.add("onMethodRemoved", callback);
                },
                onServerMethodAdded: onServerMethodAdded,
                onServerMethodRemoved: function(callback) {
                    callbacks.add("onServerMethodRemoved", callback);
                },
                reset: reset
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        module.exports = function(protocol, unregister) {
            function streamFrontObj(repoMethod) {
                var def = repoMethod.definition;
                return {
                    branches: function() {
                        return protocol.getBranchList(repoMethod).map(function(branchKey) {
                            return branchFrontObj(repoMethod, branchKey);
                        });
                    },
                    close: function() {
                        protocol.closeAllSubscriptions(repoMethod), unregister(repoMethod.definition);
                    },
                    definition: {
                        accepts: def.accepts,
                        description: def.description,
                        displayName: def.displayName,
                        name: def.name,
                        objectTypes: def.objectTypes,
                        returns: def.returns,
                        supportsStreaming: def.supportsStreaming
                    },
                    name: def.name,
                    push: function(data, branches) {
                        if ("string" != typeof branches && !Array.isArray(branches) && void 0 !== branches) throw new Error("invalid branches should be string or string array");
                        if ("object" !== (void 0 === data ? "undefined" : _typeof(data))) throw new Error("Invalid arguments. Data must be an object.");
                        protocol.pushData(repoMethod, data, branches);
                    },
                    subscriptions: function() {
                        return protocol.getSubscriptionList(repoMethod).map(function(sub) {
                            return subscriptionFrontObj(repoMethod, sub);
                        });
                    }
                };
            }
            function subscriptionFrontObj(repoMethod, subscription) {
                return {
                    arguments: subscription.arguments || {},
                    branchKey: subscription.branchKey,
                    close: function() {
                        protocol.closeSingleSubscription(repoMethod, subscription);
                    },
                    instance: subscription.instance,
                    push: function(data) {
                        protocol.pushDataToSingle(repoMethod, subscription, data);
                    },
                    stream: repoMethod.definition
                };
            }
            function branchFrontObj(repoMethod, branchKey) {
                return {
                    key: branchKey,
                    subscriptions: function() {
                        return protocol.getSubscriptionList(repoMethod, branchKey).map(function(sub) {
                            return subscriptionFrontObj(repoMethod, sub);
                        });
                    },
                    close: function() {
                        protocol.closeAllSubscriptions(repoMethod, branchKey);
                    },
                    push: function(data) {
                        protocol.pushToBranch(repoMethod, data, branchKey);
                    }
                };
            }
            return protocol.onSubRequest(function(requestContext, repoMethod) {
                repoMethod && repoMethod.streamCallbacks && "function" == typeof repoMethod.streamCallbacks.subscriptionRequestHandler && repoMethod.streamCallbacks.subscriptionRequestHandler({
                    accept: function() {
                        protocol.acceptRequestOnBranch(requestContext, repoMethod, "");
                    },
                    acceptOnBranch: function(branch) {
                        protocol.acceptRequestOnBranch(requestContext, repoMethod, branch);
                    },
                    arguments: requestContext.arguments,
                    instance: requestContext.instance,
                    reject: function(reason) {
                        protocol.rejectRequest(requestContext, repoMethod, reason);
                    }
                });
            }), protocol.onSubAdded(function(subscription, repoMethod) {
                repoMethod && repoMethod.streamCallbacks && "function" == typeof repoMethod.streamCallbacks.subscriptionAddedHandler && repoMethod.streamCallbacks.subscriptionAddedHandler(subscriptionFrontObj(repoMethod, subscription));
            }), protocol.onSubRemoved(function(subscriber, repoMethod) {
                repoMethod && repoMethod.streamCallbacks && "function" == typeof repoMethod.streamCallbacks.subscriptionRemovedHandler && repoMethod.streamCallbacks.subscriptionRemovedHandler(subscriber);
            }), {
                streamFrontObj: streamFrontObj
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        module.exports = function() {
            function add(method) {
                if ("object" === (void 0 === method ? "undefined" : _typeof(method)) && void 0 === method._repoId) return method._repoId = String(nextId), 
                nextId += 1, _methods.push(method), method;
            }
            function remove(repoId) {
                if ("string" != typeof repoId) return new TypeError("Expecting a string");
                _methods = _methods.filter(function(m) {
                    return m._repoId !== repoId;
                });
            }
            function getById(id) {
                return "string" != typeof id ? new TypeError("Expecting a string") : _methods.filter(function(m) {
                    return m._repoId === id;
                })[0];
            }
            function getList() {
                return _methods.map(function(m) {
                    return m;
                });
            }
            function length() {
                return _methods.length;
            }
            function reset() {
                _methods = [];
            }
            var nextId = 0, _methods = [];
            return {
                add: add,
                remove: remove,
                getById: getById,
                getList: getList,
                length: length,
                reset: reset
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, Promisify = __webpack_require__(6), Streaming = __webpack_require__(26);
        module.exports = function(protocol, vault, instance, configuration) {
            function onMethodInvoked(methodToExecute, invocationId, invocationArgs) {
                metric("Invocations count", invocations++), methodToExecute && methodToExecute.theFunction(invocationArgs, function(err, result) {
                    err && ("string" == typeof err.message ? err = err.message : "string" != typeof err && (err = "")), 
                    result && "object" === (void 0 === result ? "undefined" : _typeof(result)) && result.constructor !== Array || (result = {
                        _result: result
                    }), protocol.methodInvocationResult(methodToExecute, invocationId, err, result);
                });
            }
            function register(methodDefinition, callback) {
                var wrappedCallbackFunction = function(context, resultCallback) {
                    try {
                        var result = callback(context.args, context.instance);
                        resultCallback(null, result);
                    } catch (e) {
                        resultCallback(e, e);
                    }
                };
                wrappedCallbackFunction.userCallback = callback, registerCore(methodDefinition, wrappedCallbackFunction);
            }
            function registerAsync(methodDefinition, callback) {
                var wrappedCallback = function(context, resultCallback) {
                    try {
                        callback(context.args, context.instance, function(result) {
                            resultCallback(null, result);
                        }, function(e) {
                            resultCallback(e, e);
                        });
                    } catch (e) {
                        resultCallback(e, null);
                    }
                };
                wrappedCallback.userCallback = callback, wrappedCallback.isAsync = !0, registerCore(methodDefinition, wrappedCallback);
            }
            function createStream(streamDef, callbacks, successCallback, errorCallback) {
                var promise = new _Promise(function(resolve, reject) {
                    "string" == typeof streamDef && ("" === streamDef && reject("Invalid stream name."), 
                    streamDef = {
                        name: streamDef
                    }), streamDef.supportsStreaming = !0, callbacks || (callbacks = {}), "function" != typeof callbacks.subscriptionRequestHandler && (callbacks.subscriptionRequestHandler = function(request) {
                        request.accept();
                    });
                    var repoMethod = {
                        method: void 0,
                        definition: streamDef,
                        streamCallbacks: callbacks
                    };
                    vault.add(repoMethod), protocol.createStream(repoMethod, streamDef, function() {
                        metric("Registered methods", vault.length());
                        var streamFrobject = streaming.streamFrontObj(repoMethod);
                        resolve(streamFrobject);
                    }, function(err) {
                        vault.remove(repoMethod._repoId), reject(err);
                    });
                });
                return new Promisify(promise, successCallback, errorCallback);
            }
            function registerCore(methodDefinition, theFunction) {
                "string" == typeof methodDefinition && (methodDefinition = {
                    name: methodDefinition
                });
                var repoMethod = vault.add({
                    definition: methodDefinition,
                    theFunction: theFunction
                });
                protocol.register(repoMethod, function() {
                    metric("Registered methods", vault.length());
                }, function() {
                    vault.remove(repoMethod._repoId);
                });
            }
            function containsProps(filter, object) {
                var match = !0;
                return Object.keys(filter).forEach(function(prop) {
                    filter[prop] !== object[prop] && (match = !1);
                }), match;
            }
            function unregister(methodFilter) {
                "string" == typeof methodFilter && (methodFilter = {
                    name: methodFilter
                }), vault.getList().filter(function(method) {
                    return containsProps(methodFilter, method.definition);
                }).forEach(function(method) {
                    vault.remove(method._repoId), protocol.unregister(method);
                }), metric("Registered methods", vault.length());
            }
            var metric = void 0 !== configuration.metrics ? configuration.metrics.numberMetric.bind(configuration.metrics) : function() {}, streaming = new Streaming(protocol, unregister);
            protocol.onInvoked(onMethodInvoked);
            var invocations = 0;
            return {
                register: register,
                registerAsync: registerAsync,
                unregister: unregister,
                createStream: createStream
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, instance = __webpack_require__(23), nativeAgm = __webpack_require__(24), pjson = __webpack_require__(10), client = __webpack_require__(22), server = __webpack_require__(28), gW1Protocol = __webpack_require__(32), gW3Protocol = __webpack_require__(37), repository = __webpack_require__(25), vault = __webpack_require__(27), agm = function(configuration) {
                var agm = {};
                agm.version = pjson.version, "object" !== (void 0 === configuration ? "undefined" : _typeof(configuration)) && (configuration = {}), 
                [ "connection", "client", "server" ].forEach(function(conf) {
                    "object" !== _typeof(configuration[conf]) && (configuration[conf] = {}), configuration.debug && (configuration[conf].debug = !0);
                }), "number" != typeof configuration.client.remove_server_on_n_missing_heartbeats && (configuration.client.remove_server_on_n_missing_heartbeats = 3), 
                "number" != typeof configuration.client.method_response_timeout && (configuration.client.method_response_timeout = 3e3), 
                "number" != typeof configuration.client.wait_for_method_timeout && (configuration.client.wait_for_method_timeout = 3e3), 
                "number" != typeof configuration.server.heartbeat_interval && (configuration.server.heartbeat_interval = 5e3), 
                "number" != typeof configuration.server.presence_interval && (configuration.server.presence_interval = 1e4);
                var c = configuration.connection;
                if (!c) throw new Error("configuration.connection is required");
                agm.connection = c;
                agm.connection.sendAGM = function(type, message) {
                    agm.connection.send("agm", type, message);
                }, agm.connection.onAGM = function(type, handler) {
                    agm.connection.on("agm", type, handler);
                };
                var metricsRoot = configuration.metrics;
                void 0 !== metricsRoot && (configuration.client.metrics = metricsRoot.subSystem("Client"), 
                configuration.server.metrics = metricsRoot.subSystem("Server")), agm.instance = instance(configuration.instance);
                var protocolPromise, clientRepository = repository(), serverRepository = vault();
                if (3 === c.protocolVersion) {
                    var serverGetter = function() {
                        return agm.server;
                    }, clientGetter = function() {
                        return agm.client;
                    };
                    protocolPromise = gW3Protocol(agm.instance, agm.connection, clientRepository, serverRepository, configuration, serverGetter, clientGetter);
                } else protocolPromise = gW1Protocol(agm.instance, agm.connection, clientRepository, serverRepository, configuration);
                return new _Promise(function(resolve, reject) {
                    protocolPromise.then(function(protocol) {
                        agm.client = client(protocol, clientRepository, agm.instance, configuration.client), 
                        agm.server = server(protocol, serverRepository, agm.instance, configuration.server), 
                        agm.invoke = agm.client.invoke, agm.register = agm.server.register, agm.registerAsync = agm.server.registerAsync, 
                        agm.unregister = agm.server.unregister, agm.createStream = agm.server.createStream, 
                        agm.subscribe = agm.client.subscribe, agm.servers = agm.client.servers, agm.methods = agm.client.methods, 
                        agm.methodsForInstance = agm.client.methodsForInstance, agm.method = agm.client.method, 
                        agm.methodAdded = agm.client.methodAdded, agm.methodRemoved = agm.client.methodRemoved, 
                        agm.serverMethodAdded = agm.client.serverMethodAdded, agm.serverMethodRemoved = agm.client.serverMethodRemoved, 
                        agm.serverAdded = agm.client.serverAdded, agm.serverRemoved = agm.client.serverRemoved, 
                        resolve(agm);
                    }).catch(function(err) {
                        reject(err);
                    });
                });
            };
            agm = void 0 !== global.htmlContainer ? nativeAgm : agm, agm.default = agm, module.exports = agm;
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, random = __webpack_require__(3), helpers = __webpack_require__(4);
            module.exports = function(configuration, instance, sendRequest, nextResponseSubject) {
                function subscribe(streamingMethod, argumentObj, targetServers, stuff, success, error) {
                    if (0 === targetServers.length) return void error(ERR_MSG_SUB_FAILED + " No available servers matched the target params.");
                    var subscriptionId = "subscriptionId_" + random(), pendingSub = registerSubscription(subscriptionId, streamingMethod, argumentObj, success, error, stuff.method_response_timeout);
                    if ("object" !== (void 0 === pendingSub ? "undefined" : _typeof(pendingSub))) return void error(ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.");
                    targetServers.forEach(function(target) {
                        var responseSubject = nextResponseSubject();
                        pendingSub.trackedServers.push({
                            server: void 0,
                            streamId: void 0,
                            streamSubjects: {
                                global: void 0,
                                private: void 0
                            },
                            methodRequestSubject: streamingMethod.info.requestSubject,
                            methodResponseSubject: responseSubject
                        });
                        var message = {
                            EventStreamAction: 1,
                            MethodRequestSubject: streamingMethod.info.requestSubject,
                            MethodResponseSubject: responseSubject,
                            Client: instance.info(),
                            Context: {
                                ArgumentsJson: argumentObj,
                                InvocationId: subscriptionId,
                                ObjectType: stuff.object_type,
                                DisplayContext: stuff.display_context,
                                MethodName: streamingMethod.info.name,
                                ExecutionServer: target.server.info,
                                Timeout: stuff.method_response_timeout
                            }
                        };
                        sendRequest(message), void 0 !== global.console && !0 === configuration.debug && (console.debug("%c>>> sending MethodInvocationRequestMessage", "background-color:hsla(198, 51%, 79%, 0.5)"), 
                        console.debug("%c" + JSON.stringify(message), "background-color:hsla(198, 51%, 79%, 0.5)"));
                    });
                }
                function registerSubscription(subscriptionId, method, args, success, error, timeout) {
                    return subscriptionsList[subscriptionId] = {
                        status: STATUS_AWAITING_ACCEPT,
                        method: method,
                        arguments: args,
                        success: success,
                        error: error,
                        trackedServers: [],
                        handlers: {
                            onData: [],
                            onClosed: []
                        },
                        queued: {
                            data: [],
                            closers: []
                        },
                        timeoutId: void 0
                    }, subscriptionsList[subscriptionId].timeoutId = setTimeout(function() {
                        if (void 0 !== subscriptionsList[subscriptionId]) {
                            var subscription = subscriptionsList[subscriptionId];
                            if (subscription.status === STATUS_AWAITING_ACCEPT) error({
                                method: method,
                                called_with: args,
                                message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + "ms."
                            }), delete subscriptionsList[subscriptionId]; else if (subscription.status === STATUS_SUBSCRIBED && subscription.trackedServers.length > 0 && (subscription.trackedServers = subscription.trackedServers.filter(function(server) {
                                return "string" == typeof server.streamId && "" !== server.streamId;
                            }), subscription.timeoutId = void 0, 0 === subscription.trackedServers.length)) {
                                var closersCount = subscription.queued.closers.length, closingServer = closersCount > 0 ? subscription.queued.closers[closersCount - 1] : null;
                                subscription.handlers.onClosed.forEach(function(callback) {
                                    "function" == typeof callback && callback({
                                        message: ON_CLOSE_MSG_SERVER_INIT,
                                        requestArguments: subscription.arguments,
                                        server: closingServer,
                                        stream: subscription.method
                                    });
                                }), delete subscriptionsList[subscriptionId];
                            }
                        }
                    }, timeout), subscriptionsList[subscriptionId];
                }
                function processPublisherMsg(msg) {
                    msg && msg.EventStreamAction && 0 !== msg.EventStreamAction && (2 === msg.EventStreamAction ? serverIsKickingASubscriber(msg) : 3 === msg.EventStreamAction ? serverAcknowledgesGoodSubscription(msg) : 5 === msg.EventStreamAction && serverHasPushedSomeDataIntoTheStream(msg));
                }
                function serverIsKickingASubscriber(msg) {
                    var keys = Object.keys(subscriptionsList);
                    "string" == typeof msg.InvocationId && "" !== msg.InvocationId && (keys = keys.filter(function(k) {
                        return k === msg.InvocationId;
                    }));
                    var deletionsList = [];
                    keys.forEach(function(key) {
                        "object" === _typeof(subscriptionsList[key]) && (subscriptionsList[key].trackedServers = subscriptionsList[key].trackedServers.filter(function(server) {
                            var isRejecting = server.methodRequestSubject === msg.MethodRequestSubject && server.methodResponseSubject === msg.MethodResponseSubject, isKicking = server.streamId === msg.StreamId && (server.streamSubjects.global === msg.EventStreamSubject || server.streamSubjects.private === msg.EventStreamSubject);
                            return !(isRejecting || isKicking);
                        }), 0 === subscriptionsList[key].trackedServers.length && deletionsList.push(key));
                    }), deletionsList.forEach(function(key) {
                        if ("object" === _typeof(subscriptionsList[key])) {
                            if (subscriptionsList[key].status === STATUS_AWAITING_ACCEPT && "number" == typeof subscriptionsList[key].timeoutId) {
                                var reason = "string" == typeof msg.ResultMessage && "" !== msg.ResultMessage ? ' Publisher said "' + msg.ResultMessage + '".' : " No reason given.", callArgs = "object" === _typeof(subscriptionsList[key].arguments) ? JSON.stringify(subscriptionsList[key].arguments) : "{}";
                                subscriptionsList[key].error(ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs), 
                                clearTimeout(subscriptionsList[key].timeoutId);
                            } else subscriptionsList[key].handlers.onClosed.forEach(function(callback) {
                                "function" == typeof callback && callback({
                                    message: ON_CLOSE_MSG_SERVER_INIT,
                                    requestArguments: subscriptionsList[key].arguments,
                                    server: helpers.convertInfoToInstance(msg.Server),
                                    stream: subscriptionsList[key].method
                                });
                            });
                            delete subscriptionsList[key];
                        }
                    });
                }
                function serverAcknowledgesGoodSubscription(msg) {
                    var subscriptionId = msg.InvocationId, subscription = subscriptionsList[subscriptionId];
                    if ("object" === (void 0 === subscription ? "undefined" : _typeof(subscription))) {
                        var acceptingServer = subscription.trackedServers.filter(function(server) {
                            return server.methodRequestSubject === msg.MethodRequestSubject && server.methodResponseSubject === msg.MethodResponseSubject;
                        })[0];
                        if ("object" === (void 0 === acceptingServer ? "undefined" : _typeof(acceptingServer))) {
                            var isFirstResponse = subscription.status === STATUS_AWAITING_ACCEPT;
                            subscription.status = STATUS_SUBSCRIBED;
                            var privateStreamSubject = generatePrivateStreamSubject(subscription.method.name);
                            if ("string" != typeof acceptingServer.streamId || "" === acceptingServer.streamId) {
                                acceptingServer.server = helpers.convertInfoToInstance(msg.Server), acceptingServer.streamId = msg.StreamId, 
                                acceptingServer.streamSubjects.global = msg.EventStreamSubject, acceptingServer.streamSubjects.private = privateStreamSubject;
                                var confirmatoryRequest = {
                                    EventStreamAction: 3,
                                    EventStreamSubject: privateStreamSubject,
                                    StreamId: msg.StreamId,
                                    MethodRequestSubject: msg.MethodRequestSubject,
                                    MethodResponseSubject: acceptingServer.methodResponseSubject,
                                    Client: instance.info(),
                                    Context: {
                                        ArgumentsJson: subscription.arguments,
                                        MethodName: subscription.method.name
                                    }
                                };
                                sendRequest(confirmatoryRequest), isFirstResponse && subscription.success({
                                    onData: function(dataCallback) {
                                        if ("function" != typeof dataCallback) throw new TypeError("The data callback must be a function.");
                                        this.handlers.onData.push(dataCallback), 1 === this.handlers.onData.length && this.queued.data.length > 0 && this.queued.data.forEach(function(dataItem) {
                                            dataCallback(dataItem);
                                        });
                                    }.bind(subscription),
                                    onClosed: function(closedCallback) {
                                        if ("function" != typeof closedCallback) throw new TypeError("The callback must be a function.");
                                        this.handlers.onClosed.push(closedCallback);
                                    }.bind(subscription),
                                    onFailed: function() {},
                                    close: closeSubscription.bind(subscription, subscriptionId),
                                    requestArguments: subscription.arguments,
                                    serverInstance: helpers.convertInfoToInstance(msg.Server),
                                    stream: subscription.method
                                });
                            }
                        }
                    }
                }
                function serverHasPushedSomeDataIntoTheStream(msg) {
                    for (var key in subscriptionsList) if (subscriptionsList.hasOwnProperty(key) && "object" === _typeof(subscriptionsList[key])) {
                        var isPrivateData, trackedServersFound = subscriptionsList[key].trackedServers.filter(function(ls) {
                            return ls.streamId === msg.StreamId && (ls.streamSubjects.global === msg.EventStreamSubject || ls.streamSubjects.private === msg.EventStreamSubject);
                        });
                        if (0 === trackedServersFound.length ? isPrivateData = void 0 : trackedServersFound[0].streamSubjects.global === msg.EventStreamSubject ? isPrivateData = !1 : trackedServersFound[0].streamSubjects.private === msg.EventStreamSubject && (isPrivateData = !0), 
                        void 0 !== isPrivateData) {
                            var receivedStreamData = {
                                data: msg.ResultContextJson,
                                server: helpers.convertInfoToInstance(msg.Server),
                                requestArguments: subscriptionsList[key].arguments || {},
                                message: msg.ResultMessage,
                                private: isPrivateData
                            }, onDataHandlers = subscriptionsList[key].handlers.onData, queuedData = subscriptionsList[key].queued.data;
                            Array.isArray(onDataHandlers) && (onDataHandlers.length > 0 ? onDataHandlers.forEach(function(callback) {
                                "function" == typeof callback && callback(receivedStreamData);
                            }) : queuedData.push(receivedStreamData));
                        }
                    }
                }
                function closeSubscription(subId) {
                    var responseSubject = nextResponseSubject();
                    this.trackedServers.forEach(function(server) {
                        sendRequest({
                            EventStreamAction: 2,
                            Client: instance.info(),
                            MethodRequestSubject: server.methodRequestSubject,
                            MethodResponseSubject: responseSubject,
                            StreamId: server.streamId,
                            EventStreamSubject: server.streamSubjects.private
                        });
                    });
                    var sub = this;
                    this.handlers.onClosed.forEach(function(callback) {
                        "function" == typeof callback && callback({
                            message: ON_CLOSE_MSG_CLIENT_INIT,
                            requestArguments: sub.arguments || {},
                            server: sub.trackedServers[sub.trackedServers.length - 1].server,
                            stream: sub.method
                        });
                    }), delete subscriptionsList[subId];
                }
                function generatePrivateStreamSubject(methodName) {
                    return "ESSpriv-jsb_" + instance.info().ApplicationName + "_on_" + methodName + "_" + random();
                }
                var STATUS_AWAITING_ACCEPT = "awaitingAccept", STATUS_SUBSCRIBED = "subscribed", ERR_MSG_SUB_FAILED = "Subscription failed.", ERR_MSG_SUB_REJECTED = "Subscription rejected.", ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated", ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated", subscriptionsList = {};
                return {
                    subscribe: subscribe,
                    processPublisherMsg: processPublisherMsg
                };
            };
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var random = __webpack_require__(3), callbackRegistry = __webpack_require__(2), Streaming = __webpack_require__(30), helpers = __webpack_require__(4);
        module.exports = function(connection, instance, configuration, repository) {
            function nextResponseSubject() {
                return "resp_" + respCounter++ + "_" + random();
            }
            function createServerInfo(instance) {
                return {
                    machine: instance.MachineName,
                    pid: instance.ProcessId,
                    started: instance.ProcessStartTime,
                    user: instance.UserName,
                    application: instance.ApplicationName,
                    environment: instance.Environment,
                    region: instance.Region,
                    service_name: instance.ServiceName,
                    metrics_repository_id: instance.MetricsRepositoryId,
                    state: instance.State
                };
            }
            function createMethod(methodInfo) {
                var method = methodInfo.Method;
                return {
                    name: method.Name,
                    accepts: method.InputSignature,
                    returns: method.ResultSignature,
                    requestSubject: methodInfo.MethodRequestSubject,
                    description: method.Description,
                    displayName: method.DisplayName,
                    version: method.Version,
                    objectTypes: method.ObjectTypeRestrictions,
                    supportsStreaming: helpers.isStreamingFlagSet(method.Flags)
                };
            }
            function createServerId(serverInfo) {
                if (void 0 !== serverInfo) return [ serverInfo.application, serverInfo.user, serverInfo.machine, serverInfo.started, serverInfo.pid ].join("/").toLowerCase();
            }
            function processServerPresence(presence, isPresence) {
                var instance = presence.Instance, serverInfo = createServerInfo(instance), serverId = createServerId(serverInfo);
                if (isPresence) serverId = repository.addServer(serverInfo, serverId), presence.PublishingInterval && scheduleTimeout(serverId, presence.PublishingInterval); else if (0 === presence.PublishingInterval) {
                    var server = repository.getServerById(serverId);
                    void 0 !== server && repository.removeServerById(serverId);
                }
                void 0 !== presence.MethodDefinitions && updateServerMethods(serverId, presence.MethodDefinitions);
            }
            function scheduleTimeout(serverId, duration) {
                if (-1 !== duration) {
                    var timer = timers[serverId];
                    void 0 !== timer && clearTimeout(timer), timers[serverId] = setTimeout(function() {
                        repository.removeServerById(serverId);
                    }, duration * (configuration.client.remove_server_on_n_missing_heartbeats + 1));
                }
            }
            function updateServerMethods(serverId, newMethods) {
                var oldMethods = repository.getServerMethodsById(serverId);
                newMethods = newMethods.map(createMethod).reduce(function(obj, method) {
                    return obj[repository.getMethodId(method)] = method, obj;
                }, {}), Object.keys(oldMethods).forEach(function(methodId) {
                    var method = oldMethods[methodId];
                    void 0 === newMethods[method.id] ? repository.removeServerMethod(serverId, method.id) : delete newMethods[method.id];
                }), Object.keys(newMethods).forEach(function(key) {
                    var method = newMethods[key];
                    repository.addServerMethod(serverId, method);
                });
            }
            function invoke(id, method, args, target, stuff) {
                var methodInfo = method.info, message = {
                    MethodRequestSubject: methodInfo.requestSubject,
                    MethodResponseSubject: nextResponseSubject(),
                    Client: instance.info(),
                    Context: {
                        ArgumentsJson: args,
                        InvocationId: id,
                        ObjectType: stuff.object_type,
                        DisplayContext: stuff.display_context,
                        MethodName: methodInfo.name,
                        ExecutionServer: target.info,
                        Timeout: stuff.method_response_timeout
                    }
                };
                connection.sendAGM("MethodInvocationRequestMessage", message);
            }
            function handleInvokeResultMessage(message) {
                if (message && message.EventStreamAction && 0 !== message.EventStreamAction) return void streaming.processPublisherMsg(message);
                var server = message.Server ? createServerInfo(message.Server) : void 0, result = message.ResultContextJson;
                result && 0 === Object.keys(result).length && (result = void 0), callbacks.execute("onResult", message.InvocationId, server, message.Status, result, message.ResultMessage);
            }
            function onInvocationResult(callback) {
                callbacks.add("onResult", callback);
            }
            var timers = {}, respCounter = 0, callbacks = callbackRegistry(), streaming = new Streaming(configuration, instance, function(m) {
                connection.sendAGM("MethodInvocationRequestMessage", m);
            }, nextResponseSubject);
            return function() {
                connection.onAGM("ServerPresenceMessage", function(msg) {
                    processServerPresence(msg, !0);
                }), connection.onAGM("ServerHeartbeatMessage", function(msg) {
                    processServerPresence(msg, !1);
                }), connection.onAGM("MethodInvocationResultMessage", handleInvokeResultMessage);
            }(), {
                invoke: invoke,
                onInvocationResult: onInvocationResult,
                subscribe: streaming.subscribe
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, ServerProtocol = __webpack_require__(34), ClientProtocol = __webpack_require__(31);
        module.exports = function(instance, connection, repository, vault, configuration) {
            connection.onAGM("Instance", instance._updateIdentity);
            var serverProtocol = new ServerProtocol(connection, instance, configuration, vault), clientProtocol = new ClientProtocol(connection, instance, configuration, repository);
            return new _Promise(function(resolve) {
                resolve({
                    invoke: clientProtocol.invoke,
                    onInvocationResult: clientProtocol.onInvocationResult,
                    register: serverProtocol.register,
                    unregister: serverProtocol.unregister,
                    onInvoked: serverProtocol.onInvoked,
                    methodInvocationResult: serverProtocol.methodInvocationResult,
                    subscribe: clientProtocol.subscribe,
                    createStream: serverProtocol.createStream,
                    getBranchList: serverProtocol.getBranchList,
                    getSubscriptionList: serverProtocol.getSubscriptionList,
                    closeAllSubscriptions: serverProtocol.closeAllSubscriptions,
                    closeSingleSubscription: serverProtocol.closeSingleSubscription,
                    pushData: serverProtocol.pushData,
                    pushDataToSingle: serverProtocol.pushDataToSingle,
                    onSubRequest: serverProtocol.onSubRequest,
                    acceptRequestOnBranch: serverProtocol.acceptRequestOnBranch,
                    rejectRequest: serverProtocol.rejectRequest,
                    onSubAdded: serverProtocol.onSubAdded,
                    onSubRemoved: serverProtocol.onSubRemoved
                });
            });
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, random = __webpack_require__(3), helpers = __webpack_require__(4);
        module.exports = function(connection, instance) {
            function sendResult(message) {
                if ("object" !== (void 0 === message ? "undefined" : _typeof(message))) throw new Error("Invalid message.");
                "number" != typeof message.Status && (message.Status = 0), connection.sendAGM("MethodInvocationResultMessage", message);
            }
            function isStreamMsgForStreamingMethod(msg, method) {
                return msg && msg.EventStreamAction && 0 !== msg.EventStreamAction && "object" === (void 0 === method ? "undefined" : _typeof(method)) && !0 === method.definition.supportsStreaming;
            }
            function processSubscriberMsg(msg, streamingMethod) {
                msg && msg.EventStreamAction && 0 !== msg.EventStreamAction && (1 === msg.EventStreamAction ? clientWishesToSubscribe(msg, streamingMethod) : 2 === msg.EventStreamAction ? clientWishesToUnsubscribe(msg, streamingMethod) : 3 === msg.EventStreamAction ? clientAcknowledgesItDidSubscribe(msg, streamingMethod) : msg.EventStreamAction);
            }
            function clientWishesToSubscribe(msg, streamingMethod) {
                var requestContext = {
                    msg: msg,
                    arguments: msg.Context.ArgumentsJson || {},
                    instance: helpers.convertInfoToInstance(msg.Client)
                };
                "function" == typeof requestHandler && requestHandler(requestContext, streamingMethod);
            }
            function clientWishesToUnsubscribe(msg, streamingMethod) {
                streamingMethod && Array.isArray(streamingMethod.subscriptions) && streamingMethod.subscriptions.length > 0 && closeIndividualSubscription(streamingMethod, msg.StreamId, msg.EventStreamSubject, !1);
            }
            function clientAcknowledgesItDidSubscribe(msg, streamingMethod) {
                if ("string" == typeof msg.StreamId && "" !== msg.StreamId) {
                    var branchKey = getBranchKey(streamingMethod, msg.StreamId);
                    if ("string" == typeof branchKey && Array.isArray(streamingMethod.subscriptions)) {
                        var subscription = {
                            branchKey: branchKey,
                            instance: helpers.convertInfoToInstance(msg.Client),
                            arguments: msg.Context.ArgumentsJson,
                            streamId: msg.StreamId,
                            privateEventStreamSubject: msg.EventStreamSubject,
                            methodResponseSubject: msg.MethodResponseSubject
                        };
                        streamingMethod.subscriptions.push(subscription), "function" == typeof subAddedHandler && subAddedHandler(subscription, streamingMethod);
                    }
                }
            }
            function acceptRequestOnBranch(requestContext, streamingMethod, branch) {
                "string" != typeof branch && (branch = "");
                var streamId = getStreamId(streamingMethod, branch), msg = requestContext.msg;
                sendResult({
                    EventStreamAction: 3,
                    EventStreamSubject: streamingMethod.globalEventStreamSubject,
                    InvocationId: msg.Context.InvocationId,
                    MethodName: streamingMethod.method.Method.Name,
                    MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                    MethodResponseSubject: msg.MethodResponseSubject,
                    MethodVersion: streamingMethod.method.Method.Version,
                    ResultMessage: "Accepted",
                    Server: instance.info(),
                    StreamId: streamId
                });
            }
            function getBranchKey(streamingMethod, streamId) {
                if ("string" == typeof streamId && "object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod))) {
                    var needle = streamingMethod.branchKeyToStreamIdMap.filter(function(branch) {
                        return branch.streamId === streamId;
                    })[0];
                    if ("object" === (void 0 === needle ? "undefined" : _typeof(needle)) && "string" == typeof needle.key) return needle.key;
                }
            }
            function getStreamId(streamingMethod, branchKey) {
                "string" != typeof branchKey && (branchKey = "");
                var needleBranch = streamingMethod.branchKeyToStreamIdMap.filter(function(branch) {
                    return branch.key === branchKey;
                })[0], streamId = needleBranch ? needleBranch.streamId : void 0;
                return "string" == typeof streamId && "" !== streamId || (streamId = generateNewStreamId(streamingMethod.method.Method.Name), 
                streamingMethod.branchKeyToStreamIdMap.push({
                    key: branchKey,
                    streamId: streamId
                })), streamId;
            }
            function generateNewStreamId(streamingMethodName) {
                return "streamId-jsb_of_" + streamingMethodName + "__by_" + instance.info().ApplicationName + "_" + random();
            }
            function rejectRequest(requestContext, streamingMethod, reason) {
                "string" != typeof reason && (reason = "");
                var msg = requestContext.msg;
                sendResult({
                    EventStreamAction: 2,
                    EventStreamSubject: streamingMethod.globalEventStreamSubject,
                    MethodName: streamingMethod.method.Method.Name,
                    MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                    MethodResponseSubject: msg.MethodResponseSubject,
                    MethodVersion: streamingMethod.method.Method.Version,
                    ResultMessage: reason,
                    Server: instance.info(),
                    StreamId: "default_rejection_streamId"
                });
            }
            function closeIndividualSubscription(streamingMethod, streamId, privateEventStreamSubject, sendKickMessage) {
                var subscription = streamingMethod.subscriptions.filter(function(subItem) {
                    return subItem.privateEventStreamSubject === privateEventStreamSubject && subItem.streamId === streamId;
                })[0];
                if ("object" === (void 0 === subscription ? "undefined" : _typeof(subscription))) {
                    var initialLength = streamingMethod.subscriptions.length;
                    streamingMethod.subscriptions = streamingMethod.subscriptions.filter(function(subItem) {
                        return !(subItem.privateEventStreamSubject === subscription.privateEventStreamSubject && subItem.streamId === subscription.streamId);
                    });
                    if (streamingMethod.subscriptions.length === initialLength - 1 && (!0 === sendKickMessage && sendResult({
                        EventStreamAction: 2,
                        EventStreamSubject: privateEventStreamSubject,
                        MethodName: streamingMethod.method.Method.Name,
                        MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                        MethodResponseSubject: subscription.methodResponseSubject,
                        MethodVersion: streamingMethod.method.Method.Version,
                        ResponseContextJson: {},
                        Server: instance.info(),
                        StreamId: subscription.streamId,
                        Status: 0
                    }), "function" == typeof subRemovedHandler)) {
                        var subscriber = subscription.instance;
                        subRemovedHandler(subscriber, streamingMethod);
                    }
                }
            }
            function closeMultipleSubscriptions(streamingMethod, branchKey) {
                if ("object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) && Array.isArray(streamingMethod.branchKeyToStreamIdMap)) {
                    var streamList = streamingMethod.branchKeyToStreamIdMap;
                    "string" == typeof branchKey && (streamList = streamingMethod.branchKeyToStreamIdMap.filter(function(br) {
                        return "object" === (void 0 === br ? "undefined" : _typeof(br)) && br.key === branchKey;
                    })), streamList.forEach(function(br) {
                        var streamId = br.streamId;
                        sendResult({
                            EventStreamAction: 2,
                            EventStreamSubject: streamingMethod.globalEventStreamSubject,
                            MethodName: streamingMethod.method.Method.Name,
                            MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                            Server: instance.info(),
                            StreamId: streamId,
                            Status: 0
                        });
                    });
                }
            }
            function closeSingleSubscription(streamingMethod, subscription) {
                closeIndividualSubscription(streamingMethod, subscription.streamId, subscription.privateEventStreamSubject, !0);
            }
            function pushDataToSingle(streamingMethod, subscription, data) {
                if ("object" !== (void 0 === data ? "undefined" : _typeof(data))) throw new Error("Invalid arguments. Data must be an object.");
                sendResult({
                    EventStreamAction: 5,
                    EventStreamSubject: subscription.privateEventStreamSubject,
                    MethodName: streamingMethod.method.Method.Name,
                    MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                    ResultContextJson: data,
                    Server: instance.info(),
                    StreamId: subscription.streamId
                });
            }
            function pushToBranch(streamingMethod, data, branches) {
                if ("object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) && Array.isArray(streamingMethod.branchKeyToStreamIdMap)) {
                    if ("object" !== (void 0 === data ? "undefined" : _typeof(data))) throw new Error("Invalid arguments. Data must be an object.");
                    "string" == typeof branches ? branches = [ branches ] : (!Array.isArray(branches) || branches.length <= 0) && (branches = null);
                    streamingMethod.branchKeyToStreamIdMap.filter(function(br) {
                        return null === branches || Boolean(br) && "string" == typeof br.key && branches.indexOf(br.key) >= 0;
                    }).map(function(br) {
                        return br.streamId;
                    }).forEach(function(streamId) {
                        sendResult({
                            EventStreamAction: 5,
                            EventStreamSubject: streamingMethod.globalEventStreamSubject,
                            MethodName: streamingMethod.method.Method.Name,
                            MethodRequestSubject: streamingMethod.method.MethodRequestSubject,
                            ResultContextJson: data,
                            Server: instance.info(),
                            StreamId: streamId
                        });
                    });
                }
            }
            function getSubscriptionList(streamingMethod, branchKey) {
                if ("object" !== (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod))) return [];
                return "string" != typeof branchKey ? streamingMethod.subscriptions : streamingMethod.subscriptions.filter(function(sub) {
                    return sub.branchKey === branchKey;
                });
            }
            function getBranchList(streamingMethod) {
                return "object" !== (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) ? [] : getUniqueBranchNames(streamingMethod);
            }
            function getUniqueBranchNames(streamingMethod) {
                var keysWithDuplicates = streamingMethod.subscriptions.map(function(sub) {
                    var result = null;
                    return "object" === (void 0 === sub ? "undefined" : _typeof(sub)) && "string" == typeof sub.branchKey && (result = sub.branchKey), 
                    result;
                }), seen = [];
                return keysWithDuplicates.filter(function(bKey) {
                    return !(null === bKey || seen.indexOf(bKey) >= 0) && (seen.push(bKey), !0);
                });
            }
            function addRequestHandler(handlerFunc) {
                "function" == typeof handlerFunc && (requestHandler = handlerFunc);
            }
            function addSubAddedHandler(handlerFunc) {
                "function" == typeof handlerFunc && (subAddedHandler = handlerFunc);
            }
            function addSubRemovedHandler(handlerFunc) {
                "function" == typeof handlerFunc && (subRemovedHandler = handlerFunc);
            }
            var requestHandler = null, subAddedHandler = null, subRemovedHandler = null;
            return {
                isStreamMsg: isStreamMsgForStreamingMethod,
                processSubscriberMsg: processSubscriberMsg,
                pushData: pushToBranch,
                pushDataToSingle: pushDataToSingle,
                closeAllSubscriptions: closeMultipleSubscriptions,
                closeSingleSubscription: closeSingleSubscription,
                getSubscriptionList: getSubscriptionList,
                getBranchList: getBranchList,
                onSubRequest: addRequestHandler,
                acceptRequestOnBranch: acceptRequestOnBranch,
                rejectRequest: rejectRequest,
                onSubAdded: addSubAddedHandler,
                onSubRemoved: addSubRemovedHandler,
                generateNewStreamId: generateNewStreamId
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var random = __webpack_require__(3), callbackRegistry = __webpack_require__(2), Streaming = __webpack_require__(33), helpers = __webpack_require__(4);
        module.exports = function(connection, instance, configuration, vault) {
            function nextRequestSubject() {
                return "req_" + reqCounter++ + "_" + random();
            }
            function constructHeartbeat() {
                return {
                    PublishingInterval: configuration.server.heartbeat_interval,
                    Instance: instance.info()
                };
            }
            function constructPresence() {
                var methods = vault.getList();
                return {
                    PublishingInterval: configuration.server.presence_interval,
                    Instance: instance.info(),
                    MethodDefinitions: methods.map(function(m) {
                        return m.method;
                    })
                };
            }
            function sendPresence() {
                connection.sendAGM("ServerPresenceMessage", constructPresence());
            }
            function sendHeartbeat() {
                connection.sendAGM("ServerHeartbeatMessage", constructHeartbeat());
            }
            function createNewMethodMessage(methodIdentifier, subject) {
                return "string" == typeof methodIdentifier && (methodIdentifier = {
                    name: methodIdentifier
                }), "number" != typeof methodIdentifier.version && (methodIdentifier.version = 0), 
                {
                    Method: {
                        Name: methodIdentifier.name,
                        InputSignature: methodIdentifier.accepts,
                        ResultSignature: methodIdentifier.returns,
                        Description: methodIdentifier.description,
                        DisplayName: methodIdentifier.displayName,
                        Version: methodIdentifier.version,
                        ObjectTypeRestrictions: methodIdentifier.objectTypes
                    },
                    MethodRequestSubject: subject
                };
            }
            function register(repoMethod, success) {
                var reqSubj = nextRequestSubject();
                repoMethod.method = createNewMethodMessage(repoMethod.definition, reqSubj), announceNewMethod(), 
                success();
            }
            function createStream(repoMethod, streamDef, success) {
                var reqSubj = nextRequestSubject(), streamConverted = createNewMethodMessage(streamDef, reqSubj);
                streamConverted.Method.Flags = 32, repoMethod.method = streamConverted, repoMethod.globalEventStreamSubject = streamDef.name + ".jsStream." + random(), 
                repoMethod.subscriptions = [], repoMethod.branchKeyToStreamIdMap = [], announceNewMethod(), 
                success();
            }
            function announceNewMethod() {
                sendPresence(), void 0 === presenceTimer && (presenceTimer = setInterval(sendPresence, configuration.server.presence_interval));
            }
            function handleMethodInvocationMessage(message) {
                var subject = message.MethodRequestSubject, methodList = vault.getList(), method = methodList.filter(function(m) {
                    return m.method.MethodRequestSubject === subject;
                })[0];
                if (void 0 !== method) {
                    if (streaming.isStreamMsg(message, method)) return void streaming.processSubscriberMsg(message, method);
                    var invocationId = message.Context.InvocationId;
                    invocationMessagesMap[invocationId] = message;
                    var invocationArgs = {
                        args: message.Context.ArgumentsJson,
                        instance: helpers.convertInfoToInstance(message.Client)
                    };
                    callbacks.execute("onInvoked", method, invocationId, invocationArgs);
                }
            }
            function onInvoked(callback) {
                callbacks.add("onInvoked", callback);
            }
            function methodInvocationResult(executedMethod, invocationId, err, result) {
                var message = invocationMessagesMap[invocationId];
                if (message && "null" !== message.MethodResponseSubject && void 0 !== executedMethod) {
                    var resultMessage = {
                        MethodRequestSubject: message.MethodRequestSubject,
                        MethodResponseSubject: message.MethodResponseSubject,
                        MethodName: executedMethod.method.Method.Name,
                        InvocationId: invocationId,
                        ResultContextJson: result,
                        Server: instance.info(),
                        ResultMessage: err,
                        Status: err ? 1 : 0
                    };
                    connection.sendAGM("MethodInvocationResultMessage", resultMessage), delete invocationMessagesMap[invocationId];
                }
            }
            function unregister() {
                sendPresence();
            }
            var presenceTimer, heartbeatTimer, invocationMessagesMap = {}, reqCounter = 0, callbacks = callbackRegistry(), streaming = new Streaming(connection, instance);
            return connection.onAGM("MethodInvocationRequestMessage", handleMethodInvocationMessage), 
            sendHeartbeat(), void 0 === heartbeatTimer && (heartbeatTimer = setInterval(sendHeartbeat, configuration.server.heartbeat_interval)), 
            {
                register: register,
                onInvoked: onInvoked,
                methodInvocationResult: methodInvocationResult,
                unregister: unregister,
                createStream: createStream,
                getBranchList: streaming.getBranchList,
                getSubscriptionList: streaming.getSubscriptionList,
                closeAllSubscriptions: streaming.closeAllSubscriptions,
                closeSingleSubscription: streaming.closeSingleSubscription,
                pushDataToSingle: streaming.pushDataToSingle,
                pushData: streaming.pushData,
                onSubRequest: streaming.onSubRequest,
                acceptRequestOnBranch: streaming.acceptRequestOnBranch,
                rejectRequest: streaming.rejectRequest,
                onSubAdded: streaming.onSubAdded,
                onSubRemoved: streaming.onSubRemoved
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        module.exports = function(instance, session, repository, logger) {
            function getNextSubscriptionLocalKey() {
                var current = nextSubLocalKey;
                return nextSubLocalKey += 1, current;
            }
            function subscribe(streamingMethod, argumentObj, targetServers, stuff, success, error) {
                if (0 === targetServers.length) return void error(ERR_MSG_SUB_FAILED + " No available servers matched the target params.");
                logger.debug("subscribe to target servers: ", targetServers);
                var subLocalKey = getNextSubscriptionLocalKey(), pendingSub = registerSubscription(subLocalKey, streamingMethod, argumentObj, success, error, stuff.method_response_timeout);
                if ("object" !== (void 0 === pendingSub ? "undefined" : _typeof(pendingSub))) return void error(ERR_MSG_SUB_FAILED + " Unable to register the user callbacks.");
                targetServers.forEach(function(target) {
                    var serverId = target.server.id;
                    pendingSub.trackedServers.push({
                        serverId: serverId,
                        subscriptionId: void 0
                    });
                    var msg = {
                        type: MSG_TYPE_SUBSCRIBE,
                        server_id: serverId,
                        method_id: streamingMethod.info.id,
                        arguments_kv: argumentObj
                    };
                    session.send(msg, {
                        serverId: serverId,
                        subLocalKey: subLocalKey
                    }).then(handleSubscribed).catch(handleErrorSubscribing);
                });
            }
            function registerSubscription(subLocalKey, method, args, success, error, timeout) {
                return subscriptionsList[subLocalKey] = {
                    status: STATUS_AWAITING_ACCEPT,
                    method: method,
                    arguments: args,
                    success: success,
                    error: error,
                    trackedServers: [],
                    handlers: {
                        onData: [],
                        onClosed: []
                    },
                    queued: {
                        data: [],
                        closers: []
                    },
                    timeoutId: void 0
                }, subscriptionsList[subLocalKey].timeoutId = setTimeout(function() {
                    if (void 0 !== subscriptionsList[subLocalKey]) {
                        var pendingSub = subscriptionsList[subLocalKey];
                        pendingSub.status === STATUS_AWAITING_ACCEPT ? (error({
                            method: method,
                            called_with: args,
                            message: ERR_MSG_SUB_FAILED + " Subscription attempt timed out after " + timeout + "ms."
                        }), delete subscriptionsList[subLocalKey]) : pendingSub.status === STATUS_SUBSCRIBED && pendingSub.trackedServers.length > 0 && (pendingSub.trackedServers = pendingSub.trackedServers.filter(function(server) {
                            return void 0 !== server.subscriptionId;
                        }), delete pendingSub.timeoutId, pendingSub.trackedServers.length <= 0 && (callOnClosedHandlers(pendingSub), 
                        delete subscriptionsList[subLocalKey]));
                    }
                }, timeout), subscriptionsList[subLocalKey];
            }
            function handleErrorSubscribing(errorResponse) {
                logger.debug("Subscription attempt failed", errorResponse);
                var tag = errorResponse._tag, subLocalKey = tag.subLocalKey, pendingSub = subscriptionsList[subLocalKey];
                if ("object" === (void 0 === pendingSub ? "undefined" : _typeof(pendingSub)) && (pendingSub.trackedServers = pendingSub.trackedServers.filter(function(server) {
                    return server.serverId !== tag.serverId;
                }), pendingSub.trackedServers.length <= 0)) {
                    if (clearTimeout(pendingSub.timeoutId), pendingSub.status === STATUS_AWAITING_ACCEPT) {
                        var reason = "string" == typeof errorResponse.reason && "" !== errorResponse.reason ? ' Publisher said "' + errorResponse.reason + '".' : " No reason given.", callArgs = "object" === _typeof(pendingSub.arguments) ? JSON.stringify(pendingSub.arguments) : "{}";
                        pendingSub.error(ERR_MSG_SUB_REJECTED + reason + " Called with:" + callArgs);
                    } else pendingSub.status === STATUS_SUBSCRIBED && callOnClosedHandlers(pendingSub);
                    delete subscriptionsList[subLocalKey];
                }
            }
            function handleSubscribed(msg) {
                logger.debug("handleSubscribed", msg);
                var subLocalKey = msg._tag.subLocalKey, pendingSub = subscriptionsList[subLocalKey];
                if ("object" === (void 0 === pendingSub ? "undefined" : _typeof(pendingSub))) {
                    var serverId = msg._tag.serverId, acceptingServer = pendingSub.trackedServers.filter(function(server) {
                        return server.serverId === serverId;
                    })[0];
                    if ("object" === (void 0 === acceptingServer ? "undefined" : _typeof(acceptingServer))) {
                        acceptingServer.subscriptionId = msg.subscription_id, subscriptionIdToLocalKeyMap[msg.subscription_id] = subLocalKey;
                        var isFirstResponse = pendingSub.status === STATUS_AWAITING_ACCEPT;
                        pendingSub.status = STATUS_SUBSCRIBED, isFirstResponse && pendingSub.success({
                            onData: function(dataCallback) {
                                if ("function" != typeof dataCallback) throw new TypeError("The data callback must be a function.");
                                this.handlers.onData.push(dataCallback), 1 === this.handlers.onData.length && this.queued.data.length > 0 && this.queued.data.forEach(function(dataItem) {
                                    dataCallback(dataItem);
                                });
                            }.bind(pendingSub),
                            onClosed: function(closedCallback) {
                                if ("function" != typeof closedCallback) throw new TypeError("The callback must be a function.");
                                this.handlers.onClosed.push(closedCallback);
                            }.bind(pendingSub),
                            onFailed: function() {},
                            close: closeSubscription.bind(subLocalKey),
                            requestArguments: pendingSub.arguments,
                            serverInstance: repository.getServerById(serverId).getInfoForUser(),
                            stream: pendingSub.method
                        });
                    }
                }
            }
            function handleEventData(msg) {
                function receivedStreamData() {
                    return {
                        data: msg.data,
                        server: repository.getServerById(sendingServerId).getInfoForUser(),
                        requestArguments: subscription.arguments || {},
                        message: null,
                        private: isPrivateData
                    };
                }
                logger.debug("handleEventData", msg);
                var subLocalKey = subscriptionIdToLocalKeyMap[msg.subscription_id];
                if (void 0 !== subLocalKey) {
                    var subscription = subscriptionsList[subLocalKey];
                    if ("object" === (void 0 === subscription ? "undefined" : _typeof(subscription))) {
                        var trackedServersFound = subscription.trackedServers.filter(function(server) {
                            return server.subscriptionId === msg.subscription_id;
                        });
                        if (1 === trackedServersFound.length) {
                            var isPrivateData = msg.oob && msg.snapshot, sendingServerId = trackedServersFound[0].serverId, onDataHandlers = subscription.handlers.onData, queuedData = subscription.queued.data;
                            onDataHandlers.length > 0 ? onDataHandlers.forEach(function(callback) {
                                "function" == typeof callback && callback(receivedStreamData());
                            }) : queuedData.push(receivedStreamData());
                        }
                    }
                }
            }
            function handleSubscriptionCancelled(msg) {
                logger.debug("handleSubscriptionCancelled", msg);
                var subLocalKey = subscriptionIdToLocalKeyMap[msg.subscription_id];
                if (void 0 !== subLocalKey) {
                    var subscription = subscriptionsList[subLocalKey];
                    if ("object" === (void 0 === subscription ? "undefined" : _typeof(subscription))) {
                        var expectedNewLength = subscription.trackedServers.length - 1;
                        subscription.trackedServers = subscription.trackedServers.filter(function(server) {
                            return server.subscriptionId !== msg.subscription_id || (subscription.queued.closers.push(server.serverId), 
                            !1);
                        }), subscription.trackedServers.length === expectedNewLength && (subscription.trackedServers.length <= 0 && (clearTimeout(subscription.timeoutId), 
                        callOnClosedHandlers(subscription), delete subscriptionsList[subLocalKey]), delete subscriptionIdToLocalKeyMap[msg.subscription_id]);
                    }
                }
            }
            function callOnClosedHandlers(subscription, reason) {
                var closersCount = subscription.queued.closers.length, closingServerId = closersCount > 0 ? subscription.queued.closers[closersCount - 1] : null, closingServer = null;
                "number" == typeof closingServerId && (closingServer = repository.getServerById(closingServerId).getInfoForUser()), 
                subscription.handlers.onClosed.forEach(function(callback) {
                    "function" == typeof callback && callback({
                        message: reason || ON_CLOSE_MSG_SERVER_INIT,
                        requestArguments: subscription.arguments,
                        server: closingServer,
                        stream: subscription.method
                    });
                });
            }
            function closeSubscription(subLocalKey) {
                logger.debug("closeSubscription", subLocalKey);
                var subscription = subscriptionsList[subLocalKey];
                "object" === (void 0 === subscription ? "undefined" : _typeof(subscription)) && (subscription.trackedServers.forEach(function(server) {
                    void 0 !== server.subscriptionId && (session.sendFireAndForget({
                        type: "unsubscribe",
                        subscription_id: server.subscriptionId,
                        reason_uri: "",
                        reason: ON_CLOSE_MSG_CLIENT_INIT
                    }), delete subscriptionIdToLocalKeyMap[server.subscriptionId]);
                }), subscription.trackedServers = [], callOnClosedHandlers(subscription, ON_CLOSE_MSG_CLIENT_INIT), 
                delete subscriptionsList[subLocalKey]);
            }
            session.on("subscribed", handleSubscribed), session.on("event", handleEventData), 
            session.on("subscription-cancelled", handleSubscriptionCancelled);
            var MSG_TYPE_SUBSCRIBE = "subscribe", STATUS_AWAITING_ACCEPT = "awaitingAccept", STATUS_SUBSCRIBED = "subscribed", ERR_MSG_SUB_FAILED = "Subscription failed.", ERR_MSG_SUB_REJECTED = "Subscription rejected.", ON_CLOSE_MSG_SERVER_INIT = "ServerInitiated", ON_CLOSE_MSG_CLIENT_INIT = "ClientInitiated", subscriptionsList = {}, subscriptionIdToLocalKeyMap = {}, nextSubLocalKey = 0;
            return {
                subscribe: subscribe
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var callbackRegistry = __webpack_require__(2), Streaming = __webpack_require__(35);
        module.exports = function(instance, session, repository, logger) {
            function handlePeerAdded(msg) {
                var newPeerId = msg.new_peer_id, remoteId = msg.identity, serverInfo = {
                    machine: remoteId.machine,
                    pid: remoteId.process,
                    instance: remoteId.instance,
                    application: remoteId.application,
                    environment: remoteId.environment,
                    region: remoteId.region,
                    user: remoteId.user
                };
                repository.addServer(serverInfo, newPeerId);
            }
            function handlePeerRemoved(msg) {
                var removedPeerId = msg.removed_id, reason = msg.reason;
                repository.removeServerById(removedPeerId, reason);
            }
            function handleMethodsAddedMessage(msg) {
                var serverId = msg.server_id;
                msg.methods.forEach(function(method) {
                    var methodInfo = {
                        id: method.id,
                        name: method.name,
                        displayName: method.display_name,
                        description: method.description,
                        version: method.version,
                        objectTypes: method.object_types,
                        accepts: method.input_signature,
                        returns: method.result_signature,
                        supportsStreaming: void 0 !== method.flags && method.flags.supportsStreaming
                    };
                    repository.addServerMethod(serverId, methodInfo);
                });
            }
            function handleMethodsRemovedMessage(msg) {
                var serverId = msg.server_id, methodIdList = msg.methods, server = repository.getServerById(serverId);
                Object.keys(server.methods).forEach(function(methodKey) {
                    var method = server.methods[methodKey];
                    methodIdList.indexOf(method.info.id) > -1 && repository.removeServerMethod(serverId, methodKey);
                });
            }
            function invoke(id, method, args, target) {
                var serverId = target.id, methodId = method.info.id;
                logger.debug("sending call (" + id + ") for method id " + methodId + " to server " + serverId);
                var msg = {
                    type: "call",
                    server_id: serverId,
                    method_id: methodId,
                    arguments_kv: args
                };
                session.send(msg, {
                    invocationId: id,
                    serverId: serverId
                }).then(handleResultMessage).catch(handleInvocationError);
            }
            function onInvocationResult(callback) {
                callbacks.add("onResult", callback);
            }
            function handleResultMessage(msg) {
                logger.debug("handle result message " + msg);
                var invocationId = msg._tag.invocationId, result = msg.result, serverId = msg._tag.serverId, server = repository.getServerById(serverId);
                callbacks.execute("onResult", invocationId, server.getInfoForUser(), 0, result, "");
            }
            function handleInvocationError(msg) {
                logger.debug("handle invocation error " + msg);
                var invocationId = msg._tag.invocationId, serverId = msg._tag.serverId, server = repository.getServerById(serverId), message = msg.reason, context = msg.context;
                callbacks.execute("onResult", invocationId, server.getInfoForUser(), 1, context, message);
            }
            session.on("peer-added", handlePeerAdded), session.on("peer-removed", handlePeerRemoved), 
            session.on("methods-added", handleMethodsAddedMessage), session.on("methods-removed", handleMethodsRemovedMessage);
            var callbacks = callbackRegistry();
            return {
                invoke: invoke,
                onInvocationResult: onInvocationResult,
                subscribe: new Streaming(instance, session, repository, logger).subscribe
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _Promise = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise, serverFactory = __webpack_require__(39), clientFactory = __webpack_require__(36);
        module.exports = function(instance, connection, clientRepository, serverRepository, libConfig, serverGetter) {
            function handleReconnect() {
                logger.info("reconnected - will replay registered methods and subscriptions"), clientRepository.reset(), 
                clientRepository.addServer(instance, connection.peerId);
                var registeredMethods = serverRepository.getList();
                serverRepository.reset(), registeredMethods.forEach(function(method) {
                    var def = method.definition, userCallback = method.theFunction.userCallback, functionToUse = serverGetter().register;
                    method.theFunction.isAsync && (functionToUse = serverGetter().registerAsync), functionToUse(def, userCallback);
                });
            }
            function handleInitialJoin() {
                clientRepository.addServer(instance, connection.peerId), resolveReadyPromise({
                    invoke: client.invoke,
                    onInvocationResult: client.onInvocationResult,
                    register: server.register,
                    unregister: server.unregister,
                    onInvoked: server.onInvoked,
                    methodInvocationResult: server.methodInvocationResult,
                    subscribe: client.subscribe,
                    createStream: server.createStream,
                    getBranchList: server.getBranchList,
                    getSubscriptionList: server.getSubscriptionList,
                    closeAllSubscriptions: server.closeAllSubscriptions,
                    closeSingleSubscription: server.closeSingleSubscription,
                    pushData: server.pushData,
                    pushDataToSingle: server.pushDataToSingle,
                    onSubRequest: server.onSubRequest,
                    acceptRequestOnBranch: server.acceptRequestOnBranch,
                    rejectRequest: server.rejectRequest,
                    onSubAdded: server.onSubAdded,
                    onSubRemoved: server.onSubRemoved
                }), resolveReadyPromise = void 0;
            }
            var resolveReadyPromise, logger = libConfig.logger.subLogger("gw3-protocol"), readyPromise = new _Promise(function(resolve) {
                resolveReadyPromise = resolve;
            }), session = connection.domain("agm", logger.subLogger("domain")), server = serverFactory(instance, session, clientRepository, serverRepository, logger.subLogger("server")), client = clientFactory(instance, session, clientRepository, logger.subLogger("client"));
            return session.onJoined(function(reconnect) {
                reconnect ? handleReconnect() : handleInitialJoin();
            }), session.join(), readyPromise;
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        }, callbackRegistry = __webpack_require__(2);
        module.exports = function(instance, session, repository, vault, logger) {
            function getNextStreamId() {
                var current = nextStreamId;
                return nextStreamId += 1, current;
            }
            function handleAddInterest(msg) {
                logger.debug("server_AddInterest ", msg);
                var caller = repository.getServerById(msg.caller_id), instance = "function" == typeof caller.getInfoForUser ? caller.getInfoForUser() : null, requestContext = {
                    msg: msg,
                    arguments: msg.arguments_kv || {},
                    instance: instance
                }, streamingMethod = vault.getById(msg.method_id);
                return void 0 === streamingMethod ? void sendSubscriptionFailed("No method with id " + msg.method_id + " on this server.", msg.subscription_id) : streamingMethod.subscriptionsMap && streamingMethod.subscriptionsMap[msg.subscription_id] ? void sendSubscriptionFailed("A subscription with id " + msg.subscription_id + " already exists.", msg.subscription_id) : void callbacks.execute(SUBSCRIPTION_REQUEST, requestContext, streamingMethod);
            }
            function sendSubscriptionFailed(reason, subscriptionId) {
                var errorMessage = {
                    type: "error",
                    reason_uri: ERR_URI_SUBSCRIPTION_FAILED,
                    reason: reason,
                    request_id: subscriptionId
                };
                session.sendFireAndForget(errorMessage);
            }
            function acceptRequestOnBranch(requestContext, streamingMethod, branch) {
                if (console.log("requestContext", requestContext), "string" != typeof branch && (branch = "", 
                console.log("empty branch", branch)), "object" !== _typeof(streamingMethod.subscriptionsMap)) throw new TypeError("The streaming method is missing its subscriptions.");
                if (!Array.isArray(streamingMethod.branchKeyToStreamIdMap)) throw new TypeError("The streaming method is missing its branches.");
                var streamId = getStreamId(streamingMethod, branch), key = requestContext.msg.subscription_id, subscription = {
                    id: key,
                    arguments: requestContext.arguments,
                    instance: requestContext.instance,
                    branchKey: branch,
                    streamId: streamId,
                    subscribeMsg: requestContext.msg
                };
                streamingMethod.subscriptionsMap[key] = subscription, session.sendFireAndForget({
                    type: "accepted",
                    subscription_id: key,
                    stream_id: streamId
                }), callbacks.execute(SUBSCRIPTION_ADDED, subscription, streamingMethod);
            }
            function getStreamId(streamingMethod, branchKey) {
                "string" != typeof branchKey && (branchKey = "");
                var needleBranch = streamingMethod.branchKeyToStreamIdMap.filter(function(branch) {
                    return branch.key === branchKey;
                })[0], streamId = needleBranch ? needleBranch.streamId : void 0;
                return "string" == typeof streamId && "" !== streamId || (streamId = getNextStreamId(), 
                streamingMethod.branchKeyToStreamIdMap.push({
                    key: branchKey,
                    streamId: streamId
                })), streamId;
            }
            function rejectRequest(requestContext, streamingMethod, reason) {
                "string" != typeof reason && (reason = ""), sendSubscriptionFailed("Subscription rejected by user. " + reason, requestContext.msg.subscription_id);
            }
            function onSubscriptionLifetimeEvent(eventName, handlerFunc) {
                callbacks.add(eventName, handlerFunc);
            }
            function pushToBranch(streamingMethod, data, branches) {
                if ("object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) && Array.isArray(streamingMethod.branchKeyToStreamIdMap)) {
                    if ("object" !== (void 0 === data ? "undefined" : _typeof(data))) throw new Error("Invalid arguments. Data must be an object.");
                    "string" == typeof branches ? branches = [ branches ] : (!Array.isArray(branches) || branches.length <= 0) && (branches = null);
                    streamingMethod.branchKeyToStreamIdMap.filter(function(br) {
                        return null === branches || Boolean(br) && "string" == typeof br.key && branches.indexOf(br.key) >= 0;
                    }).map(function(br) {
                        return br.streamId;
                    }).forEach(function(streamId) {
                        session.sendFireAndForget({
                            type: "publish",
                            stream_id: streamId,
                            data: data
                        });
                    });
                }
            }
            function pushDataToSingle(streamingMethod, subscription, data) {
                if ("object" !== (void 0 === data ? "undefined" : _typeof(data))) throw new Error("Invalid arguments. Data must be an object.");
                session.sendFireAndForget({
                    type: "post",
                    subscription_id: subscription.id,
                    data: data
                });
            }
            function closeSingleSubscription(streamingMethod, subscription) {
                delete streamingMethod.subscriptionsMap[subscription.id], session.sendFireAndForget({
                    type: "drop-subscription",
                    subscription_id: subscription.id,
                    reason: "Server dropping a single subscription"
                });
                var subscriber = subscription.instance;
                callbacks.execute(SUBSCRIPTION_REMOVED, subscriber, streamingMethod);
            }
            function closeMultipleSubscriptions(streamingMethod, branchKey) {
                if ("object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) && "object" === _typeof(streamingMethod.subscriptionsMap)) {
                    var subscriptionsToClose = Object.keys(streamingMethod.subscriptionsMap).map(function(key) {
                        return streamingMethod.subscriptionsMap[key];
                    });
                    "string" == typeof branchKey && (subscriptionsToClose = subscriptionsToClose.filter(function(sub) {
                        return sub.branchKey === branchKey;
                    })), subscriptionsToClose.forEach(function(subscription) {
                        delete streamingMethod.subscriptionsMap[subscription.id], session.sendFireAndForget({
                            type: "drop-subscription",
                            subscription_id: subscription.id,
                            reason: "Server dropping all subscriptions on stream_id: " + subscription.streamId
                        });
                    });
                }
            }
            function getSubscriptionList(streamingMethod, branchKey) {
                if ("object" !== (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod))) return [];
                var allSubscriptions = Object.keys(streamingMethod.subscriptionsMap).map(function(key) {
                    return streamingMethod.subscriptionsMap[key];
                });
                return "string" != typeof branchKey ? allSubscriptions : allSubscriptions.filter(function(sub) {
                    return sub.branchKey === branchKey;
                });
            }
            function getBranchList(streamingMethod) {
                if ("object" !== (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod))) return [];
                var allSubscriptions = Object.keys(streamingMethod.subscriptionsMap).map(function(key) {
                    return streamingMethod.subscriptionsMap[key];
                }), keysWithDuplicates = allSubscriptions.map(function(sub) {
                    var result = null;
                    return "object" === (void 0 === sub ? "undefined" : _typeof(sub)) && "string" == typeof sub.branchKey && (result = sub.branchKey), 
                    result;
                }), seen = [];
                return keysWithDuplicates.filter(function(bKey) {
                    return !(null === bKey || seen.indexOf(bKey) >= 0) && (seen.push(bKey), !0);
                });
            }
            function handleRemoveInterest(msg) {
                logger.debug("handleRemoveInterest", msg);
                var streamingMethod = vault.getById(msg.method_id);
                if ("string" == typeof msg.subscription_id && "object" === (void 0 === streamingMethod ? "undefined" : _typeof(streamingMethod)) && "object" === _typeof(streamingMethod.subscriptionsMap[msg.subscription_id])) {
                    var subscriber = streamingMethod.subscriptionsMap[msg.subscription_id].instance;
                    delete streamingMethod.subscriptionsMap[msg.subscription_id], callbacks.execute(SUBSCRIPTION_REMOVED, subscriber, streamingMethod);
                }
            }
            session.on("add-interest", handleAddInterest), session.on("remove-interest", handleRemoveInterest);
            var SUBSCRIPTION_REQUEST = "onSubscriptionRequest", SUBSCRIPTION_ADDED = "onSubscriptionAdded", SUBSCRIPTION_REMOVED = "onSubscriptionRemoved", ERR_URI_SUBSCRIPTION_FAILED = "com.tick42.agm.errors.subscription.failure", callbacks = callbackRegistry(), nextStreamId = 0;
            return {
                pushData: pushToBranch,
                pushDataToSingle: pushDataToSingle,
                onSubRequest: onSubscriptionLifetimeEvent.bind(null, SUBSCRIPTION_REQUEST),
                onSubAdded: onSubscriptionLifetimeEvent.bind(null, SUBSCRIPTION_ADDED),
                onSubRemoved: onSubscriptionLifetimeEvent.bind(null, SUBSCRIPTION_REMOVED),
                acceptRequestOnBranch: acceptRequestOnBranch,
                rejectRequest: rejectRequest,
                getSubscriptionList: getSubscriptionList,
                getBranchList: getBranchList,
                closeSingleSubscription: closeSingleSubscription,
                closeMultipleSubscriptions: closeMultipleSubscriptions
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var callbackRegistry = __webpack_require__(2), Streaming = __webpack_require__(38);
        module.exports = function(instance, session, repository, vault, logger) {
            function handleRegisteredMessage(msg) {
                var methodId = msg._tag.methodId, repoMethod = vault.getById(methodId);
                repoMethod && repoMethod.registrationCallbacks && (logger.debug("registered method " + repoMethod.definition.name + " with id " + methodId), 
                repoMethod.registrationCallbacks.success());
            }
            function handleErrorRegister(msg) {
                logger.warn(msg);
                var methodId = msg._tag.methodId, repoMethod = vault.getById(methodId);
                repoMethod && repoMethod.registrationCallbacks && (logger.debug("failed to register method " + repoMethod.definition.name + " with id " + methodId), 
                repoMethod.registrationCallbacks.fail());
            }
            function handleInvokeMessage(msg) {
                var invocationId = msg.invocation_id, peerId = msg.peer_id, methodId = msg.method_id, args = msg.arguments_kv;
                logger.debug('received invocation for method id "' + methodId + '"');
                var methodList = vault.getList(), method = methodList.filter(function(m) {
                    return m._repoId === methodId;
                })[0];
                if (void 0 !== method) {
                    var client = repository.getServerById(peerId), invocationArgs = {
                        args: args,
                        instance: client.getInfoForUser()
                    };
                    callbacks.execute("onInvoked", method, invocationId, invocationArgs);
                }
            }
            function createStream(repoMethod, streamDef, success, fail) {
                repoMethod.subscriptionsMap = {}, repoMethod.branchKeyToStreamIdMap = [], register(repoMethod, success, fail, !0);
            }
            function register(repoMethod, success, fail, isStreaming) {
                var methodDef = repoMethod.definition;
                repoMethod.registrationCallbacks = {
                    success: success,
                    fail: fail
                };
                var flags = {};
                !0 === isStreaming && (flags = {
                    supportsStreaming: !0
                }), logger.debug('registering method "' + methodDef.name + '"');
                var registerMsg = {
                    type: "register",
                    methods: [ {
                        id: repoMethod._repoId,
                        name: methodDef.name,
                        display_name: methodDef.displayName,
                        description: methodDef.description,
                        version: methodDef.version,
                        flags: flags,
                        object_types: methodDef.objectTypes,
                        input_signature: methodDef.accepts,
                        result_signature: methodDef.returns,
                        restrictions: void 0
                    } ]
                };
                session.send(registerMsg, {
                    methodId: repoMethod._repoId
                }).then(handleRegisteredMessage).catch(handleErrorRegister);
            }
            function onInvoked(callback) {
                callbacks.add("onInvoked", callback);
            }
            function methodInvocationResult(registrationId, invocationId, err, result) {
                var msg;
                msg = err ? {
                    type: "error",
                    request_id: invocationId,
                    reason_uri: "agm.errors.client_error",
                    reason: err,
                    context: result
                } : {
                    type: "yield",
                    invocation_id: invocationId,
                    peer_id: session.peerId,
                    result: result
                }, session.sendFireAndForget(msg);
            }
            function unregister(method) {
                var msg = {
                    type: "unregister",
                    methods: [ method._repoId ]
                };
                session.send(msg).then(handleUnregisteredMessage);
            }
            function handleUnregisteredMessage(msg) {
                var requestId = msg.request_id;
                logger.debug("unregistered by requestId " + requestId);
            }
            var callbacks = callbackRegistry(), streaming = new Streaming(instance, session, repository, vault, logger);
            return session.on("invoke", handleInvokeMessage), {
                register: register,
                onInvoked: onInvoked,
                methodInvocationResult: methodInvocationResult,
                unregister: unregister,
                createStream: createStream,
                getBranchList: streaming.getBranchList,
                getSubscriptionList: streaming.getSubscriptionList,
                closeAllSubscriptions: streaming.closeMultipleSubscriptions,
                closeSingleSubscription: streaming.closeSingleSubscription,
                pushData: streaming.pushData,
                pushDataToSingle: streaming.pushDataToSingle,
                onSubRequest: streaming.onSubRequest,
                acceptRequestOnBranch: streaming.acceptRequestOnBranch,
                rejectRequest: streaming.rejectRequest,
                onSubAdded: streaming.onSubAdded,
                onSubRemoved: streaming.onSubRemoved
            };
        };
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(module) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            }, _Promise2 = "undefined" == typeof Promise ? __webpack_require__(0).Promise : Promise;
            !function(root, factory) {
                "object" === _typeof2(exports) && "object" === _typeof2(module) ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
                __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            }(0, function() {
                return function(modules) {
                    function __webpack_require__(moduleId) {
                        if (installedModules[moduleId]) return installedModules[moduleId].exports;
                        var module = installedModules[moduleId] = {
                            i: moduleId,
                            l: !1,
                            exports: {}
                        };
                        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
                        module.l = !0, module.exports;
                    }
                    var installedModules = {};
                    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
                    __webpack_require__.i = function(value) {
                        return value;
                    }, __webpack_require__.d = function(exports, name, getter) {
                        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                            configurable: !1,
                            enumerable: !0,
                            get: getter
                        });
                    }, __webpack_require__.n = function(module) {
                        var getter = module && module.__esModule ? function() {
                            return module.default;
                        } : function() {
                            return module;
                        };
                        return __webpack_require__.d(getter, "a", getter), getter;
                    }, __webpack_require__.o = function(object, property) {
                        return Object.prototype.hasOwnProperty.call(object, property);
                    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 24);
                }([ function(module, exports, __webpack_require__) {
                    (function(process, global) {
                        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                            return void 0 === obj ? "undefined" : _typeof2(obj);
                        } : function(obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                        };
                        !function(global, factory) {
                            "object" === _typeof(exports) && void 0 !== module ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_FACTORY__ = factory, 
                            void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                        }(0, function() {
                            function objectOrFunction(x) {
                                return "function" == typeof x || "object" === (void 0 === x ? "undefined" : _typeof(x)) && null !== x;
                            }
                            function isFunction(x) {
                                return "function" == typeof x;
                            }
                            function setScheduler(scheduleFn) {
                                customSchedulerFn = scheduleFn;
                            }
                            function setAsap(asapFn) {
                                asap = asapFn;
                            }
                            function useVertxTimer() {
                                return void 0 !== vertxNext ? function() {
                                    vertxNext(flush);
                                } : useSetTimeout();
                            }
                            function useSetTimeout() {
                                var globalSetTimeout = setTimeout;
                                return function() {
                                    return globalSetTimeout(flush, 1);
                                };
                            }
                            function flush() {
                                for (var i = 0; i < len; i += 2) {
                                    (0, queue[i])(queue[i + 1]), queue[i] = void 0, queue[i + 1] = void 0;
                                }
                                len = 0;
                            }
                            function then(onFulfillment, onRejection) {
                                var _arguments = arguments, parent = this, child = new this.constructor(noop);
                                void 0 === child[PROMISE_ID] && makePromise(child);
                                var _state = parent._state;
                                return _state ? function() {
                                    var callback = _arguments[_state - 1];
                                    asap(function() {
                                        return invokeCallback(_state, child, callback, parent._result);
                                    });
                                }() : subscribe(parent, child, onFulfillment, onRejection), child;
                            }
                            function resolve(object) {
                                var Constructor = this;
                                if (object && "object" === (void 0 === object ? "undefined" : _typeof(object)) && object.constructor === Constructor) return object;
                                var promise = new Constructor(noop);
                                return _resolve(promise, object), promise;
                            }
                            function noop() {}
                            function selfFulfillment() {
                                return new TypeError("You cannot resolve a promise with itself");
                            }
                            function cannotReturnOwn() {
                                return new TypeError("A promises callback cannot return that same promise.");
                            }
                            function getThen(promise) {
                                try {
                                    return promise.then;
                                } catch (error) {
                                    return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                                }
                            }
                            function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                                try {
                                    then.call(value, fulfillmentHandler, rejectionHandler);
                                } catch (e) {
                                    return e;
                                }
                            }
                            function handleForeignThenable(promise, thenable, then) {
                                asap(function(promise) {
                                    var sealed = !1, error = tryThen(then, thenable, function(value) {
                                        sealed || (sealed = !0, thenable !== value ? _resolve(promise, value) : fulfill(promise, value));
                                    }, function(reason) {
                                        sealed || (sealed = !0, _reject(promise, reason));
                                    }, "Settle: " + (promise._label || " unknown promise"));
                                    !sealed && error && (sealed = !0, _reject(promise, error));
                                }, promise);
                            }
                            function handleOwnThenable(promise, thenable) {
                                thenable._state === FULFILLED ? fulfill(promise, thenable._result) : thenable._state === REJECTED ? _reject(promise, thenable._result) : subscribe(thenable, void 0, function(value) {
                                    return _resolve(promise, value);
                                }, function(reason) {
                                    return _reject(promise, reason);
                                });
                            }
                            function handleMaybeThenable(promise, maybeThenable, then$$) {
                                maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve ? handleOwnThenable(promise, maybeThenable) : then$$ === GET_THEN_ERROR ? (_reject(promise, GET_THEN_ERROR.error), 
                                GET_THEN_ERROR.error = null) : void 0 === then$$ ? fulfill(promise, maybeThenable) : isFunction(then$$) ? handleForeignThenable(promise, maybeThenable, then$$) : fulfill(promise, maybeThenable);
                            }
                            function _resolve(promise, value) {
                                promise === value ? _reject(promise, selfFulfillment()) : objectOrFunction(value) ? handleMaybeThenable(promise, value, getThen(value)) : fulfill(promise, value);
                            }
                            function publishRejection(promise) {
                                promise._onerror && promise._onerror(promise._result), publish(promise);
                            }
                            function fulfill(promise, value) {
                                promise._state === PENDING && (promise._result = value, promise._state = FULFILLED, 
                                0 !== promise._subscribers.length && asap(publish, promise));
                            }
                            function _reject(promise, reason) {
                                promise._state === PENDING && (promise._state = REJECTED, promise._result = reason, 
                                asap(publishRejection, promise));
                            }
                            function subscribe(parent, child, onFulfillment, onRejection) {
                                var _subscribers = parent._subscribers, length = _subscribers.length;
                                parent._onerror = null, _subscribers[length] = child, _subscribers[length + FULFILLED] = onFulfillment, 
                                _subscribers[length + REJECTED] = onRejection, 0 === length && parent._state && asap(publish, parent);
                            }
                            function publish(promise) {
                                var subscribers = promise._subscribers, settled = promise._state;
                                if (0 !== subscribers.length) {
                                    for (var child = void 0, callback = void 0, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
                                    callback = subscribers[i + settled], child ? invokeCallback(settled, child, callback, detail) : callback(detail);
                                    promise._subscribers.length = 0;
                                }
                            }
                            function ErrorObject() {
                                this.error = null;
                            }
                            function tryCatch(callback, detail) {
                                try {
                                    return callback(detail);
                                } catch (e) {
                                    return TRY_CATCH_ERROR.error = e, TRY_CATCH_ERROR;
                                }
                            }
                            function invokeCallback(settled, promise, callback, detail) {
                                var hasCallback = isFunction(callback), value = void 0, error = void 0, succeeded = void 0, failed = void 0;
                                if (hasCallback) {
                                    if (value = tryCatch(callback, detail), value === TRY_CATCH_ERROR ? (failed = !0, 
                                    error = value.error, value.error = null) : succeeded = !0, promise === value) return void _reject(promise, cannotReturnOwn());
                                } else value = detail, succeeded = !0;
                                promise._state !== PENDING || (hasCallback && succeeded ? _resolve(promise, value) : failed ? _reject(promise, error) : settled === FULFILLED ? fulfill(promise, value) : settled === REJECTED && _reject(promise, value));
                            }
                            function initializePromise(promise, resolver) {
                                try {
                                    resolver(function(value) {
                                        _resolve(promise, value);
                                    }, function(reason) {
                                        _reject(promise, reason);
                                    });
                                } catch (e) {
                                    _reject(promise, e);
                                }
                            }
                            function nextId() {
                                return id++;
                            }
                            function makePromise(promise) {
                                promise[PROMISE_ID] = id++, promise._state = void 0, promise._result = void 0, promise._subscribers = [];
                            }
                            function Enumerator(Constructor, input) {
                                this._instanceConstructor = Constructor, this.promise = new Constructor(noop), this.promise[PROMISE_ID] || makePromise(this.promise), 
                                isArray(input) ? (this._input = input, this.length = input.length, this._remaining = input.length, 
                                this._result = new Array(this.length), 0 === this.length ? fulfill(this.promise, this._result) : (this.length = this.length || 0, 
                                this._enumerate(), 0 === this._remaining && fulfill(this.promise, this._result))) : _reject(this.promise, validationError());
                            }
                            function validationError() {
                                return new Error("Array Methods must be provided an Array");
                            }
                            function all(entries) {
                                return new Enumerator(this, entries).promise;
                            }
                            function race(entries) {
                                var Constructor = this;
                                return new Constructor(isArray(entries) ? function(resolve, reject) {
                                    for (var length = entries.length, i = 0; i < length; i++) Constructor.resolve(entries[i]).then(resolve, reject);
                                } : function(_, reject) {
                                    return reject(new TypeError("You must pass an array to race."));
                                });
                            }
                            function reject(reason) {
                                var Constructor = this, promise = new Constructor(noop);
                                return _reject(promise, reason), promise;
                            }
                            function needsResolver() {
                                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                            }
                            function needsNew() {
                                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                            }
                            function Promise(resolver) {
                                this[PROMISE_ID] = nextId(), this._result = this._state = void 0, this._subscribers = [], 
                                noop !== resolver && ("function" != typeof resolver && needsResolver(), this instanceof Promise ? initializePromise(this, resolver) : needsNew());
                            }
                            function polyfill() {
                                var local = void 0;
                                if (void 0 !== global) local = global; else if ("undefined" != typeof self) local = self; else try {
                                    local = Function("return this")();
                                } catch (e) {
                                    throw new Error("polyfill failed because global object is unavailable in this environment");
                                }
                                var P = local.Promise;
                                if (P) {
                                    var promiseToString = null;
                                    try {
                                        promiseToString = Object.prototype.toString.call(P.resolve());
                                    } catch (e) {}
                                    if ("[object Promise]" === promiseToString && !P.cast) return;
                                }
                                local.Promise = Promise;
                            }
                            var _isArray = void 0;
                            _isArray = Array.isArray ? Array.isArray : function(x) {
                                return "[object Array]" === Object.prototype.toString.call(x);
                            };
                            var isArray = _isArray, len = 0, vertxNext = void 0, customSchedulerFn = void 0, asap = function(callback, arg) {
                                queue[len] = callback, queue[len + 1] = arg, 2 === (len += 2) && (customSchedulerFn ? customSchedulerFn(flush) : scheduleFlush());
                            }, browserWindow = "undefined" != typeof window ? window : void 0, browserGlobal = browserWindow || {}, BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver, isNode = "undefined" == typeof self && void 0 !== process && "[object process]" === {}.toString.call(process), isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, queue = new Array(1e3), scheduleFlush = void 0;
                            scheduleFlush = isNode ? function() {
                                return function() {
                                    return process.nextTick(flush);
                                };
                            }() : BrowserMutationObserver ? function() {
                                var iterations = 0, observer = new BrowserMutationObserver(flush), node = document.createTextNode("");
                                return observer.observe(node, {
                                    characterData: !0
                                }), function() {
                                    node.data = iterations = ++iterations % 2;
                                };
                            }() : isWorker ? function() {
                                var channel = new MessageChannel();
                                return channel.port1.onmessage = flush, function() {
                                    return channel.port2.postMessage(0);
                                };
                            }() : void 0 === browserWindow ? function() {
                                try {
                                    var vertx = __webpack_require__(26);
                                    return vertxNext = vertx.runOnLoop || vertx.runOnContext, useVertxTimer();
                                } catch (e) {
                                    return useSetTimeout();
                                }
                            }() : useSetTimeout();
                            var PROMISE_ID = Math.random().toString(36).substring(16), PENDING = void 0, FULFILLED = 1, REJECTED = 2, GET_THEN_ERROR = new ErrorObject(), TRY_CATCH_ERROR = new ErrorObject(), id = 0;
                            return Enumerator.prototype._enumerate = function() {
                                for (var length = this.length, _input = this._input, i = 0; this._state === PENDING && i < length; i++) this._eachEntry(_input[i], i);
                            }, Enumerator.prototype._eachEntry = function(entry, i) {
                                var c = this._instanceConstructor, resolve$$ = c.resolve;
                                if (resolve$$ === resolve) {
                                    var _then = getThen(entry);
                                    if (_then === then && entry._state !== PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" != typeof _then) this._remaining--, 
                                    this._result[i] = entry; else if (c === Promise) {
                                        var promise = new c(noop);
                                        handleMaybeThenable(promise, entry, _then), this._willSettleAt(promise, i);
                                    } else this._willSettleAt(new c(function(resolve$$) {
                                        return resolve$$(entry);
                                    }), i);
                                } else this._willSettleAt(resolve$$(entry), i);
                            }, Enumerator.prototype._settledAt = function(state, i, value) {
                                var promise = this.promise;
                                promise._state === PENDING && (this._remaining--, state === REJECTED ? _reject(promise, value) : this._result[i] = value), 
                                0 === this._remaining && fulfill(promise, this._result);
                            }, Enumerator.prototype._willSettleAt = function(promise, i) {
                                var enumerator = this;
                                subscribe(promise, void 0, function(value) {
                                    return enumerator._settledAt(FULFILLED, i, value);
                                }, function(reason) {
                                    return enumerator._settledAt(REJECTED, i, reason);
                                });
                            }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, 
                            Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, 
                            Promise.prototype = {
                                constructor: Promise,
                                then: then,
                                catch: function(onRejection) {
                                    return this.then(null, onRejection);
                                }
                            }, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
                        });
                    }).call(exports, __webpack_require__(14), __webpack_require__(1));
                }, function(module, exports, __webpack_require__) {
                    var g, _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    g = function() {
                        return this;
                    }();
                    try {
                        g = g || Function("return this")() || (0, eval)("this");
                    } catch (e) {
                        "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)) && (g = window);
                    }
                    module.exports = g;
                }, function(module, exports, __webpack_require__) {
                    module.exports = function() {
                        function add(key, callback) {
                            var callbacksForKey = callbacks[key];
                            return callbacksForKey || (callbacksForKey = [], callbacks[key] = callbacksForKey), 
                            callbacksForKey.push(callback), function() {
                                var allForKey = callbacks[key];
                                allForKey = allForKey.filter(function(item) {
                                    return item !== callback;
                                }), callbacks[key] = allForKey;
                            };
                        }
                        function execute(key) {
                            var callbacksForKey = callbacks[key];
                            if (!callbacksForKey || 0 === callbacksForKey.length) return [];
                            var args = [].splice.call(arguments, 1), results = [];
                            return callbacksForKey.forEach(function(callback) {
                                try {
                                    var result = callback.apply(void 0, args);
                                    results.push(result);
                                } catch (err) {
                                    results.push(void 0);
                                }
                            }), results;
                        }
                        var callbacks = {};
                        return {
                            add: add,
                            execute: execute
                        };
                    };
                }, function(module, exports, __webpack_require__) {
                    function reset() {
                        shuffled = !1;
                    }
                    function setCharacters(_alphabet_) {
                        if (!_alphabet_) return void (alphabet !== ORIGINAL && (alphabet = ORIGINAL, reset()));
                        if (_alphabet_ !== alphabet) {
                            if (_alphabet_.length !== ORIGINAL.length) throw new Error("Custom alphabet for shortid must be " + ORIGINAL.length + " unique characters. You submitted " + _alphabet_.length + " characters: " + _alphabet_);
                            var unique = _alphabet_.split("").filter(function(item, ind, arr) {
                                return ind !== arr.lastIndexOf(item);
                            });
                            if (unique.length) throw new Error("Custom alphabet for shortid must be " + ORIGINAL.length + " unique characters. These characters were not unique: " + unique.join(", "));
                            alphabet = _alphabet_, reset();
                        }
                    }
                    function characters(_alphabet_) {
                        return setCharacters(_alphabet_), alphabet;
                    }
                    function setSeed(seed) {
                        randomFromSeed.seed(seed), previousSeed !== seed && (reset(), previousSeed = seed);
                    }
                    function shuffle() {
                        alphabet || setCharacters(ORIGINAL);
                        for (var characterIndex, sourceArray = alphabet.split(""), targetArray = [], r = randomFromSeed.nextValue(); sourceArray.length > 0; ) r = randomFromSeed.nextValue(), 
                        characterIndex = Math.floor(r * sourceArray.length), targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
                        return targetArray.join("");
                    }
                    function getShuffled() {
                        return shuffled || (shuffled = shuffle());
                    }
                    function lookup(index) {
                        return getShuffled()[index];
                    }
                    var alphabet, previousSeed, shuffled, randomFromSeed = __webpack_require__(21), ORIGINAL = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
                    module.exports = {
                        characters: characters,
                        seed: setSeed,
                        lookup: lookup,
                        shuffled: getShuffled
                    };
                }, function(module, exports, __webpack_require__) {
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var CallbackFactory = __webpack_require__(2), ConnectionImpl = (__webpack_require__(5), 
                    function() {
                        function ConnectionImpl(settings) {
                            this.messageHandlers = {}, this.ids = 1, this.registry = CallbackFactory(), this._connected = !1, 
                            this._settings = settings;
                        }
                        return ConnectionImpl.prototype.init = function(transport, protocol) {
                            this._transport = transport, this._protocol = protocol, transport.onConnectedChanged(this.handleConnectionChanged.bind(this)), 
                            transport.onMessage(this.handleTransportMessage.bind(this));
                        }, ConnectionImpl.prototype.send = function(product, type, message, id) {
                            var msg = this._protocol.createMessage(product, type, message, id);
                            this._transport.send(msg, product, type);
                        }, ConnectionImpl.prototype.on = function(product, type, messageHandler) {
                            type = type.toLowerCase(), void 0 === this.messageHandlers[type] && (this.messageHandlers[type] = {});
                            var id = this.ids++;
                            return this.messageHandlers[type][id] = messageHandler, {
                                type: type,
                                id: id
                            };
                        }, ConnectionImpl.prototype.off = function(info) {
                            delete this.messageHandlers[info.type.toLowerCase()][info.id];
                        }, Object.defineProperty(ConnectionImpl.prototype, "isConnected", {
                            get: function() {
                                return this._connected;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), ConnectionImpl.prototype.connected = function(callback) {
                            return this._connected && callback(this._settings.ws || this._settings.http), this.registry.add("connected", callback);
                        }, ConnectionImpl.prototype.disconnected = function(callback) {
                            this.registry.add("disconnected", callback);
                        }, ConnectionImpl.prototype.login = function(authRequest) {
                            return this._protocol.login(authRequest);
                        }, ConnectionImpl.prototype.logout = function() {
                            this._protocol.logout(), this._transport.close();
                        }, ConnectionImpl.prototype.loggedIn = function(callback) {
                            this._protocol.loggedIn(callback);
                        }, Object.defineProperty(ConnectionImpl.prototype, "protocolVersion", {
                            get: function() {
                                return this._settings.protocolVersion || 1;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), Object.defineProperty(ConnectionImpl.prototype, "version", {
                            get: function() {
                                return this._settings.version;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), ConnectionImpl.prototype.toAPI = function() {
                            var that = this;
                            return {
                                send: that.send.bind(that),
                                on: that.on.bind(that),
                                off: that.off.bind(that),
                                login: that.login.bind(that),
                                logout: that.logout.bind(that),
                                loggedIn: that.loggedIn.bind(that),
                                connected: that.connected.bind(that),
                                disconnected: that.disconnected.bind(that),
                                get protocolVersion() {
                                    return that.protocolVersion;
                                },
                                get version() {
                                    return that.version;
                                }
                            };
                        }, ConnectionImpl.prototype.distributeMessage = function(message, type) {
                            var handlers = this.messageHandlers[type.toLowerCase()];
                            void 0 !== handlers && Object.keys(handlers).forEach(function(handlerId) {
                                var handler = handlers[handlerId];
                                void 0 !== handler && handler(message);
                            });
                        }, ConnectionImpl.prototype.handleConnectionChanged = function(connected) {
                            this._connected !== connected && (this._connected = connected, connected ? this.registry.execute("connected") : this.registry.execute("disconnected"));
                        }, ConnectionImpl.prototype.handleTransportMessage = function(msg) {
                            var msgObj = this._protocol.processMessage(msg);
                            this.distributeMessage(msgObj.msg, msgObj.msgType);
                        }, ConnectionImpl;
                    }());
                    exports.default = ConnectionImpl;
                }, function(module, exports) {
                    module.exports = {
                        name: "tick42-gateway-connection",
                        version: "2.2.7",
                        description: "Tick42 Gateway Connection.",
                        precommit: "tslint",
                        main: "dist/node/tick42-gateway-connection.js",
                        browser: "dist/web/tick42-gateway-connection.js",
                        types: "types/index.d.ts",
                        scripts: {
                            clean: "node ./build/scripts/clean.js",
                            "pre:build": "tsc && set NODE_ENV=development && npm run clean",
                            "file-versionify": "node ./build/scripts/file-versionify.js",
                            tslint: "tslint -t codeFrame ./src/main.ts",
                            "tslint:fix": "tslint -t codeFrame --fix ./src/main.ts",
                            watch: "onchange ./src/**/*.ts -- npm run build:dev",
                            "build:dev": "npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify && npm run types",
                            "build:prod": "npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify && npm run types",
                            docs: "typedoc --options typedoc.json ./src",
                            types: "node ./build/scripts/copy-types.js",
                            "types:merged": "dts-generator --project ./ --out ./types/index.d.ts",
                            prepublish: "npm run build:prod"
                        },
                        devDependencies: {
                            "@types/es6-promise": "0.0.32",
                            "@types/shortid": "0.0.28",
                            "@types/tick42-logger": "^3.0.0",
                            "babel-core": "^6.17.0",
                            "babel-loader": "^6.4.1",
                            "babel-plugin-add-module-exports": "^0.2.1",
                            "babel-plugin-es6-promise": "^1.0.0",
                            "babel-preset-es2015": "^6.16.0",
                            "babel-preset-stage-2": "^6.22.0",
                            "dts-generator": "^2.1.0",
                            "es6-promise": "^4.1.0",
                            onchange: "3.*",
                            "pre-commit": "^1.1.3",
                            shelljs: "^0.6.0",
                            "tick42-webpack-config": "4.1.1",
                            tslint: "5.*",
                            typedoc: "^0.5.10",
                            typescript: "2.3.0",
                            webpack: "2.3.3"
                        },
                        dependencies: {
                            "callback-registry": "2.2.5",
                            shortid: "^2.2.6",
                            ws: "^0.7.2"
                        }
                    };
                }, function(module, exports, __webpack_require__) {
                    function encode(lookup, number) {
                        for (var done, loopCounter = 0, str = ""; !done; ) str += lookup(number >> 4 * loopCounter & 15 | randomByte()), 
                        done = number < Math.pow(16, loopCounter + 1), loopCounter++;
                        return str;
                    }
                    var randomByte = __webpack_require__(20);
                    module.exports = encode;
                }, function(module, exports, __webpack_require__) {
                    var __extends = function() {
                        var extendStatics = Object.setPrototypeOf || {
                            __proto__: []
                        } instanceof Array && function(d, b) {
                            d.__proto__ = b;
                        } || function(d, b) {
                            for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
                        };
                        return function(d, b) {
                            function __() {
                                this.constructor = d;
                            }
                            extendStatics(d, b), d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, 
                            new __());
                        };
                    }();
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var connection_1 = __webpack_require__(4), GW3ConnectionImpl = function(_super) {
                        function GW3ConnectionImpl(settings) {
                            return _super.call(this, settings) || this;
                        }
                        return __extends(GW3ConnectionImpl, _super), GW3ConnectionImpl.prototype.init = function(transport, protocol) {
                            _super.prototype.init.call(this, transport, protocol), this.gw3Protocol = protocol;
                        }, GW3ConnectionImpl.prototype.toAPI = function() {
                            var that = this, superAPI = _super.prototype.toAPI.call(this);
                            return {
                                domain: that.domain.bind(that),
                                get peerId() {
                                    return that.peerId;
                                },
                                get token() {
                                    return that.token;
                                },
                                get info() {
                                    return that.info;
                                },
                                get resolvedIdentity() {
                                    return that.resolvedIdentity;
                                },
                                get availableDomains() {
                                    return that.availableDomains;
                                },
                                on: superAPI.on,
                                send: superAPI.send,
                                off: superAPI.off,
                                login: superAPI.login,
                                logout: superAPI.logout,
                                loggedIn: superAPI.loggedIn,
                                connected: superAPI.connected,
                                disconnected: superAPI.disconnected,
                                get protocolVersion() {
                                    return superAPI.protocolVersion;
                                },
                                get version() {
                                    return superAPI.version;
                                }
                            };
                        }, GW3ConnectionImpl.prototype.domain = function(domain, logger) {
                            return this.gw3Protocol.domain(domain, logger);
                        }, GW3ConnectionImpl;
                    }(connection_1.default);
                    exports.default = GW3ConnectionImpl;
                }, function(module, exports, __webpack_require__) {
                    var _Promise = void 0 === _Promise2 ? __webpack_require__(0).Promise : _Promise2;
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var GW1Protocol = function() {
                        function GW1Protocol() {}
                        return GW1Protocol.prototype.processMessage = function(message) {
                            var messageObj = JSON.parse(message);
                            return {
                                msg: messageObj.message,
                                msgType: messageObj.type
                            };
                        }, GW1Protocol.prototype.createMessage = function(product, type, message, id) {
                            return JSON.stringify({
                                type: type,
                                message: message,
                                id: id
                            });
                        }, GW1Protocol.prototype.login = function(message) {
                            return _Promise.resolve({});
                        }, GW1Protocol.prototype.logout = function() {}, GW1Protocol.prototype.loggedIn = function(callback) {
                            callback();
                        }, GW1Protocol;
                    }();
                    exports.default = GW1Protocol;
                }, function(module, exports, __webpack_require__) {
                    var _Promise = void 0 === _Promise2 ? __webpack_require__(0).Promise : _Promise2;
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var GW2Protocol = function() {
                        function GW2Protocol(connection) {
                            this.connection = connection;
                        }
                        return GW2Protocol.prototype.processMessage = function(message) {
                            var messageObj = JSON.parse(message);
                            return "SEND" === messageObj.type ? {
                                msg: messageObj.data.message,
                                msgType: messageObj.data.type
                            } : {
                                msg: messageObj,
                                msgType: messageObj.type
                            };
                        }, GW2Protocol.prototype.createMessage = function(product, type, message, id) {
                            return "LOGIN" === type ? JSON.stringify(message) : "LOGOUT" === type ? JSON.stringify({
                                type: "LOGOUT"
                            }) : JSON.stringify({
                                type: "SEND",
                                sessionCookie: this.sessionCookie,
                                data: {
                                    type: type,
                                    message: message,
                                    id: id
                                }
                            });
                        }, GW2Protocol.prototype.login = function(message) {
                            var _this = this;
                            return new _Promise(function(resolve, reject) {
                                var request;
                                if (message.token) request = {
                                    token: message.token,
                                    type: "LOGIN_TOKEN"
                                }; else {
                                    if (!message.username) throw new Error("Invalid auth message" + JSON.stringify(message));
                                    request = {
                                        user: message.username,
                                        password: message.password,
                                        type: "LOGIN"
                                    };
                                }
                                var lrSubs = _this.connection.on("", "LOGIN_RESPONSE", function(response) {
                                    _this.connection.off(lrSubs), response && !response.errorMessage ? (_this.sessionCookie = response.sessionCookie, 
                                    resolve(response)) : reject(response);
                                });
                                _this.connection.send("", "LOGIN", request);
                            });
                        }, GW2Protocol.prototype.logout = function() {
                            this.connection.send("", "LOGOUT", {});
                        }, GW2Protocol.prototype.loggedIn = function(callback) {
                            callback();
                        }, GW2Protocol;
                    }();
                    exports.default = GW2Protocol;
                }, function(module, exports, __webpack_require__) {
                    function default_1(connection, settings, logger) {
                        function processMessage(message) {
                            var msg = JSON.parse(message, function(key, value) {
                                if ("string" != typeof value) return value;
                                if (value.length < dateMinLen) return value;
                                if (value[0] !== datePrefixFirstChar) return value;
                                try {
                                    var milliseconds = parseInt(value.substring(datePrefixLen, value.length), 10);
                                    return isNaN(milliseconds) ? value : new Date(milliseconds);
                                } catch (ex) {
                                    return value;
                                }
                            });
                            return {
                                msg: msg,
                                msgType: msg.type
                            };
                        }
                        function createMessage(product, type, message, id) {
                            var oldToJson = Date.prototype.toJSON;
                            Date.prototype.toJSON = function() {
                                return datePrefix + this.getTime();
                            };
                            var result = JSON.stringify(message);
                            return Date.prototype.toJSON = oldToJson, result;
                        }
                        function login(config) {
                            return logger.debug("logging in..."), loginConfig = config, shouldTryLogin = !0, 
                            new _Promise(function(resolve, reject) {
                                var authentication = {}, gwToken = getGatewayToken();
                                if (gwToken) authentication.method = "gateway-token", authentication.token = gwToken; else if (config.token) authentication.method = "access-token", 
                                authentication.token = config.token; else {
                                    if (!config.username) throw new Error("invalid auth message" + JSON.stringify(config));
                                    authentication.method = "secret", authentication.login = config.username, authentication.secret = config.password;
                                }
                                var helloMsg = {
                                    type: "hello",
                                    identity: settings.identity,
                                    authentication: authentication
                                };
                                gw3Domain_1.default("global", connection, logger).send(helloMsg).then(function(msg) {
                                    logger.debug("login successful with PeerId " + msg.peer_id), connection.peerId = msg.peer_id, 
                                    connection.resolvedIdentity = msg.resolved_identity, connection.availableDomains = msg.available_domains, 
                                    msg.options && (connection.token = msg.options.access_token, connection.info = msg.options.info), 
                                    setLoggedIn(!0), resolve(msg.resolved_identity);
                                }).catch(function(err) {
                                    reject(err);
                                });
                            });
                        }
                        function logout() {
                            logger.debug("logging out..."), shouldTryLogin = !1, sessions.forEach(function(session) {
                                session.leave();
                            });
                        }
                        function loggedIn(callback) {
                            return isLoggedIn && callback(), registry.add("onLoggedIn", callback);
                        }
                        function domain(domain, domainLogger) {
                            var session = gw3Domain_1.default(domain, connection, domainLogger);
                            return sessions.push(session), session;
                        }
                        function getGatewayToken() {
                            if (settings.gwTokenProvider) return settings.gwTokenProvider.get();
                            if ("undefined" != typeof location && location.search) {
                                return new URLSearchParams(location.search.slice(1)).get("t42gwtoken");
                            }
                            return null;
                        }
                        function handleDisconnected() {
                            setLoggedIn(!1), logger.debug("disconnected - will try new login?" + shouldTryLogin), 
                            shouldTryLogin && connection.login(loginConfig).catch(function() {
                                setTimeout(handleDisconnected, 1e3);
                            });
                        }
                        function setLoggedIn(value) {
                            (isLoggedIn = value) && registry.execute("onLoggedIn");
                        }
                        function ping() {
                            isLoggedIn && connection.send("", "", {
                                type: "ping"
                            }), setTimeout(ping, 3e4);
                        }
                        var loginConfig, datePrefix = "#T42_DATE#", datePrefixLen = datePrefix.length, dateMinLen = datePrefixLen + 1, datePrefixFirstChar = datePrefix[0], registry = CallbackRegistryFactory(), isLoggedIn = !1, shouldTryLogin = !0, sessions = [];
                        return connection.disconnected(handleDisconnected.bind(this)), ping(), {
                            processMessage: processMessage,
                            createMessage: createMessage,
                            login: login,
                            logout: logout,
                            loggedIn: loggedIn,
                            domain: domain
                        };
                    }
                    var _Promise = void 0 === _Promise2 ? __webpack_require__(0).Promise : _Promise2;
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var gw3Domain_1 = __webpack_require__(25), CallbackRegistryFactory = __webpack_require__(2);
                    exports.default = default_1;
                }, function(module, exports, __webpack_require__) {
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var es6_promise_1 = __webpack_require__(0), HCProtocol = function() {
                        function HCProtocol() {}
                        return HCProtocol.prototype.processMessage = function(message) {
                            var messageObj = JSON.parse(message);
                            return {
                                msg: messageObj,
                                msgType: messageObj.type
                            };
                        }, HCProtocol.prototype.createMessage = function(product, type, message, id) {
                            return JSON.stringify(message);
                        }, HCProtocol.prototype.login = function(message) {
                            return es6_promise_1.Promise.resolve({});
                        }, HCProtocol.prototype.logout = function() {}, HCProtocol.prototype.loggedIn = function(callback) {
                            callback();
                        }, HCProtocol;
                    }();
                    exports.default = HCProtocol;
                }, function(module, exports, __webpack_require__) {
                    (function(global) {
                        Object.defineProperty(exports, "__esModule", {
                            value: !0
                        });
                        var HCTransport = function() {
                            function HCTransport() {
                                this.connectionId = Math.floor(1e10 * Math.random()).toString();
                            }
                            return HCTransport.prototype.send = function(message, product, type) {
                                "metrics" === product ? global.htmlContainer.metricsFacade.send(type, message) : "log" === product && global.htmlContainer.loggingFacade.send(type, message);
                            }, HCTransport.prototype.onConnectedChanged = function(callback) {
                                callback(!0);
                            }, HCTransport.prototype.onMessage = function(callback) {}, HCTransport.prototype.close = function() {}, 
                            HCTransport;
                        }();
                        exports.default = HCTransport;
                    }).call(exports, __webpack_require__(1));
                }, function(module, exports, __webpack_require__) {
                    (function(global) {
                        function default_1(settings, logger) {
                            function onMessage(callback) {
                                return registry.add("onMessage", callback);
                            }
                            function send(msg) {
                                waitForSocketConnection(function() {
                                    ws.send(msg);
                                });
                            }
                            function close() {
                                shouldTryConnecting = !1, ws.close();
                            }
                            function onConnectedChanged(callback) {
                                return registry.add("onConnectedChanged", callback);
                            }
                            function initiateSocket() {
                                logger.debug("initiating ws..."), ws = new WebSocket(settings.ws), ws.onclose = function() {
                                    logger.debug("ws closed"), registry.execute("onConnectedChanged", !1);
                                }, ws.onopen = function() {
                                    logger.debug("ws opened"), registry.execute("onConnectedChanged", !0);
                                }, ws.onmessage = function(message) {
                                    registry.execute("onMessage", message.data);
                                };
                            }
                            function waitForSocketConnection(callback) {
                                if (callback || (callback = function() {}), shouldTryConnecting) {
                                    if (!ws || ws.readyState > 1) initiateSocket(); else if (1 === ws.readyState) return callback();
                                    setTimeout(function() {
                                        waitForSocketConnection(callback);
                                    }, settings.reconnectInterval);
                                }
                            }
                            var ws, shouldTryConnecting = !0, registry = CallbackRegistryFactory();
                            return waitForSocketConnection(void 0), {
                                onMessage: onMessage,
                                send: send,
                                onConnectedChanged: onConnectedChanged,
                                close: close
                            };
                        }
                        Object.defineProperty(exports, "__esModule", {
                            value: !0
                        });
                        var CallbackRegistryFactory = __webpack_require__(2), WebSocket = function() {
                            try {
                                return "[object process]" === Object.prototype.toString.call(global.process);
                            } catch (e) {
                                return !1;
                            }
                        }() ? __webpack_require__(23) : global.WebSocket;
                        exports.default = default_1;
                    }).call(exports, __webpack_require__(1));
                }, function(module, exports, __webpack_require__) {
                    function defaultSetTimout() {
                        throw new Error("setTimeout has not been defined");
                    }
                    function defaultClearTimeout() {
                        throw new Error("clearTimeout has not been defined");
                    }
                    function runTimeout(fun) {
                        if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
                        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
                        setTimeout(fun, 0);
                        try {
                            return cachedSetTimeout(fun, 0);
                        } catch (e) {
                            try {
                                return cachedSetTimeout.call(null, fun, 0);
                            } catch (e) {
                                return cachedSetTimeout.call(this, fun, 0);
                            }
                        }
                    }
                    function runClearTimeout(marker) {
                        if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
                        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
                        clearTimeout(marker);
                        try {
                            return cachedClearTimeout(marker);
                        } catch (e) {
                            try {
                                return cachedClearTimeout.call(null, marker);
                            } catch (e) {
                                return cachedClearTimeout.call(this, marker);
                            }
                        }
                    }
                    function cleanUpNextTick() {
                        draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
                        queue.length && drainQueue());
                    }
                    function drainQueue() {
                        if (!draining) {
                            var timeout = runTimeout(cleanUpNextTick);
                            draining = !0;
                            for (var len = queue.length; len; ) {
                                for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                                queueIndex = -1, len = queue.length;
                            }
                            currentQueue = null, draining = !1, runClearTimeout(timeout);
                        }
                    }
                    function Item(fun, array) {
                        this.fun = fun, this.array = array;
                    }
                    function noop() {}
                    var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
                    !function() {
                        try {
                            cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
                        } catch (e) {
                            cachedSetTimeout = defaultSetTimout;
                        }
                        try {
                            cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
                        } catch (e) {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    }();
                    var currentQueue, queue = [], draining = !1, queueIndex = -1;
                    process.nextTick = function(fun) {
                        var args = new Array(arguments.length - 1);
                        if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
                        queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
                    }, Item.prototype.run = function() {
                        this.fun.apply(null, this.array);
                    }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
                    process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
                    process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
                    process.emit = noop, process.binding = function(name) {
                        throw new Error("process.binding is not supported");
                    }, process.cwd = function() {
                        return "/";
                    }, process.chdir = function(dir) {
                        throw new Error("process.chdir is not supported");
                    }, process.umask = function() {
                        return 0;
                    };
                }, function(module, exports, __webpack_require__) {
                    module.exports = __webpack_require__(18);
                }, function(module, exports, __webpack_require__) {
                    function build(clusterWorkerId) {
                        var str = "", seconds = Math.floor(.001 * (Date.now() - REDUCE_TIME));
                        return seconds === previousSeconds ? counter++ : (counter = 0, previousSeconds = seconds), 
                        str += encode(alphabet.lookup, version), str += encode(alphabet.lookup, clusterWorkerId), 
                        counter > 0 && (str += encode(alphabet.lookup, counter)), str += encode(alphabet.lookup, seconds);
                    }
                    var counter, previousSeconds, encode = __webpack_require__(6), alphabet = __webpack_require__(3), REDUCE_TIME = 1459707606518, version = 6;
                    module.exports = build;
                }, function(module, exports, __webpack_require__) {
                    function decode(id) {
                        var characters = alphabet.shuffled();
                        return {
                            version: 15 & characters.indexOf(id.substr(0, 1)),
                            worker: 15 & characters.indexOf(id.substr(1, 1))
                        };
                    }
                    var alphabet = __webpack_require__(3);
                    module.exports = decode;
                }, function(module, exports, __webpack_require__) {
                    function seed(seedValue) {
                        return alphabet.seed(seedValue), module.exports;
                    }
                    function worker(workerId) {
                        return clusterWorkerId = workerId, module.exports;
                    }
                    function characters(newCharacters) {
                        return void 0 !== newCharacters && alphabet.characters(newCharacters), alphabet.shuffled();
                    }
                    function generate() {
                        return build(clusterWorkerId);
                    }
                    var alphabet = __webpack_require__(3), decode = (__webpack_require__(6), __webpack_require__(17)), build = __webpack_require__(16), isValid = __webpack_require__(19), clusterWorkerId = __webpack_require__(22) || 0;
                    module.exports = generate, module.exports.generate = generate, module.exports.seed = seed, 
                    module.exports.worker = worker, module.exports.characters = characters, module.exports.decode = decode, 
                    module.exports.isValid = isValid;
                }, function(module, exports, __webpack_require__) {
                    function isShortId(id) {
                        if (!id || "string" != typeof id || id.length < 6) return !1;
                        for (var characters = alphabet.characters(), len = id.length, i = 0; i < len; i++) if (-1 === characters.indexOf(id[i])) return !1;
                        return !0;
                    }
                    var alphabet = __webpack_require__(3);
                    module.exports = isShortId;
                }, function(module, exports, __webpack_require__) {
                    function randomByte() {
                        if (!crypto || !crypto.getRandomValues) return 48 & Math.floor(256 * Math.random());
                        var dest = new Uint8Array(1);
                        return crypto.getRandomValues(dest), 48 & dest[0];
                    }
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    }, crypto = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)) && (window.crypto || window.msCrypto);
                    module.exports = randomByte;
                }, function(module, exports, __webpack_require__) {
                    function getNextValue() {
                        return (seed = (9301 * seed + 49297) % 233280) / 233280;
                    }
                    function setSeed(_seed_) {
                        seed = _seed_;
                    }
                    var seed = 1;
                    module.exports = {
                        nextValue: getNextValue,
                        seed: setSeed
                    };
                }, function(module, exports, __webpack_require__) {
                    module.exports = 0;
                }, function(module, exports, __webpack_require__) {
                    function ws(uri, protocols, opts) {
                        return protocols ? new WebSocket(uri, protocols) : new WebSocket(uri);
                    }
                    var global = function() {
                        return this;
                    }(), WebSocket = global.WebSocket || global.MozWebSocket;
                    module.exports = WebSocket ? ws : null, WebSocket && (ws.prototype = WebSocket.prototype);
                }, function(module, exports, __webpack_require__) {
                    (function(global) {
                        Object.defineProperty(exports, "__esModule", {
                            value: !0
                        });
                        var connection_1 = __webpack_require__(4), gw3_1 = __webpack_require__(10), hc_1 = __webpack_require__(11), ws_1 = __webpack_require__(13), gw3Connection_1 = __webpack_require__(7), gw1_1 = __webpack_require__(8), hc_2 = __webpack_require__(12), gw2_1 = __webpack_require__(9), PackageJson = __webpack_require__(5);
                        exports.default = function(settings) {
                            settings = settings || {}, settings.version = PackageJson.version;
                            var connection = new connection_1.default(settings), logger = settings.logger, protocol = new hc_1.default(), transport = new hc_2.default();
                            if (void 0 === global.htmlContainer) {
                                if (void 0 === settings.ws) throw new Error("No connection information specified");
                                if (transport = ws_1.default(settings, logger.subLogger("ws")), 3 === settings.protocolVersion) {
                                    var gw3Connection = new gw3Connection_1.default(settings), gw3Prot = gw3_1.default(gw3Connection, settings, logger.subLogger("gw3"));
                                    return gw3Connection.init(transport, gw3Prot), gw3Connection.toAPI();
                                }
                                protocol = 2 === settings.protocolVersion ? new gw2_1.default(connection) : new gw1_1.default();
                            }
                            return connection.init(transport, protocol), connection.toAPI();
                        };
                    }).call(exports, __webpack_require__(1));
                }, function(module, exports, __webpack_require__) {
                    function default_1(domain, connection, logger) {
                        function join(options) {
                            return _latestOptions = options, new _Promise(function(resolve, reject) {
                                logger.debug("joining " + domain), send({
                                    type: "join",
                                    destination: domain,
                                    domain: "global",
                                    options: options
                                }).then(function() {
                                    handleJoined(), resolve();
                                }).catch(function(err) {
                                    logger.debug("error joining " + domain + " domain: " + JSON.stringify(err)), reject(err);
                                });
                            });
                        }
                        function leave() {
                            logger.debug("stopping session " + domain + "..."), send({
                                type: "leave",
                                destination: domain,
                                domain: "global"
                            }).then(function() {
                                isJoined = !1, callbacks.execute("onLeft");
                            });
                        }
                        function handleJoined() {
                            logger.debug("joined " + domain), isJoined = !0;
                            var wasReconnect = tryReconnecting;
                            tryReconnecting = !1, callbacks.execute("onJoined", wasReconnect);
                        }
                        function handleConnectionDisconnected() {
                            logger.warn("connection is down"), isJoined = !1, tryReconnecting = !0, callbacks.execute("onLeft", {
                                disconnected: !0
                            });
                        }
                        function handleConnectionLoggedIn() {
                            tryReconnecting && (logger.info("connection is now up - trying to reconnect..."), 
                            join(_latestOptions));
                        }
                        function onJoined(callback) {
                            return isJoined && callback(!1), callbacks.add("onJoined", callback);
                        }
                        function onLeft(callback) {
                            return isJoined || callback(), callbacks.add("onLeft", callback);
                        }
                        function handleErrorMessage(msg) {
                            if (domain === msg.domain) {
                                var requestId = msg.request_id, entry = requestsMap[requestId];
                                entry && entry.error(msg);
                            }
                        }
                        function handleSuccessMessage(msg) {
                            if (msg.domain === domain) {
                                var requestId = msg.request_id, entry = requestsMap[requestId];
                                entry && entry.success(msg);
                            }
                        }
                        function getNextRequestId() {
                            return shortid_1.generate();
                        }
                        function send(msg, tag) {
                            msg.request_id = msg.request_id || getNextRequestId(), msg.domain = msg.domain || domain, 
                            msg.peer_id = connection.peerId;
                            var requestId = msg.request_id;
                            return new _Promise(function(resolve, reject) {
                                requestsMap[requestId] = {
                                    success: function(successMsg) {
                                        delete requestsMap[requestId], successMsg._tag = tag, resolve(successMsg);
                                    },
                                    error: function(errorMsg) {
                                        logger.warn("GW error - " + JSON.stringify(errorMsg) + " for request " + JSON.stringify(msg)), 
                                        delete requestsMap[requestId], errorMsg._tag = tag, reject(errorMsg);
                                    }
                                }, connection.send(domain, domain, msg);
                            });
                        }
                        function sendFireAndForget(msg) {
                            msg.request_id = msg.request_id ? msg.request_id : getNextRequestId(), msg.domain = msg.domain || domain, 
                            msg.peer_id = connection.peerId, connection.send(domain, domain, msg);
                        }
                        var _latestOptions, isJoined = !1, tryReconnecting = !1, callbacks = callbackRegistry();
                        connection.disconnected(handleConnectionDisconnected), connection.loggedIn(handleConnectionLoggedIn), 
                        connection.on(domain, "welcome", function(msg) {
                            return handleSuccessMessage(msg);
                        }), connection.on(domain, "error", function(msg) {
                            return handleErrorMessage(msg);
                        }), connection.on(domain, "success", function(msg) {
                            return handleSuccessMessage(msg);
                        }), connection.on(domain, "result", function(msg) {
                            return handleSuccessMessage(msg);
                        }), connection.on(domain, "subscribed", function(msg) {
                            return handleSuccessMessage(msg);
                        });
                        var requestsMap = {};
                        return {
                            join: join,
                            leave: leave,
                            onJoined: onJoined,
                            onLeft: onLeft,
                            send: send,
                            sendFireAndForget: sendFireAndForget,
                            on: function(type, callback) {
                                connection.on(domain, type, callback);
                            },
                            loggedIn: function(callback) {
                                return connection.loggedIn(callback);
                            },
                            connected: function(callback) {
                                return connection.connected(callback);
                            },
                            disconnected: function(callback) {
                                return connection.disconnected(callback);
                            },
                            get peerId() {
                                return connection.peerId;
                            }
                        };
                    }
                    var _Promise = void 0 === _Promise2 ? __webpack_require__(0).Promise : _Promise2;
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var callbackRegistry = __webpack_require__(2), shortid_1 = __webpack_require__(15);
                    exports.default = default_1;
                }, function(module, exports) {} ]);
            });
        }).call(exports, __webpack_require__(7)(module));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(module) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            !function(root, factory) {
                "object" === _typeof2(exports) && "object" === _typeof2(module) ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
                __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            }(0, function() {
                return function(modules) {
                    function __webpack_require__(moduleId) {
                        if (installedModules[moduleId]) return installedModules[moduleId].exports;
                        var module = installedModules[moduleId] = {
                            i: moduleId,
                            l: !1,
                            exports: {}
                        };
                        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
                        module.l = !0, module.exports;
                    }
                    var installedModules = {};
                    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
                    __webpack_require__.i = function(value) {
                        return value;
                    }, __webpack_require__.d = function(exports, name, getter) {
                        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                            configurable: !1,
                            enumerable: !0,
                            get: getter
                        });
                    }, __webpack_require__.n = function(module) {
                        var getter = module && module.__esModule ? function() {
                            return module.default;
                        } : function() {
                            return module;
                        };
                        return __webpack_require__.d(getter, "a", getter), getter;
                    }, __webpack_require__.o = function(object, property) {
                        return Object.prototype.hasOwnProperty.call(object, property);
                    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 3);
                }([ function(module, exports, __webpack_require__) {
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var levels_1 = __webpack_require__(2), LoggerImpl = function() {
                        function LoggerImpl(name, parent, metricSystem) {
                            this._subloggers = [], this._name = name, this._parent = parent, this._path = parent ? parent.path + "." + name : name, 
                            this._loggerFullName = "[" + this._path + "]", void 0 !== metricSystem && this.metricsLevel("warn", metricSystem.subSystem(name));
                        }
                        return Object.defineProperty(LoggerImpl.prototype, "name", {
                            get: function() {
                                return this._name;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), Object.defineProperty(LoggerImpl.prototype, "path", {
                            get: function() {
                                return this._path;
                            },
                            enumerable: !0,
                            configurable: !0
                        }), LoggerImpl.prototype.subLogger = function(name) {
                            var existingSub = this._subloggers.filter(function(subLogger) {
                                return subLogger.name === name;
                            })[0];
                            if (void 0 !== existingSub) return existingSub;
                            Object.keys(this).forEach(function(key) {
                                if (key === name) throw new Error("This sub logger name is not allowed.");
                            });
                            var sub = new LoggerImpl(name, this);
                            return this._subloggers.push(sub), sub;
                        }, LoggerImpl.prototype.publishLevel = function(level) {
                            return null !== level && void 0 !== level && (this._publishLevel = level), this._publishLevel || this._parent.publishLevel();
                        }, LoggerImpl.prototype.consoleLevel = function(level) {
                            return null !== level && void 0 !== level && (this._consoleLevel = level), this._consoleLevel || this._parent.consoleLevel();
                        }, LoggerImpl.prototype.metricsLevel = function(level, metricsSystem) {
                            if (null !== level && void 0 !== level && (this._metricLevel = level), void 0 !== metricsSystem) {
                                if ("object" !== (void 0 === metricsSystem ? "undefined" : _typeof(metricsSystem)) || "function" != typeof metricsSystem.objectMetric) throw new Error("Please specify metric system");
                                this._metricSystem = metricsSystem;
                            }
                            return this._metricLevel || this._parent.metricsLevel();
                        }, LoggerImpl.prototype.log = function(message, level) {
                            this.publishMessage(level || levels_1.default.info, message);
                        }, LoggerImpl.prototype.trace = function(message) {
                            this.log(message, levels_1.default.trace);
                        }, LoggerImpl.prototype.debug = function(message) {
                            this.log(message, levels_1.default.debug);
                        }, LoggerImpl.prototype.info = function(message) {
                            this.log(message, levels_1.default.info);
                        }, LoggerImpl.prototype.warn = function(message) {
                            this.log(message, levels_1.default.warn);
                        }, LoggerImpl.prototype.error = function(message) {
                            this.log(message, levels_1.default.error);
                        }, LoggerImpl.prototype.toAPIObject = function() {
                            var that = this;
                            return {
                                name: this.name,
                                subLogger: this.subLogger.bind(that),
                                publishLevel: this.publishLevel.bind(that),
                                consoleLevel: this.consoleLevel.bind(that),
                                metricsLevel: this.metricsLevel.bind(that),
                                log: this.log.bind(that),
                                trace: this.trace.bind(that),
                                debug: this.debug.bind(that),
                                info: this.info.bind(that),
                                warn: this.warn.bind(that),
                                error: this.error.bind(that)
                            };
                        }, LoggerImpl.prototype.publishMessage = function(level, message) {
                            var loggerName = this._loggerFullName;
                            if (level === levels_1.default.error) {
                                var e = new Error();
                                e.stack && (message = message + "\n" + e.stack.split("\n").slice(3).join("\n"));
                            }
                            if (levels_1.default.canPublish(level, this.consoleLevel())) {
                                var toPrint = loggerName + ": " + message;
                                switch (level) {
                                  case levels_1.default.trace:
                                    console.trace(toPrint);
                                    break;

                                  case levels_1.default.debug:
                                    console.debug(toPrint);
                                    break;

                                  case levels_1.default.info:
                                    console.info(toPrint);
                                    break;

                                  case levels_1.default.warn:
                                    console.warn(toPrint);
                                    break;

                                  case levels_1.default.error:
                                    console.error(toPrint);
                                }
                            }
                            levels_1.default.canPublish(level, this.publishLevel()) && LoggerImpl.GetConnection().send("log", "LogMessage", {
                                instance: LoggerImpl.Instance,
                                level: levels_1.default.order.indexOf(level),
                                logger: loggerName,
                                message: message
                            }), levels_1.default.canPublish(level, this.metricsLevel()) && void 0 !== this._metricSystem && (this._metricSystem.objectMetric("LogMessage", {
                                Level: level,
                                Logger: loggerName,
                                Message: message,
                                Time: new Date()
                            }), level === levels_1.default.error && this._metricSystem.setState(100, message));
                        }, LoggerImpl;
                    }();
                    exports.default = LoggerImpl;
                }, function(module, exports) {
                    module.exports = {
                        name: "tick42-logger",
                        version: "3.0.7",
                        description: "Glue library for logging",
                        main: "dist/node/tick42-logger.js",
                        browser: "dist/web/tick42-logger.js",
                        types: "./types/index.d.ts",
                        scripts: {
                            clean: "node ./build/scripts/clean.js",
                            "pre:build": "npm run tslint && tsc && set NODE_ENV=development && npm run clean",
                            "file-versionify": "node ./build/scripts/file-versionify.js",
                            tslint: "tslint -t codeFrame ./src/main.ts",
                            "tslint:fix": "tslint -t codeFrame --fix ./src/main.ts",
                            watch: "onchange ./src/**/*.ts -- npm run build:dev",
                            "build:dev": "npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify && npm run types",
                            "build:prod": "npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify && npm run types",
                            docs: "typedoc --options typedoc.json ./src",
                            types: "node ./build/scripts/copy-types.js",
                            prepublish: "npm run build:prod",
                            "types:merged": "dts-generator --project ./ --out ./types/index.d.ts"
                        },
                        repository: {
                            type: "git",
                            url: "https://stash.tick42.com:8443/scm/ofgw/js-logger.git"
                        },
                        author: "Tick42",
                        license: "ISC",
                        precommit: "tslint:fix",
                        devDependencies: {
                            "@types/tick42-gateway-connection": "^2.2.3",
                            "babel-core": "^6.17.0",
                            "babel-loader": "^6.4.1",
                            "babel-plugin-add-module-exports": "^0.2.1",
                            "babel-plugin-es6-promise": "^1.0.0",
                            "babel-preset-es2015": "^6.16.0",
                            "babel-preset-stage-2": "^6.22.0",
                            "dts-generator": "^2.1.0",
                            "es6-promise": "^4.1.0",
                            onchange: "3.*",
                            "pre-commit": "^1.1.3",
                            shelljs: "^0.6.0",
                            "tick42-webpack-config": "4.1.1",
                            tslint: "5.*",
                            typedoc: "^0.5.10",
                            typescript: "2.3.0",
                            webpack: "2.3.3"
                        }
                    };
                }, function(module, exports, __webpack_require__) {
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var LogLevel = function() {
                        function LogLevel() {}
                        return LogLevel.canPublish = function(level, restriction) {
                            return LogLevel.order.indexOf(level) >= LogLevel.order.indexOf(restriction);
                        }, LogLevel;
                    }();
                    LogLevel.off = "off", LogLevel.trace = "trace", LogLevel.debug = "debug", LogLevel.info = "info", 
                    LogLevel.warn = "warn", LogLevel.error = "error", LogLevel.order = [ LogLevel.trace, LogLevel.debug, LogLevel.info, LogLevel.warn, LogLevel.error, LogLevel.off ], 
                    exports.default = LogLevel;
                }, function(module, exports, __webpack_require__) {
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var logger_1 = __webpack_require__(0), PackageJson = __webpack_require__(1);
                    exports.default = function(settings) {
                        var identity = settings.identity;
                        if (!identity) throw new Error("identity is missing");
                        var identityStr = identity.system + "\\" + identity.service + "\\" + identity.instance;
                        logger_1.default.Instance = identityStr, logger_1.default.GetConnection = settings.getConnection;
                        var mainLogger = new logger_1.default("main");
                        mainLogger.publishLevel(settings.publish || "off"), mainLogger.consoleLevel(settings.console || "info"), 
                        mainLogger.metricsLevel(settings.metrics || "off");
                        var apiLogger = mainLogger.toAPIObject();
                        return apiLogger.version = PackageJson.version, apiLogger;
                    };
                } ]);
            });
        }).call(exports, __webpack_require__(7)(module));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(module) {
            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };
            !function(root, factory) {
                "object" === _typeof2(exports) && "object" === _typeof2(module) ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
                __WEBPACK_AMD_DEFINE_FACTORY__ = factory, void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
            }(0, function() {
                return function(modules) {
                    function __webpack_require__(moduleId) {
                        if (installedModules[moduleId]) return installedModules[moduleId].exports;
                        var module = installedModules[moduleId] = {
                            i: moduleId,
                            l: !1,
                            exports: {}
                        };
                        return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
                        module.l = !0, module.exports;
                    }
                    var installedModules = {};
                    return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
                    __webpack_require__.i = function(value) {
                        return value;
                    }, __webpack_require__.d = function(exports, name, getter) {
                        __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                            configurable: !1,
                            enumerable: !0,
                            get: getter
                        });
                    }, __webpack_require__.n = function(module) {
                        var getter = module && module.__esModule ? function() {
                            return module.default;
                        } : function() {
                            return module;
                        };
                        return __webpack_require__.d(getter, "a", getter), getter;
                    }, __webpack_require__.o = function(object, property) {
                        return Object.prototype.hasOwnProperty.call(object, property);
                    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 20);
                }([ function(module, exports, __webpack_require__) {
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    }), exports.default = {
                        DEFAULT: 0,
                        STRING: 1,
                        NUMBER: 2,
                        COUNT: 3,
                        RATE: 4,
                        STATISTICS: 6,
                        TIMESTAMP: 7,
                        ADDRESS: 8,
                        TIMESPAN: 10,
                        OBJECT: 11
                    };
                }, function(module, exports, __webpack_require__) {
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    }), exports.default = {
                        validate: function(definition, parent, transport) {
                            if (null === definition || "object" !== (void 0 === definition ? "undefined" : _typeof(definition))) throw new Error("Missing definition");
                            if (null === parent || "object" !== (void 0 === parent ? "undefined" : _typeof(parent))) throw new Error("Missing parent");
                            if (null === transport || "object" !== (void 0 === transport ? "undefined" : _typeof(transport))) throw new Error("Missing transport");
                        }
                    };
                }, function(module, exports) {
                    module.exports = {
                        name: "tick42-metrics",
                        version: "2.3.3",
                        description: "",
                        main: "dist/node/tick42-metrics.js",
                        browser: "dist/web/tick42-metrics.js",
                        types: "types/index.d.ts",
                        scripts: {
                            clean: "node ./build/scripts/clean.js",
                            "pre:build": "npm run tslint && tsc && set NODE_ENV=development && npm run clean",
                            "file-versionify": "node ./build/scripts/file-versionify.js",
                            tslint: "tslint -t codeFrame ./src/main.ts",
                            "tslint:fix": "tslint -t codeFrame --fix ./src/main.ts",
                            watch: "onchange ./src/**/*.ts -- npm run build:dev",
                            "build:dev": "npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify && npm run types",
                            "build:prod": "npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify && npm run types",
                            docs: "typedoc --options typedoc.json ./src",
                            types: "node ./build/scripts/copy-types.js",
                            prepublish: "npm run build:prod",
                            "types:merged": "dts-generator --project ./ --out ./types/index.d.ts"
                        },
                        author: "Tick42",
                        license: "ISC",
                        precommit: "tslint:fix",
                        devDependencies: {
                            "@types/tick42-gateway-connection": "^2.2.4",
                            "@types/tick42-logger": "^3.0.6",
                            "babel-core": "^6.17.0",
                            "babel-loader": "^6.4.1",
                            "babel-plugin-add-module-exports": "^0.2.1",
                            "babel-plugin-es6-promise": "^1.0.0",
                            "babel-preset-es2015": "^6.16.0",
                            "babel-preset-stage-2": "^6.22.0",
                            "dts-generator": "^2.1.0",
                            "es6-promise": "^4.1.0",
                            onchange: "3.*",
                            "pre-commit": "^1.1.3",
                            shelljs: "^0.6.0",
                            "tick42-webpack-config": "4.1.1",
                            tslint: "5.*",
                            typedoc: "^0.5.10",
                            typescript: "2.3.0",
                            webpack: "2.3.3"
                        }
                    };
                }, function(module, exports, __webpack_require__) {
                    function default_1(connection, config) {
                        function sendFull(repo) {
                            repo.root && 0 !== repo.root.subSystems.length && sendFullSystem(repo.root);
                        }
                        function sendFullSystem(system) {
                            createSystem(system), system.subSystems.forEach(function(sub) {
                                sendFullSystem(sub);
                            }), system.metrics.forEach(function(metric) {
                                createMetric(metric);
                            });
                        }
                        function heartbeat(repo) {
                            send("HeartbeatMetrics", {
                                publishingInterval: heartbeatInterval,
                                instance: repo.instance
                            });
                        }
                        function createSystem(system) {
                            void 0 !== system.parent && send("CreateMetricSystem", {
                                id: system.id,
                                instance: system.repo.instance,
                                definition: {
                                    name: system.name,
                                    description: system.description,
                                    path: system.path
                                }
                            });
                        }
                        function updateSystem(system, state) {
                            send("UpdateMetricSystem", {
                                id: system.id,
                                instance: system.repo.instance,
                                state: state
                            });
                        }
                        function createMetric(metric) {
                            send("CreateMetric", serializer_1.default(metric));
                        }
                        function updateMetric(metric) {
                            send("UpdateMetric", serializer_1.default(metric));
                        }
                        function init(repo) {
                            heartbeat(repo), _connection.on("metrics", "MetricsSnapshotRequest", function(instanceInfo) {
                                instanceInfo.Instance === repo.instance && sendFull(repo);
                            }), setInterval(function() {
                                heartbeat(repo);
                            }, heartbeatInterval);
                        }
                        if (!connection || "object" !== (void 0 === connection ? "undefined" : _typeof(connection))) throw new Error("Connection is required parameter");
                        var _connection = connection, heartbeatInterval = config.heartbeatInterval || 3e3, send = function(type, message) {
                            _connection.send("metrics", type, message);
                        };
                        return {
                            createSystem: createSystem,
                            updateSystem: updateSystem,
                            createMetric: createMetric,
                            updateMetric: updateMetric,
                            init: init
                        };
                    }
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var serializer_1 = __webpack_require__(18);
                    exports.default = default_1;
                }, function(module, exports, __webpack_require__) {
                    function default_1(connection, config) {
                        if (!connection || "object" !== (void 0 === connection ? "undefined" : _typeof(connection))) throw new Error("Connection is required parameter");
                        var joinPromise, session, init = function(repo) {
                            var resolveReadyPromise;
                            joinPromise = new es6_promise_1.Promise(function(resolve) {
                                resolveReadyPromise = resolve;
                            }), session = connection.domain("metrics", config.logger), session.onJoined(function(reconnect) {
                                reconnect || (resolveReadyPromise(), resolveReadyPromise = void 0);
                                var rootStateMetric = {
                                    name: "/State",
                                    type: "object",
                                    composite: {
                                        Description: {
                                            type: "string",
                                            description: ""
                                        },
                                        Value: {
                                            type: "number",
                                            description: ""
                                        }
                                    },
                                    description: "System state",
                                    context: {}
                                }, defineRootMetricsMsg = {
                                    type: "define",
                                    metrics: [ rootStateMetric ]
                                };
                                session.send(defineRootMetricsMsg), reconnect && replayRepo(repo);
                            }), session.join(config.identity);
                        }, replayRepo = function(repo) {
                            replaySystem(repo.root);
                        }, replaySystem = function replaySystem(system) {
                            createSystem(system), system.metrics.forEach(function(m) {
                                createMetric(m);
                            }), system.subSystems.forEach(function(ss) {
                                replaySystem(ss);
                            });
                        }, createSystem = function(system) {
                            void 0 !== system.parent && joinPromise.then(function() {
                                var metric = {
                                    name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                                    type: "object",
                                    composite: {
                                        Description: {
                                            type: "string",
                                            description: ""
                                        },
                                        Value: {
                                            type: "number",
                                            description: ""
                                        }
                                    },
                                    description: "System state",
                                    context: {}
                                }, createMetricsMsg = {
                                    type: "define",
                                    metrics: [ metric ]
                                };
                                session.send(createMetricsMsg);
                            });
                        }, updateSystem = function(system, state) {
                            joinPromise.then(function() {
                                var updateMetric = {
                                    type: "publish",
                                    values: [ {
                                        name: serializer_1.normalizeMetricName(system.path.join("/") + "/" + system.name + "/State"),
                                        value: {
                                            Description: state.description,
                                            Value: state.state
                                        },
                                        timestamp: Date.now()
                                    } ]
                                };
                                session.send(updateMetric);
                                var rootMetric = serializer_1.composeMsgForRootStateMetric(system, connection.peerId);
                                session.send(rootMetric);
                            });
                        }, createMetric = function(metric) {
                            joinPromise.then(function() {
                                var m = serializer_1.serializeMetric(metric), createMetricsMsg = {
                                    type: "define",
                                    metrics: [ m ]
                                };
                                session.send(createMetricsMsg), void 0 !== metric.value && updateMetric(metric);
                            });
                        }, updateMetric = function(metric) {
                            joinPromise.then(function() {
                                var value = serializer_1.getMetricValueByType(metric), publishMetricsMsg = {
                                    type: "publish",
                                    values: [ {
                                        name: serializer_1.normalizeMetricName(metric.path.join("/") + "/" + metric.name),
                                        value: value,
                                        timestamp: Date.now()
                                    } ]
                                };
                                session.send(publishMetricsMsg);
                            });
                        };
                        return {
                            init: init,
                            createSystem: createSystem,
                            updateSystem: updateSystem,
                            createMetric: createMetric,
                            updateMetric: updateMetric
                        };
                    }
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var es6_promise_1 = __webpack_require__(6), serializer_1 = __webpack_require__(19);
                    exports.default = default_1;
                }, function(module, exports, __webpack_require__) {
                    function repository(options, protocol) {
                        if (!options.identity) throw new Error("Identity missing from metrics configuration");
                        if (!options.identity.service || "string" != typeof options.identity.service) throw new Error("Service missing or invalid in metrics identity configuration");
                        if (!options.identity.system || "string" != typeof options.identity.system) throw new Error("System missing or invalid in metrics identity configuration");
                        if (!options.identity.instance || "string" != typeof options.identity.instance) throw new Error("Instance missing or invalid in metrics identity configuration");
                        var identity = options.identity, instance = options.identity.system + "/" + options.identity.service + "/" + options.identity.instance, version = PackageJson.version, me = {
                            identity: identity,
                            instance: instance,
                            version: version,
                            get root() {
                                return _root;
                            }
                        };
                        protocol.init(me);
                        var _root = system_1.default("", me, protocol);
                        return function(rootSystem, useClickStream) {
                            if ("undefined" != typeof navigator && rootSystem.stringMetric("UserAgent", navigator.userAgent), 
                            useClickStream && "undefined" != typeof document) {
                                var clickStream_1 = rootSystem.subSystem("ClickStream"), documentClickHandler = function(e) {
                                    if (e.target) {
                                        var target = e.target;
                                        clickStream_1.objectMetric("LastBrowserEvent", {
                                            type: "click",
                                            timestamp: new Date(),
                                            target: {
                                                className: e.target ? target.className : "",
                                                id: target.id,
                                                type: "<" + target.tagName.toLowerCase() + ">",
                                                href: target.href || ""
                                            }
                                        });
                                    }
                                };
                                clickStream_1.objectMetric("Page", {
                                    title: document.title,
                                    page: window.location.href
                                }), document.addEventListener ? document.addEventListener("click", documentClickHandler) : document.attachEvent("onclick", documentClickHandler);
                            }
                        }(_root, options.clickStream || void 0 === options.clickStream), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var system_1 = __webpack_require__(21), PackageJson = __webpack_require__(2);
                    exports.default = repository;
                }, function(module, exports, __webpack_require__) {
                    (function(process, global) {
                        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__, _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                            return void 0 === obj ? "undefined" : _typeof2(obj);
                        } : function(obj) {
                            return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                        };
                        !function(global, factory) {
                            "object" === _typeof(exports) && void 0 !== module ? module.exports = factory() : (__WEBPACK_AMD_DEFINE_FACTORY__ = factory, 
                            void 0 !== (__WEBPACK_AMD_DEFINE_RESULT__ = "function" == typeof __WEBPACK_AMD_DEFINE_FACTORY__ ? __WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module) : __WEBPACK_AMD_DEFINE_FACTORY__) && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                        }(0, function() {
                            function objectOrFunction(x) {
                                return "function" == typeof x || "object" === (void 0 === x ? "undefined" : _typeof(x)) && null !== x;
                            }
                            function isFunction(x) {
                                return "function" == typeof x;
                            }
                            function setScheduler(scheduleFn) {
                                customSchedulerFn = scheduleFn;
                            }
                            function setAsap(asapFn) {
                                asap = asapFn;
                            }
                            function useVertxTimer() {
                                return void 0 !== vertxNext ? function() {
                                    vertxNext(flush);
                                } : useSetTimeout();
                            }
                            function useSetTimeout() {
                                var globalSetTimeout = setTimeout;
                                return function() {
                                    return globalSetTimeout(flush, 1);
                                };
                            }
                            function flush() {
                                for (var i = 0; i < len; i += 2) {
                                    (0, queue[i])(queue[i + 1]), queue[i] = void 0, queue[i + 1] = void 0;
                                }
                                len = 0;
                            }
                            function then(onFulfillment, onRejection) {
                                var _arguments = arguments, parent = this, child = new this.constructor(noop);
                                void 0 === child[PROMISE_ID] && makePromise(child);
                                var _state = parent._state;
                                return _state ? function() {
                                    var callback = _arguments[_state - 1];
                                    asap(function() {
                                        return invokeCallback(_state, child, callback, parent._result);
                                    });
                                }() : subscribe(parent, child, onFulfillment, onRejection), child;
                            }
                            function resolve(object) {
                                var Constructor = this;
                                if (object && "object" === (void 0 === object ? "undefined" : _typeof(object)) && object.constructor === Constructor) return object;
                                var promise = new Constructor(noop);
                                return _resolve(promise, object), promise;
                            }
                            function noop() {}
                            function selfFulfillment() {
                                return new TypeError("You cannot resolve a promise with itself");
                            }
                            function cannotReturnOwn() {
                                return new TypeError("A promises callback cannot return that same promise.");
                            }
                            function getThen(promise) {
                                try {
                                    return promise.then;
                                } catch (error) {
                                    return GET_THEN_ERROR.error = error, GET_THEN_ERROR;
                                }
                            }
                            function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                                try {
                                    then.call(value, fulfillmentHandler, rejectionHandler);
                                } catch (e) {
                                    return e;
                                }
                            }
                            function handleForeignThenable(promise, thenable, then) {
                                asap(function(promise) {
                                    var sealed = !1, error = tryThen(then, thenable, function(value) {
                                        sealed || (sealed = !0, thenable !== value ? _resolve(promise, value) : fulfill(promise, value));
                                    }, function(reason) {
                                        sealed || (sealed = !0, _reject(promise, reason));
                                    }, "Settle: " + (promise._label || " unknown promise"));
                                    !sealed && error && (sealed = !0, _reject(promise, error));
                                }, promise);
                            }
                            function handleOwnThenable(promise, thenable) {
                                thenable._state === FULFILLED ? fulfill(promise, thenable._result) : thenable._state === REJECTED ? _reject(promise, thenable._result) : subscribe(thenable, void 0, function(value) {
                                    return _resolve(promise, value);
                                }, function(reason) {
                                    return _reject(promise, reason);
                                });
                            }
                            function handleMaybeThenable(promise, maybeThenable, then$$) {
                                maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve ? handleOwnThenable(promise, maybeThenable) : then$$ === GET_THEN_ERROR ? (_reject(promise, GET_THEN_ERROR.error), 
                                GET_THEN_ERROR.error = null) : void 0 === then$$ ? fulfill(promise, maybeThenable) : isFunction(then$$) ? handleForeignThenable(promise, maybeThenable, then$$) : fulfill(promise, maybeThenable);
                            }
                            function _resolve(promise, value) {
                                promise === value ? _reject(promise, selfFulfillment()) : objectOrFunction(value) ? handleMaybeThenable(promise, value, getThen(value)) : fulfill(promise, value);
                            }
                            function publishRejection(promise) {
                                promise._onerror && promise._onerror(promise._result), publish(promise);
                            }
                            function fulfill(promise, value) {
                                promise._state === PENDING && (promise._result = value, promise._state = FULFILLED, 
                                0 !== promise._subscribers.length && asap(publish, promise));
                            }
                            function _reject(promise, reason) {
                                promise._state === PENDING && (promise._state = REJECTED, promise._result = reason, 
                                asap(publishRejection, promise));
                            }
                            function subscribe(parent, child, onFulfillment, onRejection) {
                                var _subscribers = parent._subscribers, length = _subscribers.length;
                                parent._onerror = null, _subscribers[length] = child, _subscribers[length + FULFILLED] = onFulfillment, 
                                _subscribers[length + REJECTED] = onRejection, 0 === length && parent._state && asap(publish, parent);
                            }
                            function publish(promise) {
                                var subscribers = promise._subscribers, settled = promise._state;
                                if (0 !== subscribers.length) {
                                    for (var child = void 0, callback = void 0, detail = promise._result, i = 0; i < subscribers.length; i += 3) child = subscribers[i], 
                                    callback = subscribers[i + settled], child ? invokeCallback(settled, child, callback, detail) : callback(detail);
                                    promise._subscribers.length = 0;
                                }
                            }
                            function ErrorObject() {
                                this.error = null;
                            }
                            function tryCatch(callback, detail) {
                                try {
                                    return callback(detail);
                                } catch (e) {
                                    return TRY_CATCH_ERROR.error = e, TRY_CATCH_ERROR;
                                }
                            }
                            function invokeCallback(settled, promise, callback, detail) {
                                var hasCallback = isFunction(callback), value = void 0, error = void 0, succeeded = void 0, failed = void 0;
                                if (hasCallback) {
                                    if (value = tryCatch(callback, detail), value === TRY_CATCH_ERROR ? (failed = !0, 
                                    error = value.error, value.error = null) : succeeded = !0, promise === value) return void _reject(promise, cannotReturnOwn());
                                } else value = detail, succeeded = !0;
                                promise._state !== PENDING || (hasCallback && succeeded ? _resolve(promise, value) : failed ? _reject(promise, error) : settled === FULFILLED ? fulfill(promise, value) : settled === REJECTED && _reject(promise, value));
                            }
                            function initializePromise(promise, resolver) {
                                try {
                                    resolver(function(value) {
                                        _resolve(promise, value);
                                    }, function(reason) {
                                        _reject(promise, reason);
                                    });
                                } catch (e) {
                                    _reject(promise, e);
                                }
                            }
                            function nextId() {
                                return id++;
                            }
                            function makePromise(promise) {
                                promise[PROMISE_ID] = id++, promise._state = void 0, promise._result = void 0, promise._subscribers = [];
                            }
                            function Enumerator(Constructor, input) {
                                this._instanceConstructor = Constructor, this.promise = new Constructor(noop), this.promise[PROMISE_ID] || makePromise(this.promise), 
                                isArray(input) ? (this._input = input, this.length = input.length, this._remaining = input.length, 
                                this._result = new Array(this.length), 0 === this.length ? fulfill(this.promise, this._result) : (this.length = this.length || 0, 
                                this._enumerate(), 0 === this._remaining && fulfill(this.promise, this._result))) : _reject(this.promise, validationError());
                            }
                            function validationError() {
                                return new Error("Array Methods must be provided an Array");
                            }
                            function all(entries) {
                                return new Enumerator(this, entries).promise;
                            }
                            function race(entries) {
                                var Constructor = this;
                                return new Constructor(isArray(entries) ? function(resolve, reject) {
                                    for (var length = entries.length, i = 0; i < length; i++) Constructor.resolve(entries[i]).then(resolve, reject);
                                } : function(_, reject) {
                                    return reject(new TypeError("You must pass an array to race."));
                                });
                            }
                            function reject(reason) {
                                var Constructor = this, promise = new Constructor(noop);
                                return _reject(promise, reason), promise;
                            }
                            function needsResolver() {
                                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                            }
                            function needsNew() {
                                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                            }
                            function Promise(resolver) {
                                this[PROMISE_ID] = nextId(), this._result = this._state = void 0, this._subscribers = [], 
                                noop !== resolver && ("function" != typeof resolver && needsResolver(), this instanceof Promise ? initializePromise(this, resolver) : needsNew());
                            }
                            function polyfill() {
                                var local = void 0;
                                if (void 0 !== global) local = global; else if ("undefined" != typeof self) local = self; else try {
                                    local = Function("return this")();
                                } catch (e) {
                                    throw new Error("polyfill failed because global object is unavailable in this environment");
                                }
                                var P = local.Promise;
                                if (P) {
                                    var promiseToString = null;
                                    try {
                                        promiseToString = Object.prototype.toString.call(P.resolve());
                                    } catch (e) {}
                                    if ("[object Promise]" === promiseToString && !P.cast) return;
                                }
                                local.Promise = Promise;
                            }
                            var _isArray = void 0;
                            _isArray = Array.isArray ? Array.isArray : function(x) {
                                return "[object Array]" === Object.prototype.toString.call(x);
                            };
                            var isArray = _isArray, len = 0, vertxNext = void 0, customSchedulerFn = void 0, asap = function(callback, arg) {
                                queue[len] = callback, queue[len + 1] = arg, 2 === (len += 2) && (customSchedulerFn ? customSchedulerFn(flush) : scheduleFlush());
                            }, browserWindow = "undefined" != typeof window ? window : void 0, browserGlobal = browserWindow || {}, BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver, isNode = "undefined" == typeof self && void 0 !== process && "[object process]" === {}.toString.call(process), isWorker = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel, queue = new Array(1e3), scheduleFlush = void 0;
                            scheduleFlush = isNode ? function() {
                                return function() {
                                    return process.nextTick(flush);
                                };
                            }() : BrowserMutationObserver ? function() {
                                var iterations = 0, observer = new BrowserMutationObserver(flush), node = document.createTextNode("");
                                return observer.observe(node, {
                                    characterData: !0
                                }), function() {
                                    node.data = iterations = ++iterations % 2;
                                };
                            }() : isWorker ? function() {
                                var channel = new MessageChannel();
                                return channel.port1.onmessage = flush, function() {
                                    return channel.port2.postMessage(0);
                                };
                            }() : void 0 === browserWindow ? function() {
                                try {
                                    var vertx = __webpack_require__(22);
                                    return vertxNext = vertx.runOnLoop || vertx.runOnContext, useVertxTimer();
                                } catch (e) {
                                    return useSetTimeout();
                                }
                            }() : useSetTimeout();
                            var PROMISE_ID = Math.random().toString(36).substring(16), PENDING = void 0, FULFILLED = 1, REJECTED = 2, GET_THEN_ERROR = new ErrorObject(), TRY_CATCH_ERROR = new ErrorObject(), id = 0;
                            return Enumerator.prototype._enumerate = function() {
                                for (var length = this.length, _input = this._input, i = 0; this._state === PENDING && i < length; i++) this._eachEntry(_input[i], i);
                            }, Enumerator.prototype._eachEntry = function(entry, i) {
                                var c = this._instanceConstructor, resolve$$ = c.resolve;
                                if (resolve$$ === resolve) {
                                    var _then = getThen(entry);
                                    if (_then === then && entry._state !== PENDING) this._settledAt(entry._state, i, entry._result); else if ("function" != typeof _then) this._remaining--, 
                                    this._result[i] = entry; else if (c === Promise) {
                                        var promise = new c(noop);
                                        handleMaybeThenable(promise, entry, _then), this._willSettleAt(promise, i);
                                    } else this._willSettleAt(new c(function(resolve$$) {
                                        return resolve$$(entry);
                                    }), i);
                                } else this._willSettleAt(resolve$$(entry), i);
                            }, Enumerator.prototype._settledAt = function(state, i, value) {
                                var promise = this.promise;
                                promise._state === PENDING && (this._remaining--, state === REJECTED ? _reject(promise, value) : this._result[i] = value), 
                                0 === this._remaining && fulfill(promise, this._result);
                            }, Enumerator.prototype._willSettleAt = function(promise, i) {
                                var enumerator = this;
                                subscribe(promise, void 0, function(value) {
                                    return enumerator._settledAt(FULFILLED, i, value);
                                }, function(reason) {
                                    return enumerator._settledAt(REJECTED, i, reason);
                                });
                            }, Promise.all = all, Promise.race = race, Promise.resolve = resolve, Promise.reject = reject, 
                            Promise._setScheduler = setScheduler, Promise._setAsap = setAsap, Promise._asap = asap, 
                            Promise.prototype = {
                                constructor: Promise,
                                then: then,
                                catch: function(onRejection) {
                                    return this.then(null, onRejection);
                                }
                            }, Promise.polyfill = polyfill, Promise.Promise = Promise, Promise;
                        });
                    }).call(exports, __webpack_require__(7), __webpack_require__(8));
                }, function(module, exports, __webpack_require__) {
                    function defaultSetTimout() {
                        throw new Error("setTimeout has not been defined");
                    }
                    function defaultClearTimeout() {
                        throw new Error("clearTimeout has not been defined");
                    }
                    function runTimeout(fun) {
                        if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
                        if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, 
                        setTimeout(fun, 0);
                        try {
                            return cachedSetTimeout(fun, 0);
                        } catch (e) {
                            try {
                                return cachedSetTimeout.call(null, fun, 0);
                            } catch (e) {
                                return cachedSetTimeout.call(this, fun, 0);
                            }
                        }
                    }
                    function runClearTimeout(marker) {
                        if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
                        if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, 
                        clearTimeout(marker);
                        try {
                            return cachedClearTimeout(marker);
                        } catch (e) {
                            try {
                                return cachedClearTimeout.call(null, marker);
                            } catch (e) {
                                return cachedClearTimeout.call(this, marker);
                            }
                        }
                    }
                    function cleanUpNextTick() {
                        draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, 
                        queue.length && drainQueue());
                    }
                    function drainQueue() {
                        if (!draining) {
                            var timeout = runTimeout(cleanUpNextTick);
                            draining = !0;
                            for (var len = queue.length; len; ) {
                                for (currentQueue = queue, queue = []; ++queueIndex < len; ) currentQueue && currentQueue[queueIndex].run();
                                queueIndex = -1, len = queue.length;
                            }
                            currentQueue = null, draining = !1, runClearTimeout(timeout);
                        }
                    }
                    function Item(fun, array) {
                        this.fun = fun, this.array = array;
                    }
                    function noop() {}
                    var cachedSetTimeout, cachedClearTimeout, process = module.exports = {};
                    !function() {
                        try {
                            cachedSetTimeout = "function" == typeof setTimeout ? setTimeout : defaultSetTimout;
                        } catch (e) {
                            cachedSetTimeout = defaultSetTimout;
                        }
                        try {
                            cachedClearTimeout = "function" == typeof clearTimeout ? clearTimeout : defaultClearTimeout;
                        } catch (e) {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    }();
                    var currentQueue, queue = [], draining = !1, queueIndex = -1;
                    process.nextTick = function(fun) {
                        var args = new Array(arguments.length - 1);
                        if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
                        queue.push(new Item(fun, args)), 1 !== queue.length || draining || runTimeout(drainQueue);
                    }, Item.prototype.run = function() {
                        this.fun.apply(null, this.array);
                    }, process.title = "browser", process.browser = !0, process.env = {}, process.argv = [], 
                    process.version = "", process.versions = {}, process.on = noop, process.addListener = noop, 
                    process.once = noop, process.off = noop, process.removeListener = noop, process.removeAllListeners = noop, 
                    process.emit = noop, process.binding = function(name) {
                        throw new Error("process.binding is not supported");
                    }, process.cwd = function() {
                        return "/";
                    }, process.chdir = function(dir) {
                        throw new Error("process.chdir is not supported");
                    }, process.umask = function() {
                        return 0;
                    };
                }, function(module, exports, __webpack_require__) {
                    var g, _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    g = function() {
                        return this;
                    }();
                    try {
                        g = g || Function("return this")() || (0, eval)("this");
                    } catch (e) {
                        "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)) && (g = window);
                    }
                    module.exports = g;
                }, function(module, exports, __webpack_require__) {
                    function addressMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.ADDRESS, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = addressMetric;
                }, function(module, exports, __webpack_require__) {
                    function countMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        function incrementBy(num) {
                            update(_value + num);
                        }
                        function increment() {
                            incrementBy(1);
                        }
                        function decrement() {
                            incrementBy(-1);
                        }
                        function decrementBy(num) {
                            incrementBy(-1 * num);
                        }
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || 0, _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.COUNT, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get path() {
                                return _path;
                            },
                            get value() {
                                return _value;
                            },
                            update: update,
                            getValueType: getValueType,
                            incrementBy: incrementBy,
                            increment: increment,
                            decrement: decrement,
                            decrementBy: decrementBy
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = countMetric;
                }, function(module, exports, __webpack_require__) {
                    function numberMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        function incrementBy(num) {
                            update(_value + num);
                        }
                        function increment() {
                            incrementBy(1);
                        }
                        function decrement() {
                            incrementBy(-1);
                        }
                        function decrementBy(num) {
                            incrementBy(-1 * num);
                        }
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _path = parent.path.slice(0), _value = value || 0, name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.NUMBER;
                        _path.push(parent.name);
                        var me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            get value() {
                                return _value;
                            },
                            type: type,
                            get path() {
                                return _path;
                            },
                            update: update,
                            getValueType: getValueType,
                            incrementBy: incrementBy,
                            increment: increment,
                            decrement: decrement,
                            decrementBy: decrementBy
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = numberMetric;
                }, function(module, exports, __webpack_require__) {
                    function objectMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            mergeValues(newValue), _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        function mergeValues(values) {
                            return Object.keys(_value).forEach(function(k) {
                                void 0 !== values[k] && (_value[k] = values[k]);
                            });
                        }
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.OBJECT, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var metric_types_1 = __webpack_require__(0), helpers_1 = __webpack_require__(1);
                    exports.default = objectMetric;
                }, function(module, exports, __webpack_require__) {
                    function rateMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.RATE, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = rateMetric;
                }, function(module, exports, __webpack_require__) {
                    function statisticsMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.STATISTICS, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = statisticsMetric;
                }, function(module, exports, __webpack_require__) {
                    function stringMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.STRING, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            type: type,
                            update: update,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = stringMetric;
                }, function(module, exports, __webpack_require__) {
                    function timespanMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function start() {
                            update(!0);
                        }
                        function stop() {
                            update(!1);
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.TIMESPAN, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            start: start,
                            stop: stop,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = timespanMetric;
                }, function(module, exports, __webpack_require__) {
                    function timestampMetric(definition, parent, transport, value) {
                        function update(newValue) {
                            _value = newValue, _transport.updateMetric(me);
                        }
                        function now() {
                            update(new Date());
                        }
                        function getValueType() {}
                        helpers_1.default.validate(definition, parent, transport);
                        var _transport = transport, _value = value || "", _path = parent.path.slice(0);
                        _path.push(parent.name);
                        var name = definition.name, description = definition.description, period = definition.period, resolution = definition.resolution, system = parent, repo = parent.repo, id = parent.path + "/" + name, type = metric_types_1.default.TIMESTAMP, me = {
                            name: name,
                            description: description,
                            period: period,
                            resolution: resolution,
                            system: system,
                            repo: repo,
                            id: id,
                            type: type,
                            get value() {
                                return _value;
                            },
                            get path() {
                                return _path;
                            },
                            update: update,
                            now: now,
                            getValueType: getValueType
                        };
                        return _transport.createMetric(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var helpers_1 = __webpack_require__(1), metric_types_1 = __webpack_require__(0);
                    exports.default = timestampMetric;
                }, function(module, exports, __webpack_require__) {
                    function metricToMessage(metric) {
                        function getMetricDefinition(name, value, path, type, description, period, resolution) {
                            var _definition = {
                                name: name,
                                description: description,
                                type: type || getTypeFromValue(value),
                                path: path,
                                resolution: resolution,
                                period: period
                            };
                            return _definition.type === metric_types_1.default.OBJECT && (_definition.Composite = Object.keys(value).reduce(function(arr, key) {
                                var val = value[key];
                                return arr.push(getMetricDefinition(key, val, path)), arr;
                            }, [])), _definition;
                        }
                        function serializeValue(value, _metric) {
                            if (value && value.constructor === Date) return {
                                value: {
                                    type: _valueTypes.indexOf("date"),
                                    value: value.valueOf(),
                                    isArray: !1
                                }
                            };
                            if ("object" === (void 0 === value ? "undefined" : _typeof(value))) return {
                                CompositeValue: Object.keys(value).reduce(function(arr, key) {
                                    var val = serializeValue(value[key]);
                                    return val.InnerMetricName = key, arr.push(val), arr;
                                }, [])
                            };
                            var valueType = _metric ? _metric.getValueType() : void 0;
                            return valueType = valueType || _valueTypes.indexOf(void 0 === value ? "undefined" : _typeof(value)), 
                            {
                                value: {
                                    type: valueType,
                                    value: value,
                                    isArray: !1
                                }
                            };
                        }
                        function getTypeFromValue(value) {
                            switch (value.constructor === Date ? "timestamp" : void 0 === value ? "undefined" : _typeof(value)) {
                              case "string":
                                return metric_types_1.default.STRING;

                              case "number":
                                return metric_types_1.default.NUMBER;

                              case "timestamp":
                                return metric_types_1.default.TIMESTAMP;

                              case "object":
                                return metric_types_1.default.OBJECT;
                            }
                            return 0;
                        }
                        var definition = getMetricDefinition(metric.name, metric.value, metric.path, metric.type, metric.description, metric.period, metric.resolution), _valueTypes = [ "boolean", "int", "number", "long", "string", "date", "object" ];
                        return {
                            id: metric.id,
                            instance: metric.repo.instance,
                            definition: definition,
                            value: serializeValue(metric.value, metric)
                        };
                    }
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var metric_types_1 = __webpack_require__(0);
                    exports.default = metricToMessage;
                }, function(module, exports, __webpack_require__) {
                    function getMetricTypeByValue(metric) {
                        return metric.value.constructor === Date || metric.type === metric_types_1.default.TIMESPAN || metric.type === metric_types_1.default.TIMESTAMP ? "timestamp" : "number" == typeof metric.value ? "number" : "string" == typeof metric.value || metric.type === metric_types_1.default.RATE ? "string" : "object" === _typeof(metric.value) ? "object" : void 0;
                    }
                    function getTypeByValue(value) {
                        return value.constructor === Date ? "timestamp" : "number" == typeof value ? "number" : "string" == typeof value ? "string" : "object" === (void 0 === value ? "undefined" : _typeof(value)) ? "object" : "string";
                    }
                    function serializeMetric(metric) {
                        var serializedMetrics = {}, type = getMetricTypeByValue(metric);
                        if ("object" === type) {
                            var values = Object.keys(metric.value).reduce(function(memo, key) {
                                var innerType = getTypeByValue(metric.value[key]);
                                if ("object" === innerType) {
                                    var composite = defineNestedComposite(metric.value[key]);
                                    memo[key] = {
                                        type: "object",
                                        description: "",
                                        context: {},
                                        composite: composite
                                    };
                                } else memo[key] = {
                                    type: innerType,
                                    description: "",
                                    context: {}
                                };
                                return memo;
                            }, {});
                            serializedMetrics.composite = values;
                        }
                        return serializedMetrics.name = normalizeMetricName(metric.path.join("/") + "/" + metric.name), 
                        serializedMetrics.type = type, serializedMetrics.description = metric.description, 
                        serializedMetrics.context = {}, serializedMetrics;
                    }
                    function defineNestedComposite(values) {
                        return Object.keys(values).reduce(function(memo, key) {
                            var type = getTypeByValue(values[key]);
                            return memo[key] = "object" === type ? {
                                type: "object",
                                description: "",
                                context: {},
                                composite: defineNestedComposite(values[key])
                            } : {
                                type: type,
                                description: "",
                                context: {}
                            }, memo;
                        }, {});
                    }
                    function normalizeMetricName(name) {
                        return void 0 !== name && name.length > 0 && "/" !== name[0] ? "/" + name : name;
                    }
                    function getMetricValueByType(metric) {
                        return "timestamp" === getMetricTypeByValue(metric) ? Date.now() : publishNestedComposite(metric.value);
                    }
                    function publishNestedComposite(values) {
                        return "object" !== (void 0 === values ? "undefined" : _typeof(values)) ? values : Object.keys(values).reduce(function(memo, key) {
                            var value = values[key];
                            return "object" === (void 0 === value ? "undefined" : _typeof(value)) && value.constructor !== Date ? memo[key] = publishNestedComposite(value) : value.constructor === Date ? memo[key] = new Date(value).getTime() : value.constructor === Boolean ? memo[key] = value.toString() : memo[key] = value, 
                            memo;
                        }, {});
                    }
                    function flatten(arr) {
                        return arr.reduce(function(flat, toFlatten) {
                            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                        }, []);
                    }
                    function getHighestState(arr) {
                        return arr.sort(function(a, b) {
                            return b.state - a.state;
                        })[0];
                    }
                    function aggregateDescription(arr) {
                        var msg = "";
                        return arr.forEach(function(m, idx, a) {
                            var path = m.path.join(".");
                            idx === a.length - 1 ? msg += path + "." + m.name + ": " + m.description : msg += path + "." + m.name + ": " + m.description + ",";
                        }), msg.length > 100 ? msg.slice(0, 100) + "..." : msg;
                    }
                    function composeMsgForRootStateMetric(system, peerId) {
                        var aggregatedState = system.root.getAggregateState(), merged = flatten(aggregatedState), highestState = getHighestState(merged);
                        return {
                            type: "publish-metrics",
                            peer_id: peerId,
                            values: [ {
                                name: "/State",
                                value: {
                                    Description: aggregateDescription(merged),
                                    Value: highestState.state
                                },
                                timestamp: Date.now()
                            } ]
                        };
                    }
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var metric_types_1 = __webpack_require__(0);
                    exports.serializeMetric = serializeMetric, exports.normalizeMetricName = normalizeMetricName, 
                    exports.getMetricValueByType = getMetricValueByType, exports.composeMsgForRootStateMetric = composeMsgForRootStateMetric;
                }, function(module, exports, __webpack_require__) {
                    var _typeof = "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? function(obj) {
                        return void 0 === obj ? "undefined" : _typeof2(obj);
                    } : function(obj) {
                        return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : void 0 === obj ? "undefined" : _typeof2(obj);
                    };
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var gw1_1 = __webpack_require__(3), gw3_1 = __webpack_require__(4), repository_1 = __webpack_require__(5), version = __webpack_require__(2).version, windowAsAny = "undefined" == typeof window ? {} : window;
                    windowAsAny.tick42 = windowAsAny.tick42 || {}, exports.default = function(settings) {
                        var options = {
                            connection: settings.connection,
                            identity: settings.identity,
                            logger: settings.logger,
                            heartbeatInterval: settings.heartbeatInterval,
                            settings: {},
                            clickStream: settings.clickStream
                        };
                        if (!options.connection || "object" !== _typeof(options.connection)) throw new Error("Connection is required parameter");
                        var _protocol;
                        _protocol = 3 === options.connection.protocolVersion ? gw3_1.default(options.connection, settings) : gw1_1.default(options.connection, settings);
                        var repo = repository_1.default(options, _protocol), rootSystem = repo.root;
                        return rootSystem.version = version, rootSystem;
                    };
                }, function(module, exports, __webpack_require__) {
                    function system(name, repo, protocol, parent, description) {
                        function subSystem(nameSystem, descriptionSystem) {
                            if (!nameSystem || 0 === nameSystem.length) throw new Error("name is required");
                            var match = _subSystems.filter(function(s) {
                                return s.name === nameSystem;
                            });
                            if (match.length > 0) return match[0];
                            var _system = system(nameSystem, _repo, _transport, me, descriptionSystem);
                            return _subSystems.push(_system), _system;
                        }
                        function setState(state, stateDescription) {
                            _state = {
                                state: state,
                                description: stateDescription
                            }, _transport.updateSystem(me, _state);
                        }
                        function stringMetric(definition, value) {
                            return _getOrCreateMetric.call(me, definition, metric_types_1.default.STRING, value, function(metricDef) {
                                return string_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function numberMetric(definition, value) {
                            return _getOrCreateMetric.call(me, definition, metric_types_1.default.NUMBER, value, function(metricDef) {
                                return number_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function countMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.COUNT, value, function(metricDef) {
                                return count_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function addressMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.ADDRESS, value, function(metricDef) {
                                return address_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function objectMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.OBJECT, value, function(metricDef) {
                                return object_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function timespanMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESPAN, value, function(metricDef) {
                                return timespan_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function timestampMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.TIMESTAMP, value, function(metricDef) {
                                return timestamp_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function rateMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.RATE, value, function(metricDef) {
                                return rate_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function statisticsMetric(definition, value) {
                            return _getOrCreateMetric.call(this, definition, metric_types_1.default.STATISTICS, value, function(metricDef) {
                                return statistics_1.default(metricDef, me, _transport, value);
                            });
                        }
                        function _unionToMetricDef(def) {
                            var metricDefinition = {};
                            if ("string" == typeof def ? metricDefinition.name = def : metricDefinition = def, 
                            void 0 === metricDefinition.name) throw new Error("Metric name is required");
                            return metricDefinition;
                        }
                        function _getOrCreateMetric(definition, expectedType, value, createMetric) {
                            var metricDefinition = _unionToMetricDef(definition), matching = _metrics.filter(function(metric) {
                                return metric.name === metricDefinition.name;
                            });
                            if (matching.length > 0) {
                                var existing = matching[0];
                                if (existing.type !== expectedType) throw new Error("A metric named " + metricDefinition.name + " is already defined with different type.");
                                return void 0 !== value && existing.update(value), existing;
                            }
                            var metric = createMetric(metricDefinition);
                            return _metrics.push(metric), metric;
                        }
                        function _buildPath(system) {
                            if (!system || !system.parent) return [];
                            var path = _buildPath(system.parent);
                            return path.push(system.name), path;
                        }
                        function getAggregateState() {
                            var aggState = [];
                            return Object.keys(_state).length > 0 && aggState.push({
                                name: _name,
                                path: _path,
                                state: _state.state,
                                description: _state.description
                            }), _subSystems.forEach(function(subSystem) {
                                var result = subSystem.getAggregateState();
                                result.length > 0 && aggState.push(result);
                            }), aggState;
                        }
                        if (!repo) throw new Error("Repository is required");
                        if (!protocol) throw new Error("Transport is required");
                        var _transport = protocol, _name = name, _description = description || "", _repo = repo, _parent = parent, _path = _buildPath(parent), _state = {}, id = function(path, separator) {
                            return path && path.length > 0 ? path.join(separator) : "";
                        }(_path, "/") + name, identity = repo.identity, root = repo.root, _subSystems = [], _metrics = [], me = {
                            get name() {
                                return _name;
                            },
                            get description() {
                                return _description;
                            },
                            get repo() {
                                return _repo;
                            },
                            get parent() {
                                return _parent;
                            },
                            path: _path,
                            id: id,
                            identity: identity,
                            root: root,
                            get subSystems() {
                                return _subSystems;
                            },
                            get metrics() {
                                return _metrics;
                            },
                            subSystem: subSystem,
                            getState: function() {
                                return _state;
                            },
                            setState: setState,
                            stringMetric: stringMetric,
                            statisticsMetric: statisticsMetric,
                            rateMetric: rateMetric,
                            timestampMetric: timestampMetric,
                            timespanMetric: timespanMetric,
                            objectMetric: objectMetric,
                            addressMetric: addressMetric,
                            countMetric: countMetric,
                            numberMetric: numberMetric,
                            getAggregateState: getAggregateState
                        };
                        return _transport.createSystem(me), me;
                    }
                    Object.defineProperty(exports, "__esModule", {
                        value: !0
                    });
                    var address_1 = __webpack_require__(9), count_1 = __webpack_require__(10), number_1 = __webpack_require__(11), object_1 = __webpack_require__(12), rate_1 = __webpack_require__(13), statistics_1 = __webpack_require__(14), string_1 = __webpack_require__(15), timespan_1 = __webpack_require__(16), timestamp_1 = __webpack_require__(17), metric_types_1 = __webpack_require__(0);
                    exports.default = system;
                }, function(module, exports) {} ]);
            });
        }).call(exports, __webpack_require__(7)(module));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        (function(global) {
            function default_1(configuration) {
                function getMetricsDefaults(uid) {
                    var documentTitle = "undefined" != typeof document ? document.title : "unknown";
                    if (documentTitle = documentTitle || "none", void 0 === hc) return {
                        system: "Connect.Browser",
                        service: configuration.application || documentTitle,
                        instance: "~" + uid
                    };
                    if (void 0 !== hc.metricsFacade.getIdentity) {
                        var identity = hc.metricsFacade.getIdentity();
                        return {
                            system: identity.system,
                            service: identity.service,
                            instance: identity.instance
                        };
                    }
                    return {
                        system: "HtmlContainer." + hc.containerName,
                        service: "JS." + hc.browserWindowName,
                        instance: "~" + hc.machineName
                    };
                }
                function getGatewayDefaults() {
                    var isSSL = isSecureConnection(1);
                    return {
                        ws: isSSL ? "wss://localhost:22037" : "ws://localhost:22037",
                        http: isSSL ? "https://localhost:22037" : "http://localhost:22037",
                        protocolVersion: 1,
                        reconnectInterval: DEFAULT_RECONNECT_INTERVAL
                    };
                }
                function isSecureConnection(protocolVersion) {
                    return !(protocolVersion && protocolVersion <= 2) && ("undefined" == typeof window || !window.location || "http:" !== window.location.protocol);
                }
                function getDefaultApplicationName(uid) {
                    return hc ? hc.containerName + "." + hc.browserWindowName : "undefined" != typeof window && "undefined" != typeof document ? (window.agm_application || document.title) + uid : "NodeJS" + uid;
                }
                var hc;
                "undefined" != typeof window && (hc = window.htmlContainer);
                var gatewayConnection, optionsAndDefaults = mergeConfigWithDefaults_1.default(configuration, function() {
                    var uid = shortid_1.generate();
                    return {
                        application: getDefaultApplicationName(uid),
                        metrics: getMetricsDefaults(uid),
                        agm: {},
                        gateway: getGatewayDefaults()
                    };
                }()), options = optionsAndDefaults.config, defaults = optionsAndDefaults.defaults, metricsIdentity = {
                    system: options.metrics.system,
                    service: options.metrics.service,
                    instance: options.metrics.instance
                };
                if (void 0 === hc) {
                    var ws = void 0, http = void 0, protocolVersion = options.gateway.protocolVersion;
                    (function() {
                        try {
                            return "[object process]" === Object.prototype.toString.call(global.process);
                        } catch (e) {}
                        return !1;
                    })() || "WebSocket" in window && 2 === window.WebSocket.CLOSING ? ws = options.gateway.ws : http = options.gateway.http, 
                    gatewayConnection = {
                        gwTokenProvider: options.gateway.gwTokenProvider,
                        reconnectInterval: options.gateway.reconnectInterval || DEFAULT_RECONNECT_INTERVAL,
                        identity: {
                            application: options.application
                        },
                        ws: ws,
                        http: http,
                        protocolVersion: protocolVersion
                    };
                }
                return {
                    auth: options.auth,
                    logger: function(value, dflt) {
                        return void 0 === value ? dflt : value;
                    }(options.logger, {
                        publish: "off",
                        console: "info",
                        metrics: "off"
                    }),
                    connection: gatewayConnection || {},
                    metrics: {
                        identity: metricsIdentity
                    },
                    agm: {
                        instance: {
                            application: options.application
                        }
                    },
                    version: options.version || pjson.version,
                    libs: options.libs,
                    configurationData: {
                        input: configuration,
                        defaults: defaults,
                        merged: options
                    }
                };
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0
            });
            var mergeConfigWithDefaults_1 = __webpack_require__(9), shortid_1 = __webpack_require__(8), pjson = __webpack_require__(47), DEFAULT_RECONNECT_INTERVAL = 1e3;
            exports.default = default_1;
        }).call(exports, __webpack_require__(1));
    }, function(module, exports, __webpack_require__) {
        "use strict";
        Object.defineProperty(exports, "__esModule", {
            value: !0
        });
        var connection = {
            protocolVersion: -1,
            version: "-1",
            send: function(product, type, message, id) {},
            on: function(product, type, messageHandler) {
                return {
                    type: "1",
                    id: 1
                };
            },
            off: function(info) {},
            login: function(message) {},
            logout: function() {},
            loggedIn: function(callback) {},
            connected: function(callback) {},
            disconnected: function(callback) {}
        };
        exports.default = connection;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        var glue_1 = __webpack_require__(11);
        "undefined" != typeof window && (window.GlueCore = glue_1.default), glue_1.default.default = glue_1.default, 
        module.exports = glue_1.default;
    }, function(module, exports, __webpack_require__) {
        "use strict";
        function default_1() {
            function now() {
                return new Date().getTime();
            }
            function stop() {
                return endTime = now(), period = now() - startTime;
            }
            var endTime, period, startTime = now();
            return {
                get startTime() {
                    return startTime;
                },
                get endTime() {
                    return endTime;
                },
                get period() {
                    return period;
                },
                stop: stop
            };
        }
        Object.defineProperty(exports, "__esModule", {
            value: !0
        }), exports.default = default_1;
    }, function(module, exports) {
        module.exports = {
            name: "tick42-glue-core",
            version: "3.2.6",
            description: "Glue42 core library including logger, connection, agm and metrics",
            main: "./dist/node/tick42-glue-core.js",
            types: "./glue.d.ts",
            browser: "./dist/web/tick42-glue-core.js",
            scripts: {
                "init-dev-mode": "node ./build/scripts/init-dev-mode.js",
                "remove-installed-dependencies": "node ./build/scripts/remove-installed-dependencies.js",
                clean: "node ./build/scripts/clean.js",
                "pre:build": "npm run tslint && tsc && set NODE_ENV=development && npm run clean",
                "file-versionify": "node ./build/scripts/file-versionify.js",
                tslint: "tslint -t codeFrame ./src/main.ts",
                "tslint:fix": "tslint -t codeFrame --fix ./src/main.ts",
                watch: "onchange ./src/**/*.ts -- npm run build:dev",
                "build:dev": "npm run pre:build && set NODE_ENV=development && webpack && npm run file-versionify",
                "build:prod": "npm run pre:build && set NODE_ENV=development && webpack && set NODE_ENV=production && webpack && npm run file-versionify",
                docs: "typedoc --options typedoc.json ./src",
                prepublish: "npm run build:prod"
            },
            repository: {
                type: "git",
                url: "https://stash.tick42.com/scm/tg/js-glue-core.git"
            },
            author: {
                name: "Tick42",
                url: "http://www.glue42.com"
            },
            license: "ISC",
            dependencies: {
                "callback-registry": "2.2.5",
                deepmerge: "^1.3.2",
                "es5-shim": "4.1.14",
                "object-assign": "4.1.0",
                shortid: "2.2.6",
                "tick42-agm": "3.5.3",
                "tick42-gateway-connection": "2.2.7",
                "tick42-logger": "3.0.7",
                "tick42-metrics": "2.3.3"
            },
            devDependencies: {
                "@types/es6-promise": "0.0.32",
                "@types/shortid": "0.0.29",
                "babel-core": "^6.17.0",
                "babel-loader": "^6.4.1",
                "babel-plugin-add-module-exports": "^0.2.1",
                "babel-plugin-es6-promise": "^1.0.0",
                "babel-preset-es2015": "^6.16.0",
                "babel-preset-stage-2": "^6.22.0",
                "es6-promise": "^4.1.0",
                mocha: "^2.4.5",
                onchange: "3.*",
                "pre-commit": "^1.1.3",
                "readline-sync": "^1.4.5",
                shelljs: "^0.6.0",
                "tick42-webpack-config": "4.1.2",
                tslint: "5.*",
                typedoc: "^0.5.10",
                typescript: "2.3.0",
                webpack: "2.3.3"
            }
        };
    }, function(module, exports) {} ]);
});