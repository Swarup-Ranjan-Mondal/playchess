import json
from channels.generic.websocket import AsyncWebsocketConsumer
from scripts.chess_script import ChessGame


class PlayConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game = ChessGame()

        # Accept the WebSocket connection
        await self.accept()

        await self.send(text_data=json.dumps(self.game.getGameDetails()))

    async def disconnect(self, close_code):
        del self.game

    # Receive data from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        if 'move' in text_data_json:
            move = text_data_json['move']
            response = self.game.playMove(move)

            if 'success' in response:
                await self.send(text_data=json.dumps(response))

            elif 'error' in response:
                print(response)

        elif 'play_engine' in text_data_json:
            engine_name = text_data_json['engine_name']
            engine_response = self.game.playEngine(engine_name)

            if 'success' in engine_response:
                await self.send(text_data=json.dumps(engine_response))

            elif 'error' in engine_response:
                print(engine_response)
