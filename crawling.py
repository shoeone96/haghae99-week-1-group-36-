import requests
from bs4 import BeautifulSoup

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get('https://movie.naver.com/movie/running/current.nhn',headers=headers)

soup = BeautifulSoup(data.text, 'html.parser')

movies = soup.select('#content > div.article > div:nth-child(1) > div.lst_wrap > ul > li')


for movie in movies:
    img = movie.select_one('div > a > img')['src'].split('?')[0]
    reserve = movie.select_one('dl > dd.info_t1 > div > a')
    if reserve is not None and reserve.text == '예매하기':
        book_link = reserve['href']
    age = movie.select_one('dl > dt > span')
    if age is not None:
        age_limit = age.text
    title = movie.select_one('dl > dt > a').text
    print(img, book_link, title, age_limit)
