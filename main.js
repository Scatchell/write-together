var currentUser = "Anthony";

Lines = new Mongo.Collection("lines");
var lines = function() {
    var list = Lines.find({}).fetch();

    return MeteorHelpers.sortByParents(list);
}

if (Meteor.isClient) {
    // counter starts at 0
    Session.setDefault('counter', 0);

    Template.body.helpers({
        lines: lines
    });

    Template.body.events({
        'click #add-new-line-link': function (event) {
            event.preventDefault();

            var newLineText = $("#new-line-text").val();

            var currentLines = lines();

            var parent = (currentLines.length == 0) ? 'top' : currentLines[currentLines.length - 1]._id;

            Lines.insert({
                text: newLineText,
                userId: Meteor.userId(),
                userName: Meteor.user().username,
                favorites: 0,
                parent: parent
            })

            //$("#new-line-text").val("");
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
