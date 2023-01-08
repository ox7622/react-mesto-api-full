import logo from '../images/logo.svg';

function Header({ children, onClick }) {

    return (<>
        <ul className='header__links header__links_mobile '>
            {children}
        </ul>
        <header className="header">
            <img src={logo} className="header__logo" alt="лого Mesto" />
            <div className='header__mobile-menu' onClick={onClick}></div>
            <ul className='header__links header__links_desktop'>
                {children}
            </ul>

        </header>
    </>
    )
}
export default Header;