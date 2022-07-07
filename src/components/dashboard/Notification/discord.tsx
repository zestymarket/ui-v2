import { styled } from '@mui/system';
import { Grid, Typography, Link } from '@mui/material';
import Image from 'next/image';

const StyledActionArea = styled(`div`)({
  borderRadius: `inherit`,
  display: `grid`,
  gridTemplateRows: `0.25fr 0.75fr 3fr 3fr`,
  width: `350px`,
  height: `400px`,
  alignItems: `center`,
  padding: `5%`,
});

const StyledCard = styled(`div`)({
  borderRadius: 16,
  position: `relative`,
  overflow: `hidden`,
  background: `#181522`,
  width: `350px`,
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

const BulletNumber = styled(`div`)`
  width: 13px;
  height: 13px;
  background: #e5e5e5;
  opacity: 0.4;
  border-radius: 50%;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 12px;
  text-align: center;
  color: #181522;
  margin-right: 8px;
  position: relative;
  top: 1px;
`;

const ListItem = styled(`div`)`
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  &.firstItem {
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 16px;
  }
`;

const FirstItem = styled(`div`)`
  display: flex;
  flex-direction: column;
  a {
    color: #808aff;
    text-decoration: none;
    display: block;
    margin-top: 4px;
  }
  a:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ClipboardInput = styled(`div`)`
  margin-top: -10px;
  background: #211e2b;
  border-radius: 4px;
  padding: 13px 16px;
  color: #bdb9c8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  img:hover {
    cursor: pointer;
  }
`;

export default function Discord() {
  return (
    <StyledCard>
      <StyledActionArea>
        <DiscordHeader> Join Discord</DiscordHeader>
        <DiscordMain> Get Notified </DiscordMain>
        <Image
          alt="discord"
          width="200"
          height="100"
          src={`/assets/dashboard/Group.svg`}
        ></Image>
        <Grid>
          <ListItem className="firstItem">
            <BulletNumber>1</BulletNumber>
            <FirstItem>
              <span>
                Join the <b>Zesty Market Discord</b>
              </span>
              <Link href="https://discord.gg/urJS5MGYnU" target="_blank">
                Join Our Discord Server ➜
              </Link>
            </FirstItem>
          </ListItem>
          <ListItem>
            <BulletNumber>2</BulletNumber>
            <span>
              In the <b>&nbsp;#bot-commands&nbsp;</b> channel type:
            </span>
          </ListItem>
        </Grid>
        <ClipboardInput>
          <span>&gt;notify</span>
          <Image
            src="/icons/clipboard.svg"
            width={16}
            height={16}
            alt="clipboard"
            onClick={() => {
              navigator.clipboard.writeText(`notify`);
            }}
          />
        </ClipboardInput>
      </StyledActionArea>
    </StyledCard>
  );
}
