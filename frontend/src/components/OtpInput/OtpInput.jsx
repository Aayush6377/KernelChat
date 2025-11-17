import React, { useRef } from 'react';

const OtpInput = ({ length = 6, value, onChange }) => {
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (!/^[0-9]$/.test(val) && val !== "") return;

        const newOtp = value.split('');
        newOtp[index] = val;
        onChange(newOtp.join('').slice(0, length));

        if (val !== "" && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!value[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData
            .getData('text')
            .trim()
            .slice(0, length);
            
        if (/^[0-9]+$/.test(pastedData)) {
            onChange(pastedData);
            const lastFilledIndex = Math.min(pastedData.length, length) - 1;
            inputRefs.current[lastFilledIndex]?.focus();
        }
    };

    return (
        <div className="flex justify-center gap-1 sm:gap-2" onPaste={handlePaste}>
            {Array(length).fill("").map((_, index) => (
                <input
                    key={index}
                    ref={el => (inputRefs.current[index] = el)}
                    type="text" 
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={value[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold bg-slate-700/50 border border-slate-600 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            ))}
        </div>
    );
};

export default OtpInput;