
$(document).ready(function () {
    //$.getScript("/Scripts/dockpanel/jquery.dockpanel.viewmodel.js");

    (function ($) {
        $.fn.createNavigation = function (config) {
            navigationInit(this[0], config);
            this[0].NavigateForward(config.navigationPathList[0].key);
        };
    }(jQuery));
});


function navigationInit(mainObject, config) {
    mainObject._allNavigationList = [];

    mainObject.NavigationList = ko.observableArray();


    $.each(config.navigationPathList, function(index, item) {
        mainObject._allNavigationList.push(item);
    });


    mainObject.NavigateForward = function (nextType) {
        if (nextType == null) {
            var currentNavIndex = findWithAttr(mainObject._allNavigationList, 'key', mainObject.NavigationList()[mainObject.NavigationList().length -1].value);
            if (mainObject._allNavigationList.length != currentNavIndex) {
                nextType = mainObject._allNavigationList[currentNavIndex + 1].key;
            }
        }

        if (nextType != null) {
            mainObject.NavigationList.push({ value: nextType });
            mainObject.GoToNavigation(nextType);
        }
    }


    mainObject.GoToNavigation = function(type) {
        $('#' + config.mainContentControlId).unbind();
        ko.cleanNode(document.getElementById(config.mainContentControlId));

        var currentNavIndex = findWithAttr(mainObject._allNavigationList, 'key', type);
        var currentNav = mainObject._allNavigationList[currentNavIndex];
        currentNav.viewModel.CurrentType = type;
        currentNav.viewModel.NextType = currentNavIndex != mainObject._allNavigationList.length ? mainObject._allNavigationList[currentNavIndex + 1].key : "";
        $('#' + config.mainContentControlId).load(currentNav.path, function () {
            ko.applyBindings(currentNav.viewModel, $('#' + config.mainContentControlId)[0]);
        });


    }

    
    mainObject.NavigateBackward = function(type) {
        if (type == null) {
            if (mainObject.NavigationList().length > 1) {
                mainObject.NavigationList.pop();
                type = mainObject.NavigationList()[mainObject.NavigationList().length - 1].value;
                mainObject.GoToNavigation(type);
            }
        } else {
            var index = findWithAttr(mainObject.NavigationList(), 'value', type) + 1;
            //var index = this.NavigationList.indexOf(type) + 1;
            var count = this.NavigationList().length;
            mainObject.NavigationList.splice(index, count - index);

            mainObject.GoToNavigation(type);
        }
    }


};


function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
}
