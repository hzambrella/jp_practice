//how to use  
//<div id="selector"></div>  $("#selector").boxAlert();

//option
// 'title': 标题,
// 'content':内容,
// 'needConfirm': 是否需要确认按钮。
// 'needCancel': 是否需要取消按钮。注意，为false时，仍然有叉叉按钮。
// 'confirmFunc':确认按钮的执行函数,
// 'cancelFunc':取消按钮和叉叉按钮的执行函数。
//注意，needCancel为false时，若有需要，仍然用cancelFunc设置关闭执行的函数

//和modal.js配合使用：
//实例：
// var $modal = $("#modal").modal()
// $modal.boxAlert({
//     title:"帮助",
//     content:"帮助信息",
//     needCancel:false,
//     confirmCallback:function(){
//         $modal.hideModal();
//     }
// })
// $modal.show();
$.fn.boxAlert = function (options) {
    var defaults_con = "确认？</br>真的确认？"
    var defaults = {
        'title': '确认',
        'content': defaults_con,
        'needConfirm': true,
        'needCancel': true,
        'confirmFunc': function () {
            $(".box_alert").hide()
        },
        'cancelFunc': function () {
            $(".box_alert").hide()
        }
    };


    var setting = $.extend({}, defaults, options);
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
    this.find(".box_alert_cancel").bind("click", function () {
        setting.cancelFunc();
    });

    this.find(".box_alert_confirm").bind("click", function () {
        setting.confirmFunc();
    });
    return this;
}