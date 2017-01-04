 var appPageHistory=[];
var jsonToBeSend=new Object();
var jsonBEArr = [];
var budgetingStatus;
var gradeId;
var unitId;
var employeeId;
var empFirstName;
var successSyncStatusBE =false;
var successSyncStatusTR =false;
var backBtn = false;

var successMsgForCurrency = "Currency synchronized successfully.";
var errorMsgForCurrency = "Currency not synchronized successfully.";
var jsonToAppSend = new Object();
var jsonEasyPrArr = [];

var app = {
    // Application Constructor
    initialize: function() {
		this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("deviceready", this.onDeviceReady, false);
    },
	
	onDeviceReady: function() {
       		  if (navigator.notification) { // Override default HTML alert with native dialog
			  window.alert = function (message) {
				  navigator.notification.alert(
					  message,   	 // message
					  null,       	// callback
					  "Alert", 	   // title
					  'OK'        // buttonName
				  );
			  };
		  }
		  document.addEventListener("backbutton", function(e){
			 goBackEvent();
		  }, false);
		  validateValidMobileUser();
		  
		  }
};

function goBack() {
	var currentUser=getUserID();
	
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'prInvoice.html';
	var headerCatMsg=defaultPagePath+'expenzingImageWithSyncPage.html';
	
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];

		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			var pg=appPageHistory[len-1];
			if(pg=="app/pages/addAnExpense.html" 
				|| pg=="app/pages/addTravelSettlement.html"){
				
				j('#mainHeader').load(headerBackBtn);
			}else if(pg=="app/pages/prInvoice.html"){
				
				j('#mainHeader').load(headerCatMsg);
			}
			if(!(pg==null)){ 
				j('#mainContainer').load(pg);
			}
		}
	}
	}
 
function goBackEvent() {
	var currentUser=getUserID();
	var pageRef=defaultPagePath+'prInvoice.html';
	var loginPath=defaultPagePath+'loginPage.html';
	var headerBackBtn=defaultPagePath+'expenzingImagePage.html';
	var headerCatMsg=defaultPagePath+'categoryMsgPage.html';
	
	if(currentUser==''){
		j('#mainContainer').load(loginPath);
	}else{
		//To check if the page that needs to be displayed is login page. So 'historylength-2'
		var historylength=appPageHistory.length;
		var goToPage=appPageHistory[historylength-2];

		if(goToPage!==null && goToPage==loginPath){
			return 0;
		}else{
			appPageHistory.pop();
			var len=appPageHistory.length;
			if(len == 0){
				navigator.app.exitApp();
				//navigator.notification.confirm("Are you sure want to exit from App?", onConfirmExit, "Confirmation", "Yes,No");
			}else{
				var pg=appPageHistory[len-1];
				if(pg=="app/pages/addPurchaseReq.html"){ 
					 backBtn = true;
					 pageRef=defaultPagePath+'addPurchaseReq.html';
					 headerBackBtn=defaultPagePath+'backToHomeStepOneImg.html';
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRef);						
				}else if(pg=="app/pages/addPurchaseReqScreen2.html"){
					 backBtn = true;
					 pageRef=defaultPagePath+'addPurchaseReqScreen2.html';
					 headerBackBtn=defaultPagePath+'backToHomeStepTwoImg.html';	
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRef);	
				}else if(pg=="app/pages/addPurchaseReqScreen3.html"){
					 backBtn = true;
					 pageRef=defaultPagePath+'prInvoice.html';
					 headerBackBtn=defaultPagePath+'expenzingImageWithSyncPage.html';	
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRef);	
				}else if(pg=="app/pages/prInvoice.html"){
					 pageRef=defaultPagePath+'prInvoice.html';
					 headerBackBtn=defaultPagePath+'expenzingImageWithSyncPage.html';	
					 j('#mainHeader').load(headerBackBtn);
					 j('#mainContainer').load(pageRef);	
				}
			}
		}
	}
}

function onConfirmExit(button) {
    if (button == 2) { //If User select a No, then return back;
        return;
    } else {
        navigator.app.exitApp(); // If user select a Yes, quit from the app.
    }
}

  //Local Database Create,Save,Display

  //Test for browser compatibility
if (window.openDatabase) {
	//Create the database the parameters are 1. the database name 2.version number 3. a description 4. the size of the database (in bytes) 1024 x 1024 = 1MB
    var mydb = openDatabase("Expenzing", "0.1", "Expenzing", 1024 * 1024);
	//create All tables using SQL for the database using a transaction
	mydb.transaction(function (t) {
		t.executeSql("CREATE TABLE IF NOT EXISTS locationMst (locationId INTEGER PRIMARY KEY ASC, locationName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS operationalBudgetMst (opBudgetId INTEGER PRIMARY KEY ASC, opBudgetName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS corporateBudget (corporateId INTEGER PRIMARY KEY ASC, accCodeId INTEGER REFERENCES accCodeMst(accCodeId))");
		t.executeSql("CREATE TABLE IF NOT EXISTS accHeadMst (acHeadId INTEGER PRIMARY KEY ASC, acHeadName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS accCodeMst (accCodeId INTEGER PRIMARY KEY ASC, acHeadId INTEGER REFERENCES accountHeadMst(acHeadId),accCodeName TEXT,capexOpex TEXT )");
		t.executeSql("CREATE TABLE IF NOT EXISTS itemMst (itemId INTEGER PRIMARY KEY ASC,itemName TEXT, itemCode TEXT, accCodeId INTEGER REFERENCES accCodeMst(accCodeId),poRequired TEXT,grnRequired TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS costCenterMst (costCenterId INTEGER PRIMARY KEY ASC, costCenterName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS budgetMst (budgetId INTEGER PRIMARY KEY ASC, budgetName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS subZoneMst (subZoneId INTEGER PRIMARY KEY ASC, subZoneName TEXT)");
		/*t.executeSql("CREATE TABLE IF NOT EXISTS operationalBudgetMst (opBudgetId INTEGER PRIMARY KEY ASC, opBudgetName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS corporateBudget (corporateId INTEGER PRIMARY KEY ASC,accCodeId INTEGER REFERENCES accCodeMst(accCodeId))");
		t.executeSql("CREATE TABLE IF NOT EXISTS accHeadMst (acHeadId INTEGER PRIMARY KEY ASC, acHeadName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS accCodeMst (accCodeId INTEGER PRIMARY KEY ASC, acHeadId INTEGER REFERENCES accountHeadMst(acHeadId),accCodeName TEXT,capexOpex TEXT )");
		t.executeSql("CREATE TABLE IF NOT EXISTS itemMst (itemId INTEGER PRIMARY KEY ASC, itemCode TEXT, accCodeId INTEGER REFERENCES accCodeMst(accCodeId),poReqd TEXT,grnReqd TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS costCenterMst (costCenterId INTEGER PRIMARY KEY ASC, costCenterName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS budgetMst (budgetId INTEGER PRIMARY KEY ASC, budgetName TEXT)");
		t.executeSql("CREATE TABLE IF NOT EXISTS locationMst (locationId INTEGER PRIMARY KEY ASC, locationName TEXT)");*/

    });

} else {
    alert("WebSQL is not supported by your browser!");
}

