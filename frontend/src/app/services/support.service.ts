import { Injectable } from '@angular/core';

export interface Query {
  id: number;
  user: string;
  question: string;
  response?: string;
  status: 'Pending' | 'Resolved';
}

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  private queries: Query[] = [
    { id: 1, user: 'Alice', question: 'How do I reset my password?', status: 'Pending' },
    { id: 2, user: 'Bob', question: 'Can I upgrade my subscription?', status: 'Pending' },
    { id: 3, user: 'Charlie', question: 'What is the refund policy?', status: 'Resolved', response: 'You can request a refund within 30 days.' },
  ];

  getQueries(): Query[] {
    return this.queries;
  }

  respondToQuery(id: number, response: string): void {
    const query = this.queries.find((q) => q.id === id);
    if (query) {
      query.response = response;
      query.status = 'Resolved';
    }
  }
}
