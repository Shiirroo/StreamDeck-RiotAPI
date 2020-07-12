
async function valorantLoad(settings) {
    document.title = 'Valorant API';
    if (settings.apiKey) {
        await $("#apiKey").val(settings.apiKey);
    }
    if (settings.summonerName) {
        await $("#summonerName").val(settings.summonerName);
    }

    if (settings.automaticRefresh) {
        await $("#automaticRefresh option[value=" + settings.automaticRefresh + "]")
            .prop("selected", "selected").change();
    }

    if (settings.serverCode) {
        await $('#serverCode option[value=' + settings.serverCode + ']')
            .prop('selected', 'selected').change();
    }

}


async function docReadyValorant() {
    $.each(server_region_valorant, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region_valorant[index].code)
            .text(server_region_valorant[index].name));
    });

    $("#apiKey").on("blur", function () {
        if (!$("#apiKey").val()) {
            $("#apiKeyValidationMessage").show();
        } else {
            $("#apiKeyValidationMessage").hide();
        }
    });

}
async function tftButtonClick() {
    // Sending the saved settings to the plugin from property inspector.
    let apiKey = $("#apiKey").val();
    let serverCode = $("#serverCode option:selected").val();
    let summonerName = $("#summonerName").val();
    let automaticRefresh = parseInt($("#automaticRefresh option:selected").val());
    if (!$("#apiKey").val()) {
        return;
    }

    if ($SD && $SD.connection) {
        let payload = {};
        payload.automaticRefresh = automaticRefresh;
        payload.apiKey = apiKey;
        payload.summonerName = summonerName;
        payload.serverCode = serverCode;
        $SD.api.sendToPlugin(uuid, actionName, payload);
    }

}
