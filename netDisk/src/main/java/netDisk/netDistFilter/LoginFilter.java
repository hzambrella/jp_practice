package netDisk.netDistFilter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;

import netDisk.netDiskCfg.netDiskCfg;

/**
 * Servlet Filter implementation class LoginFilter
 */
@WebFilter(description = "�ж��Ƿ��¼", urlPatterns = { "/*" })
public class LoginFilter implements Filter {

	/**
	 * Default constructor.
	 */
	public LoginFilter() {

	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {

	}

	/**
	 * �Ƿ��Ǿ�̬��Դ����
	 * 
	 * @param contextPath
	 *            httpServletRequest.getContextPath();���
	 * @param path
	 *            url�е�path
	 * @return
	 */
	private static boolean isResourcePath(String contextPath, String path) {
		if (path.indexOf(contextPath + "/view") >= 0) {
			return true;
		}
		return false;
	}

	/**
	 * �Ƿ���Servlet����
	 * 
	 * @param contextPath
	 * @param path
	 * @return
	 */
	private static boolean isServletPath(String contextPath, String path) {
		String[] split = path.split("/");
		if (split.length != 3) {
			return false;
		}
		if (split[2].indexOf("Servlet") < 0) {
			return false;
		}
		return true;
	}

	/**
	 * �Ƿ�Ϊ�������ʣ���Servlet,��̬��Դ ����ҳ
	 * 
	 * @param contextPath
	 * @param path
	 * @return
	 */
	private static boolean isNormalRequestPath(String contextPath, String path) {
		if (isResourcePath(contextPath, path)
				|| isServletPath(contextPath, path)) {
			return true;
		}

		if (path.equals(contextPath) || path.equals(contextPath + "/")) {

			return true;
		}
		return false;
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;

		String path = httpServletRequest.getRequestURI();

		String contextPath = httpServletRequest.getContextPath();

		if (!(path.equals(contextPath + "/UploadServlet") && httpServletRequest
				.getMethod().equals("GET"))) {
			System.out.println("log[info]" + httpServletRequest.getMethod()
					+ ":" + path);
		}

		// ��̬��Դ������
		if (isResourcePath(contextPath, path)) {
			chain.doFilter(request, response);
			return;
		}

		// �����ص�¼��ע��
		if (path.equals(contextPath + "/LoginServlet")
				|| path.equals(contextPath + "/RegisterServlet")) {
			chain.doFilter(request, response);
			return;
		}

		// sessionΪ�գ�û��¼��
		HttpSession session = httpServletRequest.getSession(false);
		if (null == session) {
			httpServletResponse.sendRedirect(contextPath + "/LoginServlet");
			return;
		}

		// �Է���ҳ,��servlet,��view���ʽ�������,��ֹ�Ƿ�����,��ֱ�����������û����ļ���
		// �����������ļ��д洢�û������ݡ����������̲�Ӧ���������кܶ�����ġ�
		if (!isNormalRequestPath(contextPath, path)) {
			String userAccount = (String) session.getAttribute("userAccount");
			if (userAccount == null) {
				httpServletResponse.sendRedirect(contextPath + "LoginServlet");
				return;
			}

			String[] sp = path.split("/");
			if (sp.length >= 3) {
				// ��ֹ �� /netDisk/�û���/XXX���Ƿ����ʱ��˵��ļ�
				if (!sp[2].equals(userAccount)) {
					httpServletResponse.sendRedirect(contextPath);
					System.out.println("log[Warn]�û�" + userAccount
							+ "��ͼ�Ƿ���GET�������" + sp[2] + "���ļ�");
					return;
				}
			}
		}

		// ��ȡ�������ڵ�ַ��Ŀǰ����webapp�ļ����¡�
		if (netDiskCfg.getDiskDir() == null) {
			netDiskCfg.setDiskDir(httpServletRequest.getServletContext()
					.getRealPath(""));
		}

		chain.doFilter(request, response);
		return;
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {

	}

}
