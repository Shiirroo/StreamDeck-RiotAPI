function leaugeLoad(settings) {
    document.title = 'League of Legends API';
    if (settings.apiKey) {
        $("#apiKey").val(settings.apiKey);
    }

    if (settings.modus) {
        $("#modus option[value=" + settings.modus + "]")
            .prop("selected", "selected").change();
    }

    if (settings.summonerName) {
        $("#summonerName").val(settings.summonerName);
    }

    if (settings.getSummoner) {
        $("#getSummoner option[value=" + settings.getSummoner + "]")
            .prop("selected", "selected").change();
    }

    if (settings.getServiceStatus) {
        $("#getServiceStatus option[value=" + settings.getServiceStatus + "]")
            .prop("selected", "selected").change();
    }
    if (settings.getRankedSolo_Duo) {
        $("#getRankedSolo_Duo option[value=" + settings.getRankedSolo_Duo + "]")
            .prop("selected", "selected").change();
    }
    if (settings.getRankedFlex) {
        $("#getRankedFlex option[value=" + settings.getRankedFlex + "]")
            .prop("selected", "selected").change();
    }
    if (settings.getTopRanking) {
        $("#getTopRanking option[value=" + settings.getTopRanking + "]")
            .prop("selected", "selected").change();
    }
    if (settings.getSpectateGame) {
        $("#getSpectateGame option[value=" + settings.getSpectateGame + "]")
            .prop("selected", "selected").change();
    }

    if (settings.getChampionMasteryPoints) {
        $("#getChampionMasteryPoints option[value=" + settings.getChampionMasteryPoints + "]")
            .prop("selected", "selected").change();
    }

    if (settings.automaticRefresh) {
        $("#automaticRefresh option[value=" + settings.automaticRefresh + "]")
            .prop("selected", "selected").change();
    }

    if (settings.serverCode) {
        $('#serverCode option[value=' + settings.serverCode + ']')
            .prop('selected', 'selected').change();
    }

    if (settings.champion) {
        $('#champion option[value=' + settings.champion + "-" + settings.championname + ']')
            .prop('selected', 'selected').change();
    }

    if (settings.topChampionMastery) {
        $('#topChampionMastery option[value=' + settings.topChampionMastery + ']')
            .prop('selected', 'selected').change();
    }
}

var version;
var ChampionsList;
async function docReadyLeauge() {
    await $.each(server_region, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region[index].code)
            .text(server_region[index].name));
    });
    version = await getVersion();
    ChampionsList = await getChamp(version);
    await $.each(ChampionsList, function (index) {
        $("#champion").append($("<option/>")
            .val(ChampionsList[index].key + "-" + ChampionsList[index].id)
            .text(ChampionsList[index].id));
    });

    $("#apiKey").on("blur", function () {
        if (!$("#apiKey").val()) {
            $("#apiKeyValidationMessage").show();
        } else {
            $("#apiKeyValidationMessage").hide();
        }
    });
}

async function leaugeModusChange() {
    if (actionName !== "de.shiro.leauge.api.action") return;
    let hide = ["getSummoner_container", "getServiceStatus_container", "getRankedSolo_Duo_container", "getRankedFlex_container", "getTopRanking_container", "getSpectateGame_container", "championContainer", "topChampionMasteryContainer", "getChampionMasteryPoints_container"],
        show;
    switch (parseInt($("#modus option:selected").val())) {
        case 1:
            show = ["getSummoner_container"];
            if (parseInt($("#getSummoner option:selected").val()) === 4) {
                show.push("championContainer");
            }
            else if (parseInt($("#getSummoner option:selected").val()) === 5) {
                show.push("topChampionMasteryContainer");
            }
            break;
        case 2:
            show = ["getServiceStatus_container"];
            break;
        case 3:
            show = ["getRankedSolo_Duo_container"];
            break;
        case 4:
            show = ["getRankedFlex_container"];
            break;
        case 5:
            show = ["getSpectateGame_container"];
            break;
        case 6:
            show = ["getSpectateGame_container"];
            break;
        case 7:
            show = ["getChampionMasteryPoints_container"];
            break;
        default:
            break;
    }
    await doHideShow(hide, show);
}
function leaugeGetSummonerChange() {
    if (actionName !== "de.shiro.leauge.api.action") return;
    if (parseInt($("#modus option:selected").val()) === 1) {
        var hide = [],
            show;
        switch (parseInt($("#getSummoner option:selected").val())) {
            case 4:
                hide = ["topChampionMasteryContainer"];

                show = ["championContainer"];
                break;
            case 5:
                hide = ["championContainer"];
                show = ["topChampionMasteryContainer"];
                break;

            default:
                hide.push("topChampionMasteryContainer", "championContainer");
                break;
        }
        doHideShow(hide, show);
    }
}
function leaugeButtonClick() {
    let apiKey = $("#apiKey").val();
    let serverCode = $("#serverCode option:selected").val();
    let summonerName = $("#summonerName").val();
    let getRankedSolo_Duo = parseInt($("#getRankedSolo_Duo option:selected").val());
    let modus = parseInt($("#modus option:selected").val());
    let getServiceStatus = parseInt($("#getServiceStatus option:selected").val());
    let getRankedFlex = parseInt($("#getRankedFlex option:selected").val());
    let getTopRanking = parseInt($("#getTopRanking option:selected").val());
    let getSpectateGame = parseInt($("#getSpectateGame option:selected").val());
    let getChampionMasteryPoints = parseInt($("#getChampionMasteryPoints option:selected").val());
    let champion = $("#champion option:selected").val().split("-")[0];
    let championname = $("#champion option:selected").val().split("-")[1];
    let topChampionMastery = parseInt($("#topChampionMastery option:selected").val());
    let getSummoner = parseInt($("#getSummoner option:selected").val());
    let automaticRefresh = parseInt($("#automaticRefresh option:selected").val());
    if (!$("#apiKey").val()) {
        return;
    }

    if ($SD && $SD.connection) {
        let payload = {};
        payload.automaticRefresh = automaticRefresh;
        payload.apiKey = apiKey;
        payload.summonerName = summonerName;
        payload.getSummoner = getSummoner;
        payload.modus = modus;
        payload.champion = champion;
        payload.version = version;
        payload.ChampionsList = ChampionsList;
        payload.topChampionMastery = topChampionMastery;
        payload.championname = championname;
        payload.getServiceStatus = getServiceStatus;
        payload.getRankedFlex = getRankedFlex;
        payload.getTopRanking = getTopRanking;
        payload.getSpectateGame = getSpectateGame;
        payload.getChampionMasteryPoints = getChampionMasteryPoints;
        payload.serverCode = serverCode;
        payload.getRankedSolo_Duo = getRankedSolo_Duo;
        $SD.api.sendToPlugin(uuid, actionName, payload);
    }
}



async function getVersion() {
    let url = "https://ddragon.leagueoflegends.com/api/versions.json";
    var data;
    await $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: async function (response) {
            if (response) {
                return data = response[0];
            }
        },
        error: async function (jqxhr, textStatus, error) {
            console.log("ERROR");
        },
    });
    return data;
}

async function getChamp(version) {
    let url = "http://ddragon.leagueoflegends.com/cdn/{version}/data/en_US/champion.json".replace("{version}", version);
    var data;
    await $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: async function (response) {
            if (response) {
                data = response.data;
            }
        },
        error: async function (jqxhr, textStatus, error) {
            console.log("ERROR");
        },
    });
    return data;
}
