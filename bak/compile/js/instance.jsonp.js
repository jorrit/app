module.exports = function(app) {

    var events = app['core.events'],
        setBits = function(p) {
            if (p.res) 
                this.res = p.res;
            if (p.callbackName) 
                this.callbackName = p.callbackName;
        };

    var jsonpO = function(p) {
        this.res='';
        this.callbackName = 'callback';
        this.uid = 'jsonp'+Math.round(Math.random()*1000001);
        var t = this.jsonp = document.createElement('script');
        if (p) 
            setBits.call(this,p);
    };

    jsonpO.prototype.get = function(p) {
        this.abort();
        if (p) 
            setBits.call(this,p);
        var self = this, 
            jsonp = this.jsonp, 
            s = this.res +
                s.indexOf('?') === -1? '?' : '&' +
                this.callbackName + '=' + this.uid;
        return new Promise(function(resolve, reject) {
            window[self.uid] = function(data) {
                delete window[self.uid];
                events.dispatch('instance.xhr','success', self);
                events.dispatch('instance.xhr','end', self);
                resolve(data);
            };
            jsonp.src = s;
            jsonp.onerror = function(err) {
                delete window[self.uid];
                reject(err);
                events.dispatch('instance.xhr','error', { error:err, jsonp:self });
                events.dispatch('instance.xhr','end', self);
            };
            document.getElementsByTagName('head')[0].appendChild(jsonp);
            events.dispatch('instance.xhr','start', self);
        });
    };

    jsonpO.prototype.abort = function() {
        var j = this.jsonp;
        if (! j.parentNode) 
            return;
        j.parentNode.removeChild(j);
        events.dispatch('instance.xhr','aborted', this);
        events.dispatch('instance.xhr','end', this);
    };

    jsonpO.prototype.destroy = function() {
        this.abort();
    };

    return jsonpO;

};