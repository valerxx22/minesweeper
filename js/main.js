var tableBoard;
var mineNumb;
var totalCell;
var cellValues;

var clickHandler = clickHandler;
var rightClickHandler = rightClickHandler;

var timeStarted = false;
var gameOver = false;

$('#runGame').on('click', function () {
    runGame();
});

var Stopwatch = (function () {
    var s = null, resetInterval;
    var start = function () {
        clearInterval(resetInterval);
        s = {
            stop: 0,
            sw: document.querySelectorAll(".stopwatch")[0],
            mills: 0,
            secs: 0,
            mins: 0,
            i: 1,
            times: ["00:00:00"]
        };
        resetInterval = setInterval(timer, 1);
    };
    var stop = function () {
        if (!s) {
            s = {
                stop: 0,
                sw: document.querySelectorAll(".stopwatch")[0],
                mills: 0,
                secs: 0,
                mins: 0,
                i: 1,
                times: ["00:00:00"]
            };
        }
        s.stop = 1;
        clearInterval(resetInterval);
    };
    var timer = function () {
        if (s.stop === 0) {
            if (s.mills === 100) {
                s.secs++;
                s.mills = 0;
            }
            if (s.secs === 60) {
                s.mins++;
                s.secs = 0;
            }
            s.sw.innerHTML = ("0" + s.mins).slice(-2) + ":" + ("0" + s.secs).slice(-2) + ":" + ("0" + s.mills).slice(-2);
            s.mills++;
        }
    };
    var returnS = function () {
        return s;
    };
    return {
        start: start,
        stop: stop,
        s: returnS
    }
})();

function runGame() {
    tableBoard = parseInt(document.forms["myForm"]["table"].value);
    mineNumb = parseInt(document.forms["myForm"]["mineNumb"].value);
    totalCell = parseInt(tableBoard * tableBoard);

    cellValues = fillCells(mineNumb, totalCell)

    countNeighboor(cellValues);
    createTable(0, cellValues);

    clickHandler();
    rightClickHandler();

    timeStarted = false;
    gameOver = false;
    Stopwatch.stop();
    Stopwatch.s().sw.innerHTML = "00:00:00";


}

var countNeighboor = function countNeighboor(cellValues) {
    var len = Math.sqrt(cellValues.length);
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len; j++) {
            var index = i * len + j;
            var count = 0;
            if (cellValues[index] == '*') {
                continue;
            }

            if (i - 1 >= 0 && j - 1 >= 0 && i - 1 < len && j - 1 < len && cellValues[(i - 1) * len + (j - 1)] == '*') {
                count++;
            }
            if (i - 1 >= 0 && j >= 0 && i - 1 < len && j < len && cellValues[(i - 1) * len + (j)] == '*') {
                count++;
            }
            if (i - 1 >= 0 && j + 1 >= 0 && i - 1 < len && j + 1 < len && cellValues[(i - 1) * len + (j + 1)] == '*') {
                count++;
            }
            if (i >= 0 && j - 1 >= 0 && i < len && j - 1 < len && cellValues[(i) * len + (j - 1)] == '*') {
                count++;
            }
            //if (i && j) { }
            if (i >= 0 && j + 1 >= 0 && i < len && j + 1 < len && cellValues[(i) * len + (j + 1)] == '*') {
                count++;
            }
            if (i + 1 >= 0 && j - 1 >= 0 && i + 1 < len && j - 1 < len && cellValues[(i + 1) * len + (j - 1)] == '*') {
                count++;
            }
            if (i + 1 >= 0 && j >= 0 && i + 1 < len && j < len && cellValues[(i + 1) * len + (j)] == '*') {
                count++;
            }
            if (i + 1 >= 0 && j + 1 >= 0 && i + 1 < len && j + 1 < len && cellValues[(i + 1) * len + (j + 1)] == '*') {
                count++;
            }

            cellValues[index] = count;

        }
    }
}

