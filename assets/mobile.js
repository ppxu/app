KISSY.use('node, event', function(S, N, E) {

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

	var pageSwitch = {
		loadHome: function() {
			oCustomEvt.fire('show', {
				node: S.one('#cats'),
				callback: function() {
					window.scrollTo(0, 1);
				}
			});
		},
		homeToList: function(cfg) {
			oCustomEvt.fire('hide', {
				node: S.one('#cats'),
				callback: function() {
					S.one('#list').one('.column-actions').show();
					S.one('.navigator').addClass('home').css('visibility', 'visible');
					S.one('#head').one('h1').html(cfg.title);
					S.one('#head').one('h1').attr('list_title', cfg.title);
					oCustomEvt.fire('show', {
						node: S.one('#list'),
						callback: function() {
							window.scrollTo(0, 1);
						}
					});
				}
			});
		},
		listToDetail: function(cfg) {
			oCustomEvt.fire('hide', {
				node: S.one('#list'),
				callback: function() {
					S.one('#entry').one('.column-actions').show();
					S.one('.navigator').replaceClass('home', 'main-list');
					S.one('#head').one('h1').html(cfg.title);
					S.one('#entry').fadeIn();
					window.scrollTo(0, 1);
				}
			});
		},
		listToHome: function() {
			S.Anim(S.one('#list'), {
				'margin-left': '320px'
			}, 0.4, 'easeOutStrong', function() {
				S.one('#list').one('.column-actions').hide();
				S.one('.navigator').removeClass('home').css('visibility', 'hidden');
				S.one('#head').one('h1').html('Simple Reader');
				S.one('#cats').all('span.down').replaceClass('down', 'right');
				S.one('#cats').all('ul.level-2').hide();
				oCustomEvt.fire('show', {
					node: S.one('#cats'),
					callback: function() {
						window.scrollTo(0, 1);
						S.one('#list').css('margin-left', 0).hide();
					}
				});
			}).run();
		},
		detailToList: function() {
			S.Anim(S.one('#entry'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				S.one('#entry').one('.column-actions').hide();
				S.one('.navigator').replaceClass('main-list', 'home');
				S.one('#head').one('h1').html(S.one('#head').one('h1').attr('list_title'));
				oCustomEvt.fire('show', {
					node: S.one('#list'),
					callback: function() {
						window.scrollTo(0, 1);
						S.one('#entry').css('margin-left', 0).hide();
					}
				});
			}).run();
		}
	};

	var Mobile = {
		init: function() {
			if (S.DOM.viewportWidth() > 480) {
				return;
			}

			pageSwitch.loadHome();

			S.all('li.catelog').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var arrow = S.one(this).one('i');
				arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
				S.one(this).one('ul').slideToggle(0.4);
			});

			S.one('li.today').add('li.all').add('li.star').add('li.list-detail').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var curTitle;
				var self = S.one(this);
				if (self.hasClass('today')) {
					curTitle = '今日';
				} else if (self.hasClass('all')) {
					curTitle = '全部';
				} else if (self.hasClass('star')) {
					curTitle = '收藏';
				} else {
					curTitle = self.html().split('<')[0].trim();
				}
				pageSwitch.homeToList({
					'title': curTitle
				});
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
					if (Math.abs(self.deltaY) <= 20) {
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

			S.one('#list').all('li').on(E.Gesture.tap, function(ev) {
				ev.halt();
				this.isDown = false;
				if (this.isMoving === 1 || this.isMoving === 2) {
					return;
				}
				var curTitle = S.one(this).one('h3').html();
				pageSwitch.listToDetail({
					'title': curTitle
				});
			});

			S.one('.navigator').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var self = S.one(this);
				if (self.hasClass('home')) {
					pageSwitch.listToHome();
				} else if (self.hasClass('main-list')) {
					pageSwitch.detailToList();
				}
			});

			E.on('#list', "swipe", function(e) {
				if (e.direction === 'right' && e.distance >= 100) {
					pageSwitch.listToHome();
				}
			});

			E.on('#entry', "swipe", function(e) {
				if (e.direction === 'right' && e.distance >= 100) {
					pageSwitch.detailToList();
				}
			});

			S.one('.toggle-read').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var el = S.one(this).one('i');
				el.hasClass('icon-circle') ? el.replaceClass('icon-circle', 'icon-circle-blank') : el.replaceClass('icon-circle-blank', 'icon-circle');
			});

			S.one('.toggle-star').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var el = S.one(this).one('i');
				el.hasClass('icon-heart-empty') ? el.replaceClass('icon-heart-empty', 'icon-heart') : el.replaceClass('icon-heart', 'icon-heart-empty');
			});

			S.one('.search').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').slideToggle(0.4);
			});

			S.one('.J_Cancel').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').fadeOut(0.4);
			});

		}
	};

	Mobile.init();

});