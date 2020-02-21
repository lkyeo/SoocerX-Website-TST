<?php
    $oid = $_GET['oid'];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        exit(0);
    }
    else{
        $sql = "delete from orderlist where order_id='$oid'";
        $res = mysqli_query($conn,$sql);
        if($res){
            $sql = "delete from orderdetail where oid='$oid'";
            $res = mysqli_query($conn,$sql);
        }
        mysqli_close($conn);
    }
    
?>