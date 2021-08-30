// query player wrapper
const o = document.getElementById('o')
const x = document.getElementById('x') 

// query score dom
const scoreO = document.getElementById('score-o')
const scoreX = document.getElementById('score-x')

// query wrapper status
const status = document.getElementById('status')

// query location
const num1 = document.getElementById('1')
const num2 = document.getElementById('2')
const num3 = document.getElementById('3')
const num4 = document.getElementById('4')
const num5 = document.getElementById('5')
const num6 = document.getElementById('6')
const num7 = document.getElementById('7')
const num8 = document.getElementById('8')
const num9 = document.getElementById('9')
const pick = [num1, num2, num3, num4, num5, num6, num7, num8, num9]

// query restart button
const restartButton = document.getElementById("restart")

// define variable
const humanIcon = `<img class="xo-icon-lg" src="assets/human.png" alt="icon-human">`
const computerIcon = `<img class="xo-icon-lg" src="assets/computer.png" alt="icon-computer">`
const oIcon =   `<img class="xo-icon-lg" src="assets/icon-o.png" alt="icon-o">`
const xIcon =   `<img class="xo-icon-lg" src="assets/icon-x.png" alt="icon-x">`

const winArray = [[1, 2, 3], [1, 4, 7], [1, 5, 9], [2, 5, 8], [3, 5, 7], [3, 6, 9], [4, 5, 6], [7, 8, 9]]

var oScoreDisplay = 0
var xScoreDisplay = 0

var humanPath = []
var computerPath = []
var resultArray = []

var humanTurn = 0
var computerTurn = 0


const makeColor = () => {
    if(resultArray.length) {
        resultArray.forEach(x => {
            pick[x - 1].style.backgroundColor = "green"
        })
    }
    status.style.color = "red"
}

const restartGame = () => {
    humanPath = []
    computerPath = []
    resultArray = []
    humanTurn = 0
    computerTurn = 0
    
    document.body.style.transition = "0,7s";
    restartButton.style.visibility = "hidden"
    o.style.backgroundColor = "#00CCFF";
	x.style.backgroundColor = "#FFFFFF";	
    status.innerHTML = humanIcon + "Turn";
    status.style.color = ""

    pick.forEach(num => {
        num.innerHTML = ""
        num.style.backgroundColor = "#00CCFF";
        num.addEventListener("click", display)
    })

}

restartButton.addEventListener("click", () => {
    restartGame()
})



const stopGame = () => {
    pick.forEach(num => {
        num.removeEventListener("click", display)
    })
    restartButton.style.visibility = "visible"
}

const checkWin = (array) => {
    let result = false
    winArray.forEach(arr => {
        if(array.includes(arr[0]) && array.includes(arr[1]) && array.includes(arr[2])) {
            result = true
            resultArray = arr
        }
    })
    return result
}

const humanPlay = (e) => {
    // update logic
    humanTurn += 1
    humanPath.push(parseInt(e.target.id))
    //update ui
    o.style.backgroundColor = "#FFFFFF"
    x.style.backgroundColor = "#00CCFF"
    status.innerHTML = computerIcon + " Turn"
    e.target.innerHTML = oIcon
    // remove event
    e.target.removeEventListener("click", display);
    if(checkWin(humanPath)) { // win
        status.innerHTML = humanIcon + "WIN!"
        oScoreDisplay += 1
        scoreO.innerHTML = oScoreDisplay
        makeColor()
        stopGame()
    }else{
        if(humanTurn + computerTurn < 9) {
            computerPlay(e)
        }else{
            status.innerHTML = humanIcon + computerIcon + "&nbsp DRAW!"
            makeColor()
            stopGame()
        }
    }
}

const autoGenerate = () => {
    let result;
    do {
        result = Math.ceil(Math.random() * 9)
    }while(humanPath.includes(result) || computerPath.includes(result))
    return result
}

const computerPlay = (e) => {
    setTimeout(() => {
        // update logic
        computerTurn += 1
        // update ui
        o.style.backgroundColor = "#00CCFF"
        x.style.backgroundColor = "#FFFFFF"
        status.innerHTML = humanIcon + "&nbsp" + "Turn"
        let location = autoGenerate()
        computerPath.push(location)
        pick[location - 1].innerHTML = xIcon
        // remove event
        pick[location - 1].removeEventListener("click", display)
 
        if(checkWin(computerPath)) { // win
            status.innerHTML = computerIcon + "&nbsp" + "WIN!"
            xScoreDisplay += 1
            scoreX.innerHTML = xScoreDisplay
            makeColor()
            stopGame()
        }else{
            if(humanTurn + computerTurn == 9) {
                status.innerHTML = "DRAW!"
                makeColor()
                stopGame()
            }
        }
    }, 600)
}

const display = (e) => {
    if(humanTurn === computerTurn) { // human turn
        humanPlay(e)
    }
}

const gameLoop = () => {
    pick.forEach(num => {
        num.addEventListener("click", display)
    })
}

window.addEventListener("load", () => {
    gameLoop()
})
