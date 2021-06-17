let comboMainWindow = `
<div

id="combo-main-window"
class="main-window"
data-role="window"
data-title="Define Load Combinations"
data-btn-min="false"
data-btn-max="false"
data-resizable="false"
data-place="center"
data-width="350">

    <div class="flex-col">
        <div class="flex-rowm">
            <div data-role="panel" data-title-caption="Load Combinations" data-height="200" data-width="250">
                <div id="combo-list-container" style="width: 150px;">
                    <ul data-role="listview" id="combo-list">
                        <li value="1" data-caption="Section1"></li>
                        <li value="2" data-caption="Section2"></li>
                    </ul>
                </div>
            </div>
            <div class="flex-col ctrls" style="margin-top: 20px;">
                <button class="button secondary" id="add-combo-btn"> Add </button>
                <button class="button secondary" id="mod-combo-btn"> Modify </button>
                <button class="button secondary" id="copy-combo-btn"> Copy </button>
                <button class="button secondary" id="delete-combo-btn">Delete</button>
            </div>
        
        </div>
        <div class="flex-rowm justify-center">
            <button id="close-combo-main" class="button info">Close</button>
        </div>
    </div>

</div>
`;

let comboModWindow = `
    <div

    id="combo-sec-window"
    class="secondary-window"
    data-role="window"
    data-title="Load Combination Data"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center">

    <div class="flex-col justify-start padding-all-0" >
        <div data-role="panel">
            <div class="flex-rowm margin-b-20">
                <div >
                    <label>Load Combination Name</label>
                </div>
                <div class="input-width">
                    <input type="text" class="input-small" data-role="input" data-clear-button="false">
                </div>
            </div>
        </div>
        
        <div class="flex-rowm">

            <div class="padding-all-0" data-role="panel" data-width="340" data-height="200" style="height:200px;">
                <div class="flex-rowm margin-b-20" >
                    <div class="input-width">
                        <strong>Load Case Name</strong>
                    </div>
                    <div class="input-width">
                        <strong>Scale factor</strong>
                    </div>
                </div>    
                <div class="flex-rowm margin-b-20" >
                    <div class="input-width">
                        <select 
                        id="load-case"
                        class="input-small"
                        data-role="select"
                        data-filter="false"
                        data-drop-height=80>
                            
                        </select>
                    </div>
                    <div id="scale-case" class="input-width"> 
                        <input type="number" min="0" class="input-small" data-role="input" data-clear-button="false">
                    </div>
                </div>
                
                <div id="combo-info-container">
                    <ul data-role="listview" id="combo-info">
                        
                    </ul>
                </div>
                
            </div>

            <div class="flex-col justify-center padding-all-0" data-role="panel" data-height="200">
                <div> <button class="button info" id="add-case" style="width: 64px;"> Add </button> </div>
                <div> <button class="button info" id="mod-case" style="width: 64px;"> Modify </button> </div>
                <div> <button class="button default" id="delete-case" style="width: 64px;">Delete</button> </div>
            </div>
        </div>
        <div class="flex-rowm justify-center">
            <button id="save-combo-sec" class="button info">Save</button>
            <button id="cancel-combo-sec" class="button info">Cancel</button>
        </div>
    </div>
    </div>
`

