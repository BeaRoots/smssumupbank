
	  // This is called with the results from from FB.getLoginStatus().
	  function statusChangeCallback(response) {
		console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
		  // Logged into your app and Facebook.
		  //chamaAPI();
		} else if (response.status === 'not_authorized') {
		  // The person is logged into Facebook, but not your app.
		  document.getElementById('status').innerHTML = 'Please log ' +
			'into this app.';
		} else {
		  // The person is not logged into Facebook, so we're not sure if
		  // they are logged into this app or not.
		  document.getElementById('status').innerHTML = 'Please log ' +
			'into Facebook.';
		}
	  }

	  // This function is called when someone finishes with the Login
	  // Button.  See the onlogin handler attached to it in the sample
	  // code below.
	  function checkLoginState() {
		FB.getLoginStatus(function(response) {
		  statusChangeCallback(response);
		});
	  }

	  window.fbAsyncInit = function() {
	  FB.init({
		appId      : '1583040635248759' /*'851865554858023' '1506578982956256'*/,
		cookie     : true,  // enable cookies to allow the server to access 
							// the session
		xfbml      : true,  // parse social plugins on this page
		version    : 'v3.2' // use version 3.2
	  });

	  // Now that we've initialized the JavaScript SDK, we call 
	  // FB.getLoginStatus().  This function gets the state of the
	  // person visiting this page and can return one of three states to
	  // the callback you provide.  They can be:
	  //
	  // 1. Logged into your app ('connected')
	  // 2. Logged into Facebook, but not your app ('not_authorized')
	  // 3. Not logged into Facebook and can't tell if they are logged into
	  //    your app or not.
	  //
	  // These three cases are handled in the callback function.

	  FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	  });

	  };

	  // Load the SDK asynchronously
	  (function(d, s, id) {
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) return;
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/pt_BR/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	  }(document, 'script', 'facebook-jssdk'));

	  // Here we run a very simple test of the Graph API after login is
	  // successful.  See statusChangeCallback() for when this call is made.
	  function chamaAPI() {
		console.log('Welcome!  Fetching your information.... ');
		FB.api('/me', function(response) {
		  console.log('Successful login for: ' + response.name);
		  //$('#idRedeSocialFacebook').val(response.id);

                  // Marco Civil da Internet
                  var cpfUrl = "/";
                  $.ajax({
                    url        : cpfUrl + "?marcocivil=loginFacebook",
                    async      : false,
                    beforeSend : function( request ) {
                      request.setRequestHeader( "X-PORTOSEGURO-CPF", response.id );
                    },
                    complete   : function( result ) {
                    }
                  });
		  
		  $('#emailRedeSocialFacebook').val(response.email);
		  $('#nomeRedeSocialFacebook').val(response.name);
		  $('#dataNascimentoRedeSocialFacebook').val(response.birthday);
		  chamaIdForBusiness();	
		  //$("#btnFormLoginFacebook").click();
		  tb_show('HAI','#TB_inline?height=1200&width=1200&inlineId=modal-processando&modal=true',null);
		  /*document.getElementById('status').innerHTML =
			'Thanks for logging in, ' + response.name + '!';*/
		});
	  }
	  
	  function chamaIdForBusiness() {
		  FB.api('/me/ids_for_business', function(response) {
			var apps = '';
			for(i=0;i<response.data.length;i++){
				if (apps != '') {
					apps += '|';
				}
				apps += response.data[i].app.id + ',' + response.data[i].id;
			}
			$('#idRedeSocialFacebook').val(apps);
			$("#btnFormLoginFacebook").click();
		});
	  }
	  
	  function realizaLogin(){
	  try{
	  FB.login(function(response) {
	   console.log('statusChangeCallback');
		console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
		  // Logged into your app and Facebook.
		  chamaAPI();
		} else if (response.status === 'not_authorized') {
		  // The person is logged into Facebook, but not your app.
		  //document.getElementById('status').innerHTML = 'Please log ' +
			//'into this app.';
		} else {
		  // The person is not logged into Facebook, so we're not sure if
		  // they are logged into this app or not.
		  //document.getElementById('status').innerHTML = 'Please log ' +
			//'into Facebook.';
		}
	 }, {scope: 'public_profile,email,user_birthday,user_hometown',     // escopos de permissão para acesso.
	 enable_profile_selector:true});
	 }
	 catch(e){
		alert('Erro ao acessar a API do facebook');
	 }
	 }
