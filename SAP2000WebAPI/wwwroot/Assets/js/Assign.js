var restraint;

function CloseRestraint() {
    Metro.window.close('#JointRestraint');
}

function JointRestraint() {
    $('body').append(`<div id="JointRestraint" data-top="200" style="z-index: 3;  " data-left="200" data-role="window"
    data-width="330" data-height="320" data-resizable="false" data-title="Joint Restraint"
    data-btn-min="false" data-btn-max="false">

    <div class="flex-rowm">
        <div class="flex-col" style="margin-top: 20px;">
            <button id = "Fix" class="shortcut  secondary outline" onClick = "Fix()">
                <span class="badge">Fixed</span>
                <img src="Assets/images/FixedSupportIcon.png">
            </button>
            <button id = "Hinge" class="shortcut  secondary outline" onClick = "Hinge()">
                <span class="caption">Hinged</span>
                <img src="Assets/images/HingedIcon.JPG">
            </button>

        </div>
        <div class="flex-col" style="margin-top: 20px;">
            <button id = "Roller" class="shortcut  secondary outline" onClick = "Roller()">
                <span class="badge">Roller</span>
                <img src="Assets/images/RollerIcon.JPG">
            </button>
            <button id = "Free" class="shortcut  secondary outline" onClick = "Free()">
                <span class="caption">Free</span>
                <img src="Assets/images/FreeSupportIcon.png">
            </button>
        </div>


    </div>
        <div style="margin-left:45px">
            <button class="button info" style="width:35px; hight:30px; font-size:12px; margin-top:18px" onclick="ApplyRestraint(); CloseRestraint();">OK</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px; margin-top:18px" onclick="ApplyRestraint()">Apply</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px; margin-top:18px" onclick="CloseRestraint()">Cancel</button>    
        </div>
</div>`)
}

//document.getElementById("Hinge").onclick=function(){Hinge()};
function Hinge()
{  
    restraint = [true, true, true, false, false, false];
}

function Fix() 
{
    restraint = [true, true, true, true, true, true];
}

function Roller()
{
    restraint = [false, false, true, false, false, false];
}

function Free()
{
    restraint = [false, false, false, false, false, false];
}

function ApplyRestraint()
{
    if(Point.SelectedPoints.length > 0)
    {
        Labels();
        DrawLine.LoadsDisplayed = false;
        DrawLine.HideLoads();
        commands.excuteCommand(new AssignRestraints(restraint));
    }
}


function MoveWindow() {
    $('body').append(`<div id="MoveElement" data-top="150" style="z-index: 3;  " data-left="150" data-role="window"
    data-width="350" data-height="190" data-resizable="false" data-title="Move"

    <div>
        <div style="margin-top: 10px; margin-left:10px; width: 80%; font-size:12px;">
            X-direction translation  
            <input type="number" id = "Move-X" style="width:65px; margin-left:15px;"><br>
            Y-direction translation
            <input type="number" id = "Move-Y" style="width:65px; margin-left:15px;"><br>
            Z-direction translation
            <input type="number" id = "Move-Z" style="width:65px; margin-left:15px;"><br><br>
        </div>
        <div style="margin-left:55px">
            <button class="button info" style="width:35px; hight:30px; font-size:12px;" onclick="ApplyMoveButton(); CloseMoveWindow();">OK</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="ApplyMoveButton()">Apply</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="CloseMoveWindow()">Cancel</button>
        </div>
    
</div>`)
}

function CloseMoveWindow() {
    Metro.window.close('#MoveElement');
}


function ApplyMoveButton()
{
    var delta = [0,0,0];
    const x = document.getElementById("Move-X").value;
    if(!isNaN(x) && x != 0)
    {
        delta[0] = parseFloat(x);
    }
    const y = document.getElementById("Move-Y").value;
    if(!isNaN(y) && y != 0)
    {
        delta[1] = parseFloat(y);
    }
    const z = document.getElementById("Move-Z").value;
    if(!isNaN(z) && z != 0)
    {
        delta[2] = parseFloat(z);
    }
    if(DrawLine.SelectedLines.length>0)
    {
        if(delta[0] !==0 || delta[1] !==0 || delta[2] !== 0)
        {
            commands.excuteCommand(new Move(delta));
        }
    }
}


