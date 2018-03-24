//height：高度，要带单位。如20px
//resultObj  目录树结果。是对象。若是json，先JSON.parse()再传进来。
function drawDirTreeUl(height, resultObj) {
    _HTML = "<div class='treebox scrollXY' style='height:" + height + "'>" +
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

        _HTML += "<ul>" +
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
    if (resultObj.childDirNode != null && resultObj.childDirNode.length != 0) {
        _childHTML += "<li>" +
            "<div class='close_menu'><span></span><a title='" + pretitle + resultObj.name + "' data-deep=' " + resultObj.level + "'>"+"<i class='fa fa-folder' style='margin-right:2px'></i>" + resultObj.name + "</a></div>" +
            subDirTree(resultObj.childDirNode, pretitle + resultObj.name + "/") + "</li>"
    } else {
        resultObj.name == null ? resultObj.name = "" : resultObj.name = resultObj.name
        _childHTML += " <li class='leaf_node' style='padding-left:24px'><a title='" + pretitle + resultObj.name + "' data-deep='" + resultObj.level + "'>" + "<i class='fa fa-folder' style='margin-right:2px'></i>"+resultObj.name + "</a></li>"
    }
    return _childHTML;

    //子树
    function subDirTree(childNodes, pretitle) {
        var _subHTML = "<ul>"
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