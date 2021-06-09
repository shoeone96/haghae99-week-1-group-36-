(function() {
    // DOM
    const code = parseInt(document.querySelector('.section__info').querySelector('.container').id);
    const stars = document.querySelectorAll('.btn--star');
    const scoreInfo = document.querySelector('.score-info');
    const inputReview = document.getElementById('input-review');
    const reviewLength = document.querySelector('.length');
    const btnSubmit = document.querySelector('.btn--submit');
    const reviewWrap = document.querySelector('.review-wrap');

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

    const showComments = function(contents) {
        // const id = contents.id;
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
        const edit = document.createElement('div');
        const btnEdit = document.createElement('button');
        const btnDel = document.createElement('button');

        review.className = 'review';
        grade.className = 'grade';
        scoreDom.className = 'score';
        description.className = 'review-description';
        userId.className = 'user-id';
        userComment.className = 'user-comment';
        bottom.className = 'review-bottom';
        dateDom.className = 'comment-date';
        edit.className = 'edit-review';
        btnEdit.className = 'btn--edit';
        btnDel.className = 'btn--delete';
        btnEdit.classList.add('btn');
        btnDel.classList.add('btn');

        grade.style.background = 'conic-gradient(#DA1300 0% ' + score * 10 + '%, #30333f ' + score * 10 + '% 100%)';
        scoreDom.textContent = score;
        // userId.textContent = id;
        userComment.textContent = comment;
        dateDom.textContent = date;
        btnEdit.textContent = '수정';
        btnDel.textContent = '삭제';

        grade.appendChild(scoreDom);
        edit.appendChild(btnEdit);
        edit.appendChild(btnDel);
        bottom.appendChild(dateDom);
        bottom.appendChild(edit);
        description.appendChild(userId);
        description.appendChild(userComment);
        description.appendChild(bottom);

        review.appendChild(grade);
        review.appendChild(description);

        return review;
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
        .then(() => {
            const review = showComments(data);
            reviewWrap.insertBefore(review, reviewWrap.firstChild);
        });

        Array.prototype.forEach.call(stars, star => {
            star.classList.add('on');
        });
        scoreInfo.textContent = '10점';
        inputReview.value = '';
        reviewLength.textContent = '0';
    }

    const getReview = function() {
        request.get(`/review?id=${code}`)
            .then(response => response.json())
            .then(json => {
                if (json.review_list.length <= 5) {
                    const showMore = document.querySelector('.btn--more');
                    showMore.classList.add('hide');
                }

                json.review_list.forEach((review, i) => {
                    if (i >= 5) return;
                    const comment = showComments(review);
                    reviewWrap.append(comment);
                });
            });
    }

    getReview();

    // EVENT HANDLER
    Array.prototype.forEach.call(stars, (star) => {
        star.addEventListener('mouseover', function() {
            const idx = Array.prototype.indexOf.call(stars, this);
            chooseScore(idx + 1);
        });
    });

    inputReview.addEventListener('input', findTheLengthOfAString);
    btnSubmit.addEventListener('click', registerReview);
})();
