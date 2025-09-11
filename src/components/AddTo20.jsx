import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import './ui/reused-animations/fade.css'


const AddTo20 = () => {


	return (
        <Container
            text="Add to 20"
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5 pb-3 flex-start'>
                Get ready to add up to 20! Check what number you need to complete the addition equation below!
            </div>
            
        </Container>
)
};


export default AddTo20;