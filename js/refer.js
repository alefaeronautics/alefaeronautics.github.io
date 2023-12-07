const discount = {
    code: "",
    getPrice: function() {
        var codes = {
            "forgetthetraffic100": 100,
            "flyabovetraffic125": 125,
            "nordic": 100,
            "aetest": 1,
            "other": 125
        }
    if (this.code == "") return 150;
    if (typeof codes[this.code] === "undefined")
        return codes["other"];
    else return codes[this.code];
    },
    getCode: function() {
        var url = window.location.href;
        if (url.lastIndexOf('#')!=-1) this.code = url.substring(url.lastIndexOf('#')+1,url.length).split('?')[0];
        else {
            var user_ref = new URLSearchParams(window.location.search).get("user_referral");
            this.code = (user_ref) ? user_ref : "";
        }
        return this.code;
    }
}

var referral_code = discount.getCode();
const preorder_price = discount.getPrice();
const referral_number = 7;
