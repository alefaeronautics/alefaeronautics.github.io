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
  initialize(formdata.name, formdata.email, formdata.country, formdata.advance);
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
checkStatus();

// document
//   .querySelector("#payment-form")
//   .addEventListener("submit", handleSubmit);

let emailAddress = '';
// Fetches a payment intent and captures the client secret
async function initialize(name, email, country, amount) {
  emailAddress = email
  infoForm.style = "display: none";
  document
  .querySelector("#payment-form").style = "display: block";

  const response = await fetch("https://jellyfish-app-6nax7.ondigitalocean.app/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, country, amount }),
  });
  const { clientSecret } = await response.json();
  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });
  if (tester) console.log(response);

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

async function handleSubmit(e) {
  // e.preventDefault();
  console.log("Submit")
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "https://alef.aero/preorder.html",
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
      showMessage("Payment succeeded!");
      console.log("success sequence");
      break;
    case "processing":
      showMessage("Your payment is processing.");
      break;
    case "requires_payment_method":
      showMessage("Your payment was not successful, please try again.");
      log_data['data'] = "Payment processing error: " + JSON.stringify(collectData()); 
      aeLog(log_data,false);
      break;
    default:
      showMessage("Something went wrong.");
      log_data['data'] = "Unknown error: " + JSON.stringify(collectData()); 
      aeLog(log_data,false);
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
  }, 40000);
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

