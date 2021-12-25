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

export function useAssetDetails(tokenAddress, userAddress, transactionData) {
  const tokens = useSelector(getTokens);
  const collectibles = useSelector(getCollectibles);
  const tokenList = useSelector(getTokenList);
  const [currentAsset, setCurrentAsset] = useState(null);
  useEffect(() => {
    async function getAndSetAssetDetails() {
      const assetDetails = await getAssetDetails(
        tokenAddress,
        userAddress,
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
    tokenSymbol,
    decimals,
    tokenImage,
    userBalance,
    tokenValue,
    toAddress,
    tokenAmount;

  if (currentAsset) {
      const tokenData = getTokenData(transactionData);
    assetStandard = currentAsset?.standard;
    assetAddress = currentAsset?.address;
    tokenSymbol = currentAsset?.symbol;
    tokenImage = currentAsset?.image;
    toAddress = getTokenAddressParam(tokenData);
    if (assetStandard === ERC721 || assetStandard === ERC1155) {
      assetName = currentAsset?.name;
    }
    if (assetStandard === ERC20) {
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
    tokenSymbol,
    decimals,
    tokenImage,
    tokenValue,
    toAddress,
    tokenAmount,
  };
}
