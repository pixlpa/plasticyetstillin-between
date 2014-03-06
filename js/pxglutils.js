
function resizeCanvas() {
     c.width = c.clientWidth;
     c.height = c.clientHeight;
     c.aspect = c.width/c.height;
     initFBOs(gl,fboz,fboCount);
}
function initBuffer(buf,dataset){
  	gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataset), gl.STATIC_DRAW);
}
function initAttrs(){
		program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');
		gl.enableVertexAttribArray(program.vertexPosAttrib);

		program.vertexColorAttrib = gl.getAttribLocation(program, 'color');
		gl.enableVertexAttribArray(program.vertexColorAttrib);
		
		program.vertexTexAttrib = gl.getAttribLocation(program, 'texcoord');
		gl.enableVertexAttribArray(program.vertexTexAttrib);
}

function createProgram(vid, fid) {
  	var program = gl.createProgram();
  	var vshader = createShader(vid, gl.VERTEX_SHADER);
  	var fshader = createShader(fid, gl.FRAGMENT_SHADER);
  	gl.attachShader(program, vshader);
  	gl.attachShader(program, fshader);
  	gl.linkProgram(program);
  	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
 		 throw gl.getProgramInfoLog(program);
	}
  	return program;
}
function createShader(id, type) {
	
 	var shader = gl.createShader(type);
 	gl.shaderSource(shader, parseShader(id));
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
 			throw gl.getShaderInfoLog(shader);
	}
  	return shader;
}
function parseShader(id){
	 var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }
    return str;
}

//texture offset triangle constructor
function glitchTri(trinum){
	this.number = trinum;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
	this.gen();
}
glitchTri.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (i=0;i<this.number;i++){
		var offsets = [Math.random()*0.2-0.1,Math.random()*0.2-0.1];
		var loc = [Math.random()-0.5,Math.random()-0.5,Math.random()-0.5];
		for (a=0;a<3;a++){
			for (b=0;b<4;b++){
				if(b<3){
					var pt = Math.random()+loc[b];
					this.vertices[vindex]= pt*2-1;
					if(b<2) this.texcoord[tindex]=pt+offsets[b];
					if(b<2) tindex++;
					if(b>2) this.vertices[vindex]=0;
					vindex++;
				}
				this.colors[cindex]= 1.;
				cindex++;
			}
		}
	}
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
}
glitchTri.prototype.draw = function(gl,texture){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.drawArrays(gl.TRIANGLES, 0,this.number*3);		
}