let comboAddWindow = `
    <div

    id="combo-add-window"
    class="secondary-window"
    data-role="window"
    data-title="Load Combination Data"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center">

    <div class="flex-col justify-start padding-all-0" >
        <div data-role="panel">
            <div class="flex-rowm margin-b-20">
                <div >
                    <label>Load Combination Name</label>
                </div>
                <div class="input-width">
                    <input type="text" class="input-small" data-role="input" data-clear-button="false">
                </div>
            </div>
        </div>
        
        <div class="flex-rowm">

            <div class="padding-all-0" data-role="panel" data-width="340" data-height="200" style="height:200px;">
                <div class="flex-rowm margin-b-20" >
                    <div class="input-width">
                        <strong>Load Case Name</strong>
                    </div>
                    <div class="input-width">
                        <strong>Scale factor</strong>
                    </div>
                </div>    
                <div class="flex-rowm margin-b-20" >
                    <div class="input-width">
                        <select 
                        id="load-case"
                        class="input-small"
                        data-role="select"
                        data-filter="false"
                        data-drop-height=80>
                            
                        </select>
                    </div>
                    <div id="scale-case" class="input-width"> 
                        <input type="number" min="0" class="input-small" data-role="input" data-clear-button="false">
                    </div>
                </div>
                
                <div id="combo-info-container">
                    <ul data-role="listview" id="combo-info">
                        
                    </ul>
                </div>
                
            </div>

            <div class="flex-col justify-center padding-all-0" data-role="panel" data-height="200">
                <div> <button class="button info" id="add-add-case" style="width: 64px;"> Add </button> </div>
                <div> <button class="button info" id="add-mod-case" style="width: 64px;"> Modify </button> </div>
                <div> <button class="button default" id="add-delete-case" style="width: 64px;">Delete</button> </div>
            </div>
        </div>
        <div class="flex-rowm justify-center">
            <button id="add-save-combo-sec" class="button info">Save</button>
            <button id="add-cancel-combo-sec" class="button info">Cancel</button>
        </div>
    </div>
    </div>
`

document.querySelector('#combo-btn').addEventListener('click',function(){
    if(!document.querySelector('.main-window')){
        $('body').append(comboMainWindow);
        LoadDefCombos();

        document.querySelector('#mod-combo-btn').addEventListener("click", function(){

            let current = document.querySelector('#combo-main-window .current-select');
            
            if(!document.querySelector('.secondary-window') && current){

                let combo = LoadCombo.LoadCombosList.get(String(current.value));
                let backup = combo.DeepCopyComboData();

                $('body').append(comboModWindow);
                LoadDefCases();
                LoadComboData(current.value);

                document.querySelector('#add-case').addEventListener("click", function(){
                    
                    AddComboField(current.value);
                });

                document.querySelector('#mod-case').addEventListener("click", function(){
                    if(document.querySelector('#combo-sec-window .current-select')){                      
                        ModifyCase(current.value);
                    }
                });

                document.querySelector('#delete-case').addEventListener("click", function(){
                    if(document.querySelector('#combo-sec-window .current-select')){                      
                        DeleteComboCase(current.value);
                    }
                });

                document.querySelector('#save-combo-sec').addEventListener("click", function(){
                    ChangeComboName(current.value);
                    document.querySelector('#combo-sec-window').parentElement.parentElement.remove();
                    LoadDefCombos();
                });

                document.querySelector('#cancel-combo-sec').addEventListener("click", function(){
                    combo.Delete();
                    let combo2 = new LoadCombo(backup.Name, backup.LoadPattsInfo);
                    combo2._cpyNo = backup.cpyNo;
                    document.querySelector('#combo-sec-window').parentElement.parentElement.remove();
                    LoadDefCombos();
                });
            }
        });

        document.querySelector('#add-combo-btn').addEventListener("click",function(){
            if(!document.querySelector('.secondary-window')){
                $('body').append(comboAddWindow);
                LoadDefCases();
                let loadPattInfo = [];

                document.querySelector('#add-add-case').addEventListener("click", function(){
                    AddNewComboField(loadPattInfo);
                });
                document.querySelector('#add-mod-case').addEventListener("click", function(){
                    if(document.querySelector('#combo-add-window .current-select')){
                        ModifyNewCase(loadPattInfo);
                    }
                });

                document.querySelector('#add-delete-case').addEventListener("click", function(){
                    if(document.querySelector('#combo-add-window .current-select')){
                        DeleteNewComboCase(loadPattInfo);
                    }
                });

                document.querySelector('#add-save-combo-sec').addEventListener("click", function(){
                    let name = document.querySelector('#combo-add-window input[type="text"]').value;
                    try{
                        new LoadCombo(name, loadPattInfo);
                        document.querySelector('#combo-add-window').parentElement.parentElement.remove();
                        LoadDefCombos();
                    }catch(error){
                        Metro.dialog.create({
                            title: "Error",
                            content: `<div>${error.message}</div>`,
                            closeButton: true
                        });
                    }
                });

                document.querySelector('#add-cancel-combo-sec').addEventListener("click", function(){
                    document.querySelector('#combo-add-window').parentElement.parentElement.remove();
                    LoadDefCombos();
                })
                //document.querySelector()
            }
        }); 

        document.querySelector('#copy-combo-btn').addEventListener("click", function(){
            if(document.querySelector('#combo-main-window .current-select')){
                let comboId = document.querySelector('#combo-main-window .current-select').value;
                let combo = LoadCombo.LoadCombosList.get(String(comboId));
                combo.Clone();
                LoadDefCombos();
            }
        });

        document.querySelector('#delete-combo-btn').addEventListener("click", function(){
            if(document.querySelector('#combo-main-window .current-select')){
                let comboId = document.querySelector('#combo-main-window .current-select').value;
                let combo = LoadCombo.LoadCombosList.get(String(comboId));
                combo.Delete();
                LoadDefCombos();
            }
        });
        
    }
});

