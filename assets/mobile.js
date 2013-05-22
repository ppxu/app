KISSY.add('mobile', function(S, N, E) {

	var CATS_AREA = S.one('#cats');
	var LIST_AREA = S.one('#list');
	var ENTRY_AREA = S.one('#entry');
	var NAVIGATOR = S.one('.navigator');
	var PAGE_TITLE = S.one('#head').one('h1');
	/*var SEARCH_AREA = S.one('.mobile-search');
	var SEARCH_BTN = S.one('.search');*/

	//动画集合
	var animateCollection = {
		leftToShow: function(element) {
			element.show();
			window.scrollTo(0, 1);
			var lists = element.all('.level-1');
			lists.css('margin-left', '-320px').each(function(el, index) {
				if (index < 8) {
					S.later(function() {
						animateCollection.translateHorizon(el, 320);
					}, 150 * index);
				} else {
					S.later(function() {
						animateCollection.translateHorizon(el, 320);
					}, 1200);
				}
			});
		},
		hideToLeft: function(element) {
			var lists = element.all('.level-1');
			lists.each(function(el, index) {
				if(index < 7) {
					S.later(function() {
						animateCollection.translateHorizon(el, 0);
					}, 100 * index);	
				} else {
					S.later(function() {
						animateCollection.translateHorizon(el, 0);
					}, 600);
				}
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
			if (oldStyle.indexOf('rotate3d') === -1) {
				newStyle = 'translate3d(' + value + 'px,0,0)';
			} else {
				newStyle = oldStyle.replace(/(.*\()\d+(px.*)/, '$1' + value + '$2');
			}
			element.style('-webkit-transform', newStyle);
			return element;
		},
		translateVertical: function(element, value) {
			newStyle = 'translate3d(0,' + value + 'px,0)';
			element.style('-webkit-transform', newStyle);
			return element;
		},
		rotateVertical: function(element, value) {
			var oldStyle = element.style('-webkit-transform');
			var newStyle;
			if (oldStyle.indexOf('rotate3d') !== -1) {
				newStyle = oldStyle.replace(/(.*\D)\d+(deg\).*)/, '$1' + value + '$2');
			} else {
				newStyle = oldStyle + ' rotate3d(1,0,0,' + value + 'deg)';
			}
			element.style('-webkit-transform', newStyle);
			return element;
		},
		listTouchMove: function(list, value, time) {
			var self = S.one(list);
			var innerNode = self.one('.inner');
			if (value > 10) {
				var realValue = value - 10;
				self.one('.mark-read').css('opacity', realValue / 60);
				if (realValue <= 60) {
					animateCollection.translateHorizon(innerNode, realValue);
				} else if (realValue <= 300) {
					animateCollection.translateHorizon(innerNode, 60 + (realValue - 60) / 12);
					if (time > 500 && list.readToggle === 1) {
						oCustomEvt.fire('listMarkRead', {
							node: self,
							element: list
						});
					}
				}
			} else if (value < -10) {
				var falseValue = value + 10;
				self.one('.mark-star').css('opacity', -falseValue / 60);
				if (falseValue >= -60) {
					animateCollection.translateHorizon(innerNode, falseValue);
				} else if (falseValue >= -300) {
					animateCollection.translateHorizon(innerNode, -60 + (falseValue + 60) / 12);
					if (time > 500 && list.starToggle === 1) {
						oCustomEvt.fire('listMarkStar', {
							node: self,
							element: list
						});
					}
				}
			}
		},
		showLoading: function() {
			PAGE_TITLE.html('').addClass('spinner');
		},
		hideLoading: function() {
			PAGE_TITLE.html('').removeClass('spinner');
		}
	};

	//事件中心
	var oCustomEvt = S.merge({}, S.EventTarget);
	oCustomEvt.on('leftToShow', function(ev) {
		animateCollection.leftToShow(ev.node);
		ev.callback && S.later(function() {
			ev.callback();
		}, 1200);
	});
	oCustomEvt.on('hideToLeft', function(ev) {
		animateCollection.hideToLeft(ev.node);
		S.later(function() {
			ev.node.hide();
			ev.callback && ev.callback();
		}, 800);
	});
	oCustomEvt.on('middleToShow', function(ev) {
		animateCollection.middleToShow(ev.node);
		ev.callback && S.later(function() {
			ev.callback();
		}, 400);
	});
	oCustomEvt.on('hideToMiddle', function(ev) {
		animateCollection.hideToMiddle(ev.node);
		S.later(function() {
			ev.node.hide();
			ev.callback && ev.callback();
		}, 400);
	});
	oCustomEvt.on('listMarkRead', function(ev) {
		var node = ev.node;
		if(node.hasClass('unread')){
			node.one('.mark-read').css({
				'color': '#0f0'
			});
			node.replaceClass('unread', 'read');
		}
		else if(node.hasClass('read')){
			node.one('.mark-read').css({
				'color': '#555'
			});
			node.replaceClass('read', 'unread');
		}
		ev.element.readToggle = 2;
	});
	oCustomEvt.on('listMarkStar', function(ev) {
		var node = ev.node;
		if(node.hasClass('unstar')){
			node.one('.mark-star').css({
				'color': '#f00'
			});
			node.replaceClass('unstar', 'star');
		}
		else if(node.hasClass('star')){
			node.one('.mark-star').css({
				'color': '#555'
			});
			node.replaceClass('star', 'unstar');
		}
		ev.element.starToggle = 2;
	});

	//页面切换
	var pageSwitch = {
		loadHome: function() {
			oCustomEvt.fire('leftToShow', {
				node: CATS_AREA
			});
		},
		homeToList: function(cfg) {
			oCustomEvt.fire('hideToLeft', {
				node: CATS_AREA,
				callback: function() {
					NAVIGATOR.addClass('home').css('visibility', 'visible');
					PAGE_TITLE.html(cfg.title).attr('list_title', cfg.title);
					LIST_AREA.show();
					window.scrollTo(0, 1);
					LIST_AREA.one('.entries').css('margin-left', '-320px');
					S.later(function(){
						animateCollection.translateHorizon(LIST_AREA.one('.entries'), 320);
					}, 10);
					S.later(function(){
						animateCollection.translateVertical(LIST_AREA.one('.column-actions'), -30);
						bindListOperate();
						setReadStarTag();
					}, 400);
					// LIST_AREA.one('.column-actions').hide().slideDown(0.4);
					/*oCustomEvt.fire('middleToShow', {
						node: LIST_AREA,
						callback: function() {
							animateCollection.translateVertical(LIST_AREA.one('.column-actions'), -30);
							bindListOperate();
						}
					});*/
				}
			});
		},
		listToDetail: function(cfg) {
			oCustomEvt.fire('hideToMiddle', {
				node: LIST_AREA,
				callback: function() {
					// ENTRY_AREA.one('.column-actions').show();
					NAVIGATOR.replaceClass('home', 'main-list');
					PAGE_TITLE.html(cfg.title);
					animateCollection.translateVertical(LIST_AREA.one('.column-actions'), 5);
					animateCollection.translateVertical(ENTRY_AREA.one('.column-actions'), -30);
					ENTRY_AREA.sourceNode = cfg.node;
					if(cfg.star === 'star'){
						ENTRY_AREA.one('.column-actions').one('.toggle-star').one('i').replaceClass('icon-heart-empty', 'icon-heart');
					}
					else {
						ENTRY_AREA.one('.column-actions').one('.toggle-star').one('i').replaceClass('icon-heart', 'icon-heart-empty');
					}
					ENTRY_AREA.fadeIn(0.4);
					window.scrollTo(0, 1);
				}
			});
		},
		listToHome: function() {
			animateCollection.translateHorizon(LIST_AREA.one('.entries'), 320);
			animateCollection.translateVertical(LIST_AREA.one('.column-actions'), 5);
			/*S.Anim(LIST_AREA, {
				'margin-left': '320px'
			}, 0.4, 'easeOutStrong', function() {*/
			S.later(function() {
				// LIST_AREA.one('.column-actions').slideUp(0.4);
				NAVIGATOR.removeClass('home').css('visibility', 'hidden');
				PAGE_TITLE.html('Simple Reader');
				// CATS_AREA.all('span.down').replaceClass('down', 'right');
				// CATS_AREA.all('ul.level-2').hide();
				oCustomEvt.fire('leftToShow', {
					node: CATS_AREA,
					callback: function() {
						animateCollection.translateHorizon(LIST_AREA.one('.entries'), 0);
						animateCollection.translateHorizon(LIST_AREA.all('.level-1'), 0);
						LIST_AREA.hide();
					}
				});
			}, 400);
			// }).run();
		},
		detailToList: function() {
			animateCollection.translateHorizon(ENTRY_AREA.one('.sub-entry'), 320);
			/*S.Anim(ENTRY_AREA, {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {*/
			S.later(function() {
				// ENTRY_AREA.one('.column-actions').hide();
				NAVIGATOR.replaceClass('main-list', 'home');
				PAGE_TITLE.html(PAGE_TITLE.attr('list_title'));
				animateCollection.translateVertical(ENTRY_AREA.one('.column-actions'), 5);
				oCustomEvt.fire('middleToShow', {
					node: LIST_AREA,
					callback: function() {
						// ENTRY_AREA.css('margin-left', 0).hide();
						animateCollection.translateVertical(LIST_AREA.one('.column-actions'), -30);
						animateCollection.translateHorizon(ENTRY_AREA.one('.sub-entry'), 0);
						ENTRY_AREA.hide();
					}
				});
			}, 400);
			// }).run();
		},
		listSwitchAll: function(){
			window.scrollTo(0, 1);
			LIST_AREA.one('.entries').all('li').show();
			LIST_AREA.one('.column-actions').all('li').removeClass('active');
			LIST_AREA.one('.column-actions').one('li.all-posts').addClass('active');
		},
		listSwitchUnread: function(){
			window.scrollTo(0, 1);
			LIST_AREA.one('.entries').all('li').show();
			LIST_AREA.one('.entries').all('li.read').hide();
			LIST_AREA.one('.column-actions').all('li').removeClass('active');
			LIST_AREA.one('.column-actions').one('li.unread-posts').addClass('active');
		},
		listSwitchStar: function(){
			window.scrollTo(0, 1);
			LIST_AREA.one('.entries').all('li').hide();
			LIST_AREA.one('.entries').all('li.star').show();
			LIST_AREA.one('.column-actions').all('li').removeClass('active');
			LIST_AREA.one('.column-actions').one('li.star-posts').addClass('active');
		}
	};

	function bindListOperate() {
		LIST_AREA.all('li').on(E.Gesture.start, function(ev) {
			var el = S.one(this);
			if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
				return;
			}
			this.isDown = true;
			this.isMoving = 0;
			this.originX = ev.pageX;
			this.originY = ev.pageY;
			this.originT = S.now();
			this.readToggle = 1;
			this.starToggle = 1;
		});
		LIST_AREA.all('li').on(E.Gesture.move, function(ev) {
			var el = S.one(this);
			if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
				return;
			}
			var self = this;
			if (self.isDown) {
				self.isMoving = 1;
				self.currentX = ev.pageX;
				self.currentY = ev.pageY;
				self.currentT = S.now();
				self.deltaX = self.currentX - self.originX;
				self.deltaY = self.currentY - self.originY;
				self.deltaT = self.currentT - self.originT;
				if (Math.abs(self.deltaY) <= 10 && Math.abs(self.deltaX) > 10) {
					animateCollection.listTouchMove(self, self.deltaX, self.deltaT);
				}
			}
		});
		LIST_AREA.all('li').on(E.Gesture.end, function(ev) {
			var el = S.one(this);
			if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
				return;
			}
			var self = this;
			if (self.isMoving === 1) {
				self.isDown = false;
				self.isMoving = 2;
				self.readToggle = 0;
				self.starToggle = 0;
				S.one(self).one('.inner').addClass('webkit-transition');
				animateCollection.translateHorizon(S.one(self).one('.inner'), 0);
				S.one(self).one('.mark-read').animate({
					'opacity': 0
				}, 0.3);
				S.one(self).one('.mark-star').animate({
					'opacity': 0
				}, 0.3);
				S.later(function() {
					S.one(self).one('.inner').removeClass('webkit-transition');
				}, 500);
			}
		});

		LIST_AREA.all('li').on(E.Gesture.tap, function(ev) {
			var el = S.one(this);
			if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
				return;
			}
			ev.preventDefault();
			this.isDown = false;
			if (this.isMoving === 1 || this.isMoving === 2) {
				return;
			}
			el.replaceClass('unread', 'read');
			el.one('.mark-read').css({
				'color': '#0f0'
			});
			var star = el.hasClass('star') ? 'star' : 'unstar';
			// var curTitle = S.one(this).one('h2').text();
			animateCollection.showLoading();
			S.later(function() {
				animateCollection.hideLoading();
				pageSwitch.listToDetail({
					'title': '文章详情',
					'node': el,
					'star': star
				});
			}, 500);
		});
	}

	function setReadStarTag(){
		LIST_AREA.all('li').each(function(list) {
			var el = S.one(list);
			if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
				return;
			}
			if(el.hasClass('read')){
				el.one('.mark-read').css({
					'color': '#0f0'
				});
			}
			if(el.hasClass('star')){
				console.log(el);
				el.one('.mark-star').css({
					'color': '#f00'
				});
			};
		})
	}

	var Mobile = {
		init: function() {
			if (S.DOM.viewportWidth() > 480) {
				return;
			}

			KISSY.one('.scroll_content').attr('style', '')

			KISSY.one('#user-cat-list').insertBefore(KISSY.one('#cats').one('.section'))
			KISSY.one('#cats').one('.section').remove();

			pageSwitch.loadHome();

			/*S.all('li.catelog').on(E.Gesture.tap, function(ev) {
				var arrow = S.one(this).one('i');
				arrow.hasClass('down') ? arrow.replaceClass('down', 'right') : arrow.removeClass('right').addClass('down');
				S.one(this).one('ul').slideToggle(0.4);
			});*/

			S.one('#cats li.today').add('#cats li.all').add('#cats li.star').add('#cats li.list-detail').on(E.Gesture.tap, function(ev) {
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
				animateCollection.showLoading();
				S.later(function() {
					pageSwitch.homeToList({
						'title': curTitle
					});
					animateCollection.hideLoading();
				}, 1000);
			});

			/*LIST_AREA.all('li').on(E.Gesture.start, function(ev) {
				var el = S.one(this);
				if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
					return;
				}
				this.isDown = true;
				this.isMoving = 0;
				this.originX = ev.pageX;
				this.originY = ev.pageY;
				this.originT = S.now();
			});
			LIST_AREA.all('li').on(E.Gesture.move, function(ev) {
				var el = S.one(this);
				if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
					return;
				}
				var self = this;
				if (self.isDown) {
					self.isMoving = 1;
					self.currentX = ev.pageX;
					self.currentY = ev.pageY;
					self.currentT = S.now();
					self.deltaX = self.currentX - self.originX;
					self.deltaY = self.currentY - self.originY;
					self.deltaT = self.currentT - self.originT;
					if (Math.abs(self.deltaY) <= 10 && Math.abs(self.deltaX) > 10) {
						animateCollection.listTouchMove(self, self.deltaX, self.deltaT);
					}
				}
			});
			LIST_AREA.all('li').on(E.Gesture.end, function(ev) {
				var el = S.one(this);
				if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
					return;
				}
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
					S.later(function() {
						S.one(self).one('.inner').removeClass('webkit-transition');
					}, 500);
				}
			});

			LIST_AREA.all('li').on(E.Gesture.tap, function(ev) {
				var el = S.one(this);
				if(el.hasClass('all-posts') || el.hasClass('unread-posts') || el.hasClass('star-posts')) {
					return;
				}
				ev.preventDefault();
				el.replaceClass('unread', 'read');
				var star = el.hasClass('star') ? 'star' : 'unstar';
				this.isDown = false;
				if (this.isMoving === 1 || this.isMoving === 2) {
					return;
				}
				// var curTitle = S.one(this).one('h2').text();
				animateCollection.showLoading();
				S.later(function() {
					animateCollection.hideLoading();
					pageSwitch.listToDetail({
						'title': '文章详情',
						'node': el,
						'star': star
					});
				}, 500);
			});*/

			LIST_AREA.one('.column-actions').all('li').on(E.Gesture.tap, function(e){
				var el = S.one(this);
				e.preventDefault();
				if(el.hasClass('all-posts')){
					pageSwitch.listSwitchAll();
				}
				else if(el.hasClass('unread-posts')){
					pageSwitch.listSwitchUnread();
				}
				else if(el.hasClass('star-posts')){
					pageSwitch.listSwitchStar();
				}
			});

			NAVIGATOR.on(E.Gesture.tap, function(ev) {
				var self = S.one(this);
				if (self.hasClass('home')) {
					pageSwitch.listToHome();
				} else if (self.hasClass('main-list')) {
					pageSwitch.detailToList();
				}
			});

			LIST_AREA.on('swipe', function(e) {
				if (e.direction === 'right' && e.distance >= 100 && e.duration <= 0.5) {
					pageSwitch.listToHome();
				}
			});

			ENTRY_AREA.on('swipe', function(e) {
				if (e.direction === 'right' && e.distance >= 100 && e.duration <= 0.5) {
					pageSwitch.detailToList();
				}
			});

			/*S.one('.toggle-read').on(E.Gesture.tap, function(ev) {
				var sourceNode = ENTRY_AREA.sourceNode;
				var el = S.one(this).one('i');
				el.hasClass('icon-circle') ? el.replaceClass('icon-circle', 'icon-circle-blank') : el.replaceClass('icon-circle-blank', 'icon-circle');
				sourceNode.toggleClass('read', 'unread');
			}); 

			S.one('.toggle-star').on(E.Gesture.tap, function(ev) {
				var sourceNode = ENTRY_AREA.sourceNode;
				var el = S.one(this).one('i');
				el.hasClass('icon-heart-empty') ? el.replaceClass('icon-heart-empty', 'icon-heart') : el.replaceClass('icon-heart', 'icon-heart-empty');
				sourceNode.toggleClass('star', 'unstar');
			});*/

			/*SEARCH_BTN.on(E.Gesture.tap, function(ev) {
				if(!SEARCH_BTN.hasClass('search-active')){
					SEARCH_AREA.show();
					S.later(function(){
						animateCollection.translateVertical(SEARCH_AREA, 200);
						SEARCH_BTN.addClass('search-active');
					}, 100);
				}
				else {
					animateCollection.translateVertical(SEARCH_AREA, 0);
					SEARCH_BTN.removeClass('search-active');
					S.later(function(){
						SEARCH_AREA.hide();
					}, 400);
				}
			});*/

			/*S.one('.J_Cancel').on(E.Gesture.tap, function(ev) {
				animateCollection.translateVertical(SEARCH_AREA, 0);
				SEARCH_BTN.removeClass('search-active');
				S.later(function(){
					SEARCH_AREA.hide();
				}, 400);
			});*/

		}
	};

	Mobile.init();

}, {
	requires: [
		'node',
		'event']
});