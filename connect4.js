/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let turnCounter = WIDTH * HEIGHT;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

// Sets "board" to empty HEIGHT x WIDTH matrix array
const makeBoard = arr => {
    for (let i = 0; i < HEIGHT; i++) {
        let row = [];
        for (let i = 0; i < WIDTH; i++) {
            row.push(null);
        }
        arr.push(row);
    }
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
    // Gets "htmlBoard" variable from the item in HTML w/ID of "board"
    const htmlBoard = document.getElementById('board');
    // Adds a table row on top for the players to drop their pieces in
    // and triggers the handleClick function when a spot is clicked.
    var top = document.createElement("tr");
    top.setAttribute("id", "column-top");
    top.addEventListener("click", handleClick);
    top.addEventListener("mouseover", onHover);
    top.addEventListener("mouseout", e => e.target.style.backgroundColor = '');
    // Adds (WIDTH) cells to the top row and gives them sequential numeric IDs.
    for (let x = 0; x < WIDTH; x++) {
        const headCell = document.createElement("td");
        headCell.setAttribute("id", x);
        top.append(headCell);
    }
    htmlBoard.append(top);

    // Adds (HEIGHT) rows to the htmlboard with (WIDTH) cells/columns each.
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
}

function onHover(e) {
    if (currPlayer == 1) {
        e.target.style.backgroundColor = 'red';
    } else {
        e.target.style.backgroundColor = 'blue';
    }
};


/** findSpotForCol: given column x, return top empty y (null if filled) */
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

/** placeInTable: update DOM to place piece into HTML table of board */

// Inserts a div into the correct table cell to create a player piece
function placeInTable(y, x) {
    const spot = document.getElementById(`${y}-${x}`);
    spot.innerHTML = `<div></div>`;
    spot.firstChild.classList.add(`piece`, `p${currPlayer}`);
}

/** endGame: announce game end */

function endGame(msg) {
    setTimeout(() => alert(msg), 250);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = findSpotForCol(x);
    if (y === null) {
        return;
    }

    // place piece in board and add to HTML table
    board[y][x] = currPlayer; // Updates in-memory board
    placeInTable(y, x);

    // check for win
    if (checkForWin()) {
        evt.target.style.backgroundColor = '';
        return endGame(`Player ${currPlayer} won in ${Math.round(((WIDTH*HEIGHT) - turnCounter + 1)/2)} turns!`);
    }

    // Checks if all cells in board are filled; if so call, call endGame version 1
    // if (board.every(row => row.every(col => col != null))) {
    //  evt.target.style.backgroundColor = '';
    //        return endGame('You both lose!');
    // } else {
    //     turnCounter--;
    // }

    // Checks if all cells in board are filled; if so call, call endGame version 2
    if (turnCounter == 1) {
        evt.target.style.backgroundColor = '';
        return endGame('You both lose!');
    } else {
        turnCounter--;
    }

    // switch players
    if (currPlayer == 1) {
        currPlayer = 2;
    } else {
        currPlayer = 1;
    }
    onHover(evt);
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin(evt) {
    function _win(cells) {
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        // Gets all of the current player's cells by iterating through all
        // cells that belong to the current player
        return cells.every(
            ([y, x]) =>
            y >= 0 &&
            y < HEIGHT &&
            x >= 0 &&
            x < WIDTH &&
            board[y][x] === currPlayer
        );
    }

    // Check for win conditions
    for (var y = 0; y < HEIGHT; y++) {
        for (var x = 0; x < WIDTH; x++) {
            // Checks for a horizontal win
            var horiz = [
                [y, x],
                [y, x + 1],
                [y, x + 2],
                [y, x + 3]
            ];
            // Checks for a vertical win
            var vert = [
                [y, x],
                [y + 1, x],
                [y + 2, x],
                [y + 3, x]
            ];
            // Checks for a diagnoal win, downward to the right
            var diagDR = [
                [y, x],
                [y + 1, x + 1],
                [y + 2, x + 2],
                [y + 3, x + 3]
            ];
            // Checks for a diagonal win, downward to the left
            var diagDL = [
                [y, x],
                [y + 1, x - 1],
                [y + 2, x - 2],
                [y + 3, x - 3]
            ];
            // Uses _win return to check current player's cells for the above conditions.
            // If any win conditions are true, returns true.
            if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                return true;
            }
        }
    }
}

makeBoard(board);
makeHtmlBoard();