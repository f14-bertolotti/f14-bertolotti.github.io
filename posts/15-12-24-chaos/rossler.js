// Rössler Attractor Parameters
let a = 0.2;
let b = 0.2;
let c = 3.2;
let dt = 0.035;

let aliveTrajectories = new Array(10).fill([]).map(() => [{
    x : Math.random() * 2 - 1, 
    y : 0, 
    z : 0
}]);

let aliveOpacities = new Array(10).fill(.5);
let dyingTrajectories = [];
let dyingOpacities = [];

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

function updateTrajectories(trajectories) {
    trajectories = trajectories.map((traj) => {
        let xyz = traj[traj.length - 1];
        let x = xyz.x + (-xyz.y - xyz.z) * dt;
        let y = xyz.y + (xyz.x + a * xyz.y) * dt;
        let z = xyz.z + (b + xyz.z * (xyz.x - c)) * dt;
        if (traj.length > 100) {
            traj.shift();
        }
        return traj.concat({ x, y, z });
    });
    return trajectories;
}

function drawTrajectories(trajectories, opacities) {

    // get style color
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
        col = [0,0,0];
    } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
        col = [255,255,255];
    }

    let xshift = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("xshift"));
    let yshift = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("yshift"));
    let xscale = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("xscale"));
    let yscale = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("yscale"));

    trajectories.forEach((trajectory,i) => {
        beginShape();
        stroke(col[0], col[1], col[2], int(opacities[i]*255));
        trajectory.forEach((xyz, j) => {
            xyz = rotateX3DPoint(xyz.x, xyz.y, xyz.z, 30 * Math.PI / 180);
            xy = project3DPointTo2D(xyz.x, xyz.y, xyz.z);
            x = map(xy.x*xscale+xshift, -30, 30, 0, width)
            y = map(xy.y*yscale+yshift, -30, 30, 0, height)
            vertex(x, y);
        })
        endShape();
    })
}

function setup() {
    let width  = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("width"));
    let height = parseFloat(document.getElementById("canvas-container-rossler").getAttribute("height"));
    let canvas = createCanvas(width, height);
    canvas.parent('canvas-container-rossler');
    stroke(255);
    noFill();
}

function draw() {
    background(0);
    clear();

    dyingOpacities = dyingOpacities.map((opacity) => max(0,opacity - .001));

    // remove dead trajectories
    dyingTrajectories = dyingTrajectories.filter((traj, i) => dyingOpacities[i] > 0);
    dyingOpacities = dyingOpacities.filter((opacity) => opacity > 0);
    
    // reset a random trajectory
    if (Math.random() < 0.02) {
        // select random trajectory
        let trajectoryIndex = Math.floor(Math.random() * aliveTrajectories.length);
        // move the trajectory to the dyingTrajectories
        dyingTrajectories.push(aliveTrajectories[trajectoryIndex]);
        dyingOpacities.push(1);
        // reset trajectory
        aliveTrajectories[trajectoryIndex] = [{
            x : Math.random() * 2 - 1, 
            y : Math.random() * 2 - 1, 
            z : Math.random() * 2 - 1
        }];
    }

    // update the system
    aliveTrajectories = updateTrajectories(aliveTrajectories);
    dyingTrajectories = updateTrajectories(dyingTrajectories);

    // draw the aliveTrajectories
    drawTrajectories(aliveTrajectories, aliveOpacities);
    drawTrajectories(dyingTrajectories, dyingOpacities);

}
