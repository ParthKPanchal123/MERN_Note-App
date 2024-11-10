import React from 'react'
import { useState } from 'react'
import SearchBar from '../Search/SearchBar'
import ProfileInfo from '../Card/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signoutFailure, signoutStart, signoutSuccess } from '../../redux/User/userSlice'
import axios from 'axios'
import { toast } from 'react-toastify'

function Navbar({userInfo, onSearch, handleClearSearch}) {
    const [searchQuery, setSearchQuery] = useState("")

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSearch = () => {
        if (searchQuery) {
          onSearch(searchQuery)
        }
    }
    
      const onClearSearch = () => {
        setSearchQuery("")
        handleClearSearch()
      }


      const onLogout = async () => {
        try {
          dispatch(signoutStart())

          const res = await axios.get("http://localhost:3001/api/user/signout", { withCredentials: true })

          if (res.data.success === false) {
            dispatch(signoutFailure(res.data.message))
            toast.error(res.data.message)
            return
          }

          toast.success(res.data.message)
          dispatch(signoutSuccess())
          navigate("/login")
          
        } catch (error) {
          toast.error(error.message)
          dispatch(signoutFailure(error.message))
        }
      }

    return (
        <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
            <h2 className="text-xl font-medium text-black py-2">
                <span className="text-slate-500">Good</span>
                <span className="text-slate-900">Notes</span>
            </h2>
            <SearchBar
                value={searchQuery}
                onChange={({ target }) => setSearchQuery(target.value)}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        </div>

    )
}

export default Navbar
