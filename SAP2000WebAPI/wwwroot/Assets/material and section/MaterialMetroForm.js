

var matMainWindow = `

        <div
        class="main-window"
        id="mat-main-window"
        data-role="window"
        data-title="Define Material"
        data-btn-min="false"
        data-btn-max="false"
        data-resizable="false"
        data-place="center"
        data-width="350px">

           <div class="flex-col">
               <div class="flex-rowm">
                   <div class="def-mats" data-role="panel" data-title-caption="Materials" data-height="200" data-width="250">
                        <div id="mat-list-container" style="width: 150px;">
                            <ul data-role="listview" id="mat-list">
                                <li ></li>
                                <li ></li>
                            </ul>
                        </div>
                   </div>
                   <div class="ctrls">
                       <button class="button secondary" id="add-mat-btn">Add</button>
                       <button class="button secondary" id="mod-mat-btn" disabled >Modify</button>
                       <button class="button secondary" id="copy-mat-btn" disabled>Copy</button>
                       <button class="button secondary" id="delete-mat-btn" disabled>Delete</button>
                   </div>
                
               </div>
               <div class="mat-form-btn">
                   <button id="close-mat-btn" class="button info">Close</button>
               </div>
           </div>

        </div>

`

var materialWindowHtml = `

            <div
            class="secondary-window"
            id="mat-define-window"
            data-role="window"
            data-title="Material properties"
            data-btn-min="false"
            data-btn-max="false"
            data-resizable="false"
            data-place="center"
            data-width="375">
            
               <table class="table compact" id="mat-form">
               <tbody style="height:370px;">
                <tr>
                
                    <td>
                        <label>Material Type</label>
                    </td>
                    <td>
                        <select 
                        id="mat-type"
                        class="input-small"
                        data-role="select"
                        data-filter="false"
                        data-drop-height=80
                        >
                        </select>
                    </td>        
                </tr>

                   <tr>
                       <td>
                           <label for="">Name</label>
                       </td>
                       <td>
                           <input id="mat-name" class="input-small" type="text" data-role="input" data-clear-button="false">
                       </td>
                   </tr>
               
                   <tr >
                       <td>
                           <label for="">Elastic Modulus</label>
                       </td>
                       <td>
                           <input id="mat-elastic" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
                       </td>
                   </tr>
               
                   <tr>
                       <td>
                           <label for="">Density</label>
                       </td>
                       <td>
                           <input id="mat-density" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.DensUnit}>
                       </td>               
                   </tr>
               
                   <tr>
                       <td>
                           <label class="" for="">Poisson Ratio</label>
                       </td>
                      <td>
                            <input id="mat-poisson" class="input-small" type="number" data-role="input" data-clear-button="false" data-append='%'>
                      </td>

                   </tr>

                   <tr>
                       <td>
                           <label class="" for="">Thermal Expansion</label>
                       </td>
                      <td>
                       <input id="mat-thermal" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.TempUnit}>
                      </td>

                   </tr>
               
                   <tr>
                       <td>
                           <label for="">Yield Strength</label>
                       </td>
                       <td>
                           <input id="mat-yield" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
                       </td>           
                   </tr>
               
                   <tr>
                       <td>
                           <label for="">Ultimate Strength</label>
                       </td>
                       <td>
                           <input id="mat-ultimate" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
                       </td>           
                   </tr>
                   <!--tr>
                        <td>
                            <button id="new-mat-save">Save Changes</button>
                        </td>
                    </tr-->
               </tbody>
               </table>

               <div style="text-align: center;">
                    <button id="new-mat-save"  class="button info">Save Changes</button>
                    <button id="new-mat-close"  class="button info">Close</button>
                </div>
            </div>

`

document.getElementById("materialsBtn").addEventListener("click",
        
        function(){
            if(!document.querySelector(".main-window")){
                InitMatMainWindow();
            } 
        }          
);

