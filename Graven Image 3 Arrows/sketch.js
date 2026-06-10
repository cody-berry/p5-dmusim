/**
 *  @author 
 *  @date 2024.
 *
 */

let font
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let upArrow
let rightArrow
let downArrow
let leftArrow
let arrowDiagram
let attemptStarted = 0
let imageRevealed = false
let leftDebuff
let rightDebuff
let leftDebuffFirst = false
let configuration = 0


function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    upArrow = loadImage('data/up arrow.jpg')
    rightArrow = loadImage('data/right arrow.jpg')
    downArrow = loadImage('data/down arrow.jpg')
    leftArrow = loadImage('data/left arrow.jpg')
    arrowDiagram = loadImage('data/arrows diagram.png')
}


function setup() {
    let cnv = createCanvas(800, 800)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    setupMechanic()
    imageMode(CENTER)
    textAlign(CENTER, CENTER)
}


function draw() {
    background(0, 0, 0)

    // display the arrows diagram
    tint(0, 0, 100, 0)
    if (imageRevealed) {
        tint(0, 0, 100, map(millis() - imageRevealed, 0, 500, 0, 100, true))
    }
    image(arrowDiagram, width/2, height/2, width, height)


    fill(0, 0, 100, 0)
    blendMode(ADD)
    if (imageRevealed) {
        fill(0, 0, 100, map(millis() - imageRevealed, 0, 500, 0, 30, true))
    }
    switch (configuration) {
        case 0: rect(130, 346, 115, 210, 20); break
        case 1: rect(130, 130, 115, 215, 20); break
        case 2: rect(243, 135, 214, 115, 20); break
        case 3: rect(455, 135, 215, 113, 20); break
        case 4: rect(555, 247, 115, 210, 20); break
        case 5: rect(554, 458, 115, 213, 20); break
        case 6: rect(343, 555, 212, 116, 20); break
        case 7: rect(130, 555, 212, 115, 20); break
    }


    blendMode(BLEND)

    fill(0, 0, 0)
    noStroke()
    rect(width/2-150, height/2-150, 300, 300)
    rect(0, 0, width, 130)
    rect(width, 0, -130, height)
    rect(0, height, width, -130)
    rect(0, 0, 130, height)


    // display arrow debuffs
    tint(0, 0, 100, 100)
    fill(0, 0, 100)
    noStroke()
    textSize(40)

    let arrowToDisplay = {
        "up": upArrow,
        "right": rightArrow,
        "down": downArrow,
        "left": leftArrow
    }[leftDebuff]
    image(arrowToDisplay, width/2-50, height/2, 100, 100)
    text(leftDebuffFirst ? 10 : 7, width/2-50, height/2+50)

    arrowToDisplay = {
        "up": upArrow,
        "right": rightArrow,
        "down": downArrow,
        "left": leftArrow
    }[rightDebuff]
    image(arrowToDisplay, width/2+50, height/2, 100, 100)
    text(leftDebuffFirst ? 7 : 10, width/2+50, height/2+50)


    textSize(20)
    drawButton(width/2-textWidth("Reset")/2-30, height/2-textAscent()/2-textDescent()/2-5-100, [120, 50, 25], [120, 50, 50], [120, 50, 60+sin(frameCount/20)*3], [0, 0, 100], "Reset", 5, 30, 5, 30, 5, 5, 5, 5, "setupMechanic")
    drawButton(width/2-textWidth("Show diagram")/2-5, height/2-textAscent()/2-textDescent()/2-5+100, [160, 50, 25], [160, 50, 50], [160, 50, 60+sin(frameCount/20)*3], [0, 0, 100], "Show diagram", 5, 5, 5, 5, 5, 5, 5, 5, "showDiagram")

    mousePressedLastFrame = mouseIsPressed

    // /* debugCorner needs to be last so its z-index is highest */
    // debugCorner.setText(`frameCount: ${frameCount}`, 2)
    // debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.showBottom()
    //
    // if (frameCount > 3000)
    //     noLoop()
}

function setupMechanic() {
    attemptStarted = millis()
    imageRevealed = false

    let arrowPermutation = random([
        ["up", "up", 0],
        ["up", "right", 1],
        ["up", "right", 1],
        ["right", "right", 2],
        ["right", "down", 3],
        ["right", "down", 3],
        ["down", "down", 4],
        ["down", "left", 5],
        ["down", "left", 5],
        ["left", "left", 6],
        ["left", "up", 7],
        ["left", "up", 7],
    ])
    leftDebuff = arrowPermutation[0]
    rightDebuff = arrowPermutation[1]
    configuration = arrowPermutation[2]
    leftDebuffFirst = random([false, true])
}

function showDiagram() {
    if (!imageRevealed) imageRevealed = millis()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }

    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    showBottom() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */
            rect(
                0,
                height,
                width,
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            noStroke()
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}