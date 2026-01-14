

import React, { useState, useEffect, useCallback } from 'react';
import EvaluationForm from './components/EvaluationForm';
import Dashboard from './components/Dashboard';
import { EvaluationRecord } from './types';

type AppView = 'form' | 'dashboard';

const App: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [currentView, setCurrentView] = useState<AppView>('form');

  // Load evaluations from localStorage on initial mount
  useEffect(() => {
    try {
      const storedEvaluations = localStorage.getItem('juriste40Evaluations');
      if (storedEvaluations) {
        setEvaluations(JSON.parse(storedEvaluations));
      }
    } catch (error) {
      console.error('Failed to load evaluations from localStorage:', error);
    }
  }, []);

  // Save evaluations to localStorage whenever the state changes
  useEffect(() => {
    try {
      localStorage.setItem('juriste40Evaluations', JSON.stringify(evaluations));
    } catch (error) {
      console.error('Failed to save evaluations to localStorage:', error);
    }
  }, [evaluations]);

  const handleSaveEvaluation = useCallback((newEvaluation: EvaluationRecord) => {
    setEvaluations((prevEvaluations) => [...prevEvaluations, newEvaluation]);
    setCurrentView('dashboard'); // Navigate to dashboard after saving
  }, []);

  const handleCancelForm = useCallback(() => {
    setCurrentView('dashboard'); // Allow cancelling back to dashboard
  }, []);

  const handleBackToForm = useCallback(() => {
    setCurrentView('form');
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-indigo-600 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
            Juriste 4.0 Évaluation
          </h1>
          <nav className="space-x-4">
            <button
              onClick={() => setCurrentView('form')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'form' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-500 text-indigo-100'
              }`}
            >
              Formulaire
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-md transition-colors ${
                currentView === 'dashboard' ? 'bg-indigo-700 text-white' : 'hover:bg-indigo-500 text-indigo-100'
              }`}
            >
              Tableau de Bord ({evaluations.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="py-8">
        {currentView === 'form' ? (
          <EvaluationForm onSave={handleSaveEvaluation} onCancel={handleCancelForm} />
        ) : (
          <Dashboard evaluations={evaluations} onBack={handleBackToForm} />
        )}
      </main>
    </div>
  );
};

export default App;