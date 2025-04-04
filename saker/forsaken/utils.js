// this breaks spritesheets into accessible frames
export function getFramesPos(numOfCols, numOfRows, tileWidth, tileHeight) {
    const framesPos = [];
    let currentTileX = 0;
    let currentTileY = 0;
    for (let y = 0; y < numOfRows; y++) {
        for (let x = 0; x < numOfCols; x++) {
            framesPos.push({ x: currentTileX, y: currentTileY });
            currentTileX += tileWidth;
        }
        currentTileY += tileHeight;
        currentTileX = 0;
    } 
    return framesPos;
}


export function drawSprite(
    src,
    destinationX,
    destinationY,
    srcX,
    srcY,
    width,
    height
) {
    image(
        src,
        destinationX,
        destinationY,
        width,
        height,
        srcX,
        srcY,
        width,
        height
    );
}
