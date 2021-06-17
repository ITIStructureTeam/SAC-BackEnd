const ELoadPatternType={
    Dead:0,
    Live:1,
    Wind:2,
    Other:3
}
const ECoordSys={
    Local:true,
    Global: false
}

const ELoadType= {
    Force: 0,
    Moment: 1
}

const ELoadShape = {
    Point: 0,
    Distributed: 1
}
Object.freeze(ELoadPatternType);
Object.freeze(ECoordSys);
Object.freeze(ELoadType);
Object.freeze(ELoadShape);


class LoadPattern{

    #name;
    #type;
    #selfWtMult
    #inCombos;
    #id;
    #onElements;
    static #loadPatternsList = new Map();
    static #loadPattId = 1;
    static #initPattern = (function(){
        new LoadPattern('DEAD',ELoadPatternType.Dead,1);
        new LoadPattern('LIVE',ELoadPatternType.Live,0);
    })();
    constructor(name, type, selfWtMult){

        this.#id = LoadPattern.#loadPattId;
        this.Name = name;
        this.Type = type;
        this.SelfWtMult = selfWtMult;
        this.#inCombos = new Array();
        this.#onElements = new Array();
        LoadPattern.LoadPatternsList.set(String(this.ID),this);
        LoadPattern.#loadPattId++;
    }

    set Name(value){

        if (typeof value != "string" && !(value instanceof String))
            throw new TypeError("Load Pattern Name must be string");


        let matching;
        for (const pattern of LoadPattern.#loadPatternsList.values()) {
            if(pattern.Name == value){
                matching = pattern;
                break;
            }
        }
        if(!matching) 
            this.#name=value;
        else{
            if(matching.#id != this.#id)
                throw new Error("There is another load pattern having the same name");
            this.#name=value;
        }
    }

    set Type(value){
        if (!(Object.keys(ELoadPatternType)[value]))
            throw new TypeError("invalid load pattern type");
        this.#type = value;
    }

    set SelfWtMult(value){
        if(isNaN(value)) throw new TypeError('self weight multiplier must be a number');
        this.#selfWtMult = Number(value)
    }

    get Name(){
        return this.#name;
    }

    get Type(){
        return this.#type;
    }

    get SelfWtMult(){
        return this.#selfWtMult;
    }

    get InCombos(){
        return this.#inCombos;
    }

    get OnElements(){
        return this.#onElements
    }

    get ID(){
        return this.#id;
    }

    set OnElements(value){
        this.#onElements = value;
    }
    static get LoadPatternsList(){
        return LoadPattern.#loadPatternsList;
    }

    AddCombo(comboName){
        this.InCombos.push(comboName);
    }
    RemoveCombo(comboName){
        let comboIndex = this.InCombos.indexOf(comboName);
        this.InCombos.splice(comboIndex, 1);
    }
    Delete(){
        if(this.OnElements.length) throw new Error('There are loads assigned in this pattern');
        if(this.InCombos.length)   throw new Error('This pattern is used in a load combination');
        LoadPattern.LoadPatternsList.delete(String(this.ID));
    }

    toJSON()
    {
        return{
            Name:this.Name,
            Type:this.Type,
            SelfWtMult:this.SelfWtMult
        }
    }
}

class LoadCombo {

