<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html lang="en">

    <head>
        <title>OpenLayers example</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <!--jquery-->
        <script src="/wsnLoc/static/js/libs/jquery-3.2.1.min.js" type="text/javascript"></script>
        <style>
            * {
                margin: 0;
                padding: 0
            }

            html,
            body {
                height: 100%
            }

            #nav {
                float: left;
                width: 5%;
                height: 100%;
                background-color: antiquewhite
            }

            #con {
                float: right;
                width: 95%;
                height: 100%;
                background-color: aqua
            }
        </style>
        <script>
            $(document).ready(function () {
                //页面加载的时候，内容框默认显示 a.html
                $('#con').load('template/list.jsp');
                //单击 a 链接，加载 a.html
                $("#a1").click(function () {
                    $('#con').load('template/map_vector.jsp');
                });
                //单击 b 链接，加载 b.html
                $("#a2").click(function () {
                    $('#con').load('template/iframe.jsp');
                });
            })
        </script>
    </head>

    <body>
        <ul id="nav">
            <li><a href="#" id="a1">show a</a></li>
            <li><a href="#" id="a2">show b</a></li>
        </ul>
        <div id="con"></div>
    </body>

    </html>