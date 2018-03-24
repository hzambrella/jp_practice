//横向进度条
//options height进度条高度 widht宽度  container_color外层颜色 water_color水颜色 text_default默认的提示

// 方法 
//setProgress(percent,text) percent百分比 0~1 text 提示语变换
//使用 <div id="selector"></div>  var bar=$("#selector").progressbar()  bar.setProgress() 
$.fn.progressbar = function (options) {
    var defaults = {
        'height': '14px',
        'widht': "160px",
        "container_color": "#cccccc",
        "water_color": "#99CCFF",
        "text_default": "0/100",
    };

    var settings = $.extend({}, defaults, options);

    this.addClass("progress_bar_container");
    this.append("<div class='progress_water'></div>");
    this.append("<span style='color:black;display:inline-block;margin-top:6px;margin-left:2px'>" + settings.text_default + "</span>")
    this.css("height", settings.height);
    this.css("width", settings.widht);
    this.css("background-color", settings.container_color);

    $water = this.find(".progress_water");
    $water.css("height", settings.height);
    $water.css("background-color", settings.water_color);
    // this.extend({
    //     setProgress:settings.setProgress(),
    // })
    $.fn.setProgress = function (percent,text) {
        percent==null?percent=0:percent=percent;
        text==null?text="":text=text;

        percent<0?percent=0:percent=percent;
        percent>1?percent=1:percent=percent;

        $water=$(this).find(".progress_water");

        $water.css("width",$(this).width()*percent);
        $(this).find("span").html(text);
        return this;
    }

    return this;
}