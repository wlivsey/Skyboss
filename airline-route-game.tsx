import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const AirlineRouteGame = () => {
  // Add CSS variables
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --background: 222 47% 11%;
        --foreground: 210 40% 98%;
        --card: 222 40% 15%;
        --card-foreground: 210 40% 98%;
        --primary: 207 90% 54%;
        --primary-foreground: 222 47% 11%;
        --secondary: 217 33% 25%;
        --secondary-foreground: 210 40% 98%;
        --muted: 217 33% 20%;
        --muted-foreground: 215 20% 65%;
        --accent: 32 95% 58%;
        --accent-foreground: 222 47% 11%;
        --destructive: 0 84% 60%;
        --destructive-foreground: 210 40% 98%;
        --success: 142 71% 45%;
        --success-foreground: 210 40% 98%;
        --border: 217 33% 25%;
        --input: 217 33% 25%;
        --ring: 207 90% 54%;
        --radius: 0.75rem;
        --aviation-sky: 199 89% 48%;
        --aviation-ocean: 210 100% 38%;
        --aviation-midnight: 222 47% 11%;
        --aviation-silver: 210 11% 71%;
        --aviation-metal: 215 15% 50%;
        --aviation-alert: 32 95% 58%;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const [gameData, setGameData] = useState(null);
  const [gameState, setGameState] = useState('loading'); // loading, menu, playing, result
  const [gameMode, setGameMode] = useState(null); // airlines, routes, trueFalse
  const [difficulty, setDifficulty] = useState('medium');
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    loadExcelData();
  }, []);

  const loadExcelData = async () => {
    try {
      const fileResult = await window.fs.readFile('Schedule_Weekly_Summary_Report_49730.xlsx');
      const workbook = XLSX.read(fileResult, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
      
      // Parse data (skip header row)
      const routes = [];
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[1] && row[2]) {
          routes.push({
            airline: row[0],
            origin: row[1],
            destination: row[2],
            mileage: row[3],
            opsPerWeek: row[12],
            seatsPerDep: row[13]
          });
        }
      }

      // Process data for game
      const airportStats = {};
      
      routes.forEach(route => {
        if (!airportStats[route.origin]) {
          airportStats[route.origin] = {
            airlines: new Set(),
            routes: new Set(),
            totalOps: 0
          };
        }
        airportStats[route.origin].airlines.add(route.airline);
        airportStats[route.origin].routes.add(`${route.origin}-${route.destination}`);
        airportStats[route.origin].totalOps += (route.opsPerWeek || 0);
      });

      // Convert to final format
      const airports = Object.keys(airportStats).map(code => ({
        code,
        airlineCount: airportStats[code].airlines.size,
        routeCount: airportStats[code].routes.size,
        totalOps: airportStats[code].totalOps,
        airlines: Array.from(airportStats[code].airlines),
        routes: Array.from(airportStats[code].routes)
      }));

      // Categorize by size
      airports.sort((a, b) => b.totalOps - a.totalOps);
      const large = airports.slice(0, Math.floor(airports.length * 0.2));
      const medium = airports.slice(Math.floor(airports.length * 0.2), Math.floor(airports.length * 0.6));
      const small = airports.slice(Math.floor(airports.length * 0.6));

      setGameData({
        routes,
        airports: { all: airports, large, medium, small },
        airlineList: [...new Set(routes.map(r => r.airline))]
      });
      setGameState('menu');
    } catch (error) {
      console.error('Error loading data:', error);
      setGameState('error');
    }
  };

  const startGame = (mode) => {
    setGameMode(mode);
    setScore(0);
    setQuestionsAsked(0);
    setShowAnswer(false);
    generateQuestion(mode);
    setGameState('playing');
  };

  const generateQuestion = (mode) => {
    if (!gameData) return;

    const airportPool = difficulty === 'easy' ? gameData.airports.large :
                       difficulty === 'medium' ? gameData.airports.medium :
                       gameData.airports.small;

    const airport = airportPool[Math.floor(Math.random() * airportPool.length)];

    if (mode === 'airlines') {
      setCurrentQuestion({
        type: 'airlines',
        airport: airport.code,
        correctAnswer: airport.airlineCount,
        difficulty
      });
    } else if (mode === 'routes') {
      setCurrentQuestion({
        type: 'routes',
        airport: airport.code,
        correctAnswer: airport.routeCount,
        difficulty
      });
    } else if (mode === 'trueFalse') {
      const isReal = Math.random() > 0.5;
      
      if (isReal) {
        // Pick a real route
        const realRoute = gameData.routes[Math.floor(Math.random() * gameData.routes.length)];
        setCurrentQuestion({
          type: 'trueFalse',
          airline: realRoute.airline,
          origin: realRoute.origin,
          destination: realRoute.destination,
          correctAnswer: true,
          difficulty
        });
      } else {
        // Create a plausible fake route
        const airline = gameData.airlineList[Math.floor(Math.random() * gameData.airlineList.length)];
        const origin = airport.code;
        const allDestinations = [...new Set(gameData.routes.map(r => r.destination))];
        const destination = allDestinations[Math.floor(Math.random() * allDestinations.length)];
        
        // Make sure it's actually fake
        const exists = gameData.routes.some(r => 
          r.airline === airline && r.origin === origin && r.destination === destination
        );
        
        setCurrentQuestion({
          type: 'trueFalse',
          airline,
          origin,
          destination,
          correctAnswer: exists,
          difficulty
        });
      }
    }
    
    setUserAnswer('');
    setFeedback(null);
    setShowAnswer(false);
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;

    let isCorrect = false;
    
    if (currentQuestion.type === 'trueFalse') {
      isCorrect = (userAnswer === 'true' && currentQuestion.correctAnswer) || 
                  (userAnswer === 'false' && !currentQuestion.correctAnswer);
    } else {
      const numAnswer = parseInt(userAnswer);
      const correct = currentQuestion.correctAnswer;
      isCorrect = Math.abs(numAnswer - correct) <= 5;
    }

    if (isCorrect) {
      setScore(score + 1);
      setFeedback({ correct: true, message: 'Correct!' });
    } else {
      setFeedback({ correct: false, message: 'Incorrect' });
    }
    
    setShowAnswer(true);
    setQuestionsAsked(questionsAsked + 1);
  };

  const nextQuestion = () => {
    if (questionsAsked >= 10) {
      setGameState('result');
    } else {
      generateQuestion(gameMode);
    }
  };

  const backToMenu = () => {
    setGameState('menu');
    setGameMode(null);
    setScore(0);
    setQuestionsAsked(0);
  };

  if (gameState === 'loading') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-[var(--radius)] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Loading Flight Data</h2>
        </div>
      </div>
    );
  }

  if (gameState === 'error') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4">
        <div className="bg-[hsl(var(--destructive))]/20 border-2 border-[hsl(var(--destructive))] rounded-[var(--radius)] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[hsl(var(--foreground))] mb-4">Error Loading Data</h2>
          <p className="text-[hsl(var(--muted-foreground))]">Could not load the Excel file. Please make sure Schedule_Weekly_Summary_Report_49730.xlsx is uploaded.</p>
        </div>
      </div>
    );
  }

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] p-8">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-[hsl(var(--foreground))] mb-3 tracking-tight">Airport Route Trivia</h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))]">Test your knowledge of US airline routes</p>
          </div>

          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-8 mb-8 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-semibold text-[hsl(var(--card-foreground))] mb-6">Select Difficulty</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'easy', label: 'Easy', desc: 'Large Hub Airports' },
                { value: 'medium', label: 'Medium', desc: 'Medium-Sized Airports' },
                { value: 'hard', label: 'Hard', desc: 'Small Airports' }
              ].map(diff => (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value)}
                  className={`py-4 px-6 rounded-[var(--radius)] font-semibold transition-all border-2 ${
                    difficulty === diff.value
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'
                  }`}
                >
                  <div className="text-lg">{diff.label}</div>
                  <div className="text-xs mt-1 opacity-75">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <button
              onClick={() => startGame('airlines')}
              className="bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--card-foreground))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)] p-8 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all text-left"
            >
              <h3 className="text-2xl font-bold mb-3">Airline Count</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Guess how many airlines serve an airport</p>
            </button>

            <button
              onClick={() => startGame('routes')}
              className="bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--card-foreground))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)] p-8 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all text-left"
            >
              <h3 className="text-2xl font-bold mb-3">Route Count</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Guess how many routes depart from an airport</p>
            </button>

            <button
              onClick={() => startGame('trueFalse')}
              className="bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--card-foreground))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)] p-8 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all text-left"
            >
              <h3 className="text-2xl font-bold mb-3">True or False</h3>
              <p className="text-[hsl(var(--muted-foreground))]">Does this airline fly this route?</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && currentQuestion) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] p-8">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="flex justify-between items-center mb-8 text-[hsl(var(--foreground))]">
            <button
              onClick={backToMenu}
              className="px-6 py-2 bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--muted))] rounded-[var(--radius)] transition-all border border-[hsl(var(--border))]"
            >
              Back to Menu
            </button>
            <div className="text-right">
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Question {questionsAsked + 1} of 10</div>
              <div className="text-xl font-semibold">Score: {score}/{questionsAsked}</div>
            </div>
          </div>

          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-10 border border-[hsl(var(--border))]">
            {currentQuestion.type === 'airlines' && (
              <>
                <h2 className="text-3xl font-semibold text-[hsl(var(--card-foreground))] mb-10 text-center leading-relaxed">
                  How many airlines serve airport <span className="text-[hsl(var(--primary))] font-bold">{currentQuestion.airport}</span>?
                </h2>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showAnswer}
                  className="w-full p-4 text-2xl text-center rounded-[var(--radius)] bg-[hsl(var(--input))] border-2 border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--ring))] focus:outline-none transition-all disabled:opacity-50"
                  placeholder="Enter number"
                  onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
                />
              </>
            )}

            {currentQuestion.type === 'routes' && (
              <>
                <h2 className="text-3xl font-semibold text-[hsl(var(--card-foreground))] mb-10 text-center leading-relaxed">
                  How many routes depart from <span className="text-[hsl(var(--primary))] font-bold">{currentQuestion.airport}</span>?
                </h2>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  disabled={showAnswer}
                  className="w-full p-4 text-2xl text-center rounded-[var(--radius)] bg-[hsl(var(--input))] border-2 border-[hsl(var(--border))] text-[hsl(var(--foreground))] focus:border-[hsl(var(--ring))] focus:outline-none transition-all disabled:opacity-50"
                  placeholder="Enter number"
                  onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkAnswer()}
                />
              </>
            )}

            {currentQuestion.type === 'trueFalse' && (
              <>
                <h2 className="text-3xl font-semibold text-[hsl(var(--card-foreground))] mb-10 text-center leading-relaxed">
                  Does <span className="text-[hsl(var(--primary))] font-bold">{currentQuestion.airline}</span> fly from{' '}
                  <span className="text-[hsl(var(--primary))] font-bold">{currentQuestion.origin}</span> to{' '}
                  <span className="text-[hsl(var(--primary))] font-bold">{currentQuestion.destination}</span>?
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => setUserAnswer('true')}
                    disabled={showAnswer}
                    className={`py-6 rounded-[var(--radius)] font-semibold text-xl transition-all border-2 ${
                      userAnswer === 'true'
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                        : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'
                    } disabled:opacity-50`}
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => setUserAnswer('false')}
                    disabled={showAnswer}
                    className={`py-6 rounded-[var(--radius)] font-semibold text-xl transition-all border-2 ${
                      userAnswer === 'false'
                        ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                        : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'
                    } disabled:opacity-50`}
                  >
                    FALSE
                  </button>
                </div>
              </>
            )}

            {feedback && (
              <div className={`mt-8 p-5 rounded-[var(--radius)] text-center text-lg font-semibold border-2 ${
                feedback.correct 
                  ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success-foreground))] border-[hsl(var(--success))]' 
                  : 'bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive-foreground))] border-[hsl(var(--destructive))]'
              }`}>
                {feedback.message}
                {showAnswer && (
                  <div className="mt-3 text-base">
                    Correct answer: {currentQuestion.type === 'trueFalse' 
                      ? (currentQuestion.correctAnswer ? 'TRUE' : 'FALSE')
                      : currentQuestion.correctAnswer
                    }
                    {currentQuestion.type !== 'trueFalse' && ' (±5 accepted)'}
                  </div>
                )}
              </div>
            )}

            {!showAnswer ? (
              <button
                onClick={checkAnswer}
                disabled={!userAnswer}
                className="w-full mt-8 py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--aviation-sky))] disabled:bg-[hsl(var(--muted))] disabled:cursor-not-allowed text-[hsl(var(--primary-foreground))] disabled:text-[hsl(var(--muted-foreground))] font-bold text-xl rounded-[var(--radius)] transition-all"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full mt-8 py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--aviation-sky))] text-[hsl(var(--primary-foreground))] font-bold text-xl rounded-[var(--radius)] transition-all"
              >
                {questionsAsked >= 10 ? 'See Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const percentage = Math.round((score / 10) * 100);
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] p-8">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-12 border border-[hsl(var(--border))] text-center">
            <h1 className="text-5xl font-bold text-[hsl(var(--foreground))] mb-8">Game Complete</h1>
            <div className="text-8xl font-bold text-[hsl(var(--primary))] mb-6">{score}/10</div>
            <div className="text-3xl text-[hsl(var(--foreground))] mb-10">{percentage}% Correct</div>
            
            <div className="text-2xl text-[hsl(var(--muted-foreground))] mb-10">
              {percentage >= 80 ? 'Excellent performance!' :
               percentage >= 60 ? 'Great job!' :
               percentage >= 40 ? 'Not bad!' : 'Keep practicing!'}
            </div>

            <button
              onClick={backToMenu}
              className="w-full py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--aviation-sky))] text-[hsl(var(--primary-foreground))] font-bold text-xl rounded-[var(--radius)] transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AirlineRouteGame;