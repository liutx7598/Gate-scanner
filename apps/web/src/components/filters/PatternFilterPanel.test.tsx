import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PatternFilterPanel } from './PatternFilterPanel';
import { createDefaultRequest } from '@/store/defaults';

describe('PatternFilterPanel', () => {
  it('toggles selected patterns', async () => {
    const user = userEvent.setup();
    const request = createDefaultRequest();
    const onChange = vi.fn();

    render(<PatternFilterPanel request={request} onChange={onChange} />);

    await user.click(screen.getByLabelText('W底'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].patterns).toEqual(['W_BOTTOM']);
  });
});
