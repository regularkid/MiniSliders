var testPuzzle =
[
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,0,0,1,1,1,1],
    [1,1,1,1,0,0,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,0,0,0],
    
];

var puzzle;
var desiredPuzzleSize;
var spacing;

function createPuzzle()
{
    desiredPuzzleSize = g.canvas.width * 0.66;
    spacing = 2;

    puzzle = g.group();
    puzzle.tileArray = testPuzzle;
    puzzle.numRows = puzzle.tileArray.length;
    puzzle.numCols = puzzle.tileArray[0].length;
    puzzle.tileSize = puzzle.numRows > puzzle.numCols ? desiredPuzzleSize / puzzle.numRows : desiredPuzzleSize / puzzle.numCols;
    puzzle.puzzleWidth = (puzzle.numCols * puzzle.tileSize) + ((puzzle.numCols - 1) * spacing);
    puzzle.puzzleHeight = (puzzle.numRows * puzzle.tileSize) + ((puzzle.numRows - 1) * spacing);
    puzzle.x = (g.canvas.width - puzzle.puzzleWidth) / 2;
    puzzle.y = (g.canvas.height - puzzle.puzzleHeight) / 2;
    puzzle.rows = [];

    for (var row = 0; row < puzzle.numRows; row++)
    {
        var puzzleRow = g.group();
        puzzleRow.x = 0;
        puzzleRow.y = row * (puzzle.tileSize + spacing);
        puzzleRow.isAttachedToMouse = false;
        puzzleRow.row = row;
        puzzleRow.rowHeight = puzzle.tileSize + spacing;
        puzzleRow.tiles = [];
        puzzle.rows[row] = puzzleRow;
        puzzle.addChild(puzzleRow);

        for (var col = 0; col < puzzle.numCols; col++)
        {
            var tile = puzzle.tileArray[row][col];
            var color = tile != 0 ? "black" : "white";
            var x = col * (puzzle.tileSize + spacing);
            var y = 0;

            var tile = g.rectangle(puzzle.tileSize, puzzle.tileSize, color, "white", 0, x, y);
            puzzleRow.tiles[col] = tile;
            puzzleRow.addChild(tile);
        }
    }

    g.pointer.press = onPuzzlePress;
    g.pointer.release = onPuzzleRelease;
}

function updatePuzzle()
{
    puzzle.rows.forEach(function(puzzleRow)
    {
        if (puzzleRow.isAttachedToMouse)
        {
            puzzleRow.x = g.pointer.x + puzzleRow.mouseAttachOffsetX;
            puzzleRow.y = g.pointer.y + puzzleRow.mouseAttachOffsetY;
        }
        else
        {
            desiredPos = getDesiredRowPos(puzzleRow.row);
            puzzleRow.x += (desiredPos.x - puzzleRow.x) * 0.2;
            puzzleRow.y += (desiredPos.y - puzzleRow.y) * 0.2;
        }
    });
}

function getDesiredRowPos(row)
{
    pos = {};
    pos.x = 0;
    pos.y = row * (puzzle.tileSize + spacing);

    return pos;
}

function onPuzzlePress()
{
    puzzle.rows.forEach(function(puzzleRow)
    {
        if (g.pointer.x >= puzzleRow.gx && g.pointer.x < puzzleRow.gx + puzzle.puzzleWidth &&
            g.pointer.y >= puzzleRow.gy && g.pointer.y < puzzleRow.gy + puzzleRow.rowHeight)
        {
            puzzleRow.mouseAttachOffsetX = (puzzleRow.gx - g.pointer.x) - puzzle.x;
            puzzleRow.mouseAttachOffsetY = (puzzleRow.gy - g.pointer.y) - puzzle.y;
            puzzleRow.layer = 1;
            puzzleRow.isAttachedToMouse = true;
        }
        else
        {
            puzzleRow.layer = 0;
        }
    });
}

function onPuzzleRelease()
{
    puzzle.rows.forEach(function(puzzleRow)
    {
        puzzleRow.isAttachedToMouse = false;
    });
}