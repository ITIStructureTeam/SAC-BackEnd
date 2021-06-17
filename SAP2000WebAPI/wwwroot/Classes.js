// Global variables for init function
var
 raycaster,
 mouse,
 stats,
 renderer,
 ViewPosition;  

 var HiddenGrids = [];
 var HiddenSnapping = []; 

 var points = [];                 // Points array for positions of lines for drawing functions
 
 var DrawingModeActive = false;
 var SelectionModeActive;
 var state = true;                // if false then the geometery will be extruded .. a global variable as it is used in mamy functions / classes

 var view;
 var XYindex;
 var XZindex;
 var YZindex;
 
//_________________________________________________________________//
//                                                                 //
//** Note: this work is for exploration and must be restructured !!//
//_________________________________________________________________//


// Command main class
class Commands
{
    constructor()
    {
        this.History = [];
        this.redoHistory = [];
    }
    excuteCommand(command)
    {
        this.History.push(command);
        command.excute();
        for (let i = 0; i < this.redoHistory.length; i++)
        {
            this.redoHistory[i].remove();
        }
        if(this.History.length > 20)
        {
            this.History[0].remove();
            this.History.shift();
        }
        this.redoHistory = [];
    }
    undoCommand()
    {
        if(this.History.length > 0)
        {
            this.redoHistory.push(this.History[this.History.length-1]);
            this.History[this.History.length-1].undo();
            this.History.pop();
        }
        if(this.redoHistory.length > 4)
        {
            this.redoHistory[0].remove();
            this.redoHistory.shift();
        }
    }
    redoCommand()
    {
        if(this.redoHistory.length > 0)
        {
            this.History.push(this.redoHistory[this.redoHistory.length-1]);
            this.redoHistory[this.redoHistory.length-1].redo();
            this.redoHistory.pop();
        }
    }
}

// create an instance of command object 
var commands = new Commands()


// Frame Element class
class FrameElement
{
    #section;
    static #num = 1;
    constructor(points, crossSection)
    {
        this.Label = FrameElement.#num;
        this.Section = crossSection ;
        var startPosition = [points[0], points[1], points[2]];
        var endPosition = [points[3], points[4], points[5]];
        this.StartPoint;
        this.EndPoint;
        this.Rotation = 0;
        this.AssociatedPoints = [];
        this.LoadsAssigned = new Map();
        FrameElement.#num++;

        for(let i = 0; i < Point.PointsArray.length; i++)
        {
            if (arrayEquals(startPosition, Point.PointsArray[i].position))
            {
                this.StartPoint = Point.PointsArray[i];
                Point.PointsArray[i].Shared.push(this.Label);
            }
            if (arrayEquals(endPosition, Point.PointsArray[i].position))
            {
                this.EndPoint = Point.PointsArray[i];
                Point.PointsArray[i].Shared.push(this.Label);
            }
        }
        if(this.StartPoint == null)
        {
            this.StartPoint = new Point(startPosition);
            this.StartPoint.excute(this.Label);
        }
        if(this.EndPoint == null)
        {
            this.EndPoint = new Point(endPosition);
            this.EndPoint.excute(this.Label);
        } 
    }

    set Section (value){
        this.#section = value;
        if(! (value.AssignedToFrames.includes(this.Label)) ) this.#section.AssignedToFrames.push(this.Label);
    }
    get Section (){
        return this.#section;
    }

    undo()
    {
        let frameIndex = this.Section.AssignedToFrames.indexOf(this.Label);
        this.Section.AssignedToFrames.splice(frameIndex,1);
        this.LoadsAssigned.forEach((value,key) => {
            let pattern = LoadPattern.LoadPatternsList.get(key);
            let frameIndex = pattern.OnElements.indexOf(this.Label);
            pattern.OnElements.splice(frameIndex,1);
        });
        this.StartPoint.undo(this.Label);
        this.EndPoint.undo(this.Label);
        for(let i = 0; i <this.AssociatedPoints.length; i++){
            this.AssociatedPoints[i].undo();
        }
    }

    redo()
    {
        this.Section.AssignedToFrames.push(this.Label);
        this.LoadsAssigned.forEach((value,key) => {
            let pattern = LoadPattern.LoadPatternsList.get(key);
            pattern.OnElements.push(this.Label);
        });
        this.StartPoint.redo(this.Label);
        this.EndPoint.redo(this.Label);
        this.Section.AssignedToFrames.push(this);
        for(let i = 0; i <this.AssociatedPoints.length; i++){
            this.AssociatedPoints[i].redo();
        }
    }

    remove()
    {
        this.Label = null;
        this.StartPoint.remove();
        this.EndPoint.remove();
        this.LoadsAssigned = null;
        for(let i = 0; i <this.AssociatedPoints.length; i++){
            this.AssociatedPoints[i].remove();
        }
        this.AssociatedPoints = null;
    } 

    AddPointsAtEqualDistances(number){
        const dX = this.EndPoint.position[0] - this.StartPoint.position[0];
        const dY = this.EndPoint.position[1] - this.StartPoint.position[1];
        const dZ = this.EndPoint.position[2] - this.StartPoint.position[2];
        for(let i = 1; i < number; i++){
            const x = this.StartPoint.position[0] + dX*i/number;
            const y = this.StartPoint.position[1] + dY*i/number;
            const z = this.StartPoint.position[2] + dZ*i/number;
            const point = [x,y,z]
            const obj = new Point(point);
            obj.excute();
            this.AssociatedPoints.push(obj);
        }
    }


    toJSON()
    {
        return{Label:this.Label,
            Section:this.Section.Name,
            StartPoint:this.StartPoint.Label,
            EndPoint:this.EndPoint.Label,
            Rotation:this.Rotation * 180/Math.PI,
            Loads:Array.from(this.LoadsAssigned, ([Pattern, LoadDetails]) => ({ name, LoadDetails }))
        }
    }
}

class DrawLine
{
    #frame;
    #extrude;
    #line;
    #refLine;
    #label;
    #name;
    static #drawLinesArray = new Array();
    static SelectedLines = [];
    static LoadsDisplayed = false;
    static DisplayedPattern;
    #dispLoads;
    constructor(frame)
    { 
        this.#frame=frame;
        this.#SetLine();
        this.#SetRefLine();
        this.#SetLabel();
        this.#SetName();
        this.#SetExtrude();
        this.ExtrudedColor = this.#extrude.material.color;
        this.LineColor = this.#line.material.color;
        this.Selected = false;

        if(state == true) 
        {
            this.Extrude.visible = false;
            this.line.visible = true;
        }else{
            
            this.Extrude.visible = true;
            this.line.visible = false;
        }
        this.#dispLoads = [];       // array containg loads representation of the frame in  a certain load pattern
    }

