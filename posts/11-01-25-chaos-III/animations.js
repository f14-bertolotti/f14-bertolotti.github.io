function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');

    document.body.classList.toggle('dark-mode');
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
        document.getElementById("theme-icon").src = folder+"/"+"icons/sun.svg";

    } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
        document.getElementById("theme-icon").src = folder +"/"+ "icons/moon.svg";
    }
    sink();
    source();
    curve2d();
    tangentspace();
    example();
    derivative();
    discrete();
    slope();
    sadle();
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

// Lorenz Attractor Parameters
class Rossler {

    constructor() {
        this.a = 28;
        this.b = 10;
        this.c = 8/3;
        this.dt = 0.01;
        this.startOpacity = 0.7;
        this.aliveTrajectories = new Array(10).fill([]).map(() => [{
            x : 0,
            y : Math.random() * 10 - 5, 
            z : Math.random() * 10 - 5, 
        }]);
        
        this.aliveOpacities = new Array(10).fill(this.startOpacity);
        this.dyingTrajectories = [];
        this.dyingOpacities = [];
        this.width = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("width"));
        this.height = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("height"));
        this.xshift = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("xshift"));
        this.yshift = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("yshift"));
        this.xscale = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("xscale"));
        this.yscale = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("yscale"));
    }

    updateTrajectories(trajectories) {
        trajectories = trajectories.map((traj) => {
            let xyz = traj[traj.length - 1];
            let x = xyz.x + this.dt * this.a * (xyz.y - xyz.x);
            let y = xyz.y + this.dt * (xyz.x * (this.b - xyz.z) - xyz.y);
            let z = xyz.z + this.dt * (xyz.x * xyz.y - this.c * xyz.z);
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
                let xy = {x: xyz.x, y: -xyz.z};
                let x = p.map(xy.x*this.xscale+this.xshift, -30, 30, 0, this.width)
                let y = p.map(xy.y*this.yscale+this.yshift, -30, 30, 0, this.height)
                p.vertex(x, y);
            })
            p.endShape();
        })
    }

}

const lorenzAnimation = (p) => {

    let lorenz = new Rossler();
    p.setup = () => {
        let lorenzWidth  = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("width" ));
        let lorenzHeight = parseFloat(document.getElementById("canvas-container-lorenz").getAttribute("height"));
        let lorenzCanvas = p.createCanvas(lorenzWidth, lorenzHeight);
        lorenzCanvas.parent('canvas-container-lorenz');
        p.stroke(255);
        p.noFill();
    }
    
    p.draw = () => {
        p.background(0);
        p.clear();
    
        lorenz.dyingOpacities = lorenz.dyingOpacities.map((opacity) => p.max(0,opacity - .002));
    
        // remove dead trajectories
        lorenz.dyingTrajectories = lorenz.dyingTrajectories.filter((traj, i) => lorenz.dyingOpacities[i] > 0);
        lorenz.dyingOpacities = lorenz.dyingOpacities.filter((opacity) => opacity > 0);
        
        // reset a random trajectory
        if (Math.random() < 0.075) {
            // select random trajectory
            let trajectoryIndex = Math.floor(Math.random() * lorenz.aliveTrajectories.length);
            // move the trajectory to the dyingTrajectories
            lorenz.dyingTrajectories.push(lorenz.aliveTrajectories[trajectoryIndex]);
            lorenz.dyingOpacities.push(.7);
            // reset trajectory
            lorenz.aliveTrajectories[trajectoryIndex] = [{
                x : 0, 
                y : Math.random() * 4 - 2, 
                z : Math.random() * 4 - 2
            }];
        }
    
        // update the system
        lorenz.aliveTrajectories = lorenz.updateTrajectories(lorenz.aliveTrajectories);
        lorenz.dyingTrajectories = lorenz.updateTrajectories(lorenz.dyingTrajectories);
    
        // draw the aliveTrajectories
        lorenz.drawTrajectories(lorenz.aliveTrajectories, lorenz.aliveOpacities,p);
        lorenz.drawTrajectories(lorenz.dyingTrajectories, lorenz.dyingOpacities,p);
    
    
    }
}

