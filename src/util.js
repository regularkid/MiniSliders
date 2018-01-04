// All of these assume puzzle (and other relevant data) is valid - tiny project with super tiny scope, so I can get away with this :)

function getNumRows()
{
    return puzzle.data.tiles.length;
}

function getNumCols()
{
    return puzzle.data.tiles[0].length;
}

function getPuzzleWidth()
{
    return (getNumCols() * getTileSize()) + ((getNumCols() - 1) * getTileSpacing());
}

function getPuzzleHeight()
{
    return (getNumRows() * getTileSize()) + ((getNumRows() - 1) * getTileSpacing());
}

function getTileSize()
{
    var desiredPuzzleSize = puzzle.solved ? g.canvas.width * 0.72 : g.canvas.width * 0.66;
    var maxTilesSpan = getNumRows() > getNumCols() ? getNumRows() : getNumCols();
    var totalSpacing = getTileSpacing() * (maxTilesSpan - 1);

    return (desiredPuzzleSize - totalSpacing) / maxTilesSpan;
}

function getTileSpacing()
{
    return puzzle.solved ? 0 : 5;
}

function getRowHeight()
{
    return getTileSize() + getTileSpacing();
}

function getDesiredPuzzlePos()
{
    // Note: using canvas width for y-pos as well becauase we pretend the canvas is perfectly square but actually
    // give the canvas more height so we have a little room at the bottom for UI
    return {x: (g.canvas.width - getPuzzleWidth()) / 2, y: (g.canvas.width - getPuzzleHeight()) / 2};
}

function getDesiredRowPos(rowIndex)
{
    return {x: 0, y: rowIndex * (getTileSize() + getTileSpacing())};
}

function getDesiredTilePos(colIndex)
{
    return {x: colIndex * (getTileSize() + getTileSpacing()), y: 0};
}

function getRowIndexFromYPos(y)
{
    var rowIndex = Math.floor(((y + getTileSize()*0.5) - puzzle.y) / (getTileSize() + getTileSpacing()));
    return Math.min(Math.max(rowIndex, 0), getNumRows() - 1);
}

function isPointerOverRow(row)
{
    return g.pointer.x >= row.gx && g.pointer.x < row.gx + getPuzzleWidth() &&
           g.pointer.y >= row.gy && g.pointer.y < row.gy + getRowHeight()
}

function addShadowToObject(obj)
{
    obj.shadow = true;
    obj.shadowColor = "black";
    obj.shadowOffsetX = 2;
    obj.shadowOffsetY = 2;
    obj.shadowBlur = 0;
}

function showRowShadow(row, show)
{
    row.tiles.forEach(function(tile)
    {
        tile.shadow = show;
    });
}

function applyToRowRange(startIndex, endIndex, func)
{
    for (var rowIndex = startIndex; rowIndex <= endIndex; rowIndex++)
    {
        func(puzzle.rows[rowIndex]);
    }
}

function applyToColRange(row, startIndex, endIndex, func)
{
    for (var colIndex = startIndex; colIndex <= endIndex; colIndex++)
    {
        func(row.tiles[colIndex], colIndex);
    }
}

function getSolutionTileValue(rowIndex, colIndex)
{
    return puzzle.data.tiles[rowIndex][colIndex];
}

function getPuzzleTileValue(rowIndex, colIndex)
{
    return puzzle.rows[rowIndex].tiles[colIndex].tileValue;
}

function getDesiredTileColor(rowIndex, colIndex)
{
    var tileValue = puzzle.solved ? getSolutionTileValue(rowIndex, colIndex) : getPuzzleTileValue(rowIndex, colIndex);
    if (tileValue > 0)
    {
        if (puzzle.solved || easyMode)
        {
            return puzzle.data.colors[tileValue];
        }
        else
        {
            return {r: 48, g: 48, b: 48};
        }
    }

    return {r: 255, g: 255, b: 255};
}

function getColorString(color)
{
    return "rgb(" + Math.floor(color.r) + "," + Math.floor(color.g) + "," + Math.floor(color.b) + ")";
}

function tweenTowardsValue(obj, valueName, desiredValue)
{
    obj[valueName] += (desiredValue - obj[valueName]) * 0.2;
}

function centerTextObject(text)
{
    text.textAlign = "center";
}

function getModeText()
{
    return easyMode ? "Easy Mode" : "Hard Mode";
}

var Layers =
{
    Bottom : 0,
    Middle: 1,
    Top : 2
};

function setRenderLayer(obj, layer)
{
    obj.layer = layer;    
}