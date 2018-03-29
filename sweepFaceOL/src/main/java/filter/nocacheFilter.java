package filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet Filter implementation class nocacheFilter 不缓存
 */
public class nocacheFilter implements Filter {

	/**
	 * Default constructor.
	 */
	public nocacheFilter() {
		// TODO Auto-generated constructor stub
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
		HttpServletResponse httpresponse = (HttpServletResponse) response;
		chain.doFilter(request, response);
		java.util.Date date = new java.util.Date();
		// Last-Modified:页面的最后生成时间
		httpresponse.setDateHeader("Last-Modified", date.getTime()); 
		// Expires:过时期限值
		httpresponse.setDateHeader("Expires", date.getTime()); 
		// Cache-Control来控制页面的缓存与否,public:浏览器和缓存服务器都可以缓存页面信息；
		httpresponse.setHeader("Cache-Control", "public"); 
		// Pragma:设置页面是否缓存，为Pragma则缓存，no-cache则不缓存
		httpresponse.setHeader("Pragma", "Pragma");
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
