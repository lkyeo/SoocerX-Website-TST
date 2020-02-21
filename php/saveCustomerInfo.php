<?php
    $uid = $_COOKIE["uid"];
    $name = $_POST["name"];
    $address = $_POST["address"];
    $phone = $_POST["phone"];
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    }
    else{
        $sql = "update customer set name='$name',address='$address',phone='$phone' where uid='$uid'";
        $res = mysqli_query($conn,$sql);
        if($res){
            echo "<script>alert('修改成功！');window.location='../user.html';</script>";
        }else{
            echo "<script>alert('修改失败！');history.go(-1);</script>";
        }
        mysqli_close($conn);
    }

?>