function GetMaterialWin() {
    return `

    <div
    class="secondary-window"
    id="mat-define-window"
    data-role="window"
    data-title="Material properties"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center"
    data-width="375">
    
       <table class="table compact" id="mat-form">
       <tbody style="height:370px;">
        <tr>
        
            <td>
                <label>Material Type</label>
            </td>
            <td>
                <select 
                id="mat-type"
                class="input-small"
                data-role="select"
                data-filter="false"
                data-drop-height=80
                >
                </select>
            </td>        
        </tr>

           <tr>
               <td>
                   <label for="">Name</label>
               </td>
               <td>
                   <input id="mat-name" class="input-small" type="text" data-role="input" data-clear-button="false">
               </td>
           </tr>
       
           <tr >
               <td>
                   <label for="">Elastic Modulus</label>
               </td>
               <td>
                   <input id="mat-elastic" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
               </td>
           </tr>
       
           <tr>
               <td>
                   <label for="">Density</label>
               </td>
               <td>
                   <input id="mat-density" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.DensUnit}>
               </td>               
           </tr>
       
           <tr>
               <td>
                   <label class="" for="">Poisson Ratio</label>
               </td>
              <td>
                    <input id="mat-poisson" class="input-small" type="number" data-role="input" data-clear-button="false" data-append='%'>
              </td>

           </tr>

           <tr>
               <td>
                   <label class="" for="">Thermal Expansion</label>
               </td>
              <td>
               <input id="mat-thermal" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.TempUnit}>
              </td>

           </tr>
       
           <tr>
               <td>
                   <label for="">Yield Strength</label>
               </td>
               <td>
                   <input id="mat-yield" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
               </td>           
           </tr>
       
           <tr>
               <td>
                   <label for="">Ultimate Strength</label>
               </td>
               <td>
                   <input id="mat-ultimate" class="input-small" type="number" data-role="input" data-clear-button="false" data-append=${projUnits.StrenUnit}>
               </td>           
           </tr>
           <!--tr>
                <td>
                    <button id="new-mat-save">Save Changes</button>
                </td>
            </tr-->
       </tbody>
       </table>

       <div style="text-align: center;">
            <button id="new-mat-save"  class="button info">Save Changes</button>
            <button id="new-mat-close"  class="button info">Close</button>
        </div>
    </div>

`
}

function InitMatMainWindow(){

    $('body').append(matMainWindow);

    FillMaterialDropList();

    document.querySelector('#mat-main-window').addEventListener("click",ActivateEditButtons);

    document.querySelector('#add-mat-btn').addEventListener("click",function(){
        if(!document.querySelector(".secondary-window"))
        {
            InitAddMaterialWindow();
            document.querySelector('#new-mat-save').addEventListener("click",AddNewMaterial);
            document.querySelector('#new-mat-close').addEventListener("click",function(){
                CloseWindow('mat-define-window');
            });
        }
    });

    document.querySelector('#mod-mat-btn').addEventListener("click",function(){
        if(!document.querySelector(".secondary-window"))
        {
            InitAddMaterialWindow();
            LoadMaterialData();
            document.querySelector('#new-mat-save').addEventListener("click",ModifyMaterial);
            document.querySelector('#new-mat-close').addEventListener("click",function(){
                CloseWindow('mat-define-window');
            });
        }
    });

    document.querySelector('#delete-mat-btn').addEventListener("click",DeleteMaterial);

    document.querySelector('#copy-mat-btn').addEventListener("click",CopyMaterial);

    document.querySelector('#close-mat-btn').addEventListener("click",function () {
        CloseWindow('mat-main-window');
    })

}

function InitAddMaterialWindow(){
    $('body').append(GetMaterialWin());
    FillMaterialType(); 
}

function FillMaterialDropList(){
    let length = $('#mat-list').children().length;
    for (let i = length-1; i >= 0 ; i--) {
        $('#mat-list').children()[i].remove();      
    }
    Material.MaterialsList.forEach((value,key) => {
        $("#mat-list").append(`<li value=${key} >${value.Name}</li>`); 
    });                  
}

function FillMaterialType(){
    for (const type in EmaterialType) {
        $('#mat-type').append(`<option value=${EmaterialType[type]}>${type}</option>`)
    }        
}

function ReloadMaterialWindow(){

    document.querySelector('#mat-list').remove();
    $('#mat-list-container').append(`
        <ul data-role="listview" id="mat-list">
            <li></li>
        </ul>
    `)
    FillMaterialDropList();
}

