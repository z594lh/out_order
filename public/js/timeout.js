var lastTime = new Date().getTime();
var currentTime = new Date().getTime();
var timeOut = 15 * 60 * 1000; //设置超时时间： 10分

window.onload = function () {
    window.document.onmousedown = function () {
        localStorage.setItem("lastTime",new Date().getTime());
    }
};
function checkTimeout() {
    currentTime = new Date().getTime(); //更新当前时间
    lastTime = localStorage.getItem("lastTime");
    if (currentTime - lastTime > timeOut) { //判断是否超时
        console.log('超时');
        window.location.href =  'http://'+window.location.host+"/external/index/logout";
    }
}

/* 定时器 间隔30秒检测是否长时间未操作页面 */
window.setInterval(checkTimeout, 30000);
