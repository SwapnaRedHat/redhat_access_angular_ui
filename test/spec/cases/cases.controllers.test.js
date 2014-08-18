'use strict';

describe('Case Controllers', function() {

	var mockRecommendationsService;
	var mockSearchResultsService;
	var mockStrataService;
    var mockStrataDataService;
    var mockCaseService;
    var mockAttachmentsService;
    var mockGroupService;
    var mockAlertService;
	var mockScope;
	var compile;
	var q;
	
	beforeEach(angular.mock.module('RedhatAccess.cases'));
	beforeEach(angular.mock.module('RedhatAccess.mock'));

	beforeEach(inject(function ($injector, $rootScope, $q, $compile) {
		q = $q;
		compile = $compile;
		mockStrataService = $injector.get('strataService');
		mockCaseService = $injector.get('MockCaseService');
		mockRecommendationsService = $injector.get('MockRecommendationsService');
		mockSearchResultsService = $injector.get('MockSearchResultsService');
		mockStrataDataService = $injector.get('MockStrataDataService');
		mockAttachmentsService = $injector.get('MockAttachmentsService');
		mockGroupService = $injector.get('MockGroupService');
		mockAlertService = $injector.get('MockAlertService');
		mockScope = $rootScope.$new();							
			
	}));

	//Suite for DetailsSection
	describe('DetailsSection', function() {

		it('should have a function for initializing the selects of case types,product,status,severity and group', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        expect(mockScope.init).toBeDefined();
	        mockScope.init();	        
	        spyOn(mockStrataService.values.cases, 'types').andCallThrough();
	        spyOn(mockStrataService.groups, 'list').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'status').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
	        spyOn(mockStrataService.products, 'list').andCallThrough();	        
	        mockScope.$root.$digest();
	        expect(mockScope.caseTypes).toEqual(mockStrataDataService.mockTypes);	        
	        expect(mockScope.groups).toEqual(mockStrataDataService.mockGroups);
	        expect(mockScope.statuses).toEqual(mockStrataDataService.mockStatuses);
	        expect(mockCaseService.severities).toEqual(mockStrataDataService.mockSeverities);

  		}));

		it('should have a function for initializing the selects rejected', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        expect(mockScope.init).toBeDefined();
	        mockStrataService.rejectCalls();
	        	        
	        spyOn(mockStrataService.values.cases, 'types').andCallThrough();
	        spyOn(mockStrataService.groups, 'list').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'status').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
	        spyOn(mockStrataService.products, 'list').andCallThrough();	
	        mockScope.init();        
	        mockScope.$root.$digest();
	        expect(mockScope.caseTypes).toBeUndefined();        
	        expect(mockScope.groups).toBeUndefined();
	        expect(mockScope.statuses).toBeUndefined();	        
	        expect(mockCaseService.severities).toEqual([]);

  		}));

		it('should have a function for updating case details resolved', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        mockScope.caseDetails = {
	          $valid: true,
	          $setPristine: function() {}
	        };

	        mockCaseService.kase.case_number = '1234';
	        mockCaseService.kase.type = 'bug';
	        mockCaseService.kase.severity = 'high';
	        mockCaseService.kase.status = 'open';
	        mockCaseService.kase.alternate_id = '12345';
	        mockCaseService.kase.product = 'Red Hat Enterprise Linux';
	        mockCaseService.kase.version = '6.0';
	        mockCaseService.kase.summary = 'Test Summary';
	        mockCaseService.kase.group = {
	          name: 'Test Group',
	          number: '123456'
	        };
	        mockCaseService.kase.fts = true;
	        mockCaseService.kase.contact_info24_x7 = 'test@test.com';
	        expect(mockScope.updateCase).toBeDefined();
	        mockScope.updateCase();
	        spyOn(mockStrataService.cases, 'put').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.updatingDetails).toBe(false);
        
	  	}));

		it('should have a function to get Product Versions resolved', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });
	        
	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	       
	        expect(mockScope.getProductVersions).toBeDefined();
	        mockScope.getProductVersions();
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockCaseService.versions).toEqual(mockStrataDataService.mockVersions);   
	        
	  	}));

	  	it('should have a function to get Product Versions rejected', inject(function ($controller) {

	        $controller('DetailsSection', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            strataService: mockStrataService
	        });

	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	       
	        expect(mockScope.getProductVersions).toBeDefined();
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.getProductVersions();        
	        mockScope.$root.$digest();
	        expect(mockCaseService.versions).toEqual([]);   
	        
	  	}));
	});

	//Suite for AddCommentSection
	describe('AddCommentSection', function() {

		it('should have a function for adding comments to case resolved', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	      	mockCaseService.kase.case_number = '1234';
	      	mockCaseService.commentText = 'test comment';
	      	mockScope.saveDraftPromise = '3'
	      	mockCaseService.kase.status = {
	          name: 'Closed'
	        };
	        expect(mockScope.addComment).toBeDefined();
	      	mockScope.addComment();
	      	spyOn(mockStrataService.cases.comments, 'post').andCallThrough();  
	     	mockScope.$root.$digest();  
	      	expect(mockCaseService.kase.status.name).toEqual("Waiting on Red Hat");
	  
	  	}));

	  	it('should have a function for adding comments to case rejected', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	      	mockCaseService.kase.case_number = '1234';
	      	mockCaseService.commentText = 'test comment';
	      	mockScope.saveDraftPromise = '3'
	      	mockCaseService.kase.status = {
	          name: 'Closed'
	        };
	      	expect(mockScope.addComment).toBeDefined();
	      	mockStrataService.rejectCalls();
	      	spyOn(mockStrataService.cases.comments, 'post').andCallThrough();
	      	mockScope.addComment();	      	  
	     	mockScope.$root.$digest();  
	      	expect(mockCaseService.kase.status.name).toEqual("Closed");
	      	expect(mockScope.addingComment).toBe(false);
	  
	  	}));

	  	it('should have a function for adding draft comments to case', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockScope.saveDraftPromise = '3'
		    mockCaseService.kase.status = {
	          name: 'Closed'
	        };
		    mockCaseService.draftComment = {};
		    mockCaseService.draftComment.id = '1111';
		    expect(mockScope.addComment).toBeDefined();
		    mockScope.addComment();      
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough();  
		    mockScope.$root.$digest(); 
		    expect(mockCaseService.kase.status.name).toEqual('Waiting on Red Hat');       
	        
	  	}));

	  	it('should have a function for saving non draft comments', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    expect(mockScope.saveDraft).toBeDefined();
		    mockScope.saveDraft();      
		    spyOn(mockStrataService.cases.comments, 'post').andCallThrough();  
		    mockScope.$root.$digest(); 
		    expect(mockScope.draftSaved).toBe(true);
		    expect(mockCaseService.draftComment.case_number).toEqual('1234');       
		    
		}));

		it('should have a function for saving draft comments', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockCaseService.draftComment = {};
		    expect(mockScope.saveDraft).toBeDefined();
		    mockScope.saveDraft();      
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough();  
		    mockScope.$root.$digest(); 
		    expect(mockScope.draftSaved).toBe(true);
		    expect(mockCaseService.draftComment.text).toEqual('test comment');       
		    
		}));

		it('should have a function for saving draft comments rejected', inject(function ($controller) {

		    $controller('AddCommentSection', {
		        $scope: mockScope,
		        CaseService: mockCaseService,
		        strataService: mockStrataService
		    });

		    mockCaseService.kase.case_number = '1234';
		    mockCaseService.commentText = 'test comment';
		    mockCaseService.draftComment = {};
		    expect(mockScope.saveDraft).toBeDefined();
		    mockStrataService.rejectCalls();
		    spyOn(mockStrataService.cases.comments, 'put').andCallThrough(); 
		    mockScope.saveDraft();		     
		    mockScope.$root.$digest(); 
		    expect(mockScope.savingDraft).toBe(false);      
		    
		}));

		it('should have a function for on New Comment Keypress', inject(function ($controller) {

	        $controller('AddCommentSection', {
	          	$scope: mockScope,
	          	CaseService: mockCaseService,
	          	strataService: mockStrataService
	        });

	        mockScope.addingComment = false;
	        mockCaseService.commentText = 'test comment';
	        expect(mockScope.onNewCommentKeypress).toBeDefined();
	        mockScope.onNewCommentKeypress();           
	        
	  	}));

	});

	//Suite for New
	describe('New', function() {

		it('should have a function for fetching recommendations resolved', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService
	        });

	        mockScope.NEW_CASE_CONFIG.showRecommendations = true;
	        expect(mockScope.getRecommendations).toBeDefined();
	        mockScope.getRecommendations();  
	        spyOn(mockRecommendationsService, 'populateRecommendations').andCallThrough();
	        mockScope.$root.$digest();          
	        expect(mockSearchResultsService.results).toEqual(mockStrataDataService.mockSolutions); 

  		}));

  		it('should have a function for getting Product Versions resolved', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

	        var product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };

	        expect(mockScope.getProductVersions).toBeDefined();
	        mockScope.getProductVersions(product);
	        spyOn(mockStrataService.products, 'versions').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockCaseService.kase.version).toEqual(mockStrataDataService.value.version);

  		}));

  		it('should have a function for submitting case', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	            RecommendationsService: mockRecommendationsService,
	            SearchResultsService: mockSearchResultsService,
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

			mockCaseService.kase.version = '6.0';
	        mockCaseService.kase.summary = 'Test Summary';
	        mockCaseService.kase.description = 'Test Description';
	        mockCaseService.kase.severity = {
	        	name: 'high',
	        	value: '1'
	        };
	        mockCaseService.kase.product = {
	          name: 'Red Hat Enterprise Linux',
	          code: '123456'
	        };
	        mockCaseService.group = 'open';
	        mockCaseService.entitlement = 'premium';
	        mockCaseService.fts = true;
	        mockCaseService.fts_contact = 'testUser@test.com';
	        mockCaseService.owner = 'testUser';
	        mockCaseService.kase.account = {
	        	name: 'testAccount',
	        	number: '12345'
	        };	        

	        expect(mockScope.doSubmit).toBeDefined();
	        mockScope.doSubmit();
	        spyOn(mockStrataService.cases, 'post').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.submittingCase).toBe(false);

  		}));

		it('should have a function for initializing the drop downs of product,severity and group', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

	        expect(mockScope.initSelects).toBeDefined();
	        mockScope.initSelects();
	        spyOn(mockStrataService.products, 'list').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
	        spyOn(mockStrataService.groups, 'list').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.products).toEqual(mockStrataDataService.mockProducts);	        
	        expect(mockCaseService.kase.product.name).toEqual(mockStrataDataService.value.product);
	        expect(mockCaseService.severities).toEqual(mockStrataDataService.mockSeverities);	        
	        expect(mockCaseService.groups).toEqual(mockStrataDataService.mockGroups);	        
	        expect(mockCaseService.kase.group).toEqual(mockStrataDataService.mockGroups[1]);

  		}));

		it('should have a function for initializing the drop downs rejected', inject(function ($controller) {

	        $controller('New', {
	            $scope: mockScope,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService,
	            NEW_DEFAULTS: mockStrataDataService.value
	        });

	        expect(mockScope.initSelects).toBeDefined();
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.products, 'list').andCallThrough();
	        spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
	        spyOn(mockStrataService.groups, 'list').andCallThrough();
	        mockScope.initSelects();	       
	        mockScope.$root.$digest();
	        expect(mockScope.products).toBeUndefined();		        
	        expect(mockCaseService.kase.product).toBeUndefined();
	        expect(mockCaseService.severities).toEqual([]);	        
	        expect(mockCaseService.groups).toEqual([]);	        
	        expect(mockCaseService.kase.group).toBeUndefined();

  		}));

	});	

	//Suite for RecommendationsSection
	describe('RecommendationsSection', function() {

		it('should have a function to select Recommendations Page', inject(function ($controller) {

	        $controller('RecommendationsSection', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService
	        });

	        expect(mockScope.selectRecommendationsPage).toBeDefined();	
	        mockRecommendationsService.pinnedRecommendations = mockStrataDataService.mockRecommendations;
	        mockRecommendationsService.recommendations = mockStrataDataService.mockRecommendations;
	        mockRecommendationsService.handPickedRecommendations = mockStrataDataService.mockRecommendations;
	        mockScope.selectRecommendationsPage();
	        expect(mockScope.recommendationsOnScreen).toEqual([]);	        

  		}));

  		it('should have a function to pin Recommendations', inject(function ($controller) {

	        $controller('RecommendationsSection', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService
	        });

	        expect(mockScope.pinRecommendation).toBeDefined();	
	        mockCaseService.kase.case_number = '1234'; 
	        mockRecommendationsService.pinnedRecommendations = mockStrataDataService.mockRecommendations; 	        
	        mockScope.pinRecommendation(mockStrataDataService.mockSolutionNotPinned,undefined,undefined);
	        spyOn(mockStrataService.cases, 'put').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.currentRecPin.pinned).toBe(true);  
	        expect(mockScope.currentRecPin.pinning).toBe(false);
	        expect(mockRecommendationsService.pinnedRecommendations.length).toBe(3);

  		}));

  		it('should have a function to unpin Recommendations', inject(function ($controller) {

	        $controller('RecommendationsSection', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService
	        });

	        expect(mockScope.pinRecommendation).toBeDefined();	
	        mockCaseService.kase.case_number = '1234'; 
	        mockRecommendationsService.pinnedRecommendations = mockStrataDataService.mockRecommendations;
	        mockScope.pinRecommendation(mockStrataDataService.mockRecommendationPinned,undefined,undefined);
	        spyOn(mockStrataService.cases, 'put').andCallThrough();
	        mockScope.$root.$digest();
	        expect(mockScope.currentRecPin.pinned).toBe(false);
	        expect(mockScope.currentRecPin.pinning).toBe(false);
	        expect(mockRecommendationsService.pinnedRecommendations.length).toBe(1);      

  		}));

  		it('should have a function to pin Recommendations rejected', inject(function ($controller) {

	        $controller('RecommendationsSection', {
	            $scope: mockScope,
	            RecommendationsService: mockRecommendationsService,
	            CaseService: mockCaseService,	            
	            strataService: mockStrataService
	        });

	        expect(mockScope.pinRecommendation).toBeDefined();	
	        mockCaseService.kase.case_number = '1234';
	        mockStrataService.rejectCalls();        
	        spyOn(mockStrataService.cases, 'put').andCallThrough();
	        mockScope.pinRecommendation(mockStrataDataService.mockSolutionNotPinned,undefined,undefined);
	        mockScope.$root.$digest();
	        expect(mockScope.currentRecPin.pinned).toBe(false);  
	        expect(mockScope.currentRecPin.pinning).toBe(false);	        

  		}));

	});

	//Suite for ListNewAttachments
	describe('ListNewAttachments', function() {

		it('should have a function to remove Local Attachment', inject(function ($controller) {

	        $controller('ListNewAttachments', {
	            $scope: mockScope,
	            AttachmentsService: mockAttachmentsService
	        });

	        expect(mockScope.removeLocalAttachment).toBeDefined();
	        mockAttachmentsService.updatedAttachments = mockStrataDataService.mockAttachments;
	        expect(mockAttachmentsService.updatedAttachments.length).toBe(2);	        
	        mockScope.removeLocalAttachment(1);	        
	        expect(mockAttachmentsService.updatedAttachments.length).toBe(1);       	        

  		}));

	});

	//Suite for EmailNotifySelect
	describe('EmailNotifySelect', function() {

		it('should have a function to update Notified Users resolved', inject(function ($controller) {

	        $controller('EmailNotifySelect', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	EDIT_CASE_CONFIG: mockStrataDataService.value
	        });

	        expect(mockScope.updateNotifyUsers).toBeDefined();
	        mockCaseService.kase.case_number = '1234';
	        mockCaseService.originalNotifiedUsers = mockStrataDataService.mockOriginalNotifiedUsers;
	        mockCaseService.updatedNotifiedUsers = mockStrataDataService.mockUpdatedNotifiedUsers;	        
	        mockScope.updateNotifyUsers();
	        spyOn(mockStrataService.cases.notified_users, 'remove').andCallThrough();
	        spyOn(mockStrataService.cases.notified_users, 'add').andCallThrough();	        
	        mockScope.$root.$digest(); 
	        expect(mockScope.updatingList).toBe(false);
	        expect(mockCaseService.updatedNotifiedUsers).toEqual(mockCaseService.originalNotifiedUsers);       

  		}));

		it('should have a function to update Notified Users rejected', inject(function ($controller) {

	        $controller('EmailNotifySelect', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	EDIT_CASE_CONFIG: mockStrataDataService.value
	        });

	        expect(mockScope.updateNotifyUsers).toBeDefined();
	        mockCaseService.kase.case_number = '1234';
	        mockCaseService.originalNotifiedUsers = mockStrataDataService.mockOriginalNotifiedUsers;
	        mockCaseService.updatedNotifiedUsers = mockStrataDataService.mockUpdatedNotifiedUsers;
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.cases.notified_users, 'remove').andCallThrough();
	        spyOn(mockStrataService.cases.notified_users, 'add').andCallThrough();	        
	        mockScope.updateNotifyUsers();	        	        
	        mockScope.$root.$digest(); 
	        expect(mockScope.updatingList).toBe(false);
	        expect(mockCaseService.updatedNotifiedUsers).toEqual(mockStrataDataService.mockUpdatedNotifiedUsers);       

  		}));

	});

	//Suite for DeleteGroupButton
	describe('DeleteGroupButton', function() {

		it('should have a function to delete Groups resolved', inject(function ($controller) {

	        $controller('DeleteGroupButton', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService
	        });

	        expect(mockScope.deleteGroups).toBeDefined();
	        mockCaseService.groups = mockStrataDataService.mockGroups;
	        mockScope.deleteGroups();
	        spyOn(mockStrataService.groups, 'remove').andCallThrough();        	        	        
	        mockScope.$root.$digest();
	        expect(mockAlertService.alerts[0].message).toEqual('Successfully deleted groups.');
	        	        
  		}));

  		it('should have a function to delete Groups rejected', inject(function ($controller) {

	        $controller('DeleteGroupButton', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService
	        });

	        expect(mockScope.deleteGroups).toBeDefined();
	        mockCaseService.groups = mockStrataDataService.mockGroups;
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.groups, 'remove').andCallThrough();        	        	        
	        mockScope.deleteGroups();
	        mockScope.$root.$digest();	        
	        expect(mockAlertService.alerts[0].message).toEqual('Deleting groups...');
	        expect(mockAlertService.alerts[1].message).toEqual('strata error');
	        	        
  		}));

	});

	//Suite for CreateGroupModal
	describe('CreateGroupModal', function() {

		it('should have a function to create a Group resolved', inject(function ($controller) {

	        $controller('CreateGroupModal', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService,
	          	$modalInstance: mockStrataDataService.mockModalInstance
	        });

	        expect(mockScope.createGroup).toBeDefined();
	        mockScope.createGroup();
	        spyOn(mockStrataService.groups, 'create').andCallThrough();
	        mockScope.$root.$digest();	        
	        expect(mockAlertService.alerts[0].message).toContain('Successfully created group');	        
	        expect(mockCaseService.groups[0].number).toEqual(mockStrataDataService.mockGroups[0].number);
	        	        
  		}));

  		it('should have a function to create a Group rejected', inject(function ($controller) {

	        $controller('CreateGroupModal', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService,
	          	$modalInstance: mockStrataDataService.mockModalInstance
	        });

	        expect(mockScope.createGroup).toBeDefined();
	        mockStrataService.rejectCalls();
	        spyOn(mockStrataService.groups, 'create').andCallThrough();
	        mockScope.createGroup();
	        mockScope.$root.$digest();	        
	        expect(mockAlertService.alerts[0].message).toEqual('strata error');	
	        expect(mockAlertService.alerts[0].type).toEqual('danger');        
	        	        
  		}));

  		it('should have a function to close Modal window', inject(function ($controller) {

	        $controller('CreateGroupModal', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService,
	          	$modalInstance: mockStrataDataService.mockModalInstance
	        });

	        expect(mockScope.closeModal).toBeDefined();
	        mockScope.closeModal();	        
	        	        
  		}));

  		it('should have a function to trigger create group on GroupName KeyPress', inject(function ($controller) {

	        $controller('CreateGroupModal', {
	            $scope: mockScope,
	            CaseService: mockCaseService,
	          	strataService: mockStrataService,
	          	GroupService: mockGroupService,
	          	AlertService: mockAlertService,
	          	$modalInstance: mockStrataDataService.mockModalInstance
	        });

	        expect(mockScope.onGroupNameKeyPress).toBeDefined();
	        var event = {
	        	"keyCode": 13
	        }
	        mockScope.onGroupNameKeyPress(event);	        
	        	        
  		}));

	});

	describe('AttachLocalFile', function() {

		it('should have no file chosen with no description', inject(function ($controller) {

			$controller('AttachLocalFile', {
				$scope: mockScope,
				AttachmentsService: mockAttachmentsService
			});

			expect(mockScope.NO_FILE_CHOSEN).toEqual('No file chosen');
			expect(mockScope.fileDescription).toEqual('');

		}));

		it('should clear filename and file description', inject(function ($controller) {
			$controller('AttachLocalFile', {
				$scope: mockScope,
				AttachmentsService: mockAttachmentsService
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
				AttachmentsService: mockAttachmentsService
			});


			var file = {files: [{
					fileSize: 32323,
					fileName: 'gfdsfds'
			}]};

			var fileUploader = [file];
			spyOn(window, "$").andReturn(fileUploader);
			var result = $("#fileUploader")[0].files;

			expect(mockScope.selectFile).toBeDefined();
			mockScope.selectFile();
		}));

		it('should get file on click', inject(function ($controller) {
			$controller('AttachLocalFile', {
				$scope: mockScope,
				AttachmentsService: mockAttachmentsService
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
				AttachmentsService: mockAttachmentsService
			});

			mockScope.fileObj = 'test_data';
			mockScope.fileDescription = 'test_description';
			mockScope.fileName = 'test_file';
			mockScope.fileSize = '200MB';

			expect(mockScope.addFile).toBeDefined();
			mockScope.addFile();
			expect(mockAttachmentsService.updatedAttachments.length).toEqual(1);

		}));
	});

	describe('StatusSelect', function() {

		it('should have status of cases as open', inject(function ($controller) {
			$controller('StatusSelect', {
				$scope: mockScope,
				CaseService: mockCaseService,
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
				CaseService: mockCaseService,
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
				CaseService: mockCaseService,
				STATUS: 'Open and Closed'
			});

			expect(mockScope.STATUS).toEqual('Open and Closed');
			expect(mockScope.statuses[0].name).toEqual('Open and Closed');
			expect(mockScope.statuses[1].name).toEqual('Open');
			expect(mockScope.statuses[2].name).toEqual('Closed');
		}));
	});
	
	describe('ExportCSVButton', function() {
		it('shoud get error for exporting all cases as CSV', inject(function ($controller) {
			$controller('ExportCSVButton', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService
			});

			expect(mockScope.export).toBeDefined();
			mockScope.export();
			deferred.reject();
			spyOn(mockStrataService.cases, 'csv').andCallThrough();
			mockScope.$root.$digest();
		}));

		it('shoud export all cases as CSV', inject(function ($controller) {
			$controller('ExportCSVButton', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService
			});

			expect(mockScope.export).toBeDefined();
			mockScope.export();
			deferred.resolve();
			spyOn(mockStrataService.cases, 'csv').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.exporting).toEqual(false);
		}));
	});

	describe('AccountSelect', function() {
		it('should select user account', inject(function ($controller) {
			$controller('AccountSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			mockScope.selectUserAccount();
			deferred.resolve('540155');
			spyOn(mockStrataService.accounts, 'list').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.loadingAccountNumber).toEqual(false);
		}));

		it('should get error while selecting user account', inject(function ($controller) {
			$controller('AccountSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			mockScope.selectUserAccount();
			deferred.reject();
			spyOn(mockStrataService.accounts, 'list').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.loadingAccountNumber).toEqual(false);
		}));

		it('should populate account specific fields', inject(function ($controller) {
			$controller('AccountSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			caseService.account.number = 540155;
			mockScope.alertInstance = 'Account found'
			mockScope.populateAccountSpecificFields();
			deferred.resolve(account);
			spyOn(mockStrataService.accounts, 'get').andCallThrough();
			mockScope.$root.$digest();	
		}));

		it('should not get account specific fields', inject(function ($controller) {
			$controller('AccountSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			caseService.account.number = 540155;
			mockScope.alertInstance = 'Account Not found'
			mockScope.populateAccountSpecificFields();
			deferred.reject();
			spyOn(mockStrataService.accounts, 'get').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.alertInstance).toEqual('Account Not found');
		}));
	});
	
	describe('AttachmentsSection', function() {

		it('should update attachement in attachment list', inject(function ($controller) {
			$controller('AttachmentsSection', {
				$scope: mockScope,
				AttachmentsService: mockAttachmentsService,
				CaseService: mockCaseService
			});

			mockScope.doUpdate();
			deferred.resolve('540155');
			spyOn(mockAttachmentsService, 'updateAttachments').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.updatingAttachments).toEqual(false);
		}));

		it('should get an error while updating an attachement in attachment list', inject(function ($controller) {
			$controller('AttachmentsSection', {
				$scope: mockScope,
				AttachmentsService: mockAttachmentsService,
				CaseService: mockCaseService
			});

			mockScope.doUpdate();
			deferred.reject();
			spyOn(mockAttachmentsService, 'updateAttachments').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.updatingAttachments).toEqual(false);
		}));
	});

	describe('SeveritySelect', function() {
		it('should select the severity of a case', inject(function ($controller) {
			$controller('SeveritySelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			deferred.resolve('Urgent');
			spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
			mockScope.$root.$digest();
		}));

		it('should get an error while selecting  the severity of a case', inject(function ($controller) {
			$controller('SeveritySelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			deferred.reject();
			spyOn(mockStrataService.values.cases, 'severity').andCallThrough();
			mockScope.$root.$digest();
			expect(mockScope.severitiesLoading).toEqual(false);
		}));
	});

	describe('TypeSelect', function() {
		it('should select the type of a case', inject(function ($controller) {
			$controller('TypeSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			deferred.resolve('Other');
			spyOn(mockStrataService.values.cases, 'types').andCallThrough();
			mockScope.$root.$digest();
		}));

		it('should get an error while selecting the type of a case', inject(function ($controller) {
			$controller('TypeSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				AlertService: mockAlertService,
				CaseService: mockCaseService
			});

			deferred.reject();
			spyOn(mockStrataService.values.cases, 'types').andCallThrough();
			mockScope.$root.$digest();
		}));
	});

	describe('ProductSelect', function() {
		it('should select product for case', inject(function ($controller) {
			$controller('ProductSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				CaseService: mockCaseService
			});

			deferred.resolve("Red Hat Enterprise Linux");
			spyOn(mockStrataService.products, 'list');
			mockScope.$root.$digest();
		}));

		it('should get an error while selecting product for case', inject(function ($controller) {
			$controller('ProductSelect', {
				$scope: mockScope,
				strataService: mockStrataService,
				CaseService: mockCaseService
			});

			deferred.reject();
			spyOn(mockStrataService.products, 'list');
			mockScope.$root.$digest();
		}));
	});

	describe('Edit', function() {
		it('should edit a case ', inject(function ($controller) {
			$controller('Edit', {
				$scope: mockScope,
				$stateParams: stateParams,
				AttachmentsService: mockAttachmentsService,
				strataService: mockStrataService,
				CaseService: mockCaseService,
				RecommendationsService: mockRecommendationsService,
			});

			mockScope.init();
			spyOn(mockStrataService.cases, 'get').andCallThrough();
			spyOn(mockStrataService.products, 'versions').andCallThrough();
			spyOn(mockStrataService.accounts, 'get').andCallThrough();
			spyOn(mockStrataService.cases.attachments, 'list').andCallThrough();
			spyOn(mockStrataService.cases.comments, 'get').andCallThrough();
			mockScope.$root.$digest();
		}));
	});

	describe('CompactEdit', function() {
		it('should edit case derails and attachments', inject(function ($controller) {
			$controller('CompactEdit', {
				$scope: mockScope,
				$stateParams: stateParams,
				AttachmentsService: mockAttachmentsService,
				strataService: mockStrataService,
				CaseService: mockCaseService
			});

			mockScope.init();
			spyOn(mockAttachmentsService.cases, 'get').andCallThrough();
			spyOn(mockAttachmentsService.products, 'versions').andCallThrough();
			spyOn(mockAttachmentsService.cases.attachments, 'list').andCallThrough();
			mockScope.$root.$digest();
		}));
	});

	describe('CommentsSection', function() {
		it('should select page of comments', inject(function ($controller) {
			$controller('CommentsSection', {
				$scope: mockScope,
				$stateParams: stateParams,
				CaseService: mockCaseService,
				strataService: mockStrataService,
				AlertService: mockAlertService
			});

			caseService.comments= ['Test comments'];
			caseService.comments.length= 7;
			mockScope.selectPage(2);
			//caseService.refreshComments();
		}));

		it('should request management escalation', inject(function ($controller) {
			$controller('CommentsSection', {
				$scope: mockScope,
				$stateParams: stateParams,
				CaseService: mockCaseService,
				strataService: mockStrataService,
				AlertService: mockAlertService
			});

			mockScope.requestManagementEscalation();
		}));

		it('should populate comment', inject(function ($controller) {
			$controller('CommentsSection', {
				$scope: mockScope,
				$stateParams: stateParams,
				CaseService: mockCaseService,
				strataService: mockStrataService,
				AlertService: mockAlertService
			});

			spyOn(mockCaseService, 'populateComments').andCallThrough();
			mockCaseService.comments = ['Test comment'];
			mockCaseService.comments.length= 9;
			mockCaseService.populateComments('https://access.devgssci.devlab.phx1.redhat.com/support/cases/01312569');
			mockScope.$root.$digest();
		}));
	});
});