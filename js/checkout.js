let amount = 0;
const createClient = () => {

  // const priority = document.getElementById('priority');
  const general = document.getElementById('general');
  const name = document.getElementById('contact-name');
  const email = document.getElementById('contact-email');
  const country = document.getElementById('contact-country');


  if(general.checked){
    amount = 150;
  }else {
    amount = 1500;
  }
  //console.log(name.value, email.value, country.value, amount); 
  if(name.value && email.value && country.value && amount){
    initialize(name.value, email.value, country.value, amount)
  }
}

const createClientAE = () => {

  var formdata = collectData();
  log_data['data'] = "Payment request created: " + JSON.stringify(formdata); 
  aeLog(log_data,false);

  var amount = checkAmount(formdata.advance);

  if ((amount!=currentAmount)||(formdata.email!=emailAddress)) {
    
    if (elements!=null) $(".StripeElement").html("");
 
    initialize(formdata.name, formdata.email, formdata.country, amount);  

  }

  document.getElementById("order-form").style = "display: none";
  document.querySelector("#payment-form").style = "display: block";

}

// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.

var key = (tester) ? 
  "pk_test_51LxO07CBiDZSNJ7Q6E45zERQSIGW1uM8EKJ0QHEMwYcReabeAEK3CbHz6yZU8bzC0IkJjP0ZRamvPDnufc4OKyHT00HhQKrlgk" 
  :
  "pk_live_51LxO07CBiDZSNJ7QmAN9Mik8KRPS5cJ2dfSxdFvRkl64euTlQotX1FVk5DHLhfpzfUxPNMKDPndPGIz7HjoylVjN000s84GRGz"; 

const stripe = Stripe("pk_live_51LxO07CBiDZSNJ7QmAN9Mik8KRPS5cJ2dfSxdFvRkl64euTlQotX1FVk5DHLhfpzfUxPNMKDPndPGIz7HjoylVjN000s84GRGz");



// The items the customer wants to buy
//const items = [{ id: "xl-tshirt" }];

let elements;

// initialize();
//checkStatus(); moved to after the form

// document
//   .querySelector("#payment-form")
//   .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret

let currentAmount = 0;

async function initialize(name, email, country, amount) {
  emailAddress = email;

  currentAmount = amount;
  
  const response = await fetch("https://jellyfish-app-6nax7.ondigitalocean.app/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, country, amount }),
  });
  const { clientSecret } = await response.json();
  
    const appearance = {
      theme: 'stripe',
      rules: {
        '.Label': {
          color: 'white',
        },
        '.Label--invalid': {
          color: '#ff4525',
        },
        }
    };
    elements = stripe.elements({ appearance, clientSecret });
  
    const linkAuthenticationElement = elements.create("linkAuthentication",{defaultValues: {email: emailAddress}});
    linkAuthenticationElement.mount("#link-authentication-element");
  
    linkAuthenticationElement.on('change', (event) => {
      emailAddress = event.value.email;
    });
  
    const paymentElementOptions = {
      layout: "tabs",
    };
  
    const paymentElement = elements.create("payment", paymentElementOptions);
    paymentElement.on('change', function(event) {
      if (!event.empty) {
        log_data['data'] =  "Type in payment info"; 
        aeLog(log_data,false);
      }
    });

    document.querySelector("#submit").disabled = true;

    paymentElement.on('ready',function() {
      document.querySelector("#submit").disabled = false;
    });


    paymentElement.mount("#payment-element");

}

