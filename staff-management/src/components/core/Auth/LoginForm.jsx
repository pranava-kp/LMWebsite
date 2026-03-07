import React, { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { login } from "../../../services/operations/authAPI"

function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const { email, password } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    dispatch(login(email, password, navigate))
  }

  return (
    <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-5">
      <label className="w-full">
        <p className="mb-1 text-sm text-slate-200">
          Email Address <sup className="text-pink-500">*</sup>
        </p>
        <input
          required
          type="text"
          name="email"
          value={email}
          onChange={handleOnChange}
          placeholder="Enter email address"
          className="w-full rounded-lg bg-slate-800/50 p-3 text-white border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </label>

      <label className="relative w-full">
        <p className="mb-1 text-sm text-slate-200">
          Password <sup className="text-pink-500">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="w-full rounded-lg bg-slate-800/50 p-3 text-white border border-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all !pr-12"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] cursor-pointer text-slate-400 hover:text-white"
        >
          {showPassword ? <AiOutlineEyeInvisible fontSize={24} /> : <AiOutlineEye fontSize={24} />}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-fit text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Forgot Password?
          </p>
        </Link>
      </label>

      <button
        type="submit"
        className="mt-4 rounded-lg bg-blue-600 py-3 px-4 font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-500 active:scale-95 transition-all"
      >
        Sign In
      </button>
    </form>
  )
}

export default LoginForm