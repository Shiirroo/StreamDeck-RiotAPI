
async function lorLoad(settings) {
    document.title = 'Legends of Runeterra API';
    docReadyLor();
}


async function docReadyLor() {
    $.each(server_region_lor, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region_lor[index].name)
            .text(server_region_lor[index].name));
    });

    $("#modus").append($("<option/>").val("1").text("Not added yet"));

    $("#apiKey").on("blur", function () {
        if (!$("#apiKey").val()) {
            $("#apiKeyValidationMessage").show();
        } else {
            $("#apiKeyValidationMessage").hide();
        }
    });

}



