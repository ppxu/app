KISSY.add('reader', function (S, DOM, Event, UA, IO) {

    var MC = S.mix({}, S.EventTarget);  // Message Center


    var JSONP = 'jsonp';


    var entryCache = {},
        listCache = {};

    var catList = DOM.get('#user-cat-list'),
        entryList = DOM.get('#list'),
        entryContent = DOM.get('#entry-content');

    var UA = KISSY.UA;

    var isDesktop = !UA.ios;


    var renderList = function (list) {
            currentList = list;

            var entries = [];
            S.each(list, function (entryInfo) {
                            var entry = '<li class="title level-1 {clazz}">' +
                                '<div class="inner">' +
                                '<h2><a href="{link}" data-id={id}>{title}</a></h2>' +
                                '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>' +
                                '</div>' +
                                '<span class="mark-read"><i class="icon-ok"></i></span>' +
                                '<span class="mark-star"><i class="icon-heart"></i></span>' +
                                 '</li>';

                entryInfo['clazz'] = entryInfo['is_unread'] ? 'unread' : 'read';
                entry = S.substitute(entry, entryInfo);
                entries.push(entry);

            });
            entries = entries.join('');
            //gaozhan  begin
            var listcontent= '<div class="entries section">'+
                ' <div class="scroll_content"  style="overflow:auto;">'+
                '<ul class="entry-list" data-bind="template: { name: "tpl-entry-head", foreach: entryList }">'+
                        '<!--         <script type="text/html" id="tpl-entry-head">'+
                           ' <li>'+
                                '<h2 data-bind="text:title">'+
                                '</h2>'+
                            '</li>'+
                       ' </script>-->'+
                    ' </ul>'+
                ' </div>'+
            '</div>';
            DOM.html('#list .entries', listcontent);
            //gaozhna  end
            DOM.html('.entry-list', entries);
            //gaozhan  begin
            if(S.one(".entry-list").innerHeight()>DOM.viewportHeight() && isDesktop){
                S.use("scroll,dom", function (S, Kscroll,DOM) {
                    var $ = S.all,
                        d = new Kscroll($(".scroll_content"), {
                            prefix:"clear-",
                            hotkey: true,
                            bodydrag: true,
                            allowArrow:true
                        });
                });
            }
            DOM.style('.scroll_content',{"height":DOM.viewportHeight()-60});
            //gaozhan  end
        },


        renderEntry = function (id) {
            if (entryCache[id]) {
                _renderEntry(entryCache[id])
            } else {
                IO.get('http://10.232.133.213/item/' + id, function (entry) {
                    entryCache[id] = entry;
                    _renderEntry(entry);
                }, JSONP);
            }
        },

        renderCatList = function (list) {

            var cats = [];
            S.each(list, function (catInfo) {

                var cat = '<li class="title list-detail level-1 {clazz}"><h2>' +
                          '<a href="{link}" data-id={id}>{title}</a>' +
                          '</h2>' +
                          '</li>';

                catInfo['clazz'] = catInfo['is_unread'] ? 'unread' : 'read';
                cat = S.substitute(cat, catInfo);
                cats.push(cat);

            });

            cats = cats.join('');
            DOM.html(catList, cats);

        },

        _renderEntry = function (entry) {
            //gaozhan
            var entryDescription="<h1 class='title'>"+entry.title+"</h1><p class='time'>"+entry.pub_date+"</p><div class='content'>"+entry.description+"</div>";
            DOM.html(entryContent, entryDescription);
            //gaozhan
        },


        currentList = [],     // current entry list


    // fetch entry list, including title/link
        fetchList = function (id) {
            if (listCache[id]) {
                renderList(listCache[id]);
            } else
            IO.get('http://10.232.133.213/channel/'+id,function(list){
                renderList(list);
                listCache[id] = list;

            },JSONP);

        },


    // toggle entry type in view
        toggleView = function () {

        },


        setAll = function () {

        };


    // handle list clicks
    Event.on(entryList, 'click', function (evt) {

        evt.preventDefault();

        var target = evt.target,
            id;
        S.one(entryList).all("li").removeClass("current");//gaozhan
        if (target.tagName === 'A') {
            id = DOM.attr(target, 'data-id');
            DOM.addClass(S.one(DOM.parent(target,".title")),"current");//gaozhan
            MC.fire('entry-list:click', {
                id: id
            });
        }

    });

    MC.on('entry-list:click', function (evt) {
        var entryId = evt.id;
        renderEntry(entryId);
    });


    Event.on(catList, 'click', function (evt) {
        evt.preventDefault();
        var target = evt.target,
            id;
        S.one(catList).all("li").removeClass("current");//gaozhan
        if (target.tagName === 'A') {
            id = DOM.attr(target, 'data-id');
            DOM.addClass(S.one(DOM.parent(target,".title")),"current");//gaozhan
            MC.fire('cat-list:click', {
                id: id
            });
        }


    });


    MC.on('cat-list:click', function (evt) {
        var id = evt.id;
        fetchList(id);
    });

    IO.get('http://10.232.133.213/items/', function (defaultList) {
        renderList(defaultList);

    }, JSONP);
    IO.get('http://10.232.133.213/tags/', function (cats) {
        var cats = cats.data;
        renderCatList(cats);
    }, JSONP);

}, { requires: [
    'dom',
    'event',
    'ua',
    'ajax',
    'xtemplate'

]});