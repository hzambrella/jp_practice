package compareFaceOL;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.CmpRespSucc;
import model.DetectRespSucc;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import setting.KuangshiOL;
import View.Result;

/**
 * Servlet implementation class compareFaceServlet
 */
public class CompareFaceServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CompareFaceServlet() {
		super();
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
		Result result = new Result(200, "�ɹ�", new HashMap<String, Object>());
		// ����Ƿ�Ϊ��ý���ϴ�
		if (!ServletFileUpload.isMultipartContent(request)) {
			// ���������ֹͣ
			result.setCode(500);
			result.setMessage("��������� enctype=multipart/form-data");
			response.getWriter().println(result.toJSON());
			return;
		}
		// �����ϴ�����
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// �����ڴ��ٽ�ֵ - �����󽫲�����ʱ�ļ����洢����ʱĿ¼��
		factory.setSizeThreshold(KuangshiOL.MEMORY_THRESHOLD);
		// ������ʱ�洢Ŀ¼
		factory.setRepository(new File(System.getProperty("java.io.tmpdir")));

		ServletFileUpload upload = new ServletFileUpload(factory);

		// ��������ļ��ϴ�ֵ
		upload.setFileSizeMax(KuangshiOL.MAX_FILE_SIZE);

		// �����������ֵ (�����ļ��ͱ�����)
		upload.setSizeMax(KuangshiOL.MAX_REQUEST_SIZE);

		// ���Ĵ���
		upload.setHeaderEncoding("UTF-8");

		try {
			// ���������������ȡ�ļ�����
			List<FileItem> formItems = upload.parseRequest(request);

			if (formItems != null && formItems.size() > 0) {
				// ����������
				FileItem itemOrg = formItems.get(0);
				FileItem itemCmp = formItems.get(1);
				String orgName = itemOrg.getName();
				String cmpName = itemCmp.getName();
				if (orgName.equals(cmpName)) {
					cmpName = cmpName + "2";
				}
				File imgFileOrg = new File(request.getServletContext()
						.getRealPath("")
						+ File.separator
						+ KuangshiOL.UPLOAD_DIRECTORY
						+ File.separator
						+ orgName);
				File imgFileCmp = new File(request.getServletContext()
						.getRealPath("")
						+ File.separator
						+ KuangshiOL.UPLOAD_DIRECTORY
						+ File.separator
						+ cmpName);
				itemOrg.write(imgFileOrg);
				itemCmp.write(imgFileCmp);
				// ����face++�ӿ�
				try {
					CmpRespSucc re = KuangshiOL
							.kuangshiFaceCmpPostByHttpClient(imgFileOrg,
									imgFileCmp);

					if (null == re) {
						result.setCode(500);
						result.setMessage("����ӿ��쳣");
						response.getWriter().println(result.toJSON());
						System.out.println("log:����ӿ��쳣 re is null");
						return;
					}

					if (null != re.getErrorMessage()) {
						result.setCode(500);
						result.setMessage("����ӿ��쳣"
								+ KuangshiOL.formatErrorMessageFromKuangshi(re
										.getErrorMessage()));
						response.getWriter().println(result.toJSON());
						System.out.println("log:����ӿ��쳣 have error message");
						return;
					}
					result.getMap().put("result", re);
				} catch (Exception ex) {
					result.setCode(500);
					result.setMessage("����ӿ��쳣");
					response.getWriter().println(result.toJSON());
					ex.printStackTrace();
					return;
				}
			} else {
				result.setCode(400);
				result.setMessage("�ϴ��ļ�Ϊ��");
				response.getWriter().println(result.toJSON());
				System.out.println("log:�ϴ��ļ�Ϊ��");
				return;
			}
		} catch (Exception ex) {
			result.setCode(500);
			result.setMessage("�ļ��ϴ��쳣");
			response.getWriter().println(result.toJSON());
			ex.printStackTrace();
			return;
		}

		// �ɹ���
		response.getWriter().println(result.toJSON());

	}

}
