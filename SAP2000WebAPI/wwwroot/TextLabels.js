var DESCENDER_ADJUST = 1;        // Constant relating to text boarder box height for lables

function makeTextSprite( message, x, y, z, parameters ) 
{ 
    if ( parameters === undefined ) parameters = {}; 
     
    var fontface = parameters.hasOwnProperty("fontface") ?  
        parameters["fontface"] : "Arial"; 
     
    var fontsize = parameters.hasOwnProperty("fontsize") ?  
        parameters["fontsize"] : 28; 
     
    var borderThickness = parameters.hasOwnProperty("borderThickness") ?  
        parameters["borderThickness"] : undefined; //4; 
     
    var borderColor = parameters.hasOwnProperty("borderColor") ? 
        parameters["borderColor"] : undefined; //{ r:0, g:0, b:0, a:0.0 }; 
     
    var fillColor = parameters.hasOwnProperty("fillColor") ? 
        parameters["fillColor"] : undefined; 
 
    var textColor = parameters.hasOwnProperty("textColor") ? 
        parameters["textColor"] : { r:25, g:25, b:25, a:1.0 }; 
 
    var radius = parameters.hasOwnProperty("radius") ? 
                parameters["radius"] : undefined; // 6; 
 
    var vAlign = parameters.hasOwnProperty("vAlign") ? 
                        parameters["vAlign"] : "center"; 
 
    var hAlign = parameters.hasOwnProperty("hAlign") ? 
                        parameters["hAlign"] : "center"; 
 
    var canvas = document.createElement('canvas'); 
    var context = canvas.getContext('2d'); 
     
    // set a large-enough fixed-size canvas  
    canvas.width = 1800; 
    canvas.height = 900; 
     
    context.font = fontsize + "px " + fontface; 
    context.textBaseline = "alphabetic"; 
    context.textAlign = "left"; 
     
    // get size data (height depends only on font size) 
    var metrics = context.measureText( message ); 
    var textWidth = metrics.width; 
     
    /* 
    // need to ensure that our canvas is always large enough 
    // to support the borders and justification, if any 
    // Note that this will fail for vertical text (e.g. Japanese)
    // The other problem with this approach is that the size of the canvas 
    // varies with the length of the text, so 72-point text is different 
    // sizes for different text strings.  There are ways around this 
    // by dynamically adjust the sprite scale etc. but not in this demo...
    var larger = textWidth > fontsize ? textWidth : fontsize;
    canvas.width = larger * 4; 
    canvas.height = larger * 2; 
    // need to re-fetch and refresh the context after resizing the canvas 
    context = canvas.getContext('2d'); 
    context.font = fontsize + "px " + fontface; 
    context.textBaseline = "alphabetic"; 
    context.textAlign = "left"; 
     metrics = context.measureText( message ); 
    textWidth = metrics.width; 
 
     console.log("canvas: " + canvas.width + ", " + canvas.height + ", texW: " + textWidth);
    */ 
     
    // find the center of the canvas and the half of the font width and height 
    // we do it this way because the sprite's position is the CENTER of the sprite 
    var cx = canvas.width / 2; 
    var cy = canvas.height / 2; 
    var tx = textWidth/ 2.0; 
    var ty = fontsize / 2.0; 
 
    // then adjust for the justification 
    if ( vAlign == "bottom") 
        ty = 0; 
    else if (vAlign == "top") 
        ty = fontsize; 
     
    if (hAlign == "left") 
        tx = textWidth; 
    else if (hAlign == "right") 
        tx = 0; 
     
    // the DESCENDER_ADJUST is extra height factor for text below baseline: g,j,p,q. since we don't know the true bbox 
    roundRect(context, cx - tx , cy + ty + 0.28 * fontsize,  
            textWidth, fontsize * DESCENDER_ADJUST, radius, borderThickness, borderColor, fillColor); 
     
    // text color.  Note that we have to do this AFTER the round-rect as it also uses the "fillstyle" of the canvas 
    context.fillStyle = getCanvasColor(textColor); 
 
    context.fillText( message, cx - tx, cy + ty); 
  
    // draw some visual references - debug only 
    //drawCrossHairs( context, cx, cy );     
    // outlineCanvas(context, canvas); 
    //addSphere(x,y,z); 
    
    // canvas contents will be used for a texture 
    var texture = new THREE.Texture(canvas) 
    texture.needsUpdate = true; 
 
    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } ); 
    var sprite = new THREE.Sprite( spriteMaterial ); 
     
    // we MUST set the scale to 2:1.  The canvas is already at a 2:1 scale, 
    // but the sprite itself is square: 1.0 by 1.0 
    // Note also that the size of the scale factors controls the actual size of the text-label 
    sprite.scale.set(4,2,1); 
     
    // set the sprite's position.  Note that this position is in the CENTER of the sprite 
    sprite.position.set(x, y, z); 
     
    return sprite;     
} 

function roundRect(ctx, x, y, w, h, r, borderThickness, borderColor, fillColor)  
{ 
    // no point in drawing it if it isn't going to be rendered 
    if (fillColor == undefined && borderColor == undefined)  
        return; 
 
    x -= borderThickness + r; 
    y += borderThickness + r; 
    w += borderThickness * 2 + r * 2; 
    h += borderThickness * 2 + r * 2; 
     
    ctx.beginPath(); 
    ctx.moveTo(x+r, y); 
    ctx.lineTo(x+w-r, y); 
    ctx.quadraticCurveTo(x+w, y, x+w, y-r); 
    ctx.lineTo(x+w, y-h+r); 
    ctx.quadraticCurveTo(x+w, y-h, x+w-r, y-h); 
    ctx.lineTo(x+r, y-h); 
    ctx.quadraticCurveTo(x, y-h, x, y-h+r); 
    ctx.lineTo(x, y-r); 
    ctx.quadraticCurveTo(x, y, x+r, y); 
    ctx.closePath(); 
     
    ctx.lineWidth = borderThickness; 
 
    // background color 
    // border color 
 
    // if the fill color is defined, then fill it 
    if (fillColor != undefined) { 
        ctx.fillStyle = getCanvasColor(fillColor); 
        ctx.fill(); 
    } 
     
    if (borderThickness > 0 && borderColor != undefined) { 
        ctx.strokeStyle = getCanvasColor(borderColor); 
        ctx.stroke(); 
    } 
} 

function getCanvasColor ( color ) { 
    return "rgba(" + color.r + "," + color.g + "," + color.b + "," + color.a + ")"; 
} 

