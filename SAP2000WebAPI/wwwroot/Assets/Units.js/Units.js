const ELengthUnits = {
    m: 'm',
    cm: 'cm',
    mm: 'mm'
}
const EForceUnits = {
    kN: 'kN',
    N: 'N',
    t: 't',
    kg: 'kg'
}
const ESecDimUnits = {
    m: 'm',
    cm: 'cm',
    mm: 'mm'
}
const ETempUnits = {
    C: 'C',
    F: 'F'
}
const EStrenUnits = {
    Pa: 'Pa',
    kPa: 'kPa',
    MPa: 'MPa',
    t_cm2: 't/cm2',
    kg_cm2: 'kg/cm2'
}
const EDensUnits = {
    KN_m3: 'kN/m3',
    t_m3: 't/m3'
}

Object.freeze(ELengthUnits);
Object.freeze(EForceUnits);
Object.freeze(ESecDimUnits);
Object.freeze(ETempUnits);
Object.freeze(EStrenUnits);
Object.freeze(EDensUnits);

class ProjUnits {

    #lenUnit;
    #forceUnit;
    #secDimUnit;
    #tempUnit;
    #strenUnit;
    #densUnit;
    constructor(length=ELengthUnits.m, force=EForceUnits.kN, sec=ESecDimUnits.m, temp=ETempUnits.C, strength=EStrenUnits.MPa, density=EDensUnits.KN_m3) {
        this.LenUnit = length;
        this.ForceUnit = force;
        this.SecDimUnit = sec;
        this.TempUnit = temp;
        this.StrenUnit = strength;
        this.DensUnit = density;
    }

    set LenUnit(unit) {
        if (!Object.values(ELengthUnits).includes(unit)) throw new TypeError('invalid length unit');
        this.#lenUnit = unit;
    }
    set ForceUnit(unit) {
        if (!Object.values(EForceUnits).includes(unit)) throw new TypeError('invalid force unit');
        this.#forceUnit = unit;
    }
    set SecDimUnit(unit) {
        if (!Object.values(ESecDimUnits).includes(unit)) throw new TypeError('invalid section dimensions unit');
        this.#secDimUnit = unit;
    }
    set TempUnit(unit) {
        if (!Object.values(ETempUnits).includes(unit)) throw new TypeError('invalid temperature unit');
        this.#tempUnit = unit;
    }
    set StrenUnit(unit) {
        if (!Object.values(EStrenUnits).includes(unit)) throw new TypeError('invalid strength unit');
        this.#strenUnit = unit;
    }
    set DensUnit(unit) {
        if (!Object.values(EDensUnits).includes(unit)) throw new TypeError('invalid Density unit');
        this.#densUnit = unit;
    }

    get LenUnit() {
        return this.#lenUnit
    }
    get ForceUnit() {
        return this.#forceUnit
    }
    get SecDimUnit() {
        return this.#secDimUnit
    }
    get TempUnit() {
        return this.#tempUnit
    }
    get StrenUnit() {
        return this.#strenUnit
    }
    get DensUnit() {
        return this.#densUnit
    }

