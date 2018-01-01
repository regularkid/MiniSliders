var puzzle;

function createPuzzle()
{
    puzzle = g.group();
    puzzle.solved = false;
    puzzle.data = testPuzzle;
    puzzle.x = getDesiredPuzzlePos().x;
    puzzle.y = getDesiredPuzzlePos().y;
    
    createRows();
    createTitleText();
    createInstructionsText();

    shufflePuzzle();

    g.pointer.press = onPuzzlePress;
    g.pointer.release = onPuzzleRelease;
}

function createRows()
{
    puzzle.rows = [];

    for (var rowIndex = 0; rowIndex < getNumRows(); rowIndex++)
    {
        var row = g.group();
        row.rowIndex = rowIndex;
        row.isAttachedToMouse = false;
        row.x = getDesiredRowPos(rowIndex).x;
        row.y = getDesiredRowPos(rowIndex).y;

        puzzle.rows[rowIndex] = row;
        puzzle.addChild(row);

        createTiles(row);
    }
}

function createTiles(row)
{
    row.tiles = [];

    for (var colIndex = 0; colIndex < getNumCols(); colIndex++)
    {
        var color = getInitialTileColor(row.rowIndex, colIndex);
        var tile = g.rectangle(getTileSize(), getTileSize(), color, color, 0, getDesiredTilePos(colIndex).x, getDesiredTilePos(colIndex).y);
        tile.tileValue = getSolutionTileValue(row.rowIndex, colIndex);
        tile.shadowColor = "black";
        tile.shadowOffsetX = 3;
        tile.shadowOffsetY = 3;
        tile.shadowBlur = 0;

        row.tiles[colIndex] = tile;
        row.addChild(tile);
    }
}

function createTitleText()
{
    puzzle.titleText = g.text(puzzle.data.name, "50px upheavtt", "white", g.canvas.width / 2, 10);
    puzzle.titleText.shadow = true;
    puzzle.titleText.shadowColor = "black";
    puzzle.titleText.shadowOffsetX = 2;
    puzzle.titleText.shadowOffsetY = 2;
    puzzle.titleText.shadowBlur = 0;
    puzzle.titleText.textAlign = "center";
}

function createInstructionsText()
{
    puzzle.instructionsText = [];
    puzzle.instructionsText[0] = g.text("Slide all directions to put", "25px upheavtt", "white", g.canvas.width / 2, g.canvas.height - 55);
    puzzle.instructionsText[1] = g.text("the picture back together", "25px upheavtt", "white", g.canvas.width / 2, g.canvas.height - 35);

    puzzle.instructionsText.forEach(function(text)
    {
        text.shadow = true;
        text.shadowColor = "black";
        text.shadowOffsetX = 2;
        text.shadowOffsetY = 2;
        text.shadowBlur = 0;
        text.textAlign = "center";
    });
}

function destroyPuzzle()
{
    puzzle.instructionsText.forEach(function(text)
    {
        g.remove(text);
    });
    g.remove(puzzle.titleText);
    g.remove(puzzle);
    puzzle = undefined;
}

function updatePuzzle()
{
    puzzle.rows.forEach(function(row)
    {
        if (row.isAttachedToMouse)
        {
            row.x = g.pointer.x + row.mouseAttachOffsetX;
            row.y = g.pointer.y + row.mouseAttachOffsetY;
            
            if (row.rowIndex != getRowIndexFromYPos(row.gy))
            {
                setNewRowIndex(row, getRowIndexFromYPos(row.gy));
            }
            
            while (row.x < -getTileSize()*0.5)
            {
                shiftRowRight(row);
            }

            while (row.x > getTileSize()*0.5)
            {
                shiftRowLeft(row);
            }
        }
        else
        {
            tweenTowardsValue(row, "x", getDesiredRowPos(row.rowIndex).x);
            tweenTowardsValue(row, "y", getDesiredRowPos(row.rowIndex).y);

            row.tiles.forEach(function(tile, colIndex)
            {
                tweenTowardsValue(tile, "x", getDesiredTilePos(colIndex).x);
                tweenTowardsValue(tile, "y", getDesiredTilePos(colIndex).y);
                tweenTowardsValue(tile, "width", getTileSize());
                tweenTowardsValue(tile, "height", getTileSize());
            });
        }
    });

    tweenTowardsValue(puzzle, "x", getDesiredPuzzlePos().x);
    tweenTowardsValue(puzzle, "y", getDesiredPuzzlePos().y);
}

