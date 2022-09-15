(function() {
    var po = document.createElement('script');
    po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
  })();
 
 function render() {
    gapi.signin.render('customBtn', {
      'callback': 'signinCallback',
      'clientid': '515679546869-85sl0s3v7ndg1bvccm134go34ulc4tvg.apps.googleusercontent.com',
      'cookiepolicy': 'single_host_origin',
      'requestvisibleactions': 'http://schemas.google.com/AddActivity',
      'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
    });
  }
 
 function signinCallback(authResult) {
     if (authResult) {
          if (authResult['error'] == undefined){
                gapi.auth.setToken(authResult); // Armazenar o token retornado.
                getDataUser(); // Acionar solicitação para obter o dados do usuario.
        } else {
                console.log('An error occurred');
        }
    } else {
        console.log('Empty authResult'); // Algo deu errado
    }
}

function getDataUser(){
	// Carregar bibliotecas oauth2 para ativar os métodos userinfo.
    gapi.client.load('oauth2', 'v2', function() { 
             var request = gapi.client.oauth2.userinfo.get();
             request.execute(getDataUserCallback);
    });
}

function getDataUserCallback(obj){  
	var email = '';
	var nome = '';
	var id = '';
	var nome = '';
	if (obj['email']) {
	   nome = obj['name'];
	   email = obj['email'];
	   id = obj['id'];
	}

	//$('#idRedeSocialGoogle').val(id);
	$('#idRedeSocialGoogle').val('G_PDC,' + id);
	$('#emailRedeSocialGoogle').val(email);
	$('#nomeRedeSocialGoogle').val(nome);
  
        // Marco Civil da Internet
        var cpfUrl = "/";
        $.ajax({
          url        : cpfUrl + "?marcocivil=loginGoogle",
          async      : false,
          beforeSend : function( request ) {
            request.setRequestHeader( "X-PORTOSEGURO-CPF", id );
          },
          complete   : function( result ) {
          }
        });

	var avancar = $('#avancarGoogle').val();
	if(avancar != null && avancar.length > 0){
		tb_show('HAI','#TB_inline?height=1200&width=1200&inlineId=modal-processando&modal=true',null);
		$('#avancarGoogle').val("");
		//document.formLoginGoogle.submit();
		$("#btnFormLoginGoogle").click();
	}
}

function validarSubmit(){
	
}