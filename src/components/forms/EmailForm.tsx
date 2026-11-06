import { useId, useState, type ReactNode, type SubmitEvent } from 'react';

/** The form's words, handed in by the page from the dictionary: an island holds none of its own. */
export type FormWords = {
  email: string;
  emailHint: string;
  join: string;
  joining: string;
  note: string;
  invalid: string;
  sent: string;
  already: string;
  failed: string;
  again: string;
};

type Status = 'idle' | 'invalid' | 'sending' | 'sent' | 'already' | 'failed';
type Outcome = 'sent' | 'already' | 'failed';

const ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Asks the relay to add an address to the list. README.md, "The waitlist", has what the relay answers. */
async function join(endpoint: string, body: { email: string; page: string; lang: string }): Promise<Outcome> {
  if (!endpoint) {
    // No list service yet. While developing, the form answers by itself so that its states can be seen; a built site never
    // pretends: it says the address could not be sent.
    if (!import.meta.env.DEV) return 'failed';
    await new Promise((resolve) => setTimeout(resolve, 600));
    return body.email.startsWith('already') ? 'already' : body.email.startsWith('fail') ? 'failed' : 'sent';
  }
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) return 'failed';
  const answer: { status?: string } = await response.json();
  return answer.status === 'pending' ? 'sent' : answer.status === 'already' ? 'already' : 'failed';
}

/** Tells the rest of the page that an address joined: the Waitlist page then shows its questions. */
export const JOINED = 'waitlist:joined';

export function EmailForm({
  words,
  endpoint,
  lang,
  page,
  note,
  children,
}: {
  words: FormWords;
  endpoint: string;
  lang: string;
  page: string;
  /** Shows the usual note under the form. Left out where the page says it elsewhere. */
  note?: boolean;
  /** A note of the page's own under the form, in place of the usual one. */
  children?: ReactNode;
}) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    const address = email.trim();
    if (!ADDRESS.test(address)) {
      setStatus('invalid');
      return;
    }
    setStatus('sending');
    try {
      const outcome = await join(endpoint, { email: address, page, lang });
      setStatus(outcome);
      if (outcome !== 'failed') window.dispatchEvent(new CustomEvent(JOINED, { detail: { email: address } }));
    } catch {
      setStatus('failed');
    }
  }

  if (status === 'sent' || status === 'already') {
    const [before, after = ''] = words.sent.split('{email}');
    return (
      <p role="status" className="border border-line bg-ground/70 px-4 py-3.5 text-[15px]">
        <span aria-hidden="true" className="mr-2.5 inline-block size-[7px] rounded-full bg-pip align-[1px]" />
        {status === 'already' ? (
          words.already
        ) : (
          <>
            {before}
            <strong className="font-semibold">{email.trim()}</strong>
            {after}
          </>
        )}
      </p>
    );
  }

  const error = status === 'invalid' ? words.invalid : status === 'failed' ? words.failed : '';
  return (
    <form onSubmit={submit} action={endpoint || undefined} method="post" noValidate className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
          <label htmlFor={id} className="label text-dim">
            {words.email}
          </label>
          <input
            id={id}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={words.emailHint}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (status !== 'sending') setStatus('idle');
            }}
            aria-invalid={status === 'invalid'}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`h-[50px] min-w-0 rounded-none border bg-ground/70 px-3.5 text-base text-ink placeholder:text-faint ${status === 'invalid' ? 'border-pip' : 'border-edge'}`}
          />
        </div>
        <input type="hidden" name="page" value={page} />
        <input type="hidden" name="lang" value={lang} />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-[50px] cursor-pointer rounded-none bg-ink px-6 text-sm font-semibold whitespace-nowrap text-ground hover:bg-pip disabled:cursor-default disabled:opacity-55"
        >
          {status === 'sending' ? words.joining : status === 'failed' ? words.again : words.join}
        </button>
      </div>
      <p id={`${id}-error`} role="alert" className={error ? 'text-[13.5px] text-ink' : 'hidden'}>
        <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-pip align-[2px]" />
        {error}
      </p>
      {children ? (
        <p className="text-[13.5px] text-dim">{children}</p>
      ) : (
        note && <p className="text-[13.5px] text-dim">{words.note}</p>
      )}
    </form>
  );
}
