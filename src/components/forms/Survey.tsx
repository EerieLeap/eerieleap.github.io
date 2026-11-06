import { useEffect, useId, useState, type SubmitEvent } from 'react';
import { JOINED } from './EmailForm';

/** The questions asked once an address has joined. Their words come from the Waitlist page's content. */
export type SurveyWords = {
  title: string;
  lead: string;
  fields: { id: string; question: string; label: string; hint: string }[];
  choices: { id: string; question: string; options: string[] }[];
  /** The ids of the questions, fields and choices alike, in the order they are asked. */
  order: string[];
  send: string;
  sent: string;
  failed: string;
};

const LETTERS = 'abcdefghij';

/**
 * A section of the Waitlist page that is not there until an address has joined. None of its questions is required.
 * The answers go to the relay with the address, as README.md describes.
 */
export function Survey({ words, endpoint }: { words: SurveyWords; endpoint: string }) {
  const id = useId();
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'open' | 'sending' | 'sent' | 'failed'>('open');

  useEffect(() => {
    const joined = (event: Event) => setEmail((event as CustomEvent<{ email: string }>).detail.email);
    window.addEventListener(JOINED, joined);
    return () => window.removeEventListener(JOINED, joined);
  }, []);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const answers: Record<string, string | string[]> = {};
    for (const field of words.fields) answers[field.id] = String(form.get(field.id) ?? '').trim();
    for (const choice of words.choices) answers[choice.id] = form.getAll(choice.id).map(String);
    setState('sending');
    try {
      if (!endpoint) {
        if (!import.meta.env.DEV) throw new Error('no list service');
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        const response = await fetch(`${endpoint.replace(/\/$/, '')}/answers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, answers }),
        });
        if (!response.ok) throw new Error(String(response.status));
      }
      setState('sent');
    } catch {
      setState('failed');
    }
  }

  if (!email) return null;
  return (
    <section id="questions" className="border-t border-soft">
      <div className="wrap pt-[84px] pb-[92px]">
        <div className="mb-3.5 flex items-baseline gap-[18px]">
          <p aria-hidden="true" className="label section-number text-dim" />
          <h2 className="h-section">{words.title}</h2>
        </div>
        <p className="mb-[38px] max-w-[660px] text-[17px] text-dim">{words.lead}</p>
        {state === 'sent' ? (
          <p role="status" className="max-w-[860px] border border-line px-4 py-3.5 text-[15px]">
            <span aria-hidden="true" className="mr-2.5 inline-block size-[7px] rounded-full bg-pip align-[1px]" />
            {words.sent}
          </p>
        ) : (
          <form onSubmit={submit} className="max-w-[860px]">
            {words.order.map((name, index) => {
              const field = words.fields.find((one) => one.id === name);
              const choice = words.choices.find((one) => one.id === name);
              const question = field?.question ?? choice?.question ?? '';
              return (
                <fieldset key={name} className="flex flex-col gap-3 border-t border-line py-[22px]">
                  <legend className="float-left flex items-baseline gap-3.5 text-lg font-semibold tracking-[-0.02em]">
                    <span aria-hidden="true" className="label font-normal text-faint">
                      {LETTERS[index]}
                    </span>
                    {question}
                  </legend>
                  <div className="flex w-full flex-wrap gap-2 pl-7">
                    {field && (
                      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-1.5">
                        <label htmlFor={`${id}-${name}`} className="label text-dim">
                          {field.label}
                        </label>
                        <input
                          id={`${id}-${name}`}
                          name={name}
                          type="text"
                          placeholder={field.hint}
                          className="h-[50px] min-w-0 rounded-none border border-edge bg-ground/70 px-3.5 text-base text-ink placeholder:text-faint"
                        />
                      </div>
                    )}
                    {choice?.options.map((option) => (
                      <label
                        key={option}
                        className="inline-flex cursor-pointer items-center gap-[9px] border border-line px-[13px] py-2.5 text-sm has-checked:border-ink"
                      >
                        <input
                          type="checkbox"
                          name={name}
                          value={option}
                          className="size-3 appearance-none border border-edge checked:bg-ink"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-[22px] pl-7">
              <button
                type="submit"
                disabled={state === 'sending'}
                className="h-[50px] cursor-pointer rounded-none bg-ink px-6 text-sm font-semibold whitespace-nowrap text-ground hover:bg-pip disabled:cursor-default disabled:opacity-55"
              >
                {words.send}
              </button>
              {state === 'failed' && (
                <p role="alert" className="text-[13.5px]">
                  <span aria-hidden="true" className="mr-2 inline-block size-1.5 rounded-full bg-pip align-[2px]" />
                  {words.failed}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
