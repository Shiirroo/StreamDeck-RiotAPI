function openGithub() {
    $SD.api.openUrl($SD.actionInfo.context, "https://github.com/Shiirroo/StreamDeck-RiotAPI");
}

async function doHideShow(hide, show) {
    if (hide !== undefined) await hide.forEach(element => {
        $("#" + element).hide();
    });
    if (show !== undefined) await show.forEach(element => {
        $("#" + element).show();
    });
}