$(document).ready(function(){
    downButtons();
    var data = []
    var table = $('#dtPayments').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtPayments tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons()
            $("#alter-payments").addClass('hidden')
            data = []
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            upButtons()
            data = table.row( this ).data();
        }
    });

    $('#btnModifyPayment').on('click', function () {
        $("#alter-payments").removeClass('hidden')
        $('#addPaymentForm').trigger("reset");
        $("#formTittle").text("Modify Payment")
        $("#btnSendPayment").text("Update Payment")
        fields = ["method"];
        i = 1;
        fields.forEach(element => {
            $('#'+element).val(data[i])
            i++;
        });
    });

    $('#btnAddPayment').on('click', function () {
        $("#alter-payments").removeClass('hidden')
        $("#formTittle").text("Add Payment")
        $('#addPaymentForm').trigger("reset")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//

    $('#btnSendPayment').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("method",$("#method").val())
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendPayment').text() == "Update Payment"){
            if(confirm("Are you sure you want to update payment?")){
                Fdata.append("id",data[0])
        $.ajax({
            url: "../../updatePayment/",
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
            url: "../../registerPayment/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                revokeUser(response,"addPaymentForm");
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

    $('#btnDeletePayment').click(function(event){
        event.preventDefault();
        var formData = {
            payment: data[0],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete payment?")){
        $.ajax({
            url: "../../deletePayment/",
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
        $("#btnModifyPayment").addClass('active')
        $("#btnModifyPayment").addClass('disabled')
        $("#btnDeletePayment").addClass('active')
        $("#btnDeletePayment").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifyPayment").removeClass('active')
        $("#btnModifyPayment").removeClass('disabled')
        $("#btnDeletePayment").removeClass('active')
        $("#btnDeletePayment").removeClass('disabled')
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