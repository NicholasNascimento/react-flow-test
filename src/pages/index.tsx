import Head from 'next/head';
import { useCallback, useEffect, useState, useRef } from 'react';
import ReactFlow, { ReactFlowProvider, Background, Controls, useNodesState, useEdgesState, addEdge, updateEdge, MiniMap, useReactFlow } from 'reactflow';

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
    type: 'imageNode',
    data: { label: 'Hello World' },
    style: { border: '1px solid #777', padding: 10 },
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
  const [nodeType, setNodeType] = useState("text")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("2018-07-22")
  const [valor, setValor] = useState("")
  const [active, setActive] = useState(false)
  const [rfInstance, setRfInstance] = useState(null)
  const edgeUpdateSuccessful = useRef(true);
  const { setViewport } = useReactFlow()
  const [variant, setVariant] = useState();

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

  useEffect(() => {
    console.log(setViewport)
  }, [setViewport])

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