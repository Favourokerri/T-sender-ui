import AirdropForm from "./AirdropForm";
import { useAccount } from "wagmi";

export default function HomeContent() {
    const { isConnected } = useAccount();
    
    return (
        <div className="min-h-screen">
            {isConnected ? (
                <AirdropForm /> 
            ) : (
                <div className="h-full flex items-center justify-center">
                <p className="text-white text-xl  mt-4">Please connect wallet</p>
                </div>
            )}
        </div>
    );
}