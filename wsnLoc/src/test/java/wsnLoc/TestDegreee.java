package wsnLoc;

import org.junit.After;
import org.junit.Test;

import com.hzpj.indoor.chainType.model.NodeDegree;

public class TestDegreee {
	private double[][] testData = { { 7, 2, 3, 5 }, { 5.5, 2, 3, 5 },
			{ 4.5, 0.2, 3, 5 }, { 4.5, 1, 3, 5 }, { 3.5, 0.4, 3, 5 } };

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void test() {	
		for (int i = 0; i < testData.length; i++) {
			double[] data = testData[i];
			double l = data[0];
			double c = data[1];
			double w = data[2];
			double r = data[3];
			NodeDegree d = new NodeDegree(l,c,w,r);
			int degree = d.getDegree();
			System.out.print(degree+"-->");
		}

		System.out.print("my self data:");
		double l = 4;
		double c = 2;
		double w = 2;
		double r = 6;
		NodeDegree d = new NodeDegree(l,c,w,r);
		int degree = d.getDegree();
		System.out.println(degree);
	}

}
