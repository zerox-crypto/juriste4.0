

import React from 'react';

interface ScoreInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  maxScore: number;
}

const ScoreInput: React.FC<ScoreInputProps> = ({ label, id, maxScore, value, onChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let score = parseInt(e.target.value, 10);
    if (isNaN(score)) score = 0;
    score = Math.max(0, Math.min(score, maxScore)); // Ensure score is within 0 and maxScore
    onChange?.({ ...e, target: { ...e.target, value: String(score) } });
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <label htmlFor={id} className="block text-sm text-gray-700 w-3/4">
        {label}
      </label>
      <div className="flex items-center w-1/4">
        <input
          id={id}
          type="number"
          min="0"
          max={maxScore.toString()}
          value={value}
          onChange={handleChange}
          className="w-16 text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-1 mr-2"
          {...props}
        />
        <span className="text-gray-500">/{maxScore}</span>
      </div>
    </div>
  );
};

export default ScoreInput;