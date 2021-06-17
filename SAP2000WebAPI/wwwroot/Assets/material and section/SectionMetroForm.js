 var secUpdated = false;

let secMainWindow = `

<div

id="sec-main-window"
class="main-window"
data-role="window"
data-title="Sections"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="350">

    <div class="flex-col">
        <div class="flex-rowm">
            <div data-role="panel" data-title-caption="Sections" data-height="200" data-width="250">
                <div id="sec-list-container" style="width: 150px;">
                    <ul data-role="listview" id="sec-list">
                        <li value="1" data-caption="Section1"></li>
                        <li value="2" data-caption="Section2"></li>
                    </ul>
                </div>
            </div>
            <div class="flex-col ctrls" style="margin-top: 20px;">
                <button class="button secondary" id="add-sec-btn">Add</button>
                <button class="button secondary" id="mod-sec-btn" disabled>Modify</button>
                <button class="button secondary" id="copy-sec-btn" disabled>Copy</button>
                <button class="button secondary" id="delete-sec-btn" disabled>Delete</button>
            </div>
        
        </div>
        <div class="flex-rowm justify-center">
            <button id="close-sec-main" class="button info">Close</button>
        </div>
    </div>

</div>

`

let secTypeWindow = `

<div
id="sec-types"
class="secondary-window"
data-role="window"
data-title="Sections"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="450">


    <ul data-role="listview" data-view="icons-medium">
        <li value=0 data-icon="<div class='sec-small rect-small'></div>" data-caption="Rectangular"></li>
        <li value=1 data-icon="<div class='sec-small circ-small'></div>" data-caption="Circular"></li>
        <li value=2 data-icon="<div class='sec-small i-small'></div>" data-caption="I-shape"></li>
        <li value=3 data-icon="<div class='sec-small t-small'></div>" data-caption="T-shape"></li>
    </ul>
</div>

`

let dimFormTemplate = `

<div
class="secondary-window"
id="sec-prop-window"
data-role="window"
data-title="Sections"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="500">

    <div class="flex-col" style="height: 520px;">
    
        <div id="sec-name" class="flex-rowm panel">
            <div>
                <label>Name</label>
            </div>
            <div>
                <input type="text" class="input-small" data-role="input">
            </div>
        </div>
    
    
        <div id="sec-dim-shape" class="flex-rowm align-start panel">


        </div>
    
        <div id="sec-mat" class="flex-rowm panel">
            <div>
                <label>Material</label>
            </div>
            <div>
                <select 
                class="input-small input-width"
                data-role="select"
                data-filter="false"
                data-drop-height=80>
                </select>
            </div>
        </div>
    
        <div class="flex-rowm panel">
            <div>
                <label>Section Modifiers</label>
            </div>
            <div>
                <button id="sec-modifier-btn" class="button secondary">Edit</button>
            </div>

        </div>
    
        <div class="flex-rowm" style="justify-content: center;">
            <button id="secprop-ok-btn" class="button info">Ok</button>
            <button id="secprop-cancel-btn" class="button default">Cancel</button>
        </div>
    
    </div>

</div>

`

let modifiersForm = `

<div
id="sec-modifier-window"
class="ter-window"
data-role="window"
data-title="Section modifiers"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="350">

<div class="flex-col justify-center" style="height: 350px;">
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Axial area</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Shear area 2 direction</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Shear area 3 direction</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Torsional constant</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Inertia 2 axis</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>
    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Inertia 3 axis</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>

    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Weight</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>

    <div class="flex-rowm margin-b-20"> 
        <div class="label"><label>Mass</label></div>
        <div class="input-width"><input type="number" class="input-small" data-role="input"></div>
    </div>

    <div class="flex-rowm" style="justify-content: center;">
        <button id="modifier-ok-btn" class="button info">Ok</button>
        <button id="modifier-cancel-btn" class="button default">Cancel</button>
    </div>

</div>

</div>

`

document.querySelector('#secBtn').addEventListener("click",
function () {
    if(!document.querySelector('.main-window')){
        initSecMainWindow();
    }
});

