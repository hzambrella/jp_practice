package com.model;

/**
 * TWenjian entity.
 * 
 * @author MyEclipse Persistence Tools
 */

public class TWenjian implements java.io.Serializable
{

	// Fields

	private Integer id;
	private String mingcheng;
	private String fujian;
	private String fujianYuanshiming;
	
	private String beizhu;
	private String shangchuanshi;
	private String shuxing;
	private Integer catelogId;
	
	private Integer userId;
	
	private TUser user;
	
	//ÐÞ¸Ä
	private Integer fileSize;
	public Integer getFileSize() {
		return fileSize;
	}

	public void setFileSize(Integer fileSize) {
		this.fileSize = fileSize;
	}
	
	// Constructors
	/** default constructor */
	public TWenjian()
	{
	}

	/** full constructor */
	public TWenjian(String mingcheng, String fujian, String fujianYuanshiming,
			String beizhu, String shangchuanshi, String shuxing,
			Integer catelogId, Integer userId)
	{
		this.mingcheng = mingcheng;
		this.fujian = fujian;
		this.fujianYuanshiming = fujianYuanshiming;
		this.beizhu = beizhu;
		this.shangchuanshi = shangchuanshi;
		this.shuxing = shuxing;
		this.catelogId = catelogId;
		this.userId = userId;
	}

	// Property accessors

	public Integer getId()
	{
		return this.id;
	}

	public void setId(Integer id)
	{
		this.id = id;
	}

	public String getMingcheng()
	{
		return this.mingcheng;
	}

	public void setMingcheng(String mingcheng)
	{
		this.mingcheng = mingcheng;
	}

	public String getFujian()
	{
		return this.fujian;
	}

	public void setFujian(String fujian)
	{
		this.fujian = fujian;
	}

	public String getFujianYuanshiming()
	{
		return this.fujianYuanshiming;
	}

	public void setFujianYuanshiming(String fujianYuanshiming)
	{
		this.fujianYuanshiming = fujianYuanshiming;
	}

	public TUser getUser()
	{
		return user;
	}

	public void setUser(TUser user)
	{
		this.user = user;
	}

	public String getBeizhu()
	{
		return this.beizhu;
	}

	public void setBeizhu(String beizhu)
	{
		this.beizhu = beizhu;
	}

	public String getShangchuanshi()
	{
		return this.shangchuanshi;
	}

	public void setShangchuanshi(String shangchuanshi)
	{
		this.shangchuanshi = shangchuanshi;
	}

	public String getShuxing()
	{
		return this.shuxing;
	}

	public void setShuxing(String shuxing)
	{
		this.shuxing = shuxing;
	}

	public Integer getCatelogId()
	{
		return this.catelogId;
	}

	public void setCatelogId(Integer catelogId)
	{
		this.catelogId = catelogId;
	}

	public Integer getUserId()
	{
		return this.userId;
	}

	public void setUserId(Integer userId)
	{
		this.userId = userId;
	}

}