function sink() {
    const canvas = document.getElementById("sink");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;
    const spacing = 30; // Distance between arrows
    for (let x = -spacing; x < canvas.width; x += spacing) {
        for (let y = -spacing; y < canvas.height; y += spacing) {
            if (Math.abs(165-x) > 30 || Math.abs(90-y) > 10) {
                drawArrow(x, y, 165-x, 90-y, ctx, reverse = false);
            } 
        }
    }
}

function source() {
    const canvas = document.getElementById("source");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;
    const spacing = 30; // Distance between arrows
    for (let x = -spacing; x < canvas.width; x += spacing) {
        for (let y = -spacing; y < canvas.height; y += spacing) {
            if (Math.abs(165-x) > 30 || Math.abs(90-y) > 10) {
                drawArrow(x, y, 165-x, 90-y, ctx, reverse = true);
            } 
        }
    }
}

function tangent() {
    const canvas = document.getElementById("tangent-space");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;
    // draw a circle
    ctx.beginPath();
    ctx.arc(100, 100, 50, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    // draw tangent line
    ctx.beginPath();
    ctx.moveTo(0, 105);
    ctx.lineTo(16, 0);
    ctx.closePath();
    ctx.stroke();
}

function curve2d() {
    const canvas = document.getElementById("curve2d");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    curve  = (t) => {return {x: t, y: Math.cos(t/20) * 20 - t / 10 + 60}};
    dcurve = (t) => {return {x: 1, y: -Math.sin(t/20) - 1/10}}

    // draw curve
    ctx.beginPath();
    for (let t = 0; t <= 350; t += 0.01) {
        let xy = curve(t);
        ctx.lineTo(xy.x, xy.y);
    }
    ctx.stroke();

    // draw tangent lines
    for (let t = 0; t <= 350; t += 30) {
        let xy = curve(t);
        let dxy = dcurve(t);
        ctx.beginPath();
        ctx.fill();
        drawArrow(xy.x, xy.y, dxy.x, dxy.y, ctx, reverse = false);
    }
    
}

function tangentspace() {
    const canvas = document.getElementById("tangentspace");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // draw grid
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.3)`;
    for (let x = 30; x <= 350; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 300);
        ctx.stroke();
    }
    for (let y = 30; y <= 299; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(350, y);
        ctx.stroke();
    }

    // draw x-axis
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},.9)`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(350, 150);
    ctx.stroke();

    // draw x-axis tip
    ctx.beginPath();
    ctx.moveTo(350, 150);
    ctx.lineTo(340, 145);
    ctx.stroke();

    // draw y-axis
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(180, 300);
    ctx.stroke();

    // draw y-axis tip
    ctx.beginPath();
    ctx.moveTo(180, 0);
    ctx.lineTo(175, 10);
    ctx.stroke();

    ctx.fillText("(0,0)", 155, 165);

    // draw tangent x-axis
    ctx.strokeStyle = "rgba(0, 200, 0)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 90);
    ctx.lineTo(350, 90);
    ctx.stroke();

    // draw tangent x-axis tip
    ctx.beginPath();
    ctx.moveTo(350, 90);
    ctx.lineTo(340, 85);
    ctx.stroke();

    // draw tangent y-axis
    ctx.beginPath();
    ctx.moveTo(240, 0);
    ctx.lineTo(240, 300);
    ctx.stroke();

    // draw tangent y-axis tip
    ctx.beginPath();
    ctx.moveTo(240, 0);
    ctx.lineTo(235, 10);
    ctx.stroke();


    ctx.fillText("(1,1)", 215, 105);
}

