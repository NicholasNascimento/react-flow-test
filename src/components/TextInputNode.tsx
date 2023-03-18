import React, { memo, useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

import { DataContext } from '../DataContext';

import styles from '../styles/flow.module.scss';

export default memo(() => {
  const { userName, setUserName, nodesNumber } = useContext(DataContext)
  const [name, setName] = useState(userName)

  function NewUserName() {
    setUserName(name)
  }

  useEffect(() => {
    setName(userName)
  }, [userName])

  return (
    <div className={styles['text-input-box']}>
      <label htmlFor="name">Informe seu nome</label>
      <input
        type="text"
        id='name'
        value={name}
        onChange={event => setName(event.target.value)}
        disabled={nodesNumber>1}
      />
      <button
        onClick={() => NewUserName()}
        disabled={nodesNumber>1}
      >Confirmar</button>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ background: '#555' }}
      />
    </div>
  )
})