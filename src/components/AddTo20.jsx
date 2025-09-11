import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Container } from './ui/reused-ui/Container.jsx'
import './ui/reused-animations/fade.css'
import './AddTo20.css'


const AddTo20 = () => {
    // State Management
    const [equations, setEquations] = useState([]);
    const [currentEquationIndex, setCurrentEquationIndex] = useState(0);
    const [input, setInput] = useState(1);
    const [isWaitingForNext, setIsWaitingForNext] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [inputSectionFadingOut, setInputSectionFadingOut] = useState(false);
    const [showAnswerInEquation, setShowAnswerInEquation] = useState(false);

    // Variable Management

    // Functions
    // Utility function to shuffle array
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const generateEquationsSet = useCallback(() => {
        // Helper function to generate random numbers with sum > 10 and ≤ 20
        const generateRandomNumbers = () => {
            let num1, num2, sum;
            do {
                num1 = Math.floor(Math.random() * 15) + 1; // 1 to 15
                num2 = Math.floor(Math.random() * 15) + 1; // 1 to 15
                sum = num1 + num2;
            } while (sum <= 10 || sum > 20); // Keep generating until sum is > 10 and ≤ 20
            return { num1, num2, sum };
        };
        
        const blankStyle = "inline-block w-12 h-8 border-b-2 border-gray-400 mx-1";
        
        // Generate different numbers for each equation format
        const numbers1 = generateRandomNumbers();
        const numbers2 = generateRandomNumbers();
        const numbers3 = generateRandomNumbers();
        const numbers4 = generateRandomNumbers();
        
        const textSize = "text-3xl font-bold text-gray-800";
        
        // Create all 4 equation formats with data and answers
        const equationSet = [
            // _ + x = y (missing first number)
            {
                type: 'missing-first',
                num1: numbers1.num1,
                num2: numbers1.num2,
                sum: numbers1.sum,
                answer: numbers1.num1
            },
            
            // x + _ = y (missing second number)
            {
                type: 'missing-second',
                num1: numbers2.num1,
                num2: numbers2.num2,
                sum: numbers2.sum,
                answer: numbers2.num2
            },
            
            // x + y = _ (missing sum)
            {
                type: 'missing-sum',
                num1: numbers3.num1,
                num2: numbers3.num2,
                sum: numbers3.sum,
                answer: numbers3.sum
            },
            
            // x more than y is _ (word problem)
            {
                type: 'word-problem',
                num1: numbers4.num1,
                num2: numbers4.num2,
                sum: numbers4.sum,
                answer: numbers4.sum
            }
        ];
        
        // Shuffle the equations and set them
        const shuffledEquations = shuffleArray(equationSet);
        setEquations(shuffledEquations);
        setCurrentEquationIndex(0);
    }, []);

    // Function to render current equation with or without answer
    const renderCurrentEquation = () => {
        if (equations.length === 0) return null;
        
        const currentEquation = equations[currentEquationIndex];
        const { type, num1, num2, sum, answer } = currentEquation;
        
        const textSize = "text-3xl font-bold text-gray-800";
        const blankStyle = "inline-block w-12 h-8 border-b-2 border-gray-400 mx-1";
        const greenAnswerStyle = "inline-block w-12 h-8 mx-1 text-green-600 font-bold fade-in-in-place-animation";
        
        switch (type) {
            case 'missing-first':
                return (
                    <div key="missing-first" className={textSize}>
                        {showAnswerInEquation ? (
                            <span className={greenAnswerStyle}>{answer}</span>
                        ) : (
                            <span className={blankStyle}></span>
                        )} + {num2} = {sum}
                    </div>
                );
            case 'missing-second':
                return (
                    <div key="missing-second" className={textSize}>
                        {num1} + {showAnswerInEquation ? (
                            <span className={greenAnswerStyle}>{answer}</span>
                        ) : (
                            <span className={blankStyle}></span>
                        )} = {sum}
                    </div>
                );
            case 'missing-sum':
                return (
                    <div key="missing-sum" className={textSize}>
                        {num1} + {num2} = {showAnswerInEquation ? (
                            <span className={greenAnswerStyle}>{answer}</span>
                        ) : (
                            <span className={blankStyle}></span>
                        )}
                    </div>
                );
            case 'word-problem':
                return (
                    <div key="word-problem" className={textSize}>
                        {num1} more than {num2} is {showAnswerInEquation ? (
                            <span className={greenAnswerStyle}>{answer}</span>
                        ) : (
                            <span className={blankStyle}></span>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    // Function to move to next equation or generate new set
    const nextEquation = () => {
        setInput(1); // Reset input for next equation
        setIsWaitingForNext(false); // Reset waiting state
        setIsShaking(false); // Reset shake animation state
        setShowSuccessMessage(false); // Reset success message
        setInputSectionFadingOut(false); // Reset fade out state
        setShowAnswerInEquation(false); // Reset answer visibility
        
        if (currentEquationIndex < equations.length - 1) {
            // Move to next equation in current set
            setCurrentEquationIndex(currentEquationIndex + 1);
        } else {
            // Generate new set when we've reached the end
            generateEquationsSet();
        }
    };

    // Generate initial equations set when component mounts
    useEffect(() => {
        generateEquationsSet();
    }, [generateEquationsSet]);

    const checkAnswer = () => {
        if (isWaitingForNext) return; // Prevent multiple clicks
        
        if (input === equations[currentEquationIndex].answer) {
            confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 } });
            setIsWaitingForNext(true);
            
            // Show the answer in green in the equation
            setShowAnswerInEquation(true);
            
            // Start fade out animation
            setInputSectionFadingOut(true);
            
            // After fade out completes, show success message
            setTimeout(() => {
                setShowSuccessMessage(true);
            }, 500); // Wait for fade out animation to complete
            
            // Wait total 4 seconds then move to next equation
            setTimeout(() => {
                nextEquation();
            }, 4000);
        } else {
            // Incorrect answer - trigger shake animation
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 500); // Reset shake after animation duration
        }
    }

	return (
        <Container
            text="Add to 20"
            showResetButton={false}
            borderColor="#FF7B00"
            showSoundButton={true}
        >
            {/* Intro Text */}
            <div className='text-center text-sm text-gray-500 p-5 pb-3 flex-start'>
                Get ready to add up to 20! Check what number you need to complete the addition equation below.
            </div>

            {/* Addition Equation */}
            <div className="flex-grow flex justify-center items-center text-center py-6 mx-4">
                {renderCurrentEquation()}
            </div>

            {/* Input Section */}
            {showSuccessMessage ? (
                <div className='absolute bottom-0 h-[104px] w-[100%] flex justify-center items-center mb-8 fade-in-up-animation'>
                    <div className='text-2xl font-bold text-green-600'>
                        Great job!
                    </div>
                </div>
            ) : (
                <div className={`absolute bottom-0 w-[100%] flex justify-center items-center gap-2 mb-8 ${inputSectionFadingOut ? 'fade-out-up-animation' : ''}`}>
                    <div className='w-[50px] flex flex-col justify-center items-center gap-2'>
                        <button 
                            className={`w-6 h-6 flex items-center justify-center rounded-md border shadow-sm ${
                                isWaitingForNext 
                                    ? 'bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 cursor-default' 
                                    : 'bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300'
                            }`}
                            onClick={() => !isWaitingForNext && setInput(Math.min(input + 1, 20))}
                            aria-label='Increase Length'
                            disabled={isWaitingForNext}
                            >
                            ▲
                        </button>
                        <input 
                            type="text" 
                            readOnly
                            tabIndex={-1}
                            value={input}
                            className='w-full text-center border-2 border-orange-500 rounded-lg p-2 focus:outline-none shadow-sm select-none pointer-events-none text-gray-800' 
                            />
                        <button 
                            className={`w-6 h-6 flex items-center justify-center rounded-md border shadow-sm ${
                                isWaitingForNext 
                                    ? 'bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300 cursor-default' 
                                    : 'bg-orange-100 hover:bg-orange-200 text-orange-600 border border-orange-300'
                            }`}
                            onClick={() => !isWaitingForNext && setInput(Math.max(input - 1, 1))}
                            aria-label='Decrease Length'
                            disabled={isWaitingForNext}
                        >
                            ▼
                        </button>
                    </div>
                         <button 
                             onClick={() => checkAnswer()}
                             disabled={isWaitingForNext}
                             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                 isWaitingForNext
                                     ? 'bg-green-500 hover:bg-green-600 border border-green-800/50 border-2 text-white cursor-default'
                                     : 'bg-green-500 hover:bg-green-600 border border-green-800/50 border-2 text-white'
                             } ${isShaking ? 'shake' : ''}`}
                         >
                             Check
                         </button>
                </div>
            )}

            {/* Just to take up space */}
            <div className='h-[124px]'/>
        </Container>
)
};


export default AddTo20;