KISSY.use('node, event', function(S, N, E) {

	if (S.DOM.viewportWidth() <= 480) {

		window.scrollTo(0, 1);

		oCustomEvt = S.merge({}, S.EventTarget),

		oCustomEvt.on('show', function(ev) {
			var el = ev.node;
			el.show();
			var lists = el.all('.level-1');
			var length = lists.length;
			lists.each(function(el, index) {
				if(index < 6){
					el.css('margin-left', '-320px');
					S.later(function() {
						/*S.Anim(el, {
							'margin-left': 0
						}, 0.4, 'easeOutStrong').run();*/
						el.addClass('show');
						el.css('margin-left', '0');
						// el.removeClass('show');
					}, 150 * index);
				}
			});
			ev.callback && S.later(function() {
				ev.callback();
			}, 150 * length);
		});

		oCustomEvt.on('hide', function(ev) {
			var el = ev.node;
			var lists = el.all('.level-1');
			var length = lists.length;
			// var extra = ev.direction === 'left' ? '-' : '';
			lists.each(function(el, index) {
				if(index < 6){
					S.later(function() {
						/*S.Anim(el, {
							'margin-left': extra + el.outerWidth() + 'px'
						}, 0.3, 'easeOutStrong').run();*/
						el.replaceClass('show', 'hide');
						el.css('margin-left', '-320px');
					}, 100 * index);
				}
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
			var arrow = S.one(this).one('i');
			arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
			S.one(this).one('ul').slideToggle(0.4);
		});

		function homeToList(o){
			oCustomEvt.fire('hide', {
				node: S.one('#cats'),
				callback: function() {
					window.scrollTo(0, 1);
					S.one('#cats').hide();
					S.one('#head').one('.navigator').addClass('home').css('visibility', 'visible');
					S.one('#head').one('h1').html(o.title);
					oCustomEvt.fire('show', {
						node: S.one('#list')
					});
				}
			});
		}

		S.one('li.today').add('li.all').add('li.star').add('li.list-detail').on(E.Gesture.tap, function(ev) {
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
			ev.halt();
			this.isDown = true;
			this.isMoving = 0;
			this.originX = ev.pageX;
		});
		S.one('#list').all('li').on(E.Gesture.move, function(ev) {
			ev.halt();
			var self = this;
			if (self.isDown) {
				self.isMoving = 1;
				self.currentX = ev.pageX;
				self.deltaX = self.currentX - self.originX;
				self.deltaX % 3 === 0 && S.one(self).css('margin-left', self.deltaX / 3);
			}
		});
		S.one('#list').all('li').on(E.Gesture.end, function(ev) {
			ev.halt();
			if (this.isMoving === 1) {
				this.isDown = false;
				this.isMoving = 2;
				S.one(this).animate({
					'margin-left': 0
				}, 0.5, 'easeOutStrong');
			}
		});

		function listToDetail(o){
			oCustomEvt.fire('hide', {
				node: S.one('#list'),
				direction: 'left',
				callback: function() {
					window.scrollTo(0, 1);
					S.one('#list').hide();
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
			S.Anim(S.one('#list'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				window.scrollTo(0, 1);
				S.one('.navigator').removeClass('home').css('visibility', 'hidden');
				S.one('#head').one('h1').html('Simple Reader');
				S.one('#list').css('margin-left', 0).hide();
				S.one('#cats').all('span.down').replaceClass('down', 'right');
				S.one('#cats').all('ul.level-2').hide();
				oCustomEvt.fire('show', {
					node: S.one('#cats')
				});
			}).run();
		}

		function detailToList(){
			S.Anim(S.one('#entry'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				window.scrollTo(0, 1);
				S.one('.navigator').replaceClass('main-list', 'home');
				S.one('#head').one('h1').html('list');
				S.one('#entry').css('margin-left', 0).hide();
				oCustomEvt.fire('show', {
					node: S.one('#list')
				});
			}).run();
		}

		S.one('.navigator').on(E.Gesture.tap, function(ev) {
			var self = this;
			if (S.one(self).hasClass('home')) {
				listToHome();
			} else if (S.one(this).hasClass('main-list')) {
				detailToList();
			}
		});

		E.on('#list', "swipe", function(e) {
			if (e.direction === 'right' && e.distance >= 100) {
				S.Anim(S.one('#list'), {
					'margin-left': '100%'
				}, 0.4, 'easeOutStrong', function() {
					window.scrollTo(0, 1);
					S.one('.navigator').removeClass('home').css('visibility', 'hidden');
					S.one('#head').one('h1').html('Simple Reader');
					S.one('#list').css('margin-left', 0).hide();
					S.one('#cats').all('span.down').replaceClass('down', 'right');
					S.one('#cats').all('ul.level-2').hide();
					oCustomEvt.fire('show', {
						node: S.one('#cats')
					});
				}).run();
			}
		});

		E.on('#entry', "swipe", function(e) {
			if (e.direction === 'right' && e.distance >= 100) {
				S.Anim(S.one('#entry'), {
					'margin-left': '100%'
				}, 0.4, 'easeOutStrong', function() {
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