async function handleSubmit(e) {
  // e.preventDefault();
  //console.log("Submit");

  setLoading(true);
  formdata = collectData();

  log_data['data'] =  "Payment request submitted: " + JSON.stringify(formdata); 
  aeLog(log_data,false);

  var params = "";
  var params_array = ['name','email','country','advance'];
  for (var i=0; i<params_array.length; i++)
    params += ((i==0) ? '?' : '&') + "user_" + params_array[i] + '=' + formdata[params_array[i]];
  if (referral_code!='') params += "&user_referral="+referral_code;

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://alef.aero/preorder.html"+params,
      receipt_email: emailAddress,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }
  log_data['data'] =  error.type + ": " + JSON.stringify(collectData()); 
  aeLog(log_data,false);

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  if (tester) console.log(paymentIntent);

  switch (paymentIntent.status) {
    case "succeeded":
      //success sequence
      const has_refunds = await $.ajax({
          url: "https://api.stripe.com/v1/refunds",
          type: "GET",
          headers: {
            "Authorization": "Bearer " + decrypt('6a724675706f7c462c28556156292e5a5b705d434a57532e486e5c4343737b695e53415c7f7654482b6c7c7f777d435e2e5869505e7d2e555f2a515b2f40546c6d7d505e5c4c617355206c69786c2d604b412b4f4f2b775d2e602a7f5c7148707f29296e5348214d56697c')
          },
        data: {
            payment_intent: paymentIntent.id
          }
        });
        const refund_data = await has_refunds.count;
       if (refund_data) {
          $("#refund-number").text(paymentIntent.id.split("_")[1]);
          $("#thank-you").addClass('refunded').removeClass('final-loading');
          console.log("has been refunded");
          return;
        }

      //showMessage("Payment succeeded!");
      console.log("success sequence");
      try {
        var formdata = collectData();
        var value = parseInt(paymentIntent.amount)/100;
        var user_advance = new URLSearchParams(window.location.search).get("user_advance");
        var user_referral = new URLSearchParams(window.location.search).get("user_referral");
        formdata['advance'] = (user_advance) ? user_advance : formdata['advance'];
        formdata['amount_paypal'] = value;
        formdata['completed'] = (value>150) ? "priority" : "general";
        formdata['referral'] = (user_referral) ? user_referral : referral_code;
        formdata['paypal_id'] = paymentIntent.id;
        formdata['transaction_id'] = paymentIntent.id.split("_")[1];
        var billingDetails = paymentIntent.billing_details;

        if (formdata['name']=='') formdata['name'] = new URLSearchParams(window.location.search).get("user_name");
        if (formdata['country']=='') formdata['country'] = new URLSearchParams(window.location.search).get("user_country");
        if (formdata['email']=='') formdata['email'] = new URLSearchParams(window.location.search).get("user_email");

        formdata['name_paypal'] = (billingDetails) ? billingDetails.name : '';
        formdata['email_paypal'] = paymentIntent.receipt_email;
        // Concatenate address values into a single string
        formdata['address_paypal'] = (billingDetails) ? [
          billingDetails.address.line1,
          billingDetails.address.line2,
          billingDetails.address.city,
          billingDetails.address.state,
          billingDetails.address.postal_code,
          billingDetails.address.country
        ].filter(Boolean).join(", ") : '';

        var maildata = { 
          'email':((formdata['email']!="") ? formdata['email'] : paymentIntent.receipt_email ),
          'name': ((formdata['name']!="") ? formdata['name'] : formdata['name_paypal']),
          'order_number': formdata['transaction_id'],
          'ref_number' : referral_number,
          'queue' : formdata['completed'],
          'amount' : value
        };

      }
      catch(error) {
        log_data['data'] = String(error); 
        aeLog(log_data,false);
      }
      finally {
        

        if (tester) console.log("check if logged");
        var xhr = $.ajax({
            url: "https://alef.ae-collective.com/checker.php",
            method: "GET",
            type: "GET",
            dataType: "json",
            data: {id:formdata['transaction_id']}
            }).success(
              function (result) { 
                if (!result) {
                  updateSheets(formdata,'Stripe approved ' + formdata['transaction_id']);
                  confirmOrder(maildata);
                }
                else {
                  $("#thank-you").removeClass('final-loading');
                  log_data['data'] = "Repeat view " + formdata['transaction_id'];
                  aeLog(log_data,false);
                }
            }
          ).error(function() {
            //if cannot connect update anyways
            updateSheets(formdata,'Stripe approved ' + formdata['transaction_id']);
            log_data['data'] = "Possible duplicate " + formdata['transaction_id'];
            aeLog(log_data,false);
          });

        // Create a button to resend email
        $("#resend-mail").on('click', function() {
            if ($(this).text()=="Resend email")
            {
            console.log("resend mail");
            confirmOrder(maildata);
            $(this).text('Mail sent!');
            $(this).addClass('disabled');
            }
          });

        referral_code = formdata['transaction_id'];
        shareLinks();

        // Show a success message within this page, e.g.
        thankYou(formdata['transaction_id'],formdata['completed']);

      }
      break;
      case "processing":
        //keep refreshing
        //showMessage("Your payment is processing.");  
        $("#thank-you").addClass('processing');
        setTimeout(checkStatus,1000);      
        break;
      case "requires_payment_method":
        //display error and then fill the form with data and show
        
        log_data['data'] = "Payment processing error: " + JSON.stringify(collectData()); 
        aeLog(log_data,false);

        showMessage("Your payment was not successful, please try again.");

        $("#thank-you").addClass('error');
        fillForm();
        setTimeout(showFilledForm,1000);

        break;
      default:
        //display error and then fill the form with data and show
       
        log_data['data'] = "Unknown error: " + JSON.stringify(collectData()); 
        aeLog(log_data,false);

        showMessage("Something went wrong.");

        $("#thank-you").addClass('again');
        fillForm();
        setTimeout(showFilledForm,1000);

        break;
    }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 10000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

//fill form with data from URI
function fillForm() {
  var params_array = ['name','email','country','advance'];
  for (var i=0; i<params_array.length; i++) {
    var curr = new URLSearchParams(window.location.search).get("user_"+params_array[i]);
    var field = $("#contact-"+params_array[i]);
    field.attr("value",curr);
    if (params_array[i]=='advance')
      $(".preorder")[(curr>150) ? 1 : 0].dispatchEvent(new Event("click"));
    else {
      field[0].dispatchEvent(new Event('focus'));
      field[0].dispatchEvent(new Event('change'));
    }
  }

}

//display the form when ready
function showFilledForm() {
  document.getElementById("order-block").style = "display: block";
  document.getElementById("thank-you").style = "display: none";
  window.dispatchEvent(new Event("scroll"));
}