function floodFill(mapData, x, y) {
    var mapWidth = Math.sqrt(mapData.length);
    var currentCell = $('[data-x="' + x + '"][data-y="' + y + '"]');
    if (x < 0 || y < 0 || x >= mapWidth || y >= mapWidth) {
        return;
    } else if (currentCell.hasClass('cell-safe')) {
        return;
    } else if (!currentCell.hasClass('cell-safe') && currentCell.html() > 0) {
        currentCell.addClass('cell-safe cell-safe-numb').css('opacity', '1');
        return;
    }
    if (currentCell.html() == 0) {
        for (var neighborX = x - 1; neighborX <= x + 1; neighborX += 2) {
            if (neighborX < 0 || neighborX >= mapWidth) {
                continue;
            }
            for (var neighborY = y - 1; neighborY <= y + 1; neighborY += 2) {
                if (neighborY < 0 || neighborY >= mapWidth) {
                    continue;
                }
                var diagonalCell = $('[data-x="' + neighborX + '"][data-y="' + neighborY + '"]')
                if (diagonalCell.html() > 0 && !diagonalCell.hasClass('cell-safe')) {
                    diagonalCell.addClass('cell-safe cell-safe-numb').css('opacity', '1');
                }
            }
        }
    }

    currentCell.addClass('cell-safe');

    if (x > 0) { // left
        floodFill(mapData, x - 1, y);
    }
    if (y > 0) { // up
        floodFill(mapData, x, y - 1);
    }
    if (x < mapWidth - 1) { // right
        floodFill(mapData, x + 1, y);
    }
    if (y < mapWidth - 1) { // down
        floodFill(mapData, x, y + 1);
    }
}

var createTable = function createTable(tableParam, cellValues) {
    var gameStatus = document.getElementById('gameStatus');
    gameStatus.innerHTML = ''; // reset
    //finding myContainer
    var myContainer = document.getElementById('myContainer');
    myContainer.innerHTML = '';	// reset
    //creating element <table>
    var myTable = document.createElement('table');
    //creating element <tbody>
    var myTbody = document.createElement('tbody');
    //validation
    if (mineNumb < 0 || tableBoard < 0) {
        myContainer.innerHTML = '<span>Please use a positive number.</span>';
    }
    //validation
    else if (mineNumb < totalCell) {
        //cells creation
        for (var i = 0; i < tableBoard; i++) {
            //creating <tr> element
            var myTr = document.createElement('tr');
            myTr.setAttribute('class', 'tblCells');
            for (var j = 0; j < tableBoard; j++) {
                //creating <td> element
                var myTd = document.createElement('td');
                myTd.setAttribute('data-x', i);
                myTd.setAttribute('data-y', j);

                // myTd.innerHTML = tableParam;
                if (cellValues[i * tableBoard + j] != 0) {
                    myTd.innerHTML = cellValues[i * tableBoard + j].toString();
                }
                //put <td> after <tr> element
                myTr.appendChild(myTd);
            }
            //put <tr> after <tbody> element
            myTbody.appendChild(myTr);
            //put <tbody> after <table> element
            myTable.appendChild(myTbody);
            //put <table> after <div> element
            myContainer.appendChild(myTable);

        }
    } else {
        myContainer.innerHTML = '<span>Please setup less mines then cells</span>';
    }
}

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function fillCells(value, len) {
    var arr = [];
    for (var i = 0; i < len; i++) {
        if (i < value) {
            arr.push('*');
        } else {
            arr.push('0');
        }
    }
    shuffle(arr);
    return arr;
}


function rightClickHandler() {
    $('td').on('contextmenu', function (e) {
        var self = $(this);
        e.preventDefault();
        if (self.hasClass('cell-safe') === false && !gameOver) {
            //e.preventDefault();
            self.toggleClass('flag-bomb');
            console.log('bomb flag');
            return false;
        } else {
            e.preventDefault();
        }
    });
}

function clickHandler() {
    $('td').click(function (e) {
        var gameStatus = document.getElementById('gameStatus');
        var self = $(this);
        var x = self.data('x');
        var y = self.data('y');
        var checkTd = self.html();

        if (!timeStarted) {
            Stopwatch.start();
            timeStarted = true;
        }

        if (checkTd == '*' && !self.hasClass('flag-bomb')) {
            var isBomb = $('td').filter(function () {
                return $(this).text() == '*';
            });
            self.addClass('cell-bomb-active');
            isBomb.removeClass('flag-bomb').addClass('cell-bomb').off();
            gameStatus.innerHTML = '<h1 class="game-over">Game Over</h1> <br> <input type="button" class="button button-hover" value="Try Again" onclick="runGame()">';
            gameOver = true;
            Stopwatch.stop();
            $('td').off('click');
        } else if (self.hasClass('flag-bomb') === true) {
            e.preventDefault();
            return false;
        } else {
            floodFill(cellValues, x, y);
            $('.cell-safe').removeClass('flag-bomb');
        }
        var findSafeCells = parseInt(document.getElementsByClassName("cell-safe").length);
        if (totalCell - findSafeCells === mineNumb) {
            gameStatus.innerHTML = '<h1 class="game-over">You win!</h1> <br> <input type="button" class="button button-hover" value="Start Over" onclick="runGame()">';
            gameOver = true;
            Stopwatch.stop();
            $('td').off('click');
        }
    });
}