    #SetLine(){
        let geometry = new THREE.LineGeometry();
        geometry.setPositions([...this.Frame.StartPoint.position, ...this.Frame.EndPoint.position]);
        let lineMaterial = new THREE.LineMaterial({color:'rgb(10,10,200)', linewidth:3 });
        lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
        this.#line = new THREE.Line2(geometry, lineMaterial);
    }

    #SetRefLine(){

        this.#refLine = new THREE.Line(new THREE.BufferGeometry()
        .setFromPoints([new THREE.Vector3(...this.Frame.StartPoint.position), new THREE.Vector3(...this.Frame.EndPoint.position)])
        ,new THREE.LineBasicMaterial({color:'rgb(0,10,200)', alphaTest:0, opacity: 0.1}));

        this.#refLine.DrawLine =  this;
        
    }

    #SetLabel(){

        let SpritePosition = [(this.Frame.EndPoint.position[0]-this.Frame.StartPoint.position[0])/3, (this.Frame.EndPoint.position[1]-this.Frame.StartPoint.position[1])/3, (this.Frame.EndPoint.position[2]-this.Frame.StartPoint.position[2])/3];
        this.#label = makeTextSprite
        ( 
        this.Frame.Label, SpritePosition[0]+this.Frame.StartPoint.position[0]+0.2, SpritePosition[1]+this.Frame.StartPoint.position[1], SpritePosition[2]+this.Frame.StartPoint.position[2]+0.45,
        {fontsize: 180, fontface: "Georgia", textColor:{r:160, g:160, b:160, a:1.0},
        vAlign:"center", hAlign:"center", fillColor:{r:255, g:255, b:255, a:1.0},
        borderColor: {r:0, g:0, b:0, a:1.0}, borderThickness: 1, radius:30}
        );
    }

    #SetName(){
        let SpritePosition = [(this.Frame.EndPoint.position[0]-this.Frame.StartPoint.position[0])/3, (this.Frame.EndPoint.position[1]-this.Frame.StartPoint.position[1])/3, (this.Frame.EndPoint.position[2]-this.Frame.StartPoint.position[2])/3];
        this.#name = makeTextSprite
        ( 
        this.Frame.Section.Name, SpritePosition[0]+this.Frame.StartPoint.position[0]+0.2, SpritePosition[1]+this.Frame.StartPoint.position[1], SpritePosition[2]+this.Frame.StartPoint.position[2]-0.2,
        {fontsize: 120, fontface: "Georgia", textColor:{r:160, g:160, b:160, a:1.0},
        vAlign:"center", hAlign:"center", fillColor:{r:255, g:255, b:255, a:1.0},
        borderColor: {r:0, g:0, b:0, a:1.0}, borderThickness: 1, radius:30}
        );
    }

    #SetExtrude(){

        let shape = this.#GetThreeShape();
        let points = [new THREE.Vector3(...this.Frame.StartPoint.position), new THREE.Vector3(...this.Frame.EndPoint.position)];
        let geometry;
        const material =  new THREE.MeshStandardMaterial({
            metalness:0.5,
            transparent:true,
            opacity:0.8,
            color:'rgb(0,0,185)',
            roughness:0.5
        });       
        const length = new THREE.Vector3().subVectors(points[1],points[0]).length();       

        if(shape!=null){
            shape.position = points[0];
            const extrudeSettings = {
                steps: 2,
                depth: length,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 1,
                bevelOffset: 0,
            };
    
            geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
        }else{
            geometry = new THREE.BufferGeometry();
            // 12 positions with 3 coordinates
            const vertices  = [
    //Lower Flange
    // front
    { pos: [-b/2, -h/2, l], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
    { pos: [ b/2, -h/2, l], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
    { pos: [-b/2, tf-h/2, l], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
    { pos: [ b/2, tf-h/2, l], norm: [ 0,  0,  1], uv: [1, 1], }, // 3
    // right
    { pos: [ b/2, -h/2,  l], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
    { pos: [ b1/2, -h1/2, 0], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
    { pos: [ b/2, tf-h/2,  l], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
    { pos: [ b1/2, tf1-h1/2, 0], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
    // back
    { pos: [ b1/2, -h1/2, 0], norm: [ 0,  0, -1], uv: [0, 0], }, // 8
    { pos: [-b1/2, -h1/2, 0], norm: [ 0,  0, -1], uv: [1, 0], }, // 9
    { pos: [ b1/2, tf1-h1/2, 0], norm: [ 0,  0, -1], uv: [0, 1], }, // 10
    { pos: [-b1/2, tf1-h1/2, 0], norm: [ 0,  0, -1], uv: [1, 1], }, // 11
    // left
    { pos: [-b1/2, -h1/2, 0], norm: [-1,  0,  0], uv: [0, 0], }, // 12
    { pos: [-b/2, -h/2, l], norm: [-1,  0,  0], uv: [1, 0], }, // 13
    { pos: [-b1/2, tf1-h1/2, 0], norm: [-1,  0,  0], uv: [0, 1], }, // 14
    { pos: [-b/2, tf-h/2, l], norm: [-1,  0,  0], uv: [1, 1], }, // 15
    // top
    { pos: [ b1/2, tf1-h1/2, 0], norm: [ 0,  1,  0], uv: [0, 0], }, // 16
    { pos: [-b1/2, tf1-h1/2, 0], norm: [ 0,  1,  0], uv: [1, 0], }, // 17
    { pos: [ b/2, tf-h/2, l], norm: [ 0,  1,  0], uv: [0, 1], }, // 18
    { pos: [-b/2, tf-h/2,  l], norm: [ 0,  1,  0], uv: [1, 1], }, // 19
    // bottom
    { pos: [ b/2, -h/2, l], norm: [ 0, -1,  0], uv: [0, 0], }, // 20
    { pos: [-b/2, -h/2, l], norm: [ 0, -1,  0], uv: [1, 0], }, // 21
    { pos: [ b1/2, -h1/2, 0], norm: [ 0, -1,  0], uv: [0, 1], }, // 22
    { pos: [-b1/2, -h1/2, 0], norm: [ 0, -1,  0], uv: [1, 1], }, // 23

    //Web
    // front
    { pos: [-tw/2, tf-h/2, l], norm: [ 0,  0,  1], uv: [0, 0], }, // 24
    { pos: [ tw/2, tf-h/2, l], norm: [ 0,  0,  1], uv: [1, 0], }, // 25
    { pos: [-tw/2, -tf+h/2, l], norm: [ 0,  0,  1], uv: [0, 1], }, // 26
    { pos: [ tw/2, -tf+h/2, l], norm: [ 0,  0,  1], uv: [1, 1], }, // 27
    // right
    { pos: [ tw/2, tf-h/2,  l], norm: [ 1,  0,  0], uv: [0, 0], }, // 28
    { pos: [ tw1/2, tf1-h1/2, 0], norm: [ 1,  0,  0], uv: [1, 0], }, // 29
    { pos: [ tw/2, -tf+h/2,  l], norm: [ 1,  0,  0], uv: [0, 1], }, // 30
    { pos: [ tw1/2, -tf1+h1/2, 0], norm: [ 1,  0,  0], uv: [1, 1], }, // 31
    // back
    { pos: [ tw1/2, tf1-h1/2, 0], norm: [ 0,  0, -1], uv: [0, 0], }, // 32
    { pos: [-tw1/2, tf1-h1/2, 0], norm: [ 0,  0, -1], uv: [1, 0], }, // 33
    { pos: [ tw1/2, -tf1+h1/2, 0], norm: [ 0,  0, -1], uv: [0, 1], }, // 34
    { pos: [-tw1/2, -tf1+h1/2, 0], norm: [ 0,  0, -1], uv: [1, 1], }, // 35
    // left
    { pos: [-tw1/2, tf1-h1/2, 0], norm: [-1,  0,  0], uv: [0, 0], }, // 36
    { pos: [-tw/2, tf-h/2, l], norm: [-1,  0,  0], uv: [1, 0], }, // 37
    { pos: [-tw1/2, -tf1+h1/2, 0], norm: [-1,  0,  0], uv: [0, 1], }, // 38
    { pos: [-tw/2, -tf+h/2, l], norm: [-1,  0,  0], uv: [1, 1], }, // 39
    // top
    { pos: [ tw1/2, -tf1+h1/2, 0], norm: [ 0,  1,  0], uv: [0, 0], }, // 40
    { pos: [-tw1/2, -tf1+h1/2, 0], norm: [ 0,  1,  0], uv: [1, 0], }, // 41
    { pos: [ tw/2, -tf+h/2, l], norm: [ 0,  1,  0], uv: [0, 1], }, // 42
    { pos: [-tw/2, -tf+h/2,  l], norm: [ 0,  1,  0], uv: [1, 1], }, // 43
    // bottom
    { pos: [ tw/2, tf-h/2, l], norm: [ 0, -1,  0], uv: [0, 0], }, // 44
    { pos: [-tw/2, tf-h/2, l], norm: [ 0, -1,  0], uv: [1, 0], }, // 45
    { pos: [ tw1/2, tf1-h1/2, 0], norm: [ 0, -1,  0], uv: [0, 1], }, // 46
    { pos: [-tw1/2, tf1-h1/2, 0], norm: [ 0, -1,  0], uv: [1, 1], }, // 47

    //Upper Flange
    // front
    { pos: [-b/2, h/2-tf, l], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
    { pos: [ b/2, h/2-tf, l], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
    { pos: [-b/2, h/2, l], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
    { pos: [ b/2, h/2, l], norm: [ 0,  0,  1], uv: [1, 1], }, // 3
    // right
    { pos: [ b/2, -tf+h/2,  l], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
    { pos: [ b1/2, -tf1+h1/2, 0], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
    { pos: [ b/2, h/2,  l], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
    { pos: [ b1/2, h1/2, 0], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
    // back
    { pos: [ b1/2, -tf1+h1/2, 0], norm: [ 0,  0, -1], uv: [0, 0], }, // 8
    { pos: [-b1/2, -tf1+h1/2, 0], norm: [ 0,  0, -1], uv: [1, 0], }, // 9
    { pos: [ b1/2, h1/2, 0], norm: [ 0,  0, -1], uv: [0, 1], }, // 10
    { pos: [-b1/2, h1/2, 0], norm: [ 0,  0, -1], uv: [1, 1], }, // 11
    // left
    { pos: [-b1/2, -tf1+h1/2, 0], norm: [-1,  0,  0], uv: [0, 0], }, // 12
    { pos: [-b/2, -tf+h/2, l], norm: [-1,  0,  0], uv: [1, 0], }, // 13
    { pos: [-b1/2, h1/2, 0], norm: [-1,  0,  0], uv: [0, 1], }, // 14
    { pos: [-b/2, h/2, l], norm: [-1,  0,  0], uv: [1, 1], }, // 15
    // top
    { pos: [ b1/2, h1/2, 0], norm: [ 0,  1,  0], uv: [0, 0], }, // 16
    { pos: [-b1/2, h1/2, 0], norm: [ 0,  1,  0], uv: [1, 0], }, // 17
    { pos: [ b/2, h/2, l], norm: [ 0,  1,  0], uv: [0, 1], }, // 18
    { pos: [-b/2, h/2,  l], norm: [ 0,  1,  0], uv: [1, 1], }, // 19
    // bottom
    { pos: [ b/2, h/2-tf, l], norm: [ 0, -1,  0], uv: [0, 0], }, // 20
    { pos: [-b/2, h/2-tf, l], norm: [ 0, -1,  0], uv: [1, 0], }, // 21
    { pos: [ b1/2, h1/2-tf1, 0], norm: [ 0, -1,  0], uv: [0, 1], }, // 22
    { pos: [-b1/2, h1/2-tf1, 0], norm: [ 0, -1,  0], uv: [1, 1], }, // 23
            ];
            var indices = new Uint32Array([
      // Lower Flange
         0,  1,  2,   2,  1,  3,  // front
         4,  5,  6,   6,  5,  7,  // right
         8,  9, 10,  10,  9, 11,  // back
        12, 13, 14,  14, 13, 15,  // left
        16, 17, 18,  18, 17, 19,  // top
        20, 21, 22,  22, 21, 23,  // bottom
     // Web
        24, 25, 26,  26, 25, 27,  // front
        28, 29, 30,  30, 29, 31,  // right
        32, 33, 34,  34, 33, 35,  // back
        36, 37, 38,  38, 37, 39,  // left
        40, 41, 42,  42, 41, 43,  // top
        44, 45, 46,  46, 45, 47,  // bottom
    // Upper Flange
        48, 49, 50,  50, 49, 51,  // front
        52, 53, 54,  54, 53, 55,  // right
        56, 57, 58,  58, 57, 59,  // back
        60, 61, 62,  62, 61, 63,  // left
        64, 65, 66,  66, 65, 67,  // top
        68, 69, 70,  70, 69, 71,  // bottom
            ]);           
            const positions = [];
            const normals = [];
            const uvs = [];
            for (const vertex of vertices) {
              positions.push(...vertex.pos);
              normals.push(...vertex.norm);
              uvs.push(...vertex.uv);
            }
        
            geometry.setIndex( new THREE.BufferAttribute(indices,1) );
        
            //geometry.setAttribute('color', new THREE.Float32BufferAttribute( colors, 3 ) );
            const positionNumComponents = 3;
            const normalNumComponents = 3;
            const uvNumComponents = 2;
            geometry.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents)
            );
            geometry.setAttribute(
            'normal',
            new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents)
            );
            geometry.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents)
            );
            
        }
       
        this.#extrude = new THREE.Mesh( geometry, material);

        this.#extrude.position.set(points[0].x,points[0].y,points[0].z);
        //this.Extrude.DefaultUp.set(0, 0, 1);
        this.#extrude.lookAt(points[1])
        this.#extrude.rotateZ(this.#frame.Rotation);

        // if(points[1] - points[4] != 0 && points[2]-points[5] == 0 && points[0]-points[3] == 0){
        //     this.#extrude.material.color.setHex(0xa200ab);
        //     this.#extrude.rotation.z = (Math.PI/2);
        // }

    }

    #GetThreeShape(){

        let threeShape = new THREE.Shape();
        let dimensions = this.Frame.Section.Dimensions;
        switch (this.Frame.Section.SecType) {
            case ESectionShape.Rectangular:
                threeShape.moveTo(-dimensions[0]/2,-dimensions[1]/2);
                threeShape.lineTo(dimensions[0]/2,-dimensions[1]/2);
                threeShape.lineTo(dimensions[0]/2,dimensions[1]/2);
                threeShape.lineTo(-dimensions[0]/2,dimensions[1]/2);
                threeShape.lineTo(-dimensions[0]/2,-dimensions[1]/2);
                break;
            
            case ESectionShape.Circular:
                let theta = 0;
                let segments = 32
                let step = 2*Math.PI/segments;
                threeShape.moveTo(dimensions[0]*Math.cos(theta), dimensions[0]*Math.sin(theta));
                for (let i = 1; i <= segments; i++) {
                    theta+=step;
                    threeShape.lineTo(dimensions[0]*Math.cos(theta), dimensions[0]*Math.sin(theta));   
                }
                break;
           
            case ESectionShape.ISec:
                threeShape.moveTo(-dimensions[4]/2, -dimensions[0]/2);
                threeShape.lineTo(dimensions[4]/2 , -dimensions[0]/2);
                threeShape.lineTo(dimensions[4]/2, -(dimensions[0]/2-dimensions[5]));
                threeShape.lineTo(dimensions[3]/2, -(dimensions[0]/2-dimensions[5]));
                threeShape.lineTo(dimensions[3]/2, (dimensions[0]/2-dimensions[2]));
                threeShape.lineTo(dimensions[1]/2, (dimensions[0]/2-dimensions[2]));
                threeShape.lineTo(dimensions[1]/2 , dimensions[0]/2);
                threeShape.lineTo(-dimensions[1]/2, dimensions[0]/2);
                threeShape.lineTo(-dimensions[1]/2, (dimensions[0]/2-dimensions[2]));
                threeShape.lineTo(-dimensions[3]/2, (dimensions[0]/2-dimensions[2]));
                threeShape.lineTo(-dimensions[3]/2, -(dimensions[0]/2-dimensions[5]));
                threeShape.lineTo(-dimensions[4]/2, -(dimensions[0]/2-dimensions[5]));
                threeShape.lineTo(-dimensions[4]/2, -dimensions[0]/2);
                break;
            
            case ESectionShape.TSec:
                let ycg = ( (dimensions[1]*dimensions[2]*(dimensions[0] - dimensions[2]/2) ) + (dimensions[3]*Math.sqrt(dimensions[0]-dimensions[2])/2) )
                /(dimensions[1]*dimensions[2]+dimensions[3]*(dimensions[0]-dimensions[2]));
               threeShape.moveTo(-dimensions[3]/2,-ycg);
               threeShape.lineTo(dimensions[3]/2,-ycg);
               threeShape.lineTo(dimensions[3]/2,dimensions[0]-dimensions[2]-ycg);
               threeShape.lineTo(dimensions[1]/2,dimensions[0]-dimensions[2]-ycg);
               threeShape.lineTo(dimensions[1]/2,dimensions[0]-ycg);
               threeShape.lineTo(-dimensions[1]/2,dimensions[0]-ycg);
               threeShape.lineTo(-dimensions[1]/2,dimensions[0]-dimensions[2]-ycg);
               threeShape.lineTo(-dimensions[3]/2,dimensions[0]-dimensions[2]-ycg);
               threeShape.lineTo(-dimensions[3]/2,-ycg);
                break;
        
            case ESectionShape.Tapered:
                threeShape=null;
                break;
        }
        return threeShape;
    }

    get Frame(){
        return this.#frame;
    }

    get line(){
        return this.#line;
    }

    get refline(){
        return this.#refLine;
    }

    get label(){
        return this.#label;
    }

    get name(){
        return this.#name;
    }

    get Extrude(){
        return this.#extrude;
    }

    static get DrawLinesArray(){
        return DrawLine.#drawLinesArray;
    }

    static DisplayLabels(){   
        DrawLine.DrawLinesArray.forEach(drawLine=> drawLine.label.visible = true);
    }
    
    static HideLabels(){
        DrawLine.DrawLinesArray.forEach(drawLine=> drawLine.label.visible = false);
    }

    static DisplaySectionNames(){
        DrawLine.DrawLinesArray.forEach(drawLine=> drawLine.name.visible = true);
    }

    static HideSectionNames(){
        DrawLine.DrawLinesArray.forEach(drawLine=> drawLine.name.visible = false);
    }

    static StandardView(){
        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.Extrude.visible=false);
        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.line.visible=true);
        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.InView());
    }

    static ExtrudeView(){

        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.Extrude.visible=true);
        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.line.visible=false);
        DrawLine.DrawLinesArray.forEach(drawLine => drawLine.InView());
    }

    static GetDrawnFrames(){
        let drawnFrames = [];
        DrawLine.DrawLinesArray.forEach(drawn=> drawnFrames.push(drawn.Frame));
        return drawnFrames;
    }

    static GetSelectedFrames(){
        let selectedFrames = [];
        DrawLine.SelectedLines.forEach(selLine=>selectedFrames.push(selLine.Frame));
        return selectedFrames;
    }

    static HideLoads(){
        DrawLine.DrawLinesArray.forEach( line => {
            line.#dispLoads.forEach(load =>{
                scene.remove(load);
                load.clear();
            });
        });
    }

    ReExtrude(){
        scene.remove(this.#extrude);
        this.#SetExtrude();
        scene.add(this.#extrude);
        if(state == true) 
        {
            this.#extrude.visible = false;
            this.line.visible = true;
        }else{
            
            this.#extrude.visible = true;
            this.line.visible = false;
        }
        this.updateColors();
        this.InView()
    }

    ReSetSecName(){
        scene.remove(this.name)
        this.#SetName();
        scene.add(this.name);
        if(state == true) this.name.visible=true;
        else this.name.visible=false;
    }

    DisplayLoad(pattern){
        pattern = (pattern==null)?DrawLine.DisplayedPattern:pattern;
        // remove loads displayed last time
        this.#dispLoads.forEach(load =>{
            load.clear()
            scene.remove(load);
        });
        this.#dispLoads.length = 0;

        // draw loads applied to frame element in in a certain pattern
        if(this.Frame.LoadsAssigned.has(pattern)){

            this.Frame.LoadsAssigned.get(pattern).forEach(loadApply => {
                let loadMesh = this.#DrawLoad(pattern,loadApply);  //object 3D (group)
                this.#dispLoads.push(loadMesh);
            });

        }

        // add loads representation to scene
        this.#dispLoads.forEach(dispLoad => scene.add(dispLoad));

        // check the mode of the editor to make loads visible or invisible
        if(DrawLine.LoadsDisplayed){
            this.#dispLoads.forEach(dispLoad => dispLoad.visible = true);
            //console.log(this.#dispLoads);
        }else{
            this.#dispLoads.forEach(dispLoad => dispLoad.visible = false);
        }
    }

    #DrawLoad(patternId ,AppliedLoad){
        const scale = 1.25 / GetMaxLoad(patternId);
        const startPoint = this.Frame.StartPoint.position;
        const endPoint = this.Frame.EndPoint.position;
        const magnitudes = AppliedLoad.Magnitude;
        const dir = AppliedLoad.Dir;
        const coordSys = AppliedLoad.CoordSys;       
        const relDist = AppliedLoad.Distance ;
        const rotation = this.Frame.Rotation ;
        let load;
        switch(AppliedLoad.Shape){
            case ELoadShape.Distributed:
                
                const loadPos1 = GetAbsoluteCoord(relDist[0] ,startPoint, endPoint);
                const loadPos2 = GetAbsoluteCoord(relDist[1] ,startPoint, endPoint);
                load=DistributedLoadIndication(magnitudes[0] ,loadPos1, loadPos2, dir, rotation, scale, magnitudes[1], coordSys);
                break;
            case ELoadShape.Point:
                load=PointLoadIndication (magnitudes, relDist, startPoint, endPoint,  dir, rotation, scale , coordSys);
                break;
        }
        return load;
    }

    excute()
    { 
        DrawLine.#drawLinesArray.push(this);
        scene.add(this.refline);
        scene.add(this.line);
        scene.add(this.Extrude);
        scene.add(this.label); 
        scene.add(this.name);
        Labels(); 
    }

    undo() 
    {
        DrawLine.DrawLinesArray.splice(DrawLine.DrawLinesArray.indexOf(this),1);
        this.#dispLoads.forEach(load =>{
            load.clear()
            scene.remove(load);
        });
        this.#dispLoads.length = 0; 
        scene.remove(this.refline);
        scene.remove(this.line);
        scene.remove(this.Extrude);
        scene.remove(this.label);
        scene.remove(this.name);  
        this.Frame.undo();     
    }

    redo()
    {
        DrawLine.DrawLinesArray.push(this);
        scene.add(this.refline);
        scene.add(this.line);
        scene.add(this.Extrude);
        scene.add( this.label ); 
        scene.add(this.name);    
        this.Frame.redo();
        this.InView();
        if(state == false) Extrude();
        else Standard();
        Labels(); 
    }

    remove()
    {
        //DrawLine.DrawLinesArray.splice(DrawLine.DrawLinesArray.indexOf(this),1);  //DrawLine.DrawLinesArray.indexOf(this));
        this.refline.material.dispose();
        this.refline.geometry.dispose();
        this.line.material.dispose();
        this.line.geometry.dispose();
        this.Extrude.material.dispose();
        this.Extrude.geometry.dispose();
        this.label.material.dispose();
        this.name.material.dispose();
        this.Frame.remove();
    }

    updateColors()
    {
        if(this.Selected == true)
        { 
            this.line.material.color =    {r:1,g:0.4,b:0};
            this.Extrude.material.color = {r:1,g:0.3,b:0};
            this.Extrude.material.metalness = 0;
        }
        else{
            this.line.material.color = this.LineColor;
            this.Extrude.material.metalness = 0.5;
            this.Extrude.material.color = this.ExtrudedColor;
        }
        
    }

    Hide()
    {
        scene.remove(this.line);
        scene.remove(this.Extrude);
        scene.remove(this.refline);
        scene.remove(this.label);
        scene.remove(this.name);
        this.#dispLoads.forEach(load =>{
            scene.remove(load);
            load.clear()
        });
    }

    Show()
    {
        scene.add(this.line);
        scene.add(this.Extrude);
        scene.add(this.refline);
        scene.add(this.label);
        scene.add(this.name);
        if(DrawLine.DisplayedPattern) this.DisplayLoad(DrawLine.DisplayedPattern);
    }

    InView()
    {
        if(view == "XY")
        {
            if(this.Frame.StartPoint.position[2] != ViewPosition || this.Frame.EndPoint.position[2] != ViewPosition)
            {
                this.Hide();
            }
        }
        else if(view == "XZ")
        {
            if(this.Frame.StartPoint.position[1] != ViewPosition || this.Frame.EndPoint.position[1] != ViewPosition)
            {
                this.Hide();
            }
        }
        else if(view == "YZ")
        {
            if(this.Frame.StartPoint.position[0] != ViewPosition || this.Frame.EndPoint.position[0] != ViewPosition)
            {
                this.Hide();
            }
        }
        else{
            this.Show();
        }
    }
}

