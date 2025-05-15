import type { TodoItemProps } from './types'
import { useState, useEffect, useRef } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css'

const TodoItem = ({ todo, onToggle, onEdit, onDelete }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newText, setNewText] = useState(todo.text)
  const [color, setColor] = useState<string>('#ffffff')

  // Bóng xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const deleteBtnRef = useRef<HTMLButtonElement>(null)
  const confirmBubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedCl = localStorage.getItem('selectedColor')
    if (savedCl) {
      setColor(savedCl)
    }
  }, [])

  // Ẩn bóng xác nhận khi click ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        confirmBubbleRef.current &&
        !confirmBubbleRef.current.contains(event.target as Node) &&
        deleteBtnRef.current &&
        !deleteBtnRef.current.contains(event.target as Node)
      ) {
        setShowDeleteConfirm(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleSave = () => {
    onEdit(todo.id, newText)
    console.log(`ToDo mới lưu: ${todo.id} ${todo.text}`)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setNewText(todo.text)
    console.log(`ToDo cũ trước khi sửa: ${todo.text}`)
    setIsEditing(false)
  }

  const confirmDelete = () => {
    onDelete(todo.id)
    console.log(
      `✅ Task đã bị xóa: ID = ${todo.id}, Name = "${todo.text}", Completed = ${todo.completed}`
    )
    setShowDeleteConfirm(false)
  }

  const cancelDelete = () => {
    console.log(`❌ Đã hủy xóa task: ${todo.id}`)
    setShowDeleteConfirm(false)
  }

  return (
    <li className='relative flex items-center space-x-4 mb-4'>
      <input
        type='checkbox'
        checked={todo.completed}
        onChange={() => {
          onToggle(todo.id)
          console.log(
            `✅ Task đã hoàn thành: ID = ${todo.id}, Name = "${todo.text}", Completed = ${!todo.completed}`
          )
        }}
        className='form-checkbox h-4 w-4'
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
          className={`flex-1 ${
            todo.completed ? 'line-through text-gray-400' : ''
          }`}
        >
          {todo.text}
        </span>
      )}

      {/* Nút Edit / Save */}
      <button
        onClick={isEditing ? handleSave : () => setIsEditing(true)}
        className='px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600'
      >
        <i className='fa-solid fa-pen-to-square mr-1'></i>
        {isEditing ? 'Save' : 'Edit'}
      </button>

      {/* Nút Delete / Cancel */}
      <div className='relative'>
        <button
          ref={deleteBtnRef}
          onClick={isEditing ? handleCancelEdit : () => setShowDeleteConfirm(!showDeleteConfirm)}
          className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600'
        >
          <i className='fa-solid fa-eraser mr-1'></i>
          {isEditing ? 'Cancel' : 'Delete'}
        </button>

        {/* Bong bóng xác nhận xóa */}
        {!isEditing && (
          <div
            ref={confirmBubbleRef}
            className={`absolute bottom-full left-1/2 transform -translate-x-1/2 bg-yellow-100 text-gray-900 p-3 rounded-lg shadow-md transition-opacity duration-300 ${
              showDeleteConfirm ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            } min-w-[200px] text-center z-10`}
          >
            <p className='mb-2 font-semibold'>Bạn có chắc muốn xóa?</p>
            <div className='flex justify-center gap-4'>
              <button
                onClick={confirmDelete}
                className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm'
              >
                Chắc
              </button>
              <button
                onClick={cancelDelete}
                className='bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm'
              >
                Không
              </button>
            </div>
            {/* Tam giác nhỏ */}
            <div
              style={{
                position: 'absolute',
                bottom: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '6px solid #fef3c7',
              }}
            />
          </div>
        )}
      </div>
    </li>
  )
}

export default TodoItem
