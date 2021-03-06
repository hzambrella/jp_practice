package netDisk.netDiskServlet;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import View.Result;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class RegisterServlet 注册
 */
@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterServlet() {
        super();
    }

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 通用
				
				response.setCharacterEncoding("utf-8");
				// response.setContentType("text/html;charset=utf-8");
				Result result = new Result(200, "成功", new HashMap<String, Object>());
				
				// 校验参数
				String accountLogin = request.getParameter("accountRegister");
				if (null == accountLogin|accountLogin.equals("")) {
					result.setCode(400);
					result.setMessage("账号为空");
					response.getWriter().print(JSON.toJSONString(result));
					return;
				}
				
				String nickName = request.getParameter("nickname");
				if (null == nickName||nickName.equals("")) {
					result.setCode(400);
					result.setMessage("昵称为空");
					response.getWriter().print(JSON.toJSONString(result));
					return;
				}
				nickName=new String(nickName.getBytes("ISO8859-1"),"UTF-8");
				
				String passwordRegister = request.getParameter("passwordRegister");
				if (null == passwordRegister||passwordRegister.equals("")) {
					result.setCode(400);
					result.setMessage("密码为空");
					response.getWriter().print(JSON.toJSONString(result));
					return;
				}
				
				String passwordAgain = request.getParameter("passwordAgain");
				if (null == passwordAgain||passwordAgain.equals("")) {
					result.setCode(400);
					result.setMessage("密码为空");
					response.getWriter().print(JSON.toJSONString(result));
					return;
				}
				
				//TODO:from db
				String userAccount = "testUser";
				accountLogin=userAccount;
				String userName=nickName;

				HttpSession session=request.getSession(true);
				session.setAttribute("userAccount", accountLogin);
				session.setAttribute("userName", userName);
					
				response.getWriter().write(JSON.toJSONString(result));
				return;
	}

}
