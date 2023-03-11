import Head from 'next/head';
import { useEffect, useState } from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

import styles from '../styles/flow.module.scss';

export default function Flow() {
  const [nodes, setNodes] = useState([]);
  const [title, setTitle] = useState("");

  const [teste, setTeste] = useState({});

  function sendData() {
    localStorage.setItem('nodes', JSON.stringify(nodes));
    setTeste(title)
  }

  useEffect(() => {
    let dataString = localStorage.getItem('nodes');
    setNodes(JSON.parse(dataString));
  }, [])

  useEffect(() => {
    let dataString = localStorage.getItem('nodes');
    let titleObj = JSON.parse(dataString);

    console.log(titleObj)

    setNodes([
      {
        id: '0',
        type: 'input',
        data: { label: `${title}` },
        position: { x: 250, y: 25 },
      },
    ])
  }, [teste])

  useEffect(() => {
    sendData()
  }, [nodes])

  return (
    <main className={styles.main}>
      <Head>
        <title>React Flow Test</title>
      </Head>

      <div className={styles.form}>
        <input
          placeholder="Título"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <button onClick={() => sendData()}>Criar</button>
      </div>
      
      <div className={styles.flow}>
        <ReactFlow nodes={nodes} /*edges={edges}*/ fitView />
      </div>
    </main>
  );
}