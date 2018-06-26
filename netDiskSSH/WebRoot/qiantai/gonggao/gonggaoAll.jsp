<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
<%
	String path = request.getContextPath();
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="pragma" content="no-cache" />
		<meta http-equiv="cache-control" content="no-cache" />
		<meta http-equiv="expires" content="0" />
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3" />
		<meta http-equiv="description" content="This is my page" />
		
		<link href="<%=path %>/css/layout.css" type="text/css" rel="stylesheet" />
		
	    <script type="text/javascript">
	       function gonggaoDetailQian(id)
           {
                var url = "<%=path %>/gonggaoDetailQian.action?id="+id;
                window.location.href=url;
           } 
	    </script>
	</head>

	<body>
		<jsp:include flush="true" page="/qiantai/inc/incTop.jsp"></jsp:include>
		<div class="page_row" >
			<div class="page_main_msg left">
			     <div class="left_row">
		              <div class="list pic_news" style="width: 950px;">
				          <div class="list_bar">系统公告信息</div>
				          <div class="list_content" style="height: 445px;">
                              <div class="c1-body">
                                  <s:iterator value="#request.gonggaoList" id="gonggao">
                                  <div class="c1-bline" style="padding:7px 0px;">
                                       <div class="f-left">
                                            <img src="<%=path %>/img/head-mark4.gif" align="middle" class="img-vm" border="0"/> 
                                            <a href="#" onclick="gonggaoDetailQian(<s:property value="#gonggao.id"/>)"><s:property value="#gonggao.biaoti"/></a>
                                       </div>
                                       <div class="f-right"><s:property value="#gonggao.shijian"/></div>
                                       <div class="clear"></div>
                                  </div>
                                  </s:iterator>
						      </div>
						  </div>
					  </div>	
				      <div style="clear:both;"></div>
			     </div>
			</div>
		</div>
		
		<div class="foot">
		   <jsp:include flush="true" page="/qiantai/inc/incFoot.jsp"></jsp:include>
	    </div>
	</body>
</html>
