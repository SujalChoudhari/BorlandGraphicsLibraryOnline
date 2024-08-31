const templates: any[] = [{
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

    `,
    name: "Basic"
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

// Draw a Rectangle
let left = originX - 50;
let top = originY - 30;
let right = originX + 50;
let bottom = originY + 30;
setcolor(RED);
rectangle(left, top, right, bottom);
    `,
    name: 'Rectangle'
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

// Draw a Filled Circle
let centerX = originX;
let centerY = originY;
let radius = 50;
setfillstyle(SOLID_FILL, BLUE);
circle(centerX, centerY, radius);
setcolor(BLUE);
circle(centerX, centerY, radius);
    `,
    name: 'Filled Circle'
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

// Draw a Triangle
let x1 = originX;
let y1 = originY - 50;
let x2 = originX - 50;
let y2 = originY + 50;
let x3 = originX + 50;
let y3 = originY + 50;
setfillstyle(SOLID_FILL,RED);
fillpoly(3, [x1, y1, x2, y2, x3, y3]);

    `,
    name: 'Triangle'
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

// Draw an Ellipse
let centerX = originX;
let centerY = originY;
let xRadius = 60;
let yRadius = 40;
setcolor(MAGENTA);
ellipse(centerX, centerY, 0, 360, xRadius, yRadius);
    `,
    name: 'Ellipse'
}, {
    code: `
let originX = maxX / 2;
let originY = maxY / 2;

// Draw Bar Chart
let barWidth = 40;
let barSpacing = 10;
let values = [100, 150, 200, 250];
setfillstyle(SOLID_FILL, YELLOW);
for (let i = 0; i < values.length; i++) {
    let left = originX - (values.length * (barWidth + barSpacing)) / 2 + i * (barWidth + barSpacing);
    let top = originY - values[i] / 2;
    let right = left + barWidth;
    let bottom = originY + values[i] / 2;
    bar(left, top, right, bottom);
}
    `,
    name: 'Bar Chart'
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

// Draw a Spiral
let numLoops = 100;
let maxRadius = 300;
let step = 2;
let angleStep = 0.1;
setcolor(LIGHTGREEN);
for (let i = 0; i < numLoops * 2 * Math.PI; i += angleStep) {
    let radius = (i / (2 * Math.PI)) * step;
    let x = originX + radius * Math.cos(i);
    let y = originY + radius * Math.sin(i);
    putpixel(x, y, LIGHTGREEN);
}
    `,
    name: 'Spiral'
}, {
    code: `
// Draw Axis
let originX = maxX / 2;
let originY = maxY / 2;
line(0, originY, maxX, originY);
line(originX, 0, originX, maxY);

let x = 0;
let y = originY;
let step = 5;
while (true) {
    cleardevice();
    setcolor(WHITE);
    line(0, originY, maxX, originY);
    line(originX, 0, originX, maxY);
    setcolor(RED);
    line(x, y, x + 50, y + 50);
    x += step;
    if (x > maxX) {
        x = 0;
    }
    await delay(50);
}
    `,
    name: 'Moving Line'
}, {
    code: `
// Draw a Grid
let step = 50;
setcolor(LIGHTGRAY);
for (let x = 0; x < maxX; x += step) {
    line(x, 0, x, maxY);
}
for (let y = 0; y < maxY; y += step) {
    line(0, y, maxX, y);
}
    
    `,
    name: 'Grid'
}, {
    code: `
// Draw a Pattern of Circles
let radius = 25;
let spacing = 40;
setcolor(BROWN);
for (let x = 0; x < maxX + radius; x += spacing) {
    for (let y = 0; y < maxY + radius; y += spacing) {
        setcolor((x*spacing + y + 9 ) % 15)
        circle(x, y, radius);
    }
}
    `,
    name: 'Pattern of Circles'
}];

export { templates };