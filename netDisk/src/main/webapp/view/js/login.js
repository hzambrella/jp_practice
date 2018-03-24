$("#login").click(function(){
    doLogin()
})

$("#register").click(function(){
    doRegister()
})

function doLogin() {
    // var formData = new FormData($("#loginForm"));
    // alert(formData)
    var d = {};
    $("input").removeClass("red");
    var t = $('#loginForm').serializeArray();
    $.each(t, function () {
        d[this.name] = this.value;
    });
    
    if(undefined==d["accountLogin"]||d["accountLogin"]==""){
    	$.error_message("账号为空")
        $("#accountLogin").addClass("red")
    	return;
    }
    
    if(undefined==d["passwordLogin"]||d["passwordLogin"]==""){
    	$.error_message("密码为空")
        $("#passwordLogin").addClass("red")
    	return;
    }

    // d["array"] = [{
    //     id:1,
    //     name:"liwei1",
    // },{
    //     id:2,
    //     name:"liwei2",
    // }];
    d["remember"] = $("#remember").prop("checked"); //checkbox是否被选中
    //  ($("#remember"))

    $.ajax({
        type: "POST",
        url: "/netDisk/LoginServlet",
        dataType: "json",
        data:d,
        success: function (data) {
            $.errorForJavaAjaxRes(data, function () {
                location.replace("/netDisk");
            })
        },
        error: function (data, status, e) {
            $.errorForAjaxErr(data)
        }
    })
    // $("#loginForm #account").addClass("red");

}

function doRegister() {
    var d = {};
    var t = $('#registerForm').serializeArray();
    $.each(t, function () {
        d[this.name] = this.value;
    });
    $("input").removeClass("red");
    //  ($("#remember"))
    if(undefined==d["accountRegister"]||d["accountRegister"]==""){
    	$.error_message("账号为空")
        $("#accountRegister").addClass("red")
    	return;
    }
    
    if(undefined==d["nickname"]||d["nickname"]==""){
    	$.error_message("昵称为空")
        $("#nickname").addClass("red")
    	return;
    }
    
    if(undefined==d["passwordRegister"]||d["passwordRegister"]==""){
    	$.error_message("密码为空")
        $("#passwordRegister").addClass("red")
    	return;
    }
    
    if(undefined==d["passwordAgain"]||d["passwordAgain"]==""){
    	$.error_message("再次输入密码为空")
        $("#passwordAgain").addClass("red")
    	return;
    }
    
    if(d["passwordRegister"]!=d["passwordAgain"]){
        $("#passwordRegister").addClass("red")
        $("#passwordAgain").addClass("red")
    	$.error_message("密码两次输入不一致")
    	return;
    }

        $.ajax({
        type: "POST",
        url: "/netDisk/RegisterServlet",
        dataType: "json",
        data:d,
        success: function (data) {
            $.errorForJavaAjaxRes(data, function () {
            	location.replace("/netDisk");
            })
        },
        error: function (data, status, e) {
            $.errorForAjaxErr(data)
        }
    })

    // $.error_message(JSON.stringify(d));
    //  $(".input.red").removeClass("red");
}

$.extend({
    error_message: function (mess) {
        $("#error_message").html(mess);
    },

    errorForAjaxErr: function (data) {
        var message = ""
        if ((data.statusText == "timeout" || data.statusText == "error") && data.status == 0) {
            $("#error_message").html("服务器无法链接接，请检查网络或稍后再试")
        } else {
            $("#error_message").html("系统服务器异常，请稍候再试")
        }
    },

    //服务端需要定义response数据格式，code为状态码，message为信息。
    errorForJavaAjaxRes: function (data, callback) {
        //console.log(data,data.code)
        if (data.code != 200) {
            $("#error_message").html(data.message)
        } else {
            callback()
        }
    },
})