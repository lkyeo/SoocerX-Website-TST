function toThousands(num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}
function orderlist(){
    var ajax=new XMLHttpRequest();
    var html="";
    ajax.open("GET","./php/adminOrderlist.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');   
            if(json.length == 0){
                html += "<span style='color:#8d8d8d'>你还没有任何订单</span>";
                document.getElementById("order").innerHTML= html;
                return;
            }
            for(var i=0 ; i<json.length ; i++){
                var order_id = json[i].order_id;
                html += `
                    <div class="orderinfo">
                        <span class="title" id="order${order_id}">订单${order_id}：</span>
                `;
                var order_summary = toThousands(json[i].order_summary);
                var order_status = json[i].order_status;
                var xhr=new XMLHttpRequest();
                xhr.open("GET","./php/getOrderdetail.php?oid="+order_id,false);
                xhr.send(null);
                var item = eval('('+xhr.responseText+')');
                for(var j=0 ; j<item.length ; j++){
                    var item_id = item[j].item_id;
                    var item_size = item[j].item_size;
                    var item_count = item[j].item_count;
                    var item_total = toThousands(item[j].item_total);
                    xhr.open("GET","./php/getItemInformation.php?itemid="+item_id,false);
                    xhr.send(null);
                    var iteminfo = eval('('+xhr.responseText+')');
                    var item_name = iteminfo.name;
                    var item_info = iteminfo.information;
                    var item_sort = iteminfo.sort;
                    var item_sid = iteminfo.sid;
                    html += `
                        <div class="item">
                            <div class="bg"><img src="./img/goods/${item_sort}/${item_sid}小.jpg"></div>
                            <div class="iteminfo">
                                <span class="name">${item_name}</span><br>
                                <span class="info">${item_info}</span><br>
                                <span class="sizecount">尺码：${item_size} 数量：${item_count}</span>
                                <span class="total">￥${item_total}</span>
                            </div>        
                        </div>
                    `;
                }
                html +=`
                        <div class="summary">
                            <span>总计：￥${order_summary}</span>
                            <span id="oStatus${order_id}">${order_status}</span>    
                            <span>账户：${json[i].uid}</span>        
                        </div>
                        <div class="modify">
                            <button onclick="infoModify(this)" id="modifyInfo${order_id}">修改订单状态</button>
                            <button onclick="orderCancel(this)" id="cancel${order_id}">删除订单</button>
                        </div>
                    </div>
                    <div class="edit" id="orderEdit${order_id}" style="display:none">
                    <span class="tag">修改订单${order_id}的状态</span>
                    <div class="customerinfo">
                        <select class='order_status' id='order_status${order_id}' onchange='actSave(this)'>
                            <option value='notshipped'>未发货</option>
                            <option value='shipped'>已发货</option>
                            <option value='locked'>锁定</option>
                        </select>
                    </div>
                    <div class="save">
                        <span class="errormsg" id="errormsg${order_id}"></span>
                        <input type="submit" value="保存" class="btnsave" id="save${order_id}" disabled="true" onclick="statusUpdate(this)">
                    </div>
                </div>    
                `;
            }
            document.getElementById("account").innerHTML="";
            document.getElementById("adminEdit").innerHTML="";   
            document.getElementById("order").innerHTML = html;
        }
    }   
}
function getAdmininfo(){
            var html = `
                <span class="tag">修改管理员账户的密码</span>
                <form action="./php/adminPasswordset.php" method="POST">
                    <div class="customerinfo">
                        <span>密码：</span>
                        <input type="password" name="admin_password" maxlength="16">
                    </div>
                    <div class="save">
                        <span class="errormsg" id="errormsg"></span>
                        <input type="submit" value="保存" class="btnsave" id="save">
                    </div>
                </form>
            `;
            document.getElementById("order").innerHTML="";
            document.getElementById("account").innerHTML="";
            document.getElementById("adminEdit").innerHTML=html;   
}

function orderCancel(obj){
    var order_id = obj.id.replace(/[^0-9]/ig,"");   
    order_id = parseInt(order_id);
    if(confirm('确定要删除此订单吗?')) 
    { 
        var ajax = new XMLHttpRequest();
        ajax.open("GET","./php/orderDelete.php?oid="+order_id,true);
        console.log("./php/orderDelete.php?oid="+order_id);
        ajax.send(null);
        ajax.onreadystatechange = function () {
            if (ajax.readyState==4 &&ajax.status==200) {
                orderlist();
            }
        }
    
    }     

}

function infoModify(obj){
    var order_id = obj.id.replace(/[^0-9]/ig,"");   
    order_id = parseInt(order_id);
    var orderedit = document.getElementById("orderEdit"+order_id);
    if(orderedit.style.display == "none"){  
        orderedit.style.display = "";
        return;
    }
    orderedit.style.display = "none";
    document.getElementById("errormsg"+order_id).innerHTML="";
}

function actSave(obj){
    var oid = obj.id.replace(/[^0-9]/ig,"");  
    document.getElementById("save"+oid).disabled=false;
}

function statusUpdate(obj){
    var oid = obj.id.replace(/[^0-9]/ig,"");  
    var select = document.getElementById("order_status"+oid);
    var index = select.selectedIndex;
    var status = select.options[index].innerHTML;
    var ajax = new XMLHttpRequest();
    ajax.open("GET",`./php/orderStatusupdate.php?order_id=${oid}&order_status=${status}`,true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var msg = document.getElementById("errormsg"+oid);
            msg.style.color="green";
            msg.innerHTML="success:更新状态信息成功！";
            document.getElementById("save"+oid).disabled = true;
        }
    }

}
function accountList(){
    var ajax=new XMLHttpRequest();
    var html="";
    ajax.open("GET","./php/accountGet.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');  
            for(var i=0 ; i<json.length ; i++){
                var uid = json[i].uid;
                var username = json[i].username;
                var name = json[i].name;
                if(!name){
                    name = ""; 
                }
                var address = json[i].address;
                if(!address){
                    address = ""; 
                }
                var phone = json[i].phone;
                if(!phone){
                    phone = ""; 
                }
                html += `
                    <div class="customer">
                    <div class="customerinfo">
                        <span class="uid">UID:${uid}</span>
                        <span class="username">${username}</span>
                        <span class="name">姓名:${name}</span>
                        <span class="address">地址:${address}</span>
                        <span class="phone">电话:${phone}</span>
                    </div>
                `;
                var xhr=new XMLHttpRequest();
                xhr.open("GET","./php/orderGet.php?uid=" + uid,false);
                xhr.send(null);
                var orders = eval('('+xhr.responseText+')');
                var order_num = orders.length;
                var order_summary = 0;
                for(var j=0 ; j<orders.length ; j++){
                    order_summary += parseInt(orders[j].order_summary);
                }
                    order_summary = toThousands(order_summary);
                html +=`
                    <div class="amount">
                        <span>订单数:${order_num}</span>
                        <span>总花费:${order_summary}</span>
                    </div>
                    <div class="delete">
                    <button onclick="userDelete(this)" id="userDelete${uid}">删除该账户</button>
                    </div>
                </div>
                `;
            } 
            document.getElementById("account").innerHTML=html;
        }
    }
    document.getElementById("order").innerHTML="";
    document.getElementById("edit").innerHTML="";
}