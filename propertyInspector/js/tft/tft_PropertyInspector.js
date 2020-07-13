
async function tftLoad(settings) {
    document.title = 'Teamfight Tactics API';
    await docReadyTft();
}


async function docReadyTft() {
    await $.each(server_region, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region[index].code)
            .text(server_region[index].name));
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