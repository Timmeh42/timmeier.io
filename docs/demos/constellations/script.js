function onResize(e) {
    const el = e[0];
    console.log(
        `${el.contentRect.width} x ${el.contentRect.height}`
    );
    cWidth = Math.floor(el.contentRect.width * dpiScale);
    cHeight = Math.floor(el.contentRect.height * dpiScale);
    cCanvas.width = cWidth;
    cCanvas.height = cHeight;

    quads = generateQuads();
    placeStars(stars, quads);
}

function renderConstellations(timestamp) {
    const startTime = Date.now();
    if (prevTime === 0) {
        prevTime = timestamp - 1;
    }
    // if previous frame was too far in the past (eg when tab was in background), limit dt to 1 second
    const dt = Math.min((timestamp - prevTime) / 1000, 1);
    prevTime = timestamp;

    // update star positions and move them to the correct quad if needed
    for (let qx = quadsW - 1; qx >= 0; qx--) {
        for (let qy = quadsH - 1; qy >= 0; qy--) {
            const quad = quads[qx][qy];
            const freshStars = [];
            for (let s = 0; s < quad.stars.length; s++) {
                const star = quad.stars[s];
                if (star.lastupdate !== timestamp) {
                    star.lastupdate = timestamp;
                    star.x += star.dx * dt;
                    star.y += star.dy * dt;
                    // check if star is too close to mouse and move it out if true
                    if ((star.x > mX - mRadius) && (star.x < mX + mRadius) && (star.y > mY - mRadius) && (star.y < mY + mRadius)) {
                        let mDist = Math.sqrt((star.x - mX) ** 2 + (star.y - mY) ** 2);
                        if (mDist < mRadius) {
                            star.x += (star.x - mX) * (mRadius - mDist) / mRadius;
                            star.y += (star.y - mY) * (mRadius - mDist) / mRadius;
                        }
                    }
                    star.x = (quadsW * starDist + star.x) % (quadsW * starDist);
                    star.y = (quadsH * starDist + star.y) % (quadsH * starDist);
                    const nqx = Math.floor(star.x / starDist);
                    const nqy = Math.floor(star.y / starDist);
                    if (nqx === qx && nqy === qy) {
                        freshStars.push(star);
                    } else {
                        quads[nqx][nqy].stars.push(star);
                    }
                } else {
                    freshStars.push(star);
                }
            }
            quad.stars = freshStars;
        }
    }

    // draw the stars and constellations
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, cWidth, cHeight);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.setTransform(1, 0, 0, 1, -starDist, -starDist);
    for (let qx = quadsW - 1; qx >= 0; qx--) {
        for (let qy = quadsH - 1; qy >= 0; qy--) {
            const quad = quads[qx][qy];
            const localStars = quad.stars;
            const neighbourStars = [].concat(...quad.neighbours.map(q => q.stars));
            for (let s = localStars.length - 1; s >= 0; s--) {
                const star = localStars[s];
                //ctx.beginPath();
                //ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
                //ctx.strokeStyle = 'black';
                //ctx.stroke();
                for (let s2 = s - 1; s2 >= 0; s2--) {
                    const star2 = localStars[s2];
                    let dist = Math.sqrt((star.x - star2.x) ** 2 + (star.y - star2.y) ** 2);
                    if (dist < starDist) {
                        ctx.lineWidth = ((starDist - dist) / starDist);
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(star2.x, star2.y);
                        ctx.stroke();
                    }
                }
                for (let sn = neighbourStars.length - 1; sn >= 0; sn--) {
                    const starn = neighbourStars[sn];
                    let dist = Math.sqrt((star.x - starn.x) ** 2 + (star.y - starn.y) ** 2);
                    if (dist < starDist) {
                        ctx.lineWidth = ((starDist - dist) / starDist);
                        ctx.beginPath();
                        ctx.moveTo(star.x, star.y);
                        ctx.lineTo(starn.x, starn.y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    frameTimes += Date.now() - startTime;

    // push frame time to an array, and log the average frame time every 100 frames
    timerFrames += 1;
    if (timerFrames >= timerWindow) {
        console.log(`Avg frametime: ${frameTimes / timerWindow}`);
        frameTimes = 0;
        timerFrames = 0;
    }
    window.requestAnimationFrame(renderConstellations);
}

// generating and linking the quad grid
function generateQuads() {
    console.time('generateQuads');
    const newQuads = [];
    quadsW = Math.ceil(cWidth / starDist) + 2;
    quadsH = Math.ceil(cHeight / starDist) + 2;
    for (let x = 0; x < quadsW; x++) {
        newQuads.push([]);
        for (let y = 0; y < quadsH; y++) {
            const newQuad = {
                stars: [],
                neighbours: [],
            };
            newQuads[x].push(newQuad);
            if (x - 1 >= 0) {
                newQuad.neighbours.push(newQuads[x - 1][y]);
                if (y - 1 >= 0) {
                    newQuad.neighbours.push(newQuads[x - 1][y - 1]);
                }
                if (y + 1 < quadsH) {
                    newQuad.neighbours.push(newQuads[x - 1][y + 1]);
                }
            }
            if (y - 1 >= 0) {
                newQuad.neighbours.push(newQuads[x][y - 1]);
            }
        }
    }
    console.timeEnd('generateQuads');
    return newQuads;
}

// generating the stars and assigning them to quads
function generateStars() {
    console.time('generateStars');
    let c = Math.floor(density * cWidth * cHeight / (starDist ** 2));
    let stars = new Array(c);
    while (c >= 0) {
        const speed = Math.random() * (maxSpeed - minSpeed) + minSpeed;
        const direction = Math.random() * Math.PI * 2;
        const x = Math.random() * (quadsW * starDist);
        const y = Math.random() * (quadsH * starDist);
        stars[c] = {
            x: x,
            y: y,
            dx: Math.sin(direction) * speed,
            dy: Math.cos(direction) * speed,
            lastUpdate: 0,
        };
        c--;
    }
    console.timeEnd('generateStars');
    return stars;
}

function placeStars(stars, quads) {
    console.time('placeStars');
    let i = stars.length - 1;
    while (i >= 0) {
        // this handles stars being off the quad grid when resized
        if (stars[i].x <= quadsW * starDist && stars[i].y <= quadsH * starDist) {
            const qx = Math.floor(stars[i].x / starDist);
            const qy = Math.floor(stars[i].y / starDist);
            quads[qx][qy].stars.push(stars[i]);
        }
        i--;
    }
    console.timeEnd('placeStars');
}

const cCanvas = document.getElementById('constellation');
const ctx = cCanvas.getContext('2d', {alpha: false});

const minSpeed = 10;
const maxSpeed = 50;
const starDist = 100;
const density = 3;

const dpiScale = window.devicePixelRatio;

let cWidth = 1600;
let cHeight = 400;
let quadsW = 0;
let quadsH = 0;

let mX = 0;
let mY = 0;
const mRadius = 100;

cCanvas.addEventListener('mousemove', e => {
    mX = e.offsetX + starDist;
    mY = e.offsetY + starDist;
});

let prevTime = 0;

let timerFrames = 0;
let timerWindow = 100;
let frameTimes = 0;

const cBounds = cCanvas.getBoundingClientRect();
cWidth = Math.floor(cBounds.width * dpiScale);
cHeight = Math.floor(cBounds.height * dpiScale);

let quads = generateQuads();
let stars = generateStars();

placeStars(stars, quads);

new ResizeObserver(onResize).observe(cCanvas);

window.requestAnimationFrame(renderConstellations)