<?php
    //首先判断一用户是否登录，若没有登录将无法添加购物车
    if(!isset($_COOKIE["uid"])){
        echo '<script>alert("请先登录");history.go(-1);</script>';
        exit(0);
    }
    $uid = $_COOKIE["uid"];
    $str = $_SERVER['HTTP_REFERER'];
    $str = preg_replace('/.*\//','',$str);
    if($str){
        preg_match("/\d+/is",$str,$v);
    }
    $itemid = @$v[0];
    if(isset($_POST["size"])){
        $size = $_POST["size"];
    }else{
        $size = "";
    }

    $conn = new mysqli('localhost','root','root','soccerx');
    if($conn->connect_error){
        echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        exit(0);
    }
    else{
        $sql = "select * from cart where itemid='$itemid' and uid='$uid' and size='$size'";
        $res = mysqli_query($conn,$sql);
        $num = mysqli_num_rows($res);
        $row = mysqli_fetch_array($res,MYSQLI_ASSOC);
        //判断购物车中是否已经存在同一码数的该产品
        if($num){               
            $total = $row["total"];
            $count = $row["count"];
            echo $count;
            if($count>=6){
                echo "<script>alert('同一码数最大购买数量不能超过6');history.go(-1);</script>";             //count最大值为6
                exit(0);
            }else{
                $price = $total / $count;
                $count ++;
                $total += $price;
                $id = $row["id"];
                $sqlUpdate = "update cart set count='$count',total='$total' where id='$id'";
                $res = mysqli_query($conn,$sqlUpdate);
                if($res){
                    echo "<script>alert('添加购物车成功！');history.go(-1);</script>";
                    exit(0);
                }else{
                    echo "<script>alert('操作数据库失败！');history.go(-1);</script>";
                    exit(0);
                }
            }
        }else{
            $sql = "select price from items where itemid='$itemid'";
            $res = mysqli_query($conn,$sql);
            $total = mysqli_fetch_row($res)[0];
            $sqlAdd = "insert into cart(itemid,size,count,uid,total) values ('$itemid','$size','1','$uid','$total')";
            $res = mysqli_query($conn,$sqlAdd);
            if($res){
                echo "<script>alert('添加购物车成功！');history.go(-1);</script>";
                exit(0);
            }else{
                echo "<script>alert('操作数据库失败！');history.go(-1);</script>";
                exit(0);
            }
        }
        mysqli_close($conn);
    }

?>
