<?php
// send_order.php
// إعدادات الإيميل
$to = 'islemhanaxhe49@gmail.com'; // ضع هنا بريدك
$subject = 'طلبية جديدة من المتجر';
$message = "تم استلام طلبية جديدة. التفاصيل في الملف المرفق.";
$headers = "From: noreply@yourdomain.com\r\n";

if (isset($_FILES['order']) && $_FILES['order']['error'] == UPLOAD_ERR_OK) {
    $file_tmp = $_FILES['order']['tmp_name'];
    $file_name = 'order.csv';
    $content = file_get_contents($file_tmp);
    $boundary = md5(time());

    // بناء الرسالة مع المرفق
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=utf-8\r\n\r\n";
    $body .= "$message\r\n";
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: text/csv; name=\"$file_name\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= chunk_split(base64_encode($content));
    $body .= "--$boundary--";

    if (mail($to, $subject, $body, $headers)) {
        echo 'success';
    } else {
        echo 'fail';
    }
} else {
    echo 'fail';
}
?>