//slightly warped mesh constructor
function warpMesh(xnum,ynum){
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
	this.xnum = xnum;
	this.ynum = ynum;
	this.gen();
	var eindex=0;
	for(y=0;y<(ynum-1);y++){
		for(x=0;x<(xnum-1);x++){
			var pt=x+xnum*y;
			this.elements[eindex++]=pt;
			this.elements[eindex++]=pt+1;
			this.elements[eindex++]=pt+xnum;
			this.elements[eindex++]=pt+1;
			this.elements[eindex++]=pt+1+xnum;
			this.elements[eindex++]=pt+xnum;
		}
	}
    this.elem = gl.createBuffer();
    this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
}
warpMesh.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (y=0;y<this.ynum;y++){
		for (x=0;x<this.xnum;x++){
			for (b=0;b<4;b++){
				if(b<3){
					if(b==0){
						var pt = x*(1./(this.xnum-1));
						this.texcoord[tindex++]=pt;
						pt = 2*pt+(Math.random()*0.05-0.025)-1;
						this.vertices[vindex++]= pt;
					}
					else if(b==1){
						var pt = y*(1./(this.ynum-1));
						this.texcoord[tindex++]=1-pt;
						pt = 1.-(2*pt+(Math.random()*0.05-0.025));
						this.vertices[vindex++]= pt;
					}			
					else if(b==2) this.vertices[vindex++]=0;
				}
				this.colors[cindex++]= 1.;
			}
		}
	}
	initBuffer(this.vert,this.vertices);
	initBuffer(this.tex,this.texcoord);
	initBuffer(this.color,this.colors);
}
warpMesh.prototype.draw = function(gl,texture){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.drawElements(gl.TRIANGLES, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}

function groundMesh(xnum,ynum,texrepeat,variation){
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.rotate=0;
	this.vcolor = [1,1,1,1];
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
	this.xnum = xnum;
	this.ynum = ynum;
	this.texrepeat = 1;
	this.variation = [0.1,0.1,0.1];
	if(texrepeat) this.texrepeat = texrepeat;
	if(variation) this.variation = variation;
	this.gen();
	var eindex=0;
	for(y=0;y<(ynum-1);y++){
		for(x=0;x<(xnum-1);x++){
			var pt=x+xnum*y;
			this.elements[eindex++]=pt;
			this.elements[eindex++]=pt+1;
			this.elements[eindex++]=pt+xnum;
			this.elements[eindex++]=pt+1;
			this.elements[eindex++]=pt+1+xnum;
			this.elements[eindex++]=pt+xnum;
		}
	}
    this.elem = gl.createBuffer();
    this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
}
groundMesh.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	var xv = this.variation[0];
	var yv = this.variation[1];
	var zv = this.variation[2];
	
	for (y=0;y<this.ynum;y++){
		for (x=0;x<this.xnum;x++){
			for (b=0;b<4;b++){
				if(b<3){
					if(b==0){
						var pt = x*(1./(this.xnum-1));
						this.texcoord[tindex++]=pt*this.texrepeat;
						pt = 2*pt+(Math.random()*xv-xv*0.5)-1;
						this.vertices[vindex++]= pt;
					}
					else if(b==1){ 
						var pt = (Math.random()*zv-zv*0.5);
						this.vertices[vindex++]=pt;
					}
					else if(b==2){
						var pt = y*(1./(this.ynum-1));
						this.texcoord[tindex++]=(1-pt)*this.texrepeat;
						pt = 1.-(2*pt+(Math.random()*yv-yv*0.5));
						this.vertices[vindex++]= pt;
					}			

				}
				this.colors[cindex++]= 1.;
			}
		}
	}
	initBuffer(this.vert,this.vertices);
	initBuffer(this.tex,this.texcoord);
	initBuffer(this.color,this.colors);
}
groundMesh.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.uniform1f(vrotate,this.rotate);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.drawElements(gl.TRIANGLES, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}

function gradientTri(trinum){
	this.number = trinum;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
	this.gen();
}
gradientTri.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (i=0;i<this.number;i++){
		var loc = [Math.random()-0.5,Math.random()-0.5,Math.random()-0.5];
		var offsets = [Math.random()*0.2-0.1,Math.random()*0.2-0.1];
		for (a=0;a<3;a++){
			for (b=0;b<4;b++){
				if(b<3){
					var pt = Math.random()+loc[b];
					this.vertices[vindex]= pt*2-1;
					this.colors[cindex]= Math.random();
					if(b<2) this.texcoord[tindex]=pt+offsets[b];
					if(b<2) tindex++;
					if(b>2) this.vertices[vindex]=0;
					vindex++;
				}
				else this.colors[cindex]= 1;
				cindex++;
			}
		}
	}
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
}
gradientTri.prototype.draw = function(gl,texture){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.drawArrays(gl.TRIANGLES, 0,this.number*3);	
}

function billBoard(gl){
	this.vert = gl.createBuffer();
	initBuffer(this.vert,[
      -1.0,  1.0, 0.0,
      -1.0,  -1.0,0.0,
      1.0,  1.0,0.0,
      1.0,  -1.0,0.0
      ]);
      
    this.tex = gl.createBuffer();
    initBuffer(this.tex,[
    0,1,
    0,0,
    1,1,
    1,0]);
    
    this.color = gl.createBuffer();
    initBuffer(this.color,[
   	1,1,1,1,
   	1,1,1,1,
   	1,1,1,1,
   	1,1,1,1]);
}
billBoard.prototype.draw = function(gl,texture){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
}