function curve3d(name="sphere") {
    const canvas = document.getElementById(name);
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // define curve
    const a = .2;
    curve = (t) => {return {
        x : Math.cos(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        y : Math.sin(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        z : -(a * t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2))
    }};

    // get points on curve
    let points = []
    const numPoints = 200;
    for (let i = -30; i <= 30; i+=0.1) {
        const t = i;
        points.push(curve(t));
    }

    // scale and shift
    points = points.map((point) => {
        return {
            x: point.x * 100 + 550,
            y: point.y * 100 + 425,
            z: point.z * 100 + 200
        };
    });

    points = points.map((point) => rotateX3DPoint(point.x, point.y, point.z, 45 * Math.PI / 180));

    // draw curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // draw line
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(150, 250);
    ctx.stroke();


    ctx.font = "30px Latin Modern Math";  // Set the font size and family
    ctx.fillText("𝓜", 100+10, 50);

    ctx.font = "30px Latin Modern Math";  // Set the font size and family
    ctx.fillText("𝓝", 450, 50);

}

function example() {
    curve3d("example");

    const canvas = document.getElementById("example");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;
    
    // draw real line
    let y = 550;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(300, y);
    ctx.stroke();

    // draw right tip
    ctx.beginPath();
    ctx.moveTo(300, y);
    ctx.lineTo(290, y-10);
    ctx.stroke();

    // draw left tip
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(60, y+10);
    ctx.stroke();

    // draw center 
    ctx.beginPath();
    ctx.moveTo(175, y-5);
    ctx.lineTo(175, y+5);
    ctx.stroke();

    // text 0
    ctx.font = "16px Latin Modern Math"; 
    ctx.fillText("0", 171, y+20);

    // R text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("ℝ", 300, y+20);



    // draw 2d euclidean space

    // draw x-axis
    ctx.beginPath();
    let dx = -20;
    ctx.moveTo(450+dx, y);
    ctx.lineTo(700+dx, y);
    ctx.stroke();

    // draw x-axis tip
    ctx.beginPath();
    ctx.moveTo(700+dx, y);
    ctx.lineTo(690+dx, y-10);
    ctx.stroke();

    // draw y-axis
    ctx.beginPath();
    ctx.moveTo(575+dx, y-125);
    ctx.lineTo(575+dx, y+125);
    ctx.stroke();

    // draw y-axis tip
    ctx.beginPath();
    ctx.moveTo(575+dx, y-125);
    ctx.lineTo(565+dx, y-115);
    ctx.stroke();

   // R^2 text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("ℝ²", 670+dx, y-100);

    // draw let-to-right arrow
    ctx.beginPath();
    ctx.moveTo(170, y-400);
    ctx.lineTo(410, y-400);
    ctx.stroke();

    // draw left-to-right tip
    ctx.beginPath();
    ctx.moveTo(410, y-400);
    ctx.lineTo(400, y-410);
    ctx.stroke();

    // f text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("𝑓", 280, y-410);

    // top-to-bottom (left) arrow
    let dy = -20
    ctx.beginPath();
    ctx.moveTo(150, y-250+dy);
    ctx.lineTo(150, y-120+dy);
    ctx.stroke();

    // top-to-bottom (left) tip
    ctx.beginPath();
    ctx.moveTo(150, y-120+dy);
    ctx.lineTo(140, y-130+dy);
    ctx.stroke();

    // bottom-to-top (left) arrow
    ctx.beginPath();
    ctx.moveTo(170, y-250+dy);
    ctx.lineTo(170, y-120+dy);
    ctx.stroke();

    // bottom-to-top (left) tip
    ctx.beginPath();
    ctx.moveTo(170, y-250+dy);
    ctx.lineTo(180, y-240+dy);
    ctx.stroke();

    // phi text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("𝜙", 130, y-170+dy);

    // phi^-1 text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("𝜙⁻¹", 180, y-170+dy);

    // top-to-bottom (left) arrow
    dx = +390;
    ctx.beginPath();
    ctx.moveTo(150+dx, y-250+dy);
    ctx.lineTo(150+dx, y-120+dy);
    ctx.stroke();

    // top-to-bottom (left) tip
    ctx.beginPath();
    ctx.moveTo(150+dx, y-120+dy);
    ctx.lineTo(140+dx, y-130+dy);
    ctx.stroke();

    // bottom-to-top (left) arrow
    ctx.beginPath();
    ctx.moveTo(170+dx, y-250+dy);
    ctx.lineTo(170+dx, y-120+dy);
    ctx.stroke();

    // bottom-to-top (left) tip
    ctx.beginPath();
    ctx.moveTo(170+dx, y-250+dy);
    ctx.lineTo(180+dx, y-240+dy);
    ctx.stroke();

    // psi text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("𝜓", 130+dx, y-170+dy);

    // psi^-1 text
    ctx.font = "20px Latin Modern Math";
    ctx.fillText("𝜓⁻¹", 180+dx, y-170+dy);




    // draw curve from top
    // define curve
    const a = .2;
    curve = (t) => {return {
        x : Math.cos(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        y : Math.sin(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        z : -(a * t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2))
    }};

    // get points on curve
    let points = []
    const numPoints = 200;
    for (let i = -30; i <= 30; i+=0.1) {
        const t = i;
        points.push(curve(t));
    }

    // stereo projection
    points = points.map((point) => {
        return {
            x: point.x / (1 - point.z) * 8 + 555,
            y: point.y / (1 - point.z) * 8 + 550,
        };
    });


    // draw curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
}

function derivative() {
    const canvas = document.getElementById("derivative");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // define curve
    const a = .2;
    curve = (t) => {return {
        x : Math.cos(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        y : Math.sin(t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)),
        z : -(a * t) / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2))
    }};
                
    dcurve = (t) => {return {
        x : (-1 - a * t / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2))) * (-a * Math.cos(t) + Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)) * Math.sin(t)),
        y : (+1 + a * t / Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2))) * (Math.sqrt(1 + Math.pow(a,2) * Math.pow(t,2)) * Math.cos(t) + a * Math.sin(t)),
    }}

    // get points on curve
    let points = []
    let dpoints = []
    const numPoints = 200;
    for (let i = -30; i <= 30; i+=0.1) {
        const t = i;
        points.push(curve(t));
        dpoints.push(dcurve(t));
    }

    // stereo projection
    points = points.map((point) => {
        return {
            x: point.x / (1 - point.z) * 8 + 175,
            y: point.y / (1 - point.z) * 8 + 100,
        };
    });


    // draw curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // draw arrows
    for (let i = 0; i < dpoints.length - 350; i+=10) {
        let xy = points[i];
        let dxy = dpoints[i];
        drawArrow(xy.x, xy.y, dxy.x, dxy.y, ctx, reverse = false);
    }

}

