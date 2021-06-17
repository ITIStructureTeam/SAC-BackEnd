import {MapControls} from './Assets/Three.js files/OrbitControls.js'
import { DoubleSide } from './Assets/Three.js files/three.module.js';


init();

function init()
{
 // Create scene
 scene = new THREE.Scene();
 
// Add camera
camera = new THREE.PerspectiveCamera
(
    // fild view
    45,
    // Aspect ratio
    window.innerWidth/window.innerHeight,
    // near clip
    1,
    // far clip
    1000
);
camera.up = new THREE.Vector3( 0, 0, 1 );
//THREE.Object3D.DefaultUp.set(0, 0, 1);
THREE.Object3D.DefaultUp = new THREE.Vector3( 0, 0, 1 );
camera.position.z = 40;
camera.position.y = 25;
camera.position.x = 40;

camera.lookAt(8,0,16);


// create light
var light = GetLight(1.5);
light.position.x = 0;
light.position.z = 100;
light.position.y = 100;
var BackLight = GetLight(1.5);

BackLight.position.x = 0;
BackLight.position.z = 100;
BackLight.position.y = -100;

// Mouse
mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

// add to scene
scene.add(light);
scene.add(BackLight);
scene.add(new THREE.AmbientLight(0xAAAAAA));

// Initiate selection mode to true
SelectionModeActive = true;

// Renderer
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio*1.3);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor('rgb(250,250,250)');

controls = new MapControls(camera, renderer.domElement);

document.getElementById('webgl').appendChild(renderer.domElement);
update(renderer, scene, camera, controls);

return scene;

}

