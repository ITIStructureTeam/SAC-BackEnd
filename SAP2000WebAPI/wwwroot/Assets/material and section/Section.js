
//#region Section Class
const ESectionShape = {
    Rectangular: 0,
    Circular: 1,
    ISec: 2,
    TSec: 3,
    Tapered:4
}

Object.freeze(ESectionShape);


class Section {

    #name;
    #cpyNo;
    #id;
    #material;
    #secType;
    #dimensions;
    #propModifiers;
    #assignedToFrames
    static #sectionId=1;
    static #secList = new Map();

    static #DefaultSections = (function(){
        new Section('Fsec1',Material.MaterialsList.get('1'),ESectionShape.Rectangular,[0.5,0.5],[0.7,0.5,0.01,1,1,1,1,1] );
        new Section('Fsec2',Material.MaterialsList.get('2'),ESectionShape.ISec,[0.360,0.170,0.0127,0.008,0.170,0.0127]);
    })();

    constructor(name, material, secType, dimensions, modifiers=[1,1,1,1,1,1,1,1]) {
        this.#id=Section.#sectionId;
        this.Name=name;
        this.#cpyNo=0;
        this.Material=material;
        this.SecType=secType;
        this.Dimensions=dimensions;
        this.PropModifiers=modifiers;
        this.#material.AssignedToSections.push(this);
        this.#assignedToFrames= []
        Section.#secList.set(String(this.#id), this);
        Section.#sectionId++;
    }

    set Name(value) {
        if (typeof value != "string" && !(value instanceof String))
            throw new TypeError("Section Name must be string");

        let matching;
        for (const section of Section.SectionList.values()) {
            if(section.Name == value){
                matching = section;
                break;
                }
            }

        if(!matching) 
            this.#name=value;
        else{
            if(matching.ID != this.ID)
                throw new Error("There is another section having the same name");
            this.#name=value;
        }

    }

    set Material(value) {
        if (!(value instanceof Material))
            throw new TypeError("Material isnot of correct type");
        this.#material = value;
    }

    set SecType(value) {
        if (!(Object.keys(ESectionShape)[value]))
            throw new TypeError("Section Type must be one of those in Section Shape Enum");
        this.#secType = value;
    }

    set Dimensions(value) {

        if (!(value instanceof Array))
            throw new TypeError("Section Dimensions must be in form of array");

        this.#ValidateDimenions(this.SecType,value);

        this.#dimensions=value;
    }

    set PropModifiers(value){

        if (!(value instanceof Array))
            throw new TypeError("Section Modifiers must be in form of array");
        if(value.length<8)
            throw new Error("Section Modifiers must be in form of array containing eight numbers");

        if (value.slice(0,8).some(modifier => isNaN(modifier) || modifier < 0 || modifier>1))
            throw new TypeError("Section Modifiers must be between zero and one");

        this.#propModifiers=value;

    }

    get Name(){
        return this.#name;
    }

    get Material(){
        return this.#material;
    }

    get SecType() {
        return this.#secType;
    }

    get Dimensions(){
        return this.#dimensions;
    }

    get PropModifiers(){
        return this.#propModifiers;
    }

    get ID(){
        return String(this.#id);
    }

    get AssignedToFrames(){
        return this.#assignedToFrames;
    }

    static get SectionList(){
        return Section.#secList;
    }

    Clone(){
        this.#cpyNo++;
        return new Section(this.Name+" - "+this.#cpyNo,this.Material,this.SecType,this.Dimensions,this.PropModifiers);
    }

    Delete(){
        if(this.AssignedToFrames.length) throw new Error('this section is assigned to frame/s');
        else{
            let secIndex = this.Material.AssignedToSections.indexOf(this);
            this.Material.AssignedToSections.splice(secIndex,secIndex);
            Section.#secList.delete(this.ID);
        }
        
    }

    #ValidateDimenions(sectionType, dimArray) {

        if (sectionType == ESectionShape.Rectangular )
        {
            if(dimArray.length < 2 || dimArray.slice(0,2).some(val=> isNaN(val) || val<=0))
                throw new Error("Rectangular Sections must be instantiated with 2 dimensions");
    
        }
    
        if (sectionType == ESectionShape.Circular)
        {
            if(dimArray.length < 1 || dimArray.slice(0,1).some(val=> isNaN(val) || val<=0))
                throw new Error("Circular Sections must be instantiated with 1 dimension");
        }
            
    
        if (sectionType == ESectionShape.ISec) {
    
            
            if(dimArray.length < 6 || dimArray.slice(0,6).some(val=> isNaN(val) || val<=0))
                throw new Error("I Sections must be instantiated with 6 dimensions");
    
            if (dimArray[0] <= dimArray[2] + dimArray[5] || dimArray[1] <= dimArray[3] || dimArray[4] < dimArray[3])
                throw new Error("Input dimensions are not valid to instantiate I-Section");
    
        }
    
        if (sectionType == ESectionShape.TSec) {
    
            if(dimArray.length < 4 || dimArray.slice(0,4).some(val=> isNaN(val) || val<=0))
                throw new Error("T Sections must be instantiated with 4 dimensions");
            if (dimArray[0] <= dimArray[2] || dimArray[1] <= dimArray[3])
                throw new Error("Input dimensions are not valid to instantiate T-Section");
    
        }
    
    }

    toJSON()
    {
        return{
        Name : this.Name,
        Material : this.Material.Name,
        SecType:this.SecType ,
        Dimensions:this.Dimensions,
        PropModifiers:this.PropModifiers
        };
    }
}
//#endregion

