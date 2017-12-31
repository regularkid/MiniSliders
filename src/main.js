var assets =
[
];

var g = gaEngine(480, 480, onLoadComplete);//, assets);
g.start();

function onLoadComplete()
{
    g.canvas.style.backgroundColor = "rgb(79, 179, 225)";
    g.interpolate = false;

    setState_Intro();
}