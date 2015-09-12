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
        Meteor.call('sendEmail', bodyText);
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

        sendReminderEmailToAllUsers("A new line has been added to a poem, you might want to check it out! It is: \"" + newLineText + "\"");

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

        //todo make notifications only be sent out for poems users have posted on/subscribed to
        sendReminderEmailToAllUsers("A new replacement line has been suggested to a poem, you might want to check it out! It is: \"" + newLineText + "\"");

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

    var notificationsEnabled = function () {
        return Meteor.user().profile.notifications;
    };

    Template.notifications.helpers({
        notificationsEnabled: notificationsEnabled
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

    Template.notifications.events({
        'click #notifications-checkbox': function(event) {
            Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.notifications': !notificationsEnabled()}})
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
    Accounts.onCreateUser(function(options, user) {

    //debugger;
    //if (options.profile) {
        //options.profile.notifications = true;
        //user.profile = options.profile;
    //}

      user.profile = {
          "notifications": true
      }

    return user;
    });


    //Meteor.publish("userData", function () {
      //if (this.userId) {
        //return Meteor.users.find({_id: this.userId}, {fields: {'notifications': 1}});
      //} else {
        //this.ready();
      //}
    //});

    Meteor.startup(function () {
        // code to run on server at startup
    });

    Meteor.methods({
        sendEmail: function(bodyText) {
            // Let other method calls from the same client start running,
            // without waiting for the email send to complete.
            this.unblock();

            var users = Meteor.users.find({"profile.notifications": true}).fetch();
            debugger;
            users.forEach(function(user){
                Email.send({
                    to: user.emails[0].address,
                    from: 'write.together.no.reply@gmail.com',
                    subject: 'New changes have been made!',
                    text: bodyText
                });
            });
        }
    });
}

