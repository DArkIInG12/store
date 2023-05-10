$(document).ready(function(){
    downButtons();
    var data = []
    var table = $('#dtCoupons').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtCoupons tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons()
            $("#alter-coupons").addClass('hidden')
            data = []
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            upButtons()
            data = table.row( this ).data();
        }
    });

    $('#btnModifyCoupon').on('click', function () {
        $("#alter-coupons").removeClass('hidden')
        $('#addCouponForm').trigger("reset");
        $("#formTittle").text("Modify Coupon")
        $("#btnSendCoupon").text("Update Coupon")
        fields = ["coupon","value"];
        i = 1;
        fields.forEach(element => {
            $('#'+element).val(data[i])
            i++;
        });
    });

    $('#btnAddCoupon').on('click', function () {
        $("#alter-coupons").removeClass('hidden')
        $("#formTittle").text("Add Coupon")
        $('#addCouponForm').trigger("reset")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//

    $('#btnSendCoupon').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("coupon",$("#coupon").val())
        Fdata.append("value",$("#value").val())
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendCoupon').text() == "Update Coupon"){
            if(confirm("Are you sure you want to update coupon?")){
                Fdata.append("id",data[0])
        $.ajax({
            url: "../../updateCoupon/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                revokeUser(response,"u");
            },
            error: function (error) {
                console.log(error);
                $.each( error.responseJSON, function( key, value ) {
                    showAlert(value, "danger", 5000);
                });
            }
        });
    }
        }
        else{
        $.ajax({
            url: "../../registerCoupon/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                revokeUser(response,"addCouponForm");
            },
            error: function (error) {
                console.log(error);
                $.each( error.responseJSON, function( key, value ) {
                    showAlert(value, "danger", 5000);
                });
            }
        });
    }
    });

    $('#btnDeleteCoupon').click(function(event){
        event.preventDefault();
        var formData = {
            coupon: data[0],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete coupon?")){
        $.ajax({
            url: "../../deleteCoupon/",
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function(response){
                table.row('.selected').remove().draw(false);
                downButtons();
                revokeUser(response);
            },
            error: function (error) {
                console.log(error);
                $.each( error.responseJSON, function( key, value ) {
                    showAlert(value, "danger", 5000);
                });
            }
        });
    }
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

    function downButtons(){
        $("#btnModifyCoupon").addClass('active')
        $("#btnModifyCoupon").addClass('disabled')
        $("#btnDeleteCoupon").addClass('active')
        $("#btnDeleteCoupon").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifyCoupon").removeClass('active')
        $("#btnModifyCoupon").removeClass('disabled')
        $("#btnDeleteCoupon").removeClass('active')
        $("#btnDeleteCoupon").removeClass('disabled')
    }

    function revokeUser(response,formToClear = ""){
        if (response === 401){
            showAlert("The session has expired. Redirecting to login page...", "danger", 1500);
            setTimeout(() => {
                location.reload()
              }, 1500);
        }else{
            showAlert(response.message, "success", 1500);
            if(formToClear != ""){
                $('#'+formToClear).trigger("reset");
                setTimeout(() => {
                    location.reload()
                }, 1500);
            }
        }
    }
});