function LoadDefCombos() {
    let length = $('#combo-list').children().length;
    for (let i = length-1; i >= 0 ; i--) {
        $('#combo-list').children()[i].remove();      
    } 

    LoadCombo.LoadCombosList.forEach((value,key) => {
        $("#combo-list").append(`<li class="node" value=${key} >${value.Name}</li>`); 
    })
}

function RefreshComboList() {
    document.querySelector('#combo-list').remove();
    $('#combo-list-container').append(`
        <ul data-role="listview" id="combo-list">
            <li></li>
        </ul>
    `)
    LoadDefCombos();
}

function LoadDefCases() {
    let length = $('#load-case').children().length;
    for (let i = length-1; i >= 0 ; i--) {
        $('#load-case').children()[i].remove();      
    }
    LoadPattern.LoadPatternsList.forEach((value,key) => {
        $('#load-case').append(`
            <option value=${key}>${value.Name}</option>
        `)
    });
    /*LoadCombo.LoadCombosList.forEach((value,key) => {
        $('#load-case').append(`
            <option value=${'c'+key}>${value.Name}</option>
        `)
    });*/
}

function LoadComboData(comboId) {

    let length = $('#combo-info').children().length;
    for (let i = length-1; i >= 0 ; i--) {
        $('#combo-info').children()[i].remove();      
    } 
    let combo = LoadCombo.LoadCombosList.get(String(comboId));
    let infoArr = combo.LoadPattsInfo;
    document.querySelector('#combo-sec-window input[type="text"]').value = combo.Name;
    for (const info of infoArr) {
        let pattId = info.patternId;
        let scale = info.scaleFactor;
        let pat = LoadPattern.LoadPatternsList.get(pattId);
        $('#combo-info').append(`
        <li style="display:inline-block;" value=${''+pattId}>
            <div class="flex-rowm justify-start">
                <div class="width-160">${pat.Name}</div>
                <div>${scale}</div>
            </div>
        </li>
        `);
    }
    $('#load-case')[0].value = infoArr[0].patternId;
    $('#scale-case input')[0].value = infoArr[0].scaleFactor;
}

function AddComboField(comboId) {

    let patId = $('#load-case')[0].value;
    let pat = LoadPattern.LoadPatternsList.get(String(patId));
    let scale = $('#scale-case input')[0].value;

    try {
        
        let combo = LoadCombo.LoadCombosList.get(String(comboId));
        combo.AddLoadPattInfo(String(patId), Number(scale));

        $('#combo-info').append(`
        <li class="node" style="display:inline-block;" value=${patId}>
            <div class="flex-rowm justify-start">
                <div class="width-160">${pat.Name}</div>
                <div>${scale}</div>
            </div>
        </li>
        `);

    } catch (error) {
        Metro.dialog.create({
            title: "Error",
            content: `<div>${error.message}</div>`,
            closeButton: true
        });
    }
    
}

