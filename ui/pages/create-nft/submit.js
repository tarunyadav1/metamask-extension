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
        <Typography className="create-nft__rarible-label">
          Lazy mint on Rarible
        </Typography>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginBottom={4}
      >
        <Typography className="create-nft__fee-info">
          Gas is free for now, you will once pay gas once you sell the NFT.
        </Typography>
      </Box>
      <Box display="flex" flexDirection="column" marginTop={10}>
        <Button type="primary">Lazy mint on Rarible</Button>
        <Box marginTop={4}>
          <Button type="secondary">Cancel</Button>
        </Box>
      </Box>
    </>
  );
}
