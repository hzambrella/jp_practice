//height：高度，要带单位。如20px
//resultObj  目录树结果。是对象。若是json，先JSON.parse()再传进来。
function drawDirTreeUl(height, resultObj) {
    var _HTML = "<div class='treebox scrollXY' style='height:" + height + "'>" +
        "<div class='tree'>"
    var _subHTML = "";
    resultObj.name == null ? resultObj.name = "" : resultObj.name = resultObj.name;
    // var pretitle = resultObj.name + "/"
    if (resultObj != null) {
        // if (resultObj.childDirNode != null && resultObj.childDirNode.length != 0) {
        //     _subHTML = "<li>" +
        //         "<div class='close_menu'><span></span><a title='" + resultObj.name + "' data-deep='" + resultObj.level + "'>" + resultObj.name + "</a></div>" +
        //         subDirTree(resultObj.childDirNode, resultObj.name + "/") + "</li>"
        // } else {
        //     resultObj.name == null ? resultObj.name = "" : resultObj.name = resultObj.name
        //     _subHTML = " <li><a title='" + resultObj.name + "' data-deep='" + resultObj.level + "'>" + resultObj.name + "</a></li>"
        // }
        _subHTML = addChildNodeToDirTree(resultObj, "")

        _HTML += "<ul class='ul_common'>" +
            _subHTML +
            "</ul>" +
            "</div>" +
            "</div>"
    }
    return _HTML
}

// 返回子节点的li,用来插入至父节点的ul上
function addChildNodeToDirTree(resultObj, pretitle) {
    var _childHTML = ""
    var nameInsert = ""
    if (resultObj.level == 0) {
        nameInsert = "";
    } else {
        nameInsert = pretitle + "/" + resultObj.name;
    }

    if (resultObj.childDirNode != null && resultObj.childDirNode.length != 0) {
        _childHTML += "<li>" +
            "<div class='close_menu'><span></span><a class='a_block menu' title='" +
            nameInsert + "' data-deep=' " + resultObj.level + "' fileName='" + resultObj.name + "'>" +
            "<i class='fa fa-folder' style='margin-right:2px'></i>" + resultObj.name + "</a></div>" +
            subDirTree(resultObj.childDirNode, nameInsert) + "</li>"
    } else {
        resultObj.name == null ? resultObj.name = "" : resultObj.name = resultObj.name
        _childHTML += " <li class='leaf_node' style='padding-left:24px'><a class='a_block leaf_node' title='" + nameInsert +
            "' data-deep='" + resultObj.level + "' fileName='" + resultObj.name + "'>" +
            "<i class='fa fa-folder' style='margin-right:2px'></i>" + resultObj.name + "</a></li>"
    }
    return _childHTML;

    //子树
    function subDirTree(childNodes, pretitle) {
        var _subHTML = "<ul class='ul_common'>"
        //  console.log(childNodes)
        //  console.log(childNodes.length)
        for (var i = 0; i < childNodes.length; i++) {
            var resultObj = childNodes[i];
            // console.log(resultObj)
            _subHTML += addChildNodeToDirTree(resultObj, pretitle);

        }
        return _subHTML + "</ul>"
    }
}

