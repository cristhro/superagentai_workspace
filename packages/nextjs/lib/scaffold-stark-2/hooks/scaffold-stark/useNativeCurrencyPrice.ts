import { useGlobalState } from "@scaffold-stark-2/services/store/store";
import { priceService } from "@scaffold-stark-2/services/web3/PriceService";
import { useEffect, useRef } from "react";

export const useNativeCurrencyPrice = () => {
  const setNativeCurrencyPrice = useGlobalState(
    (state) => state.setNativeCurrencyPrice,
  );
  const setStrkCurrencyPrice = useGlobalState(
    (state) => state.setStrkCurrencyPrice,
  );
  const ref = useRef<string>(priceService.getNextId().toString());
  useEffect(() => {
    const id = ref.current;
    priceService.startPolling(id, setNativeCurrencyPrice, setStrkCurrencyPrice);
    return () => {
      priceService.stopPolling(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
