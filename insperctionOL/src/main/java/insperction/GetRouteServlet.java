package insperction;

import java.io.IOException;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;

import TSP.DP;
import TSP.DP2;
import View.Result;

/**
 * Servlet implementation class GetRoutes
 */
@WebServlet("/GetRouteServlet")
public class GetRouteServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       


	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setCharacterEncoding("utf-8");
		Result result=new Result(200,"成功",new HashMap<String,Object>());
		String adjacencyStr=request.getParameter("adjacency");
		double[][] adjacency;
		try{
			adjacency=JSON.parseObject(adjacencyStr,double[][].class);
		}catch(Exception e){
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("系统服务异常");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		DP2 ff = new DP2(adjacency);
		
		try{
			String cityFlowStr=JSON.toJSONString(ff.getFirnalCityFlow().split("->"));
			result.getMap().put("min_distance", ff.getMinDistance());
			result.getMap().put("cityflow", cityFlowStr);
		}catch(Exception e){
			e.printStackTrace();
			result.setCode(500);
			result.setMessage("系统服务异常");
			response.getWriter().print(result.toJSON());
			return;
		}
		
		response.getWriter().print(result.toJSON());
	}

}
