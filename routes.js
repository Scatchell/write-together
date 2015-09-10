Router.route('Lines', {
    path: '/',
    layoutTemplate: 'mainLayout'
});

Router.route('Poems', {
    path: '/poems',
    layoutTemplate: 'mainLayout'
});

Router.route('Poem', {
    path: '/poem/:poemId',
    layoutTemplate: 'mainLayout',
    data: function(){
        return Poems.findOne({_id: this.params.poemId});
    }
});
