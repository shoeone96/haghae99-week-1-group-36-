(function() {
    const infoLink = document.querySelectorAll('.info__link');

    Array.prototype.forEach.call(infoLink, info => {
        info.href = `/detail?code=${info.id}`;
    });
})();
