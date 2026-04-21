import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
	const fontData = readFileSync(join(process.cwd(), 'public/VT323.woff2'));

	return new ImageResponse(
		<div
			style={{
				background: 'linear-gradient(135deg, #0a0a0a 0%, #150a2e 100%)',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 32,
			}}
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox='0 0 448 512'
				width={110}
				height={126}
				role='img'
				aria-label='sqlit logo'
			>
				<defs>
					<linearGradient
						id='g'
						x1='80'
						y1='0'
						x2='368'
						y2='512'
						gradientUnits='userSpaceOnUse'
					>
						<stop offset='0%' stopColor='#00e5ff' />
						<stop offset='25%' stopColor='#4466ff' />
						<stop offset='50%' stopColor='#7c3aff' />
						<stop offset='100%' stopColor='#ff3cac' />
					</linearGradient>
				</defs>
				<path
					fill='url(#g)'
					d='M448 80l0 48c0 44.2-100.3 80-224 80S0 172.2 0 128L0 80C0 35.8 100.3 0 224 0S448 35.8 448 80z'
				/>
				<path
					fill='url(#g)'
					d='M393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6L448 288c0 44.2-100.3 80-224 80S0 332.2 0 288L0 186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3z'
				/>
				<path
					fill='url(#g)'
					d='M0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6l0 85.9c0 44.2-100.3 80-224 80S0 476.2 0 432l0-85.9z'
				/>
			</svg>
			<div
				style={{
					color: 'white',
					fontSize: 96,
					fontFamily: 'VT323',
				}}
			>
				sqlit
			</div>
			<div
				style={{
					color: '#888888',
					fontSize: 30,
					fontFamily: 'sans-serif',
				}}
			>
				An SQL notebook that runs entirely in the browser.
			</div>
		</div>,
		{
			...size,
			fonts: [{ name: 'VT323', data: fontData, style: 'normal', weight: 400 }],
		},
	);
}
