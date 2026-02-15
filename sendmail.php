<?php
// ---- Grundinställningar ----
$to = "timmy.larsson@hotmail.com";       // Mottagare (företaget)
$from_address = "timmy.larsson@hotmail.com"; // Avsändaradress på er domän (för SPF/DKIM)
$subject = "Ny offertförfrågan via webbplatsen";

// Hjälpfunktion för sanering
function clean($v) {
  return trim(filter_var($v, FILTER_SANITIZE_FULL_SPECIAL_CHARS));
}

// Bara POST tillåts
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  header("Location: /", true, 303);
  exit;
}

// Honeypot – om ifylld => avbryt tyst
if (!empty($_POST['website'])) {
  header("Location: thank-you.html", true, 303);
  exit;
}

// Plocka värden + validera
$name  = clean($_POST['name'] ?? '');
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone = clean($_POST['phone'] ?? '');
$zip   = clean($_POST['zip'] ?? '');
$area  = clean($_POST['area'] ?? '');
$frequency = clean($_POST['frequency'] ?? '');
$when  = clean($_POST['when'] ?? '');
$message = clean($_POST['message'] ?? '');
$rut   = isset($_POST['rut']) ? 'Ja' : 'Nej';
$services = $_POST['services'] ?? [];

$errors = [];
if (!$name)               { $errors[] = "Namn saknas"; }
if (!$email)              { $errors[] = "Ogiltig e-post"; }
if (!$phone)              { $errors[] = "Telefon saknas"; }
if (!$zip)                { $errors[] = "Postnummer saknas"; }
if (empty($services))     { $errors[] = "Minst en tjänst måste väljas"; }

// Vid fel -> skicka tillbaka till en enkel felsida
if (!empty($errors)) {
  header("Location: error.html", true, 303);
  exit;
}

// Sätt ihop e-posttext
$services_str = is_array($services) ? implode(", ", array_map('clean', $services)) : clean($services);

$body_company =
"Ny offertförfrågan via webbplatsen\n\n".
"Tjänster: $services_str\n".
"Postnummer: $zip\n".
"Yta: $area m²\n".
"Frekvens: $frequency\n".
"Önskat datum/tid: $when\n".
"Meddelande: $message\n\n".
"Namn: $name\n".
"E-post: $email\n".
"Telefon: $phone\n".
"RUT-avdrag: $rut\n".
"IP: ".($_SERVER['REMOTE_ADDR'] ?? 'okänd')."\n".
"Datum: ".date('Y-m-d H:i');

// Headers till företaget
$headers_company  = "From: $from_address\r\n";
$headers_company .= "Reply-To: $email\r\n";
$headers_company .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Skicka till företaget
$ok1 = @mail($to, $subject, $body_company, $headers_company);

// Skicka kopia till kunden
$subject_customer = "Tack! Vi har tagit emot din förfrågan – Städ da´X AB";
$body_customer =
"Hej $name,\n\n".
"Tack för din förfrågan! Vi återkommer så snart vi kan.\n\n".
"Du skickade:\n".
"- Tjänster: $services_str\n".
"- Postnummer: $zip\n".
"- Yta: $area m²\n".
"- Frekvens: $frequency\n".
"- Önskat datum/tid: $when\n".
"- Meddelande: $message\n\n".
"Kontaktuppgifter:\n".
"- Namn: $name\n".
"- Telefon: $phone\n".
"- E-post: $email\n".
"- RUT-avdrag: $rut\n\n".
"Med vänlig hälsning,\n".
"Städ da´X AB\n".
"E-post: info@stad-dax.com\n".
"Telefon städtjänster: 072-565 22 06\n".
"Skadedjur: 072-565 22 07";

$headers_customer  = "From: Städ da´X AB <{$from_address}>\r\n";
$headers_customer .= "Reply-To: $to\r\n";
$headers_customer .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok2 = @mail($email, $subject_customer, $body_customer, $headers_customer);

// Oavsett kopian, om företagsmejlet gick iväg: redirect till tack-sida
if ($ok1) {
  header("Location: thank-you.html", true, 303);
  exit;
}

// Om det blev fel att skicka till företaget -> fel-sida
header("Location: error.html", true, 303);
exit;