function CopyWindow() {
    $('body').append(`<div id="CopyElement" data-top="150" style="z-index: 3;  " data-left="150" data-role="window"
    data-width="350" data-height="210" data-resizable="false" data-title="Copy"

    <div>
        <div style="margin-top: 10px; margin-left:10px; width: 80%; font-size:12px;">
            X-direction translation  
            <input type="number" id = "Copy-X" style="width:65px; margin-left:15px;"><br>
            Y-direction translation
            <input type="number" id = "Copy-Y" style="width:65px; margin-left:15px;"><br>
            Z-direction translation
            <input type="number" id = "Copy-Z" style="width:65px ; margin-left:15px;"><br>
            Repitition
            <input type="number" id = "Rep" style="width:65px; margin-left:82px;" value = 1><br><br>
        </div>
        <div style="margin-left:55px">
            <button class="button info" style="width:35px; hight:30px; font-size:12px;" onclick="ApplyCopyButton(); CloseCopyWindow();">OK</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="ApplyCopyButton()">Apply</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="CloseCopyWindow()">Cancel</button>
        </div>
    
</div>`)
}

function CloseCopyWindow() {
    Metro.window.close('#CopyElement');
}


function ApplyCopyButton()
{
    var delta = [0,0,0];
    const x = document.getElementById("Copy-X").value;
    if(!isNaN(x) && x != 0)
    {
        delta[0] = parseFloat(x);
    }
    const y = document.getElementById("Copy-Y").value;
    if(!isNaN(y) && y != 0)
    {
        delta[1] = parseFloat(y);
    }
    const z = document.getElementById("Copy-Z").value;
    if(!isNaN(z) && z != 0)
    {
        delta[2] = parseFloat(z);
    }
    let r = document.getElementById("Rep").value;
    let copiable = true;
    if(isNaN(r) || r < 1)
    {
        copiable = false;
    }else{
        r = Math.floor(parseFloat(r));
    }

    if(DrawLine.SelectedLines.length > 0 && copiable){
        if(delta[0] !==0 || delta[1] !==0 || delta[2] !== 0)
        {
            commands.excuteCommand(new Copy(delta, r));
        }
    }
}










document.getElementById("Delete").onclick=function(){DeleteButton()};
function DeleteButton()
{
    commands.excuteCommand(new Delete(DrawLine.SelectedLines));
}




function RotateWindow() {
    $('body').append(`<div id="RotateElement" data-top="150" style="z-index: 3;  " data-left="150" data-role="window"
    data-width="350" data-height="165" data-resizable="false" data-title="Rotate Frame Element"

    <div>
        <div style="margin-top: 10px; margin-left:10px; width: 80%; font-size:12px;">
            Rotate Frame element about it's local axis 
            <input type="number" id = "RotateAboutAxis-1" style="width:65px; margin-top:10px;"> degrees <br><br>
        
        </div>
        <div style="margin-left:55px">
            <button class="button info" style="width:35px; hight:30px; font-size:12px;" onclick="Rotate(); CloseRotateWindow();">OK</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="Rotate()">Apply</button>
            <button class="button default" style="width:65px; hight:30px; font-size:12px;" onclick="CloseRotateWindow()">Cancel</button>
        </div>
    
</div>`)
}

function CloseRotateWindow() {
    Metro.window.close('#RotateElement');
}

function Rotate()
{
    const rotation = document.getElementById("RotateAboutAxis-1").value;
    if(DrawLine.SelectedLines.length > 0){
        Labels();
        DrawLine.LoadsDisplayed = false;
        DrawLine.HideLoads();
        commands.excuteCommand(new RotateFrame(rotation));
    }
}


