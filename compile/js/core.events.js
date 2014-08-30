module.exports = function(app) {

    return new function() {
    
        var self = this;
        var pool = this.pool = new Object();

        this.on = function(name,event,fn) {
            if (! pool[name]) pool[name] = {};
            if (! pool[name][event]) pool[name][event] = new Array();
            var m = pool[name][event];
            if (m.indexOf(fn) === -1) m.push(fn);
            self.dispatch('core.events','on',{ name:name, event:event, fn:fn });
            return;
        };

        this.remove = function(fn,name,event) {
            var t = function(name) {
                var h = function(event) {
                    var p = pool[name][event];
                    for (var i=0; i < p.length; i++) {
                        if (p[i] !== fn) continue;
                        self.dispatch('core.events','remove',{ name:name, event:event, fn:fn });
                        pool[name][event].splice(i,1);
                        break;
                    }
                }
                if (! name) {
                    Object.keys(pool).forEach(function() { t(h) });
                } else if (! event) {
                    Object.keys(pool[name]).forEach(h);
                } else {
                    h(event);
                }
            };
            if (! name) {
                Object.keys(pool).forEach(t);
            } else {
                t(name);
            }
        };

        this.dispatch = function(name, event, params, bubble) {
            var self = this;
            if (! pool[name] || ! pool[name][event]) return;
            if (bubble !== false && name !== 'core.events' && event !== 'dispatch') this.dispatch('core.events','dispatch', { name:name, event:event, params: params});
            pool[name][event].forEach(function(t) { 
                try {
                    t(params); 
                } catch(e) {
                    var x = { name:name, event:event, params:params, error:e, 'function':t };
                    // as nothing may be defined to handle the error we also try dumping to console
                    if (window.console !== 'undefined') console.log(x);
                    self.dispatch('core.events','dispatch.error', x);
                }
            });
        }
    
    };

};
