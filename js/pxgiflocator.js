function gifLocs(){
	this.intime = 0;
	this.found = false;
	this.pfound = false;
	this.pimage = null;
	this.house = [];
	this.signs = [];
	this.addHouse = function(pos){
			var home = new pxShack();
			home.gen();
			home.scale = [0.5,0.65,0.5];
			home.rotate = Math.random()*10;
			home.position = [pos[0],-1,pos[1]];
			home.vcolor = [1.2,1.2,1.2,1];
			this.house.push(home);
	}
	this.addSign = function(pos,index){
			var sign = new pxPlane();
			sign.scale = [0.5,0.5,1];
			sign.vcolor = [1,1,1,1];
			sign.position = [pos[0],0.3,pos[1]];
			sign.rotate = Math.random()*5;
			sign.img=document.createElement('img');
			sign.img.setAttribute("src",gifpile[index]);
			sign.img.style.display='none';
			sign.texture = createTheTexture(gl);
			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
			//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
			sign.texture.image = sign.img;
			this.signs.push(sign);
	}
	this.locEnter = function(index){
		this.intime=0; 
		cam.tspeed=0;
		$("#artholder").empty();	
		$("#gallery").css("display","table-cell");
		$("#artholder").append(divpile[index]);
		$("#namebadge").html(namepile[index]);
		$("#namebadge").animate({height:'100px'},200);
		$("#gallery").animate({height:'100%',width:'100%',left:'0%',top:'0%',opacity:1},200);
		$("#info").animate({height:'0px'},200);
		drawsigns=false;
		//if ($(".artslide").length>1) $("#backbb").css({left:"0px", display:"block"});
	}
	this.locLeave = function(){
		//$("#gallery").css("display","none");
		this.intime=0;
		$("#gallery").animate({height:'0%',width:'0%',left:'50%',top:'50%',opacity:1},200,function(){ 
			$("#gallery").css("display","none");
			$("#artholder").empty();
			$("#backbb").css({left:"0px", display:"none"});
			$("#artholder").css({left:"0px"});
			$("#namebadge").animate({height:'0px'},200);
			$("#info").animate({height:'200px'},200);
			drawsigns=true;
			});	
	}
	this.checkloc = function(){
			this.found = false;
    		var cx = cam.position[0];
    		var cy = cam.position[1];
    		var cz = cam.position[2];
    		$cords.html("X: "+Math.floor(cx*100)+"<br />Y: "+ -Math.floor(cz*100));
    		var pp;
    		for(pp=0;pp<gifpile.length;pp++){
        		if ((cx>this.loc[pp][0] && cx<this.loc[pp][1]) && (cz>this.loc[pp][2] && cz<this.loc[pp][3])){
    				this.found = true;
    				return pp;
    				//we have a match
    			}
    		}
    		if (!this.found) return -1; 
    }
    this.loc = new Array();
    this.pos = [[4,-4],[-4,-8],[8,-14],[16,-4],[8,6],[0,8],[-6,4],[-12,-4],[-16,-16],[-6,-18],[-10,12],[0,-16],[9,12],[-13,3.5]];
    var ii = 0;
    for (ii=0;ii<gifpile.length;ii++){
    	var pos = this.pos[ii];
    	this.addHouse(pos);
    	this.addSign(pos,ii);
    	this.loc[ii] = [pos[0]-0.65,pos[0]+0.65,pos[1]-0.65,pos[1]+0.65];
    }
    this.manage = function(){
    	    var gfound = this.checkloc();
    	    if (this.found){
    	    	if (this.pfound && this.pimage==gfound) return;
	    		else {
					this.locEnter(gfound);
					if(gfound == 7){
						//bowie.currentTime= 0;
						bowie.play();
						bowie.style.display="inline";
					}
					if(gfound == 4){
						//poling.currentTime=0;
						poling.play();
						poling.style.display="inline";
					}
					if(gfound == 12){
						//poling.currentTime=0;
						jonomilo.play();
						jonomilo.style.display="inline";
					}
	    			this.pimage = gfound;
	    		}
	    	}
	    	else {
	    		if (this.pfound){
	    			this.locLeave();
	    			if(this.pimage==7){
	    				 bowie.pause();
	    				 bowie.src = bowie.src;
	    				 bowie.style.display="none";
	    			}
	    			else if(this.pimage==4){
	    				 poling.pause();
	    				 poling.src = poling.src;
	    				 poling.style.display="none";
	    			}
	    			else if(this.pimage==12){
	    				 jonomilo.pause();
	    				 jonomilo.src = poling.src;
	    				 jonomilo.style.display="none";
	    			}
	    		}
	    	}	
	    	this.pfound = this.found;
	}
}

function GIFLoader(){
	this.img = [];
	var gdiv = document.getElementById('gallerypanel');
	for(var i = 0;i<gifpile.length;i++){
		this.img[i]=document.createElement('img');
		this.img[i].setAttribute("src",gifpile[i]);
		this.img[i].style.display='none';
		gdiv.appendChild(this.img[i]);
	}
}	
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