function vParticles(points){
	this.number = points;
	this.x = [];
	this.y = [];
	this.z = [];
	this.px = [];
	this.py = [];
	this.pz = [];
	this.c = [];//connected elements 
	this.d = [];//preferred distances
	this.s = [];//strength
	this.bound = [0.9,0.9,0.9];
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
    this.elem = gl.createBuffer();
	this.gravity = 0.0006;
	this.update = function(){
		this.doGravity();
		this.linksolve();
		this.limits();
		this.linksolve();
		this.linksolve();
		this.integrate();
		this.doGeom();
		initBuffer(this.vert,this.vertices);
	}
	this.addpoint = function(index,x,y,z){
		this.x[index] = x;
		this.y[index] = y;
		this.z[index] = z;
		this.px[index] = x;
		this.py[index] = y;
		this.pz[index] = z;
	}
	this.addLinks = function(index,links,distance,strength){
		this.c[index] = links;
		this.d[index] = distance;
		this.s[index] = strength;
	}
}
vParticles.prototype.doGeom = function(){
	var vindex = 0;
	for(i=0;i<this.x.length;i++){
		var x = this.x[i];
		var y = this.y[i];
		var z = this.z[i];
		this.vertices[vindex]= x;
		vindex++;
		this.vertices[vindex]= y;
		vindex++;
		this.vertices[vindex]= z;
		vindex++;
	}
}
vParticles.prototype.integrate = function(){
	for(i=0;i<this.x.length;i++){
		var x = this.x[i];
		var px = x;
		x = x+(x-this.px[i]);
		var y = this.y[i];
		var py = y;
		y = y+(y-this.py[i]);
		var z = this.z[i];
		var pz = z;
		z = z+(z-this.pz[i]);
		this.px[i]=px;
		this.py[i]=py;
		this.pz[i]=pz;
		this.x[i]=x;
		this.y[i]=y;
		this.z[i]=z;
	}
}
vParticles.prototype.linksolve = function(){
	for(i=0;i<this.x.length;i++){
		if(this.c[i]){
			for(f=0;f<this.c[i].length;f++){
				var dx = this.x[i] - this.x[this.c[i][f]];
				var dy = this.y[i] - this.y[this.c[i][f]];
				var dz = this.z[i] - this.z[this.c[i][f]];
				var dst = Math.sqrt(dx*dx+dy*dy+dz*dz);
				var dstdf = ((this.d[i][f]-dst)/dst)*this.s[i][f];
				var st = this.s[i][f];
				var tx = dstdf*dx*st;
				var ty = dstdf*dy*st;
				var tz = dstdf*dz*st;
				this.x[i]+=tx;
				this.y[i]+=ty;
				this.z[i]+=tz;
				this.x[this.c[i][f]]-=tx;
				this.y[this.c[i][f]]-=ty;
				this.z[this.c[i][f]]-=tz;
			}
		}
	}	
}
vParticles.prototype.doGravity = function(){
	for(i=0;i<this.x.length;i++){
		this.y[i]-=this.gravity;
	}
}
vParticles.prototype.limits = function(){
	for(i=0;i<this.x.length;i++){
		if(Math.abs(this.x[i])>this.bound[0]){ 
			if(this.x[i]>0) this.x[i]-=0.08;
				else this.x[i]+= 0.08;
		}
		if(Math.abs(this.y[i])>this.bound[1]){ 
			if(this.y[i]>0) this.y[i]-=0.08;
			else this.y[i]+= 0.2;
		}
		if(Math.abs(this.z[i])>this.bound[2]){ 
			if(this.z[i]>0) this.z[i]-=0.08;
				else this.z[i]+= 0.08;
		}		
	}
}
vParticles.prototype.test = function(){
	for(i=0;i<10;i++){
		this.addpoint(i,Math.random()*0.4-0.2,Math.random()*0.4-0.1,Math.random()*0.2-0.1);
	}
	this.addLinks(0,[1,2,3,4,5,6,9],[0.6,0.6,0.6,0.6,0.6,0.75,0.75],[0.3,0.3,0.3,0.3,0.1,0.1,0.1]);
	this.addLinks(2,[3,8,6,1,4],[0.4,0.1,0.4,0.4,0.4],[0.2,0.2,0.2,0.2,0.05]);
	this.addLinks(4,[3,7,9,5],[0.4,0.1,0.4,0.4],[0.2,0.2,0.2,0.2]);
	this.addLinks(3,[7,8],[0.4,0.4],[0.2,0.2]);
	this.addLinks(1,[5,4,3],[0.4,0.6,0.6],[0.2,0.1,0.1]);
	this.addLinks(5,[2,3,9],[0.6,0.6,0.9],[0.1,0.1,0.05]);
	this.addLinks(6,[9,1],[1.5,0.9],[0.01,0.05]);
	this.addLinks(7,[8],[1.],[0.05]);
}
vParticles.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (i=0;i<this.number;i++){
			for (b=0;b<4;b++){
				if(b<3){
					var pt = Math.random();
					this.vertices[vindex]= pt*2-1;
					this.colors[cindex]= Math.random();
					if(b<2) this.texcoord[tindex]=pt;
					if(b<2) tindex++;
					if(b>2) this.vertices[vindex]=0;
					vindex++;
				}
				else this.colors[cindex]= 1;
				cindex++;
			}
	}
	this.elements = [0,1,2,0,2,3,0,3,4,0,4,5,0,5,1,2,3,8,6,2,8,4,3,7,4,7,9];
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
	this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
	
}
vParticles.prototype.draw = function(gl,texture){
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.drawElements(gl.TRIANGLES, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}

function pxCamera(){
	this.position = [0,0.75,1];
	this.floor = -.75;
	this.py = 0.5;
	this.pitch = 0;
  	this.pitchRate = 0;
	this.yaw = 0;
  	this.yawRate = 0;
  	this.tyawRate = 0;
	this.speed = 0;
	this.tspeed = 0;
	this.lasttime = 0;
	this.elapsed = 0;
}	
pxCamera.prototype.kdown = function(event){
		var k = event.keyCode;
    	if (k==37 || k==65) {
      		// Left cursor key or A
      		this.yawRate = 0.1;
   		} else if (k==39 || k==68) {
      		// Right cursor key or D
      		this.yawRate = -0.1;
    	}

    	if (k==38 || k==87) {
      		// Up cursor key or W
      		this.speed = 0.003;
    	} else if (k==40 || k==83) {
      		// Down cursor key
      		this.speed = -0.003;
    	}
    	
    	if (k==32) this.py -= 0.15;
}
pxCamera.prototype.kup = function(event){
		var k = event.keyCode;
    	if (k==37 || k==65 || k==39 || k==68) {
      		// Left cursor key or A
      		this.yawRate = 0;
   		}
	   	if (k==38 || k==87 || k==40 || k==83) {
      		// Up cursor key or W
      		this.speed = 0;
    	}
}
pxCamera.prototype.bounce = function(){
	var acc = this.position[1]+(this.position[1]-this.py);
	this.py = this.position[1];
	acc -= 0.005;
	if(acc<this.floor) acc+= 1.005*(this.floor-acc);
	this.position[1] = acc;
}
pxCamera.prototype.move = function(){
	this.bounce();
  	var time = new Date().getTime();
  	var elapsed = 0;
  	if(this.lasttime!=0){
  		elapsed = time-this.lasttime;
  	}
  	this.elapsed = elapsed;
  	this.tyawRate = this.tyawRate*0.8+this.yawRate*0.2;
  	this.tspeed = this.tspeed*0.9+this.speed*0.1;
  	if (Math.abs(this.tspeed) > 0.0001) {
        this.position[0] -= Math.sin(degToRad(this.yaw)) * this.tspeed * elapsed;
        this.position[2] -= Math.cos(degToRad(this.yaw)) * this.tspeed * elapsed;
	}
	
	this.forward = [-Math.sin(degToRad(this.yaw))+this.position[0],this.position[1],-Math.cos(degToRad(this.yaw))+this.position[2]];
	this.yaw += this.tyawRate * elapsed;
    //this.pitch += this.pitchRate * elapsed;
    this.lasttime = time;
}

function pxHouse(){
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.rotate = 0;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
    this.elem = gl.createBuffer();
}
pxHouse.prototype.gen = function(){
	var cindex=0;
	for (i=0;i<10;i++){
			for (b=0;b<4;b++){
				if(b<3){
					this.colors[cindex]= 1;
				}
				else this.colors[cindex]= 1;
				cindex++;
			}
	}
	this.vertices = [-1,1,2,1,1,2,1,0,2,-1,0,2,-1,1,-2,1,1,-2,1,0,-2,-1,0,-2,0,1.5,2,0,1.5,-2];
	this.texcoord = [0,0.666,0.5,0.666,0.5,0,0,0,0.5,0.666,1,0.666,1,0,0.5,0,0.25,1,0.75,1];
	this.elements = [0,2,1,3,2,0,0,1,8,4,6,5,7,6,4,4,5,9,1,5,2,6,5,2,0,4,7,7,3,0,8,9,1,9,5,1,8,9,0,9,4,0];
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
	this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
	
}
pxHouse.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.drawElements(gl.TRIANGLES, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}
pxHouse.prototype.doTransform = function(){
	this.mat = mat4.create();
	mat4.identity(this.mat);
	mat4.rotateY(this.mat,this.mat,this.rotate);
	mat4.translate(this.mat,this.mat,this.position);
	mat4.scale(this.mat,this.mat,this.scale);
}

function pxGrid(xnum,ynum){
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.rotate = 0;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
    this.elem = gl.createBuffer();
    this.xnum = xnum;
	this.ynum = ynum;
	this.gen();
	var eindex=0;
	for(y=0;y<ynum;y++){
		for(x=0;x<(xnum-1);x++){
			var pt=x+xnum*y;
			this.elements[eindex++]=pt;
			this.elements[eindex++]=pt+1;
		}
	}
	for(x=0;x<xnum;x++){
		for(y=0;y<(ynum-1);y++){
			var pt=x+xnum*y;
			this.elements[eindex++]=pt;
			this.elements[eindex++]=pt+xnum;
		}
	}
    this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
}
pxGrid.prototype.gen = function(){
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (y=0;y<this.ynum;y++){
		for (x=0;x<this.xnum;x++){
			for (b=0;b<4;b++){
				if(b<3){
					if(b==0){
						var pt = x*(1./(this.xnum-1));
						this.texcoord[tindex++]=pt;
						pt = 2*pt-1;
						this.vertices[vindex++]= pt;
					}
					else if(b==1){ 
						var pt = 0;
						this.vertices[vindex++]=pt;
					}
					else if(b==2){
						var pt = y*(1./(this.ynum-1));
						this.texcoord[tindex++]=(1-pt);
						pt = 1.-2*pt;
						this.vertices[vindex++]= pt;
					}			

				}
				this.colors[cindex++]= 1.;
			}
		}
	}
	initBuffer(this.vert,this.vertices);
	initBuffer(this.tex,this.texcoord);
	initBuffer(this.color,this.colors);
}
pxGrid.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.lineWidth(1);
    gl.drawElements(gl.LINES, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}

function pxShack(){
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.rotate = 0;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.elements = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
    this.elem = gl.createBuffer();
}
pxShack.prototype.gen = function(){
	var cindex=0;
	this.vertices = [ -1,0,1,	-1,1,1,		1,0,1,	1,1,1, 1,0,1, 1,1,1,
					1,0,-1,		1,1,-1,1,0,-1,	1,1,-1,		-1,0,-1, -1,1,-1,-1,0,-1, -1,1,-1,	-1,0,1,-1,1,1,
					-1.5,1.1,1.5,-1.5,1.1,1.5, 1.5,1.1,1.5,	-1.5,1.1,-1.5,1.5,1.1,-1.5
					];	
						
	for (i=0;i<21;i++){
			var grey = Math.random()*0.5;
			for (b=0;b<4;b++){
				if(b<3){
					this.colors[cindex]= grey;
					this.vertices[cindex]+= Math.random()*0.5-0.25;					
				}
				else this.colors[cindex]= 1;
				cindex++;
			}
	}
	this.texcoord = [0,0,0,1,0.25,0,0.25,1,0.25,0,0.25,1,0.5,0,0.5,1,0.5,0,0.5,1,0.75,0,0.75,1,0.75,0,0.75,1,1,0,1,0,0,0,0,0,1,0,0,1,1,1];
	this.elements = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
	this.elem.numitems = this.elements.length;
  	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
  	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.elements), gl.STATIC_DRAW);
	
}
pxShack.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.uniform1f(vrotate,this.rotate);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elem);
    gl.drawElements(gl.TRIANGLE_STRIP, this.elem.numitems, gl.UNSIGNED_SHORT, 0);		
}