    #name;
    #id;
    #loadPattsInfo;
    static #loadCombosList = new Map();
    static #loadComboId = 1;
    static #initLoadCombo = (function(){
        new LoadCombo('combo1',[ { patternId:'1'  , scaleFactor:1}]);
    })();

    constructor(name, loadPattsInfo){
        this.#id = LoadCombo.#loadComboId;
        this.Name = name;
        this._cpyNo = 0;
        this.LoadPattsInfo = loadPattsInfo;

        LoadCombo.LoadCombosList.set(String(this.ID), this);
        LoadCombo.#loadComboId++;
    }

    set Name(value){

        if (typeof value != "string" && !(value instanceof String))
            throw new TypeError("Load Combination Name must be string");
        if(value =='') throw new TypeError("Load Combination must have name");

        let matching;

        for (const combo of LoadCombo.#loadCombosList.values()) {
            if(combo.Name == value){
                matching = combo;
                break;
            }
        }

        if(!matching) 
            this.#name=value;
        else{
            if(matching.#id != this.#id)
                throw new Error("There is another load combination having the same name");
            this.#name=value;
        }
    }

    set LoadPattsInfo(value){
        
        // value = [ { patternId:  , scaleFactor:   }, { patternId:  , scaleFactor:  }, ... ]
        
        if (!(value instanceof Array))
            throw new TypeError("LoadPattsInfo must be in form of array");
        if(value.length == 0)
            throw new Error("a load pattern at least must exist in a load combination");
        this.#CheckPatterns(value);
        this.#CheckScaleFactors(value);
        this.#loadPattsInfo = value;
        this.#PushInPattsInCombos(value);
    }

    get Name(){
        return this.#name;
    }

    get LoadPattsInfo(){
        return this.#loadPattsInfo;
    }

    get ID(){
        return this.#id;
    }

    static get LoadCombosList(){
        return LoadCombo.#loadCombosList;
    }

    #CheckPatterns(laodpattsInfos){
        let pattsIds = []
        for (const laodpattInfo of laodpattsInfos) {
            let pattId = laodpattInfo.patternId;
            if(! LoadPattern.LoadPatternsList.has(pattId) ) 
                throw new Error ('invalid Load Pattern ');
            if(pattsIds.includes(pattId))
                throw new Error('load pattern can not be repeated in the same load combination');
            pattsIds.push(pattId);
        }
    }

    #CheckScaleFactors(laodpattsInfos){
        for (const laodpattInfo of laodpattsInfos) {
            let scale = laodpattInfo.scaleFactor;
            if(isNaN(scale)) throw TypeError('scale factors must be numbers');
        }
    }

    #PushInPattsInCombos(loadPattsInfo){
        for (const loadPattInfo of loadPattsInfo) {
            let pattId = loadPattInfo.patternId;
            let patt = LoadPattern.LoadPatternsList.get(pattId);
            if(! (patt.InCombos.includes(this.Name)) ) patt.InCombos.push(this.Name);
        }
    }

    AddLoadPattInfo(pattId, scale){
        let matching = this.LoadPattsInfo.filter( info => info.patternId==pattId);
        if(matching.length) throw new Error('the load pattern can not be duplicated');

        this.LoadPattsInfo.push({patternId:pattId, scaleFactor:scale});
        LoadPattern.LoadPatternsList.get(pattId).AddCombo(this.Name);
    }

    ModifyPattInfo(pattId, newPattId, newScale){
        let modified = this.LoadPattsInfo.filter( info => info.patternId == pattId);
        if(pattId === newPattId){
            modified.scaleFactor = newScale;
        }else{
            let matching = this.LoadPattsInfo.filter( info => info.patternId==newPattId);
            if(matching.length) {
                throw new Error('the load pattern can not be duplicated');
            }
            let index = this.LoadPattsInfo.indexOf(modified[0]);
            this.LoadPattsInfo[index] = {patternId: newPattId, scaleFactor: newScale};

            LoadPattern.LoadPatternsList.get(pattId).RemoveCombo(this.Name);
            LoadPattern.LoadPatternsList.get(newPattId).AddCombo(this.Name);
        }       
    }

    DeletePattInfo(pattId){

        if(this.LoadPattsInfo.length == 1) throw new Error('at least one load pattern must exist in a load combination');

        // get deleted info
        let deleted =  this.LoadPattsInfo.filter( info => info.patternId==pattId)[0];

        //check existence
        if(!deleted) throw new Error('this load pattern doesn`t exist in this cload combination');

        //deleting procedure
        let deletedIndex = this.LoadPattsInfo.indexOf(deleted);
        this.LoadPattsInfo.splice(deletedIndex, 1);

        //remove this combo name from pattern deleted from LoadPattsInfo
        LoadPattern.LoadPatternsList.get(pattId).RemoveCombo(this.Name);
    }

    Delete(){
        LoadCombo.LoadCombosList.delete(String(this.ID));
        for (const loadPattInfo of this.LoadPattsInfo) {
            let pattId = loadPattInfo.patternId;
            let pattern = LoadPattern.LoadPatternsList.get(pattId);
            let comboIndex = pattern.InCombos.indexOf(this.Name);
            pattern.InCombos.splice(comboIndex, 1);
        }
    }

    DeepCopyComboData(){
        return {Name: this.Name, LoadPattsInfo: [...this.LoadPattsInfo], cpyNo: this._cpyNo};
    }

    Clone(){
        this._cpyNo++;
        return new LoadCombo(`${this.Name}- ${this._cpyNo}`,this.LoadPattsInfo);
    }
}

