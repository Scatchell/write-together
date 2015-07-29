var currentUser = "Anthony";

Lines = new Mongo.Collection("lines");
var lines = function() {
    var list = Lines.find({}).fetch();
    var sortedList = MeteorHelpers.sortByParents(list);

    //gather replacement lines into alternativeLines

    return sortedList;
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

            var order = (currentLines.length == 0) ? 0 : currentLines[currentLines.length - 1].ordering + 1;

            Lines.insert({
                text: newLineText,
                userId: Meteor.userId(),
                userName: Meteor.user().username,
                favorites: 0,
                ordering: order
            });

            $("#new-line-text").val('');
        },
        'click .replace-line': function (event) {
            var replacementLine = $("#" + this._id + ".replacement-line");
            if(replacementLine.is(":visible")){
                replacementLine.hide();
            } else {
                $(".replacement-line").hide();
                replacementLine.show();
            }
        },
        'click #add-replacement-line-link': function (event) {
            var newLineText = $("#"+this._id+".replacement-line-text").val();

            Lines.insert({
                text: newLineText,
                userId: Meteor.userId(),
                userName: Meteor.user().username,
                favorites: 0,
                ordering: this.ordering
            });

            $("#"+this._id+".replacement-line-text").val('');
            $("#"+this._id+".replacement-line").hide();
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
