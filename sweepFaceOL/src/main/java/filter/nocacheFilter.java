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
 * Servlet Filter implementation class nocacheFilter ������
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
		// Last-Modified:ҳ����������ʱ��
		httpresponse.setDateHeader("Last-Modified", date.getTime()); 
		// Expires:��ʱ����ֵ
		httpresponse.setDateHeader("Expires", date.getTime()); 
		// Cache-Control������ҳ��Ļ������,public:������ͻ�������������Ի���ҳ����Ϣ��
		httpresponse.setHeader("Cache-Control", "public"); 
		// Pragma:����ҳ���Ƿ񻺴棬ΪPragma�򻺴棬no-cache�򲻻���
		httpresponse.setHeader("Pragma", "Pragma");
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
