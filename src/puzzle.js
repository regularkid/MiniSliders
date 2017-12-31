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
var tweenFactor = 0.2;

function createPuzzle()
{
    puzzle = g.group();
    puzzle.tileArray = testPuzzle;
    puzzle.numRows = puzzle.tileArray.length;
    puzzle.numCols = puzzle.tileArray[0].length;
    puzzle.desiredPuzzleSize = g.canvas.width * 0.66;
    puzzle.spacing = 5;
    calculateTileSize();
    puzzle.tileSizeOriginal = puzzle.tileSize;
    puzzle.xSize = (puzzle.numCols * puzzle.tileSize) + ((puzzle.numCols - 1) * puzzle.spacing);
    puzzle.ySize = (puzzle.numRows * puzzle.tileSize) + ((puzzle.numRows - 1) * puzzle.spacing);
    puzzle.x = (g.canvas.width - puzzle.xSize) / 2;
    puzzle.y = (g.canvas.height - puzzle.ySize) / 2;
    puzzle.solved = false;

    createRows();
    shufflePuzzle();

    g.pointer.press = onPuzzlePress;
    g.pointer.release = onPuzzleRelease;
}

function calculateTileSize()
{
    if (puzzle.numRows > puzzle.numCols)
    {
        var totalSpacing = puzzle.spacing * (puzzle.numRows - 1);
        puzzle.tileSize = (puzzle.desiredPuzzleSize - totalSpacing) / puzzle.numRows;
    }
    else
    {
        var totalSpacing = puzzle.spacing * (puzzle.numCols - 1);
        puzzle.tileSize = (puzzle.desiredPuzzleSize - totalSpacing) / puzzle.numCols;
    }
}

function createRows()
{
    puzzle.rows = [];

    for (var rowIndex = 0; rowIndex < puzzle.numRows; rowIndex++)
    {
        var row = g.group();
        row.y = rowIndex * (puzzle.tileSize + puzzle.spacing);
        row.ySize = puzzle.tileSize + puzzle.spacing;
        row.isAttachedToMouse = false;
        row.rowIndex = rowIndex;

        puzzle.rows[rowIndex] = row;
        puzzle.addChild(row);

        createRowTiles(row);
    }
}

function createRowTiles(row)
{
    row.tiles = [];

    for (var colIndex = 0; colIndex < puzzle.numCols; colIndex++)
    {
        var tileValue = puzzle.tileArray[row.rowIndex][colIndex];
        var color = tileValue != 0 ? "rgb(48, 48, 48)" : "rgb(255, 255, 255)";
        var x = colIndex * (puzzle.tileSize + puzzle.spacing);
        var y = 0;

        var tile = g.rectangle(puzzle.tileSize, puzzle.tileSize, color, color, 0, x, y);
        tile.tileValue = tileValue;
        tile.shadowColor = "rgb(0,0,0)";
        tile.shadowOffsetX = 3;
        tile.shadowOffsetY = 3;
        tile.shadowBlur = 0;

        row.tiles[colIndex] = tile;
        row.addChild(tile);
    }
}

function updatePuzzle()
{
    puzzle.rows.forEach(function(row)
    {
        if (row.isAttachedToMouse)
        {
            row.x = g.pointer.x + row.mouseAttachOffsetX;
            row.y = g.pointer.y + row.mouseAttachOffsetY;
            
            var desiredRowIndex = getRowIndexFromYPos(row.gy);
            if (row.rowIndex != desiredRowIndex)
            {
                setRowIndex(row, desiredRowIndex);
            }
            
            if (row.x < -puzzle.tileSize*0.5)
            {
                shiftRowRight(row);
            }
            else if (row.x > puzzle.tileSize*0.5)
            {
                shiftRowLeft(row);
            }
        }
        else
        {
            var desiredPos = getDesiredRowPos(row.rowIndex);
            row.x += (desiredPos.x - row.x) * tweenFactor;
            row.y += (desiredPos.y - row.y) * tweenFactor;

            for (var colIndex = 0; colIndex < puzzle.numCols; colIndex++)
            {
                var tile = row.tiles[colIndex];

                desiredPos = getDesiredTilePos(colIndex);
                tile.x += (desiredPos.x - tile.x) * tweenFactor;
                tile.y += (desiredPos.y - tile.y) * tweenFactor;
                tile.width += (puzzle.tileSize - tile.width) * tweenFactor;
                tile.height += (puzzle.tileSize - tile.height) * tweenFactor;
            }
        }
    });

    var desiredPos = getDesiredPuzzlePos();
    puzzle.x += (desiredPos.x - puzzle.x) * tweenFactor;
    puzzle.y += (desiredPos.y - puzzle.y) * tweenFactor;
}

function getDesiredPuzzlePos()
{
    puzzle.xSize = (puzzle.numCols * puzzle.tileSize) + ((puzzle.numCols - 1) * puzzle.spacing);
    puzzle.ySize = (puzzle.numRows * puzzle.tileSize) + ((puzzle.numRows - 1) * puzzle.spacing);

    var pos = {};
    pos.x = (g.canvas.width - puzzle.xSize) / 2;
    pos.y = (g.canvas.height - puzzle.ySize) / 2;

    return pos;
}

