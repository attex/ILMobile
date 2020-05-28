function setUpConfig() {
    if (isConfigOutOfDate()) {
        window.localStorage.setItem('config', JSON.stringify(DEFAULT_CONFIG));
    }

    // saveConfigValue(HOST_IDENTIFIER, 'http://192.168.230.51:43108');
    // saveConfigValue(OXAION_HOST_IDENTIFIER, 'OXAION');
    // saveConfigValue(APPLICATION_IDENTIFIER, 'iqu ilm');
    // saveConfigValue(MODULE_IDENTIFIER, 'ILM');
    // saveConfigValue(PROJECTS_IDENTIFIER, 'iqu60,ilm60_bas,ilm60_op412');
    // saveConfigValue(USER_IDENTIFIER, 'DUNKEL');
    // saveConfigValue(PASSWORD_IDENTIFIER, 'oxaion');
    // saveConfigValue(FORMATSIZE_IDENTIFIER, 'APP');
}

function isConfigOutOfDate() {
    try {
        const configWithoutValues = cloneAndRemoveValueField(getConfig());
        const defaultConfigWithoutValues = cloneAndRemoveValueField(DEFAULT_CONFIG);

        return JSON.stringify(configWithoutValues) !== JSON.stringify(defaultConfigWithoutValues);
    } catch (err) {
        return true;
    }
}

function cloneAndRemoveValueField(configJSON) {
    const jsonClone = JSON.clone(configJSON);
    jsonClone.options.map((option) => delete option.value);
    return jsonClone;
}

function getConfig() {
    return JSON.parse(window.localStorage.getItem('config'));
}

function saveConfig() {
    Array.from($('.configValue')).map((input) => saveConfigValue($(input).attr('id'), $(input).val()))
    resetView();
    initApp();
}

function saveConfigValue(identifier, value) {
    const config = getConfig();
    const query = `.options{.identifier=='${identifier}'}`;
    JSPath.apply(query, config)[0].value = value;
    configStr = JSON.stringify(config);
    window.localStorage.setItem('config', configStr);
}

function getConfigValue(identifier) {
    config = JSON.parse(window.localStorage.getItem('config'));
    const query = `.options{.identifier=='${identifier}'}`;
    return JSPath.apply(query, config)[0].value;
}

//prefix to prohib collision with views
function deleteStyles() {
    for (let i = 0; i < STYLE_IDENTIFIER_ARRAY.length; i++) {
        var styleValue = getConfigValue(STYLE_IDENTIFIER_ARRAY[i]);
        if (styleValue) {
            MAINVIEW.removeClass (function (index, className) {
                return (className.match (/(^|\s)style_\S+/g) || []).join(' ');
            });
        }
    }
}

function loadStyles() {
    for (let i = 0; i < STYLE_IDENTIFIER_ARRAY.length; i++) {
        var styleValue = getConfigValue(STYLE_IDENTIFIER_ARRAY[i]);
        if (styleValue) {
            MAINVIEW.addClass(STYLE_PREFIX + styleValue);
        }
    }
}

function scanButtonNeeded() {
    switch (getConfigValue(SCANNER_IDENTIFIER)) {
        case 'on':
            return true;
        case 'off':
            return false;
        default:
            return true;
    }
}

function isLoginTypeInput() {
    switch (getConfigValue(LOGINTYPE_IDENTIFIER)) {
        case 'input':
            return true;
        case 'scan':
            return false;
        default:
            return true;
    }
}

function getTimeout() {
    var timeoutValue = getConfigValue(TIMEOUT_IDENTIFIER);
    var parsedValue = parseInt(timeoutValue);
    if (isNaN(parsedValue)) {
        return 30000
    } else {
        return parsedValue * 1000;
    }
}

