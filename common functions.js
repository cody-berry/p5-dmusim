let mousePressedLastFrame = false

function drawButton(leftX, topY, baseColor, buttonColor, buttonColorMouseover, textColor, contents, padtop, padright, padbottom, padleft, roundtl, roundtr, roundbr, roundbl, ifPressed) {
    let buttonWidth = textWidth(contents) + padleft + padright
    let buttonHeight = textAscent() + textDescent() + padtop + padbottom
    let hovered =
        leftX < mouseX && mouseX < leftX+buttonWidth &&
        topY < mouseY && mouseY < topY+buttonHeight
    print(hovered)
    noStroke()
    fill(...(hovered ? buttonColorMouseover : buttonColor))
    rect(leftX, topY, buttonWidth, buttonHeight, roundtl, roundtr, roundbr, roundbl)

    textAlign(CENTER, CENTER)
    fill(...textColor)
    text(contents, leftX+buttonWidth/2, topY+buttonHeight/2)

    if (hovered && mousePressedButNotHeldDown()) {
        let func = window[ifPressed];

        if (typeof func === "function") {
            func()
        }
    }
}

function mousePressedButNotHeldDown() {
    if (mouseIsPressed && !mousePressedLastFrame) return true
}