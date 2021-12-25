import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCollectibles, getTokens } from '../ducks/metamask/metamask';
import { ERC1155, ERC721, ERC20 } from '../helpers/constants/common';
import {
  calcTokenAmount,
  getAssetDetails,
  getTokenAddressParam,
  getTokenValueParam,
} from '../helpers/utils/token-util';
import { getTokenData } from '../helpers/utils/transactions.util';
import { getTokenList } from '../selectors';
import { useTokenTracker } from './useTokenTracker';

export function useAssetDetails(tokenAddress, transactionData, fromAddress) {
  const tokens = useSelector(getTokens);
  const collectibles = useSelector(getCollectibles);
  const tokenList = useSelector(getTokenList);
  const [currentAsset, setCurrentAsset] = useState(null);
  useEffect(() => {
    async function getAndSetAssetDetails() {
      const assetDetails = await getAssetDetails(
        tokenAddress,
        fromAddress,
        transactionData,
        collectibles,
        tokens,
        tokenList,
      );
      setCurrentAsset(assetDetails);
    }
    getAndSetAssetDetails();
  }, [tokenAddress, transactionData]);

  let assetStandard,
    assetName,
    assetAddress,
    // tokenTrackerBalance,
    tokenSymbol,
    decimals,
    tokenImage,
    userBalance,
    tokenValue,
    toAddress,
    tokenAmount,
    tokenData;

  if (currentAsset) {
    assetStandard = currentAsset?.standard;
    assetAddress = currentAsset?.address;
    tokenSymbol = currentAsset?.symbol;
    tokenImage = currentAsset?.image;
    tokenData = getTokenData(transactionData);
    toAddress = getTokenAddressParam(tokenData);
    if (assetStandard === ERC721 || assetStandard === ERC1155) {
      assetName = currentAsset?.name;
    }
    if (assetStandard === ERC20) {
      // const { tokensWithBalances } = useTokenTracker([
      //   { ...currentAsset, address: tokenAddress },
      // ]);
      // tokenTrackerBalance = tokensWithBalances[0]?.balance || '';
      userBalance = currentAsset?.balance;
      decimals = Number(currentAsset?.decimals.toString(10));
      tokenValue = getTokenValueParam(tokenData);
      // TODO this calculation is screwed up
      tokenAmount =
        tokenData && calcTokenAmount(tokenValue, decimals).toString(10);
    }
  }
  return {
    assetStandard,
    assetName,
    assetAddress,
    userBalance,
    // tokenTrackerBalance,
    tokenSymbol,
    decimals,
    tokenImage,
    tokenValue,
    toAddress,
    tokenAmount,
    tokenData,
  };
}
