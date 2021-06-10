const request = {
    get(url) {
        return fetch(url);
    },
    post(url, payload) {
        return fetch(url, {
            method: "POST",
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    }
}

const makeTwoLetters = function(string) {
    string = string + '';

    return string.length < 2 ? `0${string}` : string;
}
