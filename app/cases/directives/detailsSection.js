'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaCaseDetails', function () {
  return {
    templateUrl: 'cases/views/detailsSection.html',
    controller: 'DetailsSection',
    scope: {
      compact: '=',
      loading: '='
    },
    restrict: 'EA',
    link: function postLink(scope, element, attrs) {
    }
  };
});
