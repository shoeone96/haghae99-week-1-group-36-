# CINEMA99

현재 상영 중인 영화 정보와 영화 리뷰를 볼 수 있습니다.

***

## 1. 주요 기능

### 1.1 영화 정보 표시 기능

- 네이버 영화 홈페이지에서 현재 상영 중인 영화를 스크래핑으로 가져옵니다.
- 각 페이지 당 20개의 영화를 볼 수 있습니다.
- 포스터 하단의 예매하기 버튼을 누르면 네이버 영화 예매 페이지로 넘어갑니다.
- 각 영화는 고유한 코드로 구분하고 상세 페이지 이동 시 감독, 배우, 개봉일자, 상영시간, 줄거리 등의 세부 정보를 보여줍니다.

### 1.2 평점 / 리뷰 관리 기능

- 평점 / 리뷰를 작성하고 삭제할 수 있습니다.
- 로그인과 회원가입 기능을 제공하고 본인이 작성한 리뷰가 아니라면 읽기만 가능합니다.
- 로그인이 되어있지 않다면 평점 / 리뷰를 작성할 수 없습니다.
- 하단의 "더 보기" 버튼을 누르면 5개의 리뷰를 더 볼 수 있습니다.

### 1.3 회원가입 기능

- 메인페이지 상단에 비로그인 시 로그인 페이지로 넘어갈 수 있는 버튼이 있습니다.
- 로그인 페이지에서 회원가입 버튼을 클릭하면 로그인 창이 회원가입 창으로 전환됩니다.
- 회원가입 창에 나타난 기준에 따라 아이디와 비밀번호, 비밀번호 확인을 작성하면 회원가입이 완료됩니다.
- 다만 조건에 맞지 않게 작성 시 조건에 부합하지 않는다는 문구를 전달합니다.

### 1.4 로그인/로그아웃 기능
- 회원가입 후 정보를 기입해주면 로그인이 가능합니다.
- 로그인 상태에서는 상단배너에 정보(id)와 로그아웃 버튼이 들어갑니다(로그아웃 클릭 시 로그아웃 가능).
- 로그인 상태에서 평점/리뷰 작성이 가능합니다(아이디 정보도 같이 리뷰에 기록됨).


***

## 2. 사용한 기능

- flask를 이용한 서버 제작
- jwt를 이용한 로그인 기능 제작(cookie와 token 활용)
- jinja2 템플릿을 이용한 html 파일 렌더링
- fetch 함수를 이용한 서버와 ajax 통신
- mongodb를 이용한 데이터베이스 제작
- css flex로 레이아웃 구성

***

로그인, 회원가입 : 이중원(dlwnddnjs96@gmail.com)

영화 정보 스크래핑, 리뷰 등록/삭제: 홍성훈(hh4518@gmail.com)
