<?php
    $username = $_POST["username"];
    $password = $_POST["password"];
    $conn = new mysqli("localhost","root","root","soccerx");
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        exit(0);
    }
    else{
        $sql = "select * from adminaccount where admin_name='$username' and admin_password='$password'";
        $res = mysqli_query($conn,$sql);
        $admin = mysqli_fetch_array($res,MYSQLI_ASSOC);
        $num = mysqli_num_rows($res);
        if(!$num){
            echo '<script>alert("用户名或密码错误！");history.go(-1);</script>';
            exit(0);
        }
        else{
            setcookie("adminname",$admin["admin_name"],time()+24*60*60,'/sccx/');
            echo '<script>window.location="../adminmanage.html";</script>';
        }
    }
?>