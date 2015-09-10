//todo show validation error if no text is put into text box
//todo button to view final poem
//todo auto focus replacement line when arrows are clicked
//todo delete enabled for only your own lines?

Lines = new Mongo.Collection("lines");
Poems = new Mongo.Collection("poems");

if (Meteor.isClient) {
//poems ------------------------------------begin
   var poems = function() {
       return Poems.find({}).fetch();
   }
//poems ------------------------------------end


    var clearAllPoemExamples = function() {
        $(".poem-text").each(function(i, e){
            $(e).hide();
        });
    };

    var lines = function(poemId) {
        var list = Lines.find({poemId: poemId}, {sort: {createdAt: 1}}).fetch();
        var sortedList = MeteorHelpers.sortByParents(list);

        return sortedList;
    };

    var lines = function(poemId) {
        var list = Lines.find({poemId: poemId}, {sort: {createdAt: 1}}).fetch();
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

    var addNewLine = function (event, poemId) {
        event.preventDefault();

        var newLineText = $("#new-line-text").val();

        var currentLines = lines(poemId);

        var order = (currentLines.length == 0) ? 0 : currentLines[currentLines.length - 1].ordering + 1;

        var currentPoem = poemId;

        Lines.insert({
            text: newLineText,
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            favorites: 0,
            poemId: currentPoem,
            createdAt: new Date(),
            ordering: order
        });

        sendReminderEmailToAllUsers("A new line has been added to your poem! It is: " + newLineText);

        $("#new-line-text").val('');
    };

    var addNewReplacementLine = function (event, line) {
        event.preventDefault();

        var replacementLineInput = $("#replacement-line-text-"+line.index+".replacement-line-text");
        var newLineText = replacementLineInput.val();

        Lines.insert({
            text: newLineText,
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            favorites: 0,
            poemId: line.poemId,
            createdAt: new Date(),
            ordering: line.ordering
        });

        sendReminderEmailToAllUsers("A new replacement line has been added to your poem! It is: " + newLineText);

        replacementLineInput.val('');
        $("#replacement-line-"+line.index+".replacement-line").hide();
    };

    var addNewPoem = function (event) {
        event.preventDefault();

        var newPoemText = $("#new-poem-text").val();

        Poems.insert({
            title: newPoemText,
            userId: Meteor.userId(),
            userName: Meteor.user().username,
            favorites: 0,
            createdAt: new Date(),
        });

        $("#new-poem-text").val('');
    };

    Template.Poem.helpers({
        lines: function() {
            return lines(this._id);
        },
        log: function () {
            console.log(this);
        }
    });

    Template.fullPoem.helpers({
        lines: function() {
            return lines(this._id);
        },
    })

    Template.Poems.helpers({
        poems: poems,
        log: function () {
            console.log(this);
        }
    });

    Template.line.helpers({
        log: function () {
            console.log(this);
        }
    });

    Template.Poem.events({
        'keypress #new-line-text': function(event) {
            if (event.which === 13) {
                addNewLine(event, this._id);
            }
        },
        'click #add-new-line-link': addNewLine,
        'click .replace-line': function (event) {
            event.preventDefault();
            var replacementLine = $("#replacement-line-"+this.index+".replacement-line");
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
        'click .remove': function (event) {
            event.preventDefault();
            Lines.remove(this._id);
        },
    });

    Template.header.events({
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
            $("#full-poem").show();
        },
    });

    Template.Poems.events({
        'click #add-new-poem-link': function (event){
            addNewPoem(event);
        },
        'keypress #new-poem-text': function(event) {
            if (event.which === 13) {
                addNewPoem(event);
            }
        },
        'click .poem-view-link': function(event) {

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
        // without waiting for the email send to complete.
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

