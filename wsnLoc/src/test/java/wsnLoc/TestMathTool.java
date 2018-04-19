package wsnLoc;

import static org.junit.Assert.*;

import org.junit.Test;

import com.hzpj.indoor.chainType.model.Point;
import com.hzpj.indoor.chainType.tool.MathTool;

public class TestMathTool {
	@Test
	public void test() {
		Point p1=new Point(2,2);
		Point p2=new Point(2,1);
		
		assertEquals(MathTool.norm2(p1, p2), 1,0);
//		System.out.print(Math.toDegrees(Math.atan((float)1/(float)0)));
		assertEquals(Math.toDegrees(MathTool.getRadiansFromLine(p1, p2)),90.0,0.1);
		
		Point pout=new Point(1,1);
		System.out.print(MathTool.getProjectivePoint(p1, p2, pout));
		
		p1=new Point(2,2);
		p2=new Point(1,1);
		pout=new Point(1,2);
		System.out.print(MathTool.getProjectivePoint(p1, p2, pout));
		
		p1=new Point(1,2);
		p2=new Point(2,2);
		pout=new Point(1,1);
		System.out.print(MathTool.getProjectivePoint(p1, p2, pout));
		
		double dd=11231.132123123123123123;
		assertEquals(MathTool.round(dd,2),11231.13,0);
	}
}
