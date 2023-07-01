const alert_countries = ["China","India"];

document.querySelectorAll(".form-input").forEach(i=>{
        i.addEventListener("change",()=>{
          if (i.id=="contact-country") {

            if (alert_countries.includes(i.value))
                document.getElementById("country-alert").classList.remove('hide');
            else
              document.getElementById("country-alert").classList.add('hide');

            bgBehavior();
          }
          if (isValidated($($(".rd-mailform")[0]).find("[data-constraints]"))) {
             document.getElementById("smart-button-container").classList.remove("smart-button-faded");
          } else {
            document.getElementById("smart-button-container").classList.add("smart-button-faded");
          }
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
        var value = parseInt($("#contact-advance").val()); 
        value = checkAmount(value);
        var description = "Alef Flying Car pre-order.\nRefundable deposit for your "+ ( (value>150) ? "priority" : "general" ) +" queue place in line.";
        var order_data = {
            "description": description,
            "amount":{
                "currency_code":"USD",
                "value": value
              }
          };  
          
          //console.log(order_data);
      
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
        formdata['completed'] = (formdata['advance']>150) ? "priority" : "general";
        formdata['referral'] = referral_code;
        formdata['transaction_id'] = orderData.id;
        formdata['name_paypal'] = Object.values(orderData.payer.name).join(' ');
        formdata['email_paypal'] = orderData.payer.email_address;
        var maildata = { 
          'email':((formdata['email']!="") ? formdata['email'] : formdata['email_paypal']),
          'order_number': orderData.id,
          'ref_number' : referral_number
        };
        var address = orderData.payer.address;
        try {
          formdata['amount_paypal'] = Object.values(orderData.purchase_units[0].amount).join('');
          formdata['country_paypal'] = address.country_code;
          delete address.country_code;
          formdata['city_paypal'] = address.admin_area_2;
          formdata['address_paypal'] = Object.values(address).join(' ');
          updateSheets(formdata);
          //confirmOrder(maildata);

        }
        catch(error) {
          log_data['data'] = String(error); 
          aeLog(log_data);
        }
        finally {
          log_data['data'] = 'PayPal approved ' + orderData.id; 
          aeLog(log_data);
        }

        referral_code = orderData.id;
        shareLinks();


        // Show a success message within this page, e.g.
        thankYou(orderData.id,formdata['name']);
        
      });
    },

    onError: function(err) {
        // Collect data from form and update Google sheets with available info and error
        var formdata = collectData();
        formdata['completed'] = "no";
        formdata['error'] = String(err);
        try { 
          updateSheets(formdata);
//        console.log("updated with error");
        }
        catch(error) {
          log_data['data'] = String(error);
          aeLog(log_data);
        }
        finally {
          log_data['data'] = formdata['error'];
          aeLog(log_data);
        }
                                                        
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