function getLoginXML() {
    //layout info of login template
    const inputLoginXML = '<?xml version= "1.0" encoding= "UTF-8" ?><mobis><header><error value="false" /><message value="" /><terminal /><info><project value="" /><procedure value="LOGIN" /><format value="" /><checknum value="" /><firma value="" /></info></header><session value="1491985469021000" /><template name="LOGIN"><callback><source /><action /></callback><events text="Ok" value="ENTER" /><formatproperty key="BUTTONLIST_BACKCOLOR" value="WhiteSmoke" /><formatproperty key="DISPLAYBACKCOLOR" value="White" /><formatproperty key="DISPLAYHEIGHT" value="150" /><formatproperty key="EDITBACKCOLOR" value="LightSteelBlue" /><formatproperty key="KEYBOARD" value="TRUE" /><formatproperty key="LINECOLOR" value="DarkRed" /><formatproperty key="LINEWIDTH" value="1" /><formatproperty key="LOGIN_PASSWORD" value="e15" /><formatproperty key="LOGIN_USER" value="e7" /><formatproperty key="TITLE" value="Anmeldung" /><formatproperty key="TITLEBACKCOLOR" value="DarkRed" /><formatproperty key="TITLEFORECOLOR" value="White" /><formatproperty key="XPDISPLAYHEIGHT" value="390" /><elements><element content="Benutzer:" events="" image="" name="e6" position="5,200" size="21,94" style="LABEL_EDITZONE" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,MidnightBlue,True,False,False,LEFT" /></element><element content="" events="" image="" name="e7" position="104,200" size="21,127" style="INPUT_ABC" text="" type="TextBox"><formatelementproperty key="TABTOENTER" value="FALSE" /><formatelementproperty key="ENTERTOTAB" value="TRUE" /><formatelementproperty key="STYLE" value="Arial,9.75,White,Black,False,False,False,LEFT" /></element><element content="Geben Sie Ihren Benutzernamen und das Kennwort ein:" events="" image="" name="e12" position="5,160" size="38,226" style="ORDER" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,DarkRed,True,False,True,LEFT" /></element><element content="Kennwort:" events="" image="" name="e14" position="5,224" size="21,91" style="LABEL_EDITZONE" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,MidnightBlue,True,False,False,LEFT" /></element><element content="" events="" image="" name="e15" position="104,224" size="21,127" style="INPUT_ABC" text="" type="TextBox"><formatelementproperty key="TABTOENTER" value="FALSE" /><formatelementproperty key="STYLE" value="Arial,9.75,White,Black,False,False,False,LEFT" /><formatelementproperty key="PASSWORD_CHARACTER" value="*" /></element></elements></template></mobis>';
    const scanLoginXML = '<?xml version="1.0" encoding="UTF-8" ?><mobis><header><error value="false"></error><message value=""></message><terminal></terminal><info><project value=""></project><procedure value="LOGIN"></procedure><format value=""></format><checknum value=""></checknum><firma value=""></firma></info></header><session value="1538474553440000"></session><template name="LOGIN"><callback><source></source><action></action></callback><events text="Ok" value="ENTER"></events><formatproperty key="BUTTONLIST_BACKCOLOR" value="WhiteSmoke"></formatproperty><formatproperty key="DISPLAYBACKCOLOR" value="White"></formatproperty><formatproperty key="DISPLAYHEIGHT" value="150"></formatproperty><formatproperty key="DISPLAYHEIGHT_PDA_BIG" value="300"></formatproperty><formatproperty key="EDITBACKCOLOR" value="LightSteelBlue"></formatproperty><formatproperty key="KEYBOARD" value="TRUE"></formatproperty><formatproperty key="LINECOLOR" value="DarkRed"></formatproperty><formatproperty key="LINEWIDTH" value="1"></formatproperty><formatproperty key="LOGIN_USER" value="e7"></formatproperty><formatproperty key="TITLE" value="Anmeldung"></formatproperty><formatproperty key="TITLEBACKCOLOR" value="DarkRed"></formatproperty><formatproperty key="TITLEFORECOLOR" value="White"></formatproperty><formatproperty key="XPDISPLAYHEIGHT" value="390"></formatproperty><elements><element content="Anmeldedaten:" events="" image="" name="e6" position="5,220" size="21,220" style="LABEL_EDITZONE" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,MidnightBlue,True,False,False,LEFT"></formatelementproperty></element><element content="950_LOELL" events="" image="" name="e7" position="5,250" size="21,210" style="INPUT_ABC" text="" type="TextBox"><formatelementproperty key="TABTOENTER" value="FALSE"></formatelementproperty><formatelementproperty key="STYLE" value="Arial,9.75,White,Black,False,False,False,LEFT"></formatelementproperty><formatelementproperty key="PASSWORD_CHARACTER" value="*"></formatelementproperty></element><element content="Geben Sie Ihren Benutzernamen und das Kennwort getrennt durch das von Ihnen konfigurierte Zeichen ein!" events="" image="" name="e12" position="5,160" size="57,226" style="ORDER" text="" type="Label"><formatelementproperty key="STYLE" value="Arial,9.75,LightSteelBlue,DarkRed,True,False,True,LEFT"></formatelementproperty></element></elements></template></mobis>';
    
    if (isLoginTypeInput()) {
        return inputLoginXML;
    } else {
        return scanLoginXML;
    }
}

function loadCustomerCSS() {
    $("#customercss").remove();
    var container = document.head;
    var styleSheet = document.createElement('link');

    styleSheet.rel = 'stylesheet';
    styleSheet.type = 'text/css';
    styleSheet.href = getConfigValue("host") + '/iqu/customer.css';
    styleSheet.id = "customercss"
  
    container.appendChild(styleSheet);
}
