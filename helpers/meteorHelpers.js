MeteorHelpers = {
    sortByParents: function(list) {
        if(list.length == 0) return [];

        var top = list.filter(function(e){
            return e.parent == 'top';
        })[0];

        var others = list.filter(function(e){
            return e.parent != 'top';
        });

        var sortedList = [top];

        var workingItem = top;
        others.forEach(function(e){
            workingItem = others.filter(function(filterElement) {
                return filterElement.parent == workingItem._id;
            })[0];

            sortedList.push(workingItem);
        });

        return sortedList;

    }
}
