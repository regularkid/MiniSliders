var easyMode = true;
var backgroundColorIdx = -1;
var backgroundColors =
[
    "rgb(79, 128, 225)",    // Blue
    "rgb(57, 185, 75)",     // Green
    "rgb(151, 104, 209)",   // Purple
    "rgb(243, 163, 70)",    // Orange
    "rgb(255, 60, 60)",     // Red
];

function setState_Playing()
{
    initLevelIndex();
    changeBackgroundColor();
    createKeyBindings();
    createInstructionsText();
    createPuzzle();

    // DEBUG!
    g.key.upArrow.press = function()
    {
        increaseLevelIndex();
        destroyPuzzle();
        createPuzzle();
    };

    g.key.downArrow.press = function()
    {
        decreaseLevelIndex();
        destroyPuzzle();
        createPuzzle();
    };

    g.state = playing;
}

function playing()
{
    updatePuzzle();
}

function changeBackgroundColor()
{
    backgroundColorIdx = (backgroundColorIdx + 1) % backgroundColors.length;
    g.canvas.style.backgroundColor = backgroundColors[backgroundColorIdx];
}

function createKeyBindings()
{
    g.key.s = g.keyboard(83);
    g.key.s.press = toggleSound;

    g.key.h = g.keyboard(72);
    g.key.h.press = toggleEasyMode;
}

function createInstructionsText()
{
    var instructionsText = [];
    instructionsText[0] = g.text("Slide all directions to put", "25px upheavtt", "white", g.canvas.width / 2, 490);
    instructionsText[1] = g.text("the picture back together", "25px upheavtt", "white", g.canvas.width / 2, 510);
    instructionsText.forEach(function(text)
    {
        setRenderLayer(text, Layers.Top);
        centerTextObject(text);
        addShadowToObject(text);
    });

    var controlsText = [];
    controlsText[0] = g.text("Mouse - Slide puzzle", "25px upheavtt", "white", g.canvas.width / 2, 565);
    controlsText[1] = g.text("H - Toggle Hint Image", "25px upheavtt", "white", g.canvas.width / 2, 585);
    controlsText[2] = g.text("S - Toggle Sound", "25px upheavtt", "white", g.canvas.width / 2, 605);
    controlsText.forEach(function(text)
    {
        setRenderLayer(text, Layers.Top);
        centerTextObject(text);
        addShadowToObject(text);
    });
}

function toggleSound()
{

}

function toggleEasyMode()
{
    easyMode = !easyMode;
}