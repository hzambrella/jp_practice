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
 * Servlet implementation class CopyFileServlet ���Ƶ�
 * http://localhost:8080/netDisk/CopyFileServlet?orgDirName=/yellow&newDirName=/%E4%B8%AD%E6%96%87%E5%90%8D%E5%AD%97%E6%96%87%E4%BB%B6%E5%A4%B9/dasdsa/1231321/1321312/3123131312321&fileName=canglaoshi.avi
 */

//TODO  bug
@WebServlet("/CopyFileServlet")
public class CopyFileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CopyFileServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// ͨ��
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());

		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		
		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		// У�����
		String orgDirName = request.getParameter("orgDirName");
		if (null == orgDirName) {
			orgDirName = "";
		}
	

		String newDirName = request.getParameter("newDirName");
		if (null == newDirName) {
			newDirName = "";
		}
		
		String[] fileNames = request.getParameterValues("fileNames[]");
		if (fileNames == null||fileNames.length==0) {
			result.setCode(400);
			result.setMessage("ȱ���ļ���");
			response.getWriter().print(JSON.toJSONString(result));
			return;
		}

		String serverPath=netDiskCfg.getDiskDir()+File.separator;

		String orgPath = serverPath + userAccount + orgDirName;
		String newPath = serverPath + userAccount + newDirName;
		//Դ�ļ�����Ŀ¼
		String src = orgPath.replace("/", File.separator);
		//Ŀ��Ŀ¼
		String des = newPath.replace("/", File.separator);
		Map<String,String> failIds=new HashMap<String,String>();
		
		// ��Ŀ¼�����ھʹ���
		String newDir = newDirName;
		newDir = newDir.replace("/", File.separator);
		FileOperate.newFolderIfNotExist(serverPath +userAccount, newDir);
		
		// �߼�
		for (int i=0;i<fileNames.length;i++){
			String fileName=fileNames[i];
			File fnew = new File(newPath + File.separator + fileName);
			// TODO:auto rename
			if (fnew.exists()) {
				failIds.put(String.valueOf(i),"��Ŀ¼���Ѵ���ͬ���ļ�");
				continue;
			}

			File forg = new File(src + File.separator + fileName);
			if (!forg.exists()) {
				failIds.put(String.valueOf(i),"Դ�ļ�������");
				continue;
			}

			if ((des+File.separator+fileName).indexOf(src+File.separator+fileName) >= 0) {
				failIds.put(String.valueOf(i),"���ܽ��ļ����Ƶ����������Ŀ¼��");
				continue;
			}
				
			try {
				boolean success=FileOperate.copyFile(src, des,fileName);
				if (!success){

					failIds.put(String.valueOf(i),"�����ļ�����");
					continue;
				}
			} catch (Exception e) {
				failIds.put(String.valueOf(i),"�����ļ�����");
				e.printStackTrace();
				continue;
			}		
		}
		
		result.getMap().put("failIds", failIds);
		response.getWriter().print(result.toJSON());
		//System.out.println(result.toJSON());
		return;
	}


}
