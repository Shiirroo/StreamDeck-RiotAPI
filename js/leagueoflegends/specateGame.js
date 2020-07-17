

/** Request if the summoner is in a game
 * 
 * @param {String} apiKey The API key that was set
 * @param {String} serverCode The serverCode key that was set
 * @param {Number} id Summoner ID
 * @param {Function} updateTitleFn UpdateTitleFn function
 */

async function getSummonerInGame(apiKey, serverCode, id, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey, updateTitleFn, 1);
    if (request) return request;
    else return request;
}


/** Set all icons from streamdeck 
 * 
 * @param {Object} settings Settings data in an object
 * @param {Array} participants Participants data in an object
 * @param {Object} Ingame Ingame data in an object
 */
async function setSpectateIcons(settings, participants, Ingame) {
    var Team_1 = participants.filter(summoner => summoner.teamId === 100);
    var Team_2 = participants.filter(summoner => summoner.teamId === 200);
    var indexTeam_1 = 0, indexTeam_2 = 0;
    await $.each(coordinate, async function (coordinateIndex) {
        if (Team_1.length > 0 && coordinateIndex >= SpecateSummonerPlace[Team_1.length][0] &&
            coordinateIndex <= SpecateSummonerPlace[Team_1.length][SpecateSummonerPlace[Team_1.length].length - 1]) {

            Team_1[indexTeam_1]["row"] = coordinate[coordinateIndex].row;
            Team_1[indexTeam_1]["column"] = coordinate[coordinateIndex].column;
            await setSummonerIcontoAPI(settings.data.ChampionsList, settings.data.version, Team_1[indexTeam_1].summonerName, Team_1[indexTeam_1].championId, coordinate[coordinateIndex].context);
            indexTeam_1++;
        }

        else if (coordinateIndex === 5) $SD.api.setTitle(coordinate[coordinateIndex].context, "Ranked\nSolo");
        else if (coordinateIndex === 6) getTimerText(coordinate[coordinateIndex].context, Ingame);
        else if (coordinateIndex === 7) { $SD.api.setTitle(coordinate[7].context, "Back"); $SD.api.setState(coordinate[7].context, null); }
        else if (coordinateIndex === 8) $SD.api.setTitle(coordinate[coordinateIndex].context, "Banned\nChamp:");
        else if (coordinateIndex === 9) bannedChampion(coordinate[coordinateIndex].context, Ingame);
        else if (Team_2.length > 0 && coordinateIndex >= SpecateSummonerPlace[Team_2.length][0] + 10 &&
            coordinateIndex <= SpecateSummonerPlace[Team_2.length][SpecateSummonerPlace[Team_2.length].length - 1] + 10) {

            Team_2[indexTeam_2]["row"] = coordinate[coordinateIndex].row;
            Team_2[indexTeam_2]["column"] = coordinate[coordinateIndex].column;
            await setSummonerIcontoAPI(settings.data.ChampionsList, settings.data.version, Team_2[indexTeam_2].summonerName, Team_2[indexTeam_2].championId, coordinate[coordinateIndex].context);
            indexTeam_2++;
        }
        else {
            $SD.api.setImage(coordinate[coordinateIndex].context, "../icons/icons/leauge-api-icon.png"); $SD.api.setState(coordinate[coordinateIndex].context, 1); $SD.api.setTitle(coordinate[coordinateIndex].context, " ");
        }

    });
    participantslist = Team_1.concat(Team_2), underprofile = false, showicon = true;
}



/** Request if the a summoner profile needs to be loaded.
 * 
 * @param {Object} jsonObj 
 * @param {Array} participantslist 
 */
