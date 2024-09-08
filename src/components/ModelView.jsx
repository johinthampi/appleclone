import { Html, OrbitControls, PerspectiveCamera, View } from '@react-three/drei'
import React, { Suspense } from 'react'
import Lights from './Lights'
import Iphone from './Iphone'
import * as THREE from 'three'
import Loader from './Loader'




//for make 3d image color change
//pass the props to modelview component
const ModelView = ({index,groupRef,gsapType,controlRef,setRotationState,size,item}) => {
  return (
    // this for three js
    <View
      index={index}
      id={gsapType}
      //in this we can swap left and right the two size of screen below 3d image
      className={`w-full h-full absolute
        ${index===2 ? 'right-[-100%]': ""} `}
    >
      {/* ambient light */}
      <ambientLight intensity={0.3} />
      {/* we need both camera and light to get the picture */}

      {/* from react 3 dre  */}
      <PerspectiveCamera makeDefault position={[0, 0, 4]} />
      {/* till it is dark we use component light.js*/}
      <Lights />
          {/* oribitcontrol help move camera using the mouse  */}
      <OrbitControls
        // traversing over our model
        ref={controlRef}
        //no need zoom in
        enableZoom={false}
        //not moving around we use pan
        enablePan={false}
        // for slow and standy rotation 
        rotateSpeed={0.4}
        // to target the center of the screen
        //call a vector to position using constructor
        target={new THREE.Vector3(0, 0, 0)}
        //camera stop rotating we get angle of camera so we know where we are
        onEnd={()=>setRotationState(controlRef.current.getAzimuthalAngle())}
      />

      {/* position used to position model in center */}
      <group ref={groupRef} name={`${index === 1} ? "small" : "large"`} position={[0,0,0]}>
      {/* it is loader for text before loading 3d */}
        <Suspense fallback={<Loader/>}>
          {/* scaling the 3d image of phone */}
          <Iphone scale={index === 1 ? [15, 15, 15] : [17, 17, 17]}
            item={item} size={size} />
        </Suspense>
        </group>
    </View>
  )
}

export default ModelView