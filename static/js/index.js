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
    return string.length < 2 ? `0${string}` : string;
}

// function jwtDecode(t) {
//     let token = {};
//     token.raw = t;
//     token.header = JSON.parse(window.atob(t.split('.')[0]));
//     token.payload = JSON.parse(window.atob(t.split('.')[1]));
//     return (token)
//   }

// const getToken = function() {
//     const token = document.cookie.split(' ');
//     const tokenObj = {};

//     for (let i = 0; i < token.length; i++) {
//         const eachToken = token[i].split('=');

//         tokenObj[eachToken[0]] = jwtDecode(eachToken[1]);
//     }

//     return tokenObj;
// }

// console.log(getToken());
