import { useEffect, useState } from 'react';

interface Livro {
  id: number;
  titulo: string;
  autor: string;
}

function App() {
  const [livros, setLivros] = useState<Livro[]>([]);

  useEffect(() => {
    // Consome a porta externa 4444 do backend
    fetch('http://localhost:4444/books')
      .then(res => res.json())
      .then(data => setLivros(data))
      .catch(err => console.error("Erro ao buscar livros:", err));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ color: '#2c3e50' }}> Sistema de Listagem de Livros </h1>
      <p>Web Academy UFAM - Ambiente Conteinerizado</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#34495e', color: '#fff', textAlign: 'left' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Título</th>
            <th style={{ padding: '12px' }}>Autor</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id} style={{ backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{livro.id}</td>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{livro.titulo}</td>
              <td style={{ padding: '12px' }}>{livro.autor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;