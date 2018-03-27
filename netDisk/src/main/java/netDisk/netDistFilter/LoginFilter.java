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
@WebFilter(description = "判断是否登录", urlPatterns = { "/*" })
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
	 * 是否是静态资源访问
	 * 
	 * @param contextPath
	 *            httpServletRequest.getContextPath();获得
	 * @param path
	 *            url中的path
	 * @return
	 */
	private static boolean isResourcePath(String contextPath, String path) {
		if (path.indexOf(contextPath + "/view") >= 0) {
			return true;
		}
		return false;
	}

	/**
	 * 是否是Servlet访问
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
	 * 是否为正常访问，即Servlet,静态资源 和主页
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

		// 静态资源不拦截
		if (isResourcePath(contextPath, path)) {
			chain.doFilter(request, response);
			return;
		}

		// 不拦截登录和注册
		if (path.equals(contextPath + "/LoginServlet")
				|| path.equals(contextPath + "/RegisterServlet")) {
			chain.doFilter(request, response);
			return;
		}

		// session为空，没登录。
		HttpSession session = httpServletRequest.getSession(false);
		if (null == session) {
			httpServletResponse.sendRedirect(contextPath + "/LoginServlet");
			return;
		}

		// 对非主页,非servlet,非view访问进行拦截,防止非法访问,如直接下载其他用户的文件。
		// 问题在于用文件夹存储用户的内容。正常的网盘不应该这样。有很多问题的。
		if (!isNormalRequestPath(contextPath, path)) {
			String userAccount = (String) session.getAttribute("userAccount");
			if (userAccount == null) {
				httpServletResponse.sendRedirect(contextPath + "LoginServlet");
				return;
			}

			String[] sp = path.split("/");
			if (sp.length >= 3) {
				// 防止 用 /netDisk/用户名/XXX来非法访问别人的文件
				if (!sp[2].equals(userAccount)) {
					httpServletResponse.sendRedirect(contextPath);
					System.out.println("log[Warn]用户" + userAccount
							+ "试图非法用GET请求访问" + sp[2] + "的文件");
					return;
				}
			}
		}

		// 读取网盘所在地址。目前是在webapp文件夹下。
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
