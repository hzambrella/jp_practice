// 扫描特效插件
// 使用方法。 将<div  class="scanimg"></div>设置为img的兄弟节点。用 $(selector).scanimg()方法来构造。
$.widget("custom.scanimg", {
    // Default options.
    options: {
        //目标图片高度
        target_height: 0,
        // 目标图片宽度
        target_width: 0,
        // loop_time: 0,
        //扫描速度
        speed_time: 0,
        //停止信号
        signal:false,
    },

    //构造方法。固定写法。参数speed_time,扫描特效一轮速度，单位毫秒
    _create: function (opt) {
        var $target_img = $(this.element).siblings("img");

        this.options.target_height = $target_img.outerHeight()
        this.options.target_width = $target_img.outerWidth()
 
        // console.log("scanimg calls:_create")
        // console.log(this.options)
    },

    //销毁方法。这里可以用来清除dom等，固定写法
    _destroy: function () {
        // 清除绑定的所有事件
    },

    //开启扫描特效
    scanning: function (cb) {
        var $speed = this.options.speed_time,
            $height = this.options.target_height,
            $width = this.options.target_width,
            $delay = 150,
            $this=this,
            $el = this.element;
        var loop=function() {
            $el.addClass("scan_red")
            $el.width($width)
            //animate:执行动画
            $el.animate({
                height: $height
            }, $speed, "linear", function () {
                setTimeout(function () {
                    $el.removeClass("scan_red")
                    $el.removeClass("scan_green");
                    $el.removeClass("scan_red");
                    $el.removeAttr("style")
                    if ($this.options.signal){
                        $this.options.signal=false
                        if (cb!=undefined){
                              cb()
                        }
                    }else{
                        loop()
                    }
                }, $delay)
                // this.element.addClass("scan")
            });
            //循环
            /*
            setInterval(function () {
                $("#scan").animate({
                    left: "+=5000px"
                }, 1000, function () {
                    $(this).css({
                        left: "-300px"
                    });
                });
            }, 1000 * 20);
            */
            // 变色
            setTimeout(function () {
                $el.addClass("scan_yellow");
                setTimeout(function () {
                    $el.removeClass("scan_yellow");
                    $el.addClass("scan_green");
                }, $speed / 3)
            }, $speed / 3)
        };
        loop()
    },

    //停止扫描特效
    stop:function(){
        this.options.signal=true;
        $el = this.element;
        $el.stop(true,true)
    }
})