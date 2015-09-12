Router.configure({
    layoutTemplate: 'mainLayout'
});

Router.route('/', function() {
    this.render('Poems');
});

Router.route('Poems', {
    path: '/poems',
});

Router.route('Poem', {
    path: '/poem/:poemId',
    data: function(){
        return Poems.findOne({_id: this.params.poemId});
    },
    yieldTemplates: {
        'fullPoem': {to: 'fullPoem'}
    },
    onAfterAction: function(){
        $(".poem-text").each(function(i, e){
            $(e).hide();
        });
    }
});

Router.route('Instructions', {
    path: '/instructions',
    layoutTemplate: 'layoutWithoutRightSide'
});
