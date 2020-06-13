const instance = axios.create({ timeout: 5000 });

function loadCustomerCSS() {
    //Remove old customercss
    $("#customercss").remove();

    var styleSheetURL = getConfigValue("customercss");

    if (styleSheetURL !== "") {
        start();
        instance.get(styleSheetURL).
            then(() => {
                //Create new customercss
                var container = document.head;
                var styleSheet = document.createElement('link');

                styleSheet.rel = 'stylesheet';
                styleSheet.type = 'text/css';
                styleSheet.href = styleSheetURL;
                styleSheet.id = "customercss"

                //Add bew customercss
                container.appendChild(styleSheet);
            })
            .catch(() => {
                $.afui.toast({ message: "Eigenes CSS konnte nicht geladen werden." });
            })
            .finally(finish)
    }
}