// Do not undo except from frame element
class Point
{
    static PointsArray = [];
    static SelectedPoints = [];
    static #Pointnum = 1;

    constructor(point)
    {
        this.Shared = [];
        this.Label = Point.#Pointnum;
        Point.#Pointnum += 1;
        this.Selected = false;
      
        this.position = [point[0], point[1], point[2]];
        
        this.Restraint = [false, false, false, false, false, false];

        this.dot = DrawPoint(this.position);

        this.SupportIndication = DrawPoint(this.position,1);

        // crosshair
        var material = new THREE.LineBasicMaterial({ color: 'rgb(0,50,100)', alphaTest: 0.95, transparent : true, opacity: 0});
        // crosshair size
        var x = 0.3, y = 0.3;
        var geometry = new THREE.BufferGeometry();
        var vertices =[];  
        vertices.push(x, y, 0);
        vertices.push(-x, -y, 0);
        vertices.push(0, 0, 0);
        vertices.push(x, -y, 0); 
        vertices.push(-x, y, 0);
        geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        this.crosshair = new THREE.Line( geometry, material );
        this.crosshair.position.x = this.position[0];
        this.crosshair.position.y = this.position[1];
        this.crosshair.position.z = this.position[2];

        Point.PointsArray.push(this);

        this.obj = BoxSnap(0.3, 0.3, 0.3);
        this.obj.position.x = this.position[0];
        this.obj.position.y = this.position[1];
        this.obj.position.z = this.position[2];
    }
    excute(frame=null)
    {
        if(frame !=null){  this.Shared.push(frame); }
        scene.add( this.dot );
        scene.add( this.crosshair );
        scene.add( this.SupportIndication );
        group.add(this.obj);
    }
    undo(frame=null)
    {
        if(frame != null){
            this.Shared.splice(Point.PointsArray.indexOf(frame),1);
        }
        if(this.Shared.length == 0)
        {
            scene.remove(this.dot); 
            scene.remove( this.crosshair );
            scene.remove( this.SupportIndication );
            const index = Point.PointsArray.indexOf(this); 
            Point.PointsArray.splice(index, 1);
            group.remove(this.obj);
        }
    }
    redo(frame=null)
    {
        if(this.Shared.length == 0)
        {
            scene.add( this.dot );
            scene.add( this.crosshair );
            scene.add( this.SupportIndication );
            Point.PointsArray.push(this);
            group.add(this.obj);
        }
        if(frame != null){this.Shared.push(frame);}
        this.InView();
    }

