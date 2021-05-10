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
            self.thread = 'thread-' + game.game_id
        else:
            self.game = game
            self.player = 'player2'
            self.thread = 'thread-' + game.game_id
            game = None

        # Join room group
        await self.channel_layer.group_add(
            self.thread,
            self.channel_name
        )

        print('user joined with thread - ' + self.thread)
        await self.accept()

        # Sending the game details to the player when one connects
        gameDetails = self.game.getGameDetails()
        del gameDetails['game_id']

        # Player2 will have no legal moves at first as the first turn is for Player1
        if self.player == 'player2':
            gameDetails['legal_moves'] = {}

        await self.send(text_data=json.dumps(gameDetails))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.thread,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        move = text_data_json['move']

        legal_moves = self.game.getLegalMoves()
        self.playedMove = {move: legal_moves[move]}

        response = self.game.playMove(move)
        if 'success' in response:
            response['type'] = 'move'
            response['move'] = self.playedMove

            # Send move to room group
            await self.channel_layer.group_send(
                self.thread,
                response,
            )

        elif 'error' in response:
            print(response)

    # Receive move from room group
    async def move(self, event):
        move = event['move']
        # Nothing to be done if the consumer who has send the event in the grp has received it.
        if (not event['is_game_over']) and hasattr(self, 'playedMove') and self.playedMove == move:
            return

        # coping everything from event to response except 'type' key and its value
        response = {key: val for key, val in event.items() if key != 'type'}

        # Send move to WebSocket
        await self.send(text_data=json.dumps(response))
