//每次显示dirTree都调用下面的函数，它的作用是隐藏下级菜单目录和监听展开按钮。否则不会隐藏。
function jqueryTreeScroll(treeWidth){
	treeWidth==null?treeWidth=80:treeWidth=treeWidth;
	$(".close_menu").each(function(){
		$(this).siblings("ul").hide();
	});
	$(".ontree").each(function(){
		$(this).parents("ul").show();
		$(this).parents("ul").siblings().addClass("open_menu").removeClass("close_menu");
	});
	$(document).on("click",".close_menu span",function(){
		$(this).parent().addClass("open_menu").removeClass("close_menu");
		$(this).parent().siblings("ul").fadeIn();
		treewidth();
	});
	$(document).on("click",".open_menu span",function(){
		$(this).parent().parent().find(".open_menu").addClass("close_menu").removeClass("open_menu");
		$(this).parent().parent().find("ul").hide();
		treewidth();
	});
	$(document).on("click",".tree a",function(){
		$(".ontree").removeClass("ontree");
		$(this).addClass("ontree");
	});
	treewidth();
	function treewidth(){
		var items=new Array;
		var parents=new Array;
		var text_num=0,parent_num=0;
		$(".tree a").each(function(){
			if($(this).is(":hidden")==false){
				items.push($(this).text().length);
				parents.push($(this).parents("ul").length);
			}
		});
		//document.title="最多字数："+Math.max.apply(null, items)+",最大层数："+Math.max.apply(null, parents);
		text_num=Math.max.apply(null, items);
		parent_num=Math.max.apply(null, parents);
		$(".tree").width(parent_num*20+text_num*14+treeWidth); //.tree的宽度
		scrollsXY(".scrollXY");	
	}
}

