(function() {

"use strict";

module.requires = [
    { name:'route.header.css' },
    { name:'core.language.js' },
    { name:'core.country.js' },
    { name:'core.currency.js' },
    { name:'core.date.js' }
];

module.exports = function(app) {

    var events = app['core.events'], 
        language = app['core.language'], 
        router = app['core.router'], 
        xcti = app['core.date'];

    return function(model) {

        var view = model.view, 
            wrapper = model.wrapper,
            dom = model.managers.dom;

        dom.mk('div',wrapper,null,'logo').addEventListener('click', function() {
            router.to([]);
        });

        return model.addSequence({

            container:wrapper,
            promises : [

                model.addInstance({ name:'accordion'}).then(function(accordion) {
                    accordion.hide();
                    model.managers.event.on(['toggleSettings',null,accordion], function() {
                        accordion.toggleVisibility();
                    });

                    // language

/*
 
                    // country/lang/currency
                    var writeModuleOptions = function(select,n) {
                        var name = 'core.'+n,
                        mod = app[name],
                        write = function() {
                            select.options.length = 0;
                            var cco = mod.code.get();
                            menu.addOptions(Object.keys(mod.pool.get({ sortby:'name' })).map(function (o) {
                                return {
                                    id:o,
                                    onClick: function() { 
                                        mod.code.set(o);
                                    },
                                    title:mod.getNameOfId(o), 
                                    active:o===cco
                                };
                            }));
                        };
                        events.on(name,'code.set', function(c) {
                            menu.options.forEach(function(o) {
                                o.setStatus(o.id === c? 'active':'inactive');
                            });
                        });
                        events.on(name,'pool.set', write);
                        write();
                    };

                    // timezone
                    var writeTimezone = function(tzmenu) {
                        var tzval = function() {
                            var cti = xcti.offset.get(),
                                t = language.mapKey({
                                    en : 'GMT [t] [h]h [m]m'
                                }),
                                isNeg = cti < 0? true:false;
                            t = t.replace('[t]',isNeg? '-' : '+');
                            if (cti < 0) 
                                cti *= -1;
                            var h = cti > 0? parseInt(cti/60) : 0;
                            t = t.replace('[h]',h);
                            var m = cti % 60;
                            t = t.replace('[m]',m);
                            return t;
                        },
                        tzvalueopt = tzmenu.addOption({ title:tzval, active:true });
                        events.on('core.date','offset.set', function() {
                            var offset = tzval();
                            tzvalueopt.updateTitle(offset);
                        });
                        tzmenu.addOption({
                            title:{
                                en : 'Set',
                                fr : 'Spécifier'
                            }, 
                            onClick:function() {
                                var cti = xcti.offset.get(),
                                    isNeg = cti < 0? true:false,
                                    hrs = cti > 0? parseInt(cti/60) : 0,
                                    min = cti % 60,
                                    i,
                                    frag = document.createDocumentFragment(),
                                    type = dom.mk('select',frag);
                                ['+','-'].forEach(function (o) { 
                                    type.options[type.options.length] = new Option(o); 
                                });
                                if (isNeg) 
                                    type.options[1].selected = true;
                                var hours = dom.mk('select',frag);
                                for (i=0; i <= 14; i++) {
                                    hours.options[hours.options.length] = new Option(i);
                                    if (hrs === i) 
                                        hours.options[hours.options.length-1].selected = true;
                                }
                                var minutes = dom.mk('select',frag);
                                for (i=0; i < 60; i+=15) {
                                    minutes.options[minutes.options.length] = new Option(i);
                                    if (min === i) 
                                        minutes.options[minutes.options.length-1].selected = true;
                                }
                                model.addInstance('modaldialog').then(function(g) {
                                    g.confirm({
                                        message: {
                                            en : 'Please specify your timezone offset in terms of hours and minutes.',
                                            fr : 'S\'il vous plaît indiquer décalage en termes d\'heures et de minutes de votre fuseau horaire.'
                                        },
                                        inputs : frag
                                    }).then(function(ac) {
                                        if (ac.cancel) 
                                            return;
                                        var m = hours.selectedIndex*60;
                                        m += minutes.selectedIndex*15;
                                        if (type.selectedIndex === 1) 
                                            m *= -1;
                                        xcti.offset.set(m);
                                    });
                                });
                            } 
                        });
                    };


 *
 */



                    accordion.addSection({ 
                        title:_tr("Language"), 
                        content:dom.mk('div',null,null, function() {


                        })
                    });
                    accordion.addSection({ title:_tr("Timezone") });
                    accordion.addSection({ title:_tr("Currency") });
                    accordion.addSection({ title:_tr("Country") });
                    return accordion;
                }),
                model.addInstance({ name:'navigation'},{
                    type:'headermn',
                    pool : [
                        { 
                            id:'app', 
                            active:true 
                        }, 
                        { 
                            id:'api', 
                            href : 'http://api.igaro.com'
                        }
                    ]
                }),

                new Promise(function(resolve) {
                    return resolve(dom.mk('a',null,null, function() {
                        this.className = 'settings';
                        this.addEventListener('click', function(event) {
                            event.preventDefault();
                            return model.managers.event.dispatch('toggleSettings');
                        });    
                    }));
                }),

                new Promise(function(resolve) {
                     var xhricon = dom.mk('div',null,null,'xhr'),
                        w = dom.mk('div', xhricon),
                        total=0, ref;
                        model.on('instance.xhr','start', function () {
                            if (total === 0 && ! xhricon.parentNode && ! ref) 
                                ref=setTimeout(function() { 
                                    wrapper.appendChild(xhricon);
                                },350);
                            total++;
                        });
                        model.on('instance.xhr','end', function() {
                            if (total > 0) 
                                total--; 
                            if (total !== 0) 
                                return;
                            clearTimeout(ref);ref=null;
                            if (xhricon.parentNode) 
                                xhricon.parentNode.removeChild(xhricon);
                        });
                    return resolve(w);
                })
            ]
        });

    };
};

})();
