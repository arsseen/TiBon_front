import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Profile() {
	const [user, setUser] = useState(null)
	const [newEmail, setNewEmail] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const [showMenu, setShowMenu] = useState(false)

	useEffect(() => {
		const savedUser = localStorage.getItem('user')
		if (savedUser) {
			setUser(JSON.parse(savedUser))
		} else {
			router.push('/login')
		}
	}, [])

	function handleLogout() {
		localStorage.removeItem('user')
		setUser(null)
		setShowMenu(false)
		router.push('/')
	}

	async function handleChangeEmail() {
		if (!newEmail.trim()) {
			alert('Введите новый email!')
			return
		}

		setLoading(true)

		try {
			// ❌ УЯЗВИМОСТЬ: Нет CSRF токена!
			const response = await fetch('http://localhost:5000/api/change-email', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: user.id,
					newEmail: newEmail,
				}),
			})

			if (response.ok) {
				alert('✅ Email успешно изменен!')
				const updatedUser = { ...user, email: newEmail }
				setUser(updatedUser)
				localStorage.setItem('user', JSON.stringify(updatedUser))
				setNewEmail('')
			} else {
				alert('❌ Ошибка изменения email')
			}
		} catch (error) {
			alert('❌ Ошибка: ' + error.message)
		} finally {
			setLoading(false)
		}
	}

	function handleLogout() {
		localStorage.removeItem('user')
		router.push('/')
	}

	if (!user) return null

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50'>
			{/* Навигация */}
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
											<Link href='/feed'>
												<button className='px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full'>
													🤖Рекомендации
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
					{/* Левая колонка - Информация о пользователе */}
					<div className='lg:col-span-1'>
						<div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
							<div className='text-center mb-6'>
								<div className='text-7xl mb-4'>{user.avatar || '😊'}</div>
								<h3 className='text-2xl font-bold text-gray-800'>
									{user.username}
								</h3>
								<p className='text-gray-500 text-sm mt-1'>
									@{user.username.toLowerCase().replace(' ', '')}
								</p>
							</div>

							<div className='space-y-3 mb-6'>
								<div className='bg-purple-50 rounded-lg p-3'>
									<p className='text-sm text-gray-600'>Email</p>
									<p className='font-medium text-gray-800'>{user.email}</p>
								</div>
								<div className='bg-pink-50 rounded-lg p-3'>
									<p className='text-sm text-gray-600'>Дата регистрации</p>
									<p className='font-medium text-gray-800'>
										{new Date().toLocaleDateString('ru-RU')}
									</p>
								</div>
							</div>

							<button
								onClick={handleLogout}
								className='w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all'
							>
								🚪 Выйти
							</button>
						</div>
					</div>

					{/* Правая колонка - Форма изменения email */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Карточка изменения email */}
						<div className='bg-white rounded-2xl shadow-lg p-8'>
							<h2 className='text-3xl font-bold text-gray-800 mb-2'>
								⚙️ Настройки профиля
							</h2>
							<p className='text-gray-600 mb-8'>Измените свои данные</p>

							<div className='space-y-6'>
								{/* Текущий email */}
								<div className='bg-gray-50 rounded-xl p-6 border border-gray-200'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Текущий email
									</label>
									<div className='flex items-center gap-3'>
										<span className='text-2xl'>📧</span>
										<span className='text-lg font-bold text-gray-800'>
											{user.email}
										</span>
									</div>
								</div>

								{/* Новый email */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										Новый email
									</label>
									<input
										type='email'
										value={newEmail}
										onChange={e => setNewEmail(e.target.value)}
										placeholder='example@email.com'
										className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
									/>
								</div>

								{/* Кнопка изменения */}
								<button
									onClick={handleChangeEmail}
									disabled={loading}
									className='w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
								>
									{loading ? (
										<span className='flex items-center justify-center'>
											<svg
												className='animate-spin h-5 w-5 mr-2'
												viewBox='0 0 24 24'
											>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
													fill='none'
												/>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
												/>
											</svg>
											Изменение...
										</span>
									) : (
										'✉️ Изменить Email'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
