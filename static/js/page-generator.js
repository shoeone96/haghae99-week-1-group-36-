(function() {
    const pageLink = document.querySelectorAll('.page-link');
    const order = location.search;
    const linkObj = {};

    if (!order) {
        pageLink[0].classList.add('selected');
    } else {
        const orderSpt = order.slice(1).split('=');

        linkObj[orderSpt[0]] = parseInt(orderSpt[1]);
        pageLink[linkObj.order].classList.add('selected');
    }

    Array.prototype.forEach.call(pageLink, (page, idx) => {
        page.href = `/page?order=${idx}`;
    });
})();