function ModifyCase(comboId) {
    let combo = LoadCombo.LoadCombosList.get(String(comboId));

    //old data
    let oldPatId = $('#combo-sec-window .current-select')[0].value;

    //new data
    let patId = $('#load-case')[0].value;
    let scale = $('#scale-case input')[0].value;
    let patt = LoadPattern.LoadPatternsList.get(String(patId));

    try {
        combo.ModifyPattInfo(String(oldPatId), String(patId), Number(scale));
        let li = document.querySelector(`#combo-info li[value='${oldPatId}']`);
        li.value = patId;
        let divs = li.querySelector('div').querySelectorAll('div')
        divs[0].innerHTML = patt.Name;
        divs[1].innerHTML = Number(scale);   
    } catch (error) {
        Metro.dialog.create({
            title: "Error",
            content: `<div>${error.message}</div>`,
            closeButton: true
        });
    }
}

function DeleteComboCase(comboId) {
    let combo = LoadCombo.LoadCombosList.get(String(comboId));
    let pattId = $('#combo-sec-window .current-select')[0].value;

    try {
        combo.DeletePattInfo(String(pattId));
        document.querySelector(`#combo-info li[value='${pattId}']`).remove();
    } catch (error) {
        Metro.dialog.create({
            title: "Error",
            content: `<div>${error.message}</div>`,
            closeButton: true
        });
    }    
}

function ChangeComboName(comboId){
    let name = document.querySelector('#combo-sec-window input[type="text"]').value;
    try {
        LoadCombo.LoadCombosList.get(String(comboId)).Name = name
    } catch (error) {
        Metro.dialog.create({
            title: "Error",
            content: `<div>${error.message}</div>`,
            closeButton: true
        });
    }
}

function AddNewComboField(loadpattsArray) {
    
    let patId = $('#load-case')[0].value;
    let pat = LoadPattern.LoadPatternsList.get(String(patId));
    let scale = $('#scale-case input')[0].value;

    let matching = loadpattsArray.filter( info => info.patternId == String(patId));
    if(matching.length){
        Metro.dialog.create({
            title: "Error",
            content: `<div>the load pattern can not be duplicated</div>`,
            closeButton: true
        });
    }else if(Number(scale)==0){
        Metro.dialog.create({
            title: "Error",
            content: `<div>Scale factor must be added</div>`,
            closeButton: true
        });
    }else{
        loadpattsArray.push({patternId: String(patId), scaleFactor: Number(scale)});
        $('#combo-info').append(`
        <li class="node" style="display:inline-block;" value=${patId}>
            <div class="flex-rowm justify-start">
                <div class="width-160">${pat.Name}</div>
                <div>${scale}</div>
            </div>
        </li>
        `);
    }
}

function ModifyNewCase(loadpattsArray) {
    let oldPatId = String($('#combo-add-window .current-select')[0].value);

    //new data
    let patId = $('#load-case')[0].value;
    let scale = $('#scale-case input')[0].value;
    let patt = LoadPattern.LoadPatternsList.get(String(patId));
    if(Number(scale) == 0){
        Metro.dialog.create({
            title: "Error",
            content: `<div>Scale factor must be added</div>`,
            closeButton: true
        });
        return;
    }

    let matching = loadpattsArray.filter(info => info.patternId == String(patId));

    if(oldPatId == patId){
        matching[0].scaleFactor = Number(scale);
        
    }else if(matching.length){
        Metro.dialog.create({
            title: "Error",
            content: `<div>load pattern cannot be duplicated</div>`,
            closeButton: true
        });
        return;
    }else{
        let modified = loadpattsArray.filter(info => info.patternId==oldPatId)[0];
        let index = loadpattsArray.indexOf(modified);
        loadpattsArray[index]={patternId: String(patId), scaleFactor: Number(scale)};
    }
    let li = document.querySelector(`#combo-info li[value='${oldPatId}']`);
    li.value = patId;
    let divs = li.querySelector('div').querySelectorAll('div')
    divs[0].innerHTML = patt.Name;
    divs[1].innerHTML = Number(scale);     

}

function DeleteNewComboCase(loadpattsArray) {
    let patId = $('#combo-add-window .current-select')[0].value;
    let deleted = loadpattsArray.filter(info => info.patternId==String(patId))[0];
    let index = loadpattsArray.indexOf(deleted);
    loadpattsArray.splice(index, 1);
    document.querySelector(`#combo-info li[value='${patId}']`).remove();
}