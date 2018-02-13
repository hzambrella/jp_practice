$(function () {
    var $scanimg = $("#scanimg1").scanimg({
        speed_time: 1000
    })
    $(".operate1").click(function (event) {
        var $target = $(event.target);
        // console.log($target)
        if ($target.is("button#test_scan")) {
            if ($("#myfile").prop("files").length < 1) {
                $.toast("请上传图片")
                return
            }
            $("#test_scan").disabledButton()
            // getResult()
            startScan()
        } else if ($target.is("button#stop")) {
            $scanimg.scanimg("stop")
            $("#test_scan").enableButton()
        }
    })

    function startScan() {
        $scanimg.scanimg("scanning")

        $.ajaxFileUpload({
            url: '/sweepFaceOL/fileUploadServlet', // servlet请求路径  
            secureuri: false,
            fileElementId: 'myfile', // 上传控件的id  
            dataType: 'json',
            // data : {username : $("#username").val()}, // 其它请求参数  
            success: function (data, status) {
                $.toastForJavaAjaxRes(data, function () {
                    $.toast(data.message)
                })
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(result)
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            }
        });
    }

    function getResult() {
        $scanimg.scanimg("scanning")
        $.ajax({
            type: "POST",
            url: "/sweepFaceOL/sweepServlet",
            dataType: "json",
            // data: {
            //     res: resObj
            // },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    alert("xinxi:" + data)
                })
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            },

            error: function (result) {
                $.toastForAjaxErr(result)
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            }
        });
    }
})