function saveTravelSettleDetails(status){
	exceptionStatus='N';
	exceptionMessage='';
	
	if (mydb) {
		//get the values of the text inputs
        var exp_date = document.getElementById('expDate').value;
		var exp_narration = document.getElementById('expNarration').value;
		var exp_unit = document.getElementById('expUnit').value;
		var exp_amt = document.getElementById('expAmt').value;
		var travelRequestId;
		var acc_head_val;
		var exp_name_id;
		var exp_name_val;
		var currency_id;
		var currency_val;
		var travelMode_id;
		var travelMode_val;
		var travelCategory_id;
		var travelCategory_val;
		var cityTown_id;
		var cityTown_val;
		var file;
		if(j("#travelRequestName").select2('data') != null){
			travelRequestId = j("#travelRequestName").select2('data').id;
			travelRequestNo = j("#travelRequestName").select2('data').name;
		}else{
			travelRequestId = '-1';
		}
		
		if(j("#travelExpenseName").select2('data') != null){
			exp_name_id = j("#travelExpenseName").select2('data').id;
			exp_name_val = j("#travelExpenseName").select2('data').name;
		}else{
			exp_name_id = '-1';
		}	
		
		if(j("#currency").select2('data') != null){
			currency_id = j("#currency").select2('data').id;
			currency_val = j("#currency").select2('data').name;
		}else{
			currency_id = '-1';
		}
		if(j("#travelMode").select2('data') != null){
			travelMode_id = j("#travelMode").select2('data').id;
			travelMode_val = j("#travelMode").select2('data').name;
		}else{
			travelMode_id = '-1';
		}
		if(j("#travelCategory").select2('data') != null){
			travelCategory_id = j("#travelCategory").select2('data').id;
			travelCategory_val = j("#travelCategory").select2('data').name;
		}else{
			travelCategory_id = '-1';
		}
		if(j("#fromCitytown").select2('data') != null){
			cityTown_id = j("#fromCitytown").select2('data').id;
			cityTown_val = j("#fromCitytown").select2('data').name;
		}else{
			cityTown_id = '-1';
		}	
		if(fileTempGalleryTS ==undefined || fileTempGalleryTS ==""){
		
		}else{
			file = fileTempGalleryTS; 
		}
		
		if(fileTempCameraTS ==undefined || fileTempCameraTS ==""){
		
		}else{
			file = fileTempCameraTS; 
		}
		
		if(validateTSDetails(exp_date,exp_narration,exp_unit,exp_amt,travelRequestId,exp_name_id,currency_id,travelMode_id,travelCategory_id,cityTown_id)){
		j('#loading_Cat').show();
		
		  if(file==undefined){
		   file="";
		  }
		  mydb.transaction(function (t) {
				t.executeSql("INSERT INTO travelSettleExpDetails  (expDate, travelRequestId,expNameId,expNarration, expUnit,expAmt,currencyId,travelModeId,travelCategoryId,cityTownId,tsExpAttachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
											[exp_date,travelRequestId,exp_name_id,exp_narration,exp_unit,exp_amt,currency_id,travelMode_id,travelCategory_id,cityTown_id,file]);
								
				if(status == "0"){
					document.getElementById('expDate').value ="";
					document.getElementById('expNarration').value = "";
					document.getElementById('expUnit').value ="";
					document.getElementById('expAmt').value = "";
					j('#travelRequestName').select2('data', '');
					j('#travelExpenseName').select2('data', '');
					j('#travelMode').select2('data', '');
					j('#travelCategory').select2('data', '');
					j('#fromCitytown').select2('data', '');
					j("label[for='startDate']").html("");
					j("label[for='endDate']").html("");
					smallImageTS.style.display = 'none';
					smallImageTS.src = "";
					j('#loading_Cat').hide();
					document.getElementById("syncSuccessMsg").innerHTML = "Expenses added successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					resetImageData();
				}else{
					viewTravelSettlementExp();
				}
			});
		
		}else{
			return false;
		}
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}


function create_blob(file, callback) {
			var reader = new FileReader();
			reader.onload = function() { 
							callback(reader.result) ;
			};
			if(typeof file == 'undefined') {
				file = new Blob();
			}
			reader.readAsDataURL(file);
		}
		
var jsonExpenseDetailsArr = [];

function fetchPuchaseReq() {
	
	mytable = j('<table></table>').attr({ id: "source",class: ["table","table-striped","table-bordered"].join(' ') });
	var rowThead = j("<thead></thead>").appendTo(mytable);
	var rowTh = j('<tr></tr>').attr({ class: ["test"].join(' ') }).appendTo(rowThead);
	
	j('<th></th>').text("Item").appendTo(rowTh);
	j('<th></th>').text("Delivery Date").appendTo(rowTh);
	j('<th></th>').text("Quantity").appendTo(rowTh); 	
	j('<th></th>').text("Rate").appendTo(rowTh);
	j('<th></th>').text("Value").appendTo(rowTh);
	var cols = new Number(5);
	 
	/*mydb.transaction(function(t) {
		var headerOprationBtn;
      t.executeSql('SELECT * FROM businessExpDetails INNER JOIN expNameMst ON businessExpDetails.expNameId =expNameMst.id INNER JOIN currencyMst ON businessExpDetails.currencyId =currencyMst.currencyId INNER JOIN accountHeadMst ON businessExpDetails.accHeadId =accountHeadMst.accountHeadId;', [],
		 function(transaction, result) {
		  if (result != null && result.rows != null) {
			  
			for (var i = 0; i < result.rows.length; i++) {
				
				var row = result.rows.item(i);
				var newDateFormat = reverseConvertDate(row.expDate.substring(0,2))+"-"+row.expDate.substring(3,5)+" "+row.expDate.substring(6,10); 
				
				var rowss = j('<tr></tr>').attr({ class: ["test"].join(' ') }).appendTo(mytable);
		
		        j('<td></td>').attr({ class: ["expDate"].join(' ') }).text(newDateFormat).appendTo(rowss);	
		        j('<td></td>').attr({ class: ["expName"].join(' ') }).text(row.expName).appendTo(rowss);	
				j('<td></td>').attr({ class: ["expNarration"].join(' ') }).html('<p>'+row.expNarration+'</br>'+row.expFromLoc+"/"+row.expToLoc+ '</P>').appendTo(rowss); 
				
				if(row.busExpAttachment.length == 0){
				j('<td></td>').attr({ class: ["expAmt"].join(' ') }).html('<p>'+row.expAmt+' '+row.currencyName+'</P>').appendTo(rowss); 	
				}else{
				j('<td></td>').attr({ class: ["expAmt"].join(' ') }).html('<p>'+row.expAmt+' '+row.currencyName+'</P><img src="images/attach.png" width="25px" height="25px">').appendTo(rowss); 
				}
				j('<td></td>').attr({ class: ["expDate1","displayNone"].join(' ') }).text(row.expDate).appendTo(rowss);
				j('<td></td>').attr({ class: ["expFromLoc1","displayNone"].join(' ') }).text(row.expFromLoc).appendTo(rowss);
				j('<td></td>').attr({ class: ["expToLoc1","displayNone"].join(' ') }).text(row.expToLoc).appendTo(rowss);
				j('<td></td>').attr({ class: ["expNarration1","displayNone"].join(' ') }).text(row.expNarration).appendTo(rowss);
				j('<td></td>').attr({ class: ["expAmt1","displayNone"].join(' ') }).text(row.expAmt).appendTo(rowss);
				j('<td></td>').attr({ class: ["busAttachment","displayNone"].join(' ') }).text(row.busExpAttachment).appendTo(rowss);
				j('<td></td>').attr({ class: ["accHeadId","displayNone"].join(' ') }).text(row.accHeadId).appendTo(rowss);			
				j('<td></td>').attr({ class: ["expNameId","displayNone"].join(' ') }).text(row.expNameMstId).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["expUnit","displayNone"].join(' ') }).text(row.expUnit).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["currencyId","displayNone"].join(' ') }).text(row.currencyId).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["accountCodeId","displayNone"].join(' ') }).text(row.accCodeId).appendTo(rowss);		
				j('<td></td>').attr({ class: ["expName","displayNone"].join(' ') }).text(row.expName).appendTo(rowss);		
				j('<td></td>').attr({ class: ["busExpId","displayNone"].join(' ') }).text(row.busExpId).appendTo(rowss);
				j('<td></td>').attr({ class: ["isErReqd","displayNone"].join(' ') }).text(row.isErReqd).appendTo(rowss);
				j('<td></td>').attr({ class: ["ERLimitAmt","displayNone"].join(' ') }).text(row.limitAmountForER).appendTo(rowss);
				j('<td></td>').attr({ class: ["isEntitlementExceeded","displayNone"].join(' ') }).text(row.isEntitlementExceeded).appendTo(rowss);		
			}	
					
			j("#source tr").click(function(){ 
				headerOprationBtn = defaultPagePath+'headerPageForBEOperation.html';
				if(j(this).hasClass("selected")){ 
				var headerBackBtn=defaultPagePath+'headerPageForBEOperation.html';
					j(this).removeClass('selected');
					j('#mainHeader').load(headerBackBtn);
				}else{
				if(j(this).text()=='DateExpense NameNarration From/To LocAmt'){
					
				}else{
					j('#mainHeader').load(headerOprationBtn);
					j(this).addClass('selected');
				}					
				}								
			});
			}
		 });
	 });	*/ 
	 mytable.appendTo("#box");	 
 }

 function validateAccountHead(accountHeadIdToBeSent,currentAccHeadId){
	if(accountHeadIdToBeSent==""){
		return true;
	}else{
		if(parseFloat(accountHeadIdToBeSent)!=parseFloat(currentAccHeadId)==true){
			
			return false;
		}else{
			return true;
		}
	}
 }


 function fetchTravelSettlementExp() {
	
	mytable = j('<table></table>').attr({ id: "source",class: ["table","table-striped","table-bordered"].join(' ') });
	
	var rowThead = j("<thead></thead>").appendTo(mytable);
	var rowTh = j('<tr></tr>').attr({ class: ["test"].join(' ') }).appendTo(rowThead);
	
	j('<th></th>').text("Date").appendTo(rowTh);
	j('<th></th>').text("Expense Name").appendTo(rowTh);
	j('<th></th>').text("Amt").appendTo(rowTh);
	j('<th></th>').text("cityTown").appendTo(rowTh);
	j('<th></th>').text("Narration").appendTo(rowTh);
	
	
	var cols = new Number(4);
	 
	mydb.transaction(function(t) {
		
      t.executeSql('select * from travelSettleExpDetails inner join cityTownMst on cityTownMst.cityTownId = travelSettleExpDetails.cityTownId inner join currencyMst on travelSettleExpDetails.currencyId = currencyMst.currencyId inner join travelExpenseNameMst on travelExpenseNameMst.id = travelSettleExpDetails.expNameId;', [],
		 function(transaction, result) {
		 	
		  if (result != null && result.rows != null) {
			  
			for (var i = 0; i < result.rows.length; i++) {
				
			  var row = result.rows.item(i);
			  
			  var newDateFormat = reverseConvertDate(row.expDate.substring(0,2))+"-"+row.expDate.substring(3,5)+" "+row.expDate.substring(6,10);	  
			  
			  var rowss = j('<tr></tr>').attr({ class: ["test"].join(' ') }).appendTo(mytable);
		
		        j('<td></td>').attr({ class: ["expDate"].join(' ') }).text(newDateFormat).appendTo(rowss);				
				j('<td></td>').attr({ class: ["expenseName"].join(' ') }).text(row.expenseName).appendTo(rowss);
				j('<td></td>').attr({ class: ["expAmt"].join(' ') }).html('<p>'+row.expAmt+' '+row.currencyName+'</P>').appendTo(rowss);
				j('<td></td>').attr({ class: ["cityTownName"].join(' ') }).text(row.cityTownName).appendTo(rowss);
				
				if(row.tsExpAttachment.length == 0){
				j('<td></td>').attr({ class: ["expNarration"].join(' ') }).html('<p>'+row.expNarration+'</P>').appendTo(rowss); 	
				}else{
				j('<td></td>').attr({ class: ["expNarration"].join(' ') }).html('<p>'+row.expNarration+'</P><img src="images/attach.png" width="25px" height="25px">').appendTo(rowss); 
				}
				j('<td></td>').attr({ class: ["expDate1","displayNone"].join(' ') }).text(row.expDate).appendTo(rowss);
				j('<td></td>').attr({ class: ["expAmt1","displayNone"].join(' ') }).text(row.expAmt).appendTo(rowss);
				j('<td></td>').attr({ class: ["expNarration1","displayNone"].join(' ') }).text(row.expNarration).appendTo(rowss);
				j('<td></td>').attr({ class: ["travelRequestId","displayNone"].join(' ') }).text(row.travelRequestId).appendTo(rowss);
				j('<td></td>').attr({ class: ["tsExpAttachment","displayNone"].join(' ') }).text(row.tsExpAttachment).appendTo(rowss);				
				j('<td></td>').attr({ class: ["expNameId","displayNone"].join(' ') }).text(row.expenseNameId).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["expUnit","displayNone"].join(' ') }).text(row.expUnit).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["currencyId","displayNone"].join(' ') }).text(row.currencyId).appendTo(rowss);
				j('<td></td>').attr({ class: ["modeId","displayNone"].join(' ') }).text(row.travelModeId).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["categoryId","displayNone"].join(' ') }).text(row.travelCategoryId).appendTo(rowss); 				
				j('<td></td>').attr({ class: ["fromcityTownId","displayNone"].join(' ') }).text(row.cityTownId).appendTo(rowss); 				 				
				j('<td></td>').attr({ class: ["accountCodeId","displayNone"].join(' ') }).text(row.accCodeId).appendTo(rowss);		
				j('<td></td>').attr({ class: ["expName","displayNone"].join(' ') }).text(row.expenseName).appendTo(rowss);		
				j('<td></td>').attr({ class: ["tsExpId","displayNone"].join(' ') }).text(row.tsExpId).appendTo(rowss);
				j('<td></td>').attr({ class: ["isModeCategory","displayNone"].join(' ') }).text(row.isModeCategory).appendTo(rowss);
				j('<td></td>').attr({ class: ["accountCodeId","displayNone"].join(' ') }).text(row.accountCodeId).appendTo(rowss);				
			}	
					
			j("#source tr").click(function(){
				headerOprationBtn = defaultPagePath+'headerPageForTSOperation.html';
				if(j(this).hasClass("selected")){ 
				var headerBackBtn=defaultPagePath+'headerPageForTSOperation.html';
					j(this).removeClass('selected');
					j('#mainHeader').load(headerBackBtn);
				}else{
					if(j(this).text()=='DateExpense NameAmtcityTownNarration'){
						
					}else{
					j('#mainHeader').load(headerOprationBtn);
					j(this).addClass('selected');
					}
				}								
			});
			}
		 });
	 });	 
	 mytable.appendTo("#box");	 
 }			

