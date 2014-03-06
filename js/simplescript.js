var namepile = ["IAN CHENG","DAVID OREILLY","REED+RADER","ALEX MCLEOD","POD BLOTZ","JACOB CIOCCI","KATIE TORN","SEAN BOWIE (TEAMS)","JOEY RYKEN","ALEJANDRO CRAWFORD","DANIEL SWAN","ALLEN CORDELL","JÓNÓ MI LO","DAVID LEWANDOWSKI"];
var gifpile = ['signs/iancheng.jpg','signs/davidoreilly.gif','signs/reedrader.jpg','signs/alexmcleod.jpg','signs/suzypoling.jpg','signs/jacobciocci.jpg','signs/katietorn.png','signs/seanbowie.jpg','signs/joeyryken.jpg','signs/alejandrocrawford.jpg','signs/danielswan.jpg','signs/allencordell.jpg','signs/jonomilo.gif','signs/davidlewandowski.jpg'];

var divpile = ['<div class="artslide"><iframe src="//player.vimeo.com/video/56608690?byline=0&amp;portrait=0&amp;color=ffffff&amp;autoplay=1&amp;loop=1" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/62087014?byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/73192234?byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><img src="signs/art/amcleod01.jpg" width="100%" /></div><div class="artslide"><img src="signs/art/amcleod02.jpg" width="100%" /></div>',
'<div class="suzybox"><img src="signs/art/suzy00.jpg" class="suz" /><img src="signs/art/suzy01.jpg" class="suz" /><img src="signs/art/suzy02.jpg" class="suz" /><img src="signs/art/suzy03.jpg" class="suz" /></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/69783191?byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/41115151?title=0&amp;byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><div class="artslide"><iframe src="//player.vimeo.com/video/34095055?title=0&amp;byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div><div class="suzybox"><img src="signs/art/KTorn01.jpg" class="suz" /><img src="signs/art/KTorn02.jpg" class="suz" /><img src="signs/art/KTorn03.jpg" class="suz" /><img src="signs/art/KTorn04.jpg" class="suz" /></div>',
'<div class="artslide"><img src="signs/seanbowie.png" width="100%" /></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/75357200?title=0&amp;byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//player.vimeo.com/video/29945533?byline=0&amp;portrait=0&amp;color=ff0179&amp;autoplay=1&amp;loop=1" width="100%" height="56.25%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//www.youtube.com/embed/qTeo853XuUk?autoplay=1&loop=1&autohide=1" frameborder="0" allowfullscreen></iframe></div>',
'<div class="artslide"><iframe src="//www.youtube.com/embed/DJqMnrzE5cA?autoplay=1&loop=1&autohide=1" frameborder="0" allowfullscreen></iframe></div>',
'<div class="suzybox"><img src="signs/art/jono01.jpg" class="suz" /><img src="signs/art/jono02.gif" class="suz" /><img src="signs/art/jono03.gif" class="suz" /><img src="signs/art/jono04.gif" class="suz" /><img src="signs/art/jono05.jpg" class="suz" /></div>',
'<div class="artslide"><iframe src="//www.youtube.com/embed/wBqM2ytqHY4?autoplay=1&loop=1&autohide=1" frameborder="0" allowfullscreen></iframe></div>',
];

var idpile = ["ian","davido","mattpam","alex","suzy","jacob","katie","sean","joey","alejandro","daniel","allen","jono","dlew"];

var storeXX=0;
var storeYY=0;
var thepick;

