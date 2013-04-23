KISSY.use('node, event', function(S, N, E) {

	if (S.DOM.viewportWidth() <= 480) {

		var oCustomEvt = S.merge({}, S.EventTarget);

		oCustomEvt.on('show', function(ev) {
			var element = ev.node;
			element.show();
			var lists = element.all('.level-1');
			var length = lists.length;
			lists.each(function(el, index) {
				if(index < 7){
					el.css('margin-left', '-320px');
					S.later(function() {
						S.Anim(el, {
							'margin-left': 0
						}, 0.4, 'easeOutStrong').run();
						// el.removeClass('hide').addClass('show');
						// el.css('margin-left', '0');
					}, 150 * index);
				}
			});
			ev.callback && S.later(function() {
				ev.callback();
			}, 150 * 6);
		});

		oCustomEvt.on('hide', function(ev) {
			var element = ev.node;
			var lists = element.all('.level-1');
			var length = lists.length;
			// var extra = ev.direction === 'left' ? '-' : '';
			lists.each(function(el, index) {
				if(index < 7){
					S.later(function() {
						S.Anim(el, {
							'margin-left': '-320px'
						}, 0.3, 'easeOutStrong').run();
						// el.replaceClass('show', 'hide');
						// el.css('margin-left', '-320px');
					}, 100 * index);
				}
			});
			ev.callback && S.later(function() {
				element.hide();
				ev.callback();
			}, 100 * 6);
		});

		oCustomEvt.fire('show', {
			node: S.one('#cats'),
			callback: function(){
				window.scrollTo(0, 1);
			}
		});

		S.all('li.catelog').on(E.Gesture.tap, function(ev) {
			S.one('.mobile-search').hide();
			var arrow = S.one(this).one('i');
			arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
			S.one(this).one('ul').slideToggle(0.4);
		});

		function homeToList(o){
			window.scrollTo(0, 1);
			oCustomEvt.fire('hide', {
				node: S.one('#cats'),
				callback: function() {
					S.one('#head').one('.navigator').addClass('home').css('visibility', 'visible');
					S.one('#head').one('h1').html(o.title);
					oCustomEvt.fire('show', {
						node: S.one('#list')
					});
				}
			});
		}

		S.one('li.today').add('li.all').add('li.star').add('li.list-detail').on(E.Gesture.tap, function(ev) {
			S.one('.mobile-search').hide();
			var curTitle;
			var self = S.one(this);
			if(self.hasClass('today')){
				curTitle = 'today';
			}
			else if(self.hasClass('all')){
				curTitle = 'all';
			}
			else if(self.hasClass('star')){
				curTitle = 'star';
			}
			else {
				curTitle = self.html().split('<')[0].trim();
			}
			homeToList({'title': curTitle});
		});

		S.one('#list').all('li').on(E.Gesture.start, function(ev) {
			S.one('.mobile-search').hide();
			this.isDown = true;
			this.isMoving = 0;
			this.originX = ev.pageX;
			this.originY = ev.pageY;
		});
		S.one('#list').all('li').on(E.Gesture.move, function(ev) {
			var self = this;
			if (self.isDown) {
				self.isMoving = 1;
				self.currentX = ev.pageX;
				self.currentY = ev.pageY;
				self.deltaX = self.currentX - self.originX;
				self.deltaY = self.currentY - self.originY;
				if(Math.abs(self.deltaY) <= 20){
					self.deltaX % 3 === 0 && S.one(self).css('margin-left', self.deltaX / 3);					
				}
			}
		});
		S.one('#list').all('li').on(E.Gesture.end, function(ev) {
			if (this.isMoving === 1) {
				this.isDown = false;
				this.isMoving = 2;
				S.one(this).animate({
					'margin-left': 0
				}, 0.5, 'easeOutStrong');
			}
		});

		function listToDetail(o){
			window.scrollTo(0, 1);
			oCustomEvt.fire('hide', {
				node: S.one('#list'),
				callback: function() {
					S.one('#head').one('.navigator').replaceClass('home', 'main-list');
					S.one('#head').one('h1').html(o.title);
					S.one('#entry').fadeIn();
				}
			});
		}

		S.one('#list').all('li').on(E.Gesture.tap, function(ev) {
			ev.halt();
			this.isDown = false;
			if (this.isMoving === 1 || this.isMoving === 2) {
				return;
			}
			var curTitle = S.one(this).one('h3').html();
			listToDetail({'title': curTitle});
		});

		function listToHome(){
			window.scrollTo(0, 1);
			S.Anim(S.one('#list'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				S.one('.navigator').removeClass('home').css('visibility', 'hidden');
				S.one('#head').one('h1').html('Simple Reader');
				S.one('#cats').all('span.down').replaceClass('down', 'right');
				S.one('#cats').all('ul.level-2').hide();
				oCustomEvt.fire('show', {
					node: S.one('#cats'),
					callback: function(){
						S.one('#list').css('margin-left', 0).hide();
					}
				});
			}).run();
		}

		function detailToList(){
			window.scrollTo(0, 1);
			S.Anim(S.one('#entry'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				S.one('.navigator').replaceClass('main-list', 'home');
				S.one('#head').one('h1').html('list');
				oCustomEvt.fire('show', {
					node: S.one('#list'),
					callback: function(){
						S.one('#entry').css('margin-left', 0).hide();
					}
				});
			}).run();
		}

		S.one('.navigator').on(E.Gesture.tap, function(ev) {
			S.one('.mobile-search').hide();
			var self = this;
			if (S.one(self).hasClass('home')) {
				listToHome();
			} else if (S.one(this).hasClass('main-list')) {
				detailToList();
			}
		});

		E.on('#list', "swipe", function(e) {
			if (e.direction === 'right' && e.distance >= 100) {
				listToHome();
			}
		});

		E.on('#entry', "swipe", function(e) {
			if (e.direction === 'right' && e.distance >= 100) {
				detailToList();
			}
		});

		S.one('.toggle-read').on(E.Gesture.tap, function(ev){
			S.one('.mobile-search').hide();
			var el = S.one(this).one('i');
			el.hasClass('icon-circle')?el.replaceClass('icon-circle', 'icon-circle-blank'):el.replaceClass('icon-circle-blank', 'icon-circle');
		});

		S.one('.toggle-star').on(E.Gesture.tap, function(ev){
			S.one('.mobile-search').hide();
			var el = S.one(this).one('i');
			el.hasClass('icon-heart-empty')?el.replaceClass('icon-heart-empty', 'icon-heart'):el.replaceClass('icon-heart', 'icon-heart-empty');
		});

		S.one('.search').on(E.Gesture.tap, function(ev) {
			S.one('.mobile-search').slideDown(0.4);
		});

		S.one('.J_Cancel').on(E.Gesture.tap, function(ev) {
			S.one('.mobile-search').fadeOut(0.4);
		});
	}

});