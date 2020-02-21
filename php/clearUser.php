<?php
    setcookie("uid","",time()-60*60,"/sccx/");
    setcookie("username","",time()-60*60,"/sccx/");
    echo '<script>window.location="../index.html";</script>';
?>