    remove()
    {
        if(this.Shared.length == 0)
        {
            this.position = null;
            this.Label = null;
            this.dot.material.dispose();
            this.dot.geometry.dispose();
            this.crosshair.material.dispose();
            this.crosshair.geometry.dispose();
            this.obj.material.dispose();
            this.obj.geometry.dispose();
            this.SupportIndication.material.dispose();
            this.SupportIndication.geometry.dispose();
        }
    }
    Highlight()
    {
        if(this.Selected == true && this.Shared.length > 0)
        { 
            this.crosshair.material.opacity = 1;
        }
        else{
            this.crosshair.material.opacity = 0;
        }   
        
    }

    Hide()
    {
        scene.remove(this.dot);
        scene.remove(this.crosshair);
        scene.remove( this.SupportIndication );
        group.remove(this.obj);
    }
    Show()
    {
        scene.add(this.dot);
        scene.add(this.crosshair);
        scene.add( this.SupportIndication );
        group.add(this.obj);
    }

    InView()
    {
        if(view == "XY")
        {
            if(this.position[2] != ViewPosition)
            {
                this.Hide();
            }
        }
        else if(view == "XZ")
        {
            if(this.position[1] != ViewPosition)
            {
                this.Hide();
            }
        }
        else if(view == "YZ")
        {
            if(this.position[0] != ViewPosition)
            {
                this.Hide();
            }
        }
        else{
            this.Show();
        }
    }

