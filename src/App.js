import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/questions`)
      .then(res => res.json())
      .then(setQuestions);
  }, []);

  const handleAnswer = (option) => {
    setSelected(option);
    fetch(`${API_URL}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionId: questions[current].id,
        selectedOption: option
      })
    })
      .then(res => res.json())
      .then(data => setResult(data.correct));
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const q = questions[current];

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Quiz App</h2>
      <div>
        <h3>{q.question}</h3>
        {['A', 'B', 'C', 'D'].map(opt => (
          <button
            key={opt}
            style={{
              display: 'block',
              margin: '8px 0',
              background: selected === opt ? '#ddd' : '#fff'
            }}
            onClick={() => handleAnswer(opt)}
            disabled={!!result}
          >
            {q[`option_${opt.toLowerCase()}`]}
          </button>
        ))}
        {result !== null && (
          <div>
            <p>{result ? 'Correct!' : 'Wrong!'}</p>
            <button onClick={() => {
              setCurrent(c => c + 1);
              setSelected('');
              setResult(null);
            }} disabled={current === questions.length - 1}>
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;