function discrete() {
    const canvas = document.getElementById("discrete");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // define curve
    let curve = (x) => {return 2*x*(1-x)};
    let lin   = (x) => {return x};

    // for some initializations
    
    // get points on curve
    let points = []
    let points2 = []
    for (let x = -1; x <= 1.5; x+=0.02) {
        points.push({x:x,y:curve(x)});
        points2.push({x:x,y:lin(x)});
    }

    // scale and shift
    let scalex = 200;
    let scaley = 150;
    let shiftx = 75;
    let shifty = 100;
    points = points.map((point) => {
        return {
            x: point.x*scalex + shiftx,
            y: -point.y*scaley + shifty 
        };
    });
    points2 = points2.map((point) => {
        return {
            x: point.x*scalex + shiftx,
            y: -point.y*scaley + shifty
        };
    });

    // draw x axis
    ctx.beginPath();
    ctx.moveTo(0, 199);
    ctx.lineTo(350, 199);
    ctx.stroke();

    // drwa x axis tip
    ctx.beginPath();
    ctx.moveTo(350, 199);
    ctx.lineTo(340, 194);
    ctx.stroke();

    // draw y axis
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(1, 200);
    ctx.stroke();

    // draw y axis tip
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(6, 10);
    ctx.stroke();

    // plot curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // plot curve
    ctx.beginPath();
    ctx.moveTo(points2[0].x, points2[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points2[i].x, points2[i].y);
    }
    ctx.stroke();

    // text y = x
    ctx.font = "16px Latin Modern Math";
    ctx.fillText("y=x", 210, 15);

    // text y=2x(1−x)
    ctx.font = "16px Latin Modern Math";
    ctx.fillText("y=2x(1−x)", 180, 100);

}

