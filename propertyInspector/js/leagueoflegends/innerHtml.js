
let getSummoner_container =

    '<div class="sdpi-item" id="getSummoner_container"> \
<div class="sdpi-item-label">Summoner</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="1">Summoner Level</option> \
    <option value="2">Summoner Icon</option> \
    <option value="3">Total Champion MasteryPoints</option> \
    <option value="4">Champion MasteryPoints</option> \
    <option value="5">Top 5 MasteryPoints</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';

let getServiceStatus_container =
    '<div class="sdpi-item" id="getServiceStatus_container" > \
<div class="sdpi-item-label">Service Status</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="1">Game</option> \
    <option value="2">Store</option> \
    <option value="3">Website</option> \
    <option value="4">Client</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';

let getRankedSolo_Duo_container =
    '<div class="sdpi-item" id="getRankedSolo_Duo_container" > \
<div class="sdpi-item-label">Ranked Solo|Duo</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="1">Rank</option> \
    <option value="2">LP</option> \
    <option value="3">Wins</option> \
    <option value="4">Losses</option> \
    <option value="5">Winrate</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';
let getRankedFlex_container = '<div class="sdpi-item" id="getRankedFlex_container" > \
<div class="sdpi-item-label">Ranked Flex</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="1">Rank</option> \
    <option value="2">LP</option> \
    <option value="3">Wins</option> \
    <option value="4">Losses</option> \
    <option value="5">Winrate</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';

let getTopRanking_container = '<div class="sdpi-item" id="getTopRanking_container" > \
<div class="sdpi-item-label">Top Ranking</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="2">Ranked_Solo Rank</option> \
    <option value="3">Ranked_Solo LP</option> \
    <option value="4">Ranked_Solo Wins</option> \
    <option value="5">Ranked_Solo losses</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';

let getSpectateGame_container = '<div class="sdpi-item" id="getSpectateGame_container" > \
<div class="sdpi-item-label">Spectate Game</div> \
<select class="sdpi-item-value select" id="option"> \
    <option value="1">Show Game</option> \
</select> \
</div> \
<div id="selectOption_container">\
        </div>';
let championContainer = '<div class="sdpi-item" id="championContainer" > \
<div class="sdpi-item-label">Champion</div> \
<select class="sdpi-item-value select" id="selectOption"> \
</select> \
</div> ';

let topChampionMasteryContainer = '<div class="sdpi-item" id="topChampionMasteryContainer" > \
<div class="sdpi-item-label">Place</div> \
<select class="sdpi-item-value select" id="selectOption"> \
    <option value="0">1</option> \
    <option value="1">2</option> \
    <option value="2">3</option> \
    <option value="3">4</option> \
    <option value="4">5</option> \
</select> \
</div>';

let modus = [
    "Summoner",
    "League of League Service Status",
    "Summoner Ranked Solo/Duo",
    "Summoner Ranked Flex",
    "League of League Top Ranking",
    "Spectate Game"
];