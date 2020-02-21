<?php
    $id = $_GET['id'];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        exit(0);
    }
    else{
        $sql = "delete from cart where id='$id'";
        $res = mysqli_query($conn,$sql);
        mysqli_close($conn);
    }
    
?>