var planetData, font;
var planets = [];

var timeScale = 1000; 
var zoomLevel = 10000000000;

var reverb;
var chorus;

var planetLabels = false;
var timeSlider;

function preload() {
    planetData = loadTable('planets.csv','csv','header');
    font = loadFont('CODE Bold.otf');
}

function setup() {
    createCanvas(window.innerWidth,window.innerHeight);
    angleMode(DEGREES);
    
    timeSlider = createSlider(0,5000,25);
    timeSlider.position(20,height-40);
    timeSlider.style('width', width - 40 + 'px');
    
    reverb = new p5.Reverb();
    reverb.set(4,2);

    for (r = 0; r < planetData.getRowCount(); r++){
            var name = planetData.getString(r,0);
            var diameter = planetData.getNum(r,2);
            var mass = planetData.getNum(r,1);
            var distance = planetData.getNum(r,8);
            var rotationPeriod = planetData.getNum(r,7);
            var orbitPeriod = planetData.getNum(r,11);
            planets.push(new planet(name,diameter,mass,distance,rotationPeriod,orbitPeriod));
    }
}

function draw() {
    background(0,0,10);
    fill(255);
    noStroke();

    timeScale = timeSlider.value();
    textAlign(CENTER,CENTER);
    textFont(font);
    textSize(15);
    text("Time Scale", width/2, height-50);
    
    textSize(40);
    text("Planetarium", width/2, 40);
    
    strokeWeight(1);
    stroke(255);
    line(width/2,height/2+5,width/2,height/2-5);
    line(width/2+5,height/2,width/2-5,height/2);
    
    for(let p of planets){
        p.update();
    }
            
}

class planet{
    constructor(name,diameter,mass,distance,rotationPeriod,orbitPeriod){
        this.name = name;
        this.diameter = diameter;
        this.mass = mass;
        this.distance = distance * 1000000000;
        this.rotationPeriod = rotationPeriod;
        this.orbitPeriod = orbitPeriod;
        
        this.osc = new p5.Oscillator(0,'sine');
        this.osc.freq(5500000/this.diameter);
        this.osc.amp(map(this.mass,0,4000,0.01,0.6));
        this.osc.connect(reverb);
        this.osc.start();
        
        this.ampMod = new p5.Oscillator(0,'sine');
        this.ampMod.freq((timeScale/this.rotationPeriod),0.1);
        this.ampMod.amp(map(this.mass,0,4000,0.01,0.6));
        this.ampMod.disconnect();
        this.ampMod.start();
        this.osc.amp(this.ampMod);
        
        this.x;
        this.y;
        this.size;
        this.phase = random(360);
        this.mute = false;
        this.showLabel = false;
        this.fillPhase = 0;
    }
    
    update(){
        this.ringRadius = this.distance/zoomLevel*2;
        this.phase += (timeScale/this.orbitPeriod);
        this.fillPhase = sin(map(frameCount,0,60,0,360*(timeScale/this.rotationPeriod)));
        this.x = (this.distance/zoomLevel) * cos(this.phase) + width/2;
        this.y = (this.distance/zoomLevel) * sin(this.phase) + height/2;
        this.size = ((this.diameter/zoomLevel)*5000000)+2;
        stroke(255,50);
        noFill();
        if(this.ringRadius<width) ellipse(width/2,height/2,this.ringRadius,this.ringRadius);
        
        if(this.mute) {
            stroke(255,50);
            noFill();
        }
        else {
            fill(255,map(this.fillPhase,-1,1,10,230));
            noStroke();
        }
        
        ellipse(this.x,this.y,this.size,this.size);
        
        if(dist(mouseX,mouseY,this.x,this.y)<(this.size/2)+5) this.showLabel = true;
        else this.showLabel = false;
        
        if(this.showLabel){
            textSize(12);
            fill(255);
            noStroke();
            textAlign(LEFT,CENTER);
            text(this.name,this.x+(this.size/2)+5,this.y);
        }

        var minX = (this.distance/zoomLevel) * cos(180) + width/2;
        var maxX = (this.distance/zoomLevel) * cos(0) + width/2;
        this.osc.pan(map(this.x,minX,maxX,-1,1),0.1);
        this.ampMod.freq((timeScale/this.rotationPeriod),0.1);
    }
    
    setMute(state){
        print(state);
        if(state){
            this.mute = true;
            this.osc.stop();
        }
        else {
            this.mute = false;
            this.osc.start();
        }
    }
}

function mouseWheel(event){
    zoomLevel = constrain(zoomLevel/(1-(Math.sign(event.delta)*0.1)),300000000,30000000000);
    print(zoomLevel);
}

function solo(planet){
    for(let p of planets){
        if(planets.indexOf(p) != planets.indexOf(planet)) p.setMute(true);
        else p.setMute(false);
    }
}


function mousePressed(){
    if(mouseY < height - 50){
        for(let p of planets){
            if(dist(mouseX,mouseY,p.x,p.y)<(p.size/2)+5) {
                solo(p); 
                return;
            }
        }
        for(let p of planets){
            p.setMute(false);
        }
    }
}