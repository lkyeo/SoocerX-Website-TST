<?php
    $order_id = $_GET["order_id"];
    $order_status = $_GET["order_status"];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    }
    else{
        $sql = "UPDATE orderlist SET order_status='$order_status' where order_id='$order_id'";
        $res = mysqli_query($conn,$sql);
        mysqli_close($conn);
    }
?>