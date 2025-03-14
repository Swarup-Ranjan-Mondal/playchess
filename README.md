# Play Chess

This App is built with [React](https://reactjs.org/) frontend and [Django](https://www.djangoproject.com/) backend. It allows a player to play chess in two ways: `Play Now` and `Play Online`.

**Play Now** allows a player to play either side, or against a engine. It also enables one to let an engine play against itself or against another engine.

**Play Online** allows a player to play a game with another player in real time .

#### Features:

- Consists of chess engines (**_Stockfish_**, **_Komodo_** for now) and a GUI

- Accepts move from mouse as well as touch screen.

- Allows a player to play online, either side, or against a engine

- Enables engine play against itself or against another engine

- Draw by stalemate, insufficient material, the fifty move rule and threefold repetition is recognized.

**_Link to hosted demo: https://play-chess.site/_**

## Usage

To run this app locally, clone this repo using the command:

```sh
$ git clone https://github.com/swarup-ranjan-mondal/playchess.git
```

Move inside the subfolder `playchess/` using the command

```sh
$ cd playchess/
```

###### Note: Before proceeding further make sure the prequisites are fullfilled.

### Prequisites

**Frontend** of this app is built using [React](https://reactjs.org/), so make sure [Node.js](https://nodejs.org/en/) is there to install the dependencies. If not installed, download and install from [here](https://nodejs.org/en/download/).

**Backend** of this app is built using [Django](https://www.djangoproject.com/) which is a **_python_** web framework. Hence, make sure python is installed. If it's not then download and install it from [here](https://www.python.org/downloads/).

For this app to work, a [Redis](https://redis.io/) container and a [Chess Engines](https://github.com/swarup-ranjan-mondal/chess-engines) (a _microservice_ that I made) container must run along with it. This means it is also required for your system to have [Docker](https://www.docker.com/), so make sure to download and install it from [here](https://docs.docker.com/get-docker/), in case its not there.

### Install and Run

#### Redis

**Play Chess** app uses a channel layer that uses `Redis` as its backing store. To start a **_Redis_** server on port `6379`, run the following command:

```sh
$ docker run -d -p 6379:6379 redis:5
```

#### Chess Engines

**Play Chess** app also uses a microservice `Chess Engines` which it needs for getting a move from a chess engine based on board position. To start this microservice on port `8080`, run the following command:

```sh
$ docker run -d -p 8080:8000 swarupranjanmondal/chess-engines:2
```

#### Backend

Open a `terminal` or `command prompt` from `playchess/` directory and move inside `backend/` using the command:

```sh
$ cd backend/
```

Install the required **_python_** packages according to the configuration file `requirements.txt` using the command:

```sh
$ pip install -r requirements.txt
```

Start the **backend** using the command:

```sh
$ python manage.py runserver
```

#### Frontend

Open another `terminal` or `command prompt` from `playchess/` directory and move inside `frontend/` using the command:

```sh
$ cd frontend/
```

Install the dependencies using the command:

```sh
$ npm install
```

Start the **frontend** using the command:

```sh
$ npm start
```

Now, open the app on the browser at [`http://localhost:3000/`](http://localhost:3000/) and have fun 😄.

The app will automatically reload if you change any of the source files.
