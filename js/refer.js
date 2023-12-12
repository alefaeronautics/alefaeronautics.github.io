const discount = {
    code: "",
    getPrice: function() {
        return (ocean_value) ? ocean_value : 150;
    },
    getCode: function() {
        var url = window.location.href;
        if (url.lastIndexOf('#')!=-1) this.code = url.substring(url.lastIndexOf('#')+1,url.length).split('?')[0];
        else {
            var user_ref = new URLSearchParams(window.location.search).get("user_referral");
            this.code = (user_ref) ? user_ref : "";
        }
        return this.code;
    },
    init: function() {
        this.getCode();
        if (this.code!='') {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = "https://deep-water-rucks.ondigitalocean.app/referral/?code="+this.code;
            script.onload = function() {
                updatePrice();
            };
            // Append the script element to the document
            document.head.appendChild(script);
        }
    }
}

discount.init();

var referral_code = discount.getCode();
if (referral_code!='') $("#preorder-price").addClass('loading');
//const preorder_price = discount.getPrice();
const referral_number = 7;

function updatePrice() {
    if (ocean_value) { 
        if (ocean_value != 150) {
            $("#preorder-price").html("<s style='font-weight: normal !important;'>$150</s>$" + ocean_value);
            $("#order-label").innerHTML = ((CN) ? "普通" : "General Queue") + " ($" + ocean_value + ")";
            $("#contact-advance").val(ocean_value);
        }
        $("#preorder-price").removeClass('loading');
      }
}
