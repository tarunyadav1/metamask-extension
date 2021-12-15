import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  ALIGN_ITEMS,
  DISPLAY,
  FLEX_DIRECTION,
} from '../../helpers/constants/design-system';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import Box from '../../components/ui/box';
import Button from '../../components/ui/button';
import InfoTooltip from '../../components/ui/info-tooltip';
import TextArea from '../../components/ui/textarea';
import TextField from '../../components/ui/text-field';
import PageContainerHeader from '../../components/ui/page-container/page-container-header';

export default function CreateNft() {
  const history = useHistory();
  const mostRecentOverviewPage = useSelector(getMostRecentOverviewPage);
  const [attributes, setAttributes] = useState([
    { name: null, value: null },
    { name: null, value: null },
  ]);

  const addAttribute = () => {
    setAttributes([...attributes, { name: null, value: null }]);
  };

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
      />
      <Box
        className="create-nft"
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        <div className="create-nft__upload-area">
          <img src="./images/file-upload.svg" />
        </div>
        <Box
          display={DISPLAY.FLEX}
          alignItems={ALIGN_ITEMS.CENTER}
          marginBottom={1}
        >
          <label htmlFor="name" className="create-nft__label">
            Name
          </label>
          <InfoTooltip position="top" />
        </Box>
        <TextField id="name" placeholder="Name of your NFT" />
      </Box>
      <Box
        className="create-nft"
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        <Box marginBottom={1}>
          <label htmlFor="name" className="create-nft__label">
            Description
          </label>
        </Box>
        <TextArea id="name" placeholder="Enter description" />
      </Box>
      <Box
        className="create-nft"
        display={DISPLAY.FLEX}
        flexDirection={FLEX_DIRECTION.COLUMN}
      >
        <Box
          display={DISPLAY.FLEX}
          alignItems={ALIGN_ITEMS.CENTER}
          marginBottom={1}
        >
          <label htmlFor="name" className="create-nft__label">
            Attributes
          </label>
          <InfoTooltip position="top" />
        </Box>
        {attributes.map(({ name, value }, index) => (
          <Box
            display={DISPLAY.FLEX}
            alignItems={ALIGN_ITEMS.CENTER}
            key={`attr-${index}-${name}`}
            marginBottom={2}
            marginTop={2}
          >
            <Box marginRight={1}>
              <TextField
                id="type"
                className="create-nft__attr-type"
                value={name}
              />
            </Box>
            <TextField id="value" value={value} />
          </Box>
        ))}
        <Button
          className="create-nft__add-attr-btn"
          onClick={addAttribute}
          type="link"
        >
          + Add Attribute
        </Button>
        <Box marginTop={10}>
          <Button type="primary">Continue</Button>
        </Box>
      </Box>
    </div>
  );
}
