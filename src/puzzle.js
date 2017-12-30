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

function drawPuzzle()
{
    var numRows = testPuzzle.length;
    var numCols = testPuzzle[0].length;
    var desiredPuzzleSize = g.canvas.width * 0.66;
    var tileSize = numRows > numCols ? desiredPuzzleSize / numRows : desiredPuzzleSize / numCols;
    var spacing = 2;
    var puzzleWidth = (numCols * tileSize) + ((numCols - 1) * spacing);
    var puzzleHeight = (numRows * tileSize) + ((numRows - 1) * spacing);
    var xStart = (g.canvas.width - puzzleWidth) / 2;
    var yStart = (g.canvas.height - puzzleHeight) / 2;

    for (var row = 0; row < numRows; row++)
    {
        for (var col = 0; col < numCols; col++)
        {
            var tile = testPuzzle[row][col];
            var x = xStart + (col * (tileSize + spacing));
            var y = yStart + (row * (tileSize + spacing));

            g.rectangle(tileSize, tileSize, tile != 0 ? "black" : "white", "white", 0, x, y);
        }
    }
}