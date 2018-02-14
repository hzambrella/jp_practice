package sweepFaceOL;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.DetectRespSucc;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import setting.Setting;
import View.Result;

/**
 * Servlet implementation class sweepServlet
 */
public class SweepServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * Default constructor.
	 */
	public SweepServlet() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html");
		Result result = new Result(200, "成功", new HashMap<String, Object>());
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

		try {
			// 解析请求的内容提取文件数据
			List<FileItem> formItems = upload.parseRequest(request);

			if (formItems != null && formItems.size() > 0) {
				// 迭代表单数据
				FileItem item = formItems.get(0);
				File imgFile = new File(item.getName());
				item.write(imgFile);			
				// 调用face++接口
				try {
					DetectRespSucc re=Setting.kuangshiFaceDetectPostByHttpClient(imgFile);

					if (null==re){
						result.setCode(500);
						result.setMessage("服务接口异常");
						response.getWriter().println(result.toJSON());
						System.out.println("log:服务接口异常 re is null");
						return;
					}
					
					if (null!=re.getErrorMessage()){
						result.setCode(500);
						result.setMessage("服务接口异常"+re.getErrorMessage());
						response.getWriter().println(result.toJSON());
						System.out.println("log:服务接口异常 have error message");
						return;
					}
					result.getMap().put("result", re);
				} catch (Exception ex) {
					result.setCode(500);
					result.setMessage("服务接口异常");
					response.getWriter().println(result.toJSON());
					ex.printStackTrace();
					return;
				}
			} else {
				result.setCode(400);
				result.setMessage("上传文件为空");
				response.getWriter().println(result.toJSON());
				System.out.println("log:上传文件为空");
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("文件上传异常");
			response.getWriter().println(result.toJSON());
			ex.printStackTrace();
			return;
		}
		
		//成功。
		response.getWriter().println(result.toJSON());

	}

	

}
