var assets =
[
    "fonts/upheavtt.ttf"
];

var g = gaEngine(480, 570, onLoadComplete, assets);
g.start();

function onLoadComplete()
{
    g.interpolate = false;

    setState_Playing();
}