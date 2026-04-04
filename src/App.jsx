import { useState, useEffect } from "react";
const colors = {
 bg: '#f8fafc',      
  text: '#1e293b',    
  boardBg: '#ffffff', 
  border: '#e2e8f0',  
  x: '#3b82f6',      
  o: '#10b981',       
  accent: '#4338ca',  
  draw: '#f59e0b',    
  easy: '#059669', 
  medium: '#fbbf24', 
  hard: '#dc2626'
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: 'linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)',
    color: colors.text,
    padding: "20px",
    boxSizing: "border-box",
  },
  header: { textAlign: "center", marginBottom: "20px" },
  title: { fontSize: "2.5rem", margin: "0 0 10px 0", color: colors.text },
  menu: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    marginTop: "20px",
    width: "100%",
    boxSizing: "border-box",
    maxWidth: "400px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    border: "none",
    borderRadius: "8px",
    transition: "transform 0.1s, opacity 0.2s",
    width: "100%",
    textAlign: "center",
    boxSizing: "border-box",
    color: "white",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    width: "90vmin",
    maxWidth: "400px",
    height: "90vmin",
    maxHeight: "400px",
    gap: "2vmin",
    backgroundColor: colors.boardBg,
    padding: "2vmin",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },
  square: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12vmin",
    fontWeight: "bold",
    transition: "background-color 0.2s",
    boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.02)",
  },
};

function Square({ value, onSquareClick }) {
  const isX = value === "X";
  const color = isX ? colors.x : colors.o;
  return (
    <button onClick={onSquareClick} style={{ ...styles.square, color: color }}>
      {value}
    </button>
  );
}

