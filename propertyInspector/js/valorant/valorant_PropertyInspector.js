
async function valorantLoad(settings) {
    document.title = 'Valorant API';
    docReadyValorant();
}


async function docReadyValorant() {
    $.each(server_region_valorant, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region_valorant[index].code)
            .text(server_region_valorant[index].name));
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