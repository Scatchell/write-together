describe("CollabPoem", function() {
    var list;
    var toIds = function(e) {
        return e._id;
    };
    var lineThree = {
        _id: 3,
        text: 'line3',
        favorites: 0,
        ordering: 1
    };

    beforeEach(function() {
        list = [
            {
            _id: 1,
            text: 'line1',
            favorites: 0,
            ordering: 0
        },
        {
            _id: 2,
            text: 'line2',
            favorites: 0,
            ordering: 2
        },
        lineThree
        ];
    });

    it("should sort a list by order attribute", function() {
        var sortedList = MeteorHelpers.sortByParents(list);
        var sortedListIds = sortedList.map(toIds);
        expect(sortedListIds).toEqual([1,3,2]);
    });

    it("should ignore an empty list", function(){
        expect(MeteorHelpers.sortByParents([])).toEqual([]);
    });

    describe("Multiple lines with same parent", function(){
        beforeEach(function() {
            list.push({
                _id: 4,
                text: 'line3 alternative',
                favorites: 2,
                ordering: 1
            });
        });


        it("should get number of lines with unique ordering values", function() {
            var uniqueOrderingValues = MeteorHelpers.uniqueOrderingValues(list);
            expect(uniqueOrderingValues).toEqual([0, 2, 1]);
        });

        it("should use only highest ranked lines when sorting", function() {
            var sortedList = MeteorHelpers.sortByParents(list);
            var sortedListIds = sortedList.map(toIds);
            expect(sortedListIds).toEqual([1,4,2]);
        });

        it("should add any alternative lines to a line", function() {
            var sortedList = MeteorHelpers.sortByParents(list);
            var lineWithAlternatives = sortedList[1];
            expect(lineWithAlternatives.isAlternative).toEqual(false);
            expect(lineWithAlternatives.alternatives[0].isAlternative).toEqual(true);
            expect(lineWithAlternatives.alternatives).toEqual([lineThree]);
        });
    });
});
