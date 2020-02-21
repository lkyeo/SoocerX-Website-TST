<?php
    if(!isset($_COOKIE["uid"])){
        echo "<script>alert('登录信息被清除无法结算');history.go(-1);</script>";
        exit(0);
    }else{
        $uid = $_COOKIE["uid"];
    }
    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        exit(0);
    }
    else{
        $sql = "select * from cart where uid='$uid'";
        $res = mysqli_query($conn,$sql);
        $num = mysqli_num_rows($res);
        if($num){
            $order_status = "未发货";
            $order_summary = 0;
            $sqlCheckAddress = "select * from customer where uid='$uid'";
            $resCA = mysqli_query($conn,$sqlCheckAddress);
            $rowCA = mysqli_fetch_array($resCA,MYSQLI_ASSOC);
            if(!$rowCA["name"]){
                echo "<script>alert('你还没有填写收货人姓名');history.go(-1);</script>";
                exit(0);
            }else{
                $order_name = $rowCA["name"];
            }
            if(!$rowCA["address"]){
                echo "<script>alert('你还没有填写收货人地址');history.go(-1);</script>";
                exit(0);
            }else{
                $order_address = $rowCA["address"];
            }
            if(!$rowCA["phone"]){
                echo "<script>alert('你还没有填写收货人电话');history.go(-1);</script>";
                exit(0);
            }else{
                $order_phone = $rowCA["phone"];
            }
            for ($i = 0 ; $i < $num ; $i++){
                $row = mysqli_fetch_array($res,MYSQLI_ASSOC);
                $order_summary += $row["total"];
            }
            $sqlAdd = "insert into orderlist(order_summary,order_name,order_address,order_phone,order_status,uid) values('$order_summary','$order_name','$order_address','$order_phone','$order_status','$uid')";
            $resAdd = mysqli_query($conn,$sqlAdd);
            $oid = mysqli_insert_id($conn);
            $res2 = mysqli_query($conn,$sql);        
            for ($i = 0 ; $i < $num ; $i++){
                $row = mysqli_fetch_array($res2,MYSQLI_ASSOC);
                $item_id = $row["itemid"];
                $item_size = $row["size"];
                $item_count = $row["count"];
                $item_total = $row["total"];
                $sqlAddDet = "insert into orderdetail(oid,item_id,item_size,item_count,item_total) values ('$oid','$item_id','$item_size','$item_count','$item_total')";
                $resAddDet = mysqli_query($conn,$sqlAddDet);
            }
            $clearCart = "delete from cart where uid='$uid'";
            $rescCart = mysqli_query($conn,$clearCart);
            if($rescCart){
                echo "<script>alert('成功提交订单，可以到我的订单页面查看更多信息！');window.location='../index.html';</script>";
                
            }else{
                echo "<script>alert('操作数据库失败！');history.go(-1);</script>";
                exit(0);
            }
        }else{
            echo "<script>alert('买点东西吧！');history.go(-1);</script>";
        }
    }



?>