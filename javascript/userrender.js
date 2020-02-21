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
    ajax.open("GET","./php/orderlist.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var json = eval('('+ajax.responseText+')');   
            if(json.length == 0){
                html += "<span style='color:#8d8d8d'>你还没有任何订单</span>";
                document.getElementById("order").innerHTML= html;
                return;
            }
            for(var i=json.length-1 ; i>=0 ; i--){
                var order_id = json[i].order_id;
                html += `
                    <div class="orderinfo">
                        <span class="title" id="order${order_id}">订单${order_id}：</span>
                `;
                var order_summary = toThousands(json[i].order_summary);
                var order_status = json[i].order_status;
                var order_name =json[i].order_name;
                var order_address = json[i].order_address;
                var order_phone = json[i].order_phone;
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
                        </div>
                        <div class="modify">
                            <button onclick="infoModify(this)" id="modifyInfo${order_id}">修改收货信息</button>
                            <button onclick="orderCancel(this)" id="cancel${order_id}">取消订单</button>
                        </div>
                    </div>
                    <div class="edit" id="orderEdit${order_id}" style="display:none">
                    <span class="tag">订单${order_id}的收货信息</span>
                    <div class="customerinfo">
                        <span>姓名：</span>
                        <input type="text" name="name" id="oname${order_id}" value="${order_name}" onchange="oCheck(this)">
                        <span>地址：</span>
                        <input type="text" name="address" id="oaddress${order_id}" value="${order_address}" onchange="oCheck(this)">
                        <span>电话：</span>
                        <input type="text" name="phone" id="ophone${order_id}" value="${order_phone}" onchange="oCheck(this)">
                    </div>
                    <div class="save">
                        <span class="errormsg" id="errormsg${order_id}"></span>
                        <input type="submit" value="保存" class="btnsave" id="save${order_id}" disabled="true" onclick="saveOrder(this)">
                    </div>
                </div>    
                `;
            }
            document.getElementById("order").innerHTML = html;
        }
    }   
}
function getCustomerinfo(){
    var ajax=new XMLHttpRequest();
    ajax.open("GET","./php/getCustomerinfo.php",true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var customer = eval('('+ajax.responseText+')'); 
            if(!customer.name){
                document.getElementById("name").value="请尽快填写你的姓名";
            }else{
                document.getElementById("name").value=customer.name;
            }
            if(!customer.address){
                document.getElementById("address").value="请尽快填写你的地址";
            }else{
                document.getElementById("address").value=customer.address;
            }
            if(!customer.phone){
                document.getElementById("phone").value="请尽快填写你的电话";
            }else{
                document.getElementById("phone").value=customer.phone;
            }
            document.getElementById("save").disabled=true;
        }
    }
}
function check(){
    var name = document.getElementById("name").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    if(!name){
        document.getElementById("errormsg").innerHTML="error:姓名不能为空";
        document.getElementById("save").disabled = true;
        return;
    }
    if(!address){
        document.getElementById("errormsg").innerHTML="error:地址不能为空";
        document.getElementById("save").disabled = true;
        return;
    }
    if(!phone){
        document.getElementById("errormsg").innerHTML="error:电话输入错误";
        document.getElementById("save").disabled = true;
        return;
    }
    if(phone.length<5 || phone.length>13){
        document.getElementById("errormsg").innerHTML="error:电话输入错误";
        document.getElementById("save").disabled = true;
        return;
    }
    var regNumber = /\d+/;
    var regString = /[a-zA-Z]+/;
    if(regNumber.test(name) || regString.test(name)){
        document.getElementById("errormsg").innerHTML="error:姓名只能输入中文字符";
        document.getElementById("save").disabled = true;
        return;
    }
    regNumber = /^[0-9]*$/;
    if(!regNumber.test(phone)){
        document.getElementById("errormsg").innerHTML="error:电话输入错误";
        document.getElementById("save").disabled = true;
        return;
    }
    document.getElementById("errormsg").innerHTML="";
    document.getElementById("save").disabled = false;
}
function orderCancel(obj){
    var order_id = obj.id.replace(/[^0-9]/ig,"");   
    order_id = parseInt(order_id);
    if(document.getElementById("oStatus"+order_id).innerHTML=="未发货")
    {
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
    else{
        alert("无法取消已发货的订单");
    }
}

function infoModify(obj){
    var order_id = obj.id.replace(/[^0-9]/ig,"");   
    order_id = parseInt(order_id);
    var orderedit = document.getElementById("orderEdit"+order_id);
    if(orderedit.style.display == "none"){
        if(document.getElementById("oStatus"+order_id).innerHTML!="未发货") {
            document.getElementById("oname"+order_id).disabled = true;
            document.getElementById("oaddress"+order_id).disabled = true;
            document.getElementById("ophone"+order_id).disabled = true;
        }    
        orderedit.style.display = "";
        return;
    }
    orderedit.style.display = "none";
    document.getElementById("errormsg"+order_id).innerHTML="";
}
function oCheck(obj){
    var oid = obj.id.replace(/[^0-9]/ig,"");  
    var name = document.getElementById("oname"+oid).value;
    var address = document.getElementById("oaddress"+oid).value;
    var phone = document.getElementById("ophone"+oid).value;
    if(!name){
        document.getElementById("errormsg"+oid).innerHTML="error:姓名不能为空";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    if(!address){
        document.getElementById("errormsg"+oid).innerHTML="error:地址不能为空";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    if(!phone){
        document.getElementById("errormsg"+oid).innerHTML="error:电话不能为空";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    if(phone.length<5 || phone.length>13){
        document.getElementById("errormsg"+oid).innerHTML="error:电话输入错误";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    var regNumber = /\d+/;
    var regString = /[a-zA-Z]+/;
    if(regNumber.test(name) || regString.test(name)){
        document.getElementById("errormsg"+oid).innerHTML="error:姓名只能输入中文字符";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    regNumber = /^[0-9]*$/;
    if(!regNumber.test(phone)){
        document.getElementById("errormsg"+oid).innerHTML="error:电话输入错误";
        document.getElementById("save"+oid).disabled = true;
        return;
    }
    document.getElementById("errormsg"+oid).innerHTML="";
    document.getElementById("save"+oid).disabled = false;
}
function saveOrder(obj){
    var order_id = obj.id.replace(/[^0-9]/ig,"");  
    var order_name = document.getElementById("oname"+order_id).value;
    var order_address = document.getElementById("oaddress"+order_id).value;
    var order_phone = document.getElementById("ophone"+order_id).value;
    var ajax = new XMLHttpRequest();
    console.log(`./php/orderUpdate.php?order_id=${order_id}&order_name=${order_name}&order_address=${order_address}&order_phone=${order_phone}`);
    ajax.open("GET",`./php/orderUpdate.php?order_id=${order_id}&order_name=${order_name}&order_address=${order_address}&order_phone=${order_phone}`,true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState==4 &&ajax.status==200) {
            var msg = document.getElementById("errormsg"+order_id);
            msg.style.color="green";
            msg.innerHTML="success:修改收货信息成功！";
            document.getElementById("save"+order_id).disabled = true;
        }
    }
}