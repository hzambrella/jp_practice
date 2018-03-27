package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
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
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		//ͨ��
		response.setCharacterEncoding("utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}
		

		
		//У�����
		String orgName = request.getParameter("orgName");
		if (null==orgName){
			result.setCode(400);
			result.setMessage("ȱ�ٴ��޸��ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		String newName= request.getParameter("newName");
		if (null==newName){
			result.setCode(400);
			result.setMessage("ȱ��������");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}

		String targetPath = request.getParameter("dirname");
		if (targetPath == null) {
			targetPath = "";
		}

		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		targetPath = serverPath + userAccount + targetPath;
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
		//System.out.println(result.toJSON());
		return;
	}

}
