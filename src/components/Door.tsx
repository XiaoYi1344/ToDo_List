import React, { useState, useRef, useEffect } from 'react'

interface Card {
  id: number
  name: string
  img_l: string
  img_d: string
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
      img_l: '/img/img5.jpeg',
      img_d: '/img/img5_dark.jpg',
      color: '#dd5640',
      icon: '/img/icon1.png'
    },
    {
      id: 2,
      name: 'Sinh Hoạt',
      img_l: '/img/img7.jpeg',
      img_d: '/img/img7_dark.jpeg',
      color: '#58696f',
      icon: '/img/icon7.png'
    }
  ])

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newImg_L, setNewImg_L] = useState<string | null>(null)
  const [newImg_D, setNewImg_D] = useState<string | null>(null)
  const [newColor, setNewColor] = useState('#ffffff')
  const [newIcon, setNewIcon] = useState<string | null>(null)
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [triggerRotation, setTriggerRotation] = useState<boolean>(false)
  const theme = isDarkMode ? 'dark' : 'light'

  const containerRef = useRef<HTMLDivElement>(null)

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'img' | 'icon' | 'img_d'
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'img') setNewImg_L(reader.result as string)
        else if (type === 'icon') setNewIcon(reader.result as string)
        else if (type === 'img_d') setNewImg_D(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCard = () => {
    if (newName && newImg_L) {
      setCards([
        ...cards,
        {
          id: Date.now(),
          name: newName,
          img_l: newImg_L,
          img_d: newImg_D || '',
          color: newColor,
          icon: newIcon || ''
        }
      ])
      setNewName('')
      setNewImg_L(null)
      setNewImg_D(null)
      setIsAdding(false)
      setNewColor('#ffffff')
      setNewIcon(null)

      setTimeout(() => {
        containerRef.current?.scrollTo({
          left: containerRef.current.scrollWidth,
          behavior: 'smooth'
        })
      }, 100)
    }
  }

  const handleCardClick = (card: Card) => {
    const selectedImage = isDarkMode && card.img_d ? card.img_d : card.img_l
    localStorage.setItem('selectedBackground', selectedImage)
    localStorage.setItem('selectedColor', card.color)
    localStorage.setItem('selectedIcon', card.icon)
    onUnlock()
  }

  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

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
    const walk = (x - startX.current) * 2
    if (containerRef.current)
      containerRef.current.scrollLeft = scrollLeft.current - walk
  }

  useEffect(() => {
    console.log(`Bạn vừa chuyển chế độ: ${theme}`)
  }, [theme])

  useEffect(() => {
  localStorage.setItem('cards', JSON.stringify(cards))
}, [cards])

useEffect(() => {
  const storedCards = localStorage.getItem('cards')
  if (storedCards) {
    setCards(JSON.parse(storedCards))
  }
}, [])

  const handleToggleMode = () => {
    setIsDarkMode(!isDarkMode)
    setTriggerRotation(true)
    setTimeout(() => setTriggerRotation(false), 600) // thời gian trùng với duration: 0.6s
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-amber-500 via-amber-700 to-green-700 text-white'
          : 'bg-gradient-to-br from-amber-100 via-amber-200 to-green-200 text-black'
      }`}
    >
      <button
        onClick={handleToggleMode}
        className={`mb-4 px-6 py-3 rounded font-semibold text-lg shadow-lg transition-all duration-300 ${
          isDarkMode
            ? 'bg-yellow-500 hover:bg-yellow-400'
            : 'bg-gray-800 text-white hover:bg-gray-700'
        } ${triggerRotation ? 'animate-spin-slow' : ''}`}
      >
        {isDarkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
      </button>

      <p className='text-xl'>
        Chế độ hiện tại: <strong>{theme.toUpperCase()}</strong>
      </p>

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
            className={`relative flex-shrink-0 w-auto h-80 rounded-lg shadow-lg cursor-pointer transform transition-transform duration-500 hover:scale-110 mt-8 mx-5 group ${
              triggerRotation ? 'rotate-card' : ''
            }`}
            style={{ boxShadow: '3px 4px 10px rgba(255,255,255,0.6)' }}
            onClick={() => handleCardClick(card)}
            title={card.name}
          >
            <img
              src={isDarkMode && card.img_d ? card.img_d : card.img_l}
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

        <div
          className='flex-shrink-0 w-60 h-80 rounded-lg bg-gray-300 flex items-center justify-center text-6xl font-bold text-gray-700 cursor-pointer hover:scale-110 transition-transform duration-300 mt-8 mx-5'
          onClick={() => setIsAdding(true)}
          title='Thêm thẻ mới'
        >
          +
        </div>
      </div>

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
              onChange={(e) => handleImageUpload(e, 'img_d')}
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