class AppliedLoadInfo{

    #coordSys;
    #dir;
    #type
    #shape;
    #distance;
    #magnitude;

    constructor(coordSys , dir, type, shape, distance, magnitude){

        this.CoordSys = coordSys;       // for local (true)  for global (false)
        this.Dir = dir;                 // 1(x) or 2(z) or 3(y)
        this.Type = type;               // for force (0)   for moment (1)
        this.Shape = shape;             // for point(0)   for distr  (1)
        this.Distance = distance;       // one number for point  |  array of two numbers for distributed    (RELATIVE DISTANCE)
        this.Magnitude = magnitude;     // one number for point  |  array of two numbers for distributed
    }


    set CoordSys(value){
        if (!(Object.values(ECoordSys).includes(value))) throw new TypeError('Coordinate Systems accepts only true for loacal or false for global');
        this.#coordSys = value;
    }
    set Dir(value){
        if(value !== 1 && value !==2 && value !== 3) throw new TypeError('direction accepts only 1 or 2 or 3');
        this.#dir = value
    }
    set Type(value){
        if (!(Object.values(ELoadType).includes(value))) throw new TypeError('laod type accepts only 0 for force or 1 for moment');
        this.#type = value;
    }
    set Shape(value){
        if (!(Object.values(ELoadShape).includes(value))) throw new TypeError('load shape accepts only 0 for point or 1 for distributed');
        this.#shape = value;
    }
    set Distance(value){
        if(this.Shape == ELoadShape.Point){
            if(isNaN(value)) throw new TypeError('distance must be a number');
        }
        if(this.Shape == ELoadShape.Distributed){
            if( (! (value instanceof Array)) || value.length < 2 || value.slice(0,2).some(val=> isNaN(val)) )
            throw new TypeError ('Distance for distributed load must be in a form of array containing two numbers');
        }
        this.#distance = value;
    }

    set Magnitude(value){
        if(this.Shape == ELoadShape.Point){
            if(isNaN(value)) throw new TypeError('Magnitude must be a number');
        }
        if(this.Shape == ELoadShape.Distributed){
            if( (! (value instanceof Array)) || value.length < 2 || value.slice(0,2).some(val=> isNaN(val)) )
            throw new TypeError ('Magnitude for distributed load must be in a form of array containing two numbers one for each distance');
        }
        this.#magnitude = value;
    }
    
    get CoordSys(){
        return this.#coordSys;
    }
    get Dir(){
        return this.#dir;
    }
    get Type(){
        return this.#type;
    }
    get Shape(){
        return this.#shape;
    }
    get Distance(){
        return this.#distance;
    }
    get Magnitude(){
        return this.#magnitude;
    }

    toArray(object)
    {
        let array = [];
        if(Array.isArray(object))
        {
            array = [...object]
        }
        else{
            array.push(object) 
        }
        return array;
    }
    toJSON()
    {
        return{
            CoordSys:this.CoordSys,
            Dir:this.Dir,
            Type:this.Type,
            Shape:this.Shape,
            Distance:this.toArray(this.Distance),
            Magnitude:this.toArray(this.Magnitude)
        }
    }
    Clone()
    {
        return new AppliedLoadInfo(this.CoordSys, this.Dir, this.Type, this.Shape, this.Distance, this.Magnitude);
    }

}

