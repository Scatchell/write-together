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

        it("should order alt lines with same number of favorites correctly", function() {
            var lineSix = {
                _id: 6,
                text: 'line6',
                favorites: 0,
                ordering: 1
            };

            var lineFive = {
                _id: 5,
                text: 'line5',
                favorites: 0,
                ordering: 1
            };

            list.push(lineSix);
            list.push(lineFive);

            var sortedList = MeteorHelpers.sortByParents(list);
            var sortedListIds = sortedList.map(toIds);
            expect(sortedListIds).toEqual([1,4,2]);
            var lineWithAlternatives = sortedList[1];
            expect(lineWithAlternatives.alternatives.length).toEqual(3);
            expect(lineWithAlternatives.alternatives.map(toIds)).toEqual([3,6,5]);
        });

        it("should add any alternative lines to a line", function() {
            var sortedList = MeteorHelpers.sortByParents(list);
            var lineWithAlternatives = sortedList[1];
            expect(lineWithAlternatives.isAlternative).toEqual(false);
            expect(lineWithAlternatives.alternatives[0].isAlternative).toEqual(true);
            expect(lineWithAlternatives.alternatives).toEqual([lineThree]);
        });

        it("should keep index of lines in order", function() {
            var sortedList = MeteorHelpers.sortByParents(list);
            expect(sortedList[0].index).toEqual(0);
            expect(sortedList[1].index).toEqual(1);
            expect(sortedList[2].index).toEqual(2);
        });


    });
});
