function changeTab(){
    var header = document.getElementById("nav-id");
    var btns = header.getElementsByClassName("lst");
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function() {
            var current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
}

function SignUpForNewsletter(){
    DarkenPage();
    ShowPanel();
}

function ShowPanel(){
    var panel = document.getElementById('panel');
    w = 600;
    h = 600;
    xc = Math.round((document.body.clientWidth/2)-(w/2))
    yc = Math.round((document.body.clientHeight/2)-(h/2))

    panel.style.left = xc + "px";
    panel.style.top  = yc + "px";
    panel.style.display = 'block';
}

    // this function puts the dark screen over the entire page
function DarkenPage(){
    var page_screen = document.getElementById('page_screen');
    page_screen.style.height = document.body.parentNode.scrollHeight + 'px';
    page_screen.style.display = 'block';
}

function closePopLogin(){
    document.getElementById('panel').style.display='none';
    document.getElementById('page_screen').style.display='none'
}


