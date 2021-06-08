(function() {
    const infoLink = document.querySelectorAll('.info__link');
    const rank = document.querySelectorAll('.rank');

    Array.prototype.forEach.call(infoLink, (info, idx) => {
        info.href = `/detail?code=${parseInt(rank[idx].textContent)}`;
    });
})();
