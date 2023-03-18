import Head from 'next/head';
import { useCallback, useEffect, useState, useRef, useContext } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, useNodesState, useEdgesState, addEdge, updateEdge, MiniMap, useReactFlow } from 'reactflow';

import TextInputNode from '../components/TextInputNode';
import NumberInputNode from '../components/NumberInputNode';
import ImageNode from '../components/ImageNode';

import styles from '../styles/flow.module.scss';
import 'reactflow/dist/style.css';
import { DataContext } from '../DataContext';

const flowKey = 'example-flow';
const nodeTypes = {
  textInputNode: TextInputNode,
  numberInputNode: NumberInputNode,
  imageNode: ImageNode
};

const initialNodes = [
  {
    id: '1',
    type: 'textInputNode',
    data: { label: 'Hello World' },
    style: { border: '1px solid #777', borderRadius: '10px' },
    position: { x: 0, y: 0 }
  }
];

const initialEdges = [];

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
  const [rfInstance, setRfInstance] = useState(null)
  const edgeUpdateSuccessful = useRef(true);
  const { setViewport } = useReactFlow()
  const [variant, setVariant] = useState();
  const { userName, setUserName, userAge, setUserAge, nodesNumber, setNodesNumber } = useContext(DataContext)

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      setNodes(initialNodes)
      setEdges(initialEdges)
      setUserName('')
      setUserAge('')
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

  function addAgeNode(name: string, x: number, y: number) {
    const newNodes = [...nodes,
      {
        id: String(nodes.length+1),
        type: 'numberInputNode',
        data: { label: `Olá ${name}! Informe sua idade` },
        position: { x, y }
      },
    ]

    setEdges([
      { id: 'edge-1', source: '1', target: String(nodes.length+1), sourceHandle: 'a' }
    ])

    try {
      setNodes(newNodes)
    } catch(error) {
      console.log(error)
    }
  }

  function addImageNode(x: number, y: number) {
    const newNodes = [...nodes,
      {
        id: String(nodes.length+1),
        type: 'imageNode',
        data: { label: `` },
        position: { x, y }
      },
    ]

    setEdges([...edges,
      { id: 'edge-2', source: '2', target: String(nodes.length+1), sourceHandle: 'a' }
    ])

    try {
      setNodes(newNodes)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if(userName !== '') {
      addAgeNode(userName, 0, 200)
      setNodesNumber(nodesNumber+1)
      localStorage.setItem('user-name', JSON.stringify(userName));
    }
  }, [userName])

  useEffect(() => {
    if(userAge !== '') {
      addImageNode(-200, 400)
      setNodesNumber(nodesNumber+1)
      localStorage.setItem('user-age', JSON.stringify(userAge));
    }
  }, [userAge])

  useEffect(() => {
    if(localStorage.getItem(flowKey)){
      const flow = JSON.parse(localStorage.getItem(flowKey));
      const name = JSON.parse(localStorage.getItem('user-name'));
      const age = JSON.parse(localStorage.getItem('user-age'));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
        setUserName(name)
        setUserAge(age)
        setNodesNumber(flow.nodes.length)
      }
    }
  }, [])

  useEffect(() => {
    setNodesNumber(nodes.length)
  }, [nodes])

  return (
    <main className={styles.main}>
      <Head>
        <title>React Flow Test</title>
      </Head>

      <h1>React Flow</h1>
      
      <div className={styles.flow}>
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
          <Background color="#99b3ec" variant={variant} />
          <Controls />
          <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        </ReactFlow>
      </div>
    </main>
  );
}

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);