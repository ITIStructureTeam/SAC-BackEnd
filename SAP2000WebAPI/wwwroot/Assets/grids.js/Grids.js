var gridsUpdated = false;
var group,gridLines;

var listx=[6,6,6],                // x- axis list grids
listy=[4,4,4],                    // y- axis list grids
listz=[3,3,3];                    // z- axis list grids

var xGridsNames=[],
yGridsNames=[],
zGridsNames=[];


let gridsWind = `

    <div
    class="main-window"
    id="grids-window"
    data-role="window"
    data-title="Sections"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center"
    data-width="410">

        <div class="flex-rowm" id="grids-x-part">

            <div class="flex-col justify-start">
                <div  style="margin-left:11px;"><strong>X grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-x"  data-height="150" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong>
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>
                 
                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" id="grids-y-part">

            <div class="flex-col justify-start">
                <div style=" margin-left:11px;"><strong>Y grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-y" data-height="150" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong>
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>

                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" id="grids-z-part">

            <div class="flex-col justify-start">
                <div style="margin-left:11px;"><strong>Z grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-z" data-height="150" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong> 
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" style="justify-content: center;">
            <button id="secprop-ok-btn" class="button info">Ok</button>
            <button id="secprop-cancel-btn" class="button default">Cancel</button>
        </div>

    </div>
`

/* document.querySelector('#grids-btn').addEventListener("click",function(){
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
                gridLines = [];
                group = GridPoints(listx,listy,listz,listx.length,listy.length,listz.length);
                gridLines = GridLine(listx,listy,listz,listx.length,listy.length,listz.length);
                document.querySelector('#grids-window').parentElement.parentElement.remove();
                gridsUpdated=true;
            }
        });

        document.querySelector('#grids-close').addEventListener("click",function(){
            document.querySelector('#grids-window').parentElement.parentElement.remove();
        })
    }
}); */

function GetGridsWin(){
    return `

    <div
    class="main-window"
    id="grids-window"
    data-role="window"
    data-title="Sections"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center"
    data-width="410">

        <div class="flex-rowm" id="grids-x-part">

            <div class="flex-col justify-start">
                <div  style="margin-left:11px;"><strong>X grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-x"  data-height="140" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong>
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>
                 
                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" id="grids-y-part">

            <div class="flex-col justify-start">
                <div style=" margin-left:11px;"><strong>Y grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-y" data-height="140" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong>
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>

                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" id="grids-z-part">

            <div class="flex-col justify-start">
                <div style="margin-left:11px;"><strong>Z grid Data</strong></div>

                <div class="flex-col justify-start padding-all-0" data-role="panel" id="grids-z" data-height="140" data-width="300">

                    <div class="flex-rowm margin-b-20">
                        <div class="width-100">
                            <strong>Grid Id</strong> 
                        </div>
                        <div class="width-100">
                            <strong>Spacing (${projUnits.LenUnit})</strong>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="flex-col align-center">
                <div> <button class="button info">Add</button> </div>
                <div> <button class="button default">Delete</button> </div>
            </div>
        </div>

        <div class="flex-rowm" style="justify-content: center;">
            <button id="grids-ok"  class="button info">Ok</button>
            <button id="grids-close" class="button default">close</button>
        </div>

    </div>
`
}

function LoadGridsData(id,gridsSpacing, gridsNames){
    let container = $('#'+id);
    /* for (let i = 0; i < container.children().length; i++) {
        container.children()[i].remove();        
    } */
    let i = gridsNames.length;

    for(let j=0; j<i; j++ ){
        container.append(`
        <div class="flex-rowm margin-b-20 grid-data">
            <div class="width-100">
                <input type="text" class="input-small" data-role="input" data-clear-button="false" value=${gridsNames[j]}>
            </div>
            <div class="width-100">
                <input type="number" class="input-small" data-role="input" data-clear-button="false" value=${projUnits.LengthConvert( gridsSpacing[j],true)}>
            </div>
        </div>
        `);
    }
    for(let j=i; j<gridsSpacing.length; j++){
        container.append(`
        <div class="flex-rowm margin-b-20 grid-data">
            <div class="width-100">
                <input type="text" class="input-small" data-role="input" data-clear-button="false">
            </div>
            <div class="width-100">
                <input type="number" class="input-small" data-role="input" data-clear-button="false" value=${projUnits.LengthConvert( gridsSpacing[j],true)}>
            </div>
        </div>
        `);
    }
}

