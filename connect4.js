/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// Declare global constants
const body = document.querySelector('body');
const board = []; // array of rows, each row is array of cells  (board[y][x])
const gameBoard = document.getElementById('game');
const htmlBoardTop = document.getElementById('board-top');
const htmlBoard = document.getElementById('board');
const htmlBoardFeet = document.getElementById('board-feet');
const gameTitle = document.querySelector('h1');

// Board Size initialization
let WIDTH;
let HEIGHT;
let turnCounter;

// Active Player Initialization
let currPlayer = 1;
let pColor1 = 'rgb(170, 170, 0)';
let pColor2 = 'rgb(170, 170, 0)';
setTimeout(() => {
    pColor1 = 'red';
    pColor2 = 'blue';
    let currColor = pColor1;
    colorTitle();
}, 600)

// Color characters in game title using alternating player colors
const colorTitle = () => {
    setTimeout(() => {
        gameTitle.style.opacity = '1';
    }, 200);
    const chars = gameTitle.children;
    for (let i = 0; i < chars.length; i++) {
        if (Math.floor(i % 2) == 0) {
            chars[i].style.color = `${pColor1}`;
        } else {
            chars[i].style.color = `${pColor2}`;
        }
    }
};


const form = document.getElementById('form');

const p1ColSel = document.getElementById('player1');
const p2ColSel = document.getElementById('player2');
const heightSel = document.getElementById('boardHeight');
const widthSel = document.getElementById('boardWidth');
p1ColSel.onchange = () => {
    pColor1 = `${p1ColSel.value}`;
    switchP();
    switchP();
    colorTitle();
}
p2ColSel.onchange = () => {
    pColor2 = `${p2ColSel.value}`;
    switchP();
    switchP();
    colorTitle();
}
form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (p1ColSel.value == p2ColSel.value) {
        alert('Please select two different player colors.')
    } else {
        HEIGHT = heightSel.value;
        WIDTH = widthSel.value;
        turnCounter = HEIGHT * WIDTH;
        pColor1 = `${p1ColSel.value}`;
        pColor2 = `${p2ColSel.value}`;
        currColor = pColor1;
        makeBoard(board);
        gameTitle.style.opacity = '0';
        form.style.opacity = '0';
        setTimeout(() => {
            form.style.display = 'none';
            gameBoard.style.display = 'block';
        }, 200);
        setTimeout(() => {
            colorTitle();
            makeHtmlBoard();
        }, 500);


    }
})



// Create a backend JS board (array) to check for win conditions
const makeBoard = arr => {
    // Erase any existing array contents
    while (board.length > 0) {
        board.pop();
    }
    // Create new board
    for (let i = 0; i < HEIGHT; i++) {
        let row = [];
        for (let i = 0; i < WIDTH; i++) {
            row.push(null);
        }
        arr.push(row);
    }
};

// Make the UI board
const makeHtmlBoard = () => {
    // Removes any previous board contents
    clearBoard(htmlBoardTop);
    clearBoard(htmlBoard);

    // Adds a table row on top for the players to drop their pieces in
    // and triggers the handleClick function when clicked.
    var top = document.createElement("tr");
    top.addEventListener("click", handleClick);
    top.addEventListener("mouseover", onHover);
    // Removes player color from cell when mouse moves off.
    top.addEventListener("mouseout", e => e.target.style.backgroundColor = '');
    // Adds (WIDTH) cells to the board top and gives them sequential numeric IDs.
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoardTop.append(top);
    // Adds (HEIGHT) rows to the board with (WIDTH) cells/columns each.
    // Gives each cell an ID corresonding to their location ('row-col').
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
    // Adds feet to board - disabled due to margin problem.
    // for (i = 0; i < 2; i++) {
    //     let aFoot = document.createElement('div');
    //     aFoot.className = 'foot';
    //     let footTop = document.createElement('div');
    //     footTop.className = 'top-foot';
    //     let footBottom = document.createElement('div');
    //     footBottom.className = 'bottom-foot';
    //     let footLeft = document.createElement('div');
    //     footLeft.className = 'left-foot';
    //     let footRight = document.createElement('div');
    //     footRight.className = 'right-foot';
    //     // footLeft.style.marginRight = `${WIDTH / -50}rem`;
    //     // footRight.style.marginLeft = `${WIDTH / -50}rem`;
    //     footBottom.append(footLeft);
    //     footBottom.append(footRight);
    //     aFoot.append(footTop);
    //     aFoot.append(footBottom);
    //     htmlBoardFeet.append(aFoot);
    // }
    // while (htmlBoardFeet.children.length > 2) {
    //     htmlBoardFeet.firstChild.remove();
    // }
    const feet = document.getElementById('board-feet').children;
    feet[0].style.marginRight = '30%';
    feet[1].style.marginLeft = '30%';

    setTimeout(() => {
        htmlBoardTop.style.opacity = '1';
        htmlBoard.style.opacity = '1';
        htmlBoardFeet.style.opacity = '1';
    }, 500);
}; // end of makeHtmlBoard

// Changes top row spot to player's color when hovered over
const onHover = e => {
    e.target.style.backgroundColor = currColor;
};

// Locates the lowest empty space in column x
const findSpotForCol = x => {
    for (let i = 0; i < HEIGHT; i++) {
        if (board[i][x] != null) {
            if (i == 0) {
                return null;
            }
            return [i - 1]
        }
    }
    return (HEIGHT - 1);
}

// Inserts a div into the correct table cell to create a player piece
const placeInTable = (y, x) => {
    const spot = document.getElementById(`${y}-${x}`);
    spot.innerHTML = `<div></div>`;
    spot.firstChild.style.backgroundColor = `${currColor}`;
    spot.firstChild.classList.add('piece');
};

