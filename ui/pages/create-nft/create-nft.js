import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { DISPLAY, FLEX_DIRECTION } from '../../helpers/constants/design-system';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import Box from '../../components/ui/box';
import PageContainerHeader from '../../components/ui/page-container/page-container-header';
import Inputs from './inputs';
import Submit from './submit';

export default function CreateNft() {
  const history = useHistory();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const [state, setState] = useState('inputs');

  const onClose = () => {
    history.push(mostRecentOverviewPage);
  };

  return (
    <div className="page-container">
      <PageContainerHeader
        className="send__header"
        headerCloseText="Cancel"
        onClose={onClose}
        title="Create NFT"
        showBackButton
      />
      <Box
        className="create-nft"
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        {state === 'inputs' ? (
          <Inputs onSubmit={() => setState('submit')} />
        ) : (
          <Submit />
        )}
      </Box>
    </div>
  );
}
