    //页面中插入下面的
    // <div class="toast" id="toastAlert">
    //     <div class="toast_text"></div>
    // </div>
    //id 和class不能变
    //使用
    //$.toast(message,{
    // fontSize:1em,
    // timeout:1000,
    //})

    // 关于java  ajax  
    //服务端需要定义response数据格式，data.code为状态码，data.message为信息。
    //     $.ajax({
    //     type: "post",
    //     dataType: "json",
    //     url: "/netDisk/MoveFileServlet",
    //     data: {
    //         orgDirName: orgDirName,
    //         newDirName: newDirName,
    //         fileNames: fileNames,
    //     },
    //     success: function (data) {
    //         $.toastForJavaAjaxRes(data, function () {
    //             cb(data);
    //         })
    //     },
    //     error: function (data, status, e) {
    //         $.toastForAjaxErr(data, status, e)
    //         failcb(data, status, e)
    //     }
    // })

    //$.toast() 显示toast信息栏
    // opt:fontSize 字体大小 ,timeout显示时间  小于0时是永久, 要显示的message。

    //$.toastForceHide()隐藏toast信息栏

    //$.toastForAjaxErr()  处理ajax error 内含$.toastForceHide().
    //$.toastForJavaAjaxRes()处理ajax success。内含$.toastForceHide().
    $.extend({
        toast: function (message, opt) {
            var defaults = {
                fontSize: "1em",
                timeout: 1000,
            }

            var setting = $.extend({}, defaults, opt)
            var timeOut = null
            clearTimeout(timeOut)

            // $(".toast").css("display","block")
            // $(".toast").css("opacity", "0")
            $(".toast").css("opacity", "1")
            $(".toast_text").css("font-size", setting.fontSize)
            $(".toast_text").text(message)

            if (setting.timeout > 0) {
                console.log($(".toast").css("opacity"))
                $(".toast").css("opacity", "1")
                timeOut = setTimeout(function () {
                    $(".toast").css("opacity", "0")
                }, setting.timeout)
            }
        },
        toastForceHide: function () {
            $(".toast").css("opacity", "0")
        },
        toastForAjaxErr: function (data, status, e) {
            $.toastForceHide()
            var message = ""
            if ((data.statusText == "timeout" || data.statusText == "error") && data.status == 0) {
                $.toast("服务器无法链接接，请检查网络或稍后再试")
            } else if (status == "parsererror") {
                console.log("data:", data)
                console.log("status:", status)
                console.log("e:", e)
                $.toast("页面解析数据异常")
            } else {
                console.log("data:", data)
                console.log("status:", status)
                console.log("e:", e)
                $.toast("系统服务器异常，请稍候再试")
            }
        },

        //服务端需要定义response数据格式，code为状态码，message为信息。
        toastForJavaAjaxRes: function (data, callback) {
            $.toastForceHide()
            //console.log(data,data.code)
            if (data.code == 200) {
                callback()

            } else if (data.code == 302) {
                if (data.map.path != null) {
                    location.replace(data.map.path)
                } else {
                    $.toast("系统服务器异常，跳转失败，请稍候再试")
                }
            } else {
                $.toast(data.message)
            }
        },
    })

    $.fn.beToast = function (opt) {
        var defaults = {
            messageHTML: "<div class='toast_text'>this is toastAlert</div>",
            fontSize: "1em",
            timeout: 1000,
        }
        
        var setting = $.extend({}, defaults, opt)
        if (setting.timeOut <= 0) {
            setting.timeOut = 500
        }
        var timeOut = null
        clearTimeout(timeOut)

        // $(".toast").css("display","block")
        // $(".toast").css("opacity", "0")
        $(this).css("opacity", "1")
        $(this).css("font-size", setting.fontSize)
        $(this).html(setting.messageHTML)


        console.log($(".toast").css("opacity"))
        $(this).css("opacity", "1")
        timeOut = setTimeout(function () {
            $(this).css("opacity", "0")
        }, setting.timeout)


        $.fn.changeCon = function (_HTML) {
            $(this).html(_HTML)
        }
    }