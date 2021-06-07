const { Engine, Render, Runner, World, Bodies, Body } = Matter;

const cells = 7;
const height = 600;
const width = 600;
const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

//wall

const walls = [
    Bodies.rectangle(width / 2, 0, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 2, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 2, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 2, height, {
        isStatic: true
    })
]
World.add(world, walls);

const grid = Array(cells)
    .fill(null)
    .map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false))

console.log(grid);

const startRow = Math.floor(Math.random() * cells);
const startsColumn = Math.floor(Math.random() * cells);

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
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                isStatic: true
            }
        )

        World.add(world,wall);
    })
})


verticals.forEach((row,rowIndex) => {
    row.forEach((open,columnIndex) => {
        if(open){
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength/2,
            10,
            unitLength,
            {
                isStatic:true
            }   
        )
            World.add(world,wall);
    })
})

//goal
const goal = Bodies.rectangle(
    width-unitLength/2,
    height-unitLength/2,
    unitLength*0.7,
    unitLength*0.7,
    {
        isStatic:true
    }
)
World.add(world,goal);


//ball
const ball = Bodies.circle(
    unitLength/2,
    unitLength/2,
    unitLength/4
)

World.add(world,ball);

document.addEventListener('keydown',event=>{
    if (event.keyCode === 87) {
        console.log('move ball up');
    }else if (event.keyCode === 68) {
        console.log('move ball right');
    }else if (event.keyCode === 83) {
        console.log('move ball down');
    }else if (event.keyCode === 65) {
        console.log('move ball left');
    }
})
