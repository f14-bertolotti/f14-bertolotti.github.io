/*
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

function setup() {
    let width  = parseFloat(document.getElementById("canvas-container-circle").getAttribute("width"));
    let height = parseFloat(document.getElementById("canvas-container-circle").getAttribute("height"));
    let canvas = createCanvas(width, height);
    canvas.parent('canvas-container-circle');
    stroke(255);
    noFill();
}

function draw() {
    background(0);
    clear();
        
    //draw circle
    beginShape();
    stroke(255);
    for (let i = 0; i < TWO_PI; i+=0.01) {
        let x = cos(i) * 1;
        let y = sin(i) * 1;
        let xy = project3DPointTo2D(x, y, 0);
        vertex(width/2 + xy.x, height/2 + xy.y);
    }
    endShape(CLOSE);

}
*/
