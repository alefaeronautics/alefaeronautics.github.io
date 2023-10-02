const discount = {
    code: "",
    getPrice: function() {
        var codes = {
            "forgetthetraffic100": 100,
            "flyabovetraffic125": 125,
            "nordic": 100,
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
        else this.code = "";
        return this.code;
    }
}

var referral_code = discount.getCode();
var preorder_price = discount.getPrice();
var referral_number = 7;
