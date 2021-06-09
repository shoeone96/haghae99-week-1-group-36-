import requests
from bs4 import BeautifulSoup
import re

headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}

def no_space(text):
    text1 = re.sub('&nbsp; | &nbsp;| \n|\t|\r', '', text)
    text2 = re.sub('\n\n', '', text1)
    return text2.strip()

def get_movie_info():
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

        movie_info['id'] = idx + 1
        movie_info['title'] = title.text
        movie_info['img'] = movie.select_one('div > a > img')['src'].split('?')[0]
        movie_info['link'] = 'https://movie.naver.com' + title['href']

        if reserve: movie_info['reserve'] = 'https://movie.naver.com' + reserve['href']
        if age: movie_info['age'] = age.text

        if genre: movie_info['genre'] = no_space(genre.text)
        if show_time: movie_info['show_time'] = show_time
        if opening_date: movie_info['opening_date'] = opening_date

        if director: movie_info['director'] = no_space(director.text)
        if actor: movie_info['actor'] = no_space(actor.text)

        movie_list.append(movie_info)

    return movie_list

movies = get_movie_info()

def get_movie_summary(code):
    target = movies[code]
    url = target['link']
    data = requests.get(url, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    movie = soup.select_one('#content > div.article > div.section_group.section_group_frst > div:nth-child(1) > div > div.story_area')
    summary_tit = movie.select_one('h5')
    summary_des = movie.select_one('p')

    detail_info = dict()

    detail_info['title'] = target['title']
    detail_info['img'] = target['img']
    detail_info['link'] = target['link']

    detail_info['id'] = target['link'].split('?')[1].split('=')[1]

    if "opening_date" in target: detail_info['opening_date'] = target['opening_date']
    if "genre" in target: detail_info['genre'] = target['genre']
    if "show_time" in target: detail_info['show_time'] = target['show_time']
    if "director" in target: detail_info['director'] = target['director']
    if "actor" in target: detail_info['actor'] = target['actor']
    if "age" in target: detail_info['age'] = target['age']
    if "reserve" in target: detail_info['reserve'] = target['reserve']

    if summary_tit: detail_info['summary_tit'] = summary_tit.text
    if summary_des: detail_info['summary_des'] = summary_des.text
    
    return detail_info
