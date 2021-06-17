//#region MaterialClass

const EmaterialType = {
    Concrete: 0,
    Steel: 1
};
Object.freeze(EmaterialType);



class Material {

    //#region private variables
    #_name;
    #_weight;
    #_elasticModulus;
    #_poisson;
    #_thermalExpansion;
    #_materialType;
    #_strength;
    #_assignedToSections;
    #_id;
    #_cpyNo
    static #_materialId=1;
    static #_materialsList=new Map();
    //#endregion

    static #InitiateMaterialList = (function(){
        new Material("Concrete",25,4400,0.2,5e-9,EmaterialType.Concrete,[30]);
        new Material("Steel",78.5,2100,0.3,5e-9,EmaterialType.Steel,[240,360]);
    })();

    constructor(
        name="mat", weight=25, elasticModulus=4400 , poisson=0.2 , thermalExpansion=5e-9 , materialType=0 , strength=[25] ){
        this.#_id = Material.#_materialId;
        this.Name = name;
        this.Weight = weight;
        this.ElasticModulus = elasticModulus;
        this.Poisson = poisson;
        this.ThermalExpansion = thermalExpansion;
        this.MaterialType = materialType;
        this.Strength = strength;
        this.#_assignedToSections = new Array();
        this.#_cpyNo = 0 ;
        Material.#_materialsList.set(String(this.#_id), this);
        Material.#_materialId++;
    }

    //#region Setters and Getters
    set Name(value) {
        if (typeof value != "string" && !(value instanceof String))
            throw new TypeError("Section Name must be string");

            let matching;
            for (const material of Material.#_materialsList.values()) {
                if(material.Name == value){
                    matching = material;
                    break;
                }
            }

            if(!matching) 
                this.#_name=value;
            else{
                if(matching.#_id != this.#_id)
                    throw new Error("There is another material having the same name");
                this.#_name=value;
            }
    }

    get Name() {
        return this.#_name;
    }

    set Weight(value) {
        if (isNaN(value))
            throw new TypeError("material Weight must be Number");
        if (value <= 0)
            throw new Error("Material Weight must be Positive number");

        this.#_weight = value;
    }
    get Weight() {
        return this.#_weight;
    }

    set ElasticModulus(value) {
        if (isNaN(value))
            throw new TypeError("Elastic Modulus must be Number");
        if (value <= 0)
            throw new Error("Material Elastic Modulus must be Positive number");
        this.#_elasticModulus = value;
    }
    get ElasticModulus() {
        return this.#_elasticModulus;
    }

    set Poisson(value) {
        if (isNaN(value))
            throw new TypeError("Poisson`s ratio must be Number");
        if (value <= 0 || value>1)
            throw new Error("Material Poissin ratio must be betwee 0 and 1");

        this.#_poisson = value;
    }
    get Poisson() {
        return this.#_poisson;
    }

    set ThermalExpansion(value) {
        if (isNaN(value))
            throw new TypeError("Thermal Expansion must be Number");
        this.#_thermalExpansion = value;
    }
    get ThermalExpansion() {
        return this.#_thermalExpansion;
    }

    set MaterialType(value) {
        if (!(Object.keys(EmaterialType)[value]))
            throw new TypeError("Material Type must be one of those in Material Type Enum");

        this.#_materialType = value;
    }
    get MaterialType() {
        return this.#_materialType;
    }

    set Strength(value) {
        if (!(value instanceof Array))
            throw new TypeError("material strength must be input as array");

        if(this.MaterialType == EmaterialType.Concrete)
        {
            if(isNaN(value[0]) || value[0] <=0)
                throw new Error("material strengths must be positive numbers");
        }
        if (this.MaterialType == EmaterialType.Steel){
            if(value.slice(0,2).some(val => isNaN(val) || val <= 0))
                throw new Error("material strengths must be positive numbers");
        } 

        this.#_strength = value;
    }

    get Strength() {
        return this.#_strength;
    }

    static get MaterialsList() {
        return Material.#_materialsList;
    }

    get AssignedToSections() {
        return this.#_assignedToSections;
    }

    get ID(){
        return this.#_id;
    }
    //#endregion


    Delete() {
        if (this.#_assignedToSections.length != 0)
            throw new Error("this material is assigned to section(s)");
        Material.#_materialsList.delete(String(this.#_id));
    }

    Clone() {
        this.#_cpyNo++;
        return new Material(this.Name +" - " +this.#_cpyNo, this.Weight, this.ElasticModulus, this.Poisson, this.ThermalExpansion, this.MaterialType, this.Strength);
    }

    toJSON(){
        
        return{
        Name : this.Name,
        Weight : this.Weight,
        ElasticModulus:this.ElasticModulus ,
        Poisson:this.Poisson,
        ThermalExpansion:this.ThermalExpansion,
        MaterialType:this.MaterialType,
        Strength:this.Strength
        };
    }

}
//#endregion
