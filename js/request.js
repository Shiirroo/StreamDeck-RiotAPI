async function doRequest(url, apiKey, updateTitleFn, found = 0) {
    var responseData;
    console.log("API Request | URL: " + url + " | APIKEY:" + apiKey);
    try {
        await $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                responseData = response;

            },
            error: function (jqxhr, textStatus, error) {
                if (updateTitleFn)
                    updateTitleFn({
                        "Icon": "../icons/icons/leauge-api-icon.png",
                        "Text": responseErrors[jqxhr.status][found],
                        "State": null
                    });
            },
            beforeSend: setHeader
        });
        function setHeader(xhr) {
            xhr.setRequestHeader('X-Riot-Token', apiKey);
        }
    } catch (error) {
    }
    return responseData;
}