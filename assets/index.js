KISSY.add(function(S) {
    var modList = S.makeArray(arguments).slice(1);

    S.ready(function() {
        S.each(modList, function(curMod) {
            if (S.isPlainObject(curMod) && S.isFunction(curMod.init)) {
                curMod.init();
            }
        });
    });

}, {requires: ['./mobile']});