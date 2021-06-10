(function() {
    // DOM
    const code = parseInt(document.querySelector('.section__info').querySelector('.container').id);
    const stars = document.querySelectorAll('.btn--star');
    const scoreInfo = document.querySelector('.score-info');
    const inputReview = document.getElementById('input-review');
    const reviewLength = document.querySelector('.length');
    const btnSubmit = document.querySelector('.btn--submit');
    const reviewWrap = document.querySelector('.review-wrap');
    const btnMore = document.querySelector('.btn--more');
    const gradeDom = document.querySelector('.grade');

    // MUTABLE VARIABLE
    let reviews;
    let userSignInInfo;

    // FUNCTION
    const gradeDisplay = function(
        score=parseFloat(gradeDom.querySelector('.score').textContent),
        target=gradeDom
    ) {
        target.style.background = 'conic-gradient(#DA1300 0% ' + score * 10 + '%, #30333f ' + score * 10 + '% 100%)';
    }

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

    const showComments = function(username, contents, id) {
        const idx = id;
        const score = contents.grade;
        const comment = contents.comment;
        const date = contents.date;

        const review = document.createElement('li');
        const grade = document.createElement('div');
        const scoreDom = document.createElement('strong');
        const description = document.createElement('div');
        const userId = document.createElement('strong');
        const userComment = document.createElement('p');
        const bottom = document.createElement('div');
        const dateDom = document.createElement('p');

        review.id = idx;
        review.className = 'review';
        grade.className = 'grade';
        scoreDom.className = 'score';
        description.className = 'review-description';
        userId.className = 'user-id';
        userComment.className = 'user-comment';
        bottom.className = 'review-bottom';
        dateDom.className = 'comment-date';

        gradeDisplay(score, grade);
        scoreDom.textContent = score;
        userId.textContent = username;
        userComment.textContent = comment;
        dateDom.textContent = date;

        grade.appendChild(scoreDom);
        bottom.appendChild(dateDom);

        if (username === userSignInInfo) {
            const btnDel = document.createElement('button');

            btnDel.className = 'btn--delete';
            btnDel.classList.add('btn');
            btnDel.textContent = '삭제';

            bottom.appendChild(btnDel);

            btnDel.addEventListener('click', function() {
                modifyReview(id, this.closest('.review'));
            });
        }

        description.appendChild(userId);
        description.appendChild(userComment);
        description.appendChild(bottom);

        review.appendChild(grade);
        review.appendChild(description);

        return review;
    }

    const showReview = function() {
        const review = reviews.shift();
        
        if (!reviews.length) {
            btnMore.classList.add('hide');
            return;
        }

        const comment = showComments(review.user_id, review, review.id);

        reviewWrap.append(comment);
    }

    const getReview = function() {
        request.get(`/review?id=${code}`)
            .then(response => response.json())
            .then(json => {
                reviews = json.review_list.reverse();
                userSignInInfo = json.username;

                if (json.review_list.length <= 5) btnMore.classList.add('hide');

                for (let i = 0; i < 5; i++) {
                    showReview();
                }
            });
    }

    const registerReview = function() {
        const grade = parseInt(scoreInfo.textContent);
        const comment = inputReview.value;
        const date = new Date;
        const currentDate = `${date.getFullYear()}.${makeTwoLetters(date.getMonth() + 1)}.${makeTwoLetters(date.getDate())}`;

        const data = {
            code,
            grade,
            comment,
            date: currentDate
        };

        if (!comment) {
            alert('내용을 작성해주세요.');
            return;
        } else if (comment.length < 5) {
            alert('내용을 5자 이상 입력해주세요.');
            return;
        }

        request.post('/review/add', data)
        .then(response => response.json())
        .then(json => {
            const review = showComments(json.user_id, data, json.id, json.user_id);

            reviewWrap.insertBefore(review, reviewWrap.firstChild);
            gradeDom.querySelector('.score').textContent = json.total_grade;
            
            gradeDisplay(json.total_grade);
        }).catch(err => {
            const is_sign_in = confirm('로그인이 필요한 서비스입니다. 로그인 하시겠습니까?');

            if (is_sign_in) location.href = 'login';

            console.error(err);
        });

        Array.prototype.forEach.call(stars, star => {
            star.classList.add('on');
        });
        scoreInfo.textContent = '10점';
        inputReview.value = '';
        reviewLength.textContent = '0';
    }

    const modifyReview = function(id, delElem) {
        const grade = parseInt(delElem.querySelector('.score').textContent)

        request.post('/review/edit', { id, code, grade })
        .then(response => response.json())
        .then(json => {
            gradeDom.querySelector('.score').textContent = json.total_grade;
            
            gradeDisplay(json.total_grade);
            showReview();
            reviewWrap.removeChild(delElem);
        });
    }

    // EVENT HANDLER
    Array.prototype.forEach.call(stars, (star) => {
        star.addEventListener('mouseover', function() {
            const idx = Array.prototype.indexOf.call(stars, this);
            chooseScore(idx + 1);
        });
    });

    inputReview.addEventListener('input', findTheLengthOfAString);
    btnSubmit.addEventListener('click', registerReview);
    btnMore.addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
            showReview();
        }
    });

    // FUNCTION EXCUTION
    getReview();
    gradeDisplay();
})();
