import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { useEffect, useRef, useState } from 'react'
import ModelView from './ModelView'
import { yellowImg } from '../utils'

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import { models, sizes } from '../contants'
import { animateWithGsapTimeline } from '../contants/animations'

const Model = () => {
    //there would be two iphone to show
    const [size, setSize] = useState("small")
    //other model details like small or big
    const [model, setModel] = useState({
        title: 'iPhone 15 pro in Natural Titanium',
        //color used for different color of iPhone
        color: ['#8F8A81', '#FFE7B9', '#6F6C64'],
        img:yellowImg,
    })
    //camera control for the model view for specifie the camera control
    //coming for react
    const cameraControlSmall = useRef();
    // should have each different for each model
    const cameraControlLarge = useRef();
    // now heading tag is working with animation

    //for keep the track of animation & access use this
    //install 3js
    //actual model
    const small = useRef(new THREE.Group())
    const large = useRef(new THREE.Group())

    //tracking the rotation of acutual model
    //also we need to keep track of rotation value
    const [smallRotation, setSmallRotation] = useState(0);
    const [largeRotation, setLargeRotation] = useState(0);

    const tl = gsap.timeline();

    useEffect(() => {
        if (size === 'large') {
            // we are passing props so that when to move around
            //large we need to animate small one
            animateWithGsapTimeline(tl, small, smallRotation,'#view1','#view2',{
                // this will remove form the view
                transform: "translateX(-100%)",
                duration: 2
            })
        }
      
        if (size === 'small') {
            animateWithGsapTimeline(tl, large, largeRotation,'#view2','#view1',{
                transform: "translateX(0)",
                duration: 2
            })
        }
    }, [size])


    useGSAP(() => {
        gsap.to('#heading', { y: 0, opacity:1})
    },[])
    return (
    //   3d image
      <section className='common-padding'>
            <div className='screen-max-width'>
                {/* we cant see this is animated using gsap */}
                <h1 id='heading' className='section-heading'>Take a closer look.</h1>
                <div className='flex flex-col items-center mt-5'>
                    <div className='h-[75vh] md:h-[90vh] w-full overflow-hidden relative'>
                        <ModelView index={1}
                            groupRef={small}
                            gsapType='view1'
                            controlRef={cameraControlSmall}
                            setRotationState={setSmallRotation}
                            item={model}
                            size={size}
                        />
                        {/* there is two iphone that why two modelview 1st for small and 2nd large*/}
                         <ModelView index={2}
                            groupRef={large}
                            gsapType='view2'
                            controlRef={cameraControlLarge}
                            setRotationState={setLargeRotation}
                            item={model}
                            size={size}
                        />
                        <Canvas
                            //this for reset the position 3d model
                            className='w-full h-full' style={{ position: "fixed", top: 0, bottom: 0, left: 0, right: 0, overflow: "hidden" }}
                            //we also need to access to event source
                            //this usefull when you want to interact with model
                            eventSource={document.getElementById('root')}
                        >
                            {/* viewport is a way to render multiple views of a model in same canvaus */}
                            {/* by doing this will allow as to animate model */}
                            <View.Port/>

                        </Canvas>
                    </div>
                    <div className='mx-auto w-full'>
                        <p className='text-sm font-light text-center mb-5'>{model.title}</p>
                        <div className='flex-center'>
                            {/* circle animation below the  iphone 15pro in natural titanium*/}
                            <ul className='color-container'>
                                {/* which imported from constants with array having couple of objects */}
                                {models.map((item, i) => ( 
                                    // curser pointer used for changing the pointer to click pointer
                                    <li key={i} className='w-6 h-6 rounded-full mx-2 cursor-pointer' style={{ backgroundColor: item.color[0] }}
                                    onClick={()=> setModel(item)}/>
                                ))}
                            </ul>
                            <button className="size-btn-container">
                                {/* size is imported from the contants  */}
                                {sizes.map(({ label, value }) => (
                                    <span key={label} className='size-btn' style={{
                                        backgroundColor: size === value ? "white" : "transparent", color: size === value ? 
                                            // setSize is hook that used to select the size of phone button beside the color selection button
                                       "black":"white"}} onClick={()=>setSize(value)}>
                                        {label}
                                    </span>
                                ))}
                            </button>

                        </div>
                    </div>
                </div>
              
            </div>
            
    </section>
  )
}

export default Model