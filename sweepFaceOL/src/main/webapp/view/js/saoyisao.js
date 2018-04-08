$(function () {
    var $scanimg = $("#scanimg1").scanimg({
        speed_time: 1000
    })
    $(".operate1").click(function (event) {
        var $target = $(event.target);
        // console.log($target)
        if ($target.is("button#test_scan")) {
            $("#result1").html("")
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
        var files = $("#myfile").prop("files");
        if (files.length <= 0) {
            $.toast("请选择一张图片");
            return;
        }
        form = new FormData();
        form.append(files[0].name, files[0]);

        $.ajax({
            url: '/sweepFaceOL/sweepServlet',
            method: 'post',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    getResult(data)
                })
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data)
                $scanimg.scanimg("stop")
                $("#test_scan").enableButton()
            }
        })
    }

    function getResult(data) {
        var $faces = data.map.result.faces
        if ($faces.length < 1) {
            $.toast(" 图片中没有人脸")
            return
        }

        var $attributes = $faces[0].attributes
        //年龄
        var $age = $attributes.age.value
        //性别
        var $gender = $attributes.gender.value
        var $sex = ""
        if ($gender == "Male") {
            $sex = "男"
        } else {
            $sex = "女"
        }

        //颜值
        // male_score:男性认为的此人脸颜值分数。值越大，颜值越高。
        var $forMale = $attributes.beauty.male_score
        // female_score:女性认为的此人脸颜值分数。值越大，颜值越高。
        var $forFeMale = $attributes.beauty.female_score
        //情绪
        var $emotion = $attributes.emotion
        var $emotion_result = getEmotion($emotion)
        console.log($age, $gender, $forMale, $forFeMale, $emotion_result)
        _html = "年龄:" + $age + "</br>" +
            "性别:" + $gender + "</br>" +
            "颜值:" + " 对男性：" + $forMale + "   " + "对女性:" + $forFeMale + "</br>" +
            "情绪(不是很准):" + $emotion_result + "</br>"
        $("#result1").html(_html)
    }

    var map_result = {
        "anger": "愤怒",
        "disgust": "厌恶",
        "fear": "恐惧",
        "happiness": "高兴",
        "neutral": "平静",
        "sadness": "伤心",
        "surprise": "惊讶",
    }
    //情绪结果
    function getEmotion(data) {
        var $score = 0;
        var $likest_emotion = '';
        for (var key in data) {
            if (data[key] > $score) {
                $likest_emotion = key
                $score = data[key]
            }
        }

        return map_result[$likest_emotion]
    }

})