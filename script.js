//the radius of each hexagon
const tileRadius = 25;
const canvas = document.getElementById("Canvas");
const ctx = canvas.getContext("2d")
const worldWidth = 40;
const worldHeight = 15
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
function RenderHexagon(points, lW = 2, vR = 0, fillStyle = "rgba(0, 91, 139, 1)") {
    ctx.fillStyle = fillStyle;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.lineTo(points[0][0], points[0][1]);
    ctx.fill();
}
//returns the borders of the hexagon, clockwise, starting from the top
function GetBorders(hexID) {
    const x = hexID % worldWidth;
    const y = Math.floor(hexID / worldWidth);
    const borders = [];
    //horizontal offsets are different based on whether the hexagon has an odd or even index
    const evenOffsets = [
        [0, -1],  // top
        [1, -1],  // top-right
        [1, 0],   // bottom-right
        [0, 1],   // bottom
        [-1, 0],  // bottom-left
        [-1, -1], // top-left
    ];
    const oddOffsets = [
        [0, -1],  // top
        [1, 0],   // top-right
        [1, 1],   // bottom-right
        [0, 1],   // bottom
        [-1, 1],  // bottom-left
        [-1, 0],  // top-left
    ];
    const offsets = (x % 2 === 0) ? evenOffsets : oddOffsets;

    for (const [dx, dy] of offsets) {
        const nx = x + dx;
        const ny = y + dy;

        if (nx >= 0 && nx < worldWidth && ny >= 0 && ny < worldHeight) {
            const neighborID = ny * worldWidth + nx;
            borders.push(neighborID);
        }
    }

    return borders;
}

//implementation of Dijkstra's algorithm to get from 1 hexagon to another.
function Dijkstra(sID, eID) {
    let route = [];
    let queue = [sID];
    const visited = new Set();
    const fastest = {}
    while (queue.length > 0) {
        const current = queue.shift()
        if (current == eID) {
            break;
        }
        const borders = GetBorders(current);
        for (let i = 0; i < borders.length; i++) {
            if (!visited.has(borders[i]) && !queue.includes(borders[i])) {
                queue.push(borders[i]);
                fastest[borders[i]] = current;
            }
        }
        visited.add(current);
    }
    if (fastest[eID]) {
        let currentNode = fastest[eID];
        route.push(eID);
        route.push(currentNode);
        while (currentNode != sID) {
            currentNode = fastest[currentNode];
            route.push(currentNode);
        }
    }
    route.reverse()
    return route;
}

//draw and label hexagons
let idx = 0;
let hexCenters = GenerateCenters(25, 25, worldWidth, worldHeight)
hexCenters.forEach((center) => {
    const hexPoints = GetVertexPoints(center[0], center[1]);
    RenderHexagon(hexPoints)
    ctx.fillStyle = "black";
    ctx.font = "14px sans serif";
    ctx.fillText(idx, center[0] - (String(idx).length * 3), center[1] + 3);
    idx++;
})
let route = Dijkstra(0, 593)
for (let i = 0; i < route.length; i++) {
    RenderHexagon(GetVertexPoints(hexCenters[route[i]][0], hexCenters[route[i]][1]), 2, 0, "rgba(100, 0, 0, 0.5)");
}