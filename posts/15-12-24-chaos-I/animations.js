function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');

    document.body.classList.toggle('dark-mode');
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
        document.getElementById("theme-icon").src = folder+"/"+"icons/sun.svg";

    } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
        document.getElementById("theme-icon").src = folder +"/"+ "icons/moon.svg";
    }
    autonomous();
    stability();
    flow();
}

function project3DPointTo2D(x, y, z) {
    let scale = 20;
    return {
        x: (+x * scale / (scale + y)), 
        y: (-z * scale / (scale + y))
    };
}

function rotateX3DPoint(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: x,
        y: y * cos - z * sin,
        z: y * sin + z * cos
    };
}

function rotateY3DPoint(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: x * cos + z * sin,
        y: y,
        z: -x * sin + z * cos
    };
}

function rotateZ3DPoint(x, y, z, angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
        x: x * cos - y * sin,
        y: x * sin + y * cos,
        z: z
    };
}

function drawArrow(x, y, dx, dy, ctx, reverse = false) {
    const arrowLength = Math.sqrt(dx * dx + dy * dy);
    const headSize = 5;

    // Normalize the vector to scale arrow size
    const scale = 20 / arrowLength; // Adjust scale factor for arrow size
    const scaledDx = dx * scale;
    const scaledDy = dy * scale;

    // Draw the main line
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + scaledDx, y + scaledDy);
    ctx.stroke();

    // Draw the arrowhead
    if (reverse) {
        const angle = Math.atan2(-scaledDy, -scaledDx);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
            x - headSize * Math.cos(angle - Math.PI / 6),
            y - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x - headSize * Math.cos(angle + Math.PI / 6),
            y - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    } else {
        const angle = Math.atan2(scaledDy, scaledDx);
        ctx.beginPath();
        ctx.moveTo(x + scaledDx, y + scaledDy);
        ctx.lineTo(
            x + scaledDx - headSize * Math.cos(angle - Math.PI / 6),
            y + scaledDy - headSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
            x + scaledDx - headSize * Math.cos(angle + Math.PI / 6),
            y + scaledDy - headSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
    }
}

function getColor() {
    if (document.getElementById("theme-icon") == null) return [0,0,0];
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) return [0,0,0];
    if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) return [255,255,255];
    
}

// Rössler Attractor Parameters
class Rossler {

    constructor() {
        this.a = 0.2;
        this.b = 0.2;
        this.c = 3.2;
        this.dt = 0.035;
        this.startOpacity = 0.7;
        this.aliveTrajectories = new Array(10).fill([]).map(() => [{
            x : Math.random() * 2 - 1, 
            y : 0, 
            z : 0
        }]);
        
        this.aliveOpacities = new Array(10).fill(this.startOpacity);
        this.dyingTrajectories = [];
        this.dyingOpacities = [];
        this.width = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("width"));
        this.height = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("height"));
        this.xshift = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("xshift"));
        this.yshift = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("yshift"));
        this.xscale = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("xscale"));
        this.yscale = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("yscale"));
    }

    updateTrajectories(trajectories) {
        trajectories = trajectories.map((traj) => {
            let xyz = traj[traj.length - 1];
            let x = xyz.x + (-xyz.y - xyz.z) * this.dt;
            let y = xyz.y + (xyz.x + this.a * xyz.y) * this.dt;
            let z = xyz.z + (this.b + xyz.z * (xyz.x - this.c)) * this.dt;
            if (traj.length > 100) {
                traj.shift();
            }
            return traj.concat({ x, y, z });
        });
        return trajectories;
    }
    drawTrajectories(trajectories, opacities,p) {
    
        // get style color
        let col = getColor(); 
    
        trajectories.forEach((trajectory,i) => {
            p.beginShape();
            p.stroke(col[0], col[1], col[2], p.int(opacities[i]*255));
            trajectory.forEach((xyz, j) => {
                xyz = rotateX3DPoint(xyz.x, xyz.y, xyz.z, 30 * Math.PI / 180);
                let xy = project3DPointTo2D(xyz.x, xyz.y, xyz.z);
                let x = p.map(xy.x*this.xscale+this.xshift, -30, 30, 0, this.width)
                let y = p.map(xy.y*this.yscale+this.yshift, -30, 30, 0, this.height)
                p.vertex(x, y);
            })
            p.endShape();
        })
    }

}

class Circle {
    constructor() {
        this.radius = 1;
        this.width = parseFloat(document.getElementById("canvas-container-circle").getAttribute("width"));
        this.height = parseFloat(document.getElementById("canvas-container-circle").getAttribute("height"));
        this.xshift = parseFloat(document.getElementById("canvas-container-circle").getAttribute("xshift"));
        this.yshift = parseFloat(document.getElementById("canvas-container-circle").getAttribute("yshift"));
        this.xscale = parseFloat(document.getElementById("canvas-container-circle").getAttribute("xscale"));
        this.yscale = parseFloat(document.getElementById("canvas-container-circle").getAttribute("yscale"));
    }

