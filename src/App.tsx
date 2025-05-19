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
  const trimmedText = text.trim()

  // Tìm các công việc trùng tên
  const duplicatedTodos = todos.filter(todo => todo.text === trimmedText)

  if (duplicatedTodos.length > 0) {
    const completedTodo = duplicatedTodos.find(todo => todo.completed === true)

    if (completedTodo) {
      const confirmDelete = window.confirm(
        `Công việc "${trimmedText}" đã hoàn thành. Bạn có muốn xóa công việc này và thêm công việc mới không?`
      )

      if (confirmDelete) {
        setTodos(prevTodos => [
          ...prevTodos.filter(todo => todo.id !== completedTodo.id),
          { id: Date.now(), text: trimmedText, completed: false }
        ])
        alert('Đã xóa công việc cũ và thêm công việc mới.')
      } else {
        alert('Không thêm công việc mới.')
      }

      return
    } else {
      const remainingTodos = todos.filter(todo => todo.text !== trimmedText)
      const reorderedTodos = [...duplicatedTodos, ...remainingTodos]
      setTodos(reorderedTodos)

      alert('Công việc này đã tồn tại và được đưa lên đầu danh sách.')
      return
    }
  }

  const newTodo = { id: Date.now(), text: trimmedText, completed: false }
  setTodos(prevTodos => [...prevTodos, newTodo])
}


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

  const handleBackToDoor = () => {
    console.log('*Thông báo*:Bạn vừa quay lại trang mở đầu. Mời bạn chọn hình nền và chế độ màn hình')
    onBackToDoor()
  }

  return (
    <div
      className='App overflow-x-hidden min-h-screen relative items-center justify-center flex'
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* {backgroundImage && (
        <div className='absolute inset-0 bg-black/40 backdrop-blur-xs z-0'></div>
      )} */}
      <div className='relative z-10 flex justify-center items-center pt-10 px-4 w-md md:w-[800px] lg:w-[1500px]'>
        <div
          className='backdrop-blur-md bg-white/10 shadow-lg rounded-xl p-6 w-full max-w-4xl text-white'
          style={{ border: `2px solid ${color}` }}
        >
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
            onClick={handleBackToDoor}
            className='mb-4 px-4 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700'
          >
            ← <span className='hidden md:inline'>Quay lại màn hình mở cửa</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
