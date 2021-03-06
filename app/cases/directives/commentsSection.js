'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
  .directive('rhaCaseComments', function() {
    return {
      templateUrl: 'cases/views/commentsSection.html',
      controller: 'CommentsSection',
      scope: {
        loading: '='
      },
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {}
    };
  });
