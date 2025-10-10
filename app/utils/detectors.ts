export function isOffline(data: (string | undefined)): boolean {
    if (!data) {
        return true;
    }

    if (data.indexOf("No route to host") > -1
        || data.indexOf("Unreachable") > -1
        || data.indexOf("0 received") > -1
        || data.indexOf("100% packet loss") > -1
			  || data.indexOf("Connection refused") > -1
			  || data.indexOf("Connection timed out") > -1
			  || data.indexOf("Connection reset by peer") > -1
			  || data.indexOf("Connection aborted") > -1
			  || data.indexOf("Connection reset") > -1
			  || data.indexOf("Connection closed") > -1
			  || data.indexOf("Failed<br>code: -1") > -1
    ) {
        return true;
    }

    return false;
}