export default function App() {
  const [gameState, setGameState] = useState("menu");
  const [gameMode, setGameMode] = useState(null);
  const [difficulty, setDifficulty] = useState("medium"); 
  const [player1Symbol, setPlayer1Symbol] = useState("X");
  const [aiSymbol, setAiSymbol] = useState("O");
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draws: 0 });

  useEffect(() => {
    const winner = calculateWinner(squares);
    const isDraw = !winner && !squares.includes(null);
    if (winner || isDraw || gameState !== "playing") return;

    const isAiTurn =
      gameMode === "PvIA" &&
      ((aiSymbol === "X" && xIsNext) || (aiSymbol === "O" && !xIsNext));

    if (isAiTurn) {
      const timer = setTimeout(() => makeAiMove(), 600);
      return () => clearTimeout(timer);
    }
  }, [xIsNext, squares, gameMode, gameState, aiSymbol, difficulty]);

  function makeAiMove() {
    const availableIndices = squares
      .map((s, i) => (s === null ? i : null))
      .filter((s) => s !== null);
    if (availableIndices.length === 0) return;

    let move = null;

    if (difficulty === "easy") {
      move =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else if (difficulty === "medium") {
      move =
        findWinningMove(aiSymbol) ??
        findWinningMove(player1Symbol) ??
        (squares[4] === null
          ? 4
          : availableIndices[
              Math.floor(Math.random() * availableIndices.length)
            ]);
    } else if (difficulty === "hard") {
      move = minimax(squares, aiSymbol).index;
    }

    if (move !== null) handleClick(move, true);
  }

  function findWinningMove(symbol) {
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const testBoard = squares.slice();
        testBoard[i] = symbol;
        if (calculateWinner(testBoard)) return i;
      }
    }
    return null;
  }

  function minimax(newBoard, player) {
    const availSpots = newBoard
      .map((s, i) => (s === null ? i : null))
      .filter((s) => s !== null);

    if (calculateWinner(newBoard) === player1Symbol) return { score: -10 };
    else if (calculateWinner(newBoard) === aiSymbol) return { score: 10 };
    else if (availSpots.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
      const move = {};
      move.index = availSpots[i];
      newBoard[availSpots[i]] = player;

      if (player === aiSymbol) {
        move.score = minimax(newBoard, player1Symbol).score;
      } else {
        move.score = minimax(newBoard, aiSymbol).score;
      }

      newBoard[availSpots[i]] = null;
      moves.push(move);
    }

    let bestMove;
    if (player === aiSymbol) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  }

  // === LÓGICA DO CLIQUE ===
  function handleClick(i, isAiCall = false) {
    const winner = calculateWinner(squares);
    const isAiTurn =
      gameMode === "PvIA" &&
      ((aiSymbol === "X" && xIsNext) || (aiSymbol === "O" && !xIsNext));

    if (
      squares[i] ||
      winner ||
      (isAiTurn && !isAiCall) ||
      gameState !== "playing"
    )
      return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    const currentWinner = calculateWinner(nextSquares);
    const currentDraw = !currentWinner && !nextSquares.includes(null);

    if (currentWinner)
      setScores((prev) => ({
        ...prev,
        [currentWinner.toLowerCase()]: prev[currentWinner.toLowerCase()] + 1,
      }));
    else if (currentDraw)
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
  }

  function selectMode(mode) {
    setGameMode(mode);
    if (mode === "PvP") {
      setPlayer1Symbol("X");
      setAiSymbol("O");
      startGame();
    } else {
      setGameState("difficulty");
    }
  }

  function selectDifficulty(diff) {
    setDifficulty(diff);
    setGameState("choice");
  }

  function selectSymbol(symbol) {
    setPlayer1Symbol(symbol);
    setAiSymbol(symbol === "X" ? "O" : "X");
    startGame();
  }

  function startGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameState("playing");
  }

  function nextRound() {
    startGame();
  }
  function backToMenu() {
    setGameState("menu");
    setGameMode(null);
  }
  const winner = calculateWinner(squares);
  const isDraw = !winner && !squares.includes(null);

  let status, statusColor;
  if (winner) {
    status = "🎉 Vencedor: " + winner;
    statusColor = winner === "X" ? colors.x : colors.o;
  } else if (isDraw) {
    status = "🤝 Deu Velha! (Empate)";
    statusColor = colors.draw;
  } else {
    const isAiTurn =
      gameMode === "PvIA" &&
      ((aiSymbol === "X" && xIsNext) || (aiSymbol === "O" && !xIsNext));
    const currentTurnSymbol = xIsNext ? "X" : "O";
    if (gameMode === "PvIA")
      status = isAiTurn
        ? `Vez da IA (${currentTurnSymbol})...`
        : `Sua Vez (${currentTurnSymbol})!`;
    else status = `Vez do Jogador: ${currentTurnSymbol}`;
    statusColor = xIsNext ? colors.x : colors.o;
  }

 return (
    <main style={styles.container}>
      <section style={styles.header}>
        <h1 style={styles.title}>Jogo da Velha</h1>
        <p style={{ margin: 0, color: '#64748b' }}>Jogue contra a IA</p>
      </section>

      {gameState === "menu" && (
        <div style={styles.menu}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#334155' }}>Escolha o modo de jogo:</h2>
          <button
            onClick={() => selectMode("PvIA")}
            style={{ ...styles.button, backgroundColor: colors.accent, color: 'white' }}
          >
            🤖 Desafiar a IA (Computador)
          </button>
          <button
            onClick={() => selectMode("PvP")}
            style={{ ...styles.button, backgroundColor: 'transparent', color: colors.accent, border: '2px solid ' + colors.accent, marginTop: '10px' }}
          >
            👥 2 Jogadores (Local)
          </button>
        </div>
      )}

      {gameState === "difficulty" && (
        <div style={styles.menu}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '15px', color: colors.text }}>Selecione a Dificuldade:</h2>
          <button
            onClick={() => selectDifficulty("easy")}
            style={{ ...styles.button, backgroundColor: colors.easy, color: 'white' }}
          >
            👶 Fácil
          </button>
          <button
            onClick={() => selectDifficulty("medium")}
            style={{ ...styles.button, backgroundColor: colors.medium, color: colors.text, marginTop: '10px' }}
          >
            🧐 Médio
          </button>
          <button
            onClick={() => selectDifficulty("hard")}
            style={{ ...styles.button, backgroundColor: '#dc2626', color: 'white', marginTop: '10px' }}
          >
            😈 Difícil (Invencível)
          </button>
          <button
            onClick={backToMenu}
            style={{ ...styles.button, backgroundColor: 'black', color: '#f6faff', border: '1px solid #cecece', marginTop: '15px' }}
          >
            Voltar
          </button>
        </div>
      )}

      {gameState === 'choice' && (
        <div style={styles.menu}>
          <h2 style={{ fontSize: '1.2rem', color: colors.text }}>Com qual você quer jogar?</h2>
          <p style={{ fontSize: '0.85rem', margin: '-10px 0 20px 0', color: '#64748b' }}>
            Lembre-se: o <strong>X</strong> sempre começa!
          </p>
          
          <div style={{ display: 'flex', gap: '15px', width: '100%' }}>
            <button 
              onClick={() => selectSymbol('X')} 
              style={{ ...styles.button, backgroundColor: colors.x, color: 'white', flex: 1 }}
            >
              Jogar com X
            </button>
            <button 
              onClick={() => selectSymbol('O')} 
              style={{ ...styles.button, backgroundColor: colors.o, color: 'white', flex: 1 }}
            >
              Jogar com O
            </button>
          </div>

          <button 
            onClick={backToMenu} 
            style={{ ...styles.button, backgroundColor: 'transparent', color: '#94a3b8', marginTop: '15px', border: '1px solid #e2e8f0' }}
          >
            Voltar ao início
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <>
          <div
            style={{ display: "flex", gap: "20px", marginBottom: "20px", padding: "12px 25px", backgroundColor: "white", borderRadius: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.03)", fontSize: "1rem" }}
          >
            <div style={{ fontWeight: "bold", color: colors.x }}>X: {scores.x}</div>
            <div style={{ fontWeight: "bold", color: '#94a3b8' }}>Empates: {scores.draws}</div>
            <div style={{ fontWeight: "bold", color: colors.o }}>O: {scores.o}</div>
          </div>

          <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", textAlign: "center", color: statusColor, fontWeight: 'bold' }}>
            {status}
          </h2>

          <div style={styles.board}>
            {squares.map((value, index) => (
              <Square key={index} value={value} onSquareClick={() => handleClick(index)} />
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "25px", width: "90vmin", maxWidth: "400px" }}>
            {(winner || isDraw) && (
              <button
                onClick={nextRound}
                style={{ ...styles.button, backgroundColor: colors.accent, color: 'white' }}
              >
                Próxima Rodada
              </button>
            )}
            <button
              onClick={backToMenu}
              style={{ ...styles.button, backgroundColor: '#f1f5f9', color: colors.text, border: '1px solid #e2e8f0' }}
            >
              Menu Principal
            </button>
          </div>
        </>
      )}

      <div style={{ marginTop: "auto",  paddingTop: "60px", paddingBottom: "20px", textAlign: "center", fontSize: "0.9rem", color: "#64748b" }}>
        <p>
          Desenvolvido por <strong style={{color: colors.text}}>João Marcelo</strong>, estudante de técnico em desenvolvimento de sistemas no SENAI. |{" "}
          <a
            href="https://github.com/Jaosuzart"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.x, textDecoration: "none", fontWeight: "bold" }}
          >
            Meu GitHub
          </a>
        </p>
      </div>
    </main>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}
