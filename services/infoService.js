var infoService = exports;

infoService.getInfo = function() {
    return {size: work.size(), pending: pending.size};
}