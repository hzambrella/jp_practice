package netDisk.netDiskServlet;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import View.Result;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public LoginServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		request.getServletContext()
				.getRequestDispatcher("/view/html/login.html")
				.forward(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 通用
		String userAccountMock = "testUser";
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());
		
		// 校验参数
		String accountLogin = request.getParameter("accountLogin");
		if (null == accountLogin||accountLogin.equals("")) {
			result.setCode(400);
			result.setMessage("账号为空");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		//TODO:from db
		accountLogin=userAccountMock;
		String userName="haozhao";
		
		String passwordLogin = request.getParameter("passwordLogin");
		if (null == passwordLogin||passwordLogin.equals("")) {
			result.setCode(400);
			result.setMessage("密码为空");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}

		String rememberStr = request.getParameter("remember");
		if (rememberStr == null) {
			rememberStr="false";
		}
		Boolean remember=Boolean.parseBoolean(rememberStr);

		HttpSession session=request.getSession(true);
		session.setAttribute("account", accountLogin);
		session.setAttribute("userName", userName);
		session.setAttribute("rememberLogin", remember);
		
		//记住登录时，session时间1星期。
		if (!remember){
//			for (Cookie c:request.getCookies()){
//				c.setMaxAge(-1);
//			}
			session.setMaxInactiveInterval(7*24*60*60);
		}
		
		response.getWriter().write(JSON.toJSONString(result));
		return;
	}

}