$(document).ready(function() {
	$('#over').on('mousedown',function(e) {
			e.originalEvent.preventDefault();
  			storeXX = e.pageX;
    		storeYY = e.pageY;
    		$('#over').on('mousemove',function(e) {
        		var shiftX = e.pageX-storeXX;
        		var shiftY = e.pageY-storeYY;
        		storeXX = e.pageX;
       			storeYY = e.pageY;
      			$('#artholder').css({left:'+='+shiftX+'px'});
   			});
	})
	.on('mouseup',function() {
    	$('#over').unbind("mousemove");
	});
	$('#over').bind('touchstart',function(e) {
			e.preventDefault();
			var ev = e.originalEvent.touches[0]|| e.originalEvent.changedTouches[0];
  			storeXX = ev.pageX;
    		storeYY = ev.pageY;
    });
    $('#over').bind('touchmove',function(e) {
    		e.preventDefault();
			var ev = e.originalEvent.touches[0]|| e.originalEvent.changedTouches[0];
        	var shiftX = ev.pageX-storeXX;
        	var shiftY = ev.pageY-storeYY;
        	storeXX = ev.pageX;
       		storeYY = ev.pageY;
      		$('#artholder').css({left:'+='+shiftX+'px'});
   	})
	.on('mouseup',function() {
    	$('#over').unbind("mousemove");
	});
	$('#worldover').on('mousedown',function(e) {
		e.originalEvent.preventDefault();
		$('#worldover').addClass('worldact');
    	storeXX = e.pageX;
    	storeYY = e.pageY;
    	$('#worldover').on('mousemove',function(e) {
       		var shiftX = e.pageX-storeXX;
       		var shiftY = e.pageY-storeYY;
        	storeXX = e.pageX;
       		storeYY = e.pageY;
      		$('#world').css({left:'+='+shiftX+'px',top:"+="+shiftY+"px"});
   		 });
	})
	.on('mouseup',function() {
    	$('#worldover').unbind("mousemove");
    	$('#worldover').removeClass('worldact');
	});
	$(document).mouseout(function() {
    	$('#worldover').unbind("mousemove");
    	$('#worldover').removeClass('worldact');
    	$('#over').unbind("mousemove");
	});
	$('#worldover').bind('touchstart',function(e) {
			e.preventDefault();
			var ev = e.originalEvent.touches[0]|| e.originalEvent.changedTouches[0];
  			storeXX = ev.pageX;
    		storeYY = ev.pageY;
    });
    $('#worldover').bind('touchmove',function(e) {
    		e.preventDefault();
			var ev = e.originalEvent.touches[0]|| e.originalEvent.changedTouches[0];
        	var shiftX = ev.pageX-storeXX;
        	var shiftY = ev.pageY-storeYY;
        	storeXX = ev.pageX;
       		storeYY = ev.pageY;
      		$('#world').css({left:'+='+shiftX+'px',top:"+="+shiftY+"px"});
   	});
	
	$('.house').click(function(e){
		thepick = idpile.indexOf($(this).attr('id'));
		if (thepick == 4){
			poling.play();
			poling.style.display="inline";
		}
		else if (thepick == 7){
			bowie.play();
			bowie.style.display="inline";
		}
		else if (thepick == 12){
			jonomilo.play();
			jonomilo.style.display="inline";
		}
		$("#artholder").empty();	
		$("#gallery").css("display","table-cell");
		$("#artholder").append(divpile[thepick]);
		$("#namebadge").html(namepile[thepick]);
		$("#namebadge").animate({height:'100px'},200);
		$("#gallery").animate({height:'100%',width:'100%',left:'0%',top:'0%',opacity:1},200);
		$("#info").animate({height:'0px'},200);
	});

	$('#namebadge').click(function(e){
		$("#gallery").animate({height:'0%',width:'0%',left:'50%',top:'50%',opacity:1},200,function(){ 
			$("#gallery").css("display","none");
			$("#artholder").empty();
			$("#artholder").css({left:"0px"});
			$("#namebadge").animate({height:'0px'},200);
			$("#info").animate({height:'200px'},200);
			if(thepick==7){
	    		bowie.pause();
	    		bowie.src = bowie.src;
	    		bowie.style.display="none";
			}
	    	else if(thepick==4){
	    		 poling.pause();
				 poling.src = poling.src;
   				 poling.style.display="none";
	    	}
	    	else if(thepick==12){
	    		 jonomilo.pause();
				 jonomilo.src = poling.src;
   				 jonomilo.style.display="none";
	    	}
		});
	});
	$('#info').click(function(){
		$('#pavilion-info').toggle(200);
	});
});
$(window).load(function(){
		$("#loader").css("display","hidden");
		$("#info").animate({height:'200px'},200);
		bowie = document.getElementById('bowie');
		if (bowie.canPlayType("audio/mpeg") !== "") bowie.src = "audio/OVOXO (Trust Edit).mp3";
		else bowie.src = "audio/OVOXO (Trust Edit).ogg";
		bowie.pause();
		poling = document.getElementById('poling');
		if (poling.canPlayType("audio/mpeg") !== "") poling.src = "audio/poling.mp3";
		else poling.src = "audio/poling.ogg";
		poling.pause();
		jonomilo = document.getElementById('jonomilo');
		if (jonomilo.canPlayType("audio/mpeg") !== "") jonomilo.src = "audio/jonomilo.mp3";
		else jonomilo.src = "audio/jonomilo.ogg";
		jonomilo.pause();
});
