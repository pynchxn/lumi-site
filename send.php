<?php
/* ============================================================
   LUMI — form delivery
   The booking modal and the contact form both post here.

   Nothing is stored: this reads a POST, sends one email, and
   answers with JSON. There's no database and no third party.
   Josh replies straight from his inbox — Reply-To is set to the
   visitor, so hitting reply reaches them.

   No email is sent to the visitor. Mail from a shared host out
   to arbitrary domains is the part that lands in spam; mail to
   a mailbox on this same domain is delivered locally. Keeping
   it one-way is deliberate.

   Deliberately NOT rate limited. That means state on disk, for
   a site running a handful of nights a year — the honeypot and
   the validation below are the proportionate answer. If this
   ever gets hammered, that's the decision to revisit.

   Needs PHP. Confirm it's enabled in the Fasthosts control
   panel — if it isn't, the forms show an error naming the
   booking address rather than failing quietly.
   ============================================================ */

/* First, before anything can print. A single PHP notice echoed ahead of
   the JSON body makes the browser's r.json() reject, and every submission
   then looks like a network failure to the visitor. Errors go to the
   host's log, never into the response. */
ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

/* Must be a real mailbox on this domain. A From address the domain
   doesn't own is what gets a message filed as spam. */
const FROM     = 'bookings@dineatlumi.co.uk';
const BOOKINGS = 'bookings@dineatlumi.co.uk';
const HELLO    = 'hello@dineatlumi.co.uk';

/* Contact routing. The subject options in contact.html have no value
   attributes, so what arrives is the label text — copy Josh may reword.
   Matching the word "booking" anywhere survives a reword; an exact
   comparison would silently start sending everything to hello@.
   Anything unmatched goes to hello@, which is the safe default. */
const BOOKING_WORD = 'booking';

function reply($ok, $msg = null) {
  echo json_encode($msg === null ? ['ok' => $ok] : ['ok' => $ok, 'msg' => $msg]);
  exit;
}

function fail($msg, $code = 400) {
  http_response_code($code);
  reply(false, $msg);
}

/* Anything that ends up in a mail header goes through this first.
   A newline in a header lets someone append headers of their own —
   a Bcc, a second recipient — and turns this into an open relay.
   Strip CR, LF and NUL, then cap the length. */
function header_safe($v, $max = 200) {
  $v = str_replace(["\r", "\n", "\0"], ' ', (string) $v);
  return mb_substr(trim($v), 0, $max);
}

/* Builds the Reply-To value. Two cases, and they can't be combined:

   Plain ASCII gets quoted. Stripping the newlines above already stops
   header injection, but it leaves the rest of the attempt sitting in the
   name as literal text — colons and @ signs and all — and an unquoted
   display name containing those is malformed under RFC 5322.

   Anything non-ASCII (Síle, Müller, ...) has to be an RFC 2047 encoded
   word instead, which must NOT be wrapped in quotes — quoted, it arrives
   as literal =?UTF-8?B?… gibberish rather than being decoded. Encoding
   covers the specials too, so it needs no quoting of its own.

   No mbstring and a non-ASCII name: drop the display name and send the
   bare address. Josh still sees it spelled properly in the body, and a
   raw 8-bit header is the one outcome worth avoiding. */
function reply_to($name, $email) {
  if ($name === '') return $email;
  if (preg_match('/[\x80-\xFF]/', $name)) {
    return function_exists('mb_encode_mimeheader')
      ? mb_encode_mimeheader($name, 'UTF-8', 'B') . " <$email>"
      : $email;
  }
  return '"' . str_replace(['\\', '"'], ['\\\\', '\\"'], $name) . "\" <$email>";
}

/* Body fields keep their line breaks — they never touch a header. */
function body_safe($v, $max = 2000) {
  $v = str_replace("\0", '', (string) $v);
  return mb_substr(trim($v), 0, $max);
}

/* Subject lines carry event titles, which may not be ASCII.
   mb_encode_mimeheader is in mbstring, which is on virtually every
   host, but fall back rather than fataling if it's absent. */
function encode_subject($s) {
  return function_exists('mb_encode_mimeheader')
    ? mb_encode_mimeheader($s, 'UTF-8', 'B')
    : $s;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  fail('This address only accepts form submissions.', 405);
}

