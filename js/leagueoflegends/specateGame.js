
async function getSummonerInGame(apiKey, serverCode, id, updateTitleFn) {
    let url = "https://{serverCode}.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey, updateTitleFn, 1);
    if (request) return request;
    else return request;
}


async function switchProfile(settings, Summoner, Ingame, device, keyUp) {
    await $SD.api.switchToProfile($SD.uuid, device, "RiotGamesUI");
    waitForElement();
    async function waitForElement() {
        if (Cordi.length === 15) {
            await setIcons(settings, Ingame.participants);
        }
        else {
            setTimeout(waitForElement, 500);
        }
    }


}

async function setImage(settings, participants, RowAdding, index, Teamlength, eaches) {
    $SD.api.setTitle(Cordi[SpecateSummonerPlace[Teamlength][eaches] + RowAdding].context, participants[index].summonerName);
    var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png"
        .replace("{championname}", await getChampNameForId(participants[index].championId, settings.data.ChampionsList))
        .replace("{leaugeversion}", settings.data.version);
    toDataURL(url,
        function (dataUrl) {
            $SD.api.setImage(Cordi[SpecateSummonerPlace[Teamlength][eaches] + RowAdding].context, dataUrl);
        }
    );
}

async function setIcons(settings, participants) {
    Team_1 = participants.filter(summoner => summoner.teamId === 100);
    Team_2 = participants.filter(summoner => summoner.teamId === 200);
    var eaches = Team_1.length;
    var Teamlength = Team_1.length, RowAdding = 0;
    await $.each(Cordi, async function (CordiIndex) {
        if (CordiIndex !== 7) {
            await $SD.api.setImage(Cordi[CordiIndex].context, "./icons/icons/leauge-api-icon");
            await $SD.api.setState(Cordi[CordiIndex].context, 1);
            await $SD.api.setTitle(Cordi[CordiIndex].context, " ");
        }
    });
    await $SD.api.setTitle(Cordi[7].context, "Back");
    await $SD.api.setState(Cordi[7].context, null);
    await $.each(participants, async function (index) {
        if (eaches === 0) { RowAdding = RowAdding + 10; Teamlength = Team_2.length; eaches = Team_2.length; }
        eaches--;
        $SD.api.setState(Cordi[SpecateSummonerPlace[Teamlength][eaches] + RowAdding].context, 1);
        participants[index]["row"] = Cordi[SpecateSummonerPlace[Teamlength][eaches] + RowAdding].row;
        participants[index]["column"] = Cordi[SpecateSummonerPlace[Teamlength][eaches] + RowAdding].column;
        await setImage(settings, participants, RowAdding, index, Teamlength, eaches);

    });
    participantslist = participants;
    underprofile = false;
}

function getunderprofile(jsonObj, SpecateSettings, participantslist) {
    if (underprofile === false) {
        $.each(participantslist, async function (index) {
            console.log(participantslist[index]["column"] + " " + participantslist[index]["row"]);
            if (participantslist[index]["column"] === jsonObj.payload.coordinates.column && participantslist[index]["row"] === jsonObj.payload.coordinates.row) {
                underprofile = true;
                var Summoner = await getSummonerRanked(SpecateSettings.apiKey, SpecateSettings.serverCode, participantslist[index].summonerId, rankedtyp.Solo);
                var test = roman_to_Int(Summoner.rank);
                console.log(test);
                toDataURL("https://opgg-static.akamaized.net/images/medals/{tier}_{rank}.png".replace("{tier}", Summoner.tier.toLowerCase()).replace("{rank}", test),
                    function (dataUrl) {
                        $SD.api.setImage(Cordi[0].context, dataUrl);
                    }
                );
                $SD.api.setTitle(Cordi[0].context, NumberToFormat(Summoner.leaguePoints) + " LP");
                $SD.api.setState(Cordi[0].context, 1);
                $SD.api.setTitle(Cordi[1].context, "Wins:\n" + NumberToFormat(Summoner.wins));
                $SD.api.setImage(Cordi[1].context, "./icons/icons/leauge-api-icon");
                $SD.api.setState(Cordi[1].context, null);
                $SD.api.setTitle(Cordi[2].context, "Losses: \n" + NumberToFormat(Summoner.losses));
                $SD.api.setImage(Cordi[2].context, "./icons/icons/leauge-api-icon");
                $SD.api.setState(Cordi[2].context, null);
                $SD.api.setTitle(Cordi[3].context, "Winrate: \n" + Math.ceil(100 / (Summoner.losses + Summoner.wins) * Summoner.wins) + " %");
                $SD.api.setImage(Cordi[3].context, "./icons/icons/leauge-api-icon");
                $SD.api.setState(Cordi[3].context, null);
                $SD.api.setTitle(Cordi[4].context, Summoner.summonerName);
                var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png"
                    .replace("{championname}", await getChampNameForId(participantslist[index].championId, SpecateSettings.data.ChampionsList))
                    .replace("{leaugeversion}", SpecateSettings.data.version);
                toDataURL(url,
                    function (dataUrl) {
                        $SD.api.setImage(Cordi[4].context, dataUrl);
                    }
                );
                $SD.api.setState(Cordi[4].context, 1);
                $.each(Cordi, function (CordiIndex) {
                    console.log(CordiIndex + " " + Cordi[CordiIndex]);
                    if (CordiIndex > 7) {
                        $SD.api.setTitle(Cordi[CordiIndex].context, " ");
                        $SD.api.setImage(Cordi[CordiIndex].context, "./icons/icons/leauge-api-icon");
                    }

                });
                return console.log(participantslist[index]);
            }

        });
    } else {
        setIcons(SpecateSettings, participantslist);

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
async function getTop5champion(apiKey, serverCode, id, updateTitleFn) {
    var responseData;
    let url = "https://{serverCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/{SummonerId}"
        .replace("{serverCode}", serverCode)
        .replace("{SummonerId}", id);
    var request = await doRequest(url, apiKey);
    if (request) return request.slice(0, 5);
    else return responseData;
}
