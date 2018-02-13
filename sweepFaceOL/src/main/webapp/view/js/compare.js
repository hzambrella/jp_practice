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


    $(".addImg").click(function (event) {
        var $target = $(event.target)
        console.log(map[$target.attr("id")])
        $(map[$target.attr("id")]).find("input").trigger("click")
    })

    var $scanimg2 = $("#scanimg2").scanimg({
        speed_time: 1000
    })
    var $scanimg3 = $("#scanimg3").scanimg({
        speed_time: 1000
    })
    $(".operate2").click(function (event) {
        var $target = $(event.target);
        // console.log($target)
        if ($target.is("button#test_scan2")) {
            $("#test_scan2").disabledButton()
            getResult()
        } else if ($target.is("button#stop2")) {
            $scanimg2.scanimg("stop")
            $scanimg3.scanimg("stop")
            $("#test_scan2").enableButton()
        }
    })

    function getResult() {
        // $.toast("test_scan")
        $scanimg2.scanimg("scanning")
        $scanimg3.scanimg("scanning")
    }
})