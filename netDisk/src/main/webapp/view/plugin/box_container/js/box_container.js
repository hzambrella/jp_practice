//boxContainer:create alert windows to web browser app.
//how to use  
//<div id="selector"></div>  var=$box=$("#selector").boxContainer();
//options: title  closeFunc:to close box
//method :
//clearCon:clear content in box
// changeCon:change content in box
//changeTitle
$.fn.boxContainer = function (options, _con_HTML, _button_HTML) {
    var defaults = {
        'title': 'alert box',
        'closeFunc': function () {
            $(".box_container").hide()
        }
    };

    var setting = $.extend({}, defaults, options);
    _con_HTML != null ? _con_HTML = _con_HTML : _con_HTML = 'this is alert box';
    _button_HTML != null ? _button_HTML = _button_HTML : _button_HTML = '';

    _HTML = "<div class='box_container'>" +
        "<div class='title'>" +
        "<p>" + "<span class='title'>" + setting.title + "</span>" + "<span class='default_cancel' style='float:right;cursor:pointer;padding-right:15px'>X</span></p>" +
        "</div>" +
        "<div class='box_container_con'>" +
        _con_HTML +
        "</div>" +
        "<div class='box_container_button'>" +
        _button_HTML +
        "</div>" +
        "</div>"
    this.append(_HTML);
    this.find(".default_cancel").bind("click", function () {
        setting.closeFunc();
    });

    //方法
    $.fn.clearCon = function () {
        $(".box_container").find(".box_container_con").remove();
        return this;
    }

    $.fn.changeCon = function (html) {
        $(".box_container").find(".box_container_con").html(html);
        return this;
    }

    $.fn.changeTitle = function (title) {
        $(".box_container .title p span.title").html(title);
        return this;
    }

    return this;
}