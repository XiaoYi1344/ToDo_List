import { useState, useEffect } from 'react'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import type { Todo } from './components/types'

type AppProps = {
  onBackToDoor: () => void
}

function App({ onBackToDoor }: AppProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [color, setColor] = useState<string>('#ffffff')

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }

    const savedBg = localStorage.getItem('selectedBackground')
    if (savedBg) {
      setBackgroundImage(savedBg)
    }

    const savedCl = localStorage.getItem('selectedColor')
    if (savedCl) {
      setColor(savedCl)
    }

  }, [])


  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos])

  const addTodo = (text: string) => {
    const newTodo = { id: Date.now(), text, completed: false }
    setTodos((prevTodos) => [...prevTodos, newTodo])
  }

  // Cập nhật trạng thái completed của todo
  const toggleTodo = (id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const editTodo = (id: number, newText: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, text: newText, type: newText } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id))
  }

  return (
    <div
      className='App min-h-screen relative items-center justify-center flex'
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* ✅ Lớp phủ mờ (blur)
      {backgroundImage && (
        <div className='absolute inset-0 bg-black/40 backdrop-blur-xs z-0'></div>
      )} */}
      <div className='relative z-10 flex justify-center items-center pt-10 px-4 w-4xl'>
        <div className='backdrop-blur-md bg-white/10 shadow-lg rounded-xl p-6 w-full max-w-4xl text-white'
        style={{border: `2px solid ${color}`,}}>
          <header>
            <h1
              className='text-white text-3xl font-bold mb-4 text-center text-shadow-xs text-shadow-amber-50'
              style={{
                color: color ? color : '#ffffff'
              }}
            >
              Todo App
            </h1>
            <TodoForm onAdd={addTodo} />
          </header>
          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onEdit={editTodo}
            onDelete={deleteTodo}
          />
          <button
        onClick={onBackToDoor}
        className="mb-4 px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700"
      >
        ← Quay lại màn hình mở cửa
      </button>
        </div>
      </div>

    </div>
  )
}

export default App
