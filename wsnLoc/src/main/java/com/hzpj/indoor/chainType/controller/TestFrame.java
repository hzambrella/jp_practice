package com.hzpj.indoor.chainType.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller  
@RequestMapping("/test") 
public class TestFrame  {
	@RequestMapping(value="/testJSP",method = RequestMethod.GET)
	public String test(ModelMap model) {
		model.addAttribute("message", "窄化请求映射");

		return "/template/test";
	}
}
