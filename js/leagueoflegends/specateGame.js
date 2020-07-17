
async function getSummonerInGame(apiKey, serverCode, id, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey, updateTitleFn, 1);
    if (request) return request;
    else return request;
}


async function switchProfile(settings, Ingame, device) {
    await $SD.api.switchToProfile($SD.uuid, device, "RiotGamesUI");
    waitForElement();
    async function waitForElement() {
        if (Cordi.length === 15) {
            await setIcons(settings, Ingame.participants, Ingame);
        }
        else {
            setTimeout(waitForElement, 500);
        }
    }


}

async function setImage(settings, summonerName, championId, context) {
    $SD.api.setState(context, 1);
    $SD.api.setTitle(context, summonerName);
    var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png"
        .replace("{championname}", await getChampNameForId(championId, settings.data.ChampionsList))
        .replace("{leaugeversion}", settings.data.version);
    toDataURL(url,
        function (dataUrl) {
            $SD.api.setImage(context, dataUrl);
        }
    );
}
async function setIcons(settings, participants, Ingame) {
    var Team_1 = participants.filter(summoner => summoner.teamId === 100);
    var Team_2 = participants.filter(summoner => summoner.teamId === 200);
    await $.each(Cordi, async function (CordiIndex) {
        if (CordiIndex >= SpecateSummonerPlace[Team_1.length][0] && CordiIndex <= SpecateSummonerPlace[Team_1.length][SpecateSummonerPlace[Team_1.length].length - 1]) {
            Team_1[CordiIndex]["row"] = Cordi[CordiIndex].row;
            Team_1[CordiIndex]["column"] = Cordi[CordiIndex].column;
            await setImage(settings, Team_1[CordiIndex].summonerName, Team_1[CordiIndex].championId, Cordi[CordiIndex].context);
        }
        else if (CordiIndex === 5) $SD.api.setTitle(Cordi[CordiIndex].context, "Ranked\nSolo");
        else if (CordiIndex === 6) getTimerText(Cordi[CordiIndex].context, Ingame);
        else if (CordiIndex === 7) { $SD.api.setTitle(Cordi[7].context, "Back"); $SD.api.setState(Cordi[7].context, null); }
        else if (CordiIndex === 8) $SD.api.setTitle(Cordi[CordiIndex].context, "Banned\nChamp:");
        else if (CordiIndex === 9) bannedChampion(Cordi[CordiIndex].context, Ingame);
        else if (CordiIndex >= SpecateSummonerPlace[Team_2.length][0] + 10 && CordiIndex <= SpecateSummonerPlace[Team_2.length][SpecateSummonerPlace[Team_2.length].length - 1] + 10) {
            Team_2[CordiIndex - 10]["row"] = Cordi[CordiIndex].row;
            Team_2[CordiIndex - 10]["column"] = Cordi[CordiIndex].column;
            await setImage(settings, Team_2[CordiIndex - 10].summonerName, Team_2[CordiIndex - 10].championId, Cordi[CordiIndex].context);
        }
        else {
            $SD.api.setImage(Cordi[CordiIndex].context, "../icons/icons/leauge-api-icon.png"); $SD.api.setState(Cordi[CordiIndex].context, 1); $SD.api.setTitle(Cordi[CordiIndex].context, " ");
        }

    });
    participantslist = Team_1.concat(Team_2);
    underprofile = false;
    showicon = true;
}

