
async function getTotalMasteryPoints(settings, Summoner, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/{SummonerId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id);
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": '../icons/mastery/mastery_icon_7.png',
        "Text": NumberToFormat(request),
        "State": 1
    });

}


async function getTop5champion(apiKey, serverCode, id, updateTitleFn, selectOption) {
    var responseData;
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey, updateTitleFn);
    if (request) return request[selectOption];
    else return responseData;
}


async function getTopChampionMasteryPoints(settings, Summoner, updateTitleFn) {
    var Top5champion = await getTop5champion(settings.apiKey, settings.serverCode, Summoner.id, updateTitleFn, settings.data.selectOption);
    if (Top5champion === undefined) return;
    var championName = await getChampNameForId(Top5champion.championId, settings.data.ChampionsList);
    if (championName === undefined)
        return updateTitleFn(updateErrors.noDatafound);
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}/by-champion/{championId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id)
        .replace("{championId}", parseInt(Top5champion.championId));
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png".replace("{championname}", championName).replace("{leaugeversion}", settings.data.version),
        "Text": NumberToFormat(request.championPoints),
        "State": 1
    });
}


async function getChampionMasteryPoints(settings, Summoner, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}/by-champion/{championId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id)
        .replace("{championId}", parseInt(settings.data.selectOption.split("-")[0]));
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png".replace("{championname}", settings.data.selectOption.split("-")[1]).replace("{leaugeversion}", settings.data.version),
        "Text": NumberToFormat(request.championPoints),
        "State": 1
    });

}


function getLevelBorder(updateTitleFn, summonerLevel) {
    var path = "", summonerLevel = parseInt(summonerLevel), minLevel = 50, maxLevel = 74, path;
    while (!path) {
        if (summonerLevel < 30) path = '../icons/level_icons/1-29.png';
        else if (summonerLevel < 50) path = '../icons/level_icons/30-49.png';
        else if (summonerLevel >= minLevel && summonerLevel <= maxLevel) path = '../icons/level_icons/' + minLevel + '-' + maxLevel + '.png';
        else if (summonerLevel > 499) path = '../icons/level_icons/500.png';
        else {
            minLevel = minLevel + 25;
            maxLevel = maxLevel + 25;
        }
    }
    updateTitleFn({
        "Icon": path,
        "Text": summonerLevel,
        "State": null
    });
}
