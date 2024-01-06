  $('.round').click(function(e) {
          e.preventDefault();
          e.stopPropagation();
          //$('.arrow').toggleClass('bounceAlpha');
          const list =   $('.round');   //all containers
      const index =  list.index($(this));  //current container
      const target = (index + 1) % list.length;    //increment with wrap
      $('.arrow-toggler')[target].scrollIntoView();
  //log_data['data'] = "Page browse block #" + (index+1); 
      //aeLog(log_data,false);
      });
  // unfix the background when scrolled beyond the first block
  function bgBehavior() {
    if (document.getElementById("first-block").scrollHeight > window.innerHeight) {
      pos = - window.innerHeight - window.scrollY + document.getElementById("first-block").scrollHeight - 41;
      if (pos > 0) pos = 0;
    }
    else
      pos = -window.scrollY;
    document.getElementsByClassName("purchase-car")[0].style = "background-position-y:" + String(pos) + "px;";
  }
  window.addEventListener('scroll', bgBehavior);

window.addEventListener('beforeunload', function (e) {
    log_data['data'] = "Page closing"; 
    aeLog(log_data,false);     
});

  
  var scrolled_out = false;
  // Create an IntersectionObserver callback function
  function createIntersectionCallback(index) {
    return (entries, observer) => {
      entries.forEach(entry => {
      if (entry.isIntersecting) {
              if ( ((index==-1)&&scrolled_out) || ( !scrolled_out&&(index>=0) ) || (index==3) ) 
            { 
              log_data['data'] = (index==-1) ? "Back to order form" : ( (index==3) ? "Page browse: last block" : "Page browse");// block #" + (index+1); 
              aeLog(log_data,false); 
              //console.log(log_data['data']);
            }
          scrolled_out = (index!=-1);
      }
      });
    };
    }

    // Create an IntersectionObserver instance for each element with the specified CSS class
    const elementsToObserve = document.querySelectorAll('.preorder-image'); //for all elements
    elementsToObserve.forEach((element, index) => {
    const observer = new IntersectionObserver(
      createIntersectionCallback(index),
      {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.25, // Adjust this threshold as needed
      }
    );
    observer.observe(element);
    });

    const observer = new IntersectionObserver(
      createIntersectionCallback(-1),
      {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.5, // Adjust this threshold as needed
      }
    );
    observer.observe(document.getElementById("first-block"));