// Changes the active player
const switchP = () => {
    if (currPlayer == 1) {
        currPlayer = 2;
        currColor = pColor2;
    } else {
        currPlayer = 1;
        currColor = pColor1;
    }
};

// Resets board and variables for a new game
const resetGame = () => {
    const newGameButton = document.getElementById('endgame-button');
    setTimeout(() => {
        newGameButton.style.display = "none";
        document.getElementById('endgame-overlay').style.display = "none";
        gameBoard.style.display = 'none';
        form.style.display = 'block';
    }, 300);
    setTimeout(() => {
        newGameButton.style.opacity = '1';
        form.style.opacity = '1';
        pColor1 = `${p1ColSel.value}`;
        pColor2 = `${p2ColSel.value}`;
        currColor = pColor1;
        colorTitle();
    }, 1000);
    newGameButton.style.opacity = '0';
    htmlBoardTop.style.opacity = '0';
    htmlBoard.style.opacity = '0';
    htmlBoardFeet.style.opacity = '0';
    gameTitle.style.opacity = '0';
    document.getElementById('endgame-button').removeEventListener('click', resetGame);
    currPlayer = 1;
    pColor1 = 'rgb(170, 170, 0)';
    pColor2 = 'rgb(170, 170, 0)';
    currColor = pColor1;
    colorTitle();
    turnCounter = WIDTH * HEIGHT;
    body.style.backgroundColor = 'beige';
};

// Respond to player click with gameplay features
const handleClick = evt => {
    // Get column number from ID of clicked cell
    const x = +evt.target.id;
    // Get lowest empty spot in column x (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }
    // Update JS board and place piece in HTML board
    board[y][x] = currPlayer;
    placeInTable(y, x);
    // Check for win
    if (checkForWin()) {
        evt.target.style.backgroundColor = ''; // Remove current player color from last hovered cell
        return endGame(`Player ${currPlayer} won in ${Math.round(((WIDTH*HEIGHT) - turnCounter + 1)/2)} turns!`);
    }
    // Check for tie game
    if (turnCounter == 1 && checkForWin == false) {
        currColor = '#666';
        evt.target.style.backgroundColor = ''; // Remove current player color from last hovered cell
        return endGame('You both lose!');
    } else {
        turnCounter--;
    }
    // Change active player
    switchP();
    onHover(evt);
}

// Check for active player victory
const checkForWin = evt => {
    const _win = cells => {
        // Check JS array and return all of the active player's controlled cells
        return cells.every(
            ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        );
    };
    // Look for 4 consecutive cells within return of current player's cells
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {
            let horiz = [ // Checks for a horizontal win
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            let vert = [ // Checks for a vertical win
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            let diagDR = [ // Checks for a diagnoal win, downward to the right
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            let diagDL = [ // Checks for a diagonal win, downward to the left
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];
            // Uses _win return to check current player's cells for the above conditions.
            // If any win conditions are true, returns true.
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                for (let i = 0; i < 4; i++) {
                    // Function for marking winning spots
                    const markWinners = (spot) => {
                        spot.style.width = '1rem';
                        spot.style.height = '1rem';
                        spot.style.border = `solid 2rem ${currColor}`;
                        spot.firstChild.style.backgroundColor = 'beige';
                    };
                    // Marks the pieces from the first (top-left) instance of each win type
                    if (_win(horiz)) {
                        const winSpot = document.getElementById(`${y}-${x+i}`);
                        markWinners(winSpot);
                    }
                    if (_win(vert)) {
                        const winSpot = document.getElementById(`${y+i}-${x}`);
                        markWinners(winSpot);
                    }
                    if (_win(diagDR)) {
                        const winSpot = document.getElementById(`${y+i}-${x+i}`);
                        markWinners(winSpot);
                    }
                    if (_win(diagDL)) {
                        const winSpot = document.getElementById(`${y+i}-${x-i}`);
                        markWinners(winSpot);
                    }
                }
                return true;
            }
        }
    }
}

// Stops gameplay and manifests pop up for game result
// popUp adapted from http://www.developphp.com/video/JavaScript/Custom-Alert-Box-Programming-Tutorial
function popUp() {
    this.render = (msg) => {
        let winW = window.innerWidth;
        let winH = window.innerHeight;
        const dropSpots = document.getElementById('board-top').firstChild.children;
        const letters = gameTitle.children;
        const dialogBox = document.getElementById('endgame-button');
        const dialogOverlay = document.getElementById('endgame-overlay');
        // Manifests an overlay that prevents further play
        dialogOverlay.style.display = "block";
        dialogOverlay.style.height = `${winH}px`;
        // Manifests a button with victory message to reset game
        dialogBox.style.left = `${(winW/2) - (200)}px`;
        dialogBox.style.top = '6rem';
        dialogBox.style.display = 'block';
        dialogBox.innerText = `${msg}`;
        // Makes top/drop row invisible
        for (i = 0; i < dropSpots.length; i++) {
            dropSpots[i].style.opacity = '0';
        }
        // Sets title letters to original body background color
        for (i = 0; i < letters.length; i++) {
            letters[i].style.color = 'beige';
        }
        // Sets the page background and message text to winning player's color
        dialogBox.style.color = currColor;
        body.style.backgroundColor = currColor;
        // Allows for game reset
        setTimeout(() => {
            dialogBox.innerText = 'Click For New Game';
            dialogBox.addEventListener('click', resetGame);
        }, 2000);
    }
}

// Announce game result
const endGame = msg => {
    let endGameMsg = new popUp();
    setTimeout(() => endGameMsg.render(msg), 200);
};

// Function for clearing the board for game reset
const clearBoard = (toClear) => {
    while (toClear.firstChild) {
        toClear.removeChild(toClear.lastChild);
    }
};

// Initialize game title
colorTitle();