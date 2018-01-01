var assets =
[
    "fonts/upheavtt.ttf"
];

var backgroundColorIdx = 0;
var backgroundColors =
[
    "rgb(79, 128, 225)",    // Blue
    "rgb(57, 185, 75)",     // Green
    "rgb(151, 104, 209)",   // Purple
    "rgb(243, 163, 70)",    // Orange
    "rgb(255, 60, 60)",     // Red
];

var g = gaEngine(480, 480, onLoadComplete, assets);
g.start();

function onLoadComplete()
{
    g.canvas.style.backgroundColor = backgroundColors[backgroundColorIdx];
    g.interpolate = false;

    setState_Intro();
}

function changeBackgroundColor()
{
    backgroundColorIdx = (backgroundColorIdx + 1) % backgroundColors.length;
    g.canvas.style.backgroundColor = backgroundColors[backgroundColorIdx];
}