    draw(p, circleman) {
        // get style color
        let col = getColor();

        p.beginShape();
        p.stroke(col[0], col[1], col[2], p.int(200));
        p.strokeWeight(1);
        for (let i = 0; i < 3.14*2; i+=0.01) {
            let x = p.cos(i) * this.radius;
            let y = p.sin(i) * this.radius;
            let xy = project3DPointTo2D(x, y, 10);
            x = p.map(xy.x*this.xscale+this.xshift, -30, 30, 0, this.width)
            y = p.map(xy.y*this.yscale+this.yshift, -30, 30, 0, this.height)
            p.vertex(x, y);
        }
        p.endShape();

        let point = {x: p.cos(circleman), y: p.sin(circleman)};
        let xy = project3DPointTo2D(point.x, point.y, 10);
        p.strokeWeight(10);
        p.point(
            p.map(xy.x*this.xscale+this.xshift, -30, 30, 0, this.width),
            p.map(xy.y*this.yscale+this.yshift, -30, 30, 0, this.height)
        );

    }
}

const circleAnimation = (p) => {
    let circle = new Circle();
    let circleman = 0;
    p.setup = () => {
        let circleWidth  = parseFloat(document.getElementById("canvas-container-circle").getAttribute("width" ));
        let circleHeight = parseFloat(document.getElementById("canvas-container-circle").getAttribute("height"));
        let circleCanvas = p.createCanvas(circleWidth, circleHeight);
        circleCanvas.parent('canvas-container-circle');
        p.stroke(255);
        p.noFill();
    }

    p.draw = () => {
        p.clear();
        circle.draw(p, circleman);
        circleman += 0.03;
    }
}

const rosslerAnimation = (p) => {

    let rossler = new Rossler();
    p.setup = () => {
        let rosslerWidth  = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("width" ));
        let rosslerHeight = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("height"));
        let rosslerCanvas = p.createCanvas(rosslerWidth, rosslerHeight);
        rosslerCanvas.parent('canvas-container-rossler');
        p.stroke(255);
        p.noFill();
    }
    
    p.draw = () => {
        p.background(0);
        p.clear();
    
        rossler.dyingOpacities = rossler.dyingOpacities.map((opacity) => p.max(0,opacity - .001));
    
        // remove dead trajectories
        rossler.dyingTrajectories = rossler.dyingTrajectories.filter((traj, i) => rossler.dyingOpacities[i] > 0);
        rossler.dyingOpacities = rossler.dyingOpacities.filter((opacity) => opacity > 0);
        
        // reset a random trajectory
        if (Math.random() < 0.02) {
            // select random trajectory
            let trajectoryIndex = Math.floor(Math.random() * rossler.aliveTrajectories.length);
            // move the trajectory to the dyingTrajectories
            rossler.dyingTrajectories.push(rossler.aliveTrajectories[trajectoryIndex]);
            rossler.dyingOpacities.push(.7);
            // reset trajectory
            rossler.aliveTrajectories[trajectoryIndex] = [{
                x : Math.random() * 2 - 1, 
                y : Math.random() * 2 - 1, 
                z : Math.random() * 2 - 1
            }];
        }
    
        // update the system
        rossler.aliveTrajectories = rossler.updateTrajectories(rossler.aliveTrajectories);
        rossler.dyingTrajectories = rossler.updateTrajectories(rossler.dyingTrajectories);
    
        // draw the aliveTrajectories
        rossler.drawTrajectories(rossler.aliveTrajectories, rossler.aliveOpacities,p);
        rossler.drawTrajectories(rossler.dyingTrajectories, rossler.dyingOpacities,p);
    
    
    }
}


function flow() {
    const canvas = document.getElementById("flow");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // define curve
    let curve = (x,t) => {return x*Math.exp(2*t)};

    // for some initializations
    
    for (let x = 0; x <= 1; x+=0.1) {
        // get points on curve
        let points = []
        for (let t = 0; t <= 2.5; t+=0.01) {
            points.push({t:t,x:curve(x,t)});
        }

        // scale and shift
        points = points.map((point) => {
            return {
                t: point.t*120 + 30,
                x: -point.x + 180 
            };
        });

        // plot curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].t, points[i].x);
        }
        ctx.stroke();
    }

    // text x,t |-> x*e^2t
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("x,t ↦ x·exp(2t)", 100, 30);
}

function autonomous() {
    const canvas = document.getElementById("autonomous");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // plot differential equation dx/dt = 2x with dt = 0.01
    
    for (let x = 0; x <= 1; x+=0.1) {
        let points = [];
        let z = x;
        for (let t = 0; t <= 2.5; t+=0.01) {
            points.push({t:t,x:z});
            z = z + 2*z*0.01;
        }

        // scale and shift
        points = points.map((point) => {
            return {
                t: point.t*120 + 30,
                x: -point.x + 180 
            };
        });

        // plot curve
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].t, points[i].x);
        }
        ctx.stroke();
    }

    // text dx/dt = 2x
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("dx/dt = 2x", 100, 30);
}


new p5(rosslerAnimation);
new p5(circleAnimation);
flow();
autonomous();
