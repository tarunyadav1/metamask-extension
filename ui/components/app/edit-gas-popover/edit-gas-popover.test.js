import React from 'react';
import { BN } from 'ethereumjs-util';
import configureStore from '../../../store/store';
import {
  renderWithProvider,
  setBackgroundConnection,
} from '../../../../test/jest';
import {
  checkNetworkAndAccountSupports1559,
  getSelectedAddress,
  getSelectedAccount,
} from '../../../selectors';
import {
  getGasFeeEstimates,
  getGasEstimateType,
} from '../../../ducks/metamask/metamask';
import EditGasPopover from '.';

jest.mock('../../../selectors', () => {
  return {
    ...jest.requireActual('../../../selectors'),
    __esModule: true,
    checkNetworkAndAccountSupports1559: jest.fn(),
    currentNetworkTxListSelector: jest.fn(),
    getSelectedAddress: jest.fn(),
    getSelectedAccount: jest.fn(),
    getShouldShowFiat: jest.fn(),
    getIsMainnet: jest.fn(),
  };
});

jest.mock('../../../ducks/metamask/metamask', () => {
  return {
    ...jest.requireActual('../../../ducks/metamask/metamask'),
    __esModule: true,
    getGasFeeEstimates: jest.fn(),
    getGasEstimateType: jest.fn(),
    getIsNetworkBusy: jest.fn(),
    getIsGasEstimatesLoading: jest.fn(),
  };
});

function toHex(value) {
  return `0x${new BN(value, 10).toString(16)}`;
}

setBackgroundConnection({
  disconnectGasFeeEstimatePoller: jest.fn(),
  getGasFeeEstimatesAndStartPolling: jest.fn(),
  getGasFeeTimeEstimate: jest.fn(),
  removePollingTokenFromAppState: jest.fn(),
  trackMetaMetricsPage: jest.fn(),
});

describe('EditGasPopover', () => {
  const fromAddress = '0x1111';
  const transactionId = '0x5555';
  const selectedAccount = {
    address: fromAddress,
    balance: '0xf4240',
  };
  const accounts = {
    [fromAddress]: selectedAccount,
  };
  const store = configureStore({ metamask: { accounts } });

  beforeEach(() => {
    getSelectedAccount.mockReturnValue(selectedAccount);
    getSelectedAddress.mockReturnValue(fromAddress);
  });

  describe('if the network supports EIP-1559', () => {
    const defaultGasFeeEstimates = {
      low: {
        minWaitTimeEstimate: 10000,
        maxWaitTimeEstimate: 20000,
        suggestedMaxPriorityFeePerGas: '1',
        suggestedMaxFeePerGas: '10',
      },
      medium: {
        minWaitTimeEstimate: 30000,
        maxWaitTimeEstimate: 40000,
        suggestedMaxPriorityFeePerGas: '1.5',
        suggestedMaxFeePerGas: '20',
      },
      high: {
        minWaitTimeEstimate: 50000,
        maxWaitTimeEstimate: 60000,
        suggestedMaxPriorityFeePerGas: '2',
        suggestedMaxFeePerGas: '30',
      },
      estimatedBaseFee: '100',
    };

    beforeEach(() => {
      checkNetworkAndAccountSupports1559.mockReturnValue(true);
      getGasEstimateType.mockReturnValue('fee-market');
    });

    describe('if we determine that the network is busy', () => {
      beforeEach(() => {
        getGasFeeEstimates.mockReturnValue({
          ...defaultGasFeeEstimates,
          networkCongestion: 0.67,
        });
      });

      it('informs the user', () => {
        const { queryByText } = renderWithProvider(
          <EditGasPopover
            transaction={{
              id: transactionId,
              txParams: {
                from: fromAddress,
                gas: toHex('21000'),
                maxFeePerGas: toHex('1000000000'),
                maxPriorityFeePerGas: toHex('1000000000'),
                type: toHex('2'),
                value: toHex('1000000000000000000'),
              },
              origin: 'metamask',
              userFeeLevel: 'medium',
            }}
          />,
          store,
        );
        expect(
          queryByText(
            'Network is busy. Gas prices are high and estimates are less accurate.',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('if we determine that the network is not busy', () => {
      beforeEach(() => {
        getGasFeeEstimates.mockReturnValue({
          ...defaultGasFeeEstimates,
          networkCongestion: 0.65,
        });
      });

      it('does not inform the user', () => {
        const { queryByText } = renderWithProvider(
          <EditGasPopover
            transaction={{
              id: transactionId,
              txParams: {
                from: fromAddress,
                gas: toHex('21000'),
                maxFeePerGas: toHex('1000000000'),
                maxPriorityFeePerGas: toHex('1000000000'),
                type: toHex('2'),
                value: toHex('1000000000000000000'),
              },
              origin: 'metamask',
              userFeeLevel: 'medium',
            }}
          />,
          store,
        );
        expect(
          queryByText(
            'Network is busy. Gas prices are high and estimates are less accurate.',
          ),
        ).not.toBeInTheDocument();
      });
    });
  });
});
