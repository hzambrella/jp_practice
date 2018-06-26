<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ page isELIgnored="false" %> 
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
	        function liuyanAdd()
	        {
	            <c:if test="${sessionScope.userType!=1}">
	                  alert("请先登录");
	            </c:if>
	            <c:if test="${sessionScope.userType==1}">
	                 var strUrl = "<%=path %>/qiantai/liuyan/liuyanAdd.jsp";
		             var ret = window.showModalDialog(strUrl,"","dialogWidth:800px; dialogHeight:500px; dialogLeft: status:no; directories:yes;scrollbars:yes;Resizable=no;");
		             window.location.reload();
	            </c:if>
	        }
	        
	        function liuyanDetail(id)
	        {
	             var strUrl = "<%=path %>/liuyanDetail.action?id="+id;
	             var ret = window.showModalDialog(strUrl,"","dialogWidth:800px; dialogHeight:500px; dialogLeft: status:no; directories:yes;scrollbars:yes;Resizable=no;");
	        }
	    </script>
	</head>

	<body>
		<jsp:include flush="true" page="/qiantai/inc/incTop.jsp"></jsp:include>
		<div class="page_row" >
			<div class="page_main_msg left">
			     <div class="left_row">
		              <div class="list pic_news" style="width: 950px;">
				          <div class="list_bar">
				               <span style="float:left">系统留言板</span>
							   <span style="float:right"><a href="#" onclick="liuyanAdd()">我要留言</a>&nbsp;&nbsp;&nbsp;&nbsp;</span>
				          </div>
				          <div class="list_content" style="height: 445px;">
                              <div class="c1-body">
                                   <c:forEach items="${requestScope.liuyanList}" var="liuyan" varStatus="sta">
				                        <div class="c1-bline" style="padding:7px 0px;">
					                        <div class="f-left">
					                             <img src="<%=path %>/img/head-mark4.gif" align="middle" class="img-vm" border="0"/> 
					                             <a href="#" onclick="liuyanDetail(${liuyan.id })">${liuyan.neirong }</a>
					                        </div>
					                        <div class="f-right">${liuyan.liuyanshi }</div>
					                        <div class="clear"></div>
				                        </div>
				                   </c:forEach>
								  <div class="pg-3">
								  </div>		  
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
