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
import netDisk.netDiskEngine.FileOperate;

import com.alibaba.fastjson.JSON;

import View.Result;

/**
 * Servlet implementation class GetDirTreeServlet ���Ŀ¼��
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
		String userAccountMock="testUser";
		
		// ͨ��
//		String re=request.getParameter("1");
//		if (null==re){
//			response.sendError(400,"1111");
//			return;
//		}
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		String targetPath = serverPath + userAccountMock;
		targetPath = targetPath.replace("/", File.separator);

		// �߼�
		try{
			DirTreeNode dt=FileOperate.getDirTree(targetPath);
			result.getMap().put("dirTree", dt);
		}catch (IOException e){
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("��ȡĿ¼��ʧ��");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		// ���
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
