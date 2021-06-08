import requests
from bs4 import BeautifulSoup
import re

def no_space(text):
    text1 = re.sub('&nbsp; | &nbsp;| \n|\t|\r', '', text)
    text2 = re.sub('\n\n', '', text1)
    return text2.strip()

def get_movie_info():
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get('https://movie.naver.com/movie/running/current.nhn',headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    movies = soup.select('#content > div.article > div:nth-child(1) > div.lst_wrap > ul > li')
    movie_list = list()

    for idx, movie in enumerate(movies):
        movie_info = dict()

        title = movie.select_one('dl > dt > a')
        reserve = movie.select_one('dl > dd.info_t1 > div > a')
        age = movie.select_one('dl > dt > span')

        detail = movie.select_one('dl > dd:nth-child(3) > dl')

        summary = detail.select_one('dd:nth-child(2)')
        genre = summary.select_one('span.link_txt')
        director = detail.select_one('dd:nth-child(4) > span > a')
        actor = detail.select_one('dd:nth-child(6) > span')

        summary = list(map(no_space, summary.text.split('|')))
        [show_time] = list(filter(lambda x: re.search('분$', x), summary))
        [opening_date] = list(filter(lambda x: re.search('개봉$', x), summary))

        movie_info['id'] = idx
        movie_info['title'] = title.text
        movie_info['img'] = movie.select_one('div > a > img')['src'].split('?')[0]
        movie_info['link'] = title['href']

        if reserve: movie_info['reserve'] = reserve['href']
        if age: movie_info['age'] = age.text

        if genre: movie_info['genre'] = no_space(genre.text)
        if show_time: movie_info['show_time'] = show_time
        if opening_date: movie_info['opening_date'] = opening_date

        if director: movie_info['director'] = no_space(director.text)
        if actor: movie_info['actor'] = no_space(actor.text)

        movie_list.append(movie_info)