function synchronizeBEMasterData() {
	var jsonSentToSync=new Object();
	
	jsonSentToSync["BudgetingStatus"] = window.localStorage.getItem("BudgetingStatus");
	jsonSentToSync["EmployeeId"] = window.localStorage.getItem("EmployeeId");
	jsonSentToSync["GradeId"] = window.localStorage.getItem("GradeID");
	jsonSentToSync["UnitId"] = window.localStorage.getItem("UnitId");
	j('#loading_Cat').show();
	if (mydb) {
		j.ajax({
			  url: window.localStorage.getItem("urlPath")+"SyncAccountHeadWebService",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonSentToSync),
			  success: function(data) {
				  if(data.status=='Success'){
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM accountHeadMst");
					var accountHeadArray = data.AccountHeadArray;
						if(accountHeadArray != null && accountHeadArray.length > 0){
							for(var i=0; i<accountHeadArray.length; i++ ){
								var stateArr = new Array();
								stateArr = accountHeadArray[i];
								var acc_head_id = stateArr.Value;
								var acc_head_name = stateArr.Label;
								t.executeSql("INSERT INTO accountHeadMst (accountHeadId,accHeadName) VALUES (?, ?)", [acc_head_id,acc_head_name]);
								
							}
						}
					});	
					  
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM expNameMst");
					  var expNameArray = data.ExpenseNameArray;
					  if(expNameArray != null && expNameArray.length > 0){
							for(var i=0; i<expNameArray.length; i++ ){
								var stateArr = new Array();
								stateArr = expNameArray[i];
								var exp_id = stateArr.ExpenseID;
								var exp_name = stateArr.ExpenseName;
								var exp_is_from_to_req = stateArr.IsFromToRequired;
								var acc_code_id = stateArr.AccountCodeId;
								var acc_head_id = stateArr.AccountHeadId;
								var isErReqd;
								var limitAmountForER;
								var exp_is_unit_req;
								var exp_per_unit ;
								var exp_fixed_or_var ;
								var exp_fixed_limit_amt;
								
				
								if(typeof stateArr.FixedOrVariable != 'undefined') {
									exp_fixed_or_var = stateArr.FixedOrVariable;
								}else{
									exp_fixed_or_var = 'V';
								}
								
								if(typeof stateArr.IsUnitRequired != 'undefined') {
									exp_is_unit_req = stateArr.IsUnitRequired;
									if(exp_is_unit_req == 'N')
										exp_fixed_or_var = 'V';
								}else{
									exp_is_unit_req = 'N';
								}
								
								if(typeof stateArr.RatePerUnit != 'undefined') {
									exp_per_unit = stateArr.RatePerUnit;
								}else{
									exp_per_unit = 0.0;
								}
								
								if(typeof stateArr.ActiveInactive != 'undefined') {
									exp_per_unit_active_inactive = stateArr.ActiveInactive;
								}else{
									exp_per_unit_active_inactive = 0;
								}
							
								if(typeof stateArr.FixedLimitAmount != 'undefined') {
									exp_fixed_limit_amt = stateArr.FixedLimitAmount;
								}else{
									exp_fixed_limit_amt = 0.0;
								}
								if(typeof stateArr.IsErReqd != 'undefined') {
									isErReqd = stateArr.IsErReqd;
								}else{
									isErReqd = 'N';
								}
								if(typeof stateArr.LimitAmountForER != 'undefined') {
									limitAmountForER = stateArr.LimitAmountForER;
								}else{
									limitAmountForER = 0.0;
								}
								//console.log("exp_id:"+exp_id+"  -exp_name:"+exp_name+"  -exp_is_from_to_req:"+exp_is_from_to_req+"  -acc_code_id:"+acc_code_id+"  -acc_head_id:"+acc_head_id+"  -exp_is_unit_req:"+exp_is_unit_req+"  -exp_per_unit:"+exp_per_unit+"  -exp_fixed_or_var:"+exp_fixed_or_var+"  -exp_fixed_limit_amt:"+exp_fixed_limit_amt)										
								t.executeSql("INSERT INTO expNameMst ( expNameMstId,expName, expIsFromToReq , accCodeId , accHeadId , expIsUnitReq , expRatePerUnit, expFixedOrVariable , expFixedLimitAmt,expPerUnitActiveInative,isErReqd,limitAmountForER) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)", [exp_id,exp_name,exp_is_from_to_req, acc_code_id,acc_head_id,exp_is_unit_req,exp_per_unit,exp_fixed_or_var,exp_fixed_limit_amt,exp_per_unit_active_inactive,isErReqd,limitAmountForER]);
							}
						}  
					});
					j('#loading_Cat').hide();
					document.getElementById("syncSuccessMsg").innerHTML = "Business Expenses synchronized successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				else{
					j('#loading_Cat').hide();
					document.getElementById("syncFailureMsg").innerHTML = "Business Expenses not synchronized successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
					
			  },
			  error:function(data) {
				 alert("Error: Oops something is wrong, Please Contact System Administer");
			  }
			});
			
		j.ajax({
		  url: window.localStorage.getItem("urlPath")+"CurrencyService",
		  type: 'POST',
		  dataType: 'json',
		  crossDomain: true,
		  data: JSON.stringify(jsonSentToSync),
		  success: function(data) {
			  if(data.status=='Success'){
				var currencyArray = data.CurrencyArray;
				mydb.transaction(function (t) {
				t.executeSql("DELETE FROM currencyMst");
				if(currencyArray != null && currencyArray.length > 0){
					for(var i=0; i<currencyArray.length; i++ ){
						var stateArr = new Array();
						stateArr = currencyArray[i];
						var curr_id = stateArr.Value;
						var curr_name = stateArr.Label;
						t.executeSql("INSERT INTO currencyMst (currencyId,currencyName) VALUES (?, ?)", [curr_id,curr_name]);
						
					}
				}
				});
				j('#loading_Cat').hide();
					document.getElementById("syncSuccessMsg").innerHTML = successMsgForCurrency;
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				else{
				j('#loading_Cat').hide();
					document.getElementById("syncFailureMsg").innerHTML = errorMsgForCurrency;
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}	
				
			},
			  error:function(data) {
				alert("Error: Oops something is wrong, Please Contact System Administer");
			  }
				});	
			
	} else {
        alert("db not found, your browser does not support web sql!");
    }
	
}
 
 
 function synchronizeTRMasterData() {
	var jsonSentToSync=new Object();
	j('#loading_Cat').show();
	jsonSentToSync["BudgetingStatus"] = window.localStorage.getItem("BudgetingStatus");
	jsonSentToSync["EmployeeId"] = window.localStorage.getItem("EmployeeId");
	jsonSentToSync["GradeId"] = window.localStorage.getItem("GradeID");
	jsonSentToSync["UnitId"] = window.localStorage.getItem("UnitId");
	
	
	if (mydb) {
		j.ajax({
		  url: window.localStorage.getItem("urlPath")+"SyncTravelAccountHeadWebService",
		  type: 'POST',
		  dataType: 'json',
		  crossDomain: true,
		  data: JSON.stringify(jsonSentToSync),
		  success: function(data) {
				if(data.status=='Success'){
					  mydb.transaction(function (t) {
						t.executeSql("DELETE FROM travelAccountHeadMst");
						
						var accountHeadArray = data.AccountHeadArray;
						 if(accountHeadArray != null && accountHeadArray.length > 0){
							for(var i=0; i<accountHeadArray.length; i++ ){
								var stateArr = new Array();
								stateArr = accountHeadArray[i];
								var acc_head_id = stateArr.AccountHeadId;
								var acc_head_name = stateArr.AccountHeadName;
								var process_id = stateArr.ProcessId;
								t.executeSql("INSERT INTO travelAccountHeadMst (accHeadId,accHeadName,processId) VALUES (?, ?, ?)", [acc_head_id,acc_head_name,process_id]);
							}
						}
						t.executeSql("DELETE FROM travelExpenseNameMst");
						var expenseNameArray = data.ExpenseHeadArray;
						if(expenseNameArray != null && expenseNameArray.length > 0){
							for(var i=0; i<expenseNameArray.length; i++ ){
								var stateArr = new Array();
								stateArr = expenseNameArray[i];
								var expense_id = stateArr.ExpenseHeadId;
								var expense_name = stateArr.ExpenseHeadName;
								var account_code_id = stateArr.AccountCodeId;
								var is_mode_cotegory = stateArr.isModeCategory;
								var account_head_id = stateArr.AccountHeadId;
								t.executeSql("INSERT INTO travelExpenseNameMst (expenseNameId ,expenseName ,accountCodeId,isModeCategory,accHeadId) VALUES (?, ?, ?, ?,?)", [expense_id,expense_name,account_code_id,is_mode_cotegory,account_head_id]);
							}
						}
					});
					
					document.getElementById("syncSuccessMsg").innerHTML = "Account Head synchronized Successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');

				}else{
					
					document.getElementById("syncFailureMsg").innerHTML = "Account Head synchronized Successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
				}
			},		
			error:function(data) {
				alert("Error: Oops something is wrong, Please Contact System Administer");
			}	
				
		});
		
		j.ajax({
			  url: window.localStorage.getItem("urlPath")+"CurrencyService",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonSentToSync),
			  success: function(data) {
				  if(data.status=='Success'){
					var currencyArray = data.CurrencyArray;
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM currencyMst");
					if(currencyArray != null && currencyArray.length > 0){
						for(var i=0; i<currencyArray.length; i++ ){
							var stateArr = new Array();
							stateArr = currencyArray[i];
							var curr_id = stateArr.Value;
							var curr_name = stateArr.Label;
							t.executeSql("INSERT INTO currencyMst (currencyId,currencyName) VALUES (?, ?)", [curr_id,curr_name]);
							
						}
					}
					});
					
						document.getElementById("syncSuccessMsg").innerHTML = successMsgForCurrency;
						j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					else{
					
						document.getElementById("syncFailureMsg").innerHTML = errorMsgForCurrency;
						j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}	
					
				},
				  error:function(data) {
					alert("Error: Oops something is wrong, Please Contact System Administer");
				  }
					});	
		
		j.ajax({
			  url: window.localStorage.getItem("urlPath")+"SyncTravelMaster",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonSentToSync),
			  success: function(data) {
				if(data.status=='Success'){  
				
				// Used to store data when json object is returned in web service.
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM travelModeMst");
						var modesJSONArray = data.ModesJSONArray;
						if(modesJSONArray != null && modesJSONArray.length > 0){
							for(var i=0; i<modesJSONArray.length; i++ ){
								var stateArr = new Array();
								stateArr = modesJSONArray[i];
								var travel_mode_id = stateArr.TravelModeId;
								var travel_mode_name = stateArr.TravelModeName;
								t.executeSql("INSERT INTO travelModeMst (travelModeId,travelModeName) VALUES (?, ?)", [travel_mode_id,travel_mode_name]);
								
							}
						}
					});
				
					mydb.transaction(function (t) {
						t.executeSql("DELETE FROM cityTownMst");
						var cityTownJSONArray = data.CityTownJSONArray;
						 if(cityTownJSONArray != null && cityTownJSONArray.length > 0){
							for(var i=0; i<cityTownJSONArray.length; i++ ){
								var stateArr = new Array();
								stateArr = cityTownJSONArray[i];
								var citytown_id = stateArr.CityTownId;
								var citytown_name = stateArr.CityTownName;
								t.executeSql("INSERT INTO cityTownMst (cityTownId,cityTownName) VALUES (?, ?)", [citytown_id,citytown_name]);
								
							}
						}
					});
  
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM travelCategoryMst");
						var categoryJSONArray = data.CategoryJSONArray;
						if(categoryJSONArray != null && categoryJSONArray.length > 0){
							for(var i=0; i<categoryJSONArray.length; i++ ){
								var stateArr = new Array();
								stateArr = categoryJSONArray[i];
								var trabel_category_id = stateArr.TravelCategoryId;
								var travel_category_name = stateArr.TravelCategoryName;
								var trabel_mode_id = stateArr.TravelModeId;
								t.executeSql("INSERT INTO travelCategoryMst (travelCategoryId,travelCategoryName,travelModeId) VALUES (?, ?, ?)", [trabel_category_id,travel_category_name,trabel_mode_id]);
								
							}
						}
					});
					document.getElementById("syncFailureMsg").innerHTML = "Category/CityTown Master synchronized successfully.";
				   j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');  
					mydb.transaction(function (t) {
					t.executeSql("DELETE FROM travelTypeMst");
						var travelTypeJSONArray = data.TravelTypeJSONArray;
						if(travelTypeJSONArray != null && travelTypeJSONArray.length > 0){
							for(var i=0; i<travelTypeJSONArray.length; i++ ){
								var stateArr = new Array();
								stateArr = travelTypeJSONArray[i];
								var travel_type_id = stateArr.TravelTypeId;
								var travel_type_name = stateArr.TravelTypeName;
								t.executeSql("INSERT INTO travelTypeMst (travelTypeId,travelTypeName) VALUES (?, ?)", [travel_type_id,travel_type_name]);
								
							}
						}
					});
					j('#loading_Cat').hide();
					
				}else{
					j('#loading_Cat').hide();
					document.getElementById("syncFailureMsg").innerHTML = "Travel Required master Expenses not synchronized successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
				}
			},
			error:function(data) {
				alert("Error: Oops something is wrong, Please Contact System Administer");
			}
		});
		
				 
	} else {
        alert("db not found, your browser does not support web sql!");
    }
 }
 
 
 function getAccHeadList(transaction, results) {
	var i;
	var jsonAccHeadArr = [];
	for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindAccHead = new Object();
		jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonAccHeadArr.push(jsonFindAccHead);
	}
	createAccHeadDropDown(jsonAccHeadArr);
}
function getTrAccHeadList(transaction, results) {
	var i;
	var jsonAccHeadArr = [];
	for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindAccHead = new Object();
		jsonFindAccHead["Label"] = row.accHeadId;
		jsonFindAccHead["Value"] = row.accHeadName;
		jsonAccHeadArr.push(jsonFindAccHead);
	}
	createTRAccHeadDropDown(jsonAccHeadArr);
}	

