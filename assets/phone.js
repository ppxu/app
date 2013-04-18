! function(S) {
	S.use('node, event', function(S, N, E) {

		if (S.DOM.viewportWidth() <= 480) {

			window.scrollTo(0, 1);

			oCustomEvt = S.merge({}, S.EventTarget),

			oCustomEvt.on('show', function(ev) {
				var el = ev.node;
				el.show();
				var lists = el.all('.level-1');
				var length = lists.length;
				lists.each(function(el, index) {
					el.css('margin-left', '-' + el.outerWidth() + 'px');
					S.later(function() {
						S.Anim(el, {
							'margin-left': 0
						}, 0.4, 'easeOutStrong').run();
					}, 150 * index);
				});
				ev.callback && S.later(function() {
					ev.callback();
				}, 150 * length);
			});

			oCustomEvt.on('hide', function(ev) {
				var el = ev.node;
				var lists = el.all('.level-1');
				var length = lists.length;
				var extra = ev.direction === 'left' ? '-' : '';
				lists.each(function(el, index) {
					S.later(function() {
						S.Anim(el, {
							'margin-left': extra + el.outerWidth() + 'px'
						}, 0.3, 'easeOutStrong').run();
					}, 100 * index);
				});
				ev.callback && S.later(function() {
					ev.callback();
				}, 100 * length);
			});

			oCustomEvt.fire('show', {
				node: S.one('#cats'),
				callback: function() {
					window.scrollTo(0, 1);
				}
			});

			S.all('li.catelog').on(E.Gesture.tap, function(ev) {
				ev.halt();
				var el = ev.target;
				var arrow = S.one(el).one('i');
				arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
				S.one(el).one('ul').slideToggle(0.4);
			});

			S.one('li.today').add('li.all').add('li.star').add('li.list-detail').on(E.Gesture.tap, function(ev) {
				ev.halt();
				oCustomEvt.fire('hide', {
					node: S.one('#cats'),
					direction: 'left',
					callback: function() {
						window.scrollTo(0, 1);
						S.one('#cats').hide();
						S.one('#head').one('.navigator').addClass('home').css('visibility', 'visible');
						S.one('#head').one('h1').html('list');
						oCustomEvt.fire('show', {
							node: S.one('#list')
						});
					}
				});
			});

			S.one('#list').all('li').on(E.Gesture.start, function(ev) {
				this.isDown = true;
				this.isMoving = 0;
				this.originX = ev.pageX;
				this.originY = ev.pageY;
			});
			S.one('#list').all('li').on(E.Gesture.move, function(ev) {
				var self = this;
				if(self.isDown){
					self.timer = setTimeout(function(){
						self.isMoving = 1;
						self.currentX = ev.pageX;
						self.currentY = ev.pageY;
						self.deltaX = self.currentX - self.originX;
						S.one(self).css('margin-left', self.deltaX / 2);
					}, 300);
				}
			});
			S.one('#list').all('li').on(E.Gesture.end, function(ev) {
				if(this.isMoving === 1){
					this.isDown = false;
					this.isMoving = 2;
					S.one(this).animate({'margin-left': 0}, 0.5, 'easeOutStrong');
				}
			});

			S.one('#list').all('li').on(E.Gesture.tap, function(ev) {
				this.isDown = false;
				if(this.isMoving === 1 || this.isMoving === 2){
					return;
				}
				oCustomEvt.fire('hide', {
					node: S.one('#list'),
					direction: 'left',
					callback: function() {
						window.scrollTo(0, 1);
						S.one('#list').hide();
						S.one('#head').one('.navigator').replaceClass('home', 'main-list');
						S.one('#head').one('h1').html('detail');
						S.one('#entry').fadeIn();
					}
				});
			});

			S.one('.navigator').on(E.Gesture.tap, function(ev) {
				ev.halt();
				var self = this;
				if(S.one(self).hasClass('home')){
					S.Anim(S.one('#list'), {'margin-left': '100%'}, 0.4, 'easeOutStrong', function(){
						window.scrollTo(0, 1);
						S.one(self).removeClass('home').css('visibility', 'hidden');
						S.one('#head').one('h1').html('Simple Reader');
						S.one('#list').css('margin-left', 0).hide();
						S.one('#cats').all('span.down').replaceClass('down','right');
						S.one('#cats').all('ul.level-2').hide();
						oCustomEvt.fire('show', {
							node: S.one('#cats')
						});
					}).run();
				}
				else if(S.one(this).hasClass('main-list')){
					S.Anim(S.one('#entry'), {'margin-left': '100%'}, 0.4, 'easeOutStrong', function(){
						window.scrollTo(0, 1);
						S.one(self).replaceClass('main-list', 'home');
						S.one('#head').one('h1').html('list');
						S.one('#entry').css('margin-left', 0).hide();
						oCustomEvt.fire('show', {
							node: S.one('#list')
						});
					}).run();
				}
			});

			E.on('#list', "swipe", function (e) {
				if(e.direction === 'right' && e.distance >= 100){
					S.Anim(S.one('#list'), {'margin-left': '100%'}, 0.4, 'easeOutStrong', function(){
						window.scrollTo(0, 1);
						S.one('.navigator').removeClass('home').css('visibility', 'hidden');
						S.one('#head').one('h1').html('Simple Reader');
						S.one('#list').css('margin-left', 0).hide();
						S.one('#cats').all('span.down').replaceClass('down','right');
						S.one('#cats').all('ul.level-2').hide();
						oCustomEvt.fire('show', {
							node: S.one('#cats')
						});
					}).run();
				}
			});

			E.on('#entry', "swipe", function (e) {
				if(e.direction === 'right' && e.distance >= 100){
					S.Anim(S.one('#entry'), {'margin-left': '100%'}, 0.4, 'easeOutStrong', function(){
						window.scrollTo(0, 1);
						S.one('.navigator').replaceClass('main-list', 'home');
						S.one('#head').one('h1').html('list');
						S.one('#entry').css('margin-left', 0).hide();
						oCustomEvt.fire('show', {
							node: S.one('#list')
						});
					}).run();
				}
			});

			S.one('.search').on(E.Gesture.tap, function(ev) {
				alert('search');
			});
		}

	});
}(KISSY);