function onPuzzlePress()
{
    if (puzzle.solved)
    {
        destroyPuzzle();
        createPuzzle();
        changeBackgroundColor();        
    }
    else
    {
        puzzle.rows.forEach(function(row)
        {
            if (isPointerOverRow(row))
            {
                row.layer = 1;
                row.isAttachedToMouse = true;
                row.mouseAttachOffsetX = (row.gx - g.pointer.x) - puzzle.x;
                row.mouseAttachOffsetY = (row.gy - g.pointer.y) - puzzle.y;
                showRowShadow(row, true);
            }
            else
            {
                row.layer = 0;
            }
        });
    }
}

function onPuzzleRelease()
{
    puzzle.rows.forEach(function(row)
    {
        row.isAttachedToMouse = false;
        showRowShadow(row, false);
    });

    updateSolvedFlag();
}

function setNewRowIndex(row, newRowIndex)
{
    if (row.rowIndex > newRowIndex)
    {
        applyToRowRange(newRowIndex, row.rowIndex - 1, function(row){ row.rowIndex++; });
    }
    else
    {
        applyToRowRange(row.rowIndex + 1, newRowIndex, function(row){ row.rowIndex--; });
    }

    row.rowIndex = newRowIndex;
    puzzle.rows.sort((a, b) => a.rowIndex - b.rowIndex);
}

function shiftRowRight(row)
{
    applyToColRange(row, 1, row.tiles.length - 1, function(col, colIndex){ col.x = getDesiredTilePos(colIndex - 1).x; });
    row.tiles[0].x = getDesiredTilePos(row.tiles.length - 1).x;
    row.tiles.sort((a, b) => a.x - b.x);

    row.x += getTileSize();
    row.mouseAttachOffsetX += getTileSize();
}

function shiftRowLeft(row)
{
    applyToColRange(row, 0, row.tiles.length - 2, function(col, colIndex){ col.x = getDesiredTilePos(colIndex + 1).x; });
    row.tiles[row.tiles.length - 1].x = getDesiredTilePos(0).x;
    row.tiles.sort((a, b) => a.x - b.x);

    row.x -= getTileSize();
    row.mouseAttachOffsetX -= getTileSize();
}

function updateSolvedFlag()
{
    for (var rowIndex = 0; rowIndex < getNumRows(); rowIndex++)
    {
        for (var colIndex = 0; colIndex < getNumCols(); colIndex++)
        {
            var isPuzzleTileSet = getSolutionTileValue(rowIndex, colIndex) > 0;
            var isSolutionTileSet = getPuzzleTileValue(rowIndex, colIndex) > 0;
            if (isPuzzleTileSet != isSolutionTileSet)
            {
                puzzle.solved = false;
                return;
            }
        }
    }

    puzzle.solved = true;
}

function shufflePuzzle()
{
    puzzle.rows.forEach(function(row)
    {
        setNewRowIndex(row, Math.floor(Math.random() * (getNumRows() - 1)));

        var randomShiftAmount = Math.floor(Math.random() * (getNumCols() - 1));
        for (var i = 0; i < randomShiftAmount; i++)
        {
            shiftRowRight(row);
        }
    });

    puzzle.rows.forEach(function(row)
    {
        row.x = getDesiredRowPos(row.rowIndex).x;
        row.y = getDesiredRowPos(row.rowIndex).y;
    });
}