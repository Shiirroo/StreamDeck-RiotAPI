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

async function getTotalMasteryPoints(settings, Summoner, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/scores/by-summoner/{SummonerId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id);
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": '../icons/mastery/mastery_icon_7.png',
        "Text": NumberToFormat(request),
        "State": {
            'state': 1
        }
    });

}


async function getTop5champion(apiKey, serverCode, id, updateTitleFn) {
    var responseData;
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey, updateTitleFn);
    if (request) return request.slice(0, 5);
    else return responseData;
}

async function getNameForTopChamp(response, ChampionsList) {
    await response.forEach(element => {
        for (var key in Object.keys(ChampionsList)) {
            var keyName = Object.keys(ChampionsList)[key];
            if (parseInt(ChampionsList[keyName].key) === parseInt(element.championId)) {
                return element.championName = ChampionsList[keyName].id;
            }
        }
    });
    return response;
}

async function getTopChampionMasteryPoints(settings, Summoner, updateTitleFn) {
    var Top5champion = await getTop5champion(settings.apiKey, settings.serverCode, Summoner.id, updateTitleFn);
    var Data = await getNameForTopChamp(Top5champion, settings.data.ChampionsList);
    if (Data === undefined || Top5champion === undefined)
        return updateTitleFn(updateErrors.noDatafound);
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}/by-champion/{championId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id)
        .replace("{championId}", parseInt(Top5champion[settings.topChampionMastery].championId));
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": "http://ddragon.leagueoflegends.com/cdn/10.14.1/img/champion/{championname}.png".replace("{championname}", Data[settings.topChampionMastery].championName),
        "Text": NumberToFormat(request.championPoints),
        "State": {
            'state': 1
        }
    });
}


async function getChampionMasteryPoints(settings, Summoner, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}/by-champion/{championId}"
        .replace("{serverCode}", settings.serverCode)
        .replace("{SummonerId}", Summoner.id)
        .replace("{championId}", parseInt(settings.champion));
    var request = await doRequest(url, settings.apiKey, updateTitleFn);
    if (request) updateTitleFn({
        "Icon": "http://ddragon.leagueoflegends.com/cdn/10.14.1/img/champion/{championname}.png".replace("{championname}", settings.data.championname),
        "Text": NumberToFormat(request.championPoints),
        "State": {
            'state': 1
        }
    });

}


function getLevelBorder(updateTitleFn, summonerLevel) {
    var path = "";
    var summonerLevel = parseInt(summonerLevel);
    var minLevel = 50;
    var maxLevel = 74;
    var path;
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
        "State": {
            'state': 0
        }
    });
}