function pxBorder(num,height,run){
	this.number = num;
	this.height = height;
	this.run = run;
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.rotate = 0;
	this.variance = 0.1;
	this.vertices = new Array();
	this.colors = new Array();
	this.texcoord = new Array();
	this.vert = gl.createBuffer();
	this.tex = gl.createBuffer();
	this.color = gl.createBuffer();
	this.gen();
}
pxBorder.prototype.gen = function(){
	var heading = 0;
	var pos = [0,0];
	var vindex=0;
	var cindex=0;
	var tindex = 0;
	for (i=0;i<this.number;i++){
			var pt = i*6;
			var tt = i*4;
			var rise = Math.random()*0.2;
			heading+=(Math.random()*2-1)*this.variance;
			pos = [pos[0]+this.run*Math.cos(heading),pos[1]+this.run*Math.sin(heading)];
			this.vertices[pt]=pos[0];
			this.vertices[pt+1]=rise;
			this.vertices[pt+2]=pos[1];
			this.vertices[pt+3]=pos[0];
			this.vertices[pt+4]=this.height+rise;
			this.vertices[pt+5]=pos[1];
			this.texcoord[tt]=i*10;
			this.texcoord[tt+1]=0;
			this.texcoord[tt+2]=i*10;
			this.texcoord[tt+3]=1;
			for(a=0;a<8;a++){
				this.colors[i*8+a]=1;
			}
	}
	initBuffer(this.vert,this.vertices);
    initBuffer(this.tex,this.texcoord);
    initBuffer(this.color,this.colors);
}
pxBorder.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.uniform1f(vrotate,this.rotate);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
  	gl.drawArrays(gl.TRIANGLE_STRIP, 0,this.vertices.length/3);	
}