/* Honeypot. A real visitor never sees this field, so anything in it
   came from a bot. Answer with success — a bot that can tell it was
   caught is a bot that comes back with the field left empty. */
if (trim($_POST['company'] ?? '') !== '') {
  reply(true);
}

$form  = $_POST['form']  ?? '';
$name  = header_safe($_POST['name']  ?? '', 100);
$email = header_safe($_POST['email'] ?? '', 200);

if ($name === '')  fail('Add your name and I\'ll know who I\'m writing back to.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  fail('That email doesn\'t look right — check it and try again.');
}

if ($form === 'booking') {
  $to      = BOOKINGS;
  $event   = header_safe($_POST['event'] ?? '', 200);
  $diet    = body_safe($_POST['diet'] ?? '', 1000);
  /* An integer, not free text — it's read at a glance in the inbox and
     shouldn't be able to carry anything else. */
  $seats   = filter_var($_POST['seats'] ?? '', FILTER_VALIDATE_INT,
                        ['options' => ['min_range' => 1, 'max_range' => 12]]);
  if ($seats === false) fail('Pick how many seats you\'d like.');
  $subject = 'Booking request — ' . ($event !== '' ? $event : 'a Lumi night');
  $body    = "A seat request came in from the website.\n\n"
           . "Night:  " . ($event !== '' ? $event : '(not recorded)') . "\n"
           . "Seats:  $seats\n"
           . "Name:   $name\n"
           . "Email:  $email\n\n"
           . "Allergies or dietary requirements:\n"
           . ($diet !== '' ? $diet : 'None given.') . "\n\n"
           . "-- \nReply to this message and it goes straight to them.\n"
           . "Nothing is booked or paid for until you confirm it.\n";

} elseif ($form === 'contact') {
  /* Routing comes from the subject dropdown: a question about an
     existing seat goes to bookings@, everything else to hello@.
     Decided here, never taken from the request — a recipient the caller
     can set is an open relay. */
  $subjectPick = header_safe($_POST['subject'] ?? '', 100);
  $to          = stripos($subjectPick, BOOKING_WORD) !== false ? BOOKINGS : HELLO;
  $message     = body_safe($_POST['message'] ?? '', 5000);
  $subject     = 'Website enquiry — ' . ($subjectPick !== '' ? $subjectPick : 'no subject given');
  $body        = "A message came in from the contact form.\n\n"
               . "About:  " . ($subjectPick !== '' ? $subjectPick : '(not given)') . "\n"
               . "Name:   $name\n"
               . "Email:  $email\n\n"
               . "Message:\n"
               . ($message !== '' ? $message : '(no message written)') . "\n\n"
               . "-- \nReply to this message and it goes straight to them.\n";

} else {
  fail('Something went wrong sending that.');
}

if (!function_exists('mail')) {
  fail('Couldn\'t send that just now. Email ' . $to . ' directly and it\'ll get sorted.', 500);
}

/* Array form, supported since PHP 7.2. PHP validates these itself and
   refuses any value containing a newline — a second line of defence
   behind header_safe(), for free.

   Quoted-printable on the body because the caps above allow a message
   longer than the 998 characters a single line may contain, and a diet
   note or a paragraph pasted without line breaks would otherwise be a
   malformed message. It handles the UTF-8 at the same time. */
$headers = [
  'From'                      => 'Lumi website <' . FROM . '>',
  'Reply-To'                  => reply_to($name, $email),
  'MIME-Version'              => '1.0',
  'Content-Type'              => 'text/plain; charset=UTF-8',
  'Content-Transfer-Encoding' => 'quoted-printable',
];
$body = quoted_printable_encode($body);

/* The 5th argument sets the envelope sender. Without it the envelope
   is the server default (www-data@some-fasthosts-box), which doesn't
   match the From domain and reads as forged. Some shared hosts refuse
   the flag and make mail() fail outright, so retry without it rather
   than losing the message. */
$sent = @mail($to, encode_subject($subject), $body, $headers, '-f' . FROM);
if (!$sent) {
  $sent = @mail($to, encode_subject($subject), $body, $headers);
}

if (!$sent) {
  fail('Couldn\'t send that just now. Email ' . $to . ' directly and it\'ll get sorted.', 500);
}

reply(true);
