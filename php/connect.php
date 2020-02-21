<?php
    $server="localhost";//主机
    $db_username="root";//数据库用户名
    $db_password="";//数据库密码

    $con = mysql_connect($server,$db_username,$db_password);//链接数据库
    if(!$con){
        die("can't connect".mysql_error());//如果链接失败输出错误
    }

    mysql_select_db('soccerx',$con);//选择数据库
?>