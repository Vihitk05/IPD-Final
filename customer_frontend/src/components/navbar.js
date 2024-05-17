import { useEffect } from "react"

const { useRouter } = require("next/router")

const Navbar = () => {
    const Router = useRouter()
    const {pathname} = Router

    const onClickHandler = (link) => {
        if (pathname == link) {
            return
        }
        else {
            Router.push(link)
        }
    }

    useEffect(() => {
        // if the current path is flipkart then don't show the navbar
        if (pathname == '/flipkart') {
            document.querySelector('nav').style.display = 'none'
        }
        else {
            document.querySelector('nav').style.display = 'flex'
        }
    }
    , [pathname])


    return (
        <nav className="flex flex-row min-h-[60px] items-center border-b-[1px] border-[#EAEAEA] px-[25px] box-border">
            <div className="flex flex-row gap-x-[5px] items-center text-[#387FD1] font-Inter font-medium text-[20px]">
                <img src="/icons/logo.png" alt="logo" className="h-[60px] w-[70px]"/>
                <p className="logo-title">eskPro</p>
            </div>

            <div className="flex flex-row gap-x-[6px] items-start ml-auto mr-auto">
                <button className={`outline-none px-[12px] py-[7px] box-border ${pathname == '/' && "bg-[#ECF3FE] border-[1px] border-[#2651EE] text-[#2651EE] rounded-[3px]"}`}
                    onClick={() => onClickHandler('/')}
                >
                    Orders
                </button>

                <button className={`outline-none px-[12px] py-[7px] box-border ${pathname == '/PreviousTickets' && "bg-[#ECF3FE] border-[1px] border-[#2651EE] text-[#2651EE] rounded-[3px]"}`}
                    onClick={() => onClickHandler('/PreviousTickets')}
                >
                    Previous tickets
                </button>

                <button className={`outline-none px-[12px] py-[7px] box-border ${pathname == '/ContactCustomerCare' && "bg-[#ECF3FE] border-[1px] border-[#2651EE] text-[#2651EE] rounded-[3px]"}`}
                    onClick={() => onClickHandler('/ContactCustomerCare')}
                >
                    Contact customer care
                </button>
            </div>
        </nav>
        
    )
}

export default Navbar;