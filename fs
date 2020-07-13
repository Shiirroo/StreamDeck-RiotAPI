

var settings;
async function leaugeLoad(settings) {
    document.title = 'League of Legends API';
    settings = settings;
    await docReadyLeauge();

    await leaugeModusChange();

    loadModusChange();

    await leaugeGetSummonerChange();

    loadGetSummonerChange(settings.data.select_3);

    document.getElementById("modus").addEventListener("change", leaugeModusChange);

    document.getElementById("updateButton").addEventListener("click", leaugeButtonClick);

    document.getElementById("option").addEventListener("change", leaugeGetSummonerChange);

}



var version;
var ChampionsList;

async function docReadyLeauge() {

    await $.each(server_region, function (index) { $("#serverCode").append($("<option/>").val(server_region[index].code).text(server_region[index].name)); });
    await $.each(modus, function (index) { $("#modus").append($("<option/>").val(index + 1).text(modus[index])); });

    version = await getVersion();
    ChampionsList = await getChamp(version);

    $("#apiKey").on("blur", function () {
        if (!$("#apiKey").val()) {
            $("#apiKeyValidationMessage").show();
        } else {
            $("#apiKeyValidationMessage").hide();
        }
    });
}

function loadModusChange() {
    for (id in settings) {
        console.log("ID: " + id + " Value: " + Value);
        var Value = settings[id];
        if (Value === undefined || id !== "data");
        else if (id === "apiKey" || id === "summonerName") $("#" + id).val(Value);
        else if (id === "option") $("#option option[value=" + Value + "]").prop("selected", "selected").change();
        else $("#" + id + " option[value=" + Value + "]").prop("selected", "selected").change();
    }

}
function loadGetSummonerChange(select_3) {
    if (select_3 !== undefined) $("#select_3 option[value=" + select_3 + "]").prop("selected", "selected").change();
}


function innnerHtml(html = document.getElementById("placeholder").innerHTML) {
    document.getElementById("placeholder").innerHTML = html;
}

async function leaugeModusChange() {
    switch (parseInt($("#modus option:selected").val())) {
        case 1:
            innnerHtml(getSummoner_container);
            break;
        case 2:
            innnerHtml(getServiceStatus_container);
            break;
        case 3:
            innnerHtml(getRankedSolo_Duo_container);
            break;
        case 4:
            innnerHtml(getRankedFlex_container);
            break;
        case 5:
            innnerHtml(getTopRanking_container);
            break;
        case 6:
            innnerHtml(getSpectateGame_container);
            break;
        case 7:
            innnerHtml(getChampionMasteryPoints_container);
            break;
        default:
            break;
    }
    loadSettings();

}

async function leaugeGetSummonerChange() {
    if (parseInt($("#modus option:selected").val()) === 1) {
        switch (parseInt($("#option option:selected").val())) {
            case 4:
                document.getElementById("select_3_container").innerHTML = championContainer;
                await $.each(ChampionsList, function (index) { $("#select_3").append($("<option/>").val(ChampionsList[index].key + "-" + ChampionsList[index].id).text(ChampionsList[index].id)); });
                break;
            case 5:
                document.getElementById("select_3_container").innerHTML = topChampionMasteryContainer;
                break;
            default:
                document.getElementById("select_3_container").innerHTML = "";
                break;
        }
    }

    loadSettings();
}

function leaugeButtonClick() {
    if ($SD && $SD.connection && $("#apiKey").val()) {
        let payload = {};
        payload.automaticRefresh = parseInt($("#automaticRefresh option:selected").val());;
        payload.apiKey = $("#apiKey").val();;
        payload.summonerName = $("#summonerName").val();
        payload.modus = parseInt($("#modus option:selected").val());
        payload.option = parseInt($("#option option:selected").val());
        payload.serverCode = $("#serverCode option:selected").val();
        payload.data = {
            version: version,
            ChampionsList: ChampionsList,
        };
        if (($("#select_3 option:selected").val()) !== undefined) payload.data.select_3 = $("#select_3 option:selected").val();
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
