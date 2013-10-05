(function(global,$){
	var fc = function(){};
	fc.create = function(){
		var klass = function(){ this.init.apply(this,arguments)};
		klass.fn = klass.prototype;
		klass.parent = fc;

		klass.fn.init = function(){};
		klass.extend = function(o){$.extend(klass,o)};
		klass.include = function(o) {$.extend(klass.fn,o)};
		klass.proxy = function(fn){return $.proxy(fn,this);};
		klass.guid = function(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){
				var r = Math.random()*16|0 ,v = c == 'x' ? r:(r&0x3|0x8);
				return v.toString(16);
			}).toUpperCase();
		}
		klass.fn.proxy = klass.proxy;
		return klass;
	}
	fc.Model = fc.create();
	fc.Model.extend({
		create:function(className,props){
			if(!fc.Model.mList) fc.Model.mList = {};
			fc.Model.mList[className] = fc.Model.mList[className] || function(){this.init.apply(this,arguments)};
			var subModel = fc.Model.mList[className];

			subModel.super = fc.Model;
			subModel.name = className;
			subModel.fn = subModel.prototype;
			subModel.records = {};

			

			subModel.fn.init = function(attributes){
				this.parent = subModel;
				this.id = subModel.super.guid();
				this.newRecord = false;
				this.parent.records[this.id] = this;
				this.props = this.props || {};	
				for(var p in attributes){
					this[p] = attributes[p]||{}; 
					this.props[p] = p;
				}
			};
			subModel.fn.destroy = function(){
				delete this.parent.records[this.id];
			}
			subModel.find = function(id){ var record = this.records[id]; if(!record) throw("Unknown record!");return record.dup();};
			subModel.fn.update = function(){ this.parent.records[id] = this.dup();};
			subModel.fn.save = function(){this.update();};
			subModel.fn.getter = function(propName){return this[propName] || null ; };
			subModel.fn.setter = function(propName,value){ this[propName] ? this[propName] = value : null };
			subModel.fn.dup = function(){return $.extend(true,{},this);};
			subModel.fn.toString = function(){
			 var str = '';
			 for(var p in this.props)
			 	str += this.props[p]+":"+this[p]+",";
			 console.log("I am " + str);};

			return subModel;
		}
	}) 
	global.FC = fc;
})(window,jQuery);