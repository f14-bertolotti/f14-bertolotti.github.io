function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');

    document.body.classList.toggle('dark-mode');
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) {
        document.getElementById("theme-icon").src = folder+"/"+"icons/sun.svg";

    } else if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) {
        document.getElementById("theme-icon").src = folder +"/"+ "icons/moon.svg";
    }
    draw();
}

function getColor() {
    if (document.getElementById("theme-icon") == null) return [0,0,0];
    if (document.getElementById("theme-icon").src.endsWith("icons/moon.svg")) return [0,0,0];
    if (document.getElementById("theme-icon").src.endsWith("icons/sun.svg")) return [255,255,255];
    
}

class Node {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    draw(p) {
        let color = getColor();
        p.fill(color[0], color[1], color[2]);
        p.stroke(color[0], color[1], color[2]);
        p.strokeWeight(2);
        p.circle(this.x, this.y, this.radius);
    }
}

class NodeGroup {
    constructor(x, y, radius, spacing) {
        this.node1 = new Node(x, y, radius);
        this.node2 = new Node(x + spacing, y, radius);
        this.node3 = new Node(x, y + spacing, radius);
        this.node4 = new Node(x + spacing, y + spacing, radius);
    }

    draw(p) {
        this.node1.draw(p);
        this.node2.draw(p);
        this.node3.draw(p);
        this.node4.draw(p);
    }
}

class Cluster {
    constructor(x, y, radius, spacing, clusterSpacing) {
        this.group1 = new NodeGroup(x, y, radius, spacing);
        this.group2 = new NodeGroup(x + clusterSpacing, y, radius, spacing);
        this.group3 = new NodeGroup(x + 2*clusterSpacing, y + clusterSpacing, radius, spacing);
        this.group4 = new NodeGroup(x, y + clusterSpacing, radius, spacing);
        this.group5 = new NodeGroup(x + clusterSpacing, y + clusterSpacing, radius, spacing);
        this.group6 = new NodeGroup(x + 2*clusterSpacing, y, radius, spacing);
        this.group7 = new NodeGroup(x + clusterSpacing / 2, y + clusterSpacing / 2, radius, spacing);
        this.group8 = new NodeGroup(x + 1.5 * clusterSpacing, y + clusterSpacing / 2, radius, spacing);
    }

    draw(p) {
        this.group1.draw(p);
        this.group2.draw(p);
        this.group3.draw(p);
        this.group4.draw(p);
        this.group5.draw(p);
        this.group6.draw(p);
        this.group7.draw(p);
        this.group8.draw(p);
    }
}

class Message {
    constructor(src, dst, speed=0.02) {
        this.src = src;
        this.dst = dst;
        this.progress = 0;
        this.speed = speed;
        this.alpha = 255;
    }

draw(p) {
    let color = getColor();
    p.strokeWeight(1);
    p.stroke(color[0], color[1], color[2], 255 * Math.max(0, 1 - (this.progress - 1)));
    if (this.progress <= 1) {
        let x = this.src.x + (this.dst.x - this.src.x) * this.progress;
        let y = this.src.y + (this.dst.y - this.src.y) * this.progress;
        p.line(this.src.x, this.src.y, x, y);
    } else if (this.progress <= 2) {
        p.line(this.src.x, this.src.y, this.dst.x, this.dst.y);
    }
    this.progress += this.speed;
}

}

class MessageQueue {
    constructor() {
        this.messages = [];
    }
    addMessage(message) {
        this.messages.push(message);
    }
    draw(p) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            this.messages[i].draw(p);
            if (this.messages[i].progress > 2) {
                this.messages.splice(i, 1);
            }
        }
    }
}

class Figure {

    constructor() {
        this.width  = parseFloat(document.getElementById("message-passing-container").getAttribute("width"));
        this.height = parseFloat(document.getElementById("message-passing-container").getAttribute("height"));
        this.xshift = parseFloat(document.getElementById("message-passing-container").getAttribute("xshift"));
        this.yshift = parseFloat(document.getElementById("message-passing-container").getAttribute("yshift"));
        this.xscale = parseFloat(document.getElementById("message-passing-container").getAttribute("xscale"));
        this.yscale = parseFloat(document.getElementById("message-passing-container").getAttribute("yscale"));

        this.cluster = new Cluster(150, 20, 10, 20, 200)
        this.messages = new MessageQueue();
    }

    draw(p) {
        let color = getColor();
        p.fill(color[0], color[1], color[2]);
        p.stroke(color[0], color[1], color[2]);
        p.strokeWeight(2);
        this.cluster.draw(p);

        if (Math.random() < 0.1) {
            let src = this.cluster["group" + (Math.floor(Math.random() * 8) + 1)]["node" + (Math.floor(Math.random() * 4) + 1)];
            let dst = this.cluster["group" + (Math.floor(Math.random() * 8) + 1)]["node" + (Math.floor(Math.random() * 4) + 1)];
            this.messages.addMessage(new Message(src, dst, 0.01));
        }

        this.messages.draw(p);
    }

}

const draw_canvas = (p) => {

    let canvas = new Figure();
    p.setup = () => {
        let width  = parseFloat(document.getElementById("message-passing-container").getAttribute("width" ));
        let height = parseFloat(document.getElementById("message-passing-container").getAttribute("height"));
        p.createCanvas(width, height).parent("message-passing-container");
        p.stroke(255);
        p.noFill();
    }
    
    p.draw = () => {
        p.background(0);
        p.clear();
        canvas.draw(p);
    }
}

new p5(draw_canvas);