    LengthConvert(lengthValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to meter
            switch (this.LenUnit) {
                case ELengthUnits.cm:
                    converted = lengthValue * 0.01;
                    break;
                case ELengthUnits.mm:
                    converted = lengthValue * 0.001;
                    break;
                case ELengthUnits.m:
                    converted = lengthValue;
                    break;
            }
        } else {
            //convert from meter
            switch (this.LenUnit) {
                case ELengthUnits.cm:
                    converted = lengthValue * 100;
                    break;
                case ELengthUnits.mm:
                    converted = lengthValue * 1000;
                    break;
                case ELengthUnits.m:
                    converted = lengthValue;
                    break;
            }
        }
        return converted;
    }

    ForceConvert(forceValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to kN
            switch (this.ForceUnit) {
                case EForceUnits.N:
                    converted = forceValue * 0.001;
                    break;
                case EForceUnits.t:
                    converted = forceValue * 9.80665;
                    break;
                case EForceUnits.kg:
                    converted = forceValue * 0.001 * 9.80665;
                    break;
                case EForceUnits.kN:
                    converted = forceValue
                    break;
            }
        } else {
            //convert from kN
            switch (this.ForceUnit) {
                case EForceUnits.N:
                    converted = forceValue * 1000;
                    break;
                case EForceUnits.t:
                    converted = parseFloat((forceValue / 9.80665).toFixed(3));
                    break;
                case EForceUnits.kg:
                    converted = parseFloat((forceValue * 1000 / 9.80665).toFixed(3));
                    break;
                case EForceUnits.kN:
                    converted = parseFloat(forceValue.toFixed(3));
                    break;
            }
        }
        return converted;
    }

    SecDimConvert(dimValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to meter
            switch (this.SecDimUnit) {
                case ESecDimUnits.cm:
                    converted = dimValue * 0.01;
                    break;
                case ESecDimUnits.mm:
                    converted = dimValue * 0.001;
                    break;
                case ESecDimUnits.m:
                    converted = dimValue;
                    break;
            }
        } else {
            //convert from meter
            switch (this.SecDimUnit) {
                case ESecDimUnits.cm:
                    converted = dimValue * 100;
                    break;
                case ESecDimUnits.mm:
                    converted = dimValue * 1000;
                    break;
                case ESecDimUnits.m:
                    converted = dimValue;
                    break;
            }
        }
        return converted;
    }

    TempConvert(tempValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to celsius
            switch (this.TempUnit) {
                case ETempUnits.F:
                    converted = (tempValue - 32) * 5 / 9;
                    break;
                case ETempUnits.C:
                    converted = tempValue
                    break;
            }
        } else {
            //convert from celsius
            switch (this.TempUnit) {
                case ETempUnits.F:
                    converted = (tempValue * 9 / 5) + 32
                    break;
                case ETempUnits.C:
                    converted = tempValue
                    break;
            }
        }
        return converted;
    }

    StrenConvert(strengthValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to MPa
            switch (this.StrenUnit) {
                case EStrenUnits.MPa:
                    converted = strengthValue;
                    break;
                case EStrenUnits.Pa:
                    converted = strengthValue * (10e-6);
                    break;
                case EStrenUnits.t_cm2:
                    converted = strengthValue * 98.066501;
                    break;
                case EStrenUnits.kg_cm2:
                    converted = strengthValue * 0.098066501;
                    break;
                case EStrenUnits.kPa:
                    converted = strengthValue*0.001;
                    break;
            }
        } else {
            //convert from MPa
            switch (this.StrenUnit) {
                case EStrenUnits.MPa:
                    converted = strengthValue;
                    break;
                case EStrenUnits.Pa:
                    converted = strengthValue * (10e6);
                    break;
                case EStrenUnits.t_cm2:
                    converted = parseFloat((strengthValue / 98.066501).toFixed(3));
                    break;
                case EStrenUnits.kg_cm2:
                    converted = parseFloat((strengthValue / 0.098066501).toFixed(3));
                    break;
                case EStrenUnits.kPa:
                    converted = strengthValue*1000;
                    break;
            }
        }
        return converted;
    }

    DensConvert(densityValue, toUser = false) {
        let converted;
        if (!toUser) {
            //convert to kN/m3
            switch (this.DensUnit) {
                case EDensUnits.t_m3:
                    converted = densityValue * 9.80665;
                    break;
                case EDensUnits.KN_m3:
                    converted = densityValue;
                    break;
            }
        } else {
            //convert from kN/m3
            switch (this.DensUnit) {
                case EDensUnits.t_m3:
                    converted = parseFloat((densityValue / 9.80665).toFixed(3));
                    break;
                case EDensUnits.KN_m3:
                    converted = densityValue;
                    break;
            }
        }
        return converted;
    }

}
var projUnits = new ProjUnits();