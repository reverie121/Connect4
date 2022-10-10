/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

// Declare global constants
const body = document.querySelector('body');
const gameTitle = document.querySelector('h1');
const form = document.getElementById('form');
const p1ColSel = document.getElementById('player1');
const p2ColSel = document.getElementById('player2');
const board = []; // array of rows, each row is array of cells  (board[y][x])
const gameBoard = document.getElementById('game');
const htmlBoardTop = document.getElementById('board-top');
const htmlBoard = document.getElementById('board');
const htmlBoardFeet = document.getElementById('board-feet');
const endGamePopUp = document.getElementById('endgame-button');

// Board Size initialization
let WIDTH;
let HEIGHT;
let turnCounter;

// Active Player Initialization
let currPlayer = 1;
let pColor1;
let pColor2;
let currColor;
setTimeout(() => {
    setTitleColors();
}, 600)

// Opacity initialization for fade()
form.style.opacity = 1;
htmlBoardTop.style.opacity = 1;

// Color characters in game title using alternating player colors
function colorTitle() {
    setTimeout(() => {
        gameTitle.style.opacity = 1;
    }, 200);
    const chars = gameTitle.children;
    for (let i = 0; i < chars.length; i++) {
        if (Math.floor(i % 2) == 0) {
            chars[i].style.color = pColor1;
        } else {
            chars[i].style.color = pColor2;
        }
    }
};

// Set color variables to dropdown selections
function setPlayerColors() {
    pColor1 = p1ColSel.value;
    pColor2 = p2ColSel.value;
    currColor = pColor1;
}

// Set color variables and game title characters to dropdown selections
function setTitleColors() {
    setPlayerColors();
    colorTitle();
}

// Change game title colors when color selection dropdowns are used
p1ColSel.onchange = () => setTitleColors();
p2ColSel.onchange = () => setTitleColors();

// Toggle opacity between 0 and 1
const fade = element => element.style.opacity == 0 ? element.style.opacity = 1 : element.style.opacity = 0

