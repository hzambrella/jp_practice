//dialog:create alert windows to web browser app.

//how to use  
//<div id="selector"></div>  var=$box=$("#selector").dialog();

//options: id:id of dialog box.  title  closeFunc:callback after close box
// _con_HTML:content, _button_HTML:button,_titleButton_HTML:title button

//parameter:options classToAdd: array type ,class you want add to dialog.

//method :
//clearCon:clear content in box
// changeCon:change content in box

//changeTitle
//resetCloseFunc:rebind close function for default close button example:        
// $(selector).resetCloseFunc(function(){
//         $("#close").trigger("click")
// })
$.fn.dialog = function (options, classToAdd) {
    var defaults = {
        'id': 'defaultDialog' + $('.dialog').length,
        'title': 'alert box',
        'closeFunc': function () {
            $(".dialog").hide()
        },
        _con_HTML: '',
        _button_HTML: '',
        _titleButton_HTML: '',
    };

    var setting = $.extend({}, defaults, options);
    classToAdd == null ? classToAdd = [] : classToAdd = classToAdd;
    // _con_HTML != null ? _con_HTML = _con_HTML : _con_HTML = 'this is alert box';
    // _button_HTML != null ? _button_HTML = _button_HTML : _button_HTML = '';
    //  _titleButton_HTML!= null ? _titleButton_HTML = _titleButton_HTML : _titleButton_HTML = '';

    _HTML = "<div id=" + setting.id + " class='dialog'>" +
        "<div class='title'>" +
        "<p>" +
        "<span class='title'>" + setting.title + "</span>" +
        "<span class='titleButton'>" +
        setting._titleButton_HTML +
        "</span>" +
        "<span class='default_cancel' style='float:right;cursor:pointer;padding-right:15px'>X</span>" +
        "</p>" +
        "</div>" +
        "<div class='dialog_con'>" +
        setting._con_HTML +
        "</div>" +
        "<div class='dialog_button'>" +
        setting._button_HTML +
        "</div>" +
        "</div>"
    this.append(_HTML);
    this.find(".default_cancel").bind("click", function () {
        setting.closeFunc();
    });

    for (var i = 0; i < classToAdd.length; i++) {
        this.find("#"+setting.id+"").addClass(classToAdd[i]);
    }

    //方法
    $.fn.clearCon = function () {
        // $(".dialog").find(".dialog_con").remove();
        $(this).find(".dialog_con").remove();
        return this;
    }

    $.fn.changeCon = function (html) {
        //$(".dialog").find(".dialog_con").html(html);
        $(this).find(".dialog_con").html(html);
        return this;
    }

    $.fn.changeTitle = function (title) {
        // $(".dialog .title p span.title").html(title);
        $(this).find(".title p span.title").html(title);
        return this;
    }

    $.fn.changeTitleButton = function (_titleButton_HTML) {
        $(this).find(".title p span.titleButton").html(_titleButton_HTML);
        return this;
    }

    $.fn.resetCloseFunc = function (cb) {
        this.find(".default_cancel").unbind();
        this.find(".default_cancel").bind("click", function () {
            cb()
        });
        return this;
    }

    return this;
}