function getServiceStatus(settings, Summoner, updateTitleFn) {
    switch (settings.getServiceStatus) {
        case 1:
        default:
            updateTitleFn(updateErrors.noDatafound);
            break;
    }
}