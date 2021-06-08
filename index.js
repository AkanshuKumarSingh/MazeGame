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

const height = window.innerHeight;
const width = window.innerWidth;

const unitLengthX = width / cellsHorizontals;
const unitLengthY = height / cellsVerical;

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
    Bodies.rectangle(width / 2, 0, width, 3, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 3, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 3, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 3, height, {
        isStatic: true
    })
]
World.add(world, walls);

const grid = Array(cellsVerical)
    .fill(null)
    .map(() => Array(cellsHorizontals).fill(false));

const verticals = Array(cellsVerical)
    .fill(null)
    .map(() => Array(cellsHorizontals - 1).fill(false));

const horizontals = Array(cellsVerical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontals).fill(false))

console.log(grid);

const startRow = Math.floor(Math.random() * cellsVerical);
const startsColumn = Math.floor(Math.random() * cellsHorizontals);

const shuffle = (arr) => {
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

const stepThroughCell = (row, column) => {
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
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
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
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
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
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.7,
    unitLengthY * 0.7,
    {
        label: 'goal',
        isStatic: true,
        render : {
            fillStyle:'#5f27cd',
        }
    }
)
World.add(world, goal);


//ball
const ballRadius = Math.min(unitLengthX,unitLengthY)/4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
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
        Body.setVelocity(ball, { x, y: y - 5 });
    } else if (event.keyCode === 39) {
        // move right
        Body.setVelocity(ball, { x: x + 5, y });
    } else if (event.keyCode === 40) {
        // move down
        Body.setVelocity(ball, { x, y: y + 5 });
    } else if (event.keyCode === 37) {
        // move left
        Body.setVelocity(ball, { x: x - 5, y });
    }
})


// Win Condition

Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            // document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = -10;
            
            world.bodies.forEach(body => {
                if(body.label === 'wall'){
                    Body.setStatic(body,false);
                }
            })
            world.gravity.y = 10;
            winCard.style.display = "flex";                
        }
    })
})

