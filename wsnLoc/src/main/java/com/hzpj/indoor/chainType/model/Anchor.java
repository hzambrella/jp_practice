package com.hzpj.indoor.chainType.model;

/**
 * 锚节点
 */
public class Anchor extends Sensor {
	public boolean isNormal;
	public boolean isConfirm;
	public boolean isConfirm() {
		return isConfirm;
	}

	public void setConfirm(boolean isConfirm) {
		this.isConfirm = isConfirm;
	}

	public Anchor(String id, double x, double y, boolean fault,
			boolean deprecated, float power, boolean isNormal, boolean isConfirm) {
		super(id, x, y, fault, deprecated, power, SenserType.ANCHOR);
		this.isNormal = isNormal;
		this.isConfirm = isConfirm;
	}

	public Anchor(String id, double[] coordinate, boolean fault,
			boolean deprecated, float power, boolean isNormal, boolean isConfirm) {
		super(id, coordinate, fault, deprecated, power, SenserType.ANCHOR);
		this.isNormal = isNormal;
		this.isConfirm = isConfirm;
	}

	public Anchor(String id, double[] coordinate) {
		super(id, coordinate, false, false, 1, SenserType.ANCHOR);
		this.isNormal = true;
		this.isConfirm = true;
	}

}
