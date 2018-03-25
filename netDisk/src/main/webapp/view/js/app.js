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
        // console.log(action)
        if (action == null) {
            //隐藏操作栏
            if (num <= 0) {
                showOrHideOperateBar(false)
            } else {
                showOrHideOperateBar(true)
            }
            //禁止重命名按钮
            enableRename(num <= 1);
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
        toString: function () {
            var str = ""
            for (var i = 0; i < this.data.length; i++) {
                str += "/" + this.data[i]
            }
            return str;
        },
        getDirForAjax: function () {
            var str = "";
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
            var mirror = this.data;
            return mirror;
        },
        rollBack: function (mirror) {
            data = mirror;
        }
    };

    //通过左边栏、文件深度，更新右边表格的 item title
    //title为null ,back_num<0或为null时，就是直接到初始层。用于左边栏切换。
    //back_num>0时，就是往上层。back_num意味着往上多少。结合.file-list-table的data-deep属性。若超出了data-deep，就回到最初层。
    //此时title 没有用
    //back_num=0时，就是往下一层。title是目录名。
    //无论那种情况，都要操作dirStack。别的地方不可操作这个对象

    //返回:对象类型  obj.dirname 目录名字  obj._backupHTML  改变前的html，用于ajax失败后恢复。
    //mirror 改变前的dirStack,ajax失败后，dirStack.rollBack(mirror)恢复原始状态。
    //ajax在外层写，写在这个函数后面。

    function ChangeItemTitle(back_num, title) {
        back_num == null ? back_num = -1 : back_num = back_num;
        title == null ? title = "未命名" : title = title;

        //备份,ajax失败后可用于恢复$(".item-title").html(_backupHTML);
        var _backupHTML = $(".item-title").html();
        var mirror = dirStack.getDataMirror();

        if (back_num < 0) {
            //title为null ,back_num<0或为null时，就是直接到初始层。用于左边栏切换。
            var itemTitle = titleMap[GetItemId()];
            $("#itemTitle").html(itemTitle)
            $(".item-title ul").empty();
            $("#gobackToLast").remove();

            dirStack.reset(itemTitle)
        } else if (back_num == 0) {
            //back_num=0时，就是往下一层。title是目录名。
            //原来的目录
            var preTitle = $("#itemTitle").html();

            //原来的data-deep -1
            $lis = $(".item-title ul").find("li")
            $lis.each(function () {
                var data_deep = $(this).find("a").attr("data-deep")
                $(this).find("a").attr("data-deep", parseInt(data_deep) - 1)
            })

            //返回上一级按钮
            $gobackToLast = $(".item-title").find("#gobackToLast");
            if ($gobackToLast.length == 0) {
                var _gobackHTML = "<a id='gobackToLast' data-deep='-1' class='dir_go_back' href='javascript:void(0)'>" +
                    "返回上一级<span class='EKIHPEb'>|</span></a>";
                $(".item-title ul").prepend(_gobackHTML)
            }

            //原来的title变成a
            var _nextHTML = "<li><a data-deep='-1' class='dir_go_back' href='javascript:void(0)'>" +
                preTitle +
                "</a><span class='KLxwHFb'>></span></li>"
            $(".item-title ul").append(_nextHTML)
            //设置title
            $("#itemTitle ").html(title);

            //data-deep
            // var dataDeep = $("#file-list-table").attr("data-deep")
            // $("#file-list-table").attr("data-deep",parseInt(dataDeep) + 1);

            dirStack.push(title);
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
        // console.log($target)
        if ($target.is("a.dir_go_back") || $target.is("a#gobackToLast.dir_go_back")) {
            var dataDeep = $target.attr("data-deep")
            var obj = ChangeItemTitle(-dataDeep)

            AjaxCd(obj, function () {
                //do nothing
            }, function () {
                //fail 

            });
            // console.log(obj)

        } else {
            return
        }
    })

    //...上边...//
    //..用户管理..
    $("#logout").click(function () {
        AjaxLogout()
    })

    //...左边...

    //条目
    $(".item-list").click(function (event) {
        var $target = $(event.target);
        // console.log($target.prop("id"));
        // console.log($target)

        //已选中的就return
        if ($target.hasClass("select")) {
            return;
        }

        if (!disabledButtonFlag) {
            $(".item-list").find("a").removeClass("select")
            $target.addClass("select");


            if ($target.prop("id") == "allFile") {
                AjaxCd(null,
                    function () {
                        // drawTable(result_data);
                        ChangeItemTitle()
                        //移除全选按钮的状态，已选中归零
                        $("input#selectAllList").prop("checked", false)
                        ShowSelectNum();

                        //回收站隐藏掉新建和上传按钮
                        if ($target.is("#recycleFile")) {
                            $("#uploadFile,#newFolder").hide()
                        } else {
                            $("#uploadFile,#newFolder").show()
                        }
                    },
                    function () {

                    });
            } else {
                alert("尊敬的用户，查看" + titleMap[GetItemId()] + "功能正在开发中，敬请期待");
                drawTable({
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
        // console.log($target,$target.is("input#selectAllList"));

        //选中时触发的事件
        var checkboxAction = null

        //回收站选中checkbox时触发的事假不一样
        if (GetItemId() == "recycleFile") {
            checkboxAction = function (num) {
                if (num <= 0) {
                    $(".operate #doRecycle").remove();
                } else {
                    console.log($(".operate .operate-file #doRecycle"))
                    if ($(".operate #doRecycle").length == 0) {
                        $(".operate").append("<a id='doRecycle' class='operate-common' href='javascript:void(0)'><i class='fa fa-recycle'></i>还原</a>")
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
    //#file-list-table的属性data-deep在drawTable函数操作。外层不准操作！！！ 
    function drawTable(data, dataDeep) {
        dataDeep == null ? dataDeep = 0 : dataDeep = dataDeep;
        //        console.log(resultList)
        //        var resultList=resultList;
        //清空原有内容
        $("#file-list-table").find("tr").not(".table-title").remove();
        //新内容渲染模板
        var table_tpl = document.getElementById("table_tpl").innerHTML;
        var _HTML = template(table_tpl, data);
        // console.log(_HTML);
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
        //          console.log(st,name)
        //         if (st!=null&&st.length != 0) {
        //             var st1 = st[0];
        //             var st2 = st1.substring(1, st1.length).substring(0, st1.length - 1)
        //             i=parseInt(st2) + 1;
        //             name = dealDupName(name.replace(reg,"("+i+")"));
        //         }else{
        //             console.log(22)
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
        // console.log($target)
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
                var obj = ChangeItemTitle(0, $target.parent().find("span").html());
                AjaxCd(obj, function () {
                    //do nothing
                }, function () {
                    //fail 
                });
            }
        }, 200)
    })

    //..操作栏控制..
    //操作栏隐藏和显示。true为显示
    function showOrHideOperateBar(show) {
        if (show) {
            $(".operate ul").removeClass("hide");
        } else {
            $(".operate ul").addClass("hide");
        }
    }

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
        alert("下载" + names + "完毕！");
    })

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
                            }
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
        $name_el.remove();
        var table_rename_tpl = document.getElementById("table_rename").innerHTML;
        var _HTML = template(table_rename_tpl, {
            "name": name,
        });
        disabledAllButton()
        $target.append(_HTML);
        //让input 选中状态
        $target.find("input").select().focus();
        //TODO:给按钮绑定监听
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
            $target.append("<span>" + new_name + "</span>");
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


        var __dirTreeButtonHTML = $("#mock_dir_tree_button").html()
        AjaxGetDirTree(function (dirTree) {
            var _dirTreeHTML = drawDirTreeUl(jqueryTreeScrollHeight, dirTree)

            //lazy single
            if ($modalDirTree == null) {
                $modalDirTree = $("#modalDirTree").modal()
                $modalDirTree.boxContainer({
                    closeFunc: function () {
                        $modalDirTree.hide();
                        $(".box_container").hide();
                    }
                }, _dirTreeHTML, __dirTreeButtonHTML);
                jqueryTreeScroll()
            } else {
                $modalDirTree.changeCon(_dirTreeHTML);
            }


            if ($target.is("a#moveFile")) {
                $modalDirTree.changeTitle("移动到")
            } else if ($target.is("a#copyFile")) {
                $modalDirTree.changeTitle("复制到")
            }


            $modalDirTree.find("a[data-deep='0']").addClass("ontree")

            $(".box_container .box_container_con").addClass("border_grey_solid")
            $(".box_container .box_container_button").addClass("box_container_button_dirTree")

            $("#dirTreeNewFolder").bind("click", function () {
                //TODO：new folder
                alert("新建文件夹")
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
                var absolutePath = getAbsolutePathFromDirTree()
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
                            }
                        })
                        $modal.show();
                    } else {
                        $.toast('文件转移成功')
                    }

                    //刷新列表的数据
                    AjaxCd(getItemTitle)
                })

            }

            function copyConfirmCallback() {
                var absolutePath = getAbsolutePathFromDirTree()
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

                    // console.log(failNameStr)
                    if (failNameStr != "") {
                        $modal.boxAlert({
                            'title': '部分文件复制失败',
                            'content': failNameStr,
                            'needCancel': false,
                            'confirmFunc': function () {
                                $modal.hideModal();
                                // $("#allFile").trigger("click")
                            }
                        })
                        $modal.show();
                    } else {
                        $.toast('文件复制成功')
                    }

                    //刷新列表的数据
                    AjaxCd(getItemTitle())
                })
            }

        })
    })

    //从目录树中获得完整的目录
    function getAbsolutePathFromDirTree() {
        $ontree = $(".treebox .tree").find(".ontree")
        return $ontree.attr("title")
    }

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
                $.toastForAjaxErr(data,status,e)
                $(".item-title").html(obj._backupHTML);
                dirStack.rollBack(mirror)
                $("#AjaxCdStatusMess").html("获取目录失败");
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
            type: "post",
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
                    drawTable(data.map, data.map.dataDeep);
                    cb()
                })

            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data,status,e)
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
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }

    //新建文件夹ajax
    function AjaxMkdir(dirname, filename, cb, failcb) {
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
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }

    //重命名ajax
    function AjaxRename(dirname, orgName, newName, cb, failcb) {
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
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }

    //删除ajax
    function AjaxDelete(dirname, fileNames, cb, failcb) {
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
                    cb(data);
                })
            },
            error: function (data, status, e) {
                console.log(data, status, e)
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }

    // 移动到到ajax
    function AjaxCopyTo(orgDirName, newDirName, fileNames, cb, failcb) {
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
                    cb(data);
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }


    // 复制到ajax
    function AjaxMoveTo(orgDirName, newDirName, fileNames, cb, failcb) {
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
                    cb(data);
                })
            },
            error: function (data, status, e) {
                $.toastForAjaxErr(data,status,e)
                failcb(data, status, e)
            }
        })
    }
})