//#region // Loads visualization
function ArrowOnLine(length, x,y,z, startpoint, endpoint,  direction, rz, scale = 1, local = false)
{
    let startPoint = new THREE.Vector3(...startpoint);
    let endPoint = new THREE.Vector3(...endpoint);

    const axis = new THREE.Vector3().subVectors(startPoint, endPoint).normalize(); // 1-local direction
    let x_axis;
    if(axis.x == 0 && axis.y != 0)
    {
        x_axis = crossProduct([axis.x, axis.y, axis.z], [1*Math.sin((axis.y/Math.abs(axis.y))* -rz), 0, 1*Math.cos(rz)]);   //3-local direction
    }
    else if(axis.x == 0 && axis.y == 0 && axis.z != 0){
        x_axis = [1*Math.sin((axis.z/Math.abs(axis.z))* rz) , 1*Math.cos(rz), 0];    
    }
    else if((axis.x != 0 && axis.y != 0 && axis.z != 0))
    {
        x_axis = crossProduct([axis.x, axis.y, axis.z], [1*Math.sin((axis.y/Math.abs(axis.y))* -rz), 1*Math.sin((axis.x/Math.abs(axis.x))* rz),1*Math.cos(rz)]);   //3-local direction
    }
    else{
        x_axis = crossProduct([axis.x, axis.y, axis.z], [0,1*Math.sin((axis.x/Math.abs(axis.x))* rz),1*Math.cos(rz)]);   //3-local direction
    }
    //if(arrayEquals(x_axis,[0,0,0]))
    const y_axis = crossProduct([axis.x, axis.y, axis.z], x_axis);
    const X_axis = new THREE.Vector3(x_axis[0], x_axis[1], x_axis[2]);
    const Y_axis = new THREE.Vector3(y_axis[0], y_axis[1], y_axis[2]);  //2- local direction

    const material = new THREE.LineBasicMaterial({color:'rgb(0,0,0)'});
 
    let l = length *scale;
    let geometry = new THREE.BufferGeometry();
    let geometry_h1 = new THREE.BufferGeometry();
    let geometry_h2 = new THREE.BufferGeometry();
    let vertices =[];  
    let vertices_h1 =[];  
    let vertices_h2 =[];  

    if(local == false)
    {
        l = l*-1;
        if(direction == 2)  // Global z- direction
        {
            vertices_h1.push(0, 0, 0);
            vertices_h1.push(0, 0.04*l, 0.15*l);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0, 0, 0);
            vertices_h2.push(0, -0.04*l, 0.15*l );
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
            vertices.push(0, 0, 0);
            vertices.push(0, 0, l);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        }
        else if(direction == 3)  // Global y- direction
        {
            vertices_h1.push(0, 0, 0);
            vertices_h1.push(0.04*l, 0.15*l, 0);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0, 0, 0);
            vertices_h2.push(-0.04*l, 0.15*l, 0 );
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
            vertices.push(0, 0, 0);
            vertices.push(0, l, 0);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        }
        else if(direction ==1)   // Global x- direction
        {
            vertices_h1.push(0, 0, 0);
            vertices_h1.push(0.15*l, 0.04*l, 0);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0, 0, 0);
            vertices_h2.push(0.15*l, -0.04*l, 0 );
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
            vertices.push(0, 0, 0);
            vertices.push(l, 0, 0);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        }
    }
    else
    {
        if(direction == 2)
        {
            vertices.push(0, 0, 0);
            vertices.push(l*Y_axis.x, l*Y_axis.y, l*Y_axis.z);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
            vertices_h1.push(0,0,0);
            vertices_h1.push(0.2*l* Y_axis.x, 0.2*l*Y_axis.y, 0.2*l*Y_axis.z);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0,0,0);
            vertices_h2.push(0.2*l*Y_axis.x, 0.2*l*Y_axis.y, 0.2*l*Y_axis.z);
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
        }
        else if(direction == 3){
            vertices.push(0, 0, 0);
            vertices.push(l*X_axis.x, l*X_axis.y, l*X_axis.z);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
            vertices_h1.push(0,0,0);
            vertices_h1.push(0.2*l*X_axis.x, 0.2*l*X_axis.y, 0.2*l*X_axis.z);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0,0,0);
            vertices_h2.push(0.2*l*X_axis.x, 0.2*l*X_axis.y, 0.2*l*X_axis.z);
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
        }
        else if(direction ==1){
            vertices.push(0, 0, 0);
            vertices.push(l*axis.x, l*axis.y, l*axis.z);
            geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
            vertices_h1.push(0,0,0);
            vertices_h1.push(0.2*l*axis.x, 0.2*l*axis.y, 0.2*l*axis.z);
            geometry_h1.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h1, 3 ) );
            vertices_h2.push(0,0,0);
            vertices_h2.push(0.2*l*axis.x, 0.2*l*axis.y, 0.2*l*axis.z);
            geometry_h2.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices_h2, 3 ) );
        }
        
    }
    var arrow = new THREE.Line( geometry, material );
    var arrow_h1 = new THREE.Line( geometry_h1, material );
    var arrow_h2 = new THREE.Line( geometry_h2, material );

    if(local){
        switch(direction)
        {
            case 1:
            case 3:
                arrow_h1.rotateOnAxis(Y_axis, 0.15);
                arrow_h2.rotateOnAxis(Y_axis, -0.15);      
            break;
            case 2:
                arrow_h1.rotateOnAxis(X_axis, 0.15);
                arrow_h2.rotateOnAxis(X_axis, -0.15);
            break;
        }
    }

    arrow.add(arrow_h1);
    arrow.add(arrow_h2);
    arrow.position.x = x;
    arrow.position.y = y;
    arrow.position.z = z;
    //arrow.rotateOnAxis(axis, -rz);
    
    //scene.add(arrow);
    return [arrow,vertices];
}

