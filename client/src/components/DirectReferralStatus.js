import React from 'react';

const DirectReferralStatus = ({ activeCount = 0, inactiveCount = 0 }) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',width:'100%',marginTop:'8px'}}>
    <div style={{flex:1,textAlign:'center',background:'#e6ffe6',color:'#2e7d32',padding:'6px 0',borderRadius:'8px',fontWeight:600,marginRight:'6px'}}>
      Active Members<br />
      <span style={{fontSize:'1.3rem',fontWeight:700}}>{activeCount}</span>
    </div>
    <div style={{flex:1,textAlign:'center',background:'#ffeaea',color:'#c62828',padding:'6px 0',borderRadius:'8px',fontWeight:600,marginLeft:'6px'}}>
      Inactive Members<br />
      <span style={{fontSize:'1.3rem',fontWeight:700}}>{inactiveCount}</span>
    </div>
  </div>
);

export default DirectReferralStatus;
