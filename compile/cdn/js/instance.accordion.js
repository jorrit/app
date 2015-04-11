(function() {

'use strict';

module.requires = [
    { name:'core.language.js'},
    { name:'instance.accordion.css'}
];

module.exports = function(app) {

    var bless = app['core.bless'];

    var InstanceAccordionSection = function(o) {
        bless.call(this,{
            name:'section',
            parent:o.parent,
            stash:o.stash,
            container:function(dom) { 
                return dom.mk('dl',o.parent); 
            },
            disabled:o.disabled,
            hidden:o.hidden
        });
        var self = this,
            dl = this.container,
            dom = this.managers.dom,
            dt = this.header = dom.mk('dt',dl,dom.mk('div'));
        this.content = dom.mk('dd',dl,o.content);
        this.title = dom.mk('span',dt,o.title);
        this.selector = dom.mk('span',dt);
        this.expanded = false;
        dt.addEventListener('click', function(event) {
            event.preventDefault();
            self.toggle();
        });
        this.managers.event.on('disabled', function() {
            return self.collapse();
        });
        if (o.expand)
            this.expand();
    };
    InstanceAccordionSection.prototype.expand = function() {
        if (this.disabled)
            return;
        var p = this.parent;
        if (! p.multiExpand)
            p.collapseAll();
        this.container.classList.add('expand');
        this.expanded = true;
        return this.managers.event.dispatch('expand');
    };
    InstanceAccordionSection.prototype.collapse = function() {
        this.container.classList.remove('expand');
        this.expanded = false;
        return this.managers.event.dispatch('collapse');
    };
    InstanceAccordionSection.prototype.toggle = function() {
        if (this.expanded)
            return this.collapse();
        return this.expand();
    };

    var InstanceAccordion = function(o) {
        bless.call(this,{
            name:'instance.accordion',
            parent:o.parent,
            asRoot:true,
            stash:o.stash,
            container:function(dom) { 
                return dom.mk('div',o.container,null,o.className);
            }
        });
        var sections = this.sections = [];
        this.multiExpand = o.multiExpand;
        this.managers.event
            .on('section.destroy', function(s) {
                sections.splice(sections.indexOf(s.value),1);
            });
    };

    InstanceAccordion.prototype.init = function(o) {
        var self = this;
        return (o.sections
            ? 
            o.sections.reduce(function(a,b) {
                return a.then(function() {
                    return self.addSection(b);
                });
            }, Promise.resolve())
            :
            Promise.resolve()
        ).then(function() {
            return self.managers.event.dispatch('init');
        });
    };

    InstanceAccordion.prototype.addSection = function(o) {
        o.parent = this;
        var s = new InstanceAccordionSection(o);
        this.sections.push(s);
        return this.managers.event.dispatch('addSection',s);
    };
    InstanceAccordion.prototype.collapseAll = function() {
        var self = this;
        return Promise.all(this.sections.map(function (s) {
            return s.collapse();
        })).then(function() {
            return self.managers.event.dispatch('collapseAll');
        });
    };
    InstanceAccordion.prototype.expandAll = function() {
        if (! this.multiExpand)
            throw Error("Accordion multi-expand is disabled");
        var self = this;
        return Promise.all(this.sections.map(function (s) {
            if (! s.disabled)
                return s.expand();
        })).then(function() {
            return self.managers.event.dispatch('expandAll');
        });
    };
    return InstanceAccordion;
};


})();
