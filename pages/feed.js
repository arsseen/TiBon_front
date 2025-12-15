import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Feed() {
	const [posts, setPosts] = useState([])
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [user, setUser] = useState(null)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	useEffect(() => {
		loadPosts()
		const savedUser = localStorage.getItem('user')
		if (savedUser) {
			setUser(JSON.parse(savedUser))
		}
	}, [])

	async function loadPosts() {
		try {
			const response = await fetch('http://localhost:5000/api/posts')
			const data = await response.json()
			setPosts(data)
		} catch (error) {
			setPosts([
				{
					_id: '1',
					title: 'Добро пожаловать! 🎉',
					content:
						'Это демо пост. Подключите бэкенд для полной функциональности.',
					author: { username: 'Система', avatar: '🤖' },
					likes: 42,
					comments: 12,
					timestamp: '2 часа назад',
					liked: false,
				},
			])
		}
	}

	const handleLike = postId => {
		setPosts(
			posts.map(p =>
				p._id === postId
					? {
							...p,
							liked: !p.liked,
							likes: p.liked ? p.likes - 1 : p.likes + 1,
					  }
					: p
			)
		)
	}

	async function handleSubmit() {
		if (!user) {
			alert('Пожалуйста, войдите в систему')
			router.push('/login')
			return
		}

		if (!title.trim() || !content.trim()) {
			alert('Заполните все поля!')
			return
		}

		const newPost = {
			_id: Date.now().toString(),
			title,
			content,
			author: user,
			likes: 0,
			comments: 0,
			timestamp: 'только что',
			liked: false,
		}
		setPosts([newPost, ...posts])
		setTitle('')
		setContent('')
	}

	function handleLogout() {
		localStorage.removeItem('user')
		setUser(null)
		setShowMenu(false)
		router.push('/')
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
			<nav className='bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm'>
				<div className='max-w-6xl mx-auto px-4 py-3'>
					<div className='flex items-center justify-between'>
						<Link href='/'>
							<h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer'>
								SocialNet
							</h1>
						</Link>

						<div className='flex items-center gap-4'>
							{user ? (
								<div className='relative'>
									<button
										onClick={() => setShowMenu(!showMenu)}
										className='flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all'
									>
										<span className='text-2xl'>{user.avatar || '😊'}</span>
										<span className='font-medium hidden sm:block'>
											{user.username}
										</span>
										<span className='text-sm'>▼</span>
									</button>

									{/* Выпадающее меню */}
									{showMenu && (
										<div className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2'>
											<Link href='/profile'>
												<div className='px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-700'>
													👤 Профиль
												</div>
											</Link>
											<Link href='/settings'>
												<div className='px-4 py-2 hover:bg-purple-50 cursor-pointer text-gray-700'>
													⚙️ Настройки
												</div>
											</Link>
											<Link href='/upload'>
												<button className='px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full'>
													📁 Файлы
												</button>
											</Link>
											<hr className='my-2' />
											<button
												onClick={handleLogout}
												className='w-full text-left px-4 py-2 hover:bg-red-50 text-red-600'
											>
												🚪 Выйти
											</button>
										</div>
									)}
								</div>
							) : (
								<div className='flex items-center gap-3'>
									<button
										onClick={() => router.push('/login')}
										className='px-6 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-full transition-all'
									>
										Войти
									</button>
									<button
										onClick={() => router.push('/register')}
										className='px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all'
									>
										Регистрация
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</nav>

			<div className='max-w-6xl mx-auto px-4 py-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* Профиль */}
					<div className='lg:col-span-1'>
						<div className='bg-white rounded-2xl shadow-lg p-6'>
							{user ? (
								<div className='text-center'>
									<div className='text-6xl mb-3'>{user.avatar || '😊'}</div>
									<h3 className='text-xl font-bold text-gray-800'>
										{user.username}
									</h3>
									<p className='text-gray-500 text-sm mt-1'>
										@{user.username.toLowerCase().replace(' ', '')}
									</p>
								</div>
							) : (
								<div className='text-center'>
									<div className='text-6xl mb-3'>👋</div>
									<h3 className='text-xl font-bold text-gray-800 mb-3'>
										Привет, гость!
									</h3>
									<p className='text-gray-600 text-sm mb-4'>
										Войдите, чтобы создавать посты
									</p>
									<button
										onClick={() => router.push('/login')}
										className='w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all'
									>
										Войти
									</button>
								</div>
							)}

							<div className='grid grid-cols-3 gap-4 mt-6 text-center'>
								<div>
									<div className='text-2xl font-bold text-purple-600'>
										{posts.length}
									</div>
									<div className='text-xs text-gray-500'>Постов</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-pink-600'>1.2k</div>
									<div className='text-xs text-gray-500'>Друзей</div>
								</div>
								<div>
									<div className='text-2xl font-bold text-blue-600'>890</div>
									<div className='text-xs text-gray-500'>Лайков</div>
								</div>
							</div>
						</div>
					</div>

					{/* Лента */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Форма создания поста */}
						{user ? (
							<div className='bg-white rounded-2xl shadow-lg p-6'>
								<div className='flex gap-4'>
									<div className='text-3xl'>{user.avatar || '😊'}</div>
									<div className='flex-1 space-y-4'>
										<input
											type='text'
											placeholder='Заголовок (попробуйте XSS)'
											value={title}
											onChange={e => setTitle(e.target.value)}
											className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500'
										/>
										<textarea
											placeholder='Контент поста (здесь тоже уязвимость)'
											value={content}
											onChange={e => setContent(e.target.value)}
											rows={3}
											className='w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none'
										/>
										<div className='flex justify-end'>
											<button
												onClick={handleSubmit}
												className='px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all'
											>
												📤 Опубликовать
											</button>
										</div>
									</div>
								</div>
							</div>
						) : (
							<div className='bg-white rounded-2xl shadow-lg p-8 text-center'>
								<div className='text-5xl mb-4'>✍️</div>
								<h3 className='text-xl font-bold text-gray-800 mb-2'>
									Хотите поделиться мыслями?
								</h3>
								<p className='text-gray-600 mb-4'>
									Войдите в систему, чтобы создавать посты
								</p>
								<button
									onClick={() => router.push('/login')}
									className='px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all'
								>
									Войти сейчас
								</button>
							</div>
						)}

						{/* Посты */}
						{posts.map(post => (
							<div
								key={post._id}
								className='bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow'
							>
								<div className='flex items-center gap-3 mb-4'>
									<div className='text-3xl'>{post.author?.avatar || '😊'}</div>
									<div className='flex-1'>
										<h4 className='font-bold text-gray-800'>
											{post.author?.username || 'Пользователь'}
										</h4>
										<p className='text-sm text-gray-500'>
											{post.timestamp || 'недавно'}
										</p>
									</div>
								</div>
								{/*уязвимость*/}
								<h3
									className='text-xl font-bold text-gray-800 mb-2'
									dangerouslySetInnerHTML={{ __html: post.title }}
								/>
								<div
									className='text-gray-600 leading-relaxed mb-4'
									dangerouslySetInnerHTML={{ __html: post.content }}
								/>

								<p className='text-gray-600 leading-relaxed mb-4'>
									{post.content}
								</p>

								<div className='flex items-center gap-6 pt-4 border-t border-gray-100'>
									<button
										onClick={() => handleLike(post._id)}
										className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
											post.liked
												? 'bg-red-50 text-red-600'
												: 'hover:bg-gray-100 text-gray-600'
										}`}
									>
										<span>{post.liked ? '❤️' : '🤍'}</span>
										<span className='font-medium'>{post.likes || 0}</span>
									</button>
									<button className='flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 text-gray-600 transition-all'>
										<span>💬</span>
										<span className='font-medium'>{post.comments || 0}</span>
									</button>
									<button className='flex items-center gap-2 px-4 py-2 rounded-full hover:bg-green-50 text-gray-600 transition-all'>
										<span>🔗</span>
										<span className='font-medium'>Поделиться</span>
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
