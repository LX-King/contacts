	jQuery(function($) {
		window.Sidebar = FC.Controller.create({
			elements:{
				".items":"items"
			},
			events:{
				"click button":"create"
			},
			proxied:["render"],

		});
	});