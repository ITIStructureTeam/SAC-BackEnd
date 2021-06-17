

document.getElementsByTagName('body')[0].addEventListener("click", function () {
    Metro.sidebar.close('#sb1');
});


var flag = true;

function resizeribbon() {
    Metro.toast.create("Resizing Ribbon", null, 1000);
    if (flag) {
        var x = $("button.ribbon-button");
        document.getElementById('resizeribbonbtn').style.top = "70%";
        // document.getElementById('sb4').style.marginTop = "132.4px";

        for (i = 0; i < x.length; i++) {
            if (x[i].className == 'ribbon-button')
                x[i].setAttribute('class', 'ribbon-icon-button');
            else
                x[i].setAttribute('class', 'ribbon-icon-button dropdown-toggle');
        }
        flag = !flag;
    } else {
        var x = $("button.ribbon-icon-button");
        document.getElementById('resizeribbonbtn').style.top = "76%";
        // document.getElementById('sb4').style.marginTop = "174px";

        for (i = 0; i < x.length; i++) {
            if (x[i].className == 'ribbon-icon-button')
                x[i].setAttribute('class', 'ribbon-button');
            else
                x[i].setAttribute('class', 'ribbon-button dropdown-toggle');
        }
        flag = !flag;
    }
}

