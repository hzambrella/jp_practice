package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskEngine.FileOperate;

import com.alibaba.fastjson.JSON;

import View.Result;

/**
 * Servlet implementation class RenameFileServlet ������
 * http://localhost:8080/netDisk/RenameFileServlet?newName=yellow&orgName=new2
 */
@WebServlet("/RenameFileServlet")
public class RenameFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RenameFileServlet() {
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
		
		//ͨ��
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		
		//У�����
		String orgName = request.getParameter("orgName");
		if (null==orgName){
			result.setCode(400);
			result.setMessage("ȱ�ٴ��޸��ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		orgName =new String(orgName.getBytes("ISO8859-1"),"UTF-8"); 
		
		String newName= request.getParameter("newName");
		if (null==newName){
			result.setCode(400);
			result.setMessage("ȱ��������");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		newName =new String(newName.getBytes("ISO8859-1"),"UTF-8"); 
		
		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}
		targetPath =new String(targetPath.getBytes("ISO8859-1"),"UTF-8"); 

		String serverPath = request.getServletContext().getRealPath("")
				+ File.separator;

		targetPath = serverPath + userAccountMock + targetPath;
		targetPath=targetPath.replace("/", File.separator);
		
		//�߼�
		File f=new File(targetPath+File.separator+newName);
		if (f.exists()){
			result.setCode(400);
			result.setMessage("��Ŀ¼���Ѵ���ͬ���ļ�");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String realNewName=FileOperate.renameFile(targetPath,orgName,newName);
		if (null==realNewName){
			result.setCode(500);
			result.setMessage("������ʧ��");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		//���
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
		doGet(request,response);
	}

}
