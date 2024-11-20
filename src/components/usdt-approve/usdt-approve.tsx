import { useWatchContractEvent } from "wagmi";
import usdtAbi from "@/abi/USDT.json";
import {
  useAccount,
  useWriteContract,
  useSimulateContract,
} from "wagmi";

const USDT_ADDRESS = process.env
  .NEXT_PUBLIC_USDT_CONTRACT_ADDRESS as `0x${string}`;
const MAIN_CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_MAIN_CONTRACT_ADDRESS as `0x${string}`;

export default function UsdtApprove(props: {
  amount: string | number;
  onApprove?: () => void;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) {
  const { address: currentAddress } = useAccount();
  const {
    data: approveData,
    error: simulateError,
    isSuccess: approveIsSuccess,
    isLoading: approveIsLoading,
    isPending: approveIsPending,
  } = useSimulateContract({
    address: USDT_ADDRESS,
    abi: usdtAbi.abi,
    functionName: "approve",
    args: [MAIN_CONTRACT_ADDRESS, +props.amount * 10 ** 18],
  });

  const { data: hash, writeContract } = useWriteContract();
  const onApproveHandler = async () => {
    props.onApprove && props.onApprove();
    if (currentAddress) {
      const result = await writeContract(approveData!.request);
      console.log("result 🚀🚀🚀", result);
      if (approveIsSuccess) {
        console.log("approveIsSuccess 🚀🚀🚀", approveIsSuccess);
      } else {
        console.log("error 🔴🔴🔴", simulateError);
      }
    }
  };
  useWatchContractEvent({
    address: USDT_ADDRESS,
    abi: usdtAbi.abi,
    eventName: "Approval",
    onLogs(logs) {
      console.log("USDTApproval event logs 🔵🔵🔵", logs);
      props.onSuccess && props.onSuccess();
      // 解析event
    //   const event = logs[0];
    //   const { args } = event;
    //   console.log("args 🚀🚀🚀", args);
    },
    onError(error) {
      console.log("USDTApproval event error 🔴🔴🔴", error);
      props.onError && props.onError(error);
    },
  });

  return (
    <button className="btn-secondary w-[360px] h-[56px]" type="button" onClick={onApproveHandler}>
      Approve
    </button>
  );
}