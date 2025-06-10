"use client"
export interface InputFormProps {
    label: string
    placeholder: string
    value?: string
    type?: string
    large?: boolean
    onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function InputForm({ label, placeholder, value, type, large, onChange }: InputFormProps) {
    return (
     <div className="flex flex-col gap-1.5">
        <label className="text-white text-lg font-semibold mt-2 mb-2">{label}</label>
        {large ? (
            <textarea
                className="bg-[#3a3a3a] py-2 px-3 border border-[#00ffa3] placeholder:text-zinc-400 text-white shadow-xs rounded-lg focus:ring-[4px] focus:ring-[#00ffa3]/30 focus:outline-none h-24 align-text-top"
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                required
            />
        ) : (
            <input
                className="bg-[#3a3a3a] py-2 px-3 border border-[#00ffa3] placeholder:text-zinc-400 text-white shadow-xs rounded-lg focus:ring-[4px] focus:ring-[#00ffa3]/30 focus:outline-none"
                type={type}
                placeholder={placeholder}
                value={value || ''}
                onChange={onChange}
                required
            />
        )}
    </div>
    )
}