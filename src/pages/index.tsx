import Head from 'next/head';
import { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { ReactFlowProvider, Controls, useNodesState, useEdgesState, addEdge, updateEdge, MiniMap, useReactFlow } from 'reactflow';

import ImageNode from '../components/ImageNode';

import styles from '../styles/flow.module.scss';
import 'reactflow/dist/style.css';
import { IoMdArrowDropdown } from 'react-icons/io'

const flowKey = 'example-flow';
const nodeTypes = {
  imageNode: ImageNode,
};

const initialNodes = [
  {
    id: '1',
    data: { label: 'O que você gostaria de fazer com esse automóvel?' },
    position: { x: 300, y: 0 },
    type: 'input',
  },
  {
    id: '2',
    data: { label: 'Na faixa de preço:' },
    position: { x: 0, y: 200 },
  },
  {
    id: '3',
    data: { label: 'Por quanto tempo?' },
    position: { x: 200, y: 200 },
  },
  {
    id: '4',
    data: { label: 'Qual é o defeito?' },
    position: { x: 400, y: 200 },
  },
  {
    id: '5',
    data: { label: 'O que você deseja fazer?' },
    position: { x: 600, y: 200 },
  },
  {
    id: '6',
    data: { label: '🚗' },
    position: { x: 300, y: 350 },
  },
  {
    id: '7',
    data: { label: '🚙' },
    position: { x: 500, y: 350 },
  },
  {
    id: '8',
    data: { label: 'Trocar pneus' },
    position: { x: 700, y: 400 },
  }
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Vender' },
  { id: 'e1-3', source: '1', target: '3', label: 'Alugar' },
  { id: 'e1-4', source: '1', target: '4', label: 'Consertar' },
  { id: 'e1-5', source: '1', target: '5', label: 'Modificar' },
  { id: 'e5-6', source: '5', target: '6', label: 'Pintar' },
  { id: 'e5-7', source: '5', target: '7', label: 'Pintar' },
  { id: 'e5-8', source: '5', target: '8', label: 'Customizar' }
];

const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'imageNode':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};

const Flow = () => {
  const [nodes, setNodes , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeType, setNodeType] = useState("text")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("2018-07-22")
  const [valor, setValor] = useState("")
  const [active, setActive] = useState(false)
  const [rfInstance, setRfInstance] = useState(null)
  const edgeUpdateSuccessful = useRef(true);
  const { setViewport } = useReactFlow()

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      setNodes(initialNodes);
      setEdges(initialEdges);
    };

    restoreFlow();
  }, [setNodes, setViewport]);

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

  function addNode(name: string) {
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
      setTitle("")
      setValor("")
    }
  }

  function changeNodeType(type: string){
    setActive(!active)
    setNodeType(type)
  }

  useEffect(() => {
    if(localStorage.getItem(flowKey)){
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    }
  }, [])

  function addImage() {
    const newNodes = [...nodes,
      {
        id: String(nodes.length+1),
        type: 'imageNode',
        data: { label: `${name}` },
        style: { border: '1px solid #777', padding: 10 },
        position: { x: (500 + (nodes.length - 8) * 100), y: 0 }
      },
    ]

    try {
      setNodes(newNodes)
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <main className={styles.main}>
      <Head>
        <title>React Flow Test</title>
      </Head>

      <h1>C2S.Test</h1>
      <div className={styles.form}>
        <div className={styles.status}>
          <button className={styles.type} onClick={() => setActive(!active)}>
            Selecione o tipo de nó <strong><IoMdArrowDropdown /></strong>
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
              <button onClick={() => addNode(title)}>Criar</button>
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
              <button onClick={() => addNode(date)}>Criar</button>
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
              <button onClick={() => addNode(valor)}>Criar</button>
            </div> : nodeType === "image" ?
            <div>
              <button onClick={() => addImage()}>Criar</button>
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
            nodeTypes={nodeTypes}
            snapToGrid
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onConnect={onConnect}
            onInit={setRfInstance}
            fitView
            attributionPosition="top-right"
          >
            <div className={styles.save__controls}>
              <button onClick={onSave}>Salvar</button>
              <button onClick={onRestore}>Restaurar</button>
            </div>
            <Controls />
            <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
          </ReactFlow>
        }
      </div>
    </main>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);