function getDesiredRowPos(rowIndex)
{
    var pos = {};
    pos.x = 0;
    pos.y = rowIndex * (puzzle.tileSize + puzzle.spacing);

    return pos;
}

function getDesiredTilePos(colIndex)
{
    var pos = {};
    pos.x = colIndex * (puzzle.tileSize + puzzle.spacing);
    pos.y = 0;

    return pos;
}

function onPuzzlePress()
{
    puzzle.rows.forEach(function(row)
    {
        if (g.pointer.x >= row.gx && g.pointer.x < row.gx + puzzle.xSize &&
            g.pointer.y >= row.gy && g.pointer.y < row.gy + row.ySize)
        {
            row.mouseAttachOffsetX = (row.gx - g.pointer.x) - puzzle.x;
            row.mouseAttachOffsetY = (row.gy - g.pointer.y) - puzzle.y;
            row.layer = 1;
            row.isAttachedToMouse = true;

            row.tiles.forEach(function(tile)
            {
                tile.shadow = true;
            });
        }
        else
        {
            row.layer = 0;
        }
    });
}

function onPuzzleRelease()
{
    puzzle.rows.forEach(function(row)
    {
        row.isAttachedToMouse = false;

        row.tiles.forEach(function(tile)
        {
            tile.shadow = false;
        });
    });

    checkIfSolved();
}

function getRowIndexFromYPos(y)
{
    var rowIndex = Math.floor(((y + puzzle.tileSize*0.5) - puzzle.y) / (puzzle.tileSize + puzzle.spacing));
    return Math.min(Math.max(rowIndex, 0), puzzle.numRows - 1);
}

function setRowIndex(row, desiredRowIndex)
{
    if (row.rowIndex > desiredRowIndex)
    {
        puzzle.rows.forEach(function(affectedPuzzleRow)
        {
            if (affectedPuzzleRow.rowIndex >= desiredRowIndex && affectedPuzzleRow.rowIndex < row.rowIndex)
            {
                affectedPuzzleRow.rowIndex++;
            }
        });
    }
    else
    {
        puzzle.rows.forEach(function(affectedPuzzleRow)
        {
            if (affectedPuzzleRow.rowIndex <= desiredRowIndex && affectedPuzzleRow.rowIndex > row.rowIndex)
            {
                affectedPuzzleRow.rowIndex--;
            }
        });
    }

    row.rowIndex = desiredRowIndex;
    puzzle.rows.sort((a, b) => a.rowIndex - b.rowIndex);
}

function shiftRowRight(row)
{
    row.tiles[0].x += (puzzle.tileSize + puzzle.spacing) * (puzzle.numCols - 1);
    for (var colIndex = 1; colIndex < row.tiles.length; colIndex++)
    {
        row.tiles[colIndex].x -= (puzzle.tileSize + puzzle.spacing);
    }
    row.tiles.sort((a, b) => a.x - b.x);

    row.x += puzzle.tileSize;
    row.mouseAttachOffsetX += puzzle.tileSize;
}

function shiftRowLeft(row)
{
    row.tiles[row.tiles.length - 1].x -= (puzzle.tileSize + puzzle.spacing) * (puzzle.numCols - 1);
    for (var colIndex = 0; colIndex < row.tiles.length - 1; colIndex++)
    {
        row.tiles[colIndex].x += (puzzle.tileSize + puzzle.spacing);
    }
    row.tiles.sort((a, b) => a.x - b.x);

    row.x -= puzzle.tileSize;
    row.mouseAttachOffsetX -= puzzle.tileSize;
}

function checkIfSolved()
{
    for (var rowIndex = 0; rowIndex < puzzle.numRows; rowIndex++)
    {
        for (var colIndex = 0; colIndex < puzzle.numCols; colIndex++)
        {
            var puzzleTileSet = puzzle.rows[rowIndex].tiles[colIndex].tileValue > 0;
            var solutionTileSet = puzzle.tileArray[rowIndex][colIndex] > 0;
            if (puzzleTileSet != solutionTileSet)
            {
                puzzle.solved = false;
                puzzle.spacing = 5;
                puzzle.tileSize = puzzle.tileSizeOriginal;
                return;
            }
        }
    }

    puzzle.solved = true;
    puzzle.desiredPuzzleSize = g.canvas.width * 0.75;
    puzzle.spacing = 0;
    calculateTileSize();
}

function shufflePuzzle()
{
    puzzle.rows.forEach(function(row)
    {
        setRowIndex(row, Math.floor(Math.random() * (puzzle.numRows - 1)));

        var randomShiftAmount = Math.floor(Math.random() * (puzzle.numCols - 1));
        for (var i = 0; i < randomShiftAmount; i++)
        {
            shiftRowRight(row);
        }
    });

    puzzle.rows.forEach(function(row)
    {
        desiredPos = getDesiredRowPos(row.rowIndex);
        row.x = desiredPos.x;
        row.y = desiredPos.y;
    });
}