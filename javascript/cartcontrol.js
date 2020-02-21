function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}
function getnum(){
    var ajax=new XMLHttpRequest();
    ajax.open("GET","./php/carttest.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')'); 
            document.getElementById("number").innerHTML="(" + json.length + ")";
        }
    }
}
function getItems(){
    var ajax=new XMLHttpRequest();
    var html="";
    ajax.open("GET","./php/carttest.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');                     
            for(var i=0 ; i<json.length ; i++){
                var xhr=new XMLHttpRequest();
                xhr.open("GET","./php/getItemInformation.php?itemid="+json[i].itemid,false);
                xhr.send(null);
                var item = eval('('+xhr.responseText+')');
                var itemid = item.itemid;
                var itemname = item.name;
                var itemsort = item.sort;
                var iteminfo = item.information;
                var itemprice = item.price;
                var sid = item.sid;
                var size = json[i].size;
                var id= json[i].id;
                html +=`                          
                    <li>
                        <div class='bg'>
                            <a href='./t/${itemid}.html'><img src='./img/goods/${itemsort}/${sid}小.jpg' ></a>
                        </div>
                        <div class='info'>
                            <span class='name'>${itemname}</span>
                            <span class='price' id='total${id}'>￥${itemprice}</span><br>
                            <span class='introduction'>${iteminfo}</span><br>
                `;
                var isEng = /[A-Za-z]/;
                var isNum = /[0-9]/;
                if(isEng.test(size)){
                    html +=`
                        <label>尺码</label>
                        <select class='size' id='size${id}' onchange='setSize(this)' >
                            <option value='S'>S</option>
                            <option value='M'>M</option>
                            <option value='L'>L</option>
                            <option value='XL'>XL</option>
                            <option value='XXL'>XXL</option>
                        </select>

                    `;
                }
                if(isNum.test(size)){
                    html +=`
                        <label>尺码</label>
                        <select class='size' id='size${id}' onchange='setSize(this)'>
                            <option value='40'>40</option>
                            <option value='40.5'>40.5</option>
                            <option value='41'>41</option>
                            <option value='42'>42</option>
                            <option value='43'>43</option>
                        </select>

                    `;
                }
                html+=`
                    <label>数量</label>
                    <select class='count' id='count${id}' onchange='getTotal(this)'>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                    </select>
                    <button class='delete' id='delete${id}' onclick='cartdelete(this)'>删除</button>
                    </div>
                    </li>
                `;

            }
        }
        document.getElementById("items").innerHTML=html;
    }
}
function getSize(){
    var ajax=new XMLHttpRequest();
    var html="";
    ajax.open("GET","./php/carttest.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');
            for(var i=0 ; i<json.length ; i++){
                var size = json[i].size;
                var sizeselect = document.getElementById("size" + json[i].id);
                if (sizeselect!=null){
                    for(var j = 0 ; j<sizeselect.length ;j++){
                        if(sizeselect.options[j].value == size){
                            sizeselect.options[j].selected = true;
                        }
                    }
    
                }
            }
        }
    }
}
function setCount(){
    var ajax=new XMLHttpRequest();
    var html="";
    ajax.open("GET","./php/carttest.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');
            for(var i=0 ; i<json.length ; i++){
                var count = json[i].count;
                var sizeselect = document.getElementById("count" + json[i].id);
                for(var j = 0 ; j<sizeselect.length ;j++){
                    if(sizeselect.options[j].value == count){
                        sizeselect.options[j].selected = true;
                    }
                }
            }
        }
    }
}
function getSummary(){
    var ajax=new XMLHttpRequest();
    var summary = 0;
    ajax.open("GET","./php/carttest.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');
            for(var i=0 ; i<json.length ; i++){
                var total = parseInt(json[i].total);
                summary += total;
            }
        }
        document.getElementById("summary").innerHTML = "￥" + toThousands(summary);
    }
}
function getTotal(obj){
    var index = obj.selectedIndex;
    var count = obj.options[index].value;
    var id = obj.getAttribute("id");
    id = id.replace(/[^0-9]/ig,"");   
    var ajax=new XMLHttpRequest();
    ajax.open("GET","./php/SoneIncart.php?id="+id,true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')'); 
            var itemid = json.itemid;
            var xhr=new XMLHttpRequest();
            xhr.open("GET","./php/getItemInformation.php?itemid="+itemid,false);
            xhr.send(null);
            var item = eval('('+xhr.responseText+')');
            var itemprice = item.price;
            var total = count * itemprice;
            var sizeselect = document.getElementById("size"+id);
            if(sizeselect==null){
                var size='';
            }else{
                var index = sizeselect.selectedIndex;
                var size = sizeselect.options[index].value; 
            }
            id = parseInt(id);
            xhr.open("GET",`./php/updatecart.php?id=${id}&size=${size}&count=${count}&total=${total}`,false);
            xhr.send(null);
            getSummary();
        }
    }
}
function setSize(obj){
    var index = obj.selectedIndex;
    var size = obj.options[index].value;
    var id = obj.getAttribute("id");
    id = id.replace(/[^0-9]/ig,"");   
    var countselect = document.getElementById("count"+id);
    var index = countselect.selectedIndex;
    var count = countselect.options[index].value;
    id = parseInt(id);
    var ajax = new XMLHttpRequest();
    ajax.open("GET","./php/SoneIncart.php?id="+id,true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')'); 
            var total = json.total;
            var xhr=new XMLHttpRequest();
            xhr.open("GET",`./php/updatecart.php?id=${id}&size=${size}&count=${count}&total=${total}`,false);
            xhr.send(null);
        }
    }
}
function cartdelete(obj){
    var id = obj.getAttribute("id");
    id = id.replace(/[^0-9]/ig,"");
    id = parseInt(id);
    var ajax = new XMLHttpRequest();
    console.log("./php/cartdelete.php?id="+id);
    ajax.open("GET","./php/cartdelete.php?id="+id,true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            getItems();
            getSize();
            setCount();
            getSummary();
            getnum();
        
        }
    }



}
