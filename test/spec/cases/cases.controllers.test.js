'use strict';

describe('Case Controllers', function() {

	var mockScope;
	var attachmentsService;
	var securityService;
	var caseService;
	var alertService;
	var recommendationsService
	var strataService;
	var groupService;
	var q;
	var deferred;
	var compile;
	var fakeStrataService;
	var fakeAttachmentService;
	var fakeGroupService;
	var modalInstance;
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
				},
				get : function(id) {
					deferred = q
				}
			},
			groups: {
				create : function(groupName) {
					deferred = q.defer();

					return deferred.promise
				}
			},
			values: {
				cases : {
					severity : function() {
						deferred = q.defer();

						return deferred.promise
					},
					types : function() {
						deferred = q.defer();

						return deferred.promise
					}
				}
			},
			products: {
				list: function() {
					deferred = q.defer();

					return deferred.promise
				}
			}
		};

		fakeAttachmentService = {
			updateAttachments : function(caseId) {
				deferred = q.defer();

				return deferred.promise
			}
		};

		modalInstance = {                    // Create a mock object using spies
        		close: jasmine.createSpy('modalInstance.close'),
        		dismiss: jasmine.createSpy('modalInstance.dismiss'),
        		result: {
      					then: jasmine.createSpy('modalInstance.result.then')
    			}
		};

		fakeGroupService = 	function (fakeStrataService) {
			this.reloadTable;
    		this.groupsOnScreen = [];
		};

		inject(function ($injector, $rootScope, $q, $compile) {
			attachmentsService = $injector.get('AttachmentsService');
			securityService = $injector.get('securityService');
			strataService = $injector.get('strataService');
			alertService = $injector.get('AlertService');
			caseService = $injector.get('CaseService');
			recommendationsService = $injector.get('RecommendationsService');
			groupService = $injector.get('GroupService');
			mockScope = $rootScope.$new();
    		compile = $compile;
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


		var file = {files: [{
				fileSize: 32323,
				fileName: 'gfdsfds'
		}]};

		var fileUploader = [file];
		spyOn(window, "$").andReturn(fileUploader);
		var result = $("#fileUploader")[0].files;
		console.log(JSON.stringify(result));

		expect(mockScope.selectFile).toBeDefined();
		console.log('fileUploader contents: ' + JSON.stringify($('#fileUploader')[0].files[0]));
		mockScope.selectFile();
	}));

	it('should get file on click', inject(function ($controller) {
		$controller('AttachLocalFile', {
			$scope: mockScope,
			AttachmentsService: attachmentsService,
			securityService: securityService
		});

		var element = angular.element('<div ><button ng-click="getFile()" ng-disabled="disabled" class="btn">Attach local file</button><div ><input id="fileUploader" type="file" value="/tmp/test.txt" rha-on-change="selectFile" ng-model="file" ng-disabled="enabled"/></div></div><div ><div >{{fileName}}</div></div></div><div ><div ><span></span></div></div><div ><div class="col-xs-12"><input placeholder="File description" ng-model="fileDescription" ng-disabled="disabled" class="form-control"/></div></div><div class="row rha-create-field"><div class="col-xs-12"><button ng-disabled="fileName == NO_FILE_CHOSEN || disabled" style="float: right;" ng-click="addFile(fileUploaderForm)" class="btn">Add</button></div>');
		var e = compile(element)(mockScope);
		$("body").append(e);
		mockScope.$digest();

		expect(mockScope.getFile).toBeDefined();
		mockScope.getFile();
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

	it('should update attachement in attachment list', inject(function ($controller) {
		$controller('AttachmentsSection', {
			$scope: mockScope,
			AttachmentsService: fakeAttachmentService,
			CaseService: caseService
		});

		mockScope.doUpdate();
		deferred.resolve('540155');
		spyOn(fakeAttachmentService, 'updateAttachments').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('should get an error while updating an attachement in attachment list', inject(function ($controller) {
		$controller('AttachmentsSection', {
			$scope: mockScope,
			AttachmentsService: fakeAttachmentService,
			CaseService: caseService
		});

		mockScope.doUpdate();
		deferred.reject();
		spyOn(fakeAttachmentService, 'updateAttachments').andCallThrough();
		mockScope.$root.$digest();
	}));

	/*it('should create case group', inject(function ($controller) {
		$controller('CreateGroupModal', {
			$scope: mockScope,
			$modalInstance: modalInstance,
			strataService: fakeStrataService,
			CaseService: caseService,
			GroupServie: fakeGroupService
		});

		mockScope.createGroup();
		deferred.resolve('Test_Group');
		spyOn(fakeStrataService.groups, 'create').andCallThrough();
		spyOn(fakeGroupService).andCallThrough();
		mockScope.$root.$digest();
	}));*/
	
	it('should select the severity of a case', inject(function ($controller) {
		$controller('SeveritySelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService,
			AlertService: alertService
		});

		deferred.resolve('Urgent');
		spyOn(fakeStrataService.values.cases, 'severity').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('should get an error while selecting  the severity of a case', inject(function ($controller) {
		$controller('SeveritySelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService,
			AlertService: alertService
		});

		deferred.reject();
		spyOn(fakeStrataService.values.cases, 'severity').andCallThrough();
		mockScope.$root.$digest();
	}));
	
	it('should select the type of a case', inject(function ($controller) {
		$controller('TypeSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService,
			AlertService: alertService
		});

		deferred.resolve('Other');
		spyOn(fakeStrataService.values.cases, 'types').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('should get an error while selecting the type of a case', inject(function ($controller) {
		$controller('TypeSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService,
			AlertService: alertService
		});

		deferred.reject();
		spyOn(fakeStrataService.values.cases, 'types').andCallThrough();
		mockScope.$root.$digest();
	}));

	it('should select product for case', inject(function ($controller) {
		$controller('ProductSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService
		});

		deferred.resolve("Red Hat Enterprise Linux");
		spyOn(fakeStrataService.products, 'list');
		mockScope.$root.$digest();
	}));

	it('should get an error while selecting product for case', inject(function ($controller) {
		$controller('ProductSelect', {
			$scope: mockScope,
			strataService: fakeStrataService,
			securityService: securityService,
			CaseService: caseService
		});

		deferred.reject();
		spyOn(fakeStrataService.products, 'list');
		mockScope.$root.$digest();
	}));
});