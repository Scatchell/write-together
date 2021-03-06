MeteorHelpers = {
    //todo rename this method
    sortByParents: function(list) {
        if(list.length == 0) return [];

        //remove?
        var sortedLines = list.sort(function(a,b){
            return a.ordering - b.ordering;
        });

        var sortedList = [];

        MeteorHelpers.uniqueOrderingValues(sortedLines).forEach(function(orderingValue, index){
            var linesMatchingOrderingValue = list.filter(function(line) {
                return line.ordering == orderingValue;
            });

            var matchingItemsSortedByFavorites = linesMatchingOrderingValue.sort(function(a,b) {
                return b.favorites - a.favorites;
            });

            var topRatedMatch = matchingItemsSortedByFavorites[0];
            topRatedMatch.isAlternative = false;

            topRatedMatch.alternatives = matchingItemsSortedByFavorites.slice(1);
            topRatedMatch.alternatives.forEach(function(line) {
                line.isAlternative = true;
            });

            topRatedMatch.index = index;
            sortedList.push(topRatedMatch);
        });

        return sortedList;

    },
    uniqueOrderingValues: function(list) {
        return list.reduce(function(array, element){
            if(array.indexOf(element.ordering) < 0) array.push(element.ordering);
            return array;
        }, []);
    }
}
