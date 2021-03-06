package insperctionOL;

import org.junit.After;
import org.junit.Test;

import TSP.DP2;

import com.alibaba.fastjson.JSON;

public class TestDP2 {

	@After
	public void tearDown() throws Exception {
	}

	@Test
	public void test() {
//		String firstStr = "[[0,8566,9541,16808,28892,26086,15161,21438,34102,23661],[8599,0,9321,16935,25888,30368,17596,25038,31988,34461],[9782,8117,0,12821,22815,25118,12346,19788,26738,28207],[17379,15803,13803,0,11537,24764,12250,20230,26855,37138],[26930,26466,23354,13847,0,21213,17973,25231,25093,46356],[26070,30544,25087,25871,19305,0,13726,15837,12520,33783],[15972,17416,12195,13230,17031,14689,0,9279,15904,28118],[22082,29457,20325,21243,24381,16116,9545,0,8344,19337],[26913,35483,26805,27592,22497,11592,15894,9110,0,24922],[22557,35141,25580,34383,45378,33873,23083,19605,24844,0]]";
//		String firstStr="[[0,16808,28892,8347,26086,15161,23661],[17379,0,11537,21238,24764,12250,37138],[26930,13847,0,31901,21213,17973,46356],[8379,22403,31356,0,39733,21145,33878],[26070,25871,19305,33241,0,13726,33783],[15972,13230,17031,20872,14689,0,28118],[22557,34383,45378,33438,33873,23083,0]]";
		String firstStr="[[0,1000,2000],[1000,0,1300],[2000,1400,0]]";
		double[][] first=JSON.parseObject(firstStr,double[][].class);
	/*	DP ff = new DP(first);
		System.out.println(JSON.toJSONString(first));
		System.out.println(JSON
				.toJSONString(ff.getFirnalCityFlow().split("->")));
		*/
		DP2 ff2=new DP2(first);
		System.out.println(JSON
				.toJSONString(ff2.getFirnalCityFlow().split("->")));
		System.out.println(ff2.getMinDistance());
	}

}
