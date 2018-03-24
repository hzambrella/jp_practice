package netDisk.netDistFilter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * Servlet Filter implementation class LoginFilter
 */
@WebFilter(description = "ÅÐ¶ÏÊÇ·ñµÇÂ¼", urlPatterns = { "/*" })
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
		System.out.println(url);
		//¾²Ì¬×ÊÔ´²»À¹½Ø
		if (url.indexOf(".")!=-1){
			chain.doFilter(request, response);
			return;
		}
		
		//²»À¹½ØµÇÂ¼ºÍ×¢²á
		if (url.equals("/netDisk/LoginServlet")||url.equals("/netDisk/RegisterServlet")){
			chain.doFilter(request, response);
			return;
		}
		
//		if(url != null && (url.endsWith(".js")||(url.endsWith(".css")))){
//			httpServletResponse.sendRedirect(httpServletRequest.getContextPath());
//			return;
//		}
		//sessionÎª¿Õ£¬Ã»µÇÂ¼¡£
		HttpSession session=httpServletRequest.getSession(false);
		if (null==session){
			httpServletResponse.sendRedirect("LoginServlet");
			return;
		}
//		System.out.println(session.getId());
//		boolean remember=(boolean) session.getAttribute("rememberLogin");
//		if (!remember){
//			for (Cookie c:httpServletRequest.getCookies()){
//				System.out.println(c.getMaxAge()+":"+c.getValue());
//				c.setMaxAge(-1);
//			}
//		}
	
		chain.doFilter(request, response);
		return;
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {

	}

}