function scrollsXY(box){		//XY轴滚动最终版
	var pointX=0,left=0;
	$(box).each(function(){
		var box=$(this);
		var W=box.width()-18;
		var cententW=box.children().width();
		var btnW=W/cententW*W;
		var scrollX='<div class="scrollX_box" boxW="'+W+'" cententW="'+cententW+'" move="false">';
			scrollX+='<div class="scrollX_btn" lefts="0">';
			scrollX+='<div style="background-color:#696979;position:absolute;width:100%;top:6px;height:6px;border-radius:4px"></div>';
			scrollX+='</div></div>';
		box.parent().css({"position":"relative"});
		box.siblings(".scrollX_box").remove();
		box.before(scrollX);
		if(W/cententW<1){
			box.siblings(".scrollX_box").children(".scrollX_btn").show();
		}else{
			box.siblings(".scrollX_box").children(".scrollX_btn").hide();
		}
		box.siblings(".scrollX_box").css({
			"width":W,
			"position":"absolute",
			"bottom":0,
			"left":0,
			"z-index":0,
			"background-color":"#fff",
			"height":"18px",
			"border-right":"solid 18px #fff"
		});
		box.siblings(".scrollX_box").children(".scrollX_btn").css({
			"width":btnW,
			"position":"relative",
			"cursor":"pointer",
			"height":"18px"
		});
		$(".scrollX_btn").hover(function(){
			$(this).children().css({
				"background-color":"#9797ac",
			});
		},function(){
			$(this).children().css({
				"background-color":"#696979",
			});
			move=$(this).parent().attr("move","false");
		});
		box.scroll(function(){
			var X=$(this).scrollLeft();
			var boxW=$(this).siblings(".scrollX_box").attr("boxW")
			var cententW=$(this).siblings(".scrollX_box").attr("cententW");
			$(this).siblings(".scrollX_box").children(".scrollX_btn").css({
				"margin-left":X/cententW*boxW
			});
			$(this).siblings(".scrollX_box").children(".scrollX_btn").attr("lefts",X/cententW*boxW);
		});
		$(".scrollX_btn").mousedown(function(e){
			pointX = e.pageX;	//这里可以得到鼠标Y坐标
			left=$(this).attr("lefts")*1;
			$(this).parent().attr("move","true");
			$(this).focus();
		});
		$(".scrollX_btn").mousemove(function(e){
			e.stopPropagation();
			if($(this).parent().attr("move")=="true"){
				var moveX =e.pageX-pointX;
				var boxW=$(this).parent().attr("boxW")
				var cententW=$(this).parent().attr("cententW");
				var btnW=boxW/cententW*boxW;
				//$(this).siblings().unbind();
				$(this).css({
					"margin-left":left+moveX
				});
				$(this).attr("lefts",left+moveX);
				$(this).parent().siblings().scrollLeft((left+moveX)/boxW*cententW);
				if(left+moveX>boxW-btnW){
					$(this).css({
						"margin-left":boxW-btnW
					});
					$(this).attr("lefts",boxW-btnW);
				}else if(left+moveX<0){
					$(this).css({
						"margin-left":0
					});
					$(this).attr("lefts",0);
				}
			}
		});
		$(".scrollX_btn").mouseup(function(e){
			$(this).parent().attr("move","false");
			$(this).focus();
		});
	});
	var pointY=0,top=0;
	$(box).each(function(){
		var box=$(this);
		var H=box.height()-18;
		var cententH=box.children().height();
		var btnH=H/cententH*H;
		var go_top=box.scrollTop()/cententH*H;
		var scrollY='<div class="scroll_box" boxH="'+H+'" cententH="'+cententH+'" move="false">';
			scrollY+='<div class="scroll_btn" tops="'+go_top+'">';
			scrollY+='<div style="background-color:#696979;position:absolute;width:6px;left:6px;height:100%;border-radius:4px"></div>';
			scrollY+='</div></div>';
		box.parent().css({"position":"relative"});
		box.siblings(".scroll_box").remove();
		box.before(scrollY);
		if(H/cententH<1){
			box.siblings(".scroll_box").children(".scroll_btn").show();
		}else{
			box.siblings(".scroll_box").children(".scroll_btn").hide();
		}
		box.siblings(".scroll_box").css({
			"width":"18px",
			"position":"absolute",
			"top":0,
			"right":0,
			"z-index":0,
			"background-color":"#fff",
			"height":H,
			"border-bottom":"solid 18px #fff"
		});
		box.siblings(".scroll_box").children(".scroll_btn").css({
			"width":"100%",
			"position":"relative",
			"cursor":"pointer",
			"height":btnH,
			"margin-top":go_top
		});
		$(".scroll_btn").hover(function(){
			$(this).children().css({
				"background-color":"#9797ac",
			});
		},function(){
			$(this).children().css({
				"background-color":"#696979",
			});
			move=$(this).parent().attr("move","false");
			addscroll(box);
		});
		addscroll(box);
		$(".scroll_btn").mousedown(function(e){
			pointY = e.pageY;	//这里可以得到鼠标Y坐标
			top=$(this).attr("tops")*1;
			$(this).parent().attr("move","true");
			$(this).focus();
		});
		$(".scroll_btn").mousemove(function(e){
			e.stopPropagation();
			if($(this).parent().attr("move")=="true"){
				var moveY =e.pageY-pointY;
				var boxH=$(this).parent().attr("boxH")
				var cententH=$(this).parent().attr("cententH");
				var btnH=boxH/cententH*boxH;
				$(this).siblings().unbind();
				$(this).css({
					"margin-top":top+moveY
				});
				$(this).attr("tops",top+moveY);
				$(this).parent().siblings().scrollTop((top+moveY)/boxH*cententH);
				if(top+moveY>boxH-btnH){
					$(this).css({
						"margin-top":boxH-btnH
					});
					$(this).attr("tops",boxH-btnH);
				}else if(top+moveY<0){
					$(this).css({
						"margin-top":0
					});
					$(this).attr("tops",0);
				}
			}
		});
		$(".scroll_btn").mouseup(function(e){
			$(this).parent().attr("move","false")
			addscroll(box);
		});
	});
	
	function addscroll(box){
		box.scroll(function(){
			var Y=$(this).scrollTop();
			var boxH=$(this).siblings(".scroll_box").attr("boxH")
			var cententH=$(this).siblings(".scroll_box").attr("cententH");
			$(this).siblings(".scroll_box").children(".scroll_btn").css({
				"margin-top":Y/cententH*boxH
			});
			$(this).siblings(".scroll_box").children(".scroll_btn").attr("tops",Y/cententH*boxH);
		});
	}
}
