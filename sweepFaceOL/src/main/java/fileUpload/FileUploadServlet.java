package fileUpload;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import setting.Setting;
import View.Result;

/**
 * Servlet implementation class fileUploadServlet
 */
public class FileUploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FileUploadServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Result result = new Result(200, "上传成功", new HashMap<String,Object>());
		response.setCharacterEncoding("utf-8");
		//对于文件请求。防止部分浏览器对json数据添加<pre>标签
		response.setContentType("text/html");
		// 检测是否为多媒体上传
		if (!ServletFileUpload.isMultipartContent(request)) {
			// 如果不是则停止
			result.setCode(500);
			result.setMessage("表单必须包含 enctype=multipart/form-data");
			response.getWriter().println(result.toJSON());
			return;
		}

		// 配置上传参数
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置内存临界值 - 超过后将产生临时文件并存储于临时目录中
		factory.setSizeThreshold(Setting.MEMORY_THRESHOLD);
		// 设置临时存储目录
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));

		ServletFileUpload upload = new ServletFileUpload(factory);

		// 设置最大文件上传值
		upload.setFileSizeMax(Setting.MAX_FILE_SIZE);

		// 设置最大请求值 (包含文件和表单数据)
		upload.setSizeMax(Setting.MAX_REQUEST_SIZE);

		// 中文处理
		upload.setHeaderEncoding("UTF-8");

		// 构造临时路径来存储上传的文件
		// 这个路径相对当前应用的目录
		String uploadPath = request.getServletContext().getRealPath("")
				+ File.separator + Setting.UPLOAD_DIRECTORY;

		// 如果目录不存在则创建
		File uploadDir = new File(uploadPath);
		if (!uploadDir.exists()) {
			uploadDir.mkdir();
		}

		Map<String,Object> rmap = result.getMap();
		try {
			// 解析请求的内容提取文件数据
			List<FileItem> formItems = upload.parseRequest(request);

			if (formItems != null && formItems.size() > 0) {
				List<String> fileNames = new ArrayList<String> ();
				// 迭代表单数据
				for (FileItem item : formItems) {
					// 处理不在表单中的字段
					if (!item.isFormField()) {
						String fileName = new File(item.getName()).getName();
						
						String filePath = uploadPath + File.separator
								+ fileName;
						
						File storeFile = new File(filePath);
						// 在控制台输出文件的上传路径
						
						// 保存文件到硬盘
						item.write(storeFile);
						fileNames.add(fileName);
					}
				}
				
				rmap.put("fileName", fileNames);
				result.setMap(rmap);
			}else{
				result.setCode(400);
				result.setMessage("上传文件为空");
				response.getWriter().println(result);
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("文件上传异常");
			ex.printStackTrace();
			return;
		}

		response.getWriter().println(result);
		System.out.println(result.toJSON());
	}

}
