<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>俱乐部球衣-SoccerX足球装备网</title>
    <link rel="stylesheet" href="../css/content.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" integrity="sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf" crossorigin="anonymous">
    <script type="text/javascript" src="../javascript/wrCookies.js"></script>
    <?php
        $text = $_POST['search'];
        if($text==""){
            echo "<script>alert('搜索不能为空');history.go(-1);</script>";
        }
        $conn = new mysqli('localhost','root','root','soccerx');
        if($conn->connect_error){
            echo '<script>alert("数据库连接失败")；history.go(-1);</script>';
        }
        else{
        $sql = "select * from items where name like '%$text%' or information like '%$text%'";
        $res = mysqli_query($conn,$sql);
        $num = mysqli_num_rows($res);
       }
    ?>
</head>
<body>
<div class="topbar">
    <div class="logo">
        <a href="../index.html">
            <img src="../img/logo.png" width="140px" height="40px">
        </a>
    </div>
    <div class="userarea">
        <script>
                var username = "";
                username = readCookie("username");
                if(username != ""){
                    document.write("<a href=\"../user.php\">欢迎你，"+ username + "</a>");
                }
                else{
                    document.write("<a href=\"../login.html\">加入/登录SoccerX账号</a>")
                }
        
                document.write("<a href=\"\">购物车</a>");
        </script>
    </div>
</div>
<div class="header">
    <div class="navbar">
        <ul>
            <li><a href="../index.html">首页</a></li>
            <li><a href="../c/tops.html">球衣</a></li>
            <li><a href="../c/shoes.html">球鞋</a></li>
            <li><a href="../c/balls.html">足球</a></li>
            <li><a href="../c/accessories.html">配件/装备</a></li>
        </ul>
        <div class="search">
            <form action="./search.php" method="post" class="search-form">
                <input type="search" name="search" class="search-text"/>
                <input type="submit" value="&#xf002" class="search-btn fas"/>
            </form>
        </div>
    </div>
</div>
<div class="section">
    <div class="tag">
        <h1>搜索结果</h1>
        <span>(<?php echo($num); ?>)</span>
    </div>
    <div class="list">
        <ul>
            <?php

                    if($num){
                        for ($i = 0 ; $i < $num ; $i++){
                            $row = mysqli_fetch_row($res);
                            echo "
                            <li>
                            <div class='bg'>
                                <a href='../t/".$row[0].".html'><img src='../img/goods/".$row[2]."/".$row[5]."小.jpg' ></a>
                            </div>
                            <div class='info'>
                                <span class='name'>".$row[1]."</span><br>
                                <span class='introduction'>".$row[3]."</span><br>
                                <span class='price'>￥".$row[4]."</span><br>
                            </div>
                            </li>
                            ";

                        }
                    }
                    else{
                        echo "<span class='errormsg'>非常抱歉，没有找到相关商品</span>";
                    }
                
                
            ?>
        </ul>
    </div>
    <div class="clear"></div>
</div>
<div class="bottombar">
    <div class="text">
        <span>© 2019 随便什么,公司. 保留所有权利</span>
    </div>
</div>
</body>
</html>