<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="s" uri="/struts-tags"%>
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
	        function down1(fujianPath,fujianYuashiMing)
	        {
	            <s:if test="#session.userType!=1">
				     alert("请先登录");
				</s:if>
				<s:if test="#session.userType==1">
				     var url="<%=path %>/updown/updown.jsp?fujianPath="+fujianPath+"&fujianYuashiMing="+fujianYuashiMing;
				     url=encodeURI(url); 
		             url=encodeURI(url); 
		             window.open(url,"_self");
				</s:if>
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
				             <span style="float:left">文件共享</span>
							 <span style="float:right">
							    <form action="<%=path %>/wenjianRes.action" name="ff" method="post">
							        关键字：<input type="text" name="mingcheng"/>
							        <input type="submit" value="检索"/>
							        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							    </form>
							 </span>
				          </div>
				          <div class="list_content">
                              <div class="c1-body" align="left">
                                  <c:forEach items="${requestScope.wenjianList}" var="wenjian" varStatus="sta">
						               <fieldset style="width:95%; margin-left:5px;"><legend class="fieldtitle"></legend>
											<table class="bill" width="97%" cellpadding="4" cellspacing="4">
											    <tr>
											        <td>文件名称：${wenjian.mingcheng}</td>
											    </tr>
											    <tr>
											        <td>备注信息：${wenjian.beizhu}</td>
											    </tr>
											    <tr>
											        <td>上传时间：${wenjian.shangchuanshi}</td>
											    </tr>
											    <tr>
											        <td>上传用户：${wenjian.user.userName}</td>
											    </tr>
											    <tr>
											        <td>
												          <input type="button" value="文件下载" onclick="down1('${wenjian.fujian}','${wenjian.fujianYuanshiming}')"/>
											        </td>
											    </tr>
											</table>
									   </fieldset>
									   <br/>
									   </c:forEach>
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
