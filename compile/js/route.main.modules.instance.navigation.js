module.exports = function(app) {

    return function(model) {

        var data = {

            demo : " \n \
view.createAppend('button',c,{ \n \
    en : 'Alert Me!', \n \
    fr : 'Alertez-moi!' \n \
}).addEventListener('click', function() { \n \
    view.instances.add('navigation').then(function(l) { \n \
        l.alert({ message:{ \n \
            en : 'Nothing to see here.', \n \
            fr : 'Rien à voir ici.' \n \
        }}); \n \
    }); \n \
});",
            desc : {
                en : 'Provides a universal navigation menu system using standard UL and LI elements with definable CSS styles.',
                fr : 'Fournit un système de menu de navigation universelle utilisant des éléments UL et LI standards avec des styles CSS définissables.'
            },
            author : { 
                name:'Andrew Charnley', 
                link:'mailto:andrew.charnley@igaro.com' 
            },
            usage : {
                instantiate : true,
                attributes : [
                    { 
                        name:'container', 
                        type:'element',
                        desc : {
                            en : 'Container to append the instance into.',
                            fr : 'Conteneur pour ajouter l\'instance en.'
                        }
                    }
                ]
            },
            attributes : [
                { 
                    name:'alert',
                    type:'function',
                    returns : {
                        attributes : [{
                            instanceof: { name: 'Promise' },
                            desc : {
                                en : 'Resolves when the user actions the view.',
                                fr : 'Décide lorsque les actions de l\'utilisateur de la vue.'
                            }
                        }]
                    },
                    desc: {
                        en : 'Displays an alert dialog.',
                        fr : 'Affiche un message d\'alerte.'
                    },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name : 'message',
                                    type : 'object',
                                    desc: {
                                        en : 'A language object to use for the message.',
                                        fr : 'Un objet de la langue à utiliser pour le message.'
                                    }
                                }
                            ]
                        }
                    ]
                },
                { 
                    name:'confirm',
                    type:'function',
                    returns : {
                        attributes : [{
                            instanceof: { name: 'Promise' },
                            desc : {
                                en : 'Resolves when the user actions the view. If cancelled, cancel:true will be passed to the Promise resolve.',
                                fr : 'Décide lorsque les actions de l\'utilisateur de la vue. En cas d\'annulation, annuler: true sera transmis à la volonté Promise.'
                            }
                        }]
                    },
                    desc: {
                        en : 'Displays a confirm or cancel dialog.',
                        fr : 'Affiche une boîte de dialogue pour confirmer ou annuler.'
                    },
                    attributes : [
                        {
                            type:'object',
                            attributes : [
                                {
                                    name : 'message',
                                    type : 'object',
                                    desc: {
                                        en : 'A language object to use for the message.',
                                        fr : 'Un objet de la langue à utiliser pour le message.'
                                    }
                                },
                                {
                                    name : 'inputs',
                                    type : 'element',
                                    desc: {
                                        en : 'Present additional choices by supplying a div containing extra form elements.',
                                        fr : 'Présenter des choix supplémentaires en fournissant un div contenant des éléments de formulaires supplémentaires.'
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        model.parent.store.childsupport(data,model);

    };
};