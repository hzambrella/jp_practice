package com.action;

import java.util.List;
import java.util.Map;

import org.apache.struts2.ServletActionContext;

import com.dao.TCatelogDAO;
import com.dao.TWenjianDAO;
import com.model.TCatelog;
import com.model.TUser;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

public class catelogAction extends ActionSupport
{
	private int catelogId;
	private String catelogName;
	private int userId;
	
	private TCatelogDAO catelogDAO;
	private TWenjianDAO wenjianDAO;
	
	
	public String catelogAdd()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		TCatelog catelog=new TCatelog();
		catelog.setCatelogName(catelogName);
		catelog.setUserId(user.getUserId());
		catelogDAO.save(catelog);
		
		request.put("msg", "文件夹创建成功");
		return "msg";
	}
	
	
	public String catelogMine()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		String sql="from TCatelog where userId="+user.getUserId();
		List cateLogList=catelogDAO.getHibernateTemplate().find(sql);
		
		request.put("cateLogList", cateLogList);
		
		//修改
		int usedSize=wenjianDAO.getUsedSize(user.getUserId());
		String usedSizeStr="0";
		System.out.println("usedSize:"+usedSize);
		if (usedSize>1024){
			usedSizeStr=new Integer(usedSize/1024).toString()+"KB";
		}else{
			usedSizeStr=new Integer(usedSize).toString()+"B";
		}
		
		request.put("usedSize",usedSizeStr);
		return ActionSupport.SUCCESS;
	}
	
	
	public String catelogDel()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		Map session=ActionContext.getContext().getSession();
		TUser user=(TUser)session.get("user");
		
		TCatelog catelog=catelogDAO.findById(catelogId);
		catelogDAO.delete(catelog);
		
		String sql="delete from TWenjian where catelogId="+catelogId;
		wenjianDAO.getHibernateTemplate().bulkUpdate(sql);
		
		
		request.put("msg", "文件夹删除成功");
		return "msg";
	}
	
	
	public String catelogPre()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		TCatelog catelog=catelogDAO.findById(catelogId);
		
		request.put("catelog", catelog);
		return ActionSupport.SUCCESS;
	}
	
	public String catelogEdit()
	{
		Map request=(Map)ServletActionContext.getContext().get("request");
		TCatelog catelog=catelogDAO.findById(catelogId);
		
		catelog.setCatelogName(catelogName);
		catelogDAO.attachDirty(catelog);
		
		request.put("msg", "重命名成功");
		return "msg";
	}
	
	
	public TCatelogDAO getCatelogDAO()
	{
		return catelogDAO;
	}

	public void setCatelogDAO(TCatelogDAO catelogDAO)
	{
		this.catelogDAO = catelogDAO;
	}

	public int getCatelogId()
	{
		return catelogId;
	}

	public void setCatelogId(int catelogId)
	{
		this.catelogId = catelogId;
	}


	public String getCatelogName()
	{
		return catelogName;
	}

	public void setCatelogName(String catelogName)
	{
		this.catelogName = catelogName;
	}


	public int getUserId()
	{
		return userId;
	}


	public TWenjianDAO getWenjianDAO()
	{
		return wenjianDAO;
	}


	public void setWenjianDAO(TWenjianDAO wenjianDAO)
	{
		this.wenjianDAO = wenjianDAO;
	}


	public void setUserId(int userId)
	{
		this.userId = userId;
	}

	
}
