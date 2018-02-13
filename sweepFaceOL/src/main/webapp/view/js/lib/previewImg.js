/*  
鼠标移至预览图显示大图  
*/
/*使用js实现文件上传图片的预览  
 */
function showPreview(obj,selector) {
    $("#message").html("")
    document.body.style.backgroundColor = "#ffffff"
    var pic = document.getElementById(selector);
    // var file = document.getElementById("myfile");
    var file=obj
    html5Reader(file, pic);
}

//小预览图
/*  
firefox3.6+ chrome6+ Safari5.2+ Opera11+及IE10浏览器支持FileReader对象  
其他兼容方法 http://www.2cto.com/kf/201402/281430.html  
*/
function html5Reader(file, pic) {
    if (undefined == file) {
        return
    }
    var file = file.files[0];
    if (undefined == file) {
        return
    }
    var mess = ""
    var reader = new FileReader();
    if (undefined == file.name) {
        return
    }
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        pic.src = this.result;
    }
}