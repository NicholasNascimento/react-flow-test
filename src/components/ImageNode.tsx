import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(() => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      <img src="/car.jpg" alt="" style={{ width: "200px", height: "100px" }} />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
      />
    </>
  );
});