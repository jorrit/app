(function() {

'use strict';

module.requires = [
    { name: 'core.language.js' },
    { name: 'instance.list.css' }
];


module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceListItem = function(o) {
        bless.call(this,{
            name:'item',
            parent:o.parent,
        });
        var dom = this.managers.dom,
            li = this.li = dom.mk('li',null,o.content,o.id);
        if (o.id)
            this.id = o.id;
    };

    var InstanceList = function(o) {
        if (!o)
            o={};
        bless.call(this,{
            name:'instance.list',
            parent:o.parent,
            asRoot:true
        });
        if (! o) 
            o = {};
        var dom = this.managers.dom,
            c = this.container = dom.mk('ul',o.container,null,'instance-list'),
            pool = this.pool = [],
            self = this;
        if (o.options) 
            o.options.forEach(function (q) {
                self.add(q); 
            });
        this.managers.event
            .on('item.destroy',function(i) {
                pool.splice(pool.indexOf(i),1);
            });
    };
    InstanceList.prototype.add = function(o,shift) {
        o.parent = this;
        var t = new InstanceListItem(o);
        this.pool.push(t);
        if (shift) { 
            this.shift(t,shift); 
        } else { 
            this.container.appendChild(t.li); 
        }
        return this.managers.event.dispatch('add',t).then(function() {
            return t;
        });
    };
    InstanceList.prototype.hide = function(v) {
        this.managers.dom.hide(this.container,v);
    };
    InstanceList.prototype.show = function() {
        this.managers.dom.show(this.container);
    };
    InstanceList.prototype.clear = function() {
        return Promise.all([
            this.pool.slice(0).map(function (o) {
                return o.destroy();
            })
        ]);
    };

    InstanceList.prototype.shift = function(o,places) {
        var pool = this.pool,
            c = this.container,
            li = o.li,
            i = pool.indexOf(o);
        if (places+i >= pool.length) {
            places = places+i;
            while (places >= 0) { 
                places -= pool.length;
            }
            --places;
        }
        if (li.parentNode) 
            c.removeChild(li);
        pool.splice(i+places,0,pool.splice(i,1)[0]);
        i = pool.indexOf(o);
        if (i === pool.length-1) { 
            c.appendChild(li);
        } else {
            c.insertBefore(li,pool[i+1].li);
        }
    };

    return InstanceList;
};

})();
