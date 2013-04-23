KISSY.add(function(S) {

	function leftToShow(element) {
		element.show();
		var lists = element.all('.level-1');
		lists.css('margin-left', '-320px').each(function(el, index) {
			if (index < 7) {
				S.later(function() {
					S.Anim(el, {
						'margin-left': 0
					}, 0.4, 'easeOutStrong').run();
					// el.removeClass('hide').addClass('show');
					// el.css('margin-left', '0');
				}, 150 * index);
			} else {
				el.css('margin-left', '0');
			}
		});
	}

	function hideToLeft(element) {
		var lists = element.all('.level-1');
		// var extra = ev.direction === 'left' ? '-' : '';
		lists.each(function(el, index) {
			if (index < 7) {
				S.later(function() {
					S.Anim(el, {
						'margin-left': '-320px'
					}, 0.3, 'easeOutStrong').run();
					// el.replaceClass('show', 'hide');
					// el.css('margin-left', '-320px');
				}, 100 * index);
			} else {
				el.css('margin-left', '-320px');
			}
		});
	}

	var oCustomEvt = S.merge({}, S.EventTarget);

	oCustomEvt.on('show', function(ev) {
		leftToShow(ev.node);
		ev.callback && S.later(function() {
			ev.callback();
		}, 800);
	});

	oCustomEvt.on('hide', function(ev) {
		hideToLeft(ev.node);
		ev.callback && S.later(function() {
			ev.node.hide();
			ev.callback();
		}, 500);
	});

	return oCustomEvt;
});