    ViewIndication()
    {
        scene.remove(this.SupportIndication)

        if(arrayEquals(this.Restraint, [true, true, true, false, false, false]))
        {
            this.SupportIndication = DrawHinge(this.position);
        }
        else if(arrayEquals(this.Restraint, [true, true, true, true, true, true]))
        {
            this.SupportIndication = DrawFix(this.position);
        }
        else if(arrayEquals(this.Restraint, [false, false, true, false, false, false]))
        {
            this.SupportIndication = DrawRoller(this.position);
        }
        else{
            this.SupportIndication = DrawPoint(this.position, 1);
        }
        this.InView();
    }

    toJSON()
    {
        return{label:this.Label, position:this.position, Restraints:this.Restraint}
    }
}



class AssignFrameLoad{

    constructor(lines, pattern, appliedLoadInfo){

        this.Lines = [...lines];                //array of DrawLine objects                    
        this.Pattern = pattern;                 //pattern id
        this.AppliedLoad = appliedLoadInfo;     //instance (array) of AppliedLoadInfo Class
    }

    excute(){
        this.#PushInFrameLoadsAssigned();
        this.#PushInPatternOnElements();
        //draw...
        Standard();
        Labels();        
        DrawLine.LoadsDisplayed = true;
        DrawLine.DrawLinesArray.forEach(line => line.DisplayLoad(this.Pattern));
    }

