import type { FormWords } from '@/components/forms/EmailForm';
import { useT } from '@/i18n';

/** The waitlist form's words in a language. The form is an island, so a page hands them to it. */
export function formWords(lang: string): FormWords {
  const t = useT(lang);
  return {
    email: t('form.email'),
    emailHint: t('form.emailHint'),
    join: t('form.join'),
    joining: t('form.joining'),
    note: t('form.note'),
    invalid: t('form.invalid'),
    joined: t('form.joined'),
    sent: t('form.sent'),
    already: t('form.already'),
    failed: t('form.failed'),
    again: t('form.again'),
  };
}

/** A script from the firmware's docs (rt_core, docs/scripting.md). Code, not copy: it reads the same in every language. */
export const LUA_EXAMPLE = `function post_process_sensor_value(sensor_id, value)
    if value == nil then
        return nil
    end

    local rpm = get_sensor_value("engine_rpm")
    if rpm == nil then
        return -1 -- the other sensor has no value yet
    end

    return math.min(value, 100.0) * rpm
end`;
