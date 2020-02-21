<?php
    $order_id = $_GET["order_id"];
    $order_name = $_GET["order_name"];
    $order_address = $_GET["order_address"];
    $order_phone = $_GET["order_phone"];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    }
    else{
        $sql = "update orderlist set order_name='$order_name',order_address='$order_address',order_phone='$order_phone' where order_id='$order_id'";
        $res = mysqli_query($conn,$sql);
        mysqli_close($conn);
    }
?>