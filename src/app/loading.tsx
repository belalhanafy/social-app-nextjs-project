
'use client'
import { Vortex } from "react-loader-spinner";
export default function Loading() {
  return (
    <>
      <div style={{ height:"100vh", display: "flex", justifyContent: "center", alignItems:"center" }}>
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={['blue',"blue","blue","black","black","black"]}
          />
      </div>
    </>
  );
}
