import React from 'react'

export default function Rating({ value }) {
  if (value == null) return <span style={{color:'#888'}}>—</span>
  return <strong style={{color:'#0a74da'}}>Score: {value}</strong>
}
