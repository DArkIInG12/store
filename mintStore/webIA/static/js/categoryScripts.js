$(document).ready(function(){
    downButtons();
    var data = []
    var table = $('#dtCategories').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtCategories tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons()
            $("#alter-categories").addClass('hidden')
            data = []
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            upButtons()
            data = table.row( this ).data();
        }
    });

    $('#btnModifyCategory').on('click', function () {
        $("#alter-categories").removeClass('hidden')
        $('#addCategoryForm').trigger("reset");
        $("#formTittle").text("Modify Category")
        $("#btnSendCategory").text("Update Category")
        $("#imageFeedback").text("Current Image: " + data[3])
        fields = ["category","description","image"];
        i = 1;
        fields.forEach(element => {
            $('#'+element).val(data[i])
            i++;
        });
    });

    $('#btnAddCategory').on('click', function () {
        $("#alter-categories").removeClass('hidden')
        $("#formTittle").text("Add Category")
        $('#addCategoryForm').trigger("reset");
        $("#imageFeedback").text("")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//

    $('#btnSendCategory').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("category",$("#category").val())
        Fdata.append("description",$("#description").val())
        Fdata.append("email",$("#email").val())
        Fdata.append("image",$("input[id^='image']")[0].files[0])
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendCategory').text() == "Update Category"){
            if(confirm("Are you sure you want to update category?")){
                Fdata.append("id",data[0])
                Fdata.append("oldImage",data[3])
        $.ajax({
            url: "../../updateCategory/",
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
            url: "../../registerCategory/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                revokeUser(response,"addCategoryForm");
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

    $('#btnDeleteCategory').click(function(event){
        event.preventDefault();
        var formData = {
            category: data[0],
            image: data[3],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete category?")){
        $.ajax({
            url: "../../deleteCategory/",
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (response) {
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
        $("#btnModifyCategory").addClass('active')
        $("#btnModifyCategory").addClass('disabled')
        $("#btnDeleteCategory").addClass('active')
        $("#btnDeleteCategory").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifyCategory").removeClass('active')
        $("#btnModifyCategory").removeClass('disabled')
        $("#btnDeleteCategory").removeClass('active')
        $("#btnDeleteCategory").removeClass('disabled')
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