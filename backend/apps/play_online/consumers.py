import json
from channels.generic.websocket import AsyncWebsocketConsumer
from scripts.chess_script import ChessGame

game = None


class GameThreadConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        global game

        if game == None:
            game = ChessGame()
            self.game = game
            self.player = 'player1'
            self.thread = f'thread-{game.game_id}'

        else:
            self.game = game
            self.player = 'player2'
            self.thread = f'thread-{game.game_id}'
            game = None

        # Join game thread
        await self.channel_layer.group_add(
            self.thread,
            self.channel_name
        )

        # Accept the WebSocket connection
        await self.accept()

        # Sending the game details to the player when one connects
        gameDetails = self.game.getGameDetails()

        if self.player == 'player1':
            gameDetails['waiting_message'] = 'Waiting for the other player to connect...'

        elif self.player == 'player2':
            # Player2 will have no legal moves at first as the first turn is for Player1
            gameDetails['legal_moves'] = {}
            await self.channel_layer.group_send(
                self.thread,
                {'type': 'connected'}
            )

        await self.send(text_data=json.dumps(gameDetails))

    # Other player has connected to game thread
    async def connected(self, event):
        if self.player == "player1":
            await self.send(text_data=json.dumps({'player_connected': True}))

    async def disconnect(self, close_code):
        global game

        if not (game == None) and self.thread == f'thread-{game.game_id}':
            game = None

        else:
            await self.channel_layer.group_send(
                self.thread,
                {'type': 'disconnected'}
            )

        # Leave game thread
        await self.channel_layer.group_discard(
            self.thread,
            self.channel_name
        )

        # Delete main attributes
        del self.game
        del self.player
        del self.thread

    # Other player has disconnected from game thread
    async def disconnected(self, event):
        await self.send(text_data=json.dumps({
            'disconnection_message': 'Other player has abandoned the game!'
        }))

    # Receive move from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        move = text_data_json['move']

        legal_moves = self.game.getLegalMoves()
        self.playedMove = {move: legal_moves[move]}

        response = self.game.playMove(move)

        if 'success' in response:
            response['type'] = 'move'
            response['move'] = self.playedMove

            # Send move to game thread
            await self.channel_layer.group_send(
                self.thread,
                response,
            )

        elif 'error' in response:
            print(response)

    # Receive move from game thread
    async def move(self, event):
        move = event['move']
        # Nothing to be done if the consumer who has sent the move to game thread has received it.
        if (not event['is_game_over']) and hasattr(self, 'playedMove') and self.playedMove == move:
            return

        # Coping everything from event to response except 'type' key and its value
        response = {key: val for key, val in event.items() if key != 'type'}

        # Send move to WebSocket
        await self.send(text_data=json.dumps(response))
