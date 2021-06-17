var secAssigned = false;
var assignedSection ;
let assignFrameSecWin = `
    <div

    id="assign-framesec-main-window"
    class="main-window"
    data-role="window"
    data-title="Sections"
    data-btn-min="false"
    data-btn-max="false"
    data-resizable="false"
    data-place="center">

    <div class="flex-col">

        <div data-role="panel" data-height="200" data-width="220">
            <div  style="width: 120px;">
                <ul data-role="listview">
                    <li value="1" data-caption="Section1"></li>
                    <li value="2" data-caption="Section2"></li>
                </ul>
            </div>
        </div>

        <div class="flex-rowm" style="justify-content: center;">
            <button class="button info">Ok</button>
            <button class="button default">Cancel</button>
        </div>
    </div>

    </div>
`
document.getElementById('assign-framesec-btn').addEventListener("click",function(){
    if(!document.querySelector('.main-window')) {
        $('body').append(assignFrameSecWin);
        InitAssignSecWin();
    }
});

//to assign frame section
function InitAssignSecWin() {
    FillDefSecs();
    document.querySelector('#assign-framesec-main-window .info').addEventListener("click",function(){
        if(document.querySelector('.current-select')){
            secAssigned = true;
            assignedSection = GetAssignedSection()
            //commands.excuteCommand( new AssignFrameSection( GetAssignedSection() ) );
        } 
        document.querySelector('.main-window').parentElement.parentElement.remove();
    });
    document.querySelector('#assign-framesec-main-window .default').addEventListener("click",function(){
        document.querySelector('.main-window').parentElement.parentElement.remove();
    })
}

function FillDefSecs(){
    let list = $('#assign-framesec-main-window ul');
    let length = list.children().length;
    for (let i = length-1; i >= 0 ; i--) {
        list.children()[i].remove();      
    }
    Section.SectionList.forEach((value,key) => {
        list.append(`<li value=${key} >${value.Name}</li>`); 
    });                  
}

function GetAssignedSection() {

    let secId = document.querySelector('.current-select').value;
    return Section.SectionList.get(String(secId));
}