function LoadMaterialData(){
    
    let selectedKey =  $(".current-select")[0].value;
    let selectedMaterial = Material.MaterialsList.get(String(selectedKey));
    $('#mat-type').val(selectedMaterial.MaterialType);
    $('#mat-name').val(selectedMaterial.Name);
    $('#mat-elastic').val(projUnits.StrenConvert(selectedMaterial.ElasticModulus,true));
    $('#mat-density').val(projUnits.DensConvert(selectedMaterial.Weight,true));
    $('#mat-poisson').val(selectedMaterial.Poisson);
    $('#mat-thermal').val(selectedMaterial.ThermalExpansion);
    $('#mat-yield').val(projUnits.StrenConvert(selectedMaterial.Strength[0],true));
    $('#mat-ultimate').val(projUnits.StrenConvert(selectedMaterial.Strength[1],true));
}

function AddNewMaterial(){
    let type = document.querySelector('#mat-type').value;
    let name = document.querySelector('#mat-name').value;
    let elastic = projUnits.StrenConvert(document.querySelector('#mat-elastic').valueAsNumber) ;
    let density = projUnits.DensConvert(document.querySelector('#mat-density').valueAsNumber) ;
    let poisson = document.querySelector('#mat-poisson').valueAsNumber;
    let thermal = document.querySelector('#mat-thermal').valueAsNumber;
    let yield = projUnits.StrenConvert(document.querySelector('#mat-yield').valueAsNumber) ;
    let ultimate = projUnits.StrenConvert(document.querySelector('#mat-ultimate').valueAsNumber) ;
    try{
        if($('#mat-define-window')[0].querySelector('p')) $('#mat-define-window')[0].querySelector('p').remove();
        var mat = new Material(name,density,elastic,poisson,thermal,type,[yield,ultimate]);
        ReloadMaterialWindow();
        $('#mat-define-window')[0].parentElement.parentElement.remove();

    }catch(error){               
        $('#mat-define-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }
}
    
function ModifyMaterial(){
    let selectedKey =  $(".current-select")[0].value;
    let selectedMaterial = Material.MaterialsList.get(String(selectedKey));
    if($('#mat-define-window')[0].querySelector('p')) $('#mat-define-window')[0].querySelector('p').remove();
    try{    
        selectedMaterial.Name = document.querySelector('#mat-name').value;
        selectedMaterial.Weight = projUnits.DensConvert(document.querySelector('#mat-density').valueAsNumber) ;
        selectedMaterial.ElasticModulus = projUnits.StrenConvert(document.querySelector('#mat-elastic').valueAsNumber) ;
        selectedMaterial.Poisson=document.querySelector('#mat-poisson').valueAsNumber;
        selectedMaterial.ThermalExpansion=document.querySelector('#mat-thermal').valueAsNumber;
        selectedMaterial.MaterialType = document.querySelector('#mat-type').value;
        let strength = [projUnits.StrenConvert(document.querySelector('#mat-yield').valueAsNumber),
                        projUnits.StrenConvert(document.querySelector('#mat-ultimate').valueAsNumber) ];
        selectedMaterial.Strength = strength;
        ReloadMaterialWindow();
        $('#mat-define-window')[0].parentElement.parentElement.remove();
    }catch(error){               
        $('#mat-define-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }          
}

function DeleteMaterial(){
    let selectedKey =  $(".current-select")[0].value;
    let selectedMaterial = Material.MaterialsList.get(String(selectedKey));
    if($('#mat-main-window')[0].querySelector('p')) $('#mat-main-window')[0].querySelector('p').remove();
    try {
        selectedMaterial.Delete();
        ReloadMaterialWindow();
    } catch (error) {
        $('#mat-main-window').append(`<p style="color:#CE352C;">${error.message}</p>`);
    }
}

function CopyMaterial(){
    let selectedKey =  $(".current-select")[0].value;
    let selectedMaterial = Material.MaterialsList.get(String(selectedKey));
    if($('#mat-main-window')[0].querySelector('p')) $('#mat-main-window')[0].querySelector('p').remove();
    selectedMaterial.Clone();
    ReloadMaterialWindow();
}

function CloseWindow(windowId) {
    $('#'+windowId)[0].parentElement.parentElement.remove();
}
    
function ActivateEditButtons() {
    if (document.querySelector('.current-select')){
        let buttons = document.querySelector('.ctrls').querySelectorAll('button')
        for (let i = 1; i < buttons.length; i++) {
            buttons[i].removeAttribute("disabled")            
        }
    }
}
