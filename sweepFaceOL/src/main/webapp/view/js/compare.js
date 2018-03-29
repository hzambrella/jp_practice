$(function () {
    // $("#compare_img1").imgFileInput({
    //     height:'190px',
    //     width: '190px',
    // })
    //  $("#compare_img2").imgFileInput({
    //     height:'190px',
    //     width: '190px',
    // })

    var map = {}
    map['addImg1'] = '#compare_img1'
    map['addImg2'] = '#compare_img2'
    var $scanimg2 = $("#scanimg2").scanimg({
        speed_time: 1000
    })

    var $scanimg3 = $("#scanimg3").scanimg({
        speed_time: 1000
    })

    $(".addImg").click(function (event) {
        var $target = $(event.target)
        // console.log(map[$target.attr("id")])
        $(map[$target.attr("id")]).find("input").trigger("click")
    })

    $(".operate2").click(function (event) {
        var $target = $(event.target);
        // console.log($target)
        if ($target.is("button#test_scan2")) {
            getResult()
        } else if ($target.is("button#stop2")) {
            $scanimg2.scanimg("stop")
            $scanimg3.scanimg("stop")
            $("#test_scan2").enableButton()
        }
    })

    function getResult() {
        // $.toast("test_scan")
        $("#result2").html("")
        if ($("#compare_file1").prop("files").length < 1) {
            $.toast("请上传图片1")
            $("#test_scan2").enableButton()
            return
        }

        if ($("#compare_file2").prop("files").length < 1) {
            $.toast("请上传图片2")
            $("#test_scan2").enableButton()
            return
        }

        $scanimg2.scanimg("scanning")
        $scanimg3.scanimg("scanning")
        $("#test_scan2").disabledButton()

        var file1 = $("#compare_file1").prop("files");
        var file2 = $("#compare_file2").prop("files");
        form = new FormData();

        form.append(file1[0].name, file1[0]);
        form.append(file2[0].name, file2[0]);

        $.ajax({
            url: '/sweepFaceOL/compareFaceServlet',
            method: 'post',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    console.log(data)
                    var result = dealData(data)
                    var _html = "校验结果：" + result.text + "</br>" + "相似度:" + result.confidence
                    $("#result2").html(_html)
                })
                $scanimg2.scanimg("stop")
                $scanimg3.scanimg("stop")
                $("#test_scan2").enableButton()
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data)
                $scanimg2.scanimg("stop")
                $scanimg3.scanimg("stop")
                $("#test_scan2").enableButton()
            }
        })

        // $.ajaxFileUpload({
        //     url: '/sweepFaceOL/compareFaceServlet', // servlet请求路径  
        //     secureuri: false,
        //     fileElementId: ['compare_file1', 'compare_file2'], // 上传控件的id  
        //     dataType: 'json',
        //     // data : {username : $("#username").val()}, // 其它请求参数  
        //     success: function (data, status) {
        //         $.toastForJavaAjaxRes(data, function () {
        //             console.log(data)
        //             var result = dealData(data)
        //             var _html = "校验结果：" + result.text + "</br>" + "相似度:" + result.confidence
        //             $("#result2").html(_html)
        //         })
        //         $scanimg2.scanimg("stop")
        //         $scanimg3.scanimg("stop")
        //         $("#test_scan2").enableButton()
        //     },
        //     error: function (data, status, e) {
        //         $.toastForAjaxErr(data)
        //         $scanimg2.scanimg("stop")
        //         $scanimg3.scanimg("stop")
        //         $("#test_scan2").enableButton()
        //     }
        // });

        function dealData(data) {
            var $result = data.map.result
            var result_text = "某图片未检测到人脸"
            if (undefined == $result.confidence) {
                return result_text, 0
            }
            var $confidence = $result.confidence
            if (0 == $confidence) {
                return result_text, 0
            }

            if (undefined == $result.thresholds) {
                return result_text, 0
            }
            var thresholds = $result.thresholds
            if ($confidence < thresholds["1e-3"]) {
                result_text = "不是同一个人"
            } else if ($confidence < thresholds["1e-4"] && $confidence > thresholds["1e-3"]) {
                result_text = "长得很像"
            } else if ($confidence < thresholds["1e-5"] && $confidence > thresholds["1e-4"]) {
                result_text = "几乎是同一个人"
            } else if ($confidence > thresholds["1e-5"]) {
                result_text = "同一个人"
            }

            return {
                "text": result_text,
                "confidence": $confidence
            }
        }

    }
})