from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from scripts.chess_script import ChessGame

chessGames = {}


@api_view(['GET'])
def apiOverview(request):
    return Response("Start Playing!")


@api_view(['POST'])
def newGame(request):
    global chessGames
    if 'game_id' in request.data:
        print(request.data)
        game = chessGames[request.data['game_id']]
        return Response(game.resetGame(), status.HTTP_200_OK)

    else:
        return Response({
            "error": True,
            "message": "No 'game_id' found!",
        }, status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'POST'])
def play(request):
    global chessGames

    if request.method == 'GET':
        game = ChessGame()
        chessGames[game.game_id] = game
        return Response(game.getGameDetails())

    elif request.method == 'POST':
        if 'game_id' in request.data:
            game = chessGames[request.data['game_id']]
            if 'move' in request.data:
                response = game.playMove(request.data['move'])
                if 'success' in response:
                    return Response(response, status.HTTP_200_OK)
                elif 'error' in response:
                    return Response(response, status.HTTP_400_BAD_REQUEST)
            elif 'play_engine' in request.data:
                if 'engine_name' in request.data:
                    engineResponse = game.enginePlay(
                        request.data['engine_name'])
                    if 'success' in engineResponse:
                        return Response(engineResponse, status.HTTP_200_OK)
                    elif 'error' in engineResponse:
                        return Response(engineResponse,
                                        status.HTTP_400_BAD_REQUEST)
                else:
                    return Response(
                        {
                            "error": True,
                            "message": "No 'engine_name' key found!",
                        }, status.HTTP_400_BAD_REQUEST)
            else:
                return Response(
                    {
                        "error": True,
                        "message":
                        "Neither 'move' nor 'play_engine' key present!",
                    }, status.HTTP_400_BAD_REQUEST)
        else:
            return Response(
                {
                    "error": True,
                    "message": "No 'game_id' key found!",
                }, status.HTTP_400_BAD_REQUEST)
