const updateErrors = {
    userNotFound: {
        "Icon": "../icons/icons/leauge-api-icon.png",
        "Text": "User\n\nnot\nfound!",
        "State": {
            'state': 0
        }
    },
    noDatafound: {
        "Icon": "../icons/icons/leauge-api-icon.png",
        "Text": "No\n\data\nfound!",
        "State": {
            'state': 0
        }
    },
};


const responseErrors = {
    400: "Bad\nrequest",
    401: "Unauthorized",
    403: "Forbidden",
    404: "No\ndata\nfound",
    405: "Method\nnot\nallowed",
    415: "Unsupported\nmedia\ntype",
    429: "Rate\nlimit\nexceeded",
    500: "Internal\nserver\nerror",
    502: "Bad\ngateway",
    503: "Service\nunavailable",
    504: "Gateway\ntimeout"
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
