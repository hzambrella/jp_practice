package netDisk.netDiskServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import netDisk.netDiskCfg.netDiskCfg;
import View.Result;

/**
 * Servlet implementation class DownloadServlet
 */
@WebServlet("/DownloadServlet")
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DownloadServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		resp.setCharacterEncoding("utf-8");
		
		String userAccount = (String) req.getSession(true).getAttribute(
				"userAccount");
		
		if (userAccount == null) {
			resp.sendRedirect(req.getContextPath()+"/"+"LoginServlet");
			return;
		}

		String dirName = req.getParameter("dirName");
		if (dirName == null) {
			dirName = "";
		}
		
		String fileName = req.getParameter("fileName");
		fileName = fileName.replace("/", File.separator);
		String serverPath = netDiskCfg.getDiskDir();
		
		String filePath=serverPath + File.separator + userAccount
				+ File.separator + dirName + File.separator+fileName;
		File file = new File(filePath);
		
		//TODO:ÌáÊ¾Ò³Ãæ
		if (!file.exists()){
			resp.sendRedirect(req.getContextPath());
			return;
		}
		
		if (file.isDirectory()){
			resp.sendRedirect(req.getContextPath());
			return;
		}

		resp.setContentType("application/octet-stream");
		resp.setHeader("Content-Disposition", "attachment;filename=" + fileName);
		resp.setContentLength((int) file.length());

		FileInputStream fis = null;
		try {
			fis = new FileInputStream(file);
			byte[] buffer = new byte[128];
			int count = 0;
			while ((count = fis.read(buffer)) > 0) {
				resp.getOutputStream().write(buffer, 0, count);
			}
			fis.close();
		} catch (Exception e) {
			resp.getOutputStream().flush();
			resp.getOutputStream().close();
			e.printStackTrace();
		} finally {
			resp.getOutputStream().flush();
			resp.getOutputStream().close();
		
		}
	}

}
