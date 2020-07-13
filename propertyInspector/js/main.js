if ($SD) {
    $SD.on('connected', async function (jsonObj) {
        uuid = jsonObj['uuid'];
        if (jsonObj.hasOwnProperty('actionInfo')) actionName = jsonObj.actionInfo.action;
        else return;
        var settings = $SD.actionInfo.payload.settings;
        switch (actionName) {
            case "de.shiro.leauge.api.action":
                await leaugeLoad(settings);
                break;
            case "de.shiro.tft.api.action":
                await tftLoad(settings);
                break;
            case "de.shiro.lor.api.action":
                await lorLoad(settings);
                break;
            case "de.shiro.valorant.api.action":
                await valorantLoad(settings);
                break;
            default:
                break;
        }

    });
}