function PointLoadIndication(length, relDist, startPoint, endPoint,  direction, rz, scale = 1, local = false){

    //to calculate relative coordinates from relative distance
    const absolDisCoord = GetAbsoluteCoord(relDist ,startPoint, endPoint);
    const retResult = ArrowOnLine(length,absolDisCoord[0],absolDisCoord[1],absolDisCoord[2],startPoint,endPoint,direction,rz,scale,local);

    const load = new THREE.Group();
    load.add(retResult[0]);

    // load text
    let textPosition;
    if(direction == 3){
        textPosition = [retResult[1][3]+ absolDisCoord[0]- 0.3*length*scale, retResult[1][4]+ absolDisCoord[1]- 0.3*length*scale, retResult[1][5]+ absolDisCoord[2]];
    }
    else{
        textPosition = [retResult[1][3]+ absolDisCoord[0], retResult[1][4]+ absolDisCoord[1], retResult[1][5]+ absolDisCoord[2]- 0.4*length*scale];
    }
    let loadText = projUnits.ForceConvert(Math.abs(length),true) + projUnits.ForceUnit;

    const txt = makeTextSprite( loadText, textPosition[0], textPosition[1], textPosition[2],{fontsize: 100, fontface: "Georgia", textColor:{r:0,g:0,b:0,a:1},
        vAlign:"center", hAlign:"center"});
    //txt.rotation.z = -rz;
    load.add(txt);

    return load;
} 

