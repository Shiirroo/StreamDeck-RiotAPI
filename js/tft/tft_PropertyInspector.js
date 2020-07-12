
async function tftLoad(settings) {
    document.title = 'Teamfight Tactics API';
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


async function docReadyTft() {
    await $.each(server_region, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region[index].code)
            .text(server_region[index].name));
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


