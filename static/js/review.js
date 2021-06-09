(function() {
    // DOM
    const stars = document.querySelectorAll('.btn--star');
    const scoreInfo = document.querySelector('.score-info');
    const inputReview = document.getElementById('input-review');
    const reviewLength = document.querySelector('.length');
    const btnSubmit = document.querySelector('.btn--submit');

    // FUNCTION
    const chooseScore = function(score) {
        scoreInfo.textContent = `${score}점`;

        for (let i = 0; i < score; i++) stars[i].classList.add('on');
        for (let i = score; i < stars.length; i++) stars[i].classList.remove('on');
    }

    const findTheLengthOfAString = function() {
        const length = this.value.length;

        if (length > 220) {
            inputReview.value = this.value.slice(0, 220);
            return;
        }

        reviewLength.textContent = length;
    }

    const registerReview = function(grade, comment) {
        if (!comment) {
            alert('내용을 작성해주세요.');
            return;
        }

        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/review_receive');

        xhr.setRequestHeader('content-type', 'application/json');

        xhr.send(JSON.stringify({ grade_give: grade, comment_give: comment }));

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;

            if (xhr.status === 200) {
                console.log(JSON.parse(xhr.response));
            } else {
                console.error('Error', xhr.status, xhr.statusText);
            }
        }
    }

    // EVENT HANDLER
    Array.prototype.forEach.call(stars, (star) => {
        star.addEventListener('mouseover', function() {
            const idx = Array.prototype.indexOf.call(stars, this);
            chooseScore(idx + 1);
        });
    });
    inputReview.addEventListener('input', findTheLengthOfAString);
})();
