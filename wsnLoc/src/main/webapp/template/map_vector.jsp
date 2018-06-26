<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
  <html lang="en">

  <head>
    <title>OpenLayers example</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

    <!--openlayers-->
    <link rel="stylesheet" href="/wsnLoc/static/vendor/openlayers/css/ol.css" type="text/css">
    <script src="/wsnLoc/static/vendor/openlayers/js/ol.js" type="text/javascript"></script>
    <!--common-->
    <script src="/wsnLoc/static/js/common.js" type="text/javascript"></script>
    <link href="/wsnLoc/static/css/style.css" rel="stylesheet" />
    <!--jquery-->
    <script src="/wsnLoc/static/js/libs/jquery-3.2.1.min.js" type="text/javascript"></script>
    <!--bootstrap-->
    <!--<link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0-beta/css/bootstrap.min.css">-->
    <!-- popper.min.js  -->
    <!--<script src="https://cdn.bootcss.com/popper.js/1.12.5/umd/popper.min.js"></script>-->
    <!--<script src="https://cdn.bootcss.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>-->

    <!--bootstrap-->
    <link rel="stylesheet" href="/wsnLoc/static/vendor/bootstrap/4.0.0-beta/css/bootstrap.min.css">
    <!-- popper.min.js  -->
    <script src="/wsnLoc/static/vendor/bootstrap/popper.js/1.12.5/umd/popper.min.js"></script>
    <script src="/wsnLoc/static/vendor/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>


    <!--jqueryui-->
    <!--<link rel="stylesheet" href="http://apps.bdimg.com/libs/jqueryui/1.10.4/css/jquery-ui.min.css">-->
    <!--<script src="http://apps.bdimg.com/libs/jquery/1.10.2/jquery.min.js"></script>-->
    <!--<script src="http://apps.bdimg.com/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>-->
    <link rel="stylesheet" href="/wsnLoc/static/vendor/jqueryui/jquery-ui-1.12.1.custom/jquery-ui.min.css">
    <script src="/wsnLoc/static/vendor/jqueryui/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
    <!--clipboard.js-->
    <script src="/wsnLoc/static/vendor/clipboard/clipboard.min.js" type="text/javascript"></script>
    <!--mock-->
    <script src="/wsnLoc/static/js/mock/mock.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/mock/anchorData.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/mock/moveData.js" type="text/javascript"></script>

    <!--css-->
    <link href="/wsnLoc/static/css/map.css" rel="stylesheet" />
    <link href="/wsnLoc/static/css/app.css" rel="stylesheet" />
    <link href="/wsnLoc/static/css/font-awesome.min.css" rel="stylesheet" />
  </head>

  <body>
    <h2>My Map</h2>

    <div id="hzMapTest" class="map center">
      <div id="viewOperate">
        <button id="rotateLeft" title="向左旋转"><i class='fa fa-rotate-left'></i></button>
        <button id="rotateRight" title="向右旋转"><i class='fa fa-rotate-right'></i></button>
        <button id="doDebug" title="调试"><i class='fa fa-gear'></i></button>
      </div>

      <div id="mousePosition"></div>
    </div>

    <div id="label" style="display:none">
    </div>

    <div id="popup" class="ol-popup">
      <a href="#" id="popup-closer" class="ol-popup-closer"></a>
      <div id="popup-content"></div>
    </div>

    <div id="debug" title="调试工具">
      <form class='draw'>
        <input type="checkbox" id="showExtendOfMap" class="center">extent数据</input>
        <input type="checkbox" id="showAnchor" class="center">锚节点数据</input>
        <input type="checkbox" id="location" class="center">获取位置</input>
        <input id=doRange type="checkbox" value="doRange" />
        <label for='doRange' value="doRange">测距</label>
      </form>
      <form class='draw'>
        <label>绘制:</label>
        <select id="draw">
        <option value="clear">清空绘制</option>
        <option value="rangeDis">测距</option>
        <option value="drawAnchor">绘制锚节点</option>
         <option value="drawMove">绘制移动点</option>
      </select>
      </form>
      <form id="drawTool" class='draw hide' style='margin-left:5px'>
        <input id=doDraw type="radio" checked="checked" name="drawOperate" value="doDraw" />
        <label for='doDraw' value="doDraw">绘制要素</label>

        <input id=doModify type="radio" name="drawOperate" value="doModify" />
        <label for='doModify' value="doModify">修改要素</label>

        <input id=doDelete type="radio" name="drawOperate" value="doDelete" />
        <label for='doDelete' value="doDelete">删除要素</label>
      </form>
      <div class="center" style="clear:both">
        打印结果：
        <p class="center" id="printResult"></p>
      </div>
    </div>
    <button class="btnClip" id='testClip' data-clipboard-text="3" style='display:none'>Copy</button>
    <div style="padding:1px">
      <button id="simulateLocate">simulate</button>
      <label>速度放大(缩小)倍数:</label>
      <select id="simulateMoveSpeed">   
        <option value=0.5>0.5倍</option>
        <option value=1 selected="selected" >1倍</option>
        <option value=2>2倍</option>
        <option value=5>5倍</option>
      </select>
    </div>
    <script src="/wsnLoc/static/js/map_style.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/map_common.js" type="text/javascript"></script>
    <script src="/wsnLoc/static/js/app_vector.js" type="text/javascript"></script>

    <script type="text/javascript">
      $(function () {
        $("#debug").dialog({
          autoOpen: false
        });
      })

      var clipboard = new ClipboardJS('.btnClip');
      clipboard.on('success', function (e) {});

      clipboard.on('error', function (e) {
        alert('复制异常')
        console.log(e);
      });
      // $('#testClip').attr('data-clipboard-text','asdfdasf')
      // $('#testClip').trigger('click')
    </script>

  </body>

  </html>