function Shot(gl){
    this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.vert = gl.createBuffer();
	initBuffer(this.vert,[
 		 -1.0,  1.0, 0.0,
     	-1.0,  -1.0,0.0,
      	1.0,  1.0,0.0,
      	1.0,  -1.0,0.0
   ]);
      
   this.tex = gl.createBuffer();
	initBuffer(this.tex,[
    	0,1,
    	0,0,
    	1,1,
    	1,0]);
    
   this.color = gl.createBuffer();
    	initBuffer(this.color,[
   			1,1,1,1,
   			1,1,1,1,
   			1,1,1,1,
   			1,1,1,1]);
}
		
Shot.prototype.draw = function(gl,texture){
			gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
			gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
			gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  			gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  			gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  			gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  			gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  			gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    		gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    		gl.bindTexture(gl.TEXTURE_2D, texture);
  			gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
}

function pxPlane(){
	this.scale = [1,1,1];
	this.position = [0,0,0];
	this.vcolor = [1,1,1,1];
	this.rotate = 0;
	this.img = null;
	this.texture = null;
	this.vert = gl.createBuffer();
	initBuffer(this.vert,[
      -1.0,  1.0, 0.0,
      -1.0,  -1.0,0.0,
      1.0,  1.0,0.0,
      1.0,  -1.0,0.0
      ]);
      
    this.tex = gl.createBuffer();
    initBuffer(this.tex,[
    0,1,
    0,0,
    1,1,
    1,0]);
    
    this.color = gl.createBuffer();
    initBuffer(this.color,[
   	1,1,1,1,
   	1,1,1,1,
   	1,1,1,1,
   	1,1,1,1]);
}

