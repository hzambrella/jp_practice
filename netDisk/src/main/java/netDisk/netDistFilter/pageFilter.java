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

/**
 * Servlet Filter implementation class htmlFilter
 */
@WebFilter(filterName = "pageFilter", description = "不许直接访问html和jsp", urlPatterns = { "/*" })
public class pageFilter implements Filter {

	/**
	 * Default constructor.
	 */
	public pageFilter() {
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// place your code here

		// pass the request along the filter chain
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;
		String url = httpServletRequest.getRequestURI();

		if (url == null) {
			httpServletResponse.sendRedirect(httpServletRequest
					.getContextPath());
			return;
		}

		if (!(url.endsWith("login.html")||url.endsWith("login.jsp"))) {
			if ((url.endsWith(".html") || (url.endsWith(".jsp")))) {
				// 对直接访问html和jsp的请求,重定向到首页

				httpServletResponse.sendRedirect(httpServletRequest
						.getContextPath());
				return;
			}
		}
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
	}

}