    undo(){
        
        this.#PopFromFrameLoadsAssigned();
        Standard();
        Labels();     
        DrawLine.LoadsDisplayed = true;    
        this.Lines.forEach(line => line.DisplayLoad(this.Pattern));

    }

    redo(){

        this.excute();
    }

    remove(){
        this.Lines.length = 0;
        this.Pattern = null;
    }

    #PushInFrameLoadsAssigned(){
        
        for (const line of this.Lines) {

            this.AppliedLoad.forEach( appLoad => {
                    
                if(line.Frame.LoadsAssigned.has(this.Pattern)){
                    let appliedLoads = line.Frame.LoadsAssigned.get(this.Pattern);
                    let similarLoads = appliedLoads.filter(load => (load.Shape == appLoad.Shape && load.Type == appLoad.Type) );
                    if(!similarLoads.length) appliedLoads.push(appLoad);
                    else{
                        if(similarLoads[0].Shape == ELoadShape.Distributed){
                            let index = appliedLoads.indexOf(similarLoads[0]);
                            appliedLoads[index] = appLoad;
                        }
                        else{
                            let atSameDis = similarLoads.filter(simLoad => simLoad.Distance == appLoad.Distance);
                            if(! atSameDis.length) appliedLoads.push(appLoad);
                            else {
                                let index = appliedLoads.indexOf(atSameDis[0]);
                                appliedLoads[index] = appLoad;
                            }
                        }
                    }
                }else{
                    line.Frame.LoadsAssigned.set(this.Pattern,[appLoad]);
                }
            })
        }
    }

    #PushInPatternOnElements(){
        let pattern = LoadPattern.LoadPatternsList.get(this.Pattern);
        for (const line of this.Lines) {
            if(!pattern.OnElements.includes(line.Frame.Label)) pattern.OnElements.push(line.Frame.Label);
        }
    }

    #PopFromFrameLoadsAssigned(){

        for (const line of this.Lines) {
            if(line.Frame.LoadsAssigned.has(this.Pattern)){

                let pattApplLoads = line.Frame.LoadsAssigned.get(this.Pattern);
                for (const appLoad of this.AppliedLoad) {
                    let index = pattApplLoads.indexOf(appLoad);
                    pattApplLoads.splice(index,1);              
                }
                if(!pattApplLoads.length){
                    line.Frame.LoadsAssigned.delete(this.Pattern);
                    let pattern = LoadPattern.LoadPatternsList.get(this.Pattern);
                    let frameIndex = pattern.OnElements.indexOf(line.Frame.Label);
                    pattern.OnElements.splice(frameIndex,1);
                }
            }
        }
    }
    
}



class Delete
{
    constructor(selected)
    {
        this.DeletedList = [];
        for(let i = 0; i <selected.length; i++){
            this.DeletedList.push(selected[i]);
        }
    }
    excute()
    {
        for(let i = 0; i<this.DeletedList.length ; i++)
        {
            this.DeletedList[i].undo();
        }
        
    }
    undo()
    {
        for(let i = 0; i<this.DeletedList.length ; i++)
        {
            this.DeletedList[i].redo();
        }
    }
    redo()
    {
        for(let i = 0; i<this.DeletedList.length ; i++)
        {
            this.DeletedList[i].undo();
        }
    }

    remove()
    {
        for(let i = 0; i<this.DeletedList.length ; i++)
        {
            this.DeletedList[i].remove();
        }
    }
}


class AssignFrameSection{
    constructor(section){
        this.selectedFrames = DrawLine.GetSelectedFrames();
        this.selectedLines = [...DrawLine.SelectedLines];
        this.prevSections = [];
        this.newSection = section;
        this.selectedFrames.forEach(frame=>this.prevSections.push(frame.Section));
    }

    excute(){
        this.selectedFrames.forEach(frame => frame.Section = this.newSection);
        this.selectedLines.forEach(drawLine=>drawLine.ReExtrude());
        DrawLine.DrawLinesArray.forEach(drawLine=>drawLine.ReSetSecName());
    }
    undo(){
        for (let i = 0; i < this.selectedFrames.length; i++) {
            this.selectedFrames[i].Section = this.prevSections[i] ;          
        }
        this.selectedLines.forEach(drawLine=>drawLine.ReExtrude());
    }
    redo(){
        this.excute();
    } 
    remove(){
        this.selectedFrames = null
        this.selectedLines = null
        this.prevSections = null
        this.newSection = null
    }  
}

document.querySelector('#point-load-btn').addEventListener("click", function(){
    if(!document.querySelector('.main-window')){
        $('body').append(GetPtLoadWin());
        AppliedLoadPatts();
        document.querySelector('#coord-sys').addEventListener("change",FillLoadsDirs);
        document.querySelector('#ok-ptload-btn').addEventListener('click', function(){
            let appliedLoads =  GetPtLoadInfo();
            let patternId = GetAppLoadPatternId();
            DrawLine.DisplayedPattern = patternId
            if(DrawLine.SelectedLines.length && appliedLoads.length){

                commands.excuteCommand(new AssignFrameLoad(DrawLine.SelectedLines, patternId, appliedLoads));
            }
            //console.log(appliedLoads, patternId);
            document.querySelector('.main-window').parentElement.parentElement.remove();
        });
        document.querySelector('#close-ptload-btn').addEventListener('click', function(){
            document.querySelector('.main-window').parentElement.parentElement.remove();
        });
    }
});

document.querySelector('#distributed-load-btn').addEventListener("click", function(){
    if(!document.querySelector('.main-window')){
        $('body').append(GetDistLoadWin());
        AppliedLoadPatts();
        document.querySelector('#coord-sys').addEventListener("change",FillLoadsDirs);
        document.querySelector('#ok-disload-btn').addEventListener('click', function(){
            let appliedLoads =  GetDistLoadInfo();
            let patternId = GetAppLoadPatternId();
            DrawLine.DisplayedPattern = patternId;
            if(DrawLine.SelectedLines.length && appliedLoads.length){

                commands.excuteCommand(new AssignFrameLoad(DrawLine.SelectedLines, patternId, appliedLoads));
            }
            document.querySelector('.main-window').parentElement.parentElement.remove();
        });
        document.querySelector('#close-disload-btn').addEventListener('click', function(){
            document.querySelector('.main-window').parentElement.parentElement.remove();
        })
    }
});