// Camera aspect in Case of window resize
window.addEventListener('resize',()=>{

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

// Light function
function GetLight(intensity)
{
    var light = new THREE.PointLight(
        'rgb(255,255,255)', intensity
    );
    return light;
}


GetGlobalArrows();
function resetPoints()
{
    if(group != null){
        for(let i = 0; i < group.children.length; i++)
        {
            if(group.children[i].material)
            {
                group.children[i].material.alphaTest = 0.1;
                group.children[i].material.opacity = 0;
            }
        }
    }   
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function hover() 
{
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
    if(group != null)
    {
        const intersects = raycaster.intersectObjects(group.children);
        for ( let i = 0; i < intersects.length; i ++) {
            intersects[i].object.material.transparent = true;
            intersects[i].object.material.opacity= 1; 
            var Scale = intersects[i].distance/18;
            intersects[i].object.scale.set(Scale, Scale, 1); 
            intersects[i].object.lookAt(camera.position);
            
        }
    }	
}

document.addEventListener('keydown',  function ( event ) {
    if(event.key == 'q')
    {
        alert(DrawLine.DrawLinesArray.length)
    }
})
document.addEventListener('keydown',  function ( event ) {
    if(event.key == 'p')
    {
        alert.log(DrawLine.GetDrawnFrames()[0].Section)
    }
})
document.addEventListener('keydown',  function ( event ) {
    if(event.key == 'w')
    {
        alert(Point.SelectedPoints.length)
    }
})

function ClickToDrawLine(event)  
{
    // hide loads if shown
    DrawLine.LoadsDisplayed = false;
    DrawLine.HideLoads();
	// update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );

    if(group != null)
    {
	    // calculate objects intersecting the picking ray
	    const intersects = raycaster.intersectObjects(group.children);

        var pos_x, pos_y, pos_z;

        if(event.button === 0)
        {
	        if(intersects.length > 0) {
                if(points.length <6)
                {
                    pos_x = intersects[0].object.position.x;
                    pos_y = intersects[0].object.position.y;
                    pos_z = intersects[0].object.position.z;
                    //points.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );
                    points.push(pos_x );
                    points.push(pos_y );
                    points.push(pos_z );
                }
                if(points.length == 6 && points[0] == points[3] && points[1] == points[4] && points[2] == points[5]  )
                {
                    points = []
                }
                else if(points.length == 6)
                {
                    commands.excuteCommand(new DrawLine(new FrameElement(points,GetSelectedSection())));
                    points = [];
                }
            }
	    }
    }
}


document.addEventListener('keydown', function(event){
	if(event.key === "Escape"){
		points = [];
        DrawingModeActive = false;
        SelectionModeActive = true;
        Unselect();
	}
    if(event.key === "Enter"){
		points = [];
	}
    if(event.key === "z" && event.ctrlKey){
		Undo();
	}
    if(event.key === "y" && event.ctrlKey){
		Redo();
	}
    if( event.key === "Z" && event.shiftKey && event.ctrlKey){
		Redo();
	}
    if(event.shiftKey || event.ctrlKey){
        SelectionModeActive = false;
	 document.querySelector("body").style = "cursor:alias"
    }
    if(event.key === "Delete"){
        DeleteButton();
    }
});

document.addEventListener("keyup", function(){
    if(DrawingModeActive == false)
    {
        SelectionModeActive = true;
	document.querySelector("body").style = "cursor:default"
    }  
});

document.addEventListener( 'mousedown', function ( event ) {
    if(event.button === 2)
    {
        document.querySelector("body").style = "cursor:grabbing"
    }});
document.addEventListener( 'mouseup', function ( event ) {
    if(event.button === 2)
    {
        document.querySelector("body").style = "cursor:default"
    }});










const selection = new THREE.SelectionBox( camera, scene );
const helper = new THREE.SelectionHelper( selection, renderer, 'selectBox' );

document.addEventListener( 'mousedown', function ( event ) {
        if(event.button === 1 || event.button === 2)
        {
            document.querySelectorAll(".selectBox").forEach(x => x.style.visibility = "hidden");
        }
        else{
            document.querySelectorAll(".selectBox").forEach(x => x.style.visibility = "visible");
        }
});
        
document.addEventListener( 'mousedown', function ( event ) {

            if(event.button === 0 && SelectionModeActive == true)
            {  
            selection.startPoint.set(
                ( event.clientX / window.innerWidth ) * 2 - 1,
                - ( event.clientY / window.innerHeight ) * 2 + 1,
                0.5 );
            }
} );

document.addEventListener( 'mousemove', function ( event ) {
            if(event.button === 0 && SelectionModeActive == true)
            {
            if (helper.isDown) {
                selection.endPoint.set(
                    ( event.clientX / window.innerWidth ) * 2 - 1,
                    - ( event.clientY / window.innerHeight ) * 2 + 1,
                    0.5 );
                }
            }
   } );

document.addEventListener( 'mouseup', function ( event ) {
    if(event.button === 0 && SelectionModeActive == true)
    {
    selection.endPoint.set(
        ( event.clientX / window.innerWidth ) * 2 - 1,
        - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5 );
    
    const allSelected = selection.select();
    const selectedDots = allSelected.filter(obj=>obj.isPoints);
    const filterselected = allSelected.filter(obj=>obj.isLine && obj.material.opacity == 0.1);

    let selectedLines = [];
    filterselected.forEach((c) => {
        if (!selectedLines.includes(c)) {
            selectedLines.push(c);
        }});

    for ( let i = 0; i < selectedLines.length; i ++ ) {
            if(selectedLines[i].DrawLine.Selected == false){
               selectedLines[i].DrawLine.Selected = true;
               selectedLines[i].DrawLine.updateColors();
               DrawLine.SelectedLines.push(selectedLines[i].DrawLine);
            }
        }

    for(let i = 0; i < selectedDots.length; i++){
        for(let j = 0; j < Point.PointsArray.length; j++)
        {
            if(Point.PointsArray[j].Selected == false && selectedDots[i].uuid == Point.PointsArray[j].dot.uuid)
            {
                Point.PointsArray[j].Selected = true;
                Point.PointsArray[j].Highlight();
                Point.SelectedPoints.push(Point.PointsArray[j]); 
            }
        }
    }
    }
} );


function ClickToSelectElement(event){
    
    raycaster.setFromCamera(mouse,camera);
    raycaster.params.Line.threshold = 0.1;
    raycaster.params.Points.threshold = 0.2;
    var intersects =  raycaster.intersectObjects(scene.children);
    const filteredDots = intersects.filter(obj=>obj.object.isPoints);
    const filterselected = intersects.filter(obj=>obj.object.hasOwnProperty('DrawLine'));
    
    if(event.button === 0) 
    {
        if(filteredDots.length == 0){
            for(let i =0; i < filterselected.length; i++)
            {           
                if(filterselected[i].object.DrawLine.Selected == false){
                
                    filterselected[i].object.DrawLine.Selected = true;
                    filterselected[i].object.DrawLine.updateColors();
                    DrawLine.SelectedLines.push(filterselected[i].object.DrawLine);
                }
                else{
                    filterselected[i].object.DrawLine.Selected = false;
                    filterselected[i].object.DrawLine.updateColors();
                    DrawLine.SelectedLines.pop(filterselected[i].object.DrawLine);
                }
            }    
        }
        else{
            for(let i = 0; i < filteredDots.length; i++){
                for(let j = 0; j < Point.PointsArray.length; j++)
                {
                    if(filteredDots[i].object.uuid == Point.PointsArray[j].dot.uuid){
                        if(Point.PointsArray[j].Selected == false)
                        {
                            Point.PointsArray[j].Selected = true;
                            Point.PointsArray[j].Highlight();
                            Point.SelectedPoints.push(Point.PointsArray[j]); 
                        }
                        else{
                            Point.PointsArray[j].Selected = false;
                            Point.PointsArray[j].Highlight();
                            Point.SelectedPoints.pop(Point.PointsArray[j]); 
                        }
                    }
                }
            }
        }
    }
}


setInterval(CheckForUpdates, 700);
function CheckForUpdates()
{
    if( secAssigned && DrawLine.SelectedLines.length){
        DrawLine.LoadsDisplayed=false;
        DrawLine.HideLoads();
        commands.excuteCommand( new AssignFrameSection( assignedSection ) );
        secAssigned = false;
        if(state == true){
            DrawLine.DisplaySectionNames();
        }
    }

    if(secUpdated && !state){
        DrawLine.DrawLinesArray.forEach( drawLine=> drawLine.ReExtrude());
        secUpdated = false
    }

    if(unitsUpdated){
        DrawLine.DrawLinesArray.forEach( line => line.DisplayLoad());
        unitsUpdated = false;
    }

}

function update(renderer, scene, camera, controls)
{
    
    window.addEventListener( 'mousemove', onMouseMove, false );

    renderer.render(scene, camera);
    controls.update();
    //stats.update();

    for (let i = 0; i < Point.SelectedPoints.length; i++)
    {
        Point.SelectedPoints[i].crosshair.lookAt(camera.position);
    }

    resetPoints();    

    

    if(DrawingModeActive == true)
    {
        window.addEventListener( 'click', ClickToDrawLine, false );
        hover();
        SelectionModeActive == false;
    }
    else{
        window.removeEventListener( 'click', ClickToDrawLine, false );
        SelectionModeActive == true;
    }
    
    if(SelectionModeActive == true){    
        window.addEventListener('click',ClickToSelectElement,false);
    } 
    else{
        document.querySelectorAll(".selectBox").forEach(x => x.style.visibility = "hidden");
        window.removeEventListener('click',ClickToSelectElement,false);
    }


    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    });

}



// for grids


document.querySelector('#grids-btn').addEventListener("click",function(){
    if(!document.querySelector('.main-window')){
        $('body').append(GetGridsWin());
        LoadGridsData('grids-x',listx,xGridsNames);
        LoadGridsData('grids-y',listy,yGridsNames);
        LoadGridsData('grids-z',listz,zGridsNames);
        document.querySelector(`#grids-x-part .info`).addEventListener("click",function(){AddGrid('grids-x',listx, xGridsNames)});
        document.querySelector(`#grids-y-part .info`).addEventListener("click",function(){AddGrid('grids-y',listy,yGridsNames)});
        document.querySelector(`#grids-z-part .info`).addEventListener("click",function(){AddGrid('grids-z',listz,zGridsNames)});

        document.querySelector('#grids-window').addEventListener("click",function(){

            if(GetActiveGrid('grids-x')){
                let activeGrid = GetActiveGrid('grids-x');
                document.querySelector(`#grids-x-part .default`).addEventListener("click", function(){
                    if(activeGrid) activeGrid.remove();
                });
            }
            if(GetActiveGrid('grids-y')){
                let activeGrid = GetActiveGrid('grids-y');
                document.querySelector(`#grids-y-part .default`).addEventListener("click", function(){
                    if(activeGrid) activeGrid.remove();
                });
            }
            if(GetActiveGrid('grids-z')){
                let activeGrid = GetActiveGrid('grids-z');
                document.querySelector(`#grids-z-part .default`).addEventListener("click", function(){
                    if(activeGrid) activeGrid.remove();
                });
            }
        })
        
        
        document.querySelector('#grids-ok').addEventListener("click", function(){
            ReadGrids('grids-x',listx, xGridsNames);
            ReadGrids('grids-y',listy,yGridsNames);
            ReadGrids('grids-z',listz,zGridsNames);
            if(!listx.length || !listy.length || !listz.length){
                Metro.dialog.create({
                    title: "Invalid Grids Data",
                    content: "<div>You must input at least one spacing as positive number in each direction</div>",
                    closeButton: true
                });
            }else{
                ThreeD();
                if(group != null)
                {
                    scene.remove(group);
                    gridLines.forEach(element => {
                        element.material.dispose()
                        element.geometry.dispose()
                        scene.remove(element);
                    });
                    gridLines = [];
                    for (var i = group.children.length - 1; i >= 0; i--) {
                        group.children[i].material.dispose();
                        group.children[i].geometry.dispose();
                        group.remove(group.children[i]);
                    }
                    removeSelectionGrids();
                }
                
                GridSelections();
                group = GridPoints(listx,listy,listz,listx.length,listy.length,listz.length);
                gridLines = GridLine(listx,listy,listz,listx.length,listy.length,listz.length);
                scene.add(group);
                gridLines.forEach(element => {
                    scene.add(element);
                });
                
                document.querySelector('#grids-window').parentElement.parentElement.remove();
                gridsUpdated=true;
            }
        });

        document.querySelector('#grids-close').addEventListener("click",function(){
            document.querySelector('#grids-window').parentElement.parentElement.remove();
        });
        
        
    }
});

if(gridLines == null){
    listx = [6,6,6]
    listy = [4,4,4]
    listz = [3,3,3] 
    GridSelections()
    group = GridPoints(listx,listy,listz,listx.length,listy.length,listz.length);
    scene.add(group);
    
    gridLines = GridLine(listx,listy,listz,listx.length,listy.length,listz.length);
    gridLines.forEach(element => {
        scene.add(element);
    });
}


 
function GridSelections()
{
    let position = 0;
    for (let i = 0; i <= listz.length; i++)
    {
        const text = "Z = "+ projUnits.LengthConvert(position, true);
        position += listz[i];
        $("#XY").append(`<option value=${position} >${text}</option>`);
    }

    position = 0;
    for (let i = 0; i <= listy.length; i++)
    {
        const text = "Z = "+ projUnits.LengthConvert(position, true);
        position += listy[i];
        $("#XZ").append(`<option value=${position} >${text}</option>`);
    }

    position = 0;
    for (let i = 0; i <= listx.length; i++)
    {
        const text = "Z = "+ projUnits.LengthConvert(position, true);
        position += listx[i];
        $("#YZ").append(`<option value=${position} >${text}</option>`);
    }
    
    // const yz = document.getElementById("YZ");
    // position = 0;
    // for (let i = 0; i <= listx.length; i++)
    // {
    //     const option = document.createElement("option");
    //     option.text = "X = "+position;
    //     yz.add(option, yz[i]);
    //     position += listx[i];
    // }
}

function removeSelectionGrids()
{
    const xy = $('#XY').children().length;
    for (let i = xy - 1; i >= 0; i--) {
        $('#XY').children()[i].remove(); 
    }
    
    const xz = $('#XZ').children().length;
    for (let i = xz - 1; i >= 0; i--) {
        $('#XZ').children()[i].remove(); 
    }
    
    const yz = $('#YZ').children().length;
    for (let i = yz - 1; i >= 0; i--) {
        $('#YZ').children()[i].remove(); 
    }
}

 

document.getElementById("XYSection").onclick=function(){XYSection()};
function XYSection()
{
    resetScene();
    view = "XY";
    const xy = document.getElementById("XY");
    for (let i =0; i< xy.length; i++) { 
        if (document.querySelector('#XY').options[i].selected == true)
        {
            XYindex = i;
            break;
        }
        else{
            XYindex = 0;
        }
    }
    XYView(XYindex);
}

function XYView(XYindex)
{
    const distanceX = listx.reduce((a, b) => a + b, 0);
    const distanceY = listy.reduce((a, b) => a + b, 0);
    ViewPosition = 0;
    for (let j = 0; j < XYindex; j++){
        ViewPosition += listz[j];
    }
    
    for (let j = group.children.length-1; j >= 0  ; j--) {
        if(group.children[j].position.z != ViewPosition)
        {
            HiddenSnapping.push(group.children[j]);
            group.remove(group.children[j]);
        }
    }
    for(let j = 0; j < gridLines.length; j++)
    {
        if(gridLines[j].geometry.attributes.position.array[2] != ViewPosition || gridLines[j].geometry.attributes.position.array[5] != ViewPosition){
            HiddenGrids.push(gridLines[j]);
            scene.remove(gridLines[j]);
        }
    }
    for (let j = 0; j < DrawLine.DrawLinesArray.length; j++)
    {
        DrawLine.DrawLinesArray[j].InView();
    }
    for (let j = 0; j < Point.PointsArray.length; j++)
    {
        Point.PointsArray[j].InView();
    }
    camera.position.x = distanceX/2;
    camera.position.y = distanceY/2;
    camera.position.z = Math.max(distanceX, distanceY)*1.5 + ViewPosition;
    controls.enableRotate = false;
    controls.target = new THREE.Vector3(camera.position.x, camera.position.y, 0);
    
    //Modefy coordinates arrows
    const origin = new THREE.Vector3( -2, -2, ViewPosition );
    arrowHelperX = new THREE.ArrowHelper( dirX, origin, length, hexX, headLength, headWidth );
    arrowHelperY = new THREE.ArrowHelper( dirY, origin, length, hexY, headLength, headWidth );
    arrows.add(arrowHelperX);
    arrows.add(arrowHelperY);

    txSpriteX = makeTextSprite( "X", 0.6, -2, ViewPosition, { fontsize: 200, fontface: "Georgia", textColor: { r:204, g:1, b:1, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteX );  
    txSpriteY = makeTextSprite( "Y", -2, 0.6, ViewPosition, { fontsize: 200, fontface: "Georgia", textColor: { r:6, g:117, b:201, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteY );  

    document.getElementById("StatusBar").innerHTML = "Z = " + projUnits.LengthConvert(ViewPosition, true) + projUnits.LenUnit ; 
}

document.getElementById("XZSection").onclick=function(){XZSection()};
function XZSection()
{
    resetScene();
    view = "XZ";
    const xz = document.getElementById("XZ");
    for (let i =0; i< xz.length; i++) {
        if (document.querySelector('#XZ').options[i].selected == true)
        {
            XZindex = i;
            break;
        }
        else{
            XZindex = 0;
        }
    }
    XZView(XZindex);
}

function XZView(XZindex){
    const distanceX = listx.reduce((a, b) => a + b, 0);
    const distanceZ = listz.reduce((a, b) => a + b, 0);
    ViewPosition = 0;
    for (let j = 0; j < XZindex; j++){
        ViewPosition += listy[j];
    }
    for (let j = group.children.length-1; j >= 0  ; j--) {
        if(group.children[j].position.y != ViewPosition)
        {
            HiddenSnapping.push(group.children[j]);
            group.remove(group.children[j]);
        }
    }

    for(let j = 0; j < gridLines.length; j++)
    {
        if(gridLines[j].geometry.attributes.position.array[1] != ViewPosition || gridLines[j].geometry.attributes.position.array[4] != ViewPosition){
            HiddenGrids.push(gridLines[j]);
            scene.remove(gridLines[j]);
        }
    }
    for (let j = 0; j < DrawLine.DrawLinesArray.length; j++)
    {
        DrawLine.DrawLinesArray[j].InView();
    }
    for (let j = 0; j < Point.PointsArray.length; j++)
    {
        Point.PointsArray[j].InView();
    }
    camera.up.set( 0, 0.5, 0.5 );
    camera.position.x = distanceX/2;
    camera.position.y = Math.max(distanceX,distanceZ)*1.5 + ViewPosition;
    camera.position.z = distanceZ/2;
    controls.enableRotate = false;
    controls.target = new THREE.Vector3(camera.position.x, 0, camera.position.z);

    //Modify coordinates arrows
    const origin = new THREE.Vector3( -2, ViewPosition, -2 );
    arrowHelperX = new THREE.ArrowHelper( dirX, origin, length, hexX, headLength, headWidth );
    arrowHelperZ = new THREE.ArrowHelper( dirZ, origin, length, hexZ, headLength, headWidth );
    arrows.add(arrowHelperX);
    arrows.add(arrowHelperZ);

    txSpriteX = makeTextSprite( "X", 0.6, ViewPosition, -2, { fontsize: 200, fontface: "Georgia", textColor: { r:204, g:1, b:1, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteX ); 
    txSpriteZ = makeTextSprite( "Z", -2, ViewPosition,0.6, { fontsize: 200, fontface: "Georgia", textColor: { r:5, g:166, b:96, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteZ );  

    document.getElementById("StatusBar").innerHTML = "Y = " + projUnits.LengthConvert(ViewPosition, true) + projUnits.LenUnit ;
}

document.getElementById("YZSection").onclick=function(){YZSection()};
function YZSection()
{
    resetScene();
    view = "YZ";
    const yz = document.getElementById("YZ");
    for (let i =0; i< yz.length; i++) {
        if (document.querySelector('#YZ').options[i].selected == true)
        {
            YZindex = i;
            break;
        }
        else{
            YZindex = 0;
        }
    }
    YZView(YZindex);
      
}

function YZView(YZindex){
    const distanceY = listy.reduce((a, b) => a + b, 0);
    const distanceZ = listz.reduce((a, b) => a + b, 0);
    ViewPosition = 0;
    for (let j = 0; j < YZindex; j++){
        ViewPosition += listx[j];
    }
    for (let j = group.children.length-1; j >= 0  ; j--) {
        if(group.children[j].position.x != ViewPosition)
        {
            HiddenSnapping.push(group.children[j]);
            group.remove(group.children[j]);
        }
    }

    for(let j = 0; j < gridLines.length; j++)
    {
        if(gridLines[j].geometry.attributes.position.array[0] != ViewPosition || gridLines[j].geometry.attributes.position.array[3] != ViewPosition){
            HiddenGrids.push(gridLines[j]);
            scene.remove(gridLines[j]);
        }
    }
    for (let j = 0; j < DrawLine.DrawLinesArray.length; j++)
    {
        DrawLine.DrawLinesArray[j].InView();
    }
    for (let j = 0; j < Point.PointsArray.length; j++)
    {
        Point.PointsArray[j].InView();
    }

    camera.position.x = Math.max(distanceY, distanceZ)*1.7 + ViewPosition;
    camera.position.y = distanceY/2 ;
    camera.position.z = distanceZ/2 ;
    camera.up.set( 0.5, 0, 0.5 );
    controls.enableRotate = false;
    controls.target = new THREE.Vector3(0, camera.position.y, camera.position.z);

    // Modify coordinates arrows
    const origin = new THREE.Vector3( ViewPosition, -2, -2 );
    arrowHelperY = new THREE.ArrowHelper( dirY, origin, length, hexY, headLength, headWidth );
    arrowHelperZ = new THREE.ArrowHelper( dirZ, origin, length, hexZ, headLength, headWidth );
    arrows.add(arrowHelperY);
    arrows.add(arrowHelperZ);

    txSpriteY = makeTextSprite( "Y", ViewPosition, 0.6, -2, { fontsize: 200, fontface: "Georgia", textColor: { r:6, g:117, b:201, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteY ); 
    txSpriteZ = makeTextSprite( "Z", ViewPosition, -2, 0.6, { fontsize: 200, fontface: "Georgia", textColor: { r:5, g:166, b:96, a:1.0 }, vAlign:"center", hAlign:"center" } );
    scene.add( txSpriteZ );

    document.getElementById("StatusBar").innerHTML = "X = " + projUnits.LengthConvert(ViewPosition, true) + projUnits.LenUnit ; 
}

document.getElementById("ThreeD").onclick=function(){ThreeD()};
function ThreeD()
{
    if(HiddenGrids.length>0){
        resetScene();

        // Reset coordinates arrows
        arrowHelperX = new THREE.ArrowHelper( dirX, origin, length, hexX, headLength, headWidth );
        arrowHelperY = new THREE.ArrowHelper( dirY, origin, length, hexY, headLength, headWidth );
        arrowHelperZ = new THREE.ArrowHelper( dirZ, origin, length, hexZ, headLength, headWidth );
        arrows.add( arrowHelperX );
        arrows.add( arrowHelperY );
        arrows.add( arrowHelperZ );
        
        txSpriteX = makeTextSprite( "X", -0.25, -3, 0, { fontsize: 210, fontface: "Georgia", textColor: { r:204, g:1, b:1, a:1.0 },vAlign:"center", hAlign:"center" } );
         scene.add( txSpriteX );  
        txSpriteY = makeTextSprite( "Y", -3, -0.25, 0, { fontsize: 210, fontface: "Georgia", textColor: { r:6, g:117, b:201, a:1.0 },vAlign:"center", hAlign:"center" } );
         scene.add( txSpriteY );  
        txSpriteZ = makeTextSprite( "Z", -3, -3, 2.8, { fontsize: 210, fontface: "Georgia", textColor: { r:5, g:166, b:96, a:1.0 },vAlign:"center", hAlign:"center" } );
         scene.add( txSpriteZ );  
    }
    camera.position.x = 45;
    camera.position.y = 25;
    camera.position.z = 45;
    controls.enableRotate = true;

    document.getElementById("StatusBar").innerHTML = "3D-View"; 
}

document.getElementById("Next").onclick=function(){Next()};
function Next()
{
    if(view == 'XY'){
        resetScene();
        view = 'XY';
        XYindex += 1;
        if(XYindex > listz.length){XYindex = 0;}
        XYView(XYindex);
    }
    else if(view == 'XZ'){
        resetScene();
        view = 'XZ';
        XZindex += 1;
        if(XZindex > listy.length){XZindex = 0;}
        XZView(XZindex);
    }
    else if(view == 'YZ'){
        resetScene();
        view = 'YZ';
        YZindex += 1;
        if(YZindex > listx.length){YZindex = 0;}
        YZView(YZindex);
    }
}

document.getElementById("Prev").onclick=function(){Previous()};
function Previous()
{
    switch(view)
    {
        case 'XY':
            resetScene();
            view = 'XY';
            XYindex -= 1;
            if(XYindex < 0 ){XYindex = listz.length;}
            XYView(XYindex);
            break;
        case 'XZ':
            resetScene();
            view = 'XZ';
            XZindex -= 1;
            if(XZindex < 0 ){XZindex = listy.length;}
            XZView(XZindex);
            break;
        case 'YZ':
            resetScene();
            view = 'YZ';
            YZindex -= 1;
            if(YZindex < 0){YZindex = listx.length;}
            YZView(YZindex);
            break;
    }  
}

function resetScene()
{
    view = "";
    camera.up.set( 0, 0, 1 );
    controls.enableRotate = true;
    removeArrows();
    // Reset all hidden elements to scene
    while(HiddenSnapping.length>0)
    {
        group.add(HiddenSnapping[0]);
        HiddenSnapping.shift();
    }
    while(HiddenGrids.length>0)
    {
        scene.add(HiddenGrids[0]);
        HiddenGrids.shift();
    }
    for(let i = 0; i < DrawLine.DrawLinesArray.length; i++)
    {
        DrawLine.DrawLinesArray[i].InView();
    }
    for(let i = 0; i < Point.PointsArray.length; i++)
    {
        Point.PointsArray[i].InView();
    }

}

function removeArrows()
{
    arrows.remove( arrowHelperX );
    scene.remove(txSpriteX);
    arrows.remove( arrowHelperY );
    scene.remove(txSpriteY);
    arrows.remove( arrowHelperZ );
    scene.remove(txSpriteZ);
}




















document.getElementById("AddPoints").onclick=function(){AddPointsToFrame()};
function AddPointsToFrame()
{
    var number = prompt("Add points at equal intervals of frame element", "Number of points");
    if(!isNaN(number)){
        const selected = DrawLine.GetSelectedFrames();
        for (let i =0; i<selected.length; i++)
        {
            selected[i].AddPointsAtEqualDistances(number);
        }
    }
}







//#region // Results visualization
function ResultLines(length, x,y,z, startPoint, endPoint,  direction, rz, scale = 1) // , local = false)
{
    startPoint = new THREE.Vector3(startPoint[0], startPoint[1], startPoint[2]);
    endPoint = new THREE.Vector3(endPoint[0], endPoint[1], endPoint[2]);

    const axis = new THREE.Vector3().subVectors(startPoint, endPoint).normalize(); // Z-local direction
 
    let x_axis = crossProduct([axis.x, axis.y, axis.z], [0,0,1]);
    if(arrayEquals(x_axis,[0,0,0]))
    {
        x_axis = [0,1,0]
    }
    const y_axis = crossProduct([axis.x, axis.y, axis.z], x_axis);
    const X_axis = new THREE.Vector3(x_axis[0], x_axis[1], x_axis[2]);
    const Y_axis = new THREE.Vector3(y_axis[0], y_axis[1], y_axis[2]);

    const material = new THREE.LineBasicMaterial();
    if(length > 0)
    {
        material.color = {r:0,g:0,b:180}
    }
    else{
        material.color = {r:180,g:0,b:0}
    }
 
    const l = length *scale;
    var geometry = new THREE.BufferGeometry();
    var vertices =[];  

    // if(local == false)
    // {
    //     if(direction == 1 || direction )
    //     vertices.push(0, 0, 0);
    //     vertices.push(0, 0, l);
    //     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    // }
    // else
    // {
    if(direction == 2 || direction == 1)
    {
        vertices.push(0, 0, 0);
        vertices.push(l*Y_axis.x, l*Y_axis.y, l*Y_axis.z);
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    }
    else if(direction == 3){
        vertices.push(0, 0, 0);
        vertices.push(l*X_axis.x, l*X_axis.y, l*X_axis.z);
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    }
    //}
    var line = new THREE.Line( geometry, material );

    line.position.x = x;
    line.position.y = y;
    line.position.z = z;
    line.rotateOnAxis(axis, rz)
    scene.add(line);
    return vertices;
}

// This function assumes results are from points distributed equally along the frame
function ResultsDiagram(results ,startPoint, endPoint, direction, rz, scale = 1, local = false)
{
    const StartPoint = new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2]);
    const EndPoint = new THREE.Vector3(endPoint[0], endPoint[1], endPoint[2]);

    const load = new THREE.Group();
    const distance = new THREE.Vector3().subVectors(StartPoint, EndPoint).length();
 
    const dX = (EndPoint.x - StartPoint.x );
    const dY = (EndPoint.y - StartPoint.y );
    const dZ = (EndPoint.z - StartPoint.z );

    const max = Math.max(...results);
    const min = Math.min(...results);
    const material = new THREE.LineBasicMaterial({color:'rgb(0,0,0)'});
    const number = results.length -1;
    const geometry = new THREE.BufferGeometry();
    var vertices =[];  
    vertices.push(StartPoint.x, StartPoint.y, StartPoint.z);

    for (let i = 0; i <= number ; i++)
    {
        const x = StartPoint.x + (dX*i/number); 
        const y = StartPoint.y + (dY*i/number);
        const z = StartPoint.z + (dZ*i/number);
        
        const line = ResultLines(results[i], x, y, z, startPoint, endPoint,direction, rz, 1, local);
 
        vertices.push(line[3]+ x, line[4]+ y, line[5]+ z);
        let position = 0;
        var color;
        if(results[i]>=0){
            position -= 0.1;
            color = {r:0,g:0,b:180,a:1}
        }
        else{
            position += 0.1;
            color = {r:180,g:0,b:0,a:1}
        }
        if(i == 0 || i == number || results[i] == max || results[i] == min)
        {
            if(direction ==1 || direction ==2 || results[i] == max || results[i] == min)
            {
                const textPosition = [line[3]+ x, line[4]+ y, line[5]+ z+ position];
                const txt = makeTextSprite( results[i], textPosition[0], textPosition[1], textPosition[2],{fontsize: 80, fontface: "Georgia", textColor:color,
                    vAlign:"center", hAlign:"center"});
                    load.add(txt);
            }
            else{
                const textPosition = [line[3]+ x + + position, line[4]+ y + position, line[5]+ z];
                const txt = makeTextSprite( results[i], textPosition[0], textPosition[1], textPosition[2],{fontsize: 80, fontface: "Georgia", textColor:color,
                    vAlign:"center", hAlign:"center"});
                    load.add(txt);
            }
        }
        //load.add(arrow);
    }

    vertices.push(EndPoint.x, EndPoint.y, EndPoint.z);
    
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    const container = new THREE.Line( geometry, material );
    load.add(container)
    scene.add(load)
}
//#endregion

class RootData
{
    constructor()
    {        
        this.Materials = [...Material.MaterialsList.values()];
        this.Sections = [...Section.SectionList.values()];
        this.Patterns = Array.from(LoadPattern.LoadPatternsList, ([PatternID, Details]) => ({ PatternID, Details }));
        this.Points = [...Point.PointsArray];
        this.Frames = DrawLine.GetDrawnFrames();
    }
}

// document.getElementById("Run").onclick=function(){Run()};
// function Run()
// { 
    //const Frames = [...DrawLine.GetDrawnFrames()];
$("#Run").click(function(){
    let OutPut = JSON.stringify(new RootData());
    console.log(OutPut);
    $.ajax({
        type: "POST",
        url: "/api/RunAnalysis/LoadFramesData",                   ///// URL must be specified
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: OutPut,
        cache: false,
        success: function (result) {
            console.log(result);
        },
        error: function (ex) {
            console.log(ex.responseText);
        }
    });
});
    
    // const newOutput = JSON.parse(OutPut)
    // console.log(newOutput);
// var fs = require('fs');
// fs.writeFile("OutPut.json", OutPut, function(err) {
//     if (err) {
//         console.log(err);
//     }
// });
// }

//     const geometry = new THREE.BufferGeometry();
//     const material = new THREE.LineBasicMaterial();
//     const vertices2 =[];  
//     vertices2.push(12,8,9);
//     vertices2.push(6,4,3);
//     geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices2, 3 ) );
//     const arrow2 = new THREE.Line( geometry, material );
//     const res = [-1,-0.72,-0.5,-0.2,0.2, 0.5,0.7,0.5,0.2, -0.2, -0.5]
//     const startPoint2 = [12,8,9];
//     const endPoint2 = [6,4,3]
//     // ArrowOnLine(-1,0,0,9, startPoint, endPoint, 2, 1, true)
//     //DistributedLoadIndication(-1,startPoint2, endPoint2, 3, 0,1, 2, true)
//     ResultsDiagram(res, startPoint2, endPoint2, 2, 0,1, true)
//     scene.add(arrow2)