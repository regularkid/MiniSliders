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
    puzzle.xSize = (puzzle.numCols * puzzle.tileSize) + ((puzzle.numCols - 1) * spacing);
    puzzle.ySize = (puzzle.numRows * puzzle.tileSize) + ((puzzle.numRows - 1) * spacing);
    puzzle.x = (g.canvas.width - puzzle.xSize) / 2;
    puzzle.y = (g.canvas.height - puzzle.ySize) / 2;
    puzzle.rows = [];

    for (var rowIndex = 0; rowIndex < puzzle.numRows; rowIndex++)
    {
        var puzzleRow = g.group();
        puzzleRow.x = 0;
        puzzleRow.y = rowIndex * (puzzle.tileSize + spacing);
        puzzleRow.isAttachedToMouse = false;
        puzzleRow.rowIndex = rowIndex;
        puzzleRow.ySize = puzzle.tileSize + spacing;
        puzzleRow.tiles = [];
        puzzle.rows[rowIndex] = puzzleRow;
        puzzle.addChild(puzzleRow);

        for (var colIndex = 0; colIndex < puzzle.numCols; colIndex++)
        {
            var tile = puzzle.tileArray[rowIndex][colIndex];
            var color = tile != 0 ? "black" : "white";
            var x =colIndex * (puzzle.tileSize + spacing);
            var y = 0;

            var tile = g.rectangle(puzzle.tileSize, puzzle.tileSize, color, "white", 0, x, y);
            puzzleRow.tiles[colIndex] = tile;
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
            
            var desiredRowIndex = getRowIndexFromYPos(puzzleRow.gy);
            if (puzzleRow.rowIndex != desiredRowIndex)
            {
                setRowIndex(puzzleRow, desiredRowIndex);
            }
        }
        else
        {
            desiredPos = getDesiredRowPos(puzzleRow.rowIndex);
            puzzleRow.x += (desiredPos.x - puzzleRow.x) * 0.2;
            puzzleRow.y += (desiredPos.y - puzzleRow.y) * 0.2;
        }
    });
}

function getDesiredRowPos(rowIndex)
{
    pos = {};
    pos.x = 0;
    pos.y = rowIndex * (puzzle.tileSize + spacing);

    return pos;
}

function onPuzzlePress()
{
    puzzle.rows.forEach(function(puzzleRow)
    {
        if (g.pointer.x >= puzzleRow.gx && g.pointer.x < puzzleRow.gx + puzzle.xSize &&
            g.pointer.y >= puzzleRow.gy && g.pointer.y < puzzleRow.gy + puzzleRow.ySize)
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

function getRowIndexFromYPos(y)
{
    var rowIndex = Math.floor(((y + puzzle.tileSize*0.5) - puzzle.y) / (puzzle.tileSize + spacing));
    return Math.min(Math.max(rowIndex, 0), puzzle.numRows - 1);
}

function setRowIndex(puzzleRow, desiredRowIndex)
{
    if (puzzleRow.rowIndex > desiredRowIndex)
    {
        puzzle.rows.forEach(function(affectedPuzzleRow)
        {
            if (affectedPuzzleRow.rowIndex >= desiredRowIndex && affectedPuzzleRow.rowIndex < puzzleRow.rowIndex)
            {
                affectedPuzzleRow.rowIndex++;
            }
        });
    }
    else
    {
        puzzle.rows.forEach(function(affectedPuzzleRow)
        {
            if (affectedPuzzleRow.rowIndex <= desiredRowIndex && affectedPuzzleRow.rowIndex > puzzleRow.rowIndex)
            {
                affectedPuzzleRow.rowIndex--;
            }
        });
    }

    puzzleRow.rowIndex = desiredRowIndex;
}