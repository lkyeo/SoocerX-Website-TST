<?php
    $uid = $_COOKIE['uid'];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    }
    else{
        $sql = "select * from customer where uid='$uid'";
        $res = mysqli_query($conn,$sql);
        $row = mysqli_fetch_array($res,MYSQLI_ASSOC);
        $str = json_encode($row,JSON_UNESCAPED_UNICODE);
        echo $str;
    }
?>