<?php
header("Content-type: text/html; charset=utf-8");
$username = 'test';
$password = 't';
$conn = new mysqli('localhost','root','','soccerx');
if ($conn->connect_error){
    echo '数据库连接失败！';
    exit(0);
}else{
    if ($username == ''){
        echo '<script>alert("请输入用户名！");history.go(-1);</script>';
        exit(0);
    }
    if ($password == ''){
        echo '<script>alert("请输入密码！");history.go(-1);</script>';
        exit(0);
    }
    $sql = "select uid,username,password from customer where username = '$username' and password = '$password'";
    $res = mysqli_query($conn,$sql);
    $row = mysqli_fetch_row($res);
    echo $row[1];
    $number = mysqli_num_rows($res);
    if ($number) {
//        setcookie("uid",,time()+24*60*60);
//        echo '<script>window.location="../index.html";</script>';
    } else {
        echo '<script>alert("用户名或密码错误！");history.go(-1);</script>';
    }
}
?>