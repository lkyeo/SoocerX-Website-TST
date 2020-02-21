<?php
    $uid = $_COOKIE["uid"];
    $id = $_GET["id"];
    $size = $_GET["size"];
    $count = $_GET["count"];
    $total = $_GET["total"];
    // $id = 1;
    // $size = "L";
    // $count = 5;
    // $total = 2995;
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    }
    else{
        $sql = "update cart set size='$size',count='$count',total='$total' where id='$id'";
        $res = mysqli_query($conn,$sql);
        mysqli_close($conn);
    }
?>