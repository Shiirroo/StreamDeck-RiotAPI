async function doRequest(url, apiKey, updateTitleFn) {
    var responseData;
    console.log("API Request | URL: " + url + " | APIKEY:" + apiKey);
    await $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: async function (response) {
            if (response) {
                responseData = response;
            } else {
                updateTitleFn(updateErrors.noDatafound);
            }
        },
        error: function (jqxhr, textStatus, error) {
            console.log("ERROR: ", jqxhr, textStatus, error);
            updateTitleFn({
                "Icon": "../icons/icons/leauge-api-icon.png",
                "Text": responseErrors[jqxhr.status]
            });
        },
        beforeSend: setHeader
    });
    function setHeader(xhr) {
        xhr.setRequestHeader('X-Riot-Token', apiKey);
    }
    return responseData;
}