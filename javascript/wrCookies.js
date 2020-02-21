
function writeCookie(name, value, hours) {
    var expire = "";
    if (hours != null) {
        expire = new Date((new Date()).getTime() + hours * 1000);
        expire = "; expires=" + expire.toGMTString();
    }
    document.cookie = name + "=" + escape(value) + expire;
}

function readCookie(name) {
    var aCookie = document.cookie.split("; ");
    for (var i=0; i < aCookie.length; i++) {
        var aCrumb = aCookie[i].split("=");
        if (name == aCrumb[0]) {
        return decodeURIComponent(aCrumb[1]);
        }
    }
    return '';
}

function getUsername(){
    return readCookie("username");
}

function clearCookie(){
    document.cookie = "username=username ; expires=Sun, 31 Dec 2017 12:00:00 UTC; path=/sccx/";
}


