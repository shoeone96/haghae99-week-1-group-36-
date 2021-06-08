(function() {
    const viewingAge = document.querySelectorAll('.viewing-age');
    const ageIcon = {
        '전체 관람가': '../static/img/all.png',
        '12세 관람가': '../static/img/12.png',
        '15세 관람가': '../static/img/15.png',
        '청소년 관람불가': '../static/img/19.png'
    };

    Array.prototype.forEach.call(viewingAge, age => {
        const icon = ageIcon[age.textContent];

        age.style.backgroundImage = `url(${icon})`;
    });
})();
