$(document).ready(function(){

    url = window.location.href;
    tabs=["home","contact","about","register","login","users","products","categories",
    "coupons","payments","dashboard"];

    tabs.forEach(element => {
        if(url.includes(element)){
            $('#'+element).addClass("active")
            $('#'+element).addClass("disabled")
            if(element == "products" || element == "categories" || element == "coupons" || element.includes("methods")){
                $('#productsDrop').addClass("active")
            }
        }else{
            $('#'+element).removeClass("active")
            $('#'+element).removeClass("disabled")
        }
    });
});