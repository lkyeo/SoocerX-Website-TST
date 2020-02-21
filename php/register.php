<?php
    header("Content-type: text/html; charset=utf-8");
    $username = $_POST['username'];
    $password = $_POST['password'];
    if ($username == '') {
        echo '<script>alert("请输入用户名！");history.go(-1);</script>';
        exit(0);
    }
    if ($password == '') {
        echo '<script>alert("请输入密码");history.go(-1);</script>';
        exit(0);
    }
        $conn = new mysqli('localhost', 'root', 'root', 'soccerx');
        if ($conn->connect_error) {
            echo '数据库连接失败！';
            exit(0);
        } else {
            $sql = "select username from customer where username = '$_POST[username]'";
            $res = mysqli_query($conn,$sql);
            $number = mysqli_num_rows($res);
            if ($number) {
                echo '<script>alert("用户名已经存在");history.go(-1);</script>';
            } else {
                $sql_insert = "insert into customer (username,password) values('$_POST[username]','$_POST[password]')";
                $res_insert = mysqli_query($conn,$sql_insert);
                if ($res_insert) {
                    $sql = "select uid,username from customer where username = '$_POST[username]'";
                    $res = mysqli_query($conn,$sql);
                    $row = mysqli_fetch_row($res);
                    setcookie("uid",$row[0],time()+24*60*60,"/");
                    setcookie("username",$row[1],time()+24*60*60,"/");
                    echo '<script>window.location="../index.html";</script>';
                } else {
                    echo "<script>alert('系统繁忙，请稍候！');</script>";
                }
            }
        }
?>
