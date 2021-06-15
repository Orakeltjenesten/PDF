import Link from 'next/link'
import navStyles from 'styles/Nav.module.css'

import {makeStyles} from '@material-ui/core/styles'

class Nav extends Component {
    render() {
        return (
            <nav class={navStyles.nav}>
                <ul>
                    <li>
                        <Link href='/'>
                            <img src='../public/PDFlogo.svg' alt='logo'></img>
                        </Link>
                    </li>
                    <li>
                        <Link href='/upload'>Upload</Link>
                    </li>
                    <li>
                        <Link href='/organize'>Organize</Link>
                    </li>
                    <li>
                        <Link href='/merge'>Merge</Link>
                    </li>
                    <li>
                        <Link href='/split'>Split</Link>
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Nav;