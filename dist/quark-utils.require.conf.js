function QuarkUtilsRequireConf(bowerDir) {
    return {
        baseUrl: ".",
        paths: {
            "accounting-js": bowerDir + "/accounting.js/accounting.min",
            "blockui":       bowerDir + "/blockui/jquery.blockUI"
        }
    };
}
