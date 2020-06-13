function initApp() {
    console.log("Initializing App");
    setUpConfig()
    deleteStyles();
    loadStyles();
    generateLayout(getLoginXML());
    finish();
    
    loadCustomerCSS();

    console.log("App initialized");
}

/*
 * Scan barcode by invoking Cordova plugin, copy result to matching input element.
 */
function scanBarcode(input) {
    cordova.plugins.barcodeScanner.scan
        (function (result) {
            console.log("Barcode scanned, result: " + result.text + ", format: " + result.format + ", cancelled: " + result.cancelled);
            if (!result.cancelled) {
                $(input).val(result.text);
            } else {
                console.log("Scanning cancelled");
                $.afui.toast({ message: "Scanvorgang wurde abgebrochen" });
            }
        }, function (error) {
            console.log("Scanning failed: " + error);
        });

}