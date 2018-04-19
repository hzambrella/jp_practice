package com.hzpj.indoor.chainType.model;

public class NodeDegree {
	private double l = 0;
	private double c = 0;
	private double w = 0;
	private double r = 0;
	private int degree=0;

//	public NodeDegree() {
//		this.l = 0;
//		this.c = 0;
//		this.w = 0;
//		this.r = 0;
//		this.degree=cacuDegree();
//	}

	public NodeDegree(double l, double c, double w, double r) {
		super();
		this.l = l;
		this.c = c;
		this.w = w;
		this.r = r;
		this.degree=cacuDegree();
	}
	
	public double getL() {
		return l;
	}

	public void setL(double l) {
		this.l = l;
	}

	public double getC() {
		return c;
	}

	public void setC(double c) {
		this.c = c;
	}

	public double getW() {
		return w;
	}

	public void setW(double w) {
		this.w = w;
	}

	public double getR() {
		return r;
	}
	
	public int getDegree(){
		return this.degree;
	}
	
	public void setR(double r) {
		this.r = r;
	}
	
	private int cacuDegree(){
		double cl = Math.sqrt(Math.pow(r, 2) - Math.pow(w, 2)) - c;
		double cr = Math.sqrt(Math.pow(r, 2) - Math.pow(w, 2)) + c;

		if (l <= 0 || r <= 0 || w <= 0 || c <= 0) {
			return -1;
		}

		if (l > r && l > cr) {
			return 1;
		}

		if (l > cl && l < cr && l > r) {
			return 2;
		}

		if (l > cr && l < r && l > r / 2) {
			return 3;
		}

		if (l > cl && l < cr && l < r && l > r / 2) {
			return 4;
		}

		if (l < cl && l < r) {
			return 5;
		}
		return -1;
	}
}
