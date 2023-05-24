$(document).ready(function(){
    downButtons();
    var data = [];
    var row = "";
    var table = $('#dtProducts').DataTable({
        columnDefs: [
            {
                target: 0,
                visible: false
            }
        ]
    });

    $('#dtProducts tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            downButtons()
            $("#alter-products").addClass('hidden');
            row = "";
            data = [];
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            upButtons()
            row = this;
            data = table.row( this ).data();
        }
    });

    $('#btnModifyProduct').on('click', function () {
        $('#category').find('option').removeAttr("selected")
        $("#alter-products").removeClass('hidden')
        $('#addProductForm').trigger("reset");
        $("#formTittle").text("Modify Product")
        $("#btnSendProduct").text("Update Product")
        $("#imageFeedback").text("Current Image: " + data[8])
        fields = ["name","brand","price","color","size","inStock","category","image"];
        i = 1;
        fields.forEach(element => {
            if (element == "category"){
                if(data[i] == "Smart Phones"){
                    document.getElementById("Smart Phones").setAttribute("selected","selected")
                    data.push(document.getElementById("Smart Phones").value)
                }else{
                    $('#'+data[i]).attr("selected","selected")
                    data.push($("#"+data[i]).val())
                }
            }else{
                $('#'+element).val(data[i])
            }
            i++;
        });
    });

    $('#btnAddProduct').on('click', function () {
        $("#alter-products").removeClass('hidden')
        $("#formTittle").text("Add Product")
        $('#addProductForm').trigger("reset");
        $("#imageFeedback").text("")
    });

    //-----------------------------------AJAX PARA ENVIO DE DATOS-----------------------------//

    $('#btnSendProduct').click(function(event){
        event.preventDefault();
        var Fdata = new FormData();
        Fdata.append("name",$("#name").val())
        Fdata.append("brand",$("#brand").val())
        Fdata.append("price",$("#price").val())
        Fdata.append("color",$("#color").val())
        Fdata.append("size",$("#size").val())
        Fdata.append("inStock",$("#inStock").val())
        Fdata.append("category",$("#category").val())
        Fdata.append("image",$("input[id^='image']")[0].files[0])
        Fdata.append("csrfmiddlewaretoken",$("input[name=csrfmiddlewaretoken]").val())
        if($('#btnSendProduct').text() == "Update Product"){
            if(confirm("Are you sure you want to update product?")){
                Fdata.append("id",data[0])
                Fdata.append("oldImage",data[8])
        $.ajax({
            url: "../../updateProduct/",
            type: 'post',
            data: Fdata,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (response) {
                if(response != 401){
                    var formData1 = {
                        product: data[0],
                        category: data[9],
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                    };
                    table.row(row).data([data[0],$("#name").val(),$("#brand").val(),$("#price").val(),$("#color").val(),$("#size").val(),$("#inStock").val(),response.nCategory,response.image]);
                    downButtons();
                    $.ajax({
                        url: "../../deleteProductCategory/",
                        type: 'post',
                        data: formData1,
                        dataType: 'json',
                        success: function (response2) {
                            revokeUser(response2);
                        },
                        error: function (error) {
                            console.log(error);
                            $.each( error.responseJSON, function( key, value ) {
                                showAlert(value, "danger", 5000);
                            });
                        }
                    });
                    var formData2 = {
                        product: data[0],
                        category: $("#category").val(),
                        csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                        };
                    $.ajax({
                        url: "../../registerProductCategory/",
                        type: 'post',
                        data: formData2,
                        dataType: 'json',
                        success: function (response3) {
                            downButtons()
                            revokeUser(response3,"u");
                        },
                        error: function (error) {
                            console.log(error);
                            $.each( error.responseJSON, function( key, value ) {
                                showAlert(value, "danger", 5000);
                            });
                        }
                    });
                    }else{
                        revokeUser(response);
                    }
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
            url: "../../registerProduct/",
            type: 'post',
            data: Fdata,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (response) {
                if(response != 401){
                var formData1 = {
                    product: response.product,
                    category: $("#category").val(),
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                };
                table.row.add([response.product,$("#name").val(),$("#brand").val(),$("#price").val(),$("#color").val(),$("#size").val(),$("#inStock").val(),response.nCategory,response.image]).draw(false);
                $.ajax({
                    url: "../../registerProductCategory/",
                    type: 'post',
                    data: formData1,
                    dataType: 'json',
                    success: function (response2) {
                        revokeUser(response2,"addProductForm");
                    },
                    error: function (error) {
                        console.log(error);
                        $.each( error.responseJSON, function( key, value ) {
                            showAlert(value, "danger", 5000);
                        });
                    }
                });
                }else{
                    revokeUser(response);
                }

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

    $('#btnDeleteProduct').click(function(event){
        event.preventDefault();
        var formData = {
            product: data[0],
            image: data[8],
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
        };
        if(confirm("Are you sure you want to delete product?")){
        $.ajax({
            url: "../../deleteProduct/",
            type: 'post',
            data: formData,
            dataType: 'json',
            success: function (response) {
                if(response != 401){
                var formData1 = {
                    product: data[0],
                    category: response.category,
                    csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val()
                };
                $.ajax({
                    url: "../../deleteProductCategory/",
                    type: 'post',
                    data: formData1,
                    dataType: 'json',
                    success: function (response2) {
                        table.row('.selected').remove().draw(false);
                        downButtons()
                        revokeUser(response2);
                    },
                    error: function (error) {
                        console.log(error);
                        $.each( error.responseJSON, function( key, value ) {
                            showAlert(value, "danger", 5000);
                        });
                    }
                });
                }else{
                    revokeUser(response);
                }
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
        $("#btnModifyProduct").addClass('active')
        $("#btnModifyProduct").addClass('disabled')
        $("#btnDeleteProduct").addClass('active')
        $("#btnDeleteProduct").addClass('disabled')
    }

    function upButtons(){
        $("#btnModifyProduct").removeClass('active')
        $("#btnModifyProduct").removeClass('disabled')
        $("#btnDeleteProduct").removeClass('active')
        $("#btnDeleteProduct").removeClass('disabled')
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
                $('#alter-products').addClass('hidden');
            }
        }
    }
});