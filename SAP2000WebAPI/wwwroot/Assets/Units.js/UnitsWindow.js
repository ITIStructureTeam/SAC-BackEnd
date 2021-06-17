let unitForm =`

<div
class="main-window"
id="units-window"
data-role="window"
data-title="Sections"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="250">

    
    <div class="flex-col justify-center align-center"   >
    <div data-role="panel" data-width="245">
        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Length</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${ELengthUnits.m}>m</option>
                    <option value = ${ELengthUnits.cm}>cm</option>
                    <option value = ${ELengthUnits.mm}>mm</option>
                </select>
            </div>
        </div>

        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Force</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${EForceUnits.kN}>kN</option>
                    <option value = ${EForceUnits.N}>N</option>
                    <option value = ${EForceUnits.t}>t</option>
                    <option value = ${EForceUnits.kg}>kg</option>
                </select>
            </div>
        </div>

        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Sections</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${ESecDimUnits.m}>m</option>
                    <option value = ${ESecDimUnits.cm}>cm</option>
                    <option value = ${ESecDimUnits.mm}>mm</option>
                </select>
            </div>
        </div>

        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Strength</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${EStrenUnits.MPa}>MPa</option>
                    <option value = ${EStrenUnits.kPa}>kPa</option>
                    <option value = ${EStrenUnits.Pa}>Pa</option>
                    <option value = ${EStrenUnits.t_cm2}>t/cm2</option>
                    <option value = ${EStrenUnits.kg_cm2}>kg/cm2</option>
                </select>
            </div>
        </div>

        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Temperature</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${ETempUnits.C}>°C</option>
                    <option value = ${ETempUnits.F}>°F</option>
                </select>
            </div>
        </div>

        <div class="flex-rowm justify-between margin-b-20"> 
            <div>
                <label>Density</label>
            </div>
            <div class="width-80">
                <select 
                class="input-small "
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                    <option value = ${EDensUnits.KN_m3}>kN/m3</option>
                    <option value = ${EDensUnits.t_m3}>t/m3</option>
                </select>
            </div>
        </div>
    </div>   
        <div class="flex-rowm justify-center" style="margin-top:10px" >
            <button class="button info">Ok</button>
            <button class="button default">Close</button>
        </div>
    </div>

</div>

`
let unitsUpdated = false;

document.querySelector('#units-btn').addEventListener("click",function(){
    if(!document.querySelector('.main-window')){
        $('body').append(unitForm);
        let units = document.querySelectorAll('#units-window select');
        units[0].value = projUnits.LenUnit;
        units[1].value = projUnits.ForceUnit;
        units[2].value = projUnits.SecDimUnit;
        units[3].value = projUnits.StrenUnit;
        units[4].value = projUnits.TempUnit;
        units[5].value = projUnits.DensUnit;

        document.querySelector('#units-window .info').addEventListener("click",function(){      
            projUnits.LenUnit = units[0].value;
            projUnits.ForceUnit=units[1].value;
            projUnits.SecDimUnit=units[2].value;
            projUnits.StrenUnit=units[3].value;
            projUnits.TempUnit=units[4].value;
            projUnits.DensUnit=units[5].value;
            document.querySelector('#units-window').parentElement.parentElement.remove();
            unitsUpdated = true;
        });
        document.querySelector('#units-window .default').addEventListener("click",function(){
            document.querySelector('#units-window').parentElement.parentElement.remove();
        })
    }
})
