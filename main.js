let level = localStorage.getItem("level");
let gravity = localStorage.getItem("gravity");
let winCard = document.querySelector(".winCard");
let colorArr = ['#f368e0','#ee5253','#0abde3','#341f97','#01a3a4','#eb2f06','#b71540','#079992']

const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

if(isNaN(level)){
    level = 5;
}

let cellsHorizontals = 4;
let cellsVerical = 3;

if(level == "5"){
    cellsHorizontals = 5;
    cellsVerical = 4;
}else if(level == "7"){
    cellsHorizontals = 7;
    cellsVerical = 6;
}else if(level == "8"){
    cellsHorizontals = 8;
    cellsVerical = 7;
}else if(level == "9"){
    cellsHorizontals = 9;
    cellsVerical = 8;
}else if(level == "12"){
    cellsHorizontals = 12;
    cellsVerical = 10;
}else if(!isNaN(parseFloat(level)) && isFinite(level)){
    cellsHorizontals = Number(level);
    cellsVerical = Number(level);
}

let height = window.innerHeight;
let width = window.innerWidth;

let xUnitLength = width / cellsHorizontals;
let yUnitLength = height / cellsVerical;

const engine = Engine.create();
engine.world.gravity.y = Number(gravity);

const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//wall

const walls = [
    Bodies.rectangle(width / 2, 0, width, 5, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 5, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 5, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 5, height, {
        isStatic: true
    })
]
World.add(world, walls);

let grid = Array(cellsVerical)
    .fill(null)
    .map(() => Array(cellsHorizontals).fill(false));

let verticals = Array(cellsVerical)
    .fill(null)
    .map(() => Array(cellsHorizontals - 1).fill(false));

let horizontals = Array(cellsVerical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontals).fill(false))

console.log(grid);

let startRow = Math.floor(Math.random() * cellsVerical);
let startsColumn = Math.floor(Math.random() * cellsHorizontals);

let shuffle = (arr) => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

let stepThroughCell = (row, column) => {
    // if i have visited the cell then return
    if (grid[row][column]) {
        return;
    }

    // Mark this cell visited
    grid[row][column] = true;

    //Assemble random-ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    // For each neighbor
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        // See if that neighbor is out bound
        if (nextRow < 0 || nextRow >= cellsVerical || nextColumn < 0 || nextColumn >= cellsHorizontals) {
            continue;
        }

        // See if we have visited out neighbor
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        // Remove a wall from either vertical and horizontal
        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        stepThroughCell(nextRow, nextColumn)
    }
}

stepThroughCell(startRow, startsColumn);

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * xUnitLength + xUnitLength / 2,
            rowIndex * yUnitLength + yUnitLength,
            xUnitLength,
            5,
            {
                label:'wall',
                isStatic: true,
                render : {
                    fillStyle:`${colorArr[Math.floor(8*Math.random())]}`,
                }            
            }
        )
        World.add(world, wall);
    })
})


verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * xUnitLength + xUnitLength,
            rowIndex * yUnitLength + yUnitLength / 2,
            5,
            yUnitLength,
            {
                label:'wall',
                isStatic: true,
                render : {
                    fillStyle:`${colorArr[Math.floor(8*Math.random())]}`,           
                }            
            }
        )
        World.add(world, wall);
    })
})

//goal
const goal = Bodies.rectangle(
    width - xUnitLength / 2,
    height - yUnitLength / 2,
    xUnitLength * 0.9,
    yUnitLength * 0.9,
    {
        label: 'goal',
        isStatic: true,
        render : {
            fillStyle:`${colorArr[Math.floor(8*Math.random())]}`,
        }
    }
)
World.add(world, goal);


//ball
const ballRadius = Math.min(xUnitLength,yUnitLength)/4;
const ball = Bodies.circle(
    xUnitLength / 2,
    yUnitLength / 2,
    ballRadius,
    {
        label: 'ball',
        render : {
            fillStyle:'yellow', 
            // background-image: linear-gradient(to right, #ed6ea0 0%, #ec8c69 100%);
        }
    }
)

World.add(world, ball);

document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;
    if (event.keyCode === 38) {
        // move up
        Body.setVelocity(ball, { x, y: y - 2 });
    } else if (event.keyCode === 39) {
        // move right
        Body.setVelocity(ball, { x: x + 2, y });
    } else if (event.keyCode === 40) {
        // move down
        Body.setVelocity(ball, { x, y: y + 2 });
    } else if (event.keyCode === 37) {
        // move left
        Body.setVelocity(ball, { x: x - 2, y });
    }
})


// Win Condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            // document.querySelector('.winner').classList.remove('hidden');
            verticals.forEach((row, rowIndex) => {
                row.forEach((open, columnIndex) => {
                    if (open) {
                        return;
                    }
                    
                    const wall = Bodies.rectangle(
                        columnIndex * xUnitLength + xUnitLength,
                        rowIndex * yUnitLength + yUnitLength / 2,
                        10,
                        yUnitLength,
                        {
                            label:'wall',
                            isStatic: true,
                            render : {
                                fillStyle:`${colorArr[Math.floor(8*Math.random())]}`,           
                            }            
                        }
                    )
                    World.add(world, wall);
                })
            })
            horizontals.forEach((row, rowIndex) => {
                row.forEach((open, columnIndex) => {
                    if (open) {
                        return;
                    }
            
                    const wall = Bodies.rectangle(
                        columnIndex * xUnitLength + xUnitLength / 2,
                        rowIndex * yUnitLength + yUnitLength,
                        xUnitLength,
                        5,
                        {
                            label:'wall',
                            isStatic: true,
                            render : {
                                fillStyle:`${colorArr[Math.floor(8*Math.random())]}`,
                            }            
                        }
                    )
                    World.add(world, wall);
                })
            })

            world.bodies.forEach(body => {
                if(body.label === 'wall'){
                    Body.setStatic(body,false);
                    // Vec2 win = new Vec2(200,0);

                }
            })
            World.remove(world,goal);
            setInterval(function () {
                let r = Math.random();
                let g = Math.floor(10*Math.random());
                if(r > 0.5){
                    g = g*-1;
                }
                world.gravity.y = g;
            },100)
            winCard.style.display = "flex";                
        }
    })
})

