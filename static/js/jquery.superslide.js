﻿/*!
 * SuperSlide v2.0 
 * 轻松解决网站大部分特效展示问题
 * 详尽信息请看官网：http://www.SuperSlide2.com/
 *
 * Copyright 2011-2013, 大话主席
 *
 * 请尊重原创，保留头部版权
 * 在保留版权的前提下可应用于个人或商业用途
 */

(function($){
	var defaults={
		effect:"fade", 
		autoPlay:true, 
		delayTime:500, 
		interTime:5000,
		triggerTime:150,
		defaultIndex:0,
		titCell:".hd li",
		mainCell:".bd",
		targetCell:null,
		trigger:"mouseover",
		scroll:1,
		vis:1,
		titOnClassName:"on",
		autoPage:false,
		prevCell:".prev",
		nextCell:".next",
		pageStateCell:".pageState",
		opp: false, 
		pnLoop:true, 
		easing:"linear",
		startFun:null,
		endFun:null,
		switchLoad:null,
		imgfull:false
		};
	$.fn.slideNew=function(options){
		if (this.length == 0)
            return this;

        // support mutltiple elements
        if (this.length > 1) {
            this.each(function () {
                $(this).slideNew(options)
            });
            return this;
        }
		var el = this;
		
		return this.each(function() {	
			var opts = $.extend({},defaults,options);
			var effect = opts.effect;
			var prevBtn = $(opts.prevCell, $(this));
			var nextBtn = $(opts.nextCell, $(this));
			var pageState = $(opts.pageStateCell, $(this));
			var navObj = $(opts.titCell, $(this));//导航子元素结合
			var navObjSize = navObj.size();
			var conBox = $(opts.mainCell , $(this));//内容元素父层对象
			var conBoxSize=conBox.children().size();
			var sLoad=opts.switchLoad;
			if(opts.targetCell!=null){ var tarObj = $(opts.targetCell, $(this)) };

			/*字符串转换为数字*/
			var index=parseInt(opts.defaultIndex);
			var delayTime=parseInt(opts.delayTime);
			var interTime=parseInt(opts.interTime);
			var triggerTime=parseInt(opts.triggerTime);
			var scroll=parseInt(opts.scroll);
			var vis=parseInt(opts.vis);
			var autoPlay = (opts.autoPlay=="false"||opts.autoPlay==false)?false:true;
			var opp = (opts.opp=="false"||opts.opp==false)?false:true;
			var autoPage = (opts.autoPage=="false"||opts.autoPage==false)?false:true;
			var loop = (opts.pnLoop=="false"||opts.pnLoop==false)?false:true;
			var imgfull = (opts.imgfull=="false"||opts.imgfull==false)?false:true;

			var slideH=0;
			var slideW=0;
			var selfW=0;
			var selfH=2000;
			var easing=opts.easing;
			var inter=null;//setInterval名称 
			var oldIndex = index;
			var working=false;
			var isScrolling;
			
			//处理分页
			if( navObjSize==0 )navObjSize=conBoxSize;
			if( autoPage ){
				var tempS = conBoxSize-vis;
				navObjSize=1+parseInt(tempS%scroll!=0?(tempS/scroll+1):(tempS/scroll)); 
				if(navObjSize<=0)navObjSize=1;
				navObj.html(""); 
				for( var i=0; i<navObjSize; i++ ){ navObj.append("<li>"+(i+1)+"</li>") }
				var navObj = $("li", navObj);//重置导航子元素对象
			}
            if(imgfull){
				switch(effect)
				{
				    case "top":
					case "topLoop":
					case "topMarquee":
					case "bottomLoop":
					case "bottomMarquee":conBox.children().find('img').css({'width':'100%'}); break;
				}
			}
			conBox.children().each(function(){ //取最大值
				if( $(this).width()>selfW ){ selfW=$(this).outerWidth(); slideW=$(this).outerWidth(true);if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0"){selfW=$(this).width();};  }
				if( $(this).height()<selfH ){ selfH=$(this).height(); slideH=$(this).outerHeight(true);  }
			});
            if(imgfull){
				oneImgW=conBox.find('img').eq(0).width();
				oneImgH=conBox.find('img').eq(0).height();
				imgHN=(oneImgH * selfW)/oneImgW;
				switch(effect)
				{
					case "fold":
					case "left":
					case "leftLoop":
					case "leftMarquee":
					case "rightLoop":
					case "rightMarquee":conBox.children().find('img').css({'width':'100%','height':imgHN}); break;
				}
			}
			if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
				switch(effect)
				{
					case "fold": conBox.css({"position":"relative","width":slideW,"height":slideH}).children().css( {"position":"absolute","width":selfW,"left":0,"top":0,"display":"none"} ); break;
					case "top": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>').css( { "position":"relative","padding":"0","margin":"0"}).children().css( {"height":selfH} ); break;
					case "left": conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').css( { "width":conBoxSize*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0"}).children().css( {"float":"left","width":selfW} ); break;
					case "leftLoop":
					case "leftMarquee":
						conBox.children().clone().appendTo(conBox).clone().prependTo(conBox); 
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').css( { "width":conBoxSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-conBoxSize*slideW}).children().css( {"float":"left","width":selfW}  ); break;
					case "rightLoop":
					case "rightMarquee":
						conBox.children().clone().appendTo(conBox).clone().prependTo(conBox); 
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; width:'+vis*slideW+'px"></div>').css( { "width":conBoxSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-conBoxSize*slideW}).children().css( {"float":"left","width":selfW}  ); break;
					case "topLoop":
					case "topMarquee":
						conBox.children().clone().appendTo(conBox).clone().prependTo(conBox); 
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>').css( { "height":conBoxSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-conBoxSize*slideH}).children().css( {"height":selfH} ); break;
					case "bottomLoop":
					case "bottomMarquee":
						conBox.children().clone().appendTo(conBox).clone().prependTo(conBox); 
						conBox.wrap('<div class="tempWrap" style="overflow:hidden; position:relative; height:'+vis*slideH+'px"></div>').css( { "height":conBoxSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-conBoxSize*slideH}).children().css( {"height":selfH} ); break;
				}
			}
			$(window).bind('resize', function(){
				resizeWindow();
			});
            var resizeWindow = function (e) {
				if(effect!=='fade'){
					conBox.removeAttr('style');
					conBox.children().removeAttr('style');
					conBox.parent().removeAttr('style');
				}
				slideH=0;
			    slideW=0;
			    selfW=0;
			    selfH=2000;
				conBox.children().each(function(){ //取最大值
					if( $(this).width()>selfW ){ selfW=$(this).outerWidth(); slideW=$(this).outerWidth(true);if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE7.0"){selfW=$(this).width();};  }
					if( $(this).height()<selfH ){ selfH=$(this).height(); slideH=$(this).outerHeight(true);  }
			    });
				if(imgfull){
					imgHN=(oneImgH * selfW)/oneImgW;
					switch(effect)
					{
						case "fold":
						case "left":
						case "leftLoop":
						case "leftMarquee":
						case "rightLoop":
						case "rightMarquee":conBox.children().find('img').css({'width':'100%','height':imgHN});break;
					}
				}
				if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
					switch(effect)
					{
						case "fold": conBox.css({"position":"relative","width":slideW,"height":slideH}).children().css( {"position":"absolute","width":selfW,"left":0,"top":0,"display":"none"} ); break;
						case "top": conBox.parent().css({'overflow':'hidden', 'position':'relative', 'height': vis*slideH});
						            conBox.css( { "position":"relative","padding":"0","margin":"0"}).children().css( {"height":selfH} ); break;
						case "left": conBox.parent().css({'overflow':'hidden', 'position':'relative', 'width': vis*slideW});
						             conBox.css( { "width":conBoxSize*slideW,"position":"relative","overflow":"hidden","padding":"0","margin":"0"}).children().css( {"float":"left","width":selfW} ); break;
						case "leftLoop":
						case "leftMarquee":
							conBox.parent().css({'overflow':'hidden', 'position':'relative', 'width': vis*slideW});
							conBox.css( { "width":conBoxSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-conBoxSize*slideW}).children().css( {"float":"left","width":selfW}  ); break;
						case "rightLoop":
						case "rightMarquee":
							conBox.parent().css({'overflow':'hidden', 'position':'relative', 'width': vis*slideW});
							conBox.css( { "width":conBoxSize*slideW*3,"position":"relative","overflow":"hidden","padding":"0","margin":"0","left":-conBoxSize*slideW}).children().css( {"float":"left","width":selfW}  ); break;
						case "topLoop":
						case "topMarquee":
							conBox.parent().css({'overflow':'hidden', 'position':'relative', 'height': vis*slideH});
							conBox.css( { "height":conBoxSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-conBoxSize*slideH}).children().css( {"height":selfH} ); break;
						case "bottomLoop":
						case "bottomMarquee":
							conBox.parent().css({'overflow':'hidden', 'position':'relative', 'height': vis*slideH});
							conBox.css( { "height":conBoxSize*slideH*3,"position":"relative","padding":"0","margin":"0","top":-conBoxSize*slideH}).children().css( {"height":selfH} ); break;
					}
				}
				doPlay();
			}
			
			var doStartFun=function(){ if ( $.isFunction( opts.startFun) ){ opts.startFun( index,navObjSize ); } };
			var doEndFun=function(){ if ( $.isFunction( opts.endFun ) ){ opts.endFun( index,navObjSize ); } };
			var doSwitchLoad=function(objs){ 
						objs.eq(index).find("img").each(function(){ 
						if ( typeof($(this).attr(sLoad))!="undefined"){ $(this).attr("src",$(this).attr(sLoad)).removeAttr(sLoad) }
					})
				}

			//效果函数
			var doPlay=function(isFirst){
				if( oldIndex==index && !isFirst && effect!="leftMarquee" && effect!="topMarquee" && effect!="rightMarquee" && effect!="bottomMarquee"  ) return; // 当前页状态不触发效果
				switch(effect)
				{
					case "fade": case "fold": case "top": case "left": if ( index >= navObjSize) { index = 0; } else if( index < 0) { index = navObjSize-1; } break;
					case "leftMarquee":case "topMarquee": if ( index>= 1) { index=1; } else if( index<=0) { index = 0; } break;
					case "rightMarquee":case "bottomMarquee": if ( index>= 1) { index=1; } else if( index<=0) { index = 0; } break;
					case "leftLoop": case "topLoop":
						var tempNum = index - oldIndex; 
						if( navObjSize>2 && tempNum==-(navObjSize-1) ) tempNum=1;
						if( navObjSize>2 && tempNum==(navObjSize-1) ) tempNum=-1;
						var scrollNum = Math.abs( tempNum*scroll );
						if ( index >= navObjSize) { index = 0; } else if( index < 0) { index = navObjSize-1; }
					case "rightLoop": case "bottomLoop":
						var tempNum = index - oldIndex; 
						if( navObjSize>2 && tempNum==-(navObjSize-1) ) tempNum=1;
						if( navObjSize>2 && tempNum==(navObjSize-1) ) tempNum=-1;
						var scrollNum = Math.abs( tempNum*scroll );
						if ( index >= navObjSize) { index = 0; } else if( index < 0) { index = navObjSize-1; }
					break;
				}

				doStartFun();

				//处理切换加载
				if( sLoad!=null ){ doSwitchLoad( conBox.children() ) }

				//处理targetCell
				if(tarObj){ 
					if( sLoad!=null ){ doSwitchLoad( tarObj ) }
					tarObj.hide().eq(index).animate({opacity:"show"},delayTime,function(){ if(!conBox[0])doEndFun() }); 
				}
				
				if(conBoxSize>=vis){ //当内容个数少于可视个数，不执行效果。
					switch (effect)
					{
						case "fade":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().hide(); break;
						case "fold":conBox.children().stop(true,true).eq(index).animate({opacity:"show"},delayTime,easing,function(){doEndFun()}).siblings().animate({opacity:"hide"},delayTime,easing);break;
						case "top":conBox.stop(true,false).animate({"top":-index*scroll*slideH},delayTime,easing,function(){doEndFun()});break;
						case "left":conBox.stop(true,false).animate({"left":-index*scroll*slideW},delayTime,easing,function(){doEndFun()});break;
						case "leftLoop":
							if(tempNum<0 ){
									conBox.stop(true,true).animate({"left":-(conBoxSize-scrollNum )*slideW},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().last().prependTo(conBox); }
									conBox.css("left",-conBoxSize*slideW);
									doEndFun();
								});	
							}
							else{
								conBox.stop(true,true).animate({"left":-( conBoxSize + scrollNum)*slideW},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().eq(0).appendTo(conBox); }
									conBox.css("left",-conBoxSize*slideW);
									doEndFun();
								});
							}break;// leftLoop end
                        case "rightLoop":
							if(tempNum<0 ){
									conBox.stop(true,true).animate({"left":-(conBoxSize+scrollNum )*slideW},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().eq(0).appendTo(conBox); }
									conBox.css("left",-conBoxSize*slideW);
									doEndFun();
								});
							}
							else{
								conBox.stop(true,true).animate({"left":-( conBoxSize - scrollNum)*slideW},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().last().prependTo(conBox); }
									conBox.css("left",-conBoxSize*slideW);
									doEndFun();
								});
							}break;// rightLoop end
						case "topLoop":
							if(tempNum<0 ){
									conBox.stop(true,true).animate({"top":-(conBoxSize-scrollNum )*slideH},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().last().prependTo(conBox); }
									conBox.css("top",-conBoxSize*slideH);
									doEndFun();
								});
							}
							else{
								conBox.stop(true,true).animate({"top":-( conBoxSize + scrollNum)*slideH},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().first().appendTo(conBox); }
									conBox.css("top",-conBoxSize*slideH);
									doEndFun();
								});
							}break;//topLoop end
						case "bottomLoop":
							if(tempNum<0 ){
									conBox.stop(true,true).animate({"top":-(conBoxSize+scrollNum )*slideH},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().first().appendTo(conBox); }
									conBox.css("top",-conBoxSize*slideH);
									doEndFun();
								});
							}
							else{
								conBox.stop(true,true).animate({"top":-( conBoxSize - scrollNum)*slideH},delayTime,easing,function(){
									for(var i=0;i<scrollNum;i++){ conBox.children().last().prependTo(conBox); }
									conBox.css("top",-conBoxSize*slideH);
									doEndFun();
								});
							}break;//bottomLoop end	

						case "leftMarquee":
							var tempLeft = conBox.css("left").replace("px",""); 

							if(index==0 ){
									conBox.animate({"left":++tempLeft},0,function(){
										
										if( conBox.css("left").replace("px","")>= 0){ for(var i=0;i<conBoxSize;i++){ conBox.children().last().prependTo(conBox); }conBox.css("left",-conBoxSize*slideW);}
									});
							}
							else{
									conBox.animate({"left":--tempLeft},0,function(){
										if(  conBox.css("left").replace("px","")<= -conBoxSize*slideW*2){ for(var i=0;i<conBoxSize;i++){ conBox.children().first().appendTo(conBox); }conBox.css("left",-conBoxSize*slideW);}
									});
							}break;// leftMarquee end
						case "rightMarquee":
							var tempLeft = conBox.css("left").replace("px",""); 
                                if(index==0 ){
									conBox.animate({"left":--tempLeft},0,function(){
										if(  conBox.css("left").replace("px","")<= -conBoxSize*slideW*2){for(var i=0;i<conBoxSize;i++){conBox.children().first().appendTo(conBox); }conBox.css("left",-conBoxSize*slideW); }
									});
							}
							else{
									conBox.animate({"left":++tempLeft},0,function(){
										if( conBox.css("left").replace("px","")>= 0){ for(var i=0;i<conBoxSize;i++){  conBox.children().last().prependTo(conBox); }conBox.css("left",-conBoxSize*slideW);}
									});
							}break;// rightMarquee end

						case "topMarquee":
							var tempTop = conBox.css("top").replace("px",""); 
								if(index==0 ){
										conBox.animate({"top":++tempTop},0,function(){
											if( conBox.css("top").replace("px","") >= 0){ for(var i=0;i<conBoxSize;i++){ conBox.children().last().prependTo(conBox); }conBox.css("top",-conBoxSize*slideH);}
										});
								}
								else{
										conBox.animate({"top":--tempTop},0,function(){
											if( conBox.css("top").replace("px","")<= -conBoxSize*slideH*2){ for(var i=0;i<conBoxSize;i++){ conBox.children().first().appendTo(conBox); }conBox.css("top",-conBoxSize*slideH);}
										});
								}break;// topMarquee end
						case "bottomMarquee":
							var tempTop = conBox.css("top").replace("px",""); 
								if(index==0 ){
										conBox.animate({"top":--tempTop},0,function(){
											if( conBox.css("top").replace("px","")<= -conBoxSize*slideH*2){ for(var i=0;i<conBoxSize;i++){ conBox.children().last().prependTo(conBox); }conBox.css("top",-conBoxSize*slideH);}
										});
								}
								else{
										conBox.animate({"top":++tempTop},0,function(){
											if( conBox.css("top").replace("px","") >= 0){ for(var i=0;i<conBoxSize;i++){ conBox.children().first().appendTo(conBox); }conBox.css("top",-conBoxSize*slideH);}
										});
								}break;// bottomMarquee end


					}//switch end	
				}
				navObj.removeClass(opts.titOnClassName).eq(index).addClass(opts.titOnClassName);
				oldIndex=index;
				if( loop==false ){ //loop控制是否继续循环
					nextBtn.removeClass("nextStop"); prevBtn.removeClass("prevStop");
					if (index==0 ){ prevBtn.addClass("prevStop"); }
					else if (index==navObjSize-1 ){ nextBtn.addClass("nextStop");  }
				}
			};
			var add_point=function(){
				var pages='';
					for(var i=0; i<navObjSize; i++){
						if(i===index){
							pages +='<span class="active" ></span>';
						}else{
						pages += '<span></span>';
						}
					}
					pageState.html(pages);
			}
			//初始化执行
			doPlay(true);
			//添加按钮
            add_point(true);
			var add_active=function(){
				var pagest=pageState.children('span');
				pagest.eq(index).siblings('span').removeClass('active');
				pagest.eq(index).addClass('active');
				
			}
			//自动播放
			if (autoPlay) {
					if( effect=="leftMarquee" || effect=="topMarquee" || effect=="rightMarquee" || effect=="bottomMarquee" ){
						if(opp){ index-- }else{ index++ } inter = setInterval(function(){doPlay(),add_active()}, interTime);
						conBox.hover(function(){if(autoPlay){clearInterval(inter); }},function(){if(autoPlay){clearInterval(inter);inter = setInterval(function(){doPlay(),add_active()}, interTime);}});
					}else{
						 inter=setInterval(function(){  if(opp){ index-- }else{ index++ } ; doPlay(),add_active() }, interTime); 
						$(this).hover(function(){if(autoPlay){clearInterval(inter); }},function(){if(autoPlay){clearInterval(inter); inter=setInterval(function(){if(opp){ index-- }else{ index++ }; doPlay(),add_active() }, interTime); }});
					}
			}

			//鼠标事件
			var mst;
			if(opts.trigger=="mouseover"){
				navObj.hover(function(){ index=navObj.index(this); mst = window.setTimeout(doPlay,opts.triggerTime); }, function(){ clearTimeout(mst); });
			   }else{ navObj.click(function(){index=navObj.index(this);  doPlay();add_active(); })  }
			 var goToNextSlide=function()  { if ( loop==true || index!=navObjSize-1 ){ index++; doPlay();add_active();} }
			 var goToPrevSlide=function()  { if ( loop==true || index!=0 ){ index--; doPlay();add_active(); }}
			 nextBtn.click(function(){ if ( loop==true || index!=navObjSize-1 ){ index++; doPlay();add_active(); }  });  
			 prevBtn.click(function(){ if ( loop==true || index!=0 ){ index--; doPlay();add_active(); } });  
			 var alist=pageState.children('span');
			 alist.each(function(){
				$(this).on("click",function(){
					var i=alist.index($(this));
					 if ( loop==true || index!=i ){ index=i; doPlay();add_active(); }  
				});
			 });
			 /**
			 * Initializes touch events
			 */
			 var istouch=false;
			 var xMovement,yMovement;
			 var isTouchDevice = function() {
				try {
					document.createEvent("TouchEvent");
					istouch=true;
					
				} catch (e) {
					istouch=false;
				}
			}
			var initTouch = function () {
				// initialize object to contain all touch values
				el.touch = {
					start: {x: 0, y: 0},
					end: {x: 0, y: 0}
				}
				el.bind('touchstart', onTouchStart);
			}
	        isTouchDevice();
			/**
			 * Event handler for "touchstart"
			 *
			 * @param e (event)
			 *  - DOM event object
			 */
			var onTouchStart = function (e) {
					// record the original position when touch starts
					el.touch.originalPos = el.position();
					isScrolling = 0;
					var orig = e.originalEvent;
					// record the starting touch x, y coordinates
					el.touch.start.x = orig.changedTouches[0].pageX;
					el.touch.start.y = orig.changedTouches[0].pageY;
					// bind a "touchmove" event to the viewport
					el.bind('touchmove', onTouchMove);
					// bind a "touchend" event to the viewport
					el.bind('touchend', onTouchEnd);
			}
	
			/**
			 * Event handler for "touchmove"
			 *
			 * @param e (event)
			 *  - DOM event object
			 */
			var onTouchMove = function (e) {
				if(event.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
				var orig = e.originalEvent;
				el.touch.end.x = orig.changedTouches[0].pageX;
				el.touch.end.y = orig.changedTouches[0].pageY;
				// if scrolling on y axis, do not prevent default
				xMovement = Math.abs(el.touch.end.x - el.touch.start.x);
				yMovement = Math.abs(el.touch.end.y  - el.touch.start.y);
				isScrolling = xMovement < yMovement ? 1:0;
				if(isScrolling === 0){
　　　             　e.preventDefault(); 
				}
			}
	
			/**
			 * Event handler for "touchend"
			 *
			 * @param e (event)
			 *  - DOM event object
			 */
			var onTouchEnd = function (e) {
				if(isScrolling === 0){
				    if(xMovement >20){
						switch(effect)
						{
							case "fade":
							case "fold":
							case "left":
							case "leftLoop":
							case "leftMarquee":el.touch.start.x > el.touch.end.x ? goToNextSlide() : goToPrevSlide();break;
							case "rightLoop":
							case "rightMarquee":el.touch.start.x > el.touch.end.x ? goToPrevSlide() : goToNextSlide();break;
						}
					}
				}
				el.unbind('touchmove', onTouchMove);
				el.unbind('touchend', onTouchEnd);
			}
            initTouch();
    	});//each End
        
	};//slide End

})(jQuery);

jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) { return jQuery.easing[jQuery.easing.def](x, t, b, c, d); },
	easeInQuad: function (x, t, b, c, d) {return c*(t/=d)*t + b;},
	easeOutQuad: function (x, t, b, c, d) {return -c *(t/=d)*(t-2) + b},
	easeInOutQuad: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t + b;return -c/2 * ((--t)*(t-2) - 1) + b},
	easeInCubic: function (x, t, b, c, d) {return c*(t/=d)*t*t + b},
	easeOutCubic: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t + 1) + b},
	easeInOutCubic: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t + b;return c/2*((t-=2)*t*t + 2) + b},
	easeInQuart: function (x, t, b, c, d) {return c*(t/=d)*t*t*t + b},
	easeOutQuart: function (x, t, b, c, d) {return -c * ((t=t/d-1)*t*t*t - 1) + b},
	easeInOutQuart: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t + b;return -c/2 * ((t-=2)*t*t*t - 2) + b},
	easeInQuint: function (x, t, b, c, d) {return c*(t/=d)*t*t*t*t + b},
	easeOutQuint: function (x, t, b, c, d) {return c*((t=t/d-1)*t*t*t*t + 1) + b},
	easeInOutQuint: function (x, t, b, c, d) {if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;return c/2*((t-=2)*t*t*t*t + 2) + b},
	easeInSine: function (x, t, b, c, d) {return -c * Math.cos(t/d * (Math.PI/2)) + c + b},
	easeOutSine: function (x, t, b, c, d) {return c * Math.sin(t/d * (Math.PI/2)) + b},
	easeInOutSine: function (x, t, b, c, d) {return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b},
	easeInExpo: function (x, t, b, c, d) {return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b},
	easeOutExpo: function (x, t, b, c, d) {return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b},
	easeInOutExpo: function (x, t, b, c, d) {if (t==0) return b;if (t==d) return b+c;if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;return c/2 * (-Math.pow(2, -10 * --t) + 2) + b},
	easeInCirc: function (x, t, b, c, d) {return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b},
	easeOutCirc: function (x, t, b, c, d) {return c * Math.sqrt(1 - (t=t/d-1)*t) + b},
	easeInOutCirc: function (x, t, b, c, d) {if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b},
	easeInElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b},
	easeOutElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b},
	easeInOutElastic: function (x, t, b, c, d) {var s=1.70158;var p=0;var a=c;if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b},
	easeInBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158;return c*(t/=d)*t*((s+1)*t - s) + b},
	easeOutBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158;return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b},
	easeInOutBack: function (x, t, b, c, d, s) {if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b},
	easeInBounce: function (x, t, b, c, d) {return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b},
	easeOutBounce: function (x, t, b, c, d) {if ((t/=d) < (1/2.75)) {	return c*(7.5625*t*t) + b;} else if (t < (2/2.75)) {	return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;} else if (t < (2.5/2.75)) {	return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else {	return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}},
	easeInOutBounce: function (x, t, b, c, d) {if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;}
});

