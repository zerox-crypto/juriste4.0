

export interface ParticipantInfo {
  name: string;
  sessionDate: string;
  trainer: string;
}

export interface UdemyContentScores {
  access: number;
  progress: number;
  comprehension: number;
  engagement: number;
}

export interface DigitalToolsScores {
  identification: number;
  practice: number;
  utility: number;
  autonomy: number;
}

export interface IAScores {
  fundamentals: number;
  legalReasoning: number;
  criticalThinking: number;
  methodologicalCaution: number;
}

export interface TimeManagementScores {
  regularity: number;
  method: number;
  discipline: number;
  adjustmentCapacity: number;
}

export interface PracticalExerciseScores {
  problemFormulation: number;
  promptWriting: number;
  resultExploitation: number;
  deliverableOrganization: number;
}

export enum BlockageType {
  TECHNIQUE = 'Technique',
  METHODOLOGIQUE = 'Méthodologique',
  CONCEPTUEL = 'Conceptuel',
  ORGANISATIONNEL = 'Organisationnel',
  MOTIVATION = 'Motivation / projection professionnelle',
}

export enum EvaluationLevel {
  AUTONOME = 'Autonome',
  EN_PROGRESSION = 'En progression',
  A_ACCOMPAGNER_ETROITEMENT = 'À accompagner étroitement',
}

export interface EvaluationRecord {
  id: string;
  participantInfo: ParticipantInfo;
  udemyContent: UdemyContentScores;
  digitalTools: DigitalToolsScores;
  iaComprehension: IAScores;
  timeManagement: TimeManagementScores;
  difficulties: {
    blockageTypes: BlockageType[];
    mainBlockage: string;
  };
  practicalExercise: PracticalExerciseScores;
  globalScore: number;
  levelReached: EvaluationLevel;
  actionPlan: {
    priorityObjective: string;
    toolToConsolidate: string;
    udemyModuleRecommended: string;
    deliverableExpected: string;
  };
  trainerObservations: string;
  submissionDate: string;
}