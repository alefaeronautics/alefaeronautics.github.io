const alert_countries = ["China","India"];

$(".form-input").each(function(index) { 
  $(this).on("change", function(){

    if ($(this).attr('id')=="contact-country") {

      if (alert_countries.includes($(this).attr('value')))
          $("#country-alert").removeClass('hide');
      else
        $("#country-alert").addClass('hide');

      bgBehavior();
    }
    if (isValidated($($(".rd-mailform")[0]).find("[data-constraints]"))) {
       $("#smart-button-container").removeClass("smart-button-faded");
    } else {
      $("#smart-button-container").addClass("smart-button-faded");
    }

  });
  $(this).on("input", function(){
    if ($(this).attr('value').length>4) 
     if ($("#smart-button-container").hasClass("smart-button-faded"))
      $(this).trigger("change");
  });
});


function initPayPalButton() {
  paypal.Buttons({
    style: {
      shape: 'rect',
      color: 'white',
      layout: 'vertical',
      label: 'pay',
      
    },
    onInit: function(data, actions) {

      },
      onCancel: function() {
        $('.queue-option').removeClass('faded');
      },
      onClick: function() {
      // Form validation
      var form = $($(".rd-mailform")[0]),
                    inputs = form.find("[data-constraints]"),
                    output = $("#" + form.attr("data-form-output"));

      output.removeClass("active error success");

                  if (isValidated(inputs)) {
          for (var i=1; i<=8; i++) setTimeout( function() { bgBehavior();},i*500); // make sure background is refreshed
      }                            
      
      },

    createOrder: function(data, actions) {
        var value = $("#contact-advance").attr('value'); 
        var choice = (value=='1500') ? "priority" : "general" ;
        $('.form-check-input[data-choice!="'+choice+'"]').closest('.queue-option').addClass('faded');
        //value = checkAmount(value);
        checkAmount(value);
        var description = "Alef Flying Car pre-order.\nRefundable deposit for your "+ choice +" queue place in line.";
        var order_data = {
            "description": description,
            "amount":{
                "currency_code":"USD",
                "value": value
              }
          };  
          
          //console.log(order_data);

          log_data['data'] = "Info to PayPal: " + JSON.stringify(order_data); 
          aeLog(log_data,false);
      
      return actions.order.create({
        purchase_units: [order_data]
      });
    },

    onApprove: function(data, actions) {
      return actions.order.capture().then(function(orderData) {
        
        // Full available details
        //console.log('Capture result', orderData, JSON.stringify(orderData, null, 2));

        // Collect info from the form and PayPal and update Google Sheets
        var formdata = collectData();
        var value = parseInt(orderData.purchase_units[0].amount.value);
        formdata['completed'] = (value>150) ? "priority" : "general";
        formdata['referral'] = referral_code;
        formdata['transaction_id'] = orderData.id;
        formdata['name_paypal'] = Object.values(orderData.payer.name).join(' ');
        formdata['email_paypal'] = orderData.payer.email_address;
        var maildata = { 
          'email':((formdata['email']!="") ? formdata['email'] : formdata['email_paypal']),
          'name': formdata['name_paypal'],
          'order_number': orderData.id,
          'ref_number' : referral_number,
          'queue' : formdata['completed'],
          'amount' : value
        };
        var address = orderData.payer.address;
        try {
          formdata['amount_paypal'] = Object.values(orderData.purchase_units[0].amount).join('');
          formdata['country_paypal'] = address.country_code;
          delete address.country_code;
          formdata['city_paypal'] = address.admin_area_2;
          formdata['address_paypal'] = Object.values(address).join(' ');
          formdata['paypal_id'] = orderData.purchase_units[0].payments.captures[0].id;
          updateSheets(formdata,true);
          confirmOrder(maildata);
        }
        catch(error) {
          log_data['data'] = String(error); 
          aeLog(log_data,false);
        }
        finally {
          log_data['data'] = 'PayPal approved ' + orderData.id + ' ID:' + formdata['paypal_id']; 
          aeLog(log_data,false);
        }

        referral_code = orderData.id;
        shareLinks();


        // Show a success message within this page, e.g.
        thankYou(orderData.id,formdata['completed']);
        
      });
    },

    onError: function(err) {
      //console.log('error event');
        // Collect data from form and update Google sheets with available info and error
        var formdata = collectData();
        formdata['completed'] = "no";
        formdata['error'] = String(err);
//      updateSheets(formdata,false);
//      console.log("updated with error");
        log_data['data'] = String(err);
        aeLog(log_data,false);
                                                        
        var form = $($(".rd-mailform")[0]);
        output = $("#" + form.attr("data-form-output"));
        if (output.hasClass("snackbars")) {
          output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span></span></p>');
          output.addClass("active");
        }       
        formClear("please try again",false,"",false);
    }
  }).render('#paypal-button-container');
}
initPayPalButton();