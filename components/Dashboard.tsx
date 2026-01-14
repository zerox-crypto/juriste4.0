
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  EvaluationRecord,
  BlockageType,
  EvaluationLevel,
  UdemyContentScores,
  DigitalToolsScores,
  IAScores,
  TimeManagementScores,
  PracticalExerciseScores,
} from '../types';
import {
  SCORE_RANGES,
  MAX_SCORE_UDEMY_CONTENT,
  MAX_SCORE_DIGITAL_TOOLS,
  MAX_SCORE_IA_COMPREHENSION,
  MAX_SCORE_TIME_MANAGEMENT,
  MAX_SCORE_PRACTICAL_EXERCISE,
  TOTAL_MAX_SCORE,
} from '../constants';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  evaluations: EvaluationRecord[];
  onBack: () => void;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ evaluations, onBack }) => {
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null); // Ref for the entire dashboard printable area

  const toggleExpand = (id: string) => {
    setExpandedEvalId(expandedEvalId === id ? null : id);
  };

  const calculateAverageScores = useCallback(() => {
    if (evaluations.length === 0) return [];

    let udemyTotal = 0,
      digitalTotal = 0,
      iaTotal = 0,
      timeTotal = 0,
      practicalTotal = 0;

    evaluations.forEach((evalItem) => {
      // Fix: Explicitly cast 'curr' to 'number' in reduce callback
      udemyTotal += Object.values(evalItem.udemyContent).reduce((acc, curr) => acc + (curr as number), 0);
      // Fix: Explicitly cast 'curr' to 'number' in reduce callback
      digitalTotal += Object.values(evalItem.digitalTools).reduce((acc, curr) => acc + (curr as number), 0);
      // Fix: Explicitly cast 'curr' to 'number' in reduce callback
      iaTotal += Object.values(evalItem.iaComprehension).reduce((acc, curr) => acc + (curr as number), 0);
      // Fix: Explicitly cast 'curr' to 'number' in reduce callback
      timeTotal += Object.values(evalItem.timeManagement).reduce((acc, curr) => acc + (curr as number), 0);
      // Fix: Explicitly cast 'curr' to 'number' in reduce callback
      practicalTotal += Object.values(evalItem.practicalExercise).reduce((acc, curr) => acc + (curr as number), 0);
    });

    const numEvaluations = evaluations.length;
    return [
      { name: 'Udemy Content', average: udemyTotal / numEvaluations, max: MAX_SCORE_UDEMY_CONTENT },
      { name: 'Digital Tools', average: digitalTotal / numEvaluations, max: MAX_SCORE_DIGITAL_TOOLS },
      { name: 'IA Comprehension', average: iaTotal / numEvaluations, max: MAX_SCORE_IA_COMPREHENSION },
      { name: 'Time Management', average: timeTotal / numEvaluations, max: MAX_SCORE_TIME_MANAGEMENT },
      { name: 'Practical Exercise', average: practicalTotal / numEvaluations, max: MAX_SCORE_PRACTICAL_EXERCISE },
    ];
  }, [evaluations]);

  const calculateLevelDistribution = useCallback(() => {
    if (evaluations.length === 0) return [];

    const distribution = {
      [EvaluationLevel.AUTONOME]: 0,
      [EvaluationLevel.EN_PROGRESSION]: 0,
      [EvaluationLevel.A_ACCOMPAGNER_ETROITEMENT]: 0,
    };

    evaluations.forEach((evalItem) => {
      distribution[evalItem.levelReached]++;
    });

    return Object.entries(distribution).map(([level, count]) => ({
      name: level,
      value: count,
      color: SCORE_RANGES[level as EvaluationLevel]?.dotColor || '#cccccc',
    }));
  }, [evaluations]);

  const calculateBlockageFrequency = useCallback(() => {
    if (evaluations.length === 0) return [];

    const frequency: { [key: string]: number } = {};
    Object.values(BlockageType).forEach((type) => (frequency[type] = 0));

    evaluations.forEach((evalItem) => {
      evalItem.difficulties.blockageTypes.forEach((type) => {
        frequency[type]++;
      });
    });

    return Object.entries(frequency).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  }, [evaluations]);

  const averageScoresData = useMemo(() => calculateAverageScores(), [calculateAverageScores]);
  const levelDistributionData = useMemo(() => calculateLevelDistribution(), [calculateLevelDistribution]);
  const blockageFrequencyData = useMemo(() => calculateBlockageFrequency(), [calculateBlockageFrequency]);

  const renderScoreBreakdown = (scores: UdemyContentScores | DigitalToolsScores | IAScores | TimeManagementScores | PracticalExerciseScores) => (
    <ul className="list-disc pl-5 text-gray-700 text-sm">
      {Object.entries(scores).map(([key, value]) => (
        <li key={key}>
          <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span> {value}
        </li>
      ))}
    </ul>
  );

  const handleExportDashboardPdf = async () => {
    if (dashboardRef.current) {
      const originalScrollY = window.scrollY; // Store current scroll position
      window.scrollTo(0, 0); // Scroll to top for full capture

      const filename = `Tableau_de_Bord_Evaluations_Juriste4.0_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.pdf`;
      const opt = {
        margin: [10, 10, 10, 10], // top, left, bottom, right
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      try {
        // Use the global html2pdf instance
        await (window as any).html2pdf().set(opt).from(dashboardRef.current).save();
        alert('Le PDF du tableau de bord a été généré et téléchargé.');
      } catch (error) {
        console.error('Erreur lors de la génération du PDF du tableau de bord:', error);
        alert('Une erreur est survenue lors de la génération du PDF du tableau de bord.');
      } finally {
        window.scrollTo(0, originalScrollY); // Restore scroll position
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">
        Tableau de Bord des Évaluations
      </h1>

      <div ref={dashboardRef}> {/* This div now wraps all content to be exported */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Average Scores Bar Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Scores Moyens par Catégorie</h2>
            {evaluations.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={averageScoresData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} style={{ fontSize: '0.8rem' }} />
                  <YAxis label={{ value: 'Score Moyen', angle: -90, position: 'insideLeft' }} domain={[0, (dataMax: number) => Math.ceil(dataMax / 5) * 5]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="average" name="Score Moyen" fill="#8884d8">
                    {averageScoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée pour les scores moyens.</p>
            )}
          </div>

          {/* Level Distribution Pie Chart */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Distribution des Niveaux Atteints</h2>
            {evaluations.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={levelDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {levelDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée pour la distribution des niveaux.</p>
            )}
          </div>

          {/* Blockage Frequency Bar Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Fréquence des Blocages Identifiés</h2>
            {evaluations.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={blockageFrequencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" height={60} style={{ fontSize: '0.8rem' }} />
                  <YAxis allowDecimals={false} label={{ value: 'Nombre d\'occurrences', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Occurrences" fill="#a4de6c">
                    {blockageFrequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-600">Aucune donnée pour la fréquence des blocages.</p>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">Toutes les Évaluations</h2>
        {evaluations.length === 0 ? (
          <p className="text-center text-gray-600 p-4 bg-white rounded-lg shadow-md">
            Aucune évaluation enregistrée pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {evaluations
              .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
              .map((evaluation) => (
                <div key={evaluation.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {evaluation.participantInfo.name} -{' '}
                      <span className="text-base font-normal text-gray-600">
                        {new Date(evaluation.participantInfo.sessionDate).toLocaleDateString()}
                      </span>
                    </h3>
                    <button
                      onClick={() => toggleExpand(evaluation.id)}
                      className="px-4 py-2 bg-indigo-500 text-white text-sm rounded-md hover:bg-indigo-600 transition-colors"
                      data-html2canvas-ignore="true" // Ignore this button in PDF output
                    >
                      {expandedEvalId === evaluation.id ? 'Réduire' : 'Détails'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
                    <div>
                      <p>
                        <span className="font-semibold">Formateur:</span> {evaluation.participantInfo.trainer}
                      </p>
                      <p>
                        <span className="font-semibold">Date de soumission:</span> {new Date(evaluation.submissionDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="text-lg font-bold">
                        Score Global: {evaluation.globalScore} / {TOTAL_MAX_SCORE}
                      </p>
                      <p className={`text-lg font-bold ${SCORE_RANGES[evaluation.levelReached].color}`}>
                        Niveau: {evaluation.levelReached}
                      </p>
                    </div>
                  </div>

                  {expandedEvalId === evaluation.id && (
                    <div className="mt-4 border-t border-gray-200 pt-4 space-y-4">
                      <h4 className="text-lg font-semibold text-gray-700">Progression Pédagogique:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Suivi Udemy:</p>
                          {renderScoreBreakdown(evaluation.udemyContent)}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Outils Digitaux:</p>
                          {renderScoreBreakdown(evaluation.digitalTools)}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Compréhension IA:</p>
                          {renderScoreBreakdown(evaluation.iaComprehension)}
                        </div>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <p className="font-medium">Gestion du Temps:</p>
                          {renderScoreBreakdown(evaluation.timeManagement)}
                        </div>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-700">Évaluation Pratique:</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        {renderScoreBreakdown(evaluation.practicalExercise)}
                      </div>

                      <h4 className="text-lg font-semibold text-gray-700">Difficultés Identifiées:</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p>
                          <span className="font-medium">Types de blocage:</span>{' '}
                          {evaluation.difficulties.blockageTypes.join(', ') || 'Aucun'}
                        </p>
                        <p>
                          <span className="font-medium">Blocage principal:</span> {evaluation.difficulties.mainBlockage || 'N/A'}
                        </p>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-700">Plan d'Action Personnalisé:</h4>
                      <div className="p-3 bg-gray-50 rounded-md space-y-1">
                        <p>
                          <span className="font-medium">Objectif prioritaire (7 jours):</span> {evaluation.actionPlan.priorityObjective || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Outil principal à consolider:</span> {evaluation.actionPlan.toolToConsolidate || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Module Udemy recommandé:</span> {evaluation.actionPlan.udemyModuleRecommended || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Livrable attendu:</span> {evaluation.actionPlan.deliverableExpected || 'N/A'}
                        </p>
                      </div>

                      <h4 className="text-lg font-semibold text-gray-700">Observations du Formateur:</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p>{evaluation.trainerObservations || 'Aucune observation.'}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div> {/* End of dashboardRef content */}

      <div className="mt-8 text-center sticky bottom-4 bg-gray-50 p-4 rounded-lg shadow-md md:static flex justify-center space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          data-html2canvas-ignore="true" // Ignore this button in PDF output
        >
          Retour au Formulaire
        </button>
        {evaluations.length > 0 && (
          <button
            onClick={handleExportDashboardPdf}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            data-html2canvas-ignore="true" // Ignore this button in PDF output
          >
            Sauvegarder en PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
