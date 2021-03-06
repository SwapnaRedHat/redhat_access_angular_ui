'use strict';
angular.module('RedhatAccess.cases', [
  'ui.router',
  'ui.bootstrap',
  'ui.select2',
  'ngTable',
  'RedhatAccess.template',
  'RedhatAccess.security',
  'RedhatAccess.search',
  'RedhatAccess.ui-utils',
  'RedhatAccess.common',
  'RedhatAccess.header'
])
.constant('CASE_EVENTS', {
  received: 'case-received'
})
.constant('CHAT_SUPPORT', {
  chatButtonToken: '573A0000000GmiP',
  chatLiveAgentUrlPrefix: 'https://d.la6cs.salesforceliveagent.com/chat',
  chatInitHashOne: '572A0000000GmiP',
  chatInitHashTwo: '00DJ0000000DkMi'
})
.constant('ENTITLEMENTS', {
  standard: 'STANDARD',
  premium: 'PREMIUM',
  default: 'DEFAULT'
})
.constant('STATUS', {
  open: 'open',
  closed: 'closed',
  both: 'both'
})
.value('NEW_DEFAULTS', {
  'product': '',
  'version': ''
})
.value('GLOBAL_CASE_CONFIG', {
  'showRecommendations': true,
  'showAttachments': true
})
.value('NEW_CASE_CONFIG', {
  'showRecommendations': true,
  'showAttachments': true,
  'showServerSideAttachments': true
})
.value('EDIT_CASE_CONFIG', {
  'showDetails': true,
  'showDescription': true,
  'showBugzillas': true,
  'showAttachments': true,
  'showRecommendations': true,
  'showComments': true,
  'showServerSideAttachments': true,
  'showEmailNotifications': true
})
.value('SEARCH_CASE_CONFIG', {
  'showChat': true
})
.config([
  '$stateProvider',
  function ($stateProvider) {

    $stateProvider.state('compact', {
      url: '/case/compact?sessionId',
      templateUrl: 'cases/views/compact.html'
    });

    $stateProvider.state('compact.edit', {
      url: '/{id:[0-9]{1,8}}',
      templateUrl: 'cases/views/compactEdit.html',
      controller: 'CompactEdit'
    });

    $stateProvider.state('edit', {
      url: '/case/{id:[0-9]{1,8}}',
      templateUrl: 'cases/views/edit.html',
      controller: 'Edit'
    });

    $stateProvider.state('new', {
      url: '/case/new',
      templateUrl: 'cases/views/new.html',
      controller: 'New'
    });

    $stateProvider.state('list', {
      url: '/case/list',
      templateUrl: 'cases/views/list.html',
      controller: 'List'
    });

    $stateProvider.state('searchCases', {
      url: '/case/search',
      templateUrl: 'cases/views/search.html',
      controller: 'Search'
    });

    $stateProvider.state('group', {
      url: '/case/group',
      controller: 'Group',
      templateUrl: 'cases/views/group.html'
    });
  }
]);