function getOperationalBudgetList(transaction, results) {
 var jsonBudgetNameArr = [];
 var jsonFindAccHead = [];
    if(results!=null){
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
   /*  operationalBudgetDetailsJSON["operationalBudgetId"]=row.operationalBudgetId;
	 operationalBudgetDetailsJSON["operationalBudgetName"]=row.operationalBudgetName;*/
		jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);
	//jsonBudgetNameArr.push(operationalBudgetDetailsJSON);
	 }
	createOperationalBudgetDropDown(jsonBudgetNameArr)
 }
}


function getExpNameList(transaction, results) {
    var i;
	var jsonExpNameArr = [];
	
	for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindExpNameHead = new Object();

		jsonFindExpNameHead["ExpenseID"] = row.id;
		jsonFindExpNameHead["ExpenseName"] = row.expName;
		
		jsonExpNameArr.push(jsonFindExpNameHead);
	}
	createExpNameDropDown(jsonExpNameArr);
}

function getCurrencyList(transaction, results) {
    var i;
	var jsonCurrencyArr = [];

    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindCurrHead = new Object();
		jsonFindCurrHead["Value"] = row.currencyId;
		jsonFindCurrHead["Label"] = row.currencyName;
		
		jsonCurrencyArr.push(jsonFindCurrHead);
	}
	createCurrencyDropDown(jsonCurrencyArr)
}	

 function onloadTravelData() {
	if (mydb) {
		mydb.transaction(function (t) {
				t.executeSql("SELECT * FROM travelModeMst", [], fetchTravelModeList);
				t.executeSql("SELECT * FROM travelCategoryMst", [], fetchTrvlCategoryList);
				t.executeSql("SELECT * FROM cityTownMst", [], fetchCityTownList);
				t.executeSql("SELECT * FROM travelTypeMst", [], fetchTrvlTypeList);
				t.executeSql("SELECT * FROM travelAccountHeadMst where processId=3", [], getTrAccHeadList);
			});
	} else {
		alert("db not found, your browser does not support web sql!");
	}
 }

function fetchTravelModeList(transaction, results) {
    var i;
	var jsonTrvlModeArr = [];
	for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindMode = new Object();
		jsonFindMode["Value"] = row.travelModeId;
		jsonFindMode["Label"] = row.travelModeName;
		
		jsonTrvlModeArr.push(jsonFindMode);
	}
	createTravelModeDown(jsonTrvlModeArr)
}

function fetchTrvlCategoryList(transaction, results) {
    var i;
	var jsonCategoryArr = [];

    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindCategory = new Object();
		jsonFindCategory["Value"] = row.travelCategoryId;
		jsonFindCategory["Label"] = row.travelCategoryName;
		
		jsonCategoryArr.push(jsonFindCategory);
	}
	createCategoryDropDown(jsonCategoryArr)
}

function fetchCityTownList(transaction, results) {
    var i;
	var jsonCityTownArr = [];

    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindCityTown = new Object();
		jsonFindCityTown["Value"] = row.cityTownId;
		jsonFindCityTown["Label"] = row.cityTownName;
		
		jsonCityTownArr.push(jsonFindCityTown);
	}
	createCitytownDropDown(jsonCityTownArr)
}

function fetchTrvlTypeList(transaction, results) {
    var i;
	var jsonTravelTypeArr = [];

    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindTravelType = new Object();
		jsonFindTravelType["Value"] = row.travelTypeId;
		jsonFindTravelType["Label"] = row.travelTypeName;
		
		jsonTravelTypeArr.push(jsonFindTravelType);
	}
	createTravelTypeDropDown(jsonTravelTypeArr)
}


function resetUserSessionDetails(){
	 window.localStorage.removeItem("prRole");
	 window.localStorage.removeItem("EmployeeId");
	 window.localStorage.setItem("EmployeeName");	 
	 window.localStorage.removeItem("BudgetingStatus");
	 window.localStorage.removeItem("BudgetingInitiates");
	 window.localStorage.setItem("UnitId");	
	 window.localStorage.setItem("forUnitId");
	 window.localStorage.setItem("ccId");
	 window.localStorage.setItem("ccName");
	 window.localStorage.setItem("pcId");
	 window.localStorage.setItem("pcName");
	 window.localStorage.setItem("companyId");
	 window.localStorage.setItem("locationName");
	 window.localStorage.setItem("locationId");
	 window.localStorage.setItem("designation");
	 window.localStorage.setItem("designationId");
	 window.localStorage.setItem("zone");
	 window.localStorage.setItem("zoneId");
	 window.localStorage.removeItem("LastName");
	 window.localStorage.removeItem("UserName");
	 window.localStorage.removeItem("Password");
 
	 dropAllTableDetails();
}

function setUserSessionDetails(val,userJSON){
	 window.localStorage.setItem("prRole",val.prRole);
	 window.localStorage.setItem("EmployeeId",val.empId);
	 window.localStorage.setItem("EmployeeName",val.empName);
	 window.localStorage.setItem("budgetingStatus",val.budgetingStatus);
	 window.localStorage.setItem("budgetingInitiates",val.budgetingInitiates);
	 window.localStorage.setItem("UnitId",val.unitId);	
	 window.localStorage.setItem("forUnitId",val.forUnitId);
	 window.localStorage.setItem("ccId",val.ccId);
	 window.localStorage.setItem("ccName",val.ccName);
	 window.localStorage.setItem("pcId",val.pcId);
	 window.localStorage.setItem("pcName",val.pcName);
	 window.localStorage.setItem("companyId",val.companyId);
	 window.localStorage.setItem("locationName",val.locationName);
	 window.localStorage.setItem("locationId",val.locationId);
	 window.localStorage.setItem("designation",val.designation);
	 window.localStorage.setItem("designationId",val.designationId);
	 window.localStorage.setItem("zoneId",val.zoneId);
	 window.localStorage.setItem("zone",val.zone);
	 window.localStorage.setItem("UserName",userJSON["user"]);
	 window.localStorage.setItem("Password",userJSON["pass"]);
}

function setJsonToAppArray(){
	jsonToAppSend["EmployeeId"] = window.localStorage.getItem("EmployeeId");
	jsonToAppSend["UnitId"] = window.localStorage.getItem("UnitId");
	jsonToAppSend["zoneId"] = window.localStorage.getItem("zoneId");
	jsonToAppSend["designationId"] = window.localStorage.getItem("designationId");
	jsonToAppSend["forUnitId"] = window.localStorage.getItem("forUnitId");
	jsonToAppSend["companyId"] = window.localStorage.getItem("companyId");
	jsonToAppSend["budgetingStatus"] = window.localStorage.getItem("budgetingStatus");
	jsonToAppSend["budgetingInitiates"] = window.localStorage.getItem("budgetingInitiates");
	jsonToAppSend["prTitle"] = document.getElementById("prTitle").value;
    jsonToAppSend["pcId"] = window.localStorage.getItem("pcId");
	jsonToAppSend["pcName"] = window.localStorage.getItem("pcName");
    jsonToAppSend["ccId"] = window.localStorage.getItem("ccId"); 
    jsonToAppSend["ccName"] = window.localStorage.getItem("ccName");
    jsonToAppSend["locationId"] = window.localStorage.getItem("locationId");
	jsonToAppSend["locationName"] = window.localStorage.getItem("locationName");

	var delDate = jsonToAppSend["deliveryDate"];

	var newDateFormat = delDate.substring(3,5)+"-"+(delDate.substring(0,2))+"-"+delDate.substring(6,10);	  
	jsonToAppSend["deliveryDate"] = newDateFormat;
}

function setUserStatusInLocalStorage(status){
	window.localStorage.setItem("UserStatus",status);
}
function setUrlPathLocalStorage(url){
	window.localStorage.setItem("urlPath",url);
}
function dropAllTableDetails(){

	mydb.transaction(function(t) {
		t.executeSql("DELETE TABLE currencyMst ");
		t.executeSql("DELETE TABLE accountHeadMst ");
		t.executeSql("DELETE TABLE expNameMst");
		t.executeSql("DELETE TABLE businessExpDetails");
		t.executeSql("DELETE TABLE walletMst");
		t.executeSql("DELETE TABLE travelModeMst");
		t.executeSql("DELETE TABLE travelCategoryMst ");
		t.executeSql("DELETE TABLE cityTownMst");
		t.executeSql("DELETE TABLE travelTypeMst");
		t.executeSql("DELETE TABLE travelAccountHeadMst");
		t.executeSql("DELETE TABLE travelExpenseNameMst");
		t.executeSql("DELETE TABLE travelSettleExpDetails");
		t.executeSql("DELETE TABLE travelRequestDetails");
	 });

}

function getUserID() {
	userKey=window.localStorage.getItem("EmployeeId");
	if(userKey==null) return  "";
	else return userKey;
}

function deleteSelectedExpDetails(businessExpDetailId){
			mydb.transaction(function (t) {
				t.executeSql("DELETE FROM businessExpDetails WHERE busExpId=?", [businessExpDetailId]);
			});
	  }

	  function deleteSelectedTSExpDetails(travelSettleExpDetailId){
			mydb.transaction(function (t) {
				t.executeSql("DELETE FROM travelSettleExpDetails WHERE tsExpId=?", [travelSettleExpDetailId]);
			});
	  }
					  
