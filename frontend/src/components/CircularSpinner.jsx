import { useTheme } from '@/contexts/theme-provider';
import React from 'react';

const CircularSpinner = ({
    Width = "50px",
    StrokeWidth = "4",
    StrokeHex,
    CapShape = "round"
}) => {

    const { theme } = useTheme()
    const CapShapes = ['round', 'square'];

    const CircleDefaultStyling = {
        stroke: StrokeHex || (theme == 'dark' ? '#fafafa' : (theme == 'light' ? '#18181b' : '#71717a')),
        strokeWidth: StrokeWidth || '4',
        strokeLinecap: ((CapShape && CapShapes.includes(CapShape)) && CapShape) || 'round',
        animation: 'dash 1.5s ease-in-out infinite'
    }

    const SpinnerStyling = {
        width: Width || '50px',
        height: Width || '50px'
    }

    return (
        <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center  bg-inherit backdrop-blur-sm z-50'>
            <svg style={ SpinnerStyling } className={`animate-spin z-10`} viewBox="0 0 50 50">
                <circle className={`fill-none`}
                    cx="25"
                    cy="25"
                    r="20"
                    style={ CircleDefaultStyling }
                ></circle>
            </svg>
            <style>{`
                @keyframes dash {
                    0% {
                        stroke-dasharray: 1, 150;
                        stroke-dashoffset: 0;
                    }
                    50% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -34;
                    }
                    100% {
                        stroke-dasharray: 90, 150;
                        stroke-dashoffset: -124;
                    }
                }
            `}</style>
        </div>
    );
}

export default CircularSpinner;