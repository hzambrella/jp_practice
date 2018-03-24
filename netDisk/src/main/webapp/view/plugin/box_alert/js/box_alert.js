//how to use  
//<div id="selector"></div>  $("#selector").boxAlert();
$.fn.boxAlert = function (options) {
    var defaults_con = "确认？</br>真的确认？"
    var defaults = {
        'title': '确认',
        'content': defaults_con,
        'needConfirm': true,
        'needCancel': true,
        'confirmFunc':function(){$(".box_alert").hide()},
        'cancelFunc':function(){$(".box_alert").hide()}
    };


    var setting = $.extend({},defaults, options);
    var _button_HTML = "";
    var _confirm_button_HTML = "<a href='javascript:void(0)' class='box_alert_confirm'>确认</a>"
    var _cancel_button_HTML = "<a class='box_alert_cancel' href='javascript:void(0)' id='alertCancel'>取消</a>"
    if (setting.needConfirm) {
        _button_HTML = _button_HTML + _confirm_button_HTML;
    }

    if (setting.needCancel) {
        _button_HTML = _button_HTML + _cancel_button_HTML
    }

    _HTML = "<div class='box_alert'>" +
        "<div class='alert_title'>" +
        "<p>" + setting.title + "<span class='box_alert_cancel' style='float:right;cursor:pointer;padding-right:15px'>X</span></p>" +
        "</div>" +
        "<div class='alert_con'>" +
        setting.content +
        "</div>" +
        "<div class='alert_button'>" +
        _button_HTML +
        "</div>" +
        "</div>"
    this.append(_HTML);
    this.find(".box_alert_cancel").bind("click",function(){
        setting.cancelFunc();
    });

    this.find(".box_alert_confirm").bind("click",function(){
        setting.confirmFunc();
    });
    return this;
}