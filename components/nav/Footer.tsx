import s from './Footer.module.scss'
import cn from 'classnames'

export type FooterProps = {
	footer: any
}

export default function Footer({ footer }: FooterProps) {



	return (
		<footer className={cn(s.footer)} id="footer">
			footer
		</footer >
	)
}