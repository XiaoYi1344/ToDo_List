export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  // type: string;
}

export interface TodoFormProps {
  onAdd: (text: string) => void; // Callback thêm todo
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}