document.querySelector('#disp-load-btn').addEventListener("click", function(){
    if(!document.querySelector('.main-window')){
        $('body').append(dispLoadsWindow);
        DispLoadPatts();
        document.querySelector('#ok-disp-load-btn').addEventListener("click", function(){
            // go in show load mode
            let patId = GetDispLoadPatternId();
            DrawLine.LoadsDisplayed = true;
            DrawLine.DisplayedPattern = patId;
            Standard();
            DrawLine.DrawLinesArray.forEach(line => {                
                line.DisplayLoad(patId);
                line.InView()
            });
            document.querySelector('.main-window').parentElement.parentElement.remove();
        });
        document.querySelector('#close-disp-load-btn').addEventListener("click", function(){
            document.querySelector('.main-window').parentElement.parentElement.remove();
        });
    }
});

class Copy
{
    constructor(Delta, repetition )
    {
        this.Delta = Delta;
        this.CopiedList = [];
        this.Copies = [];
        this.repitition = repetition;
        for(let i = 0; i <DrawLine.SelectedLines.length; i++){
            this.CopiedList.push(DrawLine.SelectedLines[i]);
        }
    }
    excute()
    {
        Unselect();
        for(let k = 1; k <= this.repitition; k++ )
        {
            for(let i = 0; i<this.CopiedList.length ; i++)
            {
                let points = [];
                points.push(this.CopiedList[i].Frame.StartPoint.position[0] + this.Delta[0]*k)
                points.push(this.CopiedList[i].Frame.StartPoint.position[1] + this.Delta[1]*k)
                points.push(this.CopiedList[i].Frame.StartPoint.position[2] + this.Delta[2]*k)
                points.push(this.CopiedList[i].Frame.EndPoint.position[0] + this.Delta[0]*k)
                points.push(this.CopiedList[i].Frame.EndPoint.position[1] + this.Delta[1]*k)
                points.push(this.CopiedList[i].Frame.EndPoint.position[2] + this.Delta[2]*k)
            
                let Copy = new DrawLine(new FrameElement(points, this.CopiedList[i].Frame.Section));
                let number = this.CopiedList[i].Frame.AssociatedPoints.length +1;
                Copy.Frame.Rotation = this.CopiedList[i].Frame.Rotation;
                Copy.Frame.StartPoint.Restraint = [...this.CopiedList[i].Frame.StartPoint.Restraint];
                Copy.Frame.StartPoint.ViewIndication();
                Copy.Frame.EndPoint.Restraint = [...this.CopiedList[i].Frame.EndPoint.Restraint];
                Copy.Frame.EndPoint.ViewIndication();
                secUpdated = true;
                Copy.Frame.AddPointsAtEqualDistances(number);
                Copy.Frame.LoadsAssigned = this.cloneLoadsAssigned(this.CopiedList[i], Copy);
                Copy.DisplayLoad();
                this.Copies.push(Copy); 
                Copy.excute();
            }
        }
        this.CopiedList = [];
    }
    undo()
    {
        for(let i = 0; i<this.Copies.length ; i++)
        {
            this.Copies[i].undo();
        }
    }
    redo()
    {
        for(let i = 0; i<this.Copies.length ; i++)
        {
            this.Copies[i].redo();
        }
    }

    remove()
    {
        for(let i = 0; i<this.Copies.length ; i++)
        {
            this.Copies[i].remove();
        }
    }

    cloneLoadsAssigned(line, copy)
    {
        let map = new Map();
        line.Frame.LoadsAssigned.forEach((value, key) => {
            let tempLoads = [];
            LoadPattern.LoadPatternsList.get(key).OnElements.push(copy.Frame.Label);
            value.forEach(load => tempLoads.push(load.Clone()));
            map.set(key,tempLoads);
        });
        return map;
    }
    
}

class Move
{
    constructor(Delta)
    {
        this.Delta = Delta;
        this.TempList = [];
        this.Moved = [];
        for(let i = 0; i <DrawLine.SelectedLines.length; i++){
            this.TempList.push(DrawLine.SelectedLines[i]);
        }
    }
    excute()
    {
        Unselect();
        for(let i = 0; i<this.TempList.length ; i++)
        {
            let points = [];
            points.push(this.TempList[i].Frame.StartPoint.position[0] + this.Delta[0])
            points.push(this.TempList[i].Frame.StartPoint.position[1] + this.Delta[1])
            points.push(this.TempList[i].Frame.StartPoint.position[2] + this.Delta[2])
            points.push(this.TempList[i].Frame.EndPoint.position[0] + this.Delta[0])
            points.push(this.TempList[i].Frame.EndPoint.position[1] + this.Delta[1])
            points.push(this.TempList[i].Frame.EndPoint.position[2] + this.Delta[2])
    
            let move = new DrawLine(new FrameElement(points, this.TempList[i].Frame.Section));
            let number = this.TempList[i].Frame.AssociatedPoints.length +1;
            move.Frame.AddPointsAtEqualDistances(number);
            move.Frame.Rotation = this.TempList[i].Frame.Rotation;
            secUpdated = true;
            move.Frame.StartPoint.Restraint = this.TempList[i].Frame.StartPoint.Restraint;
            move.Frame.StartPoint.ViewIndication();
            move.Frame.EndPoint.Restraint = this.TempList[i].Frame.EndPoint.Restraint;
            move.Frame.EndPoint.ViewIndication();
            move.Frame.LoadsAssigned = this.TempList[i].Frame.LoadsAssigned;
            move.Frame.LoadsAssigned.forEach((value, key) => LoadPattern.LoadPatternsList.get(key).OnElements.push(move.Frame.Label));
            move.DisplayLoad();
            this.Moved.push(move); 
            move.excute();
            this.TempList[i].undo();
        }
    }
    undo()
    {
        for(let i = 0; i<this.Moved.length ; i++)
        {
            this.Moved[i].undo();
            this.TempList[i].redo();
        }
    }
    redo()
    {
        for(let i = 0; i<this.Moved.length ; i++)
        {
            this.Moved[i].redo();
            this.TempList[i].undo();
        }
    }

    remove()
    {
        for(let i = 0; i<this.Moved.length ; i++)
        {
            this.Moved[i].remove();
        }
    }
}

class AssignRestraints
{
    constructor(restraint)
    {
        this.SelectedPoints = [];
        for(let i = 0; i < Point.SelectedPoints.length; i++)
        {
            this.SelectedPoints.push(Point.SelectedPoints[i]);
        }
        this.TempRestraints = [];   
        this.Restraint = [...restraint];
    }

    excute()
    {
        Unselect();
        for(let i = 0; i < this.SelectedPoints.length; i++)
        {
            this.TempRestraints[i] = this.SelectedPoints[i].Restraint;
            this.SelectedPoints[i].Restraint = [...this.Restraint];
            this.SelectedPoints[i].ViewIndication();
        }
    }

    undo()
    {
        for(let i = 0; i < this.SelectedPoints.length; i++)
        {
            this.SelectedPoints[i].Restraint = this.TempRestraints[i];
            this.SelectedPoints[i].ViewIndication()
        }
    }

    redo()
    {
        this.excute();
    }

    remove()
    {
        this.SelectedPoints = null;
        this.TempRestraints = null;
        this.Restraint = null;
    }
}

