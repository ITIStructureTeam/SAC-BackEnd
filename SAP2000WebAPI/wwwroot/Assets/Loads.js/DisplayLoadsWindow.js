let dispLoadsWindow = `
    <div

    id="disp-load-window"
    class="main-window"
    data-role="window"
    data-title="Display Frame Loads"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center">

        <div class="flex-col">
            <div class="padding-all-0" data-role="panel" data-height="130" style="height:130px;">
                <div class="flex-rowm">
                    <div class="input-width">
                        <label>Load Pattern</label>
                    </div>
                    <div class="input-width">
                        <select 
                        id="disp-load-pattern"
                        class="input-small"
                        data-role="select"
                        data-filter="false"
                        data-drop-height="85">

                        </select>

                    </div>
                </div>
            </div>
            <div class="flex-rowm justify-center">
                <div> <button class="button info" id="ok-disp-load-btn" style="width: 64px;"> Ok </button> </div>
                <div> <button class="button info" id="close-disp-load-btn" style="width: 64px;"> Close </button> </div>
            </div>
        </div>
    </div>

`


function DispLoadPatts(){
    LoadPattern.LoadPatternsList.forEach( (value, key) => {
        $('#disp-load-pattern').append(`
            <option value=${key}>${value.Name}</option>
        `)
    });
}

function GetDispLoadPatternId() {
    return $('#disp-load-pattern')[0].value;
}