function fetchWalletImage() {
			var rowsWallet;
			mytable = j('<table></table>').attr({ id: "walletSource",class: ["table","table-striped","table-bordered-wallet"].join(' ') });
		 
			mydb.transaction(function(t) {
				
		      t.executeSql('SELECT * FROM walletMst;', [],
				 function(transaction, result) {
					
				if (result != null && result.rows != null) {
					  
					for (var i = 0; i < result.rows.length; i++) {
						
					  var row = result.rows.item(i);						 
					  
							if(i % 2 == 0){
								rowsWallet = j('<tr></tr>').attr({ class: ["test"].join(' ') }).appendTo(mytable);  
							}				
							
							j('<td></td>').attr({ class: ["walletattach"].join(' ') }).html('<text style="display: none">'+row.walletAttachment+'</text>'+'<p id="para" style="display: none">'+row.walletId+'</p>'+'<img src="'+row.walletAttachment+'">').appendTo(rowsWallet);
							
					}	
				j("#walletSource td").click(function(){
					headerOprationBtn = defaultPagePath+'headerPageForWalletOperation.html';
					if(j(this).hasClass( "selected")){
							j(this).removeClass('selected');
							j('#mainHeader').load(headerOprationBtn);
						}else{
							j('#mainHeader').load(headerOprationBtn);
							j(this).addClass('selected');					
						}								
					});
				  }		
				});
			});
			 mytable.appendTo("#walletBox");	 
}

function deleteSelectedWallets(walletID){
	mydb.transaction(function (t) {
			t.executeSql("DELETE FROM walletMst WHERE walletId=?", [walletID]);
		});
  }

function saveWalletAttachment(status){
	j('#loading_Cat').show();
	if (mydb) {
		//get the values of the text inputs
      
		var file = document.getElementById('imageWallet').files[0];
		
	if (file != "") {
            mydb.transaction(function (t) {
                t.executeSql("INSERT INTO walletMst (walletAttachment) VALUES (?)", 
											[file]);
                if(status == "0"){
					document.getElementById('imageWallet').value ="";	
					createWallet();					
				}else{
				    createWallet();
				}
			});
            j('#loading_Cat').hide();
        } else {
        	j('#loading_Cat').hide();
            alert("You must enter inputs!");
        }
	} else {
        alert("db not found, your browser does not support web sql!");
    }
}



function getExpenseNamesfromDB(accountHeadId){
	j('#errorMsgArea').children('span').text("");
 if (mydb) {
        //Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM expNameMst where accHeadId="+accountHeadId, [], getExpNameList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getExpenseNamesfromDBTravel(travelRequestId){
 if (mydb) {
        //Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
        	t.executeSql("SELECT * FROM travelExpenseNameMst where accHeadId=(select accountHeadId from travelRequestDetails where travelRequestId="+travelRequestId+")", [],fetchTravelExpeseName);
        	//t.executeSql("SELECT * FROM travelExpenseNameMst where travelAccountHeadId="+accountHeadId, [],fetchTravelExpeseName);
			});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getStartEndDatefromDBTravel(travelRequestId){
 if (mydb) {
	     //Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
        var result	= t.executeSql("select travelStartDate,travelEndDate from travelRequestDetails where travelRequestId="+travelRequestId, [],fetchTravelStartEndDate);
        	});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getCurrencyDBTravel(travelRequestId){
 if (mydb) {
	      //Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
        t.executeSql("select travelDomOrInter from travelRequestDetails where travelRequestId="+travelRequestId, [],fetchTravelDomOrInterDate);
        	
			});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function onloadTravelSettleData() {
	if (mydb) {
		mydb.transaction(function (t) {
				t.executeSql("SELECT * FROM travelModeMst", [], fetchTravelModeList);
				t.executeSql("SELECT * FROM travelCategoryMst", [], fetchTrvlCategoryList);
				t.executeSql("SELECT * FROM cityTownMst", [], fetchCityTownList);
				t.executeSql("SELECT * FROM travelRequestDetails", [], fetchTravelRequestNumberList);
				t.executeSql("SELECT * FROM travelExpenseNameMst", [], fetchTravelExpeseName);
				t.executeSql("SELECT * FROM currencyMst", [], getCurrencyList);
			});
	} else {
		alert("db not found, your browser does not support web sql!");
	}
 }
 
 function fetchTravelExpeseName(transaction, results) {
    var i;
	var jsonExpenseNameArr = [];
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindTravelType = new Object();
		jsonFindTravelType["ExpenseNameId"] = row.id;
		jsonFindTravelType["ExpenseName"] = row.expenseName;
		jsonExpenseNameArr.push(jsonFindTravelType);
	}
	createTravelExpenseNameDropDown(jsonExpenseNameArr)
}

function fetchTravelStartEndDate(transaction, results) {
	var monthVal = ""
    var i;
	var jsonExpenseNameArr = [];
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		
	}
	$(function() {
		var startDate = row.travelStartDate;
		j("label[for='startDate']").html(startDate);
		var endDate = row.travelEndDate;
		j("label[for='endDate']").html(endDate);
		var startdate_day = startDate.substring(0,2);
		var startdate_month = convertDate(startDate.substring(3,6));
		var startdate_year = startDate.substring(7,11);
		var endDate_day = endDate.substring(0,2);
		var endDate_month = convertDate(endDate.substring(3,6));
		var endDate_year = endDate.substring(7,11);
			var date = new Date();
			var currentMonth = date.getMonth();
			var currentDate = date.getDate();
			var currentYear = date.getFullYear();
			
			$('#expDate').datepicker({
			maxDate: new Date(endDate_year, endDate_month, endDate_day),
			minDate: new Date(startdate_year, startdate_month, startdate_day)
		});
	}); 
}

function fetchTravelDomOrInterDate(transaction, results) {
	var monthVal = ""
    var i;
	var jsonExpenseNameArr = [];
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var DomOrInter = row.travelDomOrInter;
		if(DomOrInter == 'D'){ 
			j('#currency').select2('disable');
		}else{ 
		j('#currency').select2('enable');
			if (mydb) { 
		mydb.transaction(function (t) {
		t.executeSql("SELECT * FROM currencyMst", [], getCurrencyList);
		});
		} else {
		alert("db not found, your browser does not support web sql!");
	}
		}
	}
	 
}




