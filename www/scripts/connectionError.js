// Every connection handler should be able to detect its specific connection errors.

function handleConnectionError(connectionError) {
    // Check for invalid session error
    if (connectionError.message.endsWith('APPL_ERROR_WRONG_SESSION_ID')) {
        initApp();
    }
    // Check for needsRecovery
    else if (connectionError.needsRecovery) {
        // Delete last mask
        // Information about last mask is kept in storage
        resetLayout();

        // Generating recovery mask
        TITLE.text("Wiederherstellung");
        MAIN_CONTAINER.append($(nunjucks.render('getTopFormat.njk')));
    }
    // Toast error message
    $.afui.toast({ message: connectionError.message });
}

class ConnectionError extends Error {
    constructor(message, needsRecovery = false) {
        super(message);

        this.needsRecovery = needsRecovery;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ConnectionError);
        }
    }
}