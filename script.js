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

// query game mode 

const mode = document.getElementById("mode")

// define variable
const humanIcon = `<img class="xo-icon-lg" src="assets/human.png" alt="icon-human">`
const computerIcon = `<img class="xo-icon-lg" src="assets/computer.png" alt="icon-computer">`
const oIcon = `<img class="xo-icon-lg" src="assets/icon-o.png" alt="icon-o">`
const xIcon = `<img class="xo-icon-lg" src="assets/icon-x.png" alt="icon-x">`

const pathArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const winArray = [[1, 2, 3], [1, 4, 7], [1, 5, 9], [2, 5, 8], [3, 5, 7], [3, 6, 9], [4, 5, 6], [7, 8, 9]]

var oScoreDisplay = 0
var xScoreDisplay = 0

var humanPath = []
var computerPath = []
var resultArray = []

var humanTurn = 0
var computerTurn = 0

var gameMode = 'easy'



mode.addEventListener("change", () => {
    if (mode.value === "easy") {
        gameMode = "hard";
    } else {
        gameMode = "hard"
    }
    stopGame()
    restartGame()
})


const makeColor = () => {
    console.log(resultArray)
    if (resultArray.length) {
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
        if (array.includes(arr[0]) && array.includes(arr[1]) && array.includes(arr[2])) {
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
    if (checkWin(humanPath)) { // win
        status.innerHTML = humanIcon + "WIN!"
        oScoreDisplay += 1
        scoreO.innerHTML = oScoreDisplay
        makeColor()
        stopGame()
    } else {
        if (humanTurn + computerTurn < 9) {
            computerPlay(e)
        } else {
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
    } while (humanPath.includes(result) || computerPath.includes(result))
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

        let location;
        if (gameMode === "easy") {
            location = autoGenerate()
        } else {
            location = findBestLocation();
            console.log("best ", location)
        }
        computerPath.push(location)
        pick[location - 1].innerHTML = xIcon
        // remove event
        pick[location - 1].removeEventListener("click", display)

        if (checkWin(computerPath)) { // win
            status.innerHTML = computerIcon + "&nbsp" + "WIN!"
            xScoreDisplay += 1
            scoreX.innerHTML = xScoreDisplay
            makeColor()
            stopGame()
        } else {
            if (humanTurn + computerTurn == 9) {
                status.innerHTML = "DRAW!"
                makeColor()
                stopGame()
            }
        }
    }, 600)
}




const findBestLocation = () => {
    let bestScore = -Infinity;
    let location;
    let remainingPath = pathArray.filter(x => !computerPath.includes(x) && !humanPath.includes(x))

    for (let i = 0; i < remainingPath.length; i++) {
        computerPath.push(remainingPath[i])
        let score = minimax(humanPath, computerPath, false)
        computerPath.pop()
        if (score > bestScore) {
            bestScore = score
            location = remainingPath[i]
        }
    }

    return location;
}

const checkWinWithAI = (array) => {
    let result = false
    winArray.forEach(arr => {
        if (array.includes(arr[0]) && array.includes(arr[1]) && array.includes(arr[2])) {
            result = true
        }
    })
    return result
}

const minimax = (humanPath, computerPath, isMaximizing) => {
    if (isMaximizing == false && checkWinWithAI(computerPath)) { // computer has turned
        return 10
    }
    if (isMaximizing == true && checkWinWithAI(humanPath)) { // human has turned
        return -10
    }

    if ((computerPath.length + humanPath.length) == 9) {
        return 0
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        let remainingPath = pathArray.filter(x => !computerPath.includes(x) && !humanPath.includes(x))

        for (let i = 0; i < remainingPath.length; i++) {
            computerPath.push(remainingPath[i])
            let score = minimax(humanPath, computerPath, false)
            computerPath.pop()
            if (score > bestScore) {
                bestScore = score
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        let remainingPath = pathArray.filter(x => !computerPath.includes(x) && !humanPath.includes(x))

        for (let i = 0; i < remainingPath.length; i++) {
            humanPath.push(remainingPath[i])
            let score = minimax(humanPath, computerPath, true)
            humanPath.pop()
            if (score < bestScore) {
                bestScore = score
            }
        }
        return bestScore;
    }
}

const display = (e) => {
    if (humanTurn === computerTurn) { // human turn
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
