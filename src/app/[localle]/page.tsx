/** @format */

'use client';

import handleAPI from '@/apis/handleAPI';
import { Button, Divider, Image, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Home = () => {
	const t = useTranslations('Welcome');

	const mySocialLinks = [
		{ name: 'youtube', url: 'https://www.youtube.com/@daoquang-livecode' },
		{ name: 'github', url: 'https://github.com/bsdaoquang' },
		{ name: 'facebook', url: 'https://www.facebook.com/bsdaoquang.dev' },
		{
			name: 'tiktok',
			url: 'https://www.tiktok.com/@hoclaptrinhlivecode',
		},
	];

	// ví dụ dùng Redux
	// const auth = useSelector(authSelector);
	// console.log(auth);

	// ví dụ dùng handleAPI
	const getPosts = async () => {
		try {
			const res = await handleAPI('/posts');
			console.log(res);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className='container py-4'>
			<div className='row '>
				<div className='col-sm-12 col-md-8 offset-md-2'>
					<div className='mt-5 py-5 text-center'>
						<Typography.Title type='secondary' level={2} className='mb-2'>
							{t('title')}
						</Typography.Title>

						<Typography.Text code copyable type='secondary' className='mb-4'>
							{t('create')}
						</Typography.Text>
					</div>
					<Typography.Paragraph>{t('author')} </Typography.Paragraph>
					<div className='bg-light'>
						<Typography.Paragraph>{t('description')}</Typography.Paragraph>
						<blockquote className='blockquote'>
							<blockquote className='blockquote'>
								<ul>
									<li>
										<Typography.Text italic className='mb-4'>
											{t('multiLanguages')} (Next-Intl)
										</Typography.Text>
									</li>
									<li>
										<Typography.Text italic className='mb-4'>
											{t('multiLanguages')} Tailwind / Bootstrap / Ant Design
										</Typography.Text>
									</li>
									<li>
										<Typography.Text italic className='mb-4'>
											TypeScript + ESLint
										</Typography.Text>
									</li>
									<li>
										<Typography.Text italic className='mb-4'>
											App Router (Next.js 14+)
										</Typography.Text>
									</li>
								</ul>
							</blockquote>
						</blockquote>
						<Typography.Paragraph>
							{t('multiLanguageslDescription')}
						</Typography.Paragraph>
						<Link href={'https://nextjs.org/docs'}>{t('docs')}</Link>
					</div>
					<div className='mt-4 text-center'>
						<Divider orientation='center'>{t('followMe')}</Divider>
						<Space>
							{mySocialLinks.map((link) => (
								<Button
									key={link.name}
									type='text'
									href={link.url}
									target='_blank'
									rel='noopener noreferrer'
									shape='round'
									size='small'
									icon={<i className={`fab fa-${link.name}`} />}
								/>
							))}
						</Space>
					</div>
					<div className='mt-4 '>
						<Divider orientation='left'>{t('donate')}</Divider>
						<Typography.Paragraph>
							{t('donateDescription')}
						</Typography.Paragraph>
						<Image
							src='https://firebasestorage.googleapis.com/v0/b/clinic-scheduler-e62c2.appspot.com/o/qrmoney.jpeg?alt=media&token=6cbe62e8-4353-4c91-b635-6a74cb076d7d'
							width={200}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
function useEffect(arg0: () => void, arg1: never[]) {
	throw new Error('Function not implemented.');
}
