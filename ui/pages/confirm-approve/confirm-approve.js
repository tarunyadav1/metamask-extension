import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConfirmTransactionBase from '../confirm-transaction-base';
import { EDIT_GAS_MODES } from '../../../shared/constants/gas';
import {
  showModal,
  updateCustomNonce,
  getNextNonce,
} from '../../store/actions';
import { getTokenData } from '../../helpers/utils/transactions.util';
import {
  calcTokenAmount,
  getAssetDetails,
  getTokenAddressParam,
  getTokenValueParam,
} from '../../helpers/utils/token-util';
import { readAddressAsContract } from '../../../shared/modules/contract-utils';
import { GasFeeContextProvider } from '../../contexts/gasFee';
import { TransactionModalContextProvider } from '../../contexts/transaction-modal';
import { useTokenTracker } from '../../hooks/useTokenTracker';
import {
  getTokens,
  getNativeCurrency,
  isAddressLedger,
  getCollectibles,
} from '../../ducks/metamask/metamask';
import {
  transactionFeeSelector,
  txDataSelector,
  getCurrentCurrency,
  getSubjectMetadata,
  getUseNonceField,
  getCustomNonceValue,
  getNextSuggestedNonce,
  getCurrentChainId,
  getRpcPrefsForCurrentProvider,
  getIsMultiLayerFeeNetwork,
  checkNetworkAndAccountSupports1559,
  getTokenList,
} from '../../selectors';
import { useApproveTransaction } from '../../hooks/useApproveTransaction';
import { currentNetworkTxListSelector } from '../../selectors/transactions';
import AdvancedGasFeePopover from '../../components/app/advanced-gas-fee-popover';
import EditGasFeePopover from '../../components/app/edit-gas-fee-popover';
import EditGasPopover from '../../components/app/edit-gas-popover/edit-gas-popover.component';
import Loading from '../../components/ui/loading-screen';
import { isEqualCaseInsensitive } from '../../helpers/utils/util';
import { getCustomTxParamsData } from './confirm-approve.util';
import ConfirmApproveContent from './confirm-approve-content';
import { ERC20, ERC1155, ERC721 } from '../../helpers/constants/common';
import { useAssetDetails } from '../../hooks/useAssetDetails';

const isAddressLedgerByFromAddress = (address) => (state) => {
  return isAddressLedger(state, address);
};

// eslint-disable-next-line prefer-destructuring
const EIP_1559_V2_ENABLED =
  process.env.EIP_1559_V2 === true || process.env.EIP_1559_V2 === 'true';

