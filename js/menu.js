function createMenu(where)
{
    menu = Array( 
        { url: 'story.html', title: 'Our&nbsp;Story',class:''},
        { url: 'careers.html', title: 'Careers',class:''},
        { url: 'investors.html', title: 'Investors',class:''},
        { url: 'contact.html', title: 'Contact',class:''},
        { url: 'presskit.html', title: 'Press&nbsp;Kit',class:''},
        { url: 'purchase.html', title: 'Purchase<br><small>Flying&nbsp;Car</small>',class:'menu-button'}, 
        );

    target = document.getElementsByClassName(where);
    for (var n=0; n<target.length; n++)
    {
        
        for (var i=0; i<menu.length; i++) 
        {
            elem = document.createElement('li');
            if (menu[i]['class']) elem.classList.add(menu[i]['class']);
            elem.innerHTML = "<a href='"+menu[i]['url']+"'>"+menu[i]['title']+"</a>";
            target[n].appendChild(elem);
            if (i<menu.length-2) 
                {
                    elem = document.createElement('li');
                    elem.classList.add('divider');
                    target[n].appendChild(elem);
                }
        }
    

    }

}

createMenu('rd-navbar-nav');