function GetSecDimForm(sectionType) {

    let iSecForm = `           
    <div class="flex-col justify-start" id="sec-dim" style="height: 200px;">
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Outside height</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Top flange width</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Top flange thickness</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Web thickness</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Bottom flange width</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Bottom flange thickness</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
    
    </div>

    <div class="sec-large i-large" id="sec-shape"></div>`  

    let recSecForm = `
    <div class="flex-col justify-start" id="sec-dim" style="height: 200px;">
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Width</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Depth</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
    
    </div>

    <div class="sec-large rect-large" id="sec-shape"></div>
    `

    let circSecForm = `
    <div class="flex-col justify-start" id="sec-dim" style="height: 200px;">
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Radius</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
    
    </div>

    <div class="sec-large circ-large" id="sec-shape"></div>
    `

    let tSecForm = `
    <div class="flex-col justify-start" id="sec-dim" style="height: 200px;">
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Outside height</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Flange width</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Flange thickness</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
        <div class="flex-rowm margin-b-20"> 
            <div class="label"><label>Web thickness</label></div>
            <div class="input-width"><input type="number" class="input-small" data-role="input" data-clear-button="false" data-append=${projUnits.SecDimUnit}></div>
        </div>
    
    </div>

    <div class="sec-large t-large" id="sec-shape"></div>
    `

    switch (sectionType) {
        case ESectionShape.Rectangular:
            return recSecForm
            break;
        case ESectionShape.Circular:
            return circSecForm
            break;
        case ESectionShape.ISec:
            return iSecForm;
            break;
        case ESectionShape.TSec:
            return tSecForm;
            break;
    }
}

function FillSecDropList(){
    let length = $('#sec-list').children().length;
    for (let i = length-1; i >= 0 ; i--) {
        $('#sec-list').children()[i].remove();      
    }
    Section.SectionList.forEach((value,key) => {
        $("#sec-list").append(`<li value=${key} >${value.Name}</li>`); 
    });                  
}

function GetSecType(id) {
    
    if(document.querySelector('.current-select')){

        if(!id){
            return $(".current-select")[0].value;
        }else{
            let section = Section.SectionList.get(String(id));
            return section.SecType;
        }        
    }           
}

function GetSecId() {
    if(document.querySelector('.current-select')){
        let secId =  $(".current-select")[0].value;
        return secId
    }
}

function LoadSectionData(secId){
    let section = Section.SectionList.get(String(secId));

    //fill section name
    document.querySelector('#sec-name').querySelector('input').value = section.Name;

    //fill section dimensions
    let secDimInputs = document.querySelector('#sec-dim').querySelectorAll('input');
    
    for (let i = 0; i < secDimInputs.length; i++) {
        secDimInputs[i].value= projUnits.SecDimConvert(section.Dimensions[i],true);              
    }

    //fill section material
    document.querySelector('#sec-mat').querySelector('select').value = section.Material.ID;
    
}

function LoadAllMaterials(){
    let matList = document.querySelector('#sec-mat').querySelector('select');

    let length = matList.children.length;
    for (let i = length-1; i >= 0 ; i--) {
        matList.children[i].remove();      
    }
    Material.MaterialsList.forEach((value,key) => {
        let opt = document.createElement("option");
        opt.setAttribute("value",key)
        opt.innerHTML=value.Name;
        matList.appendChild(opt);
    });
}

function ActivateSectionCtrls(){

    if(document.querySelector('.current-select')){
        let buttons = document.querySelector('.ctrls').querySelectorAll('button')
        for (let i = 1; i < buttons.length; i++) {
            buttons[i].removeAttribute("disabled")            
        
        }
    }
}

function initSecMainWindow() {
    let secType;

    $('body').append(secMainWindow);
    FillSecDropList();

    document.querySelector('#add-sec-btn').addEventListener("click",
        function () {
            if(!document.querySelector('.secondary-window')){
                $('body').append(secTypeWindow);
                document.querySelector('#sec-types').addEventListener("click",function(){
                    secType=GetSecType();
                    $('#sec-types')[0].parentElement.parentElement.remove();
                    InitSecPropWindow(secType);
                });                       
            }
        });
    
    document.querySelector('#sec-main-window').addEventListener("click",ActivateSectionCtrls);

    document.querySelector('#mod-sec-btn').addEventListener("click",function(){
            let secId = GetSecId();
            secType=GetSecType(secId);
            InitSecPropWindow(secType,secId);               
            LoadSectionData(secId);
        });

    document.querySelector('#delete-sec-btn').addEventListener("click",function(){
        DeleteSection(GetSecId());
    });

    document.querySelector('#copy-sec-btn').addEventListener("click",function(){
        CopySection(GetSecId());
    });

    document.querySelector('#close-sec-main').addEventListener("click",function(){
        document.querySelector('#sec-main-window').parentElement.parentElement.remove();
    })
}

function ReloadSecMainWindow() {
    //document.querySelector('#sec-main-window').parentElement.parentElement.remove();
    //initSecMainWindow();
    document.querySelector('#sec-list').remove();
    $('#sec-list-container ').append(`
        <ul data-role="listview" id="sec-list">
            <li></li>
        </ul>
    `)
    FillSecDropList();
}

