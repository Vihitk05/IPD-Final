import Navbar from './navbar'

const Layout = ({ children }) => {
    return (
        <div className='flex flex-col'>
            <Navbar />
            <main className='flex flex-col flex-grow'>{children}</main>
        </div>
    )
}

export default Layout