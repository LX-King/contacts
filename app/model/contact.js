var Contact = FC.Model.create("Contact",["first_name","last_name","email"]);
Contact.extend({
	fullName:function(){
		if(!this.first_name && !this.last_name ) return;
		return (this.first_name+" "+this.last_name);
	}
});