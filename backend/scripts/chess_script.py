import uuid
import chess
import requests


class ChessGame:
    def __init__(self):
        self.game_id = str(uuid.uuid4())
        self.board = chess.Board()

    def getGameDetails(self):
        return {
            "board": str(self.board),
            "legal_moves": self.getLegalMoves(),
        }

    def resetGame(self):
        self.board.reset()

        return {
            "board": str(self.board),
            "legal_moves": self.getLegalMoves(),
        }

    def getLegalMoves(self):
        legalMovesDictionary = {}

        for move in self.board.legal_moves:
            legalMovesDictionary[str(move)] = self.board.san(
                chess.Move.from_uci(str(move)))

        return legalMovesDictionary

    def playEngine(self, engineName):
        url = 'http://localhost:8080/'
        response = requests.post(url, json={
            "fen": self.board.fen(),
            "engine_name": engineName,
        }).json()

        if response['success'] == True:
            engine_move = response['engine_move']
            self.board.push_san(list(engine_move.keys())[0])

            status = self.gameStatus()
            response.update(status)

            return response

    def playMove(self, move: str):
        legalMovesDictionary = self.getLegalMoves()

        for key in legalMovesDictionary:
            if move == key or move == legalMovesDictionary[key]:
                self.board.push_san(move)

                return self.gameStatus()

        return {
            "error": True,
            "message": "invalid move!",
            "legal_moves": legalMovesDictionary,
        }

    def getOutcomeOfGame(self):
        if self.board.is_checkmate():
            return {"outcome": "checkmate"}

        elif self.board.is_stalemate():
            return {"outcome": "draw", "reason": "stalemate"}

        elif self.board.is_insufficient_material():
            return {"outcome": "draw", "reason": "insufficient material"}

        elif self.board.can_claim_threefold_repetition():
            return {"outcome": "draw", "reason": "threefold repetation"}

        elif self.board.can_claim_fifty_moves():
            return {"outcome": "draw", "reason": "fifty-move rule"}

        else:
            return None

    def gameStatus(self):
        gameOutcome = self.getOutcomeOfGame()

        if gameOutcome == None:
            return {
                "success": True,
                "is_game_over": False,
                "legal_moves": self.getLegalMoves(),
            }

        elif gameOutcome['outcome'] == 'checkmate':
            return {
                "success": True,
                "is_game_over": True,
                "outcome": "checkmate",
                "winner": "white" if self.board.outcome().winner else "black",
                "loser": "black" if self.board.outcome().winner else "white",
            }

        elif gameOutcome['outcome'] == 'draw':
            return {
                "success": True,
                "is_game_over": True,
                "outcome": "draw",
                "reason": gameOutcome['reason'],
            }