// Logic for new game form submission and game launch
form.addEventListener("submit", function(e) {
    e.preventDefault();
    if (p1ColSel.value == p2ColSel.value) {
        alert('Please select two different player colors.')
    } else {
        HEIGHT = document.getElementById('boardHeight').value;
        WIDTH = document.getElementById('boardWidth').value;
        turnCounter = HEIGHT * WIDTH;
        setPlayerColors();
        makeBoard(board);
        fade(gameTitle)
        fade(form);
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
function makeBoard(arr) {
    // Erase any existing array contents
    while (arr.length > 0) {
        arr.pop();
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

// Make target change to player color when hovered over
function onHover(actionTarget) {
    actionTarget.addEventListener("mouseover", e => e.target.style.backgroundColor = currColor);
    actionTarget.addEventListener("mouseout", e => e.target.style.backgroundColor = '');
};

// Call handleClick when target is clicked
function onClick(actionTarget) {
    actionTarget.addEventListener("click", handleClick);
};

// Adjust board feet spacing for board width
function adjustFeetSpacing() {
    const feet = document.getElementById('board-feet').children;
    feet[0].style.marginRight = '30%';
    feet[1].style.marginLeft = '30%';
}

// Generate top row for dropping pieces into the board
function makeTop() {
    const top = document.createElement("tr");
    onHover(top);
    onClick(top); // Add (WIDTH) cells to the board top and give them sequential numeric IDs
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoardTop.append(top);
}

// Generate main board where pieces will be held
function makeMainBoard() {
    // Add (HEIGHT) rows to the board with (WIDTH) cells/columns each
    // and give each cell an ID corresonding to its location ('row-col')
    for (let y = 0; y < HEIGHT; y++) {
        const row = document.createElement("tr");
        for (let x = 0; x < WIDTH; x++) {
            const cell = document.createElement("td");
            cell.setAttribute("id", `${y}-${x}`);
            row.append(cell);
        }
        htmlBoard.append(row);
    }
}


// Make the UI board
function makeHtmlBoard() {
    // Remove any previous board contents
    clearBoard(htmlBoardTop);
    clearBoard(htmlBoard);
    // Add a table row on top for the players to drop their pieces in
    // and triggers the handleClick function when clicked.
    makeTop();
    makeMainBoard();
    adjustFeetSpacing();
    // Fade in game board
    setTimeout(() => {
        fade(gameBoard);
    }, 500);
};

// Locate the lowest empty space in column x
function findSpotForCol(x) {
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

// Insert a div into the correct table cell to create a player piece
function placeInTable(y, x) {
    const spot = document.getElementById(`${y}-${x}`);
    spot.innerHTML = `<div></div>`;
    spot.firstChild.style.backgroundColor = `${currColor}`;
    spot.firstChild.classList.add('piece');
};

// Change the active player
function changePlayer(dropSpot) {
    if (currPlayer == 1) {
        currPlayer = 2;
        currColor = pColor2;
    } else {
        currPlayer = 1;
        currColor = pColor1;
    }
    dropSpot.target.style.backgroundColor = currColor; // Change hover color to next player's color
};

// Reset variables in preperation for a new game and adjusts visibiity of elements
function resetGame() {
    setTimeout(() => { // <---make method
        document.getElementById('endgame-overlay').style.display = "none";
        gameBoard.style.display = 'none';
        form.style.display = 'block';
    }, 300);
    setTimeout(() => { // <---make method
        endGamePopUp.style.display = "none";
        fade(htmlBoardTop)
        fade(form);
        setTitleColors();
    }, 1000);
    fade(endGamePopUp)
    fade(gameBoard);
    fade(gameTitle);
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
function handleClick(e) {

    // Get column number from ID of clicked cell and convert string number to int
    const x = +e.target.id;
    // Get lowest empty spot in specified column (if full, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }
    // Update JS board and place piece in HTML board
    board[y][x] = currPlayer;
    placeInTable(y, x);

    // Check for win
    if (checkForWin()) {
        e.target.style.backgroundColor = ''; // Remove current player color from last hovered cell
        return endGame(`Player ${currPlayer} won in ${Math.round(((WIDTH*HEIGHT) - turnCounter + 1)/2)} turns!`); // <---make method rather than inline***
    }

    // Check for tie game
    else if (turnCounter == 1) {
        currColor = '#666';
        e.target.style.backgroundColor = ''; // Remove current player color from last hovered cell
        return endGame('You both lose!');
    } else {
        turnCounter--;
    }

    changePlayer(e);
}

// Check for active player victory
function checkForWin() {
    function _win(cells) {
        // Check array and return all of the active player's controlled cells
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
            let horiz = [ // Condition for a horizontal win
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            let vert = [ // Condition for a vertical win
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            let diagDR = [ // Condition for a diagnoal win, downward to the right
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            let diagDL = [ // Condition for a diagonal win, downward to the left
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];
            // Use _win return to search current player's cells for the above conditions
            // and if any win conditions are true, return true
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                for (let i = 0; i < 4; i++) {
                    // Function for marking winning spots
                    const markWinners = (spot) => {
                        spot.style.width = '1rem';
                        spot.style.height = '1rem';
                        spot.style.border = `solid 2rem ${currColor}`;
                        spot.firstChild.style.backgroundColor = 'beige';
                    };
                    // Mark the pieces according to the first (top-left) instance of each win type
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
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const letters = gameTitle.children;
        const overlay = document.getElementById('endgame-overlay');
        // Manifests an overlay that prevents further play
        overlay.style.display = "block";
        overlay.style.height = `${winH}px`;
        // Manifests a button with victory message to reset game
        endGamePopUp.style.left = `${(winW/2) - (200)}px`;
        endGamePopUp.style.top = '6rem';
        endGamePopUp.style.display = 'block';
        endGamePopUp.innerText = `${msg}`;
        // Makes top/drop row invisible
        fade(htmlBoardTop);
        setTimeout(() => (fade(endGamePopUp)), 100);
        // Sets title letters to original body background color
        for (i = 0; i < letters.length; i++) {
            letters[i].style.color = 'beige';
        }
        // Sets the page background and message text to winning player's color
        endGamePopUp.style.color = currColor;
        body.style.backgroundColor = currColor;
        // Allows for game reset
        setTimeout(() => {
            endGamePopUp.innerText = 'Click For New Game';
            endGamePopUp.addEventListener('click', resetGame);
        }, 2000);
    }
}

// Announce game result
function endGame(msg) {
    let endGameMsg = new popUp();
    setTimeout(() => endGameMsg.render(msg), 200);
};

// Function for clearing the board for game reset
function clearBoard(toClear) {
    while (toClear.firstChild) {
        toClear.removeChild(toClear.lastChild);
    }
};