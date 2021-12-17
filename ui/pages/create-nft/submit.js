import React, { useState } from 'react';

import { TYPOGRAPHY } from '../../helpers/constants/design-system';
import Box from '../../components/ui/box';
import Dropdown from '../../components/ui/dropdown';
import Button from '../../components/ui/button';
import Typography from '../../components/ui/typography';

export default function CreateNft() {
  const [network, setNetwork] = useState('rarible');
  return (
    <>
      <Box display="block" className="create-nft__nft-img-wrapper">
        <img
          className="create-nft__nft-img"
          src="./images/create_nft_team.png"
        />
      </Box>
      <Box
        margin={[4, 0, 2]}
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        className="create-nft__network-label"
      >
        <Typography
          variant={TYPOGRAPHY.H3}
          align="left"
          className="create-nft__nft-name"
          margin={[4, 0]}
        >
          Hackathon Team
        </Typography>
        <Typography
          variant={TYPOGRAPHY.H6}
          className="create-nft__nft-description"
          margin={[2, 0]}
        >
          These are all the awesome team members for create NFT Hackathon team
        </Typography>
        <Box className="create-nft__nft-attrs" margin={[2, 0, 4]}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            margin={[1, 0]}
          >
            <strong>Team Size</strong>
            <span>6</span>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            margin={[1, 0]}
          >
            <strong>Team Location</strong>
            <span>Global</span>
          </Box>
        </Box>
      </Box>
      <Box
        margin={[8, 0, 2]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className="create-nft__network-label"
      >
        <Dropdown
          onChange={setNetwork}
          options={[
            { name: 'Lazy Mint with Rarible', value: 'rarible' },
            { name: 'Mint with MetaMask', value: 'metamask' },
          ]}
          selectedOption={network}
        />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginBottom={4}
      >
        <Typography className="create-nft__fee-info">
          {network === 'rarible'
            ? "By using Rarible's Lazy minting the gas is free for now. You will only pay a gas fee once you sell the NFT and it gets added to the blockchain. Your NFT might not show up in other wallets and marketplaces before that."
            : "By Minting with MetaMask you'll deploy your own smart contract to the blockchain and the NFT will be available for use on NFT marketplaces. You'll need to pay network gas fees to deploy the contract - those are not MetaMask fees."}
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" marginTop={10}>
        <Button type="primary">
          {network === 'rarible'
            ? 'Lazy mint on Rarible'
            : 'Mint with MetaMask'}
        </Button>
        <Box marginTop={4}>
          <Button type="secondary">Cancel</Button>
        </Box>
      </Box>
    </>
  );
}
