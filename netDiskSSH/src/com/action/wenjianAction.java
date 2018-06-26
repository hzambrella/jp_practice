package com.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.dao.TCatelogDAO;
import com.dao.TUserDAO;
import com.dao.TWenjianDAO;
import com.model.TCatelog;
import com.model.TUser;
import com.model.TWenjian;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class wenjianAction extends ActionSupport
{
	private Integer id;
	private String mingcheng;
	private String fujian;
	private String fujianYuanshiming;
	
	private String beizhu;
	private String shangchuanshi;
	private String shuxing;
	private Integer catelogId;
	//修改文件大小
	private Integer fileSize;
	public Integer getFileSize() {
		return fileSize;
	}

	public void setFileSize(Integer fileSize) {
		this.fileSize = fileSize;
	}

	
	private Integer userId;
	
	private TWenjianDAO wenjianDAO;
	private TUserDAO userDAO;
	
	
	public String wenjianAdd()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		TWenjian wenjian=new TWenjian();
		
		wenjian.setMingcheng(mingcheng);
		wenjian.setFujian(fujian);
		wenjian.setFujianYuanshiming(fujianYuanshiming);
		wenjian.setBeizhu(beizhu);
		
		wenjian.setShangchuanshi(shangchuanshi);
		wenjian.setShuxing(shuxing);
		wenjian.setCatelogId(catelogId);
		wenjian.setUserId(user.getUserId());
		wenjian.setFileSize(fileSize);
		System.out.println("文件大小2---"+fileSize);
		wenjianDAO.save(wenjian);
		
		request.put("msg", "文件添加成功");
		return "msg";
	}
	

	public String wenjianMine()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		String sql="from TWenjian where catelogId="+catelogId;
		List wenjianList=wenjianDAO.getHibernateTemplate().find(sql);	
		request.put("wenjianList", wenjianList);
		request.put("catelogId", catelogId);
		return ActionSupport.SUCCESS;
	}
	
	
	public String wenjianDel()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		TWenjian wenjian=wenjianDAO.findById(id);
		wenjianDAO.delete(wenjian);
		
		request.put("msg", "文件删除成功");
		return "msg";
	}
	
	
	public String wenjianMana()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		String sql="from TWenjian";
		List wenjianList=wenjianDAO.getHibernateTemplate().find(sql);
		for(int i=0;i<wenjianList.size();i++)
		{
			TWenjian wenjian=(TWenjian)wenjianList.get(i);
			wenjian.setUser(userDAO.findById(wenjian.getUserId()));
		}
		
		request.put("wenjianList", wenjianList);
		return ActionSupport.SUCCESS;
	}
	
	
	public String wenjianAll()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		String sql="from TWenjian where shuxing='共享'";
		List wenjianList=wenjianDAO.getHibernateTemplate().find(sql);
		for(int i=0;i<wenjianList.size();i++)
		{
			TWenjian wenjian=(TWenjian)wenjianList.get(i);
			wenjian.setUser(userDAO.findById(wenjian.getUserId()));
		}
		
		request.put("wenjianList", wenjianList);
		return ActionSupport.SUCCESS;
	}
	
	
	
	public String wenjianRes()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		String sql="from TWenjian where shuxing='共享' and mingcheng like '%"+mingcheng.trim()+"%'";
		List wenjianList=wenjianDAO.getHibernateTemplate().find(sql);
		for(int i=0;i<wenjianList.size();i++)
		{
			TWenjian wenjian=(TWenjian)wenjianList.get(i);
			wenjian.setUser(userDAO.findById(wenjian.getUserId()));
		}
		
		request.put("wenjianList", wenjianList);
		return ActionSupport.SUCCESS;
	}
	


	public Integer getId()
	{
		return id;
	}


	public void setId(Integer id)
	{
		this.id = id;
	}


	public TUserDAO getUserDAO()
	{
		return userDAO;
	}


	public void setUserDAO(TUserDAO userDAO)
	{
		this.userDAO = userDAO;
	}


	public String getMingcheng()
	{
		return mingcheng;
	}


	public void setMingcheng(String mingcheng)
	{
		this.mingcheng = mingcheng;
	}


	public String getFujian()
	{
		return fujian;
	}


	public void setFujian(String fujian)
	{
		this.fujian = fujian;
	}


	public String getFujianYuanshiming()
	{
		return fujianYuanshiming;
	}


	public void setFujianYuanshiming(String fujianYuanshiming)
	{
		this.fujianYuanshiming = fujianYuanshiming;
	}


	public String getBeizhu()
	{
		return beizhu;
	}


	public void setBeizhu(String beizhu)
	{
		this.beizhu = beizhu;
	}


	public String getShangchuanshi()
	{
		return shangchuanshi;
	}


	public void setShangchuanshi(String shangchuanshi)
	{
		this.shangchuanshi = shangchuanshi;
	}


	public String getShuxing()
	{
		return shuxing;
	}


	public void setShuxing(String shuxing)
	{
		this.shuxing = shuxing;
	}


	public Integer getCatelogId()
	{
		return catelogId;
	}


	public void setCatelogId(Integer catelogId)
	{
		this.catelogId = catelogId;
	}


	public Integer getUserId()
	{
		return userId;
	}


	public void setUserId(Integer userId)
	{
		this.userId = userId;
	}


	public TWenjianDAO getWenjianDAO()
	{
		return wenjianDAO;
	}


	public void setWenjianDAO(TWenjianDAO wenjianDAO)
	{
		this.wenjianDAO = wenjianDAO;
	}
	
}
