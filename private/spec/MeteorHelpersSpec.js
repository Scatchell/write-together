describe("Rate", function() {
    var list;

    beforeEach(function() {
        list = [
            {
            id: 1,
            text: 'line1',
            parent: 'top'
        },
        {
            id: 2,
            text: 'line2',
            parent: 3
        },
        {
            id: 3,
            text: 'line3',
            parent: 1
        },
        ];
    });

    it("should sort a list by parents", function() {
        var sortedList = MeteorHelpers.sortByParents(list);
        var sortedListIds = sortedList.map(function(e){ return e.id; })
        expect(sortedListIds).toEqual([1,3,2])
    });

});
