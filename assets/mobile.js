KISSY.add(function(S, N, E, oCustomEvt){

	var Mobile = {
		init: function(){
			if (S.DOM.viewportWidth() > 480){
				return;
			}

			oCustomEvt.fire('show', {
				node: S.one('#cats'),
				callback: function(){
					window.scrollTo(0, 1);
				}
			});
		}
	};

	return Mobile;
}, {requires: ['node', 'event', './mods/event_center']});