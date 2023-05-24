$(document).ready(function(){
    downButtons();
    var data = [];
    var row = "";
    var table = $('#dtUsers').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtUsers tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons()
            $("#alter-users").addClass('hidden');
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

    $('#btnModifyUser').on('click', function () {
        $('#role').find('option').removeAttr("selected")
        $('#status').find('option').removeAttr("selected")
        $("#alter-users").removeClass('hidden')
        $('#addUserForm').trigger("reset");
        $("#formTittle").text("Modify User")
        $("#btnSendUser").text("Update User")
        fields = ["name","lastName","email","phone","birthDate","role","status"];
        i = 1;
        fields.forEach(element => {
            if (element == "role"){
                $('#'+data[i]).attr("selected","selected")
            }
            else if(element == "status"){
                $('#'+data[i]).attr("selected","selected")
            }else{
                $('#'+element).val(data[i])
            }
            i++;
        });
    });

    $('#btnAddUser').on('click', function () {
        $("#alter-users").removeClass('hidden')
        $("#formTittle").text("Add User")
        $('#addUserForm').trigger("reset")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//
    $('#btnSendUser').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("name",$("#name").val())
        Fdata.append("lastName",$("#lastName").val())
        Fdata.append("email",$("#email").val())
        Fdata.append("phone",$("#phone").val())
        Fdata.append("birthDate",$("#birthDate").val())
        Fdata.append("password",$("#password").val())
        Fdata.append("role",$("#role").val())
        Fdata.append("status",$("#status").val())
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendUser').text() == "Update User"){
            if(confirm("Are you sure you want to update user?")){
                Fdata.append("id",data[0])
        $.ajax({
            url: "../../updateUser/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                table.row(row).data([data[0],$("#name").val(),$("#lastName").val(),$("#email").val(),$("#phone").val(),$("#birthDate").val(),response.nRole,response.nStatus]);
                downButtons();
                revokeUser(response,"addUserForm");
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
            url: "../../registerUser/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                table.row.add([response.user,$("#name").val(),$("#lastName").val(),$("#email").val(),$("#phone").val(),$("#birthDate").val(),response.nRole,response.nStatus]).draw(false);
                revokeUser(response,"addUserForm");
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

    $('#btnDeleteUser').click(function(event){
        event.preventDefault();
        var formData = {
            user: data[0],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete user?")){
        $.ajax({
            url: "../../deleteUser/",
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (response) {
                table.row('.selected').remove().draw(false);
                downButtons()
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
        $("#btnModifyUser").addClass('active')
        $("#btnModifyUser").addClass('disabled')
        $("#btnDeleteUser").addClass('active')
        $("#btnDeleteUser").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifyUser").removeClass('active')
        $("#btnModifyUser").removeClass('disabled')
        $("#btnDeleteUser").removeClass('active')
        $("#btnDeleteUser").removeClass('disabled')
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
                $('#alter-users').addClass('hidden');
            }
        }
    }
});