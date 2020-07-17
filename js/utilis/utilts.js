const updateErrors = {
    userNotFound: {
        "Icon": "../icons/icons/leauge-api-icon.png",
        "Text": "User\n\nnot\nfound!",
        "State": null
    },
    noDatafound: {
        "Icon": "../icons/icons/leauge-api-icon.png",
        "Text": "No\n\data\nfound!",
        "State": null
    },
};


const responseErrors = {
    400: ["Bad\nrequest"],
    401: ["Unauthorized"],
    403: ["Forbidden"],
    404: ["No\ndata\nfound", "Summoner\nnot\ningame"],
    405: ["Method\nnot\nallowed"],
    415: ["Unsupported\nmedia\ntype"],
    429: ["Rate\nlimit\nexceeded"],
    500: ["Internal\nserver\nerror"],
    502: ["Bad\ngateway"],
    503: ["Service\nunavailable"],
    504: ["Gateway\ntimeout"]
};

const SpecateSummonerPlace = {
    1: [2],
    2: [1, 3],
    3: [1, 2, 3],
    4: [0, 1, 3, 4],
    5: [0, 1, 2, 3, 4],
};

const promo = {
    2: [11, 12, 13],
    3: [10, 11, 12, 13, 14],
};

const promoIcon = {
    W: "../icons/miniseries/LightDia.png",
    L: "../icons/miniseries/lightX.png",
    N: "../icons/miniseries/LightRaute.png",
};

const indexRanked = {
    0: ["leaguePoints", 1, false, " LP"],
    1: ["wins", null, true, "\n\n\n"],
    2: ["winrate", null, true, "Win-rate\n"],
    3: ["losses", null, true, "\n\n\n"],
    4: ["summonerName", 1, true, ""],

};

const rankedtyp = {
    "Solo": "RANKED_SOLO_5x5",
    "Flex": "RANKED_FLEX_SR",
};


const queueIds = {
    0: "Custom\ngames",
    72: "1v1 SSG",
    72: "2v2 SSG",
    76: "URF",
    78: "OFA | MD",
    83: "Co-op\nvs\nAI URP",
    100: "5v5 ARAM",
    310: "Nemesis games",
    313: "Black Market",
    317: "DNotD",
    325: "All Random",
    400: "5v5 Draft",
    420: "5v5\nRanked Solo",
    430: "5v5 Blind",
    440: "5v5\nRanked Flex",
    450: "5v5 ARAM",
    600: "Blood Hunt",
    610: "Dark Star",
    700: "Clash games",
    830: "Co-op\nvs\nAI Intro",
    840: "Co-op\nvs\nAI Beginner",
    850: "Co-op\nvs\nAI Interm",
    900: "URF",
    910: "Ascension",
    920: "Poro King",
    940: "Nexus Siege",
    950: "Doom Bots V",
    960: "Doom Bots",
    980: "Star Guardian",
    990: "Star Guardian O",
    1000: "PROJECT:\nHunters",
    1010: "Snow ARURF",
    1020: "One for All",
    1030: "Odyssey",
    1040: "Odyssey",
    1050: "Odyssey",
    1060: "Odyssey",
    1070: "Odyssey",
    1090: "TFT",
    1100: "Ranked TFT",
    1110: "TFT Tutorial",
    2000: "Tutorial 1",
    2010: "Tutorial 2",
    2020: "Tutorial 3",
    undefined: "Custom"
};

function toDataURL(src, callback, outputFormat) {
    let img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        let canvas = document.createElement('CANVAS');
        let ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.src = src;
    if (img.complete || img.complete === undefined) {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
        img.src = src;
    }
}

function NumberToFormat(NumberFormat) {
    return (NumberFormat).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};

function getResult(result, context) {

    if (result.hasOwnProperty("State")) {
        $SD.api.setState(context, result.State);
    }
    if (result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, result.Text);
    }
    if (!result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, "");
    }
    if (result.hasOwnProperty("Icon")) {
        toDataURL(result.Icon,
            function (dataUrl) {
                $SD.api.setImage(context, dataUrl);
            }
        );
    }
    if (!result.hasOwnProperty("Icon") && !result.hasOwnProperty("Text")) {
        $SD.api.setTitle(context, result);
    }
}

async function getChampNameForId(id, ChampionsList) {
    var name;
    for (var key in Object.keys(ChampionsList)) {
        var keyName = Object.keys(ChampionsList)[key];
        if (parseInt(ChampionsList[keyName].key) === id) {
            return name = ChampionsList[keyName].id;
        }
    };
    return name;
}

function consoleError(consol) {
    console.log(consol);
}

function roman_to_Int(str1) {
    if (str1 == null) return -1;
    var num = char_to_int(str1.charAt(0));
    var pre, curr;

    for (var i = 1; i < str1.length; i++) {
        curr = char_to_int(str1.charAt(i));
        pre = char_to_int(str1.charAt(i - 1));
        if (curr <= pre) {
            num += curr;
        } else {
            num = num - pre * 2 + curr;
        }
    }

    return num;
}

function char_to_int(c) {
    switch (c) {
        case 'I': return 1;
        case 'V': return 5;
        case 'X': return 10;
        case 'L': return 50;
        case 'C': return 100;
        case 'D': return 500;
        case 'M': return 1000;
        default: return -1;
    }
}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}


function switchProfile(settings, Ingame, device, id) {
    $SD.api.switchToProfile($SD.uuid, device, "RiotGamesUI");
    waitForElement();
    async function waitForElement() {
        if (coordinate.length === 15) {
            switch (id) {
                case 1:
                    setSpectateIcons(settings, Ingame.participants, Ingame);
                    break;
                case 2:
                    setSpectateIcons(settings, Ingame.participants, Ingame);
                    break;

                default:
                    break;
            }
        }
        else {
            setTimeout(waitForElement, 500);
        }
    }
}

async function setSummonerIcontoAPI(ChampionsList, version, summonerName, championId, context) {
    $SD.api.setState(context, 1);
    $SD.api.setTitle(context, summonerName);
    var url = "http://ddragon.leagueoflegends.com/cdn/{leaugeversion}/img/champion/{championname}.png".replace("{championname}", await getChampNameForId(championId, ChampionsList)).replace("{leaugeversion}", version);
    toDataURL(url, function (dataUrl) { $SD.api.setImage(context, dataUrl); });
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