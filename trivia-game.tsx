import React, { useState, useEffect } from 'react';

const TriviaGame = () => {
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
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Question bank organized by category and difficulty
  const questionBank = {
    science: {
      easy: [
        { question: "What planet is known as the Red Planet?", answers: ["Mars", "Venus", "Jupiter", "Saturn"], correct: 0 },
        { question: "What is H2O commonly known as?", answers: ["Water", "Oxygen", "Hydrogen", "Salt"], correct: 0 },
        { question: "How many bones are in the adult human body?", answers: ["206", "156", "306", "256"], correct: 0 },
        { question: "What is the center of an atom called?", answers: ["Nucleus", "Electron", "Proton", "Neutron"], correct: 0 },
        { question: "What gas do plants absorb from the atmosphere?", answers: ["Carbon Dioxide", "Oxygen", "Nitrogen", "Helium"], correct: 0 },
      ],
      medium: [
        { question: "What is the speed of light in vacuum?", answers: ["299,792 km/s", "199,792 km/s", "399,792 km/s", "99,792 km/s"], correct: 0 },
        { question: "What is the hardest natural substance on Earth?", answers: ["Diamond", "Gold", "Iron", "Quartz"], correct: 0 },
        { question: "What type of animal is a Komodo dragon?", answers: ["Lizard", "Snake", "Dragon", "Dinosaur"], correct: 0 },
        { question: "What is the most abundant gas in Earth's atmosphere?", answers: ["Nitrogen", "Oxygen", "Carbon Dioxide", "Argon"], correct: 0 },
        { question: "How many chromosomes do humans have?", answers: ["46", "23", "48", "44"], correct: 0 },
      ],
      hard: [
        { question: "What is the half-life of Carbon-14?", answers: ["5,730 years", "10,000 years", "2,500 years", "1,200 years"], correct: 0 },
        { question: "What particle is responsible for the Higgs field?", answers: ["Higgs Boson", "Electron", "Photon", "Gluon"], correct: 0 },
        { question: "What is the smallest unit of life?", answers: ["Cell", "Atom", "Molecule", "Organism"], correct: 0 },
        { question: "What is the phenomenon where light bends around massive objects?", answers: ["Gravitational Lensing", "Refraction", "Diffraction", "Reflection"], correct: 0 },
        { question: "What element has atomic number 79?", answers: ["Gold", "Silver", "Platinum", "Mercury"], correct: 0 },
      ],
    },
    history: {
      easy: [
        { question: "In what year did World War II end?", answers: ["1945", "1944", "1946", "1943"], correct: 0 },
        { question: "Who was the first President of the United States?", answers: ["George Washington", "Thomas Jefferson", "John Adams", "Benjamin Franklin"], correct: 0 },
        { question: "What ancient wonder is located in Egypt?", answers: ["Great Pyramid of Giza", "Colossus of Rhodes", "Hanging Gardens", "Lighthouse of Alexandria"], correct: 0 },
        { question: "What year did the Titanic sink?", answers: ["1912", "1910", "1915", "1920"], correct: 0 },
        { question: "Who painted the Mona Lisa?", answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 0 },
      ],
      medium: [
        { question: "What empire was ruled by Julius Caesar?", answers: ["Roman Empire", "Greek Empire", "Persian Empire", "Egyptian Empire"], correct: 0 },
        { question: "When did the Berlin Wall fall?", answers: ["1989", "1987", "1991", "1985"], correct: 0 },
        { question: "Who was the first person to walk on the moon?", answers: ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "John Glenn"], correct: 0 },
        { question: "What year did the American Civil War start?", answers: ["1861", "1865", "1850", "1870"], correct: 0 },
        { question: "Who discovered penicillin?", answers: ["Alexander Fleming", "Louis Pasteur", "Marie Curie", "Isaac Newton"], correct: 0 },
      ],
      hard: [
        { question: "What year did the Byzantine Empire fall?", answers: ["1453", "1400", "1500", "1492"], correct: 0 },
        { question: "Who was the last Tsar of Russia?", answers: ["Nicholas II", "Alexander III", "Peter the Great", "Ivan the Terrible"], correct: 0 },
        { question: "In what year was the Magna Carta signed?", answers: ["1215", "1315", "1115", "1415"], correct: 0 },
        { question: "What ancient civilization built Machu Picchu?", answers: ["Inca", "Aztec", "Maya", "Olmec"], correct: 0 },
        { question: "Who was the longest-reigning British monarch before Elizabeth II?", answers: ["Queen Victoria", "King George III", "King Henry VIII", "Queen Elizabeth I"], correct: 0 },
      ],
    },
    geography: {
      easy: [
        { question: "What is the capital of France?", answers: ["Paris", "London", "Berlin", "Rome"], correct: 0 },
        { question: "Which continent is the largest by land area?", answers: ["Asia", "Africa", "North America", "Europe"], correct: 0 },
        { question: "What is the longest river in the world?", answers: ["Nile", "Amazon", "Mississippi", "Yangtze"], correct: 0 },
        { question: "What ocean is the largest?", answers: ["Pacific", "Atlantic", "Indian", "Arctic"], correct: 0 },
        { question: "How many continents are there?", answers: ["7", "5", "6", "8"], correct: 0 },
      ],
      medium: [
        { question: "What is the capital of Australia?", answers: ["Canberra", "Sydney", "Melbourne", "Brisbane"], correct: 0 },
        { question: "What desert is the largest in the world?", answers: ["Antarctic Desert", "Sahara Desert", "Arabian Desert", "Gobi Desert"], correct: 0 },
        { question: "What is the smallest country in the world?", answers: ["Vatican City", "Monaco", "San Marino", "Liechtenstein"], correct: 0 },
        { question: "Mount Everest is located in which mountain range?", answers: ["Himalayas", "Andes", "Alps", "Rockies"], correct: 0 },
        { question: "What country has the most natural lakes?", answers: ["Canada", "USA", "Russia", "Finland"], correct: 0 },
      ],
      hard: [
        { question: "What is the deepest point in Earth's oceans?", answers: ["Mariana Trench", "Tonga Trench", "Java Trench", "Philippine Trench"], correct: 0 },
        { question: "What capital city sits at the highest elevation?", answers: ["La Paz", "Quito", "Bogotá", "Thimphu"], correct: 0 },
        { question: "How many time zones does Russia have?", answers: ["11", "9", "13", "7"], correct: 0 },
        { question: "What is the only sea without any coasts?", answers: ["Sargasso Sea", "Dead Sea", "Caspian Sea", "Aral Sea"], correct: 0 },
        { question: "What strait separates Europe from Africa?", answers: ["Strait of Gibraltar", "Bosporus Strait", "Strait of Hormuz", "Bering Strait"], correct: 0 },
      ],
    },
    movies: {
      easy: [
        { question: "Who played Iron Man in the Marvel Cinematic Universe?", answers: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], correct: 0 },
        { question: "What movie features the line 'May the Force be with you'?", answers: ["Star Wars", "Star Trek", "Guardians of the Galaxy", "Interstellar"], correct: 0 },
        { question: "What animated movie features a character named Simba?", answers: ["The Lion King", "Aladdin", "Beauty and the Beast", "Frozen"], correct: 0 },
        { question: "Who directed Jurassic Park?", answers: ["Steven Spielberg", "James Cameron", "Peter Jackson", "George Lucas"], correct: 0 },
        { question: "What year was the first Toy Story movie released?", answers: ["1995", "1993", "1997", "1990"], correct: 0 },
      ],
      medium: [
        { question: "What movie won the first Academy Award for Best Picture?", answers: ["Wings", "Sunrise", "The Jazz Singer", "Metropolis"], correct: 0 },
        { question: "Who played Jack in Titanic?", answers: ["Leonardo DiCaprio", "Brad Pitt", "Tom Cruise", "Johnny Depp"], correct: 0 },
        { question: "What film did Christopher Nolan direct in 2010?", answers: ["Inception", "The Dark Knight", "Interstellar", "The Prestige"], correct: 0 },
        { question: "In The Matrix, what color pill does Neo take?", answers: ["Red", "Blue", "Green", "Yellow"], correct: 0 },
        { question: "Who composed the music for The Lord of the Rings trilogy?", answers: ["Howard Shore", "John Williams", "Hans Zimmer", "James Horner"], correct: 0 },
      ],
      hard: [
        { question: "What was Quentin Tarantino's first feature film?", answers: ["Reservoir Dogs", "Pulp Fiction", "Kill Bill", "Jackie Brown"], correct: 0 },
        { question: "What film won the Palme d'Or at Cannes in 2019?", answers: ["Parasite", "Portrait of a Lady on Fire", "The Irishman", "Once Upon a Time in Hollywood"], correct: 0 },
        { question: "Who was the first woman to win the Academy Award for Best Director?", answers: ["Kathryn Bigelow", "Sofia Coppola", "Jane Campion", "Chloé Zhao"], correct: 0 },
        { question: "What is the highest-grossing R-rated movie of all time?", answers: ["Joker", "Deadpool", "The Matrix Reloaded", "It"], correct: 0 },
        { question: "In what year was the first Academy Awards ceremony held?", answers: ["1929", "1927", "1931", "1935"], correct: 0 },
      ],
    },
    technology: {
      easy: [
        { question: "What does CPU stand for?", answers: ["Central Processing Unit", "Central Program Utility", "Computer Personal Unit", "Central Processor Unit"], correct: 0 },
        { question: "Who co-founded Apple Inc. with Steve Jobs?", answers: ["Steve Wozniak", "Bill Gates", "Tim Cook", "Elon Musk"], correct: 0 },
        { question: "What year was the iPhone first released?", answers: ["2007", "2005", "2009", "2010"], correct: 0 },
        { question: "What does WWW stand for?", answers: ["World Wide Web", "World Web Wide", "Wide World Web", "Web World Wide"], correct: 0 },
        { question: "What company developed the Android operating system?", answers: ["Google", "Apple", "Microsoft", "Samsung"], correct: 0 },
      ],
      medium: [
        { question: "What programming language is known for its use in web development and has a coffee-related name?", answers: ["Java", "Python", "Ruby", "PHP"], correct: 0 },
        { question: "What does RAM stand for?", answers: ["Random Access Memory", "Rapid Access Memory", "Read Access Memory", "Random Array Memory"], correct: 0 },
        { question: "Who is credited with inventing the World Wide Web?", answers: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Mark Zuckerberg"], correct: 0 },
        { question: "What was the first commercially successful video game?", answers: ["Pong", "Space Invaders", "Pac-Man", "Tetris"], correct: 0 },
        { question: "What does HTTP stand for?", answers: ["HyperText Transfer Protocol", "HyperText Transmission Protocol", "HighText Transfer Protocol", "HyperTech Transfer Protocol"], correct: 0 },
      ],
      hard: [
        { question: "What year was the first computer bug found?", answers: ["1947", "1950", "1945", "1952"], correct: 0 },
        { question: "What is the name of the first electronic general-purpose computer?", answers: ["ENIAC", "UNIVAC", "EDVAC", "Colossus"], correct: 0 },
        { question: "Who invented the first mechanical computer?", answers: ["Charles Babbage", "Alan Turing", "Ada Lovelace", "John von Neumann"], correct: 0 },
        { question: "What does SQL stand for?", answers: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"], correct: 0 },
        { question: "What was the first domain name ever registered?", answers: ["symbolics.com", "google.com", "apple.com", "ibm.com"], correct: 0 },
      ],
    },
  };

  const [gameState, setGameState] = useState('menu'); // menu, playing, result
  const [category, setCategory] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [userAnswer, setUserAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAsked, setQuestionsAsked] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const categories = [
    { id: 'science', name: 'Science', emoji: '🔬', desc: 'Physics, Chemistry, Biology' },
    { id: 'history', name: 'History', emoji: '📜', desc: 'World events and figures' },
    { id: 'geography', name: 'Geography', emoji: '🌍', desc: 'Countries, cities, landmarks' },
    { id: 'movies', name: 'Movies', emoji: '🎬', desc: 'Film trivia and actors' },
    { id: 'technology', name: 'Technology', emoji: '💻', desc: 'Computing and innovation' },
  ];

  const startGame = (selectedCategory) => {
    setCategory(selectedCategory);
    const questions = questionBank[selectedCategory][difficulty];
    // Shuffle and select 10 questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setSelectedQuestions(shuffled.slice(0, Math.min(10, shuffled.length)));
    setScore(0);
    setQuestionsAsked(0);
    setCurrentQuestionIndex(0);
    setUserAnswer(null);
    setShowAnswer(false);
    setGameState('playing');
  };

  const checkAnswer = () => {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowAnswer(true);
    setQuestionsAsked(questionsAsked + 1);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 >= selectedQuestions.length) {
      setGameState('result');
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer(null);
      setShowAnswer(false);
    }
  };

  const backToMenu = () => {
    setGameState('menu');
    setCategory(null);
    setScore(0);
    setQuestionsAsked(0);
    setUserAnswer(null);
    setShowAnswer(false);
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] p-8">
        <div className="max-w-6xl mx-auto pt-8">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-[hsl(var(--foreground))] mb-3 tracking-tight">Trivia Challenge</h1>
            <p className="text-xl text-[hsl(var(--muted-foreground))]">Test your knowledge across multiple categories</p>
          </div>

          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-8 mb-8 border border-[hsl(var(--border))]">
            <h2 className="text-2xl font-semibold text-[hsl(var(--card-foreground))] mb-6">Select Difficulty</h2>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'easy', label: 'Easy', desc: 'Perfect for beginners' },
                { value: 'medium', label: 'Medium', desc: 'A good challenge' },
                { value: 'hard', label: 'Hard', desc: 'For trivia masters' }
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

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))] mb-6">Choose a Category</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => startGame(cat.id)}
                className="bg-[hsl(var(--card))] hover:bg-[hsl(var(--accent))] text-[hsl(var(--card-foreground))] hover:text-[hsl(var(--accent-foreground))] rounded-[var(--radius)] p-8 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all text-left"
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                <p className="text-[hsl(var(--muted-foreground))]">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedQuestions.length > 0) {
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correct;

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
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Question {currentQuestionIndex + 1} of {selectedQuestions.length}</div>
              <div className="text-xl font-semibold">Score: {score}/{questionsAsked}</div>
            </div>
          </div>

          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-10 border border-[hsl(var(--border))]">
            <div className="mb-4 text-[hsl(var(--primary))] font-semibold text-sm uppercase tracking-wide">
              {categories.find(c => c.id === category)?.name} - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </div>

            <h2 className="text-3xl font-semibold text-[hsl(var(--card-foreground))] mb-10 leading-relaxed">
              {currentQuestion.question}
            </h2>

            <div className="grid gap-4 mb-6">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => !showAnswer && setUserAnswer(index)}
                  disabled={showAnswer}
                  className={`p-4 rounded-[var(--radius)] font-semibold text-lg transition-all border-2 text-left ${
                    showAnswer
                      ? index === currentQuestion.correct
                        ? 'bg-[hsl(var(--success))]/20 border-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'
                        : index === userAnswer
                        ? 'bg-[hsl(var(--destructive))]/20 border-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))]'
                        : 'bg-[hsl(var(--secondary))] border-[hsl(var(--border))] text-[hsl(var(--secondary-foreground))] opacity-50'
                      : userAnswer === index
                      ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]'
                      : 'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--border))] hover:border-[hsl(var(--primary))]'
                  } disabled:cursor-default`}
                >
                  {answer}
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className={`p-5 rounded-[var(--radius)] text-center text-lg font-semibold border-2 mb-6 ${
                isCorrect
                  ? 'bg-[hsl(var(--success))]/20 text-[hsl(var(--success-foreground))] border-[hsl(var(--success))]'
                  : 'bg-[hsl(var(--destructive))]/20 text-[hsl(var(--destructive-foreground))] border-[hsl(var(--destructive))]'
              }`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </div>
            )}

            {!showAnswer ? (
              <button
                onClick={checkAnswer}
                disabled={userAnswer === null}
                className="w-full py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--aviation-sky))] disabled:bg-[hsl(var(--muted))] disabled:cursor-not-allowed text-[hsl(var(--primary-foreground))] disabled:text-[hsl(var(--muted-foreground))] font-bold text-xl rounded-[var(--radius)] transition-all"
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="w-full py-4 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--aviation-sky))] text-[hsl(var(--primary-foreground))] font-bold text-xl rounded-[var(--radius)] transition-all"
              >
                {currentQuestionIndex + 1 >= selectedQuestions.length ? 'See Results' : 'Next Question'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'result') {
    const percentage = Math.round((score / selectedQuestions.length) * 100);
    return (
      <div className="min-h-screen bg-[hsl(var(--background))] p-8">
        <div className="max-w-3xl mx-auto pt-8">
          <div className="bg-[hsl(var(--card))] rounded-[var(--radius)] p-12 border border-[hsl(var(--border))] text-center">
            <h1 className="text-5xl font-bold text-[hsl(var(--foreground))] mb-8">Quiz Complete!</h1>
            <div className="text-8xl font-bold text-[hsl(var(--primary))] mb-6">{score}/{selectedQuestions.length}</div>
            <div className="text-3xl text-[hsl(var(--foreground))] mb-10">{percentage}% Correct</div>

            <div className="text-2xl text-[hsl(var(--muted-foreground))] mb-10">
              {percentage >= 90 ? '🏆 Outstanding!' :
               percentage >= 70 ? '🌟 Great job!' :
               percentage >= 50 ? '👍 Not bad!' : '📚 Keep practicing!'}
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

export default TriviaGame;
