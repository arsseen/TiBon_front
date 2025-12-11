import { useRouter } from 'next/router'

export default function Home() {
	const router = useRouter()

	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 flex items-center justify-center'>
			<div className='text-center px-4'>
				<h1 className='text-6xl md:text-7xl font-bold text-white mb-6 animate-pulse'>
					🌟 SocialNet
				</h1>
				<p className='text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto'>
					Добро пожаловать в социальную сеть нового поколения! Делитесь
					моментами, находите друзей, создавайте воспоминания.
				</p>

				{/* Основные кнопки */}
				<div className='flex flex-col sm:flex-row gap-4 justify-center mb-8'>
					<button
						onClick={() => router.push('/register')}
						className='px-10 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-110 transition-all'
					>
						✨ Зарегистрироваться
					</button>
					<button
						onClick={() => router.push('/login')}
						className='px-10 py-4 bg-white/20 text-white rounded-full font-bold text-lg hover:bg-white/30 transition-all backdrop-blur-sm border-2 border-white/50'
					>
						🔐 Войти
					</button>
				</div>

				{/* Быстрый просмотр */}
				<div className='mt-8'>
					<button
						onClick={() => router.push('/feed')}
						className='text-white/80 hover:text-white underline text-sm font-medium'
					>
						или просмотреть ленту как гость →
					</button>
				</div>

				{/* Особенности */}
				<div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto'>
					<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20'>
						<div className='text-4xl mb-3'>📱</div>
						<h3 className='text-white font-bold text-lg mb-2'>
							Делитесь моментами
						</h3>
						<p className='text-white/80 text-sm'>
							Публикуйте фото, видео и мысли
						</p>
					</div>
					<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20'>
						<div className='text-4xl mb-3'>👥</div>
						<h3 className='text-white font-bold text-lg mb-2'>
							Находите друзей
						</h3>
						<p className='text-white/80 text-sm'>
							Общайтесь с единомышленниками
						</p>
					</div>
					<div className='bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20'>
						<div className='text-4xl mb-3'>🎨</div>
						<h3 className='text-white font-bold text-lg mb-2'>
							Будьте креативны
						</h3>
						<p className='text-white/80 text-sm'>Выражайте себя без границ</p>
					</div>
				</div>
			</div>
		</div>
	)
}
