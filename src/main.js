var assets =
[
    "fonts/upheavtt.ttf"
];

var g = gaEngine(480, 640, onLoadComplete, assets);
g.start();

function onLoadComplete()
{
    g.interpolate = false;

    setState_Playing();
}