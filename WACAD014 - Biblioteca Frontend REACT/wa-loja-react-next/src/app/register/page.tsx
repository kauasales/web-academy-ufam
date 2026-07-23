'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Cadastro:', { nome, email, senha })
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
            <h2 className='mb-4'>Cadastro</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label className='form-label'>Nome</label>
                <input 
                  type='text' 
                  className='form-control' 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
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
              <button type='submit' className='btn btn-dark w-100'>Cadastrar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
