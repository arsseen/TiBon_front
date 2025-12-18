import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Upload() {
	const [file, setFile] = useState(null)
	const [uploading, setUploading] = useState(false)
	const [uploadedFiles, setUploadedFiles] = useState([])
	const [user, setUser] = useState(null)
	const [showMenu, setShowMenu] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const savedUser = localStorage.getItem('user')
		if (savedUser) {
			setUser(JSON.parse(savedUser))
		}
		loadFiles()
	}, [])

	function handleLogout() {
		localStorage.removeItem('user')
		setUser(null)
		setShowMenu(false)
		router.push('/')
	}

	async function loadFiles() {
		try {
			const response = await fetch('http://localhost:5000/api/uploads')
			const data = await response.json()
			setUploadedFiles(data)
		} catch (error) {
			console.error('Ошибка загрузки списка файлов:', error)
		}
	}

	async function handleUpload() {
		if (!file) {
			alert('Выберите файл!')
			return
		}

		if (!user) {
			alert('Войдите в систему')
			router.push('/login')
			return
		}

		setUploading(true)

		// Имитация "думающей модели" - минимум 1.5 секунды
		const startTime = Date.now()
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await fetch('http://localhost:5000/api/upload', {
				method: 'POST',
				body: formData,
			})

			const data = await response.json()

			// Обеспечиваем минимальное время загрузки для эффекта
			const elapsedTime = Date.now() - startTime
			const remainingTime = Math.max(0, 1500 - elapsedTime)
			await new Promise(resolve => setTimeout(resolve, remainingTime))

			if (response.ok) {
				alert('✅ Файл успешно загружен!')
				setFile(null)
				loadFiles()
				document.getElementById('fileInput').value = ''
			} else {
				alert('❌ Ошибка: ' + data.error)
			}
		} catch (error) {
			alert('❌ Ошибка загрузки: ' + error.message)
		} finally {
			setUploading(false)
		}
	}

	async function handleDelete(fileId) {
		if (!confirm('Удалить файл?')) return

		try {
			const response = await fetch(
				`http://localhost:5000/api/uploads/${fileId}`,
				{
					method: 'DELETE',
				}
			)

			if (response.ok) {
				alert('✅ Файл удален')
				loadFiles()
			}
		} catch (error) {
			alert('❌ Ошибка удаления: ' + error.message)
		}
	}

	function formatFileSize(bytes) {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
	}

	function getFileIcon(mimetype) {
		if (mimetype.startsWith('image/')) return '🖼️'
		if (mimetype.startsWith('video/')) return '🎥'
		if (mimetype.startsWith('audio/')) return '🎵'
		if (mimetype.includes('pdf')) return '📄'
		if (mimetype.includes('zip') || mimetype.includes('rar')) return '📦'
		if (mimetype.includes('text')) return '📝'
		return '📁'
	}

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
					{/* Левая колонка - Профиль/Гость */}
					<div className='lg:col-span-1'>
						<div className='bg-white rounded-2xl shadow-lg p-6 mb-6'>
							{user ? (
								<div className='text-center'>
									<div className='text-6xl mb-3'>{user.avatar || '😊'}</div>
									<h3 className='text-xl font-bold text-gray-800'>
										{user.username}
									</h3>
									<p className='text-gray-500 text-sm mt-1'>
										@{user.username.toLowerCase().replace(' ', '')}
									</p>

									<div className='mt-6 space-y-3'>
										<div className='bg-purple-50 rounded-lg p-3'>
											<p className='text-sm text-gray-600'>Email</p>
											<p className='font-medium text-gray-800'>{user.email}</p>
										</div>
									</div>
								</div>
							) : (
								<div className='text-center'>
									<div className='text-6xl mb-3'>👋</div>
									<h3 className='text-xl font-bold text-gray-800 mb-3'>
										Привет, гость!
									</h3>
									<p className='text-gray-600 text-sm mb-4'>
										Войдите, чтобы загружать файлы
									</p>
									<button
										onClick={() => router.push('/login')}
										className='w-full py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:shadow-lg transition-all'
									>
										Войти
									</button>
								</div>
							)}
						</div>
					</div>

					{/* Правая колонка - Контент */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Форма загрузки */}
						<div className='bg-white rounded-2xl shadow-lg p-6'>
							<h3 className='text-2xl font-bold text-gray-800 mb-6'>
								📤 Загрузить файл
							</h3>

							<div className='border-2 border-dashed border-purple-300 rounded-xl p-8 text-center bg-purple-50'>
								<div className='text-6xl mb-4'>📁</div>

								<input
									id='fileInput'
									type='file'
									onChange={e => setFile(e.target.files[0])}
									className='hidden'
								/>

								<label
									htmlFor='fileInput'
									className='inline-block px-6 py-3 bg-purple-600 text-white rounded-xl font-medium cursor-pointer hover:bg-purple-700 transition-all'
								>
									Выбрать файл
								</label>

								{file && (
									<div className='mt-4 bg-white p-4 rounded-lg'>
										<p className='font-bold text-gray-800'>Выбран файл:</p>
										<p className='text-gray-600'>{file.name}</p>
										<p className='text-sm text-gray-500'>
											Размер: {formatFileSize(file.size)}
										</p>
										<p className='text-sm text-gray-500'>
											Тип: {file.type || 'неизвестно'}
										</p>
									</div>
								)}
							</div>

							<button
								onClick={handleUpload}
								disabled={!file || uploading}
								className='w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed'
							>
								{uploading ? (
									<span className='flex items-center justify-center'>
										<svg
											className='animate-spin h-6 w-6 mr-3'
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
										<span className='animate-pulse'>Загрузка файла...</span>
									</span>
								) : (
									'📤 Загрузить'
								)}
							</button>
						</div>

						{/* Список файлов */}
						<div className='bg-white rounded-2xl shadow-lg p-6'>
							<h3 className='text-2xl font-bold text-gray-800 mb-6'>
								📋 Загруженные файлы ({uploadedFiles.length})
							</h3>

							{uploadedFiles.length === 0 ? (
								<div className='text-center py-12 text-gray-400'>
									<div className='text-6xl mb-4'>📭</div>
									<p>Файлов пока нет</p>
								</div>
							) : (
								<div className='space-y-3'>
									{uploadedFiles.map(file => (
										<div
											key={file.id}
											className='bg-gray-50 rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow'
										>
											<div className='flex items-center justify-between'>
												<div className='flex items-center gap-4 flex-1'>
													<div className='text-4xl'>
														{getFileIcon(file.mimetype)}
													</div>
													<div className='flex-1'>
														<p className='font-bold text-gray-800'>
															{file.originalName}
														</p>
														<div className='flex gap-4 text-sm text-gray-500 mt-1'>
															<span>{formatFileSize(file.size)}</span>
															<span>•</span>
															<span>
																{new Date(file.uploadedAt).toLocaleString(
																	'ru-RU'
																)}
															</span>
														</div>
													</div>
												</div>
												<div className='flex items-center gap-2'>
													<a
														href={`http://localhost:5000${file.path}`}
														target='_blank'
														rel='noopener noreferrer'
														className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all'
													>
														Открыть
													</a>
													<button
														onClick={() => handleDelete(file.id)}
														className='px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all'
													>
														Удалить
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
