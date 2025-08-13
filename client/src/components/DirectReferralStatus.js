import React from 'react';

const DirectReferralStatus = ({ activeCount = 0, inactiveCount = 0 }) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',marginTop:'4px'}}>
    <div style={{flex:1,textAlign:'center',background:'#e6ffe6',color:'#2e7d32',padding:'2px 0',borderRadius:'6px',fontWeight:600,marginRight:'4px',fontSize:'0.95rem'}}>
      Active Members<br />
      <span style={{fontSize:'1.05rem',fontWeight:700}}>{activeCount}</span>
    </div>
    <div style={{flex:1,textAlign:'center',background:'#ffeaea',color:'#c62828',padding:'2px 0',borderRadius:'6px',fontWeight:600,marginLeft:'4px',fontSize:'0.95rem'}}>
      Inactive Members<br />
      <span style={{fontSize:'1.05rem',fontWeight:700}}>{inactiveCount}</span>
    </div>
  </div>
);

export default DirectReferralStatus;
