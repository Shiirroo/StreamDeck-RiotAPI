function initiateRiotStatus(context, settings, device) {
    if (intervals[context]) {
        let interval = intervals[context];
        clearInterval(interval);
    }
    $SD.api.setState(context, {
        "State": {
            'state': 0
        }
    });
    $SD.api.setTitle(context, "Updating...");
    // Initial call for the first time, then schedule for every settings.automaticRefresh time set.
    setTitleToUpdatingStatus(context, settings, device);
    if (settings.automaticRefresh !== 0) {
        intervals[context] = setInterval(() => {
            let clonedSettings = {};
            // Just making sure we are not hurt by closure.
            Object.assign(clonedSettings, settings);
            setTitleToUpdatingStatus(context, clonedSettings, device);
        },
            moment.duration(settings.automaticRefresh, 'minutes').asMilliseconds());
    }
}

function setTitleToUpdatingStatus(context, settings, device) {
    doSartQuerys(settings, result => getResult(result, context, device));
}

async function doSartQuerys(settings, updateTitleFn) {
    var Summoner = await getSummoner(settings, updateTitleFn);
    switch (settings.modus) {
        case 1:
            if (settings.getSummoner != 1) return getSummonerData(settings, Summoner, updateTitleFn);
            return;
        case 2:
            return getServiceStatus(settings, Summoner, updateTitleFn);
        default:
            updateTitleFn(updateErrors.noDatafound);
            break;
    }

}

function getResult(result, context) {
    if (result.hasOwnProperty("State")) {
        $SD.api.setState(context, result.State);
    }
    if (result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, result.Text);
    }
    if (!result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, "");
    }
    if (result.hasOwnProperty("Icon")) {
        toDataURL(result.Icon,
            function (dataUrl) {
                $SD.api.setImage(context, dataUrl);
            }
        );
    }
    if (!result.hasOwnProperty("Icon") && !result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, result);
    }

}