function slope() {
    const canvas = document.getElementById("slope");
    const ctx = canvas.getContext("2d");

    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;

    // define curve
    let curve = (x) => {return 2*x*(1-x)};
    let lin   = (x) => {return 2*x};

    // get points on curve
    let points = []
    let points2 = []
    for (let x = -1; x <= 1.5; x+=0.02) {
        points.push({x:x,y:curve(x)});
        points2.push({x:x,y:lin(x)});
    }
    // scale and shift
    let scalex = 200;
    let scaley = 150;
    let shiftx = 75;
    let shifty = 100;

    // draw x axis
    ctx.beginPath();
    ctx.moveTo(0, 199);
    ctx.lineTo(350, 199);
    ctx.stroke();

    // drwa x axis tip
    ctx.beginPath();
    ctx.moveTo(350, 199);
    ctx.lineTo(340, 194);
    ctx.stroke();

    // draw y axis
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(1, 200);
    ctx.stroke();

    // draw y axis tip
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(6, 10);
    ctx.stroke();

    points = points.map((point) => {
        return {
            x: point.x*scalex + shiftx,
            y: -point.y*scaley + shifty 
        };
    });
    points2 = points2.map((point) => {
        return {
            x: point.x*scalex + shiftx,
            y: -point.y*scaley + shifty
        };
    });
    console.log(points)

    // plot curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // plot curve
    ctx.beginPath();
    ctx.moveTo(points2[0].x, points2[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points2[i].x, points2[i].y);
    }
    ctx.stroke();

    // draw dashed veritical line at x = 0
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(75, 200);
    ctx.lineTo(75, curve(0)*scaley + shifty);
    ctx.stroke();

    // draw dashed horizontal line at y = f(0)
    ctx.beginPath();
    ctx.moveTo(0, curve(0)*scaley + shifty);
    ctx.lineTo(75, curve(0)*scaley + shifty);
    ctx.stroke();

    // draw dashed vertival line at x = 0 + dx
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(100, curve(1.12)*scaley + shifty);
    ctx.stroke();
    
    // draw dashed horizontal line at y = f(0 + dx)
    ctx.beginPath();
    ctx.moveTo(0, curve(1.12)*scaley + shifty);
    ctx.lineTo(100, curve(1.12)*scaley + shifty);
    ctx.stroke();

    // text dx
    ctx.font = "16px Latin Modern Math";
    ctx.fillText("dx", 78, 190);

    // text dy
    ctx.font = "16px Latin Modern Math";
    ctx.fillText("dy", 10, 85);

}

function sadle() {
    const canvas = document.getElementById("sadle");
    const ctx = canvas.getContext("2d");
    let color = getColor();
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},0.7)`;
    ctx.lineWidth = 1.5;
    const spacing = 30; // Distance between arrows
    for (let x = -canvas.width/2 -spacing +25; x < canvas.width/2 + spacing; x += spacing) {
        for (let y = -canvas.height/2 -spacing +10; y < canvas.height/2; y += spacing) {
                drawArrow(x+canvas.width/2, y+canvas.height/2, -x, y, ctx, reverse = false);
        }
    }
}

new p5(lorenzAnimation);
source();
sink();
curve2d();
tangentspace();
example();
derivative();
discrete();
slope();
sadle();
