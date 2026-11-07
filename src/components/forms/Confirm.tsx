import { useEffect, useState, type ReactNode } from 'react';

/** The confirming page's words, handed in by the page from its content file: an island holds none of its own. */
export type ConfirmWords = {
  button: string;
  sending: string;
  again: string;
  confirmed: string;
  failed: string;
};

type State = 'waiting' | 'missing' | 'ready' | 'sending' | 'confirmed' | 'expired' | 'failed';
type Outcome = 'confirmed' | 'expired' | 'failed';

/** What the relay's tokens are made of. Anything else after "#" is not one. */
const TOKEN = /^[A-Za-z0-9._-]+$/;

/** Asks the relay to confirm the address a token was made for. README.md, "The waitlist", has what the relay answers. */
async function confirmToken(endpoint: string, token: string): Promise<Outcome> {
  if (!endpoint) {
    // No list service yet. While developing, the page answers by itself so that its states can be seen; a built site never
    // pretends: it says it could not confirm.
    if (!import.meta.env.DEV) return 'failed';
    await new Promise((resolve) => setTimeout(resolve, 600));
    return token.startsWith('expired') ? 'expired' : token.startsWith('fail') ? 'failed' : 'confirmed';
  }
  const response = await fetch(`${endpoint.replace(/\/$/, '')}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });
  if (!response.ok) return 'failed';
  const answer: { status?: string } = await response.json();
  return answer.status === 'confirmed' ? 'confirmed' : answer.status === 'expired' ? 'expired' : 'failed';
}

/**
 * The button that confirms a place on the waitlist, with the token the confirmation email put after "#" in the page's
 * address. It confirms only when clicked: a mail scanner that opens the link confirms nothing. `expired` and `missing`
 * are the page's sentences with their links, rendered by the page.
 */
export function Confirm({
  words,
  endpoint,
  expired,
  missing,
}: {
  words: ConfirmWords;
  endpoint: string;
  expired?: ReactNode;
  missing?: ReactNode;
}) {
  const [token, setToken] = useState('');
  const [state, setState] = useState<State>('waiting');

  useEffect(() => {
    const found = window.location.hash.slice(1);
    if (TOKEN.test(found)) {
      setToken(found);
      setState('ready');
    } else {
      setState('missing');
    }
  }, []);

  async function confirm() {
    setState('sending');
    let outcome: Outcome;
    try {
      outcome = await confirmToken(endpoint, token);
    } catch {
      outcome = 'failed';
    }
    setState(outcome);
    // The token has done its work: it leaves the address bar, and a reload shows what the page says to anyone.
    if (outcome !== 'failed') window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  if (state === 'confirmed' || state === 'expired' || state === 'missing') {
    return (
      <p role="status" className="border border-line bg-ground/70 px-4 py-3.5 text-[15px]">
        <span aria-hidden="true" className="mr-2.5 inline-block size-[7px] rounded-full bg-pip align-[1px]" />
        {state === 'confirmed' ? words.confirmed : state === 'expired' ? expired : missing}
      </p>
    );
  }

  // Until the page has looked for a token, and while it is sent, the button waits.
  return (
    <div className="flex flex-col gap-2.5">
      <button
        type="button"
        onClick={confirm}
        disabled={state === 'waiting' || state === 'sending'}
        className="h-[50px] cursor-pointer self-start rounded-none bg-ink px-6 text-sm font-semibold whitespace-nowrap text-ground hover:bg-pip disabled:cursor-default disabled:opacity-55"
      >
        {state === 'sending' ? words.sending : state === 'failed' ? words.again : words.button}
      </button>
      <p role="alert" className={state === 'failed' ? 'text-[13.5px] text-ink' : 'hidden'}>
        <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-pip align-[2px]" />
        {state === 'failed' ? words.failed : null}
      </p>
    </div>
  );
}
