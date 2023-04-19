import { useState } from 'react'

const Reset = () => {
    const [email, setEmail] = useState("");

  return (
    <>
    <div>Enter the email address associated with your account and we 'll send you a link to reset your password</div>
    <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
    <button>Continue</button>
    </>
  )
}

export default Reset