function getOperationalBudgetFromDB(opBudgetID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			//t.executeSql("SELECT * FROM operationalBudgetMst where id="+opBudgetID, [], getOperationalBudgetList);
			t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getModecategoryFromDB(expenseNameID){
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM travelExpenseNameMst where id="+expenseNameID, [], setModeCategroyDetails);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getCategoryFromDB(modeID){
 if (mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM travelCategoryMst where travelModeId="+modeID, [], fetchTrvlCategoryList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function synchronizeTRForTS() {
	var jsonSentToSync=new Object();
	jsonSentToSync["EmployeeId"] = window.localStorage.getItem("EmployeeId");
	j('#loading_Cat').show();
	if (mydb) {
 		j.ajax({
			url: window.localStorage.getItem("urlPath")+"FetchTRForTSWebService",
			type: 'POST',
			dataType: 'json',
			crossDomain: true,
			data: JSON.stringify(jsonSentToSync),
			success: function(data) {
				if(data.status=='Success'){
					  mydb.transaction(function (t) {
						t.executeSql("DELETE FROM travelRequestDetails");
						var travelRequestArray = data.TravelReqJSONArray;
						if(travelRequestArray != null && travelRequestArray.length > 0){
							for(var i=0; i<travelRequestArray.length; i++ ){
								var stateArr = new Array();
								stateArr = travelRequestArray[i];
								var travel_request_id = stateArr.TravelRequestId;
								var travel_request_no = stateArr.TravelRequestNo;
								var title= stateArr.Title;
								var ac_head_id = stateArr.AcHeadId;
								var tr_end_date = stateArr.TravelEndDate;
								var tr_start_date = stateArr.TravelStartDate;
								var tr_DomOrInter = stateArr.TravelDoMOrInter;
								t.executeSql("INSERT INTO travelRequestDetails (travelRequestId,travelRequestNo,title,accountHeadId,travelEndDate,travelStartDate,travelDomOrInter) VALUES (?, ?,?, ?, ?, ?, ?)", [travel_request_id,travel_request_no,title,ac_head_id,tr_end_date,tr_start_date,tr_DomOrInter]);
								
							}
						}						
					});
					j('#loading_Cat').hide();
					document.getElementById("syncSuccessMsg").innerHTML = "Travel Request Details synchronized successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
				}else{
					j('#loading_Cat').hide();
					document.getElementById("syncFailureMsg").innerHTML = "Travel Required Expenses not synchronized successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
				}
					
			},
			error:function(data) {
				alert("Error: Oops something is wrong, Please Contact System Administer");
			}
		});

	} else {
        alert("db not found, your browser does not support web sql!");
    }
 }
 
 function fetchTravelRequestNumberList(transaction, results) {
	 
    var i;
	var jsonExpenseNameArr = [];
    for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindTravelType = new Object();
		jsonFindTravelType["TravelRequestId"] = row.travelRequestId;
		jsonFindTravelType["Title"]=row.title;
		jsonFindTravelType["TravelRequestNumber"] = row.travelRequestNo;
		jsonExpenseNameArr.push(jsonFindTravelType);
	}
	createTravelRequestNoDropDown(jsonExpenseNameArr)
}

 function forceCloseDropdown() {
	    j('#accountHead').select2('close');
		j('#expenseName').select2('close');
		j('#currency').select2('close');
		j('#travelType').select2('close');
		j('#fromCitytown').select2('close');
		j('#toCitytown').select2('close');
		j('#travelMode').select2('close');
		j('#travelCategory').select2('close');
		j('#roundTripMode').select2('close');
		j('#roundTripCategory').select2('close');
		j('#travelRequestName').select2('close');
		j('#travelExpenseName').select2('close');
	}
	
 function showHelpMenu(){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
     var pageRef=defaultPagePath+'helpMenuPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
   appPageHistory.push(pageRef);
	}
	function showBEBRBHelp(){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
     var pageRef=defaultPagePath+'helpBEBRPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
   appPageHistory.push(pageRef);
	}
	function showTRTSHelp(){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
     var pageRef=defaultPagePath+'helpTRTSPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
   appPageHistory.push(pageRef);
	}
	function showWalletHelp(){
		var headerBackBtn=defaultPagePath+'backbtnPage.html';
     var pageRef=defaultPagePath+'helpWalletPage.html';
			j(document).ready(function() {
				j('#mainHeader').load(headerBackBtn);
				j('#mainContainer').load(pageRef);
			});
   appPageHistory.push(pageRef);
	}
	
	// VSM Mobile
	function synchronizePRMasterDataNonBudget() {
		var jsonSentToSync=new Object();
		jsonSentToSync["BudgetingStatus"] = window.localStorage.getItem("budgetingStatus");
		jsonSentToSync["EmployeeId"] = window.localStorage.getItem("EmployeeId");
		jsonSentToSync["GradeId"] = window.localStorage.getItem("GradeID");
		jsonSentToSync["UnitId"] = window.localStorage.getItem("UnitId");
		jsonSentToSync["moduleId"] = 3;
		jsonSentToSync["processId"] = 6;
		j('#loading_Cat').show();
		if (mydb) {
			j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SyncPRDataNonBudgetWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonSentToSync),
				  success: function(data) {
					  if(data.Status=='Success'){
					  	mydb.transaction(function (t) {
						t.executeSql("DELETE FROM accHeadMst");
						var accountHeadMstArray = data.AccountHeadArray;
						var accCodeArray = data.AccCodeArray;
						var itemArray = data.ItemArray;
							if(accountHeadMstArray != null && accountHeadMstArray.length > 0){
								for(var i=0; i<accountHeadMstArray.length; i++ ){
									var stateArr = new Array();
									stateArr = accountHeadMstArray[i];
									var account_Head_id = stateArr.Value;
									var account_Head_name = stateArr.Label;
									t.executeSql("INSERT INTO accHeadMst (acHeadId,acHeadName) VALUES (?, ?)", [account_Head_id,account_Head_name]);
								}
							}
							t.executeSql("DELETE FROM accCodeMst");
							if(accCodeArray != null && accCodeArray.length > 0){
								for(var i=0; i<accCodeArray.length; i++ ){
									var stateArr1 = new Array();
									stateArr1 = accCodeArray[i];
									var account_Code_id = stateArr1.AccCodeId;
									var account_Code_name = stateArr1.AccCode;
									var capex_Opex = stateArr1.CapexOpex;
									var acc_Head_Id = stateArr1.AccountHeadId;
									t.executeSql("INSERT INTO accCodeMst (accCodeId,acHeadId,accCodeName,capexOpex) VALUES (?, ?,?,?)", [account_Code_id,acc_Head_Id,account_Code_name,capex_Opex]);
								}
							}
							t.executeSql("DELETE FROM itemMst");
							if(itemArray != null && itemArray.length > 0){
								for(var i=0; i<itemArray.length; i++ ){
									var stateArr1 = new Array();
									stateArr1 = itemArray[i];
									var item_code_id = stateArr1.ItemId;
									var item_name = stateArr1.ItemName;
									var item_code = stateArr1.ItemCode;
									var grnReq = stateArr1.grnReq;
									var poReq = stateArr1.PoRequired;
									var acc_code_id = stateArr1.AcCodeId;
									t.executeSql("INSERT INTO itemMst (itemId,itemName,itemCode,accCodeId,poRequired,grnRequired) VALUES (?,?,?,?,?,?)",[item_code_id,item_name,item_code,acc_code_id,poReq,grnReq]);
								}
							}

						});	
					  j('#loading_Cat').hide();
						document.getElementById("syncSuccessMsg").innerHTML = "Purchase Requisition Master synchronized  successfully.";
						j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
		
					}
					else{
						j('#loading_Cat').hide();
						document.getElementById("syncFailureMsg").innerHTML = "Purchase Requisition Master not synchronized  successfully.";
						j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					},
			  error:function(data) {
				 alert("Error: Oops something is wrong, Please Contact System Administrator");
			  }
				});	 

		/*	j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SyncSubZoneWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonSentToSync),
				  success: function(data) {
					  if(data.Status=='Success'){
					  	mydb.transaction(function (t) {
						t.executeSql("DELETE FROM subZoneMst");
						var subZoneMstArray = data.SubZoneArray;
							if(subZoneMstArray != null && subZoneMstArray.length > 0){
								for(var i=0; i<subZoneMstArray.length; i++ ){
									var stateArr = new Array();
									stateArr = subZoneMstArray[i];
									var subZone_id = stateArr.Value;
									var subZone_name = stateArr.Label;
									t.executeSql("INSERT INTO subZoneMst (subZoneId,subZoneName) VALUES (?, ?)", [subZone_id,subZone_name]);
								}
							}
						});	
						document.getElementById("syncSuccessMsg").innerHTML = "SubZone Master synchronized  successfully.";
						j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					else{
						document.getElementById("syncFailureMsg").innerHTML = "SubZone Master not synchronized  successfully.";
						j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					},
			  error:function(data) {
				 alert("Error: Oops something is wrong, Please Contact System Administrator");
			  }

				});	*/

				j.ajax({
			  url: window.localStorage.getItem("urlPath")+"SyncLocationWebService",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonSentToSync),
			  success: function(data) {
				  if(data.Status=='Success'){
				  	mydb.transaction(function (t) {
					t.executeSql("DELETE FROM locationMst");
					var locationMstArray = data.LocationArray;
						if(locationMstArray != null && locationMstArray.length > 0){
							for(var i=0; i<locationMstArray.length; i++ ){
								var stateArr = new Array();
								stateArr = locationMstArray[i];
								var location_id = stateArr.Value;
								var location_name = stateArr.Label;
								t.executeSql("INSERT INTO locationMst (locationId,locationName) VALUES (?, ?)", [location_id,location_name]);
							}
						}
					});	
					document.getElementById("syncSuccessMsg").innerHTML = "Location Master synchronized  successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				else{
					document.getElementById("syncFailureMsg").innerHTML = "Location Master not synchronized  successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				},
			  error:function(data) {
				 alert("Error: Oops something is wrong, Please Contact System Administrator");
			  }

			});	
		}
	}
	function synchronizePRMasterData() {
		var jsonSentToSync=new Object();
		
		jsonSentToSync["BudgetingStatus"] = window.localStorage.getItem("budgetingStatus");
		jsonSentToSync["EmployeeId"] = window.localStorage.getItem("EmployeeId");
		jsonSentToSync["UnitId"] = window.localStorage.getItem("unitId");
		
		j('#loading_Cat').show();
		if (mydb) {

			j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SyncOperationalBudgetWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonSentToSync),
				  success: function(data) {
						if(data.Status=='Success'){
							  mydb.transaction(function (t) {
								t.executeSql("DELETE FROM operationalBudgetMst");
								var opBudgetArray = data.OperationaBudgetArray;
								 if(opBudgetArray != null && opBudgetArray.length > 0){
									for(var i=0; i<opBudgetArray.length; i++ ){
										var stateArr = new Array();
										stateArr = opBudgetArray[i];
										var op_budget_id = stateArr.Value;
										var op_budget_name = stateArr.Label;
										//var process_id = '6';
										t.executeSql("INSERT INTO operationalBudgetMst (opBudgetId,opBudgetName) VALUES (?, ?)", [op_budget_id,op_budget_name]);
									}
								}
								
								t.executeSql("DELETE FROM corporateBudget");
								var corporateBudgetArray = data.CorporateBudgetArray;
								if(corporateBudgetArray != null && corporateBudgetArray.length > 0){
									for(var i=0; i<corporateBudgetArray.length; i++ ){
										var stateArr = new Array();
										stateArr = corporateBudgetArray[i];
										var corporate_Id = stateArr.CorporateId;
										var ac_Code_Id = stateArr.AcCodeId;
										//account_code_id = 1;
										t.executeSql("INSERT INTO corporateBudget (corporateId ,accCodeId) VALUES (?, ?)", [corporate_Id,ac_Code_Id]);
									}
								}
								
								t.executeSql("DELETE FROM accHeadMst");
								var accountHeadArray = data.AccountHeadArray;
								if(accountHeadArray != null && accountHeadArray.length > 0){
									for(var i=0; i<accountHeadArray.length; i++ ){
										var stateArr = new Array();
										stateArr = accountHeadArray[i];
										var ac_Head_Id = stateArr.Value;
										var ac_Head_Name = stateArr.Label;
										t.executeSql("INSERT INTO accHeadMst (acHeadId ,acHeadName) VALUES (?, ?)", [ac_Head_Id,ac_Head_Name]);
									}
								}
								
								t.executeSql("DELETE FROM accCodeMst");
								var accountCodeArray = data.AccountCodeArray;
								if(accountCodeArray != null && accountCodeArray.length > 0){
									for(var i=0; i<accountCodeArray.length; i++ ){
										var stateArr = new Array();
										stateArr = accountCodeArray[i];
										var acc_Code_Id = stateArr.Value;
										var acc_Code_Name = stateArr.Label;
										var ac_Head_Id = stateArr.AcHeadId;
										var capex_Opex = stateArr.CapexOpex;
										t.executeSql("INSERT INTO accCodeMst (accCodeId ,acHeadId, accCodeName ,capexOpex) VALUES (?, ?, ?, ?)", [acc_Code_Id ,ac_Head_Id ,acc_Code_Name ,capex_Opex]);
									}
								}
								
								t.executeSql("DELETE FROM itemMst");
								var itemMasterArray = data.ItemMasterArray;
								if(itemMasterArray != null && itemMasterArray.length > 0){
									for(var i=0; i<itemMasterArray.length; i++ ){
										var stateArr = new Array();
										stateArr = itemMasterArray[i];
										var item_Id = stateArr.Value;
										var item_Name = stateArr.Label;
										var po_Reqd = stateArr.POReqd;
										var grn_Reqd = stateArr.GRNReqd;
										var acc_code_id = stateArr.AcCodeId;
										t.executeSql("INSERT INTO itemMst (itemId ,itemCode ,accCodeId ,poRequired ,grnRequired) VALUES (?, ?, ?, ?, ?)", [item_Id,item_Name,acc_code_id,po_Reqd,acc_code_id]);
									}
								}
								
								t.executeSql("DELETE FROM costCenterMst");
								var costCenterArray = data.CostCenterArray;
								if(costCenterArray != null && costCenterArray.length > 0){
									for(var i=0; i<costCenterArray.length; i++ ){
										var stateArr = new Array();
										stateArr = costCenterArray[i];
										var cost_center_Id = stateArr.Value;
										var cost_center_Name = stateArr.Label;
										account_code_id = 1;
										t.executeSql("INSERT INTO costCenterMst (costCenterId ,costCenterName) VALUES (?, ?)", [cost_center_Id,cost_center_Name]);
									}
								}
								
								t.executeSql("DELETE FROM budgetMst");
								var budgetNameArray = data.BudgetNameArray;
								if(budgetNameArray != null && budgetNameArray.length > 0){
									for(var i=0; i<budgetNameArray.length; i++ ){
										var stateArr = new Array();
										stateArr = budgetNameArray[i];
										var budget_Id = stateArr.Value;
										var budget_Name = stateArr.Label;
										t.executeSql("INSERT INTO budgetMst (budgetId ,budgetName) VALUES (?, ?)", [budget_Id,budget_Name]);
									}
								}
								
								/*t.executeSql("DELETE FROM locationMst");
								var corporateBudgetArray = data.CorporateBudgetArray;
								if(corporateBudgetArray != null && corporateBudgetArray.length > 0){
									for(var i=0; i<corporateBudgetArray.length; i++ ){
										var stateArr = new Array();
										stateArr = corporateBudgetArray[i];
										var corporate_Id = stateArr.Value;
										var corporate_Name = stateArr.Label;
										//account_code_id = '1';
										t.executeSql("INSERT INTO corporateBudget (corporateId ,corporateName ,accountCodeId) VALUES (?, ?)", [corporate_Id,corporate_Name,account_code_id]);
									}
								}*/
								j('#loading_Cat').hide();
								document.getElementById("syncFailureMsg").innerHTML = "Purchase Requisition Related Master synchronized Successfully.";
								j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');

							});
							
						}else{
							j('#loading_Cat').hide();
							document.getElementById("syncFailureMsg").innerHTML = "Purchase Requisition Related Master not synchronized Successfully.";
							j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						}
					},		
					error:function(data) {
						alert("Error: Oops something is wrong, Please Contact System Administrator");
					}	
						
				});
				
				j.ajax({
				  url: window.localStorage.getItem("urlPath")+"SyncSubZoneWebService",
				  type: 'POST',
				  dataType: 'json',
				  crossDomain: true,
				  data: JSON.stringify(jsonSentToSync),
				  success: function(data) {
					  if(data.Status=='Success'){
					  	mydb.transaction(function (t) {
						t.executeSql("DELETE FROM subZoneMst");
						var subZoneMstArray = data.SubZoneArray;
							if(subZoneMstArray != null && subZoneMstArray.length > 0){
								for(var i=0; i<subZoneMstArray.length; i++ ){
									var stateArr = new Array();
									stateArr = subZoneMstArray[i];
									var subZone_id = stateArr.Value;
									var subZone_name = stateArr.Label;
									t.executeSql("INSERT INTO subZoneMst (subZoneId,subZoneName) VALUES (?, ?)", [subZone_id,subZone_name]);
								}
							}
						});	
						document.getElementById("syncSuccessMsg").innerHTML = "SubZone Master synchronized  successfully.";
						j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					else{
						document.getElementById("syncFailureMsg").innerHTML = "SubZone Master not synchronized  successfully.";
						j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
						
					}
					},
			 		error:function(data) {
					 alert("Error: Oops something is wrong, Please Contact System Administrator");
			  		}

				});	

				j.ajax({
			  url: window.localStorage.getItem("urlPath")+"SyncLocationWebService",
			  type: 'POST',
			  dataType: 'json',
			  crossDomain: true,
			  data: JSON.stringify(jsonSentToSync),
			  success: function(data) {
				  if(data.Status=='Success'){
				  	mydb.transaction(function (t) {
					t.executeSql("DELETE FROM locationMst");
					var locationMstArray = data.LocationArray;
						if(locationMstArray != null && locationMstArray.length > 0){
							for(var i=0; i<locationMstArray.length; i++ ){
								var stateArr = new Array();
								stateArr = locationMstArray[i];
								var location_id = stateArr.Value;
								var location_name = stateArr.Label;
								t.executeSql("INSERT INTO locationMst (locationId,locationName) VALUES (?, ?)", [location_id,location_name]);
							}
						}
					});	
					document.getElementById("syncSuccessMsg").innerHTML = "Location Master synchronized  successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				else{
					document.getElementById("syncFailureMsg").innerHTML = "Location Master not synchronized  successfully.";
					j('#syncFailureMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					
				}
				},
			 	error:function(data) {
				 alert("Error: Oops something is wrong, Please Contact System Administrator");
				  }

			});	
		}
	}

