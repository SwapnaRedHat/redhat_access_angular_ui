'use strict';

describe('Case Controllers', function() {

	var mockScope;
	var attachmentsService;
	var securityService;
	var caseService;
	var treeViewSelectorUtils;
	var alertService;
	var strataService;
	var q;

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(function () {
		inject(function ($injector, $rootScope, $q) {
			attachmentsService = $injector.get('AttachmentsService');
			securityService = $injector.get('securityService');
			strataService = $injector.get('strataService');
			alertService = $injector.get('AlertService');
			caseService = $injector.get('CaseService');
			mockScope = $rootScope.$new();
			q = $q;
		});
	});

	it('should have no file chosen with no description', inject(function ($controller) {

		$controller('AttachLocalFile', {
			$scope: mockScope,
			AttachmentsService: attachmentsService,
			securityService: securityService
		});

		expect(mockScope.NO_FILE_CHOSEN).toEqual('No file chosen');
		expect(mockScope.fileDescription).toEqual('');

	}));

	it('should clear filename and file description', inject(function ($controller) {
		$controller('AttachLocalFile', {
			$scope: mockScope,
			AttachmentsService: attachmentsService,
			securityService: securityService
		});

		expect(mockScope.clearSelectedFile).toBeDefined();
		expect(mockScope.fileName).toEqual('No file chosen');
		expect(mockScope.fileDescription).toEqual('');
	}));

	it('should get selected file', inject(function ($controller) {
		$controller('AttachLocalFile', {
			$scope: mockScope,
			AttachmentsService: attachmentsService,
			securityService: securityService
		});

		expect(mockScope.selectFile).toBeDefined();

	}));

	it('should add file to the list of attachments', inject(function ($controller) {
		$controller('AttachLocalFile', {
			$scope: mockScope,
			AttachmentsService: attachmentsService,
			securityService: securityService
		});

		mockScope.fileObj = 'test_data';
		mockScope.fileDescription = 'test_description';
		mockScope.fileName = 'test_file';
		mockScope.fileSize = '200MB';

		expect(mockScope.addFile).toBeDefined();
		mockScope.addFile();
		expect(attachmentsService.updatedAttachments.length).toEqual(1);

	}));

	it('should have status of cases as open', inject(function ($controller) {
		$controller('StatusSelect', {
			$scope: mockScope,
			securityService: securityService,
			CaseService: caseService,
			STATUS: 'Open'
		});

		expect(mockScope.STATUS).toEqual('Open');
		expect(mockScope.statuses[0].name).toEqual('Open and Closed');
		expect(mockScope.statuses[1].name).toEqual('Open');
		expect(mockScope.statuses[2].name).toEqual('Closed');
	}));
	
	it('should have status of cases as closed', inject(function ($controller) {
		$controller('StatusSelect', {
			$scope: mockScope,
			securityService: securityService,
			CaseService: caseService,
			STATUS: 'Closed'
		});

		expect(mockScope.STATUS).toEqual('Closed');
		expect(mockScope.statuses[0].name).toEqual('Open and Closed');
		expect(mockScope.statuses[1].name).toEqual('Open');
		expect(mockScope.statuses[2].name).toEqual('Closed');
	}));

	it('should have cases with status as Open and Closed', inject(function ($controller) {
		$controller('StatusSelect', {
			$scope: mockScope,
			securityService: securityService,
			CaseService: caseService,
			STATUS: 'Open and Closed'
		});

		expect(mockScope.STATUS).toEqual('Open and Closed');
		expect(mockScope.statuses[0].name).toEqual('Open and Closed');
		expect(mockScope.statuses[1].name).toEqual('Open');
		expect(mockScope.statuses[2].name).toEqual('Closed');
	}));

	it('shoud not export all cases as CSV', inject(function ($controller) {
		$controller('ExportCSVButton', {
			$scope: mockScope,
			strataService: strataService,
			AlertService: alertService
		});

		expect(mockScope.exporting).toEqual(false);
	}));

	it('shoud export all cases as CSV', inject(function ($controller) {
		$controller('ExportCSVButton', {
			$scope: mockScope,
			strataService: strataService,
			AlertService: alertService
		});
		expect(mockScope.export).toBeDefined();
		var deferred = q.defer();
		spyOn(strataService.cases, 'csv').andReturn(deferred.promise);
		deferred.resolve();
		mockScope.export();
		expect(strataService.cases.csv).toHaveBeenCalledWith();
	}));

	it('should select user account', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: strataService,
			AlertService: alertService,
			CaseService: caseService
		});

		expect(mockScope.selectUserAccount).toBeDefined();
		var deferred = q.defer();
		spyOn(strataService.accounts, 'list').andReturn(deferred.promise);
		deferred.resolve();
		mockScope.selectUserAccount();
		expect(strataService.accounts.list).toHaveBeenCalledWith();
	}));

	it('should populate account specific fields', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: strataService,
			AlertService: alertService,
			CaseService: caseService
		});

		expect(mockScope.populateAccountSpecificFields).toBeDefined();
		caseService.account.number = 1234;
		var deferred = q.defer();
		spyOn(strataService.accounts, 'get').andReturn(deferred.promise);
		deferred.resolve();
		mockScope.populateAccountSpecificFields();
		expect(strataService.accounts.get).toHaveBeenCalledWith(1234);
	}));
});