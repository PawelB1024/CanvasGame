
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');


let objects = [];
let missedObjects = 0;
let points = 0;
let reactionTimes = [];
let distances = [];


function getObjInt()
{
    if(document.getElementById("objIntSetCheck").checked == true)
    {
        document.getElementById("objIntSetCheck").checked = false;
        getObjInt.lastValue = document.getElementById("objInt").value;
        return document.getElementById("objInt").value;
    }
    return getObjInt.lastValue;
}
function getObjDis()
{
    if(document.getElementById("objDisSetCheck").checked == true)
    {
        document.getElementById("objDisSetCheck").checked = false;
        getObjDis.lastValue = document.getElementById("objDis").value;
        return document.getElementById("objDis").value;
    }
    return getObjDis.lastValue;
}

var objectInterval = getObjInt();


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


class GameObject {
    constructor(x, y, radius, color, isBad) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isBad = isBad;
        this.isVisible = true;
        this.clickTime = 0;
        this.distance = 0;
    }


    draw() {
        if (this.isVisible) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }


    checkClick(x, y) {
        const distance = Math.sqrt(Math.pow((x - this.x), 2) + Math.pow((y - this.y), 2));
        if (distance <= this.radius && this.isVisible) {
            if (this.isBad) {
                missedObjects++;
                points -= 2;
                this.isVisible = false;
            } else {
                points++;
                this.isVisible = false;
                this.clickTime = Date.now();
                this.distance = distance;
                reactionTimes.push(this.clickTime - this.appearTime);
                distances.push(this.distance);
            }
        }
    }


    setAppearTime(time) {
        this.appearTime = time;
    }
    setDisappearTimeout() {
        setTimeout(() => {
            if(this.isVisible)
            {
                this.isVisible = false;
                if(!this.isBad)
                {
                    points--;
                    missedObjects++;
                }
            }
        }, getObjDis());
}
}


function generateObject() {
    const x = getRandomNumber(0 + 20, canvas.width - 20);
    const y = getRandomNumber(0 + 20, canvas.height - 20);
    const radius = getRandomNumber(20, 40);
    var color = 'blue';
    const isBad = Math.random() < 0.1; 
    if (isBad)
    {
        color = 'red';
    }
    const object = new GameObject(x, y, radius, color, isBad);
    object.setAppearTime(Date.now());
    object.setDisappearTimeout(); 
    objects.push(object);


    objectInterval = getObjInt();
    setTimeout(generateObject, objectInterval);
}


function canvasClick(e) {
const rect = canvas.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
objects.forEach(object => {
    object.checkClick(x, y);
});
}


function drawScreen() {
ctx.clearRect(0, 0, canvas.width, canvas.height);
objects.forEach(object => {
    object.draw();
});


ctx.font = '20px Arial';
ctx.fillStyle = 'black';
ctx.fillText(`Przegapione obiekty: ${missedObjects}`, 10, 30);
ctx.fillText(`Punkty: ${points}`, 10, 60);
if (reactionTimes.length > 0) {
    const averageReactionTime = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    ctx.fillText(`Średni czas reakcji: ${averageReactionTime.toFixed(2)}ms`, 10, 90);
    const deviation = Math.sqrt(reactionTimes.map(x => Math.pow(x - averageReactionTime, 2)).reduce((a, b) => a + b, 0) / reactionTimes.length);
    ctx.fillText(`Odchylenie standardowe: ${deviation.toFixed(2)}ms`, 10, 120);
    const averageDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
    ctx.fillText(`Średni dystans: ${averageDistance.toFixed(2)}px`, 10, 150);
    const distanceDeviation = Math.sqrt(distances.map(x => Math.pow(x - averageDistance, 2)).reduce((a, b) => a + b, 0) / distances.length);
    ctx.fillText(`Odchylenie od dystansu: ${distanceDeviation.toFixed(2)}px`, 10, 180);
}


requestAnimationFrame(drawScreen);
}


generateObject();
drawScreen();


canvas.addEventListener('click', canvasClick);