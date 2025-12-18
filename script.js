const board = document.querySelector(".board")

const blockHeight = 50;
const blockWidth = 50;
const startButton = document.querySelector(".btn-start")
const modal = document.querySelector(".modal")
const startGameModal = document.querySelector(".start-game")
const gameOverModal = document.querySelector(".game-over")
const restartButton = document.querySelector(".btn-restart")

const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")


const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId = null;
let food = {x: Math.floor(Math.random()* rows), y: Math.floor(Math.random()* cols)}
let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`

highScoreElement.innerText = highScore;

const blocks = [];
let snake = [{
    x:1, y: 3

}]

let direction = 'down'


// console.log(cols)
// console.log(rows)

// for(let  i =  0 ; i < rows * cols ; i++){
//     //use to create elem block
//     const block = document.createElement('div')
//     // adding class to the elem block
//     block.classList.add("block")
//     //add it on the board
//     board.appendChild(block)
// }

//now some space is left both horz and vert so that needs to be fixed.
//mimmax(30px, 1fr) in grid template

for(let row = 0 ; row < rows; row++){

    for(let col = 0 ; col < cols ; col++){
        const block = document.createElement('div')
        block.classList.add("block")
        board.appendChild(block)
       // block.innerText = `${row}-${col}`
        blocks[ `${row}-${col}` ] = block;
        
    }
}

// function to view snake on screen
function render() {
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food");
    

    if(direction === 'left'){
        head = {x : snake[0].x ,  y : snake[0].y - 1}
    } else if(direction === 'right'){
        head = {x : snake[0].x ,  y : snake[0].y + 1}

    }else if(direction === 'down'){
        head = {x : snake[0].x +1,  y : snake[0].y }

    }else if(direction === 'up'){
        head = {x : snake[0].x - 1 ,  y : snake[0].y }

    }
//WALL COLLISION LOGIC
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
        // alert("game over")
        clearInterval(intervalId)
       //isse pura modal aagya
        modal.style.display = "flex"
        //start game wala nhi chaoiye
        startGameModal.style.display = "none"
        // restart wala chaiye
        gameOverModal.style.display = "flex"
        return;    
    }

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill")
    })

    snake.unshift(head) // head ko aage bdha rhe hai
    snake.pop() // last elem ko remove krenge
//FOOD CONSUME LOGIC
    if(head.x == food.x && head.y == food.y){
        
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {x: Math.floor(Math.random()* rows), y: Math.floor(Math.random()* cols)}
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head)

    score += 10;
    scoreElement.innerText = score;

    if(score > highScore){
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
    }
        
    }

    snake.forEach( segment => {
        // console.log(segment)
        //console.log(`${segment.x} ${segment.y}`)
        blocks[`${segment.x}-${segment.y}` ].classList.add("fill")
        
    })


}
// intervalId = setInterval(() =>{

//     render();
// },400)

startButton.addEventListener("click" , () => {
    modal.style.display = "none"
    intervalId = setInterval(() => { render() } , 300)
    timerIntervalId = setInterval(() =>{
        //destructuring
        let [min , sec] =  time.split("-").map(Number)

        if(sec == 59){
            min += 1
            sec = 0
        } else{
            sec += 1
        }

        time = `${min}-${sec}`
        timeElement.innerText = time
    },1000)
})

restartButton.addEventListener( "click" , restartGame )

function restartGame() {

    blocks[`${food.x}-${food.y}`].classList.remove("food")
    snake.forEach(segment => {
        blocks[ `${segment.x}-${segment.y}`].classList.remove("fill")
    })
    score = 0;
    time = `00-00`

    scoreElement.innerText = score
    timeElement.innerText = time 
    highScoreElement.innerText = highScore

    modal.style.display = "none"
    direction = 'down'
    snake = [{ x:1, y: 3}];
    food = {x: Math.floor(Math.random()* rows), y: Math.floor(Math.random()* cols)}
    intervalId = setInterval(() => { render() } , 300)

}

addEventListener("keydown", (event) =>{
    console.log(event.key)
    if(event.key ==="ArrowUp"){
        direction = "up"
    } else if(event.key === "ArrowDown"){
        direction = "down"
    } else if(event.key === "ArrowLeft"){
        direction = "left"
    } else if(event.key === "ArrowRight"){
        direction = "right"
    }
})