function DistributedLoadIndication(length1 ,startPoint, endPoint, direction, rz = 0, scale = 1, length2 = length1, local = false)
{
    const StartPoint = new THREE.Vector3( startPoint[0], startPoint[1], startPoint[2]);
    const EndPoint = new THREE.Vector3(endPoint[0], endPoint[1], endPoint[2]);

    const load = new THREE.Group();
    const distance = new THREE.Vector3().subVectors(StartPoint, EndPoint).length();
    const axis = new THREE.Vector3().subVectors(StartPoint, EndPoint).normalize();
    const number = Math.round(distance/0.4)
    const dX = (EndPoint.x - StartPoint.x );
    const dY = (EndPoint.y - StartPoint.y );
    const dZ = (EndPoint.z - StartPoint.z );

    const material = new THREE.LineBasicMaterial({color:'rgb(0,0,0)'});
    
    const geometry = new THREE.BufferGeometry();
    var vertices =[];  
    vertices.push(StartPoint.x, StartPoint.y, StartPoint.z);
    const dload = length2-length1;

    for (let i = 0; i <= number ; i++)
    {
        const x = StartPoint.x + (dX*i/number); 
        const y = StartPoint.y + (dY*i/number);
        const z = StartPoint.z + (dZ*i/number);
        const L = (length1 + (dload*i/number));
        const arrow = ArrowOnLine(L, x, y, z, startPoint, endPoint,direction, rz, scale, local);
        load.add(arrow[0]);
        if(i == 0)
        {
            vertices.push(arrow[1][3]+ StartPoint.x, arrow[1][4]+ StartPoint.y, arrow[1][5]+ StartPoint.z);
        }
        if(i == number)
        {
            vertices.push(arrow[1][3]+ EndPoint.x, arrow[1][4] +EndPoint.y, arrow[1][5]+EndPoint.z);
        }
        if(i == Math.round(number/2)){
            let textPosition ;
            if(direction == 3){
                textPosition = [arrow[1][3]+ x- 0.3*length1*scale, arrow[1][4]+ y- 0.3*length1*scale, arrow[1][5]+ z];
            }
            else{
                textPosition = [arrow[1][3]+ x, arrow[1][4]+ y, arrow[1][5]+ z- 0.4*length1*scale];
            }
            let loadText = '';
            if(dload == 0)
            {
                loadText = projUnits.ForceConvert(Math.abs(length1) ,true)  + ` ${projUnits.ForceUnit}/${projUnits.LenUnit}`;
            }
            else{
                loadText =  projUnits.ForceConvert(Math.abs(length1), true) + "/" +  projUnits.ForceConvert(Math.abs(length2), true) + ` ${projUnits.ForceUnit}/${projUnits.LenUnit}`;
            }
            const txt = makeTextSprite( loadText, textPosition[0], textPosition[1], textPosition[2],{fontsize: 100, fontface: "Georgia", textColor:{r:0,g:0,b:0,a:1},
                vAlign:"center", hAlign:"center"});
            load.add(txt);
        }
 
    }

    vertices.push(EndPoint.x, EndPoint.y, EndPoint.z);
    vertices.push(StartPoint.x, StartPoint.y, StartPoint.z);
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    const container = new THREE.Line( geometry, material );
    //container.rotateOnWorldAxis(axis, rz);

    load.add(container);
    return load;
}

function GetAbsoluteCoord(relDist ,startpoint, endpoint){
    let startPoint = new THREE.Vector3(...startpoint);
    let endPoint = new THREE.Vector3(...endpoint);
    const frameLength = new THREE.Vector3().subVectors(startPoint, endPoint).length();
    const axis = new THREE.Vector3().subVectors(endPoint,startPoint).normalize(); // 1-local direction
    const relDisCoord = axis.multiplyScalar(frameLength*relDist);
    return new THREE.Vector3().addVectors(relDisCoord,startPoint).toArray();
}

function crossProduct(A,B) {
    const vector = [
       A[1] * B[2] - A[2] * B[1],
       A[2] * B[0] - A[0] * B[2], 
       A[0] * B[1] - A[1] * B[0]
    ];
    return vector;
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}
 
function GetMaxLoad (pattern){
    let frames = DrawLine.GetDrawnFrames();
    let maxLoads = [];
    
    for (const frame of frames) {
        if(frame.LoadsAssigned.has(pattern)){
            let loads = frame.LoadsAssigned.get(pattern);
            for(const load of loads){
                if(load.Magnitude instanceof Array){
                    let absvals = [];
                    load.Magnitude.forEach(value => absvals.push(Math.abs(value)) );
                    maxLoads.push(Math.max(...absvals));
                } 
                else maxLoads.push(Math.abs(load.Magnitude));
            }
        }
    }
    return Math.max(...maxLoads);
}

//#endregion
