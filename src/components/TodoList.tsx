import TodoItem from './TodoItem';
import type { TodoListProps } from './types';

const TodoList = ({ todos, onToggle, onEdit, onDelete }: TodoListProps) => {
  return (
    <ul>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default TodoList;
