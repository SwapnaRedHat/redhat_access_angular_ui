'use strict';

describe('Case Controllers', function() {

	var mockScope;
	var attachmentsService;
	var securityService;
	var caseService;
	var alertService;
	var recommendationsService
	var strataService;
	var q;
	var deferred;
	var fakeStrataService;
	var account = {"has_group_acls":false,"is_secure":false,"name":"GLOBAL SUPPORT SERVI RED HAT, INC.","number":"540155"};

	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(function () {
		fakeStrataService = {
			accounts: {
				get : function() {
					deferred = q.defer();
					
					return deferred.promise
				},
				list : function() {
					deferred = q.defer();

					return deferred.promise
				}
			},
			cases: {
				csv : function() {
					deferred = q.defer();
					
					return deferred.promise
				}
			}
		};

		inject(function ($injector, $rootScope, $q) {
			attachmentsService = $injector.get('AttachmentsService');
			securityService = $injector.get('securityService');
			strataService = $injector.get('strataService');
			alertService = $injector.get('AlertService');
			caseService = $injector.get('CaseService');
			recommendationsService = $injector.get('RecommendationsService');
			mockScope = $rootScope.$new();
			q = $q;

		});
	});


	it('should have a function for updating case details', inject(function ($controller) {

				$controller('DetailsSection', {
						$scope: mockScope,
						CaseService: caseService,
						strataService: strataService
				});

				var caseJSON = {};
				caseService.case.case_number = '1234';
				expect(mockScope.updateCase).toBeDefined();
				var deferred = q.defer();
				spyOn(strataService.cases, 'put').andReturn(deferred.promise);
		        deferred.resolve();
		        mockScope.updateCase();
		        expect(strataService.cases.put).toHaveBeenCalledWith("1234", caseJSON);
				
	}));

	it('should have a function for adding comments to case', inject(function ($controller) {

			$controller('AddCommentSection', {
					$scope: mockScope,
					CaseService: caseService,
					strataService: strataService
			});

			caseService.case.case_number = '1234';
			caseService.commentText = 'test comment';
			expect(mockScope.addComment).toBeDefined();
			var deferred = q.defer();
			spyOn(strataService.cases.comments, 'post').andReturn(deferred.promise);
	        deferred.resolve();
			mockScope.addComment();
			expect(strataService.cases.comments.post).toHaveBeenCalledWith("1234", 'test comment');			

	
	}));

	it('should have a function for adding draft comments to case', inject(function ($controller) {

			$controller('AddCommentSection', {
					$scope: mockScope,
					CaseService: caseService,
					strataService: strataService
			});

			caseService.case.case_number = '1234';
			caseService.commentText = 'test comment';
			caseService.draftComment = {};
			caseService.draftComment.id = '1111';
			expect(mockScope.addComment).toBeDefined();
			var deferred = q.defer();
			spyOn(strataService.cases.comments, 'put').andReturn(deferred.promise);
	        deferred.resolve();
			mockScope.addComment();
			expect(strataService.cases.comments.put).toHaveBeenCalledWith("1234", 'test comment', false, '1111');						

	
	}));

	it('should have a function for fetching recommendations', inject(function ($controller) {

			$controller('New', {
					$scope: mockScope,
					RecommendationsService: recommendationsService,
					strataService: strataService
			});

			var newData = {
		        product: 'Red Hat Enterprise Linux',
		        version: '6.0',
		        summary: 'test case summary',
		        description: 'test case description'		        
  			};

  			caseService.case.product = 'Red Hat Enterprise Linux';
	        caseService.case.version = '6.0';
	        caseService.case.summary = 'test case summary';
	        caseService.case.description = 'test case description';

  			expect(mockScope.getRecommendations).toBeDefined();
  			var deferred = q.defer();
			spyOn(strataService, 'problems').andReturn(deferred.promise);
	        deferred.resolve();
			mockScope.getRecommendations();
			expect(strataService.problems).toHaveBeenCalledWith(newData,5);						

	
	}));
	
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

		mockScope.fileName = "test_file";
		mockScope.fileDescription = "test_description";

		expect(mockScope.clearSelectedFile).toBeDefined();
		mockScope.clearSelectedFile();
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

	it('shoud get error for exporting all cases as CSV', inject(function ($controller) {
		$controller('ExportCSVButton', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService
		});

		expect(mockScope.export).toBeDefined();
		mockScope.export();
		deferred.reject();
		spyOn(fakeStrataService.cases, 'csv').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('shoud export all cases as CSV', inject(function ($controller) {
		$controller('ExportCSVButton', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService
		});

		expect(mockScope.export).toBeDefined();
		mockScope.export();
		deferred.resolve();
		spyOn(fakeStrataService.cases, 'csv').andCallThrough();
		mockScope.$root.$digest();
		expect(mockScope.exporting).toEqual(false);
	}));

	it('should select user account', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService,
			CaseService: caseService
		});

		mockScope.selectUserAccount();
		deferred.resolve('540155');
		spyOn(fakeStrataService.accounts, 'list').andCallThrough();
		mockScope.$root.$digest();
		expect(mockScope.loadingAccountNumber).toEqual(false);
	}));

	it('should get error while selecting user account', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService,
			CaseService: caseService
		});

		mockScope.selectUserAccount();
		deferred.reject();
		spyOn(fakeStrataService.accounts, 'list').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('should populate account specific fields', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService,
			CaseService: caseService
		});

		caseService.account.number = 540155;
		mockScope.alertInstance = 'Account found'
		mockScope.populateAccountSpecificFields();
		deferred.resolve(account);
		spyOn(fakeStrataService.accounts, 'get').andCallThrough();
		mockScope.$root.$digest();	
	}));

	it('should not get account specific fields', inject(function ($controller) {
		$controller('AccountSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			AlertService: alertService,
			CaseService: caseService
		});

		caseService.account.number = 540155;
		mockScope.alertInstance = 'Account Not found'
		mockScope.populateAccountSpecificFields();
		deferred.reject();
		spyOn(fakeStrataService.accounts, 'get').andCallThrough();
		mockScope.$root.$digest();	
	}));
});