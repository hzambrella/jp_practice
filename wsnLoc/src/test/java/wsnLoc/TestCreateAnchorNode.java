package wsnLoc;

import org.junit.Test;

import com.alibaba.fastjson.JSON;
import com.hzpj.indoor.chainType.model.NodeDegree;
import com.hzpj.indoor.chainType.model.Point;
import com.hzpj.indoor.chainType.tool.MockAnchorData;

public class TestCreateAnchorNode {
	@Test
	public void test() {
		Point[] bin={new Point(0,0),new Point(0,48)};
		Point[] bout={new Point(-2,-2),new Point(-2,50)};
		
		NodeDegree d=new NodeDegree(4, 2, 2, 7);
		MockAnchorData m=new MockAnchorData(bin, bout, d);
		System.out.println(JSON.toJSON(m.mockData()));
	}
}
