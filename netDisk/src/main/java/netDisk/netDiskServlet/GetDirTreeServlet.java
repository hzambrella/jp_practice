package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.DTO.DirTreeNode;
import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.FileOperate;

import View.Result;

/**
 * Servlet implementation class GetDirTreeServlet 获得目录树
 */
@WebServlet("/GetDirTreeServlet")
public class GetDirTreeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public GetDirTreeServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());

		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		String targetPath = serverPath + userAccount;
		targetPath = targetPath.replace("/", File.separator);

		// 逻辑
		try{
			DirTreeNode dt=FileOperate.getDirTree(targetPath);
			result.getMap().put("dirTree", dt);
		}catch (IOException e){
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("读取目录树失败");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		// 结果
		response.getWriter().print(result.toJSON());
		//System.out.println(result.toJSON());
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