class RotateFrame
{
    constructor(degree)
    {
        this.rad = degree * Math.PI / 180;
        this.SelectedFrames = [];
        this.TempRotations = []; 
        for(let i = 0; i < DrawLine.SelectedLines.length; i++)
        {
            this.SelectedFrames.push(DrawLine.SelectedLines[i]);
            this.TempRotations.push(DrawLine.SelectedLines[i].Frame.Rotation)
        }
    }
    excute() 
    {
        Unselect();
        for(let i = 0; i < this.SelectedFrames.length; i++)
        {
            this.SelectedFrames[i].Frame.Rotation = this.rad;
            secUpdated = true;
        }
    }
    undo()
    {
        for(let i = 0; i < this.SelectedFrames.length; i++)
        {
            this.SelectedFrames[i].Frame.Rotation = this.TempRotations[i];
            secUpdated = true;
        }
    }
    redo()
    {
        for(let i = 0; i < this.SelectedFrames.length; i++)
        {
            this.SelectedFrames[i].Frame.Rotation = this.rad;
            secUpdated = true;
        }
    }
    remove()
    {
        this.SelectedFrames=[];
        this.TempRotations=[]; 
    }
}


document.getElementById("Undo").onclick=function(){Undo()};
function Undo()
{
    commands.undoCommand();
    Unselect();
}

document.getElementById("Redo").onclick=function(){Redo()};
function Redo()
{
    commands.redoCommand();
    Unselect();
}

document.getElementById("Extrude").onclick=function(){Extrude()};
function Extrude()
{   
    state = false;
    DrawLine.LoadsDisplayed = false;
    DrawLine.HideLoads();
    DrawLine.ExtrudeView();
    document.getElementById("Labels").checked = false;                     
    document.getElementById("Sections").checked = false;
    Labels();
}

document.getElementById("Standard").onclick=function(){Standard()};
function Standard(){   
    state = true; 
    DrawLine.StandardView();
}


document.getElementById("Labels").onclick=function(){Labels()};
document.getElementById("Sections").onclick=function(){Labels()};
function Labels()
{   
    var checkBox_labels = document.getElementById("Labels");
    var checkBox_sections = document.getElementById("Sections");
    if(checkBox_labels.checked == true)
    {
        Standard();
        DrawLine.DisplayLabels();
    }
    else{
        DrawLine.HideLabels();
    }
    if(checkBox_sections.checked == true)
    {
        Standard();
        DrawLine.DisplaySectionNames();
    }
    else
    {
      DrawLine.HideSectionNames();
    } 
}

document.getElementById("Draw").onclick=function(){DrawingMode()};
function DrawingMode()
{
    DrawingModeActive = true;
    SelectionModeActive = false;
    Unselect();
}

document.addEventListener('dblclick',()=>{
    Unselect();
});

function Unselect()
{
    while(DrawLine.SelectedLines.length > 0)
    {
       DrawLine.SelectedLines[0].Selected = false;
       DrawLine.SelectedLines[0].updateColors();
       DrawLine.SelectedLines.shift();
    }
    while(Point.SelectedPoints.length > 0)
    {
        Point.SelectedPoints[0].Selected = false;
        Point.SelectedPoints[0].Highlight();
        Point.SelectedPoints.shift();
    }
}


function DrawHinge(position)
{
    const material = new THREE.LineBasicMaterial({ alphaTest:1, opacity:1 });
    material.color = {r:0, g:0, b: 0, a:1};
    let geometry = new THREE.BufferGeometry();
    let vertices =[];  
    vertices.push(0 ,0 ,0);
    vertices.push(0.35, 0, -0.35);
    vertices.push(-0.35, 0, -0.35);
    vertices.push(0 ,0 ,0);
    vertices.push(0, 0.35, -0.35);
    vertices.push(0, -0.35, -0.35);
    vertices.push(0 ,0 ,0);
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    let hinge = new THREE.Line( geometry, material );
    hinge.position.x = position[0];
    hinge.position.y = position[1];
    hinge.position.z = position[2];
    return hinge;
}


function DrawFix(position)
{
    const material = new THREE.LineBasicMaterial();
    material.color = {r:0, g:0, b: 0, a:1};
    let geometry = new THREE.BufferGeometry();
    let vertices =[];  
    vertices.push(0 ,0 ,0);
    vertices.push(0.45, 0, 0);
    vertices.push(0.45, 0, -0.35);
    vertices.push(-0.45, 0, -0.35);
    vertices.push(-0.45, 0, 0);
    vertices.push(0 ,0 ,0);
    vertices.push(0, 0.45, 0);
    vertices.push(0, 0.45, -0.35);
    vertices.push(0, -0.45, -0.35);
    vertices.push(0, -0.45, 0);
    vertices.push(0 ,0 ,0);
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    const fix = new THREE.Line( geometry, material );
    fix.position.x = position[0];
    fix.position.y = position[1];
    fix.position.z = position[2];
    return fix;
}


function DrawRoller(position)
{
    const material = new THREE.LineBasicMaterial();
    material.color = {r:0, g:0, b: 0, a:1};
    let geometry = new THREE.BufferGeometry();
    let vertices =[];  
    vertices.push(0 ,0 ,0);
    vertices.push(0.35, 0, -0.35);
    vertices.push(-0.35, 0, -0.35);
    vertices.push(0 ,0 ,0);
    vertices.push(0, 0.35, -0.35);
    vertices.push(0, -0.35, -0.35);
    vertices.push(0 ,0 ,0);
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    let roller = new THREE.Line( geometry, material );

    const curve = new THREE.EllipseCurve(
        0,  0,            // ax, aY
        0.12, 0.12,           // xRadius, yRadius
        0,  2 * Math.PI,  // aStartAngle, aEndAngle
        false,            // aClockwise
        0                 // aRotation
    );

    const points = curve.getPoints( 15 );
    const circleGeometry = new THREE.BufferGeometry().setFromPoints( points );

    let rollersCordinates = [[0,0,-0.35*1.35,22/14,0],[0,0,-0.35*1.35,0,22/14]];
    for(let i = 0; i < 2; i++)
    {
        const circle = new THREE.Line( circleGeometry, material );
        circle.position.x = rollersCordinates[i][0];
        circle.position.y = rollersCordinates[i][1];
        circle.position.z = rollersCordinates[i][2];
        circle.rotation.x = rollersCordinates[i][3];
        circle.rotation.y = rollersCordinates[i][4];
        roller.add(circle);
    }
    let vertex = []
    vertex.push(0.2, 0, -0.35*1.7);
    vertex.push(-0.2, 0, -0.35*1.7);
    vertex.push(0 ,0 ,-0.35*1.7);
    vertex.push(0, 0.2, -0.35*1.7);
    vertex.push(0, -0.2, -0.35*1.7);

    let BottomGeometry = new THREE.BufferGeometry();
    BottomGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertex, 3 ) );
    let Lines = new THREE.Line( BottomGeometry, material )
    roller.add(Lines);

    roller.position.x = position[0];
    roller.position.y = position[1];
    roller.position.z = position[2];
    return roller;
}

function DrawPoint(position, alphaTest=0)
{
    let dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( position, 3 ) );
    let dotMaterial = new THREE.PointsMaterial( { size: 1, sizeAttenuation: false, alphaTest:alphaTest, transparent: true, opacity: 0.8 } );
    let dot = new THREE.Points( dotGeometry, dotMaterial );
    return dot;
}
