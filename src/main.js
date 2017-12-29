var assets =
[
];

var g = gaEngine(480, 480, onLoadComplete, assets);
g.start();

function onLoadComplete()
{
    setState_Intro();
}