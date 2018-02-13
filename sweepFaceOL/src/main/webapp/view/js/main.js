//按钮防连击和解除
;
(function ($, window, document, undefined) {
    //首先定义构造函数
    var buttonPlugin = function (el, opt) {
        this.$element = el
        // this.defaults = {
        //     'class': 'green',
        //     'fontSize': '2.5em',
        //     'fontStyle': 'italic',
        // };
        // this.options = $.extend({}, this.defaults, opt)
    }

    //然后定义方法
    buttonPlugin.prototype = {
        disabled: function () {
            return this.$element.addClass('disabled').attr("disabled", "true");
        },

        enable: function () {
            return this.$element.removeClass('disabled').removeAttr("disabled");
        }
    }

    //最后定义对外接口
    $.fn.disabledButton = function (options) {
        //创建Beautifier的实体
        var buttonIns = new buttonPlugin(this, options);
        //调用其方法
        return buttonIns.disabled();
    }

    $.fn.enableButton = function (options) {
        //创建Beautifier的实体
        var buttonIns = new buttonPlugin(this, options);
        //调用其方法
        return buttonIns.enable();
    }
})(jQuery, window, document);