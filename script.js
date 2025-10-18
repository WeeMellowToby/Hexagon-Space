//the radius of each hexagon
const tileRadius = 25;
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d")
const worldWidth = 10;
const worldHeight = 10
//commonly used constants, saves on computation time
const ROOT3 = Math.sqrt(3);
//get the points on a hexagon with the center x and y
function GetVertexPoints(hX, hY) {
    let points = []
    for (let i = 0; i < 6; i++) {
        let angle = ((Math.PI * 2) / 6) * i;
        let pX = hX + Math.cos(angle) * tileRadius;
        let pY = hY + Math.sin(angle) * tileRadius;
        points.push([pX, pY])
    }
    return points;
}
//Generate an array of points which are the centers of hexagons, sX is the start pos, sY is the end pos
function GenerateCenters(sX, sY, width, height) {
    let centers = []
    for (let i = 0; i < height; i++) {

        for (let j = 0; j < width; j++) {
            let y = sY + (ROOT3 * tileRadius * i) + (ROOT3 * tileRadius * (0.5 * (j % 2)));
            let x = sX + (1.5 * j * tileRadius);
            centers.push([x, y])
        }
    }
    return centers;
}
//renders a hexagon given the points
//vR is the radius of a circle generated at the point lW is the width of the line 
function RenderHexagon(points, lW = 2, vR = 0) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.stroke();
}


//draw and label hexagons
let idx = 0;
GenerateCenters(25, 25, worldWidth, worldHeight).forEach((center) => {
    ctx.font = "14px sans serif";
    ctx.fillText(idx, center[0], center[1]);
    const hexPoints = GetVertexPoints(center[0], center[1]);
    RenderHexagon(hexPoints)
    idx++;
})