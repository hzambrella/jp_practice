package com.hzpj.indoor.chainType.tool;

import com.hzpj.indoor.chainType.model.Point;

public class MathTool {
	/**
	 * 求欧氏距离
	 * 
	 * @param p1
	 *            线段的端点
	 * @param p2
	 *            线段的端点
	 * @return
	 */
	public static double norm2(Point p1, Point p2) {
		double juli = Math.sqrt(Math.abs((p1.getX() - p2.getX())
				* (p1.getX() - p2.getX()) + (p1.getY() - p2.getY())
				* (p1.getY() - p2.getY())));
		return juli;
	}

	/**
	 * 计算直线的弧度
	 * 
	 * @param p1
	 *            线段的端点
	 * @param p2
	 *            线段的端点
	 * @return
	 */
	public static double getRadiansFromLine(Point p1, Point p2) {
		double xDis = Math.abs(p1.getX() - p2.getX());
		double yDis = Math.abs(p1.getY() - p2.getY());

		double radians = 0;

		radians = Math.atan(yDis / xDis);

		return radians;
	}

	/**
	 * 求pOut在pLine以及pLine2所连直线上的投影点
	 * 
	 * @param pLine
	 * @param pLine2
	 * @param pOut
	 * @param pProject
	 */
	public static Point getProjectivePoint(Point pLine, Point pLine2, Point pOut) {
		double k = 0;
		k = getSlope(pLine.x, pLine.y, pLine2.x, pLine2.y);
		return getProjectivePoint(pLine, k, pOut);
	}

	/**
	 * 计算点到另一直线的投影点
	 * 
	 * @param pLine
	 *            线上一点
	 * @param k
	 *            斜率
	 * @param pOut
	 *            线外一点
	 * @return 投影点
	 */
	public static Point getProjectivePoint(Point pLine, Double k, Point pOut) {
		Point pProject = new Point();
		if (k.isNaN()) {
			pProject.setLocation(pLine.getX(), pOut.getY());
		} else if (k == 0) {
			pProject.setLocation(pOut.getX(), pLine.getY());
		} else {
			double x = (k * pLine.getX() + pOut.getX() / k + pOut.getY() - pLine
					.getY()) / (1 / k + k);
			double y = -1 / k * (x - pOut.getX()) + pOut.getY();
			pProject.setLocation(x, y);
		}
		return pProject;
	}

	/**
	 * 
	 * 通过两个点坐标计算斜率 已知A(x1,y1),B(x2,y2) 1、若x1=x2,则斜率不存在；
	 * 2、若x1≠x2,则斜率k=[y2－y1]/[x2－x1]
	 * 
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @return 斜率，若垂线返回NaN
	 */
	public static Double getSlope(double x1, double y1, double x2, double y2) {
		if (x1 == x2) {
			return Double.NaN;
		}
		return (y2 - y1) / (x2 - x1);
	}
	
	public static double round(double data,int f){
		if (f<=1){
			return data;
		}
		return Math.round(data*Math.pow(10,f))/Math.pow(10,f);
	}
}
