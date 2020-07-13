async function initiateLeaugeStatus(settings, updateTitleFn) {
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

async function getSummoner(settings, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{summonerName}", settings.summonerName);
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) {
        if (settings.modus === 1 && settings.getSummoner === 1) {
            return getLevelBorder(updateTitleFn, request.summonerLevel);
        }
    }
    return request;
}

async function getSummonerData(settings, Summoner, updateTitleFn) {
    var leaugeversion = settings.data.version;
    switch (settings.getSummoner) {
        case 2:
            var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/profileicon/1.png"
                .replace("{leaugeversion}", leaugeversion);
            if (Summoner.profileIconId != undefined) url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/profileicon/{id}.png"
                .replace("{leaugeversion}", leaugeversion)
                .replace("{id}", Summoner.profileIconId);
            updateTitleFn({
                "Icon": url,
                "State": {
                    'state': 0
                }
            });
            return;
        case 3:
            getTotalMasteryPoints(settings, Summoner, updateTitleFn);
            return;
        case 4:
            getChampionMasteryPoints(settings, Summoner, updateTitleFn);
            return;
        case 5:
            getTopChampionMasteryPoints(settings, Summoner, updateTitleFn);
            return;
        default:
            updateTitleFn(updateErrors.noDatafound);
            break;
    }
}

function getServiceStatus(settings, Summoner, updateTitleFn) {
    switch (settings.getServiceStatus) {
        case 1:
        default:
            updateTitleFn(updateErrors.noDatafound);
            break;
    }
}