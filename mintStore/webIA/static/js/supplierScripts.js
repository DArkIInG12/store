$(document).ready(function(){
    downButtons();
    var data = [];
    var row = "";
    var table = $('#dtSuppliers').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtSuppliers tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons();
            $("#alter-suppliers").addClass('hidden')
            row = "";
            data = [];
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            upButtons();
            row = this;
            data = table.row( this ).data();
        }
    });

    $('#btnModifySupplier').on('click', function () {
        $("#alter-suppliers").removeClass('hidden')
        $('#addSupplierForm').trigger("reset");
        $("#formTittle").text("Modify Supplier")
        $("#btnSendSupplier").text("Update Supplier")
        fields = ["name","phone","email","address"];
        i = 1;
        fields.forEach(element => {
            $('#'+element).val(data[i])
            i++;
        });
    });

    $('#btnAddSupplier').on('click', function () {
        $("#alter-suppliers").removeClass('hidden')
        $("#formTittle").text("Add Supplier")
        $('#addSupplierForm').trigger("reset")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//
    $('#btnSendSupplier').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("name",$("#name").val())
        Fdata.append("phone",$("#phone").val())
        Fdata.append("email",$("#email").val())
        Fdata.append("address",$("#address").val())
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendSupplier').text() == "Update Supplier"){
            if(confirm("Are you sure you want to update supplier?")){
                Fdata.append("id",data[0])
        $.ajax({
            url: "../../updateSupplier/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                table.row(row).data([data[0],$("#name").val(),$("#phone").val(),$("#email").val(),$("#address").val()]);
                downButtons();
                revokeUser(response,"addSupplierForm");
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
            url: "../../registerSupplier/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                table.row.add([response.supplier,$("#name").val(),$("#phone").val(),$("#email").val(),$("#address").val()]).draw(false);
                revokeUser(response,"addSupplierForm");
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

    $('#btnDeleteSupplier').click(function(event){
        event.preventDefault();
        var formData = {
            supplier: data[0],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete supplier?")){
        $.ajax({
            url: "../../deleteSupplier/",
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
        $("#btnModifySupplier").addClass('active')
        $("#btnModifySupplier").addClass('disabled')
        $("#btnDeleteSupplier").addClass('active')
        $("#btnDeleteSupplier").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifySupplier").removeClass('active')
        $("#btnModifySupplier").removeClass('disabled')
        $("#btnDeleteSupplier").removeClass('active')
        $("#btnDeleteSupplier").removeClass('disabled')
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
                $('#alter-suppliers').addClass('hidden');
            }
        }
    }
});