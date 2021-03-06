$(function () {
    //...静态变量和全局变量...
    //左边--item-title
    var titleMap = {
        "allFile": "全部文件",
        "imageFile": "图片",
        "textFile": "文档",
        "recycleFile": "回收站",
    }
    //AjaxCd的状态。
    var LoadingAjaxCd = "正在获取中...."
    //按钮禁用/启用
    var disabledButtonFlag = false;
    var jqueryTreeScrollHeight = "200px"

    //文件目录树，用于复制到和移动到功能

    //...初始化...
    //初始化模态modal (蒙版)
    //弹框
    var $modal = $("#modal").modal()
    // 目录树蒙板
    var $modalDirTree = null

    //初始化化容量条
    var $sizeBar = $("#size_progress_bar").progressbar({
        text_default: "0G/100G",
    });
    $sizeBar.setProgress(0.5, "50G/100G")
    // scrollsXY("#file-list-table")

    $(document).ready(function () {
        $("#allFile").trigger("click")
    });

    //初始化模板
    //根据后缀判断文件类型
    template.registerModifier('fileType', function (str) {
        if (str == "folder") {
            return "fa fa-folder-o"
        }
        var type = getFileTypeBySuffix(str)

        var draw = 'fa fa-file-o';
        switch (type) {
            case 'image':
                draw = 'fa fa-file-image-o';
                break;
            case 'video':
                draw = 'fa fa-file-video-o';
                break;
            case 'document':
                //console.log(str)
                if (str == "pdf") {
                    draw = 'fa fa-file-pdf-o';
                } else if (str == "xls" || str == "xlsx") {
                    draw = 'fa fa-file-excel-o';
                } else if (str == "doc" || str == "docx") {
                    draw = "fa fa-file-word-o";
                } else {
                    draw = "fa fa-file-o"
                }
                break;
            case 'music':
                draw = 'fa fa-file-sound-o';
                break;
        }

        if (str == 'zip') {
            draw = 'fa fa-file-zip-o'
        }
        return draw
    });



    //...状态管理...
    //获得左边选中的按钮的id
    function GetItemId() {
        return $(".con-left .item-list").find(".select").prop("id")
    }

    //获得右边表格checkbox选中数量
    function GetSelectNum() {
        return $(".selectFile:checked").length
    }

    //更新和显示右边表格checkbox选中的数量,并且在此管理一些部件。 action 特定的操作。
    function ShowSelectNum(action) {
        num = GetSelectNum();
        if (num > 0) {
            $("#selectFileNum").html("(已选中" + num + "个)");
        } else {
            $("#selectFileNum").html("文件名");
            $("#selectAllList").prop("checked", false)
        }
        //默认的
        // //console.log(action)
        if (action == null) {
            //隐藏操作栏
            if (num <= 0) {
                showOrHideOperateBar(false)
            } else {
                showOrHideOperateBar(true)
            }
            //选中大于1时禁止重命名
            enableRename(num <= 1);

            //选中大于1时或选中文件夹时禁止下载按钮
            if (num > 1) {
                enableDownload(false);
            } else if (num == 1) {
                console.log($(".selectFile:checked").siblings("span").attr("filetype"))
                enableDownload($(".selectFile:checked").siblings("span").attr("filetype") != "folder")
            }

        } else {
            action(num);
        }
        // if (num<=1){
        //     $("#renameFile").removeClass("disabled");
        // }else{
        //     $("#renameFile").addClass("disabled");
        // }

        if (GetItemId() != "recycleFile") {
            $(".operate #doRecycle").remove();
        }
        return num;
    }

    //管理目录深度层次的数组。数组内容是目录层次。
    var dirStack = {
        data: [],
        //用于打印
        toString: function () {
            var str = ""
            for (var i = 0; i < this.data.length; i++) {
                str += "/" + this.data[i]
            }
            return str;
        },
        //给ajax提供目录,用于向后端请求 /xx/xx 。
        getDirForAjax: function () {
            var str = "";
            //data[0]是放的左边栏的标题。所以这里忽略掉。
            for (var i = 1; i < this.data.length; i++) {
                str += "/" + this.data[i]
            }
            return str;
        },
        reset: function (title) {
            this.data = [];
            if (title != null) {
                this.data[0] = title;
            }
            return this;
        },
        push: function (title) {
            this.data.push(title)
        },
        pop: function () {
            return this.data.pop()
        },
        getDataMirror: function () {
            var mirror = this.data.slice();
            return mirror;
        },
        rollBack: function (mirror) {
            data = mirror.slice();
        }
    };

    //通过左边栏、文件深度，更新右边表格的 item title
    //title为null ,back_num=0或为null时，就是直接到初始层。用于左边栏切换。title不为空时，代表到目录/title[0]/title[1]/...。
    //back_num>0时，就是往上层。back_num意味着往上多少。结合.file-list-table的data-deep属性。若超出了data-deep，就回到最初层。title为空。
    //back_num<0时，就是往下一层。title是目录名。注意！单层格式是 title  多层格式是 [title1,title2]。向下的层数只和title有关。
    //无论那种情况，都要操作dirStack。别的地方不可操作这个对象

    //返回:对象类型  obj.dirname 目录名字  obj._backupHTML  改变前的html，用于ajax失败后恢复。
    //mirror 改变前的dirStack,ajax失败后，dirStack.rollBack(mirror)恢复原始状态。
    //ajax在外层写，写在这个函数后面。
    function ChangeItemTitle(back_num, title) {
        back_num == null ? back_num = 0 : back_num = back_num;
        //向下单层是字符串，为了方便下面处理转为数组


        //备份,ajax失败后可用于恢复$(".item-title").html(_backupHTML);
        var _backupHTML = $(".item-title").html();
        var mirror = dirStack.getDataMirror();

        if (back_num == 0) {
            //title为null ,back_num<0或为null时，就是直接到初始层。用于左边栏切换。
            var itemTitle = titleMap[GetItemId()];
            $("#itemTitle").html(itemTitle)
            $(".item-title ul").empty();
            $("#gobackToLast").remove();
            dirStack.reset(itemTitle)
            if (title != null) {
                if (title.constructor != Array) {
                    title = [title];
                }
                getNextDir()
            }
        } else if (back_num < 0) {
            //back_num<0时，就是往下一层。title是目录名。
            if (title != null) {
                if (title.constructor != Array) {
                    title = [title];
                }
                getNextDir()
            }
        } else if (back_num > 0) {
            var pretitle = ""
            $lis = $(".item-title ul").find("li")
            $lis.each(function () {
                var data_deep = parseInt($(this).find("a").attr("data-deep"))
                if (-data_deep <= back_num) {
                    if (-data_deep == back_num) {
                        pretitle = $(this).find("a").html();
                    }
                    $(this).remove()
                    dirStack.pop();
                } else {
                    $(this).find("a").attr("data-deep", data_deep + 1)
                }
            })
            $("#itemTitle ").html(pretitle);
            $lis = $(".item-title ul").find("li")
            if ($lis.length == 0) {
                $("#gobackToLast").remove();
            }
        }
        return {
            dirname: dirStack.getDirForAjax(),
            _backupHTML: _backupHTML,
            mirror: mirror,
        }

        function getNextDir() {
            for (var i = 0; i < title.length; i++) {

                //原来的当前目录
                var preTitle = $("#itemTitle").html();

                //原来的data-deep -1
                var $lis = $(".item-title ul").find("li")
                $lis.each(function () {
                    var data_deep = $(this).find("a").attr("data-deep")
                    $(this).find("a").attr("data-deep", parseInt(data_deep) - 1)
                })

                //返回上一级按钮
                var $gobackToLast = $(".item-title").find("#gobackToLast");
                if ($gobackToLast.length == 0) {
                    var _gobackHTML = "<a id='gobackToLast' data-deep='-1' class='a_block dir_go_back' href='javascript:void(0)'>" +
                        "返回上一级<span class='EKIHPEb'>|</span></a>";
                    $(".item-title ul").prepend(_gobackHTML)
                }

                //原来的title变成a
                var _nextHTML = "<li><a data-deep='-1' class='a_block dir_go_back' href='javascript:void(0)'>" +
                    preTitle +
                    "</a><span class='KLxwHFb'>></span></li>"
                $(".item-title ul").append(_nextHTML)
                //设置title
                $("#itemTitle ").html(title[i]);

                //data-deep
                // var dataDeep = $("#file-list-table").attr("data-deep")
                // $("#file-list-table").attr("data-deep",parseInt(dataDeep) + 1);

                dirStack.push(title[i]);
            }
        }
    }

    function getItemTitle() {
        var _backupHTML = $(".item-title").html();
        var mirror = dirStack.getDataMirror();
        return {
            dirname: dirStack.getDirForAjax(),
            _backupHTML: _backupHTML,
            mirror: mirror,
        }
    }

    //状态栏的click事件 返回上层目录和返回上层文件
    $(".item-title").click(function (event) {
        $target = $(event.target);
        // //console.log($target)
        if ($target.is("a.dir_go_back") || $target.is("a#gobackToLast.dir_go_back")) {
            var dataDeep = $target.attr("data-deep")
            var obj = ChangeItemTitle(-dataDeep)

            AjaxCd(obj, function () {
                //do nothing
            }, function () {
                //fail 

            });
            // //console.log(obj)

        } else {
            return
        }
    })

    //...上边...//
    //..用户管理..
    $("#logout").click(function () {
        AjaxLogout()
    })

    $("#helpCenter").click(function () {
        $modal.boxAlert({
            title: "帮助",
            content: "敬请期待v2版本!!<br/> 新内容：自动重命名，排序，查看个人信息，归类，回收站，查看容量，文件类型精细判断，多文件下载",
            needCancel: false,
            confirmFunc: function () {
                $modal.hideModal();
            },
            cancelFunc: function () {
                $modal.hideModal();
            },
        })
        $modal.show();
    })

    $("#personalInfo").click(function () {
        $modal.boxAlert({
            title: "个人信息",
            content: "暂无",
            needCancel: false,
            confirmFunc: function () {
                $modal.hideModal();
            },
            cancelFunc: function () {
                $modal.hideModal();
            },
        })
        $modal.show();
    })

    //...左边...

    //条目
    $(".item-list").click(function (event) {
        var $target = $(event.target);
        // //console.log($target.prop("id"));
        // //console.log($target)

        //已选中的就return
        if ($target.hasClass("select")) {
            return;
        }

        if (!disabledButtonFlag) {
            $(".item-list").find("a").removeClass("select")
            $target.addClass("select");


            if ($target.prop("id") == "allFile") {

                AjaxCd(ChangeItemTitle(),
                    function () {

                    },
                    function () {

                    });
            } else {
                alert("尊敬的用户，查看" + titleMap[GetItemId()] + "功能正在开发中，敬请期待");
                drawFileTable({
                    directory: []
                });
            };
        }
    })

    //...右边...
    //..checkbox控制..
    //checkbox全选和单选控制
    $("#file-list-table").click(function (event) {
        var $target = $(event.target);
        // //console.log($target,$target.is("input#selectAllList"));

        //选中时触发的事件
        var checkboxAction = null

        //回收站选中checkbox时触发的事假不一样
        if (GetItemId() == "recycleFile") {
            checkboxAction = function (num) {
                if (num <= 0) {
                    $(".operate #doRecycle").remove();
                } else {
                    //console.log($(".operate .operate-file #doRecycle"))
                    if ($(".operate #doRecycle").length == 0) {
                        $(".operate").append("<a id='doRecycle' class='a_block operate-common' href='javascript:void(0)'><i class='fa fa-recycle'></i>还原</a>")
                        $(".operate #doRecycle").bind("click", doRecycle)
                    }
                }
            }
        }

        if ($target.is("input#selectAllList")) {
            $(".tbcol-1 .selectFile").prop("checked", $(event.target).prop("checked"));
            ShowSelectNum(checkboxAction);
        } else if ($target.is("input.selectFile")) {
            ShowSelectNum(checkboxAction);
        }
    })


    //..表格控制..
    //  清除原有内容，将新内容绘入表格。dataDeep是文件深度。
    //#file-list-table的属性data-deep在drawFileTable函数操作。外层不准操作！！！ 
    function drawFileTable(data, dataDeep) {
        dataDeep == null ? dataDeep = 0 : dataDeep = dataDeep;
        //        //console.log(resultList)
        //        var resultList=resultList;

        //清空原有内容
        $("#file-list-table").find("tr").not(".table-title").remove();
        //新内容渲染模板
        var table_tpl = document.getElementById("table_tpl").innerHTML;
        var _HTML = template(table_tpl, data)
        // //console.log(_HTML);
        $("#file-list-table").append(_HTML);
        //刷新状态
        ShowSelectNum()
        $("#file-list-table").attr("data-deep", dataDeep)
    }

    // 重名控制TODO
    function dealDupName(name) {
        // var name=name;
        // $target = $("#file-list-table .tbcol-1 span")
        // $.each($target, function () {
        //     if ($(this).html() == name) {
        //         reg = /\b\([\s\S]*\)$/;
        //         var st = reg.exec(name)
        //          //console.log(st,name)
        //         if (st!=null&&st.length != 0) {
        //             var st1 = st[0];
        //             var st2 = st1.substring(1, st1.length).substring(0, st1.length - 1)
        //             i=parseInt(st2) + 1;
        //             name = dealDupName(name.replace(reg,"("+i+")"));
        //         }else{
        //             //console.log(22)
        //             name=dealDupName(name+"("+1+")");
        //         }
        //     }
        // })
        return name;
    }

    //表格click控制,即选中这行,th是排序
    var tabClickTimer = null //解决单双击冲突
    $("#file-list-table").click(function (event) {
        clearTimeout(tabClickTimer)
        var $target = $(event.target);
        // //console.log($target)
        //checkbox有单独的事件，排除掉
        if ($target.is("input.selectFile")) {
            //do nothing
            return
        }

        tabClickTimer = setTimeout(function () {
            if ($target.is("th")) {
                alert("尊敬的用户，排序功能敬请期待")
            } else {
                //选中这行
                $target.parent().find(".selectFile").trigger("click");
            }
        }, 200)
    })

    //双击表格中的元素时，调到下一层目录
    $("#file-list-table").dblclick(function (event) {
        clearTimeout(tabClickTimer)
        var $target = $(event.target);

        //checkbox有单独的事件，排除掉
        if ($target.is("input.selectFile")) {
            //do nothing
            return
        }

        //非文件夹
        if ($target.parent().find("span").attr("filetype") != "folder") {
            return
        }

        //回收站不能双击进入下一层目录
        if (GetItemId() == "recycleFile") {
            return
        }

        tabClickTimer = setTimeout(function () {
            if ($target.is("th")) {
                //do nothing
            } else {
                //下一页
                //ChangeItemTitle(0,"111");
                var obj = ChangeItemTitle(-1, $target.parent().find("span").html());
                AjaxCd(obj, function () {
                    //do nothing
                }, function () {
                    //fail 
                });
            }
        }, 200)
    })

    //..操作栏控制..
    // 操作栏隐藏和显示。true为显示
    function showOrHideOperateBar(show) {
        if (show) {
            $(".operate ul").removeClass("hide");
        } else {
            $(".operate ul").addClass("hide");
        }
    }

    //上传按钮
    $("#uploadFile").click(function () {
        $("#fileUploadInput").trigger("click")
    })

    //上传文件
    //当文件上传成功后，给tr加上complete class,来统计成功数量。失败的话加上fail class，来统计失败的数量。
    var countUpload = 0; //为了更新上传会话框的文件状态而设置。为了方便选择，表中每行class为 file_第几个文件_countUpload，来区分重名的文件。
    $("#fileUploadInput").change(function () {
        //console.log("文件上传", $("#fileUploadInput").prop("files"))
        files = $("#fileUploadInput").prop("files");
        var list = [];

        if (files.length != 0) {
            countUpload++;
            var countUploadLocal = countUpload;
            var form = new FormData();
            form.append("dirName", dirStack.getDirForAjax());

            for (var i = 0; i < files.length; i++) {
                form.append(files[i].name, files[i]);
                list.push({
                    name: files[i].name,
                    size: formatFileSize(files[i].size),
                    target: dirStack.toString(),
                    countUpload: countUploadLocal,
                })
            }

            drawUploadTable(list)
            var getProgree
            var time = 500 //轮询间隔 0.5秒
            var lastID = 0; //上个轮询的item。用处是上个item的百分比未到100%时，数据是下一个item时，更新前面的为100%。
            var isDoPollFlag = false; //是否真的做了轮询，防止文件小传的太快了，没能更新会话框。

            AjaxFileUpload(form, function () {
                clearInterval(getProgree)
                changeFileUploadTitle();
                //怕文件小太快了，来不及轮询
                if (!isDoPollFlag) {
                    for (var k = 0; k < list.length; k++) {
                        var s = "file_" + k + "_" + countUploadLocal;
                        $("." + s).find(".status").html("ok");
                        $("." + s).removeClass("fail");
                        $("." + s).addClass("complete");
                    }
                    changeFileUploadTitle();
                }
            }, function () {
                clearInterval(getProgree)
                setTimeout(function () {
                    changeFileUploadTitle("上传文件失败");
                    for (var j = lastID; j < i; j++) {
                        var s = "file_" + j + "_" + countUploadLocal;
                        $("." + s).find(".status").html("上传失败");
                        $("." + s).addClass("fail");
                        $("." + s).removeClass("complete");
                    }
                }, 200)

            })

            //轮询来查看进度
            getProgree = setInterval(function () {
                AjaxProgress(function (data) {
                    if (data.map.item == undefined || data.map.item == null) {
                        return;
                    }
                    //data.map.item=2代表第一个文件
                    var i = data.map.item - 2;

                    var classForSelect = "file_" + i + "_" + countUploadLocal;
                    $toChangeTr = $("." + classForSelect);

                    data.map.percent == null ? data.map.percent = 0 : data.map.percent = data.map.percent;
                    if (data.map.percent == 100) {
                        $toChangeTr.find(".status").html("ok");
                        $("." + s).removeClass("fail");
                        $toChangeTr.addClass("complete");
                    } else {
                        $toChangeTr.find(".status").html(data.map.percent + "%");
                    }


                    //前面文件轮询错过了到100%的结果时，更新到100%
                    if (i != lastID) {
                        for (var j = lastID; j < i; j++) {
                            var s = "file_" + j + "_" + countUploadLocal;
                            $("." + s).find(".status").html("ok");
                            $("." + s).removeClass("fail");
                            $("." + s).addClass("complete");
                        }
                    }

                    lastID = i
                    changeFileUploadTitle();
                    isDoPollFlag = true;
                    //若最后一个文件100%，结束轮询
                    if (data.map.item - 1 == list.length && data.map.percent == 100) {
                        clearInterval(getProgree)
                        changeFileUploadTitle("上传完毕，正在等待上传结果中...")
                    }
                    //console.log(data.map.percent, data.map.item);
                })
            }, time)


        }

        //上传文件时会话框里面表格
        function drawUploadTable(list) {
            //TODO:fileName and fileSize
            var data = {
                list: [],
            }
            data.list = list
            var table_tpl = document.getElementById("mock_upload_table").innerHTML;
            var _HTML = template(table_tpl, data);


            $uploadDialog = $("#uploadDialog")
            if ($uploadDialog.length == 0) {
                var _tableHTML =
                    '<table id="uploadTable">' +
                    '<tr class="table_title">' +
                    '<th>文件(夹)名</th>' +
                    ' <th>大小</th>' +
                    '<th>上传目录</th>' +
                    '<th>状态</th>' +
                    '</tr>' +
                    _HTML +
                    '</table>'

                $('body').dialog({
                    id: 'uploadDialog',
                    title: '正在上传(0/' + list.length + ')个文件',
                    _con_HTML: _tableHTML,
                }, ['dialog_upload'])

                $("#uploadDialog").resetCloseFunc(function () {
                    $("#uploadDialog").remove();
                })
            } else {
                // var totalLen = getFileUploadTotalLen();
                // //当文件上传成功后，给tr加上complete class,来表示成功数量
                // var successLen = getFileUploadSuccessLen();
                changeFileUploadTitle();
                // var title = '正在上传(' + successLen + '/' + totalLen + ')个文件';
                $("#uploadDialog").find("#uploadTable").append(_HTML);
                // $("#uploadDialog").changeTitle(title);
                $("#uploadDialog").show();
            }
            //TODO:ajax
        }
    })

    //更改上传会话框的题目
    function changeFileUploadTitle(title) {
        if (title != null) {
            $("#uploadDialog").changeTitle(title);
            return
        }

        var total = getFileUploadTotalLen()
        var success = getFileUploadSuccessLen()
        if (total == success) {
            $("#uploadDialog").changeTitle("上传完成");
        } else {
            var title = '正在上传(' + success + '/' + total + ')个文件';
            $("#uploadDialog").changeTitle(title);
        }

        //获得上传文件的总数量
        function getFileUploadTotalLen() {
            return $("#uploadDialog").find("#uploadTable").find(".list").length;
        }

        //获得上传成功的数量
        function getFileUploadSuccessLen() {
            return $("#uploadDialog").find("#uploadTable").find(".complete").length;
        }
    }

    // function setFileUploadSuccess(){

    // }

    //新建文件夹按钮
    $("#newFolder").click(function (event) {
        // prepend

        //TODO:重名控制
        var date = new Date();
        dateStr = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
        resultList = {
            directory: [{
                name: dealDupName("新建文件夹"),
                size: "0KB",
                modifiedTime: dateStr,
                type: 'folder',
            }]
        }

        var table_tpl = document.getElementById("table_tpl").innerHTML;
        var _HTML = template(table_tpl, resultList);
        $("#file-list-table .table-title").after(_HTML);
        $target = $("#file-list-table .table-title").next().find(".tbcol-1")
        rename($target, $target.find("span"),
            //confirm_callback
            function (filename, cb) {
                //do ajax  if fail,cancel。后端将文件名字发送回来。
                dirname = dirStack.getDirForAjax();
                AjaxMkdir(dirname, filename, cb, cancel)
            },
            //cancel_callback
            function () {
                cancel()
            })

        function cancel() {
            $("#file-list-table .table-title").next().remove();
        }
    })


    //下载按钮
    $("#downloadFile").click(function (event) {
        var $checked_el = $("#file-list-table .selectFile:checked");
        var names = [];
        $checked_el.each(function () {
            var name = $(this).siblings("span").html()
            names.push(name)
        })
        //TODO：confirm
        //TODO：download
        // alert("下载" + names + "完毕！");   // alert("下载" + names + "完毕！");
        downloadFileByForm(dirStack.getDirForAjax(), names[0]);
    })

    function downloadFileByForm(dirname, fileName) {
        dirname == null ? dirname = "" : dirname = dirname;
        if (fileName == null) {
            $.toast("待下载文件名为空")
            return;
        }
        var url = "/netDisk/DownloadServlet";

        var form = $("<form></form>").attr("action", url).attr("method", "post");
        form.append($("<input></input>").attr("type", "hidden").attr("name", "fileName").attr("value", fileName));
        form.append($("<input></input>").attr("type", "hidden").attr("name", "dirName").attr("value", dirname));
        form.appendTo('body').submit().remove();
    }

    //删除按钮
    $("#deleteFile").click(function (event) {
        var $checked_el = $("#file-list-table .selectFile:checked");
        var tbcolToDelete = [];
        var names = [];
        $checked_el.each(function () {
            tbcolToDelete.push($(this).parent().parent().parent())
            var name = $(this).siblings("span").html()
            names.push(name)
        })

        //确认
        var modalOpt = {
            'title': '确认删除',
            'content': "确认要把所选的" + GetSelectNum() + "个文件放入回收站吗?<br/> 删除的文件可在10天内通过回收站还原",
            'confirmFunc': function () {
                $modal.hideModal();

                AjaxDelete(dirStack.getDirForAjax(), names, function (data) {
                    var failIds = data.map.failIds;
                    var failNameStr = "";
                    for (i = 0; i < tbcolToDelete.length; i++) {
                        if (failIds[i] == null || failIds[i] == "") {
                            tbcolToDelete[i].remove();
                        } else {
                            failNameStr += names[i] + "(原因:" + failIds[i] + ")<br/>";
                        }
                    }
                    if (failNameStr != "") {
                        // $.toast('文件' + failNameStr + '删除失败')
                        $modal.boxAlert({
                            'title': '部分文件删除失败',
                            'content': failNameStr,
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            },
                            cancelFunc: function () {
                                $modal.hideModal();
                            },
                        })
                        $modal.show();
                    } else {
                        $.toast('文件删除成功')
                    }

                    ShowSelectNum();
                    showOrHideOperateBar(false);
                }, function () {
                    ShowSelectNum();
                    showOrHideOperateBar(false);
                })
                //$modal.children().remove()

            },
            'cancelFunc': function () {
                //$modal.children().remove()
                $modal.hideModal();
            }
        }
        $modal.boxAlert(modalOpt);
        $modal.show();
        //TODO：ajax
    })

    //重命名按钮
    $("#renameFile").click(function (event) {
        var $target = $("#file-list-table .selectFile:checked").parent() //<div class="tbcol-1">
        var $name_el = $("#file-list-table .selectFile:checked").siblings("span")

        rename($target, $name_el, function (newName, cb) {
            dirname = dirStack.getDirForAjax()
            orgName = $name_el.html();
            AjaxRename(dirname, orgName, newName, cb)
        })
    })

    function rename($target, $name_el, confirm_callback, cancel_callback) {
        var name = $name_el.html();
        var type = $name_el.attr("filetype")
        $name_el.remove();
        var table_rename_tpl = document.getElementById("table_rename").innerHTML;
        var _HTML = template(table_rename_tpl, {
            "name": name,
        });
        disabledAllButton()
        $target.append(_HTML);
        //让input 选中状态
        $target.find("input").select().focus();

        $target.find(".rename_cancel").bind("click", function () {
            dorename(name)
            cancel_callback == null ? function () {} : cancel_callback();
        });

        $target.find(".rename_confirm").bind("click", function () {
            var new_name = $target.find(".rename_input").val();
            confirm_callback == null ? dorename(new_name) : confirm_callback(new_name, function () {
                dorename(new_name)
            })
        });

        function dorename(new_name) {
            $target.find("div.rename").remove();
            $target.append("<span filetype='" + type + "'" + ">" + new_name + "</span>");
            enableAllButton();
            return new_name;
        }
    }

    //复制到，移动到按钮
    $("a#moveFile,a#copyFile").click(function (event) {
        $target = $(event.target);
        var $checked_el = $("#file-list-table .selectFile:checked");
        var tbcolToDelete = [];
        var names = [];
        $checked_el.each(function () {
            // tbcolToDelete.push($(this).parent().parent().parent())
            var name = $(this).siblings("span").html()
            names.push(name)
        })


        var _dirTreeButtonHTML = $("#mock_dir_tree_button").html()
        AjaxGetDirTree(function (dirTree) {
            var _dirTreeHTML = drawDirTreeUl(jqueryTreeScrollHeight, dirTree)

            //lazy single
            if ($modalDirTree == null) {
                $modalDirTree = $("#modalDirTree").modal()
                $modalDirTree.dialog({
                    closeFunc: function () {
                        $modalDirTree.hide();
                        $(".dialog").hide();
                    },
                    _con_HTML: _dirTreeHTML,
                    _button_HTML: _dirTreeButtonHTML,
                });
                jqueryTreeScroll(120)
            } else {
                $modalDirTree.changeCon(_dirTreeHTML);
                jqueryTreeScroll(120)
            }


            if ($target.is("a#moveFile")) {
                $modalDirTree.changeTitle("移动到")
            } else if ($target.is("a#copyFile")) {
                $modalDirTree.changeTitle("复制到")
            }

            //默认的叉叉按钮重新绑定事件
            $modalDirTree.resetCloseFunc(function () {
                $("#dirTreeCancel").trigger("click")
            })

            $modalDirTree.find("a[data-deep='0']").addClass("ontree")

            $(".dialog .dialog_con").addClass("border_grey_solid")
            $(".dialog .dialog_button").addClass("dialog_button_dirTree")

            $("#dirTreeNewFolder").unbind();
            $("#dirTreeNewFolder").bind("click", function () {
                $ontree = $modalDirTree.find(".ontree");
                if ($ontree.length == 0) {
                    $.toast("请先选择一个文件夹")
                    return
                }

                if ($ontree) {
                    dirTreeNewFolder($ontree, function (newDir, newFolderName,successcb,failcb) {
                        AjaxMkdir(newDir, newFolderName,successcb,failcb)
                    })
                }
            })

            $modalDirTree.show()

            var confirmCallback = null;
            if ($target.is("a#moveFile")) {
                confirmCallback = moveFileConfirmCallback
            } else if ($target.is("a#copyFile")) {
                confirmCallback = copyConfirmCallback
            }

            rebindConfirmAndCancelEventForDirTreeButton(confirmCallback)

            function moveFileConfirmCallback() {
                var absolutePath = $(".treebox .tree").find(".ontree").attr("title")
                orgDirName = dirStack.getDirForAjax();
                AjaxMoveTo(orgDirName, absolutePath, names, function (data) {
                    var failIds = data.map.failIds;
                    var failNameStr = "";
                    for (i = 0; i < names.length; i++) {
                        if (failIds[i] == null || failIds[i] == "") {

                        } else {
                            failNameStr += names[i] + "(原因:" + failIds[i] + ")<br/>";
                        }
                    }

                    if (failNameStr != "") {
                        // $.toast('文件' + failNameStr + '删除失败')
                        $modal.boxAlert({
                            'title': '部分文件移动失败',
                            'content': failNameStr,
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            },
                            cancelFunc: function () {
                                $modal.hideModal();
                            },
                        })
                        $modal.show();
                    } else {
                        // $.toast('文件转移成功')
                        $modal.boxAlert({
                            'title': '文件转移成功',
                            'content': '文件转移成功',
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            },
                            cancelFunc: function () {
                                $modal.hideModal();
                            },
                        })
                        $modal.show();
                    }

                    //刷新列表的数据
                    AjaxCd(getItemTitle())
                })

            }

            function copyConfirmCallback() {
                var absolutePath = $(".treebox .tree").find(".ontree").attr("title")
                orgDirName = dirStack.getDirForAjax();
                AjaxCopyTo(orgDirName, absolutePath, names, function (data) {
                    var failIds = data.map.failIds;
                    var failNameStr = "";
                    for (i = 0; i < names.length; i++) {
                        if (failIds[i] == null || failIds[i] == "") {

                        } else {
                            failNameStr += names[i] + "(原因:" + failIds[i] + ")<br/>";
                        }
                    }

                    // //console.log(failNameStr)
                    if (failNameStr != "") {
                        $modal.boxAlert({
                            'title': '部分文件复制失败',
                            'content': failNameStr,
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            },
                            cancelFunc: function () {
                                $modal.hideModal();
                            },
                        })
                        $modal.show();
                    } else {
                        $modal.boxAlert({
                            'title': '文件复制成功',
                            'content': '文件复制成功',
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            },
                            cancelFunc: function () {
                                $modal.hideModal();
                            },
                        })
                        $modal.show();
                    }

                    //刷新列表的数据
                    AjaxCd(getItemTitle())
                })
            }
        })
    })

    //从目录树中获得完整的目录 bug
    // function getAbsolutePathFromDirTree() {
    //     $ontree = $(".treebox .tree").find(".ontree")
    //     return $ontree.attr("title")
    // }

    //重新绑定目录树box的确认和取消按钮事件
    function rebindConfirmAndCancelEventForDirTreeButton(confirmCallback, cancelCallback) {
        confirmCallback == null ? confirmCallback = function () {} : confirmCallback = confirmCallback;
        cancelCallback == null ? cancelCallback = function () {} : cancelCallback = cancelCallback;
        $("#dirTreeConfirm").unbind();
        $("#dirTreeCancel").unbind();
        $("#dirTreeConfirm").bind("click", function () {
            $modalDirTree.hide();
            confirmCallback();
        })

        $("#dirTreeCancel").bind("click", function () {
            $modalDirTree.hide();
            cancelCallback();
        })
    }

    //还原按钮
    function doRecycle() {
        var $checked_el = $("#file-list-table .selectFile:checked");
        var tbcolToDelete = [];
        var names = [];
        $checked_el.each(function () {
            tbcolToDelete.push($(this).parent().parent().parent())
            var name = $(this).siblings("span").html()
            names.push(name)
        })

        //确认
        var modalOpt = {
            'title': '确认还原',
            'content': "确认要把所选的" + GetSelectNum() + "个文件还原吗?",
            'confirmFunc': function () {
                //TODO：ajax
                for (i = 0; i < tbcolToDelete.length; i++) {
                    tbcolToDelete[i].remove();
                }

                //$modal.children().remove()
                $modal.hideModal();
                ShowSelectNum();
                $("#doRecycle").remove();
            },
            'cancelFunc': function () {
                //$modal.children().remove()
                $modal.hideModal();
            }
        }
        $modal.boxAlert(modalOpt);
        $modal.show();

    }

    //..按钮控制..
    //是否允许下载文件
    function enableDownload(yes) {
        if (yes) {
            $("#downloadFile").removeClass("disabled");
        } else {
            $("#downloadFile").addClass("disabled");
        }
    }
    //是否允许删除文件
    function enableDelete(yes) {
        if (yes) {
            $("#deleteFile").removeClass("disabled");
        } else {
            $("#deleteFile").addClass("disabled");
        }
    }
    //是否允许重命名文件
    function enableRename(yes) {
        if (yes) {
            $("#renameFile").removeClass("disabled");
        } else {
            $("#renameFile").addClass("disabled");
        }
    }
    //是否允许复制文件
    function enableCopy(yes) {
        if (yes) {
            $("#copyFile").removeClass("disabled");
        } else {
            $("#copyFile").addClass("disabled");
        }
    }
    //是否允许移动文件
    function enableMove(yes) {
        if (yes) {
            $("#moveFile").removeClass("disabled");
        } else {
            $("#moveFile").addClass("disabled");
        }
    }

    //按钮全部禁用
    function disabledAllButton() {
        // $("button").attr()
        $("a").addClass("disabled")
        $("button").attr("disabled", true)
        $("input").attr("disabled", true)
        disabledButtonFlag = true
    }

    //按钮全部启用
    function enableAllButton() {
        // $("button").attr()
        $("a").removeClass("disabled")
        $("button").attr("disabled", false)
        $("input").attr("disabled", false)
        disabledButtonFlag = false
    }

    //...ajax...
    //退出登录
    function AjaxLogout() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/netDisk/LogoutServlet',
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    location.replace("/netDisk/LoginServlet");
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                $(".item-title").html(obj._backupHTML);
                dirStack.rollBack(mirror)
                $("#AjaxCdStatusMess").html("获取目录失败");
                failcb(data, status, e)
            }
        })
    }


    //上传文件
    function AjaxFileUpload(formData, cb, failcb) {
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;
        disabledAllButton()
        $.toast("上传中，请耐心等待...", {
            timeout: 0,
        })
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: '/netDisk/UploadServlet',
            processData: false,
            contentType: false,
            data: formData,
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    $modal.boxAlert({
                        'title': '文件上传成功',
                        'content': '文件上传成功',
                        'needCancel': false,
                        'confirmFunc': function () {
                            $modal.hideModal();
                            // $("#allFile").trigger("click")
                        },
                        cancelFunc: function () {
                            $modal.hideModal();
                        },
                    })
                    $modal.show();
                    enableAllButton();
                    AjaxCd(getItemTitle())
                    cb();
                })
            },
            error: function (data, status, e) {
                $.toastForceHide()
                enableAllButton();
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    //轮询文件进度
    function AjaxProgress(cb, failcb) {
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;
        $.ajax({
            type: 'get',
            dataType: 'json',
            url: '/netDisk/UploadServlet',
            success: function (data) {
                cb(data)
            },
            error: function (data, status, e) {
                failcb(data, status, e)
            }
        })
    }

    //查询某个目录下的全部文件
    function AjaxCd(obj, cb, failcb) {
        $("#AjaxCdStatusMess").html(LoadingAjaxCd);
        if (obj == null) {
            obj = {
                dirname: '',
                _backupHTML: '',
                mirror: [],
            }
        }

        obj.dirname == null ? obj.dirname = "" : obj.dirname = obj.dirname;
        obj._backupHTML == null ? obj._backupHTML = "" : obj._backupHTML = obj._backupHTML;
        obj.mirror == null ? obj.mirror = [] : obj.mirror = obj.mirror;
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;

        $.ajax({
            type: "get",
            dataType: "json",
            url: "/netDisk/CdServlet",
            data: {
                dirname: obj.dirname
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    if (data.map.directory == undefined) {
                        data.map.directory = [];
                    }
                    $("#AjaxCdStatusMess").html("已获取" + data.map.directory.length + "个文件");
                    var lastDir = ""
                    drawFileTable(data.map, data.map.dataDeep);
                    //移除全选按钮的状态，已选中归零
                    $("input#selectAllList").prop("checked", false)
                    ShowSelectNum();

                    //历史记录,不是浏览器后退前进键得到的就保存
                    if (!(obj.from != null && obj.from == "popstate")) {
                        window.history.pushState(obj.dirname, "")
                    }

                    //回收站隐藏掉新建和上传按钮
                    if ("#recycleFile" == GetItemId()) {
                        $("#uploadFile,#newFolder").hide()
                    } else {
                        $("#uploadFile,#newFolder").show()
                    }
                    cb()
                })

            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                $(".item-title").html(obj._backupHTML);
                dirStack.rollBack(obj.mirror)
                $("#AjaxCdStatusMess").html("获取目录失败");
                failcb(data, status, e)
            }
        })
    }


    //DirTree
    function AjaxGetDirTree(cb, failcb) {
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;
        $.ajax({
            type: "get",
            dataType: "json",
            url: "/netDisk/GetDirTreeServlet",
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    cb(data.map.dirTree);
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    //新建文件夹ajax
    function AjaxMkdir(dirname, filename, cb, failcb) {
        $.toast("新建中..", {
            timeout: 0,
        })
        dirname == null ? dirname = "" : dirname = dirname;
        filename == null ? filename = "" : filename = filename;
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/netDisk/MkdirServlet",
            data: {
                dirname: dirname,
                folderName: filename,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    cb();
                }, function () {
                    failcb();
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    //重命名ajax
    function AjaxRename(dirname, orgName, newName, cb, failcb) {
        $.toast("重命名中..", {
            timeout: 0,
        })
        dirname == null ? dirname = "" : dirname = dirname;
        orgName == null ? orgName = "" : orgName = orgName;
        newName == null ? newName = "" : newName = newName;

        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/netDisk/RenameFileServlet",
            data: {
                dirname: dirname,
                orgName: orgName,
                newName: newName,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    cb();
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    //删除ajax
    function AjaxDelete(dirname, fileNames, cb, failcb) {
        disabledAllButton()
        $.toast("删除中..", {
            timeout: 0,
        })
        dirname == null ? dirname = "" : dirname = dirname;

        if (fileNames == null || fileNames == [] || fileNames.length == 0) {
            $.toast("删除项为空");
            return;
        }

        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;

        $.ajax({
            type: "post",
            dataType: "json",
            url: "/netDisk/DeleteFileServlet",
            data: {
                dirname: dirname,
                fileNames: fileNames,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    enableAllButton()
                    cb(data);
                })
            },
            error: function (data, status, e) {
                enableAllButton()
                //console.log(data, status, e)
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    // 复制到ajax
    function AjaxCopyTo(orgDirName, newDirName, fileNames, cb, failcb) {
        disabledAllButton()
        $.toast("复制中..", {
            timeout: 0,
        })
        orgDirName == null ? orgDirName = "" : orgDirName = orgDirName;
        newDirName = null ? newDirName = "" : newDirName = newDirName;

        if (fileNames == null || fileNames.length == 0) {
            $.toast("所选项为空");
            return;
        }

        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/netDisk/CopyFileServlet",
            data: {
                orgDirName: orgDirName,
                newDirName: newDirName,
                fileNames: fileNames,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    enableAllButton()
                    cb(data);
                })
            },
            error: function (data, status, e) {
                enableAllButton()
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }



    // 移动到ajax
    function AjaxMoveTo(orgDirName, newDirName, fileNames, cb, failcb) {
        disabledAllButton()
        $.toast("移动中..", {
            timeout: 0,
        })
        orgDirName == null ? orgDirName = "" : orgDirName = orgDirName;
        newDirName = null ? newDirName = "" : newDirName = newDirName;

        if (fileNames == null || fileNames.length == 0) {
            $.toast("所选项为空");
            return;
        }

        cb == null ? cb = function () {} : cb = cb;
        failcb = null ? failcb = function () {} : failcb = failcb;
        $.ajax({
            type: "post",
            dataType: "json",
            url: "/netDisk/MoveFileServlet",
            data: {
                orgDirName: orgDirName,
                newDirName: newDirName,
                fileNames: fileNames,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    enableAllButton()
                    cb(data);
                })
            },
            error: function (data, status, e) {
                enableAllButton()
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    //反馈ajax
    function AjaxFeedback(text, cb, failcb) {
        if (text == null) {
            $.toast("反馈内容不能为空")
            return;
        }
        cb == null ? cb = function () {} : cb = cb;
        failcb == null ? failcb = function () {} : failcb = failcb;
        console.log(text)
        $.ajax({
            url: '/netDisk/FeedbackServlet',
            type: 'post',
            dataType: 'JSON',
            data: {
                text: text,
            },
            success: function (data) {
                $.toastForJavaAjaxRes(data, function () {
                    $modal.boxAlert({
                        'title': '反馈成功',
                        'content': '感谢您的反馈！',
                        'needCancel': false,
                        'confirmFunc': function () {
                            $modal.hideModal();
                            // $("#allFile").trigger("click")
                        },
                        cancelFunc: function () {
                            $modal.hideModal();
                        },
                    })
                    $modal.show()
                    cb(data);
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data, status, e)
                failcb(data, status, e)
            }
        })
    }

    $("#logo,#productInfo").click(function () {
        var content = "hz非常非常非常low的网盘<br/> 用文件夹存储用户的内容。正常的网盘不应该这样。会带来有很多问题的。" +
            "<br/>by hzambrella qq:504489929有bug call me"
        $modal.boxAlert({
            title: "产品信息",
            content: content,
            needCancel: false,
            confirmFunc: function () {
                $modal.hideModal();
            },
            cancelFunc: function () {
                $modal.hideModal();
            },
        })
        $modal.show();
    })

    //控制返回键,对 ajaxCd造成的表格改变进行回退和前进
    $(function () {
        window.addEventListener("popstate", function (e) {
            var dir = e.state;
            if (dir != null) {
                var sp = dir.split("/")
                sp = sp.slice(1)
                // console.log(sp)
                var obj = ChangeItemTitle(0, sp);
                //标识来自后退键。
                obj.from = "popstate"
                AjaxCd(obj)
            }

        }, false);
    });

    // window.onpopstate=function(){
    //      alert(JSON.stringify(window.history.state))
    // }

    $("#feedback").click(function () {
        $("#feedbackDialog").dialog({
            'id': 'fbDialog',
            'title': '意见反馈',
            _con_HTML: "<textarea class='bea_textarea' rows='10' cols='30' placeholder='填写您的意见' autofocus></textarea>",
            _button_HTML: "<a href='javascript:void(0)'  class='cancel a_block dialog_a white floatright'>取消</a>" +
                "<a href='javascript:void(0)' class='confirm a_block dialog_a blue floatright'>确认</a>",
        })
        $("#feedbackDialog").resetCloseFunc(function () {
            $("#feedbackDialog").find("#fbDialog").remove();
        })

        $("#feedbackDialog").find(".cancel").bind("click", function () {
            $("#feedbackDialog").find("#fbDialog").remove();
        })

        $("#feedbackDialog").find(".confirm").bind("click", function () {
            var text = $("#feedbackDialog").find("textarea").val();
            $("#feedbackDialog").find("#fbDialog").remove();
            AjaxFeedback(text)
        })

        $("#feedbackDialog").show();
    })
})