async function getunderprofile(jsonObj, participantslist) {
    if (jsonObj.payload.coordinates.column === Cordi[7].column && jsonObj.payload.coordinates.row === Cordi[7].row)
        $SD.api.setState(jsonObj.context, null);
    else
        $SD.api.setState(jsonObj.context, 1);
    if (underprofile === false) {
        if (participantslist !== undefined) {
            var Summoner_participants = participantslist.filter(summoner => summoner.column === jsonObj.payload.coordinates.column && summoner.row === jsonObj.payload.coordinates.row)[0];
            if (Summoner_participants !== undefined) {
                if (intervals[Cordi[9].context]) { let interval = intervals[Cordi[9].context]; clearInterval(interval); }
                var Summoner = await getSummonerRanked(SpecateSettings.apiKey, SpecateSettings.serverCode, Summoner_participants.summonerId, rankedtyp.Solo);
                if (Summoner === undefined) return;
                underprofile = true;
                showicon = false;
                Summoner["winrate"] = Math.ceil(100 / (Summoner.losses + Summoner.wins) * Summoner.wins) + " %";
                var ranknumber = roman_to_Int(Summoner.rank);
                Summoner[Cordi[0].context] = { "url": "https://opgg-static.akamaized.net/images/medals/{tier}_{rank}.png".replace("{tier}", Summoner.tier.toLowerCase()).replace("{rank}", ranknumber) };
                Summoner[Cordi[1].context] = { "url": "../icons/ranked/victory.png" };
                Summoner[Cordi[3].context] = { "url": "../icons/ranked/defeat.png" };
                Summoner[Cordi[4].context] = { "url": "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png".replace("{championname}", await getChampNameForId(Summoner_participants.championId, SpecateSettings.data.ChampionsList)).replace("{leaugeversion}", SpecateSettings.data.version) };
                miniSeriesSet = 0;
                $.each(Cordi, function (CordiIndex) {
                    if (Summoner[Cordi[CordiIndex].context] === undefined)
                        Summoner[Cordi[CordiIndex].context] = {
                            "url": "../icons/icons/leauge-api-icon.png"
                        };
                    insertTitle(Cordi[CordiIndex].context, CordiIndex, Summoner, Summoner[Cordi[CordiIndex].context]["url"]);
                });
            };
        }

    } else if (participantslist !== undefined) {

        setIcons(SpecateSettings, participantslist);

    }
}
var miniSeriesSet;
function insertTitle(context, CordiIndex, Summoner, url) {
    if (CordiIndex === 7) return;
    if (Object.keys(indexRanked).length >= CordiIndex + 1) {
        toDataURL(url, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
        $SD.api.setState(context, indexRanked[CordiIndex][1]);
        if (indexRanked[CordiIndex][2] === true) $SD.api.setTitle(context, NumberToFormat(indexRanked[CordiIndex][3]) + NumberToFormat(Summoner[indexRanked[CordiIndex][0]]));
        else $SD.api.setTitle(context, NumberToFormat(Summoner[indexRanked[CordiIndex][0]]) + NumberToFormat(indexRanked[CordiIndex][3]));
    } else if (Summoner.miniSeries !== undefined && promo[Summoner.miniSeries.target][miniSeriesSet] === CordiIndex) {
        var image = promoIcon[Summoner.miniSeries.progress.split('')[miniSeriesSet]];
        toDataURL(image, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
        $SD.api.setTitle(context, " ");
        miniSeriesSet++;

    } else {
        $SD.api.setTitle(context, " ");
        $SD.api.setImage(context, url);
    }

}
async function getSummonerRanked(apiKey, serverCode, id, rankedtype) {
    var responseData;
    let url = "https://{serverCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey);
    if (request) return request.filter(summoner => summoner.queueType === rankedtype)[0];
    else return responseData;
}
function bannedChampion(context, Ingame) {
    var iconID = 0;
    if (Ingame === undefined && bannedChampionlist.length <= 0) return;
    else if (bannedChampionlist.length > 0) {
        changeBannedIcon(iconID, context);
        intervals[context] = setInterval(() => {
            iconID !== bannedChampionlist.length - 1 ? iconID++ : iconID = 0;
            changeBannedIcon(iconID, context);
        },
            moment.duration(2, 'second').asMilliseconds());

    } else {
        bannedChampionlist = Ingame.bannedChampions;
        if (bannedChampionlist.length === 0) return $SD.api.setImage(context, "../icons/icons/leauge-api-icon.png");
        changeBannedIcon(iconID, context);
        intervals[context] = setInterval(() => {
            iconID !== bannedChampionlist.length - 1 ? iconID++ : iconID = 0;
            changeBannedIcon(iconID, context);
        },
            moment.duration(2, 'second').asMilliseconds());
    }
}




async function changeBannedIcon(iconID, context) {
    while (bannedChampionlist[iconID].championId === -1)
        iconID !== bannedChampionlist.length - 1 ? iconID++ : iconID = 0;
    var name = await getChampNameForId(bannedChampionlist[iconID].championId, SpecateSettings.data.ChampionsList);
    var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png"
        .replace("{championname}", name)
        .replace("{leaugeversion}", SpecateSettings.data.version);
    toDataURL(url, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
    $SD.api.setTitle(context, name);
}

var startTimer;
function getTimerText(context, Ingame) {
    if (Ingame !== undefined)
        if (Ingame.gameStartTime === 0) startTimer = new Date().getTime();
        else startTimer = Ingame.gameStartTime;

    changeTimerText(startTimer, context);
    intervals[context] = setInterval(() => {
        changeTimerText(startTimer, context);
    },
        moment.duration(1, 'second').asMilliseconds());
}






async function changeTimerText(startTimer, context) {
    var Time = new Date().getTime() - startTimer;
    var seconds = Math.floor((Time / 1000) % 60);
    var minutes = Math.floor((Time / (1000 * 60)));
    if (showicon === true) $SD.api.setTitle(context, "Time:\n" + pad(minutes) + ":" + pad(seconds));
}
