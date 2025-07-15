import { render, screen } from '@testing-library/react';
import KanbanColumn from '../KanbanColumn';
import { DndContext } from '@dnd-kit/core';

describe('KanbanColumn', () => {
  const baseTask = {
    description: '',
    createdAt: new Date(),
    updatedAt: new Date()
  } as const;

  const mockTasks = [
    { id: '1', title: 'Task 1', status: 'todo', priority: 'medium', ...baseTask },
    { id: '2', title: 'Task 2', status: 'todo', priority: 'high', ...baseTask }
  ] as any;

  it('renders column title', () => {
    render(
      <DndContext>
        <KanbanColumn 
          title="Test Column" 
          tasks={mockTasks} 
          status="todo" 
          droppableId="test-column" 
        />
      </DndContext>
    );
    expect(screen.getByText('Test Column')).toBeInTheDocument();
  });

  it('shows correct number of tasks', () => {
    render(
      <DndContext>
        <KanbanColumn 
          title="Test Column" 
          tasks={mockTasks} 
          status="todo" 
          droppableId="test-column" 
        />
      </DndContext>
    );
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders all tasks', () => {
    render(
      <DndContext>
        <KanbanColumn 
          title="Test Column" 
          tasks={mockTasks} 
          status="todo" 
          droppableId="test-column" 
        />
      </DndContext>
    );
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
