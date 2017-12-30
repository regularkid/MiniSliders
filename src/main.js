var assets =
[
];

var g = gaEngine(480, 480, onLoadComplete);//, assets);
g.start();

function onLoadComplete()
{
    g.canvas.style.backgroundColor = "gray";

    drawPuzzle();

    setState_Intro();
}