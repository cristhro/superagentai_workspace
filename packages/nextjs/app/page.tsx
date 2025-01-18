"use client";

import React, { useEffect, useState } from "react";
import { useEthStarkAccount } from "~~/dynamic/hooks/useEthStarkAccount";
import { useEthStarkContract } from "~~/dynamic/hooks/useEthStarkContract";
import { useEthStarkDeployedContract } from "~~/dynamic/hooks/useEthStarkDeployedContract";
import { useEthStarkEventHistory } from "~~/dynamic/hooks/useEthStarkEventHistory";
import { useEthStarkReadContract } from "~~/dynamic/hooks/useEthStarkReadContract";
import { useEthStarkTargetNetwork } from "~~/dynamic/hooks/useEthStarkTargetNetwork";
import { useEthStarkWriteContract } from "~~/dynamic/hooks/useEthStarkWriteContract";
import { useGlobalState } from "~~/dynamic/services/store/global";

const Home = () => {
  const currentChain = useGlobalState(state => state.currentChain);
  const { address } = useEthStarkAccount();
  const targetNetwork = useEthStarkTargetNetwork();
  const [greetingState, setGreetingState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: contractData,
    isLoading: contractLoading,
    error: contractError,
  } = useEthStarkContract({
    eth: {
      contractName: "YourContract",
    },
    strk: {
      contractName: "YourContract",
    },
  });

  const {
    data: deployedContractInfo,
    isLoading: deployedContractLoading,
    error: deployedContractError,
  } = useEthStarkDeployedContract({
    eth: { contractName: "YourContract" },
    strk: { contractName: "YourContract" },
  });

  const { data: eventHistoryData, isLoading: eventHistoryLoading } = useEthStarkEventHistory({
    strk: {
      contractName: "YourContract",
      eventName: "contracts::YourContract::YourContract::GreetingChanged",
      fromBlock: 1n,
      enabled: true,
      watch: true,
    },
    eth: {
      contractName: "YourContract",
      eventName: "GreetingChange",
      fromBlock: 1n,
      enabled: true,
      watch: true,
    },
  });

  const {
    isLoading: isGreetingLoading,
    data: greeting,
    refetch: refetchGreeting,
  } = useEthStarkReadContract({
    strk: { contractName: "YourContract", functionName: "greeting", watch: true, args: [] },
    eth: { contractName: "YourContract", functionName: "greeting", watch: true },
  });

  const { writeAsync, isPending: greetingPending } = useEthStarkWriteContract({
    strk: {
      contractName: "YourContract",
      functionName: "set_greeting",
      args: [greetingState, 0],
    },
    eth: {
      contractName: "YourContract",
      functionName: "setGreeting",
      args: [greetingState],
    },
  });

  async function handleClick() {
    try {
      await writeAsync();
      // after transaction successfull, we need refetch the contract data
      await refetchGreeting();
    } catch (error) {
      console.error(error);
    }
  }

  const handleGreetingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGreetingState(e.target.value);
  };

  useEffect(() => {
    refetchGreeting();
  }, []);

  useEffect(() => {
    setGreetingState(greeting ? greeting.toString() : "");
  }, [greeting]);

  useEffect(() => {
    if (contractLoading && deployedContractLoading && eventHistoryLoading && isGreetingLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [contractLoading, deployedContractLoading, eventHistoryLoading, isGreetingLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl text-center mt-10">Starknet and EVM chains playground</h1>
      <div className="w-[80%] mx-auto flex justify-center items-center flex-col">
        <table className="mt-5 w-[60%] mx-auto text-left">
          <tbody>
            <tr>
              <td className="font-bold max-w-[200px]">Current chain</td>
              <td className="text-left">{currentChain}</td>
            </tr>

            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">Current address</td>
              <td className="max-w-[400px] truncate text-left">{address}</td>
            </tr>
            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">YourContract greeting</td>
              <td className="text-left">{isGreetingLoading ? "Loading..." : String(greeting)}</td>
            </tr>
            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">Network</td>
              <td className="text-left">{targetNetwork?.name}</td>
            </tr>
            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">Contract address</td>
              <td>
                {!contractError ? <div>{contractLoading ? "Loading..." : contractData?.address}</div> : contractError}
              </td>
            </tr>
            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">Deployed contract info</td>
              <td>
                {!deployedContractError ? (
                  <div>{deployedContractLoading ? "Loading..." : deployedContractInfo?.address}</div>
                ) : (
                  deployedContractError
                )}
              </td>
            </tr>
            <tr className="h-[20px]"></tr>
            <tr>
              <td className="font-bold max-w-[200px]">Events</td>
              <td>
                {eventHistoryData &&
                  eventHistoryData.map((event: any, index: number) => (
                    <div key={index}>
                      Event {index}: {currentChain == "ethereum" ? event?.topics[1] : event.args.new_greeting}
                    </div>
                  ))}
              </td>
            </tr>
            <tr className="h-[20px]"></tr>
          </tbody>
        </table>

        {/* input for greeting */}
        <input
          className="mt-5 input input-bordered w-fit  text-black"
          type="text"
          value={greetingState}
          onChange={handleGreetingChange}
        />
        {greetingPending ? (
          <div>Loading...</div>
        ) : (
          <div
            className="mt-3 bg-green-100 text-black rounded-full w-fit px-5 py-1 cursor-pointer"
            onClick={handleClick}
          >
            Click me to change greeting and emit an event!
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
