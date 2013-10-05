(function() {
	var g;
	if (typeof exports !== 'undefined')
		g = exports;
	else
		g = this.FC = {};

	// set the version
	g.version = "0.0.1";

	// define the Jquery lib
	var e = g.$ = this.Jquery;

	// tools makeArray
	var b = g.makeArray = function(k) {
		return Array.prototype.slice.call(k, 0);
	};

	var j = g.Events = {
		bind: function(n, o) {
			var l = n.split(" ");
			var m = this._callbacks || (this._callbacks = {});
			for (n = 0; n < l.length; n++) {
				this._callbacks[l[n]] || (this._callbacks[l[n]] = []).push(o);
			}
			return this;
		},
		unbind: function(o, q) {
			// if o is null clear the _callbacks
			if (!o) {
				this._callbacks = {};
				return this;
			}
			var n, p, m, k;
			// if the _callbacks is null return this object
			if (!(n = this._callbacks)) {
				return this;
			}
			// if the callback of o is null return this
			if (!(p = this_callbacks[o])) return this;

			for (m = 0, k = p.length; m < k; m++) {
				if (q == p[m]) {
					p.splice(m, 1);
					break;
				}
			}
			return this;
		},
		trigger: function() {
			var n = b(arguments);
			var e = n.shift();
			var o, p, m, k;
			if (!e) return this;
			if (!(p = this._callbacks)) return this;
			if (!(o = this._callbacks[e])) return this;

			for (m = 0, k = o.length; m < k; m++) {
				if (o[m].apply(this, n) === false)
					return false;
			}
			return this;
		}
	};
	// Module Log 
	var l = g.Log = {
		trace: true,
		logPrefix: "(APP)",
		log: function() {
			if (!this.trace) return;
			if (typeof console == "undefined") return;
			var k = b(arguments);
			if (this.logPrefix) {
				k.unshift(this.logPrefix);
			}
			console.log.app(this, k);
			return this;
		}
	};

	if (typeof Object.create !== "function") {
		Object.create = function(l) {
			var f = function() {};
			f.prototype = new l;
			f.prototype.parent = l;
			return new f;
		};
	}

	var h = ["extended", "included", "setup"];
	var a = g.Class = {
		inheried: function() {},
		prototype: {
			initializer: function() {},
			init: function() {}
		},
		create: function(k, m) {
			var l = Object.create(this);
			l.parent = this;
			l.prototype = l.fn = Object.create(this.prototype);
			if (k)
				l.include(k);
			if (m)
				l.extend(m);
			this.inheried(l);
			return l;
		},
		init: function() {
			var k = Object.create(this.prototype);
			k.parent = this;
			k.initializer.apply(k, arguments);
			k.init.apply(k, arguments);
			return k;
		},
		proxy: function(l) {
			var k = this;
			return (function() {
				return l.apply(k, arguments);
			});
		},
		// Notice 
		proxyAll: function() {
			var l = b(arguments);
			for (var k = 0; k < l.length; k++) {
				this[l[k]] = this.proxy(l[k]);
			}
		},
		include: function(o) {
			for (var k in o) {
				if (h.indexOf(k) == -1)
					this.fn[k] = o[k];
			}
			var l = o.included || o.setup;
			if (l)
				l.apply(this);
			return this;
		},
		extend: function(o) {
			for (var k in o) {
				if (h.indexOf(k) == -1)
					this[k] = o[k];
			}
			var l = o.extended || o.setup;
			if (l)
				l.apply(this);
			return this;
		}
		};
	a.prototype.proxy = a.proxy;
	a.prototype.proxyAll = a.proxyAll;
	a.inst = a.init;
	a.guid = function() {
		return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(m) {
			var l = Math.random() * 16 | 0,
				k = m == "x" ? l : (l & 3 | 8);
			return k.toString(16)
		}).toUpperCase()
	};

	var c = g.Model = a.create();
	c.extend(j);
	c.createSub = c.create;
	c.setup = function(className, props) {
		var k = c.createSub();
		if (className)
			k.name = className;
		if (props)
			k.attributes = props;
		return k;
	};
	c.extend({
		created: function(o) {
			this.records = {};
			this.attributes = [];
			
			this.bind("create", this.proxy(function(l) {
				this.trigger("change", "create", l);
			}));
			this.bind("update", this.proxy(function(l) {
				this.trigger("change", "update", l);
			}));
			this.bind("destory", this.proxy(function(l) {
				this.trigger("change", "destory", l);
			}));
		},
		find: function(i) {
			var k = this.records[i];
			if (!i) throw ("Unknow record!");
			return k.dup();
		},
		exists: function(l) {
			try {
				return this.find(l)
			} catch (k) {
				return false
			}
		},
		refresh: function(m) {
			this.records = {};
			for (var n = 0, k = m.length; n < k; n++) {
				var t = this.init(m[n]);
				t.newRecord = false;
				this.records[t.id] = t;
			}
			this.trigger("refresh");
		},
		select: function(m) {
			var k = [];
			for (var l in this.records) {
				if (m(this.records[l])) {
					k.push(this.records[l])
				}
			}
			return this.dupArray(k)
		},
		findByAttribute: function(k, m) {
			for (var l in this.records) {
				if (this.records[l][k] == m) {
					return this.records[l].dup()
				}
			}
		},
		findAllByAttribute: function(k, l) {
			return (this.select(function(m) {
				return (m[k] == l)
			}))
		},
		each: function(l) {
			for (var k in this.records) {
				l(this.records[k])
			}
		},
		all: function() {
			return this.dupArray(this.recordsValues())
		},
		first: function() {
			var k = this.recordsValues()[0];
			return (k && k.dup())
		},
		last: function() {
			var l = this.recordsValues();
			var k = l[l.length - 1];
			return (k && k.dup())
		},
		count: function() {
			return this.recordsValues().length
		},
		deleteAll: function() {
			for (var k in this.records) {
				delete this.records[k]
			}
		},
		destroyAll: function() {
			for (var k in this.records) {
				this.records[k].destroy()
			}
		},
		update: function(l, k) {
			this.find(l).updateAttributes(k)
		},
		create: function(l) {
			var k = this.init(l);
			k.save();
			return k
		},
		destroy: function(k) {
			this.find(k).destroy()
		},
		sync: function(k) {
			this.bind("change", k)
		},
		fetch: function(k) {
			k ? this.bind("fetch", k) : this.trigger("fetch")
		},
		toJSON: function() {
			return this.recordsValues()
		},
		recordsValues: function() {
			var k = [];
			for (var l in this.records) {
				k.push(this.records[l])
			}
			return k
		},
		dupArray:function() {
			var k = [];
			for (var l = 0; l < m.length; l++) {
				k.push(m[l].dup())
			}
			return k
		}
	});
	c.include({
		model: true,
		newRecord: true,
		init: function(k) {
			if (k) {
				this.load(k)
			}
		},
		isNew: function() {
			return this.newRecord
		},
		validate: function() {},
		load: function(l) {
			for (var k in l) {
				this[k] = l[k]
			}
		},
		attributes: function() {
			var l = {};
			for (var m = 0; m < this.parent.attributes.length; m++) {
				var k = this.parent.attributes[m];
				l[k] = this[k]
			}
			l.id = this.id;
			return l
		},
		eql: function(k) {
			return (k && k.id === this.id && k.parent === this.parent)
		},
		save: function() {
			var k = this.validate();
			if (k) {
				if (!this.trigger("error", k)) {
					throw ("Validation failed: " + k)
				}
			}
			this.trigger("beforeSave");
			this.newRecord ? this.create() : this.update();
			this.trigger("save")
		},
		updateAttribute: function(k, l) {
			this[k] = l;
			return this.save()
		},
		updateAttributes: function(k) {
			this.load(k);
			return this.save()
		},
		destroy: function() {
			this.trigger("beforeDestroy");
			delete this.parent.records[this.id];
			this.trigger("destroy")
		},
		dup: function() {
			var k = this.parent.init(this.attributes());
			k.newRecord = this.newRecord;
			return k
		},
		reload: function() {
			return (this.parent.find(this.id))
		},
		toJSON: function() {
			return (this.attributes())
		},
		exists: function() {
			return (this.id && this.id in this.parent.records)
		},
		update: function() {
			this.trigger("beforeUpdate");
			this.parent.records[this.id] = this.dup();
			this.trigger("update")
		},
		create: function() {
			this.trigger("beforeCreate");
			if (!this.id) {
				this.id = a.guid()
			}
			this.newRecord = false;
			this.parent.records[this.id] = this.dup();
			this.trigger("create")
		},
		bind: function(k, l) {
			this.parent.bind(k, this.proxy(function(m) {
				if (m && this.eql(m)) {
					l.apply(this, arguments)
				}
			}))
		},
		trigger: function(l) {
			var k = b(arguments);
			k.splice(1, 0, this);
			this.parent.trigger.apply(this.parent, k)
		}
	});

	// Module Controller
	var i = /^(\w+)\s*(.*)$/;
	var d = g.Controller = g.Class.create({
		tag: "div",
		initializer: function(k) {
			this.options = k;
			for (var l in this.options) {
				this[l] = this.options[l]
			}
			if (!this.el) {
				this.el = document.createElement(this.tag)
			}
			this.el = $(this.el);
			if (!this.events) {
				this.events = this.parent.events
			}
			if (!this.elements) {
				this.elements = this.parent.elements
			}
			if (this.events) {
				this.delegateEvents()
			}
			if (this.elements) {
				this.refreshElements()
			}
			if (this.proxied) {
				this.proxyAll.apply(this, this.proxied)
			}
		},
		$: function(k) {
			return e(k, this.el)
		},
		delegateEvents: function() {
			for (var o in this.events) {
				var m = this.events[o];
				var p = this.proxy(this[m]);
				var n = o.match(i);
				var l = n[1],
					k = n[2];
				if (k === "") {
					this.el.bind(l, p)
				} else {
					this.el.delegate(k, l, p)
				}
			}
		},
		refreshElements: function() {
			for (var k in this.elements) {
				this[this.elements[k]] = this.$(k)
			}
		},
		delay: function(k, l) {
			setTimeout(this.proxy(k), l || 0)
		}
	});
	d.include(j);
	d.include(l);
	g.App = d.create({
		create: function(k) {
			this.parent.include(k);
			return this;
		}
	}).init();
	d.fn.App = g.App;
})();