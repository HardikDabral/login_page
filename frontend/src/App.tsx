import React from 'react';
import { StrictMode } from 'react';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <StrictMode>
      <div className="App">
        <LoginForm />
      </div>
    </StrictMode>
  );
}

export default App;
