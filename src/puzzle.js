var puzzle;
var hint;

function createPuzzle()
{
    puzzle = g.group();
    puzzle.solved = true;
    puzzle.data = puzzles[getLevelIndex()];
    puzzle.x = getDesiredPuzzlePos().x;
    puzzle.y = getDesiredPuzzlePos().y;
    
    createRows();
    createTitleText();

    createHintImage();

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
        var tileValue = getSolutionTileValue(row.rowIndex, colIndex);
        var colorStr = getColorString(tileValue);
        var tile = g.rectangle(getTileSize(), getTileSize(), colorStr, colorStr, 0, getDesiredTilePos(colIndex).x, getDesiredTilePos(colIndex).y);
        tile.tileValue = tileValue;
        addShadowToObject(tile);
        tile.shadow = false;

        row.tiles[colIndex] = tile;
        row.addChild(tile);
    }
}

function createTitleText()
{
    puzzle.titleText = g.text(puzzle.data.name, "50px upheavtt", "white", g.canvas.width / 2, 15);
    setRenderLayer(puzzle.titleText, Layers.Top);
    addShadowToObject(puzzle.titleText);
    centerTextObject(puzzle.titleText);
}

function createHintImage()
{
    var hintTileSize = 8;

    hint = g.group();
    for (var rowIndex = 0; rowIndex < getNumRows(); rowIndex++)
    {
        for (var colIndex = 0; colIndex < getNumCols(); colIndex++)
        {
            var tileValue = getSolutionTileValue(rowIndex, colIndex);
            var colorStr = getColorString(tileValue);
            var tile = g.rectangle(hintTileSize, hintTileSize, colorStr, colorStr, 0, colIndex * hintTileSize, rowIndex * hintTileSize);
            hint.addChild(tile);
        }
    }

    hint.x = (g.canvas.width - getNumCols()*hintTileSize) / 2;
    hint.y = 65;
}

function destroyPuzzle()
{
    g.remove(puzzle.titleText);
    g.remove(hint);
    g.remove(puzzle);

    puzzle = undefined;
    hint = undefined;
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

    hint.visible = easyMode && !puzzle.solved;
}

function onPuzzlePress()
{
    if (puzzle.solved)
    {
        increaseLevelIndex();
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
                row.isAttachedToMouse = true;
                row.mouseAttachOffsetX = (row.gx - g.pointer.x) - puzzle.x;
                row.mouseAttachOffsetY = (row.gy - g.pointer.y) - puzzle.y;
                showRowShadow(row, true);
                setRenderLayer(row, Layers.Middle);
            }
            else
            {
                setRenderLayer(row, Layers.Bottom);
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
            var puzzleValue = getPuzzleTileValue(rowIndex, colIndex);
            var solutionValue = getSolutionTileValue(rowIndex, colIndex);

            if (puzzleValue != solutionValue)
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
    while (puzzle.solved)
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

        updateSolvedFlag();
    }
}