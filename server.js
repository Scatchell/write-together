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

    Meteor.publish('lines', function () {
        return Lines.find();
    });

    Meteor.publish('poems', function () {
        return Poems.find();
    });

    var verifyUserAuthorized = function() {
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
    };

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
        },
        addNewLine: function(newLineText, currentPoem, order) {
            verifyUserAuthorized();

            Lines.insert({
                text: newLineText,
                userId: Meteor.userId(),
                userName: Meteor.user().username,
                favorites: 0,
                poemId: currentPoem,
                createdAt: new Date(),
                ordering: order
            });
        },
        removeLine: function(lineId) {
            verifyUserAuthorized();

            Lines.remove(lineId);
        },
        favoriteUp: function(lineId, currentFavorites) {
            //todo limit favorites to one per user per line
            verifyUserAuthorized();

            Lines.update(lineId, {
                $set: { favorites: currentFavorites + 1 }
            });
        },
        addNewPoem: function(newPoemText) {
            verifyUserAuthorized();

            Poems.insert({
                title: newPoemText,
                userId: Meteor.userId(),
                userName: Meteor.user().username,
                favorites: 0,
                createdAt: new Date(),
            });
        },
        updateNotificationsFlag: function(newFlagValue) {
            verifyUserAuthorized();

            Meteor.users.update(
                Meteor.userId(),
                {$set: {'profile.notifications': newFlagValue}}
            )
        }
    });
}