function InitSecPropWindow(secType,secId=null) {
    if(!document.querySelector('.secondary-window')){
        $('body').append(dimFormTemplate);
        $('#sec-dim-shape').append(GetSecDimForm(secType));
        LoadAllMaterials();
        InitSecModifiersWindow(secId);
        document.querySelector('#secprop-ok-btn').addEventListener("click", function(){
            if(secId) ModifySection(secId);
            else AddSection(secType);
            
        });
        document.querySelector('#secprop-cancel-btn').addEventListener("click", function(){
            document.querySelector('#sec-prop-window').parentElement.parentElement.remove();
        })
    }
}

// functions to create modifiers window and fill modifiers data
function LoadSecModifiers(secId) {
    let inputs = document.querySelector('#sec-modifier-window').querySelectorAll('input');
    if(!secId){
        inputs.forEach(input=>input.value=1);
    }else{
        let section = Section.SectionList.get(String(secId));
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = section.PropModifiers[i] ;           
        }
    }
}

var secModifiers;
function InitSecModifiersWindow(secId=null) {
    document.querySelector('#sec-modifier-btn').addEventListener("click",
        function(){
            if(!document.querySelector('.ter-window')){
                $('body').append(modifiersForm);
                LoadSecModifiers(secId);
                document.querySelector('#modifier-ok-btn').addEventListener("click",function(){
                    secModifiers = ReadSecModifiers();
                    if(document.querySelector('#sec-modifier-window').querySelector('p'))document.querySelector('#sec-prop-window').querySelector('p').remove();
                    if(secId){
                        try {
                            Section.SectionList.get(String(secId)).PropModifiers = secModifiers;
                            document.querySelector('#sec-modifier-window').parentElement.parentElement.remove();
                        } catch (error) {
                            $('#sec-modifier-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
                        }                               
                    }else{
                        document.querySelector('#sec-modifier-window').parentElement.parentElement.remove();
                    }
                    
                });
                document.querySelector('#modifier-cancel-btn').addEventListener("click",function(){
                    document.querySelector('#sec-modifier-window').parentElement.parentElement.remove();
                });
            }
        })
}

function ReadSecModifiers(){
    let inputs = document.querySelector('#sec-modifier-window').querySelectorAll('input');
    let sectModifiers = [];
    inputs.forEach(input=>sectModifiers.push(input.valueAsNumber));
    return sectModifiers;
}

//
function ModifySection(secId){

    let section = Section.SectionList.get(String(secId));
    let secDims = [];
    let secMatId =  document.querySelector('#sec-mat').querySelector('select').value;
    try {

        if(document.querySelector('#sec-prop-window').querySelector('p'))document.querySelector('#sec-prop-window').querySelector('p').remove();
        
        section.Name = document.querySelector('#sec-name').querySelector('input').value;               
    
        document.querySelector('#sec-dim').querySelectorAll('input').forEach(input=> secDims.push( projUnits.SecDimConvert(input.valueAsNumber) ));      
        section.Dimensions = secDims;

        section.Material = Material.MaterialsList.get(secMatId);

        ReloadSecMainWindow();
        secUpdated = true;
        document.querySelector('#sec-prop-window').parentElement.parentElement.remove();
    } catch (error) {
        $('#sec-prop-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }
    
    
}

//
function AddSection(secType) {
    let name = document.querySelector('#sec-name').querySelector('input').value;
    let dims = [];
    document.querySelector('#sec-dim').querySelectorAll('input').forEach(input => dims.push( projUnits.SecDimConvert(input.value) ));
    let matId= document.querySelector('#sec-mat').querySelector('select').value;
    let material = Material.MaterialsList.get(String(matId));
    try {
        if(document.querySelector('#sec-prop-window').querySelector('p'))document.querySelector('#sec-prop-window').querySelector('p').remove();
        if(secModifiers){
            new Section (name, material, secType, dims, secModifiers);
            secModifiers=null;
        }else{
            new Section (name, material, secType, dims);
        }
        ReloadSecMainWindow();
        document.querySelector('#sec-prop-window').parentElement.parentElement.remove();
    } catch (error) {
        $('#sec-prop-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }
}

function DeleteSection(secId) {
    if(document.querySelector('#sec-main-window').querySelector('p'))document.querySelector('#sec-main-window').querySelector('p').remove();
    try {
        Section.SectionList.get(String(secId)).Delete();
        ReloadSecMainWindow();
    } catch (error) {
        $('#sec-main-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }
}

function CopySection(secId) {
   Section.SectionList.get(String(secId)).Clone();
   ReloadSecMainWindow();
}
