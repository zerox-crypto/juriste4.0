
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ParticipantInfo,
  UdemyContentScores,
  DigitalToolsScores,
  IAScores,
  TimeManagementScores,
  PracticalExerciseScores,
  BlockageType,
  EvaluationLevel,
  EvaluationRecord,
} from '../types';
import {
  MAX_SCORE_UDEMY_CONTENT,
  MAX_SCORE_DIGITAL_TOOLS,
  MAX_SCORE_IA_COMPREHENSION,
  MAX_SCORE_TIME_MANAGEMENT,
  MAX_SCORE_PRACTICAL_EXERCISE,
  TOTAL_MAX_SCORE,
  SCORE_RANGES,
  UDEMY_CONTENT_CRITERIA,
  DIGITAL_TOOLS_CRITERIA,
  IA_COMPREHENSION_CRITERIA,
  TIME_MANAGEMENT_CRITERIA,
  PRACTICAL_EXERCISE_CRITERIA,
} from '../constants';
import Input from './Input';
import TextArea from './TextArea';
import ScoreInput from './ScoreInput';

interface EvaluationFormProps {
  onSave: (evaluation: EvaluationRecord) => void;
  onCancel: () => void;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({ onSave, onCancel }) => {
  const formRef = useRef<HTMLFormElement>(null); // Ref for the form element

  const [participantInfo, setParticipantInfo] = useState<ParticipantInfo>({
    name: '',
    sessionDate: new Date().toISOString().split('T')[0], // Default to today
    trainer: '',
  });

  const [udemyContent, setUdemyContent] = useState<UdemyContentScores>({
    access: 0,
    progress: 0,
    comprehension: 0,
    engagement: 0,
  });

  const [digitalTools, setDigitalTools] = useState<DigitalToolsScores>({
    identification: 0,
    practice: 0,
    utility: 0,
    autonomy: 0,
  });

  const [iaComprehension, setIaComprehension] = useState<IAScores>({
    fundamentals: 0,
    legalReasoning: 0,
    criticalThinking: 0,
    methodologicalCaution: 0,
  });

  const [timeManagement, setTimeManagement] = useState<TimeManagementScores>({
    regularity: 0,
    method: 0,
    discipline: 0,
    adjustmentCapacity: 0,
  });

  const [difficulties, setDifficulties] = useState<{
    blockageTypes: BlockageType[];
    mainBlockage: string;
  }>({
    blockageTypes: [],
    mainBlockage: '',
  });

  const [practicalExercise, setPracticalExercise] = useState<PracticalExerciseScores>({
    problemFormulation: 0,
    promptWriting: 0,
    resultExploitation: 0,
    deliverableOrganization: 0,
  });

  const [actionPlan, setActionPlan] = useState<{
    priorityObjective: string;
    toolToConsolidate: string;
    udemyModuleRecommended: string;
    deliverableExpected: string;
  }>({
    priorityObjective: '',
    toolToConsolidate: '',
    udemyModuleRecommended: '',
    deliverableExpected: '',
  });

  const [trainerObservations, setTrainerObservations] = useState<string>('');
  const [globalScore, setGlobalScore] = useState<number>(0);
  const [levelReached, setLevelReached] = useState<EvaluationLevel>(EvaluationLevel.A_ACCOMPAGNER_ETROITEMENT);

  const calculateScores = useCallback(() => {
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const sumUdemy = Object.values(udemyContent).reduce((acc, curr) => acc + (curr as number), 0);
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const sumDigitalTools = Object.values(digitalTools).reduce((acc, curr) => acc + (curr as number), 0);
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const sumIA = Object.values(iaComprehension).reduce((acc, curr) => acc + (curr as number), 0);
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const sumTimeManagement = Object.values(timeManagement).reduce((acc, curr) => acc + (curr as number), 0);
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const sumPractical = Object.values(practicalExercise).reduce((acc, curr) => acc + (curr as number), 0);

    const total = sumUdemy + sumDigitalTools + sumIA + sumTimeManagement + sumPractical;
    setGlobalScore(total);

    if (total >= SCORE_RANGES[EvaluationLevel.AUTONOME].min) {
      setLevelReached(EvaluationLevel.AUTONOME);
    } else if (total >= SCORE_RANGES[EvaluationLevel.EN_PROGRESSION].min) {
      setLevelReached(EvaluationLevel.EN_PROGRESSION);
    } else {
      setLevelReached(EvaluationLevel.A_ACCOMPAGNER_ETROITEMENT);
    }
  }, [udemyContent, digitalTools, iaComprehension, timeManagement, practicalExercise]);

  useEffect(() => {
    calculateScores();
  }, [calculateScores]);

  const handleParticipantInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setParticipantInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleScoreChange = (
    section: 'udemyContent' | 'digitalTools' | 'iaComprehension' | 'timeManagement' | 'practicalExercise',
    key: string,
    value: number,
  ) => {
    switch (section) {
      case 'udemyContent':
        setUdemyContent((prev) => ({ ...prev, [key]: value }));
        break;
      case 'digitalTools':
        setDigitalTools((prev) => ({ ...prev, [key]: value }));
        break;
      case 'iaComprehension':
        setIaComprehension((prev) => ({ ...prev, [key]: value }));
        break;
      case 'timeManagement':
        setTimeManagement((prev) => ({ ...prev, [key]: value }));
        break;
      case 'practicalExercise':
        setPracticalExercise((prev) => ({ ...prev, [key]: value }));
        break;
      default:
        break;
    }
  };

  const handleBlockageTypeChange = useCallback((type: BlockageType) => {
    setDifficulties((prev) => {
      const { blockageTypes } = prev;
      if (blockageTypes.includes(type)) {
        return { ...prev, blockageTypes: blockageTypes.filter((t) => t !== type) };
      } else {
        return { ...prev, blockageTypes: [...blockageTypes, type] };
      }
    });
  }, []); // Empty dependency array means this function is created once

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvaluation: EvaluationRecord = {
      id: `eval-${Date.now()}`,
      participantInfo,
      udemyContent,
      digitalTools,
      iaComprehension,
      timeManagement,
      difficulties,
      practicalExercise,
      globalScore,
      levelReached,
      actionPlan,
      trainerObservations,
      submissionDate: new Date().toISOString(),
    };
    onSave(newEvaluation);
    // Reset form after submission
    setParticipantInfo({ name: '', sessionDate: new Date().toISOString().split('T')[0], trainer: '' });
    setUdemyContent({ access: 0, progress: 0, comprehension: 0, engagement: 0 });
    setDigitalTools({ identification: 0, practice: 0, utility: 0, autonomy: 0 });
    setIaComprehension({ fundamentals: 0, legalReasoning: 0, criticalThinking: 0, methodologicalCaution: 0 });
    setTimeManagement({ regularity: 0, method: 0, discipline: 0, adjustmentCapacity: 0 });
    setDifficulties({ blockageTypes: [], mainBlockage: '' });
    setPracticalExercise({ problemFormulation: 0, promptWriting: 0, resultExploitation: 0, deliverableOrganization: 0 });
    setActionPlan({ priorityObjective: '', toolToConsolidate: '', udemyModuleRecommended: '', deliverableExpected: '' });
    setTrainerObservations('');
  };