export default function ConfirmApprove({ transaction }) {
  const dispatch = useDispatch();
  const { id: paramsTransactionId } = useParams();
  const {
    id: transactionId,
    txParams: {
      to: tokenAddress,
      data: transactionData,
      from: fromAddress,
    } = {},
  } = transaction;
  const currentCurrency = useSelector(getCurrentCurrency);
  const nativeCurrency = useSelector(getNativeCurrency);
  const currentNetworkTxList = useSelector(currentNetworkTxListSelector);
  const subjectMetadata = useSelector(getSubjectMetadata);
  const tokens = useSelector(getTokens);
  const collectibles = useSelector(getCollectibles);
  const tokenList = useSelector(getTokenList);
  const useNonceField = useSelector(getUseNonceField);
  const nextNonce = useSelector(getNextSuggestedNonce);
  const customNonceValue = useSelector(getCustomNonceValue);
  const chainId = useSelector(getCurrentChainId);
  const rpcPrefs = useSelector(getRpcPrefsForCurrentProvider);
  const isMultiLayerFeeNetwork = useSelector(getIsMultiLayerFeeNetwork);
  const networkAndAccountSupports1559 = useSelector(
    checkNetworkAndAccountSupports1559,
  );
  const [currentAsset, setCurrentAsset] = useState(null);
  const [customPermissionAmount, setCustomPermissionAmount] = useState('');

  const fromAddressIsLedger = useSelector(isAddressLedgerByFromAddress(fromAddress));

  // const transaction =
  //   currentNetworkTxList.find(
  //     ({ id }) => id === (Number(paramsTransactionId) || transactionId),
  //   ) || {};
  const {
    ethTransactionTotal,
    fiatTransactionTotal,
    hexTransactionTotal,
  } = useSelector((state) => transactionFeeSelector(state, transaction));

  const supportsEIP1559V2 =
    EIP_1559_V2_ENABLED && networkAndAccountSupports1559;

  // use token address to get the data we want without needing to add to state
  // check if the token exists in either tokens or collectibles and use that data
  // then if not pass to a method "getTokenStandardAndDetails"

  // useEffect(() => {
  //   async function getAndSetAssetDetails() {
  //     const assetDetails = await getAssetDetails(
  //       tokenAddress,
  //       transactionData,
  //       collectibles,
  //       tokens,
  //       tokenList,
  //     );
  //     setCurrentAsset(assetDetails);
  //   }
  //   getAndSetAssetDetails();
  // }, []);

  // // TODO wrap this all in a hook (useCurrentAsset)
  // let assetStandard,
  //   assetName,
  //   assetAddress,
  //   tokenTrackerBalance,
  //   tokenSymbol,
  //   decimals,
  //   tokenImage,
  //   tokenValue,
  //   toAddress,
  //   tokenAmount,
  //   tokenData;

  // if (currentAsset) {
  //   assetStandard = currentAsset?.standard;
  //   assetAddress = currentAsset?.address;
  //   tokenSymbol = currentAsset?.symbol;
  //   tokenImage = currentAsset?.image;
  //   tokenData = getTokenData(transactionData);
  //   toAddress = getTokenAddressParam(tokenData);

  //   if (assetStandard === ERC721 || assetStandard === ERC1155) {
  //     assetName = currentAsset?.name;
  //   }
  //   if (assetStandard === ERC20) {
  //     const { tokensWithBalances } = useTokenTracker([
  //       { ...currentAsset, address: tokenAddress },
  //     ]);
  //     tokenTrackerBalance = tokensWithBalances[0]?.balance || '';
  //     decimals = Number(currentAsset?.decimals.toString(10));
  //     tokenValue = getTokenValueParam(tokenData);
  //     // TODO this calculation is screwed up
  //     tokenAmount =
  //       tokenData && calcTokenAmount(tokenValue, decimals).toString(10);
  //   }
  // }
  const {
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
    tokenData,
  } = useAssetDetails(tokenAddress, transactionData, fromAddress);

  const previousTokenAmount = useRef(tokenAmount);

  const {
    approveTransaction,
    showCustomizeGasPopover,
    closeCustomizeGasPopover,
  } = useApproveTransaction();

  useEffect(() => {
    if (customPermissionAmount && previousTokenAmount.current !== tokenAmount) {
      setCustomPermissionAmount(tokenAmount);
    }
    previousTokenAmount.current = tokenAmount;
  }, [customPermissionAmount, tokenAmount]);

  const [submitWarning, setSubmitWarning] = useState('');
  const prevNonce = useRef(nextNonce);
  const prevCustomNonce = useRef(customNonceValue);
  useEffect(() => {
    if (
      prevNonce.current !== nextNonce ||
      prevCustomNonce.current !== customNonceValue
    ) {
      if (nextNonce !== null && customNonceValue > nextNonce) {
        setSubmitWarning(
          `Nonce is higher than suggested nonce of ${nextNonce}`,
        );
      } else {
        setSubmitWarning('');
      }
    }
    prevCustomNonce.current = customNonceValue;
    prevNonce.current = nextNonce;
  }, [customNonceValue, nextNonce]);

  const [isContract, setIsContract] = useState(false);

  const checkIfContract = useCallback(async () => {
    const { isContractAddress } = await readAddressAsContract(
      global.eth,
      toAddress,
    );
    setIsContract(isContractAddress);
  }, [setIsContract, toAddress]);

  useEffect(() => {
    checkIfContract();
  }, [checkIfContract]);

  const { origin } = transaction;
  const formattedOrigin = origin || '';

  const { iconUrl: siteImage = '' } = subjectMetadata[origin] || {};

  let tokensText;
  if (assetStandard === ERC20) {
    tokensText = `${Number(tokenAmount)} ${tokenSymbol}`;
  } else if (assetStandard === ERC721 || assetStandard === ERC1155) {
    tokensText = assetName;
  }

  const tokenBalance = userBalance
    ? calcTokenAmount(userBalance, decimals).toString(10)
    : '';
  const customData = customPermissionAmount
    ? getCustomTxParamsData(transactionData, {
        customPermissionAmount,
        decimals,
      })
    : null;

  // NEED TO SORT OUT WHAT IS NEEDED HERE AND WHAT ISN'T
  return tokenSymbol === undefined &&
    assetName === undefined &&
    assetAddress === undefined ? (
    <Loading />
  ) : (
    <GasFeeContextProvider transaction={transaction}>
      <ConfirmTransactionBase
        toAddress={toAddress}
        identiconAddress={tokenAddress}
        showAccountInHeader
        title={tokensText}
        contentComponent={
          <TransactionModalContextProvider captureEventEnabled={false}>
            <ConfirmApproveContent
              decimals={decimals}
              siteImage={siteImage}
              setCustomAmount={setCustomPermissionAmount}
              customTokenAmount={String(customPermissionAmount)}
              tokenAmount={tokenAmount}
              origin={formattedOrigin}
              tokenSymbol={tokenSymbol}
              tokenImage={tokenImage}
              tokenBalance={tokenBalance}
              showCustomizeGasModal={approveTransaction}
              showEditApprovalPermissionModal={({
                /* eslint-disable no-shadow */
                customTokenAmount,
                decimals,
                origin,
                setCustomAmount,
                tokenAmount,
                tokenBalance,
                tokenSymbol,
                /* eslint-enable no-shadow */
              }) =>
                dispatch(
                  showModal({
                    name: 'EDIT_APPROVAL_PERMISSION',
                    customTokenAmount,
                    decimals,
                    origin,
                    setCustomAmount,
                    tokenAmount,
                    tokenBalance,
                    tokenSymbol,
                  }),
                )
              }
              data={customData || transactionData}
              toAddress={toAddress}
              currentCurrency={currentCurrency}
              nativeCurrency={nativeCurrency}
              ethTransactionTotal={ethTransactionTotal}
              fiatTransactionTotal={fiatTransactionTotal}
              hexTransactionTotal={hexTransactionTotal}
              useNonceField={useNonceField}
              nextNonce={nextNonce}
              customNonceValue={customNonceValue}
              updateCustomNonce={(value) => {
                dispatch(updateCustomNonce(value));
              }}
              getNextNonce={() => dispatch(getNextNonce())}
              showCustomizeNonceModal={({
                /* eslint-disable no-shadow */
                useNonceField,
                nextNonce,
                customNonceValue,
                updateCustomNonce,
                getNextNonce,
                /* eslint-disable no-shadow */
              }) =>
                dispatch(
                  showModal({
                    name: 'CUSTOMIZE_NONCE',
                    useNonceField,
                    nextNonce,
                    customNonceValue,
                    updateCustomNonce,
                    getNextNonce,
                  }),
                )
              }
              warning={submitWarning}
              txData={transaction}
              fromAddressIsLedger={fromAddressIsLedger}
              chainId={chainId}
              rpcPrefs={rpcPrefs}
              isContract={isContract}
              isMultiLayerFeeNetwork={isMultiLayerFeeNetwork}
              supportsEIP1559V2={supportsEIP1559V2}
            />
            {showCustomizeGasPopover && !supportsEIP1559V2 && (
              <EditGasPopover
                onClose={closeCustomizeGasPopover}
                mode={EDIT_GAS_MODES.MODIFY_IN_PLACE}
                transaction={transaction}
              />
            )}
            {supportsEIP1559V2 && (
              <>
                <EditGasFeePopover />
                <AdvancedGasFeePopover />
              </>
            )}
          </TransactionModalContextProvider>
        }
        hideSenderToRecipient
        customTxParamsData={customData}
      />
    </GasFeeContextProvider>
  );
}
