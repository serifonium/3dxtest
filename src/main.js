var canvas = document.getElementById("myCanvas")
var ctx = canvas.getContext("2d");
var ctx2 = canvas.getContext("2d");
ctx.textAlign = "center";
ctx.font = "Arial 10px";

var FPS = 60
var FOV = 120*(Math.PI/180)
var ResolutionRatio = window.innerHeight/window.innerWidth

var objects = []

function print(a) {
    console.log(a)
}

var keys = {}

var camera = {
    pos:v3(0, 0, 0),
    angle:v3(toRad(0), toRad(0), toRad(0))
}


document.addEventListener('keydown', (e)=>{
    keys[e.key.toLowerCase()]=true
})
document.addEventListener('keyup', (e)=>{
    keys[e.key.toLowerCase()]=false
})


class Point {
    constructor(pos, settings) {
        this.pos = pos
        this.colour = "#fff"
        this.width = 30
        for(let [key, value] of Object.entries(settings)) {
            this[key] = value
        }
    }
    render() {
        ctx.fillStyle = this.colour
        ctx.fillRect(getXPoint(this.pos)-this.width/2, 0, this.width, window.innerHeight)
    }
}
class YPoint {
    constructor(pos, settings) {
        this.pos = pos
        this.colour = "#fff"
        this.width = 30
        for(let [key, value] of Object.entries(settings)) {
            this[key] = value
        }
    }
    render() {
        ctx.fillStyle = this.colour
        ctx.fillRect(0, getZPoint(this.pos)-this.width/2, window.innerWidth, this.width)
    }
}


class Plane {
    constructor(pos1, pos2) {
        this.pos1 = pos1
        this.pos2 = pos2
        this.colour = "#fff"
    }
    render() {
        ctx.fillStyle = this.colour
        ctx.fillRect(getXPoint(this.pos1), 0, Math.abs(getXPoint(this.pos1)-getXPoint(this.pos2)), window.innerHeight)
    }
}

class Circle {
    constructor(pos) {
        this.pos = pos
        this.colour = "#fff"
    }
    render() {
        ctx.fillStyle = this.colour
        ctx.arc(getXPoint(this.pos), getZPoint(this.pos), 5, 0, Math.PI*2)
        ctx.fill()
    }
}

//objects.push(new Plane(v(1,4), v(2,4)))
// objects.push(new Point(v(-1,1), {"colour": "#00f", "width": 5}))
// objects.push(new Point(v(-0.5,1), {"colour": "#40a", "width": 5}))
objects.push(new Point(v(0,1), {"colour": "#707", "width": 5}))
// objects.push(new Point(v(0.5,1), {"colour": "#a04", "width": 5}))
// objects.push(new Point(v(1,1), {"colour": "#f00", "width": 5}))
//objects.push(new YPoint(v3(0,1,0), {"colour": "#0f0", "width": 5}))
objects.push(new Circle(v3(0,1,0)))



function angleXTransform(pos, angle) {
    let newAngle = fetchAngle(v(0, 0), pos) + toRad(angle)
    let dist = getDistance(v(0, 0), pos)
    let newCoords = v(dist*Math.cos(newAngle), dist*Math.sin(newAngle))
    return newCoords
}

function getXPoint(coordss) {
    let coords = v(0, 0)
    coords.x = coordss.x + camera.pos.x
    coords.y = coordss.y + camera.pos.y
    coords = angleXTransform(coords, camera.angle.x)
    let triAngle = Math.PI/2-FOV/2
    let minX = coords.y/Math.tan(triAngle)
    let maxX = -coords.y/Math.tan(triAngle)
    let pointX = coords.x
    let X = ((maxX-pointX)/(maxX-minX))
    X = X/coords.y 
    console.log(coords.y*(1-X))
    TX = X*window.innerWidth
    
    return TX
}

function getZPoint(coordss) {
    let coords = v3(0, 0, 0)
    coords.x = coordss.x + camera.pos.x
    coords.y = coordss.y + camera.pos.y
    coords.z = coordss.z + camera.pos.z
    //coords = angleTransform(coords, camera.angle.y)
    let triAngle = Math.PI/2-FOV/2
    let minZ = -Math.tan(triAngle)/coords.y
    let maxZ = Math.tan(triAngle)/coords.y
    let pointZ = coords.z
    //console.log(maxZ,pointZ,minZ,coordss,)
    //console.log((maxZ-pointZ)/(maxZ-minZ))
    let Y = ((maxZ-pointZ)/(maxZ-minZ))*window.innerHeight
    return Y
}

function render() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    ResolutionRatio = window.innerHeight/window.innerWidth

    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

    ctx.fillStyle = "#fff"
    ctx.fillText(`Camera: x:${camera.pos.x}, y:${camera.pos.y}, angleX:${camera.angle.x}`, 0, 30)

    objects.forEach((obj)=>{obj.render()})
}
var speed = 3
function update() {
    function move(a) {
        camera.pos.x += Math.cos(toRad(a))*speed/FPS
        camera.pos.y += Math.sin(toRad(a))*speed/FPS
    }
    //console.log(camera.pos)
    if(keys["a"]) {move(0+camera.angle.x)}
    if(keys["d"]) {move(180+camera.angle.x)}
    if(keys["w"]) {move(270+camera.angle.x)}
    if(keys["s"]) {move(90+camera.angle.x)}
    if(keys[" "]) {camera.pos.z += -speed/FPS}
    if(keys["shift"]) {camera.pos.z += speed/FPS}
    if(keys["arrowleft"]) {camera.angle.x += -toRad(90)}
    if(keys["arrowright"]) {camera.angle.x += toRad(90)}
}

setInterval(render, 1000/FPS)
setInterval(update, 1000/FPS)