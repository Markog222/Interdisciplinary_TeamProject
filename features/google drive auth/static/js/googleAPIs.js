 
		//Google People & Drive API has to be enabled on the developer console for this to work
		
      // The Browser API key obtained from the Google API Console.
      var developerKey = 'AIzaSyDUyxq1lFFP5dQ9wlnIdota6uTKK8zN3Lo';

      // The Client ID obtained from the Google API Console. Replace with your own Client ID.
      var clientId = '221116015908-iu4t5o8qqtn4t8mq6naoa0v9519mtjg0.apps.googleusercontent.com';

      // Scope to use to access user's photos.
      var scope = 'https://www.googleapis.com/auth/drive';

      var pickerApiLoaded = false;
	  var idLoaded = false;
      var oauthToken;
	  var fileId;

      // Use the API Loader script to load google.picker and gapi.auth.
      function onApiLoad() {
        gapi.load('auth2', onAuthApiLoad);
        gapi.load('picker', onPickerApiLoad);
		gapi.load('client', printfile);
      }

      function onAuthApiLoad() {
        var authBtn = document.getElementById('auth');
        authBtn.disabled = false;
        authBtn.addEventListener('click', function() {
          gapi.auth2.authorize({
            client_id: clientId,
            scope: scope
          }, handleAuthResult);
        });
      }

      function onPickerApiLoad() {
        pickerApiLoaded = true;
        createPicker();
      }

      function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
          createPicker();
        }
      }

      // Create and render a Picker object for picking user Photos.
      function createPicker() {
        if (pickerApiLoaded && oauthToken) {
          var picker = new google.picker.PickerBuilder().
              addView(google.picker.ViewId.DOCS_IMAGES).
			  addView(new google.picker.DocsUploadView()).
              setOAuthToken(oauthToken).
              setDeveloperKey(developerKey).
              setCallback(pickerCallback).
              build();
          picker.setVisible(true);
        }
      }
	  
	  function shareSuccess(res){
		console.log(res)
	  }
	  
	  function shareFile(fileId, callback) {
	   var url = 'https://www.googleapis.com/drive/v3/files/'+fileId+'/permissions'
		  if (fileId) {
			
			var permissions = 
			{"resource":{  
			   "permission":{  
				  "type":"anyone",
				  "role":"reader"
			   }
			}};
			  
			  var jPer = JSON.stringify(permissions);
				//console.log(permissions.permission.type);
			//var jPer = JSON.parse(permissions);
		  // https://stackoverflow.com/questions/32322772/google-drive-api-changing-owner-of-a-file-permissions-error-400-permission
			console.log(oauthToken);
			var xhr = new XMLHttpRequest();
			xhr.open('POST', url);
			xhr.setRequestHeader('Authorization', 'Bearer ' + oauthToken);
			xhr.setRequestHeader('Content-Type','application/json');
			xhr.onload = function() {
			  callback(xhr.responseText);
			};
			xhr.onerror = function() {
			  callback(null);
			};
			//xhr.send();
			xhr.send(JSON.stringify({  
				  "type":"anyone",
				  "role":"reader"
			   }));
			//xhr.send(permissions);
		  } else {
			callback(null);
		  }
		}
	
      // A simple callback implementation.
      function pickerCallback(data) {
        var url = 'nothing';
        if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
          var doc = data[google.picker.Response.DOCUMENTS][0];
          url = doc[google.picker.Document.URL];
		  fileId = data.docs[0].id;
		  idLoaded = true;
		  var url = "https://drive.google.com/uc?export=view&id="+fileId;
		  shareFile(fileId, shareSuccess);
        }
		
        var message = 'You picked: ' + url;
        document.getElementById('result').innerHTML = message;
		document.getElementById('display').src = url;
      }