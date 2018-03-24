// opt:fontSize
$.extend({
    toast: function (message,opt) {
        var defaults={
            fontSize:"1em"
        }

        var setting=$.extend({},defaults,opt)
        clearTimeout(timeOut)
        var timeOut = null
        // $(".toast").css("display","block")
        
        $(".toast").css("opacity","1")
        $(".toast_text").css("font-size",setting.fontSize)
        $(".toast_text").text(message)

        timeOut=setTimeout(function () {
            $(".toast").css("opacity","0")
        }, 1000)
    }
})