import type { TodoItemProps } from './types'
import { useState, useEffect } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'

const TodoItem = ({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(todo.text)
  const [color, setColor] = useState<string>('#ffffff')

  useEffect(() => {
    const savedCl = localStorage.getItem('selectedColor')
    if (savedCl) {
      setColor(savedCl)
    }
  }, [])

  const handleSave = () => {
    onEdit(todo.id, newText)
    console.log(`ToDo mới lưu: ${todo.id} ${todo.text}`)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setNewText(todo.text)
    console.log(`ToDo cũ trước khi sửa: ${todo}`)
    setIsEditing(false)
  }

  return (
    <li className='flex items-center space-x-4 mb-4'>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={() => {
          onToggle(todo.id)
          console.log(
            `Task đã hoàn thành: ID = ${todo.id}, Name = "${todo.text}", Completed = ${!todo.completed}`
          )
        }}
        className='form-checkbox h-4 w-4'
        //  accent-green-400
        style={{ accentColor: color }}
      />
      {isEditing ? (
        <input
          type='text'
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          className='p-2 border border-gray-300 rounded-lg'
        />
      ) : (
        <span
          className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : ''}`}
        >
          {todo.text}
        </span>
      )}
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className='px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600'
      >
        <i className='fa-solid fa-pen-to-square'></i>
        {isEditing ? 'Save' : 'Edit'}
      </button>
      <button
        onClick={isEditing ? handleCancel : () => onDelete(todo.id)}
        onChange={() => {
          onDelete(todo.id)
          console.log(
            `Task đã bị xóa: ID = ${todo.id}, Name = "${todo.text}", Completed = ${!todo.completed}`
          )
        }}
        className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
      >
        <i className='fa-solid fa-eraser'></i>
        {isEditing ? 'Cancel' : 'Delete'}
      </button>
    </li>
  )
}

export default TodoItem
