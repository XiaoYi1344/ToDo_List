import React, { useState, useRef } from 'react'

interface Card {
  id: number
  name: string
  img: string
  color: string
  icon: string
}

interface DoorEntryProps {
  onUnlock: () => void
}

const DoorEntry: React.FC<DoorEntryProps> = ({ onUnlock }) => {
  const [cards, setCards] = useState<Card[]>([
    {
      id: 1,
      name: 'Công Việc',
      img: '/img/img5.jpeg',
      color: '#dd5640',
      icon: '/img/icon1.png'
    },
    {
      id: 2,
      name: 'Sinh Hoạt',
      img: '/img/img6.jpeg',
      color: '#58696f',
      icon: '/img/icon2.png'
    }
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newImg, setNewImg] = useState<string | null>(null)
  const [newColor, setNewColor] = useState('#ffffff')
  const [newIcon, setNewIcon] = useState<string | null>(null)

  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  type: 'img' | 'icon'
) => {
  const file = e.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'img') setNewImg(reader.result as string)
      else if (type === 'icon') setNewIcon(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
}


  const handleAddCard = () => {
    if (newName && newImg) {
      setCards([
        ...cards,
        {
          id: Date.now(),
          name: newName,
          img: newImg,
          color: newColor,
          icon: newIcon || ''
        }
      ])
      setNewName('')
      setNewImg(null)
      setIsAdding(false)
      setNewColor('#ffffff')
      setNewIcon(null)
      // Scroll to right after adding
      setTimeout(() => {
        containerRef.current?.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  const handleCardClick = (card: Card) => {
    localStorage.setItem('selectedBackground', card.img)
    localStorage.setItem('selectedColor', card.color)
    localStorage.setItem('selectedIcon', card.icon)
    onUnlock()
  }

  // Xử lý scroll kéo mượt mà bằng mouse drag
  const isDragging = React.useRef(false)
  const startX = React.useRef(0)
  const scrollLeft = React.useRef(0)

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0)
    scrollLeft.current = containerRef.current?.scrollLeft || 0
  }

  const onMouseLeave = () => {
    isDragging.current = false
  }

  const onMouseUp = () => {
    isDragging.current = false
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - (containerRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 2 // multiplier for scroll speed
    if (containerRef.current)
      containerRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-100 via-amber-200 to-green-200'>
      {/* bg-gradient-to-br from-red-100 via-yellow-100 to-orange-100 */}
      <div
        ref={containerRef}
        className='flex space-x-4 overflow-x-auto no-scrollbar cursor-grab select-none w-full h-[400px]'
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
        style={{ scrollBehavior: 'smooth' }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className='relative flex-shrink-0 w-auto h-80 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-110 mt-8 mx-5 group'
            style={{ boxShadow: '3px 4px 10px rgba(255,255,255,0.6)' }}
            onClick={() => handleCardClick(card)}
            title={card.name}
          >
            <img
              src={card.img}
              alt={card.name}
              className='w-full h-full object-cover rounded-l-lg backdrop-blur-xl bg-white/30 hover:border-white/30'
            />
            <div className='absolute left-[400px] bottom-0 inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity'>
              <div
                className='text-2xl text-white text-center p-3 rounded-lg'
                style={{
                  backgroundColor: card.color,
                  boxShadow: '2px 1px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                {card.name}
              </div>
            </div>
          </div>
        ))}

        {/* Thẻ thêm mới */}
        <div
          className='flex-shrink-0 w-60 h-80 rounded-lg bg-gray-300 flex items-center justify-center text-6xl font-bold text-gray-700 cursor-pointer hover:scale-110 transition-transform duration-300 mt-8 mx-5'
          onClick={() => setIsAdding(true)}
          title='Thêm thẻ mới'
        >
          +
        </div>
      </div>

      {/* Modal thêm thẻ */}
      {isAdding && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-sm space-y-4'>
            <h2 className='text-xl font-semibold'>Thêm thẻ mới</h2>
            <input
              type='text'
              placeholder='Tên thẻ'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className='border border-gray-300 rounded px-3 py-2 w-full'
            />
            <input
              type='file'
              accept='image/*'
              onChange={(e) => handleImageUpload(e, 'img')}
              className='w-full'
            />
            <input
              type='file'
              accept='image/*'
              onChange={(e) => handleImageUpload(e, 'icon')}
              className='w-full'
            />

            <input
              type='color'
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className='w-full h-10 rounded'
            />
            {newImg && (
              <img
                src={newImg}
                alt='preview'
                className='w-full h-40 object-cover rounded'
              />
            )}
            <div className='flex justify-between'>
              <button
                onClick={handleAddCard}
                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
              >
                Thêm
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal fullscreen ảnh */}
      {fullscreenImg && (
        <div
          className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4'
          onClick={() => setFullscreenImg(null)}
        >
          <img
            src={fullscreenImg}
            alt='fullscreen'
            className='max-h-full max-w-full rounded-lg shadow-lg'
          />
        </div>
      )}
    </div>
  )
}

export default DoorEntry
