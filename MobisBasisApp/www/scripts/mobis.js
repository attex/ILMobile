var mobis = (function (my) {
    my.loginState = false;
    my.attempts = 0;
    my.signIn = function (silent) {
        console.log("signIn() invoked");
        var serverurl = localStorage.getItem('mobis_serverurl');
        var username = localStorage.getItem('mobis_username');
        var password = localStorage.getItem('mobis_password');
        var application = localStorage.getItem('mobis_application');
        var deferred = $.Deferred();
        if (application == "iqu mobis Assistent") {
           var  module = "MOBIS";
        } else {
           var module = "WEB";
        }
        $.when(
            callSOAP("projectLogin", ["username", username, "passwordd", password, "application", application, "version", "3.00", "module", module, "projects", "*SERVER", "params", "3E95094F800D;54E1AD09856E;3C95094F800D;3C95094F800E"])
        ).then(data => {
            window.sessionID = getSessionId(data);
            console.log("Retrieved ID: " + window.sessionID);
            if (window.sessionID) {
                if (!silent) {
                    $.afui.toast({ message: "Login erfolgreich" });
                }
                mobis.attempts = 0;
                $("#spinner").hide();
                mobis.loginState = true;
                deferred.resolve(data);
            } else {
                let opts = {
                    message: "Login fehlgeschlagen, serverurl: " + serverurl + ", username: " + username,
                    type: "error"
                };
                $("#spinner").hide();
                $.afui.toast(opts);
                mobis.loginState = false;
            }
        }, err => {
            const msg = "Es konnte keine Verbindung zum Mobis-Server hergestellt werden: " + err;
            let opts = {
                message: msg,
                position: "tc",
                delay: 2000,
                autoClose: true,
                type: "error"
            };
            $("#spinner").hide();
            $.afui.toast(opts);
            mobis.loginState = false;
            deferred.reject(msg);
        });
        return deferred.promise();
    };

    my.saveLoginData = () => {
        localStorage["mobis_serverurl"] = $("#serverurl").val();
        localStorage["mobis_username"] = $("#username").val();
        localStorage["mobis_password"] = $("#password").val();
        localStorage["mobis_application"] = $("#application").val();
    }

    my.loadLoginData = () => {
        $("#serverurl").val(localStorage["mobis_serverurl"]);
        $("#username").val(localStorage["mobis_username"]);
        $("#password").val(localStorage["mobis_password"]);
        $("#application").val(localStorage["mobis_application"]);
    }

    my.checkLoginData = () => {
        let serverurl = localStorage.getItem('mobis_serverurl');
        let username = localStorage.getItem('mobis_username');
        let password = localStorage.getItem('mobis_password');
        let application = localStorage.getItem('mobis_application');

        if (serverurl && username && password && application) {
            console.log("Login data found");
            console.log("Logging in to " + serverurl + " with username " + username + " and application " + application);
        }
    }

    my.checkLoginState = () => {
        if (mobis.loginState) {
            $(".onlineState").text("");
            $(".onlineState").attr("state","online");
       } else {
            $(".onlineState").text("");
            $(".onlineState").attr("state","offline")
        }
    };

    return my;
}(mobis || {}));