async function getUnderProfile(jsonObj, participantslist) {
    if (jsonObj.payload.coordinates.column === coordinate[7].column && jsonObj.payload.coordinates.row === coordinate[7].row)
        $SD.api.setState(jsonObj.context, null);
    else
        $SD.api.setState(jsonObj.context, 1);
    if (underprofile === false) {
        if (participantslist !== undefined) {
            var Summoner_participants = participantslist.filter(summoner => summoner.column === jsonObj.payload.coordinates.column && summoner.row === jsonObj.payload.coordinates.row)[0];
            if (Summoner_participants !== undefined) {
                if (intervals[coordinate[9].context]) { let interval = intervals[coordinate[9].context]; clearInterval(interval); }
                var Summoner = await getSummonerRanked(SpecateSettings.apiKey, SpecateSettings.serverCode, Summoner_participants.summonerId, rankedtyp.Solo);
                if (Summoner === undefined) return;
                underprofile = true;
                showicon = false;
                Summoner["winrate"] = Math.ceil(100 / (Summoner.losses + Summoner.wins) * Summoner.wins) + " %";
                var ranknumber = roman_to_Int(Summoner.rank);
                Summoner[coordinate[0].context] = { "url": "https://opgg-static.akamaized.net/images/medals/{tier}_{rank}.png".replace("{tier}", Summoner.tier.toLowerCase()).replace("{rank}", ranknumber) };
                Summoner[coordinate[1].context] = { "url": "../icons/ranked/victory.png" };
                Summoner[coordinate[3].context] = { "url": "../icons/ranked/defeat.png" };
                Summoner[coordinate[4].context] = { "url": "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png".replace("{championname}", await getChampNameForId(Summoner_participants.championId, SpecateSettings.data.ChampionsList)).replace("{leaugeversion}", SpecateSettings.data.version) };
                miniSeriesSet = 0;
                $.each(coordinate, function (coordinateIndex) {
                    if (Summoner[coordinate[coordinateIndex].context] === undefined)
                        Summoner[coordinate[coordinateIndex].context] = {
                            "url": "../icons/icons/leauge-api-icon.png"
                        };
                    setUnderProfile(coordinate[coordinateIndex].context, coordinateIndex, Summoner, Summoner[coordinate[coordinateIndex].context]["url"]);
                });
            };
        }

    } else if (participantslist !== undefined) {

        setSpectateIcons(SpecateSettings, participantslist);

    }
}

/** Show that profiles
 * 
 * @param {number} context  An opaque value identifying the instance's action.
 * @param {number} coordinateIndex The Index Value of coordinate that changed
 * @param {object} summoner Summoner data in an object
 * @param {URL} url URL for setting the icon
 */
function setUnderProfile(context, coordinateIndex, summoner, url) {
    if (coordinateIndex === 7) return;
    if (Object.keys(indexRanked).length >= coordinateIndex + 1) {
        toDataURL(url, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
        $SD.api.setState(context, indexRanked[coordinateIndex][1]);
        if (indexRanked[coordinateIndex][2] === true) $SD.api.setTitle(context, NumberToFormat(indexRanked[coordinateIndex][3]) + NumberToFormat(summoner[indexRanked[coordinateIndex][0]]));
        else $SD.api.setTitle(context, NumberToFormat(summoner[indexRanked[coordinateIndex][0]]) + NumberToFormat(indexRanked[coordinateIndex][3]));
    } else if (summoner.miniSeries !== undefined && promo[summoner.miniSeries.target][miniSeriesSet] === coordinateIndex) {
        var image = promoIcon[summoner.miniSeries.progress.split('')[miniSeriesSet]];
        toDataURL(image, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
        $SD.api.setTitle(context, " ");
        miniSeriesSet++;

    } else {
        $SD.api.setTitle(context, " ");
        $SD.api.setImage(context, url);
    }

}

/** Show the banned champion
 * 
 * @param {number} context  An opaque value identifying the instance's action.
 * @param {object} Ingame Ingame data in an object
 */
function bannedChampion(context, Ingame) {
    if (Ingame === undefined && bannedChampionlist.length <= 0) return;
    else if (bannedChampionlist.length > 0) {
        startBannedChampionTimer(context);
    } else {
        bannedChampionlist = Ingame.bannedChampions;
        if (bannedChampionlist.length === 0) return $SD.api.setImage(context, "../icons/icons/leauge-api-icon.png");
        startBannedChampionTimer(context);
    }
}

function startBannedChampionTimer(context) {
    var iconID = 0;
    changeBannedIcon(iconID, context);
    intervals[context] = setInterval(() => {
        iconID !== bannedChampionlist.length - 1 ? iconID++ : iconID = 0;
        changeBannedIcon(iconID, context);
    },
        moment.duration(2, 'second').asMilliseconds());
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
