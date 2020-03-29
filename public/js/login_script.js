function SignUpForNewsletter(){
    DarkenPage();
    ShowNewsletterPanel();
}

function ShowNewsletterPanel(){
    var newsletter_panel = document.getElementById('newsletter_panel');
    // w is a width of the newsletter panel
    w = 600;
    // h is a height of the newsletter panel
    h = 600;

    // get the x and y coordinates to center the newsletter panel
    xc = Math.round((document.body.clientWidth/2)-(w/2))
    yc = Math.round((document.body.clientHeight/2)-(h/2))

    // show the newsletter panel
    newsletter_panel.style.left = xc + "px";
    newsletter_panel.style.top  = yc + "px";
    newsletter_panel.style.display = 'block';
}

    // this function puts the dark screen over the entire page
function DarkenPage(){
    var page_screen = document.getElementById('page_screen');
    page_screen.style.height = document.body.parentNode.scrollHeight + 'px';
    page_screen.style.display = 'block';
}

function closePopLogin(){
    document.getElementById('newsletter_panel').style.display='none';
    document.getElementById('page_screen').style.display='none'
}