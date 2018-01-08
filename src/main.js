var assets =
[
    "fonts/upheavtt.ttf",
    "sounds/slideSquares.wav",
    "sounds/swapRow.wav",
    "sounds/newPuzzle.wav",
    "sounds/solved.wav"
];

var g = gaEngine(480, 640, onLoadComplete, assets);
g.start();

var slideSquaresSfx;
var swapRowSfx;
var newPuzzleSfx;
var solvedSfx;

function onLoadComplete()
{
    g.interpolate = false;

    slideSquaresSfx = g.sound("sounds/slideSquares.wav");
    swapRowSfx = g.sound("sounds/swapRow.wav");
    newPuzzleSfx = g.sound("sounds/newPuzzle.wav");
    solvedSfx = g.sound("sounds/solved.wav");

    setState_Playing();
}