import { useState, useMemo } from "react";
import { useChainId, useConfig, useAccount } from 'wagmi'
import { useWriteContract } from 'wagmi'
import { InputForm } from "./UI/inputField";
import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { tsenderAbi, chainsToTSender, erc20Abi } from "@/constants";
import { calculateTotal } from "../utils/calculateTotal/calculateTotal";

export default function AirdropForm () {
    const [tokenAddress, setTokenAddress] = useState("");
    const [recipients, setRecipients] = useState("");
    const [amount, setAmount] = useState("");
    const chainId = useChainId();
    const config = useConfig();
    const account = useAccount();
    const total: number = useMemo(() => calculateTotal(amount), [amount]);
    const {data: hash, writeContractAsync, isPending} = useWriteContract();

    async function getApprovedAmount(tSenderAddress: string | null): Promise<number> {
        if(!tSenderAddress) {
            alert("addrss not found please use a supported chain");
        }

        const response = await readContract(config, {
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: 'allowance',
            args: [account.address, tSenderAddress as `0x${string}`]
        });

        return response as number;

    }

    async function handleSubmit() {
        const tsenderAddress = chainsToTSender[chainId]["tsender"];
        console.log("address: ", tsenderAddress)
        const approvedAmount = await getApprovedAmount(tsenderAddress);
        
        if(approvedAmount < total) {
            const approveHash = await writeContractAsync({ 
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: 'approve',
            args: [tsenderAddress as `0x${string}`, BigInt(total)],
        })

           const approvaRecipt = await waitForTransactionReceipt(config, {
            hash:approveHash
        })

        console.log("Approval receipt:", approvaRecipt);
        await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName:"airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amount.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            },)

        } else {
            await writeContractAsync({
                abi: tsenderAbi,
                address: tsenderAddress as `0x${string}`,
                functionName:"airdropERC20",
                args: [
                    tokenAddress,
                    // Comma or new line separated
                    recipients.split(/[,\n]+/).map(addr => addr.trim()).filter(addr => addr !== ''),
                    amount.split(/[,\n]+/).map(amt => amt.trim()).filter(amt => amt !== ''),
                    BigInt(total),
                ],
            },)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent px-4 sm:px-6 lg:px-8 my-4 sm:my-6 lg:my-8">
            <div className="bg-[#2a2a2a] p-6 sm:p-8 md:p-12 rounded-xl border-2 border-[#00ffa3] shadow-[0_0_10px_#00ffa3,0_0_20px_rgba(0,255,163,0.5)] w-[90%] max-w-[90%]">
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-base sm:text-lg font-semibold mt-4 sm:mt-6 mb-4 sm:mb-6">token address</label>
                        <input
                            className="bg-[#3a3a3a] py-2 px-3 border border-[#00ffa3] placeholder:text-zinc-400 text-white shadow-xs rounded-lg focus:ring-[4px] focus:ring-[#00ffa3]/30 focus:outline-none w-full"
                            type="text"
                            placeholder="0x1234567890abcdef123467890abcdef12345678"
                            value={tokenAddress || ''}
                            onChange={e => setTokenAddress(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-base sm:text-lg font-semibold mt-4 sm:mt-6 mb-4 sm:mb-6">Recipients</label>
                        <textarea
                            className="bg-[#3a3a3a] py-2 px-3 border border-[#00ffa3] placeholder:text-zinc-400 text-white shadow-xs rounded-lg focus:ring-[4px] focus:ring-[#00ffa3]/30 focus:outline-none h-24 align-text-top w-full"
                            placeholder="0x12.., 0x34..., "
                            value={recipients || ''}
                            onChange={e => setRecipients(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-white text-base sm:text-lg font-semibold mt-4 sm:mt-6 mb-4 sm:mb-6">Amounts</label>
                        <textarea
                            className="bg-[#3a3a3a] py-2 px-3 border border-[#00ffa3] placeholder:text-zinc-400 text-white shadow-xs rounded-lg focus:ring-[4px] focus:ring-[#00ffa3]/30 focus:outline-none h-24 align-text-top w-full"
                            placeholder="100, 200, 300..... "
                            value={amount || ''}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="
                        bg-[#00ffa3] hover:bg-[#00cc82] text-[#1a1a1a] font-medium
                        py-2 px-4 rounded-lg 
                        focus:outline-none focus:shadow-[0_0_0_2px_#00ffa3,0_0_8px_0_rgba(0,255,163,0.6)]
                        active:bg-[#00b374]
                        transition-all duration-200 ease-in-out
                        shadow-xs hover:shadow-sm
                        w-full mt-4 sm:mt-6
                    "
                >
                    Submit
                </button>
            </div>
        </div>
    )
}