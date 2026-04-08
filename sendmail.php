<?php
// ---- Grundinställningar ----
$to = "info@stad-dax.com";           // Mottagare (företaget)
$from_address = "info@stad-dax.com"; // Avsändaradress på er domän
$subject = "Ny offertförfrågan via webbplatsen";

// Uppdaterad hjälpfunktion för e-postvänlig sanering
function clean($v) {
    // Vi använder strip_tags för att få bort HTML, men behåller svenska tecken intakta
    return trim(strip_tags($v));
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
$name      = clean($_POST['name'] ?? '');
$email     = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$phone     = clean($_POST['phone'] ?? '');
$location  = clean($_POST['Ort'] ?? ''); 
$area      = clean($_POST['area'] ?? '');
$frequency = clean($_POST['frequency'] ?? '');
$when      = clean($_POST['start_date'] ?? ''); 
$message   = clean($_POST['message'] ?? '');
$services  = $_POST['services'] ?? [];

$errors = [];
if (!$name)      { $errors[] = "Namn saknas"; }
if (!$email)     { $errors[] = "Ogiltig e-post"; }
if (!$phone)     { $errors[] = "Telefon saknas"; }
if (!$location)  { $errors[] = "Ort saknas"; }
if (empty($services)) { $errors[] = "Minst en tjänst måste väljas"; }

// Vid fel -> skicka tillbaka till en enkel felsida
if (!empty($errors)) {
    header("Location: error.html", true, 303);
    exit;
}

// Sätt ihop e-posttext (Nu utan HTML-entiteter)
$services_str = is_array($services) ? implode(", ", array_map('clean', $services)) : clean($services);

$body_company =
"Ny offertförfrågan via webbplatsen\n\n".
"Tjänster: $services_str\n".
"Ort: $location\n".
"Yta: $area m²\n".
"Frekvens: $frequency\n".
"Önskat datum/tid: $when\n".
"Meddelande: $message\n\n".
"Namn: $name\n".
"E-post: $email\n".
"Telefon: $phone\n".
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
"- Ort: $location\n".
"- Yta: $area m²\n".
"- Frekvens: $frequency\n".
"- Önskat datum/tid: $when\n".
"- Meddelande: $message\n\n".
"Kontaktuppgifter:\n".
"- Namn: $name\n".
"- Telefon: $phone\n".
"- E-post: $email\n\n".
"Med vänlig hälsning,\n".
"Städ da´X AB\n".
"E-post: info@stad-dax.com\n".
"Telefon städtjänster: 072-565 22 06\n".
"Skadedjur: 072-565 22 07";

$headers_customer  = "From: Städ da´X AB <{$from_address}>\r\n";
$headers_customer .= "Reply-To: $to\r\n";
$headers_customer .= "Content-Type: text/plain; charset=UTF-8\r\n";

$ok2 = @mail($email, $subject_customer, $body_customer, $headers_customer);

// Redirect till tack-sida
if ($ok1) {
    header("Location: thank-you.html", true, 303);
    exit;
}

header("Location: error.html", true, 303);
exit;