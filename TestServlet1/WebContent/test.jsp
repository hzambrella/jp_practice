<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<% 
	String path = request.getContextPath();
	String s=(String)request.getAttribute("message"); 
	System.out.println(s);%>

	<p>1: ${requestScope.message}</p>
	<p>2: <%=s %></p>
	<p>path: <%=path %></p>

</body>
</html>