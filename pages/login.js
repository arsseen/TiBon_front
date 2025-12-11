import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)

		if (!email || !password) {
			setError('Заполните все поля')
			setLoading(false)
			return
		}

		try {
			const response = await fetch('http://localhost:5000/api/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			})

			const data = await response.json()

			if (response.ok) {
				// Сохраняем пользователя в localStorage
				localStorage.setItem('user', JSON.stringify(data.user))
				router.push('/feed')
			} else {
				setError(data.error || 'Ошибка входа')
			}
		} catch (err) {
			// Демо режим - если бэкенд не работает
			console.log('Демо вход')
			localStorage.setItem(
				'user',
				JSON.stringify({
					username: 'Демо пользователь',
					email,
					avatar: '😊',
				})
			)
			router.push('/feed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Логотип */}
				<div className='text-center mb-8'>
					<h1 className='text-5xl font-bold text-white mb-2'>🌟</h1>
					<h2 className='text-3xl font-bold text-white'>SocialNet</h2>
					<p className='text-white/80 mt-2'>Добро пожаловать обратно!</p>
				</div>

				{/* Форма */}
				<div className='bg-white rounded-3xl shadow-2xl p-8'>
					<h3 className='text-2xl font-bold text-gray-800 mb-6'>Вход</h3>

					{error && (
						<div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg'>
							<p className='font-medium'>{error}</p>
						</div>
					)}

					<div className='space-y-5'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Email
							</label>
							<input
								type='email'
								value={email}
								onChange={e => setEmail(e.target.value)}
								placeholder='example@email.com'
								className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
								disabled={loading}
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Пароль
							</label>
							<input
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder='••••••••'
								className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
								disabled={loading}
							/>
						</div>

						<div className='flex items-center justify-between text-sm'>
							<label className='flex items-center'>
								<input
									type='checkbox'
									className='mr-2 w-4 h-4 text-purple-600 rounded'
								/>
								<span className='text-gray-600'>Запомнить меня</span>
							</label>
							<a
								href='#'
								className='text-purple-600 hover:text-purple-700 font-medium'
							>
								Забыли пароль?
							</a>
						</div>

						<button
							onClick={handleSubmit}
							disabled={loading}
							className='w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
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
									Вход...
								</span>
							) : (
								'🔐 Войти'
							)}
						</button>
					</div>

					<div className='mt-6 text-center'>
						<p className='text-gray-600'>
							Нет аккаунта?{' '}
							<Link
								href='/register'
								className='text-purple-600 hover:text-purple-700 font-bold'
							>
								Зарегистрироваться
							</Link>
						</p>
					</div>

					{/* Социальные кнопки */}
					<div className='mt-8'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-4 bg-white text-gray-500'>
									Или войти через
								</span>
							</div>
						</div>

						<div className='mt-6 grid grid-cols-2 gap-4'>
							<button className='flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all'>
								<span className='text-2xl mr-2'>🔵</span>
								<span className='font-medium text-gray-700'>Facebook</span>
							</button>
							<button className='flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all'>
								<span className='text-2xl mr-2'>🔴</span>
								<span className='font-medium text-gray-700'>Google</span>
							</button>
						</div>
					</div>
				</div>

				{/* Кнопка назад */}
				<div className='text-center mt-6'>
					<Link href='/' className='text-white hover:text-white/80 font-medium'>
						← Вернуться на главную
					</Link>
				</div>
			</div>
		</div>
	)
}
