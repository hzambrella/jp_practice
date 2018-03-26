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
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpServletRequest = (HttpServletRequest) request;
		HttpServletResponse httpServletResponse = (HttpServletResponse) response;
		String url = httpServletRequest.getRequestURI();
		if (!(url.equals("/netDisk/UploadServlet")&&httpServletRequest.getMethod().equals("GET"))){
			System.out.println(httpServletRequest.getMethod()+":"+url);
		}
		
		//��̬��Դ������
		if (url.indexOf(".")!=-1){
			chain.doFilter(request, response);
			return;
		}
		
		//�����ص�¼��ע��
		if (url.equals("/netDisk/LoginServlet")||url.equals("/netDisk/RegisterServlet")){
			chain.doFilter(request, response);
			return;
		}
		
		//sessionΪ�գ�û��¼��
		HttpSession session=httpServletRequest.getSession(false);
		if (null==session){
			httpServletResponse.sendRedirect("LoginServlet");
			return;
		}
		
		//��ȡ�������ڵ�ַ��Ŀǰ����webapp�ļ����¡�
		if (netDiskCfg.getDiskDir()==null){
			netDiskCfg.setDiskDir(httpServletRequest.getServletContext().getRealPath(""));
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
