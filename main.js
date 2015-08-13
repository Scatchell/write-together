

var currentUser = "Anthony";

Lines = new Mongo.Collection("lines");

if (Meteor.isClient) {
    //Session.setDefault('counter', 0);

    var clearAllPoemExamples = function() {
        $(".poem-text").each(function(i, e){
            $(e).hide();
        });
    };

    var lines = function() {
        var list = Lines.find({}, {sort: {createdAt: 1}}).fetch();
        var sortedList = MeteorHelpers.sortByParents(list);

        return sortedList;
    };

    var sendReminderEmailToAllUsers = function (bodyText) {
        var users = Meteor.users.find({}, {fields: {"emails": 1}});
        users.forEach(function(user){
            if(user.emails != undefined) {
                Meteor.call('sendEmail',
                            user.emails[0].address,
                            'write.together.no.reply@gmail.com',
                            'New changes have been made!',
                            bodyText);

                            console.log("Email sent to: " + user.emails[0].address);
            }
        });

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
            createdAt: new Date(),
            ordering: order
        });

        sendReminderEmailToAllUsers("A new line has been added to your poem! It is: " + newLineText);

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
            createdAt: new Date(),
            ordering: line.ordering
        });

        sendReminderEmailToAllUsers("A new replacement line has been added to your poem! It is: " + newLineText);

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
        },
        'click #poem-1-title': function (event) {
            clearAllPoemExamples();

            $("#poem-1").show();
        },
        'click #poem-2-title': function (event) {
            clearAllPoemExamples();
            $("#poem-2").show();
        },
        'click #clear-all-poem-examples': function (event) {
            clearAllPoemExamples();
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_AND_EMAIL"
    });

    Template.header.rendered = function() {
        $('.button-collapse').sideNav({
            menuWidth: 450, // Default is 240
            edge: 'right', // Choose the horizontal origin
            closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
        });
    }
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
      sendEmail: function (to, from, subject, text) {
        check([to, from, subject, text], [String]);

        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();

        Email.send({
          to: to,
          from: from,
          subject: subject,
          text: text
        });
      }
    });
}

