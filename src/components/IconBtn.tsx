import React from "react";

interface IconBtnProps {
    icon: JSX.Element;
    onTap?: () => void;
}

const IconBtn: React.FC<IconBtnProps> = ({icon, onTap}) => {
    return <button
        className="flex justify-center place-items-center w-8 h-8 rounded bg-slate-600 active:bg-green-600 active:rounded"
    onClick={onTap}

    >
        {icon}
    </button>
}

export default IconBtn
