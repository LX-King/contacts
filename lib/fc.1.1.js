(function(){
	var FC ,$;
	if(typeof exports !== "undefined")
		FC = exports;
	else
		FC = this.FC = {};
	
	// set version
	FC.version = "0.1.1";

	// export jQuery 
	var $ = FC.jQuery = FC.$ = this.jQuery;
	
	// FC tools
	FC.toArray = function(args){
		return Array.prototype.slice.call(args,0);
	}

	// Module Log
	var Log = FC.Log = {
		trace:true,
		logPrefix:"(App)",

		log:function(l){
			if(!trace) return;
			if(typeof console == "undefined") return;
			var args = FC.toArray(l);
			if(logPrefix)args.unshift(this.logPrefix);
			console.log.apply(this,args);
			return this;
		}
	};

	// Module Class
	if(typeof Object.create == "undefined"){
		Object.create = function(o){
			function fun(){}
			fun.prototype = o;
			fun.parent = o;
			return new fun;
		}
	}
	var Class = FC.Class = {
		prototype:{
			init:function(){}
		},
		create:function(){
			var class = Object.create(this);
			class.fn = class.prototype = Object.create(this.prototype);
			return class;
		},
		extend:function(o){
			var class = Object.create(this);
			if(!o) return;
			for(var p in o){
				class[p] = o[p];
			}
			return class;
		},
		include:function(o){
			var instance = Object.create(this);
			if(!o) return;
			for(var p in o){
				instance.prototype[p] = o[p];
			}
			return instacne;
		}
	};


	// Module Events
	var Events = FC.Events = {};


	// Module Model
	var Model = FC.Model = {};


	// Module Controller
	var Controller = FC.Controller 

});