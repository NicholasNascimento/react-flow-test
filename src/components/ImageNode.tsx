import React, { memo, useContext } from 'react';
import { Handle, Position } from 'reactflow';

import { DataContext } from '../DataContext';

import styles from '../styles/flow.module.scss';

export default memo(() => {
  const { userAge } = useContext(DataContext)

  return (
    <div className={styles['image-box']}>
      <Handle type="target" position={Position.Top} />
      {Number(userAge) >= 18 ?
      <img src={"./drink.jpg"} alt="Drink Image" /> :
      <img src='./block.png' alt='Block Image' />
      }
    </div>
  )
})