import Head from 'next/head';
import { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { Controls, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, addEdge, updateEdge, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from '../styles/flow.module.scss';

const initialNodes = [
  {
    id: '1',
    data: { label: 'O que você gostaria de fazer com esse móvel' },
    position: { x: 300, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'Na faixa de preço' },
    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    data: { label: 'Por quanto tempo?' },
    position: { x: 200, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Qual é o defeito' },
    position: { x: 400, y: 200 },
  },
  {
    id: '5',
    data: { label: 'O que você deseja fazer?' },
    position: { x: 600, y: 200 },
  },
  {
    id: '6',
    data: { label: 'Vermelho' },
    position: { x: 300, y: 350 },
  },
  {
    id: '7',
    data: { label: 'Azul' },
    position: { x: 500, y: 350 },
  },
  {
    id: '8',
    data: { label: 'Adicionar led' },
    position: { x: 700, y: 400 },
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Vender' },
  { id: 'e1-3', source: '1', target: '3', label: 'Alugar' },
  { id: 'e1-4', source: '1', target: '4', label: 'Consertar' },
  { id: 'e1-5', source: '1', target: '5', label: 'Decorar' },
  { id: 'e5-6', source: '5', target: '6', label: 'Pintar' },
  { id: 'e5-7', source: '5', target: '7', label: 'Pintar' },
  { id: 'e5-8', source: '5', target: '8', label: 'Enfeitar' }
];

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

export default function Flow() {
  const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("2018-07-22")
  const [valor, setValor] = useState("")
  const [active, setActive] = useState(false)
  const [nodeType, setNodeType] = useState("text")
  const edgeUpdateSuccessful = useRef(true);
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File>()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  function sendData(name: string) {
    const newNodes = [...nodes,
      {
        id: String(nodes.length+1),
        data: { label: `${name}` },
        position: { x: (500 + (nodes.length - 8) * 100), y: 0 }
      },
    ]

    try {
      setNodes(newNodes)
    } catch(error) {
      console.log(error)
    } finally {
      localStorage.setItem('nodes', JSON.stringify(newNodes))
      setTitle("")
      setValor("")
    }
  }

  function changeNodeType(type: string){
    setActive(!active)
    setNodeType(type)
  }

  useEffect(() => {
    if(localStorage.getItem('nodes')){
      let dataString = localStorage.getItem('nodes')
      setNodes(JSON.parse(dataString))
    }
  }, [])

  return (
    <main className={styles.main}>
      <Head>
        <title>React Flow Test</title>
      </Head>

      <div className={styles.form}>
        <div className={styles.status}>
          <button onClick={() => setActive(!active)}>
            Selecione o tipo de nó que deseja criar
          </button>
          {active === true &&
            <div>
              <button onClick={() => changeNodeType("text")}>Texto</button>
              <button onClick={() => changeNodeType("date")}>Data</button>
              <button onClick={() => changeNodeType("valor")}>Valor</button>
              <button onClick={() => changeNodeType("image")}>Imagem</button>
            </div>
          }
        </div>

        <div className={styles['input-option']}>
          {nodeType === "text" ?
            <div className={styles.text}>
              <input
                placeholder="Título"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              <button onClick={() => sendData(title)}>Criar</button>
            </div> : nodeType === "date" ?
            <div className={styles.date}>
              <label htmlFor="date-start">Selecione uma data:</label>

              <input
                type="date"
                id="date-start"
                name="trip-start"
                value={date}
                min="2018-01-01"
                max="2023-12-31"
                onChange={(event) => setDate(event.target.value)}
              />
              <button onClick={() => sendData(date)}>Criar</button>
            </div> : nodeType === "valor" ?
            <div className={styles.valor}>
              <label htmlFor="valor">Valor:</label>

              <input
                type="number"
                id="valor"
                name="valor"
                value={valor}
                min="10"
                max="10000"
                onChange={(event) => setValor(event.target.value)}
              />
              <button onClick={() => sendData(valor)}>Criar</button>
            </div> : nodeType === "image" ?
            <div className={styles.picture}>
              <label>
                <input
                  type="file"
                  hidden
                  onChange={({ target }) => {
                    if (target.files) {
                      const file = target.files[0]
                      setSelectedImage(URL.createObjectURL(file))
                      setSelectedFile(file)
                    }
                  }}
                />
                <div className={styles.picture__input}>
                  {
                    selectedImage ? (
                      <img src={selectedImage} alt="" />
                    ) : (
                      <span>Select Image</span>
                    )
                  }
                </div>
              </label>
              <button>Upload</button>
            </div> :
            <div></div>
          }
        </div>
      </div>
      
      <div className={styles.flow}>
        {nodes[0].data.label !== "" &&
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            snapToGrid
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onConnect={onConnect}
            fitView
            attributionPosition="top-right"
          >
            <Controls />
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        }
      </div>
    </main>
  );
}