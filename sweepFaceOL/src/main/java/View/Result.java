package View;

import java.io.Serializable;
import java.util.Map;

import com.alibaba.fastjson.JSON;


public class Result implements Serializable{

	private static final long serialVersionUID = -2918843029587695632L;

	public int code; // ����� �����Ϊ0��ʾ�޴����������д���
	
	public String message; // �����ϸ��Ϣ
	
	public Boolean success;//�Ƿ�ɹ�
	
	public Map<String, Object> map; // ���������Ϣ��װ
	
	public Object obj; // ���������Ϣ��װ
	
	public Object getObj() {
		return obj;
	}
	public void setObj(Object obj) {
		this.obj = obj;
	}
	/**
	 * ���췽��
	 * @param code
	 * @param message
	 * @param map
	 */
	public Result(int code, String message, Map<String, Object> map){
		this.code = code;
		this.message = message;
		this.map = map;
	}
	/**
	 * ����success �Ĺ��췽��
	 * @param code
	 * @param message
	 * @param map
	 * @param success
	 */
	public Result(int code, String message, Map<String, Object> map,Boolean success) {
		super();
		this.code = code;
		this.message = message;
		this.success = success;
		this.map = map;
	}

	public int getCode() {
		return code;
	}

	public void setCode(int code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Map<String, Object> getMap() {
		return map;
	}

	public void setMap(Map<String, Object> map) {
		this.map = map;
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}
	
	public String toJSON(){
		return JSON.toJSONString(this);
		
	}
	
}