//dirTree中的新建文件夹 $ontree代表被选中的文件夹 $divParent代表$ontree的父div。
function dirTreeNewFolder($ontree, confirmCb) {
    if ($ontree == null || $ontree.length == 0) {
        console.log("error in dirTree.js,ontree is null");
        return;
    }

    if ($ontree.parents(".tree").find("li.doing").length != 0) {
        var $lastDoing = $ontree.parents(".tree").find(".doing");

        var $node = $lastDoing.find("a");
        var fileName = $node.attr('fileName')
        var dataDeepP = $node.attr('data-deep')
        var title = $node.attr('title')

        var backPadding = $lastDoing.attr("backPadding");
        $lastDoing.css("padding-left", backPadding);
        $lastDoing.addClass("leaf_node");

        $lastDoing.empty();

        var _backHTML = "<a class='a_block leaf_node' title='" + title +
            "' data-deep='" + dataDeepP + "' fileName='" + fileName + "'>" +
            "<i class='fa fa-folder' style='margin-right:2px'></i>" + fileName + "</a>"
        $lastDoing.append(_backHTML);
        $lastDoing.removeClass("doing");
    }
    //清掉input
    $ontree.parents(".tree").find(".dirTreeRename").remove();

    var _inputHTML = "  <div class='dirTreeRename' style='display:inline-block'>" +
        "<i class='fa fa-folder' style='margin-right:2px'></i>" +
        "<input class='bea_input rename_input' type='text' value='新建文件夹' autofocus/>" +
        "<button class='rename_confirm'><i class='fa fa-check'></i></button>" +
        "<button class='rename_cancel'><i class='fa fa-close'></i></button>" +
        "</div>"
    //用于取消。
    // _forCancelHTML = $ontree.parents(".tree").html()
    //若被选中目录有子文件夹
    if ($ontree.hasClass("menu")) {
        var $divParent = $ontree.parent();
        $divParent.next().prepend("<li class='leaf_node'>" +
            _inputHTML + '</li>')

        if ($divParent.hasClass("close_menu")) {
            $divParent.children("span").trigger('click')
        }

        var $named = $ontree.parents(".tree").find(".dirTreeRename")
        $named.children(".rename_cancel").unbind()
        $named.children(".rename_cancel").bind('click', function () {
            $named.remove();
            return;
        })

        $named.children(".rename_confirm").unbind()
        $named.children(".rename_confirm").bind('click', function () {
            var newFolderName = $named.children("input").val()
            var newDir = $ontree.attr('title');
            var dataDeep = $ontree.attr('data-deep') + 1

            //通常是ajax
            confirmCb(newDir, newFolderName,
                // ajax成功执行的cb
                function () {
                    var _childHTML = " <li class='leaf_node' style='padding-left:24px'><a class='a_block leaf_node' title='" +
                        newDir + "/" + newFolderName +
                        "' data-deep='" +
                        dataDeep +
                        "'>" +
                        "<i class='fa fa-folder' style='margin-right:2px'></i>" +
                        newFolderName + "</a></li>"
                    $divParent.next().prepend(_childHTML)
                    $named.remove();
                    return;
                },
                // ajax失败执行的cb
                function () {
                    $named.remove();
                    return;
                })
        })
        //若被选中目录没有子文件夹
    } else {
        //把ontree从leaf变成menu
        $parent = $ontree.parent() //是li
        var _backHTML = $parent.html();
        var fileName = $ontree.attr('fileName')
        var dataDeepP = $ontree.attr('data-deep')
        var title = $ontree.attr('title')
        var backPadding = $parent.css("padding-left");
        $parent.attr("backPadding", backPadding);
        var _childHTML =
            "<div class='open_menu'><span></span><a class='a_block menu' title='" +
            title + "' data-deep=' " + dataDeepP + "' fileName='" + fileName + "'>" +
            "<i class='fa fa-folder' style='margin-right:2px'></i>" + fileName + "</a></div>" +
            "<ul class='ul_common'><li class='leaf_node'>" + _inputHTML + "</li></ul>";
        $parent.empty()
        $parent.append(_childHTML);
        $parent.removeClass("leaf_node");
        $parent.css("padding-left", 0);
        $parent.addClass("doing") //标识一下。再按新建时还原现场

        $named = $parent.find(".dirTreeRename")
        $named.children(".rename_cancel").unbind()
        $named.children(".rename_cancel").bind('click', function () {
            $parent.css("padding-left", backPadding);
            $parent.addClass("leaf_node");
            $parent.html(_backHTML)
            return;
        })

        $named.children(".rename_confirm").bind('click', function () {
            var newFolderName = $named.children("input").val()
            var newDir = title;
            var dataDeep = dataDeepP + 1

            //通常是ajax
            confirmCb(newDir, newFolderName,
                // ajax成功执行的cb
                function () {
                    var _childHTML = " <li class='leaf_node' style='padding-left:24px'><a class='a_block leaf_node' title='" +
                        newDir + "/" + newFolderName +
                        "' data-deep='" +
                        dataDeep +
                        "'>" +
                        "<i class='fa fa-folder' style='margin-right:2px'></i>" +
                        newFolderName + "</a></li>"
                    $parent.children("ul").prepend(_childHTML);
                    $named.remove();
                    return;
                },
                // ajax失败执行的cb
                function () {
                    $parent.css("padding-left", backPadding);
                    $parent.addClass("leaf_node");
                    $parent.html(_backHTML)
                    return;
                })
        })

    }
}