
//废弃。采用tringle
$.widget("custom.imgFileInput", {
    options: {
        height: 0,
        width: 0,
        imgCover: "../images/addPic.png",
    },
    //绑定onchange事件
    _create: function (opt) {
        var $el = $(this.element),
            opt=this.options;
        $el.addClass("fileInputContainer")
        // console.log(opt)
        // if (opt != undefined) {
        //     this.options.height = 'height' in opt ? opt.height : 0
        //     this.options.width = 'width' in opt ? opt.width : 0
        //     this.options.imgCover = 'imgCover' in opt ? opt.imgCover : "../images/addPic.png"
        // }

        console.log(this.options)
        $el.height(opt.height)
        $el.width(opt.width)
        $el.css("background-image", "url(" + this.options.imgCover + ")");

        var $input=$el.find("input[type='file']");
        console.log($input)
        $input.addClass("fileInput")
        $input.height(opt.height)
         $input.width(opt.height)
    },
})