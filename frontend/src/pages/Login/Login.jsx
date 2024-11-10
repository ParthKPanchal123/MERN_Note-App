import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Password from '../../components/Inputs/Password'
import { validateEmail } from '../../utils/Helper'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signInFailure, signInStart, signInSuccess } from '../../redux/User/userSlice'
import axios from 'axios'
import { toast } from 'react-toastify'


function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!password) {
      setError("Please enter the password")
      return
    }

    setError("")

    //Login Api

    try {
      dispatch(signInStart())

      const res = await axios.post("http://localhost:3001/api/user/signin", { email, password },{ withCredentials: true })

      if (res.data.success === false) {
        toast.error(res.data.message)
        console.log(res.data);
        dispatch(signInFailure(res.data.message))
      }

      toast.success(res.data.message)
      dispatch(signInSuccess(res.data))
      navigate("/")

    } catch (error) {
      toast.error(error.message)
      console.log(error);
      dispatch(signInFailure(error.message))
    }

  }


  return (
    <div className="flex items-center justify-center mt-28">
      <div className="w-96 border rounded bg-white px-7 py-10">
        <form onSubmit={handleLogin}>
          <h4 className="text-2xl mb-7">Login</h4>

          <input
            type="text"
            placeholder="Email"
            className="w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Password
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>

          <p className="text-sm text-center mt-4">
            Not registered yet?{" "}
            <Link
              to={"/signup"}
              className="font-medium text-[#2B85FF] underline"
            >
              Create an account
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login
