'use strict';
/*jshint unused:vars */

angular.module('RedhatAccess.cases')
.directive('rhaCaseAttachments', function () {
  return {
    templateUrl: 'cases/views/attachmentsSection.html',
    restrict: 'EA',
    controller: 'AttachmentsSection',
    scope: {
      loading: '='
    },
    link: function postLink(scope, element, attrs) {
    }
  };
});
