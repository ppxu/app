KISSY.add(function(S, oCustomEvt){

	var pageSwitch = {
		loadHome: function(){
			oCustomEvt.fire('show', {
				node: S.one('#cats'),
				callback: function(){
					window.scrollTo(0, 1);
				}
			});
		},
		homeToList: function(cfg){
			oCustomEvt.fire('hide', {
				node: S.one('#cats'),
				callback: function() {
					S.one('#list').one('.column-actions').show();
					S.one('.navigator').addClass('home').css('visibility', 'visible');
					S.one('#head').one('h1').html(cfg.title);
					S.one('#head').one('h1').attr('list_title', cfg.title);
					oCustomEvt.fire('show', {
						node: S.one('#list'),
						callback: function(){
							window.scrollTo(0, 1);
						}
					});
				}
			});
		},
		listToDetail: function(cfg){
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
		listToHome: function(){
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
					callback: function(){
						window.scrollTo(0, 1);
						S.one('#list').css('margin-left', 0).hide();
					}
				});
			}).run();
		},
		detailToList: function(){
			S.Anim(S.one('#entry'), {
				'margin-left': '100%'
			}, 0.4, 'easeOutStrong', function() {
				S.one('#entry').one('.column-actions').hide();
				S.one('.navigator').replaceClass('main-list', 'home');
				S.one('#head').one('h1').html(S.one('#head').one('h1').attr('list_title'));
				oCustomEvt.fire('show', {
					node: S.one('#list'),
					callback: function(){
						window.scrollTo(0, 1);
						S.one('#entry').css('margin-left', 0).hide();
					}
				});
			}).run();
		}
	};

	return pageSwitch;
}, {requires: ['./event_center']});