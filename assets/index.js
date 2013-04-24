KISSY.add('reader', function (S, DOM, Event, UA, IO) {

    var MC = S.mix({}, S.EventTarget);  // Message Center


    var JSONP = 'jsonp';


    var entryCache = {},
        listCache = {};

    var catList = DOM.get('#user-cat-list'),
        entryList = DOM.get('#list'),
        entryContent = DOM.get('#entry-content');


    var renderList = function (list) {
            currentList = list;

            var entries = [];
            S.each(list, function (entryInfo) {
                var entry = '<li class="title level-1 {clazz}"><h2>' +
                            '<a href="{link}" data-id={id}>{title}</a>' +
                            '</h2>' +
                            '<p>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</p>' +
                            '</li>';

                entryInfo['clazz'] = entryInfo['is_unread'] ? 'unread' : 'read';
                entry = S.substitute(entry, entryInfo);
                entries.push(entry);

            });

            entries = entries.join('');

            DOM.html('.entry-list', entries);

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

                var cat = '<li class="list-detail title level-1 {clazz}"><h2>' +
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
            DOM.html(entryContent, entry.description)
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

        if (target.tagName === 'A') {

            id = DOM.attr(target, 'data-id');
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
        if (target.tagName === 'A') {

            id = DOM.attr(target, 'data-id');
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

    if (S.DOM.viewportWidth() <= 480) {
        S.use('mobile');
    }

}, { requires: [
    'dom',
    'event',
    'ua',
    'ajax',
    'xtemplate'

]});