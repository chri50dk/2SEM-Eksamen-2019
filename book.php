<?php
$errors = '';
$myemail = 'kontakt@viktorkjeldal.dk';//<-----Put Your email address here.
if(empty($_POST['name'])  ||
 empty($_POST['email']) ||
 empty($_POST['phone']) ||
 empty($_POST['contact_type']) ||
 empty($_POST['request']))
{
    $errors .= "\n Error: all fields are required";
}

$name = $_POST['name'];
$email_address = $_POST['email'];
$phone = $_POST['phone'];
$contact_type = $_POST['contact_type'];
$business = $_POST['business'];
$venue = $_POST['venue'];
$request = $_POST['request'];

if (!preg_match(
"/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i", $email_address))
{
    $errors .= "\n Error: Invalid email address";
}

if( empty($errors))
{
	$to = $myemail;
	$email_subject = "$contact_type fra hjemmeside fra: $name";

	$email_body = "Ny besked fra:

    Navn: $name
    E-mail: $email_address
    Tel: $phone
    $contact_type
    Navn på virksomhed: $business
    Venue: $venue

    $request \n\n".

	$headers = "From: $email_address\n";
	$headers .= "Reply-To: $email_address";



	mail($to,$email_subject,$email_body, $headers);
	//redirect to the 'thank you' page

    header('Location: thanks.html');
}


?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//DA" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <title>Contact form handler</title>
</head>

<body>
    <!-- This page is displayed only if there is some error -->
    <?php
echo nl2br($errors);
?>


</body>

</html>
