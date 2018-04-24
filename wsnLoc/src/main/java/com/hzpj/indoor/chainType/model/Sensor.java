package com.hzpj.indoor.chainType.model;

/**WSN无线传感器
 * 
 */
public class Sensor {
	public String id;
	public double x;
	public double y;
	// 是否故障
	public boolean fault;
	// deprecated
	public boolean deprecated;

	// 电量 百分比,小数表示 如100%是1 
	public float power;
	//传感器功能类型
	public SenserType type=SenserType.NONE;

	public Sensor(String id,double x, double y, boolean fault, boolean deprecated,
			float power,SenserType type) {
		this.id=id;
		this.x = x;
		this.y = y;
		this.fault = fault;
		this.deprecated = deprecated;
		this.power = power;
		this.type=type;
	}

	public Sensor(String id,double[] coordinate, boolean fault, boolean deprecated,
			float power,SenserType type) {
		this.id=id;
		this.x = coordinate[0];
		this.y = coordinate[1];
		this.fault = fault;
		this.power = power;
		this.type=type;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public SenserType getType() {
		return type;
	}

	public void setType(SenserType type) {
		this.type = type;
	}

	public double getX() {
		return x;
	}

	public void setX(double x) {
		this.x = x;
	}

	public double getY() {
		return y;
	}

	public void setY(double y) {
		this.y = y;
	}

	public boolean isFault() {
		return fault;
	}

	public void setFault(boolean fault) {
		this.fault = fault;
	}

	public float getPower() {
		return power;
	}

	public void setPower(float power) {
		this.power = power;
	}

	public boolean isDeprecated() {
		return deprecated;
	}

	public void setDeprecated(boolean deprecated) {
		this.deprecated = deprecated;
	}

}