pxPlane.prototype.draw = function(gl,texture){
	gl.uniform3f(vscale,this.scale[0],this.scale[1],this.scale[2]);
	gl.uniform3f(vtranslate,this.position[0],this.position[1],this.position[2]);
	gl.uniform4f(vcolor,this.vcolor[0],this.vcolor[1],this.vcolor[2],this.vcolor[3]);
	gl.uniform1f(vrotate,this.rotate);
	//this.texture.image = this.img;
	gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
  	gl.vertexAttribPointer(program.vertexColorAttrib, 4, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
  	gl.vertexAttribPointer(program.vertexPosAttrib, 3, gl.FLOAT, false, 0, 0);
  	gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
  	gl.vertexAttribPointer(program.vertexTexAttrib, 2, gl.FLOAT, false, 0, 0);
    gl.uniform1i(gl.getUniformLocation(program,"tex0"), 0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
  	gl.drawArrays(gl.TRIANGLE_STRIP, 0,4);
}
	
function makeMeSprite(){
	var BB = new Object();
	BB.xt = 0;
	BB.pxt = 0;
	BB.yt = 0;
	BB.pyt = 0;
	BB.xvel = 0;
	BB.xvelt = 0;
	BB.yvel = 0;
	BB.yvelt = 0;
	BB.color = [0,0,0,1];
	BB.scale = 0.25;
	BB.scalet = 0.25;
	return BB;
}
function makeFollower(){
	var BB = new Object();
	BB.xt = 0;
	BB.yt = 0;
	BB.scale = 0.2;
	BB.color = [0,0,0,1];
	return BB;
}	
function updateFollower(BB){
	BB.xt = theBrushx;
	BB.yt = theBrushy;
}
function updateSprite(BB,AA){
	if(AA){
		BB.xt = AA.xt+AA.xvel;
		BB.xt *=0.95;
		BB.yt = AA.yt+AA.yvel;
		BB.yt *=0.95;
		BB.xvel = (AA.xvel*0.95)+(AA.xvelt*0.05);
		BB.yvel = (AA.yvel*0.95)+(AA.yvelt*0.05);
		BB.scale = (AA.scale*0.85)+(AA.scalet*0.15);
		BB.scale *= 0.99;
		for(i=0;i<4;i++){
			BB.color[i]= AA.color[i];
		}
		BB.xvelt = AA.xvelt;
		BB.yvelt = AA.yvelt;
		BB.scalet = AA.scalet;
		BB.xt = BB.xt*0.99+theBrushx*0.01;
		BB.yt = BB.yt*0.99+theBrushy*0.01
	}
	else {		
		BB.xt += BB.xvel;
		BB.xt *= 0.95;
		BB.yt += BB.yvel;
		BB.yt *= 0.95;
		BB.xvel = (BB.xvel*0.95)+(BB.xvelt*0.05);
		BB.yvel = (BB.yvel*0.95)+(BB.yvelt*0.05);
	//if((Math.abs(BB.xt)>=1.)||(Math.abs(BB.yt)>=1.)) randomizeSprite(BB);
		BB.scale = (BB.scale*0.85)+(BB.scalet*0.15);
		BB.scale *= 0.99;
	}	
}
function randomizeSprite(BB){
	BB.xvelt = Math.random()*0.2-0.1;
	BB.yvelt = Math.random()*0.2-0.1;
	BB.scalet = Math.pow(Math.random()*0.8+0.01,6)+0.05;
	for(i=0;i<4;i++){
		BB.color[i]= Math.random();
		if(i==3) BB.color[i] = 1;
	}
}
function drawSprite(gl,sprite,BB,texture){
	gl.uniform2f(vscale,sprite.scale,sprite.scale*c.aspect);
	gl.uniform2f(vtranslate,sprite.xt,sprite.yt);
	gl.uniform4f(vcolor,sprite.color[0],sprite.color[1],sprite.color[2],sprite.color[3]);
	drawBB(gl,BB,texture);
}

//texture creation function
function createTheTexture(gl) {
  	var texture = gl.createTexture();
  	gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set up texture so we can render any size image and so we are
  // working with pixels.
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  return texture;
}

function initFBOs(gl,fbo,count){
	for(a=0;a<count;a++){
		fbo[a] = new Object();
		fbo[a].texture=createTheTexture(gl);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, c.width, c.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		fbo[a].buffer=makeMeFBO(gl,fbo[a].texture);
		fbo[a].renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, fbo[a].renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, c.width, c.height);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, fbo[a].renderbuffer);
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER,null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
}

function makeMeFBO(gl,texture){
	var fbo = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER,fbo);
	gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,texture,0);
	return fbo;
}
 
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
})();


	