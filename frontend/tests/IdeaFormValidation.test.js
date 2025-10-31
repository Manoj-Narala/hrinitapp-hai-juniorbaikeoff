import { describe, it, expect } from 'vitest';
import { mount } from '@testing-library/vue';
import IdeaForm from '../src/components/IdeaForm.vue';

// Stub MessageBox to silence
const MessageBox = {
  template: '<div></div>'
};

describe('IdeaForm validation', () => {
  it('disables submit until required fields provided', async () => {
    const { getByText, getByLabelText } = mount(IdeaForm, {
      global: { components: { MessageBox } }
    });
    const submitBtn = getByText(/Generate Analysis/i);
    expect(submitBtn).toBeDisabled();
    await getByLabelText('Title *').setValue('My Title');
    await getByLabelText('Description of the Idea *').setValue('Some description');
    await getByLabelText('Business Objective *').dispatchEvent(new Event('change'));
    // set select value manually (testing-library limitations)
    const select = getByLabelText('Business Objective *');
    select.value = 'Capacity';
    await select.dispatchEvent(new Event('input'));
    expect(submitBtn.disabled).toBe(false);
  });
});