function ReadGrids(id,gridsSpacing, gridsNames) {
    
    let names = document.querySelectorAll(`#${id} .grid-data [type="text"]`);
    let spacings = document.querySelectorAll(`#${id} .grid-data [type="number"]`);

    gridsNames.length = 0;
    gridsSpacing.length = 0
    for (let i = 0; i < spacings.length; i++) {
        if(!isNaN(spacings[i].valueAsNumber) && spacings[i].valueAsNumber > 0){
            if(names[i]) gridsNames.push(names[i].value);
            gridsSpacing.push( projUnits.LengthConvert(spacings[i].valueAsNumber) );
        }       
    }
}

function AddGrid(gridsId){

    $('#'+gridsId).append(`
    <div class="flex-rowm margin-b-20 grid-data">
        <div class="width-100">
            <input type="text" class="input-small" data-role="input" data-clear-button="false" value=''>
        </div>
        <div class="width-100">
            <input type="number" min="0" class="input-small" data-role="input" data-clear-button="false" value=''>
        </div>
    </div>
    `);
}

function GetActiveGrid(gridsId){

    if(document.querySelector('#'+gridsId)){

        let divs = document.querySelector('#'+gridsId).children;
        for (let i = divs.length-1; i >= 0; i--) {
            let inputs = divs[i].querySelectorAll('input');
            for (let j = 0; j < inputs.length; j++) {
                if(inputs[j]===document.activeElement && divs.length > 2) return divs[i];           
            }
        }   
    }
}

function GridPoints(spacingX, spacingY, spacingZ, lengthX,lengthY,lengthZ)
{
    const group = new THREE.Group();

    var pos_x = 0;
    var pos_y = 0;
    var pos_z = 0;
    for(let i = 0; i <= lengthX; i++)
    {
        for(let j = 0; j <= lengthY; j++)
        {
            for(let k = 0; k <= lengthZ; k++)
            {
                
                let obj = BoxSnap(0.3,0.3,0.3);

                obj.position.x = pos_x;
                obj.position.y = pos_y;
                obj.position.z = pos_z;
                pos_z += spacingZ[k];
                group.add(obj);
            }
            pos_z = 0;
            pos_y += spacingY[j];
        }
        pos_y = 0;
        pos_x += spacingX[i];
    }
    return group;
}

function GridLine(spacingX, spacingY, spacingZ, lengthX, lengthY, lengthZ)
{
    const distanceX = listx.reduce((a, b) => a + b, 0);
    const distanceY = listy.reduce((a, b) => a + b, 0);
    const distanceZ = listz.reduce((a, b) => a + b, 0);
    const group = [];
    var material = new THREE.LineBasicMaterial({color:'rgb(190,190,190)', alphaTest:0.7, transparent:true, opacity:0.7});
    var points;
    var geometry;
    var line;
    var pos_x = 0;
    var pos_y = 0;
    var pos_z = 0;
    for(let i = 0; i <= lengthX; i++)
    {
        for(let j = 0; j <= lengthY; j++)
        {
            points = [];
            points.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );    
            points.push( new THREE.Vector3( pos_x, pos_y, distanceZ ) );   
            pos_y += spacingY[j];
            geometry = new THREE.BufferGeometry().setFromPoints( points );
            line = new THREE.Line( geometry, material );
            group.push(line);
        }
        pos_y = 0;
        pos_x += spacingX[i];
    }


    pos_x = 0;
    pos_y = 0;
    pos_z = 0;
    for(let i = 0; i <= lengthX; i++)
    {
        for(let j = 0; j <= lengthZ; j++)
        {
            points = [];
            points.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );
            points.push( new THREE.Vector3( pos_x, distanceY, pos_z ) );
            pos_z += spacingZ[j];
            geometry = new THREE.BufferGeometry().setFromPoints( points );
            line = new THREE.Line( geometry, material );
            group.push(line);
        }
        pos_z = 0;
        pos_x += spacingX[i];
    }

    pos_x = 0;
    pos_y = 0;
    pos_z = 0;
    for(let i = 0; i <= lengthY; i++)
    {
        for(let j = 0; j <= lengthZ; j++)
        {
            points = [];
            points.push( new THREE.Vector3( pos_x, pos_y, pos_z ) );
            points.push( new THREE.Vector3( distanceX, pos_y, pos_z ) );
            pos_z += spacingZ[j];
            geometry = new THREE.BufferGeometry().setFromPoints( points );
            line = new THREE.Line( geometry, material );
            group.push(line);
        }
        pos_z = 0;
        pos_y += spacingY[i];
    }
    return group;
}

function BoxSnap(width, height, depth, materialType = 'basic',color = 'green', X = 0, Y = 0, Z = 0)
{
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshBasicMaterial({color:color});
    material.transparent = true;
    material.opacity = 0;    
    material.alphaTest = 0.1;
    material.wireframe = true;
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x=X;
    mesh.position.y=Y;
    mesh.position.z=Z;

    return mesh;
}

