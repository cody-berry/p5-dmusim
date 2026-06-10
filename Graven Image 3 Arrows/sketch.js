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
let pressedButton
let won
let failed


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

    if (!localStorage.getItem("wins")) {
        localStorage.setItem("wins", "0")
    } if (!localStorage.getItem("wipes")) {
        localStorage.setItem("wipes", "0")
    } if (!localStorage.getItem("streak")) {
        localStorage.setItem("streak", "0")
    }
}


function draw() {
    background(0, 0, 0)

    textSize(20)
    drawButton(width/2 - 210 - 25, height/2 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressLeftButton" : "")
    drawButton(width/2 - 210 - 25, height/2 - 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressTopleftButton" : "")
    drawButton(width/2 - 25, height/2 - 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressTopButton" : "")
    drawButton(width/2 + 210 - 25, height/2 - 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressToprightButton" : "")
    drawButton(width/2 + 210 - 25, height/2 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressRightButton" : "")
    drawButton(width/2 + 210 - 25, height/2 + 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressBottomrightButton" : "")
    drawButton(width/2 - 25, height/2 + 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressBottomButton" : "")
    drawButton(width/2 - 210 - 25, height/2 + 210 - 25, [120, 80, 50], [120, 80, 70], [120, 80, 75 + sin(frameCount/20)*3], [0, 0, 100], "", 12, 25, 12, 25, 5, 5, 5, 5, !imageRevealed ? "pressBottomleftButton" : "")

    // display the arrows diagram
    tint(0, 0, 100, 0)
    if (imageRevealed) {
        tint(0, 0, 100, map(millis() - imageRevealed, 0, 500, 0, 100, true))
    }
    image(arrowDiagram, width/2, height/2, width, height)


    blendMode(ADD)
    if (pressedButton === configuration) {
        fill(120, 100, 100, 0)
        if (imageRevealed) {
            fill(120, 100, 100, map(millis() - imageRevealed, 0, 500, 0, 30, true))
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
    }
    else {
        fill(0, 0, 100, 0)
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
        fill(330, 100, 100, 0)
        if (imageRevealed) {
            fill(330, 100, 100, map(millis() - imageRevealed, 0, 500, 0, 30, true))
        }
        switch (pressedButton) {
            case 0: rect(130, 346, 115, 210, 20); break
            case 1: rect(130, 130, 115, 215, 20); break
            case 2: rect(243, 135, 214, 115, 20); break
            case 3: rect(455, 135, 215, 113, 20); break
            case 4: rect(555, 247, 115, 210, 20); break
            case 5: rect(554, 458, 115, 213, 20); break
            case 6: rect(343, 555, 212, 116, 20); break
            case 7: rect(130, 555, 212, 115, 20); break
        }
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
    drawButton(width/2-textWidth("Reset")-70, height/2-textAscent()/2-textDescent()/2-5-120, [120, 50, 25], [120, 50, 50], [120, 50, 60+sin(frameCount/20)*3], [0, 0, 100], "Reset", 5, 30, 5, 30, 5, 5, 5, 5, "setupMechanic")
    drawButton(width/2+10, height/2-textAscent()/2-textDescent()/2-5-120, [350, 50, 25], [350, 50, 50], [350, 50, 60+sin(frameCount/20)*3], [0, 0, 100], "Help me!", 5, 15, 5, 15, 5, 5, 5, 5, "showDiagram")



    textSize(40)
    if (won) {
        fill(120, 100, 100)
        noStroke()
        textAlign(CENTER, CENTER)
        text("PASS", width/2, height/2-75)
    } else if (failed) {
        fill(350, 60, 100)
        noStroke()
        textAlign(CENTER, CENTER)
        text("FAILED", width/2, height/2-75)
    } else {
        textSize(20)
        fill(0, 0, 100)
        noStroke()
        textAlign(CENTER, CENTER)
        text("Click the button in the cardinal\nor intercardinal you should" +
            " go to.", width/2, height/2-75)
    }

    noStroke()
    fill(0, 0, 100)
    textSize(20)
    text("Wins: " + localStorage.getItem("wins") +
        "\nStreak: " + localStorage.getItem("streak") +
        "\nWipes: " + localStorage.getItem("wipes")
        , width/2, height/2+105)

    mousePressedLastFrame = mouseIsPressed

    // /* debugCorner needs to be last so its z-index is highest */
    // debugCorner.setText(`frameCount: ${frameCount}`, 2)
    // debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.showBottom()
    //
    // if (frameCount > 3000)
    //     noLoop()
}

function pressLeftButton() {
    imageRevealed = millis()
    pressedButton = 0
    if (pressedButton === configuration) win()
    else fail()
}

function pressTopleftButton() {
    imageRevealed = millis()
    pressedButton = 1
    if (pressedButton === configuration) win()
    else fail()
}

function pressTopButton() {
    imageRevealed = millis()
    pressedButton = 2
    if (pressedButton === configuration) win()
    else fail()
}

function pressToprightButton() {
    imageRevealed = millis()
    pressedButton = 3
    if (pressedButton === configuration) win()
    else fail()
}

function pressRightButton() {
    imageRevealed = millis()
    pressedButton = 4
    if (pressedButton === configuration) win()
    else fail()
}

function pressBottomrightButton() {
    imageRevealed = millis()
    pressedButton = 5
    if (pressedButton === configuration) win()
    else fail()
}

function pressBottomButton() {
    imageRevealed = millis()
    pressedButton = 6
    if (pressedButton === configuration) win()
    else fail()
}

function pressBottomleftButton() {
    imageRevealed = millis()
    pressedButton = 7
    if (pressedButton === configuration) win()
    else fail()
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
    won = false
    failed = false
    leftDebuffFirst = random([false, true])
}

function showDiagram() {
    if (!imageRevealed) imageRevealed = millis()
    pressedButton = 8
    fail()
}

function win() {
    won = true
    localStorage.setItem("wins", str(int(localStorage.getItem("wins")) + 1))
    localStorage.setItem("streak", str(int(localStorage.getItem("streak")) + 1))
}

function fail() {
    failed = true
    localStorage.setItem("wipes", str(int(localStorage.getItem("wipes")) + 1))
    localStorage.setItem("streak", "0")
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