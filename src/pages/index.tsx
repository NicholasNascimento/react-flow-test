import Head from 'next/head';
import { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { Controls, useNodesState, useEdgesState, applyNodeChanges, applyEdgeChanges, addEdge, updateEdge, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

import styles from '../styles/flow.module.scss';

// const initialNodes = [
//   {
//     id: '0',
//     data: { label: '' },
//     position: { x: 0, y: 0 },
//     type: 'input',
//   },
// ];

const initialNodes = [
  {
    id: '1',
    data: { label: 'Você está bem?' },
    position: { x: 0, y: 0 },
    type: 'input',
  }
  // {
  //   id: '2',
  //   data: { label: 'Na faixa de preço' },
  //   position: { x: 100, y: 100 },
  // },
  // {
  //   id: '3',
  //   data: { label: 'Data' },
  //   position: { x: 200, y: 200 },
  // },
];

const initialEdges = [];

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
  const [active, setActive] = useState(false)
  const [nodeType, setNodeType] = useState("text")
  const [allTitles, setAllTitles] = useState('')
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

  function sendData() {
    const newNodes = [...nodes,
      {
        id: String(nodes.length+1),
        data: { label: `${title}` },
        position: { x: 250, y: 25 }
      },
    ]

    try {
      setNodes(newNodes)
    } catch(error) {
      console.log(error)
    } finally {
      localStorage.setItem('nodes', JSON.stringify(newNodes))
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
    //console.log(titleObj)
  }, [allTitles])

  useEffect(() => {
    console.log(nodes)
  }, [nodes])

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
              <button onClick={() => sendData()}>Criar</button>
            </div> :
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
            </div>
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