var curPage = "";
if (typeof CN === 'undefined') var CN = false;

function createMenu(where)
{
    menu = Array( 
        { url: 'story.html', title: 'Our&nbsp;Story',class:''},
        { url: 'careers.html', title: 'Careers',class:''},
        { url: 'investors.html', title: 'Investors',class:''},
        { url: 'contact.html', title: 'Contact',class:''},
        { url: 'press.html', title: 'Press',class:''},
        { url: 'preorder.html', title: '<nobr>Pre-order</nobr><br><small>Flying&nbsp;Car</small>',class:Array('menu-button')}, 
        );

    var item = window.location.href;
    item = item.substring(item.lastIndexOf('/')+1,item.length);
    if (item.lastIndexOf('#')!=-1) item = item.substring(0,item.lastIndexOf('#'));

    if (item=="preorder_cn.html") { CN = true; }

    target = document.getElementsByClassName(where);
    for (var n=0; n<target.length; n++)
    {
        for (var i=0; i<menu.length; i++) 
        {
            //if ((item==menu[menu.length-1]['url'])&&(i==menu.length-1)) break;
            elem = document.createElement('li');
            if (menu[i]['class']) for (j=0; j<menu[i]['class'].length; j++) elem.classList.add(menu[i]['class'][j]);
            elem.innerHTML = "<a href='"+menu[i]['url']+"'>"+menu[i]['title']+"</a>";
            if (menu[i]['url']==item) {
                elem.classList.add('active');
                curPage = (menu[i]['url']=='preorder.html') ? 'Preorder' : menu[i]['title'];
                }
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