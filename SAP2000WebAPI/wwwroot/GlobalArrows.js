


//#region Global Directions Arrows
var arrows = new THREE.Group();

const dirX = new THREE.Vector3( 1, 0, 0 );
const dirY = new THREE.Vector3( 0, 1, 0 );
const dirZ = new THREE.Vector3( 0, 0, 1 );
//normalize the direction vector (convert to vector of length 1)
dirX.normalize();
const origin = new THREE.Vector3( -3, -3, 0 );
const length = 2.3;
const hexX = 0xa6050d;
const hexY = 0x0675c9;
const hexZ = 0x05a660;
const headLength = 0.5;
const headWidth = 0.12;
var arrowHelperX = new THREE.ArrowHelper( dirX, origin, length, hexX, headLength, headWidth );
var arrowHelperY = new THREE.ArrowHelper( dirY, origin, length, hexY, headLength, headWidth );
var arrowHelperZ = new THREE.ArrowHelper( dirZ, origin, length, hexZ, headLength, headWidth );


var txSpriteX = makeTextSprite( "X", -0.25, -3,  0, { fontsize: 210, fontface: "Georgia", textColor: { r:204, g:1, b:1, a:1.0 },
  vAlign:"center", hAlign:"center" } );

 var txSpriteY = makeTextSprite( "Y", -3, -0.25,  0, { fontsize: 210, fontface: "Georgia", textColor: { r:6, g:117, b:201, a:1.0 },
  vAlign:"center", hAlign:"center" } );

 var txSpriteZ = makeTextSprite( "Z", -3, -3,  2.8, { fontsize: 210, fontface: "Georgia", textColor: { r:5, g:166, b:96, a:1.0 },
  vAlign:"center", hAlign:"center" } );
  
//#endregion

function GetGlobalArrows(){
    scene.add( arrows );
    arrows.add( arrowHelperX );
    arrows.add( arrowHelperY );
    arrows.add( arrowHelperZ );
    scene.add( txSpriteX ); 
    scene.add( txSpriteY );  
    scene.add( txSpriteZ ); 
}
