package netDisk.netDiskServlet;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import View.Result;
import netDisk.netDiskCfg.netDiskCfg;
import netDisk.netDiskEngine.UploadListener;
import netDisk.netDiskEngine.UploadStatus;

/**
 * Servlet implementation class UploadServlet 文件上传
 */
@WebServlet("/UploadServlet")
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UploadServlet() {
		super();
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 通用
		response.setCharacterEncoding("utf-8");
		// response.setContentType("text/html;charset=utf-8");
		Result result = new Result(200, "成功", new HashMap<String, Object>());
		String userAccount = (String) request.getSession(true).getAttribute(
				"userAccount");
		if (userAccount == null) {
			result.setCode(302);
			result.getMap().put("path", request.getContextPath()+"/LoginServlet");
			response.getWriter().print(result.toJSON());
			return;
		}


		String serverPath = netDiskCfg.getDiskDir();
		String targetPath = serverPath + File.separator + userAccount;

		// 参数
		UploadStatus status = new UploadStatus();
		UploadListener listener = new UploadListener(status);
		request.getSession().setAttribute("uploadStatus", status);

		// 创建解析工厂
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置文件缓存目录
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));
		// 设置内存临界值 - 超过后将产生临时文件并存储于临时目录中
		factory.setSizeThreshold(netDiskCfg.getMemoryThreshold()); // //设置文件缓存目录

		// 创建解析器
		ServletFileUpload upload = new ServletFileUpload(factory);
		// 设置最大文件上传值
		upload.setFileSizeMax(netDiskCfg.getMaxFileSize());
		// 设置最大请求值 (包含文件和表单数据)
		upload.setSizeMax(netDiskCfg.getMaxRequestSize());
		upload.setHeaderEncoding("UTF-8");
		// 注册上传过程监听器
		upload.setProgressListener(listener);

		// 解析request得到封装FileItem的list
		try {
			List<FileItem> list = upload.parseRequest(request);
			String fileDir = "";

			// 先处理表单数据
			for (FileItem item : list) {
				if (item.isFormField()) {
					if (item.getFieldName().equals("dirName")) {
						fileDir = item.getString().replace("/", File.separator);
					}
				}
			}
			//处理中文乱码
			fileDir=new String(fileDir.getBytes("ISO8859-1"),"utf-8");
			// TODO :MD5 重名处理
			// 再处理不在表单中的数据，就是上传的文件
			for (FileItem item : list) {
				if (!item.isFormField()) {
					String fileName = item.getName();
					// 最好加上这个，因为有可能只上传一个文件，如果这样的话，其它文件名是
					// 空的，在写时就会认为它是一个目录而报错
					if (fileName == null || "".equals(fileName)) {
						continue;
					}

					File saved = new File(targetPath + File.separator + fileDir
							+ File.separator + fileName);

	
					InputStream ins = item.getInputStream();
					OutputStream ous = new FileOutputStream(saved);

					byte[] tmp = new byte[1024];
					int len = -1;
					while ((len = ins.read(tmp)) != -1) {
						ous.write(tmp, 0, len); // 写文件
					}
					ous.close();
					ins.close();
				}
			}
			// 把异常改了，这样才会打印准确报错
		} catch (FileUploadException e) {
			e.printStackTrace();
			String errorMess = "上传发生错误：" + e.getMessage();
			result.setCode(500);
			result.setMessage(errorMess);
			response.getWriter().print(result.toJSON());
			return;
		}

		UploadStatus statusReset = (UploadStatus) request.getSession(true)
				.getAttribute("uploadStatus");

		if (null != statusReset) {
			statusReset.setItems(0);
		}

		response.getWriter().print(result.toJSON());
		return;
	}

	// 上传进度
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// 通用
		Result result = new Result(200, "成功", new HashMap<String, Object>());
		response.setCharacterEncoding("utf-8");
		response.setHeader("Cache-Control", "no-store"); // 禁止浏览器缓存
		response.setHeader("Pragrma", "no-cache"); // 禁止浏览器缓存
		response.setDateHeader("Expires", 0); // 禁止浏览器缓存

		UploadStatus status = (UploadStatus) request.getSession(true)
				.getAttribute("uploadStatus");// 从session中读取上传信息

		if (status == null) {
			response.getWriter().print(result.toJSON());
			return;
		}

		long startTime = status.getStartTime(); // 上传开始时间
		long currentTime = System.currentTimeMillis(); // 现在时间
		long time = (currentTime - startTime) / 1000 + 1;// 已经传输的时间 单位：s

		double velocity = status.getBytesRead() / time; // 传输速度：byte/s

		double totalTime = status.getContentLength() / velocity; // 估计总时间
		@SuppressWarnings("unused")
		double timeLeft = totalTime - time; // 估计剩余时间
		int percent = (int) (100 * (double) status.getBytesRead() / (double) status
				.getContentLength()); // 百分比
		@SuppressWarnings("unused")
		double length = status.getBytesRead() / 1024 / 1024; // 已完成数
		@SuppressWarnings("unused")
		double totalLength = status.getContentLength() / 1024 / 1024; // 总长度 M
		int item = status.getItems();// 正在传输第几个

		Map<String, Object> map = result.getMap();
		map.put("percent", percent);// 百分比
		map.put("item", item);// 正在传输第几个


		response.getWriter().println(result.toJSON()); // 输出给浏览器进度条
		return;
	}

}
