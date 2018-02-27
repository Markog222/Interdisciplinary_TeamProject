
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
      }

      function onAuthApiLoad() {
        //var authBtn = document.getElementById('auth');
        var imgBtn = document.getElementById('imageBtn');
        var slideBtn = document.getElementById('slideBtn');
        console.log(slideBtn);
        slideBtn.disabled = false;
        imgBtn.disabled = false;

        slideBtn.addEventListener('click', function() {
          console.log('slide click')
          gapi.auth2.authorize({
            client_id: clientId,
            scope: scope
          }, handleSlideAuthResult);
        });

        imgBtn.addEventListener('click', function() {
          console.log('img click')
          gapi.auth2.authorize({
            client_id: clientId,
            scope: scope
          }, handleImgAuthResult);
        });


      }

      function onPickerApiLoad() {
        pickerApiLoaded = true;
        console.log("Google Type: "+$google_type)
        if($google_type == 'image') {
          createPicker();
        } else  if($google_type == 'slide') {
          console.log('slidepicker');
          createSlidePicker();
        }
      }

      function handleImgAuthResult(authResult) {
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
          console.log("Google Type: "+$google_type)
          createPicker();
        }
      }

      function handleSlideAuthResult(authResult) {
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
          console.log("Google Type: "+$google_type)
          createSlidePicker();
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

      // Create and render a Picker object for picking user Photos.
      function createSlidePicker() {
        if (pickerApiLoaded && oauthToken) {
          var picker = new google.picker.PickerBuilder().
              addView(google.picker.ViewId.PRESENTATIONS).
              addView(new google.picker.DocsUploadView()).
              setOAuthToken(oauthToken).
              setDeveloperKey(developerKey).
              setCallback(pickerCallback).
              build();
          picker.setVisible(true);
        }
      }

    //Success callback function
	  function shareSuccess(res){
		    console.log(res)
	  }

    //Function to share the file with anyone who has the link
    //File is unlisted and cannot be found by searching
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

      /*
       * @reference: https://stackoverflow.com/questions/32322772/google-drive-api-changing-owner-of-a-file-permissions-error-400-permission
       */
      var jPer = JSON.stringify(permissions);

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
      if($google_type == 'image'){
		    url = "https://drive.google.com/uc?export=view&id="+fileId;
      } else {
        url = 'https://docs.google.com/presentation/d/'+fileId+'/preview?start=true&loop=false&delayms=200'
      }
		  shareFile(fileId, shareSuccess);
      addNew($google_type,url);
        }
      }
