

import { EvaluationLevel } from './types';

export const MAX_SCORE_UDEMY_CONTENT = 10;
export const MAX_SCORE_DIGITAL_TOOLS = 10;
export const MAX_SCORE_IA_COMPREHENSION = 10;
export const MAX_SCORE_TIME_MANAGEMENT = 10;
export const MAX_SCORE_PRACTICAL_EXERCISE = 20;
export const TOTAL_MAX_SCORE = 60;

export const SCORE_RANGES = {
  [EvaluationLevel.AUTONOME]: { min: 45, max: 60, color: 'text-green-600', dotColor: 'bg-green-500' },
  [EvaluationLevel.EN_PROGRESSION]: { min: 30, max: 44, color: 'text-orange-600', dotColor: 'bg-orange-500' },
  [EvaluationLevel.A_ACCOMPAGNER_ETROITEMENT]: { min: 0, max: 29, color: 'text-red-600', dotColor: 'bg-red-500' },
};

export const UDEMY_CONTENT_CRITERIA = [
  { label: 'Accès régulier au cours', max: 2, key: 'access' },
  { label: 'Avancement minimal attendu (Sections 1 à 3 entamées)', max: 3, key: 'progress' },
  { label: 'Compréhension globale (Capacité à reformuler les notions clés)', max: 3, key: 'comprehension' },
  { label: 'Engagement personnel (Prise de notes, questions formulées)', max: 2, key: 'engagement' },
];

export const DIGITAL_TOOLS_CRITERIA = [
  { label: 'Identification des outils (Capacité à nommer ≥ 2 outils)', max: 2, key: 'identification' },
  { label: 'Mise en pratique réelle (Outil testé même partiellement)', max: 3, key: 'practice' },
  { label: 'Compréhension de l’utilité (Usage aligné avec un besoin juridique)', max: 3, key: 'utility' },
  { label: 'Autonomie initiale (Réplication sans assistance)', max: 2, key: 'autonomy' },
];

export const IA_COMPREHENSION_CRITERIA = [
  { label: 'Notions fondamentales (IA générative, LLM, prompt)', max: 3, key: 'fundamentals' },
  { label: 'Raisonnement juridique (Logique structurée dans la demande)', max: 3, key: 'legalReasoning' },
  { label: 'Esprit critique (Questionnement des réponses IA)', max: 2, key: 'criticalThinking' },
  { label: 'Prudence méthodologique (Distinction IA / sources juridiques)', max: 2, key: 'methodologicalCaution' },
];

export const TIME_MANAGEMENT_CRITERIA = [
  { label: 'Régularité (Temps hebdomadaire identifié)', max: 3, key: 'regularity' },
  { label: 'Méthode de travail (Créneau dédié, outil de suivi)', max: 3, key: 'method' },
  { label: 'Discipline personnelle (Respect des engagements)', max: 2, key: 'discipline' },
  { label: 'Capacité d’ajustement (Adaptation du rythme)', max: 2, key: 'adjustmentCapacity' },
];

export const PRACTICAL_EXERCISE_CRITERIA = [
  { label: 'Formulation du problème (Question juridique claire)', max: 5, key: 'problemFormulation' },
  { label: 'Rédaction du prompt (Prompt structuré et pertinent)', max: 5, key: 'promptWriting' },
  { label: 'Exploitation du résultat (Lecture critique, tri des informations)', max: 5, key: 'resultExploitation' },
  { label: 'Organisation du livrable (Classement dans un outil)', max: 5, key: 'deliverableOrganization' },
];