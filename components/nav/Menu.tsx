import s from './Menu.module.scss'
import cn from 'classnames'

export type MenuProps = {

}

export default function Menu({ }: MenuProps) {


	return (

		<nav className={cn(s.menu)}>
			menu
		</nav>

	)
}
