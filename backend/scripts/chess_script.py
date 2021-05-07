import uuid
import chess
import chess.engine


class ChessGame:
    def __init__(self):
        self.game_id = str(uuid.uuid4())
        self.board = chess.Board()
        self.engines = {
            'stockfish':
            chess.engine.SimpleEngine.popen_uci(
                "chess_engines/stockfish_13/stockfish"),
            'komodo':
            chess.engine.SimpleEngine.popen_uci(
                "chess_engines/komodo_12/komodo")
        }

    def getGameDetails(self):
        return {
            "game_id": self.game_id,
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

    def enginePlay(self, engineName):
        result = self.engines[engineName].play(self.board,
                                               chess.engine.Limit(time=0.5))
        response = {
            str(result.move):
            self.board.san(chess.Move.from_uci(str(result.move)))
        }
        self.board.push(result.move)
        status = self.gameStatus()
        status['engine_move'] = response
        return status

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
                "winner": "White" if self.board.outcome().winner else "Black",
                "loser": "Black" if self.board.outcome().winner else "White",
            }
        elif gameOutcome['outcome'] == 'draw':
            return {
                "success": True,
                "is_game_over": True,
                "outcome": "draw",
                "reason": gameOutcome['reason'],
            }
