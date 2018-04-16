var commonTool = {
    //图片旋转一定角度。angle是角度 如30度就是30.若为空，就清除掉旋转。
    rotateImg: function ($imgel, angle) {
        var degree;
        angle == null ? degree = '' : degree = "rotate(" + angle + "deg" + ")";
        $imgel.css("transform", degree);
        $imgel.css("-ms-transform", degree);
        $imgel.css("-webkit-transform", degree);
    },
    //将图片转化为base64 src是图片的url 参考https://www.cnblogs.com/mr-wuxiansheng/p/6931077.html 
    //不能用
    toBase64: function (src) {
        var img = new Image();
        img.src = src;
        var canvasEl = document.createElement("canvas");
        // canvasEl.display = 'none';
        canvasEl.width = img.width;
        canvasEl.height = img.height;
        var ctx = canvasEl.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvasEl.toDataURL("image/" + ext);
        console.log(dataURL)
        return dataURL;
    }
}