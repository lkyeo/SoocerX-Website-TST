<?php
$uid = $_COOKIE["uid"];
// $itemid = $_GET["itemid"];
$conn = new mysqli('localhost','root','root','soccerx');
if($conn->connect_error){
    echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
    exit(0);
}
else{
    $sql = "select * from cart where uid='".$uid."' ";
    $res = mysqli_query($conn,$sql);
    $num = mysqli_num_rows($res);
    $rows = mysqli_fetch_all($res,MYSQLI_ASSOC);
    $str = json_encode($rows);
    echo $str;
}
?>