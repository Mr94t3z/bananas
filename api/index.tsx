import { Button, Frog } from 'frog'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/vercel'
import { 
  Box, 
  Image,
  Text, 
  Spacer, 
  vars 
} from "../lib/ui.js";


// Uncomment this packages to tested on local server
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'


const baseUrl = "https://warpcast.com/~/compose";
const text = "Grow your 🍌 by playing [ Banana Tap ↑ ]\n\nFrame by @0x94t3z.eth";
const embedUrl = "https://bananas-tap.vercel.app/api";

const CAST_INTENS = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`;


type State = {
  earnings: number;
};


export const app = new Frog<{ State: State }>({
  assetsPath: '/',
  basePath: '/api',
  ui: { vars },
  title: 'Banana Tap ↑',
  imageAspectRatio: '1:1',
  imageOptions: {
    height: 1024,
    width: 1024,
  },
  initialState: {
    earnings: 0,
  },
  browserLocation: CAST_INTENS,
  headers: {
    'cache-control': 'no-store, no-cache, must-revalidate, proxy-revalidate max-age=0, s-maxage=0',
  },
}).use(
  neynar({
    apiKey: 'NEYNAR_FROG_FM',
    features: ['interactor', 'cast'],
  }),
)


app.frame('/', (c) => {

  return c.res({
    image: (
      <Box
          grow
          alignVertical="center"
          alignHorizontal="center"
          backgroundColor="bg"
          padding="32"
          textAlign="center"
          height="100%"
        >

          <Text align="center" weight="600" color="white" size="48">
            BANANA
          </Text>

          <Spacer size="18" />
            
          <Image 
            src="/images/bananas.png" 
            height="256"
            />

          <Text align="center" weight="600" color="white" size="48">
            TAP ↑
          </Text>

          <Spacer size="32" />

          <Text align="center" weight="600" color="white" size="18">
            Frame by @0x94t3z.eth
          </Text>

        </Box>
    ),
    intents: [
      <Button action="/play">Start</Button>,
    ],
  });
});


app.frame('/play', (c) => {
  const { username } = c.var.interactor || {}
  const { deriveState } = c;

  const state = deriveState((previousState) => {
    if (c.buttonValue === 'tap') {
      previousState.earnings += 0.1;
    }
    return;
  });

  const price = state.earnings.toFixed(2)

  const baseUrl = "https://warpcast.com/~/compose";
  const text = `I just grew my 🍌 to ${price} by playing [ Banana Tap ↑ ]\n\nFrame by @0x94t3z.eth`;
  const embedUrl = `https://bananas-tap.vercel.app/api/share/${username}/${price}`;

  const SHARE_BY_USER = `${baseUrl}?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(embedUrl)}`;

  return c.res({
    image: (
      <Box
          grow
          alignVertical="center"
          alignHorizontal="center"
          backgroundColor="bg"
          padding="32"
          textAlign="center"
          height="100%"
        >
          
          
          <Image 
            src="/images/bananas.png" 
            height="256"
            />

          <Spacer size="24" />

          <Text align="center" weight="600" color="white" size="48">
            Price ${price}
          </Text>

          <Spacer size="10" />

          <Text align="center" color="white" size="32">
           @{username}
          </Text>
        </Box>
    ),
    intents: [
      <Button value="tap">Tap</Button>,
      <Button.Link href={SHARE_BY_USER}>Share</Button.Link>,
    ],
  });
});


app.frame('/share/:username/:price', (c) => {
  const { username, price } = c.req.param();

  return c.res({
    image: (
      <Box
          grow
          alignVertical="center"
          alignHorizontal="center"
          backgroundColor="bg"
          padding="32"
          textAlign="center"
          height="100%"
        >
          
          <Image 
            src="/images/bananas.png" 
            height="256"
            />

          <Spacer size="24" />

          <Text align="center" weight="600" color="white" size="48">
            Price ${price}
          </Text>

          <Spacer size="10" />

          <Text align="center" color="white" size="32">
           @{username}
          </Text>
        </Box>
    ),
    intents: [
      <Button action="/">I want to grow my 🍌 tho!</Button>,
    ],
  });
});


// Uncomment for local server testing
devtools(app, { serveStatic });


export const GET = handle(app)
export const POST = handle(app)
