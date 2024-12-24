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
        let col = [0,0,0];
        if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
            col = [0,0,0];
        } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
            col = [255,255,255];
        }
    
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
        let col = [0,0,0];
        if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
            col = [0,0,0];
        } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
            col = [255,255,255];
        }

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

new p5(rosslerAnimation);
new p5(circleAnimation);
