import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Register() {
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		})
	}

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)

		// Валидация
		if (
			!formData.username ||
			!formData.email ||
			!formData.password ||
			!formData.confirmPassword
		) {
			setError('Заполните все поля')
			setLoading(false)
			return
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Пароли не совпадают')
			setLoading(false)
			return
		}

		if (formData.password.length < 6) {
			setError('Пароль должен быть не менее 6 символов')
			setLoading(false)
			return
		}

		try {
			const response = await fetch('http://localhost:5000/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: formData.username,
					email: formData.email,
					password: formData.password,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				// Успешная регистрация
				alert('✅ Регистрация успешна! Войдите в систему')
				router.push('/login')
			} else {
				setError(data.error || 'Ошибка регистрации')
			}
		} catch (err) {
			// Демо режим
			console.log('Демо регистрация')
			alert('✅ Регистрация успешна! (Демо режим)')
			router.push('/login')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Логотип */}
				<div className='text-center mb-8'>
					<h1 className='text-5xl font-bold text-white mb-2'>✨</h1>
					<h2 className='text-3xl font-bold text-white'>Присоединяйтесь!</h2>
					<p className='text-white/80 mt-2'>Создайте аккаунт за минуту</p>
				</div>

				{/* Форма */}
				<div className='bg-white rounded-3xl shadow-2xl p-8'>
					<h3 className='text-2xl font-bold text-gray-800 mb-6'>Регистрация</h3>

					{error && (
						<div className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg'>
							<p className='font-medium'>{error}</p>
						</div>
					)}

					<div className='space-y-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Имя пользователя
							</label>
							<input
								type='text'
								name='username'
								value={formData.username}
								onChange={handleChange}
								placeholder='Ваше имя'
								className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
								disabled={loading}
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Email
							</label>
							<input
								type='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
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
								name='password'
								value={formData.password}
								onChange={handleChange}
								placeholder='••••••••'
								className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
								disabled={loading}
							/>
							<p className='text-xs text-gray-500 mt-1'>Минимум 6 символов</p>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-2'>
								Подтвердите пароль
							</label>
							<input
								type='password'
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								placeholder='••••••••'
								className='w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:bg-white transition-all'
								disabled={loading}
							/>
						</div>

						<div className='flex items-start'>
							<input
								type='checkbox'
								className='mt-1 mr-2 w-4 h-4 text-purple-600 rounded'
								required
							/>
							<span className='text-sm text-gray-600'>
								Я согласен с{' '}
								<a
									href='#'
									className='text-purple-600 hover:text-purple-700 font-medium'
								>
									условиями использования
								</a>{' '}
								и{' '}
								<a
									href='#'
									className='text-purple-600 hover:text-purple-700 font-medium'
								>
									политикой конфиденциальности
								</a>
							</span>
						</div>

						<button
							onClick={handleSubmit}
							disabled={loading}
							className='w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
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
									Регистрация...
								</span>
							) : (
								'✨ Создать аккаунт'
							)}
						</button>
					</div>

					<div className='mt-6 text-center'>
						<p className='text-gray-600'>
							Уже есть аккаунт?{' '}
							<Link
								href='/login'
								className='text-purple-600 hover:text-purple-700 font-bold'
							>
								Войти
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
									Или зарегистрироваться через
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
