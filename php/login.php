<?php
header("Content-type: text/html; charset=utf-8");
$username = $_POST['username'];
$password = $_POST['password'];
$conn = new mysqli('localhost','root','root','soccerx');
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
    $sql = "select uid,username,password from customer where username = '$_POST[username]' and password = '$_POST[password]'";
    $res = mysqli_query($conn,$sql);
    $row = mysqli_fetch_row($res);
    $number = mysqli_num_rows($res);
    if ($number) {
        setcookie("uid",$row[0],time()+24*60*60,'/sccx/');
        setcookie("username",$row[1],time()+24*60*60,'/sccx/');
        // echo $_COOKIE["username"];
        echo '<script>window.location="../index.html";</script>';
    } else {
        echo '<script>alert("用户名或密码错误！");history.go(-1);</script>';
    }
}
?>