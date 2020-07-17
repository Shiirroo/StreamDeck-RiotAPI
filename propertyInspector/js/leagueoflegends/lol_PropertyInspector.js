

async function leaugeLoad(settings) {
    document.title = 'League of Legends API';
    await docReadyLeauge();

    ShowModusChange(settings);

    loadChange(settings);

    document.getElementById("modus").addEventListener("change", ShowModusChange);

    document.getElementById("updateButton").addEventListener("click", leaugeButtonClick);

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

function loadChange(settings) {
    for (id in settings) {
        var Value = settings[id];
        console.log("ID: " + id + " Value: " + Value);
        if (Value === undefined || id === "data");
        else if (id === "apiKey" || id === "summonerName") $("#" + id).val(Value);
        else $("#" + id + " option[value=" + Value + "]").prop("selected", "selected").change();
    }
    if (settings.data && settings.data.selectOption !== undefined) $("#selectOption option[value=" + settings.data.selectOption + "]").prop("selected", "selected").change();

}

function innnerHtml(html = document.getElementById("placeholder").innerHTML) {
    document.getElementById("placeholder").innerHTML = html;
}

function ShowModusChange(settings) {
    if (isNaN(settings.modus)) settings.modus = parseInt($("#modus option:selected").val());
    switch (settings.modus) {
        case 1:
            innnerHtml(getSummoner_container);
            SummonerOptionChange(settings.option);
            document.getElementById("option").addEventListener("change", SummonerOptionChange);
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
        default:
            innnerHtml(getSummoner_container);
            break;
    }
}


async function SummonerOptionChange(SummonerChange) {
    if (isNaN(SummonerChange)) SummonerChange = parseInt($("#option option:selected").val());
    switch (SummonerChange) {
        case 4:
            document.getElementById("selectOption_container").innerHTML = championContainer;
            await $.each(ChampionsList, function (index) { $("#selectOption").append($("<option/>").val(ChampionsList[index].key + "-" + ChampionsList[index].id).text(ChampionsList[index].id)); });
            break;
        case 5:
            document.getElementById("selectOption_container").innerHTML = topChampionMasteryContainer;
            break;
        default:
            document.getElementById("selectOption_container").innerHTML = "";
            break;
    }

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
        if (($("#selectOption option:selected").val()) !== undefined) payload.data.selectOption = $("#selectOption option:selected").val();
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
