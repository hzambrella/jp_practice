package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONPath;

import View.Result;

/**
 * Servlet implementation class MkdirServlet 新建文件夹
 */
@WebServlet("/MkdirServlet")
public class MkdirServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MkdirServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userAccountMock = "testUser";

		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());

		// 校验参数
		String folderName = request.getParameter("folderName");
		if (null == folderName) {
			result.setCode(400);
			result.setMessage("缺少文件夹名称");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		folderName = new String(folderName.getBytes("ISO8859-1"), "UTF-8");

		String dirName = request.getParameter("dirName");
		if (null == dirName) {
			dirName="";
		}
		dirName = new String(dirName.getBytes("ISO8859-1"), "UTF-8");

		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		String targetPath = serverPath + userAccountMock + dirName;
		targetPath=targetPath.replace("/", File.separator);

		
		File f=new File(targetPath+File.separator+folderName);
		if (f.exists()){
			result.setCode(400);
			// TODO 改变名字
			result.setMessage("文件夹已存在");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}else{
			f.mkdir();
		}

		// 结果
		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