  const handleExportPdf = async () => {
    if (formRef.current) {
      const filename = `Evaluation_${participantInfo.name.replace(/\s+/g, '_')}_${participantInfo.sessionDate}.pdf`;
      const opt = {
        margin: [10, 10, 10, 10], // top, left, bottom, right
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      try {
        // Use the global html2pdf instance
        await (window as any).html2pdf().set(opt).from(formRef.current).save();
        alert('Le PDF de l\'évaluation a été généré et téléchargé.');
      } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Une erreur est survenue lors de la génération du PDF.');
      }
    }
  };

  const renderScoreSection = <T extends Record<string, number>>(
    title: string,
    sectionName: keyof EvaluationRecord,
    criteria: { label: string; max: number; key: keyof T }[],
    scores: T,
    maxSectionScore: number,
  ) => {
    // Fix: Explicitly cast 'curr' to 'number' in reduce callback
    const currentSectionTotal = Object.values(scores).reduce((acc, curr) => acc + (curr as number), 0);
    return (
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">{title} — /{maxSectionScore}</h3>
        {criteria.map((criterion) => (
          <ScoreInput
            key={criterion.key as string}
            id={`${sectionName}-${criterion.key as string}`}
            label={criterion.label}
            maxScore={criterion.max}
            value={scores[criterion.key] as number}
            onChange={(e) => handleScoreChange(sectionName as any, criterion.key as string, parseInt(e.target.value, 10))}
          />
        ))}
        <p className="font-bold mt-2 text-right">Sous-total: {currentSectionTotal} /{maxSectionScore}</p>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">
        Grille d'Évaluation Individuelle
      </h1>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6 text-center">
        Session 2 — Suivi de progression & consolidation des acquis
      </h2>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Masterclass IA – Juriste 4.0
      </p>

      <form onSubmit={handleSubmit} ref={formRef} className="max-w-3xl mx-auto space-y-8">
        {/* I. IDENTIFICATION DU PARTICIPANT */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">I. Identification du Participant</h2>
          <Input
            id="name"
            label="Nom / Prénom"
            type="text"
            value={participantInfo.name}
            onChange={handleParticipantInfoChange}
            required
          />
          <Input
            id="sessionDate"
            label="Date de la session"
            type="date"
            value={participantInfo.sessionDate}
            onChange={handleParticipantInfoChange}
            required
          />
          <Input id="sessionNumber" label="Session n°" type="text" value="2" readOnly disabled />
          <Input
            id="trainer"
            label="Formateur"
            type="text"
            value={participantInfo.trainer}
            onChange={handleParticipantInfoChange}
            required
          />
          <Input id="format" label="Format" type="text" value="Session individuelle (visio)" readOnly disabled />
        </div>

        {/* II. ÉVALUATION DE LA PROGRESSION PÉDAGOGIQUE */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">II. Évaluation de la Progression Pédagogique — /40</h2>
          {renderScoreSection(
            '1. Suivi effectif du contenu Udemy',
            'udemyContent',
            UDEMY_CONTENT_CRITERIA,
            udemyContent,
            MAX_SCORE_UDEMY_CONTENT,
          )}
          {renderScoreSection(
            '2. Maîtrise des outils de productivité digitale',
            'digitalTools',
            DIGITAL_TOOLS_CRITERIA,
            digitalTools,
            MAX_SCORE_DIGITAL_TOOLS,
          )}
          {renderScoreSection(
            '3. Compréhension de l’IA & raisonnement assisté',
            'iaComprehension',
            IA_COMPREHENSION_CRITERIA,
            iaComprehension,
            MAX_SCORE_IA_COMPREHENSION,
          )}
          {renderScoreSection(
            '4. Organisation & gestion du temps',
            'timeManagement',
            TIME_MANAGEMENT_CRITERIA,
            timeManagement,
            MAX_SCORE_TIME_MANAGEMENT,
          )}
        </div>

        {/* III. DIAGNOSTIC DES DIFFICULTÉS (QUALITATIF) */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">III. Diagnostic des Difficultés (Qualitatif)</h2>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">5. Typologie des blocages (cocher)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            {Object.values(BlockageType).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`blockage-${type}`}
                  checked={difficulties.blockageTypes.includes(type)}
                  onChange={() => handleBlockageTypeChange(type)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`blockage-${type}`} className="ml-2 text-sm text-gray-700">
                  {type}
                </label>
              </div>
            ))}
          </div>
          <TextArea
            id="mainBlockage"
            label="Blocage principal identifié"
            value={difficulties.mainBlockage}
            onChange={(e) => setDifficulties((prev) => ({ ...prev, mainBlockage: e.target.value }))}
            placeholder="Décrivez le blocage principal..."
          />
        </div>

        {/* IV. ÉVALUATION PRATIQUE */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">IV. Évaluation Pratique — /20</h2>
          {renderScoreSection(
            '6. Exercice pratique guidé (live)',
            'practicalExercise',
            PRACTICAL_EXERCISE_CRITERIA,
            practicalExercise,
            MAX_SCORE_PRACTICAL_EXERCISE,
          )}
        </div>

        {/* V. SYNTHÈSE & POSITIONNEMENT */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">V. Synthèse & Positionnement</h2>
          <p className="text-xl mb-4">
            <span className="font-bold">Score global :</span> {globalScore} / {TOTAL_MAX_SCORE}
          </p>
          <div className="mb-4">
            <p className="font-bold text-lg mb-2">Niveau atteint :</p>
            {Object.values(EvaluationLevel).map((level) => {
              const range = SCORE_RANGES[level];
              const isSelected = levelReached === level;
              return (
                <div key={level} className={`flex items-center justify-center mb-1 text-base ${range.color}`}>
                  <span className={`h-3 w-3 rounded-full mr-2 ${range.dotColor} ${isSelected ? 'ring-2 ring-offset-2 ring-current' : ''}`}></span>
                  <span className={`${isSelected ? 'font-semibold' : ''}`}>{level} ({range.min}–{range.max})</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* VI. PLAN D’ACTION PERSONNALISÉ */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">VI. Plan d'Action Personnalisé</h2>
          <TextArea
            id="priorityObjective"
            label="Objectif prioritaire (7 jours)"
            value={actionPlan.priorityObjective}
            onChange={(e) => setActionPlan((prev) => ({ ...prev, priorityObjective: e.target.value }))}
          />
          <TextArea
            id="toolToConsolidate"
            label="Outil principal à consolider"
            value={actionPlan.toolToConsolidate}
            onChange={(e) => setActionPlan((prev) => ({ ...prev, toolToConsolidate: e.target.value }))}
          />
          <TextArea
            id="udemyModuleRecommended"
            label="Module Udemy recommandé"
            value={actionPlan.udemyModuleRecommended}
            onChange={(e) => setActionPlan((prev) => ({ ...prev, udemyModuleRecommended: e.target.value }))}
          />
          <TextArea
            id="deliverableExpected"
            label="Livrable attendu avant la prochaine session"
            value={actionPlan.deliverableExpected}
            onChange={(e) => setActionPlan((prev) => ({ ...prev, deliverableExpected: e.target.value }))}
          />
        </div>

        {/* VII. OBSERVATIONS DU FORMATEUR */}
        <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">VII. Observations du Formateur</h2>
          <TextArea
            id="trainerObservations"
            label="Observations"
            value={trainerObservations}
            onChange={(e) => setTrainerObservations(e.target.value)}
            placeholder="Notes du formateur..."
          />
        </div>

        <div className="flex justify-center space-x-4 sticky bottom-4 bg-gray-50 p-4 rounded-lg shadow-md md:static">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Enregistrer l'Évaluation
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-md shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            data-html2canvas-ignore="true" // Ignore this button in PDF output
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            data-html2canvas-ignore="true" // Ignore this button in PDF output
          >
            Exporter en PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default EvaluationForm;