function backToPrevious(status){
	exceptionMessage='';
	if(status == "1"){
	backBtn = true;
    var pageRef=defaultPagePath+'addPurchaseReq.html';
    var headerBackBtn=defaultPagePath+'backToHomeStepOneImg.html';
	j(document).ready(function() {
		
		j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
	appPageHistory.push(pageRef);
    
	}
	else if(status == "2"){
	backBtn = true;
   var pageRef=defaultPagePath+'addPurchaseReqScreen2.html';
    var headerBackBtn=defaultPagePath+'backToHomeStepTwoImg.html';
	j(document).ready(function() {
		
		j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
    appPageHistory.push(pageRef);
	
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function showEasyPR(status){
	if(status == 1){
		var itemId = jsonToAppSend["itemId"];
		j('#item').select2("val",itemId);
		document.getElementById("prquantity").value = jsonToAppSend["prquantity"];
		document.getElementById("prrate").value = jsonToAppSend["prrate"];
		document.getElementById("delDate").value = jsonToAppSend["deliveryDate"];
	}else if(status == 2){
		document.getElementById("narration").value = jsonToAppSend["narration"];
	}
}
	
function itemCartPage(status){
	exceptionMessage='';
	if(status == "1"){
    backBtn = false;
    var pageRef=defaultPagePath+'prInvoice.html';
    var headerBackBtn=defaultPagePath+'expenzingImagePage.html';
	j(document).ready(function() {
		
		j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
    appPageHistory.push(pageRef);
	}
	else if(status == "2"){
		backBtn = false;
		if(validateEasyPrDetails(1)){
		jsonToAppSend["prquantity"]=document.getElementById("prquantity").value;
		jsonToAppSend["prrate"]=document.getElementById("prrate").value;	
		jsonToAppSend["deliveryDate"]=document.getElementById("delDate").value;
		calculateRatePerQuantity();		

		   var pageRef=defaultPagePath+'addPurchaseReqScreen2.html';
		   var headerBackBtn=defaultPagePath+'backToHomeStepTwoImg.html';
		   j('#mainHeader').load(headerBackBtn);
		   j('#mainContainer').load(pageRef);

	   appPageHistory.push(pageRef);
		}else{
			return false;
		}

    }else if(status == "3"){
    	backBtn = false;
	if (mydb) {
		jsonToAppSend["narration"]=document.getElementById("narration").value;
   		var pageRef=defaultPagePath+'addPurchaseReqScreen3.html';
    	var headerBackBtn=defaultPagePath+'backToHomeStepThreeImg.html';
		j(document).ready(function() {
		
			j('#mainHeader').load(headerBackBtn);
			j('#mainContainer').load(pageRef);
		});
    	appPageHistory.push(pageRef);
	}

		
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}

function saveEasyPr(){
	exceptionMessage='';
	var prTitle = document.getElementById("prTitle").value;
	if(prTitle == ''){
		alert("Please enter PR Title.");
		return false;
	}else{
	setJsonToAppArray();
    var pageRef=defaultPagePath+'success.html';
    var headerBackBtn=defaultPagePath+'backToHome.html';
	urlPath=window.localStorage.getItem("urlPath");
	j('#loading').show();
    j.ajax({
         url: urlPath+"SaveEasyPRWebService",
         type: 'POST',
         dataType: 'json',
         crossDomain: true,
         data: JSON.stringify(jsonToAppSend),
         success: function(data) {
         	if (data.status == 'Success'){
         	var pageRef=defaultPagePath+'success.html';
        	 j('#mainHeader').load(headerBackBtn);
             j('#mainContainer').load(pageRef);
             successMessage = data.Message;
              appPageHistory.push(pageRef);
              
			}else if(data.status == 'Failure'){
 			   successMessage = data.Message;
 			   var pageRef=defaultPagePath+'failure.html';
	        	 j('#mainHeader').load(headerBackBtn);
	             j('#mainContainer').load(pageRef);
	             successMessage = data.Message;
	             appPageHistory.push(pageRef);
           }

         },
         error:function(data) {
		   j('#loading').hide();
         }
   });
  }
}

function validateEasyPrDetails(status){
	exceptionMessage='';
	if(status == "1"){
		var prQtty = document.getElementById("prquantity").value;
		var prRate = document.getElementById("prrate").value;
		var deliveryDate = document.getElementById("delDate").value;

		if(j("#item").select2('data') == null){
			alert("Please select an Item") ;
			return false;
		}else if(prQtty == null || prQtty == '' || prQtty == 0){
			alert("PR Quantity cannot be 0 or blank");
			return false;
		}else if(prRate == null || prRate == '' || prRate == 0){
			alert("PR Rate cannot be 0 or blank");
			return false;
		}else if(deliveryDate == ''){
			alert("Please enter Expected Delivery Date.");
			return false;
		}else {
			return true;
		}
		

	}
	else if(status == "2"){
	return true;
    }else if(status == "3"){
	return true;
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}
	


//Amit Start
function savePRDetails(status){
	exceptionMessage='';
	if(status == "1"){
   var pageRef=defaultPagePath+'prInvoice.html';
    var headerBackBtn=defaultPagePath+'expenzingImagePage.html';
	j(document).ready(function() {
		
		j('#mainHeader').load(headerBackBtn);
		j('#mainContainer').load(pageRef);
	});
    appPageHistory.push(pageRef);
	}
	else if(status == "0"){
	if (mydb) {
		//get the values of the text inputs
        var pr_title = document.getElementById('prTitle').value;
		var po_raised_at = document.getElementById('poRaised').value;
		var grn_raised_at = document.getElementById('grnRaised').value;
		var acCode_Type = document.getElementById('acCodeType').value;
		var acc_head_id;
		var acc_head_val;
		var opBudget_id;
		var opBudget_val;

		if(j("#accountHead").select2('data') != null){
			acc_head_id = j("#accountHead").select2('data').id;
			acc_head_val = j("#accountHead").select2('data').name;
		}else{
			acc_head_id = '-1';
		}
		
		if(j("#opBudget").select2('data') != null){
			opBudget_id = j("#opBudget").select2('data').id;
			opBudget_val = j("#opBudget").select2('data').name;
		}else{
			opBudget_id = '-1';
		}	
		
		
		
		
		/*if(validatePrDetails(pr_title,po_raised_at,grn_raised_at,acCode_Type,acc_head_id,opBudget_id)){
		 
		j('#loading_Cat').show();			  
		  
		 	viewBusinessExp();
			
		 /* mydb.transaction(function (t) {
				t.executeSql("INSERT INTO businessExpDetails (expDate, accHeadId,expNameId,expFromLoc, expToLoc, expNarration, expUnit,expAmt,currencyId,isEntitlementExceeded,busExpAttachment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
											[exp_date,acc_head_id,exp_name_id,exp_from_loc, exp_to_loc,exp_narration,exp_unit,exp_amt,currency_id,entitlement_exceeded,file]);*/
			/*					
				if(status == "0"){
				
     		document.getElementById('prTitle').value ="";
			document.getElementById('poRaised').value ="";;
			document.getElementById('grnRaised').value ="";;
			document.getElementById('acCodeType').value ="";;
/*					smallImageBE.style.display = 'none';
					smallImageBE.src = "";*/
					/*j('#errorMsgArea').children('span').text("");
					j('#accountHead').select2('data', '');
					j('#opBudget').select2('data', '');
					//j('#currency').select2('data', '');
					j('#loading_Cat').hide();
					document.getElementById("syncSuccessMsg").innerHTML = "Expenses added successfully.";
					j('#syncSuccessMsg').hide().fadeIn('slow').delay(500).fadeOut('slow');
					//resetImageData();*/
					//createBusinessExp();
				/*}
			};
			}else{
			return false;
		}*/
		
		
    } else {
        alert("db not found, your browser does not support web sql!");
    }
}
}

function onloadPR() {
// 	document.getElementById("SubzoneDiv").style.display = "none";
 	var BudgetingStatus = window.localStorage.getItem("budgetingStatus");


 /*		if(BudgetingStatus =='N'){
 			
 			document.getElementById("Budgeting").style.display = "none";
 		}
 		else{
 			document.getElementById("Budgeting").style.display = "";
 			
 		} */
 	
	if (mydb) {
		mydb.transaction(function (t) {
				t.executeSql("SELECT * FROM accHeadMst", [], getAccHeadList);
				t.executeSql("SELECT * FROM subZoneMst", [], getsubZoneList);
				//t.executeSql("SELECT * FROM expNameMst", [], getExpNameList);
				t.executeSql("SELECT * FROM operationalBudgetMst", [], getOperationalBudgetList);
				t.executeSql("SELECT * FROM budgetMst", [], getBudgetList);
				t.executeSql("SELECT * FROM itemMst", [], getItemList);
			});
	} else {
		alert("db not found, your browser does not support web sql!");
	}
 }

 function onloadPRScreen2() {
 	
 		var BudgetingStatus = window.localStorage.getItem("budgetingStatus");
 	
 		if(BudgetingStatus =='N'){
 			
 			document.getElementById("Budgeting").style.display = "none";
 		
 		}
 		else{
 			document.getElementById("Budgeting").style.display = "";	
 		}
 	
	if (mydb) {
		mydb.transaction(function (t) {
				t.executeSql("SELECT * FROM accHeadMst", [], getAccHeadList);
				t.executeSql("SELECT * FROM costCenterMst", [], getCcList);
				t.executeSql("SELECT * FROM locationMst", [], getLocationList);
				t.executeSql("SELECT * FROM operationalBudgetMst", [], getOperationalBudgetList);
				t.executeSql("SELECT * FROM budgetMst", [], getBudgetList);
				t.executeSql("SELECT * FROM itemMst", [], getItemList);
			});
	} else {
		alert("db not found, your browser does not support web sql!");
	}
 }


 function getBudgetList(transaction, results) {

 var jsonBudgetNameArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var budgetDetailsJSON = new Object();
      budgetDetailsJSON ["Label"]=row.budgetId;
	  budgetDetailsJSON ["Value"]=row.budgetName;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonBudgetNameArr.push(budgetDetailsJSON);
	 }
	
	createBudgetDropDown(jsonBudgetNameArr)
 }
}

 function getOperationalBudgetList(transaction, results) {

 var jsonOpBudgetNameArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var opBudgetDetailsJSON = new Object();
      opBudgetDetailsJSON ["Label"]=row.opBudgetId;
	  opBudgetDetailsJSON ["Value"]=row.opBudgetName;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonOpBudgetNameArr.push(opBudgetDetailsJSON);
	 }
	
	createOpBudgetDropDown(jsonOpBudgetNameArr)
 }
}

function getExpNameList(transaction, results) {
    var i;
	var jsonExpNameArr = [];
	
	for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
		var jsonFindExpNameHead = new Object();

		jsonFindExpNameHead["accHeadId"] = row.id;
		jsonFindExpNameHead["acHeadName"] = row.expName;
		
		jsonExpNameArr.push(jsonFindExpNameHead);
	}
	createExpNameDropDown(jsonExpNameArr);
}

function getExpenseNamesfromDB(accountHeadId){
	j('#errorMsgArea').children('span').text("");
 if (mydb) {
        //Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM accHeadMst where accHeadId="+accountHeadId, [], getAccHeadList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getOpBudgetNameFromDB(BudgetID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM operationalBudgetMst where id="+BudgetID, [], getOperationalBudgetList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function getBudgetNameFromDB(BudgetID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM budgetMst where id="+BudgetID, [], getBudgetList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

function createBudgetDropDown(jsonBudgetNameArr){
	var jsonBudgetArr = [];
	if(jsonBudgetNameArr != null && jsonBudgetNameArr.length > 0){
		for(var i=0; i<jsonBudgetNameArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonBudgetNameArr[i];
			
			//jsonBudgetArr.push({id: stateArr.Label,name: stateArr.Value});
			jsonBudgetArr.push({id: stateArr.Label,name: stateArr.Value});
		}
	}
		
	j("#Budget").select2({
		data:{ results: jsonBudgetArr, text: 'name' },
		placeholder: "Budget Name",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
			callback(jsonBudgetArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
}

function getBudgetName(){

 	var BudgetID = j("#Budget").select2('data').id;
       getBudgetNameFromDB(BudgetID);
 }

 function createExpNameDropDown(jsonExpNameArr){
	var jsonExpArr = [];
	if(jsonExpNameArr != null && jsonExpNameArr.length > 0){
		for(var i=0; i<jsonExpNameArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonExpNameArr[i];
			jsonExpArr.push({id: stateArr.accHeadId,name: stateArr.acHeadName});
		}
	}
		
	j("#expenseName").select2({
		data:{ results: jsonExpArr, text: 'name' },
		placeholder: "Expense Name",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
			callback(jsonExpArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
}

 function getCcList(transaction, results) {

 var jsonCostCenterArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var ccDetailsJSON = new Object();
       ccDetailsJSON["Label"]=row.costCenterId;
	  ccDetailsJSON ["Value"]=row.costCenterName;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonCostCenterArr.push(ccDetailsJSON);
	 }
	
	createCcDropDown(jsonCostCenterArr)
 }
}

function getCostCenter(){

 	var CcID = j("#costCenter").select2('data').id;
       getCostCenterFromDB(CcID);
 }

function getCostCenterFromDB(CcID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM costCenterMst where id="+CcID, [], getCcList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

 function getLocationList(transaction, results) {

 var jsonLocationArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var LocationDetailsJSON = new Object();

       LocationDetailsJSON["Label"]=row.locationId;
	   LocationDetailsJSON["Value"]=row.locationName;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonLocationArr.push(LocationDetailsJSON);
	 }
	
	createLocationDropDown(jsonLocationArr)
 }
}

function getShipToLocation(){

 	var LocID = j("#shipLocation").select2('data').id;
       getShipToLocationFromDB(LocID);
 }

 function getShipToLocationFromDB(LocID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM locationMst where id="+LocID, [], getLocationList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}

 function getItemList(transaction, results) {

 var jsonitemArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var itemDetailsJSON = new Object();
      itemDetailsJSON ["Label"]=row.itemId;
	  itemDetailsJSON ["Value"]=row.itemName+"--"+row.itemCode;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonitemArr.push(itemDetailsJSON);
	 }
	
	createItemDropDown(jsonitemArr)
 }
}

function createItemDropDown(jsonitemArr){
	var jsonItemArr = [];
	if(jsonitemArr != null && jsonitemArr.length > 0){
		for(var i=0; i<jsonitemArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonitemArr[i];
			
			//jsonBudgetArr.push({id: stateArr.Label,name: stateArr.Value});
			jsonItemArr.push({id: stateArr.Label,name: stateArr.Value});
		}
		
	}
		
	j("#item").select2({
		data:{ results: jsonItemArr, text: 'name' },
		placeholder: "Select Item",
		minimumResultsForSearch: 1,
		initSelection: function (element, callback) {
			callback(jsonItemArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
var itemId = jsonToAppSend["itemId"];	
if (itemId != '' && itemId != '-1' && itemId != '0'){
			j("#item").select2("val", itemId);
		//	j('#orgUnit').select2('data', {id: orgHead, text: frmObj["forUnitName"].value});
	}		
}

function getItemCode(){
 
 	var itemID = j("#item").select2('data').id;
       getItemCodeFromDB(itemID);
       gTypeAheadItemChange();
 }

  function getItemCodeFromDB(itemID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM itemMst where id="+itemID, [], getItemList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}


function getsubZoneList(transaction, results) {

 var jsonsubZoneArr = [];
    if(results!=null){
    	
	 for (i = 0; i < results.rows.length; i++) {
        var row = results.rows.item(i);
        var sunZoneDetailsJSON = new Object();
      sunZoneDetailsJSON ["Label"]=row.subZoneId;
	  sunZoneDetailsJSON ["Value"]=row.subZoneName;
	
		/*jsonFindAccHead["Label"] = row.acHeadId;
		jsonFindAccHead["Value"] = row.acHeadName;
		jsonBudgetNameArr.push(jsonFindAccHead);*/
	jsonsubZoneArr.push(sunZoneDetailsJSON);
	 }
	
	createSubZoneDropDown(jsonsubZoneArr)
 }
}

function createSubZoneDropDown(jsonsubZoneArr){
	var jsonZoneArr = [];
	if(jsonsubZoneArr != null && jsonsubZoneArr.length > 0){
		for(var i=0; i<jsonsubZoneArr.length; i++ ){
			var stateArr = new Array();
			stateArr = jsonsubZoneArr[i];
			
			//jsonBudgetArr.push({id: stateArr.Label,name: stateArr.Value});
			jsonZoneArr.push({id: stateArr.Label,name: stateArr.Value});
		}
	}
		
	j("#subzone").select2({
		data:{ results: jsonZoneArr, text: 'name' },
		placeholder: "SubZone Name",
		minimumResultsForSearch: -1,
		initSelection: function (element, callback) {
			callback(jsonZoneArr[0]);
		},
		formatResult: function(result) {
			if ( ! isJsonString(result.id))
				result.id = JSON.stringify(result.id);
				return result.name;
		}
	}).select2("val","");
}

function getSubZoneName(){

 	var subzoneID = j("#subzone").select2('data').id;
       getSubZoneFromDB(subzoneID);
 }

  function getSubZoneFromDB(subzoneID){
	j('#errorMsgArea').children('span').text("");
	if(mydb) {
 		//Get all the employeeDetails from the database with a select statement, set outputEmployeeDetails as the callback function for the executeSql command
        mydb.transaction(function (t) {
			t.executeSql("SELECT * FROM subZoneMst where id="+subzoneID, [], getsubZoneList);
			//t.executeSql("SELECT * FROM accountHeadMst where id="+opBudgetID, [], getOperationalBudgetList);
		});
    } else {
        alert("db not found, your browser does not support web sql!");
    }	
}
function gTypeAheadItemChange(){
	    var itemId = j("#item").select2('data').id;
		if(!(itemId == 0 || itemId == '')){

		   var jsonToBeSend=new Object();
		    jsonToBeSend["itemId"] = itemId;
			var headerBackBtn=defaultPagePath+'backToHomeStepOneImg.html';
		    var pageRef=defaultPagePath+'addPurchaseReq.html';
			urlPath=window.localStorage.getItem("urlPath");
			j('#loading').show();
		    j.ajax({
		         url: urlPath+"EasyPRItemWebService",
		         type: 'POST',
		         dataType: 'json',
		         crossDomain: true,
		         data: JSON.stringify(jsonToBeSend),
		         success: function(data) {
		        //	 j('#mainHeader').load(headerBackBtn);
		         //    j('#mainContainer').load(pageRef);
		         //    appPageHistory.push(pageRef); 
		             getItemDetail(data);        	
		         },
		         error:function(data) {
				   j('#loading').hide();
		         }
      		});
		}	 
 	}

function getItemDetail(data){
	
			jsonToAppSend["itemId"]=data.itemId;
			jsonToAppSend["itemCode"]=data.itemCode;
			jsonToAppSend["itemName"]=data.itemName;
			jsonToAppSend["itemText"]=data.itemDescription;
			jsonToAppSend["accodeId"]=data.accountCodeId;
			jsonToAppSend["accode"]=data.accountCode;
			jsonToAppSend["acheadId"]=data.accountHeadId;
			jsonToAppSend["achead"]=data.accountHead;
			jsonToAppSend["notionalRate"]=data.notionalRate;
			jsonToAppSend["capexOpex"]=data.capexOrOpex;
			jsonToAppSend["expectedRate"]=data.notionalRate;

			$("#prrate").val(data.notionalRate);
			$("#prquantity").val(1);
	}

function showItemPreview(){
		var date = new Date();
		var month = date.getMonth();
		var curDate = date.getDate();
		var year = date.getFullYear();

		var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

		var currentDate = curDate + "-" + months[(month)] + "-" + year

		document.getElementById("itemBean").value = jsonToAppSend["itemName"]+"--"+jsonToAppSend["itemCode"];
		document.getElementById("prquantityBean").value = jsonToAppSend["prquantity"];
		document.getElementById("prrateBean").value = jsonToAppSend["prrate"];
		document.getElementById("prValueBean").value = jsonToAppSend["prValue"];
		document.getElementById("deliveryDate").value = jsonToAppSend["deliveryDate"];
		document.getElementById("prTitle").value = 'PR/'+currentDate+'/'+ window.localStorage.getItem("EmployeeName");

		document.getElementById("itemBean").disabled = true;
		document.getElementById("prquantityBean").disabled = "true";
}

function validateQuantity(){
	var quantity = document.getElementById("prquantity").value;
if (isNumeric(quantity,"Quantity")== false) {
			document.getElementById("prquantity").value="";
			return false;
		}else{
			return true;
		}
	}

function validateRate(){
	var rate = document.getElementById("prrate").value;
if (isNumeric(rate,"Rate")== false) {
			document.getElementById("prrate").value="";
			return false;
		}else {
			return true;
		}
	}

function isNumeric(object,messageContent) {
	if(isNaN(object)){
		alert(messageContent + " should be numeric.");
	//	object.focus();
		return false;
	}
	else if(object.indexOf('-') != -1){
		alert(messageContent + " should not be negative.");
	//	object.focus();
		return false;
	}
	else if(object.indexOf(' ') != -1){
		alert(messageContent + " should not contain space.");
	//	object.focus();
		return false;
	}
	else {
		return true;
	}
}


