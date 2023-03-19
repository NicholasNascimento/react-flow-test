import React, { memo, useContext, useEffect, useState } from 'react';
import { Handle, Position } from 'reactflow';

import { DataContext } from '../DataContext';

import styles from '../styles/flow.module.scss';

export default memo(() => {
  const { userName, userAge, setUserAge, nodesNumber } = useContext(DataContext)
  const [age, setAge] = useState(userAge)

  function NewUserName() {
    setUserAge(age)
  }

  useEffect(() => {
    setAge(userAge)
  }, [userAge])

  return (
    <div className={styles['number-input-box']}>
      <Handle type="target" position={Position.Top} />
      <label htmlFor='age'>Olá {userName}!<br /> Informe sua idade</label>
      <input
        type="number"
        id='age'
        value={age}
        min={0}
        max={100}
        onChange={event => setAge(event.target.value)}
        disabled={nodesNumber>1}
      />
      <button onClick={() => NewUserName()}>Confirmar</button>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ background: '#555' }}
      />
    </div>
  )
})