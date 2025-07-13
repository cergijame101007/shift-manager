import { ButtonProps } from "@/lib/utils/types";

const Button: React.FC<ButtonProps> = ({ onClick, children, className }) => {
    const baseClass = "py-2 px-4 rounded shadow transition"
    const defaultClass = "bg-gray-700 text-white hover:bg-gray-800"

    return (
        <div className="mt-6">
            <button onClick={onClick} className={`${baseClass} ${className ?? defaultClass}`}>
                {children}
            </button>
        </div>
    )
}

export default Button;