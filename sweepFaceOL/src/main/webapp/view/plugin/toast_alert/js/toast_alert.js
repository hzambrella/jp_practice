// opt:fontSize
$.extend({
    toast: function (message, opt) {
        var defaults = {
            fontSize: "1em"
        }

        var setting = $.extend({}, defaults, opt)
        clearTimeout(timeOut)
        var timeOut = null
        // $(".toast").css("display","block")

        $(".toast").css("opacity", "1")
        $(".toast_text").css("font-size", setting.fontSize)
        $(".toast_text").text(message)

        timeOut = setTimeout(function () {
            $(".toast").css("opacity", "0")
        }, 1000)
    },

    toastForAjaxErr: function (data) {
        var message = ""
        if ((data.statusText == "timeout" || data.statusText == "error") && data.status == 0) {
            $.toast("服务器无法链接接，请检查网络或稍后再试")
        } else {
            $.toast("系统服务器异常，请稍候再试")
        }
    },

    //服务端需要定义response数据格式，code为状态码，message为信息。
    toastForJavaAjaxRes: function (data, callback) {
        //console.log(data,data.code)
        if (data.code != 200) {
            $.toast(data.message)
        } else {
            callback()
        }
    },
})