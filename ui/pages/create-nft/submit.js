import React from 'react';

import { TYPOGRAPHY } from '../../helpers/constants/design-system';
import Box from '../../components/ui/box';
import Button from '../../components/ui/button';
import InfoTooltip from '../../components/ui/info-tooltip';
import Typography from '../../components/ui/typography';

export default function CreateNft() {
  return (
    <>
      <Box display="block" className="create-nft__nft-img-wrapper">
        <img
          className="create-nft__nft-img"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzvKwk1CVZpdpf9lKOac7FeZVrKIAw2QIc3g&usqp=CAU"
        />
      </Box>
      <Box
        margin={[4, 0]}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        className="create-nft__network-label"
      >
        <Typography variant={TYPOGRAPHY.H4} color="#24292E">
          Create NFT on
        </Typography>
        <Typography className="create-nft__rarible-label">Rarible</Typography>
      </Box>
      <Typography className="create-nft__gas-fee-label">
        <strong>Estimated gas fee:</strong> &gt; $0.01
      </Typography>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Typography className="create-nft__fee-info">
          Gas is a network fee, not a MetaMask fee
        </Typography>
        <InfoTooltip
          position="top"
          contentText="Gas fees are paid to crypto miners who process transactions on the Ethereum network. MetaMask does not profit from gas fees.."
        />
      </Box>
      <Typography className="create-nft__link-btn">
        Use a different network
      </Typography>
      <Typography className="create-nft__warning" margin={[4, 4]}>
        NFTs created on this network may not be available on NFT marketplaces
        like OpenSea.
      </Typography>
      <Box display="flex" flexDirection="column" marginTop={10}>
        <Button type="primary">Continue on Rarible</Button>
        <Box marginTop={4}>
          <Button type="secondary">Cancel</Button>
        </Box>
      </Box>
    </>
  );
}
