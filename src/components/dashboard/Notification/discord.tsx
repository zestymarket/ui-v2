import { styled } from '@mui/system';
import {
  Skeleton,
  Card,
  InputAdornment,
  OutlinedInput,
  Grid,
  Typography,
  CardActionArea,
  Link,
} from '@mui/material';
import Image from 'next/image';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';

const StyledActionArea = styled(CardActionArea)(({ theme }) => ({
  borderRadius: `inherit`,
  display: `grid`,
  gridTemplateRows: `0.25fr 0.75fr 3fr 3fr`,
  width: `350px`,
  height: `400px`,
  alignItems: `center`,
  padding: `5%`,
}));

const StyledCard = styled(Card)({
  borderRadius: 16,
  position: `relative`,
  overflow: `hidden`,
  background: `#181522`,
});

const DiscordMain = styled(Typography)({
  fontSize: 26,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  display: `flex`,
  alignItems: `center`,
  lineHeight: `15px`,
  marginLeft: 4,
  color: `#FFF`,
  margin: `auto`,
});

const DiscordHeader = styled(Typography)({
  fontSize: 12,
  fontFamily: `Inter`,
  fontStyle: `normal`,
  fontWeight: 600,
  alignItems: `center`,
  lineHeight: `15px`,
  marginLeft: 4,
  color: `#F89C24`,
  margin: `auto`,
  textTransform: `uppercase`,
});

export default function Discord() {
  return (
    <StyledCard>
      <StyledActionArea>
        <DiscordHeader> Join Discord</DiscordHeader>
        <DiscordMain> Get Notified </DiscordMain>
        <Image
          alt="discord"
          width="200"
          height="300"
          src={`/assets/dashboard/Group.svg`}
        ></Image>
        <Grid>
          <Grid item>
            <LooksOneIcon />
            Join the Zesty Market Discord
            <Link>Join Our Discord Server ➜</Link>
          </Grid>
          <Grid item>
            <LooksTwoIcon />
            In the #bot-commands channel type:
            <OutlinedInput
              value={`> notify`}
              id="outlined-adornment-weight"
              endAdornment={<InputAdornment position="end">kg</InputAdornment>}
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                'aria-label': `weight`,
              }}
            />
          </Grid>
        </Grid>
      </StyledActionArea>
    </StyledCard>
  );
}
