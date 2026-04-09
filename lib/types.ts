export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface PredefinedEntry {
  trigger: string;
  response: string;
  followUps: string[];
}
