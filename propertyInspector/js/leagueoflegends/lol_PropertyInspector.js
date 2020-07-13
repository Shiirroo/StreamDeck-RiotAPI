

async function leaugeLoad(settings) {
    document.title = 'League of Legends API';
    innnerHtml();

    await docReadyLeauge();

    document.getElementById("modus").addEventListener("change", leaugeModusChange);

    document.getElementById("getSummoner").addEventListener("change", leaugeGetSummonerChange);

    document.getElementById("updateButton").addEventListener("click", leaugeButtonClick);

    loadSettings(settings);

    leaugeModusChange();
}

var version;
var ChampionsList;

async function docReadyLeauge() {
    await $.each(server_region, function (index) {
        $("#serverCode").append($("<option/>")
            .val(server_region[index].code)
            .text(server_region[index].name));
    });

    $("#modus").append($("<option/>").val("1").text("Summoner"));
    $("#modus").append($("<option/>").val("2").text("League of League Service Status"));
    $("#modus").append($("<option/>").val("3").text("Summoner Ranked Solo/Duo"));
    $("#modus").append($("<option/>").val("4").text("Summoner Ranked Flex"));
    $("#modus").append($("<option/>").val("5").text("League of League Top Ranking"));
    $("#modus").append($("<option/>").val("6").text("Spectate Game"));
    $("#modus").append($("<option/>").val("7").text("Champion Mastery Points"));

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






function loadSettings(settings) {
    for (id in settings) {
        var Value = settings[id];
        if (id === "data" || id === "ChampionsList");
        else if (id === "champion") $('#champion option[value=' + Value + "-" + settings.data.championname + ']').prop('selected', 'selected').change();
        else if (id === "apiKey" || id === "summonerName") $("#" + id).val(Value);
        else $("#" + id + " option[value=" + Value + "]").prop("selected", "selected").change();

    }
}

async function leaugeModusChange() {
    let hide = [
        "getSummoner_container",
        "getServiceStatus_container",
        "getRankedSolo_Duo_container",
        "getRankedFlex_container",
        "getTopRanking_container",
        "getSpectateGame_container",
        "championContainer",
        "topChampionMasteryContainer",
        "getChampionMasteryPoints_container"],

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
            show = ["getTopRanking_container"];
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
async function leaugeGetSummonerChange() {
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
        await doHideShow(hide, show);
    }
}


function innnerHtml() {
    document.getElementById("placeholder").innerHTML = leaugehtml;
}

function leaugeButtonClick() {
    if ($SD && $SD.connection && $("#apiKey").val()) {
        let payload = {};
        payload.automaticRefresh = parseInt($("#automaticRefresh option:selected").val());;
        payload.apiKey = $("#apiKey").val();;
        payload.summonerName = $("#summonerName").val();;
        payload.getSummoner = parseInt($("#getSummoner option:selected").val());;
        payload.modus = parseInt($("#modus option:selected").val());
        payload.champion = $("#champion option:selected").val().split("-")[0];;
        payload.topChampionMastery = parseInt($("#topChampionMastery option:selected").val());;
        payload.getServiceStatus = parseInt($("#getServiceStatus option:selected").val());
        payload.getRankedFlex = parseInt($("#getRankedFlex option:selected").val());
        payload.getTopRanking = parseInt($("#getTopRanking option:selected").val());;
        payload.getSpectateGame = parseInt($("#getSpectateGame option:selected").val());;
        payload.getChampionMasteryPoints = parseInt($("#getChampionMasteryPoints option:selected").val());;
        payload.serverCode = $("#serverCode option:selected").val();;
        payload.getRankedSolo_Duo = parseInt($("#getRankedSolo_Duo option:selected").val());;
        payload.data = {
            version: version,
            ChampionsList: ChampionsList,
            championname: $("#champion option:selected").val().split("-")[1]
        };

        $SD.api.sendToPlugin(uuid, actionName, payload);
    } else
        return;

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
