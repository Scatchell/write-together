//todo sort lines by creation date

var currentUser = "Anthony";

Lines = new Mongo.Collection("lines");

if (Meteor.isClient) {
    //Session.setDefault('counter', 0);

    var lines = function() {
        var list = Lines.find({}).fetch();
        var sortedList = MeteorHelpers.sortByParents(list);

        return sortedList;
    };

    var addNewLine = function (event) {
        event.preventDefault();

        var newLineText = $("#new-line-text").val();

        var currentLines = lines();

        var order = (currentLines.length == 0) ? 0 : currentLines[currentLines.length - 1].ordering + 1;

        Lines.insert({
            text: newLineText,
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            favorites: 0,
            poemId: 0,
            ordering: order
        });

        $("#new-line-text").val('');
    };

    var addNewReplacementLine = function (event, line) {
        event.preventDefault();

        var newLineText = $("#"+line._id+".replacement-line-text").val();

        Lines.insert({
            text: newLineText,
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            favorites: 0,
            poemId: 0,
            ordering: line.ordering
        });

        $("#"+line._id+".replacement-line-text").val('');
        $("#"+line._id+".replacement-line").hide();
    };

    Template.body.helpers({
        lines: lines,
        log: function () {
            console.log(this);
        }
    });

    Template.line.helpers({
        log: function () {
            console.log(this);
        }
    });

    Template.body.events({
        'keypress #new-line-text': function(event) {
            if (event.which === 13) {
                addNewLine(event);
            }
        },
        'click #add-new-line-link': addNewLine,
        'click .replace-line': function (event) {
            event.preventDefault();
            var replacementLine = $("#" + this._id + ".replacement-line");
            if(replacementLine.is(":visible")){
                replacementLine.hide();
            } else {
                $(".replacement-line").hide();
                replacementLine.show();
            }
        },
        'click #add-replacement-line-link': function(event) {
            addNewReplacementLine(event, this);
        },
        'keypress .replacement-line-text': function(event) {
            if (event.which == 13) {
                addNewReplacementLine(event, this);
            }
        },
        'click .favorite-up a': function (event) {
            event.preventDefault();
            Lines.update(this._id, {
                $set: { favorites: this.favorites + 1 }
            });
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
