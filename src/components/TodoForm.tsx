import { useState, useEffect } from 'react'
import type { TodoFormProps } from './types'
import '../form.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const TodoForm = ({ onAdd }: TodoFormProps) => {
  const [input, setInput] = useState('')
  const [icon, setIcon] = useState<string | null>(null)
  const [color, setColor] = useState<string>('#ffffff')
  const [isHover, setIsHover] = useState(false)

  useEffect(() => {
    const savedI = localStorage.getItem('selectedIcon')
    if (savedI) {
      setIcon(savedI)
    }

    const savedCl = localStorage.getItem('selectedColor')
    if (savedCl) {
      setColor(savedCl)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onAdd(input)
      setInput('')
      console.log(`ToDo mới thêm: ${input}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex justify-center items-center mb-4'
    >
      <input
        id='text'
        type='text'
        placeholder='Thêm tên công việc'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className='w-[200px] md:w-[400px] lg:w-[500px] p-2 rounded shadow transition duration-500 hover:-translate-y-1 focus:px-4 focus:mr-6 focus:scale-110 hover:outline-2 hover:outline-black focus:outline-1 focus:outline-black bg-black/20'
        style={{
          fontFamily: `'Times New Roman', serif`,
          cursor: 'pointer'
        }}
      />
      <button
        type='submit'
        className='w-[50px] md:w-[70px] lg:w-[80px] group flex items-center gap-1 active:scale-95 transition-all duration-200 text-white font-semibold px-2 py-2 rounded shadow-md relative overflow-hidden ml-1'
        style={{
          backgroundColor: color,
          cursor: 'pointer'
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* Lớp phủ đen */}
        <span
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isHover ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.10)',
            transition: 'background-color 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}
        >
          {icon ? (
            <img src={icon} alt='icon' className='w-5 h-5  hidden md:inline' />
          ) : (
            <i className='fas fa-paw text-white text-lg  hidden md:inline'></i>
          )}
          <span>Add</span>
        </div>
      </button>
    </form>
  )
}

export default TodoForm
