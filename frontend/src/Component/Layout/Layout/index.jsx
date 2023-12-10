import React from 'react'
import Header from '../Header'
import Footer from '../Footer'
import './layout.scss'
import { useMediaQuery } from 'react-responsive'
import MobileHeader from '../Header/mobileHeader'
import { useDispatch, useSelector } from 'react-redux'
import { setUserDetails } from '../../../Redux/Reducers/gernalSlice'

const Layout = ({ children }) => {

    const baseUrl = import.meta.env.VITE_BASE_URL;
    const dispatch = useDispatch()

    const mobileResponsive = useMediaQuery({
        query: '(max-width: 900px)'
    })

    const token = useSelector((state)=>state.authReducer.token)

    fetch(`${baseUrl}/api/v1/auth/user`, {
        method: "get",
        headers: {
            "Authorization": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
            dispatch(setUserDetails(data?.data))
        })
        .catch(error => {
        //   setLoading(false);
        })


    return (
        <div>
            <div style={{position:"sticky",top:0,zIndex:1}}>
            < Header />
            </div>

            <div className='layout'>
                <div className='layout-box'>
                    {children}
                </div>
            </div>
            {mobileResponsive &&
                < MobileHeader />
            }
            {/* <Footer /> */}
        </div>
    )
}

export default Layout