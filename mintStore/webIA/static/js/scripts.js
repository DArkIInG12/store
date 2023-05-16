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

    $('#btnSendProduct').on('click', function (event) {
        event.preventDefault();
        var formData = {
            idProduct: $("#idProduct").val(),
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        $.ajax({
            url: "../../addToCartUnauth/",
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function(response){
                showAlert(response.response, "success", 1500)
            },
            error: function (error) {
                console.log(error);
                $.each( error.responseJSON, function( key, value ) {
                    //showAlert(value, "danger", 5000);
                    showAlert(value, "danger", 1500)
                });
            }
        });
    });

    $('#delProduct').on('click', function (event) {
        event.preventDefault();
        alert($('#this').val())
        //alert("ola")
    });

    function showAlert(message, type, closeDelay) {

        var $cont = $("#alerts-container");
   
        if ($cont.length == 0) {
            // alerts-container does not exist, create it
            $cont = $('<div id="alerts-container">')
                .css({
                     position: "fixed"
                    ,width: "50%"
                    ,left: "25%"
                    ,top: "10%"
                })
                .appendTo($("body"));
        }
   
        // default to alert-info; other options include success, warning, danger
        type = type || "info";    
   
        // create the alert div
        var alert = $('<div>')
            .addClass("fade in show alert alert-" + type)
            .append(
                $('<button type="button" class="close" data-dismiss="alert">')
                .append("&times;")
            )
            .append(message);
   
        // add the alert div to top of alerts-container, use append() to add to bottom
        $cont.prepend(alert);
   
        // if closeDelay was passed - set a timeout to close the alert
        if (closeDelay)
            window.setTimeout(function() { alert.alert("close") }, closeDelay);    
    }
});