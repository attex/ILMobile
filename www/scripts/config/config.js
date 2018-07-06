function setUpConfig() {
    if (isConfigOutOfDate()) {
        window.localStorage.setItem('config', JSON.stringify(DEFAULT_CONFIG));
    }

    saveConfigValue(HOST_IDENTIFIER, 'http://192.168.230.51:43108');
    saveConfigValue(APPLICATION_IDENTIFIER, 'iqu ilm');
    saveConfigValue(MODULE_IDENTIFIER, 'ILM');
    saveConfigValue(PROJECTS_IDENTIFIER, 'iqu60,ilm60_bas,ilm60_op412');
    saveConfigValue(USER_IDENTIFIER, 'DUNKEL');
    saveConfigValue(PASSWORD_IDENTIFIER, 'oxaion');
    saveConfigValue(FORMATSIZE_IDENTIFIER, 'APP');
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
