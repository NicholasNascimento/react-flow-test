import Head from 'next/head';
import { useEffect, useState } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

import styles from '../styles/flow.module.scss';

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Input Node' },
    position: { x: 250, y: 25 },
  },

  {
    id: '1',
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: '2',
    type: 'output',
    data: { label: 'Output Node' },
    position: { x: 250, y: 250 },
  },
];

const initialEdges = [
  { id: 'e0-1', source: '0', target: '1' },
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [teste, setTeste] = useState({});
  let pessoa = {nome: 'Nicholas', idade: 23}

  function enviaDados() {
    localStorage.setItem('pessoa', JSON.stringify(pessoa));
    setTeste(pessoa)
  }

  function recebeDados() {
    let pessoaString = localStorage.getItem('pessoa');
    let pessoaObj = JSON.parse(pessoaString);

    console.log(pessoaObj)
  }

  useEffect(() => {
    recebeDados()
  }, [teste])

  return (
    <main className={styles.main}>
      <Head>
        <title>React Flow Test</title>
      </Head>

      <h1>Ola mundo</h1>
      <button onClick={() => enviaDados()}>Botão</button>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </main>
  );
}