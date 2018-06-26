package com.dao;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.springframework.context.ApplicationContext;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;

import com.model.TWenjian;

/**
 * A data access object (DAO) providing persistence and search support for
 * TWenjian entities. Transaction control of the save(), update() and delete()
 * operations can directly support Spring container-managed transactions or they
 * can be augmented to handle user-managed Spring transactions. Each of these
 * methods provides additional information for how to configure it for the
 * desired type of transaction control.
 * 
 * @see com.model.TWenjian
 * @author MyEclipse Persistence Tools
 */

public class TWenjianDAO extends HibernateDaoSupport
{
	private static final Log log = LogFactory.getLog(TWenjianDAO.class);
	// property constants
	public static final String MINGCHENG = "mingcheng";
	public static final String FUJIAN = "fujian";
	public static final String FUJIAN_YUANSHIMING = "fujianYuanshiming";
	public static final String BEIZHU = "beizhu";
	public static final String SHANGCHUANSHI = "shangchuanshi";
	public static final String SHUXING = "shuxing";
	public static final String CATELOG_ID = "catelogId";
	public static final String USER_ID = "userId";

	protected void initDao()
	{
		// do nothing
	}
	
	//ÐÞ¸Ä
	public int getUsedSize(int userId){
		  BigDecimal sum=new BigDecimal(0);
		  String hql = "select sum(fileSize) from t_wenjian as usedSize where userId="+userId;
		  Session session = getHibernateTemplate().getSessionFactory().openSession();
		  SQLQuery queryRes=session.createSQLQuery(hql);
		  List l=queryRes.list();
		  if (l!=null&&l.size()!=0&&l.get(0)!=null){
			  System.out.println(l.toString());
			  System.out.println("l0:"+l.get(0));
			  sum=(BigDecimal)l.get(0);
		  }
		  return sum.intValue();
	}

	public void save(TWenjian transientInstance)
	{
		log.debug("saving TWenjian instance");
		try
		{
			getHibernateTemplate().save(transientInstance);
			log.debug("save successful");
		} catch (RuntimeException re)
		{
			log.error("save failed", re);
			throw re;
		}
	}

	public void delete(TWenjian persistentInstance)
	{
		log.debug("deleting TWenjian instance");
		try
		{
			getHibernateTemplate().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re)
		{
			log.error("delete failed", re);
			throw re;
		}
	}

	public TWenjian findById(java.lang.Integer id)
	{
		log.debug("getting TWenjian instance with id: " + id);
		try
		{
			TWenjian instance = (TWenjian) getHibernateTemplate().get(
					"com.model.TWenjian", id);
			return instance;
		} catch (RuntimeException re)
		{
			log.error("get failed", re);
			throw re;
		}
	}

	public List findByExample(TWenjian instance)
	{
		log.debug("finding TWenjian instance by example");
		try
		{
			List results = getHibernateTemplate().findByExample(instance);
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re)
		{
			log.error("find by example failed", re);
			throw re;
		}
	}

	public List findByProperty(String propertyName, Object value)
	{
		log.debug("finding TWenjian instance with property: " + propertyName
				+ ", value: " + value);
		try
		{
			String queryString = "from TWenjian as model where model."
					+ propertyName + "= ?";
			return getHibernateTemplate().find(queryString, value);
		} catch (RuntimeException re)
		{
			log.error("find by property name failed", re);
			throw re;
		}
	}

	public List findByMingcheng(Object mingcheng)
	{
		return findByProperty(MINGCHENG, mingcheng);
	}

	public List findByFujian(Object fujian)
	{
		return findByProperty(FUJIAN, fujian);
	}

	public List findByFujianYuanshiming(Object fujianYuanshiming)
	{
		return findByProperty(FUJIAN_YUANSHIMING, fujianYuanshiming);
	}

	public List findByBeizhu(Object beizhu)
	{
		return findByProperty(BEIZHU, beizhu);
	}

	public List findByShangchuanshi(Object shangchuanshi)
	{
		return findByProperty(SHANGCHUANSHI, shangchuanshi);
	}

	public List findByShuxing(Object shuxing)
	{
		return findByProperty(SHUXING, shuxing);
	}

	public List findByCatelogId(Object catelogId)
	{
		return findByProperty(CATELOG_ID, catelogId);
	}

	public List findByUserId(Object userId)
	{
		return findByProperty(USER_ID, userId);
	}

	public List findAll()
	{
		log.debug("finding all TWenjian instances");
		try
		{
			String queryString = "from TWenjian";
			return getHibernateTemplate().find(queryString);
		} catch (RuntimeException re)
		{
			log.error("find all failed", re);
			throw re;
		}
	}

	public TWenjian merge(TWenjian detachedInstance)
	{
		log.debug("merging TWenjian instance");
		try
		{
			TWenjian result = (TWenjian) getHibernateTemplate().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re)
		{
			log.error("merge failed", re);
			throw re;
		}
	}

	public void attachDirty(TWenjian instance)
	{
		log.debug("attaching dirty TWenjian instance");
		try
		{
			getHibernateTemplate().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re)
		{
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(TWenjian instance)
	{
		log.debug("attaching clean TWenjian instance");
		try
		{
			getHibernateTemplate().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re)
		{
			log.error("attach failed", re);
			throw re;
		}
	}

	public static TWenjianDAO getFromApplicationContext(ApplicationContext ctx)
	{
		return (TWenjianDAO) ctx.getBean("TWenjianDAO");
	}
}