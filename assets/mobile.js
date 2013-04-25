KISSY.add('mobile', function(S, N, E) {

	//动画集合
	var animateCollection = {
		leftToShow: function(element) {
			element.show();
			window.scrollTo(0, 1);
			var lists = element.all('.level-1');
			lists.css('margin-left', '-320px').each(function(el, index) {
				S.later(function() {
					animateCollection.translateHorizon(el, 320);
				}, 150 * index);
			});
		},
		hideToLeft: function(element) {
			var lists = element.all('.level-1');
			lists.each(function(el, index) {
				S.later(function() {
					animateCollection.translateHorizon(el, 0);
				}, 100 * index);
			});
		},
		middleToShow: function(element) {
			element.show();
			window.scrollTo(0, 1);
			var lists = element.all('.level-1');
			lists.each(function(el, index) {
				animateCollection.rotateVertical(el, 0);
			});
		},
		hideToMiddle: function(element) {
			var lists = element.all('.level-1');
			lists.each(function(el) {
				animateCollection.rotateVertical(el, 90);
			});
		},
		translateHorizon: function(element, value) {
			var oldStyle = element.style('-webkit-transform');
			var newStyle;
			if(oldStyle.indexOf('rotateX') === -1) {
				newStyle = 'translateX(' + value + 'px)';
			}
			else {
				newStyle = oldStyle.replace(/(.*\()-?\d+(px\).*)/, '$1'+value+'$2');
			}
			element.style('-webkit-transform', newStyle);
			return element;
		},
		rotateVertical: function(element, value) {
			var oldStyle = element.style('-webkit-transform');
			var newStyle;
			if(oldStyle.indexOf('rotateX') !== -1) {
				newStyle = oldStyle.replace(/(.*\()\d+(deg\).*)/, '$1'+value+'$2');
			}
			else {
				newStyle = oldStyle + ' rotateX(' + value + 'deg)';
			}
			element.style('-webkit-transform', newStyle);
			return element;
		}
	};

	//事件中心
	var oCustomEvt = S.merge({}, S.EventTarget);
	oCustomEvt.on('leftToShow', function(ev) {
		animateCollection.leftToShow(ev.node);
		ev.callback && S.later(function() {
			ev.callback();
		}, 800);
	});
	oCustomEvt.on('hideToLeft', function(ev) {
		animateCollection.hideToLeft(ev.node);
		ev.callback && S.later(function() {
			ev.node.hide();
			ev.callback();
		}, 600);
	});
	oCustomEvt.on('middleToShow', function(ev) {
		animateCollection.middleToShow(ev.node);
		ev.callback && S.later(function() {
			ev.callback();
		}, 400);
	});
	oCustomEvt.on('hideToMiddle', function(ev) {
		animateCollection.hideToMiddle(ev.node);
		ev.callback && S.later(function() {
			ev.node.hide();
			ev.callback();
		}, 400);
	});

	//页面切换
	var pageSwitch = {
		loadHome: function() {
			oCustomEvt.fire('leftToShow', {
				node: S.one('#cats')
			});
		},
		homeToList: function(cfg) {
			oCustomEvt.fire('hideToLeft', {
				node: S.one('#cats'),
				callback: function() {
					S.one('.navigator').addClass('home').css('visibility', 'visible');
					S.one('#head').one('h1').html(cfg.title);
					S.one('#head').one('h1').attr('list_title', cfg.title);
					// S.one('#list').one('.column-actions').show();
					oCustomEvt.fire('leftToShow', {
						node: S.one('#list')
					});
				}
			});
		},
		listToDetail: function(cfg) {
			oCustomEvt.fire('hideToMiddle', {
				node: S.one('#list'),
				callback: function() {
					// S.one('#entry').one('.column-actions').show();
					S.one('.navigator').replaceClass('home', 'main-list');
					S.one('#head').one('h1').html(cfg.title);
					S.one('#entry').fadeIn();
				}
			});
		},
		listToHome: function() {
			animateCollection.translateHorizon(S.one('#list'), 320);
			/*S.Anim(S.one('#list'), {
				'margin-left': '320px'
			}, 0.4, 'easeOutStrong', function() {*/
			S.later(function() {
				// S.one('#list').one('.column-actions').hide();
				S.one('.navigator').removeClass('home').css('visibility', 'hidden');
				S.one('#head').one('h1').html('Simple Reader');
				// S.one('#cats').all('span.down').replaceClass('down', 'right');
				// S.one('#cats').all('ul.level-2').hide();
				oCustomEvt.fire('leftToShow', {
					node: S.one('#cats'),
					callback: function() {
						animateCollection.translateHorizon(S.one('#list'), 0).hide();
						animateCollection.translateHorizon(S.one('#list').all('.level-1'), 0);
					}
				});
			}, 400);
			// }).run();
		},
		detailToList: function() {
			animateCollection.translateHorizon(S.one('#entry'), 320);
			/*S.Anim(S.one('#entry'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {*/
			S.later(function() {
				// S.one('#entry').one('.column-actions').hide();
				S.one('.navigator').replaceClass('main-list', 'home');
				S.one('#head').one('h1').html(S.one('#head').one('h1').attr('list_title'));
				oCustomEvt.fire('middleToShow', {
					node: S.one('#list'),
					callback: function() {
						// S.one('#entry').css('margin-left', 0).hide();
						animateCollection.translateHorizon(S.one('#entry'), 0).hide();
					}
				});
			}, 400);
			// }).run();
		}
	};

	var Mobile = {
		init: function() {
			if (S.DOM.viewportWidth() > 480) {
				return;
			}

			pageSwitch.loadHome();

			/*S.all('li.catelog').on(E.Gesture.tap, function(ev) {
				S.one('.mobile-search').hide();
				var arrow = S.one(this).one('i');
				arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
				S.one(this).one('ul').slideToggle(0.4);
			});*/

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
					curTitle = self.text();
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
						if (self.deltaX > 0) {
							S.one(self).one('.mark-read').css('opacity', self.deltaX / 60);
							if(self.deltaX <= 60){
								animateCollection.translateHorizon(S.one(self).one('.inner'), self.deltaX);
							}
							else if (self.deltaX <= 160) {
								animateCollection.translateHorizon(S.one(self).one('.inner'), 60+(self.deltaX-60)/5);
								S.one(self).one('.mark-read').css({
									'color': '#0f0'
								});
							}
							else if(self.deltaX <= 300){
								animateCollection.translateHorizon(S.one(self).one('.inner'), 80+(self.deltaX-160)/7);
							}
						} else {
							S.one(self).one('.mark-star').css('opacity', -self.deltaX / 60);
							if(self.deltaX >= -60){
								animateCollection.translateHorizon(S.one(self).one('.inner'), self.deltaX);
							}
							else if (self.deltaX >= -160) {
								animateCollection.translateHorizon(S.one(self).one('.inner'), -60+(self.deltaX+60)/5);
								S.one(self).one('.mark-star').css({
									'color': '#f00'
								});
							}
							else if(self.deltaX >= -300){
								animateCollection.translateHorizon(S.one(self).one('.inner'), -80+(self.deltaX+160)/7);
							}
						}
					}
				}
			});
			S.one('#list').all('li').on(E.Gesture.end, function(ev) {
				var self = this;
				if (self.isMoving === 1) {
					self.isDown = false;
					self.isMoving = 2;
					S.one(self).one('.inner').addClass('webkit-transition');
					animateCollection.translateHorizon(S.one(self).one('.inner'), 0);
					S.one(self).one('.mark-read').animate({
						'opacity': 0,
						'color': '#555'
					}, 0.3);
					S.one(self).one('.mark-star').animate({
						'opacity': 0,
						'color': '#555'
					}, 0.3);
					S.later(function(){
						S.one(self).one('.inner').removeClass('webkit-transition');
					}, 500);
				}
			});

			S.one('#list').all('li').on(E.Gesture.tap, function(ev) {
				ev.preventDefault();
				this.isDown = false;
				if (this.isMoving === 1 || this.isMoving === 2) {
					return;
				}
				// var curTitle = S.one(this).one('h2').text();
				S.later(function(){
					pageSwitch.listToDetail({
						'title': '文章详情'
					});
				}, 1000);
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
				if (e.direction === 'right' && e.distance >= 100 && e.duration <= 0.5) {
					pageSwitch.listToHome();
				}
			});

			E.on('#entry', "swipe", function(e) {
				if (e.direction === 'right' && e.distance >= 100 && e.duration <= 0.5) {
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

}, {
	requires: [
		'node',
		'event']
});