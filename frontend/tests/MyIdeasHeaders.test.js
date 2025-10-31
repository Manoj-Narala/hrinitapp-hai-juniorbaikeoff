import { describe, it, expect } from 'vitest';
import { mount } from '@testing-library/vue';
import MyIdeas from '../src/components/MyIdeas.vue';

const baseIdea = (overrides = {}) => ({
  id: Math.random().toString(36).slice(2),
  status: 'rejected',
  submittedBy: 'john_user',
  submittedAt: new Date().toISOString(),
  idea: { title: 'Test', ideaDescription: 'Desc', businessObjective: 'Capacity' },
  aiAnalysis: { businessValueScore: 5, costSaving: true },
  rejectionReason: 'Not aligned'
  , ...overrides
});

describe('MyIdeas dynamic headers', () => {
  it('shows Rejected By / Rejected On in rejected filter', async () => {
    const { getByText, queryByText } = mount(MyIdeas, {
      props: {
        initiatives: [baseIdea({ rejectedBy: 'po_admin', rejectedAt: new Date().toISOString() })],
        isLoading: false,
        currentUser: { username: 'john_user', role: 'USER' }
      }
    });
    // Switch filter by simulating button click
    const rejectedBtn = getByText('Rejected');
    await rejectedBtn.click();
    expect(getByText('Rejected By')).toBeTruthy();
    expect(getByText('Rejected On')).toBeTruthy();
    expect(queryByText('Approved By')).toBeNull();
  });
});
