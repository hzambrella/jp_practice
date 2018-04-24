package wsnLoc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.junit.Test;

import com.alibaba.fastjson.JSON;
import com.hzpj.indoor.chainType.model.Anchor;
import com.hzpj.indoor.chainType.model.NodeDegree;
import com.hzpj.indoor.chainType.model.Point;
import com.hzpj.indoor.chainType.tool.MockAnchorData;
import com.hzpj.indoor.chainType.tool.MockMapData;

public class TestCreateAnchorNode {

	@Test
	public void test() {
		ArrayList<Anchor> result = mockC();
		System.out.println(JSON.toJSON(result));
		System.out.println(result.size());
	}

	private ArrayList<Anchor> mockC() {
		ArrayList<double[]> result = new ArrayList<double[]>();

		double[] v = { 29.222, 31.269, 103.371 };
		double[] c = { 17.221, 19.294, 67.762, 69.899 };
		// double[] v2={25.58,27.70,100.011};
		// double[] c2={13.093,15.180,63.605,65.88};
		// 左边
		Point cLBIn = new Point(v[1], c[1]);
		Point cLTIn = new Point(v[1], c[2]);
		Point cLBOut = new Point(v[0], c[1]);
		Point cLTOut = new Point(v[0], c[2]);
		// 上边
		Point cTLIn = cLTIn;
		Point cTRIn = new Point(v[2], c[2]);
		Point cTLOut = new Point(v[1], c[3]);
		Point cTROUt = new Point(v[2], c[3]);
		// 下边
		Point cBLIn = cLBIn;
		Point cBRIn = new Point(v[2], c[1]);
		Point cBLOut = new Point(v[1], c[0]);
		Point cBROUt = new Point(v[2], c[0]);
		ArrayList<double[]> resultP = new ArrayList<double[]>();

		resultP.add(new double[] { cLBIn.x, cLBIn.y });
		resultP.add(new double[] { cLTIn.x, cLTIn.y });
		// resultP.add(new double[]{cLBOut.x,cLBOut.y});
		// resultP.add(new double[]{cLTOut.x,cLTOut.y});

		resultP.add(new double[] { cTRIn.x, cTRIn.y });
		// resultP.add(new double[]{cTLOut.x,cTLOut.y});
		// resultP.add(new double[]{cTROUt.x,cTROUt.y});

		resultP.add(new double[] { cBRIn.x, cBRIn.y });
		// resultP.add(new double[]{cBLOut.x,cBLOut.y});
		// resultP.add(new double[]{cBROUt.x,cBROUt.y});

		Point[] binL = { cLBIn, cLTIn };
		Point[] boutL = { cLBOut, cLTOut };
		Point[] binT = { cTLIn, cTRIn };
		Point[] boutT = { cTLOut, cTROUt };
		Point[] binB = { cBLIn, cBRIn };
		Point[] boutB = { cBLOut, cBROUt };
		NodeDegree d = new NodeDegree(4, 2, 2, 7);
		// // 左边

		MockAnchorData mL = new MockAnchorData(binL, boutL, d);
		ArrayList<double[]> resultL = mL.mockData();

		//
		// // 上边
		//
		MockAnchorData mT = new MockAnchorData(binT, boutT, d);
		ArrayList<double[]> resultT = mT.mockData();

		// 下边
		MockAnchorData mB = new MockAnchorData(binB, boutB, d);
		ArrayList<double[]> resultB = mB.mockData();

		result.addAll(resultP);
		result.addAll(resultL);
		result.addAll(resultT);
		result.addAll(resultB);

		// 特殊
		double[][] resultLB = new double[][] { { v[0], c[0] },
				{ v[0] - d.getL(), c[0] },
				// { v[0] - 2 * d.getL(), c[0] },
				{ cLBIn.x - d.getL(), cLBIn.y },
				{ cLBIn.x - 2 * d.getL(), cLBIn.y } };

		double[][] resultLT = new double[][] { { v[0], c[3] },
				{ v[0] - d.getL(), c[3] },
				// { v[0] - 2 * d.getL(), c[3] },
				{ cLTIn.x - d.getL(), cLTIn.y },
				{ cLTIn.x - 2 * d.getL(), cLTIn.y } };

		double[] rt = new double[] {
				resultT.get(resultT.size() - 1)[0] + d.getL(),
				resultT.get(resultT.size() - 1)[1] };
		double[] rb = new double[] {
				resultB.get(resultB.size() - 1)[0] + d.getL(),
				resultB.get(resultB.size() - 1)[1] };

		for (double[] dd : resultLB) {
			result.add(dd);
		}

		for (double[] dd : resultLT) {
			result.add(dd);
		}

		// System.out.println(JSON.toJSON(rt));
		result.add(rt);
		result.add(rb);

		Map<String, Anchor> anchorsMap = new HashMap<String, Anchor>();
		for (int i = 0; i < result.size(); i++) {
			int key = MockMapData.mapId * 10000 + i;
			String keyStr = String.valueOf(key);
			Anchor anchor = new Anchor(keyStr, result.get(i));
			anchorsMap.put(keyStr, anchor);
		}
		
		for (int key:this.specialKey){
			String keyStr = String.valueOf(key);
			anchorsMap.get(keyStr).isNormal=false;
		}
		
		
		ArrayList<Anchor> anchors = new ArrayList<Anchor>();
		for (Anchor a : anchorsMap.values()) {
			anchors.add(a);
		}

		return anchors;
	}

	private int[] specialKey = { 100000097, 100000000, 100000100, 100000098,
			100000003, 100000106, 100000001, 100000101, 100000102, 100000104,
			100000105, 100000002 };
}
