var Track = (function (g, l, n) {
	'use awesome';
	var u = function (a, b) {
		this.config = a;
		this.onError = b;
		a.enabled && this.watch();
	};
	u.prototype = {
		watch: function () {
			c.forEach(
				['EventTarget', 'Node', 'XMLHttpRequest'],
				function (a) {
					c.has(g, a + '.prototype.addEventListener') && c.hasOwn(g[a].prototype, 'addEventListener') && this.wrapEventTarget(g[a].prototype);
				},
				this
			);
			this.wrapTimer('setTimeout');
			this.wrapTimer('setInterval');
		},
		wrap: function (a) {
			function b() {
				try {
					return a.apply(this, arguments);
				} catch (b) {
					throw (d.onError('catch', b, { bindTime: e, bindStack: f }), c.wrapError(b));
				}
			}
			var d = this;
			try {
				if (!c.isFunction(a) || c.hasOwn(a, '__trackjs__')) return a;
				if (c.hasOwn(a, '__trackjs_state__')) return a.__trackjs_state__;
			} catch (p) {
				return a;
			}
			var e, f;
			if (d.config.bindStack)
				try {
					throw Error();
				} catch (p) {
					(f = p.stack), (e = c.isoNow());
				}
			for (var h in a) c.hasOwn(a, h) && (b[h] = a[h]);
			b.prototype = a.prototype;
			b.__trackjs__ = !0;
			return (a.__trackjs_state__ = b);
		},
		wrapEventTarget: function (a) {
			var b = this;
			c.has(a, 'addEventListener.call') &&
				c.has(a, 'removeEventListener.call') &&
				(c.patch(a, 'addEventListener', function (a) {
					return function (e, f, h, p) {
						try {
							c.has(f, 'handleEvent') && (f.handleEvent = b.wrap(f.handleEvent));
						} catch (g) {}
						return a.call(this, e, b.wrap(f), h, p);
					};
				}),
				c.patch(a, 'removeEventListener', function (a) {
					return function (b, f, c, g) {
						try {
							f = f && (f.__trackjs_state__ || f);
						} catch (k) {}
						return a.call(this, b, f, c, g);
					};
				}));
		},
		wrapTimer: function (a) {
			var b = this;
			c.patch(g, a, function (a) {
				return function (e, f) {
					var h = Array.prototype.slice.call(arguments),
						g = h[0];
					c.isFunction(g) && (h[0] = b.wrap(g));
					return c.has(a, 'apply') ? a.apply(this, h) : a(h[0], h[1]);
				};
			});
		},
	};
	var q = function (a) {
		this.initCurrent(a) || console.warn('[Track] invalid config');
	};
	q.prototype = {
		current: {},
		initOnly: {
			application: !0,
			cookie: !0,
			enabled: !0,
			token: !0,
			callback: { enabled: !0 },
			console: { enabled: !0 },
			navigation: { enabled: !0 },
			network: { enabled: !0, fetch: !0 },
			visitor: { enabled: !0 },
			window: { enabled: !0, promise: !0 },
		},
		defaults: {
			application: '',
			cookie: !1,
			dedupe: !0,
			dependencies: !0,
			enabled: !0,
			forwardingDomain: '',
			errorURL: 'https://testapi.grizzlychina.com/track/logs',
			errorNoSSLURL: 'https://testapi.grizzlychina.com/track/capture',
			faultURL: 'https://dummyimage.com/100x100/79f2d4/757575.png&text=XT',
			usageURL: 'https://dummyimage.com/100x100/79f2d4/757575.png&text=XT',
			onError: function () {
				return !0;
			},
			serialize: function (a) {
				function b(a) {
					var d = '<' + a.tagName.toLowerCase();
					a = a.attributes || [];
					for (var b = 0; b < a.length; b++) d += ' ' + a[b].name + '="' + a[b].value + '"';
					return d + '>';
				}
				if ('' === a) return 'Empty String';
				if (a === n) return 'undefined';
				if (c.isString(a) || c.isNumber(a) || c.isBoolean(a) || c.isFunction(a)) return '' + a;
				if (c.isElement(a)) return b(a);
				if ('symbol' === typeof a) return Symbol.prototype.toString.call(a);
				var d;
				try {
					d = JSON.stringify(a, function (a, d) {
						return d === n ? 'undefined' : c.isNumber(d) && isNaN(d) ? 'NaN' : c.isError(d) ? { name: d.name, message: d.message, stack: d.stack } : c.isElement(d) ? b(d) : d;
					});
				} catch (f) {
					d = '';
					for (var e in a)
						if (a.hasOwnProperty(e))
							try {
								d += ',"' + e + '":"' + a[e] + '"';
							} catch (h) {}
					d = d ? '{' + d.replace(',', '') + '}' : 'Unserializable Object';
				}
				return d.replace(/"undefined"/g, 'undefined').replace(/"NaN"/g, 'NaN');
			},
			sessionId: '',
			token: '',
			userId: '',
			version: '',
			callback: { enabled: !0, bindStack: !1 },
			console: { enabled: !0, display: !0, error: !0, warn: !1, watch: ['log', 'debug', 'info', 'warn', 'error'] },
			navigation: { enabled: !0 },
			network: { enabled: !0, error: !0, fetch: !0 },
			visitor: { enabled: !0 },
			window: { enabled: !0, promise: !0 },
		},
		initCurrent: function (a) {
			this.removeEmpty(a);
			if (this.validate(a, this.defaults, '[Track] config', {})) return (this.current = c.defaultsDeep({}, a, this.defaults)), !0;
			this.current = c.defaultsDeep({}, this.defaults);
			return !1;
		},
		setCurrent: function (a) {
			return this.validate(a, this.defaults, '[Track] config', this.initOnly) ? ((this.current = c.defaultsDeep({}, a, this.current)), !0) : !1;
		},
		removeEmpty: function (a) {
			for (var b in a) a.hasOwnProperty(b) && a[b] === n && delete a[b];
		},
		validate: function (a, b, d, e) {
			var f = !0;
			d = d || '';
			e = e || {};
			for (var c in a)
				if (a.hasOwnProperty(c))
					if (b.hasOwnProperty(c)) {
						var g = typeof b[c];
						g !== typeof a[c]
							? (console.warn(d + '.' + c + ': property must be type ' + g + '.'), (f = !1))
							: '[object Array]' !== Object.prototype.toString.call(a[c]) || this.validateArray(a[c], b[c], d + '.' + c)
							? '[object Object]' === Object.prototype.toString.call(a[c])
								? (f = this.validate(a[c], b[c], d + '.' + c, e[c]))
								: e.hasOwnProperty(c) && (console.warn(d + '.' + c + ': property cannot be set after load.'), (f = !1))
							: (f = !1);
					} else console.warn(d + '.' + c + ': property not supported.'), (f = !1);
			return f;
		},
		validateArray: function (a, b, d) {
			var e = !0;
			d = d || '';
			for (var f = 0; f < a.length; f++) c.contains(b, a[f]) || (console.warn(d + '[' + f + ']: invalid value: ' + a[f] + '.'), (e = !1));
			return e;
		},
	};
	var r = function (a, b, d, e, c, h, g) {
		this.util = a;
		this.log = b;
		this.onError = d;
		this.onFault = e;
		this.serialize = c;
		g.enabled && (h.console = this.wrapConsoleObject(h.console, g));
	};
	r.prototype = {
		wrapConsoleObject: function (a, b) {
			a = a || {};
			var d = a.log || function () {},
				e = this,
				f;
			for (f = 0; f < b.watch.length; f++)
				(function (f) {
					var g = a[f] || d;
					a[f] = function () {
						try {
							var d = Array.prototype.slice.call(arguments);
							e.log.add('c', { timestamp: e.util.isoNow(), severity: f, message: e.serialize(1 === d.length ? d[0] : d) });
							if (b[f])
								if (c.isError(d[0]) && 1 === d.length) e.onError('console', d[0]);
								else
									try {
										throw Error(e.serialize(1 === d.length ? d[0] : d));
									} catch (m) {
										e.onError('console', m);
									}
							b.display && (e.util.hasFunction(g, 'apply') ? g.apply(a, d) : g(d[0]));
						} catch (m) {
							e.onFault(m);
						}
					};
				})(b.watch[f]);
			return a;
		},
		report: function () {
			return this.log.all('c');
		},
	};
	var v = function (a, b, d, e, c) {
		this.config = a;
		this.util = b;
		this.log = d;
		this.window = e;
		this.document = c;
		this.correlationId = this.token = null;
		this.initialize();
	};
	v.prototype = {
		initialize: function () {
			this.token = this.getCustomerToken();
			this.correlationId = this.getCorrelationId();
		},
		getCustomerToken: function () {
			if (this.config.current.token) return this.config.current.token;
			var a = this.document.getElementsByTagName('script');
			return a[a.length - 1].getAttribute('data-token');
		},
		getCorrelationId: function () {
			var a;
			if (!this.config.current.cookie) return this.util.uuid();
			try {
				(a = this.document.cookie.replace(/(?:(?:^|.*;\s*)Track\s*\=\s*([^;]*).*$)|^.*$/, '$1')),
					a || ((a = this.util.uuid()), (this.document.cookie = 'Track=' + a + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/'));
			} catch (b) {
				a = this.util.uuid();
			}
			return a;
		},
		report: function () {
			return {
				application: this.config.current.application,
				correlationId: this.correlationId,
				sessionId: this.config.current.sessionId,
				token: this.token,
				userId: this.config.current.userId,
				version: this.config.current.version,
			};
		},
	};
	var w = function (a) {
		this.config = a;
		this.loadedOn = new Date().getTime();
		this.originalUrl = c.getLocation();
		this.referrer = c.isBrowser ? l.referrer : '';
	};
	w.prototype = {
		discoverDependencies: function () {
			var a = { Track: '1.2.0' };
			g.jQuery && g.jQuery.fn && g.jQuery.fn.jquery && (a.jQuery = g.jQuery.fn.jquery);
			g.jQuery && g.jQuery.ui && g.jQuery.ui.version && (a.jQueryUI = g.jQuery.ui.version);
			g.angular && g.angular.version && g.angular.version.full && (a.angular = g.angular.version.full);
			for (var b in g)
				if ('_trackJs' !== b && '_trackJS' !== b && '_trackjs' !== b && 'webkitStorageInfo' !== b && 'webkitIndexedDB' !== b && 'top' !== b && 'parent' !== b && 'frameElement' !== b)
					try {
						if (g[b]) {
							var d = g[b].version || g[b].Version || g[b].VERSION;
							'string' === typeof d && (a[b] = d);
						}
					} catch (e) {}
			a.Track && a.Track && delete a.Track;
			return a;
		},
		report: function () {
			return {
				age: new Date().getTime() - this.loadedOn,
				dependencies: this.config.current.dependencies ? this.discoverDependencies() : { Track: '1.2.0' },
				originalUrl: this.originalUrl,
				referrer: this.referrer,
				userAgent: g.navigator.userAgent,
				viewportHeight: c.isBrowser ? g.document.documentElement.clientHeight : 0,
				viewportWidth: c.isBrowser ? g.document.documentElement.clientWidth : 0,
			};
		},
	};
	var x = function (a) {
		this.util = a;
		this.appender = [];
		this.maxLength = 30;
	};
	x.prototype = {
		all: function (a) {
			var b = [],
				d,
				e;
			for (e = 0; e < this.appender.length; e++) (d = this.appender[e]) && d.category === a && b.push(d.value);
			return b;
		},
		clear: function () {
			this.appender.length = 0;
		},
		truncate: function () {
			this.appender.length > this.maxLength && (this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0)));
		},
		add: function (a, b) {
			var d = this.util.uuid();
			this.appender.push({ key: d, category: a, value: b });
			this.truncate();
			return d;
		},
		get: function (a, b) {
			var d, e;
			for (e = 0; e < this.appender.length; e++) if (((d = this.appender[e]), d.category === a && d.key === b)) return d.value;
			return !1;
		},
	};
	var D = function (a) {
			var b = {};
			return {
				addMetadata: function (a, e) {
					b[a] = e;
				},
				removeMetadata: function (a) {
					delete b[a];
				},
				report: function () {
					var d = [],
						e;
					for (e in b) b.hasOwnProperty(e) && d.push({ key: e, value: a(b[e]) });
					return d;
				},
				store: b,
			};
		},
		y = function (a, b) {
			this.log = a;
			this.options = b;
			b.enabled && this.watch();
		};
	y.prototype = {
		isCompatible: function (a) {
			a = a || g;
			return !c.has(a, 'chrome.app.runtime') && c.has(a, 'addEventListener') && c.has(a, 'history.pushState');
		},
		record: function (a, b, d) {
			this.log.add('h', { type: a, from: c.truncate(b, 250), to: c.truncate(d, 250), on: c.isoNow() });
		},
		report: function () {
			return this.log.all('h');
		},
		watch: function () {
			if (this.isCompatible()) {
				var a = this,
					b = c.getLocationURL().relative;
				g.addEventListener(
					'popstate',
					function () {
						var d = c.getLocationURL().relative;
						a.record('popState', b, d);
						b = d;
					},
					!0
				);
				c.forEach(['pushState', 'replaceState'], function (d) {
					c.patch(history, d, function (e) {
						return function () {
							b = c.getLocationURL().relative;
							var f = e.apply(this, arguments),
								h = c.getLocationURL().relative;
							a.record(d, b, h);
							b = h;
							return f;
						};
					});
				});
			}
		},
	};
	var z = function (a, b, d, e, c, h) {
		this.util = a;
		this.log = b;
		this.onError = d;
		this.onFault = e;
		this.window = c;
		this.options = h;
		h.enabled && this.initialize(c);
	};
	z.prototype = {
		initialize: function (a) {
			a.XMLHttpRequest && this.util.hasFunction(a.XMLHttpRequest.prototype.open, 'apply') && this.watchNetworkObject(a.XMLHttpRequest);
			a.XDomainRequest && this.util.hasFunction(a.XDomainRequest.prototype.open, 'apply') && this.watchNetworkObject(a.XDomainRequest);
			this.options.fetch && c.isWrappableFunction(a.fetch) && this.watchFetch();
		},
		escapeUrl: function (a) {
			return ('' + a).replace(/ /gi, '%20').replace(/\t/gi, '%09');
		},
		watchFetch: function () {
			var a = this,
				b = this.log,
				d = this.options,
				e = this.onError;
			c.patch(g, 'fetch', function (f) {
				return function (h, p) {
					if (p && p.__trackjs__) return f.apply(g, arguments);
					var k;
					try {
						throw Error();
					} catch (E) {
						k = E.stack;
					}
					var m = h instanceof Request ? h.url : h,
						n = h instanceof Request ? h.method : (p || {}).method || 'GET',
						m = a.escapeUrl(m),
						l = f.apply(g, arguments);
					l.__trackjs_state__ = b.add('n', { type: 'fetch', startedOn: c.isoNow(), method: n, url: c.truncate(m, 2e3) });
					return l
						.then(function (a) {
							var f = b.get('n', l.__trackjs_state__);
							if (f) {
								c.defaults(f, { completedOn: c.isoNow(), statusCode: a.status, statusText: a.statusText });
								var h = a.headers.get('Track-correlation-id');
								h && (f.requestCorrelationId = h);
								d.error && 400 <= a.status && ((f = Error(f.statusCode + ' : ' + f.method + ' ' + f.url)), (f.stack = k), e('ajax', f));
							}
							return a;
						})
						['catch'](function (a) {
							a = a || {};
							var f = b.get('n', l.__trackjs_state__);
							f &&
								(c.defaults(f, { completedOn: c.isoNow(), statusCode: 0, statusText: a.toString() }),
								d.error && (e('ajax', { name: a.name, message: (a.message || 'Failed') + ': ' + f.method + ' ' + f.url, stack: a.stack || k }), (a.__trackjs_state__ = !0)));
							throw a;
						});
				};
			});
		},
		watchNetworkObject: function (a) {
			var b = this,
				d = a.prototype.open,
				e = a.prototype.send;
			a.prototype.open = function (a, e) {
				var c = (e || '').toString();
				0 > c.indexOf('localhost:0') && ((c = b.escapeUrl(c)), (this._trackJs = { method: a, url: c }));
				return d.apply(this, arguments);
			};
			a.prototype.send = function () {
				if (!this._trackJs)
					try {
						return e.apply(this, arguments);
					} catch (a) {
						b.onError('ajax', a);
						return;
					}
				try {
					(this._trackJs.logId = b.log.add('n', { type: 'xhr', startedOn: b.util.isoNow(), method: this._trackJs.method, url: c.truncate(this._trackJs.url, 2e3) })), b.listenForNetworkComplete(this);
				} catch (a) {
					b.onFault(a);
				}
				return e.apply(this, arguments);
			};
			return a;
		},
		listenForNetworkComplete: function (a) {
			var b = this;
			b.window.ProgressEvent &&
				a.addEventListener &&
				a.addEventListener(
					'readystatechange',
					function () {
						4 === a.readyState && b.finalizeNetworkEvent(a);
					},
					!0
				);
			a.addEventListener
				? a.addEventListener(
						'load',
						function () {
							b.finalizeNetworkEvent(a);
							b.checkNetworkFault(a);
						},
						!0
				  )
				: setTimeout(function () {
						try {
							var d = a.onload;
							a.onload = function () {
								b.finalizeNetworkEvent(a);
								b.checkNetworkFault(a);
								'function' === typeof d && b.util.hasFunction(d, 'apply') && d.apply(a, arguments);
							};
							var e = a.onerror;
							a.onerror = function () {
								b.finalizeNetworkEvent(a);
								b.checkNetworkFault(a);
								'function' === typeof oldOnError && e.apply(a, arguments);
							};
						} catch (c) {
							b.onFault(c);
						}
				  }, 0);
		},
		finalizeNetworkEvent: function (a) {
			if (a._trackJs) {
				var b = this.log.get('n', a._trackJs.logId);
				b &&
					((b.completedOn = this.util.isoNow()),
					a.getAllResponseHeaders &&
						a.getResponseHeader &&
						0 <= (a.getAllResponseHeaders() || '').toLowerCase().indexOf('Track-correlation-id') &&
						(b.requestCorrelationId = a.getResponseHeader('Track-correlation-id')),
					(b.statusCode = 1223 == a.status ? 204 : a.status),
					(b.statusText = 1223 == a.status ? 'No Content' : a.statusText));
			}
		},
		checkNetworkFault: function (a) {
			if (this.options.error && 400 <= a.status && 1223 != a.status) {
				var b = a._trackJs || {};
				this.onError('ajax', a.status + ' : ' + b.method + ' ' + b.url);
			}
		},
		report: function () {
			return this.log.all('n');
		},
	};
	var t = function (a, b) {
		this.util = a;
		this.config = b;
		this.disabled = !1;
		this.throttleStats = { attemptCount: 0, throttledCount: 0, lastAttempt: new Date().getTime() };
		(g.JSON && g.JSON.stringify) || (this.disabled = !0);
	};
	t.prototype = {
		errorEndpoint: function (a) {
			var b = this.config.current,
				d = b.errorURL;
			c.isBrowser && !c.testCrossdomainXhr() && -1 === g.location.protocol.indexOf('https') ? (d = b.errorNoSSLURL) : b.forwardingDomain && (d = 'https://' + b.forwardingDomain + '/capture');
			return d + '?token=' + a + '&v=1.2.0';
		},
		usageEndpoint: function (a) {
			var b = this.config.current,
				d = b.usageURL;
			b.forwardingDomain && (d = 'https://' + b.forwardingDomain + '/usage.gif');
			return this.appendObjectAsQuery(a, d);
		},
		trackerFaultEndpoint: function (a) {
			var b = (this.config || {}).current || q.prototype.defaults,
				d = b.faultURL;
			b.forwardingDomain && (d = 'https://' + b.forwardingDomain + '/fault.gif');
			return this.appendObjectAsQuery(a, d);
		},
		appendObjectAsQuery: function (a, b) {
			b += '?';
			for (var d in a) a.hasOwnProperty(d) && (b += encodeURIComponent(d) + '=' + encodeURIComponent(a[d]) + '&');
			return b;
		},
		getCORSRequest: function (a, b) {
			var d;
			this.util.testCrossdomainXhr()
				? ((d = new g.XMLHttpRequest()), d.open(a, b), d.setRequestHeader('Content-Type', 'text/plain'))
				: 'undefined' !== typeof g.XDomainRequest
				? ((d = new g.XDomainRequest()), d.open(a, b))
				: (d = null);
			return d;
		},
		sendTrackerFault: function (a) {
			this.throttle(a) || (c.isBrowser ? (l.createElement('img').src = this.trackerFaultEndpoint(a)) : fetch(this.trackerFaultEndpoint(a), { mode: 'no-cors', __trackjs__: !0 }));
		},
		sendUsage: function (a) {
			c.isBrowser ? (l.createElement('img').src = this.usageEndpoint(a)) : fetch(this.usageEndpoint(a), { mode: 'no-cors', __trackjs__: !0 });
		},
		sendError: function (a, b) {
			var d = this;
			if (!this.disabled && !this.throttle(a))
				try {
					if (c.isBrowser) {
						var e = this.getCORSRequest('POST', this.errorEndpoint(b));
						e.onreadystatechange = function () {
							4 !== e.readyState || c.contains([200, 202], e.status) || (d.disabled = !0);
						};
						e._trackJs = n;
						e.send(g.JSON.stringify(a));
					} else if (c.isWorker) {
						var f = { method: 'POST', mode: 'cors', body: g.JSON.stringify(a), __trackjs__: 1 };
						fetch(this.errorEndpoint(b), f)
							.then(function (a) {
								a.ok || (d.disabled = !0);
							})
							['catch'](function (a) {
								d.disabled = !0;
							});
					}
				} catch (h) {
					throw ((this.disabled = !0), h);
				}
		},
		throttle: function (a) {
			var b = new Date().getTime();
			this.throttleStats.attemptCount++;
			if (this.throttleStats.lastAttempt + 1e3 >= b) {
				if (((this.throttleStats.lastAttempt = b), 10 < this.throttleStats.attemptCount)) return this.throttleStats.throttledCount++, !0;
			} else (a.throttled = this.throttleStats.throttledCount), (this.throttleStats.attemptCount = 0), (this.throttleStats.lastAttempt = b), (this.throttleStats.throttledCount = 0);
			return !1;
		},
	};
	var c = (function () {
			function a(d, e, f, h) {
				f = f || !1;
				h = h || 0;
				c.forEach(e, function (e) {
					c.forEach(c.keys(e), function (c) {
						null === e[c] || e[c] === n ? (d[c] = e[c]) : f && 10 > h && '[object Object]' === b(e[c]) ? ((d[c] = d[c] || {}), a(d[c], [e[c]], f, h + 1)) : d.hasOwnProperty(c) || (d[c] = e[c]);
					});
				});
				return d;
			}
			function b(a) {
				return Object.prototype.toString.call(a);
			}
			return {
				isBrowser: 'undefined' !== typeof g && 'undefined' !== typeof g.document,
				isWorker: 'object' === typeof self && self.constructor && 0 <= (self.constructor.name || '').indexOf('WorkerGlobalScope'),
				isNode: 'undefined' !== typeof process && null != process.versions && null != process.versions.node,
				addEventListenerSafe: function (a, b, c, h) {
					a.addEventListener ? a.addEventListener(b, c, h) : a.attachEvent && a.attachEvent('on' + b, c);
				},
				afterDocumentLoad: function (a) {
					if (c.isWorker) c.defer(a);
					else {
						var b = !1;
						'complete' === l.readyState
							? c.defer(a)
							: (c.addEventListenerSafe(l, 'readystatechange', function () {
									'complete' !== l.readyState || b || (c.defer(a), (b = !0));
							  }),
							  setTimeout(function () {
									b || (c.defer(a), (b = !0));
							  }, 1e4));
					}
				},
				bind: function (a, b) {
					return function () {
						return a.apply(b, Array.prototype.slice.call(arguments));
					};
				},
				contains: function (a, b) {
					return 0 <= a.indexOf(b);
				},
				defaults: function (d) {
					return a(d, Array.prototype.slice.call(arguments, 1), !1);
				},
				defaultsDeep: function (d) {
					return a(d, Array.prototype.slice.call(arguments, 1), !0);
				},
				defer: function (a, b) {
					setTimeout(function () {
						a.apply(b);
					});
				},
				forEach: function (a, b, f) {
					if (c.isArray(a)) {
						if (a.forEach) return a.forEach(b, f);
						for (var h = 0; h < a.length; ) b.call(f, a[h], h, a), h++;
					}
				},
				getLocation: function () {
					return g.location.toString().replace(/ /g, '%20');
				},
				getLocationURL: function () {
					return c.parseURL(c.getLocation());
				},
				has: function (a, b) {
					try {
						for (var c = b.split('.'), h = a, g = 0; g < c.length; g++)
							if (h[c[g]]) h = h[c[g]];
							else return !1;
						return !0;
					} catch (k) {
						return !1;
					}
				},
				hasFunction: function (a, b) {
					try {
						return !!a[b];
					} catch (c) {
						return !1;
					}
				},
				hasOwn: function (a, b) {
					return Object.prototype.hasOwnProperty.call(a, b);
				},
				isArray: function (a) {
					return '[object Array]' === b(a);
				},
				isBoolean: function (a) {
					return 'boolean' === typeof a || (c.isObject(a) && '[object Boolean]' === b(a));
				},
				isBrowserIE: function (a) {
					a = a || g.navigator.userAgent;
					var b = a.match(/Trident\/([\d.]+)/);
					return b && '7.0' === b[1] ? 11 : (a = a.match(/MSIE ([\d.]+)/)) ? parseInt(a[1], 10) : !1;
				},
				isBrowserSupported: function () {
					var a = this.isBrowserIE();
					return !a || 8 <= a;
				},
				isError: function (a) {
					if (!c.isObject(a)) return !1;
					var e = b(a);
					return '[object Error]' === e || '[object DOMException]' === e || (c.isString(a.name) && c.isString(a.message));
				},
				isElement: function (a) {
					return c.isObject(a) && 1 === a.nodeType;
				},
				isFunction: function (a) {
					return !(!a || 'function' !== typeof a);
				},
				isNumber: function (a) {
					return 'number' === typeof a || (c.isObject(a) && '[object Number]' === b(a));
				},
				isObject: function (a) {
					return !(!a || 'object' !== typeof a);
				},
				isString: function (a) {
					return 'string' === typeof a || (!c.isArray(a) && c.isObject(a) && '[object String]' === b(a));
				},
				isWrappableFunction: function (a) {
					return this.isFunction(a) && this.hasFunction(a, 'apply');
				},
				isoNow: function () {
					var a = new Date();
					return a.toISOString
						? a.toISOString()
						: a.getUTCFullYear() +
								'-' +
								this.pad(a.getUTCMonth() + 1) +
								'-' +
								this.pad(a.getUTCDate()) +
								'T' +
								this.pad(a.getUTCHours()) +
								':' +
								this.pad(a.getUTCMinutes()) +
								':' +
								this.pad(a.getUTCSeconds()) +
								'.' +
								String((a.getUTCMilliseconds() / 1e3).toFixed(3)).slice(2, 5) +
								'Z';
				},
				keys: function (a) {
					if (!c.isObject(a)) return [];
					var b = [],
						f;
					for (f in a) a.hasOwnProperty(f) && b.push(f);
					return b;
				},
				noop: function () {},
				pad: function (a) {
					a = String(a);
					1 === a.length && (a = '0' + a);
					return a;
				},
				parseURL: function (a) {
					var b = a.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
					if (!b) return {};
					b = { protocol: b[2], host: b[4], path: b[5], query: b[6], hash: b[8] };
					b.origin = (b.protocol || '') + '://' + (b.host || '');
					b.relative = (b.path || '') + (b.query || '') + (b.hash || '');
					b.href = a;
					return b;
				},
				patch: function (a, b, f) {
					a[b] = f(a[b] || c.noop);
				},
				testCrossdomainXhr: function () {
					return c.isBrowser && 'withCredentials' in new XMLHttpRequest();
				},
				truncate: function (a, b) {
					a = '' + a;
					if (a.length <= b) return a;
					var c = a.length - b;
					return a.substr(0, b) + '...{' + c + '}';
				},
				tryGet: function (a, b) {
					try {
						return a[b];
					} catch (c) {}
				},
				uuid: function () {
					return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (a) {
						var b = (16 * Math.random()) | 0;
						return ('x' == a ? b : (b & 3) | 8).toString(16);
					});
				},
				wrapError: function (a) {
					var b = a || Object.prototype.toString.call(a);
					if (b && b.innerError) return a;
					var c = Error('Track Caught: ' + (b.message || b));
					c.description = 'Track Caught: ' + b.description;
					c.file = b.file;
					c.line = b.line || b.lineNumber;
					c.column = b.column || b.columnNumber;
					c.stack = b.stack;
					c.innerError = a;
					return c;
				},
			};
		})(),
		A = function (a, b, d, c, f, g) {
			this.util = a;
			this.log = b;
			this.onError = d;
			this.onFault = c;
			this.options = g;
			this.document = f;
			a.isBrowser && g.enabled && this.initialize(f);
		};
	A.prototype = {
		initialize: function (a) {
			var b = this.util.bind(this.onDocumentClicked, this),
				d = this.util.bind(this.onInputChanged, this);
			a.addEventListener ? (a.addEventListener('click', b, !0), a.addEventListener('blur', d, !0)) : a.attachEvent && (a.attachEvent('onclick', b), a.attachEvent('onfocusout', d));
		},
		onDocumentClicked: function (a) {
			try {
				var b = this.getElementFromEvent(a);
				b &&
					b.tagName &&
					(this.isDescribedElement(b, 'a') || this.isDescribedElement(b, 'button') || this.isDescribedElement(b, 'input', ['button', 'submit'])
						? this.writeVisitorEvent(b, 'click')
						: this.isDescribedElement(b, 'input', ['checkbox', 'radio']) && this.writeVisitorEvent(b, 'input', b.value, b.checked));
			} catch (d) {
				this.onFault(d);
			}
		},
		onInputChanged: function (a) {
			try {
				var b = this.getElementFromEvent(a);
				if (b && b.tagName)
					if (this.isDescribedElement(b, 'textarea')) this.writeVisitorEvent(b, 'input', b.value);
					else if (this.isDescribedElement(b, 'select') && b.options && b.options.length) this.onSelectInputChanged(b);
					else this.isDescribedElement(b, 'input') && !this.isDescribedElement(b, 'input', ['button', 'submit', 'hidden', 'checkbox', 'radio']) && this.writeVisitorEvent(b, 'input', b.value);
			} catch (d) {
				this.onFault(d);
			}
		},
		onSelectInputChanged: function (a) {
			if (a.multiple) for (var b = 0; b < a.options.length; b++) a.options[b].selected && this.writeVisitorEvent(a, 'input', a.options[b].value);
			else 0 <= a.selectedIndex && a.options[a.selectedIndex] && this.writeVisitorEvent(a, 'input', a.options[a.selectedIndex].value);
		},
		writeVisitorEvent: function (a, b, d, c) {
			'password' === this.getElementType(a) && (d = n);
			var f = this.getElementAttributes(a);
			a.innerText && (f.__trackjs_element_text = this.util.truncate(a.innerText, 500));
			this.log.add('v', { timestamp: this.util.isoNow(), action: b, element: { tag: a.tagName.toLowerCase(), attributes: f, value: this.getMetaValue(d, c) } });
		},
		getElementFromEvent: function (a) {
			return a.target || l.elementFromPoint(a.clientX, a.clientY);
		},
		isDescribedElement: function (a, b, d) {
			if (a.tagName.toLowerCase() !== b.toLowerCase()) return !1;
			if (!d) return !0;
			a = this.getElementType(a);
			for (b = 0; b < d.length; b++) if (d[b] === a) return !0;
			return !1;
		},
		getElementType: function (a) {
			return (a.getAttribute('type') || '').toLowerCase();
		},
		getElementAttributes: function (a) {
			for (var b = {}, d = Math.min(a.attributes.length, 10), e = 0; e < d; e++) {
				var f = a.attributes[e];
				c.contains(['data-value', 'value'], f.name.toLowerCase()) || (b[f.name] = c.truncate(f.value, 100));
			}
			return b;
		},
		getMetaValue: function (a, b) {
			return a === n ? n : { length: a.length, pattern: this.matchInputPattern(a), checked: b };
		},
		matchInputPattern: function (a) {
			return '' === a
				? 'empty'
				: /^[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(a)
				? 'email'
				: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(a) || /^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/.test(a)
				? 'date'
				: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(
						a
				  )
				? 'usphone'
				: /^\s*$/.test(a)
				? 'whitespace'
				: /^\d*$/.test(a)
				? 'numeric'
				: /^[a-zA-Z]*$/.test(a)
				? 'alpha'
				: /^[a-zA-Z0-9]*$/.test(a)
				? 'alphanumeric'
				: 'characters';
		},
		report: function () {
			return this.log.all('v');
		},
	};
	var B = function (a, b, d, c, f) {
		this.onError = a;
		this.onFault = b;
		this.serialize = d;
		f.enabled && this.watchWindowErrors(c);
		f.promise && this.watchPromiseErrors(c);
	};
	B.prototype = {
		watchPromiseErrors: function (a) {
			var b = this;
			a.addEventListener
				? a.addEventListener('unhandledrejection', function (a) {
						try {
							a = a || {};
							var e = a.detail ? c.tryGet(a.detail, 'reason') : c.tryGet(a, 'reason');
							if (e !== n && null !== e && !e.__trackjs_state__) {
								if (!c.isError(e))
									try {
										throw Error(b.serialize(e));
									} catch (f) {
										e = f;
									}
								b.onError('promise', e);
							}
						} catch (f) {
							b.onFault(f);
						}
				  })
				: c.patch(a, 'onunhandledrejection', function (a) {
						return function (c) {
							b.onError('promise', c);
							a.apply(this, arguments);
						};
				  });
		},
		watchWindowErrors: function (a) {
			var b = this;
			c.patch(a, 'onerror', function (a) {
				return function (e, f, g, l, k) {
					try {
						if (c.isError(k)) {
							b.onError('window', k);
							a.apply(this, arguments);
							return;
						}
						k = k || {};
						var m = { message: k.message || b.serialize(e), name: k.name || 'Error', line: k.line || parseInt(g, 10) || null, column: k.column || parseInt(l, 10) || null, stack: k.stack || null };
						'[object Event]' !== Object.prototype.toString.call(e) || f ? (m.file = k.file || b.serialize(f)) : (m.file = (e.target || {}).src);
						b.onError('window', m);
					} catch (n) {
						b.onFault(n);
					}
					a.apply(this, arguments);
				};
			});
		},
	};
	var C = function () {
		this.hasInstalled = !1;
		this.hasEnabled = !0;
		this.window = g;
		this.document = l;
		this.util = c;
		this.install = c.bind(this.install, this);
		this.onError = c.bind(this.onError, this);
		this.onFault = c.bind(this.onFault, this);
		this.serialize = c.bind(this.serialize, this);
		this.log = new x(c);
		this.metadata = new D(this.serialize);
		var a = g && (g._trackJs || g._trackJS || g._trackjs);
		a && this.install(a);
	};
	C.prototype = {
		install: function (a) {
			try {
				if (c.isNode) return this.warn('monitoring disabled in node'), !1;
				if (!c.has(a, 'token')) return this.warn('missing token'), !1;
				if (this.hasInstalled) return this.warn('already installed'), !1;
				this.config = new q(a);
				this.transmitter = new t(this.util, this.config);
				this.environment = new w(this.config);
				this.customer = new v(this.config, this.util, this.log, this.window, this.document);
				if (!this.config.current.enabled) return (this.hasEnabled = !1);
				this.windowConsoleWatcher = new r(this.util, this.log, this.onError, this.onFault, this.serialize, this.window, this.config.current.console);
				if (!this.util.isBrowserSupported()) return !1;
				this.callbackWatcher = new u(this.config.current.callback, this.onError, this.onFault);
				this.visitorWatcher = new A(this.util, this.log, this.onError, this.onFault, this.document, this.config.current.visitor);
				this.navigationWatcher = new y(this.log, this.config.current.navigation);
				this.networkWatcher = new z(this.util, this.log, this.onError, this.onFault, this.window, this.config.current.network);
				this.windowWatcher = new B(this.onError, this.onFault, this.serialize, this.window, this.config.current.window);
				var b = this;
				c.afterDocumentLoad(function () {
					b.transmitter.sendUsage({ token: b.customer.token, correlationId: b.customer.correlationId, application: b.config.current.application, x: b.util.uuid() });
				});
				return (this.hasInstalled = !0);
			} catch (d) {
				return this.onFault(d), !1;
			}
		},
		pub: function () {
			var a = this,
				b = {
					addMetadata: this.metadata.addMetadata,
					attempt: function (b, e) {
						try {
							var f = Array.prototype.slice.call(arguments, 2);
							return b.apply(e || this, f);
						} catch (g) {
							throw (a.onError('catch', g), c.wrapError(g));
						}
					},
					configure: function (b) {
						return !a.hasInstalled && a.hasEnabled ? (a.warn('agent must be installed'), !1) : a.config.setCurrent(b);
					},
					hash: 'fb090f9249a14e8440f317f57bd82ec8d6ea32a4',
					isInstalled: function () {
						return a.hasInstalled;
					},
					install: this.install,
					removeMetadata: this.metadata.removeMetadata,
					track: function (b) {
						if (!a.hasInstalled && a.hasEnabled) a.warn('agent must be installed');
						else {
							var e = c.isError(b) ? b.message : a.serialize(b);
							b = b || {};
							if (!b.stack)
								try {
									throw Error(e);
								} catch (f) {
									b = f;
								}
							a.onError('direct', b);
						}
					},
					version: '1.2.0',
					watch: function (b, e) {
						return function () {
							try {
								var f = Array.prototype.slice.call(arguments, 0);
								return b.apply(e || this, f);
							} catch (g) {
								throw (a.onError('catch', g), c.wrapError(g));
							}
						};
					},
					watchAll: function (a) {
						var b = Array.prototype.slice.call(arguments, 1),
							f;
						for (f in a) 'function' !== typeof a[f] || c.contains(b, f) || (a[f] = this.watch(a[f], a));
						return a;
					},
				};
			new r(c, a.log, a.onError, a.onFault, a.serialize, b, q.prototype.defaults.console);
			return b;
		},
		onError: (function () {
			var a,
				b = !1;
			return function (d, e, f) {
				if (this.hasInstalled && this.hasEnabled && c.isBrowserSupported())
					try {
						if (
							((f = f || { bindStack: null, bindTime: null, force: !1 }), (e && c.isError(e)) || (e = { name: 'Error', message: this.serialize(e, f.force) }), -1 === e.message.indexOf('Track Caught'))
						)
							if (b && -1 !== e.message.indexOf('Script error')) b = !1;
							else {
								var h = c.defaultsDeep(
									{},
									{
										agentPlatform: c.isBrowser ? 'browser' : 'worker',
										bindStack: f.bindStack,
										bindTime: f.bindTime,
										column: e.column || e.columnNumber,
										console: this.windowConsoleWatcher.report(),
										customer: this.customer.report(),
										entry: d,
										environment: this.environment.report(),
										file: e.file || e.fileName,
										line: e.line || e.lineNumber,
										message: e.message,
										metadata: this.metadata.report(),
										nav: this.navigationWatcher.report(),
										network: this.networkWatcher.report(),
										url: (g.location || '').toString(),
										stack: e.stack,
										timestamp: this.util.isoNow(),
										visitor: this.visitorWatcher.report(),
										version: '1.2.0',
									}
								);
								if (!f.force)
									try {
										if (!this.config.current.onError(h, e)) return;
									} catch (m) {
										h.console.push({ timestamp: this.util.isoNow(), severity: 'error', message: m.message });
										var l = this;
										setTimeout(function () {
											l.onError('catch', m, { force: !0 });
										}, 0);
									}
								if (this.config.current.dedupe) {
									var k = (h.message + h.stack).substr(0, 1e4);
									if (k === a) return;
									a = k;
								}
								(function () {
									function a() {
										var b = 0;
										c.forEach(h.console, function (a) {
											b += (a.message || '').length;
										});
										return 8e4 <= b;
									}
									for (var b = 0; a() && b < h.console.length; ) (h.console[b].message = c.truncate(h.console[b].message, 1e3)), b++;
								})();
								this.log.clear();
								setTimeout(function () {
									b = !1;
								});
								b = !0;
								this.transmitter.sendError(h, this.customer.token);
							}
					} catch (m) {
						this.onFault(m);
					}
			};
		})(),
		onFault: function (a) {
			var b = this.transmitter || new t();
			a = a || {};
			a = {
				token: (this.customer || {}).token,
				file: a.file || a.fileName,
				msg: a.message || 'unknown',
				stack: (a.stack || 'unknown').substr(0, 1e3),
				url: this.window.location,
				v: '1.2.0',
				h: 'fb090f9249a14e8440f317f57bd82ec8d6ea32a4',
				x: this.util.uuid(),
			};
			b.sendTrackerFault(a);
		},
		serialize: function (a, b) {
			if (this.hasInstalled && this.config.current.serialize && !b)
				try {
					return this.config.current.serialize(a);
				} catch (c) {
					this.onError('catch', c, { force: !0 });
				}
			return q.prototype.defaults.serialize(a);
		},
		warn: function (a) {
			c.has(g, 'console.warn') && g.console.warn('Track: ' + a);
		},
	};
	return new C().pub();
})('undefined' === typeof self ? void 0 : self, 'undefined' === typeof document ? void 0 : document);

export { Track };
