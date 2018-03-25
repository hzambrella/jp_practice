package netDisk.netDiskServlet;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.FileOperate;
import View.Result;

import com.alibaba.fastjson.JSON;

/**
 * Servlet implementation class moveFileServlet �ƶ���
 * http://localhost:8080/netDisk
 * /MoveFileServlet?orgDirName=/yellow&newDirName=/���������ļ���
 * &fileName=canglaoshi.avi
 * http://localhost:8080/netDisk/MoveFileServlet?newDirName
 * =/���������ļ���&fileName=yellow
 */
@WebServlet("/MoveFileServlet")
public class MoveFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public MoveFileServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			request.getServletContext()
					.getRequestDispatcher("/netDisk/LoginServlet")
					.forward(request, response);
		}

		// ͨ��
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		// У�����
		String orgDirName = request.getParameter("orgDirName");
		if (null == orgDirName) {
			orgDirName = "";
		}
		// orgDirName =new String(orgDirName.getBytes("ISO8859-1"),"UTF-8");

		String newDirName = request.getParameter("newDirName");
		if (null == newDirName) {
			newDirName = "";
		}
		// newDirName=new String(newDirName.getBytes("ISO8859-1"),"UTF-8");

		String[] fileNames = request.getParameterValues("fileNames[]");
		
		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		String orgPath = serverPath + userAccount + orgDirName;
		String newPath = serverPath + userAccount + newDirName;
		orgPath = orgPath.replace("/", File.separator);
		newPath = newPath.replace("/", File.separator);
		
		// �߼�
		if (fileNames == null || fileNames.length == 0) {
			result.setCode(400);
			result.setMessage("ȱ�ٴ��ƶ��ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}
		
		
		Map<String,String> failIds=new HashMap<String,String>();
		for (int i = 0; i < fileNames.length; i++) {
			String fileName = fileNames[i];
			File forg = new File(orgPath + File.separator + fileName);
			if (!forg.exists()) {
				failIds.put(String.valueOf(i), "Դ�ļ�������");
				continue;
			}
			
			File fnew = new File(newPath + File.separator + fileName);
			// TODO:auto rename
			if (fnew.exists()) {
				failIds.put(String.valueOf(i), "��Ŀ¼���Ѵ���ͬ���ļ�");
				continue;
			}
			
			if ((newPath + File.separator + fileName).indexOf(orgPath+File.separator+fileName) >= 0) {
				System.out.println(newPath + File.separator + fileName);
				System.out.println(orgPath+File.separator+fileName);
				failIds.put(String.valueOf(i), "���ܽ��ļ��ƶ������������Ŀ¼��");
				continue;
			}
			
			// ��Ŀ¼�����ھʹ���
			String newDir = newDirName;
			newDir = newDir.replace("/", File.separator);
			FileOperate.newFolderIfNotExist(serverPath + userAccount,
					newDir);

			boolean success = FileOperate.moveFile(orgPath, newPath, fileName);
			if (!success) {
				failIds.put(String.valueOf(i), "�ƶ��ļ�ʧ��");
				continue;
			}
		}
		result.getMap().put("failIds", failIds);

		// ���
		response.getWriter().print(result.toJSON());
		System.out.println(result.toJSON());
		return;
	}

}
