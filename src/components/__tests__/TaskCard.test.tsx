import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import TaskCard from '../TaskCard';

describe('TaskCard', () => {
  const mockTask: any = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  /* eslint-enable */

  it('renders task title', () => {
    render(
      <TaskCard task={mockTask} index={0} />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('shows priority badge', () => {
    render(<TaskCard task={mockTask} index={0} />);
    expect(screen.getByText('Alta')).toBeInTheDocument();
  });

  it('renders without crashing', () => {
    render(<TaskCard task={mockTask} index={0} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
