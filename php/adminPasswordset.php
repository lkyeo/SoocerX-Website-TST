<?php
    $admin_name = $_COOKIE["adminname"];
    $admin_password=$_POST["admin_password"];
    $conn = new mysqli('localhost','root','root','soccerx');
    if ($conn->connect_error){
        echo '数据库连接失败！';
        exit(0);
    }else{
        $sql = "UPDATE adminaccount SET admin_password='$admin_password' WHERE admin_name='$admin_name'";
        $res = mysqli_query($conn,$sql);
        if($res){
            echo "<script>alert('修改成功！');history.go(-1);</script>";
        }else{
            echo "<script>alert('数据库操作失败！');history.go(-1);</script>";
        }
    }    

?>