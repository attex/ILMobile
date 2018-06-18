var inScanView = false;

function initApp() {
    console.log("Initializing App");
    initConfig();
    loadStyles();

    //layout info of login template
    const loginXML = '<?xml version= "1.0" encoding= "UTF-8" ?><mobis><header><error value="false" /><message value="" /><terminal /><info><project value="ilm60_bas" /><procedure value="LOGIN" /><format value="10" /><checknum value="1" /><firma value="" /></info></header><session value="1491985469021000" /><template name="LOGIN"><callback><source /><action /></callback><events text="Ok" value="ENTER" /><formatproperty key="BUTTONLIST_BACKCOLOR" value="WhiteSmoke" /><formatproperty key="DISPLAYBACKCOLOR" value="White" /><formatproperty key="DISPLAYHEIGHT" value="150" /><formatproperty key="EDITBACKCOLOR" value="LightSteelBlue" /><formatproperty key="KEYBOARD" value="TRUE" /><formatproperty key="LINECOLOR" value="DarkRed" /><formatproperty key="LINEWIDTH" value="1" /><formatproperty key="LOGIN_PASSWORD" value="e15" /><formatproperty key="LOGIN_USER" value="e7" /><formatproperty key="TITLE" value="Anmeldung" /><formatproperty key="TITLEBACKCOLOR" value="DarkRed" /><formatproperty key="TITLEFORECOLOR" value="White" /><formatproperty key="XPDISPLAYHEIGHT" value="390" /><elements><element content="Benutzer:" events="" image="" name="e6" position="5,200" size="21,94" style="LABEL_EDITZONE" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,MidnightBlue,True,False,False,LEFT" /></element><element content="" events="" image="" name="e7" position="104,200" size="21,127" style="INPUT_ABC" text="" type="TextBox"><formatelementproperty key="TABTOENTER" value="FALSE" /><formatelementproperty key="ENTERTOTAB" value="TRUE" /><formatelementproperty key="STYLE" value="Arial,9.75,White,Black,False,False,False,LEFT" /></element><element content="Geben Sie Ihren Benutzernamen und das Kennwort ein:" events="" image="" name="e12" position="5,160" size="38,226" style="ORDER" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,DarkRed,True,False,True,LEFT" /></element><element content="Kennwort:" events="" image="" name="e14" position="5,224" size="21,91" style="LABEL_EDITZONE" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,MidnightBlue,True,False,False,LEFT" /></element><element content="" events="" image="" name="e15" position="104,224" size="21,127" style="INPUT_ABC" text="" type="TextBox"><formatelementproperty key="TABTOENTER" value="FALSE" /><formatelementproperty key="STYLE" value="Arial,9.75,White,Black,False,False,False,LEFT" /><formatelementproperty key="PASSWORD_CHARACTER" value="*" /></element></elements></template></mobis>';
    generateLayout(loginXML);

    finish();

    console.log("App initialized");
}

/*
 * Scan barcode by invoking Cordova plugin, copy result to matching input element.
 */
function scanBarcode(input) {
    inScanView = true;

    cordova.plugins.barcodeScanner.scan
        (function (result) {
            console.log("Barcode scanned, result: " + result.text + ", format: " + result.format + ", cancelled: " + result.cancelled);
            if (!result.cancelled) {
                $(input).val(result.text);
                inScanView = false;
            } else {
                console.log("Scanning cancelled");
                $.afui.toast({ message: "Scanvorgang wurde abgebrochen" });
            }
        }, function (error) {
            console.log("Scanning failed: " + error);
            inScanView = false;
        });

}