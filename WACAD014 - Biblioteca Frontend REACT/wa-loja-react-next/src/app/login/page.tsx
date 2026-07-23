'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login:', { email, senha })
    router.push('/')
  }

  return (
    <div className='container-fluid vh-100 d-flex align-items-center'>
      <div className='row w-100'>
        <div className='col-md-6 d-flex align-items-center justify-content-center bg-dark text-white p-5'>
          <h1 className='display-3 fw-bold'>Bem vindo à WA Loja!</h1>
        </div>
        <div className='col-md-6 d-flex align-items-center justify-content-center p-5'>
          <div className='card p-4 shadow-sm w-75'>
            <h2 className='mb-4'>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>Email</label>
                <input 
                  type='email' 
                  className='form-control' 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label className='form-label'>Senha</label>
                <input 
                  type='password' 
                  className='form-control'
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <button type='submit' className='btn btn-dark w-100 mb-3'>Entrar</button>
              <a href='/register' className='btn btn-outline-secondary w-100'>Não tenho cadastro</a>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
