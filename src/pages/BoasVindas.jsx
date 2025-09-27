import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


export default function BoasVindas() {
    const [nome, setNome] = useState('')
    const [telefone, setTelefone] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
        try {
            const s = JSON.parse(localStorage.getItem('calcis_user') || 'null')
            if (s?.nome) setNome(s.nome)
            if (s?.telefone) setTelefone(s.telefone)
        } catch (e) { }
    }, [])


    function handleSubmit(e) {
        e.preventDefault()
        if (nome.trim().length < 2) { alert('Digite um nome válido'); return }
        if (telefone.trim().length < 8) { alert('Digite um telefone válido'); return }
        localStorage.setItem('calcis_user', JSON.stringify({ nome, telefone }))
        navigate('/numeracao')
    }


    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md bg-white shadow rounded p-6">
                <h1 className="text-2xl font-bold mb-3">Bem-vindo à Calcis 👋</h1>
                <p className="text-sm text-gray-600 mb-4">Insira seu nome e telefone para continuar.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Telefone</label>
                        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1 block w-full border rounded px-3 py-2" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Continuar</button>
                </form>
            </div>
        </div>
    )
}