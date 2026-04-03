import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MovingAverageFilterPanel } from './MovingAverageFilterPanel';
import { createDefaultRequest } from '@/store/defaults';

describe('MovingAverageFilterPanel', () => {
  it('adds a new ma rule', async () => {
    const user = userEvent.setup();
    const request = createDefaultRequest();
    const onChange = vi.fn();

    render(<MovingAverageFilterPanel request={request} onChange={onChange} />);

    await user.click(screen.getByLabelText('add-ma-rule'));

    expect(onChange).toHaveBeenCalledTimes(1);
    const nextRequest = onChange.mock.calls[0][0];
    expect(nextRequest.maRules).toHaveLength(request.maRules.length + 1);
  });
});
