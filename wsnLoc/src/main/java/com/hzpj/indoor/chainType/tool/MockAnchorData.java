package com.hzpj.indoor.chainType.tool;

import java.util.ArrayList;

import com.hzpj.indoor.chainType.model.Anchor;
import com.hzpj.indoor.chainType.model.NodeDegree;
import com.hzpj.indoor.chainType.model.Point;

public class MockAnchorData {
	private Point[] boundaryIn;
	private Point[] boundaryOut;
	private NodeDegree d;
	
	public MockAnchorData(Point[] boundaryIn, Point[] boundaryOut, NodeDegree d) {
		super();

		this.boundaryIn = boundaryIn;
		this.boundaryOut = boundaryOut;
		this.d = d;
	}

	/**
	 * 算出直线区域的锚节点数组
	 * 
	 * @return
	 */

	public ArrayList<double[]> mockData() {
		if (d.getDegree() == -1)
			return null;

		if (boundaryIn.length < 2 || boundaryOut.length < 2)
			return null;

		double rangeIn = MathTool.norm2(boundaryIn[0], boundaryIn[1]);
		// double rangeOut = MathTool.norm2(beginOut, boundaryOut[1]);

		double radiansIn = MathTool.getRadiansFromLine(boundaryIn[0],
				boundaryIn[1]);
		double radiansIOut = MathTool.getRadiansFromLine(boundaryOut[0],
				boundaryOut[1]);

		double xInIns = (Math.cos(radiansIn) * d.getL());
		double yInIns = (Math.sin(radiansIn) * d.getL());
		double xOutIns = (Math.cos(radiansIOut) * d.getL());
		double yOutIns = (Math.sin(radiansIOut) * d.getL());
		
		double cxIns = Math.cos(radiansIOut) * d.getC();
		double cyIns = Math.sin(radiansIOut) * d.getC();
		xInIns=MathTool.round(xInIns, 5);
		yInIns=MathTool.round(yInIns, 5);
		xOutIns=MathTool.round(xOutIns, 5);
		yOutIns=MathTool.round(yOutIns, 5);
		cxIns=MathTool.round(cxIns, 5);
		cyIns=MathTool.round(cyIns, 5);

		int nodeNumIn = (int) Math.floor(rangeIn / d.getL());
		// int nodeNumOut = (int) Math.floor(rangeOut / d.getL());
		//System.out.println(nodeNumIn+" "+rangeIn);

		ArrayList<double[]> result = new ArrayList<double[]>();
		double[] inNext = { boundaryIn[0].getX(), boundaryIn[0].getY() };
		
//		result.add(new double[] { boundaryIn[0].getX(), boundaryIn[0].getY() });
		double[] outFirstProjection = MathTool.getProjectivePoint(
				boundaryOut[0], boundaryOut[1], boundaryIn[0]).toDouble();
		
		double[] outNext = { outFirstProjection[0] + cxIns,
				outFirstProjection[1] + cyIns };
		result.add(outNext);
			
		for (int i = 0; i < nodeNumIn - 1; i++) {
			inNext = new double[] { inNext[0] + xInIns, inNext[1] + yInIns };
//			result.add(new double[] { inNext[0], inNext[1] });
			result.add(inNext);

			outNext = new double[] { outNext[0] + xOutIns, outNext[1] + yOutIns };
//			result.add(new double[] { outNext[0], outNext[1] });
			result.add(outNext);
		}

//		result.add(new double[] { boundaryIn[1].getX(), boundaryIn[1].getY() });
		return result;
	}
}
